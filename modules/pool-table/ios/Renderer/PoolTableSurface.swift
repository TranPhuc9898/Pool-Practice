import SwiftUI

/// Lớp bàn tĩnh: thành, băng, mặt vải, lỗ, diamond, spot.
/// `Equatable` để SwiftUI bỏ qua vẽ lại khi chỉ drill hay vị trí bi đổi.
struct PoolTableSurface: View, Equatable {
  let geometry: PoolTableGeometry
  let theme: PoolTableTheme

  var body: some View {
    Canvas { context, _ in
      let g = geometry
      let s = g.scale

      let railPath = Path(roundedRect: g.tableRect, cornerRadius: 2.5 * s)
      // Thành gỗ đen mờ: sáng nhẹ ở mép trên trái như có đèn hắt, tối dần về góc đối diện.
      context.fill(
        railPath,
        with: .linearGradient(
          Gradient(colors: [theme.railHighlight, theme.rail, theme.rail]),
          startPoint: CGPoint(x: g.tableRect.minX, y: g.tableRect.minY),
          endPoint: CGPoint(x: g.tableRect.maxX, y: g.tableRect.maxY)
        )
      )
      context.stroke(
        Path(roundedRect: g.tableRect.insetBy(dx: 0.5, dy: 0.5), cornerRadius: 2.5 * s),
        with: .color(.white.opacity(0.07)),
        lineWidth: 1
      )

      let cushionRect = g.playRect.insetBy(dx: -PoolTableSpec.cushionWidth * s, dy: -PoolTableSpec.cushionWidth * s)
      context.fill(Path(cushionRect), with: .color(theme.cushion))
      let lamp = max(g.playRect.width, g.playRect.height) * 0.62
      context.fill(
        Path(g.playRect),
        with: .radialGradient(
          Gradient(colors: [theme.clothLit, theme.cloth]),
          center: CGPoint(x: g.playRect.midX, y: g.playRect.midY),
          startRadius: 0,
          endRadius: lamp
        )
      )
      // Mép băng đổ bóng vào mặt vải, mảnh, để mặt chơi lõm xuống.
      context.stroke(Path(g.playRect.insetBy(dx: 0.75, dy: 0.75)), with: .color(.black.opacity(0.35)), lineWidth: 1.5)

      for pocket in g.pockets {
        let r = pocket.radius
        let rect = CGRect(x: pocket.center.x - r, y: pocket.center.y - r, width: 2 * r, height: 2 * r)
        context.fill(Path(ellipseIn: rect), with: .color(theme.pocket))
      }

      let diamondR = 0.55 * s
      for d in g.diamonds {
        var p = Path()
        p.move(to: CGPoint(x: d.x, y: d.y - diamondR))
        p.addLine(to: CGPoint(x: d.x + diamondR * 0.7, y: d.y))
        p.addLine(to: CGPoint(x: d.x, y: d.y + diamondR))
        p.addLine(to: CGPoint(x: d.x - diamondR * 0.7, y: d.y))
        p.closeSubpath()
        context.fill(p, with: .color(theme.diamond))
      }

      let spotR = 0.35 * s
      for spot in [g.footSpot, g.centerSpot, g.headSpot] {
        context.fill(
          Path(ellipseIn: CGRect(x: spot.x - spotR, y: spot.y - spotR, width: 2 * spotR, height: 2 * spotR)),
          with: .color(theme.spot)
        )
      }
    }
    .accessibilityHidden(true)
  }
}
