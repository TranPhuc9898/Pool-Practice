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
  /// Điểm đặt đầu cơ theo bán kính bi: `tipX` dương là phê phải, `tipY` dương là cao (follow).
  @Field var tipX: Double = 0
  @Field var tipY: Double = 0
  /// Tốc độ bi cái lúc rời đầu cơ, m/s.
  @Field var speed: Double = 1.8
  /// Nâng cơ, độ, 0–75. Trên 0 là massé: bi cái cong đường trước khi chạm.
  @Field var theta: Double = 0
}

/// Ba góc nhìn của cùng một cú: bàn luôn hiện, hai hình là hai ô cạnh bàn, chạm ô là nở ra. Khớp `EditorViewMode` bên TS.
enum EditorViewMode: String, CaseIterable, Identifiable {
  case table, top, back
  var id: String { rawValue }
  var title: String {
    switch self {
    case .table: return "Bàn"
    case .top: return "Ngắm"
    case .back: return "Dày mỏng"
    }
  }
}

/// State sống của editor, tính bằng inch (x 0…50, y 0…100, foot rail ở y = 0).
/// Swift là nguồn sự thật trong lúc tay đang chạm. JS chỉ nhận bản chụp lúc nhấc tay.
final class PoolEditorModel: ObservableObject {
  @Published var balls: [Int: CGPoint] = [:]
  @Published var aimBall: Int?
  @Published var aimPocket: String?
  @Published var tipX: CGFloat = 0
  @Published var tipY: CGFloat = 0
  @Published var speed: CGFloat = 1.8
  /// Nâng cơ, độ. `theta` của bi-cai-xoay.html.
  @Published var theta: CGFloat = 0
  static let thetaMax: CGFloat = 75
  /// Bi đang kéo, vẽ trên cùng.
  @Published var dragging: Int?
  /// Bi mục tiêu đang chờ chọn lỗ.
  @Published var picking: Int?
  /// Cú đang chạy thử sau khi bấm Đánh. Chạm bi hay đổi cú là dừng.
  @Published var replay: ShotReplay?
  /// Tắt thì bàn chỉ còn đường ngắm từ bi cái tới tâm ghost.
  @Published var showPaths = true
  /// Tốc phát chạy thử, giây mô phỏng trên giây thật. Mặc định tốc độ thật; bốn mức như `speedSeg` của
  /// bi-cai-xoay.html, chọn trong hàng tua lúc đang chạy.
  @Published var rate: CGFloat = 1
  static let rates: [CGFloat] = [1, 0.5, 0.25, 0.1]
  /// Bi vẽ to gấp 2,5 cỡ thật, như ô "Phóng bi trên bàn ×2,5" của web: bàn dọc trên điện thoại chỉ ~3 pt một inch,
  /// bi 2,25" thành 7 pt thì không đọc được số. Vật lý, kéo thả và ghost vẫn tính theo 2,25".
  static let ballZoom: CGFloat = 2.5
  /// Hình đang (hoặc vừa) nở ra. Giữ lại lúc thu về để biết thu về ô nào.
  @Published var fig: EditorViewMode = .top
  /// Hình đang phủ bàn. Chạy thử luôn trên Bàn nên Đánh là thu hình về.
  @Published var figShown = false
  /// Sheet Thẻ bài đang mở.
  @Published var card = false
  /// Planner đang chạy nền.
  @Published var suggesting = false
  /// Lời của lần Gợi ý gần nhất, chỉ hiện khi bàn và cú còn y nguyên.
  @Published var hint: Hint?
  private var rev = Int.min

  /// Cú mẫu, chép `PRESETS` của bi-cai-xoay.html trừ Tự xếp bàn. Số lực lấy đúng V0 của web để chip đọc giống nhau
  /// hai bên. Massé giữ 0,4 / 0 / θ 60 / 3 m/s của web: ở 3 m/s bi cái cong ít trên cú ngắn, chậm lại là cong rõ.
  struct Preset: Identifiable {
    let name: String
    let tipX: CGFloat
    let tipY: CGFloat
    let speed: CGFloat
    var theta: CGFloat = 0
    var id: String { name }
  }
  static let presets: [Preset] = [
    Preset(name: "Giữa bi", tipX: 0, tipY: 0, speed: 2.5),
    Preset(name: "Lăn tự nhiên 2/5R", tipX: 0, tipY: 0.4, speed: 2.5),
    Preset(name: "Culê", tipX: 0, tipY: 0.5, speed: 3),
    Preset(name: "Kéo", tipX: 0, tipY: -0.5, speed: 3),
    Preset(name: "Stop", tipX: 0, tipY: -0.26, speed: 1.5),
    Preset(name: "Phê phải vào băng", tipX: 0.45, tipY: 0, speed: 2.5),
    Preset(name: "Kéo + phê trái", tipX: -0.35, tipY: -0.35, speed: 3),
    Preset(name: "Massé 60°", tipX: 0.4, tipY: 0, speed: 3, theta: 60),
  ]
  /// Cú mẫu đang trùng với pad, Lực và Nâng cơ, để tô chip. nil khi anh đã kéo lệch đi.
  var preset: Preset? {
    Self.presets.first {
      abs($0.tipX - tipX) < 0.006 && abs($0.tipY - tipY) < 0.006 && abs($0.speed - speed) < 0.06 && abs($0.theta - theta) < 0.5
    }
  }
  func apply(_ p: Preset) {
    replay = nil
    tipX = p.tipX
    tipY = p.tipY
    speed = p.speed
    theta = p.theta
  }

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
    tipX = s.tipX
    tipY = s.tipY
    speed = s.speed
    theta = s.theta
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
    let s: [String: Any] = [
      "balls": balls.keys.sorted().map { n in
        ["number": n, "x": r(balls[n]!.x / Self.width), "y": r(balls[n]!.y / Self.length)]
      },
      "aimBall": aimBall ?? -1,
      "aimPocket": aimPocket ?? "",
      "tipX": Double((tipX * 100).rounded() / 100),
      "tipY": Double((tipY * 100).rounded() / 100),
      "speed": Double((speed * 10).rounded() / 10),
      "theta": Double(theta.rounded()),
    ]
    // Để kiểm bằng `log stream`, như fixture d03.
    NSLog("[editor] commit aim %@ tip (%.2f, %.2f) θ %.0f v %.1f", "\(aimBall ?? -1)→\(aimPocket ?? "-")", tipX, tipY, theta, speed)
    return s
  }
}
