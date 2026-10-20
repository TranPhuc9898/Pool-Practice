import Foundation
import SwiftUI

/// Nhiều bi và Gợi ý đường. Khay dưới bàn ở Tự xếp bi: kéo bi từ khay thả lên nỉ, chạm đúp nỉ cũng đặt bi,
/// thả bi vào lỗ là cất về khay. Nút Gợi ý nằm trên thanh tiêu đề. Đường gợi ý vẽ bằng guide và replay sẵn có.
extension PoolEditorModel {
  /// Lời gợi ý chỉ đúng cho đúng thế bi và đúng cú lúc gợi ý. Đổi bất cứ gì là lời đó thôi hiện.
  struct Hint: Equatable {
    let text: String
    let good: Bool
    let balls: [Int: CGPoint]
    let shot: [CGFloat]

    func current(_ m: PoolEditorModel) -> Bool { m.balls == balls && Self.key(m) == shot }
    static func key(_ m: PoolEditorModel) -> [CGFloat] {
      [CGFloat(m.aimBall ?? -1), CGFloat((m.aimPocket ?? "").hashValue), m.tipX, m.tipY, m.speed]
    }
  }

  var hintText: String? {
    if suggesting { return "Finding a route…" }
    return hint.flatMap { $0.current(self) ? $0.text : nil }
  }

  /// Chạm đúp chỗ trống trên nỉ: đặt bi số nhỏ nhất còn thiếu (1…9), chưa có bi cái thì đặt bi cái trước.
  /// Kéo từ khay thì `number` là bi đang cầm.
  func addBall(at p: CGPoint, number: Int? = nil) -> Bool {
    let r = PoolTableSpec.ballDiameter / 2
    let c = CGPoint(x: min(max(p.x, r), Self.width - r), y: min(max(p.y, r), Self.length - r))
    if balls.values.contains(where: { hypot($0.x - c.x, $0.y - c.y) < PoolTableSpec.ballDiameter }) {
      EditorHaptics.fire(.warning, "A ball is already here")
      return false
    }
    if ShotPhysics.pockets.values.contains(where: { hypot($0.x - c.x, $0.y - c.y) < ShotPhysics.pocketCatch }) {
      EditorHaptics.fire(.warning, "Too close to the pocket")
      return false
    }
    guard let n = number ?? (0...9).first(where: { balls[$0] == nil }), balls[n] == nil else {
      EditorHaptics.fire(.warning, "All 9 balls placed")
      return false
    }
    replay = nil
    picking = nil
    balls[n] = c
    EditorHaptics.fire(.light, "Placed \(ShotPhysics.name(n))")
    return true
  }

  /// Chỗ trống ngẫu nhiên, xa lỗ, cách bi khác hơn cỡ bi vẽ trên màn để không dính nhau.
  func freeSpot() -> CGPoint? {
    let gap = PoolTableSpec.ballDiameter * Self.ballZoom + 1, edge = PoolTableSpec.ballDiameter
    for _ in 0..<200 {
      let c = CGPoint(x: .random(in: edge...(Self.width - edge)), y: .random(in: edge...(Self.length - edge)))
      if !balls.values.contains(where: { hypot($0.x - c.x, $0.y - c.y) < gap }),
         !ShotPhysics.pockets.values.contains(where: { hypot($0.x - c.x, $0.y - c.y) < ShotPhysics.pocketCatch * 2 }) { return c }
    }
    return nil
  }

