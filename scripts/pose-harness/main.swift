import AVFoundation
import CoreGraphics
import CoreImage
import CoreText
import Foundation
import ImageIO
import Vision

// Chạy đúng PoseFrame + StrokeTracker của app trên máy Mac.
//   sh run.sh clip.mov [--hand left] [--fps 15] [--csv out.csv]   clip quay bên hông, in từng cú và tỉ lệ khung thấy tay
//                      [--frames out/]                           thêm cu-NN.png: khung lúc chạm, khớp tay Vision, dây dọi
//   sh run.sh clip.mov --rear out.csv [--hand left] [--fps 15]      clip quay sau lưng: khớp tay, rung máy, pha RearTracker
//                      [--signal wristY|length] [--back -1]          tín hiệu bắt pha và chiều lùi cơ của nó
//   sh run.sh clip.mov --cue x1,y1,x2,y2@t --csv out.csv            bám cơ từ trục cho sẵn (pixel ảnh đứng, giây)
//   sh run.sh clip.mov --eval nhan.csv [--hand left]                 so với nhãn tay, in sai số trung vị, p90, ms mỗi khung
//                      nhãn: t,wrist_x,wrist_y,elbow_x,elbow_y,cue_ax,cue_ay,cue_bx,cue_by,phase (pixel ảnh đứng, ô trống được)
//   sh run.sh anh.jpg ...                                         ảnh tĩnh, in khớp tay và góc cẳng tay
//   sh run.sh --selftest anh.jpg                                  xoay ảnh 4 hướng, kiểm PoseOrientation trả điểm về đúng chỗ
//   sh run.sh --synthetic                                         cú dựng tay, kiểm máy trạng thái và lỗi được chọn
//   sh run.sh --unit                                              hình học của PoseClip, clip xoay, huỷ giữa lượt
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
let framesDir = flag("--frames")
let rearPath = flag("--rear")
let cueSpec = flag("--cue")
let evalPath = flag("--eval")
var rearLimits = RearLimits()
if let v = flag("--signal").flatMap(RearSignal.init(rawValue:)) { rearLimits.signal = v }
if let v = flag("--back").flatMap(Double.init) { rearLimits.backSign = v }
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
  // Ảnh rời nhau nên mỗi ảnh một khoá mới: chọn người có khung to nhất.
  var lock = PoseLock()
  let f = PoseFrame(
    observations: obs, lock: &lock, side: side, orientation: .up, size: size,
    down: CGVector(dx: 0, dy: -1), t: 0, minConfidence: limits.minConfidence)
  var line = "\((path as NSString).lastPathComponent): \(obs.count) người"
  for (n, p) in [("vai", f.shoulder), ("khuỷu", f.elbow), ("cổ tay", f.wrist), ("mũi", f.nose)] {
    line += " \(n) \(p == nil ? "—" : "ok")"
  }
  if let lean = f.forearmLean {
    line += String(format: " | cẳng tay %.0f° so với dọc ", lean) + (limits.lineOk(f, tilt: 0) == true ? "xanh" : "đỏ")
  }
  // Toạ độ mũi chuẩn hoá gốc trên trái, để biết ảnh nhiều người thì đang chọn ai.
  if let n = f.nose {
    line += String(format: " | mũi (%.2f, %.2f)", n.x / size.width, 1 - n.y / size.height)
  }
  print(line)
}

// MARK: - Clip

/// Một lượt đọc từ đầu clip. Trả cả reader để nó sống hết lượt.
func openReader(_ asset: AVURLAsset, _ track: AVAssetTrack) -> (AVAssetReader, AVAssetReaderTrackOutput)? {
  guard let reader = try? AVAssetReader(asset: asset) else { return nil }
  let out = AVAssetReaderTrackOutput(
    track: track,
    outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange])
  reader.add(out)
  reader.startReading()
  return (reader, out)
}

typealias Shot = (n: Int, report: StrokeReport, frame: PoseFrame)

/// Harness chạy đồng bộ: đợi `analyzeClip` xong bằng semaphore. Task tách khỏi main actor để không tự khoá.
func load(_ path: String, band: CGRect? = nil) -> (ClipInfo, [PoseFrame])? {
  let sem = DispatchSemaphore(value: 0)
  var got: (ClipInfo, [PoseFrame])?
  Task.detached {
    do {
      got = try await analyzeClip(
        url: URL(fileURLWithPath: path), side: side, minConfidence: limits.minConfidence, fps: fps, band: band)
    } catch {
      print("\(path): \(error)")
    }
    sem.signal()
  }
  sem.wait()
  return got
}

func runVideo(_ path: String) {
  guard let (info, all) = load(path) else { return }
  let tracker = StrokeTracker()
  var csv = "t,phase,arm,forearm\n"
  var withArm = 0, strokes = 0
  var addressAngles: [Double] = []
  var armFrames: [PoseFrame] = [], shots: [Shot] = []
  print("\((path as NSString).lastPathComponent): down (\(info.down.dx), \(info.down.dy)) → Vision .\(name(info.orientation))")

  for f in all {
    let t = f.t
    if f.hasArm {
      withArm += 1
      armFrames.append(f)
      armFrames.removeAll { t - $0.t > 3 }
    }
    for e in tracker.push(f) {
      print(describe(e, at: t))
      if case let .stroke(r) = e {
        strokes += 1
        // Tracker chấm góc trên khung có tay gần lúc chạm nhất, ảnh lấy đúng khung đó.
        if let at = armFrames.min(by: { abs($0.t - r.contact) < abs($1.t - r.contact) }) {
          shots.append((strokes, r, at))
        }
      }
    }
    if tracker.phase == .address, let a = tracker.liveForearm { addressAngles.append(a) }
    csv += String(format: "%.3f,%@,%d,%@\n", t, tracker.phase.rawValue, f.hasArm ? 1 : 0,
                  tracker.liveForearm.map { String(format: "%.2f", $0) } ?? "")
  }
  let frames = all.count
  let mean = addressAngles.reduce(0, +) / Double(max(1, addressAngles.count))
  let sd = sqrt(addressAngles.reduce(0) { $0 + ($1 - mean) * ($1 - mean) } / Double(max(1, addressAngles.count)))
  print(String(format: "khung %d, thấy tay %.0f%%, cú %d, cẳng tay lúc address dao động σ %.1f° (%d khung)",
               frames, 100 * Double(withArm) / Double(max(1, frames)), strokes, sd, addressAngles.count))
  if let csvPath { try? csv.write(toFile: csvPath, atomically: true, encoding: .utf8) }
  if let framesDir, !shots.isEmpty {
    let asset = AVURLAsset(url: URL(fileURLWithPath: path))
    if let track = asset.tracks(withMediaType: .video).first {
      saveContactFrames(asset, track, info.orientation, shots, to: framesDir)
    }
  }
}

