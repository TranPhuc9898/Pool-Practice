import SwiftUI

/// Nét trên bàn trước khi đánh, chép `drawTable` của bi-cai-xoay.html ở chế độ Tự xếp bàn: đường đi dự đoán của mọi
/// bi vẽ mờ 0,45; tắt Đường đi thì thay bằng hai vạch gold đứt bi cái → ghost và bi mục tiêu → lỗ. Không vòng, không vạch
/// ngắm sau bi cái. Đang chọn lỗ hay đang chạy thử thì tắt hết. Nét tính bằng point như px của web, không theo `geometry.scale`.
struct PoolEditorGuides: View {
  @ObservedObject var model: PoolEditorModel
  let geometry: PoolTableGeometry
  /// Lớp đè lên bi: chỉ vẽ điểm chết.
  var top = false

  static let red = Color(red: 1, green: 0x45 / 255, blue: 0x3A / 255)
  static let orange = Color(red: 1, green: 0x9F / 255, blue: 0x0A / 255)
  /// draw, stun, follow. Dịu, không trùng đỏ cam của cảnh báo và gold của nút.
  static let spin: [Color] = [
    Color(red: 0xC3 / 255, green: 0xA6 / 255, blue: 1),
    .white,
    Color(red: 0x8E / 255, green: 0xE0 / 255, blue: 0xB0 / 255),
  ]
  /// Thứ tự id lỗ trùng thứ tự `PoolTableGeometry.pockets`.
  static let pocketOrder = ["footLeft", "footRight", "sideLeft", "sideRight", "headLeft", "headRight"]

  static func spinIndex(_ f: CGFloat) -> Int { f < -0.05 ? 0 : f < 0.12 ? 1 : 2 }

  var body: some View {
    Canvas { ctx, _ in draw(&ctx) }
      .allowsHitTesting(false)
  }