  /// Nút rải trên khay: thêm bi còn thiếu vào chỗ trống. Khay đã rỗng thì rải lại bi mục tiêu, bi cái giữ nguyên.
  func scatter() {
    layout()
    if balls.count >= 10 { balls = balls.filter { $0.key == 0 } }
    if balls[0] == nil { balls[0] = CGPoint(x: Self.width / 2, y: Self.length * 0.75) }
    for n in 1...9 where balls[n] == nil { balls[n] = freeSpot() }
    // Bàn mới thì cú cũ hết đúng: ngắm lại bi nhỏ nhất vào lỗ có góc cắt nhỏ nhất. Không lỗ nào ăn thì để trống, không báo "không có góc đánh" oan.
    aimBall = (1...9).first { balls[$0] != nil }
    aimPocket = aimBall.flatMap { b in
      PoolEditorGuides.pocketOrder.compactMap { p in
        ShotPhysics.shotOf(ball: b, pocket: p, balls: balls).flatMap { $0.level == .bad ? nil : (p, $0.cut ?? 180) }
      }.min { $0.1 < $1.1 }?.0
    }
    EditorHaptics.fire(.light, "Spread \(balls.count - 1) balls")
  }

  /// Thả bi mục tiêu sát miệng lỗ là cất bi khỏi bàn. Bi cái giữ lại vì cú nào cũng cần.
  func pocketIfDropped(_ n: Int) -> Bool {
    guard n != 0, let p = balls[n], ShotPhysics.pockets.values.contains(where: { hypot($0.x - p.x, $0.y - p.y) < ShotPhysics.pocketCatch }) else { return false }
    balls[n] = nil
    if aimBall == n { aimBall = nil; aimPocket = nil }
    EditorHaptics.fire(.light, "Removed \(ShotPhysics.name(n))")
    return true
  }

  /// Tìm cú tự nhiên nhất cho bi số nhỏ nhất theo luật 9-ball, chạy nền. Xong thì đặt cú vào model để guide tự vẽ.
  func suggest(onDone: @escaping () -> Void) {
    guard !suggesting else { return }
    if demo != nil || lesson != nil { layout() }
    guard let cue = balls[0] else { return note("No cue ball yet", good: false) }
    let obs = balls.filter { $0.key != 0 }
    guard let n = obs.keys.min() else { return note("Double-tap the cloth to place a ball", good: false) }
    let P2 = { (p: CGPoint) in RackPlanner.P2(x: Double(p.x), y: Double(p.y)) }
    let L = RackPlanner.Layout(cue: P2(cue), balls: obs.mapValues(P2))
    let before = balls
    replay = nil
    picking = nil
    suggesting = true
    DispatchQueue.global(qos: .userInitiated).async {
      let r = RackPlanner.plan(L)
      NSLog("[suggest] %.0f ms, %d sims, %d aims, best %@", r.ms, r.stats.sims, r.stats.aim,
            r.best.map { "\($0.n)→\($0.pocket) a \($0.s.a) b \($0.s.b) v \($0.s.v) p \($0.p)" } ?? "none")
      DispatchQueue.main.async {
        self.suggesting = false
        // Bàn đã đổi trong lúc tính thì bỏ kết quả, cú đó không còn đúng.
        guard self.balls == before else { return }
        guard let b = r.best else {
          return self.note("No clean shot on \(ShotPhysics.name(n))", good: false)
        }
        self.aimBall = b.n
        self.aimPocket = b.pocket
        self.tipX = CGFloat((b.s.a * 100).rounded() / 100)
        self.tipY = CGFloat((b.s.b * 100).rounded() / 100)
        self.speed = CGFloat((b.s.v * 10).rounded() / 10)
        // Một dòng trong cột chữ của panel: tỉ lệ vào và bi kế tiếp, không tên lỗ.
        var text = "Suggested: \(Int((b.p * 100).rounded()))% to pot"
        if b.win { text += ", runs out" } else if let c = b.childBall { text += ", then \(ShotPhysics.name(c))" }
        self.note(text, good: true)
        onDone()
      }
    }
  }

  private func note(_ text: String, good: Bool) {
    hint = Hint(text: text, good: good, balls: balls, shot: Hint.key(self))
    EditorHaptics.fire(good ? .selection : .warning, "Hint: " + text)
  }
}

