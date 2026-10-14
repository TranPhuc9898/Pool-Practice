import Foundation

/// Planner 9-ball v1, port `sim-lab/planner.js`: chỉ cú thẳng bi số nhỏ nhất vào lỗ, không combo, bank, phòng thủ.
/// Chấm mỗi cú bằng xác suất ăn dưới nhiễu ICGA, phạt cú "không tự nhiên" (phê, kéo culê quá, lực mạnh, chạm bi thừa),
/// và giá trị thế bi sau cú, nhìn trước hai tầng. Trọng số tự đặt, chưa hiệu chỉnh với người thật.
enum RackPlanner {
  typealias P2 = RackSim.P2
  static let T = RackSim.buildTable()
  private static let deg = Double.pi / 180
  private static let D = RackSim.D, R = RackSim.R

  /// Thế bi: `balls` không gồm bi cái.
  struct Layout { var cue: P2; var balls: [Int: P2] }
  struct Shot { var ang, a, b, v: Double }
  struct Stats { var sims = 0, aim = 0 }

  struct Pick {
    let n: Int
    let pocket: String
    var s: Shot
    let pen: Double
    let next: Layout
    let win: Bool
    let pos: Double
    let h: Double
    var p = 0.0, posMean = 0.0, score1 = 0.0, score = 0.0
    var childBall: Int?, childPocket: String?
  }

  struct Result { let best: Pick?; let ms: Double; let stats: Stats }

  // Nhiễu ICGA: φ 0.125°, V 0.075 m/s, a/b 0.5 mm quy về R.
  static let noisePhi = 0.125 * deg, noiseV = 0.075, noiseAB = 0.5 / 25.4 / RackSim.R

  struct Budget { let tipsB, tipsA, speeds: [Double]; let samples, top: Int }
  static let FULL = Budget(tipsB: [-0.4, -0.2, 0, 0.2, 0.4], tipsA: [-0.3, 0, 0.3], speeds: [0.8, 1.2, 1.6, 2.0, 2.5, 3.0, 3.5, 4.0], samples: 16, top: 8)
  static let LITE = Budget(tipsB: [-0.4, 0, 0.4], tipsA: [0], speeds: [1.0, 1.8, 2.8, 4.0], samples: 0, top: 3)

  // mulberry32 + Box-Muller, có seed để cùng thế bi thì cùng gợi ý.
  struct RNG {
    var s: UInt32
    mutating func u() -> Double {
      s = s &+ 0x6D2B_79F5
      var t = s
      t = (t ^ (t >> 15)) &* (t | 1)
      t ^= t &+ ((t ^ (t >> 7)) &* (t | 61))
      return Double(t ^ (t >> 14)) / 4_294_967_296
    }
    mutating func n() -> Double { let a = max(u(), 1e-12), b = u(); return (-2 * log(a)).squareRoot() * cos(2 * .pi * b) }
  }
  static func hash(_ text: String) -> UInt32 {
    var h: UInt32 = 2_166_136_261
    for c in text.utf8 { h ^= UInt32(c); h = h &* 16_777_619 }
    return h
  }

  static func lowest(_ L: Layout) -> Int? { L.balls.keys.min() }
  static func unit(_ x: Double, _ y: Double) -> P2 { RackSim.unit2(x, y) }
  static func dist(_ a: P2, _ b: P2) -> Double { RackSim.d2(a, b) }

  static func segDist(_ p: P2, _ a: P2, _ b: P2) -> Double {
    let ex = b.x - a.x, ey = b.y - a.y, l2 = ex * ex + ey * ey
    let t = l2 > 0 ? max(0, min(1, ((p.x - a.x) * ex + (p.y - a.y) * ey) / l2)) : 0
    return hypot(p.x - a.x - ex * t, p.y - a.y - ey * t)
  }
  static func blocked(_ L: Layout, _ a: P2, _ b: P2, skip: Int) -> Bool {
    L.balls.contains { $0.key != skip && segDist($0.value, a, b) < D - 0.02 }
  }
  /// Điểm ngắm trong miệng lỗ, `f` chạy từ J1 (0) tới J2 (1).
  static func mouth(_ h: RackSim.Hole, _ f: Double) -> P2 { P2(x: h.J1.x + (h.J2.x - h.J1.x) * f, y: h.J1.y + (h.J2.y - h.J1.y) * f) }

