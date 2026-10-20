import AVFoundation
import CoreMotion
import UIKit
import Vision

/// Camera sau → Vision body pose → StrokeTracker, mọi khung xử lý trên một hàng đợi riêng.
/// Máy đứng dọc trên chân máy, bên hông phía tay cơ, cao ngang khuỷu.
final class PoseCoach: NSObject, ObservableObject, AVCaptureVideoDataOutputSampleBufferDelegate {
  let session = AVCaptureSession()
  let voice = PoseVoice()
  /// Các callback dưới đây bắn trên main. Trạng thái tối đa 5 lần một giây.
  var onStatus: (([String: Any]) -> Void)?
  var onStroke: (([String: Any]) -> Void)?
  /// Mỗi khung: khung, cỡ buffer, cẳng tay đang trong dung sai.
  var onFrame: ((PoseFrame, CGSize, Bool) -> Void)?
  /// Session vừa chạy, preview mới có connection để xoay dọc.
  var onSessionStart: (() -> Void)?

  private let queue = DispatchQueue(label: "pose-coach.camera")
  private let motion = CMMotionManager()
  private var running = false

  // Chỉ đụng trên `queue`.
  private let tracker = StrokeTracker()
  private let request = VNDetectHumanBodyPoseRequest()
  private var side = PoseSide.right
  private var wanted = false
  private var lastState = ""
  private var lastDegree: Int?
  private var lastStatusTime = -Double.infinity

  func start() {
    guard !running else { return }
    running = true
    UIApplication.shared.isIdleTimerDisabled = true
    voice.activate()
    if motion.isDeviceMotionAvailable {
      motion.deviceMotionUpdateInterval = 1.0 / 30
      motion.startDeviceMotionUpdates()
    }
    queue.async { self.wanted = true }
    switch AVCaptureDevice.authorizationStatus(for: .video) {
    case .authorized:
      queue.async { self.run() }
    case .notDetermined:
      AVCaptureDevice.requestAccess(for: .video) { granted in
        if granted { self.queue.async { self.run() } } else { self.emit("denied") }
      }
    default:
      emit("denied")
    }
  }

  func stop() {
    guard running else { return }
    running = false
    UIApplication.shared.isIdleTimerDisabled = false
    voice.deactivate()
    motion.stopDeviceMotionUpdates()
    queue.async {
      self.wanted = false
      self.session.stopRunning()
      // Gỡ output để bỏ tham chiếu delegate, không giữ session của lần mở màn trước.
      self.session.beginConfiguration()
      self.session.inputs.forEach(self.session.removeInput)
      self.session.outputs.forEach(self.session.removeOutput)
      self.session.commitConfiguration()
      self.tracker.reset()
      self.lastState = ""
    }
  }

  func setSide(_ s: PoseSide) {
    queue.async {
      guard s != self.side else { return }
      self.side = s
      self.tracker.reset()
    }
  }