/// Chuỗi cú chạy bàn của drill: luồng nền dò từng cú bằng planner rồi dựng replay trên thế bi cú trước để lại,
/// màn chính diễn lần lượt. Dò cú sau trong lúc cú trước đang chạy, nên chỉ cú đầu phải chờ.
final class RackRun {
  struct Step {
    /// Thứ tự cú trong chuỗi, từ 0. Drill có `shots` thì khớp chỉ số trong `shots`.
    let shot: Int
    let ball: Int
    let pocket: String
    let tipX, tipY, speed: CGFloat
    let replay: ShotReplay
    /// Thế bi lúc vào cú, để vẽ tangent của đúng cú đang chạy.
    let setup: ShotPhysics.Setup
    /// Thế bi sau cú, bi đã rơi lỗ không còn.
    let after: [Int: CGPoint]
    /// Bi mục tiêu vào lỗ và bi cái không rơi.
    let ok: Bool
  }

  struct Start { let balls: [Int: CGPoint]; let aimBall: Int?; let aimPocket: String?; let tipX, tipY, speed: CGFloat }

  let start: Start
  let onStep: (Step) -> Void
  /// Gọi một lần lúc chuỗi chốt, kèm cú cuối đã diễn (nil nếu không cú nào).
  let onEnd: (Step?) -> Void
  /// Drill có `shots`: mỗi lần Play chỉ đánh một cú.
  let fixed: Bool
  var steps: [Step] = []
  /// Cú kế tiếp sẽ diễn.
  var next = 0
  /// Luồng nền đã dò xong, không còn cú nào tới nữa.
  var planned = false
  /// Đã diễn hết: hết bàn, trượt, hay không còn cú.
  var over = false
  private let lock = NSLock()
  private var stop = false
  var cancelled: Bool {
    get { lock.lock(); defer { lock.unlock() }; return stop }
    set { lock.lock(); stop = newValue; lock.unlock() }
  }

  init(start: Start, fixed: Bool, onStep: @escaping (Step) -> Void, onEnd: @escaping (Step?) -> Void) {
    self.start = start
    self.fixed = fixed
    self.onStep = onStep
    self.onEnd = onEnd
  }
}

