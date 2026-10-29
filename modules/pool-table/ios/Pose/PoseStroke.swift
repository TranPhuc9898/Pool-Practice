import CoreGraphics
import Foundation

/// Ngưỡng tạm, chưa hiệu chuẩn trên clip thật. Nguồn kỹ thuật không cho số cứng: Nolan (EBSA) chỉ nói cẳng tay dọc
/// lúc address, Dr. Dave nói vai và khuỷu yên tới lúc chạm. Mọi khoảng cách đo theo chiều dài cẳng tay `L` trong ảnh.
struct PoseLimits {
  var minConfidence: Float = 0.4
  /// Máy ngả trước/sau quá mức này thì phương dọc trong ảnh không còn đều, không đo. Độ.
  var maxTilt: Double = 12
  /// Cẳng tay lệch khỏi phương dọc lúc chạm. Độ.
  var forearm: Double = 10
  /// Bắp tay đổi góc từ address tới lúc chạm. Độ.
  var elbow: Double = 6
  /// Đầu nhấc từ address tới 0,5 s sau chạm. cm.
  var head: Double = 3
  /// Dừng sau ngắn hơn mức này thì nhắc. Giây.
  var pause: Double = 0.2
  /// Address: cổ tay đứng yên trong `stillRadius · L` suốt `stillTime` giây.
  var stillTime: Double = 0.4
  var stillRadius: Double = 0.08
  /// Cổ tay lùi quá `backswing · L` sau address thì coi là bắt đầu cú, còn dưới mức đó là feathering.
  var backswing: Double = 0.25
  /// Cổ tay vượt address `followThrough · L` thì cú đã đi qua bi.
  var followThrough: Double = 0.3
  /// Đường cẳng tay trên overlay vẫn tô màu tới mức ngả này, riêng với `maxTilt` của phần bắt cú. Khung có `lens` thì
  /// góc đo theo dây dọi tại khuỷu nên phối cảnh không làm lệch. Khung không có `lens` thì sát mép khung ở 20° trở lên
  /// lệch tới cỡ 8° (tính hình học, chưa đo). Gần nằm phẳng thì dây dọi suy biến nên vẫn chặn. Mới kiểm khi máy đứng
  /// dọc, ngả lớn chỉ dựa vào hình học. Độ.
  var maxLineTilt: Double = 60

  /// Màu đường cẳng tay: true xanh, false đỏ, nil khi không chấm vì thiếu khớp hoặc máy ngả quá `maxLineTilt`.
  func lineOk(_ f: PoseFrame, tilt: Double) -> Bool? {
    guard tilt <= maxLineTilt, let lean = f.forearmLean else { return nil }
    return abs(lean) <= forearm
  }
}

/// Màu đường cẳng tay qua nhiều khung. Khớp Vision rung vài độ mỗi khung nên chấm từng khung thì màu nhảy xanh ↔ đỏ
/// quanh ngưỡng, và một khung mất khuỷu là đường trắng: lấy trung vị một khoảng ngắn, đã xanh thì phải lệch quá `exit`
/// mới đỏ, mất khớp ngắn hơn `hold` thì giữ màu cũ.
struct PoseLineColor {
  /// Giây lấy trung vị độ ngả cẳng tay.
  var window: Double = 0.3
  /// Mất khuỷu hoặc cổ tay quá ngần này giây mới thôi tô màu.
  var hold: Double = 0.5
  /// Đang xanh thì lệch quá mức này mới đổi đỏ. Độ, lớn hơn `PoseLimits.forearm`.
  var exit: Double = 13
  private var leans: [(t: Double, lean: Double)] = []
  private var ok: Bool?
  private var seen = -Double.infinity

  mutating func push(_ f: PoseFrame, tilt: Double, limits: PoseLimits) -> Bool? {
    guard tilt <= limits.maxLineTilt else {
      leans.removeAll()
      ok = nil
      return nil
    }
    guard let lean = f.forearmLean else {
      if f.t - seen > hold {
        leans.removeAll()
        ok = nil
      }
      return ok
    }
    seen = f.t
    leans.removeAll { $0.t < f.t - window }
    leans.append((f.t, lean))
    let m = abs(median(leans.map(\.lean)))
    ok = m <= (ok == true ? exit : limits.forearm)
    return ok
  }
}

