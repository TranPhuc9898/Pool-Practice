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
  /// Trọng lực 3 trục theo trục buffer, xem `PoseOrientation.gravity`. Cùng `lens` cho dây dọi tại từng điểm.
  var gravity = SIMD3<Double>(0, -1, 0)
  /// Tiêu cự và tâm ảnh của khung này. Không có thì dây dọi lấy `down` cho cả khung.
  var lens: PoseLens?
  /// Độ tin cậy vai, khuỷu, cổ tay của người được chọn, kể cả dưới ngưỡng, để log biết vì sao không thấy tay.
  var armConfidence: [Float] = []
  /// Ảnh trôi bao nhiêu so với khung đầu vì máy rung, pixel ảnh đứng gốc trên trái. Chỉ phân tích clip đo cái này.
  var shift = CGVector.zero
  /// Đủ khớp hai bên người, chỉ để vẽ skeleton lên preview. Đo cú chỉ dùng các trường theo `side` ở trên.
  var joints: [PoseJoint: CGPoint] = [:]
  /// Tay đo của khung này, để lớp vẽ biết tay nào trong `joints` là tay cơ.
  var side = PoseSide.right

  var hasArm: Bool { shoulder != nil && elbow != nil && wrist != nil }

  /// Góc khuỷu → cổ tay so với dây dọi qua khuỷu, độ. Không cần vai: máy đặt trước mặt hay sau lưng trên đường cơ thì
  /// vai hay khuất, mà cẳng tay nghiêng ngang vẫn đọc được từ hai khớp này.
  var forearmLean: Double? {
    guard let e = elbow, let w = wrist else { return nil }
    let v = CGVector(dx: w.x - e.x, dy: w.y - e.y)
    guard hypot(v.dx, v.dy) > 4 else { return nil }
    let d = plumb(at: e)
    return atan2(Double(d.dx * v.dy - d.dy * v.dx), Double(d.dx * v.dx + d.dy * v.dy)) * 180 / .pi
  }

  /// Dây dọi qua điểm `p` của ảnh. Máy ngả thì các đường thẳng đứng chụm về một điểm trên hoặc dưới khung, nên phương
  /// dọc đổi theo vị trí và chỉ trùng `down` ở tâm ảnh: ảnh của phương trọng lực tại p hướng theo f·(gx, gy) − (p − c)·gz.
  func plumb(at p: CGPoint) -> CGVector {
    guard let lens else { return down }
    let dx = lens.f * gravity.x - (Double(p.x) - lens.cx) * gravity.z
    let dy = lens.f * gravity.y - (Double(p.y) - lens.cy) * gravity.z
    let n = hypot(dx, dy)
    return n < 1e-6 ? down : CGVector(dx: dx / n, dy: dy / n)
  }
}

/// Khớp vẽ lên preview. Trái/phải là của người trong hình, như Vision. Không có mặt và bàn tay.
enum PoseJoint: CaseIterable {
  case leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist
  case leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle

  var vision: VNHumanBodyPoseObservation.JointName {
    switch self {
    case .leftShoulder: return .leftShoulder
    case .rightShoulder: return .rightShoulder
    case .leftElbow: return .leftElbow
    case .rightElbow: return .rightElbow
    case .leftWrist: return .leftWrist
    case .rightWrist: return .rightWrist
    case .leftHip: return .leftHip
    case .rightHip: return .rightHip
    case .leftKnee: return .leftKnee
    case .rightKnee: return .rightKnee
    case .leftAnkle: return .leftAnkle
    case .rightAnkle: return .rightAnkle
    }
  }
}

/// Tiêu cự và tâm ảnh, pixel của buffer gốc, gốc dưới trái như `PoseFrame`.
struct PoseLens {
  var f: Double
  var cx: Double
  var cy: Double
}

enum PoseOrientation {
  /// Trọng lực của CoreMotion (x phải, y lên khi cầm dọc) → hướng xuống trong buffer gốc cảm biến (connection 0°, không lật).
  /// `upright` là góc xoay buffer gốc theo chiều kim đồng hồ để ra ảnh dọc, lấy từ RotationCoordinator: mỗi camera lắp
  /// cảm biến một hướng (camera trước iPhone 17 Pro Max khác hẳn camera sau) nên không đặt cứng được.
  /// Trong ảnh dọc camera sau thấy như người cầm máy, camera trước nhìn ngược lại nên phải ảnh là trái người cầm.
  /// Máy gần nằm phẳng thì coi như đứng dọc, lúc đó độ ngả đã vượt ngưỡng nên không đo. Mới kiểm trên máy đứng dọc.
  static func down(gx: Double, gy: Double, front: Bool, upright: Double) -> CGVector {
    let flat = hypot(gx, gy) < 0.2
    let g = gravity(gx: flat ? 0 : gx, gy: flat ? -1 : gy, gz: 0, front: front, upright: upright)
    let n = hypot(g.x, g.y)
    return CGVector(dx: g.x / n, dy: g.y / n)
  }