// MARK: - Clip sau lưng

/// Mỗi khung một dòng, kể cả khung không thấy tay (ô trống), để số dòng bằng số khung và lùi khung trên QuickTime khớp t.
/// Toạ độ chuẩn hoá trên ảnh đứng, gốc trên trái, đọc thẳng bằng mắt. L là cẳng tay khuỷu → cổ tay, pixel: máy sau lưng
/// thì backswing đi dọc trục ống kính, L co giãn theo đó.
func runRear(_ path: String, to csvPath: String) {
  guard let (info, all) = load(path, band: defaultShakeBand) else { return }
  let tracker = RearTracker(limits: rearLimits)
  for f in all { tracker.push(RearSample(f, info)) }
  var csv = "t,shoulder_x,shoulder_y,elbow_x,elbow_y,wrist_x,wrist_y,L,conf_shoulder,conf_elbow,conf_wrist,"
    + "shift_x,shift_y,phase,confidence\n"
  var withShoulder = 0, withForearm = 0
  var lengths: [Double] = []
  print("\((path as NSString).lastPathComponent): \(Int(info.size.width))×\(Int(info.size.height)), \(info.fps) fps → Vision .\(name(info.orientation))")

  for (i, f) in all.enumerated() {
    if f.shoulder != nil { withShoulder += 1 }
    var L: Double?
    if let e = f.elbow, let w = f.wrist {
      withForearm += 1
      L = hypot(Double(w.x - e.x), Double(w.y - e.y))
      lengths.append(L!)
    }
    var row = String(format: "%.4f", f.t)
    for p in [f.shoulder, f.elbow, f.wrist] {
      row += p.map {
        let u = info.upright($0)
        return String(format: ",%.4f,%.4f", u.x / info.size.width, u.y / info.size.height)
      } ?? ",,"
    }
    row += L.map { String(format: ",%.1f", $0) } ?? ","
    let conf = f.armConfidence.count == 3 ? f.armConfidence : [Float](repeating: 0, count: 3)
    row += conf.map { String(format: ",%.2f", $0) }.joined()
    row += String(format: ",%.2f,%.2f,%@,%.2f\n", f.shift.dx, f.shift.dy, tracker.phases[i].rawValue, tracker.confidence[i])
    csv += row
  }
  lengths.sort()
  let medianL = lengths.isEmpty ? 0 : lengths[lengths.count / 2]
  let n = Double(max(1, all.count))
  print(String(format: "khung %d, thấy khuỷu và cổ tay %.0f%%, thấy vai %.0f%%, L trung vị %.0f px",
               all.count, 100 * Double(withForearm) / n, 100 * Double(withShoulder) / n, medianL))
  let steps = zip(all, all.dropFirst()).map { hypot(Double($1.shift.dx - $0.shift.dx), Double($1.shift.dy - $0.shift.dy)) }
  let found = rearStrokes(tracker.phases, times: all.map(\.t))
  print(String(format: "rung máy giữa hai khung: trung vị %.2f px, lớn nhất %.2f px; tín hiệu %@, chiều lùi %+.0f",
               median(steps), steps.max() ?? 0, rearLimits.signal.rawValue, rearLimits.backSign))
  print("cú tự bắt: \(tracker.strokes)" + found.map { s in
    String(format: "\n  backswing %.2f s, follow %.2f s%@", all[s.start].t, all[s.follow].t,
           s.pause.map { String(format: ", dừng %.2f s", $0) } ?? "")
  }.joined())
  do { try csv.write(toFile: csvPath, atomically: true, encoding: .utf8) } catch { print("\(csvPath): \(error)") }
}

// MARK: - Bám cơ

/// `x1,y1,x2,y2@t` → trục pixel ảnh đứng gốc trên trái tại giây t.
func parseAxis(_ s: String) -> CueAxis? {
  let parts = s.split(separator: "@")
  let v = parts.first?.split(separator: ",").compactMap { Double($0) } ?? []
  guard parts.count == 2, v.count == 4, let t = Double(parts[1]) else { return nil }
  return CueAxis(a: CGPoint(x: v[0], y: v[1]), b: CGPoint(x: v[2], y: v[3]), t: t)
}

/// Mỗi khung một dòng: góc trục đo, lệch góc và lệch ngang so với trục cho sẵn (đã dời theo rung máy, như màn clip),
/// độ tin cậy, và tracker đã dừng chưa. Ô trống là khung không có ước lượng.
func runCue(_ path: String, _ ref: CueAxis, to csvPath: String?) {
  guard let (info, all) = load(path, band: defaultShakeBand) else { return }
  var limits = CueLimits()
  limits.halfWidth = cueHalfWidth(all)
  let sem = DispatchSemaphore(value: 0)
  var got: CueTrack?
  Task.detached {
    do { got = try await trackCue(url: URL(fileURLWithPath: path), info: info, frames: all, axes: [ref], limits: limits) }
    catch { print("\(path): \(error)") }
    sem.signal()
  }
  sem.wait()
  guard let got, let k = nearestFrame(all, ref.t) else { return }
  var csv = "t,angle,deviation,offset,confidence,lost\n"
  var devs: [Double] = []
  var seen = 0
  for (i, f) in all.enumerated() where i >= k {
    let dx = f.shift.dx - all[k].shift.dx, dy = f.shift.dy - all[k].shift.dy
    let shifted = CueAxis(a: CGPoint(x: ref.a.x + dx, y: ref.a.y + dy), b: CGPoint(x: ref.b.x + dx, y: ref.b.y + dy), t: ref.t)
    var row = String(format: "%.4f", f.t)
    if let e = got.estimates[i] {
      seen += 1
      let dev = axisDeviation(e.axis, shifted)
      devs.append(abs(dev))
      let mid = CGPoint(x: (e.axis.a.x + e.axis.b.x) / 2, y: (e.axis.a.y + e.axis.b.y) / 2)
      row += String(format: ",%.2f,%.2f,%.1f,%.2f", e.axis.angle, dev, shifted.offset(mid) ?? .nan, e.confidence)
    } else {
      row += ",,,,"
    }
    csv += row + (got.lost[i] ? ",1\n" : ",0\n")
  }
  let n = all.count - k
  print(String(format: "%@: dải ±%.0f px, có ước lượng %d/%d khung (%.0f%%), |lệch góc| trung vị %.2f°, lớn nhất %.2f°%@",
               (path as NSString).lastPathComponent, limits.halfWidth, seen, n, 100 * Double(seen) / Double(max(1, n)),
               devs.isEmpty ? .nan : median(devs), devs.max() ?? .nan,
               got.lost.firstIndex(of: true).map { String(format: ", mất cơ từ %.2f s", all[$0].t) } ?? ""))
  if let csvPath {
    do { try csv.write(toFile: csvPath, atomically: true, encoding: .utf8) } catch { print("\(csvPath): \(error)") }
  }
}

