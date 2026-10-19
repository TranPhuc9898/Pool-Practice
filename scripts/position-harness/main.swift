import CoreGraphics
import Foundation

// Drill 23 (position 3 bi) bằng đúng ShotPhysics của app: mỗi cú chạy 45 mẫu lệch tay quanh cú danh nghĩa (lực ×0.9…1.1
// năm mức, tipX và tipY ±0.1 ba mức, hướng cơ giữ như cú danh nghĩa) và đếm K mẫu đạt. Mẫu đạt khi: bi mục tiêu vào đúng
// lỗ, bi cái không rơi, không đụng bi khác; bi cái dừng trong zone; và từ đúng chỗ dừng đó cú kế (tip, lực ghi trong
// data, hướng cơ giải lại như app) vẫn đưa bi kế vào lỗ. Cú 3 không có zone, K là số mẫu bi 3 vào lỗ.
// Cú 2 bắt đầu từ chỗ bi cái dừng sau cú 1 danh nghĩa, cú 3 từ chỗ dừng sau cú 2, như app chơi lại.
// Toạ độ chép từ src/pool-engine/drills/23-three-ball-position.ts, đổi sang inch (x·50, y·100, r·50).
// Drill 24, 25, 30 cùng kiểu 45 mẫu, mỗi round một dòng. Toạ độ ở đây là nguồn để chép sang data drill (x/50, y/100).

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

func drill23() {
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
}

// MARK: drill 24, 25, 30

func norm(_ p: CGPoint) -> String { String(format: "(%.4f,%.4f)", p.x / 50, p.y / 100) }
func zs(_ z: (c: CGPoint, r: CGFloat)) -> String { String(format: "zone(%.1f,%.1f,%.1f)", z.c.x, z.c.y, z.r) }
func signedDeg(_ a: CGPoint, _ b: CGPoint) -> CGFloat { atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y) * 180 / .pi }
/// Bảng Shepard: góc bi cái lăn đều lệch khỏi đường đánh, tan θ = sinφ·cosφ / (sin²φ + 0.4).
func shepard(_ phi: CGFloat) -> CGFloat {
  let p = phi * .pi / 180
  return atan(sin(p) * cos(p) / (sin(p) * sin(p) + 0.4)) * 180 / .pi
}
/// Hướng bi cái sau va chạm, lấy ở mẫu đầu tiên đã lăn đều (|v − w| dưới 2% |v|). nil nếu chạm băng trước khi lăn đều.
func settledDir(_ r: SP.Run) -> CGPoint? {
  for i in r.pts.indices.dropFirst() {
    let p = r.pts[i], v = r.vs[i], w = r.ws[i], s = hypot(v.x, v.y)
    if p.x < 1.3 || p.x > 48.7 || p.y < 1.3 || p.y > 98.7 { return nil }
    if s > 1 && hypot(v.x - w.x, v.y - w.y) < 0.02 * s { return CGPoint(x: v.x / s, y: v.y / s) }
  }
  return nil
}
/// 45 mẫu lệch tay như drill 23, hướng cơ giữ như cú danh nghĩa. Trả về số mẫu theo từng nhãn của `judge`.
func sample(_ ms: SP.Setup, tipY: CGFloat, speed: CGFloat, aim: CGFloat, _ judge: (SP.Run) -> String) -> [String: Int] {
  var n = [String: Int]()
  for m in [0.9, 0.95, 1, 1.05, 1.1] as [CGFloat] { for dx in [-0.1, 0, 0.1] as [CGFloat] { for dy in [-0.1, 0, 0.1] as [CGFloat] {
    n[judge(SP.runWith(ms, tipX: dx, tipY: tipY + dy, speed: speed * m, aim: aim)), default: 0] += 1
  } } }
  return n
}

struct Round { let label: String; let cue: CGPoint; let ob: CGPoint; let tipY: CGFloat; let speed: CGFloat; let zone: (c: CGPoint, r: CGFloat) }

/// Drill 24: cắt 10/30/60/75° vào lỗ giữa trái, tipY 0.4 là lăn đều ngay từ đầu cơ. Bi cái được chạm băng sau khi đã
/// lăn đều, θ đo trước băng. Zone là chỗ dừng danh nghĩa, bán kính 3.5" như drill 23.
func drill24() {
  let pk = "sideLeft", P = SP.pockets[pk]!
  let rounds = [
    Round(label: "10", cue: inch(0.2292, 0.3857), ob: inch(0.0919, 0.4614), tipY: 0.4, speed: 0.4, zone: (inch(0.1163, 0.4699), 3.5)),
    Round(label: "30", cue: inch(0.2840, 0.4331), ob: inch(0.0919, 0.4614), tipY: 0.4, speed: 0.9, zone: (inch(0.1401, 0.3660), 3.5)),
    Round(label: "60", cue: inch(0.3047, 0.5435), ob: inch(0.1576, 0.4861), tipY: 0.4, speed: 0.9, zone: (inch(0.1158, 0.0713), 3.5)),
    Round(label: "75", cue: inch(0.4128, 0.3851), ob: inch(0.3545, 0.4687), tipY: 0.4, speed: 2.5, zone: (inch(0.8328, 0.0582), 3.5)),
  ]
  for rd in rounds {
    let ms = SP.Setup(c: rd.cue, o: rd.ob, pocket: pk, others: [])
    let nom = SP.runWith(ms, tipX: 0, tipY: rd.tipY, speed: rd.speed)
    guard clean(nom, pk) else { print("24 round \(rd.label)° danh nghĩa hỏng: \(SP.why(nom))"); exit(1) }
    let phi = cutDeg(rd.cue, rd.ob, P), th = settledDir(nom).map { abs(signedDeg(nom.a, $0)) } ?? .nan, sh = shepard(phi)
    let n = sample(ms, tipY: rd.tipY, speed: rd.speed, aim: atan2(nom.a.y, nom.a.x)) {
      !clean($0, pk) ? "miss" : dist($0.stop, rd.zone.c) <= rd.zone.r ? "ok" : "out"
    }
    print(String(format: "24 cắt %.0f° cue %@ ob %@ tipY %+.2f speed %.2f dừng %@ %@ rate=%d/45 · θ %.1f° Shepard %.1f° lệch %+.1f°",
                 phi, norm(rd.cue), norm(rd.ob), rd.tipY, rd.speed, norm(nom.stop), zs(rd.zone), n["ok"] ?? 0, th, sh, th - sh))
  }
}