  /// Trọng lực theo trục buffer gốc, chưa chuẩn hoá: x, y như `down`, z dọc trục nhìn, dương là phía trước ống kính.
  /// Camera trước nhìn theo +z của CoreMotion (ra khỏi màn hình), camera sau theo −z.
  static func gravity(gx: Double, gy: Double, gz: Double, front: Bool, upright: Double) -> SIMD3<Double> {
    let x = front ? -gx : gx
    // Quay ngược `upright` từ ảnh dọc về buffer gốc. Trục y hướng lên nên ngược kim đồng hồ là góc dương.
    let a = upright * .pi / 180
    return SIMD3(x * cos(a) - gy * sin(a), x * sin(a) + gy * cos(a), front ? gz : -gz)
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

/// Giữ người đang theo qua các khung. Người chơi cúi xuống bàn thì khung bao co lại, có khung người đứng phía sau
/// to hơn: chọn theo khung to nhất mỗi khung thì đường cẳng tay nhảy sang người đó.
struct PoseLock {
  typealias J = VNHumanBodyPoseObservation.JointName
  /// Mất người đang khoá quá ngần này giây mới chọn lại theo khung to nhất.
  var hold: Double = 2
  /// Tâm người khung sau lệch khỏi tâm khoá quá ngần này (toạ độ Vision 0…1) thì coi là người khác.
  var radius: CGFloat = 0.2
  private(set) var center: CGPoint?
  private var seen = -Double.infinity

  /// Khung đo cỡ người chứ không đo khớp nên lấy cả khớp mờ: người gần mà lấp ló mép khung chỉ có vài khớp rõ.
  private static func box(_ pts: [J: VNRecognizedPoint]) -> CGRect? {
    let seen = pts.values.filter { $0.confidence >= 0.1 }.map(\.location)
    guard let x0 = seen.map(\.x).min(), let x1 = seen.map(\.x).max(),
          let y0 = seen.map(\.y).min(), let y1 = seen.map(\.y).max() else { return nil }
    return CGRect(x: x0, y: y0, width: x1 - x0, height: y1 - y0)
  }

  /// Người gần tâm khoá nhất nếu còn trong `radius`. Khoá đã hết hạn thì người có khung to nhất, vì người chơi đứng
  /// gần máy nhất. Chọn theo tay rõ nhất thì người phía sau lộ hết tay sẽ thắng.
  mutating func pick(_ all: [[J: VNRecognizedPoint]], t: Double) -> [J: VNRecognizedPoint]? {
    let boxes = all.compactMap { pts in Self.box(pts).map { (pts, $0) } }
    let chosen: ([J: VNRecognizedPoint], CGRect)?
    if let c = center, t - seen <= hold {
      func dist(_ r: CGRect) -> CGFloat { hypot(r.midX - c.x, r.midY - c.y) }
      chosen = boxes.filter { dist($0.1) <= radius }.min { dist($0.1) < dist($1.1) }
    } else {
      chosen = boxes.max { $0.1.width * $0.1.height < $1.1.width * $1.1.height }
    }
    guard let (pts, r) = chosen else { return nil }
    center = CGPoint(x: r.midX, y: r.midY)
    seen = t
    return pts
  }
}

extension PoseFrame {
  /// Lấy người `lock` đang theo trong `observations`, đổi điểm về pixel của buffer gốc cỡ `size`.
  init(
    observations: [VNHumanBodyPoseObservation],
    lock: inout PoseLock,
    side: PoseSide,
    orientation: CGImagePropertyOrientation,
    size: CGSize,
    down: CGVector,
    t: Double,
    minConfidence: Float
  ) {
    self.init(t: t, down: down)
    self.side = side
    typealias J = VNHumanBodyPoseObservation.JointName
    let arm: [J] = side == .right ? [.rightShoulder, .rightElbow, .rightWrist] : [.leftShoulder, .leftElbow, .leftWrist]
    let leg: [J] = side == .right ? [.rightHip, .rightKnee, .rightAnkle] : [.leftHip, .leftKnee, .leftAnkle]

    let all = observations.compactMap { try? $0.recognizedPoints(.all) }
    guard let pts = lock.pick(all, t: t) else { return }

    func point(_ j: J) -> CGPoint? {
      guard let p = pts[j], p.confidence >= minConfidence else { return nil }
      let r = PoseOrientation.unrotate(p.location, orientation)
      return CGPoint(x: r.x * size.width, y: r.y * size.height)
    }
    armConfidence = arm.map { pts[$0]?.confidence ?? 0 }
    shoulder = point(arm[0])
    elbow = point(arm[1])
    wrist = point(arm[2])
    nose = point(.nose)
    hip = point(leg[0])
    knee = point(leg[1])
    ankle = point(leg[2])
    for j in PoseJoint.allCases { joints[j] = point(j.vision) }
  }
}
