import SwiftUI

/// Bảng cú đánh dưới bàn, port card của Soạn bài v5.2: chữ cho người mới, không đơn vị, số đo nằm trong hình.
/// Hàng 1: mặt bi cái 2D và cột chữ. Hàng 2: lực. Hàng 3: Đường đi và Đánh. Kéo chỉ đổi model, nhấc tay mới commit.
/// Lúc chạy thử: cột chữ thành số đo sống (tốc bi, ρ, phê, spin tổng, trục quay) và hàng lực thành thanh tua,
/// cùng bộ số với bảng đọc của trang bi-cai-xoay.html. Chạy thử luôn ở tốc độ thật 1×.
struct PoolShotPanel: View {
  @ObservedObject var model: PoolEditorModel
  let onCommit: () -> Void
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  /// Card 318 như HTML cộng hàng cú mẫu 44, rồi 12 hở trên và 8 lề dưới. JS để native view flex nên chỉ đổi ở đây.
  static let height: CGFloat = 382
  static let cardHeight: CGFloat = 362
  /// Thang tốc độ bi cái của Dr. Dave: chậm 0.45–0.89, vừa 0.89–1.9, nhanh 1.9–3.2, mạnh 3.2–4.5 m/s.
  /// Mốc đặt giữa từng khoảng. Phá bi (11 m/s trở lên) không thuộc bảng này.
  static let vMin: CGFloat = 0.3
  static let vMax: CGFloat = 4.5
  static let marks: [(v: CGFloat, label: String)] = [(0.7, "Soft"), (1.4, "Medium"), (2.5, "Firm"), (3.8, "Power")]

  static let ink = Color(hex: 0xF5F5F7)
  static let secondary = Color(red: 235 / 255, green: 235 / 255, blue: 245 / 255).opacity(0.6)

  var body: some View {
    let s = ShotPanelState(model)
    VStack(spacing: 0) {
      presets
        .padding(.bottom, 12)
      HStack(alignment: .center, spacing: 12) {
        PoolTipPad(model: model, stun: s.stun, stunWord: s.stunWord, gear: s.lastGear, slip: s.slip, onCommit: onCommit)
        if let r = model.replay { PoolReplayReads(replay: r) } else { column(s) }
      }
      .frame(height: 128)
      Group {
        if let r = model.replay { PoolReplayScrub(model: model, replay: r) } else { power }
      }
      .padding(.top, 14)
      HStack(spacing: 10) {
        paths
        shoot(s)
      }
      .padding(.top, 18)
    }
    .padding(EdgeInsets(top: 20, leading: 20, bottom: 26, trailing: 20))
    .frame(maxWidth: .infinity)
    .frame(height: Self.cardHeight)
    .background(RoundedRectangle(cornerRadius: 36, style: .continuous).fill(Color(hex: 0x1C1C1E)))
    .overlay(RoundedRectangle(cornerRadius: 36, style: .continuous).stroke(Color.white.opacity(0.08), lineWidth: 0.5))
    .shadow(color: .black.opacity(0.45), radius: 16, y: -8)
    .padding(.horizontal, 8)
    .padding(.top, 12)
    .padding(.bottom, 8)
    .frame(height: Self.height)
  }

  /// Hàng cú mẫu, cuộn ngang, như hàng preset của web. Tự xếp bi là bàn của bài, chip khác bày cảnh mẫu của web.
  /// Cảnh mẫu không đổi bài nên không commit.
  private var presets: some View {
    ScrollView(.horizontal, showsIndicators: false) {
      HStack(spacing: 8) {
        chip("Auto rack", on: model.demo == nil && model.lesson == nil) { model.layout() }
        // Một chip cho cả bộ bài điều bi: chạm lần nữa là sang bài kế. Bi cái đã kéo đi thì chạm là đưa về chỗ của bài.
        let n = PoolEditorModel.positions.count, moved = model.cueMoved
        chip(model.lesson.map { "\(moved ? "Reset" : "Position") \($0 + 1)/\(n)" } ?? "Position", on: model.lesson != nil) {
          model.play(model.lesson.map { moved ? $0 : ($0 + 1) % n } ?? 0)
        }
        .accessibilityHint(moved ? "Return the cue ball to the lesson spot"
          : model.position.map { $0.lesson + ". Drag the cue ball to try another spot, tap again for the next lesson" } ?? "Pot ball 1, leave the cue ball in the zone for ball 2")
        ForEach(PoolEditorModel.presets) { p in
          chip(p.name, on: model.demo?.id == p.id) { model.apply(p) }
        }
      }
      .padding(.horizontal, 20)
    }
    .padding(.horizontal, -20)
    .frame(height: 32)
  }