extension PoolEditorModel {
  /// Play shot của drill chạy bàn: đánh bi số nhỏ nhất bằng cú `RackShotSolver`, bi cái dừng đâu đánh bi kế từ đó,
  /// tới khi hết bàn, trượt bi hay không còn cú thẳng nào.
  /// `shots`: drill chạy bài cố định, mỗi lần chỉ đánh cú `from` rồi dừng để người tập bấm Play cú kế. Bi cái chỉ đặt
  /// ở cú 1, cú sau đánh từ chỗ dừng thật, hướng cơ giải lại như harness `scripts/position-harness/`.
  /// `from`: cú cần đánh, bàn phải đang ở thế trước cú đó (`FixedShot.before`).
  func startRack(reduceMotion: Bool, zone: DrillTargetSolver.Zone? = nil, shots: [ShotRecord] = [],
                 from: Int = 0, onStep: @escaping (RackRun.Step) -> Void, onEnd: @escaping (RackRun.Step?) -> Void = { _ in }) {
    stopRack()
    let run = RackRun(start: .init(balls: balls, aimBall: aimBall, aimPocket: aimPocket, tipX: tipX, tipY: tipY, speed: speed),
                      fixed: !shots.isEmpty, onStep: onStep, onEnd: onEnd)
    rack = run
    let first = balls
    DispatchQueue.global(qos: .userInitiated).async { [weak self] in
      var cur = first
      // Cú đầu theo lỗ drill đặt sẵn (drill 17: bi 1 vào lỗ giữa trái), các cú sau solver tự chọn.
      var only = run.start.aimBall == first.keys.filter({ $0 != 0 }).min() ? run.start.aimPocket : nil
      var k = from
      let last = shots.isEmpty ? .max : min(shots.count, from + 1)
      while !run.cancelled, let c = cur[0], k < last {
        let obs = cur.filter { $0.key != 0 }
        guard !obs.isEmpty else { break }
        let t0 = Date()
        let b: (ball: Int, pocket: String, setup: ShotPhysics.Setup, tipX: CGFloat, tipY: CGFloat, speed: CGFloat)
        if !shots.isEmpty {
          let s = shots[k]
          guard let ms = FixedShot.setup(s, on: cur) else { break }
          b = (s.ball, s.pocket, ms, CGFloat(s.tipX), CGFloat(s.tipY), CGFloat(s.speed))
        } else {
          let pick = only.map { RackShotSolver.opening(cur, only: $0, zone: zone) } ?? RackShotSolver.best(cur)
          guard let p = pick, !run.cancelled else { break }
          b = (p.ball, p.pocket, p.setup, p.tipX, p.tipY, p.speed)
        }
        only = nil
        let ms = b.setup, tipX = b.tipX, tipY = b.tipY, speed = b.speed
        let took = Date().timeIntervalSince(t0) * 1000
        let replay = ShotReplay(ms, ball: b.ball, tipX: tipX, tipY: tipY, speed: speed, jump: reduceMotion)
        let after = FixedShot.after(replay, on: cur)
        let ok = replay.ob.sink && !replay.cue.sink
        let stop = after[0] ?? CGPoint(x: -1, y: -1)
        NSLog("[rack] %d→%@ a %.2f b %.2f v %.1f, %.0f ms, %@, cue (%.1f,%.1f)", b.ball, b.pocket, tipX, tipY, speed, took,
              ok ? "in" : "miss", stop.x, stop.y)
        let step = RackRun.Step(shot: k, ball: b.ball, pocket: b.pocket, tipX: tipX, tipY: tipY, speed: speed, replay: replay, setup: ms, after: after, ok: ok)
        DispatchQueue.main.async {
          guard let self, self.rack === run else { return }
          run.steps.append(step)
          self.advanceRack()
        }
        guard ok else { break }
        cur = after
        k += 1
      }
      DispatchQueue.main.async {
        guard let self, self.rack === run else { return }
        run.planned = true
        self.advanceRack()
      }
    }
  }

  /// Dò sẵn cú mở bàn đúng như `startRack` sẽ dò ở cú đầu.
  func prefetchOpening(zone: DrillTargetSolver.Zone?) {
    let b = balls
    guard aimBall == b.keys.filter({ $0 != 0 }).min(), let pocket = aimPocket else { return }
    DispatchQueue.global(qos: .utility).async { _ = RackShotSolver.opening(b, only: pocket, zone: zone) }
  }

  /// Dừng chuỗi và trả bàn về thế bi lúc bấm Play.
  func stopRack() {
    guard let run = rack else { return }
    run.cancelled = true
    rack = nil
    replay = nil
    let s = run.start
    balls = s.balls; aimBall = s.aimBall; aimPocket = s.aimPocket; tipX = s.tipX; tipY = s.tipY; speed = s.speed
  }

  /// Bàn đang rảnh thì diễn cú kế. Hết cú đã dò mà luồng nền xong thì chốt chuỗi.
  private func advanceRack() {
    guard let run = rack, !run.over, replay == nil else { return }
    guard run.next < run.steps.count else {
      if run.planned { endRack(run) }
      return
    }
    let step = run.steps[run.next]
    run.next += 1
    // Ball in hand: bi cái nhấc tới chỗ solver đặt trước khi đánh.
    balls[0] = step.setup.c
    aimBall = step.ball; aimPocket = step.pocket
    tipX = step.tipX; tipY = step.tipY; speed = step.speed
    run.onStep(step)
    var r = step.replay
    r.start = Date()
    play(r)
  }

