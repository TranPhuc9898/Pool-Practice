import AVFoundation
import CoreGraphics
import Foundation
import ImageIO
import Vision

/// Clip đã mở: cỡ buffer gốc, cỡ sau khi xoay đứng theo `preferredTransform`, và hướng Vision tương ứng.
struct ClipInfo {
  var bufferSize: CGSize
  var fps: Double
  var duration: Double
  var orientation: CGImagePropertyOrientation
  var down: CGVector

  /// Cỡ ảnh người xem thấy. `.right`, `.left` là buffer nằm ngang trong clip quay dọc hoặc ngược lại.
  var size: CGSize {
    orientation == .right || orientation == .left
      ? CGSize(width: bufferSize.height, height: bufferSize.width) : bufferSize
  }

  /// Điểm pixel buffer gốc (gốc dưới trái, như `PoseFrame`) → pixel ảnh đứng, gốc trên trái. Ngược của `unrotate`.
  func upright(_ p: CGPoint) -> CGPoint {
    let b = CGPoint(x: p.x / bufferSize.width, y: p.y / bufferSize.height)
    let u: CGPoint
    switch orientation {
    case .right: u = CGPoint(x: b.y, y: 1 - b.x)
    case .left: u = CGPoint(x: 1 - b.y, y: b.x)
    case .down: u = CGPoint(x: 1 - b.x, y: 1 - b.y)
    default: u = b
    }
    return CGPoint(x: u.x * size.width, y: (1 - u.y) * size.height)
  }

  /// Pixel ảnh đứng gốc trên trái → pixel buffer gốc.
  func buffer(_ p: CGPoint) -> CGPoint {
    let u = PoseOrientation.unrotate(CGPoint(x: p.x / size.width, y: 1 - p.y / size.height), orientation)
    return CGPoint(x: u.x * bufferSize.width, y: u.y * bufferSize.height)
  }
}

/// Trục cơ, hai điểm pixel ảnh đứng gốc trên trái, kèm `t` của khung đã chấm. Không có chiều: đổi a, b là cùng trục.
struct CueAxis: Equatable {
  var a: CGPoint
  var b: CGPoint
  var t: Double

  /// Góc so với trục ngang ảnh đứng, độ, gói trong (−90, 90]. Tăng là quay theo chiều kim đồng hồ trên màn.
  var angle: Double { wrap90(atan2(Double(b.y - a.y), Double(b.x - a.x)) * 180 / .pi) }

  /// Khoảng cách có dấu từ `p` tới trục, pixel. Dương là phía phải của ảnh đứng; trục nằm ngang thì dương là phía dưới.
  func offset(_ p: CGPoint) -> Double? {
    let dx = Double(b.x - a.x), dy = Double(b.y - a.y)
    let n = hypot(dx, dy)
    guard n > 1 else { return nil }
    var nx = -dy / n, ny = dx / n
    if nx < 0 || (abs(nx) < 1e-9 && ny < 0) { nx = -nx; ny = -ny }
    return Double(p.x - a.x) * nx + Double(p.y - a.y) * ny
  }
}

/// Gói góc của một đường không chiều về (−90, 90].
func wrap90(_ deg: Double) -> Double {
  var d = deg.truncatingRemainder(dividingBy: 180)
  if d <= -90 { d += 180 } else if d > 90 { d -= 180 }
  return d
}

/// Góc có dấu của trục `a` so với `ref`, độ, trong (−90, 90]. Trục 0° và 179° lệch 1°.
func axisDeviation(_ a: CueAxis, _ ref: CueAxis) -> Double { wrap90(a.angle - ref.angle) }

/// Số đo một khung so với trục tham chiếu. Pixel ảnh đứng; `…L` là bội số cẳng tay của chính khung đó, để không phụ
/// thuộc khoảng cách máy. Không phải mm: không có hiệu chuẩn không gian.
struct ClipMeasure {
  var wrist: Double?
  var elbow: Double?
  var wristL: Double?
  var elbowL: Double?
  /// Cẳng tay khuỷu → cổ tay so với trục, độ, (−90, 90].
  var forearmToAxis: Double?
  var forearmLean: Double?
  /// Độ dài cẳng tay, pixel ảnh đứng.
  var L: Double?

