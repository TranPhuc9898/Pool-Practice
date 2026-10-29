import AVFoundation
import CoreGraphics
import CoreVideo
import Foundation

/// Trục cơ đo được ở một khung, pixel ảnh đứng gốc trên trái, chưa trừ rung máy: cùng hệ với khung đã đọc.
struct CueEstimate: Equatable {
  var axis: CueAxis
  /// 0…1: tỉ lệ điểm biên nằm trên đường fit nhân độ phủ chiều dài dải.
  var confidence: Double
}

/// Bám cây cơ qua từng khung, bắt đầu từ trục chấm tay. Không thấy thì trả nil, không đoán. Mô hình Core ML sau này chỉ
/// cần thay chỗ này: nhận khung, trả trục và độ tin cậy.
protocol CueTracker {
  /// Đặt lại tại trục chấm tay, xoá `lost`.
  mutating func reset(_ axis: CueAxis)
  /// `wrist` là cổ tay tay cơ, pixel ảnh đứng, cùng hệ với `pb`.
  mutating func track(_ pb: CVPixelBuffer, t: Double, wrist: CGPoint?) -> CueEstimate?
  /// Mất quá nhiều khung liền, phải chấm lại.
  var lost: Bool { get }
}

/// Ngưỡng dò cơ. Mọi số là đoán ban đầu, chưa so với nhãn tay trên clip thật.
struct CueLimits {
  /// Nửa bề rộng dải tìm quanh trục khung trước, pixel ảnh đứng. Cây cơ rộng hơn chừng này thì không bắt được.
  /// `cueHalfWidth` đặt theo 0,5 L của clip.
  var halfWidth = 40.0
  /// Trục mới quay quá chừng này độ so với khung trước thì bỏ.
  var maxTurn = 5.0
  /// Số mặt cắt ngang trục.
  var stations = 48
  /// Biên cơ: kênh Y 0…255 chênh ít nhất chừng này giữa hai pixel cách nhau 2 px.
  var minEdge = 12.0
  /// … và gấp chừng này lần trung vị |gradient| của chính mặt cắt, để nền nhiễu không đẻ ra biên.
  var noiseEdge = 4.0
  /// Cây cơ trên ảnh hẹp nhất chừng này pixel.
  var minWidth = 2.0
  /// Điểm cách đường fit dưới chừng này pixel là inlier.
  var inlierTolerance = 2.0
  var minInliers = 8
  var minConfidence = 0.35
  /// Cổ tay cách đường fit quá chừng này lần `halfWidth` thì đường đó không phải cây cơ đang cầm. Đoán: từ sau lưng, tay
  /// nằm ngay trên đuôi cơ.
  var maxWristGap = 2.0
  /// Chừng này khung liền nil thì dừng bám.
  var maxMisses = 3
}

/// Dò cơ trong dải quanh trục khung trước. Mỗi mặt cắt ngang trục tìm một cặp biên ngược dấu (cây cơ sáng trên nền tối
/// hoặc ngược lại), lấy tâm cặp; RANSAC trên các tâm, giữ đường quay không quá `maxTurn`, rồi fit lại bình phương tối
/// thiểu toàn phần trên inlier. Gradient một chiều theo pháp tuyến thay cho Sobel cả khung: chỉ đọc pixel trong dải.
struct EdgeBandCueTracker: CueTracker {
  var limits: CueLimits
  let info: ClipInfo
  private var axis: CueAxis?
  private var misses = 0
  private(set) var lost = false

  init(info: ClipInfo, limits: CueLimits = CueLimits()) {
    self.info = info
    self.limits = limits
  }

  mutating func reset(_ axis: CueAxis) {
    self.axis = axis
    misses = 0
    lost = false
  }