  /// `portrait` cho preview đứng dọc như màn hình. Còn lại giữ hướng gốc cảm biến (home bên phải),
  /// PoseOrientation tự xoay cho Vision theo trọng lực.
  static func rotate(_ c: AVCaptureConnection, portrait: Bool) {
    if #available(iOS 17.0, *) {
      let angle: CGFloat = portrait ? 90 : 0
      if c.isVideoRotationAngleSupported(angle) { c.videoRotationAngle = angle }
    } else if c.isVideoOrientationSupported {
      c.videoOrientation = portrait ? .portrait : .landscapeRight
    }
  }

  private func run() {
    guard wanted, !session.isRunning else { return }
    if session.inputs.isEmpty {
      guard
        let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back),
        let input = try? AVCaptureDeviceInput(device: device)
      else { return emit("unavailable") }
      let output = AVCaptureVideoDataOutput()
      output.alwaysDiscardsLateVideoFrames = true
      output.videoSettings = [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange]
      output.setSampleBufferDelegate(self, queue: queue)
      session.beginConfiguration()
      if session.canSetSessionPreset(.hd1280x720) { session.sessionPreset = .hd1280x720 }
      guard session.canAddInput(input), session.canAddOutput(output) else {
        session.commitConfiguration()
        return emit("unavailable")
      }
      session.addInput(input)
      session.addOutput(output)
      if let c = output.connection(with: .video) { Self.rotate(c, portrait: false) }
      session.commitConfiguration()
    }
    session.startRunning()
    DispatchQueue.main.async { self.onSessionStart?() }
  }

  func captureOutput(_ output: AVCaptureOutput, didOutput sb: CMSampleBuffer, from connection: AVCaptureConnection) {
    guard wanted, let pb = CMSampleBufferGetImageBuffer(sb) else { return }
    let t = CMSampleBufferGetPresentationTimeStamp(sb).seconds
    let g = motion.deviceMotion?.gravity
    // Không có CoreMotion thì coi như máy đứng dọc: hướng xuống là +x của buffer gốc.
    let down = g.map { PoseOrientation.down(gx: $0.x, gy: $0.y) } ?? CGVector(dx: 1, dy: 0)
    // Ngả trước sau: trọng lực lọt vào trục z của máy.
    let tilt = g.map { asin(min(1, abs($0.z))) * 180 / .pi } ?? 0
    let size = CGSize(width: CVPixelBufferGetWidth(pb), height: CVPixelBufferGetHeight(pb))
    let o = PoseOrientation.vision(for: down)
    try? VNImageRequestHandler(cvPixelBuffer: pb, orientation: o).perform([request])
    let frame = PoseFrame(
      observations: request.results ?? [], side: side, orientation: o, size: size,
      down: down, t: t, minConfidence: tracker.limits.minConfidence)

    let tilted = tilt > tracker.limits.maxTilt
    var events: [StrokeEvent] = []
    if tilted { tracker.reset() } else { events = tracker.push(frame) }
    let forearm = tracker.liveForearm
    let ok = forearm.map { abs($0) <= tracker.limits.forearm } ?? false

    let state: String
    if tilted {
      state = "tilted"
    } else if !frame.hasArm {
      state = "searching"
    } else {
      switch tracker.phase {
      case .searching, .settling: state = "ready"
      case .address: state = "address"
      case .backswing, .forward, .follow: state = "stroke"
      }
    }
    status(state, tilt: tilt, forearm: forearm, t: t)

    DispatchQueue.main.async {
      self.onFrame?(frame, size, ok)
      for e in events {
        switch e {
        case let .address(forearm, ok):
          self.voice.address(ok: ok, forearm: forearm)
        case let .stroke(r):
          self.voice.stroke(r.fault)
          self.onStroke?(Self.body(r))
        }
      }
    }
  }

  private func status(_ state: String, tilt: Double, forearm: Double?, t: Double) {
    let degree = forearm.map { Int($0.rounded()) }
    guard t - lastStatusTime >= 0.2, state != lastState || degree != lastDegree else { return }
    lastState = state
    lastDegree = degree
    lastStatusTime = t
    var body: [String: Any] = ["state": state, "tilt": tilt.rounded()]
    if let forearm { body["forearm"] = Self.round(forearm, 1) }
    DispatchQueue.main.async { self.onStatus?(body) }
  }

  private func emit(_ state: String) {
    DispatchQueue.main.async { self.onStatus?(["state": state, "tilt": 0]) }
  }

  private static func body(_ r: StrokeReport) -> [String: Any] {
    var b: [String: Any] = [
      "forearmAddress": round(r.forearmAddress, 1),
      "forearmContact": round(r.forearmContact, 1),
      "elbowDrift": round(r.elbowDrift, 1),
      "backPause": round(r.backPause, 2),
      "fault": r.fault.rawValue,
    ]
    if let h = r.headLift { b["headLift"] = round(h, 1) }
    if let k = r.backKnee { b["backKnee"] = k.rounded() }
    return b
  }

  private static func round(_ v: Double, _ digits: Int) -> Double {
    let k = pow(10, Double(digits))
    return (v * k).rounded() / k
  }
}
