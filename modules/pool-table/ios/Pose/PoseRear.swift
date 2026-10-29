import CoreGraphics
import Foundation

/// Pha cú nhìn từ sau lưng. `unknown` là không đủ bằng chứng: chưa thấy address, hoặc mất tay giữa cú.
/// `follow` bắt đầu khi cổ tay vượt vị trí address về phía trước, không phải lúc chạm bi: góc này không thấy chạm.
enum RearPhase: String, CaseIterable {
  case unknown, address, practice, backswing, pause, forward, follow, complete
}

/// Tín hiệu bắt pha. Từ sau lưng, lùi cơ kéo cổ tay về phía máy: `wristY` là cổ tay dịch dọc trên ảnh, `length` là
/// cẳng tay dài ra hoặc ngắn lại. Cái nào dùng được thì chờ số biên độ / rung của clip thật (phase 1 của plan).
enum RearSignal: String {
  case wristY, length
}

/// Ngưỡng theo rung đo lúc address của chính clip (bội số σ) hoặc theo cẳng tay `L`, không theo pixel cứng. Mọi số là
/// đoán ban đầu, chưa hiệu chuẩn trên clip thật.
struct RearLimits {
  var signal: RearSignal = .wristY
  /// +1 khi tín hiệu tăng lúc lùi cơ. Với `wristY` (gốc trên trái), +1 là cổ tay đi xuống trên ảnh. Đoán.
  var backSign: Double = 1
  /// Address: tín hiệu dao động dưới `stillRadius · L` suốt `stillTime` giây.
  var stillTime = 0.4
  var stillRadius = 0.08
  /// σ không nhỏ hơn mức này, để clip quá êm không làm ngưỡng về 0. Bội số L.
  var noiseFloor = 0.005
  /// Ngưỡng cao và thấp, có trễ như `up_angle`/`down_angle` của Good-GYM. Bội số σ.
  var high = 6.0
  var low = 3.0
  /// Điều kiện phải giữ ít nhất chừng này giây mới đổi pha. Chặn một khung nhiễu.
  var dwell = 0.05
  /// Đứng gần đỉnh backswing chừng này thì gọi là `pause`.
  var pauseMin = 0.1
  /// Dừng ở cuối backswing lâu hơn thì không còn là một cú: người chơi đã đổi tư thế, bắt address lại.
  var maxPause = 1.5
  /// Ở phía trước address chừng này thì cú xong. Quay lại sớm hơn là feather.
  var followHold = 0.5
  /// Mất tay lâu hơn thì cú đang dở thành `unknown`, không đếm.
  var maxGap = 0.5
  /// Hai cú cách nhau ít nhất chừng này, như `min_rep_time`.
  var minRepTime = 1.5
}

/// Một khung đưa vào tracker: pixel ảnh đứng gốc trên trái, đã trừ rung máy.
struct RearSample {
  var t: Double
  var wrist: CGPoint?
  var elbow: CGPoint?
  /// Tích độ tin cậy khuỷu và cổ tay của Vision, 0…1.
  var confidence: Double

  init(t: Double, wrist: CGPoint?, elbow: CGPoint?, confidence: Double) {
    self.t = t
    self.wrist = wrist
    self.elbow = elbow
    self.confidence = confidence
  }

  init(_ f: PoseFrame, _ info: ClipInfo) {
    func fix(_ p: CGPoint) -> CGPoint {
      let u = info.upright(p)
      return CGPoint(x: u.x - f.shift.dx, y: u.y - f.shift.dy)
    }
    let c = f.armConfidence.count == 3 ? Double(f.armConfidence[1] * f.armConfidence[2]) : 0
    self.init(t: f.t, wrist: f.wrist.map(fix), elbow: f.elbow.map(fix), confidence: c)
  }
}

