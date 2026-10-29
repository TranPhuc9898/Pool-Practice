import AVFoundation
import ExpoModulesCore
import SwiftUI
import UIKit

/// Trục cơ, pixel ảnh đứng gốc trên trái, như `CueAxis`.
struct AxisRecord: Record, Equatable {
  @Field var ax: Double = 0
  @Field var ay: Double = 0
  @Field var bx: Double = 0
  @Field var by: Double = 0
  @Field var t: Double = 0

  var axis: CueAxis { CueAxis(a: CGPoint(x: ax, y: ay), b: CGPoint(x: bx, y: by), t: t) }

  static func == (l: Self, r: Self) -> Bool { l.ax == r.ax && l.ay == r.ay && l.bx == r.bx && l.by == r.by && l.t == r.t }
}

final class PoseClipViewProps: ExpoSwiftUI.ViewProps {
  /// `file://` của clip, từ picker.
  @Field var uri: String = ""
  /// "right" hoặc "left".
  @Field var hand: String = "right"
  /// Bật thì hai lần chạm trên video thành một trục tại khung đang dừng.
  @Field var marking: Bool = false
  /// Trục đầu là tham chiếu, các trục sau so với nó.
  @Field var axes: [AxisRecord] = []
  /// { width, height, fps, duration } của ảnh đứng, giây.
  var onInfo = EventDispatcher()
  /// { fraction } 0…1, mỗi 1%.
  var onProgress = EventDispatcher()
  /// { frames, armRatio, seconds } khi phân tích xong; { error } khi không đọc được clip.
  var onAnalyzed = EventDispatcher()
  /// { ax, ay, bx, by, t, deviation? } khi chấm xong một trục; `deviation` so với trục tham chiếu, độ.
  var onAxis = EventDispatcher()
  /// Khung đang xem, tối đa 10 lần một giây: { t, index, frames, phase, wrist?, elbow?, wristL?, elbowL?,
  /// forearmToAxis?, forearmLean?, L?, cueDeviation?, cueOffset?, cueConfidence?, cueLost, cueTracking }. Số đo lệch so với
  /// trục tham chiếu đã bù rung máy, pixel ảnh đứng. `cue…` là trục cơ dò được ở khung này, xem `PoseCue.swift`.
  var onFrame = EventDispatcher()
  /// { strokes: [...] } mỗi khi dãy pha hoặc trục tham chiếu đổi. Xem `PoseClipModel.emitStrokes`.
  var onStrokes = EventDispatcher()
}

/// Phát clip, phân tích nền bằng `analyzeClip`, vẽ tay cơ, vệt cổ tay và các trục chấm tay lên đúng khung đang xem.
struct PoseClipView: ExpoSwiftUI.View, ExpoSwiftUI.WithHostingView {
  @ObservedObject var props: PoseClipViewProps
  @StateObject private var model = PoseClipModel()

  var body: some View {
    VStack(spacing: 8) {
      PoseClipSurface(model: model).background(Color.black)
      PoseClipPhases(model: model)
      PoseClipTransport(model: model)
    }
    .onAppear {
      model.props = props
      model.load(props.uri, PoseSide(rawValue: props.hand) ?? .right)
    }
    .onDisappear { model.stop() }
    .onChange(of: props.uri) { _ in model.load(props.uri, PoseSide(rawValue: props.hand) ?? .right) }
    .onChange(of: props.hand) { _ in model.load(props.uri, PoseSide(rawValue: props.hand) ?? .right) }
    .onChange(of: props.axes) { _ in
      model.emitStrokes()
      model.retrack()
    }
  }
}

