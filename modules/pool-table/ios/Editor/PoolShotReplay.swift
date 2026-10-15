import SwiftUI
import simd

/// Một lần chạy thử cú chính theo đúng thời gian vật lý: bi cái tới ghost, rồi bi cái và bi mục tiêu tách ra.
/// Cùng mô phỏng với guide, nên bi đi đúng đường đang vẽ. Bi xoay theo spin của chính mô phỏng đó.
struct ShotReplay {
  /// Trạng thái bi, cùng năm trạng thái và bảng màu của docs/research/bi-cai-xoay.html.
  enum Phase: Int {
    case slide, roll, spin, still, sunk

    var name: String { ["Sliding", "Rolling", "Spinning", "Stopped", "Pocketed"][rawValue] }
    var color: Color {
      switch self {
      case .slide: Color(hex: 0xE8896A)
      case .roll: Color(hex: 0x86C9B4)
      case .spin: Color(hex: 0xA898EA)
      case .still, .sunk: Color(hex: 0x6B747B)
      }
    }
  }

  /// Số đo của một bi tại một thời điểm. `rho` là spin theo hướng đi chia tốc độ: 1 lăn đều, 0 stun, âm là kéo.
  struct Reading {
    var phase: Phase
    var v: CGPoint
    var w: CGPoint
    var wz: CGFloat
    var speed: CGFloat { hypot(v.x, v.y) }
    var rho: CGFloat? {
      let s = speed
      return s > 2 ? (w.x * v.x + w.y * v.y) / (s * s) : nil
    }
    /// Vòng/giây của cả vector ω, khung bàn.
    var revs: CGFloat {
      let R = ShotPhysics.ballRadius
      return hypot(hypot(w.x, w.y) / R, wz) / (2 * .pi)
    }
  }

  /// Vị trí, vận tốc, spin và hướng thân bi theo thời gian. `sink` là bi rơi xuống lỗ ở cuối đường.
  struct Track {
    var ts: [CGFloat] = []
    var pts: [CGPoint] = []
    var vs: [CGPoint] = []
    /// Spin dạng vận tốc tương đương (inch/s). Lăn đều thì bằng vận tốc.
    var ws: [CGPoint] = []
    /// Phê, rad/s, dương ngược chiều kim đồng hồ nhìn từ trên.
    var wzs: [CGFloat] = []
    var sink = false
    /// Hướng thân bi, vận tốc góc (rad/s, khung vẽ) và trạng thái tại từng điểm, dựng bởi `orient`.
    private(set) var qs: [simd_quatf] = []
    private(set) var om: [SIMD3<Float>] = []
    private(set) var phases: [Phase] = []
    var end: CGFloat { ts.last ?? 0 }

    init(sink: Bool = false) { self.sink = sink }

    mutating func add(_ t: CGFloat, _ p: CGPoint, v: CGPoint, w: CGPoint, wz: CGFloat) {
      ts.append(t); pts.append(p); vs.append(v); ws.append(w); wzs.append(wz)
    }

    /// Đoạn chứa `t` và tỉ lệ trong đoạn. nil là trước điểm đầu hoặc sau điểm cuối.
    private func seg(_ t: CGFloat) -> (Int, Int, CGFloat)? {
      guard let first = ts.first, t > first, t < end else { return nil }
      var lo = 0, hi = ts.count - 1
      while hi - lo > 1 {
        let m = (lo + hi) / 2
        if ts[m] <= t { lo = m } else { hi = m }
      }
      return (lo, hi, (t - ts[lo]) / max(ts[hi] - ts[lo], 1e-6))
    }

    func at(_ t: CGFloat) -> CGPoint {
      guard let (lo, hi, k) = seg(t) else { return t > (ts.first ?? 0) ? pts[pts.count - 1] : pts[0] }
      return CGPoint(x: pts[lo].x + (pts[hi].x - pts[lo].x) * k, y: pts[lo].y + (pts[hi].y - pts[lo].y) * k)
    }

