import AVFoundation
import CoreGraphics
import Foundation
import ImageIO
import Vision

// Chạy đúng PoseFrame + StrokeTracker của app trên máy Mac.
//   sh run.sh clip.mov [--hand left] [--fps 15] [--csv out.csv]   clip quay bên hông, in từng cú và tỉ lệ khung thấy tay
//   sh run.sh anh.jpg ...                                         ảnh tĩnh, in khớp tay và góc cẳng tay
//   sh run.sh --selftest anh.jpg                                  xoay ảnh 4 hướng, kiểm PoseOrientation trả điểm về đúng chỗ
//   sh run.sh --synthetic                                         cú dựng tay, kiểm máy trạng thái và lỗi được chọn
// Clip coi như quay khi máy cân: hướng xuống lấy từ preferredTransform của track, thay cho trọng lực của CoreMotion.

var args = Array(CommandLine.arguments.dropFirst())
func flag(_ name: String) -> String? {
  guard let i = args.firstIndex(of: name), i + 1 < args.count else { return nil }
  let v = args[i + 1]
  args.removeSubrange(i...(i + 1))
  return v
}
let side = PoseSide(rawValue: flag("--hand") ?? "right") ?? .right
let fps = Double(flag("--fps") ?? "") ?? 0
let csvPath = flag("--csv")
let limits = PoseLimits()

func describe(_ e: StrokeEvent, at t: Double) -> String {
  switch e {
  case let .address(forearm, ok):
    return String(format: "%6.2fs  address  forearm %+5.1f°  %@", t, forearm, ok ? "tick" : "lệch")
  case let .stroke(r):
    return String(
      format: "%6.2fs  stroke   forearm %+5.1f° → %+5.1f°  elbow %4.1f°  head %@  pause %.2fs  knee %@  → %@",
      t, r.forearmAddress, r.forearmContact, r.elbowDrift,
      r.headLift.map { String(format: "%.1fcm", $0) } ?? "—", r.backPause,
      r.backKnee.map { String(format: "%.0f°", $0) } ?? "—", r.fault.rawValue)
  }
}

func detect(_ handler: VNImageRequestHandler) -> [VNHumanBodyPoseObservation] {
  let req = VNDetectHumanBodyPoseRequest()
  try? handler.perform([req])
  return req.results ?? []
}

func loadImage(_ path: String) -> CGImage? {
  guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil) else { return nil }
  return CGImageSourceCreateImageAtIndex(src, 0, nil)
}

// MARK: - Ảnh tĩnh

func runImage(_ path: String) {
  guard let img = loadImage(path) else { return print("\(path): không đọc được") }
  let size = CGSize(width: img.width, height: img.height)
  let obs = detect(VNImageRequestHandler(cgImage: img, orientation: .up))
  let f = PoseFrame(
    observations: obs, side: side, orientation: .up, size: size,
    down: CGVector(dx: 0, dy: -1), t: 0, minConfidence: limits.minConfidence)
  var line = "\((path as NSString).lastPathComponent): \(obs.count) người"
  for (n, p) in [("vai", f.shoulder), ("khuỷu", f.elbow), ("cổ tay", f.wrist), ("mũi", f.nose)] {
    line += " \(n) \(p == nil ? "—" : "ok")"
  }
  if let e = f.elbow, let w = f.wrist {
    line += String(format: " | cẳng tay %.0f° so với dọc", atan2(Double(w.x - e.x), Double(e.y - w.y)) * 180 / .pi)
  }
  print(line)
}

// MARK: - Clip

