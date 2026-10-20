import CoreGraphics
import Foundation

// Rail Cut theo luật BU Exam II S2: cú đầu ball in hand, cú sau đánh từ chỗ bi cái dừng, thứ tự bi tuỳ ý. Mỗi cú phải
// hợp lệ theo `RackInHandSolver.legal`: bi vào đúng lỗ, bi cái không rơi, không chạm bi khác. Dò bằng đúng ShotPhysics
// của app rồi in `cueBall` và `shots` để chép sang src/pool-engine/drills/18…20-*.ts.
// Ưu tiên lực thấp: thử trần lực tăng dần, trần đầu tiên dọn sạch bàn thì lấy. Trong một trần, cú để lại nhiều (bi, lỗ)
// còn đánh được được xét trước, hoà thì lực thấp trước. Cú phải còn hợp lệ ở ít nhất `minSafe` trên 45 mẫu lệch tay.
// `minSafe` 12, không phải 30: bi sát băng đánh từ xa trượt gần hết 30 mẫu có tipX ±0.1 (squirt đẩy bi mục tiêu rời
// băng rồi dừng trước lỗ), còn 15 mẫu tipX 0 thì gần như đạt hết. Ngưỡng 12 đòi bền theo lực và tipY, chấp nhận nhạy phê.
// `rate` là số mẫu lệch tay (như drill 23) mà cú vẫn hợp lệ và từ chỗ bi cái dừng cú kế danh nghĩa vẫn hợp lệ.
// Toạ độ chép từ src/pool-engine/drills/18…20-*.ts, đổi sang inch (x·50, y·100).

struct Drill { let id: Int; let balls: [(Int, CGFloat, CGFloat)] }

let drills = [
  Drill(id: 18, balls: [
    (1, 0.0225, 0.25), (2, 0.0225, 0.75), (3, 0.9775, 0.25), (4, 0.9775, 0.75),
    (5, 0.5, 0.0113), (6, 0.5, 0.9887), (7, 0.5, 0.5),
  ]),
  Drill(id: 19, balls: [
    (1, 0.0225, 0.25), (2, 0.0225, 0.75), (3, 0.9775, 0.25), (4, 0.9775, 0.75),
    (5, 0.25, 0.0113), (6, 0.5, 0.0113), (7, 0.75, 0.0113),
    (8, 0.25, 0.9887), (9, 0.5, 0.9887), (10, 0.75, 0.9887), (11, 0.5, 0.5),
  ]),
  Drill(id: 20, balls: [
    (2, 0.0225, 0.125), (1, 0.0225, 0.25), (3, 0.0225, 0.75), (4, 0.0225, 0.875),
    (5, 0.9775, 0.25), (6, 0.9775, 0.125), (7, 0.9775, 0.75), (8, 0.9775, 0.875),
    (9, 0.25, 0.0113), (10, 0.5, 0.0113), (11, 0.75, 0.0113),
    (12, 0.25, 0.9887), (13, 0.5, 0.9887), (14, 0.75, 0.9887), (15, 0.5, 0.5),
  ]),
]

typealias SP = ShotPhysics
setvbuf(stdout, nil, _IOLBF, 0)
typealias Balls = [Int: CGPoint]

let tips: [CGFloat] = [0, -0.2, 0.2, -0.4, 0.4]
let speeds: [CGFloat] = [0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.1, 2.4, 2.8, 3.2, 3.6]
let caps: [CGFloat] = [1.2, 1.4, 1.6, 1.8, 2.1, 2.4, 2.8, 3.6]
/// Chỗ đặt bi cái cú đầu: khoảng cách tới ghost (inch) × độ lệch hướng so với đường ghost→lỗ (độ).
let distances: [CGFloat] = [9, 12, 18, 24]
let angles: [CGFloat] = [0, 10, -10, 20, -20, 30, -30]
let minSafe = 12
let beam = 3
let firsts = 6
let budget: TimeInterval = 8

func inch(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: x * 50, y: y * 100) }

/// Như `FixedShot.setup` của app: bi khác xếp theo số.
func setup(_ b: Balls, _ n: Int, _ p: String) -> SP.Setup {
  let others = b.filter { $0.key != 0 && $0.key != n }.map { SP.Obstacle(n: $0.key, p: $0.value) }.sorted { $0.n < $1.n }
  return SP.Setup(c: b[0]!, o: b[n]!, pocket: p, others: others, ball: n)
}

/// Số cặp (bi, lỗ) đánh được từ chỗ bi cái đang đứng.
func value(_ b: Balls) -> Int {
  var v = 0
  for n in b.keys where n != 0 {
    for p in RackInHandSolver.pocketOrder where (SP.shotOf(ball: n, pocket: p, balls: b)?.level ?? .bad) != .bad { v += 1 }
  }
  return v
}

