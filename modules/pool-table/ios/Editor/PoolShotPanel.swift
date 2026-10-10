import SwiftUI

/// Bảng cú đánh dưới bàn, port card của Soạn bài v5.2: chữ cho người mới, không đơn vị, số đo nằm trong hình.
/// Hàng 1: mặt bi cái 2D và cột chữ. Hàng 2: lực. Hàng 3: Đường đi và Đánh. Kéo chỉ đổi model, nhấc tay mới commit.
/// Lúc chạy thử: cột chữ thành số đo sống (tốc bi, ρ, phê, spin tổng, trục quay) và hàng lực thành thanh tua kèm
/// bốn mức tốc độ, cùng bộ số với bảng đọc của trang bi-cai-xoay.html.
struct PoolShotPanel: View {
  @ObservedObject var model: PoolEditorModel
  let onCommit: () -> Void
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  /// Card 318 như HTML cộng hàng cú mẫu 44 và hàng Nâng cơ 44, rồi 12 hở trên và 8 lề dưới. JS để native view flex
  /// nên chỉ đổi ở đây.
  static let height: CGFloat = 426
  static let cardHeight: CGFloat = 406
  /// Thang tốc độ bi cái của Dr. Dave: chậm 0.45–0.89, vừa 0.89–1.9, nhanh 1.9–3.2, mạnh 3.2–4.5 m/s.
  /// Mốc đặt giữa từng khoảng. Phá bi (11 m/s trở lên) không thuộc bảng này.
  static let vMin: CGFloat = 0.3
  static let vMax: CGFloat = 4.5
  static let marks: [(v: CGFloat, label: String)] = [(0.7, "Chậm"), (1.4, "Vừa"), (2.5, "Nhanh"), (3.8, "Mạnh")]

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
      elevation
        .padding(.top, 16)
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