func runVideo(_ path: String) {
  let asset = AVURLAsset(url: URL(fileURLWithPath: path))
  guard let track = asset.tracks(withMediaType: .video).first, let reader = try? AVAssetReader(asset: asset) else {
    return print("\(path): không có track video")
  }
  let out = AVAssetReaderTrackOutput(
    track: track,
    outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange])
  reader.add(out)
  reader.startReading()

  // Hướng xuống của màn hình (0, 1) theo pixel y xuống, kéo ngược qua phần quay của transform về buffer gốc, rồi lật y.
  let m = track.preferredTransform
  let down = CGVector(dx: m.b, dy: -m.d)
  let orientation = PoseOrientation.vision(for: down)
  let tracker = StrokeTracker()
  var csv = "t,phase,arm,forearm\n"
  var frames = 0, withArm = 0, strokes = 0, lastT = -Double.infinity
  var addressAngles: [Double] = []
  print("\((path as NSString).lastPathComponent): transform b=\(m.b) d=\(m.d) → Vision .\(name(orientation))")

  while let sb = out.copyNextSampleBuffer() {
    let t = CMSampleBufferGetPresentationTimeStamp(sb).seconds
    guard t - lastT >= (fps > 0 ? 1 / fps - 1e-4 : 0), let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
    lastT = t
    let size = CGSize(width: CVPixelBufferGetWidth(pb), height: CVPixelBufferGetHeight(pb))
    let obs = detect(VNImageRequestHandler(cvPixelBuffer: pb, orientation: orientation))
    let f = PoseFrame(
      observations: obs, side: side, orientation: orientation, size: size,
      down: down, t: t, minConfidence: limits.minConfidence)
    frames += 1
    if f.hasArm { withArm += 1 }
    for e in tracker.push(f) {
      print(describe(e, at: t))
      if case .stroke = e { strokes += 1 }
    }
    if tracker.phase == .address, let a = tracker.liveForearm { addressAngles.append(a) }
    csv += String(format: "%.3f,%@,%d,%@\n", t, tracker.phase.rawValue, f.hasArm ? 1 : 0,
                  tracker.liveForearm.map { String(format: "%.2f", $0) } ?? "")
  }
  let mean = addressAngles.reduce(0, +) / Double(max(1, addressAngles.count))
  let sd = sqrt(addressAngles.reduce(0) { $0 + ($1 - mean) * ($1 - mean) } / Double(max(1, addressAngles.count)))
  print(String(format: "khung %d, thấy tay %.0f%%, cú %d, cẳng tay lúc address dao động σ %.1f° (%d khung)",
               frames, 100 * Double(withArm) / Double(max(1, frames)), strokes, sd, addressAngles.count))
  if let csvPath { try? csv.write(toFile: csvPath, atomically: true, encoding: .utf8) }
}

// MARK: - Tự kiểm hướng ảnh

/// Xoay ảnh 90° theo chiều kim đồng hồ: điểm (x, y) gốc dưới trái → (y, W − x).
func rotateCW(_ img: CGImage) -> CGImage {
  let w = img.width, h = img.height
  let ctx = CGContext(
    data: nil, width: h, height: w, bitsPerComponent: 8, bytesPerRow: 0,
    space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  ctx.translateBy(x: 0, y: CGFloat(w))
  ctx.rotate(by: -.pi / 2)
  ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))
  return ctx.makeImage()!
}

func selftest(_ path: String) {
  guard var raw = loadImage(path) else { return print("\(path): không đọc được") }
  let upright = PoseFrame(
    observations: detect(VNImageRequestHandler(cgImage: raw, orientation: .up)), side: side, orientation: .up,
    size: CGSize(width: 1, height: 1), down: CGVector(dx: 0, dy: -1), t: 0, minConfidence: limits.minConfidence)
  guard let e0 = upright.elbow, let w0 = upright.wrist else { return print("ảnh gốc không thấy khuỷu và cổ tay") }

  var down = CGVector(dx: 0, dy: -1)
  var e = e0, w = w0
  var worst = 0.0
  for k in 0..<4 {
    let o = PoseOrientation.vision(for: down)
    let f = PoseFrame(
      observations: detect(VNImageRequestHandler(cgImage: raw, orientation: o)), side: side, orientation: o,
      size: CGSize(width: 1, height: 1), down: down, t: 0, minConfidence: limits.minConfidence)
    let err = [(f.elbow, e), (f.wrist, w)].map { p, q in p.map { hypot(Double($0.x - q.x), Double($0.y - q.y)) } ?? 1 }
    worst = max(worst, err.max() ?? 1)
    print(String(format: "xoay %3d°  down (%+.0f, %+.0f) → .%@  lệch khuỷu %.4f  cổ tay %.4f (chuẩn hoá)",
                 k * 90, down.dx, down.dy, name(o), err[0], err[1]))
    raw = rotateCW(raw)
    // Xoay ảnh theo kim đồng hồ thì "xuống" quay sang trái, và điểm (x, y) đi tới (y, 1 − x).
    down = CGVector(dx: down.dy, dy: -down.dx)
    e = CGPoint(x: e.y, y: 1 - e.x)
    w = CGPoint(x: w.y, y: 1 - w.x)
  }
  print(worst < 0.02 ? "selftest ok" : "selftest LỖI: điểm trả về lệch chỗ")
}

// MARK: - Cú dựng tay

