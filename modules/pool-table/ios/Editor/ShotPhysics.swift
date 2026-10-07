import CoreGraphics
import Foundation

// Port của docs/prototypes/drill-editor-v7.html (shotOf, approach, cueRun, runWith, stunTip, fraction).
// Inch, giây. x 0..50, y 0..100, băng foot ở y = 0. Hằng số khớp docs/aiming-physics.md.
enum ShotPhysics {
  static let ballRadius: CGFloat = 1.125
  static let ballDiameter: CGFloat = 2.25
  static let width: CGFloat = 50
  static let length: CGFloat = 100
  static let gravity: CGFloat = 386.1
  static let muSlide: CGFloat = 0.2 * gravity
  static let muRoll: CGFloat = 0.01 * gravity
  static let railRestitution: CGFloat = 0.8
  static let inchesPerMeter: CGFloat = 39.37
  /// Dr. Dave: miscue khoảng 0.5R–0.6R tuỳ phấn và đầu cơ. Kéo được tới 0.6R, quá 0.5R là cảnh báo.
  static let tipMax: CGFloat = 0.6
  static let miscueSafe: CGFloat = 0.5
  /// Mặt bi kéo được tới sát mép. Quá `tipMax` là trượt cơ: vẫn đặt được để thấy, nhưng không mô phỏng.
  static let padMax: CGFloat = 0.85
  static let rollTip: CGFloat = 0.4
  static let cutWarn: CGFloat = 75

  static let pockets: [String: CGPoint] = [
    "footLeft": CGPoint(x: 0, y: 0), "footRight": CGPoint(x: 50, y: 0),
    "sideLeft": CGPoint(x: 0, y: 50), "sideRight": CGPoint(x: 50, y: 50),
    "headLeft": CGPoint(x: 0, y: 100), "headRight": CGPoint(x: 50, y: 100),
  ]
  static let pocketNames = [
    "footLeft": "góc trên trái", "footRight": "góc trên phải", "sideLeft": "giữa trái",
    "sideRight": "giữa phải", "headLeft": "góc dưới trái", "headRight": "góc dưới phải",
  ]
  // Miệng lỗ để bắt scratch: tâm và bán kính, inch.
  static let pocketMouths: [(id: String, c: CGPoint, r: CGFloat)] = [
    ("footLeft", CGPoint(x: -0.9, y: -0.9), 2.5), ("footRight", CGPoint(x: 50.9, y: -0.9), 2.5),
    ("sideLeft", CGPoint(x: -1.3, y: 50), 2.2), ("sideRight", CGPoint(x: 51.3, y: 50), 2.2),
    ("headLeft", CGPoint(x: -0.9, y: 100.9), 2.5), ("headRight", CGPoint(x: 50.9, y: 100.9), 2.5),
  ]

  struct Obstacle { let n: Int; let p: CGPoint }

  /// Cú chính đã đủ dữ kiện: bi cái, bi mục tiêu, lỗ, các bi còn lại.
  struct Setup {
    let c: CGPoint
    let o: CGPoint
    let pocket: String
    let others: [Obstacle]
    var P: CGPoint { ShotPhysics.pockets[pocket] ?? .zero }
  }

  enum Level { case ok, warn, bad }
  struct Verdict { var cut: CGFloat?; var level: Level = .ok; var why = "" }

  struct Approach { let v: CGFloat; let f: CGFloat; let s: CGFloat; var t: CGFloat = 0 }

  enum Short { case cue, ob }
  struct Run {
    var pts: [CGPoint] = []
    /// Giây tính từ lúc chạm, cùng chỉ số với `pts`.
    var ts: [CGFloat] = []
    var stop: CGPoint = .zero
    var scratch: String?
    var hit: Int?
    var short: Short?
    var gap: CGFloat = 0
    var obStop: CGPoint?
    var f: CGFloat = 0
    var vC: CGFloat = 0
    var ghost: CGPoint = .zero
    var d: CGPoint = .zero
    var a: CGPoint = .zero
  }

