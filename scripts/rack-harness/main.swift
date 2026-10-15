import CoreGraphics
import Foundation

// Chạy bàn ball in hand cho drill 18/19/20 bằng đúng ShotPhysics và RackInHandSolver của app, không cần simulator.
// Toạ độ chép từ src/pool-engine/drills/18…20-*.ts, đổi sang inch (x·50, y·100).

struct Drill { let id: Int; let cue: CGPoint; let balls: [(Int, CGFloat, CGFloat)] }

let drills = [
  Drill(id: 18, cue: CGPoint(x: 0.25, y: 0.42), balls: [
    (1, 0.0225, 0.25), (2, 0.0225, 0.75), (3, 0.9775, 0.25), (4, 0.9775, 0.75),
    (5, 0.5, 0.0113), (6, 0.5, 0.9887), (7, 0.5, 0.5),
  ]),
  Drill(id: 19, cue: CGPoint(x: 0.25, y: 0.42), balls: [
    (1, 0.0225, 0.25), (2, 0.0225, 0.75), (3, 0.9775, 0.25), (4, 0.9775, 0.75),
    (5, 0.25, 0.0113), (6, 0.5, 0.0113), (7, 0.75, 0.0113),
    (8, 0.25, 0.9887), (9, 0.5, 0.9887), (10, 0.75, 0.9887), (11, 0.5, 0.5),
  ]),
  Drill(id: 20, cue: CGPoint(x: 0.25, y: 0.3), balls: [
    (2, 0.0225, 0.125), (1, 0.0225, 0.25), (3, 0.0225, 0.75), (4, 0.0225, 0.875),
    (5, 0.9775, 0.25), (6, 0.9775, 0.125), (7, 0.9775, 0.75), (8, 0.9775, 0.875),
    (9, 0.25, 0.0113), (10, 0.5, 0.0113), (11, 0.75, 0.0113),
    (12, 0.25, 0.9887), (13, 0.5, 0.9887), (14, 0.75, 0.9887), (15, 0.5, 0.5),
  ]),
]

func inch(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: x * 50, y: y * 100) }
func f(_ p: CGPoint) -> String { String(format: "(%.1f,%.1f)", p.x, p.y) }

for d in drills {
  var cur: [Int: CGPoint] = [0: inch(d.cue.x, d.cue.y)]
  for (n, x, y) in d.balls { cur[n] = inch(x, y) }
  let total = d.balls.count
  var potted = 0, touched = 0, shot = 0
  while cur.keys.contains(where: { $0 != 0 }) {
    shot += 1
    let t0 = Date()
    // Cú 1 là cú mẫu của drill: bi đầu danh sách vào footLeft, tip (0,0), lực medium 1.8 m/s như stageState.
    let pick = shot == 1
      ? RackInHandSolver.template(cur, ball: d.balls[0].0, pocket: "footLeft", tipX: 0, tipY: 0, speed: 1.8)
      : RackInHandSolver.best(cur)
    guard let p = pick else {
      print("\(d.id) #\(shot) no shot")
      for n in cur.keys.filter({ $0 != 0 }).sorted() {
        // Không có bi cái thì shotOf bỏ qua góc cắt, chỉ còn lý do của bi và lỗ.
        var placed = cur
        placed[0] = nil
        let whys = RackInHandSolver.pocketOrder.map { ShotPhysics.shotOf(ball: n, pocket: $0, balls: placed)?.why ?? "-" }
        print("   ball \(n): \(whys.joined(separator: " | "))")
      }
      break
    }
    let ms = Date().timeIntervalSince(t0) * 1000
    let r = ShotPhysics.runWith(p.setup, tipX: p.tipX, tipY: p.tipY, speed: p.speed)
    let ok = r.ob.pocket != nil && r.scratch == nil
    // `r.moved` có cả bi đứng yên (Trace.moved chỉ là pts.count > 1), nên bi bị chạm là bi có va chạm hoặc rơi lỗ.
    let hits = r.moved.values.filter { $0.hit != nil || $0.pocket != nil }.count
    touched += hits == 0 ? 0 : 1
    if shot == 1 {
      let legal = RackInHandSolver.legal(r, ball: p.ball, pocket: p.pocket)
      print("\(d.id) shot1 \(legal ? "ok" : "bad") moved \(hits)\(legal ? "" : " (\(ShotPhysics.why(r)))")")
    }
    print(String(format: "%d #%d b%d→%@ cue %@ ms %.0f moved %d %@%@", d.id, shot, p.ball, p.pocket, f(p.cue), ms, hits,
                 ok ? "in" : "miss", ok ? "" : " (\(ShotPhysics.why(r)))"))
    var after = cur
    after[0] = r.scratch == nil ? r.stop : nil
    after[p.ball] = r.ob.pocket == nil ? r.ob.stop : nil
    for (m, t) in r.moved { after[m] = t.pocket == nil ? t.stop : nil }
    potted += cur.keys.filter { $0 != 0 && after[$0] == nil }.count
    cur = after
    guard ok else { break }
    if cur[0] == nil { cur[0] = CGPoint(x: 25, y: 50) }
  }
  print("\(d.id): \(potted)/\(total) moved \(touched)")
}
