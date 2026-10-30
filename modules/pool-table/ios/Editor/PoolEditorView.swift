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
  /// Màn drill: chỉ còn bàn và hai ô hình, không khay, không bảng cú, không kéo bi.
  @Field var stageOnly: Bool = false
  /// Màn drill: vùng đích và guide của drill vẽ thay nét dự đoán của editor. `id` rỗng là không có.
  @Field var drill: DrillRecord = DrillRecord()
  @Field var showGhostBall: Bool = true
  @Field var showTangentLine: Bool = true
  @Field var showCuePath: Bool = true
  @Field var showTarget: Bool = true
  /// Màn drill: JS tăng mỗi lần bấm Play shot; đổi số là chạy cú đang hiện từ đầu.
  @Field var playRev: Int = 0
  /// Drill có `shots`: cú đang xem, từ 0. JS tăng `shotRev` mỗi lần bấm cú trước/cú sau; đổi số là dựng bàn về thế trước cú đó.
  @Field var shotIndex: Int = 0
  @Field var shotRev: Int = 0
  /// Bắn lúc nhấc tay, mang cả state. Không bắn trong lúc kéo.
  var onCommit = EventDispatcher()
  /// Màn drill: chạm vùng đích. `label` rỗng là bỏ chọn.
  var onTargetPick = EventDispatcher()
}

/// Bàn soạn bài tập. Kéo bi 1:1, giữ đúng chỗ cầm.
struct PoolEditorView: ExpoSwiftUI.View, ExpoSwiftUI.WithHostingView {
  @ObservedObject var props: PoolEditorViewProps
  @StateObject private var model = PoolEditorModel()
  @Environment(\.accessibilityReduceMotion) private var reduceMotion
  private let theme = PoolTableTheme.tournament
  /// Khung bàn trong toạ độ của cả màn, để bi kéo từ khay biết rơi vào chỗ nào trên nỉ.
  @State private var tableFrame: CGRect = .zero
  @State private var carry: PoolBallTray.Carry?
  /// Màn drill: cú tới từng vùng đích, nil là đang dò. Vùng đang chọn và vệt của cú đó.
  @State private var targetShots: [DrillTargetSolver.Shot?]?
  @State private var targetPick: Int?
  @State private var targetReplay: ShotReplay?
  /// Drill có `shots`: cú bàn đang bày, 0 là thế gốc của drill.
  @State private var shownShot = 0
  /// Cú của round đã giải và bản chạy nền của nó: vệt engine thay cho đường vẽ tay, Play đánh đúng cú này.
  @State private var drillShot: DrillShot?
  @State private var drillPreview: ShotReplay?
  static let root = "poolEditorRoot"

