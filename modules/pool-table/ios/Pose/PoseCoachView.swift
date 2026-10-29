import AVFoundation
import ExpoModulesCore
import SwiftUI
import UIKit

final class PoseCoachViewProps: ExpoSwiftUI.ViewProps {
  /// Tay cầm cơ, "right" hoặc "left". Máy đặt bên hông phía tay này.
  @Field var hand: String = "right"
  /// "front" hoặc "back".
  @Field var camera: String = "front"
  /// "vi", "en", "beep", "off".
  @Field var voice: String = "vi"
  /// { state, tilt, forearm? }, chỉ khi đổi, tối đa 5 lần một giây.
  var onStatus = EventDispatcher()
  /// Mỗi cú xong: số đo và lỗi đầu tiên theo thứ tự cẳng tay → khuỷu → đầu → dừng sau.
  var onStroke = EventDispatcher()
  /// Mỗi lần cẳng tay dọc và cổ tay đứng yên nửa giây: { count }.
  var onSet = EventDispatcher()
}

/// Soi tư thế từ bên hông: preview camera trước hoặc sau, vẽ tay cơ và dây dọi qua khuỷu, báo bằng tiếng sau mỗi cú.
struct PoseCoachView: ExpoSwiftUI.View, ExpoSwiftUI.WithHostingView {
  @ObservedObject var props: PoseCoachViewProps
  @StateObject private var coach = PoseCoach()

  var body: some View {
    PoseCameraPreview(coach: coach)
      .onAppear {
        coach.onStatus = { [props] in props.onStatus($0) }
        coach.onStroke = { [props] in props.onStroke($0) }
        coach.onSet = { [props] in props.onSet($0) }
        adopt()
        coach.start()
      }
      .onDisappear { coach.stop() }
      .onChange(of: props.hand) { _ in adopt() }
      .onChange(of: props.camera) { _ in adopt() }
      .onChange(of: props.voice) { _ in adopt() }
  }

  private func adopt() {
    coach.setSide(PoseSide(rawValue: props.hand) ?? .right)
    coach.setCamera(props.camera == "back" ? .back : .front)
    coach.voice.mode = PoseVoice.Mode(rawValue: props.voice) ?? .vi
  }
}

private struct PoseCameraPreview: UIViewRepresentable {
  let coach: PoseCoach

  func makeUIView(context: Context) -> PoseCameraUIView {
    let v = PoseCameraUIView(coach: coach)
    coach.onFrame = { [weak v] f, size, ok in v?.draw(f, size: size, ok: ok) }
    coach.onSessionStart = { [weak v] in v?.lockPortrait($0) }
    return v
  }

  func updateUIView(_ v: PoseCameraUIView, context: Context) {}
}

/// Preview camera, cộng lớp vẽ như demo web đã duyệt: tay cơ gold đậm, khuỷu chấm xanh, thân và chân trắng mờ,
/// không vẽ mặt, không vẽ tay kia. Dây dọi đứt nét từ khuỷu tay cơ đổi màu theo dung sai cẳng tay để người chơi tự so.
private final class PoseCameraUIView: UIView {
  override class var layerClass: AnyClass { AVCaptureVideoPreviewLayer.self }
  private var preview: AVCaptureVideoPreviewLayer { layer as! AVCaptureVideoPreviewLayer }
  private let arm = CAShapeLayer()
  private let plumb = CAShapeLayer()
  private let dots = CAShapeLayer()
  private let elbowDot = CAShapeLayer()
  private static let gold = UIColor(red: 0.914, green: 0.725, blue: 0.286, alpha: 1).cgColor
  private var smooth: [PoseJoint: JointSmoother] = [:]
  private var gate = BoneGate()
  private weak var coach: PoseCoach?
  private var device: AVCaptureDevice?
  /// Góc preview đang xoay, cùng góc coach dùng cho buffer. Chưa có thì chưa vẽ.
  private var upright: CGFloat?

  init(coach: PoseCoach) {
    self.coach = coach
    super.init(frame: .zero)
    backgroundColor = .black
    preview.session = coach.session
    // Hiện trọn khung Vision thấy, để người chơi biết cả người đã lọt khung chưa.
    preview.videoGravity = .resizeAspect
    for l in [plumb, arm] {
      l.fillColor = nil
      l.lineCap = .round
      l.lineJoin = .round
    }
    arm.lineWidth = 7
    arm.strokeColor = Self.gold
    plumb.lineWidth = 2
    plumb.lineDashPattern = [6, 6]
    dots.fillColor = Self.gold
    elbowDot.fillColor = UIColor(red: 0.235, green: 0.812, blue: 0.478, alpha: 1).cgColor
    [plumb, arm, dots, elbowDot].forEach(layer.addSublayer)
  }