  struct Geom { let cut, psi, d1, d2: Double; let offTable, cueBlocked, obBlocked: Bool }
  static func geom(_ L: Layout, _ n: Int, _ h: RackSim.Hole) -> Geom {
    let ob = L.balls[n]!, M = mouth(h, 0.5), cue = L.cue
    let d = unit(M.x - ob.x, M.y - ob.y)
    let G = P2(x: ob.x - d.x * D, y: ob.y - d.y * D)
    let c = unit(G.x - cue.x, G.y - cue.y)
    let cut = acos(max(-1, min(1, c.x * d.x + c.y * d.y))) / deg
    let psi = acos(max(-1, min(1, d.x * h.ax.x + d.y * h.ax.y))) / deg
    let off = G.x < R - 0.3 || G.x > 50 - R + 0.3 || G.y < R - 0.3 || G.y > 100 - R + 0.3
    return Geom(cut: cut, psi: psi, d1: dist(cue, G), d2: dist(ob, M), offTable: off,
                cueBlocked: blocked(L, cue, G, skip: n), obBlocked: blocked(L, ob, M, skip: n))
  }

  static func erf(_ x: Double) -> Double { Foundation.erf(x) }

  /// Xác suất ăn kiểu người chơi khá, σ ngắm 0.5°. Heuristic, chưa hiệu chỉnh.
  static func easeOf(_ g: Geom, _ h: RackSim.Hole) -> Double {
    if g.cueBlocked || g.obBlocked || g.offTable || g.cut > 80 { return 0 }
    if g.psi > (h.corner ? 62 : 60) { return 0 }
    let half = h.corner ? 1.15 * max(0.35, cos(g.psi * deg * 0.9)) : 1.35 * max(0.2, cos(g.psi * deg * 1.4))
    let alpha = atan(half / max(g.d2, 3))
    let sOb = 0.5 * deg * max(g.d1, 3) / (D * max(0.15, cos(g.cut * deg))) + 0.2 * deg
    return erf(alpha / (2.0.squareRoot() * sOb))
  }
  /// Giá trị thế bi tiếp: bi nhỏ nhất, lỗ dễ nhất. Hết bi là 1, không có cú thẳng là 0.03.
  static func positionValue(_ L: Layout) -> Double {
    guard let n = lowest(L) else { return 1 }
    var best = 0.03
    for h in T.holes { best = max(best, easeOf(geom(L, n, h), h)) }
    return best
  }

  static func makeBalls(_ L: Layout) -> [RackSim.Ball] {
    [RackSim.Ball(0, L.cue)] + L.balls.keys.sorted().map { RackSim.Ball($0, L.balls[$0]!) }
  }

  /// Hướng bi mục tiêu ngay sau va chạm đầu tiên, nil nếu bi cái chạm băng trước.
  static func firstContact(_ cue: P2, _ ob: P2, _ ang: Double, _ s: Shot) -> Double? {
    var balls = [RackSim.Ball(0, cue), RackSim.Ball(1, ob)]
    RackSim.strike(&balls[0], dir: P2(x: cos(ang), y: sin(ang)), a: s.a, b: s.b, vms: s.v)
    var ev: [RackSim.Event] = []
    _ = RackSim.run(&balls, T, dt: 1.0 / 1000, maxT: 6, untilFirstHit: true, events: &ev)
    guard ev.contains(where: { $0.kind == .ball }) else { return nil }
    return atan2(balls[1].v.y, balls[1].v.x)
  }
  static func wrap(_ x: Double) -> Double { atan2(sin(x), cos(x)) }

  /// Secant trên hướng ngắm để bi mục tiêu ra đúng hướng tới `M`, đã gồm squirt và throw của engine.
  static func solveAim(_ L: Layout, _ n: Int, _ M: P2, _ s: Shot) -> Double? {
    let ob = L.balls[n]!
    let want = atan2(M.y - ob.y, M.x - ob.x)
    let G = P2(x: ob.x - cos(want) * D, y: ob.y - sin(want) * D)
    var x0 = atan2(G.y - L.cue.y, G.x - L.cue.x)
    guard let r0 = firstContact(L.cue, ob, x0, s) else { return nil }
    var f0 = wrap(r0 - want)
    var x1 = x0 + 0.15 * deg
    guard let r1 = firstContact(L.cue, ob, x1, s) else { return nil }
    var f1 = wrap(r1 - want)
    var i = 0
    while i < 8 && abs(f1) > 0.01 * deg {
      i += 1
      if abs(f1 - f0) < 1e-12 { break }
      let x2 = x1 - f1 * (x1 - x0) / (f1 - f0)
      if abs(x2 - x1) > 5 * deg { return nil }
      guard let r2 = firstContact(L.cue, ob, x2, s) else { return nil }
      x0 = x1; f0 = f1; x1 = x2; f1 = wrap(r2 - want)
    }
    return abs(f1) < 0.05 * deg ? x1 : nil
  }