  mutating func track(_ pb: CVPixelBuffer, t: Double, wrist: CGPoint?) -> CueEstimate? {
    guard !lost, let prev = axis else { return nil }
    guard let e = withLuma(pb, info, { estimate($0, prev, t: t, wrist: wrist) }) else {
      misses += 1
      if misses >= limits.maxMisses { lost = true }
      return nil
    }
    misses = 0
    axis = e.axis
    return e
  }

  private func estimate(_ luma: Luma, _ prev: CueAxis, t: Double, wrist: CGPoint?) -> CueEstimate? {
    let dx = Double(prev.b.x - prev.a.x), dy = Double(prev.b.y - prev.a.y)
    let len = hypot(dx, dy)
    guard len > 8 else { return nil }
    let ux = dx / len, uy = dy / len
    let h = limits.halfWidth
    var pts: [(s: Double, x: Double, y: Double)] = []
    for k in 0..<limits.stations {
      let s = len * (Double(k) + 0.5) / Double(limits.stations)
      let cx = Double(prev.a.x) + ux * s, cy = Double(prev.a.y) + uy * s
      if let o = bar(luma, cx, cy, -uy, ux) { pts.append((s, cx - uy * o, cy + ux * o)) }
    }
    guard pts.count >= limits.minInliers else { return nil }

    // Thử mọi cặp điểm: 48 mặt cắt thì hơn nghìn cặp, đủ rẻ, và kết quả không đổi giữa hai lần chạy.
    var best: [Int] = []
    for i in pts.indices {
      for j in (i + 1)..<pts.count {
        let ex = pts[j].x - pts[i].x, ey = pts[j].y - pts[i].y
        let el = hypot(ex, ey)
        guard el > len * 0.2, abs(turn(ex, ey, ux, uy)) <= limits.maxTurn else { continue }
        let mx = -ey / el, my = ex / el
        let inl = pts.indices.filter {
          abs((pts[$0].x - pts[i].x) * mx + (pts[$0].y - pts[i].y) * my) < limits.inlierTolerance
        }
        if inl.count > best.count { best = inl }
      }
    }
    guard best.count >= limits.minInliers else { return nil }

    let n = Double(best.count)
    let cx = best.map { pts[$0].x }.reduce(0, +) / n, cy = best.map { pts[$0].y }.reduce(0, +) / n
    var sxx = 0.0, syy = 0.0, sxy = 0.0
    for i in best {
      let a = pts[i].x - cx, b = pts[i].y - cy
      sxx += a * a
      syy += b * b
      sxy += a * b
    }
    let theta = 0.5 * atan2(2 * sxy, sxx - syy)
    var vx = cos(theta), vy = sin(theta)
    if vx * ux + vy * uy < 0 { vx = -vx; vy = -vy }
    guard abs(turn(vx, vy, ux, uy)) <= limits.maxTurn else { return nil }
    if let w = wrist, abs((Double(w.x) - cx) * -vy + (Double(w.y) - cy) * vx) > limits.maxWristGap * h { return nil }

    let along = best.map { pts[$0].s }
    let full = len * Double(limits.stations - 1) / Double(limits.stations)
    let coverage = min(1, (along.max()! - along.min()!) / full)
    let confidence = n / Double(pts.count) * coverage
    guard confidence >= limits.minConfidence else { return nil }
    func onto(_ p: CGPoint) -> CGPoint {
      let k = (Double(p.x) - cx) * vx + (Double(p.y) - cy) * vy
      return CGPoint(x: cx + vx * k, y: cy + vy * k)
    }
    return CueEstimate(axis: CueAxis(a: onto(prev.a), b: onto(prev.b), t: t), confidence: confidence)
  }