    func pose(_ t: CGFloat) -> simd_quatf {
      guard let (lo, hi, k) = seg(t) else { return t > (ts.first ?? 0) ? qs[qs.count - 1] : qs[0] }
      return simd_slerp(qs[lo], qs[hi], Float(k))
    }

    /// Tốc độ quay rad/s, 0 khi bi chưa chạy hoặc đã dừng hẳn.
    func spin(_ t: CGFloat) -> Float {
      guard let (lo, hi, k) = seg(t) else { return 0 }
      return simd_length(simd_mix(om[lo], om[hi], SIMD3(repeating: Float(k))))
    }

    func read(_ t: CGFloat) -> Reading {
      guard let (lo, hi, k) = seg(t) else {
        if t <= (ts.first ?? 0) { return Reading(phase: .still, v: .zero, w: .zero, wz: 0) }
        return Reading(phase: sink ? .sunk : .still, v: .zero, w: .zero, wz: 0)
      }
      func mix(_ a: CGPoint, _ b: CGPoint) -> CGPoint { CGPoint(x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k) }
      return Reading(phase: phases[lo], v: mix(vs[lo], vs[hi]), w: mix(ws[lo], ws[hi]), wz: wzs[lo] + (wzs[hi] - wzs[lo]) * k)
    }

    /// Chỉ số điểm cuối cùng đã qua ở thời điểm `t`.
    func index(_ t: CGFloat) -> Int {
      seg(t)?.0 ?? (t > (ts.first ?? 0) ? ts.count - 1 : 0)
    }

    /// Lăn: ω = ẑ × w / R. Khung vẽ lật trục y của bàn, nên (wx, wy) bàn thành ω = (wy, wx, 0) / R.
    /// Phê dương là ngược chiều kim đồng hồ, đúng trục Z hướng vào mắt.
    mutating func orient(from q0: simd_quatf) {
      let R = Float(ShotPhysics.ballRadius)
      om = zip(ws, wzs).map { w, wz in SIMD3(Float(w.y) / R, Float(w.x) / R, Float(wz)) }
      phases = zip(vs, zip(ws, wzs)).map { v, s in Self.phase(v: v, w: s.0, wz: s.1) }
      qs = [q0]
      for i in 1..<max(ts.count, 1) {
        let w = (om[i - 1] + om[i]) / 2, dt = Float(ts[i] - ts[i - 1]), a = simd_length(w) * dt
        let q = a > 1e-7 ? simd_quatf(angle: a, axis: w / simd_length(w)) * qs[i - 1] : qs[i - 1]
        qs.append(simd_normalize(q))
      }
    }

    /// Ngưỡng trượt bằng 3,5 bước ma sát của engine: dưới mức đó engine đã chốt lăn đều.
    private static func phase(v: CGPoint, w: CGPoint, wz: CGFloat) -> Phase {
      if hypot(v.x - w.x, v.y - w.y) > 3.5 * ShotPhysics.muSlide * ShotPhysics.dt { return .slide }
      if hypot(v.x, v.y) > ShotPhysics.stopSpeed { return .roll }
      return abs(wz) > 0.3 ? .spin : .still
    }
  }

  let id = UUID()
  let ball: Int
  let cue: Track
  let ob: Track
  /// Bi khác bị đụng mà rời chỗ, theo số bi.
  let others: [Int: Track]
  /// Giây tới lúc chạm, nil nếu bi cái không tới.
  let contact: CGFloat?
  /// Giảm động: hiện thẳng vị trí cuối, không chạy.
  let jump: Bool
  /// Giây mô phỏng trên mỗi giây thật.
  var rate: CGFloat
  /// Mốc giờ thật ứng với giây mô phỏng 0. Đổi tốc hay chạy tiếp thì dời mốc, thời gian mô phỏng không nhảy.
  var start = Date()
  /// Đang tua hoặc dừng hình ở giây mô phỏng này. nil là đang chạy.
  var paused: CGFloat?
  /// Tăng mỗi lần dời mốc hay tua, để hẹn giờ cũ (haptic, tự đóng) biết mình đã hết hiệu lực.
  var epoch = 0
  /// Giây mô phỏng, chưa chia `rate`.
  var end: CGFloat { max(cue.end, ob.end, others.values.map(\.end).max() ?? 0) }