/// Máy trạng thái pha cú từ sau lưng. Mỗi `push` ghi pha của khung đó vào `phases`; một cú feather hay cú mất tay được
/// gán lại pha cho cả đoạn khi biết ra, nên pha của khung cũ có thể đổi.
final class RearTracker {
  var limits = RearLimits()
  private(set) var phases: [RearPhase] = []
  /// Độ tin cậy từng khung: Vision khuỷu × cổ tay, nhân tỉ lệ khung thấy tay trong 15 khung gần nhất.
  private(set) var confidence: [Double] = []
  private(set) var strokes = 0

  private var state: RearPhase = .unknown
  private var wristF = PointFilter()
  private var elbowF = PointFilter()
  private var window: [(i: Int, t: Double, s: Double)] = []
  private var seen: [Bool] = []
  private var lastL: Double?
  private var lastSeen = -Double.infinity
  private var base = 0.0
  private var sigma = 1.0
  private var cycle: Int?
  private var peak = 0.0
  private var peakMark = 0.0
  private var peakAt = (i: 0, t: 0.0)
  private var extreme = 0.0
  private var holdSince: (i: Int, t: Double)?
  private var followAt = 0.0
  private var completeAt = -Double.infinity
  private var moved = true

  init(limits: RearLimits = RearLimits()) { self.limits = limits }

  /// Trả true khi một cú vừa xong.
  @discardableResult
  func push(_ x: RearSample) -> Bool {
    let i = phases.count
    phases.append(state)
    let w = wristF.push(x.wrist), e = elbowF.push(x.elbow)
    seen.append(w != nil)
    if seen.count > 15 { seen.removeFirst() }
    let ratio = Double(seen.filter { $0 }.count) / Double(seen.count)
    confidence.append(w == nil ? 0 : x.confidence * ratio)
    if let w, let e { lastL = hypot(Double(w.x - e.x), Double(w.y - e.y)) }

    guard let w, let L = lastL, L > 4, let s = signal(w, e) else {
      if x.t - lastSeen > limits.maxGap, state != .unknown, state != .complete { abandon(upTo: i) }
      return false
    }
    lastSeen = x.t
    window.append((i, x.t, s))
    while let f = window.first, x.t - f.t > limits.stillTime { window.removeFirst() }
    let still = window.count >= 3 && x.t - window[0].t >= limits.stillTime * 0.9
      && (window.map(\.s).max()! - window.map(\.s).min()!) < limits.stillRadius * L
    let d = limits.backSign * (s - base)
    var done = false

    switch state {
    case .unknown, .complete:
      if state == .complete, !still { moved = true }
      if still, state == .unknown || (moved && x.t - completeAt >= limits.minRepTime) { settle(L) }
    case .address, .practice:
      // Bắt backswing trước khi xét đứng yên: cổ tay mới lùi chưa ra khỏi `stillRadius` mà settle lại thì mốc trôi theo.
      if held(d > limits.high * sigma, i, x.t), let h = holdSince {
        cycle = h.i
        peak = d
        peakMark = d
        peakAt = (i, x.t)
        relabel(h.i...i, .backswing)
        state = .backswing
        holdSince = nil
      } else if still, abs(d) < limits.low * sigma {
        // Chỉ đo lại mốc khi cổ tay còn sát mốc cũ, để đoạn đầu của một lần lùi không làm σ phình lên.
        settle(L)
      }
    case .backswing, .pause:
      // Đỉnh nhích lên dưới `low · σ` so với lúc bắt đầu dừng là rung: giữ đỉnh mới nhưng không tính lại giờ dừng.
      if d > peak {
        peak = d
        if d > peakMark + limits.low * sigma {
          peakMark = d
          peakAt = (i, x.t)
          state = .backswing
        }
      } else if d < peak - limits.low * sigma {
        extreme = d
        state = .forward
      } else if x.t - peakAt.t > limits.maxPause {
        abandon(upTo: i)
        if still { settle(L) }
        return false
      } else if state == .backswing, x.t - peakAt.t >= limits.pauseMin {
        relabel(peakAt.i...i, .pause)
        state = .pause
      }
    case .forward:
      extreme = min(extreme, d)
      // Đứng yên quanh mốc giữa lúc đẩy là feather dừng lại. Cửa sổ còn dính pause ở đỉnh thì không tính.
      if still, abs(d) < limits.high * sigma {
        feather(upTo: i)
        settle(L)
      } else if held(d < -limits.high * sigma, i, x.t), let h = holdSince {
        relabel(h.i...i, .follow)
        followAt = x.t
        state = .follow
        holdSince = nil
      } else if extreme > -limits.high * sigma, d > extreme + limits.low * sigma {
        feather(upTo: i)
      }
    case .follow:
      if d > -limits.low * sigma {
        feather(upTo: i)
      } else if x.t - followAt >= limits.followHold {
        strokes += 1
        cycle = nil
        completeAt = x.t
        moved = false
        state = .complete
        done = true
      }
    }
    phases[i] = state
    return done
  }