/// Đếm "set": khoảnh khắc đầu cơ dừng sát bi, cẳng tay buông dọc và cổ tay đứng yên, trước khi lùi cơ đánh. Lúc nhấp
/// cơ tay không dừng nên không đếm. Không cần vai hay tư thế cúi như `StrokeTracker`, chỉ cần khuỷu và cổ tay, nên đứng
/// thẳng buông tay cũng được tính.
struct SetCounter {
  /// Cổ tay đứng yên ngần này giây thì tính một set. SPFF đếm 2–3 s, lấy thấp hơn để khỏi chờ.
  var hold: Double = 0.5
  private(set) var count = 0
  private var recent: [(t: Double, p: CGPoint, lean: Double, length: Double)] = []
  /// Sau mỗi set phải đi xa chỗ đó quá `backswing · L` (vung đánh hoặc nhấp) mới đếm set tiếp.
  private var anchor: (p: CGPoint, length: Double)?

  mutating func reset() {
    count = 0
    recent = []
    anchor = nil
  }

  /// True đúng khung vừa đếm thêm một set.
  mutating func push(_ f: PoseFrame, limits: PoseLimits) -> Bool {
    guard let el = f.elbow, let wr = f.wrist, let lean = f.forearmLean else { return false }
    let length = Double(hypot(wr.x - el.x, wr.y - el.y))
    if let a = anchor, distance(wr, a.p) > limits.backswing * a.length { anchor = nil }
    recent.append((f.t, wr, lean, length))
    recent.removeAll { f.t - $0.t > hold + 0.2 }
    guard anchor == nil, let first = recent.first, f.t - first.t >= hold else { return false }
    let window = recent.filter { f.t - $0.t <= hold }
    let n = Double(window.count)
    let c = CGPoint(x: window.reduce(0) { $0 + $1.p.x } / n, y: window.reduce(0) { $0 + $1.p.y } / n)
    let l = window.reduce(0) { $0 + $1.length } / n
    guard
      window.allSatisfy({ distance($0.p, c) <= limits.stillRadius * l }),
      abs(median(window.map(\.lean))) <= limits.forearm
    else { return false }
    count += 1
    anchor = (c, l)
    return true
  }

  private func distance(_ a: CGPoint, _ b: CGPoint) -> Double { Double(hypot(a.x - b.x, a.y - b.y)) }
}

enum StrokeFault: String {
  case good, forearmForward, forearmBack, elbow, head, pause
}

struct StrokeReport {
  /// Giây theo đồng hồ của khung lúc chạm, để tìm lại đúng khung đó trong clip.
  var contact: Double
  /// Góc cẳng tay so với phương dọc, dương là cổ tay ra trước khuỷu (về phía đầu).
  var forearmAddress: Double
  var forearmContact: Double
  /// Bắp tay đổi góc từ address tới lúc chạm, trị tuyệt đối.
  var elbowDrift: Double
  /// cm, quy từ cẳng tay 26 cm. Nil khi Vision không thấy mũi.
  var headLift: Double?
  var backPause: Double
  /// Góc gối chân sau lúc address, 180 là thẳng. Nil khi bàn che chân.
  var backKnee: Double?
  var fault: StrokeFault
}

enum StrokePhase: String {
  case searching, settling, address, backswing, forward, follow
}

enum StrokeEvent {
  /// Vào address lần đầu sau khi đứng yên. `ok` khi cẳng tay trong dung sai.
  case address(forearm: Double, ok: Bool)
  case stroke(StrokeReport)
}

/// Máy trạng thái một cú từ góc nhìn bên hông: address → backswing → forward → follow.
/// Lúc chạm lấy là lúc cổ tay quay về đúng vị trí address, vì cơ chạm bi ở chỗ đầu cơ nằm lúc ngắm.
final class StrokeTracker {
  /// Cẳng tay người lớn trung bình, chỉ để đổi pixel ra cm cho số đầu nhấc.
  static let forearmCm = 26.0

  var limits = PoseLimits()
  private(set) var phase: StrokePhase = .searching
  /// Góc cẳng tay của khung mới nhất có đủ tay.
  private(set) var liveForearm: Double?

  private struct Sample {
    var t: Double
    /// Toạ độ cổ tay theo hướng ra trước, pixel.
    var pos: Double
    var forearm: Double
    var upper: Double
    var nose: CGPoint?
    var knee: Double?
    var length: Double
  }

  private struct Address {
    var end: Double
    var pos: Double
    var forearm: Double
    var upper: Double
    var nose: CGPoint?
    var knee: Double?
    var length: Double
    var down: CGVector
  }

  private var recent: [Sample] = []
  private var stroke: [Sample] = []
  private var address: Address?
  private var forward: CGVector?
  private var down = CGVector(dx: 0, dy: -1)
  private var lastArm = -Double.infinity
  /// Sau một cú, người chơi thường giữ nguyên tư thế ở follow-through. Phải đứng dậy (hoặc mất tay) rồi mới nhận
  /// address mới, kẻo chỗ dừng sau cú bị coi là address.
  private var awaitingRise = false

  func reset() {
    phase = .searching
    recent = []
    stroke = []
    address = nil
    forward = nil
    liveForearm = nil
  }