  init(_ f: PoseFrame, _ info: ClipInfo, axis: CueAxis?) {
    forearmLean = f.forearmLean
    let e = f.elbow.map(info.upright), w = f.wrist.map(info.upright)
    if let e, let w { L = hypot(Double(w.x - e.x), Double(w.y - e.y)) }
    guard let axis else { return }
    wrist = w.flatMap(axis.offset)
    elbow = e.flatMap(axis.offset)
    if let L, L > 4 {
      wristL = wrist.map { $0 / L }
      elbowL = elbow.map { $0 / L }
      if let e, let w { forearmToAxis = axisDeviation(CueAxis(a: e, b: w, t: f.t), axis) }
    }
  }
}

/// Khung chứa video trong `bounds` khi giữ tỉ lệ, như `AVMakeRect`.
func videoRect(_ info: ClipInfo, in bounds: CGRect) -> CGRect { AVMakeRect(aspectRatio: info.size, insideRect: bounds) }

/// Pixel ảnh đứng → điểm view trong `rect` của `videoRect`.
func viewPoint(_ p: CGPoint, _ info: ClipInfo, _ rect: CGRect) -> CGPoint {
  CGPoint(x: rect.minX + p.x / info.size.width * rect.width, y: rect.minY + p.y / info.size.height * rect.height)
}

/// Điểm view → pixel ảnh đứng.
func imagePoint(_ v: CGPoint, _ info: ClipInfo, _ rect: CGRect) -> CGPoint {
  CGPoint(x: (v.x - rect.minX) / rect.width * info.size.width, y: (v.y - rect.minY) / rect.height * info.size.height)
}

enum ClipError: Error {
  case noVideo
  case unreadable(String)
}

/// Đọc thông tin clip. Hướng xuống lấy từ `preferredTransform`: clip coi như quay khi máy cân.
func clipInfo(_ asset: AVURLAsset) async throws -> (ClipInfo, AVAssetTrack) {
  guard let track = try await asset.loadTracks(withMediaType: .video).first else { throw ClipError.noVideo }
  let (m, natural, fps) = try await track.load(.preferredTransform, .naturalSize, .nominalFrameRate)
  let duration = try await asset.load(.duration).seconds
  // Hướng xuống của màn hình (0, 1) theo pixel y xuống, kéo ngược qua phần quay của transform về buffer gốc, rồi lật y.
  let down = CGVector(dx: m.b, dy: -m.d)
  let info = ClipInfo(
    bufferSize: CGSize(width: abs(natural.width), height: abs(natural.height)), fps: Double(fps),
    duration: duration, orientation: PoseOrientation.vision(for: down), down: down)
  return (info, track)
}

/// Dải mặc định để đo rung máy: 40% dưới của ảnh đứng, thường là sàn và mép bàn. Chuẩn hoá, gốc trên trái.
/// Dải mỏng hơn ~30% thì Vision trả số lệch hẳn hoặc nil (harness `--unit` dựng ra). Chưa kiểm trên clip thật.
let defaultShakeBand = CGRect(x: 0, y: 0.6, width: 1, height: 0.4)