  // MARK: hình học

  static func unit(_ x: CGFloat, _ y: CGFloat) -> CGPoint {
    let l = max(hypot(x, y), 1e-9)
    return CGPoint(x: x / l, y: y / l)
  }

  static func segDist(_ p: CGPoint, _ a: CGPoint, _ b: CGPoint) -> CGFloat {
    let vx = b.x - a.x, vy = b.y - a.y
    let l = vx * vx + vy * vy == 0 ? 1e-6 : vx * vx + vy * vy
    let t = min(max(((p.x - a.x) * vx + (p.y - a.y) * vy) / l, 0), 1)
    return hypot(p.x - a.x - t * vx, p.y - a.y - t * vy)
  }

  static func ghost(_ o: CGPoint, _ P: CGPoint) -> (g: CGPoint, d: CGPoint) {
    let d = unit(P.x - o.x, P.y - o.y)
    return (CGPoint(x: o.x - d.x * ballDiameter, y: o.y - d.y * ballDiameter), d)
  }

  // MARK: luật cú đánh

  static func shotOf(ball: Int, pocket: String, balls: [Int: CGPoint]) -> Verdict? {
    guard let o = balls[ball], let P = pockets[pocket] else { return nil }
    let (G, d) = ghost(o, P)
    var r = Verdict()
    func bad(_ why: String) -> Verdict { r.level = .bad; r.why = why; return r }
    let tol: CGFloat = 0.05
    if G.x < ballRadius - tol || G.x > width - ballRadius + tol || G.y < ballRadius - tol || G.y > length - ballRadius + tol {
      return bad("sát băng, lỗ này không vào được")
    }
    let c = balls[0]
    if let c {
      let v = unit(G.x - c.x, G.y - c.y)
      let cut = acos(min(max(v.x * d.x + v.y * d.y, -1), 1)) * 180 / .pi
      r.cut = cut
      if cut >= 89.5 { return bad("không có góc đánh") }
    }
    for (m, q) in balls.sorted(by: { $0.key < $1.key }) where m != ball && m != 0 {
      if let c, segDist(q, c, G) < ballDiameter - 0.02 { return bad("\(name(m)) chắn bi cái") }
      if segDist(q, o, P) < ballDiameter - 0.02 { return bad("\(name(m)) chắn đường vào lỗ") }
    }
    if let cut = r.cut, cut > cutWarn { r.level = .warn; r.why = "quá mỏng" }
    return r
  }

  static func name(_ n: Int) -> String { n == 0 ? "bi cái" : "bi \(n)" }

  private static let fracs: [(CGFloat, String)] = [(1, "cả bi"), (0.75, "¾ bi"), (0.5, "½ bi"), (0.25, "¼ bi"), (0.125, "⅛ bi")]

  /// Phần bi chồng nhau nhìn từ bi cái: 1 − sin(góc cắt), làm tròn về mốc người chơi dùng.
  static func fraction(cut: CGFloat) -> String {
    let f = 1 - sin(cut * .pi / 180)
    return fracs.min(by: { abs($0.0 - f) < abs($1.0 - f) })!.1
  }

  // MARK: bi cái từ đầu cơ tới ghost

  /// Đầu cơ lệch tâm cho Rω = 2.5·tip·v, trượt tới khi lăn đều, rồi lăn chậm dần.
  /// v = 0 nghĩa là bi cái dừng trước khi tới.
  /// `sample` nhận (giây, inch đã đi) mỗi bước, chỉ bản chạy thử cần.
  static func approach(L: CGFloat, tip: CGFloat, v0: CGFloat, sample: ((CGFloat, CGFloat) -> Void)? = nil) -> Approach {
    var v = v0, w = 2.5 * tip * v0, s: CGFloat = 0, t: CGFloat = 0
    let dt: CGFloat = 1 / 400
    while s < L {
      let u = v - w
      if abs(u) > 0.05 {
        let k = (u < 0 ? -1 : 1) * min(muSlide * dt, abs(u) / 3.5)
        v -= k; w += 2.5 * k
      } else {
        v = max(0, v - muRoll * dt); w = v
      }
      if v < 0.4 { return Approach(v: 0, f: 0, s: s, t: t) }
      s += v * dt; t += dt
      sample?(t, s)
    }
    return Approach(v: v, f: w / v, s: L, t: t)
  }