  var body: some View {
    VStack(spacing: 0) {
      // Màn drill tự lo lề, view chỉ là khối bàn.
      stage
        .padding(.horizontal, props.stageOnly ? 0 : 16)
        .padding(.top, props.stageOnly ? 0 : 10)
      if !props.stageOnly {
        // Khay chỉ có ở Tự xếp bi: cảnh mẫu và bài điều bi không cho thêm bi.
        if model.demo == nil && model.lesson == nil {
          PoolBallTray(model: model, carry: $carry, onDrop: drop, onScatter: { model.scatter(); commit() })
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .transition(.opacity)
        }
        // Luôn hiện như bảng điều khiển của web: chưa có đường vào lỗ vẫn bấm được cú mẫu, lời Gợi ý nằm ở dòng trạng thái.
        PoolShotPanel(model: model) { commit() }
      }
    }
    .animation(reduceMotion ? .easeOut(duration: 0.2) : .timingCurve(0.23, 1, 0.32, 1, duration: 0.42), value: model.demo == nil && model.lesson == nil)
    .coordinateSpace(name: Self.root)
    // Bi đang cầm từ khay nổi trên mọi thứ, cỡ đúng bằng bi trên bàn để thả xuống là khớp.
    .overlay(alignment: .topLeading) {
      if let c = carry {
        PoolBallView(number: c.n, diameter: PoolTableGeometry(container: tableFrame.size).ballDiameter * PoolEditorModel.ballZoom)
          .equatable()
          .shadow(color: .black.opacity(0.45), radius: 6, y: 4)
          .position(c.at)
          .allowsHitTesting(false)
      }
    }
    .onAppear {
      model.adopt(props.state)
      replan()
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
    .onChange(of: props.state.rev) { _ in
      model.adopt(props.state)
      replan()
    }
    .task(id: props.drill.id) {
      solveTargets()
      if props.drill.skill == "runout", props.drill.shots.isEmpty { model.prefetchOpening(zone: DrillTargetSolver.zones(props.drill).first) }
    }
    .onChange(of: props.view) { _ in adoptView() }
    .onChange(of: props.fixture) { _ in applyPresetFixture() }
    .onChange(of: props.suggestRev) { _ in model.suggest { commit() } }
    .onChange(of: props.playRev) { _ in
      if props.drill.skill == "runout" || props.drill.skill == "railCut" || !props.drill.shots.isEmpty { return playRack() }
      model.replay = nil
      // Báo JS như rack báo `ended`, để drill mà round là chuỗi cú sang round kế khi vào sạch.
      // Kèm chỗ bi cái dừng (chuẩn hoá như `EditorStateRecord`) để round kế dựng bàn từ đó.
      let ball = model.aimBall.map(ShotPhysics.name) ?? "the target"
      // Bank, kick, combo, safety, break, nhảy, massé, rack của bài test, và cú tới băng: planner riêng dò cú theo guide.
      let planned = isPlanned
      model.onReplayEnd = { ok, cue in
        EditorHaptics.fire(ok ? .selection : .warning, ok ? planned || model.aimBall == nil ? "Shot made" : "Pocketed \(ball)" : cue == nil ? "Cue ball scratched" : "Missed \(ball)")
        var e: [String: Any] = ["label": "", "ended": true, "ok": ok, "shot": -1, "scratch": !ok && cue == nil]
        if let cue { e["cueX"] = Double(cue.x / PoolEditorModel.width); e["cueY"] = Double(cue.y / PoolEditorModel.length) }
        props.onTargetPick(e)
      }
      let blocked = {
        EditorHaptics.fire(.warning, "No clean shot on \(ball)")
        props.onTargetPick(["label": "", "ended": true, "ok": false, "shot": -1, "blocked": true])
      }
      if let rec = props.drill.replay, let r = model.videoReplay(rec, jump: reduceMotion) {
        model.play(r)
      } else if let s = drillShot, s.current(model) {
        model.play(s.replay(jump: reduceMotion))
      } else if planned {
        return model.playDrill(props.drill, jump: reduceMotion, blocked: blocked)
      } else {
        model.toggleReplay(reduceMotion: reduceMotion, aim: model.centerAim(props.drill))
      }
      // Guard của toggleReplay chặn cú bị bi khác che: báo luôn để JS hiện lý do thay vì im lặng.
      if model.replay == nil {
        model.onReplayEnd = nil
        blocked()
      }
    }
    .onChange(of: props.shotRev) { _ in showShot() }
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
          // Cảnh mẫu không bi mục tiêu: Dày mỏng mờ đi, Ngắm dài xuống bằng bàn, chỉ còn mặt bi cái và đầu cơ.
          let solo = model.demo != nil && model.balls[1] == nil
          ZStack(alignment: .top) {
            ForEach([EditorViewMode.top, .back]) { mode in
              let top = mode == .top
              PoolShotTile(fig: fig, mode: mode, tip: top && solo ? CGPoint(x: model.tipX, y: model.tipY) : nil) {
                model.replay = nil
                model.fig = mode
                model.figShown = true
              }
              .frame(width: tileW, height: top && solo ? H : tileH)
              .opacity(!top && solo ? 0 : 1)
              .scaleEffect(!top && solo ? 0.94 : 1)
              .offset(y: top ? 0 : tileH + 12)
              .allowsHitTesting(top || !solo)
            }
          }
          .frame(width: tileW, height: H, alignment: .top)
          .animation(reduceMotion ? .easeOut(duration: 0.2) : .timingCurve(0.23, 1, 0.32, 1, duration: 0.42), value: solo)
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
        // Chạm nỉ là thôi chọn lỗ, chạm đúp là đặt bi mới đúng chỗ đó. Bài điều bi đang đoán thì chạm là cắm điểm đoán.
        .contentShape(Rectangle())
        .gesture(
          SpatialTapGesture(count: 2)
            .onEnded { v in
              guard model.demo == nil, model.lesson == nil else { return }
              let n = geometry.normalized(v.location)
              if model.addBall(at: CGPoint(x: n.x * PoolEditorModel.width, y: n.y * PoolEditorModel.length)) { commit() }
            }
            .exclusively(before: SpatialTapGesture().onEnded { v in
              guard model.lesson != nil, model.guessing, model.replay == nil else { model.picking = nil; return }
              let n = geometry.normalized(v.location)
              model.place(guess: CGPoint(x: n.x * PoolEditorModel.width, y: n.y * PoolEditorModel.length))
            })
        )
      let racking = model.rack != nil
      // Đang xem cú sau của drill có `shots`: guide và zone vẽ theo thế bàn trước cú đó.
      let drill = !racking && shownShot > 0 && shownShot < props.drill.shots.count
        ? FixedShot.drill(props.drill, shot: shownShot, balls: model.balls) : props.drill
      if drill.id.isEmpty {
        PoolEditorGuides(model: model, geometry: geometry)
      } else {
        // Mỗi zone một vòng nhỏ cỡ bi, đích của cú đang tập sáng: round đã tách, vùng đã chọn, hay zone của cú trong `shots`.
        if props.showTarget {
          let zone = currentZone(drill)
          PoolZoneMarks(zones: drill.zoneMarks.isEmpty ? drill.cueBallTargetZones : drill.zoneMarks,
                        current: zone?.center, geometry: geometry)
        }
        // Đang chạy bàn: guide của drill chỉ đúng cho cú đầu, giấu đi cho khỏi lệch với bàn đang đổi.
        // Đã chọn vùng thì vệt mô phỏng thay cho tangent và đường bi cái vẽ tay của drill.
        // Cú chỉ có bi cái: drill không có guide, dùng đường dự đoán của bàn soạn.
        if !racking, drill.objectBalls.isEmpty {
          PoolEditorGuides(model: model, geometry: geometry)
        }
        if !racking {
        // Cú của round đã giải: vẽ vệt engine của chính cú Play sẽ đánh, đường vẽ tay chỉ còn là gợi ý cho planner.
        let preview = shownShot == 0 && targetReplay == nil && drillShot?.current(model) == true ? drillPreview : nil
        if let r = preview {
          PoolDrillPickLayer(replay: r, geometry: geometry, trails: model.replay == nil, ghost: props.showGhostBall)
        }
        PoolGuideLayer(
          drill: drill,
          geometry: geometry,
          visible: PoolGuideVisibility(
            ghostBall: props.showGhostBall,
            tangentLine: props.showTangentLine && targetReplay == nil,
            cuePath: props.showCuePath && targetReplay == nil,
            engine: preview != nil
          ),
          ballScale: PoolEditorModel.ballZoom
        )
        }
        // Chỉ vẽ lúc cú đang chạy: hết bàn hay nghỉ giữa hai cú thì bàn sạch. `run.over` không publish nên không bám vào nó.
        if racking, props.showTangentLine, model.replay != nil, let r = model.rack, r.next > 0, r.next <= r.steps.count {
          RackTangentLayer(setup: r.steps[r.next - 1].setup, geometry: geometry)
        }
        if !racking, let r = targetReplay, let i = targetPick, i < drill.cueBallTargetZones.count {
          // Đang chạy thì giấu vệt tĩnh, không lộ trước đường bi sắp chạy.
          PoolDrillPickLayer(replay: r, geometry: geometry, trails: model.replay == nil)
        }
      }
      ForEach(model.order, id: \.self) { n in
        // Bài điều bi không tới JS: kéo bi cái trong bài không commit.
        PoolEditorBall(number: n, model: model, geometry: geometry) { if model.lesson == nil { commit() } }
      }
      if drill.id.isEmpty {
        PoolEditorGuides(model: model, geometry: geometry, top: true)
      }
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
    .frame(width: box.width, height: box.height)
    // Drill là thế cố định: không kéo bi, không thêm bi, không chọn lỗ. Chỉ chạm được vùng đích.
    .allowsHitTesting(!props.stageOnly)
    .overlay(alignment: .topLeading) {
      if props.stageOnly, !props.drill.id.isEmpty, props.drill.shots.isEmpty {
        PoolDrillTargetPicker(zones: props.drill.cueBallTargetZones, geometry: geometry, picked: targetPick) { i in
          // Chạm lại vùng đang chọn là đánh lại. Bỏ chọn bằng chạm vùng khác hay rời màn.
          targetPick = i
          applyTarget()
        }
      }
    }
    .coordinateSpace(name: PoolEditorBall.space)
    .background(GeometryReader { g in
      let f = g.frame(in: .named(Self.root))
      Color.clear.onAppear { tableFrame = f }.onChange(of: f) { tableFrame = $0 }
    })
  }

  private func currentZone(_ drill: DrillRecord) -> TargetZoneRecord? {
    let zones = drill.cueBallTargetZones
    if !props.drill.shots.isEmpty {
      let i = model.rack != nil ? model.rack.flatMap { r in r.next > 0 && r.next <= r.steps.count ? r.steps[r.next - 1].shot : nil } : shownShot
      guard let i, i < props.drill.shots.count, zones.indices.contains(props.drill.shots[i].zone) else { return nil }
      return zones[props.drill.shots[i].zone]
    }
    if model.rack != nil { return nil }
    if zones.count == 1 { return zones[0] }
    return targetPick.flatMap { zones.indices.contains($0) ? zones[$0] : nil }
  }

  private var isPlanned: Bool {
    // Bank, kick, combo, safety, break, nhảy, massé, rack của bài test, và cú tới băng: planner riêng dò cú theo guide.
    DrillShotPlanner.skills.contains(props.drill.skill)
      || (model.aimBall != nil && model.aimPocket.map { !ShotPhysics.isPocket($0) } ?? false)
  }

  /// Bàn round mới về: giải cú một lần, đặt phê và lực lên model (ô Ngắm, Dày mỏng vẽ theo) và báo lực thật cho thẻ.
  /// Bỏ qua drill chạy bàn, drill có video replay, drill nhiều vùng đích của cú thường (`solveTargets` lo) và cú chỉ có bi cái.
  private func replan() {
    drillShot = nil
    drillPreview = nil
    let d = props.drill
    guard !d.id.isEmpty, d.skill != "runout", d.skill != "railCut", d.shots.isEmpty, d.replay == nil,
          d.cueBallTargetZones.count <= 1 || isPlanned, model.aimBall != nil else { return }
    let rev = props.state.rev
    model.planDrill(d, planned: isPlanned) { s in
      guard let s, props.state.rev == rev, props.drill.id == d.id else { return }
      model.tipX = s.tipX
      model.tipY = s.tipY
      model.theta = s.theta
      model.speed = s.speed
      drillShot = s
      drillPreview = s.replay(jump: true)
      props.onTargetPick(["label": "", "plan": true, "tipX": Double(s.tipX), "tipY": Double(s.tipY), "speed": Double(s.speed)])
    }
  }

  /// Đổi drill thì bỏ vùng đã chọn và dò lại cả lưới, chạy nền như Gợi ý.
  private func solveTargets() {
    model.stopRack()
    targetPick = nil
    targetReplay = nil
    targetShots = nil
    shownShot = 0
    let d = props.drill
    // Kiểm Expo Record có nạp mảng lồng `shots`: drill 23 phải ra 3.
    if !d.id.isEmpty { NSLog("[drill] %@ shots %d", d.id, d.shots.count) }
    // Drill có `shots`: cú và zone đã chép từ harness, không dò lại.
    // Planner lo cú của bank, safety, break…: vùng đích của các bài đó chỉ để chấm, không dò cú theo vùng.
    guard props.stageOnly, d.shots.isEmpty, !d.cueBallTargetZones.isEmpty, !DrillShotPlanner.skills.contains(d.skill),
          let ms = DrillTargetSolver.setup(d) else { return }
    let zones = DrillTargetSolver.zones(d), id = d.id
    if let hit = DrillTargetSolver.cache[id] { targetShots = hit; pickFirst(); return }
    DispatchQueue.global(qos: .userInitiated).async {
      let t0 = Date()
      let shots = DrillTargetSolver.solve(ms, zones)
      NSLog("[targets] %@ %.0f ms: %@", id, Date().timeIntervalSince(t0) * 1000, shots.enumerated().map { i, s in
        s.map {
          String(format: "%d a%.2f b%.2f v%.1f miss%.1f%@", i + 1, $0.tipX, $0.tipY, $0.speed, $0.miss, $0.inZone ? "" : "!")
        } ?? "\(i + 1) none"
      }.joined(separator: " | "))
      DispatchQueue.main.async {
        DrillTargetSolver.cache[id] = shots
        guard props.drill.id == id else { return }
        targetShots = shots
        if targetPick == nil { pickFirst() } else { applyTarget() }
      }
    }
  }

  /// Drill nhiều đích: chọn sẵn đích đầu để ô Shot và Play shot có cú ngay lúc mở màn. Không tự chạy, không rung.
  private func pickFirst() {
    guard props.drill.cueBallTargetZones.count > 1 else { return }
    targetPick = 0
    applyTarget(play: false)
  }

  /// Đặt cú của vùng đang chọn lên model (hai ô Ngắm, Dày mỏng vẽ theo) và báo JS. Bỏ chọn thì trả cú gợi ý của drill.
  private func applyTarget(play: Bool = true) {
    model.replay = nil
    guard let i = targetPick else {
      targetReplay = nil
      model.tipX = props.state.tipX
      model.tipY = props.state.tipY
      model.speed = props.state.speed
      props.onTargetPick(["label": ""])
      return
    }
    // Còn đang dò: kết quả về sẽ gọi lại.
    guard let shots = targetShots, i < shots.count else { return }
    let zone = props.drill.cueBallTargetZones[i]
    let label = zone.label ?? String(i + 1)
    guard let s = shots[i] else {
      targetReplay = nil
      props.onTargetPick(["label": label, "found": false])
      return
    }
    model.tipX = s.tipX
    model.tipY = s.tipY
    model.speed = s.speed
    targetReplay = model.shotSetup.map {
      ShotReplay($0, ball: model.aimBall ?? 1, tipX: s.tipX, tipY: s.tipY, speed: s.speed, jump: true)
    }
    if play { EditorHaptics.fire(.selection, "Zone \(label)") }
    props.onTargetPick([
      "label": label, "found": true, "tipX": Double(s.tipX), "tipY": Double(s.tipY),
      "speed": Double(s.speed), "miss": Double(s.miss), "inZone": s.inZone,
    ])
    // Chọn xong cho bi tự chạy. Reduce Motion: nhảy thẳng tới cuối, vệt tĩnh vẫn còn.
    if play { model.toggleReplay(reduceMotion: reduceMotion) }
  }

  /// Drill chạy bàn: bấm lúc đang chạy là dừng và trả bàn về đầu, bấm lúc rảnh hay đã xong là chạy lại từ đầu.
  /// Bấm lúc cú đầu còn đang dò thì bỏ qua: bàn chưa động nên bấm lần hai trông như "chưa ăn", không phải "dừng".
  /// Mỗi cú báo JS như một vùng đích để ô Shot hiện đúng cú đang đánh. Drill có `shots` chỉ đánh cú đang xem,
  /// xong thì báo `ended` để JS chuyển card và bàn sang cú kế.
  private func playRack() {
    if let r = model.rack, !r.over, r.steps.isEmpty { return }
    let busy = model.rack.map { !$0.over } ?? false
    model.stopRack()
    guard !busy else { return props.onTargetPick(["label": ""]) }
    let d = props.drill
    model.startRack(reduceMotion: reduceMotion, zone: DrillTargetSolver.zones(d).first, shots: d.shots,
                    from: d.shots.isEmpty ? 0 : min(shownShot, d.shots.count - 1)) { step in
      props.onTargetPick([
        "label": "Ball \(step.ball)", "found": true, "runout": true, "shot": step.shot,
        "tipX": Double(step.tipX), "tipY": Double(step.tipY), "speed": Double(step.speed),
      ])
    } onEnd: { last in
      props.onTargetPick(["label": "", "ended": true, "ok": last?.ok ?? false, "shot": last?.shot ?? -1])
    }
  }

  /// Drill có `shots`, bấm cú trước/cú sau: dừng chuỗi, chơi lại các cú trước từ thế gốc để bàn đứng đúng chỗ bi cái
  /// dừng thật, rồi đặt cú đó lên model cho hai ô Ngắm, Dày mỏng và Play shot.
  private func showShot() {
    model.stopRack()
    model.replay = nil
    let d = props.drill
    guard !d.shots.isEmpty else { return }
    let i = min(max(props.shotIndex, 0), d.shots.count - 1)
    var start: [Int: CGPoint] = [:]
    for b in props.state.balls { start[b.number] = CGPoint(x: b.x * PoolEditorModel.width, y: b.y * PoolEditorModel.length) }
    guard let cur = FixedShot.before(i, shots: d.shots, from: start) else { return NSLog("[shot] %@ %d: earlier shot misses", d.id, i + 1) }
    let s = d.shots[i]
    model.balls = cur
    model.aimBall = s.ball
    model.aimPocket = s.pocket
    model.tipX = CGFloat(s.tipX)
    model.tipY = CGFloat(s.tipY)
    model.speed = CGFloat(s.speed)
    shownShot = i
    let c = cur[0] ?? .zero
    NSLog("[shot] %@ %d/%d %d→%@ cue (%.1f,%.1f)", d.id, i + 1, d.shots.count, s.ball, s.pocket, c.x, c.y)
  }

  /// Chỉ để kiểm: `?fixture=preset:Draw` bấm cú mẫu đó, lúc mở màn hay khi đổi URL đang mở. Dòng NSLog commit cho thấy pad và lực.
  private func applyPresetFixture() {
    guard props.fixture.hasPrefix("preset:"),
          let p = PoolEditorModel.presets.first(where: { $0.name == props.fixture.dropFirst(7) }) else { return }
    model.apply(p)
    commit()
  }

  /// Thả bi từ khay: ngoài bàn thì bi về khay, trên nỉ thì đặt đúng chỗ thả.
  private func drop(_ n: Int, _ p: CGPoint) {
    guard tableFrame.contains(p) else { return }
    let q = PoolTableGeometry(container: tableFrame.size).normalized(CGPoint(x: p.x - tableFrame.minX, y: p.y - tableFrame.minY))
    if model.addBall(at: CGPoint(x: q.x * PoolEditorModel.width, y: q.y * PoolEditorModel.length), number: n) { commit() }
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
      // Cảnh mẫu không kéo được, như web chỉ cho xếp bàn ở Tự xếp bi. Bài điều bi chỉ cho kéo bi cái để thử chỗ khác.
      .allowsHitTesting(model.demo == nil && (model.lesson == nil || number == 0))
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

/// Khay bi dưới bàn: bi nào chưa lên bàn nằm ở đây, kéo thả lên nỉ. Bi nhấc cao hơn ngón tay để thấy chỗ thả.
struct PoolBallTray: View {
  struct Carry { var n: Int; var at: CGPoint }
  @ObservedObject var model: PoolEditorModel
  @Binding var carry: Carry?
  let onDrop: (Int, CGPoint) -> Void
  let onScatter: () -> Void
  static let lift: CGFloat = 36

  var body: some View {
    let missing = (0...9).filter { model.balls[$0] == nil }
    HStack(spacing: 0) {
      if missing.isEmpty {
        Text("Drop a ball in a pocket to return it to the tray")
          .font(.custom("BeVietnamPro-Medium", size: 13, relativeTo: .footnote))
          .foregroundStyle(PoolShotPanel.secondary)
          .padding(.leading, 12)
      }
      ForEach(missing, id: \.self) { n in
        PoolBallView(number: n, diameter: 26).equatable()
          .opacity(carry?.n == n ? 0.25 : 1)
          .frame(width: 34, height: 44)
          .contentShape(Rectangle())
          .gesture(
            DragGesture(minimumDistance: 0, coordinateSpace: .named(PoolEditorView.root))
              .onChanged { v in
                if carry == nil { EditorHaptics.fire(.light, "Picked up \(ShotPhysics.name(n))") }
                carry = Carry(n: n, at: CGPoint(x: v.location.x, y: v.location.y - Self.lift))
              }
              .onEnded { v in
                carry = nil
                onDrop(n, CGPoint(x: v.location.x, y: v.location.y - Self.lift))
              }
          )
          .accessibilityElement()
          .accessibilityLabel(ShotPhysics.name(n).capitalized)
          .accessibilityHint("Drag onto the table to place")
          .accessibilityAction(named: "Place on table") {
            if let p = model.freeSpot(), model.addBall(at: p, number: n) { onScatter() }
          }
          .transition(.scale.combined(with: .opacity))
      }
      Spacer(minLength: 0)
      Button(action: onScatter) {
        Image(systemName: "shuffle")
          .font(.system(size: 15, weight: .semibold))
          .foregroundStyle(PoolShotPanel.ink)
          .frame(width: 44, height: 44)
      }
      .buttonStyle(PoolPressStyle())
      .accessibilityLabel(missing.isEmpty ? "Re-spread balls" : "Spread all balls on the table")
    }
    .frame(height: 44)
    .background(Capsule().fill(Color.white.opacity(0.06)))
    .animation(.timingCurve(0.23, 1, 0.32, 1, duration: 0.3), value: missing)
  }
}
