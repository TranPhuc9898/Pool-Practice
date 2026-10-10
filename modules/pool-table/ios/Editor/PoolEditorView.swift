import ExpoModulesCore
import SwiftUI

final class PoolEditorViewProps: ExpoSwiftUI.ViewProps {
  @Field var state: EditorStateRecord = EditorStateRecord()
  /// Chỉ để kiểm: "d03" thì NSLog bốn cú mẫu lúc mở.
  @Field var fixture: String = ""
  /// Chỉ để kiểm: mở thẳng một góc nhìn ("top", "back") lúc mở màn.
  @Field var view: String = ""
  /// JS tăng mỗi lần bấm "Thẻ bài" trên thanh tiêu đề; đổi số là mở sheet.
  @Field var cardRev: Int = 0
  /// JS tăng mỗi lần bấm "Gợi ý" trên thanh tiêu đề; đổi số là chạy planner.
  @Field var suggestRev: Int = 0
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
      stage
        .padding(.horizontal, 16)
        .padding(.top, 10)
      // Chưa có đường vào lỗ thì chỗ này để trống, chỉ hiện lời Gợi ý nếu có.
      if model.aimBall != nil && model.aimPocket != nil {
        PoolShotPanel(model: model) { commit() }
      } else {
        Text(model.hintText ?? "")
          .font(.custom("BeVietnamPro-Medium", size: 15, relativeTo: .subheadline))
          .foregroundStyle(PoolShotPanel.secondary)
          .padding(.top, 24)
          .frame(maxWidth: .infinity, alignment: .top)
          .frame(height: PoolShotPanel.height, alignment: .top)
      }
    }
    .onAppear {
      model.adopt(props.state)
      adoptView()
      // Chỉ để kiểm: `?card=1` mở thẻ ngay lúc mở màn, onChange không bắn cho giá trị đầu.
      if props.cardRev > 0 { model.card = true }
      if props.fixture == "d03" { ShotPhysicsFixture.logDrill03(model) }
      // Chỉ để kiểm: `?fixture=play` chạy thử, `play@0.9` dừng hình ở giây mô phỏng 0,9.
      if props.fixture.hasPrefix("play") {
        let at = props.fixture.split(separator: "@").dropFirst().first.flatMap { Double($0) }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
          model.toggleReplay(reduceMotion: false)
          if let at { model.scrubReplay(to: CGFloat(at)) }
        }
      }
      applyPresetFixture()
      // Chỉ để kiểm: `?suggest=1` chạy Gợi ý ngay lúc mở màn.
      if props.suggestRev > 0 { model.suggest { commit() } }
    }
    // Sheet hệ thống: kéo xuống để đóng, hai mức, không tự viết animation.
    .sheet(isPresented: $model.card) { PoolShotCard(model: model) }
    .onChange(of: props.state.rev) { _ in model.adopt(props.state) }
    .onChange(of: props.view) { _ in adoptView() }
    .onChange(of: props.fixture) { _ in applyPresetFixture() }
    .onChange(of: props.suggestRev) { _ in model.suggest { commit() } }
    .onChange(of: props.cardRev) { _ in
      model.replay = nil
      model.card = true
    }
    // Hình phủ lên bàn thì dừng chạy thử, chạy thử luôn diễn trên bàn.
    .onChange(of: model.figShown) { shown in if shown { model.replay = nil } }
  }

  private func adoptView() {
    guard let v = EditorViewMode(rawValue: props.view) else { return }
    if v == .table { model.figShown = false } else { model.fig = v; model.figShown = true }
  }

  /// Bàn bên trái, hai ô hình chồng nhau bên phải. Chạm ô thì hình nở ra phủ cả vùng, thu về đúng ô đó.
  private var stage: some View {
    GeometryReader { proxy in
      // Bàn giữ tỉ lệ dọc 61×111, nhường cột ô tối thiểu 96pt.
      let ratio = (PoolTableSpec.playWidth + 2 * PoolTableSpec.railWidth) / (PoolTableSpec.playLength + 2 * PoolTableSpec.railWidth)
      let W = proxy.size.width, H = proxy.size.height
      let tableW = max(0, min(H * ratio, W - 12 - 96))
      let tileW = W - 12 - tableW, tileH = max(0, (H - 12) / 2)
      let fig = ShotFigure(model)
      ZStack(alignment: .topLeading) {
        HStack(alignment: .top, spacing: 12) {
          table(CGSize(width: tableW, height: H))
          VStack(spacing: 12) {
            ForEach([EditorViewMode.top, .back]) { mode in
              PoolShotTile(fig: fig, mode: mode) {
                model.replay = nil
                model.fig = mode
                model.figShown = true
              }
              .frame(width: tileW, height: tileH)
            }
          }
        }
        if let fig {
          PoolShotFigureOverlay(
            model: model, fig: fig, area: proxy.size,
            tile: CGRect(x: tableW + 12, y: model.fig == .back ? tileH + 12 : 0, width: tileW, height: tileH)
          )
        }
      }
    }
  }

  private func table(_ box: CGSize) -> some View {
    let geometry = PoolTableGeometry(container: box)
    return ZStack(alignment: .topLeading) {
      PoolTableSurface(geometry: geometry, theme: theme).equatable()
        // Chạm nỉ là thôi chọn lỗ, chạm đúp là đặt bi mới đúng chỗ đó.
        .contentShape(Rectangle())
        .gesture(
          SpatialTapGesture(count: 2)
            .onEnded { v in
              let n = geometry.normalized(v.location)
              if model.addBall(at: CGPoint(x: n.x * PoolEditorModel.width, y: n.y * PoolEditorModel.length)) { commit() }
            }
            .exclusively(before: TapGesture().onEnded { model.picking = nil })
        )
      PoolEditorGuides(model: model, geometry: geometry)
      ForEach(model.order, id: \.self) { n in
        PoolEditorBall(number: n, model: model, geometry: geometry) { commit() }
      }
      PoolEditorContactPoint(model: model, geometry: geometry)
      if let r = model.replay {
        PoolShotReplayLayer(replay: r, geometry: geometry, showAxis: model.showPaths).transition(.opacity)
      }
      if model.picking != nil {
        PoolEditorPocketPicker(geometry: geometry) { pocket in
          model.choose(pocket: pocket)
          commit()
        }
      }
    }
    .frame(width: box.width, height: box.height)
    .coordinateSpace(name: PoolEditorBall.space)
  }

  /// Chỉ để kiểm: `?fixture=preset:Kéo` bấm cú mẫu đó, lúc mở màn hay khi đổi URL đang mở. Dòng NSLog commit cho thấy pad và lực.
  private func applyPresetFixture() {
    guard props.fixture.hasPrefix("preset:"),
          let p = PoolEditorModel.presets.first(where: { $0.name == props.fixture.dropFirst(7) }) else { return }
    model.apply(p)
    commit()
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
    // Đang chạy thử thì bi cái, bi mục tiêu và bi nào bị đụng nhường chỗ cho bản chạy.
    let replaced = model.replay.map { number == 0 || number == $0.ball || $0.others[number] != nil } ?? false
    let d = geometry.ballDiameter * PoolEditorModel.ballZoom
    ZStack {
      PoolBallView(number: number, diameter: d).equatable()
      if picked {
        Circle()
          .stroke(PoolAimPalette.gold, lineWidth: max(1, 0.22 * geometry.scale))
          .frame(width: d + 0.9 * geometry.scale, height: d + 0.9 * geometry.scale)
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
            _ = model.pocketIfDropped(number)
            onDrop()
          }
      )
  }

  static let space = "poolEditor"
}