// MARK: - Sai số so với nhãn tay

/// Một khung gán nhãn tay. Pixel ảnh đứng gốc trên trái, như màn clip; ô trống là không gán.
struct Label {
  var t: Double
  var wrist: CGPoint?
  var elbow: CGPoint?
  var cue: CueAxis?
  var phase: RearPhase?
}

func readLabels(_ path: String) -> [Label]? {
  guard let text = try? String(contentsOfFile: path, encoding: .utf8) else { return nil }
  return text.split(whereSeparator: \.isNewline).dropFirst().compactMap { line in
    let c = line.split(separator: ",", omittingEmptySubsequences: false).map { $0.trimmingCharacters(in: .whitespaces) }
    guard c.count >= 10, let t = Double(c[0]) else { return nil }
    let d = c.map(Double.init)
    func point(_ i: Int) -> CGPoint? { d[i].flatMap { x in d[i + 1].map { CGPoint(x: x, y: $0) } } }
    var l = Label(t: t, wrist: point(1), elbow: point(3), phase: RearPhase(rawValue: c[9]))
    if let a = point(5), let b = point(7) { l.cue = CueAxis(a: a, b: b, t: t) }
    return l
  }
}

/// Phần tử thứ p (0…1) của mảng đã sắp, lấy theo hạng gần nhất.
func quantile(_ v: [Double], _ p: Double) -> Double {
  guard !v.isEmpty else { return .nan }
  let s = v.sorted()
  let rank = Int((p * Double(s.count)).rounded(.up)) - 1
  return s[max(0, min(s.count - 1, rank))]
}

/// Chạy đúng lõi màn clip (Vision, rung máy, RearTracker, bám cơ từ trục nhãn đầu tiên) rồi so từng khung có nhãn.
/// Lệch ngang tính so với trục nhãn đầu tiên đã dời theo rung, chia cho cẳng tay nhãn của khung đó, như số app hiện.
/// Mốc pha: mỗi lần nhãn đổi pha, tìm lần tracker đổi sang cùng pha gần nhất, đếm khung lệch. Nhãn thưa thì sai số này
/// gồm cả khoảng cách giữa hai khung nhãn.
func runEval(_ path: String, labelsPath: String) {
  guard let labels = readLabels(labelsPath), !labels.isEmpty else { return print("\(labelsPath): không đọc được nhãn") }
  let clock = ContinuousClock()
  var loaded: (ClipInfo, [PoseFrame])?
  let visionTime = clock.measure { loaded = load(path, band: defaultShakeBand) }
  guard let (info, all) = loaded, !all.isEmpty else { return }
  let tracker = RearTracker(limits: rearLimits)
  let phaseTime = clock.measure { for f in all { tracker.push(RearSample(f, info)) } }

  let ref = labels.first { $0.cue != nil }?.cue
  var cue: CueTrack?
  var cueTime = Duration.zero
  if let ref {
    var cl = CueLimits()
    cl.halfWidth = cueHalfWidth(all)
    cueTime = clock.measure {
      let sem = DispatchSemaphore(value: 0)
      Task.detached {
        cue = try? await trackCue(url: URL(fileURLWithPath: path), info: info, frames: all, axes: [ref], limits: cl)
        sem.signal()
      }
      sem.wait()
    }
  }
  let refFrame = ref.flatMap { nearestFrame(all, $0.t) }
  func shifted(_ i: Int) -> CueAxis? {
    guard let ref, let k = refFrame else { return nil }
    let dx = all[i].shift.dx - all[k].shift.dx, dy = all[i].shift.dy - all[k].shift.dy
    return CueAxis(a: CGPoint(x: ref.a.x + dx, y: ref.a.y + dy), b: CGPoint(x: ref.b.x + dx, y: ref.b.y + dy), t: ref.t)
  }

  let dt = info.fps > 0 ? 1 / info.fps : 1.0 / 30
  var wrist: [Double] = [], elbow: [Double] = [], cueAngle: [Double] = [], phaseHit = 0, phaseN = 0
  var missed = 0
  for l in labels {
    guard let i = nearestFrame(all, l.t), abs(all[i].t - l.t) <= dt / 2 + 1e-4 else { missed += 1; continue }
    let f = all[i]
    let L = l.wrist.flatMap { w in l.elbow.map { e in hypot(Double(w.x - e.x), Double(w.y - e.y)) } }
    if let axis = shifted(i), let L, L > 4 {
      for (got, want, into) in [(f.wrist, l.wrist, 0), (f.elbow, l.elbow, 1)] {
        guard let want, let a = axis.offset(want) else { continue }
        // Vision không thấy khớp mà nhãn có: tính là sai 1 L, để mất khớp không làm số đẹp lên.
        let e = got.map(info.upright).flatMap(axis.offset).map { abs($0 - a) / L } ?? 1
        if into == 0 { wrist.append(e) } else { elbow.append(e) }
      }
    }
    if let want = l.cue, cue != nil, i >= (refFrame ?? .max) {
      cueAngle.append(cue?.estimates[i].map { abs(axisDeviation($0.axis, want)) } ?? 90)
    }
    if let p = l.phase {
      phaseN += 1
      if tracker.phases[i] == p { phaseHit += 1 }
    }
  }

  // Mốc pha: chỗ nhãn đổi pha so với chỗ tracker đổi sang cùng pha gần nhất.
  let detected = zip(tracker.phases.indices.dropFirst(), zip(tracker.phases, tracker.phases.dropFirst()))
    .filter { $1.0 != $1.1 }.map { (t: all[$0].t, phase: $1.1) }
  let marked = labels.filter { $0.phase != nil }
  var boundary: [Double] = []
  for (a, b) in zip(marked, marked.dropFirst()) where a.phase != b.phase {
    let near = detected.filter { $0.phase == b.phase }.map { abs($0.t - b.t) }.min()
    boundary.append((near ?? info.duration) / dt)
  }

  func line(_ name: String, _ v: [Double], _ unit: String, limit: Double) {
    let med = v.isEmpty ? Double.nan : median(v)
    let p90 = quantile(v, 0.9)
    print(String(format: "  %@ n %3d  trung vị %6.3f  p90 %6.3f %@%@", name.padding(toLength: 18, withPad: " ", startingAt: 0), v.count, med, p90, unit,
                 v.isEmpty ? "" : p90 > limit ? "  → experimental (ngưỡng \(limit) \(unit))" : "  trong ngưỡng"))
  }
  print("\((path as NSString).lastPathComponent) so với \((labelsPath as NSString).lastPathComponent): " +
        "\(labels.count) nhãn, \(missed) nhãn không khớp khung nào" + (ref == nil ? ", không có nhãn trục cơ" : ""))
  line("cổ tay lệch ngang", wrist, "L", limit: 0.1)
  line("khuỷu lệch ngang", elbow, "L", limit: 0.1)
  line("góc cơ", cueAngle, "°", limit: 2)
  line("mốc pha", boundary, "khung", limit: 3)
  print(String(format: "  pha đúng ở %d/%d khung có nhãn", phaseHit, phaseN))
  let ms = { (d: Duration) in Double(d.components.seconds) * 1000 + Double(d.components.attoseconds) / 1e15 }
  let n = Double(all.count)
  print(String(format: "  ms mỗi khung: Vision + rung %.2f, pha %.3f, bám cơ %.2f (%d khung, máy Mac, không phải iPhone)",
               ms(visionTime) / n, ms(phaseTime) / n, ms(cueTime) / n, all.count))
}