  /// Giây mô phỏng ở giờ thật `now`. Có thể vượt `end` một chút, lớp vẽ cần để làm hiệu ứng rơi lỗ.
  func time(_ now: Date) -> CGFloat {
    if let paused { return paused }
    return jump ? end : max(0, CGFloat(now.timeIntervalSince(start))) * rate
  }

  /// Cảnh mẫu không có bi mục tiêu: `ob` vẫn dựng (bi đặt ngoài bàn) nhưng không vẽ.
  var solo = false

  /// `aim` (radian) cho sẵn là đánh đúng hướng đó như cảnh mẫu của web, nil là tự ngắm cho bi vào lỗ.
  init(_ ms: ShotPhysics.Setup, ball: Int, tipX: CGFloat, tipY: CGFloat, theta: CGFloat = 0, speed: CGFloat, aim: CGFloat? = nil, jump: Bool, rate: CGFloat = 1) {
    self.ball = ball
    self.jump = jump
    self.rate = rate
    let r = ShotPhysics.runWith(ms, tipX: tipX, tipY: tipY, theta: theta, speed: speed, aim: aim)
    // Đoạn từ đầu cơ tới chỗ chạm lấy thẳng từ mô phỏng tiếp cận: nâng cơ thì đường cong, spin và phê đã hãm theo đó.
    var cue = Track()
    for i in r.pre.ts.indices { cue.add(r.pre.ts[i], r.pre.pts[i], v: r.pre.vs[i], w: r.pre.ws[i], wz: r.pre.wzs[i]) }
    guard r.short != .cue, cue.ts.count > 1 else {
      // Bi cái dừng trước khi tới: mô phỏng đã chốt tốc về 0 ở mẫu cuối, chỉ còn đuôi xoay. Cảnh mẫu không bi
      // mục tiêu thì bi cái đi hết đường, có thể rơi lỗ.
      cue.sink = r.pre.pocket != nil
      if !cue.sink { Self.spinOut(&cue) }
      cue.orient(from: PoolBallSphere.restPose(0))
      self.cue = cue
      var ob = Track()
      ob.add(0, ms.o, v: .zero, w: .zero, wz: 0)
      ob.orient(from: PoolBallSphere.restPose(ball))
      self.ob = ob
      others = [:]
      contact = nil
      return
    }
    let t0 = cue.end
    for i in r.ts.indices {
      cue.add(t0 + r.ts[i], r.pts[i], v: r.vs[i], w: r.ws[i], wz: r.wzs[i])
    }
    cue.sink = r.scratch != nil
    if !cue.sink { Self.spinOut(&cue) }
    cue.orient(from: PoolBallSphere.restPose(0))
    self.cue = cue
    contact = t0

    // Bi mục tiêu và bi bị đụng: cùng mô phỏng với bi cái, nên dội băng, đụng nhau, rơi lỗ y như đường đang vẽ.
    func track(_ n: Int, _ tr: ShotPhysics.Trace) -> Track {
      var k = Track(sink: tr.pocket != nil)
      for i in tr.ts.indices { k.add(t0 + tr.ts[i], tr.pts[i], v: tr.vs[i], w: tr.ws[i], wz: tr.wzs[i]) }
      k.orient(from: PoolBallSphere.restPose(n))
      return k
    }
    ob = track(ball, r.ob)
    others = Dictionary(uniqueKeysWithValues: r.moved.map { ($0.key, track($0.key, $0.value)) })
  }