  private func chip(_ name: String, on: Bool, action: @escaping () -> Void) -> some View {
    Button(action: action) {
      Text(name)
        .font(.custom("BeVietnamPro-SemiBold", size: 13, relativeTo: .footnote))
        .foregroundStyle(on ? Color(hex: 0x1B1504) : Self.ink)
        .padding(.horizontal, 12)
        .frame(height: 32)
        .background(Capsule().fill(on ? PoolAimPalette.gold : Color.white.opacity(0.08)))
        .contentShape(Capsule())
    }
    .buttonStyle(PoolPressStyle())
    .accessibilityAddTraits(on ? .isSelected : [])
  }

  /// Cột chữ bên phải pad: điểm đánh, phê (ẩn khi không phê), bi trắng sau chạm, trạng thái.
  private func column(_ s: ShotPanelState) -> some View {
    let dot = s.kind.map { PoolEditorGuides.spin[$0] } ?? Color(red: 235 / 255, green: 235 / 255, blue: 245 / 255).opacity(0.3)
    return VStack(alignment: .leading, spacing: 0) {
      // Đang bày cú mẫu và chưa chỉnh đầu cơ thì gọi đúng tên cú mẫu, không suy từ vùng của pad.
      Text(model.demo.flatMap { $0.tipX == model.tipX && $0.tipY == model.tipY ? $0.name : nil }
        ?? model.position.flatMap { model.tipX == 0 && $0.tipY == model.tipY ? $0.name : nil } ?? s.tipText)
        .font(.custom("BeVietnamPro-SemiBold", size: 26, relativeTo: .title2))
        .tracking(-0.5)
        .lineLimit(2)
        .minimumScaleFactor(0.7)
        .foregroundStyle(s.slip ? PoolEditorGuides.red : Self.ink)
        .frame(minHeight: 30)
      if !s.sideText.isEmpty {
        Text(s.sideText)
          .font(.custom("BeVietnamPro-Medium", size: 15, relativeTo: .subheadline))
          .foregroundStyle(Self.secondary)
          .frame(minHeight: 20)
      }
      HStack(spacing: 7) {
        Circle().fill(dot).frame(width: 8, height: 8)
        Text(s.spinText)
          .font(.custom("BeVietnamPro-Medium", size: 15, relativeTo: .subheadline))
          .foregroundStyle(Self.ink)
      }
      .frame(minHeight: 20)
      .padding(.top, 10)
      Text(s.statusText)
        .font(.custom("BeVietnamPro-Medium", size: 13, relativeTo: .footnote))
        .foregroundStyle(s.statusBad ? PoolEditorGuides.red : s.statusGood ? ShotFigure.pot : Self.secondary)
        .frame(minHeight: 18)
        .padding(.top, 6)
    }
    .lineLimit(1)
    .truncationMode(.tail)
    .frame(maxWidth: .infinity, alignment: .leading)
  }

  /// Hàng Lực: chữ vàng, kèm số m/s nhỏ để so được với trang web (`Vừa · 1,8 m/s`). Thanh kéo bên dưới.
  private var power: some View {
    VStack(spacing: 10) {
      HStack {
        Text("Speed")
          .font(.custom("BeVietnamPro-Medium", size: 15, relativeTo: .subheadline))
          .foregroundStyle(Self.secondary)
        Spacer()
        Text(Self.powerWord(model.speed))
          .font(.custom("BeVietnamPro-SemiBold", size: 17, relativeTo: .body))
          .foregroundStyle(PoolAimPalette.gold)
        Text("· \(PoolReplayScrub.num(model.speed, 1)) m/s")
          .font(.custom("BeVietnamPro-Medium", size: 13, relativeTo: .footnote))
          .foregroundStyle(Self.secondary)
          .monospacedDigit()
      }
      .frame(height: 24)
      PoolPowerTrack(model: model, onCommit: onCommit)
    }
  }

