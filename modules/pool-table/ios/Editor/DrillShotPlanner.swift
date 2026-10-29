import CoreGraphics
import Foundation

/// Cú Play của drill mà cú pot một bi không tả được: bank, kick, combo, safety, break, nhảy, massé, cú tới băng.
/// Ngắm danh nghĩa theo guide của drill, rồi dò hướng cơ quanh đó bằng chính `ShotPhysics` tới khi cú đạt yêu cầu
/// của bài. Không dò ra thì vẫn đánh hướng danh nghĩa, `pass` false để Play báo trượt thật.
/// Chỉ phụ thuộc `ShotPhysics`, để harness biên dịch cùng được.
enum DrillShotPlanner {
  struct Guides {
    /// `expectedCuePath`, inch. Điểm sau bi cái là ghost (safety) hay điểm băng (kick).
    var cuePath: [CGPoint] = []
    /// `objectBallBankPath`, inch. Điểm cuối gần lỗ thì đó là lỗ thật của cú bank.
    var bankPath: [CGPoint] = []
    /// `objectBallPath` có lỗ: bi này phải vào đúng lỗ này.
    var goal: (ball: Int, pocket: String)?
  }

  struct Shot {
    let setup: ShotPhysics.Setup
    let aim: CGFloat
    let tipX, tipY, theta, speed: CGFloat
    let pass: Bool
  }

  static let skills: Set<String> = ["bank", "break", "combo", "safety", "kick", "jump", "masse", "test"]

  /// Bàn đang là rack: từ năm bi mục tiêu, bi nào cũng có bi khác sát bên.
  static func racked(_ balls: [Int: CGPoint]) -> Bool {
    let obs = balls.filter { $0.key != 0 }.map(\.value)
    guard obs.count >= 5 else { return false }
    return obs.allSatisfy { p in obs.contains { $0 != p && hypot($0.x - p.x, $0.y - p.y) < ShotPhysics.ballDiameter + 0.3 } }
  }