  /// Tâm cây cơ trên mặt cắt qua (cx, cy) theo pháp tuyến (nx, ny), pixel lệch có dấu; nil khi không có cặp biên rõ hoặc
  /// mặt cắt ra ngoài ảnh.
  private func bar(_ luma: Luma, _ cx: Double, _ cy: Double, _ nx: Double, _ ny: Double) -> Double? {
    let h = Int(limits.halfWidth.rounded())
    var v: [Double] = []
    v.reserveCapacity(2 * h + 1)
    for o in -h...h {
      guard let y = luma.at(cx + nx * Double(o), cy + ny * Double(o)) else { return nil }
      v.append(y)
    }
    let g = v.indices.map { k in k == 0 || k == v.count - 1 ? 0 : v[k + 1] - v[k - 1] }
    let floor = max(limits.minEdge, limits.noiseEdge * median(g.dropFirst().dropLast().map(abs)))
    var peaks: [(o: Double, g: Double)] = []
    for k in 1..<(g.count - 1) {
      let a = abs(g[k - 1]), b = abs(g[k]), c = abs(g[k + 1])
      guard b >= floor, b >= a, b > c else { continue }
      let den = a - 2 * b + c
      peaks.append((Double(k - h) + (den < 0 ? 0.5 * (a - c) / den : 0), g[k]))
    }
    var pick: (o: Double, score: Double)?
    for (i, p) in peaks.enumerated() {
      for q in peaks[(i + 1)...] where (p.g > 0) != (q.g > 0) {
        let w = q.o - p.o
        guard w >= limits.minWidth, w <= limits.halfWidth else { continue }
        let mid = (p.o + q.o) / 2
        let score = min(abs(p.g), abs(q.g)) * (1 - 0.5 * abs(mid) / limits.halfWidth)
        if score > (pick?.score ?? 0) { pick = (mid, score) }
      }
    }
    return pick?.o
  }
}

/// Góc có dấu từ hướng (ux, uy) tới (vx, vy), độ, gói về (−90, 90] vì trục không chiều.
private func turn(_ vx: Double, _ vy: Double, _ ux: Double, _ uy: Double) -> Double {
  wrap90(atan2(ux * vy - uy * vx, ux * vx + uy * vy) * 180 / .pi)
}

/// Kênh sáng của khung, đọc theo pixel ảnh đứng gốc trên trái. Nhận 420 bi-planar (lượt đọc clip) hoặc BGRA (harness).
struct Luma {
  fileprivate let base: UnsafePointer<UInt8>
  fileprivate let row: Int
  fileprivate let stride: Int
  fileprivate let w: Int
  fileprivate let h: Int
  fileprivate let info: ClipInfo

  /// Nội suy song tuyến; nil khi ra ngoài ảnh.
  func at(_ x: Double, _ y: Double) -> Double? {
    let p = info.buffer(CGPoint(x: x, y: y))
    let fx = Double(p.x) - 0.5, fy = Double(h) - Double(p.y) - 0.5
    let x0 = Int(fx.rounded(.down)), y0 = Int(fy.rounded(.down))
    guard x0 >= 0, y0 >= 0, x0 + 1 < w, y0 + 1 < h else { return nil }
    let tx = fx - Double(x0), ty = fy - Double(y0)
    func px(_ c: Int, _ r: Int) -> Double { Double(base[r * row + c * stride]) }
    let top = px(x0, y0) * (1 - tx) + px(x0 + 1, y0) * tx
    let bottom = px(x0, y0 + 1) * (1 - tx) + px(x0 + 1, y0 + 1) * tx
    return top * (1 - ty) + bottom * ty
  }
}

