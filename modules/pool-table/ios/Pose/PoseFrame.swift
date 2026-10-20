import CoreGraphics
import Foundation
import ImageIO
import Vision

/// Tay cầm cơ. Máy đặt bên hông phía tay này nên các khớp của nó gần camera nhất.
enum PoseSide: String {
  case right, left
}

/// Một khung, toạ độ pixel của buffer gốc, gốc dưới trái, y hướng lên như Vision.
/// Khớp dưới ngưỡng tin cậy để nil: không đoán khi Vision không thấy rõ.
struct PoseFrame {
  var t: Double
  var shoulder: CGPoint?
  var elbow: CGPoint?
  var wrist: CGPoint?
  var nose: CGPoint?
  var hip: CGPoint?
  var knee: CGPoint?
  var ankle: CGPoint?
  /// Hướng trọng lực trong ảnh, đơn vị.
  var down: CGVector

  var hasArm: Bool { shoulder != nil && elbow != nil && wrist != nil }
}

enum PoseOrientation {
  /// Trọng lực của CoreMotion (x phải, y lên khi cầm dọc) → hướng xuống trong buffer gốc của camera sau.
  /// Buffer gốc theo cảm biến, đúng chiều khi máy nằm ngang nút home bên phải: đỉnh ảnh là +x của máy, phải ảnh là −y.
  /// Máy gần nằm phẳng thì coi như đứng dọc, hướng xuống là +x. Lúc đó độ ngả đã vượt ngưỡng nên không đo.
  static func down(gx: Double, gy: Double) -> CGVector {
    let v = CGVector(dx: -gy, dy: gx)
    let n = hypot(v.dx, v.dy)
    return n < 0.2 ? CGVector(dx: 1, dy: 0) : CGVector(dx: v.dx / n, dy: v.dy / n)
  }

  /// Hướng đưa cho Vision để người đứng thẳng trong ảnh. Vision kém hẳn khi người nằm ngang hay lộn ngược.
  static func vision(for down: CGVector) -> CGImagePropertyOrientation {
    if abs(down.dy) >= abs(down.dx) { return down.dy < 0 ? .up : .down }
    return down.dx > 0 ? .right : .left
  }

  /// Điểm chuẩn hoá trong ảnh đã xoay theo `o` → điểm chuẩn hoá trong buffer gốc. Cả hai gốc dưới trái.
  static func unrotate(_ p: CGPoint, _ o: CGImagePropertyOrientation) -> CGPoint {
    switch o {
    case .right: return CGPoint(x: 1 - p.y, y: p.x)
    case .left: return CGPoint(x: p.y, y: 1 - p.x)
    case .down: return CGPoint(x: 1 - p.x, y: 1 - p.y)
    default: return p
    }
  }
}

extension PoseFrame {
  /// Lấy người có tay cơ rõ nhất trong `observations`, đổi điểm về pixel của buffer gốc cỡ `size`.
  init(
    observations: [VNHumanBodyPoseObservation],
    side: PoseSide,
    orientation: CGImagePropertyOrientation,
    size: CGSize,
    down: CGVector,
    t: Double,
    minConfidence: Float
  ) {
    self.init(t: t, down: down)
    typealias J = VNHumanBodyPoseObservation.JointName
    let arm: [J] = side == .right ? [.rightShoulder, .rightElbow, .rightWrist] : [.leftShoulder, .leftElbow, .leftWrist]
    let leg: [J] = side == .right ? [.rightHip, .rightKnee, .rightAnkle] : [.leftHip, .leftKnee, .leftAnkle]

    let all = observations.compactMap { try? $0.recognizedPoints(.all) }
    guard let pts = all.max(by: { a, b in
      arm.reduce(0) { $0 + (a[$1]?.confidence ?? 0) } < arm.reduce(0) { $0 + (b[$1]?.confidence ?? 0) }
    }) else { return }

    func point(_ j: J) -> CGPoint? {
      guard let p = pts[j], p.confidence >= minConfidence else { return nil }
      let r = PoseOrientation.unrotate(p.location, orientation)
      return CGPoint(x: r.x * size.width, y: r.y * size.height)
    }
    shoulder = point(arm[0])
    elbow = point(arm[1])
    wrist = point(arm[2])
    nose = point(.nose)
    hip = point(leg[0])
    knee = point(leg[1])
    ankle = point(leg[2])
  }
}