  required init?(coder: NSCoder) { nil }

  override func layoutSubviews() {
    super.layoutSubviews()
    for l in [plumb, arm, dots, elbowDot] { l.frame = bounds }
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    align()
  }

  func lockPortrait(_ d: AVCaptureDevice) {
    device = d
    upright = nil
    align()
  }

  /// Góc dọc hỏi RotationCoordinator chứ không đặt cứng 90°: camera trước iPhone 17 Pro Max xoay 90° ra hình nằm ngang.
  /// Coordinator trả 0° khi layer chưa vào cửa sổ nên chờ có window.
  private func align() {
    guard window != nil, let d = device, let c = preview.connection else { return }
    var angle: CGFloat = 90
    if #available(iOS 17.0, *) {
      let r = AVCaptureDevice.RotationCoordinator(device: d, previewLayer: preview)
      angle = r.videoRotationAngleForHorizonLevelPreview
      if c.isVideoRotationAngleSupported(angle) { c.videoRotationAngle = angle }
      NSLog("[pose] preview %@, capture %d", PoseCoach.describe(c), Int(r.videoRotationAngleForHorizonLevelCapture))
    } else if c.isVideoOrientationSupported {
      c.videoOrientation = .portrait
    }
    upright = angle
    coach?.setUpright(Double(angle))
  }

  func draw(_ f: PoseFrame, size: CGSize, ok: Bool?) {
    guard let upright, let c = preview.connection else { return }
    let quarter = Int((upright / 90).rounded()) & 3
    let shown = quarter % 2 == 1 ? CGSize(width: size.height, height: size.width) : size
    let rect = AVMakeRect(aspectRatio: shown, insideRect: bounds)
    let mirrored = c.isVideoMirrored
    // Điểm buffer gốc (gốc dưới trái) → xoay `upright` theo chiều kim đồng hồ như preview → lật nếu preview lật →
    // toạ độ layer (gốc trên trái) trong khung resizeAspect.
    func map(_ p: CGPoint) -> CGPoint {
      let x = p.x / size.width, y = p.y / size.height
      let r: CGPoint
      switch quarter {
      case 1: r = CGPoint(x: y, y: 1 - x)
      case 2: r = CGPoint(x: 1 - x, y: 1 - y)
      case 3: r = CGPoint(x: 1 - y, y: x)
      default: r = CGPoint(x: x, y: y)
      }
      return CGPoint(x: rect.minX + (mirrored ? 1 - r.x : r.x) * rect.width, y: rect.minY + (1 - r.y) * rect.height)
    }
    // Lọc rung trên toạ độ buffer, chỉ cho nét vẽ. Số đo vẫn lấy điểm thô trong `f`.
    let cue: [PoseJoint] = f.side == .right ? [.rightShoulder, .rightElbow, .rightWrist] : [.leftShoulder, .leftElbow, .leftWrist]
    // Khung tay cơ bị chặn thì giữ nét tay cơ ở vị trí lọc cũ, không đẩy điểm nhảy vào bộ lọc.
    let fresh = gate.accept(cue.map { f.joints[$0] }, t: f.t)
    var j: [PoseJoint: CGPoint] = [:]
    for (k, p) in f.joints where fresh || !cue.contains(k) { j[k] = smooth[k, default: JointSmoother()].push(p, t: f.t) }
    if !fresh { for k in cue { j[k] = smooth[k]?.last } }
    let (e, w) = (j[cue[1]], j[cue[2]])

    CATransaction.begin()
    CATransaction.setDisableActions(true)
    let armPath = CGMutablePath()
    if let p = polyline(cue.map { j[$0].map(map) }) { armPath.addPath(p) }
    arm.path = armPath.isEmpty ? nil : armPath
    let dotPath = CGMutablePath(), elbowPath = CGMutablePath()
    func circle(_ p: CGPoint, _ r: CGFloat) -> CGRect { CGRect(x: p.x - r, y: p.y - r, width: 2 * r, height: 2 * r) }
    for k in [cue[0], cue[2]] { if let p = j[k].map(map) { dotPath.addEllipse(in: circle(p, 6)) } }
    if let el = e { elbowPath.addEllipse(in: circle(map(el), 8)) }
    dots.path = dotPath
    elbowDot.path = elbowPath
    // Xanh: cẳng tay trong dung sai so với dây dọi. Đỏ: nghiêng quá. Trắng: không chấm.
    plumb.strokeColor = (ok.map { $0 ? UIColor.systemGreen : UIColor.systemRed } ?? UIColor.white.withAlphaComponent(0.8)).cgColor
    if let e, let w {
      let l = hypot(w.x - e.x, w.y - e.y) * 1.3
      let d = f.plumb(at: e)
      plumb.path = polyline([map(e), map(CGPoint(x: e.x + d.dx * l, y: e.y + d.dy * l))])
    } else {
      plumb.path = nil
    }
    CATransaction.commit()
  }

  /// Góc vai–khuỷu–cổ tay trên ảnh, độ. Chỉ để hiện, không đo.
  /// Chỉ nối hai điểm liền nhau cùng thấy được, khớp mất thì để hở.
  private func polyline(_ points: [CGPoint?]) -> CGPath? {
    let path = UIBezierPath()
    for (p, q) in zip(points, points.dropFirst()) {
      guard let p, let q else { continue }
      path.move(to: p)
      path.addLine(to: q)
    }
    return path.isEmpty ? nil : path.cgPath
  }
}

