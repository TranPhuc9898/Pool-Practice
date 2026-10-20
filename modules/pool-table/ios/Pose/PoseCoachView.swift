import AVFoundation
import ExpoModulesCore
import SwiftUI
import UIKit

final class PoseCoachViewProps: ExpoSwiftUI.ViewProps {
  /// Tay cầm cơ, "right" hoặc "left". Máy đặt bên hông phía tay này.
  @Field var hand: String = "right"
  /// "vi", "en", "beep", "off".
  @Field var voice: String = "vi"
  /// { state, tilt, forearm? }, chỉ khi đổi, tối đa 5 lần một giây.
  var onStatus = EventDispatcher()
  /// Mỗi cú xong: số đo và lỗi đầu tiên theo thứ tự cẳng tay → khuỷu → đầu → dừng sau.
  var onStroke = EventDispatcher()
}

/// Soi tư thế từ bên hông: preview camera sau, vẽ tay cơ và dây dọi qua khuỷu, báo bằng tiếng sau mỗi cú.
struct PoseCoachView: ExpoSwiftUI.View, ExpoSwiftUI.WithHostingView {
  @ObservedObject var props: PoseCoachViewProps
  @StateObject private var coach = PoseCoach()

  var body: some View {
    PoseCameraPreview(coach: coach)
      .onAppear {
        coach.onStatus = { [props] in props.onStatus($0) }
        coach.onStroke = { [props] in props.onStroke($0) }
        adopt()
        coach.start()
      }
      .onDisappear { coach.stop() }
      .onChange(of: props.hand) { _ in adopt() }
      .onChange(of: props.voice) { _ in adopt() }
  }

  private func adopt() {
    coach.setSide(PoseSide(rawValue: props.hand) ?? .right)
    coach.voice.mode = PoseVoice.Mode(rawValue: props.voice) ?? .vi
  }
}

private struct PoseCameraPreview: UIViewRepresentable {
  let coach: PoseCoach

  func makeUIView(context: Context) -> PoseCameraUIView {
    let v = PoseCameraUIView(session: coach.session)
    coach.onFrame = { [weak v] f, size, ok in v?.draw(f, size: size, ok: ok) }
    coach.onSessionStart = { [weak v] in v?.lockPortrait() }
    return v
  }

  func updateUIView(_ v: PoseCameraUIView, context: Context) {}
}

/// Preview camera, cộng lớp vẽ: tay cơ gold khi cẳng tay trong dung sai, trắng khi lệch; chân mảnh; mũi;
/// dây dọi đứt nét từ khuỷu theo trọng lực để người chơi tự so cẳng tay.
private final class PoseCameraUIView: UIView {
  override class var layerClass: AnyClass { AVCaptureVideoPreviewLayer.self }
  private var preview: AVCaptureVideoPreviewLayer { layer as! AVCaptureVideoPreviewLayer }
  private let arm = CAShapeLayer()
  private let leg = CAShapeLayer()
  private let plumb = CAShapeLayer()
  private let nose = CAShapeLayer()

  init(session: AVCaptureSession) {
    super.init(frame: .zero)
    backgroundColor = .black
    preview.session = session
    // Hiện trọn khung Vision thấy, để người chơi biết cả người đã lọt khung chưa.
    preview.videoGravity = .resizeAspect
    for l in [leg, plumb, arm] {
      l.fillColor = nil
      l.lineCap = .round
      l.lineJoin = .round
    }
    arm.lineWidth = 5
    leg.lineWidth = 2
    leg.strokeColor = UIColor.white.withAlphaComponent(0.5).cgColor
    plumb.lineWidth = 1.5
    plumb.lineDashPattern = [6, 6]
    plumb.strokeColor = UIColor.white.withAlphaComponent(0.8).cgColor
    nose.fillColor = UIColor.white.cgColor
    [leg, plumb, arm, nose].forEach(layer.addSublayer)
  }

  required init?(coder: NSCoder) { nil }

  override func layoutSubviews() {
    super.layoutSubviews()
    for l in [leg, plumb, arm, nose] { l.frame = bounds }
  }

  func lockPortrait() {
    if let c = preview.connection { PoseCoach.rotate(c, portrait: true) }
  }

  func draw(_ f: PoseFrame, size: CGSize, ok: Bool) {
    // Điểm buffer gốc (gốc dưới trái) → capture device point (gốc trên trái) → toạ độ layer, đã tính xoay và aspect fill.
    func map(_ p: CGPoint) -> CGPoint {
      preview.layerPointConverted(fromCaptureDevicePoint: CGPoint(x: p.x / size.width, y: 1 - p.y / size.height))
    }
    CATransaction.begin()
    CATransaction.setDisableActions(true)
    arm.path = polyline([f.shoulder, f.elbow, f.wrist].map { $0.map(map) })
    arm.strokeColor = (ok ? UIColor(PoolAimPalette.gold) : UIColor.white).cgColor
    leg.path = polyline([f.hip, f.knee, f.ankle].map { $0.map(map) })
    if let e = f.elbow, let w = f.wrist {
      let l = hypot(w.x - e.x, w.y - e.y) * 1.3
      plumb.path = polyline([map(e), map(CGPoint(x: e.x + f.down.dx * l, y: e.y + f.down.dy * l))])
    } else {
      plumb.path = nil
    }
    nose.path = f.nose.map { p in
      let c = map(p)
      return UIBezierPath(ovalIn: CGRect(x: c.x - 5, y: c.y - 5, width: 10, height: 10)).cgPath
    }
    CATransaction.commit()
  }

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
