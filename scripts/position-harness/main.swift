import CoreGraphics
import Foundation

// Drill 23 (position 3 bi) bằng đúng ShotPhysics của app: mỗi cú chạy 45 mẫu lệch tay quanh cú danh nghĩa (lực ×0.9…1.1
// năm mức, tipX và tipY ±0.1 ba mức, hướng cơ giữ như cú danh nghĩa) và đếm K mẫu đạt. Mẫu đạt khi: bi mục tiêu vào đúng
// lỗ, bi cái không rơi, không đụng bi khác; bi cái dừng trong zone; và từ đúng chỗ dừng đó cú kế (tip, lực ghi trong
// data, hướng cơ giải lại như app) vẫn đưa bi kế vào lỗ. Cú 3 không có zone, K là số mẫu bi 3 vào lỗ.
// Cú 2 bắt đầu từ chỗ bi cái dừng sau cú 1 danh nghĩa, cú 3 từ chỗ dừng sau cú 2, như app chơi lại.
// Toạ độ chép từ src/pool-engine/drills/23-three-ball-position.ts, đổi sang inch (x·50, y·100, r·50).

typealias SP = ShotPhysics
func inch(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: x * 50, y: y * 100) }
func dist(_ a: CGPoint, _ b: CGPoint) -> CGFloat { hypot(a.x - b.x, a.y - b.y) }
func f(_ p: CGPoint) -> String { String(format: "(%.1f,%.1f)", p.x, p.y) }

struct Shot { let ball: Int; let pocket: String; let tipY: CGFloat; let speed: CGFloat; let zone: (c: CGPoint, r: CGFloat)? }

let cue = inch(0.47, 0.588)
let balls: [Int: CGPoint] = [1: inch(0.69, 0.568), 2: inch(0.896, 0.79), 3: inch(0.852, 0.859)]
let shots = [
  // Z2: bi 1 cắt 17° vào lỗ giữa phải, follow cho bi cái theo đà bi 1 rồi bẻ lên, dừng dưới bi 2 chừng 9" với góc 13° vào
  // lỗ góc đầu bàn. Dừng thấp quá hay sát băng quá thì bi 2 thành cắt mỏng dọc băng.
  Shot(ball: 1, pocket: "sideRight", tipY: 0.3, speed: 1.4, zone: (inch(0.88, 0.699), 0.07 * 50)),
  // Z3: bi 2 vào lỗ góc phải đầu bàn, draw để bi cái lùi lại 7" thay vì lăn theo về góc; từ đó bi 3 cách chừng 9",
  // cắt 21° vào cùng lỗ.
  Shot(ball: 2, pocket: "headRight", tipY: -0.4, speed: 1.2, zone: (inch(0.816, 0.765), 0.07 * 50)),
  Shot(ball: 3, pocket: "headRight", tipY: 0, speed: 1.4, zone: nil),
]

func setup(_ c: CGPoint, _ i: Int, _ left: [Int: CGPoint]) -> SP.Setup {
  let s = shots[i]
  let others = left.filter { $0.key != s.ball }.map { SP.Obstacle(n: $0.key, p: $0.value) }.sorted { $0.n < $1.n }
  return SP.Setup(c: c, o: left[s.ball]!, pocket: s.pocket, others: others, ball: s.ball)
}
func clean(_ r: SP.Run, _ pocket: String) -> Bool {
  r.short == nil && r.scratch == nil && r.ob.pocket == pocket && r.moved.values.allSatisfy { $0.hit == nil && $0.pocket == nil }
}
/// Góc cắt, độ: hướng bi cái tới ghost so với hướng bi mục tiêu tới lỗ.
func cutDeg(_ c: CGPoint, _ o: CGPoint, _ P: CGPoint) -> CGFloat {
  let g = SP.ghost(o, P).g, a = CGPoint(x: g.x - c.x, y: g.y - c.y), b = CGPoint(x: P.x - o.x, y: P.y - o.y)
  return abs(atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y)) * 180 / .pi
}

var c = cue, left = balls
for (i, s) in shots.enumerated() {
  let ms = setup(c, i, left)
  let nom = SP.runWith(ms, tipX: 0, tipY: s.tipY, speed: s.speed)
  guard clean(nom, s.pocket) else { print("shot \(i + 1) danh nghĩa hỏng: \(SP.why(nom))"); exit(1) }
  let aim = atan2(nom.a.y, nom.a.x)
  var after = left
  after[s.ball] = nil
  var k = 0, miss = 0, out = 0, next = 0
  for m in [0.9, 0.95, 1, 1.05, 1.1] as [CGFloat] { for dx in [-0.1, 0, 0.1] as [CGFloat] { for dy in [-0.1, 0, 0.1] as [CGFloat] {
    let r = SP.runWith(ms, tipX: dx, tipY: s.tipY + dy, speed: s.speed * m, aim: aim)
    guard clean(r, s.pocket) else { miss += 1; continue }
    if let z = s.zone {
      guard dist(r.stop, z.c) <= z.r else { out += 1; continue }
      let n = shots[i + 1], nr = SP.runWith(setup(r.stop, i + 1, after), tipX: 0, tipY: n.tipY, speed: n.speed)
      guard clean(nr, n.pocket) else { next += 1; continue }
    }
    k += 1
  } } }
  let zs = s.zone.map { String(format: "zone(%.1f,%.1f,%.1f)", $0.c.x, $0.c.y, $0.r) } ?? "zone(-)"
  print(String(format: "shot %d tipY %+.2f speed %.2f %@ rate=%d/45", i + 1, s.tipY, s.speed, zs, k))
  let P = SP.pockets[s.pocket]!
  print(String(format: "   b%d→%@ từ %@ cắt %.0f° D %.1f L %.1f, dừng %@ · trượt lỗ/đụng %d, ngoài zone %d, cú kế hỏng %d",
               s.ball, s.pocket, f(c), cutDeg(c, ms.o, P), dist(c, ms.o), dist(ms.o, P), f(nom.stop), miss, out, next))
  c = nom.stop
  left = after
}