  /// Bật tắt đường bi cái và bi mục tiêu. Bấm nhiều nên không animation, đổi icon và độ sáng là đủ.
  /// Trong bài điều bi nút thành Đoán: bật thì giấu đường đi, chạm bàn để đoán chỗ bi cái dừng.
  private var paths: some View {
    let lesson = model.lesson != nil, on = lesson ? model.guessing : model.showPaths
    return Button {
      if lesson { model.guessing.toggle(); model.guess = nil; model.guessed = nil } else { model.showPaths.toggle() }
    } label: {
      HStack(spacing: 8) {
        Image(systemName: lesson ? "scope" : on ? "eye" : "eye.slash").font(.system(size: 20))
        Text(lesson ? "Guess" : "Path").font(.custom("BeVietnamPro-Medium", size: 15, relativeTo: .subheadline)).fixedSize()
        // Chuỗi đoán trúng của bài, số gold cạnh chữ. Trượt là về 0 và ẩn.
        if lesson, let s = model.streak, s.now > 0 {
          Text("\(s.now)")
            .font(.custom("BeVietnamPro-SemiBold", size: 15, relativeTo: .subheadline))
            .foregroundStyle(PoolAimPalette.gold)
            .monospacedDigit()
        }
      }
      .foregroundStyle(Self.ink)
      .padding(.horizontal, 16)
      .frame(height: 50)
      .background(Capsule().fill(Color.white.opacity(on ? 0.16 : 0.08)))
      .contentShape(Capsule())
    }
    .buttonStyle(PoolPressStyle())
    .accessibilityAddTraits(on ? .isSelected : [])
    .accessibilityValue(lesson ? model.streak.map { "Streak \($0.now), best \($0.best)" } ?? "" : "")
    .accessibilityHint(lesson ? "Turn on, then tap the table to guess where the cue ball stops. The answer shows after the shot"
      : "Off shows only the aim line from cue ball to object ball")
  }

  private func shoot(_ s: ShotPanelState) -> some View {
    let playing = model.replay != nil, held = model.replay?.paused != nil
    return Button {
      if held { model.resumeReplay() } else { model.toggleReplay(reduceMotion: reduceMotion) }
    } label: {
      HStack(spacing: 8) {
        Image(systemName: playing && !held ? "stop.fill" : "play.fill").font(.system(size: 16, weight: .semibold))
        Text(held ? "Resume" : playing ? "Stop" : "Shoot").font(.custom("BeVietnamPro-SemiBold", size: 17, relativeTo: .body))
      }
      .foregroundStyle(Color(hex: 0x1B1504))
      .frame(maxWidth: .infinity)
      .frame(height: 50)
      .background(Capsule().fill(PoolAimPalette.gold))
      .contentShape(Capsule())
    }
    .buttonStyle(PoolPressStyle())
    .disabled(!s.ran && !playing)
    .opacity(s.ran || playing ? 1 : 0.4)
    .accessibilityHint(held ? "Resume from where it paused" : playing ? "Stop the test run" : "Test this shot on the table")
  }

  /// Thanh lực: thumb 28 nằm trong 14…W−14, thang bậc hai như HTML (`pos = sqrt((v−0.3)/4.2)`).
  static func pos(of v: CGFloat) -> CGFloat { sqrt(min(max((v - vMin) / (vMax - vMin), 0), 1)) }
  static func x(of v: CGFloat, width: CGFloat) -> CGFloat { 14 + pos(of: v) * (width - 28) }
  static func v(at x: CGFloat, width: CGFloat) -> CGFloat {
    let k = min(max((x - 14) / max(width - 28, 1), 0), 1)
    return vMin + k * k * (vMax - vMin)
  }
  static func fmt1(_ v: CGFloat) -> String { String(format: "%.1f", Double(v)) }
  static func powerWord(_ v: CGFloat) -> String {
    v < 0.45 ? "Touch" : v < 0.89 ? "Soft" : v < 1.9 ? "Medium" : v < 3.2 ? "Firm" : "Power"
  }
}

/// Mọi chữ trên bảng, tính một lần mỗi lần body chạy. Thẻ bài đọc lại đúng các chữ này.
/// Tiếng lóng bàn bida: culê (đánh trên tâm), kéo (dưới tâm), phê (ép phê, lệch ngang).
struct ShotPanelState {
  let slip, ran, sunk, statusBad, statusGood: Bool
  let stun, lastGear: CGFloat?
  /// 0 kéo về, 1 dừng/ngang, 2 chạy theo lúc chạm; nil là chưa mô phỏng.
  let kind: Int?
  /// Chỗ bi cái dừng, chỉ khi cú chạy và trắng không rơi lỗ.
  let stop: CGPoint?
  /// Nhãn vạch stun trên pad: cú thẳng thì trắng dừng, cắt góc thì trắng đi ngang.
  let stunWord: String
  let tipText, sideText, spinText, statusText: String