@MainActor
final class PoseClipModel: ObservableObject {
  let player = AVPlayer()
  weak var props: PoseClipViewProps?
  @Published private(set) var info: ClipInfo?
  @Published private(set) var playing = false
  @Published var time = 0.0
  @Published private(set) var progress: Double?
  @Published private(set) var current: Int?
  private(set) var frames: [PoseFrame] = []
  /// Pha dùng thật: sửa tay nếu có, không thì pha RearTracker tự bắt.
  @Published private(set) var phases: [RearPhase] = []
  private var autoPhases: [RearPhase] = []
  private var manual: [RearPhase?] = []
  private var phaseConfidence: [Double] = []
  private var job: Task<Void, Never>?
  /// Trục cơ dò được, cùng chỉ số với `frames`; nil khi chưa chấm trục hoặc đang dò.
  @Published private(set) var cue: CueTrack?
  @Published private(set) var cueBusy = false
  private var cueJob: Task<Void, Never>?
  private var url: URL?
  private var loaded = ""
  private var endObserver: NSObjectProtocol?

  /// Đổi clip hoặc tay thì huỷ lượt cũ và phân tích lại; cùng clip thì giữ player.
  func load(_ uri: String, _ side: PoseSide) {
    let key = "\(uri)|\(side.rawValue)"
    guard key != loaded else { return }
    job?.cancel()
    cueJob?.cancel()
    cue = nil
    cueBusy = false
    frames = []
    phases = []
    current = nil
    progress = nil
    guard let url = URL(string: uri), !uri.isEmpty else { loaded = ""; url = nil; return }
    self.url = url
    if !loaded.hasPrefix("\(uri)|") {
      let item = AVPlayerItem(url: url)
      player.replaceCurrentItem(with: item)
      if let endObserver { NotificationCenter.default.removeObserver(endObserver) }
      endObserver = NotificationCenter.default.addObserver(
        forName: .AVPlayerItemDidPlayToEndTime, object: item, queue: .main
      ) { [weak self] _ in Task { @MainActor in self?.playing = false } }
      info = nil
    }
    loaded = key
    progress = 0
    let started = Date()
    job = Task { [weak self] in
      do {
        let (info, frames) = try await Task.detached(priority: .userInitiated) {
          try await analyzeClip(
            url: url, side: side, minConfidence: PoseLimits().minConfidence, band: defaultShakeBand
          ) { p in
            Task { @MainActor in self?.report(p) }
          }
        }.value
        guard let self, !Task.isCancelled else { return }
        self.finish(info, frames, seconds: Date().timeIntervalSince(started))
      } catch is CancellationError {
      } catch {
        self?.progress = nil
        self?.props?.onAnalyzed(["error": "\(error)"])
      }
    }
    Task { [weak self] in
      guard let (info, _) = try? await clipInfo(AVURLAsset(url: url)) else { return }
      self?.adopt(info)
    }
  }

  private func adopt(_ i: ClipInfo) {
    guard info == nil else { return }
    info = i
    props?.onInfo(["width": i.size.width, "height": i.size.height, "fps": i.fps, "duration": i.duration])
  }

  private func report(_ p: Double) {
    guard progress != nil, frames.isEmpty else { return }
    progress = p
    props?.onProgress(["fraction": p])
  }

  private func finish(_ i: ClipInfo, _ f: [PoseFrame], seconds: Double) {
    adopt(i)
    frames = f
    progress = nil
    let arm = f.filter { $0.elbow != nil && $0.wrist != nil }.count
    let ratio = f.isEmpty ? 0 : Double(arm) / Double(f.count)
    let tracker = RearTracker()
    for x in f { tracker.push(RearSample(x, i)) }
    autoPhases = tracker.phases
    phaseConfidence = tracker.confidence
    manual = Array(repeating: nil, count: f.count)
    phases = autoPhases
    let shake = f.map { hypot(Double($0.shift.dx), Double($0.shift.dy)) }.max() ?? 0
    NSLog("[clip] analyzed %d frames in %.1f s, arm %.0f%%, strokes %d, shake %.1f px",
          f.count, seconds, ratio * 100, tracker.strokes, shake)
    props?.onAnalyzed(["frames": f.count, "armRatio": ratio, "seconds": seconds, "shake": shake])
    lastSent = -1
    emitStrokes()
    retrack()
  }