/// 45 mẫu lệch tay quanh cú danh nghĩa, hướng cơ giữ như cú danh nghĩa. `judge` nhận lần chạy, trả đạt hay không.
func samples(_ ms: SP.Setup, tipY: CGFloat, speed: CGFloat, aim: CGFloat, _ judge: (SP.Run) -> Bool) -> Int {
  var k = 0
  for m in [0.9, 0.95, 1, 1.05, 1.1] as [CGFloat] { for dx in [-0.1, 0, 0.1] as [CGFloat] { for dy in [-0.1, 0, 0.1] as [CGFloat] {
    if judge(SP.runWith(ms, tipX: dx, tipY: tipY + dy, speed: speed * m, aim: aim)) { k += 1 }
  } } }
  return k
}

struct Cand { let ball: Int; let pocket: String; let tipY: CGFloat; let speed: CGFloat; let before: Balls; let after: Balls; let value: Int }

/// Mọi cú hợp lệ từ thế `b` có lực ≤ `cap`, mỗi (bi, lỗ) giữ tối đa hai tip ở lực thấp nhất còn dư 10% lực, tip giữa trước.
func cands(_ b: Balls, cap: CGFloat) -> [Cand] {
  var out: [Cand] = []
  for n in b.keys.sorted() where n != 0 {
    for p in RackInHandSolver.pocketOrder {
      guard (SP.shotOf(ball: n, pocket: p, balls: b)?.level ?? .bad) != .bad else { continue }
      let ms = setup(b, n, p)
      var seen = Set<CGFloat>()
      search: for v in speeds where v <= cap {
        for t in tips {
          guard !seen.contains(t) else { continue }
          let r = SP.runWith(ms, tipX: 0, tipY: t, speed: v)
          // Lực thấp nhất còn hợp lệ nằm sát mép: hụt 10% là bi không tới lỗ. Cú phải còn hợp lệ ở 0.9 lần lực.
          guard RackInHandSolver.legal(r, ball: n, pocket: p),
                RackInHandSolver.legal(SP.runWith(ms, tipX: 0, tipY: t, speed: v * 0.9), ball: n, pocket: p) else { continue }
          seen.insert(t)
          var a = b; a[n] = nil; a[0] = r.stop
          out.append(Cand(ball: n, pocket: p, tipY: t, speed: v, before: b, after: a, value: value(a)))
          if seen.count >= 2 { break search }
        }
      }
    }
  }
  return out.sorted { ($0.value, -$0.speed) > ($1.value, -$1.speed) }
}

func safe(_ c: Cand) -> Bool {
  let ms = setup(c.before, c.ball, c.pocket)
  let nom = SP.runWith(ms, tipX: 0, tipY: c.tipY, speed: c.speed)
  return samples(ms, tipY: c.tipY, speed: c.speed, aim: atan2(nom.a.y, nom.a.x)) { RackInHandSolver.legal($0, ball: c.ball, pocket: c.pocket) } >= minSafe
}

func dfs(_ b: Balls, _ path: [Cand], cap: CGFloat, _ best: inout [Cand], _ deadline: Date) {
  if path.count > best.count { best = path }
  if b.count == 1 || Date() > deadline { return }
  var picked: [Cand] = []
  for c in cands(b, cap: cap) where picked.count < beam && safe(c) { picked.append(c) }
  for c in picked {
    dfs(c.after, path + [c], cap: cap, &best, deadline)
    if best.count == path.count + b.count - 1 { return }
  }
}

/// Chỗ đặt bi cái cú đầu cho (bi n, lỗ p): quét lưới quanh đường ghost→lỗ, giữ chỗ không đè bi, cú còn ok/warn.
func places(_ n: Int, _ p: String, _ b: Balls) -> [CGPoint] {
  guard let o = b[n], let P = SP.target(p) else { return [] }
  let R = SP.ballRadius
  let (G, d) = SP.ghost(o, P)
  var out: [CGPoint] = []
  for dist in distances {
    for deg in angles {
      let a = deg * .pi / 180
      let u = CGPoint(x: d.x * cos(a) - d.y * sin(a), y: d.x * sin(a) + d.y * cos(a))
      let c = CGPoint(x: G.x - u.x * dist, y: G.y - u.y * dist)
      guard c.x >= R, c.x <= SP.width - R, c.y >= R, c.y <= SP.length - R,
            !b.contains(where: { $0.key != 0 && hypot($0.value.x - c.x, $0.value.y - c.y) < SP.ballDiameter }) else { continue }
      var placed = b
      placed[0] = c
      if (SP.shotOf(ball: n, pocket: p, balls: placed)?.level ?? .bad) != .bad { out.append(c) }
    }
  }
  return out
}