  init(_ m: PoolEditorModel) {
    let verdict = m.aimBall.flatMap { b in m.aimPocket.flatMap { ShotPhysics.shotOf(ball: b, pocket: $0, balls: m.balls) } }
    let ms = verdict?.level == .bad ? nil : m.shotSetup
    let run = ms.map { ShotPhysics.runWith($0, tipX: m.tipX, tipY: m.tipY, theta: m.theta, speed: m.speed) }
    let name = m.aimBall.map { ShotPhysics.name($0) } ?? "ball"
    let cut = verdict?.cut ?? 0
    slip = hypot(m.tipX, m.tipY) > ShotPhysics.tipMax + 0.001
    // Cảnh mẫu đánh theo hướng cố định như web, không cần tới bi nào.
    ran = !slip && (m.demo != nil || (run != nil && run?.short != .cue))
    sunk = run?.scratch != nil
    stop = ran && !sunk ? run?.stop : nil
    stun = ms.flatMap { ShotPhysics.stunTip($0, speed: m.speed) }
    lastGear = ran ? run.flatMap { abs($0.gear) < 0.6 ? ($0.gear * 100).rounded() / 100 : nil } : nil
    stunWord = cut < 5 ? "Stop" : "Stun"

    let ay = abs(m.tipY), vw = m.tipY > 0 ? "Follow" : "Draw"
    tipText = slip ? "Miscue" : ay < 0.05 ? "Center" : ay < 0.2 ? "Light " + vw.lowercased() : ay < 0.45 ? vw : "Strong " + vw.lowercased()
    let ax = abs(m.tipX)
    sideText = slip || ax < 0.03 ? "" : (ax < 0.2 ? "Light " : ax < 0.5 ? "" : "Strong ") + (m.tipX > 0 ? "right" : "left") + " english"

    var good = false, text = "", bad = false
    if let v = verdict, v.level == .bad { text = v.why.prefix(1).uppercased() + v.why.dropFirst(); bad = true }
    else if slip { text = "Can't play this"; bad = true }
    else if run?.short == .cue { text = "Too soft"; bad = true }
    else if let r = run, r.short == .ob {
      text = r.ob.hit.map { "\(name.capitalized) hits \(ShotPhysics.name($0))" }
        ?? (r.toRail ? "\(name.capitalized) doesn't reach the rail" : r.ob.bounces > 0 ? "\(name.capitalized) misses the pocket" : "\(name.capitalized) comes up short")
      bad = true
    }
    else if let r = run, r.toRail { text = sunk ? "Hits the rail, but the cue ball scratches" : "\(name.capitalized) hits the rail"; bad = sunk; good = !sunk }
    else if sunk { text = "Pocketed, but the cue ball scratches"; bad = true }
    else if run != nil { text = "\(name.capitalized) pocketed"; good = true }
    // Bài điều bi, chế độ đoán: chưa đánh thì không lộ chỗ dừng, đánh xong thì chấm độ lệch của điểm đoán.
    if !bad, let p = m.position, m.guessing {
      if m.revealed, let c = stop, let g = m.guess {
        // Chấm theo số đã làm tròn, khớp với chữ đang hiện.
        let e = hypot(c.x - g.x, c.y - g.y).rounded()
        text = "Off by \(Int(e)) in, \(p.contains(c) ? "in zone" : "out of zone")"
        good = e <= PoolEditorModel.guessGood
        bad = e > PoolEditorModel.guessBad
      } else {
        text = m.guess == nil ? "Tap the table to guess" : "Guessed, tap Shoot"
        good = false
      }
    }
    // Bài điều bi: cú vẫn sạch thì dòng trạng thái chấm chỗ bi cái dừng so với vùng đánh bi 2.
    else if !bad, let p = m.position, let c = stop {
      let k = p.cut(from: c)
      if p.contains(c) { text = "In zone for ball 2, \(Int(k.deg.rounded()))° cut"; good = true }
      else {
        text = k.deg < 0 ? "Cue ball on the wrong side of ball 2" : k.dist > PoolEditorModel.Position.dists.upperBound ? "Cue ball too far from ball 2, \(Int(k.dist.rounded())) in"
          : k.dist < PoolEditorModel.Position.dists.lowerBound ? "Cue ball too close to ball 2" : k.deg < PoolEditorModel.Position.cuts.lowerBound ? "Ball 2 nearly straight" : "Ball 2 cut too thin"
        bad = true
        good = false
      }
    }
    // Lời Gợi ý thay dòng trạng thái khi cú vẫn đúng như lúc gợi ý.
    if !bad, let h = m.hintText {
      text = h
      good = m.hint?.good ?? false
    }
    statusText = text
    statusBad = bad
    statusGood = good

    if ran, let r = run {
      let k = PoolEditorGuides.spinIndex(r.f)
      kind = k
      spinText = k == 0 ? "Cue draws back" : k == 1 ? (cut < 5 ? "Cue stops dead" : "Cue goes sideways")
        : m.tipY < -0.05 ? "Cue still follows" : "Cue follows"
    } else {
      kind = nil
      spinText = slip ? "Drag the dot inward" : run?.short == .cue ? "Cue ball doesn't reach \(name)" : ""
    }
  }
}