  struct Sim { let ok, win: Bool; let pocket: String?; let extra: Int; let next: Layout }

  /// Chạy đủ mọi bi, chấm theo luật 9-ball: chạm bi nhỏ nhất trước, trắng không rơi.
  static func simulate(_ L: Layout, _ n: Int, _ s: Shot, dt: Double = 1.0 / 1000) -> Sim {
    var balls = makeBalls(L)
    RackSim.strike(&balls[0], dir: P2(x: cos(s.ang), y: sin(s.ang)), a: s.a, b: s.b, vms: s.v)
    var ev: [RackSim.Event] = []
    _ = RackSim.run(&balls, T, dt: dt, maxT: 15, events: &ev)
    let first = ev.firstIndex { $0.kind == .ball && ($0.ball == 0 || $0.other == 0) }
    let firstId = first.map { ev[$0].ball == 0 ? ev[$0].other : ev[$0].ball }
    let cue = balls[0]
    let tgt = balls.first { $0.id == n }!
    let foul = cue.pocket != nil || !cue.on || firstId != n
    var extra = 0
    for (k, e) in ev.enumerated() where e.kind == .ball && k != first { extra += 1 }
    var next = Layout(cue: cue.c, balls: [:])
    var nine = false
    for b in balls where b.id != 0 {
      if b.on { next.balls[b.id] = b.c } else if b.id == 9 && b.pocket != nil { nine = true }
    }
    let ok = !foul && tgt.pocket != nil
    return Sim(ok: ok, win: ok && (nine || next.balls.isEmpty), pocket: tgt.pocket, extra: extra, next: next)
  }

  static func penalty(_ s: Shot, _ extra: Int) -> Double {
    1.2 * abs(s.a) + max(0, abs(s.b) - 0.2) + 0.25 * max(0, s.v - 2.0) + 0.15 * Double(extra)
  }

  /// Tìm hai mép cửa sổ ngắm quanh hướng danh nghĩa rồi đặt hướng vào giữa. Bước 0.04°, tối đa ±0.6°.
  static func centerAim(_ L: Layout, _ n: Int, _ s: Shot, _ pocket: String, _ st: inout Stats) -> (ang: Double, width: Double) {
    func okAt(_ d: Double, _ st: inout Stats) -> Bool {
      st.sims += 1
      var t = s; t.ang += d * deg
      let r = simulate(L, n, t)
      return r.ok && r.pocket == pocket
    }
    func edge(_ sgn: Double, _ st: inout Stats) -> Double {
      var lo = 0.0, hi: Double?
      var d = 0.04
      while d <= 0.6 + 1e-9 { if okAt(sgn * d, &st) { lo = d } else { hi = d; break }; d += 0.04 }
      guard var h = hi else { return lo }
      for _ in 0..<2 { let m = (lo + h) / 2; if okAt(sgn * m, &st) { lo = m } else { h = m } }
      return lo
    }
    let lo = edge(-1, &st), hi = edge(1, &st)
    return (s.ang + (hi - lo) / 2 * deg, lo + hi)
  }

  static func key(_ L: Layout) -> String {
    let f = { (p: P2) in String(format: "%.2f,%.2f", p.x, p.y) }
    return f(L.cue) + L.balls.keys.sorted().map { "|\($0):" + f(L.balls[$0]!) }.joined()
  }