  /// Dò lại cơ từ các trục đã chấm. Gọi khi phân tích xong và mỗi khi danh sách trục đổi; lượt cũ bị huỷ.
  func retrack() {
    cueJob?.cancel()
    let axes = props?.axes.map(\.axis) ?? []
    guard let url, let info, !frames.isEmpty, !axes.isEmpty else {
      cue = nil
      cueBusy = false
      lastSent = -1
      return
    }
    cueBusy = true
    lastSent = -1
    let frames = frames
    var limits = CueLimits()
    limits.halfWidth = cueHalfWidth(frames)
    let started = Date()
    cueJob = Task { [weak self] in
      do {
        let track = try await Task.detached(priority: .userInitiated) {
          try await trackCue(url: url, info: info, frames: frames, axes: axes, limits: limits)
        }.value
        guard let self, !Task.isCancelled else { return }
        self.cue = track
        self.cueBusy = false
        self.lastSent = -1
        self.emitStrokes()
        let seen = track.estimates.compactMap { $0 }.count
        NSLog("[clip] cue tracked %d/%d frames in %.1f s, band %.0f px", seen, frames.count,
              Date().timeIntervalSince(started), limits.halfWidth)
      } catch is CancellationError {
      } catch {
        self?.cueBusy = false
        NSLog("[clip] cue tracking failed: %@", "\(error)")
      }
    }
  }

  /// Trục cơ dò được ở khung `i` so với trục tham chiếu đã dời theo rung: góc lệch, độ; lệch ngang của trung điểm trục
  /// dò, pixel ảnh đứng; độ tin cậy.
  func cueMeasure(_ i: Int) -> (deviation: Double, offset: Double?, confidence: Double)? {
    guard let e = cue?.estimates[safe: i] ?? nil, let ref = axis(for: i) else { return nil }
    let mid = CGPoint(x: (e.axis.a.x + e.axis.b.x) / 2, y: (e.axis.a.y + e.axis.b.y) / 2)
    return (axisDeviation(e.axis, ref), ref.offset(mid), e.confidence)
  }

  // MARK: - Pha và cú

  /// Một đoạn liền cùng pha, khung `a`…`b`, giây `t0`…`t1`.
  struct PhaseRun: Identifiable {
    var phase: RearPhase
    var a: Int
    var b: Int
    var t0: Double
    var t1: Double
    var id: Int { a }
  }

  var runs: [PhaseRun] {
    var out: [PhaseRun] = []
    for (i, p) in phases.enumerated() {
      if let last = out.last, last.phase == p { out[out.count - 1].b = i } else { out.append(PhaseRun(phase: p, a: i, b: i, t0: 0, t1: 0)) }
    }
    let step = 1 / max(info?.fps ?? 30, 1)
    return out.map { r in
      var r = r
      r.t0 = frames[r.a].t
      r.t1 = r.b + 1 < frames.count ? frames[r.b + 1].t : frames[r.b].t + step
      return r
    }
  }

  var hasManual: Bool { manual.contains { $0 != nil } }

  func override(_ r: PhaseRun, _ p: RearPhase) {
    guard r.b < manual.count else { return }
    for j in r.a...r.b { manual[j] = p }
    phases = zip(autoPhases, manual).map { $1 ?? $0 }
    emitStrokes()
  }

  func clearOverrides() {
    manual = Array(repeating: nil, count: frames.count)
    phases = autoPhases
    emitStrokes()
  }