// MARK: - Ảnh lúc chạm

/// Lượt đọc thứ hai, ghi `cu-NN.png` cho khung tracker đã chấm góc của từng cú.
/// Đọc lại clip thay vì giữ khung trong RAM suốt lượt đầu.
func saveContactFrames(
  _ asset: AVURLAsset, _ track: AVAssetTrack, _ orientation: CGImagePropertyOrientation, _ shots: [Shot],
  to dir: String
) {
  guard let pass = openReader(asset, track) else { return print("\(dir): không đọc lại được clip") }
  try? FileManager.default.createDirectory(atPath: dir, withIntermediateDirectories: true)
  let ci = CIContext()
  var k = 0
  while k < shots.count, let sb = pass.1.copyNextSampleBuffer() {
    let t = CMSampleBufferGetPresentationTimeStamp(sb).seconds
    while k < shots.count, t > shots[k].frame.t + 1e-4 { k += 1 }
    guard k < shots.count, abs(t - shots[k].frame.t) < 1e-4, let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
    let file = (dir as NSString).appendingPathComponent(String(format: "cu-%02d.png", shots[k].n))
    let raw = CIImage(cvPixelBuffer: pb)
    if let frame = ci.createCGImage(raw, from: raw.extent), let img = drawContact(frame, shots[k], orientation, ci),
       writePNG(img, file) {
      print("ảnh \(file)")
    } else {
      print("\(file): không ghi được")
    }
    k += 1
  }
}

/// Vẽ thẳng lên buffer gốc bằng toạ độ tracker dùng (gốc dưới trái như CGContext), rồi mới xoay đứng ảnh để xem.
/// Đường vẽ vì thế không qua phép đổi toạ độ nào: lệch khỏi cẳng tay là Vision lệch, không phải ảnh vẽ sai.
func drawContact(_ frame: CGImage, _ s: Shot, _ o: CGImagePropertyOrientation, _ ci: CIContext) -> CGImage? {
  func canvas(_ w: Int, _ h: Int) -> CGContext? {
    CGContext(
      data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0,
      space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)
  }
  let f = s.frame
  guard let ctx = canvas(frame.width, frame.height), let sh = f.shoulder, let el = f.elbow, let wr = f.wrist else {
    return nil
  }
  ctx.draw(frame, in: CGRect(x: 0, y: 0, width: frame.width, height: frame.height))
  let lw = CGFloat(max(frame.width, frame.height)) / 300
  ctx.setLineWidth(lw)
  ctx.setLineCap(.round)
  ctx.setLineJoin(.round)

  // Dây dọi từ khuỷu theo hướng xuống, dài 1,3 cẳng tay như overlay trong app.
  let l = hypot(wr.x - el.x, wr.y - el.y) * 1.3
  ctx.setStrokeColor(CGColor(red: 0.3, green: 0.85, blue: 1, alpha: 1))
  ctx.setLineDash(phase: 0, lengths: [lw * 3, lw * 2])
  ctx.strokeLineSegments(between: [el, CGPoint(x: el.x + f.down.dx * l, y: el.y + f.down.dy * l)])
  ctx.setLineDash(phase: 0, lengths: [])

  // Vàng khi cẳng tay lúc chạm trong dung sai, trắng khi lệch, cùng luật màu với overlay.
  let ok = abs(s.report.forearmContact) <= limits.forearm
  let color = ok ? CGColor(red: 216 / 255, green: 180 / 255, blue: 81 / 255, alpha: 1) : CGColor(gray: 1, alpha: 1)
  ctx.setStrokeColor(color)
  ctx.setFillColor(color)
  ctx.addLines(between: [sh, el, wr])
  ctx.strokePath()
  for p in [sh, el, wr] { ctx.fillEllipse(in: CGRect(x: p.x - lw * 1.5, y: p.y - lw * 1.5, width: lw * 3, height: lw * 3)) }

  guard let drawn = ctx.makeImage() else { return nil }
  let upright = CIImage(cgImage: drawn).oriented(o)
  guard let img = ci.createCGImage(upright, from: upright.extent), let out = canvas(img.width, img.height) else {
    return nil
  }
  let w = CGFloat(img.width), h = CGFloat(img.height)
  out.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))

  let size = min(w, h) / 28
  let label = String(
    format: "cú %02d · %.2fs · cẳng tay %+.1f° · %@", s.n, s.report.contact, s.report.forearmContact,
    s.report.fault.rawValue)
  let line = CTLineCreateWithAttributedString(NSAttributedString(string: label, attributes: [
    kCTFontAttributeName as NSAttributedString.Key: CTFontCreateWithName("Helvetica-Bold" as CFString, size, nil),
    kCTForegroundColorAttributeName as NSAttributedString.Key: CGColor(gray: 1, alpha: 1),
  ]))
  out.setFillColor(CGColor(gray: 0, alpha: 0.6))
  out.fill(CGRect(x: 0, y: h - size * 1.8, width: w, height: size * 1.8))
  out.textPosition = CGPoint(x: size / 2, y: h - size * 1.3)
  CTLineDraw(line, out)
  return out.makeImage()
}