  /// Một tầng: liệt kê ứng viên, lọc bằng lần chạy danh nghĩa, rồi chấm p bằng nhiễu.
  static func level(_ L: Layout, _ budget: Budget, _ st: inout Stats, cancelled: () -> Bool) -> [Pick] {
    guard let n = lowest(L) else { return [] }
    var out: [Pick] = []
    for h in T.holes {
      let g = geom(L, n, h)
      if g.cut > 82 || g.offTable || g.cueBlocked || g.obBlocked { continue }
      if !h.corner && g.psi > 55 { continue }
      for a in budget.tipsA { for b in budget.tipsB { for v in budget.speeds {
        if cancelled() { return [] }
        // Lỗ giữa và góc gắt: giữa miệng trượt thì thử điểm ngắm lệch trong miệng.
        for f in [0.5, 0.35, 0.65] {
          var s = Shot(ang: 0, a: a, b: b, v: v)
          st.aim += 1
          guard let ang = solveAim(L, n, mouth(h, f), s) else { continue }
          s.ang = ang
          let r = simulate(L, n, s, dt: 1.0 / 500); st.sims += 1
          if !r.ok || r.pocket != h.id { continue }
          let pv = r.win ? 1 : positionValue(r.next)
          let pen = penalty(s, r.extra)
          out.append(Pick(n: n, pocket: h.id, s: s, pen: pen, next: r.next, win: r.win, pos: pv, h: exp(-pen) * pv))
          break
        }
      } } }
    }
    out.sort { $0.h > $1.h }
    var top = Array(out.prefix(budget.top))
    for i in top.indices {
      if cancelled() { return [] }
      var c = top[i]
      let w = centerAim(L, n, c.s, c.pocket, &st)
      c.s.ang = w.ang
      let pWin = erf(w.width / 2 * deg / (2.0.squareRoot() * noisePhi))
      var g = RNG(s: hash(key(L) + "|\(c.pocket)|\(c.s.a)|\(c.s.b)|\(c.s.v)"))
      // Vị trí bi cái nhạy với nhiễu hơn chuyện bi có vào hay không, nên lấy trung bình trên các mẫu ăn.
      var ok = 0, posSum = 0.0
      for _ in 0..<budget.samples {
        let t = Shot(ang: c.s.ang + g.n() * noisePhi, a: c.s.a + g.n() * noiseAB, b: c.s.b + g.n() * noiseAB, v: max(0.1, c.s.v + g.n() * noiseV))
        let r = simulate(L, n, t); st.sims += 1
        if r.ok { ok += 1; posSum += r.win ? 1 : positionValue(r.next) }
      }
      c.posMean = ok > 0 ? posSum / Double(ok) : c.pos
      // Co về ước lượng cửa sổ với 4 mẫu giả để 16 mẫu đỡ nhiễu xếp hạng.
      c.p = budget.samples > 0 ? (Double(ok) + 4 * pWin) / Double(budget.samples + 4) : pWin
      c.score1 = c.p * exp(-c.pen) * c.posMean
      top[i] = c
    }
    top.sort { $0.score1 > $1.score1 }
    return top
  }

  /// Beam hai tầng: tầng đầu FULL, tầng sau LITE. Điểm = p·e^−pen·(nửa giá trị tầng sau, nửa vị trí trung bình).
  static func plan(_ L: Layout, depth: Int = 2, beam: Int = 3, cancelled: () -> Bool = { false }) -> Result {
    let t0 = DispatchTime.now().uptimeNanoseconds
    var st = Stats()
    func rec(_ Lx: Layout, _ d: Int, _ budget: Budget) -> [Pick] {
      var cands = level(Lx, budget, &st, cancelled: cancelled)
      if d <= 1 { for i in cands.indices { cands[i].score = cands[i].score1 }; return cands }
      for i in cands.indices {
        guard i < beam else { cands[i].score = cands[i].score1 * 0.5; continue }
        let c = cands[i]
        if c.win || c.next.balls.isEmpty { cands[i].score = c.p * exp(-c.pen); continue }
        let sub = rec(c.next, d - 1, LITE)
        let best = sub.first?.score ?? 0.015
        cands[i].childBall = sub.first?.n
        cands[i].childPocket = sub.first?.pocket
        cands[i].score = c.p * exp(-c.pen) * (0.5 * max(best, 0.015) + 0.5 * c.posMean)
      }
      cands.sort { $0.score > $1.score }
      return cands
    }
    let cands = rec(L, depth, FULL)
    let ms = Double(DispatchTime.now().uptimeNanoseconds - t0) / 1e6
    return Result(best: cancelled() ? nil : cands.first, ms: ms, stats: st)
  }
}
