import CoreGraphics
import ImageIO
import MediaPipeTasksVision
import UIKit

/// PoseLandmarker chế độ VIDEO, một người. Gọi đồng bộ trên hàng capture, mỗi khung một lần.
/// Không nằm trong harness macOS: MediaPipe chỉ có bản iOS.
final class PoseLandmarks {
  private let landmarker: PoseLandmarker
  private var lastMs = Int.min
  /// Số khung detect lỗi hoặc trùng ms, để log thấy MediaPipe có nuốt khung không.
  private(set) var errors = 0

  init?() {
    guard let path = Bundle.main.path(forResource: "pose_landmarker_lite", ofType: "task") else {
      NSLog("[pose] mediapipe model missing")
      return nil
    }
    let o = PoseLandmarkerOptions()
    o.baseOptions.modelAssetPath = path
    o.runningMode = .video
    o.numPoses = 1
    do {
      landmarker = try PoseLandmarker(options: o)
    } catch {
      NSLog("[pose] mediapipe init %@", error.localizedDescription)
      return nil
    }
  }

  /// Buffer phải là 32BGRA. `orientation` xoay người về đứng thẳng cho model, như hướng đưa cho Vision.
  func detect(_ pb: CVPixelBuffer, orientation: CGImagePropertyOrientation, t: Double) -> [NormalizedLandmark]? {
    // VIDEO đòi timestamp tăng ngặt. Khung trùng ms thì bỏ, không để detect throw.
    let ms = Int((t * 1000).rounded())
    guard ms > lastMs else {
      errors += 1
      return nil
    }
    lastMs = ms
    do {
      let image = try MPImage(pixelBuffer: pb, orientation: Self.ui(orientation))
      return try landmarker.detect(videoFrame: image, timestampInMilliseconds: ms).landmarks.first
    } catch {
      errors += 1
      return nil
    }
  }

  private static func ui(_ o: CGImagePropertyOrientation) -> UIImage.Orientation {
    switch o {
    case .down: return .down
    case .left: return .left
    case .right: return .right
    default: return .up
    }
  }
}

extension PoseJoint {
  /// Chỉ số trong 33 landmark của BlazePose.
  var landmark: Int {
    switch self {
    case .leftShoulder: return 11
    case .rightShoulder: return 12
    case .leftElbow: return 13
    case .rightElbow: return 14
    case .leftWrist: return 15
    case .rightWrist: return 16
    case .leftHip: return 23
    case .rightHip: return 24
    case .leftKnee: return 25
    case .rightKnee: return 26
    case .leftAnkle: return 27
    case .rightAnkle: return 28
    }
  }
}

extension PoseFrame {
  /// Landmark của MediaPipe → pixel buffer gốc cỡ `size`. MediaPipe chiếu điểm về buffer gốc (chưa xoay), gốc trên
  /// trái, nên chỉ lật trục y. Visibility làm độ tin cậy; trái/phải là của người trong hình như Vision.
  init(landmarks: [NormalizedLandmark]?, side: PoseSide, size: CGSize, down: CGVector, t: Double, minConfidence: Float) {
    self.init(t: t, down: down)
    self.side = side
    guard let lm = landmarks, lm.count == 33 else { return }
    let arm: [PoseJoint] = side == .right ? [.rightShoulder, .rightElbow, .rightWrist] : [.leftShoulder, .leftElbow, .leftWrist]
    let leg: [PoseJoint] = side == .right ? [.rightHip, .rightKnee, .rightAnkle] : [.leftHip, .leftKnee, .leftAnkle]

    func confidence(_ i: Int) -> Float { lm[i].visibility?.floatValue ?? 0 }
    func point(_ i: Int) -> CGPoint? {
      guard confidence(i) >= minConfidence else { return nil }
      return CGPoint(x: CGFloat(lm[i].x) * size.width, y: (1 - CGFloat(lm[i].y)) * size.height)
    }
    armConfidence = arm.map { confidence($0.landmark) }
    shoulder = point(arm[0].landmark)
    elbow = point(arm[1].landmark)
    wrist = point(arm[2].landmark)
    nose = point(0)
    hip = point(leg[0].landmark)
    knee = point(leg[1].landmark)
    ankle = point(leg[2].landmark)
    for j in PoseJoint.allCases { joints[j] = point(j.landmark) }
  }
}