  func push(_ f: PoseFrame) -> [StrokeEvent] {
    guard let sh = f.shoulder, let el = f.elbow, let wr = f.wrist else {
      // Mất tay quá nửa giây (đứng dậy, ra khỏi khung) thì bỏ cú đang dở.
      if f.t - lastArm > 0.5 {
        if phase != .searching { reset() }
        awaitingRise = false
      }
      liveForearm = nil
      return []
    }
    lastArm = f.t
    let length = hypot(wr.x - el.x, wr.y - el.y)
    guard length > 4 else { return [] }

    // Hướng ra trước và hướng xuống giữ cố định từ lúc có address, để toạ độ cổ tay không nhảy theo nhiễu.
    if address == nil {
      down = f.down
      forward = perpendicular(f.down, toward: sh, nose: f.nose)
    }
    let fwd = forward ?? perpendicular(f.down, toward: sh, nose: nil)
    let s = Sample(
      t: f.t,
      pos: dot(wr, fwd),
      forearm: angle(of: CGVector(dx: wr.x - el.x, dy: wr.y - el.y), fwd: fwd),
      upper: angle(of: CGVector(dx: el.x - sh.x, dy: el.y - sh.y), fwd: fwd),
      nose: f.nose,
      knee: kneeAngle(f),
      length: length
    )
    liveForearm = s.forearm
    recent.append(s)
    recent.removeAll { s.t - $0.t > 2 }
    if phase == .searching { phase = .settling }

    // Đứng thẳng thì bắp tay buông dưới vai cỡ một cẳng tay; cúi vào bàn thì khuỷu ngang hoặc cao hơn vai.
    let downOnShot = Double((el.x - sh.x) * down.dx + (el.y - sh.y) * down.dy) < 0.5 * length
    if !downOnShot { awaitingRise = false }

    var events: [StrokeEvent] = []
    switch phase {
    case .searching, .settling:
      if downOnShot, !awaitingRise, let a = stillAddress() {
        address = a
        phase = .address
        events.append(.address(forearm: a.forearm, ok: abs(a.forearm) <= limits.forearm))
      }
    case .address:
      guard let a = address else { reset(); break }
      if !downOnShot {
        phase = .settling
        address = nil
      } else if let b = stillAddress() {
        address = b
      } else if s.pos < a.pos - limits.backswing * a.length {
        phase = .backswing
        stroke = recent.filter { $0.t > a.end }
      }
    case .backswing, .forward:
      guard let a = address else { reset(); break }
      stroke.append(s)
      let low = stroke.map(\.pos).min() ?? s.pos
      if phase == .backswing {
        // Dừng sau lâu bao nhiêu cũng vẫn là backswing, không phải address mới.
        if s.pos > low + 0.12 * a.length { phase = .forward }
      } else if s.pos >= a.pos + limits.followThrough * a.length {
        phase = .follow
      } else if let peak = forwardPeak(), s.pos < peak - 0.12 * a.length {
        // Lùi lại giữa chừng: feather dài hoặc kéo lại, tính lại từ đây.
        phase = .backswing
        stroke = [s]
      } else if let b = stillAddress(), abs(b.pos - a.pos) < limits.backswing * a.length {
        // Dừng ở bi mà chưa đi qua: feather, không phải cú.
        address = b
        phase = .address
        stroke = []
      }
      if phase != .address, f.t - a.end > 4 { reset() }
    case .follow:
      stroke.append(s)
      if let a = address, let c = contactTime(a), f.t >= c + 0.6 {
        events.append(.stroke(report(a, contact: c)))
        phase = .settling
        address = nil
        stroke = []
        recent = []
        awaitingRise = true
      }
    }
    return events
  }

  // MARK: - Đo

  private func stillAddress() -> Address? {
    guard let last = recent.last, let first = recent.first, last.t - first.t >= limits.stillTime else { return nil }
    let window = recent.filter { last.t - $0.t <= limits.stillTime }
    let n = Double(window.count)
    let pos = window.reduce(0) { $0 + $1.pos } / n
    let length = window.reduce(0) { $0 + $1.length } / n
    guard window.allSatisfy({ abs($0.pos - pos) <= limits.stillRadius * length }) else { return nil }
    let knees = window.compactMap(\.knee)
    return Address(
      end: last.t,
      pos: pos,
      forearm: median(window.map(\.forearm)),
      upper: median(window.map(\.upper)),
      nose: window.last(where: { $0.nose != nil })?.nose,
      knee: knees.isEmpty ? nil : median(knees),
      length: length,
      down: down
    )
  }

  private func forwardPeak() -> Double? {
    guard let low = stroke.indices.min(by: { stroke[$0].pos < stroke[$1].pos }) else { return nil }
    return stroke[low...].map(\.pos).max()
  }