/// Drill 25: bài của Tuấn, bi mục tiêu giữa bàn cắt 30° vào lỗ góc foot phải, bi cái trên head string. Draw tốt thì bi cái
/// lệch 3φ khỏi đường đánh (trisect) và chạy ngang về lỗ giữa trái. Zone ở miệng lỗ giữa, bi cái rơi lỗ là hỏng.
func drill25() {
  let pk = "footRight", P = SP.pockets[pk]!
  let rd = Round(label: "30", cue: inch(0.5075, 0.75), ob: inch(0.5, 0.5), tipY: -0.5, speed: 2.25, zone: (inch(0.0921, 0.5325), 3.5))
  let ms = SP.Setup(c: rd.cue, o: rd.ob, pocket: pk, others: [])
  let nom = SP.runWith(ms, tipX: 0, tipY: rd.tipY, speed: rd.speed)
  guard clean(nom, pk) else { print("25 danh nghĩa hỏng: \(SP.why(nom))"); exit(1) }
  let phi = cutDeg(rd.cue, rd.ob, P), th = settledDir(nom).map { abs(signedDeg(nom.a, $0)) } ?? .nan
  let n = sample(ms, tipY: rd.tipY, speed: rd.speed, aim: atan2(nom.a.y, nom.a.x)) {
    $0.scratch == "sideLeft" ? "scratch" : !clean($0, pk) ? "miss" : dist($0.stop, rd.zone.c) <= rd.zone.r ? "ok" : "out"
  }
  print(String(format: "25 cắt %.0f° cue %@ ob %@ tipY %+.2f speed %.2f dừng %@ %@ rate=%d/45 · θ %.1f° 3φ %.1f° lệch %+.1f° · rơi lỗ giữa %d, trượt lỗ/rơi khác %d, ngoài zone %d",
               phi, norm(rd.cue), norm(rd.ob), rd.tipY, rd.speed, norm(nom.stop), zs(rd.zone), n["ok"] ?? 0, th, 3 * phi, th - 3 * phi,
               n["scratch"] ?? 0, n["miss"] ?? 0, n["out"] ?? 0))
}

/// Drill 30: squat break, rack 9 bi khít với bi 1 trên foot spot, đỉnh quay về đầu bàn. Đánh thẳng vào bi 1, bi cái phải
/// dừng quanh giữa bàn. Rack: hàng 2 là 2, 3; hàng 3 là 4, 9, 5; hàng 4 là 6, 7; hàng 5 là 8, hàng cách nhau R·√3.
func drill30() {
  let R = SP.ballRadius, h = R * sqrt(3), one = CGPoint(x: 25, y: 25)
  let rack: [(Int, CGFloat, CGFloat)] = [(2, -R, -h), (3, R, -h), (4, -2 * R, -2 * h), (9, 0, -2 * h), (5, 2 * R, -2 * h),
                                         (6, -R, -3 * h), (7, R, -3 * h), (8, 0, -4 * h)]
  let others = rack.map { SP.Obstacle(n: $0.0, p: CGPoint(x: one.x + $0.1, y: one.y + $0.2)) }
  let rd = Round(label: "squat", cue: inch(0.5, 0.78), ob: one, tipY: -0.2, speed: 5.7, zone: (inch(0.5, 0.5), 3.5))
  // Đích lỗ chỉ để Setup đủ trường, break không xét bi 1 có vào lỗ hay không.
  let ms = SP.Setup(c: rd.cue, o: one, pocket: "footLeft", others: others)
  let aim = atan2(one.y - rd.cue.y, one.x - rd.cue.x)
  let nom = SP.runWith(ms, tipX: 0, tipY: rd.tipY, speed: rd.speed, aim: aim)
  let potted = ([nom.ob] + Array(nom.moved.values)).filter { $0.pocket != nil }.count
  let n = sample(ms, tipY: rd.tipY, speed: rd.speed, aim: aim) {
    $0.scratch != nil ? "scratch" : dist($0.stop, rd.zone.c) <= rd.zone.r ? "ok" : "out"
  }
  print(String(format: "30 squat cue %@ tipY %+.2f speed %.2f dừng %@ %@ rate=%d/45 · danh nghĩa vào lỗ %d bi · bi cái rơi %d, ngoài zone %d",
               norm(rd.cue), rd.tipY, rd.speed, norm(nom.stop), zs(rd.zone), n["ok"] ?? 0, potted, n["scratch"] ?? 0, n["out"] ?? 0))
}

drill23()
drill24()
drill25()
drill30()