func writePNG(_ img: CGImage, _ path: String) -> Bool {
  guard let d = CGImageDestinationCreateWithURL(URL(fileURLWithPath: path) as CFURL, "public.png" as CFString, 1, nil)
  else { return false }
  CGImageDestinationAddImage(d, img, nil)
  return CGImageDestinationFinalize(d)
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
  // Mỗi lần xoay là một ảnh mới, tâm người đổi chỗ, nên mỗi lần một khoá mới.
  var lock = PoseLock()
  let upright = PoseFrame(
    observations: detect(VNImageRequestHandler(cgImage: raw, orientation: .up)), lock: &lock, side: side, orientation: .up,
    size: CGSize(width: 1, height: 1), down: CGVector(dx: 0, dy: -1), t: 0, minConfidence: limits.minConfidence)
  guard let e0 = upright.elbow, let w0 = upright.wrist else { return print("ảnh gốc không thấy khuỷu và cổ tay") }

  var down = CGVector(dx: 0, dy: -1)
  var e = e0, w = w0
  var worst = 0.0
  for k in 0..<4 {
    let o = PoseOrientation.vision(for: down)
    lock = PoseLock()
    let f = PoseFrame(
      observations: detect(VNImageRequestHandler(cgImage: raw, orientation: o)), lock: &lock, side: side, orientation: o,
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

// MARK: - Unit

/// Ghi clip xám `w`×`h`, `n` khung ở `fps`, với `transform` như máy quay để lại. Dùng cho case cần một file thật.
func makeClip(_ path: String, w: Int, h: Int, n: Int, fps: Int32, transform: CGAffineTransform = .identity) -> Bool {
  try? FileManager.default.removeItem(atPath: path)
  guard let writer = try? AVAssetWriter(outputURL: URL(fileURLWithPath: path), fileType: .mov) else { return false }
  let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: w, AVVideoHeightKey: h,
  ])
  input.transform = transform
  let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA, kCVPixelBufferWidthKey as String: w,
    kCVPixelBufferHeightKey as String: h,
  ])
  writer.add(input)
  guard writer.startWriting() else { return false }
  writer.startSession(atSourceTime: .zero)
  for i in 0..<n {
    while !input.isReadyForMoreMediaData { usleep(1000) }
    var pb: CVPixelBuffer?
    guard let pool = adaptor.pixelBufferPool, CVPixelBufferPoolCreatePixelBuffer(nil, pool, &pb) == kCVReturnSuccess,
          let pb else { return false }
    CVPixelBufferLockBaseAddress(pb, [])
    memset(CVPixelBufferGetBaseAddress(pb), Int32(64 + i % 64), CVPixelBufferGetDataSize(pb))
    CVPixelBufferUnlockBaseAddress(pb, [])
    adaptor.append(pb, withPresentationTime: CMTime(value: CMTimeValue(i), timescale: fps))
  }
  input.markAsFinished()
  let sem = DispatchSemaphore(value: 0)
  writer.finishWriting { sem.signal() }
  sem.wait()
  return writer.status == .completed
}