  /// Bi đã đứng mà còn phê thì xoay tại chỗ tới khi hết, tối đa 3 giây mô phỏng để replay không kéo dài vô tận.
  private static func spinOut(_ track: inout Track) {
    guard let p = track.pts.last, let t = track.ts.last, let wz = track.wzs.last, abs(wz) > 0.3 else { return }
    let dur = min(abs(wz) / ShotPhysics.spinDecay, 3)
    var k: CGFloat = 0
    while k < dur {
      k = min(k + 1 / 60, dur)
      track.add(t + k, p, v: .zero, w: .zero, wz: ShotPhysics.spin(wz, after: k))
    }
  }
}

extension PoolEditorModel {
  /// Bấm Đánh: chạy cú, bấm lần nữa là dừng. Một haptic, đúng lúc bi cái chạm bi mục tiêu.
  func toggleReplay(reduceMotion: Bool) {
    if replay != nil { replay = nil; return }
    if let p = demo {
      // Cảnh mẫu: đánh đúng hướng của web. Không có bi mục tiêu thì đặt bi 1 ngoài bàn, bi cái không bao giờ chạm.
      guard let c = balls[0], hypot(tipX, tipY) <= ShotPhysics.tipMax + 0.001 else { return }
      let ms = ShotPhysics.Setup(c: c, o: balls[1] ?? CGPoint(x: -1000, y: -1000), pocket: "footRight", others: [], ball: 1)
      var r = ShotReplay(ms, ball: 1, tipX: tipX, tipY: tipY, theta: theta, speed: speed, aim: atan2(p.heading.y, p.heading.x), jump: reduceMotion)
      r.solo = balls[1] == nil
      return play(r)
    }
    if let r = soloReplay(jump: reduceMotion) { return play(r) }
    guard let ball = aimBall, let pocket = aimPocket, let ms = shotSetup,
          ShotPhysics.shotOf(ball: ball, pocket: pocket, balls: balls)?.level != .bad
    else { return }
    if lesson != nil, guessing { guessed = guessKey }
    play(ShotReplay(ms, ball: ball, tipX: tipX, tipY: tipY, theta: theta, speed: speed, jump: reduceMotion))
  }

  /// Cú chỉ có bi cái (Stroke của Daily Workout): không `aimBall`, `aimPocket` là điểm trên băng. Đánh thẳng về điểm đó,
  /// bi cái dội băng rồi đi hết đường như cảnh mẫu không bi mục tiêu. nil nếu bàn còn bi khác hay đầu cơ quá mức.
  func soloReplay(jump: Bool) -> ShotReplay? {
    guard demo == nil, aimBall == nil, balls.count == 1, let c = balls[0], let pocket = aimPocket,
          let P = ShotPhysics.target(pocket), hypot(tipX, tipY) <= ShotPhysics.tipMax + 0.001 else { return nil }
    let ms = ShotPhysics.Setup(c: c, o: CGPoint(x: -1000, y: -1000), pocket: pocket, others: [], ball: 1)
    var r = ShotReplay(ms, ball: 1, tipX: tipX, tipY: tipY, theta: theta, speed: speed, aim: atan2(P.y - c.y, P.x - c.x), jump: jump)
    r.solo = true
    return r
  }

  func play(_ r: ShotReplay) {
    // Chạy thử luôn trên Bàn: đang phóng hình hay đang mở thẻ thì thu về trước.
    if figShown { figShown = false }
    if card { card = false }
    replay = r
    scheduleReplay()
  }