/// One Euro cho một khớp: đứng yên lọc mạnh cho hết rung, vung nhanh thì nới ra để nét không trễ sau tay.
/// Tham số lấy theo demo web đã duyệt, toạ độ pixel buffer 640×480. Mất khớp quá `gap` giây thì bắt đầu lại.
private struct JointSmoother {
  var minCutoff = 1.2, beta = 0.02, dCutoff = 1.0, gap = 0.3
  private var x: CGPoint?
  private var dx = CGVector.zero
  private var t = 0.0
  var last: CGPoint? { x }

  private static func alpha(_ cutoff: Double, _ dt: Double) -> CGFloat {
    let r = 2 * .pi * cutoff * dt
    return CGFloat(r / (r + 1))
  }

  mutating func push(_ p: CGPoint, t now: Double) -> CGPoint {
    guard let last = x, now - t <= gap, now > t else {
      x = p; dx = .zero; t = now
      return p
    }
    let dt = now - t
    t = now
    let v = CGVector(dx: (p.x - last.x) / dt, dy: (p.y - last.y) / dt)
    let ad = Self.alpha(dCutoff, dt)
    dx = CGVector(dx: dx.dx + ad * (v.dx - dx.dx), dy: dx.dy + ad * (v.dy - dx.dy))
    let a = Self.alpha(minCutoff + beta * Double(hypot(dx.dx, dx.dy)), dt)
    let next = CGPoint(x: last.x + a * (p.x - last.x), y: last.y + a * (p.y - last.y))
    x = next
    return next
  }
}

/// Chặn khung tay cơ có xương vai–khuỷu hoặc khuỷu–cổ tay dài lệch quá `tolerance` so với trung vị `window` giây gần nhất.
/// Tay chĩa vào ống kính thì khuỷu bị che, MediaPipe đoán và điểm nhảy cả trăm pixel giữa hai khung liền nhau.
/// Chặn liền quá `hold` giây thì coi như người đã đổi tư thế thật: bỏ lịch sử, nhận khung mới.
private struct BoneGate {
  var window = 1.0, tolerance: CGFloat = 0.35, hold = 0.3, minSamples = 5
  private var history: [(t: Double, upper: CGFloat, fore: CGFloat)] = []
  private var blockedSince: Double?

  /// `arm` là vai, khuỷu, cổ tay. Thiếu khớp nào thì không có xương để so, cho qua.
  mutating func accept(_ arm: [CGPoint?], t: Double) -> Bool {
    guard arm.count == 3, let s = arm[0], let e = arm[1], let w = arm[2] else { return true }
    let upper = hypot(e.x - s.x, e.y - s.y), fore = hypot(w.x - e.x, w.y - e.y)
    history.removeAll { t - $0.t > window }
    if history.count >= minSamples {
      let mu = Self.median(history.map(\.upper)), mf = Self.median(history.map(\.fore))
      if abs(upper - mu) > tolerance * mu || abs(fore - mf) > tolerance * mf {
        let since = blockedSince ?? t
        blockedSince = since
        if t - since <= hold { return false }
        history.removeAll()
      }
    }
    blockedSince = nil
    history.append((t, upper, fore))
    return true
  }

  private static func median(_ v: [CGFloat]) -> CGFloat {
    let s = v.sorted()
    return s.count % 2 == 1 ? s[s.count / 2] : (s[s.count / 2 - 1] + s[s.count / 2]) / 2
  }
}