  /// Hàng cú mẫu, cuộn ngang, như hàng preset của web. Bấm là đặt pad và Lực, chip trùng cú hiện tại thì vàng.
  private var presets: some View {
    ScrollView(.horizontal, showsIndicators: false) {
      HStack(spacing: 8) {
        ForEach(PoolEditorModel.presets) { p in
          let on = model.preset?.id == p.id
          Button {
            model.apply(p)
            onCommit()
          } label: {
            Text(p.name)
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
      }
      .padding(.horizontal, 20)
    }
    .padding(.horizontal, -20)
    .frame(height: 32)
  }

  /// Cột chữ bên phải pad: điểm đánh, phê (ẩn khi không phê), bi trắng sau chạm, trạng thái.
  private func column(_ s: ShotPanelState) -> some View {
    let dot = s.kind.map { PoolEditorGuides.spin[$0] } ?? Color(red: 235 / 255, green: 235 / 255, blue: 245 / 255).opacity(0.3)
    return VStack(alignment: .leading, spacing: 0) {
      Text(s.tipText)
        .font(.custom("BeVietnamPro-SemiBold", size: 26, relativeTo: .title2))
        .tracking(-0.5)
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
        Text("Lực")
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

  /// Hàng Nâng cơ, một dòng 28: nhãn, thanh kéo 0–75° tuyến tính, số độ vàng. `theta` của web; trên 0 là massé.
  private var elevation: some View {
    HStack(spacing: 12) {
      Text("Nâng cơ")
        .font(.custom("BeVietnamPro-Medium", size: 15, relativeTo: .subheadline))
        .foregroundStyle(Self.secondary)
        .fixedSize()
      PoolElevationTrack(model: model, onCommit: onCommit)
      Text("\(Int(model.theta.rounded()))°")
        .font(.custom("BeVietnamPro-SemiBold", size: 17, relativeTo: .body))
        .foregroundStyle(model.theta > 0.5 ? PoolAimPalette.gold : Self.secondary)
        .monospacedDigit()
        .frame(width: 40, alignment: .trailing)
    }
    .frame(height: 28)
  }

  /// Bật tắt đường bi cái và bi mục tiêu. Bấm nhiều nên không animation, đổi icon và độ sáng là đủ.
  private var paths: some View {
    Button { model.showPaths.toggle() } label: {
      HStack(spacing: 8) {
        Image(systemName: model.showPaths ? "eye" : "eye.slash").font(.system(size: 20))
        Text("Đường đi").font(.custom("BeVietnamPro-Medium", size: 15, relativeTo: .subheadline)).fixedSize()
      }
      .foregroundStyle(Self.ink)
      .padding(.horizontal, 16)
      .frame(height: 50)
      .background(Capsule().fill(Color.white.opacity(model.showPaths ? 0.16 : 0.08)))
      .contentShape(Capsule())
    }
    .buttonStyle(PoolPressStyle())
    .accessibilityAddTraits(model.showPaths ? .isSelected : [])
    .accessibilityHint("Tắt thì chỉ còn đường ngắm từ bi cái tới bi mục tiêu")
  }

  private func shoot(_ s: ShotPanelState) -> some View {
    let playing = model.replay != nil, held = model.replay?.paused != nil
    return Button {
      if held { model.resumeReplay() } else { model.toggleReplay(reduceMotion: reduceMotion) }
    } label: {
      HStack(spacing: 8) {
        Image(systemName: playing && !held ? "stop.fill" : "play.fill").font(.system(size: 16, weight: .semibold))
        Text(held ? "Tiếp" : playing ? "Dừng" : "Đánh").font(.custom("BeVietnamPro-SemiBold", size: 17, relativeTo: .body))
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
    .accessibilityHint(held ? "Chạy tiếp từ chỗ đang dừng" : playing ? "Dừng chạy thử" : "Chạy thử cú này trên bàn")
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
    v < 0.45 ? "Chạm nhẹ" : v < 0.89 ? "Chậm" : v < 1.9 ? "Vừa" : v < 3.2 ? "Nhanh" : "Mạnh"
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
    let name = m.aimBall.map { ShotPhysics.name($0) } ?? "bi"
    let cut = verdict?.cut ?? 0
    slip = hypot(m.tipX, m.tipY) > ShotPhysics.tipMax + 0.001
    ran = !slip && run != nil && run?.short != .cue
    sunk = run?.scratch != nil
    stop = ran && !sunk ? run?.stop : nil
    stun = ms.flatMap { ShotPhysics.stunTip($0, speed: m.speed) }
    lastGear = ran && abs(run!.gear) < 0.6 ? (run!.gear * 100).rounded() / 100 : nil
    stunWord = cut < 5 ? "Dừng" : "Ngang"

    let ay = abs(m.tipY), vw = m.tipY > 0 ? "Culê" : "Kéo"
    tipText = slip ? "Trượt cơ" : ay < 0.05 ? "Đánh tâm" : ay < 0.2 ? vw + " nhẹ" : ay < 0.45 ? vw : vw + " mạnh"
    let ax = abs(m.tipX)
    sideText = slip || ax < 0.03 ? "" : "Phê \(m.tipX > 0 ? "phải" : "trái")" + (ax < 0.2 ? " nhẹ" : ax < 0.5 ? "" : " mạnh")

    var good = false, text = "", bad = false
    if let v = verdict, v.level == .bad { text = v.why.prefix(1).uppercased() + v.why.dropFirst(); bad = true }
    else if slip { text = "Không đánh được"; bad = true }
    else if run?.short == .cue { text = "Lực yếu quá"; bad = true }
    else if let r = run, r.short == .ob {
      text = r.ob.hit.map { "\(name.capitalized) đụng \(ShotPhysics.name($0))" }
        ?? (r.toRail ? "\(name.capitalized) không tới băng" : r.ob.bounces > 0 ? "\(name.capitalized) trật lỗ" : "\(name.capitalized) không tới lỗ")
      bad = true
    }
    else if let r = run, r.toRail { text = sunk ? "Chạm băng, nhưng trắng rơi lỗ" : "\(name.capitalized) chạm băng"; bad = sunk; good = !sunk }
    else if sunk { text = "Vào, nhưng trắng rơi lỗ"; bad = true }
    else if run != nil { text = "\(name.capitalized) vào lỗ"; good = true }
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
      spinText = k == 0 ? "Trắng kéo về" : k == 1 ? (cut < 5 ? "Trắng đứng im" : "Trắng đi ngang")
        : m.tipY < -0.05 ? "Trắng vẫn chạy theo" : "Trắng chạy theo"
    } else {
      kind = nil
      spinText = slip ? "Kéo chấm vào trong" : run?.short == .cue ? "Trắng không tới \(name)" : ""
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
      .accessibilityLabel("Điểm đánh trên bi cái: lên là culê, xuống là kéo, ngang là phê")
      .accessibilityValue(accessibilityText)
      .accessibilityAdjustableAction { dir in
        guard dir == .increment || dir == .decrement else { return }
        nudge(dx: 0, dy: dir == .increment ? 0.05 : -0.05)
      }
      .accessibilityAction(named: "Phê phải thêm") { nudge(dx: 0.05, dy: 0) }
      .accessibilityAction(named: "Phê trái thêm") { nudge(dx: -0.05, dy: 0) }
  }

  private var accessibilityText: String {
    let s = ShotPanelState(model)
    return s.tipText + ", " + (s.sideText.isEmpty ? "Không phê" : s.sideText)
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
    var ys: [(String, CGFloat)] = [("tâm", 0), ("culê", ShotPhysics.rollTip)]
    if let stun { ys.append((stunWord.lowercased(), stun)) }
    var xs: [(String, CGFloat)] = [("không phê", 0)]
    if let gear, abs(gear) > 0.03 { xs.append(("hết throw", gear)) }
    var hitY: String?, hitX: String?
    for (id, v) in ys where abs(y - v) < 0.025 { y = v; hitY = id }
    for (id, v) in xs where abs(x - v) < 0.025 { x = v; hitX = id }
    let fresh = [hitY != snapY ? hitY : nil, hitX != snapX ? hitX : nil].compactMap { $0 }
    if !fresh.isEmpty { EditorHaptics.fire(.selection, "Đầu cơ hít mốc " + fresh.joined(separator: ", ")) }
    snapY = hitY
    snapX = hitX
    model.tipX = (x * 100).rounded() / 100
    model.tipY = (y * 100).rounded() / 100
  }

  private struct Label { let text: String; let v: CGFloat; var y: CGFloat }

  /// Nhãn Culê / Tâm / Dừng (hoặc Ngang) bên phải, đẩy nhau ra tối thiểu 15pt, không quá y = 122.
  private func labels() -> [Label] {
    var ls = [Label(text: "Culê", v: ShotPhysics.rollTip, y: 0), Label(text: "Tâm", v: 0, y: 0)]
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
          rates
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
    .accessibilityLabel("Thời gian chạy thử")
    .accessibilityValue("\(Self.num(t, 2)) trên \(Self.num(replay.end, 2)) giây")
    .accessibilityAdjustableAction { dir in
      let d: CGFloat = dir == .increment ? 0.1 : dir == .decrement ? -0.1 : 0
      if d != 0 { model.scrubReplay(to: t + d) }
    }
  }

  /// Bốn mức tốc độ như `speedSeg` của web. Nút đang chọn nền vàng.
  private var rates: some View {
    HStack(spacing: 4) {
      ForEach(PoolEditorModel.rates, id: \.self) { r in
        let on = abs(replay.rate - r) < 1e-6
        Button { model.setReplayRate(r) } label: {
          Text(Self.rateText(r))
            .font(.custom("BeVietnamPro-SemiBold", size: 13, relativeTo: .footnote))
            .foregroundStyle(on ? Color(hex: 0x1B1504) : PoolShotPanel.ink)
            .padding(.horizontal, 9)
            .frame(height: 24)
            .background(Capsule().fill(on ? PoolAimPalette.gold : Color.white.opacity(0.1)))
            .contentShape(Capsule())
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Tốc độ \(Self.rateText(r))")
        .accessibilityAddTraits(on ? .isSelected : [])
      }
    }
  }

  static func rateText(_ r: CGFloat) -> String {
    r == 1 ? "1×" : num(r, r == 0.25 ? 2 : 1) + "×"
  }

  static func num(_ v: CGFloat, _ digits: Int) -> String {
    String(format: "%.\(digits)f", Double(v)).replacingOccurrences(of: ".", with: ",")
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
      let tilt = wm < 0.5 ? "—" : "nghiêng \(Int((asin(min(1, abs(s.wz) / wm)) * 180 / .pi).rounded()))°"
      VStack(alignment: .leading, spacing: 0) {
        Text(s.phase.name)
          .font(.custom("BeVietnamPro-SemiBold", size: 20, relativeTo: .title3))
          .foregroundStyle(s.phase.color)
          .frame(minHeight: 26)
        row("Tốc bi", n(s.speed / ShotPhysics.inchesPerMeter, 2) + " m/s")
        row("Tỉ số lăn ρ", s.rho.map { n($0, 2) } ?? "—")
        row("Phê", abs(wz) < 0.05 ? "0,0 vòng/s" : n(abs(wz), 1) + " vòng/s " + (s.wz > 0 ? "phải" : "trái"))
        row("Spin tổng", n(s.revs, 1) + " vòng/s")
        row("Trục quay", tilt)
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
    .accessibilityLabel("Lực")
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
      EditorHaptics.fire(.selection, "Lực qua mốc \(p.label.lowercased()) \(PoolShotPanel.fmt1(p.v)) m/s")
    }
    model.speed = v
  }
}

/// Thanh Nâng cơ 0 đến 75°, cao 28, cùng dáng với thanh lực nhưng thang tuyến tính, bước 1°.
/// Chạm không kéo thì đặt đúng chỗ chạm, gần mốc 0 / 30 / 60 trong 12pt thì hít mốc. Kéo là dừng chạy thử.
struct PoolElevationTrack: View {
  @ObservedObject var model: PoolEditorModel
  let onCommit: () -> Void
  @State private var drag: (x0: CGFloat, t0: CGFloat, moved: Bool)?
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  static let marks: [CGFloat] = [0, 30, 60]
  static func x(of t: CGFloat, width: CGFloat) -> CGFloat {
    14 + min(max(t / PoolEditorModel.thetaMax, 0), 1) * (width - 28)
  }
  static func t(at x: CGFloat, width: CGFloat) -> CGFloat {
    min(max((x - 14) / max(width - 28, 1), 0), 1) * PoolEditorModel.thetaMax
  }

  var body: some View {
    GeometryReader { geo in
      let w = geo.size.width
      let x = Self.x(of: model.theta, width: w)
      ZStack(alignment: .topLeading) {
        RoundedRectangle(cornerRadius: 3).fill(Color.white.opacity(0.12))
          .frame(width: w, height: 6).offset(y: 11)
        RoundedRectangle(cornerRadius: 3).fill(PoolAimPalette.gold)
          .frame(width: max(14, x), height: 6).offset(y: 11)
        ForEach(Self.marks, id: \.self) { m in
          RoundedRectangle(cornerRadius: 1).fill(Color.white.opacity(0.32))
            .frame(width: 2, height: 5)
            .offset(x: Self.x(of: m, width: w) - 1, y: 22)
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
            if drag == nil { drag = (v.startLocation.x, model.theta, false); model.replay = nil }
            guard var d = drag else { return }
            let dx = v.location.x - d.x0
            if !d.moved && abs(dx) < 4 { return }
            d.moved = true
            drag = d
            set(Self.t(at: Self.x(of: d.t0, width: w) + dx, width: w))
          }
          .onEnded { v in
            if drag?.moved != true {
              let at = Self.t(at: v.location.x, width: w)
              set(Self.marks.first { abs(Self.x(of: $0, width: w) - v.location.x) < 12 } ?? at)
            }
            drag = nil
            onCommit()
          }
      )
    }
    .frame(height: 28)
    .accessibilityElement()
    .accessibilityLabel("Nâng cơ")
    .accessibilityValue("\(Int(model.theta.rounded())) độ")
    .accessibilityAdjustableAction { dir in
      let d: CGFloat = dir == .increment ? 5 : dir == .decrement ? -5 : 0
      guard d != 0 else { return }
      set(model.theta + d)
      onCommit()
    }
  }

  private func set(_ raw: CGFloat) {
    let t = min(max(raw, 0), PoolEditorModel.thetaMax).rounded()
    let old = model.theta
    if let m = Self.marks.first(where: { (old - $0) * (t - $0) < 0 || (t == $0 && old != $0) }) {
      EditorHaptics.fire(.selection, "Nâng cơ qua mốc \(Int(m))°")
    }
    model.theta = t
  }
}