  /// Gọi lúc replay của chuỗi tự đóng: bi đứng lại đúng chỗ cú vừa để lại, nghỉ một nhịp rồi đánh tiếp.
  func rackStepEnded() {
    guard let run = rack, run.next > 0 else { return }
    let step = run.steps[run.next - 1]
    balls = step.after
    guard step.ok else { return endRack(run) }
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) { [weak self] in
      guard let self, self.rack === run else { return }
      self.advanceRack()
    }
  }

  private func endRack(_ run: RackRun) {
    guard !run.over else { return }
    run.over = true
    let left = balls.keys.filter { $0 != 0 }.sorted()
    let last = run.steps.last
    if left.isEmpty {
      EditorHaptics.fire(.selection, run.fixed ? "Rack cleared" : "Rack cleared in \(run.steps.count) shots")
    } else if let last, !last.ok {
      EditorHaptics.fire(.warning, balls[0] == nil ? "Cue ball scratched" : "Missed \(ShotPhysics.name(last.ball))")
    } else if run.fixed, let last {
      // Một cú của drill có `shots` vào sạch: bàn đứng chờ cú kế, không phải hết cú.
      EditorHaptics.fire(.selection, "Pocketed \(ShotPhysics.name(last.ball))")
    } else {
      EditorHaptics.fire(.warning, "No clean shot on \(ShotPhysics.name(left[0]))")
    }
    run.onEnd(last)
  }
}

/// Cú cố định của drill có `shots`: hướng cơ giải từ chỗ bi cái đang đứng. Chạy bàn và nút cú trước/cú sau
/// dùng chung, để thế bàn dựng lại trước cú i khớp đúng chỗ bi dừng lúc chạy.
enum FixedShot {
  static func setup(_ s: ShotRecord, on cur: [Int: CGPoint]) -> ShotPhysics.Setup? {
    guard let c = cur[0], let o = cur[s.ball] else { return nil }
    let others = cur.filter { $0.key != 0 && $0.key != s.ball }.map { ShotPhysics.Obstacle(n: $0.key, p: $0.value) }.sorted { $0.n < $1.n }
    return ShotPhysics.Setup(c: c, o: o, pocket: s.pocket, others: others, ball: s.ball)
  }

  /// Thế bi sau cú, bi đã rơi lỗ không còn.
  static func after(_ r: ShotReplay, on cur: [Int: CGPoint]) -> [Int: CGPoint] {
    var after = cur
    after[0] = r.cue.sink ? nil : r.cue.pts.last
    after[r.ball] = r.ob.sink ? nil : r.ob.pts.last
    for (n, t) in r.others { after[n] = t.sink ? nil : t.pts.last }
    return after
  }

  /// Thế bi trước cú `i`: chơi lần lượt các cú trước nó từ thế đầu. Có cú trượt hay bi cái rơi thì nil.
  static func before(_ i: Int, shots: [ShotRecord], from start: [Int: CGPoint]) -> [Int: CGPoint]? {
    var cur = start
    for s in shots.prefix(i) {
      guard let ms = setup(s, on: cur) else { return nil }
      let r = ShotReplay(ms, ball: s.ball, tipX: CGFloat(s.tipX), tipY: CGFloat(s.tipY), speed: CGFloat(s.speed), jump: true)
      guard r.ob.sink, !r.cue.sink else { return nil }
      cur = after(r, on: cur)
    }
    return cur
  }