/// Phần hình học và vòng đọc clip, không cần clip thật. Mỗi case một dòng `ok` hoặc `FAIL` kèm số.
func unit() -> Int {
  var failed = 0
  func check(_ ok: Bool, _ name: String, _ detail: String = "") {
    if !ok { failed += 1 }
    print("\(ok ? "ok  " : "FAIL") \(name)\(detail.isEmpty ? "" : ": \(detail)")")
  }
  func near(_ p: CGPoint, _ q: CGPoint, _ eps: CGFloat) -> Bool { hypot(p.x - q.x, p.y - q.y) < eps }

  // Bốn hướng: buffer → ảnh đứng → buffer về đúng chỗ, và cỡ ảnh đứng hoán đổi khi xoay 90°.
  for o in [CGImagePropertyOrientation.up, .right, .down, .left] {
    let info = ClipInfo(bufferSize: CGSize(width: 1920, height: 1080), fps: 60, duration: 1, orientation: o, down: .zero)
    let pts = [CGPoint(x: 0, y: 0), CGPoint(x: 1920, y: 1080), CGPoint(x: 300, y: 900), CGPoint(x: 1500, y: 40)]
    let worst = pts.map { p -> CGFloat in let q = info.buffer(info.upright(p)); return hypot(p.x - q.x, p.y - q.y) }.max()!
    let swapped = info.size.width == 1080
    check(worst < 1e-6 && swapped == (o == .right || o == .left), "upright ↔ buffer .\(name(o))",
          String(format: "lệch %.2g px, ảnh đứng %.0f×%.0f", worst, info.size.width, info.size.height))
  }
  // Clip quay dọc: transform (a 0, b 1, c −1, d 0, tx h) đưa pixel trên trái (x, y) của buffer tới (h − y, x) trên màn.
  // Gốc dưới trái của buffer (pixel trên trái (0, 1080)) ra góc trên trái ảnh đứng, góc trên trái buffer ra góc trên phải.
  let portrait = ClipInfo(bufferSize: CGSize(width: 1920, height: 1080), fps: 60, duration: 1, orientation: .right, down: .zero)
  let bl = portrait.upright(CGPoint(x: 0, y: 0)), tl = portrait.upright(CGPoint(x: 0, y: 1080))
  check(near(bl, CGPoint(x: 0, y: 0), 1e-6) && near(tl, CGPoint(x: 1080, y: 0), 1e-6), "góc buffer .right",
        String(format: "dưới trái → (%.0f, %.0f), trên trái → (%.0f, %.0f)", bl.x, bl.y, tl.x, tl.y))

  // Video ngang trong view dọc và ngang: góc ảnh rơi đúng góc rect, đổi đi đổi về sai < 0,5 px.
  let wide = ClipInfo(bufferSize: CGSize(width: 1920, height: 1080), fps: 60, duration: 1, orientation: .up, down: .zero)
  for bounds in [CGRect(x: 0, y: 0, width: 390, height: 844), CGRect(x: 0, y: 0, width: 844, height: 390)] {
    let r = videoRect(wide, in: bounds)
    let c0 = viewPoint(.zero, wide, r), c1 = viewPoint(CGPoint(x: 1920, y: 1080), wide, r)
    let probe = CGPoint(x: r.midX + 37.3, y: r.midY - 12.9)
    let back = viewPoint(imagePoint(probe, wide, r), wide, r)
    let ratio = r.width / r.height
    check(near(c0, CGPoint(x: r.minX, y: r.minY), 0.5) && near(c1, CGPoint(x: r.maxX, y: r.maxY), 0.5)
          && near(probe, back, 0.5) && abs(ratio - 16 / 9) < 0.01 && bounds.contains(r.insetBy(dx: 0.01, dy: 0.01)),
          "videoRect \(Int(bounds.width))×\(Int(bounds.height))",
          String(format: "rect (%.1f, %.1f, %.1f, %.1f)", r.minX, r.minY, r.width, r.height))
  }

  // Lệch ngang có dấu, trục dọc ảnh như máy sau lưng.
  let up = CueAxis(a: CGPoint(x: 100, y: 400), b: CGPoint(x: 100, y: 0), t: 0)
  let flipped = CueAxis(a: up.b, b: up.a, t: 0)
  let right = up.offset(CGPoint(x: 110, y: 50)) ?? .nan, on = up.offset(CGPoint(x: 100, y: 50)) ?? .nan
  let rightFlipped = flipped.offset(CGPoint(x: 110, y: 50)) ?? .nan
  check(abs(right - 10) < 1e-9 && abs(on) < 1e-9 && abs(rightFlipped - 10) < 1e-9, "lệch ngang có dấu",
        String(format: "phải %+.1f, trên trục %+.1f, trục ngược %+.1f", right, on, rightFlipped))
  let left = up.offset(CGPoint(x: 92, y: 300)) ?? .nan
  check(abs(left + 8) < 1e-9, "lệch ngang phía trái âm", String(format: "%+.1f", left))

  // Trục không có chiều: 0° và 179° lệch 1°.
  let a0 = CueAxis(a: .zero, b: CGPoint(x: 100, y: 0), t: 0)
  let r = 179 * Double.pi / 180
  let a179 = CueAxis(a: .zero, b: CGPoint(x: 100 * cos(r), y: 100 * sin(r)), t: 0)
  let dev = axisDeviation(a179, a0)
  check(abs(abs(dev) - 1) < 1e-6, "axisDeviation 0° và 179°", String(format: "%+.3f°", dev))
  let a3 = CueAxis(a: .zero, b: CGPoint(x: 100 * cos(0.0523599), y: 100 * sin(0.0523599)), t: 0)
  check(abs(axisDeviation(a3, a0) - 3) < 1e-3, "axisDeviation +3° theo chiều kim đồng hồ",
        String(format: "%+.3f°", axisDeviation(a3, a0)))

  // ClipMeasure: cổ tay phải trục 20 px, cẳng tay 100 px → 0,2 L.
  var f = PoseFrame(t: 0, down: CGVector(dx: 0, dy: -1))
  f.elbow = wide.buffer(CGPoint(x: 100, y: 200))
  f.wrist = wide.buffer(CGPoint(x: 120, y: 298))
  let m = ClipMeasure(f, wide, axis: up)
  check(abs((m.wrist ?? .nan) - 20) < 1e-6 && abs((m.wristL ?? .nan) - 20 / hypot(20, 98)) < 1e-6
        && abs(m.elbow ?? .nan) < 1e-6, "ClipMeasure lệch theo L",
        String(format: "cổ tay %+.1f px = %+.3f L, khuỷu %+.1f px", m.wrist ?? .nan, m.wristL ?? .nan, m.elbow ?? .nan))

  // Tìm khung gần nhất.
  let ts = [0.0, 0.1, 0.2, 0.3].map { PoseFrame(t: $0, down: .zero) }
  check(nearestFrame(ts, 0.14) == 1 && nearestFrame(ts, 0.16) == 2 && nearestFrame(ts, -1) == 0
        && nearestFrame(ts, 9) == 3 && nearestFrame([], 0) == nil, "nearestFrame")

  // Clip thật trên đĩa: transform xoay ra cỡ đứng hoán đổi; huỷ giữa chừng ném CancellationError.
  let dir = NSTemporaryDirectory()
  let rotated = (dir as NSString).appendingPathComponent("pose-unit-rot.mov")
  let long = (dir as NSString).appendingPathComponent("pose-unit-long.mov")
  if makeClip(rotated, w: 320, h: 180, n: 10, fps: 30, transform: CGAffineTransform(a: 0, b: 1, c: -1, d: 0, tx: 180, ty: 0)),
     makeClip(long, w: 320, h: 180, n: 300, fps: 30) {
    let sem = DispatchSemaphore(value: 0)
    var rotInfo: ClipInfo?, rotFrames = -1, cancelled = false, partial = false
    Task.detached {
      if let (i, fr) = try? await analyzeClip(url: URL(fileURLWithPath: rotated), side: .right, minConfidence: 0.4) {
        rotInfo = i
        rotFrames = fr.count
      }
      let job = Task {
        try await analyzeClip(url: URL(fileURLWithPath: long), side: .right, minConfidence: 0.4) { p in
          if p >= 0.1 { withUnsafeCurrentTask { $0?.cancel() } }
        }
      }
      do { _ = try await job.value; partial = true } catch is CancellationError { cancelled = true } catch {}
      sem.signal()
    }
    sem.wait()
    check(rotInfo?.orientation == .right && rotInfo?.size == CGSize(width: 180, height: 320) && rotFrames == 10,
          "clip xoay 90°", "Vision .\(rotInfo.map { name($0.orientation) } ?? "—"), ảnh đứng \(rotInfo.map { "\(Int($0.size.width))×\(Int($0.size.height))" } ?? "—"), \(rotFrames) khung")
    check(cancelled && !partial, "analyzeClip huỷ giữa chừng", cancelled ? "CancellationError" : "trả mảng")
  } else {
    check(false, "ghi clip thử")
  }
  try? FileManager.default.removeItem(atPath: rotated)
  try? FileManager.default.removeItem(atPath: long)

  // PoseFilter: một khung nhảy vọt bị bỏ, khung nil trả nil và xoá cửa sổ.
  var pf = PoseFilter()
  let outs = [10, 10, 10, 100, 10].map { pf.push($0) }
  let afterGap = [pf.push(nil), pf.push(50)]
  check(outs.allSatisfy { abs(($0 ?? .nan) - 10) < 1e-9 } && afterGap[0] == nil && afterGap[1] == 50,
        "PoseFilter bỏ khung nhảy, nil xoá cửa sổ", outs.map { String(format: "%.1f", $0 ?? .nan) }.joined(separator: " "))
  check(abs(median([3, 1, 2]) - 2) < 1e-9 && abs(median([4, 1, 3, 2]) - 2.5) < 1e-9 && median([]) == 0, "median")

  // frameShift: dời vân ảnh một đoạn biết trước, đọc ra đúng chiều trong ảnh đứng gốc trên trái.
  for (o, move) in [(CGImagePropertyOrientation.up, (7, 4)), (.up, (-5, 0)), (.right, (6, -3))] {
    let info = ClipInfo(bufferSize: CGSize(width: 320, height: 240), fps: 30, duration: 1, orientation: o, down: .zero)
    guard let a = texture(320, 240, dx: 0, dy: 0), let b = texture(320, 240, dx: move.0, dy: move.1) else {
      check(false, "frameShift tạo buffer"); continue
    }
    // Vân dời (dx, dy) pixel trên trái của buffer = (dx, −dy) gốc dưới trái; quy ra ảnh đứng qua `upright`.
    let p0 = CGPoint(x: 160, y: 120), p1 = CGPoint(x: 160 + CGFloat(move.0), y: 120 - CGFloat(move.1))
    let want = CGVector(dx: info.upright(p1).x - info.upright(p0).x, dy: info.upright(p1).y - info.upright(p0).y)
    let got = frameShift(a, b, orientation: o, band: CGRect(x: 0, y: 0, width: 1, height: 1))
    let bandGot = frameShift(a, b, orientation: o, band: defaultShakeBand)
    func ok(_ v: CGVector?) -> Bool { v.map { hypot($0.dx - want.dx, $0.dy - want.dy) < 0.6 } ?? false }
    check(ok(got) && ok(bandGot), "frameShift .\(name(o)) dời \(move)",
          String(format: "muốn (%+.1f, %+.1f), cả khung (%+.2f, %+.2f), dải dưới (%+.2f, %+.2f)", want.dx, want.dy,
                 got?.dx ?? .nan, got?.dy ?? .nan, bandGot?.dx ?? .nan, bandGot?.dy ?? .nan))
  }

  // Trôi quá 5% cạnh ngắn giữa hai khung liền là đo hỏng, trả nil.
  if let a = texture(320, 240, dx: 0, dy: 0), let b = texture(320, 240, dx: 30, dy: 0) {
    let far = frameShift(a, b, orientation: .up, band: CGRect(x: 0, y: 0, width: 1, height: 1))
    check(far == nil, "frameShift bỏ cú trôi quá lớn", far.map { String(format: "(%+.1f, %+.1f)", $0.dx, $0.dy) } ?? "nil")
  }

  // rearStrokes trên dãy pha dựng tay: cú có pause, cú không pause, đoạn thiếu follow không tính.
  let seq: [RearPhase] = [.address, .address, .backswing, .backswing, .pause, .pause, .pause, .forward, .follow, .follow,
                          .complete, .address, .backswing, .forward, .follow, .unknown, .backswing, .forward, .address]
  let found = rearStrokes(seq, times: seq.indices.map { Double($0) * 0.1 })
  let want = [RearStroke(address: 1, start: 2, back: 6, follow: 8, end: 9, pause: 0.2),
              RearStroke(address: 11, start: 12, back: 12, follow: 14, end: 14, pause: nil)]
  check(found.count == 2 && zip(found, want).allSatisfy { f, w in
    f.address == w.address && f.start == w.start && f.back == w.back && f.follow == w.follow && f.end == w.end
      && (f.pause == nil) == (w.pause == nil) && abs((f.pause ?? 0) - (w.pause ?? 0)) < 1e-9
  }, "rearStrokes", "\(found.count) cú")

  // RearTracker: ba cú thật, trước mỗi cú hai lần feather, đứng dậy giữa các cú, rồi một cú mất tay 0,7 s.
  let (samples, _) = rearScript()
  let tracker = RearTracker()
  var done = 0
  for x in samples where tracker.push(x) { done += 1 }
  let strokes = rearStrokes(tracker.phases, times: samples.map(\.t))
  let practice = tracker.phases.filter { $0 == .practice }.count
  let pauses = strokes.compactMap(\.pause)
  check(done == 3 && tracker.strokes == 3 && strokes.count == 3 && practice > 0
        && pauses.count == 3 && pauses.allSatisfy { abs($0 - 0.3) < 0.12 },
        "RearTracker 3 cú, feather và mất tay không đếm",
        "\(done) cú báo, \(strokes.count) cú tìm lại, \(practice) khung practice, dừng "
          + pauses.map { String(format: "%.2f", $0) }.joined(separator: " "))

  // EdgeBandCueTracker: vạch sáng nghiêng 3° trên nền nhiễu, trục chấm nằm ngang lệch vài pixel; xoá vạch thì nil, ba
  // khung liền nil thì dừng bám.
  let cueInfo = ClipInfo(bufferSize: CGSize(width: 1280, height: 720), fps: 30, duration: 1, orientation: .up, down: .zero)
  if let withCue = stick(1280, 720, angle: 3, width: 8), let blank = stick(1280, 720, angle: 3, width: 0) {
    var cue = EdgeBandCueTracker(info: cueInfo)
    cue.reset(CueAxis(a: CGPoint(x: 300, y: 365), b: CGPoint(x: 980, y: 365), t: 0))
    let first = cue.track(withCue, t: 0, wrist: nil)
    let second = cue.track(withCue, t: 1 / 30.0, wrist: nil)
    check(first.map { abs($0.axis.angle - 3) < 0.3 } == true && second.map { abs($0.axis.angle - 3) < 0.3 } == true,
          "EdgeBandCueTracker vạch 3°",
          [first, second].map { $0.map { String(format: "%.3f° tin %.2f", $0.axis.angle, $0.confidence) } ?? "nil" }
            .joined(separator: ", "))
    let turned = stick(1280, 720, angle: 4.5, width: 8).flatMap { cue.track($0, t: 1.5 / 30, wrist: nil) }
    check(turned.map { abs($0.axis.angle - 4.5) < 0.3 } == true, "EdgeBandCueTracker bám khi cơ quay 1,5°",
          turned.map { String(format: "%.3f°", $0.axis.angle) } ?? "nil")
    let misses = (0..<3).map { k in cue.track(blank, t: Double(2 + k) / 30, wrist: nil) }
    check(misses.allSatisfy { $0 == nil } && cue.lost, "EdgeBandCueTracker xoá vạch thì nil rồi dừng",
          "lost \(cue.lost), " + misses.map { $0.map { String(format: "%.2f° tin %.2f", $0.axis.angle, $0.confidence) } ?? "nil" }.joined(separator: ", "))
    // Cổ tay xa vạch hẳn thì vạch đó không phải cây cơ đang cầm.
    var far = EdgeBandCueTracker(info: cueInfo)
    far.reset(CueAxis(a: CGPoint(x: 300, y: 365), b: CGPoint(x: 980, y: 365), t: 0))
    check(far.track(withCue, t: 0, wrist: CGPoint(x: 640, y: 100)) == nil, "EdgeBandCueTracker loại đường xa cổ tay")
  } else {
    check(false, "EdgeBandCueTracker tạo buffer")
  }
  return failed
}