/// Phản hồi lúc chạm xuống, không đợi nhấc tay.
struct PoolPressStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaleEffect(configuration.isPressed ? 0.97 : 1)
      .opacity(configuration.isPressed ? 0.9 : 1)
      .animation(.easeOut(duration: 0.12), value: configuration.isPressed)
  }
}

/// Mặt bi cái 150×128, hệ toạ độ của SVG trong HTML: tâm (62, 64), bán kính 44 là 0.6R.
/// Chạm đâu đặt đó hai chiều, kẹp 0.84R, hít 0 / 0.4 / stun dọc và 0 / gear ngang, mỗi lần hít một haptic.
struct PoolTipPad: View {
  @ObservedObject var model: PoolEditorModel
  let stun: CGFloat?
  let stunWord: String
  /// Điểm phê hết throw của cú đang chọn, nil khi chưa mô phỏng.
  let gear: CGFloat?
  let slip: Bool
  let onCommit: () -> Void
  @State private var held = false
  @State private var snapX: String?
  @State private var snapY: String?

  static let size = CGSize(width: 162, height: 128)
  static let center = CGPoint(x: 62, y: 64)
  static let radius: CGFloat = 44
  /// Điểm trên một R.
  static let ppr: CGFloat = radius / ShotPhysics.tipMax
  static let reach: CGFloat = 0.84
  private static let labelFont = Font.custom("BeVietnamPro-Medium", size: 12)

  var body: some View {
    Canvas { ctx, _ in draw(&ctx) }
      .frame(width: Self.size.width, height: Self.size.height)
      .contentShape(Rectangle())
      .gesture(
        DragGesture(minimumDistance: 0)
          .onChanged { v in
            if !held { held = true; snapX = nil; snapY = nil; model.replay = nil }
            set(v.location)
          }
          .onEnded { _ in
            held = false
            onCommit()
          }
      )
      .accessibilityElement()
      .accessibilityLabel("Tip position on the cue ball: up is follow, down is draw, sideways is english")
      .accessibilityValue(accessibilityText)
      .accessibilityAdjustableAction { dir in
        guard dir == .increment || dir == .decrement else { return }
        nudge(dx: 0, dy: dir == .increment ? 0.05 : -0.05)
      }
      .accessibilityAction(named: "More right english") { nudge(dx: 0.05, dy: 0) }
      .accessibilityAction(named: "More left english") { nudge(dx: -0.05, dy: 0) }
  }

  private var accessibilityText: String {
    let s = ShotPanelState(model)
    return s.tipText + ", " + (s.sideText.isEmpty ? "No english" : s.sideText)
  }

  private func nudge(dx: CGFloat, dy: CGFloat) {
    var x = model.tipX + dx, y = model.tipY + dy
    let h = hypot(x, y)
    if h > Self.reach { x *= Self.reach / h; y *= Self.reach / h }
    model.tipX = (x * 100).rounded() / 100
    model.tipY = (y * 100).rounded() / 100
    onCommit()
  }

  /// Toạ độ pad → (tipX, tipY), kẹp trong 0.84R rồi hít mốc trong 0.025R.
  private func set(_ p: CGPoint) {
    var x = (p.x - Self.center.x) / Self.ppr
    var y = -(p.y - Self.center.y) / Self.ppr
    let h = hypot(x, y)
    if h > Self.reach { x *= Self.reach / h; y *= Self.reach / h }
    var ys: [(String, CGFloat)] = [("center", 0), ("follow", ShotPhysics.rollTip)]
    if let stun { ys.append((stunWord.lowercased(), stun)) }
    var xs: [(String, CGFloat)] = [("no english", 0)]
    if let gear, abs(gear) > 0.03 { xs.append(("zero throw", gear)) }
    var hitY: String?, hitX: String?
    for (id, v) in ys where abs(y - v) < 0.025 { y = v; hitY = id }
    for (id, v) in xs where abs(x - v) < 0.025 { x = v; hitX = id }
    let fresh = [hitY != snapY ? hitY : nil, hitX != snapX ? hitX : nil].compactMap { $0 }
    if !fresh.isEmpty { EditorHaptics.fire(.selection, "Tip snapped to " + fresh.joined(separator: ", ")) }
    snapY = hitY
    snapX = hitX
    model.tipX = (x * 100).rounded() / 100
    model.tipY = (y * 100).rounded() / 100
  }

