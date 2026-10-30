import CoreGraphics
import Foundation

// Drill chạy chuỗi `shots` (12, 15, 23) bằng đúng ShotPhysics của app: mỗi cú chạy 45 mẫu lệch tay quanh cú danh nghĩa
// (lực ×0.9…1.1 năm mức, tipX và tipY ±0.1 ba mức quanh tip của cú, hướng cơ giữ như cú danh nghĩa) và đếm K mẫu đạt.
// Mẫu đạt khi: bi mục tiêu vào đúng lỗ, bi cái không rơi, không đụng bi khác; bi cái dừng trong zone; và từ đúng chỗ dừng
// đó cú kế (tip, lực ghi trong data, hướng cơ giải lại như app) vẫn đưa bi kế vào lỗ. Drill 15 thêm: cú kế cắt ≤ 30°.
// Cú cuối không có zone, K là số mẫu bi cuối vào lỗ. Cú sau bắt đầu từ chỗ bi cái dừng sau cú trước danh nghĩa, như app
// chơi lại. Toạ độ chép từ file drill trong src/pool-engine/drills/, đổi sang inch (x·50, y·100, r·50).
// Drill 24, 25, 30 cùng kiểu 45 mẫu, mỗi round một dòng. Toạ độ ở đây là nguồn để chép sang data drill (x/50, y/100).
// Drill 34, 35, 46 đặt lại bi cái mỗi cú, drill 49 một cú: quét tip × lực, in số chép sang `rounds` hoặc `shots`.

typealias SP = ShotPhysics
func inch(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: x * 50, y: y * 100) }
func dist(_ a: CGPoint, _ b: CGPoint) -> CGFloat { hypot(a.x - b.x, a.y - b.y) }
func f(_ p: CGPoint) -> String { String(format: "(%.1f,%.1f)", p.x, p.y) }

struct Shot { let ball: Int; let pocket: String; var tipX: CGFloat = 0; let tipY: CGFloat; let speed: CGFloat; let zone: (c: CGPoint, r: CGFloat)? }