  /// Trục tham chiếu dời theo rung máy từ khung đã chấm tới khung `i`, để lệch đo là tay chứ không phải máy.
  private func axis(for i: Int) -> CueAxis? {
    guard let ref = props?.axes.first?.axis else { return nil }
    guard let k = nearestFrame(frames, ref.t) else { return ref }
    let dx = frames[i].shift.dx - frames[k].shift.dx, dy = frames[i].shift.dy - frames[k].shift.dy
    return CueAxis(a: CGPoint(x: ref.a.x + dx, y: ref.a.y + dy), b: CGPoint(x: ref.b.x + dx, y: ref.b.y + dy), t: ref.t)
  }

  /// Mỗi cú: { n, start, end, pause?, confidence, source "auto" | "manual", addressWrist?, backWrist?, followWrist?
  /// (pixel, kèm …L bội số cẳng tay), elbowRange?, elbowRangeL?, addressCue?, backCue?, followCue? (độ), cueConfidence? }.
  /// `follow…` đo ở khung cuối của follow-through. `cueConfidence` là mức thấp nhất của ba mốc có trục cơ dò được.
  /// Lệch so với trục tham chiếu; chưa có trục thì chỉ có thời gian và độ tin cậy.
  func emitStrokes() {
    guard let info, !frames.isEmpty, phases.count == frames.count else { return }
    let found = rearStrokes(phases, times: frames.map(\.t))
    let list: [[String: Any]] = found.enumerated().map { n, s in
      let range = (s.address ?? s.start)...s.end
      var e: [String: Any] = [
        "n": n + 1, "start": frames[s.start].t, "end": frames[s.end].t,
        "confidence": range.map { phaseConfidence[$0] }.reduce(0, +) / Double(range.count),
        "source": range.contains { manual[$0] != nil } ? "manual" : "auto",
      ]
      if let p = s.pause { e["pause"] = p }
      var cueConfidence: Double?
      for (key, i) in [("address", s.address ?? s.start), ("back", s.back), ("follow", s.end)] {
        let m = ClipMeasure(frames[i], info, axis: axis(for: i))
        if let v = m.wrist { e["\(key)Wrist"] = v }
        if let v = m.wristL { e["\(key)WristL"] = v }
        if let c = cueMeasure(i) {
          e["\(key)Cue"] = c.deviation
          cueConfidence = min(cueConfidence ?? 1, c.confidence)
        }
      }
      if let cueConfidence { e["cueConfidence"] = cueConfidence }
      let measures = range.map { ClipMeasure(frames[$0], info, axis: axis(for: $0)) }
      let elbows = measures.compactMap(\.elbow), lengths = measures.compactMap(\.L)
      if let lo = elbows.min(), let hi = elbows.max() {
        e["elbowRange"] = hi - lo
        if !lengths.isEmpty { e["elbowRangeL"] = (hi - lo) / median(lengths) }
      }
      return e
    }
    props?.onStrokes(["strokes": list])
  }

  func stop() {
    job?.cancel()
    job = nil
    cueJob?.cancel()
    cueJob = nil
    player.pause()
    playing = false
  }

  func toggle() {
    if playing {
      player.pause()
    } else {
      if let d = info?.duration, player.currentTime().seconds >= d - 0.05 { seek(0) }
      player.play()
    }
    playing.toggle()
  }

  func step(_ n: Int) {
    player.pause()
    playing = false
    player.currentItem?.step(byCount: n)
  }

  func seek(_ t: Double) {
    player.seek(to: CMTime(seconds: t, preferredTimescale: 600), toleranceBefore: .zero, toleranceAfter: .zero)
  }

  // MARK: - Khung đang xem

  private var lastSent = -1
  private var lastSentAt = Date.distantPast

  /// Gọi mỗi nhịp màn hình. Trả khung gần thời điểm player nhất để vẽ, và phát `onFrame` khi khung đổi.
  func tick() -> Int? {
    let t = player.currentTime().seconds
    if t.isFinite, abs(t - time) > 1.0 / 30 || (!playing && abs(t - time) > 1e-4) { time = t }
    guard let i = nearestFrame(frames, t), let info else { return nil }
    if i != current { current = i }
    if i != lastSent, Date().timeIntervalSince(lastSentAt) >= 0.1 {
      lastSent = i
      lastSentAt = Date()
      props?.onFrame(frameEvent(i, info))
    }
    return i
  }

