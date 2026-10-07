import SwiftUI

/// Dev mode: kéo bi để đặt toạ độ drill. Bám 1:1 theo tay, nhãn x/y hiện trong lúc kéo,
/// thả tay thì báo toạ độ chuẩn hoá (đã kẹp trong mặt chơi) qua `onDrop`.
struct PoolBallDrag: ViewModifier {
  let ball: Int
  let geometry: PoolTableGeometry
  let position: CGPoint
  let onDrop: (_ ball: Int, _ x: Double, _ y: Double) -> Void

  @State private var dragging: CGPoint?

  func body(content: Content) -> some View {
    let shown = dragging ?? position
    let n = geometry.normalized(shown)
    content
      .position(shown)
      .overlay(alignment: .topLeading) {
        if dragging != nil {
          Text(String(format: "x %.3f  y %.3f", n.x, n.y))
            .font(.system(size: 11, weight: .semibold, design: .monospaced))
            .foregroundStyle(.white)
            .padding(.horizontal, 6)
            .padding(.vertical, 3)
            .background(.black.opacity(0.75), in: Capsule())
            .fixedSize()
            .position(x: shown.x, y: shown.y - geometry.ballDiameter * 1.4)
            .allowsHitTesting(false)
        }
      }
      .gesture(
        DragGesture(minimumDistance: 0, coordinateSpace: .named(PoolBallDrag.space))
          .onChanged { value in
            // Giữ đúng chỗ cầm: dời theo translation từ vị trí cũ, không nhảy tâm bi về ngón tay.
            dragging = CGPoint(x: position.x + value.translation.width, y: position.y + value.translation.height)
          }
          .onEnded { _ in
            guard let drop = dragging else { return }
            let n = geometry.normalized(drop)
            let x = (n.x * 1000).rounded() / 1000
            let y = (n.y * 1000).rounded() / 1000
            dragging = nil
            onDrop(ball, Double(x), Double(y))
          }
      )
  }

  static let space = "poolTable"
}