/// Ảnh trôi bao nhiêu từ `prev` tới `cur`, pixel ảnh đứng gốc trên trái, đo trên dải `band` (chuẩn hoá theo ảnh
/// đứng, gốc trên trái). Người trong dải làm số sai, nên dải phải là chỗ chỉ có bàn hoặc tường.
func frameShift(
  _ prev: CVPixelBuffer, _ cur: CVPixelBuffer, orientation: CGImagePropertyOrientation, band: CGRect
) -> CGVector? {
  let req = VNTranslationalImageRegistrationRequest(targetedCVPixelBuffer: prev, orientation: orientation)
  req.regionOfInterest = CGRect(x: band.minX, y: 1 - band.maxY, width: band.width, height: band.height)
  try? VNImageRequestHandler(cvPixelBuffer: cur, orientation: orientation).perform([req])
  guard let a = (req.results?.first as? VNImageTranslationAlignmentObservation)?.alignmentTransform else { return nil }
  // Hai khung liền trôi quá 5% cạnh ngắn thì không phải rung chân máy: đo hỏng, bỏ.
  let side = Double(min(CVPixelBufferGetWidth(cur), CVPixelBufferGetHeight(cur)))
  guard hypot(Double(a.tx), Double(a.ty)) <= 0.05 * side else { return nil }
  return CGVector(dx: a.tx, dy: -a.ty)
}

/// Chạy Vision trên từng khung, chỉ giữ toạ độ khớp. `fps` > 0 thì bỏ bớt khung cho nhanh. Có `band` thì đo thêm rung
/// máy giữa hai khung liền trên dải đó, cộng dồn vào `PoseFrame.shift`.
/// Huỷ thì ném `CancellationError`, không trả mảng dở. `progress` gọi mỗi khi tiến thêm 1%.
func analyzeClip(
  url: URL, side: PoseSide, minConfidence: Float, fps: Double = 0, band: CGRect? = nil,
  progress: (Double) -> Void = { _ in }
) async throws -> (ClipInfo, [PoseFrame]) {
  let asset = AVURLAsset(url: url)
  let (info, track) = try await clipInfo(asset)
  let reader = try AVAssetReader(asset: asset)
  let out = AVAssetReaderTrackOutput(
    track: track,
    outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange])
  out.alwaysCopiesSampleData = false
  reader.add(out)
  guard reader.startReading() else { throw ClipError.unreadable(reader.error?.localizedDescription ?? "") }
  defer { reader.cancelReading() }

  let req = VNDetectHumanBodyPoseRequest()
  var frames: [PoseFrame] = []
  var lastT = -Double.infinity, lastPct = -1
  var prev: CVPixelBuffer?
  var shift = CGVector.zero
  var lock = PoseLock()
  while let sb = out.copyNextSampleBuffer() {
    try Task.checkCancellation()
    let t = CMSampleBufferGetPresentationTimeStamp(sb).seconds
    guard t - lastT >= (fps > 0 ? 1 / fps - 1e-4 : 0), let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
    lastT = t
    try? VNImageRequestHandler(cvPixelBuffer: pb, orientation: info.orientation).perform([req])
    var f = PoseFrame(
      observations: req.results ?? [], lock: &lock, side: side, orientation: info.orientation,
      size: CGSize(width: CVPixelBufferGetWidth(pb), height: CVPixelBufferGetHeight(pb)),
      down: info.down, t: t, minConfidence: minConfidence)
    if let band {
      if let prev, let d = frameShift(prev, pb, orientation: info.orientation, band: band) {
        shift.dx += d.dx
        shift.dy += d.dy
      }
      prev = pb
      f.shift = shift
    }
    frames.append(f)
    let pct = info.duration > 0 ? Int(100 * t / info.duration) : 0
    if pct > lastPct {
      lastPct = pct
      progress(min(1, Double(pct) / 100))
    }
  }
  try Task.checkCancellation()
  if reader.status == .failed { throw ClipError.unreadable(reader.error?.localizedDescription ?? "") }
  return (info, frames)
}

/// Khung gần `t` nhất trong mảng đã sắp theo `t`, tìm nhị phân.
func nearestFrame(_ frames: [PoseFrame], _ t: Double) -> Int? {
  guard !frames.isEmpty else { return nil }
  var lo = 0, hi = frames.count - 1
  while lo < hi {
    let mid = (lo + hi) / 2
    if frames[mid].t < t { lo = mid + 1 } else { hi = mid }
  }
  if lo > 0, abs(frames[lo - 1].t - t) <= abs(frames[lo].t - t) { return lo - 1 }
  return lo
}