/// Ảnh BGRA vân ô 8 px xám ngẫu nhiên cố định, dời `dx`, `dy` pixel trên trái.
func texture(_ w: Int, _ h: Int, dx: Int, dy: Int) -> CVPixelBuffer? {
  var pb: CVPixelBuffer?
  guard CVPixelBufferCreate(nil, w, h, kCVPixelFormatType_32BGRA, nil, &pb) == kCVReturnSuccess, let pb else { return nil }
  CVPixelBufferLockBaseAddress(pb, [])
  defer { CVPixelBufferUnlockBaseAddress(pb, []) }
  let row = CVPixelBufferGetBytesPerRow(pb)
  let base = CVPixelBufferGetBaseAddress(pb)!.assumingMemoryBound(to: UInt8.self)
  for y in 0..<h {
    for x in 0..<w {
      let bx = (x - dx + 1024) / 8, by = (y - dy + 1024) / 8
      var v = UInt64(bx) << 32 | UInt64(by)
      v = (v ^ (v >> 30)) &* 0xbf58476d1ce4e5b9
      v = (v ^ (v >> 27)) &* 0x94d049bb133111eb
      let g = UInt8(truncatingIfNeeded: (v ^ (v >> 31)) >> 56)
      let px = base + y * row + x * 4
      px[0] = g; px[1] = g; px[2] = g; px[3] = 255
    }
  }
  return pb
}

