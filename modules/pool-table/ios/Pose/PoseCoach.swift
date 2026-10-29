import AVFoundation
import CoreMotion
import simd
import UIKit

/// Camera trước hoặc sau → MediaPipe PoseLandmarker → StrokeTracker, mọi khung xử lý trên một hàng đợi riêng.
/// Máy đứng dọc trên chân máy, bên hông phía tay cơ, cao ngang khuỷu.
final class PoseCoach: NSObject, ObservableObject, AVCaptureVideoDataOutputSampleBufferDelegate {
  let session = AVCaptureSession()
  let voice = PoseVoice()
  /// Các callback dưới đây bắn trên main. Trạng thái tối đa 5 lần một giây.
  var onStatus: (([String: Any]) -> Void)?
  var onStroke: (([String: Any]) -> Void)?
  /// Mỗi lần đếm thêm một set tay thẳng: { count }.
  var onSet: (([String: Any]) -> Void)?
  /// Mỗi khung: khung, cỡ buffer, cẳng tay đang trong dung sai.
  var onFrame: ((PoseFrame, CGSize, Bool?) -> Void)?
  /// Session vừa chạy với camera này, preview mới có connection để xoay dọc.
  var onSessionStart: ((AVCaptureDevice) -> Void)?

  private let queue = DispatchQueue(label: "pose-coach.camera")
  private let motion = CMMotionManager()
  private var running = false