func withLuma<T>(_ pb: CVPixelBuffer, _ info: ClipInfo, _ body: (Luma) -> T?) -> T? {
  CVPixelBufferLockBaseAddress(pb, .readOnly)
  defer { CVPixelBufferUnlockBaseAddress(pb, .readOnly) }
  let planar = CVPixelBufferIsPlanar(pb)
  guard let raw = planar ? CVPixelBufferGetBaseAddressOfPlane(pb, 0) : CVPixelBufferGetBaseAddress(pb) else { return nil }
  let luma = Luma(
    // BGRA: lấy kênh G làm độ sáng.
    base: raw.assumingMemoryBound(to: UInt8.self).advanced(by: planar ? 0 : 1),
    row: planar ? CVPixelBufferGetBytesPerRowOfPlane(pb, 0) : CVPixelBufferGetBytesPerRow(pb),
    stride: planar ? 1 : 4,
    w: planar ? CVPixelBufferGetWidthOfPlane(pb, 0) : CVPixelBufferGetWidth(pb),
    h: planar ? CVPixelBufferGetHeightOfPlane(pb, 0) : CVPixelBufferGetHeight(pb),
    info: info)
  return body(luma)
}

/// Nửa bề rộng dải dò theo 0,5 L trung vị của clip, kẹp trong 15…80 px. Không thấy cẳng tay thì 40 px.
func cueHalfWidth(_ frames: [PoseFrame]) -> Double {
  let lengths = frames.compactMap { f -> Double? in
    guard let e = f.elbow, let w = f.wrist else { return nil }
    return hypot(Double(w.x - e.x), Double(w.y - e.y))
  }
  return lengths.isEmpty ? 40 : min(80, max(15, 0.5 * median(lengths)))
}

/// Kết quả bám cơ, cùng chỉ số với mảng khung của `analyzeClip`. `lost[i]` là tracker đã dừng ở khung đó, chờ chấm lại.
struct CueTrack {
  var estimates: [CueEstimate?]
  var lost: [Bool]
}

/// Lượt đọc thứ hai: bám cơ từ trục chấm tay sớm nhất tới hết clip, đặt lại tracker ở khung của mỗi trục chấm.
/// Khung trước trục sớm nhất là nil: AVAssetReader chỉ đọc xuôi. Huỷ thì ném `CancellationError`.
func trackCue(
  url: URL, info: ClipInfo, frames: [PoseFrame], axes: [CueAxis], limits: CueLimits,
  make: (ClipInfo, CueLimits) -> any CueTracker = { EdgeBandCueTracker(info: $0, limits: $1) }
) async throws -> CueTrack {
  var out = CueTrack(estimates: Array(repeating: nil, count: frames.count), lost: Array(repeating: false, count: frames.count))
  let resets = Dictionary(axes.compactMap { a in nearestFrame(frames, a.t).map { ($0, a) } }, uniquingKeysWith: { _, b in b })
  guard let first = resets.keys.min() else { return out }
  let asset = AVURLAsset(url: url)
  guard let track = try await asset.loadTracks(withMediaType: .video).first else { throw ClipError.noVideo }
  let reader = try AVAssetReader(asset: asset)
  reader.timeRange = CMTimeRange(
    start: CMTime(seconds: max(0, frames[first].t - 0.1), preferredTimescale: 600), duration: .positiveInfinity)
  let output = AVAssetReaderTrackOutput(
    track: track,
    outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange])
  output.alwaysCopiesSampleData = false
  reader.add(output)
  guard reader.startReading() else { throw ClipError.unreadable(reader.error?.localizedDescription ?? "") }
  defer { reader.cancelReading() }

  var tracker = make(info, limits)
  var started = false
  while let sb = output.copyNextSampleBuffer() {
    try Task.checkCancellation()
    let t = CMSampleBufferGetPresentationTimeStamp(sb).seconds
    guard let k = nearestFrame(frames, t), abs(frames[k].t - t) < 1e-3, let pb = CMSampleBufferGetImageBuffer(sb) else {
      continue
    }
    if let a = resets[k] {
      tracker.reset(a)
      started = true
    }
    guard started else { continue }
    out.estimates[k] = tracker.track(pb, t: frames[k].t, wrist: frames[k].wrist.map(info.upright))
    out.lost[k] = tracker.lost
  }
  try Task.checkCancellation()
  if reader.status == .failed { throw ClipError.unreadable(reader.error?.localizedDescription ?? "") }
  return out
}
