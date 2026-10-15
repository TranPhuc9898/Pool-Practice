import CoreGraphics
import Foundation

/// Chạy bàn kiểu ball in hand (D27, bài Rail Cut của BU): mỗi cú tự đặt bi cái, chọn bi và lỗ tuỳ ý.
/// Chỉ dùng `ShotPhysics`, không SwiftUI, để harness `scripts/rack-harness` biên dịch được ngoài app.
enum RackInHandSolver {
  struct Pick {
    let ball: Int
    let pocket: String
    let cue: CGPoint
    let tipX, tipY, speed: CGFloat
    let setup: ShotPhysics.Setup
  }

  static let pocketOrder = ["footLeft", "footRight", "sideLeft", "sideRight", "headLeft", "headRight"]

  /// Lưới chỗ đặt bi cái: khoảng cách tới ghost (inch) × độ lệch hướng đánh so với đường ghost→lỗ (độ).
  static let distances: [CGFloat] = [9, 6, 12, 18]
  static let angles: [CGFloat] = [0, 10, -10, 20, -20, 30, -30]
  static let strokes: [(tipY: CGFloat, speed: CGFloat)] = [(0, 2), (0, 1.5), (0, 3), (-0.3, 2), (0.3, 2)]

  /// Cú hợp lệ D27 chỉ làm bi mục tiêu rời bàn, nên nhìn trước một tầng không cần mô phỏng: bỏ bi n rồi đếm
  /// số bi còn đường tới ít nhất một lỗ. Bi ngoài cùng hàng băng mở đường cho bi trong nên được ăn trước.
  static func best(_ balls: [Int: CGPoint]) -> Pick? {
    let ids = balls.keys.filter { $0 != 0 }
    let order = ids.map { n -> (n: Int, open: Int) in
      var rest = balls
      rest[n] = nil
      return (n, openPockets(rest).count)
    }.sorted { $0.open != $1.open ? $0.open > $1.open : $0.n < $1.n }
    let open = openPockets(balls)
    for (n, _) in order {
      for pocket in open[n] ?? [] {
        if let p = place(n, pocket, balls) { return p }
      }
    }
    return nil
  }

  /// Cú mẫu của drill, đúng như hình tĩnh: bi cái tại chỗ, bi, lỗ, tip, lực của drill. Không lọc D27, để harness bắt
  /// được dữ liệu drill sai thay vì app lặng lẽ đánh cú khác.
  static func template(_ balls: [Int: CGPoint], ball: Int, pocket: String, tipX: CGFloat, tipY: CGFloat, speed: CGFloat) -> Pick? {
    guard let c = balls[0], let o = balls[ball] else { return nil }
    let others = balls.filter { $0.key != 0 && $0.key != ball }.map { ShotPhysics.Obstacle(n: $0.key, p: $0.value) }
    let ms = ShotPhysics.Setup(c: c, o: o, pocket: pocket, others: others, ball: ball)
    return Pick(ball: ball, pocket: pocket, cue: c, tipX: tipX, tipY: tipY, speed: speed, setup: ms)
  }

  /// Bi → các lỗ mà đường bi mục tiêu tới lỗ còn trống, chưa xét bi cái.
  static func openPockets(_ balls: [Int: CGPoint]) -> [Int: [String]] {
    var noCue = balls
    noCue[0] = nil
    var out: [Int: [String]] = [:]
    for n in noCue.keys {
      let ps = pocketOrder.filter { (ShotPhysics.shotOf(ball: n, pocket: $0, balls: noCue)?.level ?? .bad) != .bad }
      if !ps.isEmpty { out[n] = ps }
    }
    return out
  }

  /// Quét lưới chỗ đặt bi cái, lấy chỗ đầu tiên mà mô phỏng ra cú hợp lệ D27.
  static func place(_ n: Int, _ pocket: String, _ balls: [Int: CGPoint]) -> Pick? {
    guard let o = balls[n], let P = ShotPhysics.target(pocket) else { return nil }
    let R = ShotPhysics.ballRadius
    let (G, d) = ShotPhysics.ghost(o, P)
    let others = balls.filter { $0.key != 0 && $0.key != n }.map { ShotPhysics.Obstacle(n: $0.key, p: $0.value) }
    for dist in distances {
      for deg in angles {
        let a = deg * .pi / 180
        let u = CGPoint(x: d.x * cos(a) - d.y * sin(a), y: d.x * sin(a) + d.y * cos(a))
        let c = CGPoint(x: G.x - u.x * dist, y: G.y - u.y * dist)
        guard c.x >= R, c.x <= ShotPhysics.width - R, c.y >= R, c.y <= ShotPhysics.length - R,
              !balls.contains(where: { $0.key != 0 && hypot($0.value.x - c.x, $0.value.y - c.y) < ShotPhysics.ballDiameter }) else { continue }
        var placed = balls
        placed[0] = c
        guard let v = ShotPhysics.shotOf(ball: n, pocket: pocket, balls: placed), v.level != .bad else { continue }
        let ms = ShotPhysics.Setup(c: c, o: o, pocket: pocket, others: others, ball: n)
        for s in strokes where legal(ShotPhysics.runWith(ms, tipX: 0, tipY: s.tipY, speed: s.speed), ball: n, pocket: pocket) {
          return Pick(ball: n, pocket: pocket, cue: c, tipX: 0, tipY: s.tipY, speed: s.speed, setup: ms)
        }
      }
    }
    return nil
  }

  /// Luật D27: bi mục tiêu vào đúng lỗ, bi cái không rơi, không bi nào khác bị chạm (gồm cả combo).
  /// Không xét `r.moved` rỗng: nó chứa cả bi đứng yên, bi bị chạm là bi có va chạm hoặc rơi lỗ.
  static func legal(_ r: ShotPhysics.Run, ball: Int, pocket: String) -> Bool {
    r.short == nil && r.scratch == nil && r.ob.pocket == pocket && (r.hit ?? ball) == ball && (r.ob.hit ?? 0) == 0
      && !r.moved.values.contains { $0.hit != nil || $0.pocket != nil }
  }
}