  // MARK: bi cái sau va chạm

  /// Bi cái rời ghost với phần vận tốc tiếp tuyến, spin dọc giữ nguyên. Ma sát vải bẻ cong tới khi lăn đều,
  /// rồi lăn chậm dần. Chạm băng bật gương, coi như lăn đều ngay.
  static func cueRun(c: CGPoint, o: CGPoint, P: CGPoint, f: CGFloat, v0: CGFloat, others: [Obstacle]) -> Run {
    let (G, d) = ghost(o, P)
    let a = unit(G.x - c.x, G.y - c.y), ad = a.x * d.x + a.y * d.y
    var vx = v0 * (a.x - ad * d.x), vy = v0 * (a.y - ad * d.y), wx = f * v0 * a.x, wy = f * v0 * a.y
    var x = G.x, y = G.y, acc: CGFloat = 0, t: CGFloat = 0
    var scratch: String?, hit: Int?
    var pts = [CGPoint(x: x, y: y)], ts: [CGFloat] = [0]
    let dt: CGFloat = 1 / 200
    let lo = ballRadius, hiX = width - ballRadius, hiY = length - ballRadius
    loop: for _ in 0..<5000 {
      let ux = vx - wx, uy = vy - wy, us = hypot(ux, uy)
      if us > 0.05 {
        let k = min(muSlide * dt, us / 3.5) / us
        vx -= ux * k; vy -= uy * k; wx += 2.5 * ux * k; wy += 2.5 * uy * k
      } else {
        let s = hypot(vx, vy)
        if s < 0.4 { break }
        let ns = max(0, s - muRoll * dt)
        vx *= ns / s; vy *= ns / s; wx = vx; wy = vy
      }
      x += vx * dt; y += vy * dt; acc += hypot(vx, vy) * dt; t += dt
      for m in pocketMouths where hypot(x - m.c.x, y - m.c.y) < m.r + 0.9 { scratch = m.id; break loop }
      for q in others where hypot(x - q.p.x, y - q.p.y) < ballDiameter { hit = q.n; break loop }
      var bounced = false
      if x < lo { x = 2 * lo - x; vx = -vx * railRestitution; bounced = true }
      else if x > hiX { x = 2 * hiX - x; vx = -vx * railRestitution; bounced = true }
      if y < lo { y = 2 * lo - y; vy = -vy * railRestitution; bounced = true }
      else if y > hiY { y = 2 * hiY - y; vy = -vy * railRestitution; bounced = true }
      if bounced { wx = vx; wy = vy; pts.append(CGPoint(x: x, y: y)); ts.append(t); acc = 0 }
      else if acc > 0.6 { pts.append(CGPoint(x: x, y: y)); ts.append(t); acc = 0 }
    }
    pts.append(CGPoint(x: x, y: y)); ts.append(t)
    var r = Run()
    r.pts = pts; r.ts = ts; r.stop = CGPoint(x: x, y: y); r.scratch = scratch; r.hit = hit
    return r
  }

  // MARK: cả cú

