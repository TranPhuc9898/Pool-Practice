import ExpoModulesCore
import SwiftUI

final class PoolTableViewProps: ExpoSwiftUI.ViewProps {
  @Field var drill: DrillRecord = DrillRecord()
  @Field var showGeometry: Bool = false
  @Field var showGuide: Bool = true
  @Field var showGhostBall: Bool = true
  @Field var showTangentLine: Bool = true
  @Field var showCuePath: Bool = true
  @Field var showTarget: Bool = true
  /// Dev mode: kéo được bi, thả tay bắn `onBallMove` { ball, x, y }.
  @Field var devMode: Bool = false
  var onBallMove = EventDispatcher()
}

/// Toạ độ chuẩn hoá: x theo chiều ngang 50", y theo chiều dọc 100", head rail ở dưới (y = 1).
struct PoolTableView: ExpoSwiftUI.View, ExpoSwiftUI.WithHostingView {
  @ObservedObject var props: PoolTableViewProps
  private let theme = PoolTableTheme.tournament
  /// Vị trí vừa thả (chuẩn hoá), giữ bi đứng yên tới khi JS gửi drill mới. Đổi drill thì xoá.
  @State private var moved: [Int: CGPoint] = [:]

  var body: some View {
    let drill = props.drill
    GeometryReader { proxy in
      let geometry = PoolTableGeometry(container: proxy.size)
      let ball = geometry.ballDiameter
      ZStack(alignment: .topLeading) {
        PoolTableSurface(geometry: geometry, theme: theme).equatable()
        if props.showTarget {
          PoolTargetLayer(drillId: drill.id, zones: drill.cueBallTargetZones, geometry: geometry)
        }
        if props.showGuide {
          PoolGuideLayer(
            drill: drill,
            geometry: geometry,
            visible: PoolGuideVisibility(
              ghostBall: props.showGhostBall,
              tangentLine: props.showTangentLine,
              cuePath: props.showCuePath
            )
          )
        }

        ForEach(Array(drill.objectBalls.enumerated()), id: \.offset) { _, object in
          ballView(object.number, x: object.x, y: object.y, diameter: ball, geometry: geometry)
        }
        ballView(0, x: drill.cueBall.x, y: drill.cueBall.y, diameter: ball, geometry: geometry)

        if props.showGeometry {
          PoolTableDebugOverlay(geometry: geometry, theme: theme, renderedBallDiameter: ball).equatable()
        }
      }
      .frame(width: proxy.size.width, height: proxy.size.height)
      .coordinateSpace(name: PoolBallDrag.space)
    }
    .onChange(of: drill.id) { _ in moved = [:] }
  }

  @ViewBuilder
  private func ballView(_ number: Int, x: Double, y: Double, diameter: CGFloat, geometry: PoolTableGeometry) -> some View {
    let n = moved[number] ?? CGPoint(x: x, y: y)
    let position = geometry.point(x: n.x, y: n.y)
    if props.devMode {
      PoolBallView(number: number, diameter: diameter)
        .modifier(PoolBallDrag(ball: number, geometry: geometry, position: position) { ball, x, y in
          moved[ball] = CGPoint(x: x, y: y)
          props.onBallMove(["ball": ball, "x": x, "y": y])
        })
    } else {
      PoolBallView(number: number, diameter: diameter)
        .position(position)
    }
  }
}