  /// Drill vẽ cho cú `i` trên thế bi `balls` (inch): bi cú đó đứng đầu để guide tự thêm ghost và đường bi cái,
  /// đường bi mục tiêu của cú kế, và zone của các cú từ `i` trở đi. Id mới để guide và zone vẽ lại.
  static func drill(_ d: DrillRecord, shot i: Int, balls: [Int: CGPoint]) -> DrillRecord {
    let s = d.shots[i]
    let W = Double(PoolEditorModel.width), L = Double(PoolEditorModel.length)
    let point = { (p: CGPoint) -> PointRecord in
      var r = PointRecord(); r.x = Double(p.x) / W; r.y = Double(p.y) / L; return r
    }
    let guide = { (kind: String, s: ShotRecord) -> GuideLineRecord in
      var g = GuideLineRecord(); g.kind = kind; g.ball = s.ball; g.pocket = s.pocket; return g
    }
    // Record của Expo giữ trường bằng class, chép struct là dùng chung: dựng mới hết, không sửa bản của props.
    var out = DrillRecord()
    out.id = "\(d.id)#\(i)"
    out.skill = d.skill
    out.shots = d.shots
    if let c = balls[0] { out.cueBall = point(c) }
    out.objectBalls = balls.keys.filter { $0 != 0 }.sorted { ($0 == s.ball ? 0 : 1, $0) < ($1 == s.ball ? 0 : 1, $1) }.map { n in
      let p = point(balls[n]!)
      var b = BallRecord(); b.number = n; b.x = p.x; b.y = p.y; return b
    }
    out.targetPocket = s.pocket
    out.guideLines = [guide("objectBallPath", s), guide("ghostBall", s), guide("cueBallPath", s)]
      + (i + 1 < d.shots.count ? [guide("objectBallPath", d.shots[i + 1])] : [])
    out.cueBallTargetZones = d.shots[i...].compactMap { d.cueBallTargetZones.indices.contains($0.zone) ? d.cueBallTargetZones[$0.zone] : nil }
    return out
  }
}

/// Chọn cú chạy bàn bằng chính `ShotPhysics` mà replay dùng, để bi dừng đúng chỗ đã chấm. Planner 9 bi chấm bằng
/// `RackSim`, hai engine lệch nhau đủ để cú "đẹp" của planner thành bốn băng đâm vào bi khác. Chỉ mượn hình học
/// của planner: lọc lỗ ăn được, ghost, góc cắt, khoảng cách. Nhìn trước hai tầng.
enum RackShotSolver {
  struct Pick {
    let ball: Int
    let pocket: String
    let tipX, tipY, speed: CGFloat
    let setup: ShotPhysics.Setup
    let after: [Int: CGPoint]
    let score: Double
  }

  struct Grid { let xs, ys, vs: [CGFloat] }
  /// Lưới thường cho cú giữa chuỗi.
  static let coarse = Grid(xs: [0], ys: [-0.4, -0.2, 0, 0.2, 0.4], vs: [1.0, 1.4, 1.8, 2.3, 2.9, 3.6])
  /// Lưới mịn cho cú phải đưa bi cái vào vùng vẽ sẵn của drill: vùng chỉ rộng ~4,5 inch, lưới thường hay trượt.
  static let fine = Grid(xs: [-0.3, -0.15, 0, 0.15, 0.3], ys: stride(from: -0.5, through: 0.5, by: 0.1).map { CGFloat($0) },
                         vs: (4...18).map { CGFloat($0) / 5 })

  /// Thế bi đánh được bi kế, như vùng của bài điều bi (`PoolEditorModel.Position`): bi cái cách ghost từ 8 inch,
  /// góc cắt không quá 30° (luật drill 15). Sát bi thì hết đường điều tiếp, mỏng quá thì khó vào và khó điều.
  static let maxCut = 30.0, minDist = 8.0

  static func layout(_ balls: [Int: CGPoint]) -> RackPlanner.Layout? {
    guard let c = balls[0] else { return nil }
    let p = { (q: CGPoint) in RackPlanner.P2(x: Double(q.x), y: Double(q.y)) }
    return RackPlanner.Layout(cue: p(c), balls: balls.filter { $0.key != 0 }.mapValues(p))
  }

  /// Giá trị thế bi: hết bi là 1, bi cái rơi là 0, còn lại là cú thẳng tốt nhất vào bi nhỏ nhất. Độ dễ nhân phạt
  /// khi bi cái gần ghost dưới 8 inch (dính bi cho độ dễ cao nhưng là thế chết) và khi góc cắt quá 30°.
  static func value(_ balls: [Int: CGPoint]) -> Double {
    guard let L = layout(balls) else { return 0 }
    guard let n = RackPlanner.lowest(L) else { return 1 }
    var best = 0.01
    for h in RackPlanner.T.holes {
      let g = RackPlanner.geom(L, n, h)
      var e = RackPlanner.easeOf(g, h)
      if g.d1 < minDist { e *= pow(max(g.d1, 1) / minDist, 2) }
      if g.cut > maxCut { e *= 0.05 }
      best = max(best, e)
    }
    return best
  }