  // Chỉ đụng trên `queue`.
  private let tracker = StrokeTracker()
  private var sets = SetCounter()
  private lazy var landmarks = PoseLandmarks()
  /// ms mỗi lần detect trong giây đồng hồ đang log.
  private var detectMs: [Double] = []
  private var lineColor = PoseLineColor()
  private var side = PoseSide.right
  private var position = AVCaptureDevice.Position.front
  /// Góc dựng dọc của camera đang lắp. Chưa có thì bỏ khung, không đoán hướng.
  private var upright: Double?
  private var loggedFrame = false
  private var wanted = false
  private var lastState = ""
  private var lastDegree: Int?
  private var lastTilt: Int?
  private var lastStatusTime = -Double.infinity
  private var lastArmSecond = -1

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
      self.sets.reset()
      self.lastState = ""
    }
  }

  func setSide(_ s: PoseSide) {
    queue.async {
      guard s != self.side else { return }
      self.side = s
      self.tracker.reset()
      self.sets.reset()
    }
  }

  /// Đang có input thì thay ngay trong session, preview dựng lại connection nên xoay dọc lại.
  func setCamera(_ p: AVCaptureDevice.Position) {
    queue.async {
      guard p != self.position else { return }
      self.position = p
      self.tracker.reset()
      self.sets.reset()
      self.lastState = ""
      guard !self.session.inputs.isEmpty, self.attach() else { return }
      self.started()
    }
  }

  /// Preview tính xong góc dựng dọc cho camera vừa lắp.
  func setUpright(_ angle: Double) {
    queue.async {
      self.upright = angle
      self.loggedFrame = false
    }
  }

  static func describe(_ c: AVCaptureConnection) -> String {
    if #available(iOS 17.0, *) {
      return "mirrored \(c.isVideoMirrored) angle \(Int(c.videoRotationAngle))"
    }
    return "mirrored \(c.isVideoMirrored) orientation \(c.videoOrientation.rawValue)"
  }

  private func run() {
    guard wanted, !session.isRunning else { return }
    if session.inputs.isEmpty, !attach() { return }
    session.startRunning()
    started()
  }

  private func started() {
    guard let d = (session.inputs.first as? AVCaptureDeviceInput)?.device else { return }
    DispatchQueue.main.async { self.onSessionStart?(d) }
  }

  /// Lắp input theo `position` thay input cũ, output lắp một lần. Connection dữ liệu về 0° là hướng gốc cảm biến,
  /// máy không phải xoay buffer từng khung (góc mặc định có máy khác 0, camera trước iPhone 17 Pro Max là 270°).
  /// Không lật, để nhãn tay phải của Vision là tay phải thật ở cả hai camera. Preview camera trước tự lật như gương.
  private func attach() -> Bool {
    guard
      let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: position),
      let input = try? AVCaptureDeviceInput(device: device)
    else {
      emit("unavailable")
      return false
    }
    session.beginConfiguration()
    defer { session.commitConfiguration() }
    session.inputs.forEach(session.removeInput)
    if session.outputs.isEmpty {
      let output = AVCaptureVideoDataOutput()
      output.alwaysDiscardsLateVideoFrames = true
      output.videoSettings = [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA]
      // PoseLandmarker chỉ nhận BGRA.
      output.setSampleBufferDelegate(self, queue: queue)
      guard session.canAddOutput(output) else {
        emit("unavailable")
        return false
      }
      session.addOutput(output)
    }
    // 4:3 lấy trọn cảm biến; 16:9 cắt mất hai mép ngang khi máy dựng đứng, hụt khuỷu tay.
    if session.canSetSessionPreset(.vga640x480) { session.sessionPreset = .vga640x480 }
    guard session.canAddInput(input) else {
      emit("unavailable")
      return false
    }
    session.addInput(input)
    upright = nil
    if let c = session.outputs.first?.connection(with: .video) {
      let before = Self.describe(c)
      if #available(iOS 17.0, *) {
        if c.isVideoRotationAngleSupported(0) { c.videoRotationAngle = 0 }
      } else if c.isVideoOrientationSupported {
        c.videoOrientation = .landscapeRight
      }
      if c.isVideoMirroringSupported {
        c.automaticallyAdjustsVideoMirroring = false
        c.isVideoMirrored = false
      }
      // Tiêu cự và tâm ảnh cho dây dọi từng điểm. Apple chỉ cho bật trước startRunning: đổi camera lúc đang chạy thì
      // khung không có lens, dây dọi về `down` của cả khung.
      if c.isCameraIntrinsicMatrixDeliverySupported, !session.isRunning {
        c.isCameraIntrinsicMatrixDeliveryEnabled = true
      }
      NSLog("[pose] %@ data %@ → %@ intrinsics %d", position == .front ? "front" : "back", before, Self.describe(c),
            c.isCameraIntrinsicMatrixDeliveryEnabled ? 1 : 0)
    }
    return true
  }

  func captureOutput(_ output: AVCaptureOutput, didOutput sb: CMSampleBuffer, from connection: AVCaptureConnection) {
    guard wanted, let upright, let pb = CMSampleBufferGetImageBuffer(sb) else { return }
    let t = CMSampleBufferGetPresentationTimeStamp(sb).seconds
    let g = motion.deviceMotion?.gravity
    let front = position == .front
    // Không có CoreMotion thì coi như máy đứng dọc.
    let down = PoseOrientation.down(gx: g?.x ?? 0, gy: g?.y ?? -1, front: front, upright: upright)
    // Ngả trước sau: trọng lực lọt vào trục z của máy.
    let tilt = g.map { asin(min(1, abs($0.z))) * 180 / .pi } ?? 0
    let size = CGSize(width: CVPixelBufferGetWidth(pb), height: CVPixelBufferGetHeight(pb))
    let lens = Self.lens(sb, height: Double(size.height))
    let o = PoseOrientation.vision(for: down)
    if !loggedFrame {
      loggedFrame = true
      NSLog("[pose] %@ buffer %dx%d upright %d vision %d lens %@", front ? "front" : "back",
            Int(size.width), Int(size.height), Int(upright), o.rawValue,
            lens.map { String(format: "f %.0f cx %.0f cy %.0f", $0.f, $0.cx, $0.cy) } ?? "none")
    }
    let start = CACurrentMediaTime()
    let found = landmarks?.detect(pb, orientation: o, t: t)
    detectMs.append((CACurrentMediaTime() - start) * 1000)
    var frame = PoseFrame(
      landmarks: found, side: side, size: size, down: down, t: t, minConfidence: tracker.limits.minConfidence)
    frame.gravity = PoseOrientation.gravity(gx: g?.x ?? 0, gy: g?.y ?? -1, gz: g?.z ?? 0, front: front, upright: upright)
    frame.lens = lens
    // Theo giây đồng hồ của buffer, không theo khoảng 1 s: 30 fps thì khoảng cách trượt dần, mất dòng.
    if Int(t) != lastArmSecond {
      lastArmSecond = Int(t)
      let c = frame.armConfidence.count == 3 ? frame.armConfidence : [0, 0, 0]
      let ms = detectMs.sorted()
      NSLog("[pose] arm people %d shoulder %.2f elbow %.2f wrist %.2f tilt %.0f lean %@ ms %.1f err %d head %@",
            found == nil ? 0 : 1, c[0], c[1], c[2], tilt,
            frame.forearmLean.map { String(format: "%.0f", $0) } ?? "-",
            ms.isEmpty ? 0 : ms[ms.count / 2], landmarks?.errors ?? -1, Self.head(frame).map { String(format: "%.0f", $0) } ?? "-")
      detectMs.removeAll(keepingCapacity: true)
    }

    // Tracker đo theo `down` của cả khung nên chỉ bắt cú khi máy ngả ≤ `maxTilt`.
    let tracking = tilt <= tracker.limits.maxTilt
    var events: [StrokeEvent] = []
    if tracking { events = tracker.push(frame) } else { tracker.reset() }
    let forearm = tracker.liveForearm
    // Màu đường cẳng tay không chờ tracker: tracker cần vai và máy ngả ≤ `maxTilt`, đường thì chỉ cần khuỷu và cổ tay,
    // đo theo dây dọi tại khuỷu nên chịu được tới `maxLineTilt`. Chỉ quá mức đó mới bảo người chơi chỉnh máy.
    let line = lineColor.push(frame, tilt: tilt, limits: tracker.limits)
    // Cùng điều kiện ngả với màu đường: tay xanh mà đứng yên là một set.
    var counted: Int?
    if tilt <= tracker.limits.maxLineTilt, sets.push(frame, limits: tracker.limits) {
      counted = sets.count
      NSLog("[pose] set %d lean %.0f", sets.count, frame.forearmLean ?? 0)
    }

    let state: String
    if tilt > tracker.limits.maxLineTilt {
      state = "tilted"
    } else if !frame.hasArm {
      state = line == nil ? "searching" : "ready"
    } else if !tracking {
      state = "ready"
    } else {
      switch tracker.phase {
      case .searching, .settling: state = "ready"
      case .address: state = "address"
      case .backswing, .forward, .follow: state = "stroke"
      }
    }
    status(state, tilt: tilt, forearm: forearm, t: t)

    DispatchQueue.main.async {
      self.onFrame?(frame, size, line)
      if let counted { self.onSet?(["count": counted]) }
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

  /// Góc giữa vai → mũi và hướng lên của trọng lực, độ. Gần 0 là toạ độ landmark đã về đúng buffer gốc.
  private static func head(_ f: PoseFrame) -> Double? {
    guard let n = f.nose, let l = f.joints[.leftShoulder], let r = f.joints[.rightShoulder] else { return nil }
    let v = CGVector(dx: n.x - (l.x + r.x) / 2, dy: n.y - (l.y + r.y) / 2)
    let up = CGVector(dx: -f.down.dx, dy: -f.down.dy)
    return atan2(Double(up.dx * v.dy - up.dy * v.dx), Double(up.dx * v.dx + up.dy * v.dy)) * 180 / .pi
  }

  private func status(_ state: String, tilt: Double, forearm: Double?, t: Double) {
    let degree = forearm.map { Int($0.rounded()) }
    // Làm tròn lên: đang báo ngả là đã vượt ngưỡng, hiện đúng số ngưỡng thì người chơi không biết phải chỉnh nữa.
    let shown = tilt.rounded(.up)
    // Lúc ngả không đo cẳng tay, số độ ngả là thứ duy nhất đổi nên phải phát lại để người chơi chỉnh máy theo.
    let tiltMoved = state == "tilted" && Int(shown) != lastTilt
    guard t - lastStatusTime >= 0.2, state != lastState || degree != lastDegree || tiltMoved else { return }
    lastState = state
    lastDegree = degree
    lastTilt = Int(shown)
    lastStatusTime = t
    var body: [String: Any] = ["state": state, "tilt": shown]
    if let forearm { body["forearm"] = Self.round(forearm, 1) }
    DispatchQueue.main.async { self.onStatus?(body) }
  }

  /// Intrinsic matrix gắn theo khung, gốc trên trái → `PoseLens` gốc dưới trái. Ma trận simd lưu theo cột.
  private static func lens(_ sb: CMSampleBuffer, height: Double) -> PoseLens? {
    guard
      let d = CMGetAttachment(sb, key: kCMSampleBufferAttachmentKey_CameraIntrinsicMatrix, attachmentModeOut: nil) as? Data,
      d.count >= MemoryLayout<matrix_float3x3>.size
    else { return nil }
    var m = matrix_float3x3()
    _ = withUnsafeMutableBytes(of: &m) { d.copyBytes(to: $0) }
    return PoseLens(f: Double(m.columns.0.x), cx: Double(m.columns.2.x), cy: height - Double(m.columns.2.y))
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