  private func draw(_ ctx: inout GraphicsContext) {
    // Bài điều bi: vùng đánh bi 2 và đường bi 2 vào lỗ. Vẽ cả lúc đang chạy thử để thấy bi cái dừng trong hay ngoài.
    if !top, let p = model.position, let P = ShotPhysics.pockets[p.pocket2] {
      let pt = { (q: CGPoint) in geometry.point(inchesX: q.x, inchesY: q.y) }
      var zone = Path()
      zone.addLines(p.zone.map(pt))
      zone.closeSubpath()
      ctx.fill(zone, with: .color(PoolAimPalette.gold.opacity(0.16)))
      ctx.stroke(zone, with: .color(PoolAimPalette.gold.opacity(0.7)), style: StrokeStyle(lineWidth: 1, dash: [4, 3]))
      var next = Path()
      next.addLines([pt(p.two), pt(P)])
      ctx.stroke(next, with: .color(PoolAimPalette.gold.opacity(0.45)), style: StrokeStyle(lineWidth: 1, dash: [2, 4]))
      // Điểm đoán: vòng trắng đứt cỡ bi đã phóng. Đánh xong thì thêm bóng bi cái ở chỗ dừng thật và vạch nối.
      if model.guessing, let g = model.guess {
        let d = geometry.ballDiameter * PoolEditorModel.ballZoom, q = pt(g)
        let ring = { (c: CGPoint) in Path(ellipseIn: CGRect(x: c.x - d / 2, y: c.y - d / 2, width: d, height: d)) }
        if model.revealed, let s = model.cueStop {
          let e = pt(s)
          var miss = Path()
          miss.addLines([q, e])
          ctx.stroke(miss, with: .color(.white.opacity(0.6)), style: StrokeStyle(lineWidth: 1, dash: [2, 3]))
          ctx.fill(ring(e), with: .color(.white.opacity(0.35)))
          ctx.stroke(ring(e), with: .color(.white.opacity(0.85)), lineWidth: 1)
        }
        ctx.stroke(ring(q), with: .color(.white.opacity(0.9)), style: StrokeStyle(lineWidth: 1.5, dash: [3, 2]))
        var cross = Path()
        cross.addLines([CGPoint(x: q.x - 3, y: q.y), CGPoint(x: q.x + 3, y: q.y)])
        cross.addLines([CGPoint(x: q.x, y: q.y - 3), CGPoint(x: q.x, y: q.y + 3)])
        ctx.stroke(cross, with: .color(.white.opacity(0.9)), lineWidth: 1)
      }
    }
    // Cảnh mẫu: không đường dự đoán, không nét gold.
    guard model.demo == nil else { return }
    // Cú chỉ có bi cái: đường dự đoán của chính cú đó, cộng vạch gold ở điểm ngắm trên băng.
    if !top, model.picking == nil, model.replay == nil, let r = model.soloReplay(jump: true) {
      if model.showPaths { PoolShotReplayLayer.trails(&ctx, r, r.end, geometry, fade: 0.45) }
      if let pocket = model.aimPocket, let n = ShotPhysics.railNose(pocket) {
        let along = n.x == 0 || n.x == ShotPhysics.width ? CGPoint(x: 0, y: 1.4) : CGPoint(x: 1.4, y: 0)
        var tick = Path()
        tick.addLines([CGPoint(x: n.x - along.x, y: n.y - along.y), CGPoint(x: n.x + along.x, y: n.y + along.y)].map { geometry.point(inchesX: $0.x, inchesY: $0.y) })
        ctx.stroke(tick, with: .color(PoolAimPalette.gold), lineWidth: 2)
      }
      return
    }
    guard model.picking == nil, model.replay == nil, let ball = model.aimBall, let pocket = model.aimPocket,
          let c = model.balls[0], let o = model.balls[ball], let P = ShotPhysics.target(pocket)
    else { return }
    let pt = { (p: CGPoint) in geometry.point(inchesX: p.x, inchesY: p.y) }
    let gold = PoolAimPalette.gold
    func line(_ pts: [CGPoint], _ color: Color, _ width: CGFloat, dash: [CGFloat] = []) {
      var path = Path()
      path.addLines(pts.map(pt))
      ctx.stroke(path, with: .color(color), style: StrokeStyle(lineWidth: width, dash: dash))
    }

    let d = ShotPhysics.unit(P.x - o.x, P.y - o.y)
    let G = CGPoint(x: o.x - d.x * ShotPhysics.ballDiameter, y: o.y - d.y * ShotPhysics.ballDiameter)
    let zoomed = ShotPhysics.ballDiameter * PoolEditorModel.ballZoom
    let Gv = CGPoint(x: o.x - d.x * zoomed, y: o.y - d.y * zoomed)

    // Điểm chết là bi ma: chỗ tâm bi cái phải tới lúc chạm. Bi đã phóng ×2,5 nên vẽ bi ma cùng cỡ, áp sát mép bi
    // mục tiêu trên đường lỗ → bi. Màu theo mức như vòng ghost của drill-editor-v7: trắng, cam quá mỏng, đỏ không có góc.
    if top {
      let level = ShotPhysics.shotOf(ball: ball, pocket: pocket, balls: model.balls)?.level
      let col: Color = level == .bad ? Self.red : level == .warn ? Self.orange : .white
      let q = pt(Gv), r = geometry.ballDiameter * PoolEditorModel.ballZoom / 2
      let ghost = Path(ellipseIn: CGRect(x: q.x - r, y: q.y - r, width: 2 * r, height: 2 * r))
      ctx.fill(ghost, with: .color(col.opacity(0.1)))
      ctx.stroke(ghost, with: .color(col.opacity(0.85)), style: StrokeStyle(lineWidth: 1, dash: [3, 2]))
      return
    }

    // Chỗ bi cái dừng: vòng cỡ bi đã phóng. Đang đoán thì giấu, lộ ra là lộ đáp án.
    if !model.blind, !(model.position != nil && model.guessing), let s = model.cueStop {
      let q = pt(s), r = geometry.ballDiameter * PoolEditorModel.ballZoom / 2
      let ring = Path(ellipseIn: CGRect(x: q.x - r, y: q.y - r, width: 2 * r, height: 2 * r))
      ctx.fill(ring, with: .color(.white.opacity(0.08)))
      ctx.stroke(ring, with: .color(.white.opacity(0.7)), style: StrokeStyle(lineWidth: 1, dash: [3, 2]))
    }
    // Có đường dự đoán thì thôi vạch gold, hai nét chồng lên nhau rối mắt. Không vòng ghost, vòng bi, vòng lỗ:
    // bi phóng ×2,5 nên vòng nào cũng đè lên bi.
    // Đang đoán thì không lộ đường bi cái, chỉ còn hai vạch ngắm.
    if model.showPaths, !model.blind, let ms = model.shotSetup,
       ShotPhysics.shotOf(ball: ball, pocket: pocket, balls: model.balls)?.level != .bad {
      let r = ShotReplay(ms, ball: ball, tipX: model.tipX, tipY: model.tipY, theta: model.theta, speed: model.speed, jump: true)
      PoolShotReplayLayer.trails(&ctx, r, r.end, geometry, fade: 0.45, bend: (G, Gv))
    } else {
      let soft = gold.opacity(0.75)
      line([c, Gv], soft, 1.2, dash: [4, 4])
      line([o, P], soft, 1.2, dash: [4, 4])
    }
    if !Self.pocketOrder.contains(pocket), let n = ShotPhysics.railNose(pocket) {
      // Web không có đích băng: đánh dấu điểm chạm bằng vạch gold ngắn trên mũi băng.
      let along = n.x == 0 || n.x == ShotPhysics.width ? CGPoint(x: 0, y: 1) : CGPoint(x: 1, y: 0)
      line([CGPoint(x: n.x - along.x * 1.4, y: n.y - along.y * 1.4), CGPoint(x: n.x + along.x * 1.4, y: n.y + along.y * 1.4)], gold, 2)
    }
  }
}