  /// Hẹn haptic lúc chạm và lúc tự đóng, tính từ thời điểm mô phỏng hiện tại. Hẹn cũ tự huỷ qua `epoch`.
  private func scheduleReplay() {
    guard let r = replay, r.paused == nil else { return }
    let now = r.time(Date())
    let alive = { [weak self] in self?.replay?.id == r.id && self?.replay?.epoch == r.epoch }
    if let c = r.contact, !r.jump, c > now {
      DispatchQueue.main.asyncAfter(deadline: .now() + (c - now) / r.rate) {
        guard alive() else { return }
        EditorHaptics.fire(.light, "Cue ball hits \(ShotPhysics.name(r.ball))")
      }
    }
    // Giữ vị trí cuối một nhịp cho mắt đọc, rồi bàn về như cũ.
    let hold = r.jump ? 1.2 : max(0, r.end - now) / r.rate + 0.6
    DispatchQueue.main.asyncAfter(deadline: .now() + hold) { [weak self] in
      guard alive() else { return }
      // Chuỗi chạy bàn: dời bi về chỗ dừng trước khi bản chạy tắt, để bi thật hiện đúng chỗ đó.
      self?.rackStepEnded()
      withAnimation(.easeOut(duration: 0.2)) { self?.replay = nil }
      if let m = self, let e = m.score(), let s = m.streak {
        EditorHaptics.fire(e <= PoolEditorModel.guessGood ? .selection : .warning, "Guess off by \(Int(e)) in, streak \(s.now), best \(s.best)")
      }
    }
  }

  /// Kéo thanh thời gian: dừng hình ở giây mô phỏng `t`. Nhấc tay vẫn dừng, bấm Tiếp mới chạy.
  func scrubReplay(to t: CGFloat) {
    guard var r = replay else { return }
    r.paused = min(max(t, 0), r.end)
    r.epoch += 1
    replay = r
  }

  /// Chạy tiếp từ chỗ đang dừng. Dừng ở cuối thì chạy lại từ đầu.
  func resumeReplay() {
    guard var r = replay, let p = r.paused else { return }
    let from = p >= r.end - 1e-3 ? 0 : p
    r.paused = nil
    r.start = Date().addingTimeInterval(-Double(from / r.rate))
    r.epoch += 1
    replay = r
    scheduleReplay()
  }
}

/// Các bi chạy thử, vẽ thay bi thật trong lúc chạy: bi cái, bi mục tiêu và bi nào bị đụng. Vệt bi cái tô theo
/// trạng thái, nhãn trạng thái bám theo bi cái.
struct PoolShotReplayLayer: View {
  let replay: ShotReplay
  let geometry: PoolTableGeometry

  var body: some View {
    TimelineView(.animation(paused: replay.jump || replay.paused != nil)) { tl in
      let t = replay.time(tl.date)
      ZStack(alignment: .topLeading) {
        Canvas { ctx, _ in Self.trails(&ctx, replay, t, geometry) }
        ForEach(replay.others.keys.sorted(), id: \.self) { n in ball(n, replay.others[n]!, t) }
        if !replay.solo { ball(replay.ball, replay.ob, t) }
        ball(0, replay.cue, t)
      }
    }
    .allowsHitTesting(false)
  }

  private func ball(_ n: Int, _ track: ShotReplay.Track, _ t: CGFloat) -> some View {
    let p = track.at(t)
    // Rơi xuống lỗ: mờ và nhỏ lại 15% trong 150ms thật, không bao giờ về 0.
    let k = track.sink ? min(max((t - track.end) / (0.15 * replay.rate), 0), 1) : 0
    return PoolBallView(number: n, diameter: geometry.ballDiameter * PoolEditorModel.ballZoom, pose: pose(track, t)).equatable()
      .scaleEffect(1 - 0.15 * k)
      .opacity(1 - k)
      .position(geometry.point(inchesX: p.x, inchesY: p.y))
  }