  /// Mọi cú ăn bi nhỏ nhất, bi cái không rơi, chấm một tầng và xếp từ tốt tới tệ.
  static func level(_ balls: [Int: CGPoint], only: String? = nil, grid: Grid = coarse) -> [Pick] {
    guard let L = layout(balls), let n = RackPlanner.lowest(L), let cue = balls[0], let o = balls[n] else { return [] }
    let others = balls.filter { $0.key != 0 && $0.key != n }.map { ShotPhysics.Obstacle(n: $0.key, p: $0.value) }
    let holes = RackPlanner.T.holes.filter { only == nil || $0.id == only }.compactMap { h -> (RackSim.Hole, Double)? in
      let e = RackPlanner.easeOf(RackPlanner.geom(L, n, h), h)
      return e > 0.05 ? (h, e) : nil
    }
    let tips = grid.xs.flatMap { a in grid.ys.compactMap { b in hypot(a, b) <= DrillTargetSolver.tipLimit + 1e-6 ? (a, b) : nil } }
    let lock = NSLock()
    var out: [Pick] = []
    DispatchQueue.concurrentPerform(iterations: holes.count * tips.count) { k in
      let (hole, ease) = holes[k / tips.count], (a, b) = tips[k % tips.count], pocket = hole.id
      let ms = ShotPhysics.Setup(c: cue, o: o, pocket: pocket, others: others, ball: n)
      var found: [Pick] = []
      for v in grid.vs {
        let r = ShotPhysics.runWith(ms, tipX: a, tipY: b, speed: v)
        // Cú thẳng thật: bi mục tiêu vào đúng lỗ đã chọn, không đụng bi nào khác, và cả đường đi nằm trên tia
        // từ bi mục tiêu theo hướng sau va chạm (lệch dưới 1 inch) cho tới miệng lỗ. Thiếu điều này solver nhận
        // cả cú bốn băng tình cờ rơi lỗ. Không dùng `bounces` vì chạm hàm lỗ cũng tính một lần.
        guard r.short == nil, r.scratch == nil, r.ob.pocket == pocket, r.ob.hit ?? 0 == 0,
              straight(r.ob.pts, from: o, dir: r.d, hole: hole.c) else { continue }
        var after = balls
        after[0] = r.stop
        after[n] = nil
        for (m, t) in r.moved { after[m] = t.pocket == nil ? t.stop : nil }
        let pen = Double(max(0, hypot(a, b) - 0.2) + 0.25 * max(0, v - 2)) + 0.15 * Double(r.moved.count)
        let score = ease * exp(-pen) * value(after)
        found.append(Pick(ball: n, pocket: pocket, tipX: a, tipY: b, speed: v, setup: ms, after: after, score: score))
      }
      lock.lock(); out += found; lock.unlock()
    }
    return out.sorted { $0.score > $1.score }
  }

  /// Mọi điểm của vệt bi cách tâm lỗ quá 6 inch đều nằm sát tia `from` + t·`dir`, t ≥ 0.
  static func straight(_ pts: [CGPoint], from o: CGPoint, dir d: CGPoint, hole c: RackPlanner.P2) -> Bool {
    pts.allSatisfy { p in
      if hypot(Double(p.x) - c.x, Double(p.y) - c.y) < 6 { return true }
      let dx = p.x - o.x, dy = p.y - o.y
      return dx * d.x + dy * d.y > -0.5 && abs(dx * d.y - dy * d.x) < 1
    }
  }

