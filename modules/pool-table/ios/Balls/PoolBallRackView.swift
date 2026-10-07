import ExpoModulesCore
import SwiftUI

final class PoolBallRackViewProps: ExpoSwiftUI.ViewProps {}

/// Màn soát bi: bi cái + 1–7 hàng trên, 8–15 hàng dưới.
struct PoolBallRackView: ExpoSwiftUI.View, ExpoSwiftUI.WithHostingView {
  @ObservedObject var props: PoolBallRackViewProps
  private let rows = [[0, 1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14, 15]]

  var body: some View {
    GeometryReader { proxy in
      let spacing: CGFloat = 6
      let diameter = min((proxy.size.width - spacing * 7) / 8, (proxy.size.height - spacing) / 2)
      VStack(spacing: spacing) {
        ForEach(rows, id: \.self) { row in
          HStack(spacing: spacing) {
            ForEach(row, id: \.self) { n in
              PoolBallView(number: n, diameter: diameter)
            }
          }
        }
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
  }
}