/// Ảnh BGRA nền xám nhiễu cố định quanh 80, cộng một vạch sáng 200 rộng `width` pixel qua tâm, nghiêng `angle` độ theo
/// chiều kim đồng hồ trên ảnh gốc trên trái. Mép vạch khử răng cưa một pixel.
func stick(_ w: Int, _ h: Int, angle: Double, width: Double) -> CVPixelBuffer? {
  var pb: CVPixelBuffer?
  guard CVPixelBufferCreate(nil, w, h, kCVPixelFormatType_32BGRA, nil, &pb) == kCVReturnSuccess, let pb else { return nil }
  CVPixelBufferLockBaseAddress(pb, [])
  defer { CVPixelBufferUnlockBaseAddress(pb, []) }
  let row = CVPixelBufferGetBytesPerRow(pb)
  let base = CVPixelBufferGetBaseAddress(pb)!.assumingMemoryBound(to: UInt8.self)
  let a = angle * .pi / 180, nx = -sin(a), ny = cos(a)
  let cx = Double(w) / 2, cy = Double(h) / 2
  for y in 0..<h {
    for x in 0..<w {
      var v = UInt64(x) << 32 | UInt64(y)
      v = (v ^ (v >> 30)) &* 0xbf58476d1ce4e5b9
      v = (v ^ (v >> 27)) &* 0x94d049bb133111eb
      let noise = Double((v ^ (v >> 31)) >> 59) - 16
      let d = abs((Double(x) + 0.5 - cx) * nx + (Double(y) + 0.5 - cy) * ny)
      let cover = width > 0 ? min(1, max(0, width / 2 + 0.5 - d)) : 0
      let g = UInt8(max(0, min(255, 80 + noise + (200 - 80) * cover)))
      let px = base + y * row + x * 4
      px[0] = g; px[1] = g; px[2] = g; px[3] = 255
    }
  }
  return pb
}

/// Kịch bản tay sau lưng 60 fps, cổ tay đi dọc trên ảnh (gốc trên trái, xuống là lùi cơ), khuỷu đứng yên cách 100 px.
/// Trả thêm số cú thật trong kịch bản.
func rearScript() -> ([RearSample], Int) {
  var out: [RearSample] = []
  var t = 0.0, y = 0.0
  let elbow = CGPoint(x: 500, y: 300)
  func go(_ to: Double, _ dur: Double) {
    let from = y, n = max(1, Int(dur * 60))
    for k in 1...n {
      y = from + (to - from) * Double(k) / Double(n)
      let jitter = 0.4 * sin(Double(out.count) * 2.3)
      out.append(RearSample(t: t, wrist: CGPoint(x: 500, y: 400 + y + jitter), elbow: elbow, confidence: 1))
      t += 1.0 / 60
    }
  }
  func lost(_ dur: Double) {
    for _ in 0..<Int(dur * 60) {
      out.append(RearSample(t: t, wrist: nil, elbow: nil, confidence: 0))
      t += 1.0 / 60
    }
  }
  for k in 0..<3 {
    go(0, 0.8)
    for _ in 0..<2 {
      go(15, 0.3); go(-2, 0.25); go(0, 0.1); go(0, 0.5)
    }
    go(30, 0.5); go(30, 0.3); go(-25, 0.25); go(-25, 0.8)
    if k < 2 { go(-120, 0.6); go(-90, 1.0); go(0, 0.6) }
  }
  go(-120, 0.6); go(0, 0.6); go(0, 0.8)
  go(30, 0.5); lost(0.7); go(-25, 0.2); go(-25, 0.8); go(0, 0.5); go(0, 0.8)
  return (out, 3)
}

if args.first == "--unit" {
  let n = unit()
  print(n == 0 ? "unit ok" : "unit: \(n) ca sai")
} else if args.first == "--synthetic" {
  synthetic()
} else if args.first == "--selftest", args.count > 1 {
  selftest(args[1])
} else if args.isEmpty {
  print("dùng: sh run.sh <clip|ảnh>... [--hand left] [--fps 15] [--csv out.csv] [--frames out/] [--rear out.csv] [--cue x1,y1,x2,y2@t] [--eval nhan.csv] | --selftest ảnh | --synthetic | --unit")
} else {
  for path in args {
    let ext = (path as NSString).pathExtension.lowercased()
    if ["mov", "mp4", "m4v"].contains(ext) {
      if let evalPath {
        runEval(path, labelsPath: evalPath)
      } else if let cueSpec {
        if let ref = parseAxis(cueSpec) { runCue(path, ref, to: csvPath) } else { print("--cue cần x1,y1,x2,y2@t") }
      } else if let rearPath {
        runRear(path, to: rearPath)
      } else {
        runVideo(path)
      }
    } else {
      runImage(path)
    }
  }
}

func name(_ o: CGImagePropertyOrientation) -> String {
  ["up", "upMirrored", "down", "downMirrored", "leftMirrored", "right", "rightMirrored", "left"][Int(o.rawValue) - 1]
}