  private func signal(_ w: CGPoint, _ e: CGPoint?) -> Double? {
    switch limits.signal {
    case .wristY: return Double(w.y)
    case .length: return e.map { hypot(Double(w.x - $0.x), Double(w.y - $0.y)) }
    }
  }

  /// Cửa sổ đứng yên thành address mới: mốc và rung đo lại ở đây.
  private func settle(_ L: Double) {
    let v = window.map(\.s)
    base = v.reduce(0, +) / Double(v.count)
    let sd = (v.reduce(0) { $0 + ($1 - base) * ($1 - base) } / Double(v.count)).squareRoot()
    sigma = max(sd, limits.noiseFloor * L)
    if state == .unknown || state == .complete { relabel(window[0].i...window[window.count - 1].i, .address) }
    state = .address
    holdSince = nil
  }

  private func held(_ cond: Bool, _ i: Int, _ t: Double) -> Bool {
    guard cond else { holdSince = nil; return false }
    if holdSince == nil { holdSince = (i, t) }
    return t - holdSince!.t >= limits.dwell
  }

  private func feather(upTo i: Int) {
    if let c = cycle { relabel(c...i, .practice) }
    cycle = nil
    holdSince = nil
    state = .address
  }

  private func abandon(upTo i: Int) {
    if let c = cycle { relabel(c...i, .unknown) }
    phases[i] = .unknown
    cycle = nil
    holdSince = nil
    window = []
    state = .unknown
  }

  private func relabel(_ r: ClosedRange<Int>, _ p: RearPhase) {
    for j in r where j < phases.count { phases[j] = p }
  }
}

/// Một cú tìm lại từ dãy pha, tự bắt hay đã sửa tay: backswing → (pause) → forward → follow liền nhau.
struct RearStroke: Equatable {
  /// Khung address cuối trước backswing, nếu có.
  var address: Int?
  var start: Int
  /// Khung cuối của backswing hoặc pause.
  var back: Int
  var follow: Int
  var end: Int
  /// Giây ở `pause`; nil khi không thấy pha này.
  var pause: Double?
}

func rearStrokes(_ phases: [RearPhase], times: [Double]) -> [RearStroke] {
  var runs: [(p: RearPhase, a: Int, b: Int)] = []
  for (i, p) in phases.enumerated() {
    if let last = runs.last, last.p == p { runs[runs.count - 1].b = i } else { runs.append((p, i, i)) }
  }
  var out: [RearStroke] = []
  var k = 0
  while k < runs.count {
    guard runs[k].p == .backswing else { k += 1; continue }
    var j = k + 1
    var pause: Double?
    if j < runs.count, runs[j].p == .pause {
      pause = times[runs[j].b] - times[runs[j].a]
      j += 1
    }
    guard j + 1 < runs.count, runs[j].p == .forward, runs[j + 1].p == .follow else { k += 1; continue }
    let addr = k > 0 && runs[k - 1].p == .address ? runs[k - 1].b : nil
    out.append(RearStroke(
      address: addr, start: runs[k].a, back: runs[j - 1].b, follow: runs[j + 1].a, end: runs[j + 1].b, pause: pause))
    k = j + 2
  }
  return out
}
