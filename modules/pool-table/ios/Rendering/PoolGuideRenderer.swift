import SwiftUI

/// Hình học guide tính trong hệ inch của mặt chơi (0…50, 0…100), góc đo đúng như ngoài đời.
/// Màn hình chỉ xuất hiện ở bước cuối, khi map inch → point.
enum PoolGuideMath {
  static let ball = PoolTableSpec.ballDiameter

  /// Điểm ngắm của lỗ: góc bàn cho lỗ góc, giữa băng dài cho lỗ giữa.
  static func pocketAim(_ id: String) -> CGPoint? {
    let w = PoolTableSpec.playWidth
    let l = PoolTableSpec.playLength
    switch id {
    case "footLeft": return CGPoint(x: 0, y: 0)
    case "footRight": return CGPoint(x: w, y: 0)
    case "sideLeft": return CGPoint(x: 0, y: l / 2)
    case "sideRight": return CGPoint(x: w, y: l / 2)
    case "headLeft": return CGPoint(x: 0, y: l)
    case "headRight": return CGPoint(x: w, y: l)
    // Đích băng `railRight@<inch>` của drill bank: ghost và vạch bi cái nhắm vào điểm bank trên đường tâm bi.
    default: return ShotPhysics.target(id)
    }
  }

  static func inches(x: Double, y: Double) -> CGPoint {
    CGPoint(x: x * PoolTableSpec.playWidth, y: y * PoolTableSpec.playLength)
  }

  static func unit(_ v: CGPoint) -> CGPoint {
    let len = max(hypot(v.x, v.y), 0.0001)
    return CGPoint(x: v.x / len, y: v.y / len)
  }

  /// Tâm bi cái lúc chạm: lùi một đường kính bi từ bi mục tiêu, ngược hướng lỗ.
  static func ghost(object: CGPoint, pocket: CGPoint) -> CGPoint {
    let d = unit(CGPoint(x: pocket.x - object.x, y: pocket.y - object.y))
    return CGPoint(x: object.x - d.x * ball, y: object.y - d.y * ball)
  }

  /// Hướng bi cái rời điểm chạm khi stun: vuông góc đường bi mục tiêu, về phía bi cái đang đi tới.
  static func tangent(cue: CGPoint, object: CGPoint, pocket: CGPoint) -> CGPoint {
    let d = unit(CGPoint(x: pocket.x - object.x, y: pocket.y - object.y))
    let ghost = ghost(object: object, pocket: pocket)
    let incoming = unit(CGPoint(x: ghost.x - cue.x, y: ghost.y - cue.y))
    let perp = CGPoint(x: -d.y, y: d.x)
    return perp.x * incoming.x + perp.y * incoming.y >= 0 ? perp : CGPoint(x: -perp.x, y: -perp.y)
  }

  /// Chạy tia từ `origin` theo `dir` tới khi tâm bi chạm băng.
  static func toCushion(from origin: CGPoint, dir: CGPoint) -> CGPoint {
    let r = ball / 2
    let minX = r, maxX = PoolTableSpec.playWidth - r
    let minY = r, maxY = PoolTableSpec.playLength - r
    var t = CGFloat.greatestFiniteMagnitude
    if dir.x > 0 { t = min(t, (maxX - origin.x) / dir.x) }
    if dir.x < 0 { t = min(t, (minX - origin.x) / dir.x) }
    if dir.y > 0 { t = min(t, (maxY - origin.y) / dir.y) }
    if dir.y < 0 { t = min(t, (minY - origin.y) / dir.y) }
    t = max(0, t == .greatestFiniteMagnitude ? 0 : t)
    return CGPoint(x: origin.x + dir.x * t, y: origin.y + dir.y * t)
  }
}

/// Màu guide. Trắng cho đường đi, vàng ấm cho thứ người chơi phải nhận ra: tangent, điểm chạm băng.
enum PoolGuidePalette {
  static let path = Color.white.opacity(0.9)
  static let cuePath = Color.white.opacity(0.6)
  static let ghost = Color.white.opacity(0.85)
  static let accent = PoolTableTheme.tournament.signal
}

struct PoolGuideStroke {
  var path: Path
  var color: Color
  var style: StrokeStyle
}

/// Path cố định bọc thành Shape để `.trim` vẽ dần được.
struct PoolStaticShape: Shape {
  var path: Path
  func path(in rect: CGRect) -> Path { path }
}