func setup(_ c: CGPoint, _ s: Shot, _ left: [Int: CGPoint]) -> SP.Setup {
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

/// Cả chuỗi, mỗi cú hai dòng. `maxCut` có thì mẫu đạt còn phải để cú kế cắt không quá số độ đó.
func chain(_ label: String, cue: CGPoint, balls: [Int: CGPoint], shots: [Shot], maxCut: CGFloat? = nil) {
var c = cue, left = balls
for (i, s) in shots.enumerated() {
  let ms = setup(c, s, left)
  let nom = SP.runWith(ms, tipX: s.tipX, tipY: s.tipY, speed: s.speed)
  guard clean(nom, s.pocket) else { print("\(label) shot \(i + 1) danh nghĩa hỏng: \(SP.why(nom))"); exit(1) }
  // `nom.a` là hướng bi cái sau squirt. Cộng lại squirt mới ra hướng cơ, không thì mẫu có tipX bị squirt hai lần.
  let aim = atan2(nom.a.y, nom.a.x) + nom.squirtDeg * .pi / 180
  var after = left
  after[s.ball] = nil
  var k = 0, miss = 0, out = 0, next = 0, wide = 0
  for m in [0.9, 0.95, 1, 1.05, 1.1] as [CGFloat] { for dx in [-0.1, 0, 0.1] as [CGFloat] { for dy in [-0.1, 0, 0.1] as [CGFloat] {
    let r = SP.runWith(ms, tipX: s.tipX + dx, tipY: s.tipY + dy, speed: s.speed * m, aim: aim)
    guard clean(r, s.pocket) else { miss += 1; continue }
    if let z = s.zone {
      guard dist(r.stop, z.c) <= z.r else { out += 1; continue }
      let n = shots[i + 1], nr = SP.runWith(setup(r.stop, n, after), tipX: n.tipX, tipY: n.tipY, speed: n.speed)
      guard clean(nr, n.pocket) else { next += 1; continue }
      if let maxCut, cutDeg(r.stop, after[n.ball]!, SP.pockets[n.pocket]!) > maxCut { wide += 1; continue }
    }
    k += 1
  } } }
  let zs = s.zone.map { String(format: "zone(%.1f,%.1f,%.1f)", $0.c.x, $0.c.y, $0.r) } ?? "zone(-)"
  print(String(format: "%@ shot %d tipX %+.2f tipY %+.2f speed %.2f %@ rate=%d/45", label, i + 1, s.tipX, s.tipY, s.speed, zs, k))
  let P = SP.pockets[s.pocket]!
  print(String(format: "   b%d→%@ từ %@ cắt %.0f° D %.1f L %.1f, dừng %@ · trượt lỗ/đụng %d, ngoài zone %d, cú kế hỏng %d%@",
               s.ball, s.pocket, f(c), cutDeg(c, ms.o, P), dist(c, ms.o), dist(ms.o, P), f(nom.stop), miss, out, next,
               maxCut.map { String(format: ", cú kế cắt > %.0f° %d", $0, wide) } ?? ""))
  c = nom.stop
  left = after
}
}

/// Drill 12, BU Exam II S1 Bachelors: dãy 4 bi, zone r 5".
func drill12() {
  chain("12", cue: inch(0.66, 0.43), balls: [1: inch(0.5, 0.45), 2: inch(0.5, 0.36), 3: inch(0.5, 0.27), 4: inch(0.5, 0.18)], shots: [
    Shot(ball: 1, pocket: "sideLeft", tipY: 0.6, speed: 0.8, zone: (inch(0.3, 0.5), 0.1 * 50)),
    Shot(ball: 2, pocket: "footRight", tipY: 0, speed: 1.4, zone: (inch(0.63, 0.24), 0.1 * 50)),
    Shot(ball: 3, pocket: "sideLeft", tipY: 0.2, speed: 1, zone: (inch(0.32, 0.05), 0.1 * 50)),
    Shot(ball: 4, pocket: "sideRight", tipY: -0.2, speed: 1.6, zone: nil),
  ])
}

/// Drill 15, Three-Ball 30° Max: zone r 6.5", đứng đâu trong zone cú kế cũng cắt ≤ 30°.
func drill15() {
  chain("15", cue: inch(0.45, 0.735), balls: [1: inch(0.3, 0.62), 2: inch(0.72, 0.35), 3: inch(0.35, 0.18)], shots: [
    Shot(ball: 1, pocket: "sideLeft", tipY: -0.4, speed: 1.6, zone: (inch(0.572, 0.541), 0.13 * 50)),
    Shot(ball: 2, pocket: "footRight", tipY: -0.3, speed: 1.6, zone: (inch(0.68, 0.31), 0.13 * 50)),
    Shot(ball: 3, pocket: "footLeft", tipY: -0.2, speed: 1.6, zone: nil),
  ], maxCut: 30)
}

/// Drill 23, position 3 bi.
func drill23() {
  chain("23", cue: inch(0.47, 0.588), balls: [1: inch(0.69, 0.568), 2: inch(0.896, 0.79), 3: inch(0.852, 0.859)], shots: [
    // Z2: bi 1 cắt 17° vào lỗ giữa phải, follow cho bi cái theo đà bi 1 rồi bẻ lên, dừng dưới bi 2 chừng 9" với góc 13°
    // vào lỗ góc đầu bàn. Dừng thấp quá hay sát băng quá thì bi 2 thành cắt mỏng dọc băng.
    Shot(ball: 1, pocket: "sideRight", tipY: 0.3, speed: 1, zone: (inch(0.88, 0.699), 0.07 * 50)),
    // Z3: bi 2 vào lỗ góc phải đầu bàn, draw để bi cái lùi lại 7" thay vì lăn theo về góc; từ đó bi 3 cách chừng 9",
    // cắt 21° vào cùng lỗ.
    Shot(ball: 2, pocket: "headRight", tipY: -0.4, speed: 1.2, zone: (inch(0.816, 0.765), 0.07 * 50)),
    Shot(ball: 3, pocket: "headRight", tipY: 0, speed: 1.4, zone: nil),
  ])
}

/// Thử tipX khác 0, không phải data drill: bi 1 → 2 của drill 31 với tip và `playSpeed` của round 1, 2. Ở lực video
/// 3.2 m/s bi cái engine đi xa hơn video và đụng bi 6, nên cú 1 dùng 3.0. Zone là chỗ bi cái đứng ở round 2 trong video.
func drill31Trial() {
  let balls: [Int: CGPoint] = [1: inch(0.955, 0.8125), 2: inch(0.5, 0.25), 3: inch(0.045, 0.8125), 4: inch(0.5, 0.2062),
                               5: inch(0.955, 0.6875), 6: inch(0.5, 0.1625), 7: inch(0.045, 0.6875), 8: inch(0.5, 0.1187),
                               9: inch(0.955, 0.5625), 10: inch(0.5, 0.075), 11: inch(0.045, 0.5625), 12: inch(0.5, 0.0312)]
  chain("31 thử", cue: inch(0.5025, 0.4963), balls: balls, shots: [
    Shot(ball: 1, pocket: "headRight", tipX: -0.21, tipY: -0.37, speed: 3.0, zone: (inch(0.28, 0.285), 5)),
    Shot(ball: 2, pocket: "footRight", tipX: 0.07, tipY: 0.47, speed: 1.35, zone: nil),
  ])
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
/// Hướng cơ của cú danh nghĩa. `nom.a` là hướng bi cái sau squirt, cộng lại squirt để mẫu có tipX không bị squirt hai lần.
func aimOf(_ nom: SP.Run) -> CGFloat { atan2(nom.a.y, nom.a.x) + nom.squirtDeg * .pi / 180 }
/// 45 mẫu lệch tay như drill 23, hướng cơ giữ như cú danh nghĩa. Trả về số mẫu theo từng nhãn của `judge`.
func sample(_ ms: SP.Setup, tipX: CGFloat = 0, tipY: CGFloat, speed: CGFloat, aim: CGFloat, _ judge: (SP.Run) -> String) -> [String: Int] {
  var n = [String: Int]()
  for m in [0.9, 0.95, 1, 1.05, 1.1] as [CGFloat] { for dx in [-0.1, 0, 0.1] as [CGFloat] { for dy in [-0.1, 0, 0.1] as [CGFloat] {
    n[judge(SP.runWith(ms, tipX: tipX + dx, tipY: tipY + dy, speed: speed * m, aim: aim)), default: 0] += 1
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

// MARK: drill 27, 28
/// Bank off băng phải (x = 50) sang lỗ góc footLeft. Lỗ ảo của Tuấn (#10) cách băng 0.8 W = 40", cùng hoành độ lỗ, đo từ
/// mũi băng: P' = (90, 0). Điểm bank 0.8 W là chỗ đường O → P' cắt đường tâm bi lúc chạm băng (x = 48.875).
/// Bi cái đặt thẳng sau bi 1 theo hướng điểm bank, cú gần thẳng như research 08 mục 2.5 khuyên. Engine: quét đích băng
/// `railRight@y` từng 0.1", lấy cửa sổ y mà bi 1 vào footLeft, điểm bank engine là giữa cửa sổ. k engine suy từ đường
/// O → điểm bank engine kéo tới y = 0.
let bankRail: CGFloat = 50 - 1.125
let ghostPocket = CGPoint(x: 50 + 0.8 * 50, y: 0)
func bankY(_ o: CGPoint) -> CGFloat { o.y * (1 - (bankRail - o.x) / (ghostPocket.x - o.x)) }
func behind(_ o: CGPoint, toward b: CGPoint, by d: CGFloat) -> CGPoint {
  let l = dist(o, b)
  return CGPoint(x: o.x - (b.x - o.x) / l * d, y: o.y - (b.y - o.y) / l * d)
}
/// Bi 1 còn trượt lúc chạm băng không: so vận tốc với spin ở mẫu cuối trước lần dội đầu.
func slidingAtRail(_ t: SP.Trace) -> String {
  guard let i = t.pts.indices.first(where: { t.pts[$0].x >= bankRail - 0.05 }), i > 0 else { return "?" }
  let v = t.vs[i - 1], w = t.ws[i - 1], s = hypot(v.x, v.y)
  return s > 0 && hypot(v.x - w.x, v.y - w.y) > 0.05 * s ? "trượt" : "lăn"
}
func bank(_ label: String, ob o: CGPoint, cueBack: CGFloat, speeds: [CGFloat]) {
  let y8 = bankY(o), c = behind(o, toward: CGPoint(x: bankRail, y: y8), by: cueBack)
  for v in speeds {
    func run(_ y: CGFloat) -> SP.Run { SP.runWith(SP.Setup(c: c, o: o, pocket: "railRight@\(y)", others: []), tipX: 0, tipY: 0, speed: v) }
    let ys = stride(from: y8 - 8, through: min(y8 + 30, 98), by: 0.1).filter { run($0).ob.pocket == "footLeft" }
    let at8 = run(y8)
    let line = String(format: "%@ ob %@ cue %@ v%.1f · 0.8 W bank y %.2f (%@, bi 1 %@) · ",
                      label, norm(o), norm(c), v, y8, at8.ob.pocket ?? "trượt", slidingAtRail(at8.ob))
    guard let lo = ys.first, let hi = ys.last else { print(line + "engine: không y nào vào footLeft"); continue }
    let ye = (lo + hi) / 2
    let k = (o.x + (bankRail - o.x) * o.y / (o.y - ye) - 50) / 50
    print(line + String(format: "engine bank y %.2f (cửa sổ %.1f–%.1f) · lệch %+.2f\" · k engine %.2f", ye, lo, hi, ye - y8, k))
  }
}
func drill27() {
  for (label, o) in [("27 R1", CGPoint(x: 37.5, y: 25)), ("27 R2", CGPoint(x: 37.5, y: 37.5)),
                     ("27 R3", CGPoint(x: 25, y: 25)), ("27 R4", CGPoint(x: 25, y: 37.5))] {
    bank(label, ob: o, cueBack: 14, speeds: [1.8, 2.6])
  }
}
/// Drill 28: cùng đường bank với 27 R1, bi 1 lùi xa băng ½, 1, 1½, 2½ diamond trên đường O → P'.
func drill28() {
  for (label, x) in [("28 R1", CGFloat(43.75)), ("28 R2", 37.5), ("28 R3", 31.25), ("28 R4", 18.75)] {
    bank(label, ob: CGPoint(x: x, y: 25 * (90 - x) / 52.5), cueBack: 12, speeds: [0.8, 1.8, 2.6])
  }
}

// MARK: drill 109, 110
/// Bank off băng phải sang lỗ bất kỳ: quét đích `railRight@y` từng 0.1" quanh điểm bank vẽ tay, bi cái thẳng sau bi 1
/// theo hướng điểm vẽ. In cửa sổ y engine cho bi 1 vào `pocket` và độ lệch so với điểm vẽ.
func bankTo(_ label: String, ob o: CGPoint, drawnY y0: CGFloat, pocket: String, cueBack: CGFloat, tipY: CGFloat, speeds: [CGFloat]) {
  let c = behind(o, toward: CGPoint(x: bankRail, y: y0), by: cueBack)
  for v in speeds {
    func run(_ y: CGFloat) -> SP.Run { SP.runWith(SP.Setup(c: c, o: o, pocket: "railRight@\(y)", others: []), tipX: 0, tipY: tipY, speed: v) }
    let ys = stride(from: max(y0 - 15, 1), through: min(y0 + 15, 99), by: 0.1).filter { run($0).ob.pocket == pocket }
    let at0 = run(y0)
    let line = String(format: "%@ ob %@ cue %@ v%.1f · vẽ tay y %.2f (%@) · ", label, norm(o), norm(c), v, y0, at0.ob.pocket ?? "trượt")
    guard let lo = ys.first, let hi = ys.last else { print(line + "engine: không y nào vào \(pocket)"); continue }
    print(line + String(format: "engine y %.2f (cửa sổ %.1f–%.1f) · lệch %+.2f\"", (lo + hi) / 2, lo, hi, (lo + hi) / 2 - y0))
  }
}
func drill109() {
  bankTo("109", ob: CGPoint(x: 36, y: 38), drawnY: 40.5, pocket: "sideLeft", cueBack: 14, tipY: -0.2, speeds: [1.2, 1.6, 2.2])
}
/// Drill 110: bi 1 ở 42% đường O → B, O cách góc head 2.1 b diamond trên băng trái, B cách góc b diamond trên băng phải.
func drill110() {
  for b in [1, 1.5, 2, 2.5, 3] as [CGFloat] {
    let o = CGPoint(x: 1.125, y: 100 - 12.5 * 2.1 * b), bp = CGPoint(x: bankRail, y: 100 - 12.5 * b)
    let ob = CGPoint(x: o.x + 0.42 * (bp.x - o.x), y: o.y + 0.42 * (bp.y - o.y))
    bankTo("110 b\(b)", ob: ob, drawnY: bp.y, pocket: "headLeft", cueBack: 12, tipY: -0.2, speeds: [1.6, 2.4])
  }
}

/// Drill 113, English Speed Check: cắt 27° vào footLeft từ 40", phê ngoài +0.4 ở ba bậc lực, thêm round tip giữa làm gốc.
/// Mỗi round in squirt, throw và độ lệch hướng cơ so với round gốc để `why` ghi bù bao nhiêu ở từng lực.
func drill113() {
  let pk = "footLeft", cue = inch(0.3, 0.7), one = inch(0.3, 0.3)
  let ms = setup(cue, Shot(ball: 1, pocket: pk, tipY: 0, speed: 0, zone: nil), [1: one])
  var baseAim: CGFloat?
  for (x, lo, hi) in [(0, 1.5, 2.0), (0.4, 0.8, 1.2), (0.4, 1.5, 2.0), (0.4, 2.5, 3.2)] as [(CGFloat, CGFloat, CGFloat)] {
    guard let b = pick(ms, tipX: x, tips: [0], speeds: grid(lo, hi, 0.05), keep: { clean($0, pk) }, { clean($0, pk) ? "ok" : "miss" }) else {
      print(String(format: "113 tipX %+.2f lực %.1f–%.1f: không cú danh nghĩa nào đạt", x, lo, hi)); continue
    }
    let aim = aimOf(b.nom) * 180 / .pi
    if x == 0 { baseAim = aim }
    print(String(format: "113 tipX %+.2f cắt %.0f° speed %.2f rate=%d/45 squirtDeg %+.2f throwDeg %+.2f · hướng cơ lệch gốc %+.2f° · dừng %@",
                 x, cutDeg(cue, one, SP.pockets[pk]!), b.speed, b.rate, b.nom.squirtDeg, b.nom.throwDeg, aim - (baseAim ?? aim), norm(b.nom.stop)))
  }
}

/// Bi `n` từ `c` có cú vào lỗ nào trong `pks` không: cắt tối đa 50°, cách bi ít nhất 6", một trong ba lực tip giữa vào sạch.
/// App cho đánh cú này: `shotOf` không chặn (lỗ giữa quá dốc, bi chắn, bi sát băng).
func legal(_ c: CGPoint, _ n: Int, _ pk: String, _ left: [Int: CGPoint]) -> Bool {
  SP.shotOf(ball: n, pocket: pk, balls: left.merging([0: c]) { a, _ in a })?.level != .bad
}

func playable(_ c: CGPoint, _ n: Int, _ left: [Int: CGPoint], _ pks: [String]) -> String? {
  for pk in pks where cutDeg(c, left[n]!, SP.pockets[pk]!) <= 50 && dist(c, left[n]!) >= 6 && legal(c, n, pk, left) {
    let ms = setup(c, Shot(ball: n, pocket: pk, tipY: 0, speed: 0, zone: nil), left)
    for v in [0.8, 1.2, 1.8] as [CGFloat] where clean(SP.runWith(ms, tipX: 0, tipY: 0, speed: v), pk) { return pk }
  }
  return nil
}

/// Drill 120, Rail Row Return (#29 Fedor, bài của Tyler Styer): 5 bi cách băng dài phải 7.5", bi 9 cách băng đầu một bi.
/// Cách 5" thì bi hàng sang lỗ giữa dốc quá 60°, app chặn (`legal`), mà đi lỗ góc thì bi cái về không tới bi 9.
/// Đi row 1 → 9 → row 2 → 9 … → row 5, bi 9 vào lỗ thì đặt lại chỗ cũ. Mỗi cú phải để cú kế đánh được (`playable`) và
/// bi cái không dừng lên chỗ đặt bi 9. Tìm theo beam rộng 10, mỗi nhánh là một lỗ và một tip; xếp nhánh theo rate thấp
/// nhất của chuỗi rồi tổng rate, beam 40. Zone là chỗ dừng danh nghĩa, bán kính 4".
func drill120() {
  let nine = 9, spot = inch(0.25, 0.966)
  var start: [Int: CGPoint] = [nine: spot]
  for (i, y) in ([0.55, 0.62, 0.69, 0.76, 0.83] as [CGFloat]).enumerated() { start[i + 1] = inch(0.85, y) }
  let rowPk = ["footRight", "sideRight"], ninePk = ["headLeft", "headRight"]
  var seq = [Int]()
  for i in 1...5 { seq.append(i); if i < 5 { seq.append(nine) } }
  typealias Step = (n: Int, pk: String, from: CGPoint, tipY: CGFloat, speed: CGFloat, rate: Int, stop: CGPoint)
  var beam: [(c: CGPoint, left: [Int: CGPoint], steps: [Step])] = [(inch(0.7, 0.72), start, [])]
  for (k, n) in seq.enumerated() {
    let nx: Int? = k + 1 < seq.count ? seq[k + 1] : nil
    let pks = nx == nine ? ninePk : rowPk
    var next = [(c: CGPoint, left: [Int: CGPoint], steps: [Step])]()
    for st in beam {
      var after = st.left
      if n != nine { after[n] = nil }
      for pk in n == nine ? ninePk : rowPk where cutDeg(st.c, st.left[n]!, SP.pockets[pk]!) <= 55 && dist(st.c, st.left[n]!) >= 6 && legal(st.c, n, pk, st.left) {
        let ms = setup(st.c, Shot(ball: n, pocket: pk, tipY: 0, speed: 0, zone: nil), st.left)
        let keep = { (r: SP.Run) -> Bool in
          guard clean(r, pk), nearestPocket(r.stop) > 4 else { return false }
          guard let nx else { return true }
          return dist(r.stop, spot) > 3 && playable(r.stop, nx, after, pks) != nil
        }
        for t in [-0.4, -0.2, 0, 0.2, 0.4] as [CGFloat] {
          guard let b = pick(ms, tips: [t], speeds: grid(0.6, 3, 0.15), keep: keep, { clean($0, pk) ? "ok" : "miss" }) else { continue }
          next.append((b.nom.stop, after, st.steps + [(n, pk, st.c, b.tipY, b.speed, b.rate, b.nom.stop)]))
        }
      }
    }
    let score = { (s: [Step]) in (s.map(\.rate).min() ?? 0) * 1000 + s.map(\.rate).reduce(0, +) }
    // Giữ một nhánh tốt nhất mỗi ô 5" chỗ dừng, để beam không dồn hết vào một chỗ.
    var seen = Set<String>()
    beam = Array(next.sorted { score($0.steps) > score($1.steps) }.filter { seen.insert("\(Int($0.c.x / 5)),\(Int($0.c.y / 5))").inserted }.prefix(40))
    guard !beam.isEmpty else { print("120 cú \(k + 1) bi \(n): không nhánh nào đi tiếp được"); exit(1) }
  }
  for (k, s) in beam[0].steps.enumerated() {
    let left = k == 0 ? start : beam[0].steps[..<k].reduce(into: start) { if $1.n != nine { $0[$1.n] = nil } }
    print(String(format: "120 cú %d bi %d→%@ từ %@ cắt %.0f° tipY %+.2f speed %.2f rate=%d/45 dừng %@",
                 k + 1, s.n, s.pk, norm(s.from), cutDeg(s.from, left[s.n]!, SP.pockets[s.pk]!), s.tipY, s.speed, s.rate, norm(s.stop)))
  }
}

/// Drill 121, Half-Ball 4 Diamonds (#31 Dr. Dave): bi 1 ở (15", 30"), cắt ½ bi (30°) vào lỗ góc chân trái. In chỗ
/// bi cái chạm băng đầu tiên sau va chạm và chỗ dừng cho từng tip, để so với hệ "½ bi đưa bi cái 4 diamond".
func drill121() {
  let pk = "footLeft", P = SP.pockets[pk]!, o = inch(0.3, 0.3)
  let d = CGPoint(x: (P.x - o.x) / dist(P, o), y: (P.y - o.y) / dist(P, o))
  let g = SP.ghost(o, P).g, a = atan2(d.y, d.x) - .pi / 6
  let cue = CGPoint(x: g.x - 22 * cos(a), y: g.y - 22 * sin(a))
  let ms = SP.Setup(c: cue, o: o, pocket: pk, others: [])
  print(String(format: "121 cue %@ ob %@ cắt %.1f°", norm(cue), norm(o), cutDeg(cue, o, P)))
  for t in [0, 0.4, -0.4, 0.2] as [CGFloat] {
    guard let b = pick(ms, tips: [t], speeds: grid(1, 3, 0.1), keep: { clean($0, pk) && nearestPocket($0.stop) > 4 }, { clean($0, pk) ? "ok" : "miss" }) else {
      print("121 tipY \(t): không cú nào đạt"); continue
    }
    let rails = b.nom.pts.enumerated().filter { $0.offset > 0 && ($0.element.x < 1.2 || $0.element.x > 48.8 || $0.element.y < 1.2 || $0.element.y > 98.8) }
    let first = rails.first.map { norm($0.element) } ?? "-"
    let far = b.nom.pts.filter { $0.y > 98.8 || $0.x < 1.2 || $0.x > 48.8 }.first.map { norm($0) } ?? "-"
    print(String(format: "121 tipY %+.2f speed %.2f rate=%d/45 · băng đầu tiên %@ · băng dài/đầu đầu tiên %@ · dừng %@",
                 b.tipY, b.speed, b.rate, first, far, norm(b.nom.stop)))
  }
}

// MARK: drill 34, 35, 46, 49

func grid(_ a: CGFloat, _ b: CGFloat, _ step: CGFloat) -> [CGFloat] { Array(stride(from: a, through: b + 1e-6, by: step)) }
/// Số gọn để chép sang TS: 0.70 → 0.7, 1.00 → 1.
func num(_ v: CGFloat) -> String {
  var s = String(format: "%.2f", v)
  while s.hasSuffix("0") { s.removeLast() }
  if s.hasSuffix(".") { s.removeLast() }
  return s
}
func nearestPocket(_ p: CGPoint) -> CGFloat { SP.pockets.values.map { dist(p, $0) }.min()! }
func tipWord(_ t: CGFloat) -> String { t > 0.1 ? "Follow" : t < -0.1 ? "Draw" : "Center ball" }

/// Cú danh nghĩa tốt nhất trên lưới tip × lực, chỉ xét cú danh nghĩa `keep` nhận, rate là số mẫu `judge` trả "ok". Mỗi
/// tip lấy rate cao nhất, nhiều lực cùng rate thì lấy lực giữa; tip đứng trước được giữ trừ khi tip sau rate cao hơn.
func pick(_ ms: SP.Setup, tipX: CGFloat = 0, tips: [CGFloat], speeds: [CGFloat], keep: (SP.Run) -> Bool,
          _ judge: (SP.Run) -> String) -> (tipY: CGFloat, speed: CGFloat, rate: Int, nom: SP.Run)? {
  var best: (tipY: CGFloat, speed: CGFloat, rate: Int, nom: SP.Run)?
  for t in tips {
    var top = -1, at = [(CGFloat, SP.Run)]()
    for v in speeds {
      let nom = SP.runWith(ms, tipX: tipX, tipY: t, speed: v)
      guard keep(nom) else { continue }
      let k = sample(ms, tipX: tipX, tipY: t, speed: v, aim: aimOf(nom), judge)["ok"] ?? 0
      if k > top { (top, at) = (k, [(v, nom)]) } else if k == top { at.append((v, nom)) }
    }
    if top > (best?.rate ?? -1) { best = (t, at[at.count / 2].0, top, at[at.count / 2].1) }
  }
  return best
}

/// Một round đặt lại bi cái: bi `n` vào `pk`, bi khác trong `left` đứng yên làm bi chắn. Rate là số mẫu vào sạch. `stop`
/// có thì cú danh nghĩa phải là stop shot, bi cái dừng cách chỗ chạm không quá chừng đó. In một dòng chi tiết và một
/// dòng chép sang `DrillRound`, `contactPoint` chỉ in khi tip khác `base` của bài.
func placed(_ label: String, ball n: Int, pocket pk: String, cue: CGPoint, left: [Int: CGPoint], tipX: CGFloat = 0, tips: [CGFloat],
            base: CGFloat, speeds: [CGFloat], stop: CGFloat? = nil, back: CGFloat? = nil, why: (CGFloat, CGFloat, SP.Run, CGPoint) -> String) {
  let ms = setup(cue, Shot(ball: n, pocket: pk, tipY: 0, speed: 0, zone: nil), left)
  let P = SP.pockets[pk]!, g = SP.ghost(left[n]!, P).g
  // `back` có thì cú danh nghĩa là draw: bi cái dừng sau chỗ chạm, ngược hướng đánh, ít nhất chừng đó.
  let behind = { (r: SP.Run) in (r.stop.x - g.x) * (g.x - cue.x) + (r.stop.y - g.y) * (g.y - cue.y) < 0 }
  let keep = { (r: SP.Run) in
    clean(r, pk) && (stop.map { dist(r.stop, g) <= $0 } ?? true) && (back.map { behind(r) && dist(r.stop, g) >= $0 } ?? true)
  }
  guard let b = pick(ms, tipX: tipX, tips: tips, speeds: speeds, keep: keep, { clean($0, pk) ? "ok" : "miss" }) else {
    print("\(label) bi \(n): không cú danh nghĩa nào đạt"); exit(1)
  }
  print(String(format: "%@ bi %d→%@ từ %@ cắt %.0f° D %.1f L %.1f · tipY %+.2f speed %.2f rate=%d/45 · dừng %@ cách chỗ chạm %.1f\" cách lỗ gần nhất %.1f\"",
               label, n, pk, norm(cue), cutDeg(cue, left[n]!, P), dist(cue, left[n]!), dist(left[n]!, P), b.tipY, b.speed, b.rate,
               norm(b.nom.stop), dist(b.nom.stop, g), nearestPocket(b.nom.stop)))
  let cp = b.tipY == base && tipX == 0 ? "" : "contactPoint: { x: \(num(tipX)), y: \(num(b.tipY)) }, "
  print("   { \(cp)speed: \(num(b.speed)), rate: \(b.rate), why: '\(why(b.tipY, b.speed, b.nom, g))' },")
}

/// Drill 34, Ring Around the Side: năm bi trên cung 1 diamond quanh lỗ giữa trái, bi cái thẳng sau mỗi bi 1 diamond, bi
/// chưa đánh còn trên bàn. Tip giữa như bài, lực bậc soft (dưới 0.89 m/s).
func drill34() {
  let ring: [(Int, CGPoint, CGPoint)] = [
    (1, inch(0.1434, 0.6024), inch(0.2868, 0.7048)), (2, inch(0.2218, 0.5577), inch(0.4435, 0.6154)),
    (3, inch(0.25, 0.5), inch(0.5, 0.5)), (4, inch(0.2218, 0.4423), inch(0.4435, 0.3846)),
    (5, inch(0.1434, 0.3976), inch(0.2868, 0.2952)),
  ]
  for (i, (n, _, cue)) in ring.enumerated() {
    let left = Dictionary(uniqueKeysWithValues: ring[i...].map { ($0.0, $0.1) })
    placed("34", ball: n, pocket: "sideLeft", cue: cue, left: left, tips: [0], base: 0, speeds: grid(0.3, 0.88, 0.02)) { t, v, nom, g in
      String(format: "Straight in from one diamond. %@ at %@ m/s lets the cue ball roll %.0f\" past contact and stop %.0f\" short of the pocket.",
             tipWord(t), num(v), dist(nom.stop, g), nearestPocket(nom.stop))
    }
  }
}

/// Drill 35, 15-Ball Lineup: 15 bi trên đường nối hai lỗ giữa, bi cái thẳng lỗ sau mỗi bi 2 diamond, bàn còn các bi chưa
/// đánh. Bài là stop shot nên cú danh nghĩa phải dừng cách chỗ chạm không quá một bán kính bi; quét tip thấp, lực bậc medium.
func drill35() {
  let xs: [CGFloat] = [0.075, 0.1357, 0.1964, 0.2571, 0.3179, 0.3786, 0.4393, 0.5, 0.5607, 0.6214, 0.6821, 0.7429, 0.8036, 0.8643, 0.925]
  let cues: [(CGFloat, CGFloat)] = [
    (0.1124, 0.7493), (0.2029, 0.7477), (0.2928, 0.7453), (0.3816, 0.7421), (0.4694, 0.7383), (0.5556, 0.7338), (0.6404, 0.7289),
    (0.7236, 0.7236), (0.3596, 0.7289), (0.4444, 0.7338), (0.5306, 0.7383), (0.6184, 0.7421), (0.7072, 0.7453), (0.7971, 0.7477),
    (0.8876, 0.7493),
  ]
  for i in xs.indices {
    let left = Dictionary(uniqueKeysWithValues: (i..<xs.count).map { ($0 + 1, inch(xs[$0], 0.5)) })
    placed("35", ball: i + 1, pocket: i < 8 ? "footLeft" : "footRight", cue: inch(cues[i].0, cues[i].1), left: left,
           tips: [-0.1, -0.2, -0.3, -0.4, -0.5, -0.6], base: -0.5, speeds: grid(0.9, 1.85, 0.05), stop: SP.ballRadius) { _, v, nom, g in
      String(format: "Straight in from two diamonds. Below center at %@ m/s stops the cue ball within %.0f\" of contact.",
             num(v), max(1, dist(nom.stop, g).rounded()))
    }
  }
}

/// Drill 46, Jal Circle: bảy bi trên cung tâm lỗ footLeft, bi cái song song long rail sau ghost ball 2 diamond, bàn còn các
/// bi chưa đánh. Tip giữa hay follow thì bi cái theo tangent đâm vào bi kế trên cung, nên quét cả draw và follow tới
/// `miscueSafe`, lực tới 3 m/s.
func drill46() {
  let arc: [(CGFloat, CGFloat)] = [(0.125, 0.4961), (0.25, 0.4841), (0.375, 0.4635), (0.5, 0.433), (0.625, 0.3903), (0.75, 0.3307), (0.875, 0.2421)]
  let cues: [(CGFloat, CGFloat)] = [(0.1306, 0.7461), (0.2612, 0.7341), (0.3919, 0.7135), (0.5225, 0.683), (0.6531, 0.6403), (0.7837, 0.5807), (0.9144, 0.4921)]
  let thickness = ["7/8", "3/4", "5/8", "1/2", "3/8", "1/4", "1/8"]
  for i in arc.indices {
    let left = Dictionary(uniqueKeysWithValues: (i..<arc.count).map { ($0 + 1, inch(arc[$0].0, arc[$0].1)) })
    placed("46", ball: i + 1, pocket: "footLeft", cue: inch(cues[i].0, cues[i].1), left: left,
           tips: [0, -0.2, 0.2, -0.4, 0.4, -0.5, 0.5], base: -0.5, speeds: grid(0.5, 3, 0.05)) { t, v, nom, _ in
      let how = left.count == 1 ? String(format: "leaves the cue ball %.0f\" from the nearest pocket", nearestPocket(nom.stop))
        : "keeps the cue ball clear of the balls left on the arc"
      return String(format: "%.0f° cut, a %@ hit. %@ at %@ m/s gets the ball to the corner and %@.",
                    cutDeg(inch(cues[i].0, cues[i].1), inch(arc[i].0, arc[i].1), SP.pockets["footLeft"]!), thickness[i], tipWord(t),
                    num(v), how)
    }
  }
}

/// Drill 49, Soft Touch: một cú bi 1 vào footRight, bi cái phải chạm bi 2 rồi dừng trong một bề rộng bi quanh chỗ bi 2
/// dừng (r 4.5" tính từ tâm). Không dùng `clean`: va chạm gán `hit` cho cả hai bi nên mẫu nào chạm bi 2 cũng bị loại,
/// còn Play cú cố định chỉ đòi bi mục tiêu vào và bi cái không rơi. Layout đọc từ hình (bi cái giữa bàn, cắt 49°) không
/// ra cú nào: bi 1 đi 35" mới tới lỗ, bi cái tới bi 2 còn 0.77–1.22 m/s. Ở đây bi 1 giữ foot spot, bi cái và bi 2 dời
/// cho cú cắt 13°. Quét tip × lực, rate là số mẫu đạt.
func drill49() {
  let pk = "footRight", cue = inch(0.26, 0.33), one = inch(0.5, 0.25), two = inch(0.7, 0.26), r: CGFloat = 0.09 * 50
  let ms = setup(cue, Shot(ball: 1, pocket: pk, tipY: 0, speed: 0, zone: nil), [1: one, 2: two])
  let touch = { (x: SP.Run) -> Bool in
    x.short == nil && x.scratch == nil && x.ob.pocket == pk && x.ob.hit == nil && x.hit == 2
      && (x.moved[2].map { $0.pocket == nil && $0.hit == 0 && dist(x.stop, $0.stop) <= r } ?? false)
  }
  guard let b = pick(ms, tips: [0, -0.1, 0.1, -0.2, 0.2, -0.3, 0.3, -0.4, 0.4], speeds: grid(0.3, 1.6, 0.02), keep: touch,
                     { touch($0) ? "ok" : "miss" }) else { print("49: không cú danh nghĩa nào chạm bi 2 rồi dừng sát"); exit(1) }
  let to = b.nom.moved[2]?.stop ?? two, cut = cutDeg(cue, one, SP.pockets[pk]!), gap = dist(b.nom.stop, to) - 2 * SP.ballRadius
  print(String(format: "49 bi 1→%@ cắt %.0f° · tipY %+.2f speed %.2f dừng %@ · bi 2 %@ → %@ dời %.1f\", bi cái cách mặt bi 2 %.1f\" rate=%d/45",
               pk, cut, b.tipY, b.speed, norm(b.nom.stop), norm(two), norm(to), dist(two, to), gap, b.rate))
  print(String(format: "   { ball: 1, pocket: '%@', tipY: %@, speed: %@, zone: 0, rate: %d, why: '%.0f° cut. %@ at %@ m/s bends the cue ball off the tangent line into the 2, nudging it %.0f\" and stopping %.0f\" from it.' },",
               pk, num(b.tipY), num(b.speed), b.rate, cut, tipWord(b.tipY), num(b.speed), max(1, dist(two, to).rounded()),
               max(1, gap.rounded())))
}

/// Thử tipX: cắt 30° vào footLeft, bi cái cách ghost 1 diamond (12.5"), tipX 0 và ±0.5, ngắm theo cú danh nghĩa của tip đó.
func tipXTrial() {
  let o = CGPoint(x: 15, y: 30), P = SP.pockets["footLeft"]!, g = SP.ghost(o, P).g
  let d = CGPoint(x: (P.x - o.x) / dist(P, o), y: (P.y - o.y) / dist(P, o)), a = 30 * CGFloat.pi / 180
  let u = CGPoint(x: d.x * cos(a) - d.y * sin(a), y: d.x * sin(a) + d.y * cos(a))
  let c = CGPoint(x: g.x - u.x * 12.5, y: g.y - u.y * 12.5)
  let ms = SP.Setup(c: c, o: o, pocket: "footLeft", others: [], ball: 1)
  for x in [0, 0.5, -0.5] as [CGFloat] {
    let nom = SP.runWith(ms, tipX: x, tipY: 0, speed: 1.5)
    let k = sample(ms, tipX: x, tipY: 0, speed: 1.5, aim: aimOf(nom)) { clean($0, "footLeft") ? "ok" : "miss" }["ok"] ?? 0
    print(String(format: "tipX thử cắt %.0f° tipX %+.2f speed 1.50 rate=%d/45 squirtDeg %+.2f throwDeg %+.2f gear %.2f · danh nghĩa %@",
                 cutDeg(c, o, P), x, k, nom.squirtDeg, nom.throwDeg, nom.gear, clean(nom, "footLeft") ? "vào" : SP.why(nom)))
  }
}

/// Drill 26, English Check: cùng thế cắt nửa bi, ba round tipX 0, +0.5 (phê ngoài), −0.5 (phê trong). Mỗi round tìm lực
/// rate cao nhất, ngắm theo cú danh nghĩa của tip đó. In squirt và throw để why ghi chiều dày, mỏng.
func drill26() {
  let pk = "footLeft", cue = inch(0.6034, 0.5772), one = inch(0.5, 0.3125)
  for x in [0, 0.5, -0.5] as [CGFloat] {
    let ms = setup(cue, Shot(ball: 1, pocket: pk, tipY: 0, speed: 0, zone: nil), [1: one])
    guard let b = pick(ms, tipX: x, tips: [0], speeds: grid(0.8, 2.4, 0.05), keep: { clean($0, pk) }, { clean($0, pk) ? "ok" : "miss" })
    else {
      for v in [1.0, 1.4, 1.8, 2.2] as [CGFloat] {
        let n = SP.runWith(ms, tipX: x, tipY: 0, speed: v)
        print(String(format: "26 tipX %+.2f speed %.1f: bi 1 %@, scratch %@, dừng %@ · %@", x, v, n.ob.pocket ?? "-", n.scratch ?? "-",
                     norm(n.stop), SP.why(n)))
      }
      continue
    }
    print(String(format: "26 tipX %+.2f cắt %.0f° speed %.2f rate=%d/45 squirtDeg %+.2f throwDeg %+.2f · dừng %@",
                 x, cutDeg(cue, one, SP.pockets[pk]!), b.speed, b.rate, b.nom.squirtDeg, b.nom.throwDeg, norm(b.nom.stop)))
  }
}

/// Drill 48, Frozen Pair & Throw: bi cái đánh bi 2, bi 2 đẩy bi 1 ép băng vào headLeft. Đích của engine là bi 2 vào
/// headLeft, bi 1 làm vật chắn; mẫu đạt khi bi 1 vào headLeft, bi 2 và bi cái không rơi.
func drill48() {
  let pk = "headLeft", cue = inch(0.5, 0.0625), one = inch(0.0225, 0.75), two = inch(0.0225, 0.7275)
  let ms = SP.Setup(c: cue, o: two, pocket: pk, others: [SP.Obstacle(n: 1, p: one)], ball: 2)
  let ok = { (r: SP.Run) -> Bool in r.scratch == nil && r.moved[1]?.pocket == pk && r.ob.pocket == nil }
  for x in [0, 0.2, -0.2] as [CGFloat] {
    guard let b = pick(ms, tipX: x, tips: [0], speeds: grid(0.6, 2.4, 0.05), keep: ok, { ok($0) ? "ok" : "miss" }) else {
      let n = SP.runWith(ms, tipX: x, tipY: 0, speed: 1.5)
      print(String(format: "48 tipX %+.2f: không cú danh nghĩa nào đạt · thử 1.5 m/s: bi 1 %@ dừng %@, bi 2 %@ · %@", x,
                   n.moved[1]?.pocket ?? "-", norm(n.moved[1]?.stop ?? one), n.ob.pocket ?? "-", SP.why(n)))
      continue
    }
    print(String(format: "48 tipX %+.2f speed %.2f rate=%d/45 squirtDeg %+.2f throwDeg %+.2f · bi cái dừng %@",
                 x, b.speed, b.rate, b.nom.squirtDeg, b.nom.throwDeg, norm(b.nom.stop)))
  }
}

/// Drill 83, One-Diamond Squirt: bi 1 cố định, bi cái cách ghost 1 diamond ở góc cắt 15° và 30°, tipX 0 và ±0.31 (9 mm).
/// Mỗi round in rate với cú danh nghĩa của tip đó, rồi đánh lại với hướng ngắm của round trơn cùng góc để đo bi 1 lệch bao
/// nhiêu inch ở lỗ so với tip giữa cùng lực: dương là dày (góc ra nhỏ hơn), âm là mỏng.
func drill83() {
  let pk = "footLeft", o = CGPoint(x: 15, y: 30), P = SP.pockets[pk]!, g = SP.ghost(o, P).g
  let d = CGPoint(x: (P.x - o.x) / dist(P, o), y: (P.y - o.y) / dist(P, o))
  for deg in [30, 15] as [CGFloat] {
    let a = deg * .pi / 180
    let u = CGPoint(x: d.x * cos(a) - d.y * sin(a), y: d.x * sin(a) + d.y * cos(a))
    let c = CGPoint(x: g.x - u.x * 12.5, y: g.y - u.y * 12.5)
    let ms = SP.Setup(c: c, o: o, pocket: pk, others: [], ball: 1)
    let base = SP.runWith(ms, tipX: 0, tipY: 0, speed: 2)
    let cutOf = { (r: SP.Run) -> CGFloat in
      guard r.ob.pts.count > 1 else { return .nan }
      let v = CGPoint(x: r.ob.pts[1].x - r.ob.pts[0].x, y: r.ob.pts[1].y - r.ob.pts[0].y)
      return abs(signedDeg(CGPoint(x: o.x - c.x, y: o.y - c.y), v))
    }
    for x in [0, 0.31, -0.31] as [CGFloat] {
      guard let b = pick(ms, tipX: x, tips: [0], speeds: grid(1.0, 3.0, 0.1), keep: { clean($0, pk) }, { clean($0, pk) ? "ok" : "miss" }) else {
        print(String(format: "83 cắt %.0f° tipX %+.2f: không cú danh nghĩa nào đạt", deg, x)); continue
      }
      let fixed = SP.runWith(ms, tipX: x, tipY: 0, speed: b.speed, aim: aimOf(base))
      let ref = SP.runWith(ms, tipX: 0, tipY: 0, speed: b.speed, aim: aimOf(base))
      let dc = cutOf(ref) - cutOf(fixed)
      print(String(format: "83 cắt %.1f° c %@ tipX %+.2f speed %.2f rate=%d/45 squirtDeg %+.2f throwDeg %+.2f · ngắm như trơn: góc ra %.2f° (trơn %.2f°) lệch ở lỗ %+.1f\" %@",
                   cutDeg(c, o, P), norm(c), x, b.speed, b.rate, b.nom.squirtDeg, b.nom.throwDeg, cutOf(fixed), cutOf(ref),
                   tan(dc * .pi / 180) * dist(o, P), dc > 0 ? "dày" : "mỏng"))
    }
  }
}

/// Drill 84, Throw Check: cắt nửa bi (30°) vào footLeft, bi cái cách ghost 2 diamond. Ba round: tip giữa chậm, tip giữa
/// nhanh, phê ngoài vừa gearing. tipX gearing tìm bằng chia đôi trên `throwDeg` của cú danh nghĩa, bắt đầu từ `gear`.
func drill84() {
  let pk = "footLeft", o = CGPoint(x: 15, y: 30), P = SP.pockets[pk]!, g = SP.ghost(o, P).g
  let d = CGPoint(x: (P.x - o.x) / dist(P, o), y: (P.y - o.y) / dist(P, o)), a = 30 * CGFloat.pi / 180
  let u = CGPoint(x: d.x * cos(a) - d.y * sin(a), y: d.x * sin(a) + d.y * cos(a))
  let c = CGPoint(x: g.x - u.x * 25, y: g.y - u.y * 25)
  let ms = SP.Setup(c: c, o: o, pocket: pk, others: [], ball: 1)
  let judge = { (r: SP.Run) in clean(r, pk) ? "ok" : "miss" }
  func row(_ label: String, _ x: CGFloat, _ speeds: [CGFloat]) {
    guard let b = pick(ms, tipX: x, tips: [0], speeds: speeds, keep: { clean($0, pk) }, judge) else {
      print("84 \(label): không cú danh nghĩa nào đạt"); return
    }
    print(String(format: "84 %@ cắt %.1f° c %@ tipX %+.3f speed %.2f rate=%d/45 squirtDeg %+.2f throwDeg %+.2f gear %+.3f",
                 label, cutDeg(c, o, P), norm(c), x, b.speed, b.rate, b.nom.squirtDeg, b.nom.throwDeg, b.nom.gear))
  }
  row("chậm", 0, grid(0.7, 1.1, 0.05))
  row("nhanh", 0, grid(2.4, 3.2, 0.1))
  let v: CGFloat = 1.6
  let g0 = SP.runWith(ms, tipX: 0, tipY: 0, speed: v).gear
  var lo: CGFloat = 0, hi = 2 * g0
  let th = { (x: CGFloat) in SP.runWith(ms, tipX: x, tipY: 0, speed: v).throwDeg }
  let s0 = th(lo)
  for _ in 0..<30 { let m = (lo + hi) / 2; if (th(m) > 0) == (s0 > 0) { lo = m } else { hi = m } }
  let xg = ((lo + hi) / 2 * 100).rounded() / 100
  print(String(format: "84 gear0 %+.3f tipX throw=0 ở %.2f m/s: %+.3f, làm tròn %+.2f throwDeg %+.2f", g0, v, (lo + hi) / 2, xg, th(xg)))
  row("gearing", xg, [v])
  for sp in [0.6, 0.8, 1.0, 1.2, 1.6, 2.0, 2.4, 3.0] as [CGFloat] {
    let n = SP.runWith(ms, tipX: 0, tipY: 0, speed: sp)
    let k = clean(n, pk) ? (sample(ms, tipY: 0, speed: sp, aim: aimOf(n), judge)["ok"] ?? 0) : -1
    print(String(format: "84 quét tip giữa %.1f m/s rate=%d throwDeg %+.2f · %@", sp, k, n.throwDeg, clean(n, pk) ? "vào" : SP.why(n)))
  }
}

/// Drill 82, NPL Gate: bi cái cách footLeft 2 diamond theo đường chéo 45°, cổng hai bi ở giữa đường, mỗi bên hở 0.35"
/// cho tâm bi cái. Chỉ bi cái: bi 1 đỗ xa ở đầu bàn. Mỗi tipX đánh ba kiểu ngắm: tâm lỗ (không bù), bù BHE (cơ xoay đúng
/// bằng squirt về phía phê, tức cầu tay ở đúng NPL của engine), và bù nửa chừng. Rate là số mẫu qua cổng vào lỗ.
func drill82() {
  let P = SP.pockets["footLeft"]!, u = CGPoint(x: sqrt(0.5), y: sqrt(0.5)), n = CGPoint(x: -u.y, y: u.x), gap: CGFloat = 0.35
  let cue = CGPoint(x: P.x + u.x * 25, y: P.y + u.y * 25), G = CGPoint(x: cue.x - u.x * 12.5, y: cue.y - u.y * 12.5)
  let off = 2.25 + gap, a = CGPoint(x: G.x + n.x * off, y: G.y + n.y * off), b = CGPoint(x: G.x - n.x * off, y: G.y - n.y * off)
  let ms = SP.Setup(c: cue, o: CGPoint(x: 25, y: 98), pocket: "headLeft", others: [SP.Obstacle(n: 2, p: a), SP.Obstacle(n: 3, p: b)], ball: 1)
  print(String(format: "82 thế: bi cái %@, cổng bi 2 %@ bi 3 %@, zone sau cổng %@", norm(cue), norm(a), norm(b),
               norm(CGPoint(x: G.x - u.x * 5, y: G.y - u.y * 5))))
  let aim0 = atan2(P.y - cue.y, P.x - cue.x)
  // `runWith` chỉ thả bi khác vào sau khi bi cái chạm bi mục tiêu, đường `pre` đi xuyên qua cổng, nên chạm cổng xét bằng
  // khoảng cách tâm trên `pre.pts`.
  let through = { (r: SP.Run) -> String in
    if r.pre.pts.contains(where: { dist($0, a) < 2.25 }) { return "bi 2" }
    if r.pre.pts.contains(where: { dist($0, b) < 2.25 }) { return "bi 3" }
    return r.pre.pocket == "footLeft" ? "ok" : "trượt lỗ"
  }
  for x in [0, -0.5, 0.5] as [CGFloat] {
    for v in [2.0, 2.5] as [CGFloat] {
      let nom = SP.runWith(ms, tipX: x, tipY: 0, speed: v, aim: aim0)
      let row = [("tâm", CGFloat(0)), ("bù nửa", 0.5), ("bù BHE", 1)].map { (name, k) -> String in
        let aim = aim0 + k * nom.squirtDeg * .pi / 180
        let s = sample(ms, tipX: x, tipY: 0, speed: v, aim: aim, through)
        let lat = (dist(SP.runWith(ms, tipX: x, tipY: 0, speed: v, aim: aim).pre.pts.min { abs(dist($0, cue) - 12.5) < abs(dist($1, cue) - 12.5) }!, G))
        return String(format: "%@: danh nghĩa %@ lệch ở cổng %.2f\" rate=%d/45 (%@)", name, through(SP.runWith(ms, tipX: x, tipY: 0, speed: v, aim: aim)),
                      lat, s["ok"] ?? 0, s.filter { $0.key != "ok" }.map { "\($0.key) \($0.value)" }.sorted().joined(separator: ", "))
      }
      print(String(format: "82 tipX %+.2f %.1f m/s squirtDeg %+.2f · ", x, v, nom.squirtDeg) + row.joined(separator: " · "))
    }
  }
}

/// Drill 86, Outside Draw / Inside Follow: thế cắt 30° của drill 84 (bi cái cách ghost 2 diamond, tipX dương là phê
/// ngoài). Quét hai họ cú: kéo + phê ngoài và theo + phê trong, chỉ giữ cú danh nghĩa vào sạch, dừng cách lỗ gần nhất quá 8".
/// Lấy các cặp có chỗ dừng gần nhau nhất, zone là trung điểm bán kính ½ diamond (6.25"), rate mỗi cú là số mẫu vào sạch và dừng trong zone.
func drill86() {
  let pk = "footLeft", one = inch(0.3, 0.3), P = SP.pockets[pk]!
  let g = SP.ghost(one, P).g, back = CGPoint(x: g.x - one.x, y: g.y - one.y)
  let k = 30 * CGFloat.pi / 180, u = CGPoint(x: back.x / hypot(back.x, back.y), y: back.y / hypot(back.x, back.y))
  let d = CGPoint(x: u.x * cos(k) - u.y * sin(k), y: u.x * sin(k) + u.y * cos(k))
  let cue = CGPoint(x: g.x + d.x * 25, y: g.y + d.y * 25)
  let ms = setup(cue, Shot(ball: 1, pocket: pk, tipY: 0, speed: 0, zone: nil), [1: one])
  print(String(format: "86 thế: bi cái %@ cắt %.0f°", norm(cue), cutDeg(cue, one, P)))
  typealias C = (x: CGFloat, y: CGFloat, v: CGFloat, nom: SP.Run)
  func family(_ xs: [CGFloat], _ ys: [CGFloat]) -> [C] {
    var out = [C]()
    for x in xs { for y in ys { for v in grid(1.2, 3.2, 0.1) {
      let n = SP.runWith(ms, tipX: x, tipY: y, speed: v)
      if clean(n, pk) && nearestPocket(n.stop) > 8 { out.append((x, y, v, n)) }
    } } }
    return out
  }
  let draw = family([0.2, 0.3, 0.4], [-0.25, -0.35, -0.45])
  let follow = family([-0.2, -0.3, -0.4], [0.25, 0.35, 0.45])
  var pairs = [(a: C, b: C, gap: CGFloat)]()
  for a in draw { for b in follow { pairs.append((a, b, dist(a.nom.stop, b.nom.stop))) } }
  pairs.sort { $0.gap < $1.gap }
  var seen = [String](), best: (a: C, b: C, z: CGPoint, ka: Int, kb: Int)?
  for p in pairs {
    let key = String(format: "%.0f,%.0f", (p.a.nom.stop.x + p.b.nom.stop.x) / 4, (p.a.nom.stop.y + p.b.nom.stop.y) / 4)
    if seen.contains(key) { continue }
    seen.append(key)
    if seen.count > 25 { break }
    let z = CGPoint(x: (p.a.nom.stop.x + p.b.nom.stop.x) / 2, y: (p.a.nom.stop.y + p.b.nom.stop.y) / 2)
    let judge = { (r: SP.Run) in clean(r, pk) && dist(r.stop, z) <= 6.25 ? "ok" : "miss" }
    let ka = sample(ms, tipX: p.a.x, tipY: p.a.y, speed: p.a.v, aim: aimOf(p.a.nom), judge)["ok"] ?? 0
    let kb = sample(ms, tipX: p.b.x, tipY: p.b.y, speed: p.b.v, aim: aimOf(p.b.nom), judge)["ok"] ?? 0
    print(String(format: "86 cặp gap %.1f\" zone %@: kéo tip(%+.2f,%+.2f) %.1f m/s rate %d · theo tip(%+.2f,%+.2f) %.1f m/s rate %d",
                 p.gap, norm(z), p.a.x, p.a.y, p.a.v, ka, p.b.x, p.b.y, p.b.v, kb))
    if min(ka, kb) > min(best?.ka ?? -1, best?.kb ?? -1) { best = (p.a, p.b, z, ka, kb) }
  }
  guard let b = best else { print("86: không cặp nào"); exit(1) }
  for (name, c, kk) in [("Outside draw", b.a, b.ka), ("Inside follow", b.b, b.kb)] {
    print(String(format: "86 %@ tip(%+.2f,%+.2f) %.2f m/s rate=%d/45 squirtDeg %+.2f throwDeg %+.2f dừng %@ cách zone %.1f\" · zone %@ cách lỗ gần nhất %.1f\"",
                 name, c.x, c.y, c.v, kk, c.nom.squirtDeg, c.nom.throwDeg, norm(c.nom.stop), dist(c.nom.stop, b.z), norm(b.z), nearestPocket(b.z)))
  }
}


/// Drill 85, 1 Tip = 1 Diamond: chỉ bi cái, đánh vào băng dài trái rồi sang băng dài phải. Bi 1 đặt ở head rail, ngoài
/// đường đi, để `runWith(aim:)` chạy hết đường bi cái trong `pre`. Mỗi tip tìm lực để bi cái dừng sát băng phải (trong
/// 3" quanh chỗ chạm), rate là số mẫu dừng trong ½ diamond quanh đó. In chỗ chạm (diamond tính từ foot rail) và độ dịch
/// so với tip giữa.
func drill85() {
  let cue = CGPoint(x: 40, y: 87.5), park = CGPoint(x: 25, y: 98), far: CGFloat = 50 - 1.125
  let ms = SP.Setup(c: cue, o: park, pocket: "headLeft", others: [], ball: 1)
  func farHit(_ r: SP.Run) -> CGPoint? {
    var left = false
    for p in r.pre.pts { if p.x < 1.2 { left = true }; if left && p.x > far - 0.05 { return p } }
    return nil
  }
  for y in [66, 70, 74, 78] as [CGFloat] {
    let aim = atan2(y - cue.y, 1.125 - cue.x)
    print(String(format: "85 ngắm băng trái y %.0f\": tip giữa 2.0 m/s chạm băng phải %@", y, farHit(SP.runWith(ms, tipX: 0, tipY: 0, speed: 2, aim: aim)).map { norm($0) } ?? "-"))
  }
  let aim = atan2(78 - cue.y, 1.125 - cue.x)
  for v in [1.6, 2.0, 2.4] as [CGFloat] {
    let row = ([-0.44, -0.33, -0.22, -0.11, 0, 0.11, 0.22, 0.33, 0.44] as [CGFloat]).map { x -> String in
      let n = SP.runWith(ms, tipX: x, tipY: 0, speed: v, aim: aim)
      return farHit(n).map { String(format: "%+.2f:%.2f", x, $0.y / 12.5) } ?? String(format: "%+.2f:-", x)
    }
    print(String(format: "85 quét %.1f m/s, diamond chạm băng phải: ", v) + row.joined(separator: " "))
  }
  var ref: CGFloat?
  for x in [0, 0.22, 0.44] as [CGFloat] {
    var best: (v: CGFloat, k: Int, stop: CGPoint, h: CGPoint)?
    for v in grid(1.2, 3.2, 0.05) {
      let nom = SP.runWith(ms, tipX: x, tipY: 0, speed: v, aim: aim)
      guard nom.pre.hit == nil, nom.pre.pocket == nil, let h = farHit(nom), dist(nom.pre.stop, h) <= 3 else { continue }
      let k = sample(ms, tipX: x, tipY: 0, speed: v, aim: aim) { r in r.pre.hit == nil && r.pre.pocket == nil && dist(r.pre.stop, h) <= 6.25 ? "ok" : "out" }["ok"] ?? 0
      if k > (best?.k ?? -1) { best = (v, k, nom.pre.stop, h) }
    }
    guard let b = best else { print(String(format: "85 tipX %+.2f: không lực nào dừng sát băng phải", x)); continue }
    if x == 0 { ref = b.h.y }
    print(String(format: "85 tipX %+.2f lực %@ rate=%d/45 chạm băng phải %@ (%.2f diamond từ foot) dịch %+.2f diamond · dừng %@",
                 x, num(b.v), b.k, norm(b.h), b.h.y / 12.5, ((ref ?? b.h.y) - b.h.y) / 12.5, norm(b.stop)))
  }
}

/// Drill 131, Short Straight-In Left/Right: bi 1 cách góc chân 28", bi cái thẳng sau nó 1 diamond (12.5"), gương hai phía.
/// Toạ độ báo cáo (bi cái 0.25, 0.50) cắt 27° nên dời bi cái lên đúng đường bi 1 tới lỗ. Tip giữa, lực soft tới medium.
func drill131() {
  for (side, pk, one) in [("Left", "footLeft", inch(0.25, 0.25)), ("Right", "footRight", inch(0.75, 0.25))] {
    let P = SP.pockets[pk]!, u = CGPoint(x: (one.x - P.x) / dist(one, P), y: (one.y - P.y) / dist(one, P))
    let cue = CGPoint(x: one.x + u.x * 12.5, y: one.y + u.y * 12.5)
    placed("131 \(side)", ball: 1, pocket: pk, cue: cue, left: [1: one], tips: [0, -0.1, -0.2], base: 0, speeds: grid(0.8, 2.4, 0.02)) { t, v, nom, g in
      String(format: "Straight in from one diamond. %@ at %@ m/s rolls the cue ball %.0f\" past contact and stops it %.0f\" short of the pocket.",
             tipWord(t), num(v), dist(nom.stop, g), nearestPocket(nom.stop))
    }
  }
}

// MARK: drill 132–138, hạng H

/// Bi cái lùi `back` inch sau ghost ball, đường cơ lệch `deg` độ khỏi đường bi tới lỗ, `side` ±1 chọn phía.
func cutCue(_ o: CGPoint, _ pk: String, deg: CGFloat, back: CGFloat, side: CGFloat) -> CGPoint {
  let P = SP.pockets[pk]!, g = SP.ghost(o, P).g, a = atan2(o.y - P.y, o.x - P.x) + side * deg * .pi / 180
  return CGPoint(x: g.x + cos(a) * back, y: g.y + sin(a) * back)
}
/// Số lần bi cái chạm băng sau va chạm: mỗi lần tâm bi vào dải sát băng tính một lần.
func railHits(_ r: SP.Run) -> Int {
  let e = SP.ballRadius + 0.3
  var n = 0, on = false
  for p in r.pts {
    let at = p.x <= e || p.x >= 50 - e || p.y <= e || p.y >= 100 - e
    if at && !on { n += 1 }
    on = at
  }
  return n
}
/// Một round đặt lại bi cái có zone: mẫu đạt khi vào sạch, bi cái dừng trong zone, chạm băng không quá `rails` lần.
@discardableResult
func zoned(_ label: String, ball n: Int, pocket pk: String, cue: CGPoint, left: [Int: CGPoint], tips: [CGFloat], speeds: [CGFloat],
           zone z: (c: CGPoint, r: CGFloat), rails: Int = 0) -> (tipY: CGFloat, speed: CGFloat, rate: Int, nom: SP.Run)? {
  let ms = setup(cue, Shot(ball: n, pocket: pk, tipY: 0, speed: 0, zone: nil), left)
  let P = SP.pockets[pk]!, g = SP.ghost(left[n]!, P).g
  let ok = { (r: SP.Run) in clean(r, pk) && dist(r.stop, z.c) <= z.r && railHits(r) <= rails }
  guard let b = pick(ms, tips: tips, speeds: speeds, keep: ok, { ok($0) ? "ok" : "miss" }) else {
    print("\(label) bi \(n): không cú danh nghĩa nào vào zone"); return nil
  }
  print(String(format: "%@ bi %d→%@ cue %@ ob %@ cắt %.0f° D %.1f · tipY %+.2f speed %.2f rate=%d/45 · dừng %@ cách ghost %.1f\" băng %d %@",
               label, n, pk, norm(cue), norm(left[n]!), cutDeg(cue, left[n]!, P), dist(cue, g), b.tipY, b.speed, b.rate,
               norm(b.nom.stop), dist(b.nom.stop, g), railHits(b.nom), zs(z)))
  return b
}
/// In chỗ dừng danh nghĩa theo lực để đặt zone, không chấm gì.
func scan(_ label: String, ball n: Int, pocket pk: String, cue: CGPoint, left: [Int: CGPoint], tipY: CGFloat, speeds: [CGFloat]) {
  let ms = setup(cue, Shot(ball: n, pocket: pk, tipY: 0, speed: 0, zone: nil), left)
  for v in speeds {
    let r = SP.runWith(ms, tipX: 0, tipY: tipY, speed: v)
    print(String(format: "%@ tipY %+.2f v %.2f → %@ dừng %@ băng %d", label, tipY, v, clean(r, pk) ? "sạch" : SP.why(r), norm(r.stop), railHits(r)))
  }
}

/// Drill 132–133, cắt mỏng hai phía: bi 1 ở (12.5", 25") và gương phải, bi cái lùi 18" sau ghost ball, lệch `deg` độ.
func cutLR(_ id: String, deg: CGFloat) {
  for (side, pk, o, sg) in [("Left", "footLeft", inch(0.25, 0.25), -1), ("Right", "footRight", inch(0.75, 0.25), 1)] as [(String, String, CGPoint, CGFloat)] {
    let cue = cutCue(o, pk, deg: deg, back: 18, side: sg)
    placed("\(id) \(side)", ball: 1, pocket: pk, cue: cue, left: [1: o], tips: [-0.4, -0.2, 0], base: -0.4, speeds: grid(1, 2.6, 0.02)) { t, v, nom, g in
      String(format: "A %.0f° cut from 18\" behind the ghost ball. %@ at %@ m/s stops the cue ball %.0f\" from contact.", deg, tipWord(t), num(v), dist(nom.stop, g))
    }
  }
}
/// Drill 134–135, bi thẳng vào footLeft: follow lăn theo 6" về phía lỗ, draw kéo về 6".
func drill134() {
  let one = inch(0.25, 0.25), P = SP.pockets["footLeft"]!
  let u = CGPoint(x: (one.x - P.x) / dist(one, P), y: (one.y - P.y) / dist(one, P)), g = SP.ghost(one, P).g
  let at = { (d: CGFloat) in CGPoint(x: g.x + u.x * d, y: g.y + u.y * d) }
  zoned("134", ball: 1, pocket: "footLeft", cue: at(18), left: [1: one], tips: [0.2, 0.3, 0.4], speeds: grid(0.5, 1.4, 0.02), zone: (at(-6), 6))
  zoned("135", ball: 1, pocket: "footLeft", cue: at(12.5), left: [1: one], tips: [-0.5, -0.4, -0.6], speeds: grid(1, 2.4, 0.02), zone: (at(6), 6))
}
/// Drill 136: bi 1 ở (15", 40") thẳng vào footLeft, bi cái lùi 12.5", follow vào ba zone 6" lăn theo 4", 16", 28".
func drill136() {
  let o = inch(0.3, 0.4), P = SP.pockets["footLeft"]!
  let u = CGPoint(x: (o.x - P.x) / dist(o, P), y: (o.y - P.y) / dist(o, P)), g = SP.ghost(o, P).g
  let at = { (d: CGFloat) in CGPoint(x: g.x + u.x * d, y: g.y + u.y * d) }
  for (name, d) in [("A", 4), ("B", 16), ("C", 28)] as [(String, CGFloat)] {
    zoned("136 \(name)", ball: 1, pocket: "footLeft", cue: at(12.5), left: [1: o], tips: [0.2, 0.3, 0.4, 0.5], speeds: grid(0.5, 2.4, 0.02), zone: (at(-d), 6))
  }
}
/// Drill 138: bi 1 ở (15", 30") cắt 12° vào footLeft, bi cái lùi 25", draw về zone 8" ở (23.5", 29").
func drill138() {
  let o = inch(0.3, 0.3), c = cutCue(o, "footLeft", deg: 12, back: 25, side: 1)
  zoned("138", ball: 1, pocket: "footLeft", cue: c, left: [1: o], tips: [-0.4, -0.3, -0.5], speeds: grid(1.6, 2.6, 0.02), zone: (inch(0.47, 0.29), 8))
}
/// Drill 137: bi 1 vào footLeft, bi cái lăn vào zone, bi 2 vào footRight.
func drill137() {
  let one = inch(0.32, 0.32), two = inch(0.702, 0.111)
  for back in [12.5] as [CGFloat] {
    let c = cutCue(one, "footLeft", deg: 10, back: back, side: 1)
    guard let b = zoned("137 back \(back)", ball: 1, pocket: "footLeft", cue: c, left: [1: one, 2: two], tips: [0, 0.2, 0.4], speeds: grid(0.6, 1.8, 0.02),
                        zone: (inch(0.38, 0.23), 6)) else { continue }
    chain("137 back \(back)", cue: c, balls: [1: one, 2: two], shots: [
      Shot(ball: 1, pocket: "footLeft", tipY: b.tipY, speed: b.speed, zone: (inch(0.38, 0.23), 6)),
      Shot(ball: 2, pocket: "footRight", tipY: 0, speed: 1.2, zone: nil),
    ])
  }
}
/// Drill 139, cắt 10° vào lỗ giữa hai phía: bi 1 cách băng dài 12.5" ngang lỗ giữa, bi cái lùi 18" sau ghost ball.
func drill139() {
  for (side, pk, o, sg) in [("Left", "sideLeft", inch(0.25, 0.5), -1), ("Right", "sideRight", inch(0.75, 0.5), 1)] as [(String, String, CGPoint, CGFloat)] {
    let cue = cutCue(o, pk, deg: 10, back: 18, side: sg)
    placed("139 \(side)", ball: 1, pocket: pk, cue: cue, left: [1: o], tips: [-0.4, -0.2, 0], base: -0.4, speeds: grid(0.8, 2.6, 0.02)) { t, v, nom, g in
      String(format: "A 10° cut into the side from 18\" behind the ghost ball. %@ at %@ m/s stops the cue ball %.0f\" from contact.", tipWord(t), num(v), dist(nom.stop, g))
    }
  }
}
/// Drill 99: bi 1 thẳng vào footLeft, bi cái dừng ở ghost ball (zone 3"), từ đó bi 2 thẳng vào sideRight.
func drill099() {
  let one = inch(0.25, 0.25), two = inch(0.6932, 0.4034), P = SP.pockets["footLeft"]!, g = SP.ghost(one, P).g
  let u = CGPoint(x: (one.x - P.x) / dist(one, P), y: (one.y - P.y) / dist(one, P))
  for (back, r) in [(27.2, 3), (27.2, 4), (18, 3), (18, 4), (12.5, 3), (12.5, 4)] as [(CGFloat, CGFloat)] {
    let c = CGPoint(x: g.x + u.x * back, y: g.y + u.y * back), z = (g, r)
    guard let b = zoned("99 back \(back) r \(r)", ball: 1, pocket: "footLeft", cue: c, left: [1: one, 2: two], tips: [-0.2, -0.3, -0.4, -0.5, -0.6],
                        speeds: grid(0.8, 3, 0.02), zone: z) else { continue }
    chain("99 back \(back) r \(r)", cue: c, balls: [1: one, 2: two], shots: [
      Shot(ball: 1, pocket: "footLeft", tipY: b.tipY, speed: b.speed, zone: z),
      Shot(ball: 2, pocket: "sideRight", tipY: -0.3, speed: 1.4, zone: nil),
    ])
  }
}
func drillH() { cutLR("132", deg: 10); cutLR("133", deg: 15); drill134(); drill136(); drill137(); drill138(); drill139() }

/// Drill 04, 06, 08, 52: một cú, mỗi round một zone. Quét tip × lực cho từng zone, in số chép sang `rounds`.
func zoneRounds(_ id: String, cue: CGPoint, ob: CGPoint, pocket: String, zones: [(String, CGFloat, CGFloat, CGFloat)],
                tips: [CGFloat], speeds: [CGFloat], rails: Int = 0) {
  for (name, x, y, r) in zones {
    zoned("\(id) \(name)", ball: 1, pocket: pocket, cue: inch(cue.x, cue.y), left: [1: inch(ob.x, ob.y)], tips: tips, speeds: speeds,
          zone: (inch(x, y), r * 50), rails: rails)
  }
}
func drillZ() {
  zoneRounds("04", cue: CGPoint(x: 0.524, y: 0.7), ob: CGPoint(x: 0.3, y: 0.4), pocket: "footLeft",
             zones: [("½", 0.272, 0.362, 0.055), ("1", 0.228, 0.304, 0.055), ("1½", 0.184, 0.245, 0.055), ("2", 0.14, 0.187, 0.055)],
             tips: [0.2, 0.3, 0.4, 0.5], speeds: grid(0.5, 2.6, 0.02))
  zoneRounds("06", cue: CGPoint(x: 0.825, y: 0.516), ob: CGPoint(x: 0.4, y: 0.25), pocket: "footLeft",
             zones: [("½", 0.506, 0.316, 0.07), ("1", 0.584, 0.365, 0.06), ("1½", 0.662, 0.414, 0.05)],
             tips: [-0.3, -0.4, -0.5, -0.6], speeds: grid(1, 3.4, 0.02))
  zoneRounds("08", cue: CGPoint(x: 0.354, y: 0.459), ob: CGPoint(x: 0.3, y: 0.26), pocket: "footLeft",
             zones: [("A", 0.737, 0.257, 0.07), ("B", 0.817, 0.07, 0.07), ("C", 0.523, 0.109, 0.07)],
             tips: [-0.5, -0.3, 0], speeds: grid(0.6, 2.6, 0.02))
  // Round C là follow: chỉ quét tip trên.
  zoneRounds("08", cue: CGPoint(x: 0.354, y: 0.459), ob: CGPoint(x: 0.3, y: 0.26), pocket: "footLeft",
             zones: [("C follow", 0.523, 0.109, 0.07)], tips: [0.1, 0.2, 0.3, 0.4], speeds: grid(0.5, 2.6, 0.02))
  zoneRounds("52", cue: CGPoint(x: 0.525, y: 0.812), ob: CGPoint(x: 0.275, y: 0.875), pocket: "headLeft",
             zones: [("T1", 0.125, 0.75, 0.1), ("T2", 0.125, 0.25, 0.1), ("T3", 0.925, 0.25, 0.1), ("T4", 0.525, 0.5, 0.1), ("T5", 0.925, 0.75, 0.1)],
             tips: [-0.5, -0.3, 0, 0.2, 0.4], speeds: grid(0.6, 3.6, 0.02), rails: 3)
}

// MARK: hạng G

/// Zone đặt ở chỗ bi cái dừng sau cú danh nghĩa: quét tip × lực, mỗi cú danh nghĩa sạch có số băng trong `rails` và chỗ
/// dừng qua `want` thì lấy chỗ dừng làm tâm zone bán kính `r`, đếm mẫu vào sạch, dừng trong zone, số băng trong `rails`.
/// Trả về cú có rate cao nhất, zone làm tròn tới 0.01 toạ độ chuẩn hoá.
@discardableResult
func auto(_ label: String, ball n: Int, pocket pk: String, cue: CGPoint, left: [Int: CGPoint], tips: [CGFloat], speeds: [CGFloat],
          r: CGFloat, rails: ClosedRange<Int> = 0...0, want: (CGPoint) -> Bool = { _ in true })
          -> (tipY: CGFloat, speed: CGFloat, rate: Int, nom: SP.Run, zone: (c: CGPoint, r: CGFloat))? {
  let ms = setup(cue, Shot(ball: n, pocket: pk, tipY: 0, speed: 0, zone: nil), left)
  let P = SP.pockets[pk]!, g = SP.ghost(left[n]!, P).g
  var best: (tipY: CGFloat, speed: CGFloat, rate: Int, nom: SP.Run, zone: (c: CGPoint, r: CGFloat))?
  for t in tips { for v in speeds {
    let nom = SP.runWith(ms, tipX: 0, tipY: t, speed: v)
    guard clean(nom, pk), rails.contains(railHits(nom)), want(nom.stop) else { continue }
    let c = CGPoint(x: (nom.stop.x / 50 * 100).rounded() / 100 * 50, y: (nom.stop.y).rounded()), z = (c: c, r: r)
    let ok = { (x: SP.Run) in clean(x, pk) && dist(x.stop, z.c) <= z.r && rails.contains(railHits(x)) }
    guard ok(nom) else { continue }
    let k = sample(ms, tipY: t, speed: v, aim: aimOf(nom)) { ok($0) ? "ok" : "miss" }["ok"] ?? 0
    if k > (best?.rate ?? -1) { best = (t, v, k, nom, z) }
  } }
  guard let b = best else { print("\(label): không cú danh nghĩa nào đạt"); return nil }
  print(String(format: "%@ bi %d→%@ cue %@ ob %@ cắt %.0f° D %.1f · tipY %+.2f speed %.2f rate=%d/45 · dừng %@ cách ghost %.1f\" băng %d %@",
               label, n, pk, norm(cue), norm(left[n]!), cutDeg(cue, left[n]!, P), dist(cue, g), b.tipY, b.speed, b.rate,
               norm(b.nom.stop), dist(b.nom.stop, g), railHits(b.nom), zs(b.zone)))
  return b
}
/// Bi 2 đặt thẳng từ chỗ dừng `s` vào lỗ `pk`, cách lỗ `d` inch.
func straightFrom(_ s: CGPoint, _ pk: String, _ d: CGFloat) -> CGPoint {
  let P = SP.pockets[pk]!, l = dist(s, P)
  return CGPoint(x: P.x + (s.x - P.x) / l * d, y: P.y + (s.y - P.y) / l * d)
}
func drill142() {
  let o = inch(0.3, 0.3)
  for deg in [15, 20] as [CGFloat] {
    auto("142 \(Int(deg))°", ball: 1, pocket: "footLeft", cue: cutCue(o, "footLeft", deg: deg, back: 18, side: 1), left: [1: o],
         tips: [0.2], speeds: grid(0.7, 2, 0.02), r: 6)
  }
}
func drill145() {
  let o = inch(0.3, 0.15)
  auto("145", ball: 1, pocket: "footLeft", cue: cutCue(o, "footLeft", deg: 20, back: 15, side: -1), left: [1: o],
       tips: [-0.2, 0, 0.2], speeds: grid(0.8, 2.2, 0.02), r: 6, rails: 1...1, want: { dist($0, o) < 25 })
}
func drill146() {
  let o = inch(0.3, 0.15)
  auto("146", ball: 1, pocket: "footLeft", cue: cutCue(o, "footLeft", deg: 20, back: 15, side: 1), left: [1: o],
       tips: [0, 0.2, 0.3, 0.4], speeds: grid(1.2, 3, 0.02), r: 10, rails: 1...1, want: { $0.y > 50 })
}
func drill147() {
  // Bi 1 cách băng dài trái 0.4" (tâm x = 1.525"), lỗ footLeft dọc băng, bi cái lùi 20" lệch 20°.
  let o = CGPoint(x: 1.525, y: 30), c = CGPoint(x: o.x + sin(20 * .pi / 180) * 20, y: o.y + cos(20 * .pi / 180) * 20)
  auto("147", ball: 1, pocket: "footLeft", cue: c, left: [1: o], tips: [-0.2, 0, 0.2], speeds: grid(0.6, 2, 0.02), r: 6, rails: 0...1)
}
func drill148() {
  let o = inch(0.2, 0.15)
  auto("148", ball: 1, pocket: "footLeft", cue: cutCue(o, "footLeft", deg: 40, back: 12, side: 1), left: [1: o],
       tips: [-0.4, -0.2, 0], speeds: grid(0.3, 1.6, 0.02), r: 8, rails: 0...1)
}
func drill149() {
  let o = inch(0.6, 0.12)
  auto("149", ball: 1, pocket: "footLeft", cue: cutCue(o, "footLeft", deg: 25, back: 13, side: -1), left: [1: o],
       tips: [-0.2, 0, 0.2], speeds: grid(0.6, 2, 0.02), r: 6, rails: 0...1)
}
func route(_ label: String, cue: CGPoint, one: CGPoint, pk1: String, pk2: String, d2: CGFloat, tips: [CGFloat], speeds: [CGFloat], r: CGFloat) {
  guard let b = auto(label, ball: 1, pocket: pk1, cue: cue, left: [1: one], tips: tips, speeds: speeds, r: r) else { return }
  let P = SP.pockets[pk2]!, l = dist(b.zone.c, P), two = straightFrom(b.zone.c, pk2, l - d2)
  print("   bi 2 \(norm(two))")
  chain(label, cue: cue, balls: [1: one, 2: two], shots: [
    Shot(ball: 1, pocket: pk1, tipY: b.tipY, speed: b.speed, zone: b.zone),
    Shot(ball: 2, pocket: pk2, tipY: 0, speed: 1.2, zone: nil),
  ])
}
func drill150() {
  let o = inch(0.25, 0.5)
  route("150", cue: cutCue(o, "sideLeft", deg: 15, back: 18, side: 1), one: o, pk1: "sideLeft", pk2: "sideRight", d2: 16,
        tips: [-0.3, 0, 0.2], speeds: grid(0.8, 2, 0.02), r: 6)
}
func drill153() {
  let o = inch(0.3, 0.3)
  route("153", cue: cutCue(o, "footLeft", deg: 10, back: 15, side: 1), one: o, pk1: "footLeft", pk2: "footRight", d2: 20,
        tips: [-0.3, -0.4, -0.5], speeds: grid(1.2, 2.6, 0.02), r: 6)
}
func drillG() { drill142(); drill145(); drill146(); drill147(); drill148(); drill149(); drill150(); drill153() }

// MARK: drill 37, 38, 39, 41, hạng G cũ: chỉ chấm bi vào, mỗi round một cú đặt lại bi cái.

/// Drill 37, Long Diagonal Straight-In: bi cái góc headRight, bi 1 giữa đường chéo, thẳng footLeft. Bốn round theo tip của
/// bài (stop, stop, follow, draw), lực bậc firm.
func drill37() {
  let lo = grid(1.2, 4.4, 0.02)
  let rows: [(String, [CGFloat], CGFloat?, CGFloat?, [CGFloat])] = [
    ("Stop", [-0.1, -0.2, -0.3, -0.4, -0.5], 1.125, nil, lo), ("Stop", [-0.1, -0.2, -0.3, -0.4, -0.5], 1.125, nil, lo),
    ("Follow", [0.4], nil, nil, lo), ("Draw", [-0.4, -0.5, -0.6], nil, 12, grid(2.4, 6.4, 0.05)),
  ]
  for (name, tips, stop, back, speeds) in rows {
    placed("37 \(name)", ball: 1, pocket: "footLeft", cue: inch(0.9375, 0.9375), left: [1: inch(0.4688, 0.4688)], tips: tips, base: -0.1,
           speeds: speeds, stop: stop, back: back) { t, v, nom, g in
      String(format: "Straight in down the diagonal. %@ at %@ m/s sends the cue ball %.0f\" from contact and stops it %.0f\" from the nearest pocket.",
             tipWord(t), num(v), dist(nom.stop, g), nearestPocket(nom.stop))
    }
  }
}

/// Drill 38 và 41: bi 1 sát foot rail cắt vào footLeft, bi cái lên dần trên một đường dọc. Tip giữa, lực bậc medium.
func cutLadder(_ id: String, x: CGFloat, one: CGPoint) {
  for (i, y) in [0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875].enumerated() {
    let cue = inch(x, CGFloat(y))
    placed("\(id) Spot \(i + 1)", ball: 1, pocket: "footLeft", cue: cue, left: [1: one], tips: [0], base: 0, speeds: grid(0.6, 2.4, 0.02)) { t, v, nom, g in
      String(format: "%.0f° cut along the foot rail. %@ at %@ m/s, the cue ball stops %.0f\" from the nearest pocket.",
             cutDeg(cue, one, SP.pockets["footLeft"]!), tipWord(t), num(v), nearestPocket(nom.stop))
    }
  }
}
func drill38() { cutLadder("38", x: 0.75, one: inch(0.25, 0.0375)) }
func drill41() { cutLadder("41", x: 0.5, one: inch(0.2, 0.02125)) }

/// Drill 39, BU F6: mười cú, mỗi cú một bi 1 và một lỗ, bi cái ở hai chỗ. Tip giữa, lực bậc medium.
func drill39() {
  let L = inch(0.25, 0.75), R = inch(0.75, 0.75)
  let rows: [(CGPoint, CGPoint, String)] = [
    (L, inch(0.25, 0.625), "sideLeft"), (L, inch(0.25, 0.625), "footLeft"), (L, inch(0.5, 0.25), "footRight"),
    (L, inch(0.5, 0.5), "sideRight"), (L, inch(0.5, 0.5), "footRight"), (R, inch(0.75, 0.625), "sideRight"),
    (R, inch(0.75, 0.625), "footRight"), (R, inch(0.5, 0.25), "footLeft"), (R, inch(0.5, 0.5), "sideLeft"), (R, inch(0.5, 0.5), "footLeft"),
  ]
  for (i, (cue, one, pk)) in rows.enumerated() {
    placed("39 Shot \(i + 1)", ball: 1, pocket: pk, cue: cue, left: [1: one], tips: [0], base: 0, speeds: grid(0.6, 2.4, 0.02)) { t, v, nom, g in
      String(format: "%.0f° cut into the %@. %@ at %@ m/s, the cue ball stops %.0f\" from the nearest pocket.",
             cutDeg(cue, one, SP.pockets[pk]!), pk.hasPrefix("side") ? "side" : "corner", tipWord(t), num(v), nearestPocket(nom.stop))
    }
  }
}

if ProcessInfo.processInfo.environment["ONLY"] == "G0" { drill37(); drill38(); drill39(); drill41(); exit(0) }
if let k = ProcessInfo.processInfo.environment["ONLY"], k.hasPrefix("G") {
  switch k { case "G142": drill142(); case "G145": drill145(); case "G146": drill146(); case "G147": drill147()
  case "G148": drill148(); case "G149": drill149(); case "G150": drill150(); case "G153": drill153(); default: drillG() }
  exit(0)
}
if ProcessInfo.processInfo.environment["ONLY"] == "Z" { drillZ(); exit(0) }
if ProcessInfo.processInfo.environment["ONLY"] == "139" { drill139(); exit(0) }
if ProcessInfo.processInfo.environment["ONLY"] == "99" { drill099(); exit(0) }
if ProcessInfo.processInfo.environment["ONLY"] == "H" { drillH(); exit(0) }
drill12()
drill15()
drill23()
// Tắt sau khi sửa băng: lực 2.0–3.4 m/s đều không đưa bi cái về zone round 2 của video (2.5–3.0 còn rơi lỗ giữa trái).
// drill31Trial()
drill24()
drill25()
drill30()
drill27()
drill28()
drill34()
drill35()
drill46()
drill49()
tipXTrial()
drill26()
drill48()
drill83()
drill84()
drill85()
drill86()
drill82()
drill109()
drill110()
drill113()
drill120()
drill121()
drill131()
