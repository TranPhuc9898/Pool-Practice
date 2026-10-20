import CoreGraphics
import Foundation

/// Luật Rail Cut của BU (Exam II S2) cho harness `scripts/rack-harness`: harness dò route rồi chép `shots` vào data drill
/// 18–20, app chạy bằng `FixedShot`. Chỉ dùng `ShotPhysics`, không SwiftUI, để harness biên dịch được ngoài app.
enum RackInHandSolver {
  static let pocketOrder = ["footLeft", "footRight", "sideLeft", "sideRight", "headLeft", "headRight"]

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

  /// Cú hợp lệ: bi mục tiêu vào đúng lỗ, bi cái không rơi, không bi nào khác bị chạm (gồm cả combo).
  /// Không xét `r.moved` rỗng: nó chứa cả bi đứng yên, bi bị chạm là bi có va chạm hoặc rơi lỗ.
  static func legal(_ r: ShotPhysics.Run, ball: Int, pocket: String) -> Bool {
    r.short == nil && r.scratch == nil && r.ob.pocket == pocket && (r.hit ?? ball) == ball && (r.ob.hit ?? 0) == 0
      && !r.moved.values.contains { $0.hit != nil || $0.pocket != nil }
  }
}