  static func plan(skill: String, balls: [Int: CGPoint], aimBall: Int?, aimPocket: String?, guides: Guides,
                   tipX: CGFloat, tipY: CGFloat, speed: CGFloat) -> Shot? {
    guard let c = balls[0] else { return nil }
    let obs = balls.filter { $0.key != 0 }
    guard !obs.isEmpty else { return nil }
    let deg = CGFloat.pi / 180
    func toward(_ p: CGPoint) -> CGFloat { atan2(p.y - c.y, p.x - c.x) }
    func gap(_ a: CGPoint, _ b: CGPoint) -> CGFloat { hypot(a.x - b.x, a.y - b.y) }
    let nearest = { (skip: Int?) in obs.filter { $0.key != skip }.min { gap($0.value, c) < gap($1.value, c) }?.key }

    var ball = aimBall.flatMap { obs[$0] != nil ? $0 : nil } ?? obs.keys.min()!
    var goal = guides.goal
    var tipX = tipX, theta: CGFloat = 0, speed = speed
    var a0 = toward(obs[ball]!)
    var spread = 4 * deg, step = 0.25 * deg
    /// Lực và độ dựng cơ thử lần lượt; lực của drill luôn thử trước.
    var tries: [(speed: CGFloat, theta: CGFloat)] = []
    var rail = false, kick = false, noRail = false, banked = false, clear = true, slop = false
    var ghostAim: CGPoint?
    let railAim = aimPocket.map { !ShotPhysics.isPocket($0) } ?? false

    if skill == "break" || racked(balls) {
      // Phá bàn: thẳng vào bi đầu rack, lực phá. Đạt là bi cái không rơi.
      ball = nearest(nil)!
      a0 = toward(obs[ball]!)
      speed = min(max(speed, 2.6) * 3, 8)
      tipX = 0
      goal = nil
      spread = 1 * deg
      clear = false
      slop = true
    } else if skill == "combo", let g = goal, let t = obs[g.ball], let P = ShotPhysics.target(g.pocket),
              let a = nearest(g.ball) {
      // Combo: bi cái vào bi A, A đẩy bi đích vào lỗ. Ngắm ghost của A về ghost của bi đích.
      ball = a
      a0 = toward(ShotPhysics.ghost(obs[a]!, ShotPhysics.ghost(t, P).g).g)
    } else {
      let o = obs[ball]!
      // Bank: aimPocket là điểm băng, lỗ thật nằm ở cuối đường bank. Cuối đường không gần lỗ thì đích là băng.
      if railAim, goal == nil, let end = guides.bankPath.last {
        let hole = ShotPhysics.pockets.min { gap($0.value, end) < gap($1.value, end) }!
        if gap(hole.value, end) < 5 { goal = (ball, hole.key) } else { rail = true }
      }
      // Bi sát băng: điểm băng trùng chỗ bi, ngắm về điểm kế trên đường bank (băng đối diện hay lỗ).
      let via = guides.bankPath.dropFirst().first { gap($0, o) > 1 }
      if guides.cuePath.count >= 2 {
        let first = gap(guides.cuePath[0], c) < 1.5 ? guides.cuePath[1] : guides.cuePath[0]
        a0 = toward(first)
        if gap(first, o) < ShotPhysics.ballDiameter + 0.5 { ghostAim = first }
      } else if railAim, let P = aimPocket.flatMap(ShotPhysics.target), gap(P, o) > 1 {
        a0 = toward(ShotPhysics.ghost(o, P).g)
      } else if railAim, let v = via {
        a0 = toward(ShotPhysics.ghost(o, v).g)
      } else if let g = goal, g.ball == ball, let P = ShotPhysics.target(g.pocket) {
        a0 = toward(ShotPhysics.ghost(o, P).g)
      } else if let P = aimPocket.flatMap(ShotPhysics.target), skill != "safety" {
        a0 = toward(ShotPhysics.ghost(o, P).g)
      }
      if goal == nil, skill != "safety", skill != "kick", !rail, let p = aimPocket, ShotPhysics.isPocket(p) { goal = (ball, p) }
      switch skill {
      case "bank":
        // Băng của engine chưa hiệu chỉnh: lực drill không ra thì thử mạnh dần.
        // Phải đúng là bank: bi cái không chạm băng trước, bi mục tiêu chạm băng rồi mới vào lỗ.
        banked = true; spread = 20 * deg
        tries = [speed, speed * 1.3, speed * 1.6, 2.6, 3.2, 4, 5].map { ($0, 0) }
      case "kick":
        kick = true; spread = 8 * deg
        tries = [speed, speed * 1.3, 2.6].map { ($0, 0) }
      case "masse":
        // Massé: cơ dựng, phê theo drill. Dò rộng tìm đường cong vòng qua bi chắn mà không chạm băng.
        noRail = true; spread = 60 * deg; step = 0.5 * deg
        tries = [60, 70, 80].flatMap { t in [speed, 1.2, 1.8, 2.6].map { ($0, CGFloat(t)) } }
      case "jump":
        // Nhảy: engine không có pha bay, đoạn tới bi mục tiêu bỏ qua bi chắn như bi cái đã nhảy qua.
        clear = false
      case "safety": spread = 3 * deg
      default: break
      }
    }

    let others = obs.filter { $0.key != ball }.map { ShotPhysics.Obstacle(n: $0.key, p: $0.value) }.sorted { $0.n < $1.n }
    let ms = ShotPhysics.Setup(c: c, o: obs[ball]!, pocket: goal?.pocket ?? aimPocket ?? "footLeft", others: others, ball: ball)

    // Phê ngang làm bi cái lệch (squirt, swerve): xoay hướng ngắm tới khi tâm bi cái lúc chạm trùng ghost vẽ trong guide.
    if let g = ghostAim, tipX != 0 {
      for _ in 0..<4 {
        let r = ShotPhysics.runWith(ms, tipX: tipX, tipY: tipY, theta: theta, speed: speed, aim: a0)
        guard r.short != .cue else { break }
        a0 += toward(g) - toward(r.ghost)
      }
    }

    // Push out: đường bi cái vẽ không tới gần bi nào, nên cú đạt là bi cái không chạm bi, không rơi lỗ.
    let push = skill == "safety" && guides.cuePath.count >= 2 &&
      !guides.cuePath.contains { p in obs.values.contains { gap($0, p) < 3 } }

    func ok(_ a: CGFloat) -> Bool {
      let r = ShotPhysics.runWith(ms, tipX: tipX, tipY: tipY, theta: theta, speed: speed, aim: a)
      if push {
        return r.short == .cue && r.scratch == nil && r.pre.pts.allSatisfy { p in obs.values.allSatisfy { gap($0, p) >= ShotPhysics.ballDiameter - 0.05 } }
      }
      guard r.short != .cue, r.scratch == nil else { return false }
      if kick && r.pre.bounces == 0 { return false }
      if (noRail || banked) && r.pre.bounces > 0 { return false }
      if banked && r.ob.bounces == 0 { return false }
      if clear, r.pre.pts.contains(where: { p in others.contains { gap($0.p, p) < ShotPhysics.ballDiameter - 0.05 } }) { return false }
      if let g = goal, (g.ball == ball ? r.ob : r.moved[g.ball])?.pocket != g.pocket { return false }
      if rail && r.ob.bounces == 0 && r.ob.pocket == nil { return false }
      // Không ăn bừa: ngoài bi đích của bài (không có thì bi cái đánh vào) không bi nào được rơi. Phá bàn thì miễn.
      let keep = goal?.ball ?? ball
      if !slop, (r.ob.pocket != nil && ball != keep) || r.moved.contains(where: { $0.key != keep && $0.value.pocket != nil }) { return false }
      return true
    }

    // Mỗi lực, từ hướng danh nghĩa ra hai bên, lấy hướng đạt gần nhất.
    let n = Int((spread / step).rounded())
    for t in tries.isEmpty ? [(speed, theta)] : tries {
      speed = min(t.speed, 8); theta = t.theta
      for k in 0...(2 * n) {
        let a = a0 + CGFloat((k + 1) / 2) * step * (k % 2 == 0 ? -1 : 1)
        if ok(a) { return Shot(setup: ms, aim: a, tipX: tipX, tipY: tipY, theta: theta, speed: speed, pass: true) }
      }
    }
    let t = tries.first ?? (speed, theta)
    return Shot(setup: ms, aim: a0, tipX: tipX, tipY: tipY, theta: t.theta, speed: t.speed, pass: false)
  }
}