  private func frameEvent(_ i: Int, _ info: ClipInfo) -> [String: Any] {
    let m = ClipMeasure(frames[i], info, axis: axis(for: i))
    let fields: [String: Double?] = [
      "wrist": m.wrist, "elbow": m.elbow, "wristL": m.wristL, "elbowL": m.elbowL,
      "forearmToAxis": m.forearmToAxis, "forearmLean": m.forearmLean, "L": m.L,
    ]
    var e: [String: Any] = ["t": frames[i].t, "index": i, "frames": frames.count]
    if i < phases.count { e["phase"] = phases[i].rawValue }
    for (k, v) in fields { if let v { e[k] = v } }
    if let c = cueMeasure(i) {
      e["cueDeviation"] = c.deviation
      e["cueConfidence"] = c.confidence
      if let o = c.offset { e["cueOffset"] = o }
    }
    e["cueLost"] = cue?.lost[safe: i] ?? false
    e["cueTracking"] = cueBusy
    return e
  }

  // MARK: - Chấm trục

  @Published private(set) var pending: CGPoint?

  func tap(_ p: CGPoint) {
    guard props?.marking == true else { return }
    guard let a = pending else { pending = p; return }
    pending = nil
    guard hypot(p.x - a.x, p.y - a.y) > 8 else { return }
    let axis = CueAxis(a: a, b: p, t: player.currentTime().seconds)
    var e: [String: Any] = ["ax": a.x, "ay": a.y, "bx": p.x, "by": p.y, "t": axis.t]
    if let ref = props?.axes.first?.axis { e["deviation"] = axisDeviation(axis, ref) }
    props?.onAxis(e)
  }
}

// MARK: - Video và overlay

private struct PoseClipSurface: UIViewRepresentable {
  let model: PoseClipModel

  func makeUIView(context: Context) -> PoseClipUIView { PoseClipUIView(model: model) }
  func updateUIView(_ v: PoseClipUIView, context: Context) {}
}

/// Video trong khung resizeAspect, cộng các lớp vẽ: tay cơ gold, vệt cổ tay 1 s gần nhất, trục tham chiếu xanh,
/// trục chấm thêm trắng, trục cơ dò được cam mờ theo độ tin cậy, điểm chấm dở.
private final class PoseClipUIView: UIView {
  override class var layerClass: AnyClass { AVPlayerLayer.self }
  private var playerLayer: AVPlayerLayer { layer as! AVPlayerLayer }
  private let arm = CAShapeLayer()
  private let trail = CAShapeLayer()
  private let reference = CAShapeLayer()
  private let others = CAShapeLayer()
  private let measured = CAShapeLayer()
  private let mark = CAShapeLayer()
  private let model: PoseClipModel
  private var link: CADisplayLink?
  private var drawn: Int?