  /// Vệt như `drawTable` của web: bi cái tô trượt/lăn nét 2, bi khác xám nét 1,5, bỏ đoạn đứng, xoay tại chỗ và
  /// rơi lỗ. `fade` 0,45 là đường dự đoán lúc chưa đánh.
  /// `bend` uốn vệt bi cái cho chỗ gãy rơi vào bi ma đã phóng thay vì ghost thật nằm dưới bi mục tiêu: trước chạm
  /// dịch tăng dần tới đủ, sau chạm nhả dần trong 15 inch và về 0 ở điểm dừng.
  static func trails(_ ctx: inout GraphicsContext, _ replay: ShotReplay, _ t: CGFloat, _ geometry: PoolTableGeometry, fade: CGFloat = 1,
                     bend: (from: CGPoint, to: CGPoint)? = nil) {
    func warp(_ tr: ShotReplay.Track) -> [CGPoint] {
      let p = tr.pts
      guard let b = bend, p.count > 1 else { return p }
      let gap = { (i: Int) in hypot(p[i].x - b.from.x, p[i].y - b.from.y) }
      let k = p.indices.min { gap($0) < gap($1) } ?? 0
      var s: [CGFloat] = [0]
      for i in 1..<p.count { s.append(s[i - 1] + hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y)) }
      let L = min(15, s[p.count - 1] - s[k]), dx = b.to.x - b.from.x, dy = b.to.y - b.from.y
      return p.indices.map { i in
        let w = i <= k ? (s[k] > 0 ? s[i] / s[k] : 1) : (L > 0 ? max(0, 1 - (s[i] - s[k]) / L) : 0)
        return CGPoint(x: p[i].x + dx * w, y: p[i].y + dy * w)
      }
    }
    func draw(_ tr: ShotReplay.Track, cue: Bool, main: Bool = false) {
      let ci = tr.index(t), pts = cue ? warp(tr) : tr.pts
      var from = 0
      while from < ci {
        let ph = tr.phases[from]
        var to = from
        while to < ci && tr.phases[to] == ph { to += 1 }
        if ph == .slide || ph == .roll {
          // Đoạn cuối nối tới vị trí hiện tại cho vệt liền với bi.
          var path = Path()
          path.addLines((Array(pts[from...to]) + (to == ci ? [t >= tr.end ? pts[pts.count - 1] : tr.at(t)] : [])).map { geometry.point(inchesX: $0.x, inchesY: $0.y) })
          // Bi mục tiêu: nét trắng đứt mảnh như drill-editor-v7, khác hẳn nét liền của bi cái khi hai đường chồng nhau.
          let color = cue ? ph.color.opacity(0.85 * fade) : main ? Color.white.opacity(0.8 * fade) : Color(hex: 0x97A0A8).opacity(0.7 * 0.6 * fade)
          ctx.stroke(path, with: .color(color), style: StrokeStyle(lineWidth: cue ? 2 : 1.5, lineCap: .round, lineJoin: .round, dash: main ? [6, 4] : []))
        }
        from = to
      }
    }
    for tr in replay.others.values { draw(tr, cue: false) }
    if !replay.solo {
      draw(replay.ob, cue: false, main: true)
      // Vào lỗ thì chấm trắng ở miệng lỗ, mắt có chỗ dừng.
      if replay.ob.sink, t >= replay.ob.end, let e = replay.ob.pts.last {
        let q = geometry.point(inchesX: e.x, inchesY: e.y)
        ctx.fill(Path(ellipseIn: CGRect(x: q.x - 4, y: q.y - 4, width: 8, height: 8)), with: .color(.white.opacity(0.9 * fade)))
      }
    }
    draw(replay.cue, cue: true)
  }

  /// Màn trập nửa khung (1/120 s thật): quay quá 0,07 rad trong lúc mở thì chia mẫu để nhoè, tối đa 12.
  /// Phát chậm thì màn trập ngắn theo, nên chấm và số hiện rõ hơn. Dừng hình thì nét.
  private func pose(_ track: ShotReplay.Track, _ t: CGFloat) -> BallPose {
    let q = track.pose(t)
    guard !replay.jump, replay.paused == nil else { return BallPose(q: q) }
    let open = replay.rate / 120
    let n = min(12, Int((track.spin(t) * Float(open) / 0.07).rounded(.up)))
    guard n > 1 else { return BallPose(q: q) }
    return BallPose(q: q, blur: (0..<n).map { track.pose(t - open + open * (CGFloat($0) + 0.5) / CGFloat(n)) })
  }
}
