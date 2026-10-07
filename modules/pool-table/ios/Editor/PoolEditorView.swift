import ExpoModulesCore
import SwiftUI

final class PoolEditorViewProps: ExpoSwiftUI.ViewProps {
  @Field var state: EditorStateRecord = EditorStateRecord()
  /// Chỉ để kiểm: "d03" thì NSLog ba cú mẫu lúc mở.
  @Field var fixture: String = ""
  /// Bắn lúc nhấc tay, mang cả state. Không bắn trong lúc kéo.
  var onCommit = EventDispatcher()
}

/// Bàn soạn bài tập. Kéo bi 1:1, giữ đúng chỗ cầm.
struct PoolEditorView: ExpoSwiftUI.View, ExpoSwiftUI.WithHostingView {
  @ObservedObject var props: PoolEditorViewProps
  @StateObject private var model = PoolEditorModel()
  private let theme = PoolTableTheme.tournament

  var body: some View {
    VStack(spacing: 0) {
      table
      // Chưa có đường vào lỗ thì chỗ này để trống, khay bi ở bước sau.
      if model.aimBall != nil && model.aimPocket != nil {
        PoolShotPanel(model: model) { commit() }
      } else {
        Color.clear.frame(height: PoolShotPanel.height)
      }
    }
    .onAppear {
      model.adopt(props.state)
      if props.fixture == "d03" { ShotPhysicsFixture.logDrill03(model) }
    }
    .onChange(of: props.state.rev) { _ in model.adopt(props.state) }
  }

  private var table: some View {
    GeometryReader { proxy in
      let geometry = PoolTableGeometry(container: proxy.size)
      ZStack(alignment: .topLeading) {
        PoolTableSurface(geometry: geometry, theme: theme).equatable()
          // Chạm nỉ là thôi chọn lỗ.
          .contentShape(Rectangle())
          .onTapGesture { model.picking = nil }
        PoolEditorGuides(model: model, geometry: geometry)
        ForEach(model.order, id: \.self) { n in
          PoolEditorBall(number: n, model: model, geometry: geometry) { commit() }
        }
        PoolEditorContactPoint(model: model, geometry: geometry)
        if let r = model.replay {
          PoolShotReplayLayer(replay: r, geometry: geometry).transition(.opacity)
        }
        if model.picking != nil {
          PoolEditorPocketPicker(geometry: geometry) { pocket in
            model.choose(pocket: pocket)
            commit()
          }
        }
      }
      .frame(width: proxy.size.width, height: proxy.size.height)
      .coordinateSpace(name: PoolEditorBall.space)
    }
  }

  private func commit() {
    props.onCommit(model.snapshot())
  }
}

/// Một bi kéo được. Vùng chạm 44pt dù bi vẽ nhỏ hơn.
struct PoolEditorBall: View {
  let number: Int
  @ObservedObject var model: PoolEditorModel
  let geometry: PoolTableGeometry
  let onDrop: () -> Void
  @State private var grab: CGPoint?

  var body: some View {
    let p = model.balls[number] ?? .zero
    let picked = model.picking == number
    // Đang chạy thử thì bi cái và bi mục tiêu thật nhường chỗ cho bản chạy.
    let replaced = model.replay.map { number == 0 || number == $0.ball } ?? false
    ZStack {
      PoolBallView(number: number, diameter: geometry.ballDiameter).equatable()
      if picked {
        Circle()
          .stroke(PoolAimPalette.gold, lineWidth: max(1, 0.22 * geometry.scale))
          .frame(width: geometry.ballDiameter + 0.9 * geometry.scale, height: geometry.ballDiameter + 0.9 * geometry.scale)
      }
    }
      .opacity(replaced ? 0 : model.picking != nil && !picked ? 0.4 : 1)
      .frame(width: 44, height: 44)
      .contentShape(Rectangle())
      .position(geometry.point(inchesX: p.x, inchesY: p.y))
      .zIndex(model.dragging == number ? 1 : 0)
      .gesture(
        DragGesture(minimumDistance: 0, coordinateSpace: .named(Self.space))
          .onChanged { value in
            let start = grab ?? p
            if grab == nil { grab = p; model.dragging = number; model.replay = nil }
            let s = geometry.scale
            let r = PoolTableSpec.ballDiameter / 2
            model.balls[number] = CGPoint(
              x: min(max(start.x + value.translation.width / s, r), PoolEditorModel.width - r),
              y: min(max(start.y + value.translation.height / s, r), PoolEditorModel.length - r)
            )
          }
          .onEnded { value in
            let start = grab ?? p
            grab = nil
            model.dragging = nil
            // Dịch dưới 10pt là chạm, không phải kéo: bi về chỗ cũ.
            if hypot(value.translation.width, value.translation.height) < 10 {
              model.balls[number] = start
              model.tapBall(number)
              return
            }
            model.picking = nil
            onDrop()
          }
      )
  }

  static let space = "poolEditor"
}