  /// Lúc cổ tay quay về vị trí address trên đường lên, nội suy giữa hai khung.
  private func contactTime(_ a: Address) -> Double? {
    guard let low = stroke.indices.min(by: { stroke[$0].pos < stroke[$1].pos }) else { return nil }
    for i in stroke.indices where i > low && stroke[i].pos >= a.pos {
      let p = stroke[i - 1], q = stroke[i]
      let k = q.pos == p.pos ? 1 : (a.pos - p.pos) / (q.pos - p.pos)
      return p.t + (q.t - p.t) * max(0, min(1, k))
    }
    return nil
  }

  private func report(_ a: Address, contact c: Double) -> StrokeReport {
    let at = stroke.min { abs($0.t - c) < abs($1.t - c) } ?? stroke[stroke.count - 1]
    let drift = abs(wrap(at.upper - a.upper))

    var lift: Double?
    if let n0 = a.nose {
      let d = a.down
      let rises = stroke.filter { $0.t <= c + 0.5 }.compactMap(\.nose).map {
        -Double(($0.x - n0.x) * d.dx + ($0.y - n0.y) * d.dy)
      }
      lift = max(0, rises.max() ?? 0) / a.length * Self.forearmCm
    }

    // Dừng sau: chuỗi khung liền nhau quanh điểm lùi xa nhất mà cổ tay còn trong 5% L của nó. Đo theo vị trí,
    // không theo vận tốc, vì nhiễu Vision từng khung đã cỡ 2% L.
    var pause = 0.0
    if let low = stroke.indices.min(by: { stroke[$0].pos < stroke[$1].pos }) {
      let edge = stroke[low].pos + 0.05 * a.length
      var i = low, j = low
      while i > 0, stroke[i - 1].pos <= edge { i -= 1 }
      while j < stroke.count - 1, stroke[j + 1].pos <= edge { j += 1 }
      pause = stroke[j].t - stroke[i].t
    }

    let fault: StrokeFault
    if abs(at.forearm) > limits.forearm {
      fault = at.forearm > 0 ? .forearmForward : .forearmBack
    } else if drift > limits.elbow {
      fault = .elbow
    } else if let lift, lift > limits.head {
      fault = .head
    } else if pause < limits.pause {
      fault = .pause
    } else {
      fault = .good
    }
    return StrokeReport(
      contact: c,
      forearmAddress: a.forearm,
      forearmContact: at.forearm,
      elbowDrift: drift,
      headLift: lift,
      backPause: pause,
      backKnee: a.knee,
      fault: fault
    )
  }

  // MARK: - Hình học

  /// Vuông góc với `down`, quay về phía mũi so với vai. Không thấy mũi thì giữ hướng cũ.
  private func perpendicular(_ down: CGVector, toward sh: CGPoint, nose: CGPoint?) -> CGVector {
    let p = CGVector(dx: -down.dy, dy: down.dx)
    if let nose {
      return (nose.x - sh.x) * p.dx + (nose.y - sh.y) * p.dy >= 0 ? p : CGVector(dx: -p.dx, dy: -p.dy)
    }
    if let f = forward, f.dx * p.dx + f.dy * p.dy < 0 { return CGVector(dx: -p.dx, dy: -p.dy) }
    return p
  }

  private func dot(_ p: CGPoint, _ v: CGVector) -> Double { Double(p.x * v.dx + p.y * v.dy) }

  /// Góc của `v` so với phương dọc xuống, dương khi nghiêng về phía trước. Độ.
  private func angle(of v: CGVector, fwd: CGVector) -> Double {
    atan2(Double(v.dx * fwd.dx + v.dy * fwd.dy), Double(v.dx * down.dx + v.dy * down.dy)) * 180 / .pi
  }

  private func kneeAngle(_ f: PoseFrame) -> Double? {
    guard let h = f.hip, let k = f.knee, let a = f.ankle else { return nil }
    let u = CGVector(dx: h.x - k.x, dy: h.y - k.y), w = CGVector(dx: a.x - k.x, dy: a.y - k.y)
    let n = hypot(u.dx, u.dy) * hypot(w.dx, w.dy)
    guard n > 0 else { return nil }
    return acos(max(-1, min(1, Double((u.dx * w.dx + u.dy * w.dy) / n)))) * 180 / .pi
  }

  private func wrap(_ d: Double) -> Double {
    var d = d.truncatingRemainder(dividingBy: 360)
    if d > 180 { d -= 360 }
    if d < -180 { d += 360 }
    return d
  }

  private func median(_ xs: [Double]) -> Double {
    let s = xs.sorted()
    return s.isEmpty ? 0 : s[s.count / 2]
  }
}