  /// Tiếp cận, bi cái sau va chạm, và bi mục tiêu có đủ lực tới lỗ không.
  /// Bi mục tiêu nhận v·cosφ, chưa có spin nên trượt tới 5/7 rồi mới lăn.
  static func runWith(_ ms: Setup, tip: CGFloat, speed vms: CGFloat) -> Run {
    let c = ms.c, o = ms.o, P = ms.P
    let (G, d) = ghost(o, P)
    let L = hypot(G.x - c.x, G.y - c.y), a = unit(G.x - c.x, G.y - c.y), cosc = a.x * d.x + a.y * d.y
    let ap = approach(L: L, tip: tip, v0: vms * inchesPerMeter)
    if ap.v == 0 {
      var r = Run()
      r.stop = CGPoint(x: c.x + a.x * ap.s, y: c.y + a.y * ap.s); r.short = .cue
      r.ghost = G; r.d = d; r.a = a
      return r
    }
    var r = cueRun(c: c, o: o, P: P, f: ap.f, v0: ap.v, others: ms.others)
    let vo = ap.v * cosc, v1 = 5 / 7 * vo
    let reach = (vo * vo - v1 * v1) / (2 * muSlide) + v1 * v1 / (2 * muRoll)
    let dP = hypot(P.x - o.x, P.y - o.y) - ballRadius
    r.f = ap.f; r.vC = ap.v; r.ghost = G; r.d = d; r.a = a
    if reach < dP {
      r.short = .ob; r.gap = dP - reach
      r.obStop = CGPoint(x: o.x + d.x * reach, y: o.y + d.y * reach)
    }
    return r
  }

  /// Điểm đặt đầu cơ cho stun đúng lúc chạm. nil nếu draw tối đa vẫn tới nơi đã lăn.
  static func stunTip(_ ms: Setup, speed vms: CGFloat) -> CGFloat? {
    let L = hypot(ms.o.x - ms.c.x, ms.o.y - ms.c.y) - ballDiameter, v0 = vms * inchesPerMeter
    func f(_ t: CGFloat) -> CGFloat { let ap = approach(L: L, tip: t, v0: v0); return ap.v > 0 ? ap.f : .nan }
    var lo = -tipMax, hi: CGFloat = 0
    guard f(lo) < 0 else { return nil }
    for _ in 0..<14 {
      let m = (lo + hi) / 2
      if f(m) < 0 { lo = m } else { hi = m }
    }
    return (lo + hi) / 2
  }

  /// Lý do cú đánh hỏng theo mô phỏng, rỗng nếu ổn.
  static func why(_ r: Run?) -> String {
    guard let r else { return "" }
    switch r.short {
    case .cue: return "bi cái không tới bi mục tiêu"
    case .ob: return "thiếu lực, hụt lỗ \(max(1, Int(r.gap.rounded())))\""
    case nil: return r.scratch.map { "bi cái vào lỗ \(pocketNames[$0] ?? $0)" } ?? ""
    }
  }
}

/// Chỉ để kiểm: ba cú mẫu Drill 03 so với prototype v7, cộng thời gian 100 lần `runWith`.
enum ShotPhysicsFixture {
  static func logDrill03(_ model: PoolEditorModel) {
    guard let ball = model.aimBall, let pocket = model.aimPocket, let c = model.balls[0], let o = model.balls[ball] else {
      NSLog("[ShotPhysics] d03 thiếu bi cái hoặc đường vào lỗ")
      return
    }
    let others = model.balls.filter { $0.key != 0 && $0.key != ball }.map { ShotPhysics.Obstacle(n: $0.key, p: $0.value) }
    let ms = ShotPhysics.Setup(c: c, o: o, pocket: pocket, others: others)
    for (tip, v) in [(0.4, 1.8), (0.0, 1.8), (-0.15, 3.2)] as [(CGFloat, CGFloat)] {
      let r = ShotPhysics.runWith(ms, tip: tip, speed: v)
      let gap = hypot(r.stop.x - o.x, r.stop.y - o.y)
      NSLog("[ShotPhysics] tip %.2f v %.1f f %.4f scratch %@ stop %.3f\" from ball %d short %@",
            tip, v, r.f, r.scratch ?? "-", gap, ball, r.short.map { "\($0)" } ?? "-")
    }
    let t0 = CFAbsoluteTimeGetCurrent()
    for _ in 0..<100 { _ = ShotPhysics.runWith(ms, tip: 0.4, speed: 1.8) }
    NSLog("[ShotPhysics] runWith avg %.3f ms", (CFAbsoluteTimeGetCurrent() - t0) * 10)
  }
}
