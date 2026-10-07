import ExpoModulesCore
import SwiftUI

/// State editor JS gửi xuống. Toạ độ bi chuẩn hoá như `DrillRecord`.
/// `rev` chỉ JS tăng (mở bài, undo, redo). Commit từ Swift không đổi `rev`, nên prop dội về không đè lên bàn.
struct EditorStateRecord: Record {
  @Field var rev: Int = 0
  @Field var balls: [BallRecord] = []
  /// -1 là chưa có đường vào lỗ.
  @Field var aimBall: Int = -1
  @Field var aimPocket: String = ""
  /// Điểm đặt đầu cơ theo bán kính bi, dương là cao (follow).
  @Field var tip: Double = 0
  /// Tốc độ bi cái lúc rời đầu cơ, m/s.
  @Field var speed: Double = 1.8
}

/// State sống của editor, tính bằng inch (x 0…50, y 0…100, foot rail ở y = 0).
/// Swift là nguồn sự thật trong lúc tay đang chạm. JS chỉ nhận bản chụp lúc nhấc tay.
final class PoolEditorModel: ObservableObject {
  @Published var balls: [Int: CGPoint] = [:]
  @Published var aimBall: Int?
  @Published var aimPocket: String?
  @Published var tip: CGFloat = 0
  @Published var speed: CGFloat = 1.8
  /// Bi đang kéo, vẽ trên cùng.
  @Published var dragging: Int?
  /// Bi mục tiêu đang chờ chọn lỗ.
  @Published var picking: Int?
  /// Cú đang chạy thử sau khi bấm Đánh. Chạm bi hay đổi cú là dừng.
  @Published var replay: ShotReplay?
  /// Tắt thì bàn chỉ còn đường ngắm, ghost và điểm chạm.
  @Published var showPaths = true
  private var rev = Int.min

  static let width = PoolTableSpec.playWidth
  static let length = PoolTableSpec.playLength

  func adopt(_ s: EditorStateRecord) {
    guard s.rev != rev else { return }
    rev = s.rev
    var next: [Int: CGPoint] = [:]
    for b in s.balls { next[b.number] = CGPoint(x: b.x * Self.width, y: b.y * Self.length) }
    balls = next
    aimBall = s.aimBall >= 0 ? s.aimBall : nil
    aimPocket = s.aimPocket.isEmpty ? nil : s.aimPocket
    tip = s.tip
    speed = s.speed
  }

  /// Thứ tự vẽ: bi cái dưới cùng, bi đang kéo trên cùng.
  var order: [Int] {
    balls.keys.sorted { a, b in
      if a == dragging { return false }
      if b == dragging { return true }
      return a < b
    }
  }

  /// Bản chụp gửi JS. Toạ độ chuẩn hoá, ba số lẻ như dev mode của `PoolTableView`.
  func snapshot() -> [String: Any] {
    let r = { (v: CGFloat) in Double((v * 1000).rounded() / 1000) }
    return [
      "balls": balls.keys.sorted().map { n in
        ["number": n, "x": r(balls[n]!.x / Self.width), "y": r(balls[n]!.y / Self.length)]
      },
      "aimBall": aimBall ?? -1,
      "aimPocket": aimPocket ?? "",
      "tip": Double((tip * 100).rounded() / 100),
      "speed": Double((speed * 10).rounded() / 10),
    ]
  }
}