  private struct Label { let text: String; let v: CGFloat; var y: CGFloat }

  /// Nhãn Culê / Tâm / Dừng (hoặc Ngang) bên phải, đẩy nhau ra tối thiểu 15pt, không quá y = 122.
  private func labels() -> [Label] {
    var ls = [Label(text: "Follow", v: ShotPhysics.rollTip, y: 0), Label(text: "Center", v: 0, y: 0)]
    if let stun, abs(stun) > 0.06 { ls.append(Label(text: stunWord, v: stun, y: 0)) }
    for i in ls.indices { ls[i].y = Self.center.y - ls[i].v * Self.ppr }
    ls.sort { $0.y < $1.y }
    for i in 1..<ls.count { ls[i].y = max(ls[i].y, ls[i - 1].y + 15) }
    let last = ls.count - 1
    ls[last].y = min(ls[last].y, 122)
    for i in stride(from: last - 1, through: 0, by: -1) { ls[i].y = min(ls[i].y, ls[i + 1].y - 15) }
    return ls
  }

  private func draw(_ ctx: inout GraphicsContext) {
    let c = Self.center, R = Self.radius
    let faceRect = CGRect(x: c.x - R, y: c.y - R, width: 2 * R, height: 2 * R)
    let face = Path(ellipseIn: faceRect)
    ctx.fill(face, with: .radialGradient(
      Gradient(stops: [.init(color: .white, location: 0),
                       .init(color: Color(hex: 0xECE9E2), location: 0.6),
                       .init(color: Color(hex: 0xBDB8AE), location: 1)]),
      center: CGPoint(x: faceRect.minX + 0.4 * faceRect.width, y: faceRect.minY + 0.34 * faceRect.height),
      startRadius: 0, endRadius: 0.72 * faceRect.width))
    ctx.stroke(face, with: .color(slip ? PoolEditorGuides.red : .white.opacity(0.25)), lineWidth: slip ? 2 : 1)

    var cross = Path()
    cross.move(to: CGPoint(x: c.x, y: c.y - 40)); cross.addLine(to: CGPoint(x: c.x, y: c.y + 40))
    cross.move(to: CGPoint(x: c.x - 40, y: c.y)); cross.addLine(to: CGPoint(x: c.x + 40, y: c.y))
    ctx.stroke(cross, with: .color(.black.opacity(0.12)), style: StrokeStyle(lineWidth: 1, dash: [2, 3]))

    // Vạch lăn và stun trên mặt bi.
    var ticks: [CGFloat] = [ShotPhysics.rollTip]
    if let stun, abs(stun) > 0.06 { ticks.append(stun) }
    for v in ticks {
      let y = c.y - v * Self.ppr
      var t = Path()
      t.move(to: CGPoint(x: c.x - 7, y: y)); t.addLine(to: CGPoint(x: c.x + 7, y: y))
      ctx.stroke(t, with: .color(.black.opacity(0.28)), style: StrokeStyle(lineWidth: 1.2, lineCap: .round))
    }

    // Gạch dẫn từ mép bi ra nhãn, nhãn sáng khi đầu cơ đang đúng mốc.
    for l in labels() {
      let y = c.y - l.v * Self.ppr
      let edge = c.x + sqrt(max(R * R - (y - c.y) * (y - c.y), 0))
      var lead = Path()
      lead.move(to: CGPoint(x: edge + 3, y: y)); lead.addLine(to: CGPoint(x: 114, y: l.y))
      ctx.stroke(lead, with: .color(.white.opacity(0.18)), lineWidth: 1)
      let on = abs(model.tipY - l.v) < 0.005
      ctx.draw(Text(l.text).font(Self.labelFont).foregroundColor(on ? PoolShotPanel.ink : PoolShotPanel.secondary),
               at: CGPoint(x: 118, y: l.y), anchor: .leading)
    }

    // Điểm phê hết throw của cú này.
    if let gear, abs(gear) > 0.03 {
      let gx = c.x + gear * Self.ppr
      var g = Path()
      g.move(to: CGPoint(x: gx, y: c.y - 6)); g.addLine(to: CGPoint(x: gx, y: c.y + 6))
      ctx.stroke(g, with: .color(PoolAimPalette.gold.opacity(0.9)), lineWidth: 1.6)
    }

    let p = CGPoint(x: c.x + model.tipX * Self.ppr, y: c.y - model.tipY * Self.ppr)
    let color = slip ? PoolEditorGuides.red : Color(hex: 0x3F6DA8)
    ctx.fill(Path(ellipseIn: CGRect(x: p.x - 9, y: p.y - 9, width: 18, height: 18)), with: .color(color.opacity(0.18)))
    let dot = Path(ellipseIn: CGRect(x: p.x - 6.5, y: p.y - 6.5, width: 13, height: 13))
    ctx.fill(dot, with: .color(color))
    ctx.stroke(dot, with: .color(.white), lineWidth: 2)
  }
}