  init(model: PoseClipModel) {
    self.model = model
    super.init(frame: .zero)
    backgroundColor = .black
    playerLayer.player = model.player
    playerLayer.videoGravity = .resizeAspect
    for l in [trail, reference, others, measured, arm] {
      l.fillColor = nil
      l.lineCap = .round
      l.lineJoin = .round
    }
    arm.lineWidth = 4
    arm.strokeColor = UIColor(red: 216 / 255, green: 180 / 255, blue: 81 / 255, alpha: 1).cgColor
    trail.lineWidth = 2
    trail.strokeColor = UIColor.systemTeal.withAlphaComponent(0.9).cgColor
    reference.lineWidth = 2
    reference.strokeColor = UIColor.systemGreen.cgColor
    others.lineWidth = 1.5
    others.lineDashPattern = [6, 4]
    others.strokeColor = UIColor.white.withAlphaComponent(0.85).cgColor
    measured.lineWidth = 2.5
    measured.strokeColor = UIColor.systemOrange.cgColor
    mark.fillColor = UIColor.systemGreen.cgColor
    [trail, reference, others, measured, arm, mark].forEach(layer.addSublayer)
    addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(tapped)))
  }

  required init?(coder: NSCoder) { nil }

  override func layoutSubviews() {
    super.layoutSubviews()
    for l in [trail, reference, others, measured, arm, mark] { l.frame = bounds }
    drawn = nil
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    link?.invalidate()
    link = nil
    guard window != nil else { return }
    let l = CADisplayLink(target: self, selector: #selector(redraw(_:)))
    l.add(to: .main, forMode: .common)
    link = l
  }

  @objc private func tapped(_ g: UITapGestureRecognizer) {
    guard let info = model.info else { return }
    let rect = videoRect(info, in: bounds)
    let v = g.location(in: self)
    guard rect.contains(v) else { return }
    model.tap(imagePoint(v, info, rect))
    drawn = nil
  }

  @objc private func redraw(_ l: CADisplayLink) {
    let i = model.tick()
    guard let info = model.info else { return }
    let rect = videoRect(info, in: bounds)
    func map(_ p: CGPoint) -> CGPoint { viewPoint(p, info, rect) }
    CATransaction.begin()
    CATransaction.setDisableActions(true)
    let axes = model.props?.axes.map(\.axis) ?? []
    reference.path = axes.first.map { line($0, rect, info) }
    others.path = axes.count > 1 ? combine(axes.dropFirst().map { line($0, rect, info) }) : nil
    let estimate = i.flatMap { model.cue?.estimates[safe: $0] ?? nil }
    measured.path = estimate.map { line($0.axis, rect, info) }
    measured.opacity = Float(estimate?.confidence ?? 0)
    mark.path = model.pending.map { p in
      let c = map(p)
      return UIBezierPath(ovalIn: CGRect(x: c.x - 5, y: c.y - 5, width: 10, height: 10)).cgPath
    }
    if i != drawn {
      drawn = i
      if let i {
        let f = model.frames[i]
        arm.path = polyline([f.shoulder, f.elbow, f.wrist].map { $0.map { map(info.upright($0)) } })
        let recent = model.frames[..<(i + 1)].reversed().prefix { f.t - $0.t <= 1 }.reversed()
        trail.path = polyline(recent.map { $0.wrist.map { map(info.upright($0)) } })
      } else {
        arm.path = nil
        trail.path = nil
      }
    }
    CATransaction.commit()
  }

  /// Trục kéo dài hết khung video, vì người chấm chỉ chấm hai điểm trên cây cơ.
  private func line(_ a: CueAxis, _ rect: CGRect, _ info: ClipInfo) -> CGPath {
    let p = viewPoint(a.a, info, rect), q = viewPoint(a.b, info, rect)
    let dx = q.x - p.x, dy = q.y - p.y
    let n = max(1, hypot(dx, dy))
    let k = hypot(rect.width, rect.height) / n
    let path = UIBezierPath()
    path.move(to: CGPoint(x: p.x - dx * k, y: p.y - dy * k))
    path.addLine(to: CGPoint(x: p.x + dx * k, y: p.y + dy * k))
    return path.cgPath
  }

  private func combine(_ paths: [CGPath]) -> CGPath {
    let m = CGMutablePath()
    paths.forEach { m.addPath($0) }
    return m
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

// MARK: - Dải pha

extension RearPhase {
  var label: String {
    switch self {
    case .unknown: return "Unknown"
    case .address: return "Address"
    case .practice: return "Practice stroke"
    case .backswing: return "Backswing"
    case .pause: return "Pause"
    case .forward: return "Forward stroke"
    case .follow: return "Follow-through"
    case .complete: return "Shot complete"
    }
  }

  var color: Color {
    switch self {
    case .unknown: return Color.gray.opacity(0.35)
    case .address: return Color(red: 46 / 255, green: 125 / 255, blue: 80 / 255)
    case .practice: return Color.teal.opacity(0.55)
    case .backswing: return Color(red: 216 / 255, green: 180 / 255, blue: 81 / 255)
    case .pause: return Color.orange
    case .forward: return Color(red: 90 / 255, green: 160 / 255, blue: 1)
    case .follow: return Color.purple.opacity(0.8)
    case .complete: return Color.gray.opacity(0.6)
    }
  }
}

/// Mỗi đoạn pha một vạch màu theo thời gian, cùng trục với slider. Chạm một đoạn để nhảy tới đó và sửa pha của nó.
private struct PoseClipPhases: View {
  @ObservedObject var model: PoseClipModel
  @State private var picked: PoseClipModel.PhaseRun?

  var body: some View {
    let total = max(model.info?.duration ?? 0, 0.01)
    GeometryReader { g in
      ZStack(alignment: .leading) {
        Color.gray.opacity(0.15)
        ForEach(model.runs) { r in
          Rectangle()
            .fill(r.phase.color)
            .frame(width: max(2, g.size.width * (r.t1 - r.t0) / total))
            .offset(x: g.size.width * r.t0 / total)
            .contentShape(Rectangle())
            .onTapGesture {
              model.seek(r.t0)
              picked = r
            }
            .accessibilityLabel("\(r.phase.label), \(String(format: "%.1f", r.t0)) s")
        }
      }
    }
    .frame(height: 14)
    .clipShape(RoundedRectangle(cornerRadius: 4, style: .continuous))
    .padding(.horizontal, 4)
    .opacity(model.phases.isEmpty ? 0 : 1)
    .confirmationDialog(
      picked.map { String(format: "%@, %.2f–%.2f s", $0.phase.label, $0.t0, $0.t1) } ?? "",
      isPresented: Binding(get: { picked != nil }, set: { if !$0 { picked = nil } }),
      titleVisibility: .visible,
      presenting: picked
    ) { r in
      ForEach(RearPhase.allCases, id: \.self) { p in
        Button(p.label) { model.override(r, p) }
      }
      if model.hasManual {
        Button("Use automatic phases", role: .destructive) { model.clearOverrides() }
      }
    }
  }
}

// MARK: - Điều khiển

private struct PoseClipTransport: View {
  @ObservedObject var model: PoseClipModel

  private var phaseText: String {
    guard let i = model.current, i < model.phases.count else { return "" }
    return model.phases[i].label
  }

  var body: some View {
    let duration = model.info?.duration ?? 0
    VStack(spacing: 4) {
      Slider(
        value: Binding(get: { min(model.time, duration) }, set: { model.seek($0) }),
        in: 0...max(duration, 0.01)
      )
      .disabled(model.info == nil)
      HStack(spacing: 28) {
        Button { model.step(-1) } label: { Image(systemName: "backward.frame.fill") }
          .accessibilityLabel("Previous frame")
        Button { model.toggle() } label: { Image(systemName: model.playing ? "pause.fill" : "play.fill") }
          .accessibilityLabel(model.playing ? "Pause" : "Play")
        Button { model.step(1) } label: { Image(systemName: "forward.frame.fill") }
          .accessibilityLabel("Next frame")
        Spacer()
        Text(phaseText).font(.footnote).foregroundColor(.secondary)
        Text(String(format: "%.2f s", model.time)).monospacedDigit().foregroundColor(.secondary)
      }
      .font(.title3)
      .disabled(model.info == nil)
    }
    .tint(Color(red: 216 / 255, green: 180 / 255, blue: 81 / 255))
    .padding(.horizontal, 4)
  }
}

private extension Array {
  subscript(safe i: Int) -> Element? { indices.contains(i) ? self[i] : nil }
}