/// Ảnh 1280×720 gốc dưới trái, người quay mặt sang phải. Khuỷu cố định, cẳng tay quay quanh khuỷu như con lắc.
func synthetic() {
  struct Case {
    let name: String
    var address = 0.0, elbowDrop = 0.0, headLift = 0.0, pause = 0.35, standing = false
    var expect: StrokeFault?
  }
  let cases = [
    Case(name: "chuẩn", expect: .good),
    Case(name: "cẳng tay đẩy ra trước 15°", address: 15, expect: .forearmForward),
    Case(name: "cẳng tay kéo về sau 14°", address: -14, expect: .forearmBack),
    Case(name: "khuỷu rơi 30 px trước khi chạm", elbowDrop: 30, expect: .elbow),
    Case(name: "nhấc đầu 25 px", headLift: 25, expect: .head),
    Case(name: "không dừng sau", pause: 0, expect: .pause),
    Case(name: "đứng thẳng, tay buông", standing: true, expect: nil),
  ]
  var rng = SystemRandomNumberGenerator()
  func jitter() -> CGFloat { CGFloat(Double.random(in: -1.5...1.5, using: &rng)) }
  var failed = 0
  for c in cases {
    let tracker = StrokeTracker()
    let L = 120.0
    let shoulder = c.standing ? CGPoint(x: 600, y: 520) : CGPoint(x: 600, y: 400)
    let elbow0 = c.standing ? CGPoint(x: 600, y: 390) : CGPoint(x: 470, y: 470)
    let nose0 = c.standing ? CGPoint(x: 620, y: 620) : CGPoint(x: 720, y: 420)
    // Lịch: yên 1 s, lùi 0,5 s, dừng `pause`, lên 0,35 s, giữ 1,2 s.
    let back = 1.0, top = back + 0.5, go = top + c.pause, hit = go + 0.35, end = hit + 1.2
    var got: StrokeReport?
    var t = 0.0
    while t < end {
      var theta = c.address
      if t >= back && t < top { theta = c.address - 35 * (t - back) / 0.5 }
      else if t >= top && t < go { theta = c.address - 35 }
      else if t >= go && t < hit { theta = c.address - 35 + 65 * (t - go) / 0.35 }
      else if t >= hit { theta = c.address + 30 }
      // Khuỷu rơi dần trong lúc đưa cơ lên, xong trước khi chạm.
      let drop = t >= go ? c.elbowDrop * min(1, (t - go) / 0.2) : 0
      let elbow = CGPoint(x: elbow0.x, y: elbow0.y - drop)
      let r = theta * .pi / 180
      let wrist = CGPoint(x: elbow.x + L * sin(r), y: elbow.y - L * cos(r))
      let lift = t >= hit - 0.1 ? c.headLift : 0
      var f = PoseFrame(t: t, down: CGVector(dx: 0, dy: -1))
      f.shoulder = CGPoint(x: shoulder.x + jitter(), y: shoulder.y + jitter())
      f.elbow = CGPoint(x: elbow.x + jitter(), y: elbow.y + jitter())
      f.wrist = CGPoint(x: wrist.x + jitter(), y: wrist.y + jitter())
      f.nose = CGPoint(x: nose0.x + jitter(), y: nose0.y + lift + jitter())
      for e in tracker.push(f) {
        if case let .stroke(r) = e { got = r }
      }
      t += 1.0 / 30
    }
    let ok = got?.fault == c.expect
    if !ok { failed += 1 }
    let detail = got.map { r in
      String(format: "forearm %+5.1f°  elbow %4.1f°  head %.1fcm  pause %.2fs → %@",
             r.forearmContact, r.elbowDrift, r.headLift ?? -1, r.backPause, r.fault.rawValue)
    } ?? "không ra cú"
    print("\(ok ? "ok  " : "SAI ") \(c.name): \(detail)")
  }
  print(failed == 0 ? "synthetic ok" : "synthetic: \(failed) ca sai")
}

if args.first == "--synthetic" {
  synthetic()
} else if args.first == "--selftest", args.count > 1 {
  selftest(args[1])
} else if args.isEmpty {
  print("dùng: sh run.sh <clip|ảnh>... [--hand left] [--fps 15] [--csv out.csv] | --selftest ảnh | --synthetic")
} else {
  for path in args {
    let ext = (path as NSString).pathExtension.lowercased()
    if ["mov", "mp4", "m4v"].contains(ext) { runVideo(path) } else { runImage(path) }
  }
}

func name(_ o: CGImagePropertyOrientation) -> String {
  ["up", "upMirrored", "down", "downMirrored", "leftMirrored", "right", "rightMirrored", "left"][Int(o.rawValue) - 1]
}