/// Thay hàng Lực trong lúc chạy thử: tốc và vòng quay bi cái, giờ mô phỏng, thanh tua.
/// Kéo là dừng hình đúng giây đó, nhấc tay vẫn dừng; Tiếp chạy lại từ đó. Vạch vàng là lúc chạm bi mục tiêu.
struct PoolReplayScrub: View {
  @ObservedObject var model: PoolEditorModel
  let replay: ShotReplay

  var body: some View {
    TimelineView(.animation(paused: replay.jump || replay.paused != nil)) { tl in
      let t = min(replay.time(tl.date), replay.end)
      VStack(spacing: 10) {
        HStack(spacing: 0) {
          Spacer(minLength: 8)
          Text(Self.num(t, 2))
            .font(.custom("BeVietnamPro-SemiBold", size: 17, relativeTo: .body))
            .foregroundStyle(PoolAimPalette.gold)
          Text(" / \(Self.num(replay.end, 2)) s")
            .font(.custom("BeVietnamPro-Medium", size: 15, relativeTo: .subheadline))
            .foregroundStyle(PoolShotPanel.secondary)
        }
        .monospacedDigit()
        .lineLimit(1)
        .frame(height: 24)
        track(t)
      }
    }
  }

  private func track(_ t: CGFloat) -> some View {
    GeometryReader { geo in
      let w = geo.size.width, span = max(w - 28, 1), end = max(replay.end, 1e-3)
      let x = 14 + t / end * span
      ZStack(alignment: .topLeading) {
        RoundedRectangle(cornerRadius: 3).fill(Color.white.opacity(0.12))
          .frame(width: w, height: 6).offset(y: 11)
        RoundedRectangle(cornerRadius: 3).fill(PoolAimPalette.gold)
          .frame(width: max(14, x), height: 6).offset(y: 11)
        if let c = replay.contact {
          RoundedRectangle(cornerRadius: 1).fill(PoolAimPalette.gold)
            .frame(width: 2, height: 5)
            .offset(x: 14 + c / end * span - 1, y: 22)
        }
        Circle().fill(.white)
          .shadow(color: .black.opacity(0.3), radius: 1, y: 1)
          .shadow(color: .black.opacity(0.35), radius: 5, y: 3)
          .frame(width: 28, height: 28)
          .offset(x: x - 14)
      }
      .frame(width: w, height: 28, alignment: .topLeading)
      .contentShape(Rectangle())
      .gesture(
        DragGesture(minimumDistance: 0)
          .onChanged { v in model.scrubReplay(to: (v.location.x - 14) / span * end) }
      )
    }
    .frame(height: 28)
    .accessibilityElement()
    .accessibilityLabel("Test run time")
    .accessibilityValue("\(Self.num(t, 2)) of \(Self.num(replay.end, 2)) seconds")
    .accessibilityAdjustableAction { dir in
      let d: CGFloat = dir == .increment ? 0.1 : dir == .decrement ? -0.1 : 0
      if d != 0 { model.scrubReplay(to: t + d) }
    }
  }

  static func num(_ v: CGFloat, _ digits: Int) -> String {
    String(format: "%.\(digits)f", Double(v))
  }
}

/// Bảng số đo sống của bi cái lúc chạy thử, thay cột chữ cạnh pad. Cùng công thức với `updateReads` của web:
/// ρ chỉ có khi bi còn chạy, phê ghi phải/trái, trục quay là góc nghiêng của ω so với mặt bàn.
struct PoolReplayReads: View {
  let replay: ShotReplay

  var body: some View {
    TimelineView(.animation(paused: replay.jump || replay.paused != nil)) { tl in
      let s = replay.cue.read(min(replay.time(tl.date), replay.end))
      let n = PoolReplayScrub.num
      let wz = s.wz / (2 * .pi), wm = s.revs * 2 * .pi
      let tilt = wm < 0.5 ? "—" : "tilt \(Int((asin(min(1, abs(s.wz) / wm)) * 180 / .pi).rounded()))°"
      VStack(alignment: .leading, spacing: 0) {
        Text(s.phase.name)
          .font(.custom("BeVietnamPro-SemiBold", size: 20, relativeTo: .title3))
          .foregroundStyle(s.phase.color)
          .frame(minHeight: 26)
        row("Ball speed", n(s.speed / ShotPhysics.inchesPerMeter, 2) + " m/s")
        row("Roll ratio ρ", s.rho.map { n($0, 2) } ?? "—")
        row("Side spin", abs(wz) < 0.05 ? "0.0 rev/s" : n(abs(wz), 1) + " rev/s " + (s.wz > 0 ? "right" : "left"))
        row("Total spin", n(s.revs, 1) + " rev/s")
        row("Spin axis", tilt)
      }
      .lineLimit(1)
      .monospacedDigit()
      .frame(maxWidth: .infinity, alignment: .leading)
    }
  }