  /// Bốn cú tốt nhất tầng đầu, mỗi cú cộng nửa điểm cú tốt nhất của tầng sau.
  /// `only`: lỗ drill đã chọn cho cú này. `zone`: vùng drill vẽ cho bi cái dừng. Có cú dừng trong vùng thì chỉ xét
  /// các cú đó; lỗ hay vùng không có cú nào đạt thì quay về chọn tự do.
  static func best(_ balls: [Int: CGPoint], only: String? = nil, zone: DrillTargetSolver.Zone? = nil) -> Pick? {
    let grid = zone == nil ? coarse : fine
    let forced = only.map { level(balls, only: $0, grid: grid) } ?? []
    var all = forced.isEmpty ? level(balls, grid: grid) : forced
    if let z = zone {
      let inside = all.filter { p in p.after[0].map { hypot($0.x - z.c.x, $0.y - z.c.y) <= z.r } ?? false }
      if !inside.isEmpty { all = inside }
    }
    return all.prefix(4).max { score($0) < score($1) }
  }

  /// Cú mở bàn theo zone dò lưới mịn mất 1,8 s (drill 15) tới 4 s (drill 17), bàn đứng im suốt lúc đó. Màn drill
  /// gọi sẵn lúc mở (`prefetchOpening`), Play cùng thế bàn thì lấy lại kết quả. Giữ khoá suốt lúc dò: Play bấm khi
  /// prefetch chưa xong thì chờ nó, không dò song song tranh CPU (đo: 7,6 s thay vì 4 s).
  private static var openings: [String: Pick?] = [:]
  private static let openingsLock = NSLock()
  static func opening(_ balls: [Int: CGPoint], only: String, zone: DrillTargetSolver.Zone?) -> Pick? {
    let key = balls.sorted { $0.key < $1.key }.map { String(format: "%d %.2f %.2f", $0.key, $0.value.x, $0.value.y) }
      .joined(separator: ";") + only + (zone.map { String(format: "%.2f %.2f %.2f", $0.c.x, $0.c.y, $0.r) } ?? "")
    openingsLock.lock()
    defer { openingsLock.unlock() }
    if let hit = openings[key] { return hit }
    let p = best(balls, only: only, zone: zone)
    openings[key] = p
    return p
  }

  private static func score(_ p: Pick) -> Double {
    guard p.after.count > 1 else { return p.score }
    let next = level(p.after).first?.score ?? 0.015
    return p.score * (0.5 + 0.5 * max(next, 0.015) / max(value(p.after), 0.015))
  }
}

/// Tangent của cú đang chạy trong chuỗi chạy bàn, chép đúng nét tangent của drill-editor-v7: gold #D8B451 0,55,
/// dài 12 inch từ ghost về phía bi cái đi, nét .12 đứt .6/.6 inch. Cú gần thẳng (cắt ≤ 1°) thì không vẽ.
struct RackTangentLayer: View {
  let setup: ShotPhysics.Setup
  let geometry: PoolTableGeometry

  var body: some View {
    let ghost = PoolGuideMath.ghost(object: setup.o, pocket: setup.P)
    let t = PoolGuideMath.tangent(cue: setup.c, object: setup.o, pocket: setup.P)
    let wall = PoolGuideMath.toCushion(from: ghost, dir: t)
    let len = min(12, hypot(wall.x - ghost.x, wall.y - ghost.y))
    let end = CGPoint(x: ghost.x + t.x * len, y: ghost.y + t.y * len)
    let a = ShotPhysics.unit(ghost.x - setup.c.x, ghost.y - setup.c.y)
    let cut = asin(min(1, abs(a.x * t.x + a.y * t.y))) * 180 / .pi
    let s = geometry.scale
    Path { $0.move(to: geometry.point(inchesX: ghost.x, inchesY: ghost.y)); $0.addLine(to: geometry.point(inchesX: end.x, inchesY: end.y)) }
      .stroke(PoolAimPalette.gold.opacity(cut > 1 ? 0.55 : 0), style: StrokeStyle(lineWidth: max(1, 0.12 * s), dash: [0.6 * s, 0.6 * s]))
      .allowsHitTesting(false)
      .accessibilityHidden(true)
  }
}
