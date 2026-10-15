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
    case .table: return "Table"
    case .top: return "Aim"
    case .back: return "Thickness"
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
  /// Nâng cơ, độ. `theta` của bi-cai-xoay.html. Không có thanh kéo, chỉ cú mẫu Massé đặt.
  @Published var theta: CGFloat = 0
  /// Bi đang kéo, vẽ trên cùng.
  @Published var dragging: Int?
  /// Bi mục tiêu đang chờ chọn lỗ.
  @Published var picking: Int?
  /// Cú đang chạy thử sau khi bấm Đánh. Chạm bi hay đổi cú là dừng.
  @Published var replay: ShotReplay?
  /// Tắt thì bàn chỉ còn đường ngắm từ bi cái tới tâm ghost.
  @Published var showPaths = true
  /// Bi vẽ to gấp 1,8 cỡ thật: bàn dọc trên điện thoại chỉ ~3 pt một inch, bi 2,25" thành 7 pt thì không đọc được số.
  /// Không lấy 2,5 như web: bi vẽ 5,6" thì đường bi cách bi khác 3–4 inch, bàn thật còn hở, trên màn như xuyên qua bi.
  /// Vật lý, kéo thả và ghost vẫn tính theo 2,25".
  static let ballZoom: CGFloat = 1.8
  /// Hình đang (hoặc vừa) nở ra. Giữ lại lúc thu về để biết thu về ô nào.
  @Published var fig: EditorViewMode = .top
  /// Hình đang phủ bàn. Chạy thử luôn trên Bàn nên Đánh là thu hình về.
  @Published var figShown = false
  /// Sheet Thẻ bài đang mở.
  @Published var card = false
  /// Planner đang chạy nền.
  @Published var suggesting = false
  /// Drill chạy bàn đang diễn hoặc vừa diễn xong, nil là không. Xem `startRack`.
  @Published var rack: RackRun?
  /// Lời của lần Gợi ý gần nhất, chỉ hiện khi bàn và cú còn y nguyên.
  @Published var hint: Hint?
  private var rev = Int.min

  /// Cú mẫu, chép `PRESETS` của bi-cai-xoay.html. Như web, chip mẫu thay cả bàn bằng cảnh mẫu: bi cái cách băng
  /// dưới 0,5 m, bi mục tiêu thẳng trước mặt cách `D` (hay lệch nửa bi, hay không có), không có lỗ đích, đánh đúng
  /// hướng `aim` chứ không tự ngắm. Cảnh mẫu không bao giờ tới JS: bài đang soạn cất trong `stash`, Tự xếp bi trả lại.
  struct Preset: Identifiable {
    enum Object { case none, straight, half }
    let name: String
    let tipX: CGFloat
    let tipY: CGFloat
    /// Tốc cơ V0 của web, m/s. Thanh Lực của app là tốc bi cái, đổi qua `speed`.
    let stick: CGFloat
    var theta: CGFloat = 0
    /// Hướng đánh, độ, dương lệch phải.
    var aim: CGFloat = 0
    var object: Object = .none
    /// Bi cái tới bi mục tiêu, m.
    var D: CGFloat = 0.9
    var id: String { name }

    /// Tốc bi cái ngay sau cú, làm tròn như thanh Lực.
    var speed: CGFloat { (ShotPhysics.cueBallSpeed(stick: stick, tipX: tipX, tipY: tipY, theta: theta) * 10).rounded() / 10 }
    /// Hướng đánh trên bàn app: web đo y từ băng dưới lên, app đo từ băng trên xuống.
    var heading: CGPoint { let a = aim * .pi / 180; return CGPoint(x: sin(a), y: -cos(a)) }
    var scene: [Int: CGPoint] {
      let m = ShotPhysics.inchesPerMeter, W = PoolEditorModel.width, L = PoolEditorModel.length
      let c = CGPoint(x: W / 2, y: L - 0.5 * m), h = heading
      guard object != .none else { return [0: c] }
      let off = object == .half ? ShotPhysics.ballRadius : 0, edge = 0.1 * m
      let o = CGPoint(x: min(max(c.x + h.x * D * m - h.y * off, edge), W - edge), y: min(max(c.y + h.y * D * m + h.x * off, edge), L - edge))
      return [0: c, 1: o]
    }
  }
  static let presets: [Preset] = [
    Preset(name: "Center ball", tipX: 0, tipY: 0, stick: 2.5),
    Preset(name: "Natural roll 2/5R", tipX: 0, tipY: 0.4, stick: 2.5),
    Preset(name: "Follow", tipX: 0, tipY: 0.5, stick: 3, object: .straight),
    Preset(name: "Draw", tipX: 0, tipY: -0.5, stick: 3, object: .straight),
    Preset(name: "Stop", tipX: 0, tipY: -0.26, stick: 1.5, object: .straight, D: 0.5),
    Preset(name: "Right english into rail", tipX: 0.45, tipY: 0, stick: 2.5),
    Preset(name: "Draw + left english, ½ cut", tipX: -0.35, tipY: -0.35, stick: 3, object: .half, D: 0.8),
    Preset(name: "Massé, cue at 60°", tipX: 0.4, tipY: 0, stick: 3, theta: 60, aim: -10),
  ]
  /// Cảnh mẫu đang bày, nil là bàn của bài (Tự xếp bi).
  @Published var demo: Preset?
  private struct Stash {
    let balls: [Int: CGPoint]
    let aimBall: Int?
    let aimPocket: String?
    let tipX, tipY, speed, theta: CGFloat
  }
  private var stash: Stash?

  /// Bài điều bi: ăn bi 1 rồi để bi cái vào vùng đánh bi 2. Vùng là bi cái cách bi 2 từ 8 tới 35 inch, góc cắt bi 2
  /// từ 8 tới 35°, đúng phía `side`: thẳng quá thì hết đường điều tiếp, mỏng quá thì khó vào.
  /// Toạ độ và cú dò bằng chính `ShotPhysics` (scratchpad tune): cú của bài trúng vùng khi lực lệch ±10%, stun
  /// cùng lực thì trượt. Như cảnh mẫu, bài không bao giờ tới JS.
  struct Position {
    /// Tên trên dòng tiêu đề của bảng, như tên cú mẫu.
    let name: String
    /// Điều bài muốn dạy, cho VoiceOver.
    let lesson: String
    let cue, one, two: CGPoint
    let pocket1, pocket2: String
    /// Dấu góc cắt bi 2 mà bi cái phải có, theo `cut(from:)`.
    let side: CGFloat
    let tipY: CGFloat
    let speed: CGFloat
    static let cuts: ClosedRange<CGFloat> = 8...35
    static let dists: ClosedRange<CGFloat> = 8...35

    var scene: [Int: CGPoint] { [0: cue, 1: one, 2: two] }
    /// Góc cắt bi 2 (độ, dương là đúng phía) và khoảng cách nếu bi cái đứng ở `c`.
    func cut(from c: CGPoint) -> (deg: CGFloat, dist: CGFloat) {
      let P = ShotPhysics.pockets[pocket2] ?? .zero
      let a = CGPoint(x: two.x - c.x, y: two.y - c.y), d = CGPoint(x: P.x - two.x, y: P.y - two.y)
      return (atan2(a.x * d.y - a.y * d.x, a.x * d.x + a.y * d.y) * 180 / .pi * side, hypot(a.x, a.y))
    }
    func contains(_ c: CGPoint) -> Bool { let k = cut(from: c); return Self.cuts ~= k.deg && Self.dists ~= k.dist }
    /// Viền vùng, inch: cung xa rồi cung gần, kẹp trong bàn.
    var zone: [CGPoint] {
      let P = ShotPhysics.pockets[pocket2] ?? .zero, d = ShotPhysics.unit(P.x - two.x, P.y - two.y), r = ShotPhysics.ballRadius
      func at(_ deg: CGFloat, _ dist: CGFloat) -> CGPoint {
        // Bi cái ở `two − dist·a` với `a` là `d` quay ngược một góc `deg·side`.
        let t = -deg * side * .pi / 180, a = CGPoint(x: d.x * cos(t) - d.y * sin(t), y: d.x * sin(t) + d.y * cos(t))
        return CGPoint(x: min(max(two.x - a.x * dist, r), ShotPhysics.width - r), y: min(max(two.y - a.y * dist, r), ShotPhysics.length - r))
      }
      let steps = (0...12).map { Self.cuts.lowerBound + (Self.cuts.upperBound - Self.cuts.lowerBound) * CGFloat($0) / 12 }
      return steps.map { at($0, Self.dists.upperBound) } + steps.reversed().map { at($0, Self.dists.lowerBound) }
    }
  }
  static let positions: [Position] = [
    Position(name: "Follow along the zone", lesson: "Follow runs along the zone, stun stops far from ball 2", cue: CGPoint(x: 16, y: 34), one: CGPoint(x: 8, y: 10),
             two: CGPoint(x: 32, y: 54), pocket1: "footLeft", pocket2: "headRight", side: -1, tipY: 0.4, speed: 2.6),
    Position(name: "Off the rail, right side", lesson: "Off the rail to the right side, stun leaves the cue ball on the wrong side", cue: CGPoint(x: 18, y: 32), one: CGPoint(x: 44, y: 46),
             two: CGPoint(x: 26, y: 26), pocket1: "sideRight", pocket2: "footLeft", side: -1, tipY: 0.4, speed: 2.7),
    Position(name: "Draw back, keep angle", lesson: "Draw back with angle, stop leaves ball 2 straight and far", cue: CGPoint(x: 39, y: 23), one: CGPoint(x: 44.5, y: 11.5),
             two: CGPoint(x: 20, y: 54), pocket1: "footRight", pocket2: "headLeft", side: -1, tipY: -0.3, speed: 2.7),
  ]
  /// Bài điều bi đang bày, chỉ số trong `positions`. Đổi bài là bỏ điểm đoán.
  @Published var lesson: Int? { didSet { guess = nil; guessed = nil; scored = nil } }
  var position: Position? { lesson.map { Self.positions[$0] } }
  /// Bi cái đã kéo khỏi chỗ của bài. Bi 1, bi 2 thì khoá.
  var cueMoved: Bool { position.map { balls[0] != $0.cue } ?? false }

  /// Chế độ đoán của bài điều bi, như bài "chỉ điểm đến của bi cái": chạm bàn cắm điểm đoán, Đánh xong mới lộ chỗ dừng.
  @Published var guessing = false
  /// Điểm đoán, inch.
  @Published var guess: CGPoint?
  /// Khoá của cú đã đánh với điểm đoán. Còn khớp `guessKey` là đã lộ đáp án, chỉnh bi, chấm, lực hay điểm đoán là lượt mới.
  @Published var guessed: [CGFloat]?
  var guessKey: [CGFloat]? {
    guard let g = guess, let c = balls[0] else { return nil }
    return [g.x, g.y, c.x, c.y, tipX, tipY, speed, theta]
  }
  var revealed: Bool { replay == nil && guessKey != nil && guessed == guessKey }
  /// Đang đoán mà chưa đánh: giấu đường đi và chữ chấm vùng.
  var blind: Bool { lesson != nil && guessing && !revealed }
  /// Lệch tới 2 bi là trúng, quá 12 in là trượt.
  static let guessGood: CGFloat = 4.5
  static let guessBad: CGFloat = 12
  var guessError: CGFloat? {
    guard revealed, let g = guess, let s = cueStop else { return nil }
    return hypot(s.x - g.x, s.y - g.y)
  }
  /// Chỗ bi cái dừng của cú đang bày, nil nếu cú không chạy hay trắng rơi lỗ. Cùng phép tính với dòng trạng thái.
  var cueStop: CGPoint? {
    guard let b = aimBall, let p = aimPocket, ShotPhysics.shotOf(ball: b, pocket: p, balls: balls)?.level != .bad, let ms = shotSetup else { return nil }
    let r = ShotPhysics.runWith(ms, tipX: tipX, tipY: tipY, theta: theta, speed: speed)
    return r.short == .cue || r.scratch != nil ? nil : r.stop
  }
  /// Chuỗi đoán trúng liên tiếp và kỷ lục của từng bài, chỉ sống trong phiên.
  struct Streak { var now = 0, best = 0 }
  @Published var streaks: [Int: Streak] = [:]
  var streak: Streak? { lesson.flatMap { streaks[$0] } }
  private var scored: [CGFloat]?
  /// Gọi lúc lộ đáp án, trả độ lệch đã làm tròn. Đánh lại y hệt cú vừa chấm thì không tính thêm.
  func score() -> CGFloat? {
    guard let i = lesson, let e = guessError?.rounded(), guessKey != scored else { return nil }
    scored = guessKey
    var s = streaks[i] ?? Streak()
    s.now = e <= Self.guessGood ? s.now + 1 : 0
    s.best = max(s.best, s.now)
    streaks[i] = s
    return e
  }
  func place(guess p: CGPoint) {
    let r = ShotPhysics.ballRadius
    guess = CGPoint(x: min(max(p.x, r), Self.width - r), y: min(max(p.y, r), Self.length - r))
    EditorHaptics.fire(.selection, "Guess (\(Int(p.x)), \(Int(p.y)))")
  }

  private func keep() {
    replay = nil
    picking = nil
    if stash == nil { stash = Stash(balls: balls, aimBall: aimBall, aimPocket: aimPocket, tipX: tipX, tipY: tipY, speed: speed, theta: theta) }
  }

  /// Bày bài điều bi. Khác cảnh mẫu, bài có đường bi 1 vào lỗ nên guide, Đánh và hai hình chạy như bàn thường.
  func play(_ i: Int) {
    keep()
    let p = Self.positions[i]
    demo = nil
    lesson = i
    balls = p.scene
    aimBall = 1
    aimPocket = p.pocket1
    tipX = 0
    tipY = p.tipY
    speed = p.speed
    theta = 0
  }

  func apply(_ p: Preset) {
    keep()
    lesson = nil
    demo = p
    balls = p.scene
    aimBall = nil
    aimPocket = nil
    tipX = p.tipX
    tipY = p.tipY
    speed = p.speed
    theta = p.theta
  }

  /// Tự xếp bi: trả bàn và cú của bài. Web về đầu cơ giữa, app giữ cú đã soạn vì bài được lưu.
  func layout() {
    replay = nil
    picking = nil
    if let s = stash {
      balls = s.balls; aimBall = s.aimBall; aimPocket = s.aimPocket
      tipX = s.tipX; tipY = s.tipY; speed = s.speed; theta = s.theta
    }
    stash = nil
    demo = nil
    lesson = nil
  }

  static let width = PoolTableSpec.playWidth
  static let length = PoolTableSpec.playLength

  func adopt(_ s: EditorStateRecord) {
    guard s.rev != rev else { return }
    rev = s.rev
    demo = nil
    lesson = nil
    stash = nil
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

  /// Bản chụp gửi JS. Toạ độ chuẩn hoá, ba số lẻ như dev mode của `PoolTableView`. Đang bày cảnh mẫu thì gửi bài đã cất.
  func snapshot() -> [String: Any] {
    let r = { (v: CGFloat) in Double((v * 1000).rounded() / 1000) }
    let k = stash ?? Stash(balls: balls, aimBall: aimBall, aimPocket: aimPocket, tipX: tipX, tipY: tipY, speed: speed, theta: theta)
    let s: [String: Any] = [
      "balls": k.balls.keys.sorted().map { n in
        ["number": n, "x": r(k.balls[n]!.x / Self.width), "y": r(k.balls[n]!.y / Self.length)]
      },
      "aimBall": k.aimBall ?? -1,
      "aimPocket": k.aimPocket ?? "",
      "tipX": Double((k.tipX * 100).rounded() / 100),
      "tipY": Double((k.tipY * 100).rounded() / 100),
      "speed": Double((k.speed * 10).rounded() / 10),
      "theta": Double(k.theta.rounded()),
    ]
    // Để kiểm bằng `log stream`, như fixture d03.
    NSLog("[editor] commit aim %@ tip (%.2f, %.2f) θ %.0f v %.1f", "\(k.aimBall ?? -1)→\(k.aimPocket ?? "-")", k.tipX, k.tipY, k.theta, k.speed)
    return s
  }
}