  private func row(_ k: String, _ v: String) -> some View {
    HStack(spacing: 6) {
      Text(k).foregroundStyle(PoolShotPanel.secondary)
      Spacer(minLength: 4)
      Text(v).foregroundStyle(PoolShotPanel.ink)
    }
    .font(.custom("BeVietnamPro-Medium", size: 13, relativeTo: .footnote))
    .frame(minHeight: 19)
  }
}

/// Thanh lực 0.3 đến 4.5 m/s, cao 28. Kéo tương đối, thumb không nhảy về ngón tay.
/// Chạm không kéo thì đặt đúng chỗ chạm, gần mốc trong 12pt thì hít mốc.
struct PoolPowerTrack: View {
  @ObservedObject var model: PoolEditorModel
  let onCommit: () -> Void
  @State private var drag: (x0: CGFloat, v0: CGFloat, moved: Bool)?
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    GeometryReader { geo in
      let w = geo.size.width
      let x = PoolShotPanel.x(of: model.speed, width: w)
      ZStack(alignment: .topLeading) {
        RoundedRectangle(cornerRadius: 3).fill(Color.white.opacity(0.12))
          .frame(width: w, height: 6).offset(y: 11)
        RoundedRectangle(cornerRadius: 3).fill(PoolAimPalette.gold)
          .frame(width: max(14, x), height: 6).offset(y: 11)
        ForEach(PoolShotPanel.marks, id: \.v) { m in
          RoundedRectangle(cornerRadius: 1).fill(Color.white.opacity(0.32))
            .frame(width: 2, height: 5)
            .offset(x: PoolShotPanel.x(of: m.v, width: w) - 1, y: 22)
        }
        Circle().fill(.white)
          .shadow(color: .black.opacity(0.3), radius: 1, y: 1)
          .shadow(color: .black.opacity(0.35), radius: 5, y: 3)
          .frame(width: 28, height: 28)
          .scaleEffect(drag != nil && !reduceMotion ? 1.1 : 1)
          .animation(.spring(response: 0.25, dampingFraction: 1), value: drag != nil)
          .offset(x: x - 14)
      }
      .frame(width: w, height: 28, alignment: .topLeading)
      .contentShape(Rectangle())
      .gesture(
        DragGesture(minimumDistance: 0)
          .onChanged { v in
            if drag == nil { drag = (v.startLocation.x, model.speed, false); model.replay = nil }
            guard var d = drag else { return }
            let dx = v.location.x - d.x0
            if !d.moved && abs(dx) < 4 { return }
            d.moved = true
            drag = d
            set(PoolShotPanel.v(at: PoolShotPanel.x(of: d.v0, width: w) + dx, width: w))
          }
          .onEnded { v in
            if drag?.moved != true {
              let at = PoolShotPanel.v(at: v.location.x, width: w)
              // Hít mốc theo khoảng cách trên màn, 12pt, vì thang không đều.
              set(PoolShotPanel.marks.first { abs(PoolShotPanel.x(of: $0.v, width: w) - v.location.x) < 12 }?.v ?? at)
            }
            drag = nil
            onCommit()
          }
      )
    }
    .frame(height: 28)
    .accessibilityElement()
    .accessibilityLabel("Speed")
    .accessibilityValue(PoolShotPanel.powerWord(model.speed))
    .accessibilityAdjustableAction { dir in
      let d: CGFloat = dir == .increment ? 0.1 : dir == .decrement ? -0.1 : 0
      guard d != 0 else { return }
      set(model.speed + d)
      onCommit()
    }
  }

  private func set(_ raw: CGFloat) {
    let v = (min(max(raw, PoolShotPanel.vMin), PoolShotPanel.vMax) * 10).rounded() / 10
    let old = model.speed
    if let p = PoolShotPanel.marks.first(where: { (old - $0.v) * (v - $0.v) < 0 || (v == $0.v && old != $0.v) }) {
      EditorHaptics.fire(.selection, "Speed passed \(p.label.lowercased()) \(PoolShotPanel.fmt1(p.v)) m/s")
    }
    model.speed = v
  }
}
