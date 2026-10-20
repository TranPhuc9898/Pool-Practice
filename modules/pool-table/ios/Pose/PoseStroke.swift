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
}

enum StrokeFault: String {
  case good, forearmForward, forearmBack, elbow, head, pause
}

struct StrokeReport {
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
