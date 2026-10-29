import SwiftUI
import simd

/// Một lần chạy thử cú chính theo đúng thời gian vật lý: bi cái tới ghost, rồi bi cái và bi mục tiêu tách ra.
/// Cùng mô phỏng với guide, nên bi đi đúng đường đang vẽ. Bi xoay theo spin của chính mô phỏng đó.
/// Cú của một round drill đã giải: một nguồn cho preview, đường vẽ, thẻ và Play.
/// Engine tất định nên dựng lại replay từ cùng thông số ra đúng đường đã vẽ.
struct DrillShot {
  let balls: [Int: CGPoint]
  let setup: ShotPhysics.Setup
  let aim: CGFloat?
  let tipX, tipY, theta, speed: CGFloat
  /// Kết luận của planner. nil là cú thường, chấm bằng `clean(pocket)`.
  let pass: Bool?

  func replay(jump: Bool) -> ShotReplay {
    var r = ShotReplay(setup, ball: setup.ball, tipX: tipX, tipY: tipY, theta: theta, speed: speed, aim: aim, jump: jump)
    r.pass = pass ?? r.clean(setup.pocket)
    return r
  }

  /// Bàn và cú trên model vẫn là cú đã giải: anh chưa kéo bi hay đổi phê, lực trên thẻ.
  func current(_ m: PoolEditorModel) -> Bool {
    m.balls == balls && m.tipX == tipX && m.tipY == tipY && m.theta == theta && m.speed == speed
  }
}

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
    /// Tên lỗ bi rơi, nil nếu không rơi.
    var pocket: String?
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
  /// Cú drill không phải pot một bi (bank, safety, break…): đạt hay không do `DrillShotPlanner` xét, nil là bi vào lỗ.
  var pass: Bool?

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
      k.pocket = tr.pocket
      for i in tr.ts.indices { k.add(t0 + tr.ts[i], tr.pts[i], v: tr.vs[i], w: tr.ws[i], wz: tr.wzs[i]) }
      k.orient(from: PoolBallSphere.restPose(n))
      return k
    }
    ob = track(ball, r.ob)
    others = Dictionary(uniqueKeysWithValues: r.moved.map { ($0.key, track($0.key, $0.value)) })
  }

  /// Bi được tính vào lỗ của cú: bi mục tiêu hay bi bị đẩy (cặp sát, combo), chỉ tính khi rơi đúng `pocket`.
  func potted(_ pocket: String) -> Int? {
    ob.pocket == pocket ? ball : others.first { $0.value.pocket == pocket }?.key
  }

  /// Cú gọi vào sạch: đúng một bi rơi và rơi đúng `pocket`, bi cái không rơi.
  func clean(_ pocket: String) -> Bool {
    let sunk = (ob.sink ? 1 : 0) + others.values.filter(\.sink).count
    return !cue.sink && sunk == 1 && potted(pocket) != nil
  }

  /// Diễn lại đường bi cái ghi sẵn (inch, mỗi `dt` giây), không qua mô phỏng. Bi cái lăn đều theo từng đoạn, mẫu cuối
  /// đứng yên. Bi mục tiêu đứng tới mẫu `hit` rồi đi thẳng vào `pocket`, tốc đầu bằng tốc bi cái lúc chạm nhân cos góc
  /// cắt, hãm theo ma sát lăn nhưng không dưới 10 inch/s để chắc rơi.
  init(recorded pts: [CGPoint], dt: CGFloat, hit: Int, ball: Int, o: CGPoint, pocket: CGPoint, jump: Bool) {
    self.ball = ball
    self.jump = jump
    rate = 1
    var cue = Track()
    for i in pts.indices {
      let a = pts[max(i - 1, 0)], b = pts[min(i + 1, pts.count - 1)]
      let span = CGFloat(min(i + 1, pts.count - 1) - max(i - 1, 0)) * dt
      let v = i == pts.count - 1 ? .zero : CGPoint(x: (b.x - a.x) / span, y: (b.y - a.y) / span)
      cue.add(CGFloat(i) * dt, pts[i], v: v, w: v, wz: 0)
    }
    cue.orient(from: PoolBallSphere.restPose(0))
    self.cue = cue
    let t0 = CGFloat(hit) * dt
    contact = t0

    let d = hypot(pocket.x - o.x, pocket.y - o.y)
    let u = CGPoint(x: (pocket.x - o.x) / max(d, 1e-6), y: (pocket.y - o.y) / max(d, 1e-6))
    let p0 = pts[max(hit - 1, 0)], p1 = pts[hit]
    let inV = CGPoint(x: (p1.x - p0.x) / dt, y: (p1.y - p0.y) / dt)
    let vMin: CGFloat = 10
    let v0 = max(abs(inV.x * u.x + inV.y * u.y), vMin)
    let a = min(ShotPhysics.muRoll, (v0 * v0 - vMin * vMin) / (2 * max(d, 1e-6)))
    var ob = Track(sink: true)
    var t: CGFloat = 0
    while true {
      let s = min(v0 * t - a * t * t / 2, d), v = s < d ? v0 - a * t : 0
      ob.add(t0 + t, CGPoint(x: o.x + u.x * s, y: o.y + u.y * s), v: CGPoint(x: u.x * v, y: u.y * v), w: CGPoint(x: u.x * v, y: u.y * v), wz: 0)
      if s >= d { break }
      t += 1 / 60
    }
    ob.orient(from: PoolBallSphere.restPose(ball))
    self.ob = ob
    others = [:]
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
  /// `aim` có thì đánh đúng hướng đó thay cho `solve()`.
  func toggleReplay(reduceMotion: Bool, aim: CGFloat? = nil) {
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
    var r = ShotReplay(ms, ball: ball, tipX: tipX, tipY: tipY, theta: theta, speed: speed, aim: aim, jump: reduceMotion)
    r.pass = r.clean(pocket)
    play(r)
  }

  /// Bài squirt: `expectedCuePath` đúng hai điểm, từ bi cái tới ghost của bi mục tiêu. Play đánh theo hướng ngắm của tip
  /// giữa cùng lực thay vì `solve()` bù phê, để thấy squirt và throw đẩy bi lệch dày hay mỏng ở lỗ. Sai quá nửa inch là nil.
  func centerAim(_ d: DrillRecord) -> CGFloat? {
    guard let g = d.guideLines.first(where: { $0.kind == "expectedCuePath" }), g.points.count == 2,
          let c = balls[0], let ball = aimBall, let o = balls[ball], let pocket = aimPocket,
          ShotPhysics.isPocket(pocket), let P = ShotPhysics.target(pocket), let ms = shotSetup else { return nil }
    let inch = { (p: PointRecord) in CGPoint(x: CGFloat(p.x) * Self.width, y: CGFloat(p.y) * Self.length) }
    let a = inch(g.points[0]), b = inch(g.points[1]), G = ShotPhysics.ghost(o, P).g
    guard hypot(a.x - c.x, a.y - c.y) <= 0.5, hypot(b.x - G.x, b.y - G.y) <= 0.5 else { return nil }
    return ShotPhysics.solve(ms, tipX: 0, tipY: tipY, theta: theta, speed: speed).map { atan2($0.L.y, $0.L.x) }
  }

  /// Cú chỉ đánh bi cái: không `aimBall`, `aimPocket` là điểm trên băng (Stroke của Daily Workout) hay một lỗ (cổng NPL).
  /// Bi khác trên bàn đứng yên làm cổng, bi cái không va chúng. Đích băng thì đánh thẳng về điểm đó; đích lỗ thì bù
  /// squirt như back-hand english, bi cái vào tâm lỗ. Đạt là bi cái vào lỗ khi đích là lỗ, không rơi lỗ khi đích là băng.
  /// nil nếu đầu cơ quá mức.
  func soloReplay(jump: Bool) -> ShotReplay? {
    guard demo == nil, aimBall == nil, let c = balls[0], let pocket = aimPocket,
          let P = ShotPhysics.target(pocket), hypot(tipX, tipY) <= ShotPhysics.tipMax + 0.001 else { return nil }
    // Số bi giả không trùng bi đang đứng, để bi cổng không bị bản chạy che.
    let free = (1...15).first { balls[$0] == nil } ?? 1
    let ms = ShotPhysics.Setup(c: c, o: CGPoint(x: -1000, y: -1000), pocket: pocket, others: [], ball: free)
    let isPocket = ShotPhysics.isPocket(pocket)
    var aim = atan2(P.y - c.y, P.x - c.x)
    if isPocket, let h = ShotPhysics.hit(ms, aim: aim, tipX: tipX, tipY: tipY, theta: theta, speed: speed) { aim += h.squirtDeg * .pi / 180 }
    var r = ShotReplay(ms, ball: free, tipX: tipX, tipY: tipY, theta: theta, speed: speed, aim: aim, jump: jump)
    r.solo = true
    r.pass = r.cue.sink == isPocket
    return r
  }

  /// Drill có đường bi cái ghi từ video: diễn lại nó khi bàn còn đúng thế video, tức bi cái đứng ở mẫu đầu và bi mục tiêu
  /// cách mẫu chạm một bi, sai không quá nửa inch. Lệch thì nil để Play quay về engine.
  func videoReplay(_ rec: ReplayRecord, jump: Bool) -> ShotReplay? {
    let pts = stride(from: 0, to: rec.xy.count - 1, by: 2).map {
      CGPoint(x: CGFloat(rec.xy[$0]) * Self.width, y: CGFloat(rec.xy[$0 + 1]) * Self.length)
    }
    guard pts.count > 1, pts.indices.contains(rec.contact), let c = balls[0], let ball = aimBall, let o = balls[ball],
          let pocket = aimPocket.flatMap(ShotPhysics.target),
          hypot(c.x - pts[0].x, c.y - pts[0].y) <= 0.5,
          abs(hypot(o.x - pts[rec.contact].x, o.y - pts[rec.contact].y) - 2 * ShotPhysics.ballRadius) <= 0.5
    else { return nil }
    return ShotReplay(recorded: pts, dt: CGFloat(rec.dt), hit: rec.contact, ball: ball, o: o, pocket: pocket, jump: jump)
  }

  /// Play của drill mà `DrillShotPlanner` lo: dò cú trên nền vì bank có thể mất nửa giây, xong thì chạy nếu bàn chưa đổi.
  /// Bàn thiếu bi để dò thì `blocked`.
  /// Giải cú của round một lần lúc dựng bàn. Preview, đường vẽ, thẻ và Play cùng dùng kết quả này.
  /// `planned`: planner dò hướng và lực theo guide, chạy nền. Còn lại là cú thường: hướng ngắm theo tip và lực của round.
  /// nil khi không có cú: bị che, planner không tìm ra, hay cú chỉ có bi cái. Bàn đổi lúc planner đang chạy thì bỏ kết quả.
  func planDrill(_ d: DrillRecord, planned: Bool, done: @escaping (DrillShot?) -> Void) {
    let balls = balls, aimBall = aimBall, aimPocket = aimPocket, tipX = tipX, tipY = tipY, theta = theta, speed = speed
    guard planned else {
      guard let ball = aimBall, let pocket = aimPocket, let ms = shotSetup,
            ShotPhysics.shotOf(ball: ball, pocket: pocket, balls: balls)?.level != .bad else { return done(nil) }
      return done(DrillShot(balls: balls, setup: ms, aim: centerAim(d), tipX: tipX, tipY: tipY, theta: theta, speed: speed, pass: nil))
    }
    let inch = { (p: PointRecord) in CGPoint(x: CGFloat(p.x) * Self.width, y: CGFloat(p.y) * Self.length) }
    var g = DrillShotPlanner.Guides()
    for l in d.guideLines {
      switch l.kind {
      case "expectedCuePath": g.cuePath = l.points.map(inch)
      case "objectBallBankPath": g.bankPath = l.points.map(inch)
      case "objectBallPath" where !l.pocket.isEmpty && g.goal == nil: g.goal = (l.ball, l.pocket)
      default: break
      }
    }
    DispatchQueue.global(qos: .userInitiated).async {
      let s = DrillShotPlanner.plan(skill: d.skill, balls: balls, aimBall: aimBall, aimPocket: aimPocket, guides: g,
                                    tipX: tipX, tipY: tipY, speed: speed)
      DispatchQueue.main.async { [weak self] in
        guard let self, self.balls == balls else { return }
        done(s.map { DrillShot(balls: balls, setup: $0.setup, aim: $0.aim, tipX: $0.tipX, tipY: $0.tipY, theta: $0.theta, speed: $0.speed, pass: $0.pass) })
      }
    }
  }

  /// Play khi cú của round chưa giải xong: giải ngay rồi đánh.
  func playDrill(_ d: DrillRecord, jump: Bool, blocked: @escaping () -> Void) {
    planDrill(d, planned: true) { [weak self] s in
      guard let self, self.replay == nil else { return }
      guard let s else { self.onReplayEnd = nil; return blocked() }
      self.play(s.replay(jump: jump))
    }
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
    // Play một cú vào sạch ở drill: báo JS ngay lúc bi dừng và giữ khung cuối tới khi bàn round kế về (`adopt`),
    // để bàn không lộ lại thế trước cú. Không có round kế thì sau 1 s bàn về như cũ.
    let made = r.pass ?? (r.ob.sink && !r.cue.sink)
    let handoff = rack == nil && onReplayEnd != nil && made
    // Giữ vị trí cuối một nhịp cho mắt đọc, rồi bàn về như cũ.
    let hold = r.jump ? 1.2 : max(0, r.end - now) / r.rate + (handoff ? 0 : 0.6)
    DispatchQueue.main.asyncAfter(deadline: .now() + hold) { [weak self] in
      guard alive() else { return }
      // Chuỗi chạy bàn: dời bi về chỗ dừng trước khi bản chạy tắt, để bi thật hiện đúng chỗ đó.
      self?.rackStepEnded()
      if handoff {
        self?.handoff = r.id
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
          guard alive(), self?.handoff == r.id else { return }
          self?.handoff = nil
          withAnimation(.easeOut(duration: 0.2)) { self?.replay = nil }
        }
      } else {
        withAnimation(.easeOut(duration: 0.2)) { self?.replay = nil }
      }
      let end = self?.onReplayEnd
      self?.onReplayEnd = nil
      end?(made, r.cue.sink ? nil : r.cue.pts.last)
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