enum PoolGuideBuilder {
  /// `ballScale`: bàn vẽ bi phóng to (editor ×2,5) thì ghost cũng phóng theo, không thì vòng ghost nhỏ hơn bi.
  static func strokes(drill: DrillRecord, geometry g: PoolTableGeometry, visible: PoolGuideVisibility = .all, ballScale: CGFloat = 1) -> [PoolGuideStroke] {
    let M = PoolGuideMath.self
    let cue = M.inches(x: drill.cueBall.x, y: drill.cueBall.y)
    func object(_ n: Int) -> CGPoint? {
      drill.objectBalls.first { $0.number == n }.map { M.inches(x: $0.x, y: $0.y) }
    }
    func screen(_ p: CGPoint) -> CGPoint { g.point(inchesX: p.x, inchesY: p.y) }
    func line(_ points: [CGPoint]) -> Path {
      var path = Path()
      path.addLines(points.map(screen))
      return path
    }

    let solid = StrokeStyle(lineWidth: 1.5, lineCap: .round)
    let dashed = StrokeStyle(lineWidth: 1.25, lineCap: .round, dash: [4, 4])

    // Drill nào cũng phải thấy đánh vào đâu: thiếu ghost hay vạch bi cái tới ghost của bi đầu thì tự thêm.
    var guides = drill.guideLines
    if let first = drill.objectBalls.first, !drill.targetPocket.isEmpty {
      for kind in ["ghostBall", "cueBallPath"] where !guides.contains(where: { $0.kind == kind && $0.ball == first.number }) {
        var g = GuideLineRecord()
        g.kind = kind
        g.ball = first.number
        g.pocket = drill.targetPocket
        guides.append(g)
      }
    }

    var out: [PoolGuideStroke] = []
    for guide in guides where visible.shows(guide.kind) {
      switch guide.kind {
      case "objectBallPath":
        guard let o = object(guide.ball), let p = M.pocketAim(guide.pocket) else { continue }
        out.append(.init(path: line([o, p]), color: PoolGuidePalette.path, style: solid))
      case "cueBallPath":
        guard let o = object(guide.ball), let p = M.pocketAim(guide.pocket) else { continue }
        out.append(.init(path: line([cue, M.ghost(object: o, pocket: p)]), color: PoolGuidePalette.cuePath, style: dashed))
      case "ghostBall":
        guard let o = object(guide.ball), let p = M.pocketAim(guide.pocket) else { continue }
        let c = screen(M.ghost(object: o, pocket: p))
        let r = g.ballDiameter * ballScale / 2
        let path = Path(ellipseIn: CGRect(x: c.x - r, y: c.y - r, width: r * 2, height: r * 2))
        out.append(.init(path: path, color: PoolGuidePalette.ghost, style: StrokeStyle(lineWidth: 1, dash: [3, 2.5])))
      case "tangentLine":
        guard let o = object(guide.ball), let p = M.pocketAim(guide.pocket) else { continue }
        let ghost = M.ghost(object: o, pocket: p)
        let end = M.toCushion(from: ghost, dir: M.tangent(cue: cue, object: o, pocket: p))
        out.append(.init(
          path: line([ghost, end]),
          color: PoolGuidePalette.accent,
          style: StrokeStyle(lineWidth: 1.5, lineCap: .round, dash: [6, 4])
        ))
      case "objectBallBankPath":
        // Bi mục tiêu → điểm chạm băng → lỗ, cùng nét với `objectBallPath`.
        let points = guide.points.map { M.inches(x: $0.x, y: $0.y) }
        guard points.count >= 2 else { continue }
        out.append(.init(path: line(points), color: PoolGuidePalette.path, style: solid))
      case "expectedCuePath":
        let points = guide.points.map { M.inches(x: $0.x, y: $0.y) }
        guard points.count >= 2 else { continue }
        out.append(.init(path: line(points), color: PoolGuidePalette.cuePath, style: dashed))
      case "railContact":
        let c = screen(M.inches(x: guide.point.x, y: guide.point.y))
        let r = max(g.ballDiameter * 0.3, 3)
        let path = Path(ellipseIn: CGRect(x: c.x - r, y: c.y - r, width: r * 2, height: r * 2))
        out.append(.init(path: path, color: PoolGuidePalette.accent, style: StrokeStyle(lineWidth: 2)))
      default:
        continue
      }
    }
    return out
  }
}

/// Bật tắt từng nhóm guide. Đường bi mục tiêu đi theo `showGuide` chung, không có cờ riêng.
struct PoolGuideVisibility: Equatable {
  var ghostBall = true
  var tangentLine = true
  var cuePath = true

  static let all = PoolGuideVisibility()

  func shows(_ kind: String) -> Bool {
    switch kind {
    case "ghostBall": return ghostBall
    case "tangentLine", "railContact": return tangentLine
    case "cueBallPath", "expectedCuePath": return cuePath
    default: return true
    }
  }
}

/// Lớp guide. Mỗi lần đổi drill thì vẽ dần 250ms; Reduce Motion thì chỉ mờ hiện.
struct PoolGuideLayer: View {
  let drill: DrillRecord
  let geometry: PoolTableGeometry
  var visible: PoolGuideVisibility = .all
  var ballScale: CGFloat = 1
  @Environment(\.accessibilityReduceMotion) private var reduceMotion
  @State private var progress: CGFloat = 0

  var body: some View {
    let strokes = PoolGuideBuilder.strokes(drill: drill, geometry: geometry, visible: visible, ballScale: ballScale)
    ZStack {
      ForEach(strokes.indices, id: \.self) { i in
        PoolStaticShape(path: strokes[i].path)
          .trim(from: 0, to: reduceMotion ? 1 : progress)
          .stroke(strokes[i].color, style: strokes[i].style)
      }
    }
    .opacity(reduceMotion ? progress : 1)
    .allowsHitTesting(false)
    .accessibilityHidden(true)
    .task(id: drill.id) {
      var reset = Transaction()
      reset.disablesAnimations = true
      withTransaction(reset) { progress = 0 }
      try? await Task.sleep(for: .milliseconds(16))
      withAnimation(reduceMotion ? .easeOut(duration: 0.2) : .timingCurve(0.23, 1, 0.32, 1, duration: 0.25)) {
        progress = 1
      }
    }
  }
}