func cutDeg(_ c: CGPoint, _ o: CGPoint, _ P: CGPoint) -> CGFloat {
  let g = SP.ghost(o, P).g, a = CGPoint(x: g.x - c.x, y: g.y - c.y), b = CGPoint(x: P.x - o.x, y: P.y - o.y)
  return abs(atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y)) * 180 / .pi
}

let pocketWords = ["footLeft": "foot left corner", "footRight": "foot right corner", "sideLeft": "left side pocket",
                   "sideRight": "right side pocket", "headLeft": "head left corner", "headRight": "head right corner"]

func why(_ c: Cand, next: Cand?) -> String {
  let cut = Int(cutDeg(c.before[0]!, c.before[c.ball]!, SP.target(c.pocket)!).rounded())
  let stroke = c.tipY < -0.1 ? "Draw" : c.tipY > 0.1 ? "Follow" : "Center ball"
  guard let nx = next else { return "\(cut)° cut, last ball. \(stroke), soft enough to keep the cue ball out of the pockets." }
  let o = nx.before[nx.ball]!, s = nx.before[0]!
  let gap = Int((hypot(o.x - s.x, o.y - s.y) / 12.5).rounded())
  let nc = Int(cutDeg(s, o, SP.target(nx.pocket)!).rounded())
  let an = nc == 8 || nc == 11 || nc == 18 || (80...89).contains(nc)
  return "\(cut)° cut. \(stroke) leaves the cue ball about \(max(gap, 1)) diamond\(gap > 1 ? "s" : "") from ball \(nx.ball) with \(an ? "an" : "a") \(nc)° cut into the \(pocketWords[nx.pocket]!)."
}

func rate(_ c: Cand, next: Cand?) -> Int {
  let ms = setup(c.before, c.ball, c.pocket)
  let nom = SP.runWith(ms, tipX: 0, tipY: c.tipY, speed: c.speed)
  return samples(ms, tipY: c.tipY, speed: c.speed, aim: atan2(nom.a.y, nom.a.x)) { r in
    guard RackInHandSolver.legal(r, ball: c.ball, pocket: c.pocket) else { return false }
    guard let nx = next else { return true }
    var a = c.before; a[c.ball] = nil; a[0] = r.stop
    return RackInHandSolver.legal(SP.runWith(setup(a, nx.ball, nx.pocket), tipX: 0, tipY: nx.tipY, speed: nx.speed), ball: nx.ball, pocket: nx.pocket)
  }
}

func num(_ v: CGFloat) -> String {
  var s = String(format: "%.4f", v)
  while s.hasSuffix("0") { s.removeLast() }
  if s.hasSuffix(".") { s.removeLast() }
  return s
}

for d in drills {
  var start: Balls = [:]
  for (n, x, y) in d.balls { start[n] = inch(x, y) }
  let total = d.balls.count
  let t0 = Date()
  var best: [Cand] = []
  var usedCap: CGFloat = 0
  let open = RackInHandSolver.openPockets(start)
  // Mỗi trần lực: dựng mọi cú đầu (chỗ đặt × bi × lỗ), lấy `firsts` cú để lại thế tốt nhất, DFS mỗi cú tối đa `budget` giây.
  capLoop: for cap in caps {
    var opens: [Cand] = []
    for n in open.keys.sorted() {
      for p in open[n]! {
        for c in places(n, p, start) {
          var b = start
          b[0] = c
          if let f = cands(b, cap: cap).first(where: { $0.ball == n && $0.pocket == p }) { opens.append(f) }
        }
      }
    }
    opens.sort { ($0.value, -$0.speed) > ($1.value, -$1.speed) }
    var tried = 0
    for first in opens where tried < firsts && safe(first) {
      tried += 1
      var rest: [Cand] = []
      dfs(first.after, [], cap: cap, &rest, Date().addingTimeInterval(budget))
      if rest.count + 1 > best.count { best = [first] + rest; usedCap = cap }
      if best.count == total { break capLoop }
    }
    print("// \(d.id) trần \(cap): \(opens.count) cú đầu, tốt nhất \(best.count)/\(total)")
  }
  let ms = Date().timeIntervalSince(t0) * 1000
  print("// \(d.id): \(best.count)/\(total), trần lực \(usedCap) m/s, \(Int(ms)) ms")
  guard let c0 = best.first?.before[0] else { continue }
  print("cueBall: { x: \(num(c0.x / 50)), y: \(num(c0.y / 100)) },")
  print("shots: [")
  for (i, c) in best.enumerated() {
    let next = i + 1 < best.count ? best[i + 1] : nil
    let w = why(c, next: next).replacingOccurrences(of: "'", with: "\\'")
    print("  { ball: \(c.ball), pocket: '\(c.pocket)', tipY: \(num(c.tipY)), speed: \(num(c.speed)), rate: \(rate(c, next: next)), why: '\(w)' },")
  }
  print("],")
}
