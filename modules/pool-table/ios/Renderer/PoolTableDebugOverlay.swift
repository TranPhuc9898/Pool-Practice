import SwiftUI

/// Lưới kiểm hình học: đường tâm dọc, head string, đường qua diamond, nhãn tỉ lệ.
struct PoolTableDebugOverlay: View, Equatable {
  let geometry: PoolTableGeometry
  let theme: PoolTableTheme
  /// Đường kính bi đúng như đang vẽ, để nhãn đo thứ thật trên màn.
  let renderedBallDiameter: CGFloat

  var body: some View {
    let g = geometry
    ZStack(alignment: .topLeading) {
      Canvas { context, _ in
        var grid = Path()
        for i in 1...3 {
          let x = CGFloat(i) / 4
          grid.move(to: g.point(x: x, y: 0))
          grid.addLine(to: g.point(x: x, y: 1))
        }
        for i in 1...7 {
          let y = CGFloat(i) / 8
          grid.move(to: g.point(x: 0, y: y))
          grid.addLine(to: g.point(x: 1, y: y))
        }
        context.stroke(grid, with: .color(theme.debug.opacity(0.35)), lineWidth: 0.5)

        var center = Path()
        center.move(to: g.point(x: 0.5, y: 0))
        center.addLine(to: g.point(x: 0.5, y: 1))
        context.stroke(center, with: .color(theme.debug), style: StrokeStyle(lineWidth: 1, dash: [4, 3]))

        var headString = Path()
        headString.move(to: g.point(x: 0, y: 0.75))
        headString.addLine(to: g.point(x: 1, y: 0.75))
        context.stroke(headString, with: .color(theme.debug), lineWidth: 1)
      }

      Text(label)
        .font(.system(size: 11, weight: .semibold, design: .monospaced))
        .foregroundStyle(.white)
        .padding(.horizontal, 6)
        .padding(.vertical, 3)
        .background(theme.debug.opacity(0.85), in: RoundedRectangle(cornerRadius: 4))
        .position(x: g.playRect.midX, y: g.playRect.minY + 14)
    }
    .allowsHitTesting(false)
  }

  private var label: String {
    let ratio = renderedBallDiameter / max(geometry.playWidthPoints, 1)
    return String(format: "ball/width %.3f · w %.0f", ratio, geometry.container.width)
  }
}
