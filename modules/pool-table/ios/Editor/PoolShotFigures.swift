import SwiftUI

// Hai hình tĩnh của cú chính, port `topFig()` và `backFig()` của Soạn bài v5.2 (Main.dc.html).
// Nhìn từ trên: phóng quanh bi mục tiêu, trục dọc là hướng bi cái tới đích.
// Nhìn từ sau bi cái: chiếu lên mặt phẳng vuông góc đường cơ đã bù throw và squirt.
// Không tab: hai hình là hai ô sống cạnh bàn, chạm ô thì nở ra phủ vùng bàn.

/// Ô cạnh bàn: hình thu nhỏ không chữ, tên và giá trị ở đáy trên nền gradient.
struct PoolShotTile: View {
  let fig: ShotFigure?
  let mode: EditorViewMode
  let open: () -> Void

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: 20, style: .continuous)
    Button(action: open) {
      ZStack(alignment: .bottomLeading) {
        Canvas { ctx, size in
          guard let fig else {
            ctx.fill(Path(CGRect(origin: .zero, size: size)), with: .color(ShotFigure.top))
            return
          }
          if mode == .back { fig.drawBack(&ctx, size, cyK: 0.3, mini: true) } else { fig.drawTop(&ctx, size, cyK: 0.3, mini: true) }
        }
        LinearGradient(colors: [.black.opacity(0), .black.opacity(0.62)], startPoint: .top, endPoint: .bottom)
          .frame(height: 64)
        VStack(alignment: .leading, spacing: 1) {
          Text(mode.title)
            .font(.custom("BeVietnamPro-SemiBold", size: 13, relativeTo: .footnote))
            .tracking(-0.1)
            .foregroundStyle(PoolShotPanel.ink)
          Text(fig.map { mode == .back ? $0.backShort : $0.topShort } ?? "Chưa chọn lỗ")
            .font(.custom("BeVietnamPro-Medium", size: 12, relativeTo: .caption))
            .foregroundStyle(Color(red: 235 / 255, green: 235 / 255, blue: 245 / 255).opacity(0.7))
        }
        .lineLimit(1)
        .padding(EdgeInsets(top: 0, leading: 12, bottom: 10, trailing: 12))
      }
      .overlay(alignment: .topTrailing) {
        Image(systemName: "arrow.up.left.and.arrow.down.right")
          .font(.system(size: 10, weight: .bold))
          .foregroundStyle(Color.white.opacity(0.85))
          .frame(width: 24, height: 24)
          .background(Circle().fill(Color.black.opacity(0.38)))
          .padding(8)
      }
      .clipShape(shape)
      .overlay(shape.strokeBorder(Color.white.opacity(0.1), lineWidth: 0.5))
      .contentShape(shape)
    }
    .buttonStyle(PoolPressStyle())
    .disabled(fig == nil)
    .accessibilityLabel(mode.title)
    .accessibilityValue(fig.map { mode == .back ? $0.backSay : $0.topSay } ?? "Chưa chọn lỗ")
    .accessibilityHint("Chạm để phóng to")
  }
}

/// Ô nở ra phủ vùng bàn và hai ô, từ đúng chỗ ô đứng. Panel song song nên card vẫn dùng được, không dim.
/// Vuốt xuống hoặc ✕ để thu về đúng ô vừa mở.
struct PoolShotFigureOverlay: View {
  @ObservedObject var model: PoolEditorModel
  let fig: ShotFigure
  let area: CGSize
  /// Khung ô đang mở, toạ độ trong vùng.
  let tile: CGRect
  @State private var dy: CGFloat = 0
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    let shown = model.figShown
    let down = max(0, dy), sc = 1 - down / 1600
    // Giảm động: chỉ mờ hiện, không bay từ ô ra.
    let fly = !reduceMotion
    VStack(alignment: .leading, spacing: 10) {
      figure
      caption
    }
    .frame(width: area.width, height: area.height, alignment: .top)
    // Trùng nền màn để không lộ khung vuông quanh hình.
    .background(Color.black)
    .overlay(alignment: .topTrailing) { close }
    .scaleEffect(shown ? sc : fly ? tile.width / area.width : 1, anchor: .topLeading)
    .offset(x: shown ? area.width * (1 - sc) / 2 : fly ? tile.minX : 0, y: shown ? dy : fly ? tile.minY : 0)
    .opacity(shown ? 1 - down / 900 : 0)
    // Vào và ra là ease-out mạnh như HTML; đóng từ tay cũng đi đường này vì đích là ô, không theo đà.
    .animation(reduceMotion ? .easeOut(duration: 0.2)
               : .timingCurve(0.23, 1, 0.32, 1, duration: shown ? 0.32 : 0.24), value: shown)
    .allowsHitTesting(shown)
    .accessibilityHidden(!shown)
    .accessibilityAction(.escape) { model.figShown = false }
  }

  private var figure: some View {
    Canvas { ctx, size in
      if model.fig == .back { fig.drawBack(&ctx, size) } else { fig.drawTop(&ctx, size) }
    }
    .frame(maxHeight: .infinity)
    .overlay(alignment: .topLeading) {
      Text(model.fig.title)
        .font(.custom("BeVietnamPro-SemiBold", size: 15, relativeTo: .subheadline))
        .tracking(-0.2)
        .foregroundStyle(PoolShotPanel.ink)
        .shadow(color: .black.opacity(0.6), radius: 3, y: 1)
        .padding(EdgeInsets(top: 14, leading: 16, bottom: 0, trailing: 0))
        .accessibilityAddTraits(.isHeader)
    }
    // Grabber báo là kéo xuống được, như sheet.
    .overlay(alignment: .bottom) {
      Capsule().fill(Color.white.opacity(0.35)).frame(width: 36, height: 5).padding(.bottom, 8)
    }
    .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(model.fig == .back ? fig.backLabel : fig.topLabel)
    .gesture(drag)
  }

  /// Kéo xuống theo tay 1:1, kéo lên cản 4 lần. Thả quá 90pt hoặc búng xuống thì thu, không thì nảy về.
  private var drag: some Gesture {
    DragGesture(minimumDistance: 10)
      .onChanged { v in
        let raw = v.translation.height
        dy = raw < 0 ? raw / 4 : raw
      }
      .onEnded { v in
        // Đà còn lại theo dự phóng của hệ thống (quán tính ~0.5 s): 300pt ứng với 0.6 pt/ms của HTML.
        let fling = v.predictedEndTranslation.height - v.translation.height
        if dy > 90 || fling > 300 {
          dy = 0
          model.figShown = false
          return
        }
        // Nảy về bằng spring mang vận tốc lúc thả, tính theo tỉ lệ quãng còn lại.
        let speed = fling * 2
        let rel = abs(dy) > 1 ? -speed / dy : 0
        withAnimation(.interpolatingSpring(mass: 1, stiffness: 322, damping: 28.7, initialVelocity: rel)) { dy = 0 }
      }
  }

  private var caption: some View {
    let back = model.fig == .back
    return (Text(back ? fig.backSay : fig.topSay)
      .font(.custom("BeVietnamPro-Medium", size: 13, relativeTo: .footnote)).foregroundColor(PoolShotPanel.ink)
      + Text(" " + (back ? fig.backMore : fig.topComp))
      .font(.custom("BeVietnamPro-Regular", size: 13, relativeTo: .footnote)))
      .foregroundStyle(PoolShotPanel.secondary)
      .lineSpacing(5)
      .fixedSize(horizontal: false, vertical: true)
  }

  /// Nút kính nổi trên hình: vùng chạm 44, hình 32.
  private var close: some View {
    Button { model.figShown = false } label: {
      Image(systemName: "xmark")
        .font(.system(size: 13, weight: .bold))
        .foregroundStyle(PoolShotPanel.ink)
        .frame(width: 32, height: 32)
        .modifier(GlassCircle())
        .frame(width: 44, height: 44)
        .contentShape(Rectangle())
    }
    .buttonStyle(PoolPressStyle())
    .padding(4)
    .accessibilityLabel("Thu hình về")
  }
}

/// Liquid Glass trên iOS 26, material mờ ở bản cũ hơn. Chỉ dùng cho lớp nổi.
private struct GlassCircle: ViewModifier {
  func body(content: Content) -> some View {
    if #available(iOS 26.0, *) {
      content.glassEffect(.regular, in: Circle())
    } else {
      content
        .background(.ultraThinMaterial, in: Circle())
        .overlay(Circle().strokeBorder(Color.white.opacity(0.14), lineWidth: 0.5))
    }
  }
}

/// Hình học của cú và cách vẽ. Tính một lần mỗi lần body chạy, không giữ state.
struct ShotFigure {
  let c, o, P: CGPoint
  let ball: Int
  let d, G, a, contact: CGPoint
  let cut: CGFloat
  /// Cú đã giải xong: nil khi trượt cơ, bị chắn, hay bi cái không tới.
  let h: ShotPhysics.Contact?
  /// Phê đang vẽ trên cơ; 0 khi trượt cơ, như prototype.
  let tipX: CGFloat
  /// Hướng cơ trước squirt. Không có cú thì là hướng ngắm ghost.
  let stick: CGPoint

  static let R = ShotPhysics.ballRadius
  static let gold = PoolAimPalette.gold
  static let pot = Color(red: 127 / 255, green: 199 / 255, blue: 154 / 255)
  static let cream = Color(red: 244 / 255, green: 241 / 255, blue: 232 / 255)
  static let top = Color(hex: 0x0D1820)
  /// Vải cùng theme với bàn, không lấy #1E5A87 của prototype: hai hình phải cùng chất liệu với bàn ngay trên.
  static let felt = PoolTableTheme.tournament.clothLit

  init?(_ m: PoolEditorModel) {
    guard let ball = m.aimBall, let pocket = m.aimPocket, let c = m.balls[0], let o = m.balls[ball],
          let P = ShotPhysics.target(pocket) else { return nil }
    self.c = c; self.o = o; self.P = P; self.ball = ball
    let (G, d) = ShotPhysics.ghost(o, P)
    self.G = G; self.d = d
    a = ShotPhysics.unit(G.x - c.x, G.y - c.y)
    contact = CGPoint(x: o.x - d.x * Self.R, y: o.y - d.y * Self.R)
    cut = acos(min(max(ShotPhysics.dot(a, d), -1), 1)) * 180 / .pi
    let slip = hypot(m.tipX, m.tipY) > ShotPhysics.tipMax + 0.001
    tipX = slip ? 0 : m.tipX
    let ok = ShotPhysics.shotOf(ball: ball, pocket: pocket, balls: m.balls)?.level != .bad
    let solved = ok ? m.shotSetup.flatMap { ShotPhysics.solve($0, tipX: m.tipX, tipY: m.tipY, speed: m.speed) } : nil
    h = solved.flatMap { $0.reached ? $0 : nil }
    // `Contact.L` là hướng sau squirt; quay ngược lại ra hướng cơ.
    stick = h.map { ShotPhysics.rot($0.L, -$0.squirtDeg * .pi / 180) } ?? a
  }

  // MARK: chữ

  static func right(_ v: CGPoint) -> CGPoint { CGPoint(x: -v.y, y: v.x) }
  var ballName: String { ShotPhysics.name(ball) }

  /// Độ lệch điểm ngắm so với tâm bi mục tiêu, đo vuông góc đường cơ, đơn vị R. Dương là ngắm sang phải.
  func aimK(_ stick: CGPoint) -> CGFloat {
    -ShotPhysics.dot(CGPoint(x: o.x - c.x, y: o.y - c.y), Self.right(stick)) / Self.R
  }

  /// Độ lệch điểm ngắm nói bằng chữ, không số: số đo nằm trong hình, không nằm trong câu.
  static func aimWord(_ k: CGFloat) -> String {
    let m = abs(k), side = k > 0 ? "phải" : "trái"
    if m < 0.06 { return "Thẳng tâm" }
    if m < 0.4 { return "Hơi \(side)" }
    if m < 0.94 { return "Bên \(side)" }
    if m <= 1.06 { return "Sát mép \(side)" }
    return "Ngoài mép \(side)"
  }

  var topShort: String { Self.aimWord(aimK(a)) }
  var topSay: String { "Ngắm \(topShort.lowercased()) \(ballName)." }
  /// Throw và squirt nói bằng việc phải làm, không nói bằng độ.
  var topComp: String {
    var s = "Đưa tâm bi trắng vào giữa vòng nét đứt."
    guard h != nil else { return s }
    let diff = abs(aimK(stick)) - abs(aimK(a))
    if abs(diff) > 0.02 {
      s += (abs(tipX) >= 0.03 ? " Có ép phê nên ngắm " : " Mẹo: ngắm ") + (diff > 0 ? "mỏng" : "dày")
        + " hơn vòng đó " + (abs(diff) < 0.15 ? "một chút" : "khá nhiều") + "."
    }
    return s
  }
  var topLabel: String { "Nhìn từ trên: ngắm \(topShort.lowercased()) \(ballName)." }

  /// Độ ăn theo phần bi bị che, gọi bằng tiếng lóng bàn bida: ăn trọn, ăn dày, 3/4, 1/2, 1/4, cắt mỏng.
  private static let marks: [(CGFloat, String)] = [(1, "ăn trọn"), (0.875, "ăn dày"), (0.75, "ăn 3/4"), (0.5, "ăn 1/2"), (0.25, "ăn 1/4"), (0.125, "cắt mỏng")]
  var thick: String {
    if cut < 0.3 { return "đánh thẳng" }
    let fr = 1 - sin(cut * .pi / 180)
    return Self.marks.min(by: { abs($0.0 - fr) < abs($1.0 - fr) })!.1
  }
  var backShort: String { thick.prefix(1).uppercased() + thick.dropFirst() }
  var backSay: String { backShort + "." }
  let backMore = "Phần vàng là chỗ hai bi chồng lên nhau. Chấm vàng là chỗ chạm."
  var backLabel: String { "Nhìn từ sau cơ: \(thick)." }

  // MARK: nét chung

  private func background(_ ctx: inout GraphicsContext, _ size: CGSize, stops: [Gradient.Stop]) {
    let rect = Path(CGRect(origin: .zero, size: size))
    ctx.fill(rect, with: .linearGradient(Gradient(stops: stops), startPoint: .zero, endPoint: CGPoint(x: 0, y: size.height)))
    let vc = CGPoint(x: size.width / 2, y: size.height * 0.55), vr = max(size.width, size.height) * 0.75
    ctx.fill(rect, with: .radialGradient(Gradient(stops: [.init(color: .clear, location: 0.3), .init(color: .black.opacity(0.5), location: 1)]),
                                         center: vc, startRadius: 0, endRadius: vr))
  }

  private func line(_ ctx: inout GraphicsContext, _ pts: [CGPoint], _ color: Color, _ width: CGFloat, dash: [CGFloat] = []) {
    var p = Path()
    p.move(to: pts[0])
    for q in pts.dropFirst() { p.addLine(to: q) }
    ctx.stroke(p, with: .color(color), style: StrokeStyle(lineWidth: width, lineCap: .round, dash: dash))
  }

  private func circle(_ c: CGPoint, _ r: CGFloat) -> Path {
    Path(ellipseIn: CGRect(x: c.x - r, y: c.y - r, width: 2 * r, height: 2 * r))
  }

  private func label(_ ctx: inout GraphicsContext, _ s: String, at p: CGPoint, anchor: UnitPoint = .center, _ color: Color) {
    let t = Text(s).font(.custom("BeVietnamPro-SemiBold", size: 11)).kerning(1.2).foregroundColor(color)
    ctx.draw(t, at: p, anchor: anchor)
  }

  /// Bi vẽ bằng style chung của app, thêm bóng tiếp xúc như SVG.
  private func ball(_ ctx: inout GraphicsContext, _ n: Int, at p: CGPoint, _ r: CGFloat) {
    let sh = Path(ellipseIn: CGRect(x: p.x + r * 0.18 - r, y: p.y + r * 0.28 - r * 0.9, width: 2 * r, height: 1.8 * r))
    ctx.fill(sh, with: .color(.black.opacity(0.35)))
    PoolBallStyles.current.draw(number: n, in: CGRect(x: p.x - r, y: p.y - r, width: 2 * r, height: 2 * r), context: &ctx)
  }

  private func ghostRing(_ ctx: inout GraphicsContext, at g: CGPoint, _ r: CGFloat, fill: Double) {
    let ring = circle(g, r)
    ctx.fill(ring, with: .color(.white.opacity(fill)))
    ctx.stroke(ring, with: .color(.white.opacity(0.85)), style: StrokeStyle(lineWidth: 1.5, dash: [5, 4]))
    let pk = r * 0.16
    line(&ctx, [CGPoint(x: g.x - pk, y: g.y), CGPoint(x: g.x + pk, y: g.y)], .white.opacity(0.95), 1.5)
    line(&ctx, [CGPoint(x: g.x, y: g.y - pk), CGPoint(x: g.x, y: g.y + pk)], .white.opacity(0.95), 1.5)
  }

  private func contactDot(_ ctx: inout GraphicsContext, at p: CGPoint, _ r: CGFloat) {
    ctx.fill(circle(p, r * 3), with: .radialGradient(Gradient(colors: [Self.gold.opacity(0.55), Self.gold.opacity(0)]),
                                                     center: p, startRadius: 0, endRadius: r * 3))
    let dot = circle(p, r)
    ctx.fill(dot, with: .color(Self.gold))
    ctx.stroke(dot, with: .color(.black.opacity(0.6)), lineWidth: 1)
  }

  // MARK: nhìn từ trên

  /// `cyK` là chỗ tâm bi mục tiêu theo chiều cao; ô nhỏ đặt cao hơn (0.3). `mini` bỏ hết chữ.
  func drawTop(_ ctx: inout GraphicsContext, _ size: CGSize, cyK: CGFloat = 0.36, mini: Bool = false) {
    let W = size.width, Ht = size.height, R = Self.R
    background(&ctx, size, stops: [.init(color: Self.top, location: 0), .init(color: Self.felt, location: 1)])
    let f = a, rt = Self.right(f)
    func loc(_ p: CGPoint) -> CGPoint {
      let v = CGPoint(x: p.x - o.x, y: p.y - o.y)
      return CGPoint(x: ShotPhysics.dot(v, rt), y: ShotPhysics.dot(v, f))
    }
    let gh = loc(G), ct = loc(contact)
    let sc = min(W / (7.6 * R), Ht / (9.4 * R)), Rp = R * sc
    let cx = W / 2 - gh.x / 2 * sc, cy = Ht * cyK
    func pt(_ q: CGPoint) -> CGPoint { CGPoint(x: cx + q.x * sc, y: cy - q.y * sc) }
    let Op = pt(.zero), Gp = pt(gh), Cp = pt(ct)
    let uS = CGPoint(x: ShotPhysics.dot(d, rt), y: -ShotPhysics.dot(d, f))
    let far = CGPoint(x: Op.x + uS.x * Rp * 2.9, y: Op.y + uS.y * Rp * 2.9)
    let ang = atan2(uS.y, uS.x), ca = cos(ang), sa = sin(ang)
    func rp(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: far.x + x * ca - y * sa, y: far.y + x * sa + y * ca) }
    let side: CGFloat = gh.x >= 0 ? 1 : -1
    let sideA: UnitPoint = side > 0 ? .leading : .trailing
    let cb = CGPoint(x: Gp.x, y: Gp.y + Rp * 2.9)
    let tS = CGPoint(x: -uS.y, y: uS.x)

    // Đường vào lỗ, đường ngắm, tangent.
    line(&ctx, [Gp, far], Self.pot.opacity(0.75), 1.5)
    line(&ctx, [CGPoint(x: Gp.x, y: Ht), Gp], .white.opacity(0.5), 1.2, dash: [2, 4])
    line(&ctx, [CGPoint(x: Gp.x - tS.x * Rp * 2.2, y: Gp.y - tS.y * Rp * 2.2),
                CGPoint(x: Gp.x + tS.x * Rp * 2.2, y: Gp.y + tS.y * Rp * 2.2)], Self.gold.opacity(0.35), 1, dash: [4, 4])
    var arrow = Path()
    arrow.move(to: rp(0, 0)); arrow.addLine(to: rp(-8, -4)); arrow.addLine(to: rp(-8, 4)); arrow.closeSubpath()
    ctx.fill(arrow, with: .color(Self.pot.opacity(0.9)))
    // Giữ nhãn cách mép 12pt: dấu Ề Ỗ chồng hai tầng, sát mép là bị cắt mất dấu.
    if !mini {
      label(&ctx, "VỀ LỖ", at: CGPoint(x: min(max(far.x + uS.x * 12, 12), W - 12), y: min(max(far.y + uS.y * 12, 12), Ht - 12)),
            anchor: uS.x > 0.3 ? .leading : uS.x < -0.3 ? .trailing : .center, Self.pot.opacity(0.95))
    }

    // Bi trắng mờ phía dưới ghost, bi mục tiêu, ghost, điểm chạm.
    ctx.drawLayer { l in
      l.opacity = 0.55
      ball(&l, 0, at: cb, Rp)
    }
    if !mini { label(&ctx, "BI TRẮNG", at: CGPoint(x: cb.x + side * (Rp + 8), y: cb.y), anchor: sideA, Self.cream.opacity(0.7)) }
    ball(&ctx, ball, at: Op, Rp)
    ghostRing(&ctx, at: Gp, Rp, fill: 0.06)
    contactDot(&ctx, at: Cp, max(3.5, Rp * 0.1))
    // Không nhãn R, góc φ hay khoảng k: số đo cho người mới là nhiễu, vòng nét đứt và chấm vàng là đủ.
    if !mini { label(&ctx, "ĐÍCH", at: CGPoint(x: Gp.x + side * (Rp + 8), y: Gp.y), anchor: sideA, .white.opacity(0.7)) }
  }

  // MARK: nhìn từ sau bi cái

  func drawBack(_ ctx: inout GraphicsContext, _ size: CGSize, cyK: CGFloat = 0.36, mini: Bool = false) {
    let W = size.width, Ht = size.height, R = Self.R
    background(&ctx, size, stops: [.init(color: Self.top, location: 0), .init(color: Self.felt, location: 0.55), .init(color: Self.felt, location: 1)])
    let rt = Self.right(stick)
    func proj(_ p: CGPoint) -> CGFloat { ShotPhysics.dot(CGPoint(x: p.x - c.x, y: p.y - c.y), rt) }
    let xOb = proj(o), xG = proj(G), xC = proj(contact)
    let lo = min(xOb, 0, xG) - R * 1.3, hi = max(xOb, 0, xG) + R * 1.3
    let sc = min(Ht * 0.4 / (2 * R), W * 0.9 / (hi - lo))
    func X(_ x: CGFloat) -> CGFloat { W / 2 + (x - (lo + hi) / 2) * sc }
    let cy = Ht * cyK, Rp = R * sc
    let gS: CGFloat = xG >= xOb ? 1 : -1
    let obP = CGPoint(x: X(xOb), y: cy), gP = CGPoint(x: X(xG), y: cy)

    ball(&ctx, ball, at: obP, Rp)
    // Dải chồng: phần ghost nằm trong bi mục tiêu tô gold nhạt.
    ctx.drawLayer { l in
      l.clip(to: circle(obP, Rp))
      l.fill(circle(gP, Rp), with: .color(Self.gold.opacity(0.3)))
    }
    ghostRing(&ctx, at: gP, Rp, fill: 0.05)
    // Không vẽ cơ: một đường thẳng theo hướng cơ là đủ hiểu.
    line(&ctx, [CGPoint(x: X(0), y: cy - Rp * 1.25), CGPoint(x: X(0), y: Ht)], .white.opacity(0.3), 1, dash: [2, 4])

    let dotR = max(4, Rp * 0.11)
    contactDot(&ctx, at: CGPoint(x: X(xC), y: cy), dotR)
    guard !mini else { return }
    label(&ctx, "ĐIỂM CHẠM", at: CGPoint(x: X(xC), y: cy - Rp - 16), Self.gold)
    if abs(xG - xOb) > R * 0.15 {
      let gLx = gP.x + gS * (Rp + 8), fits = gLx + gS * 50 > 2 && gLx + gS * 50 < W - 2
      label(&ctx, "ĐÍCH", at: fits ? CGPoint(x: gLx, y: cy) : CGPoint(x: gP.x, y: cy + Rp + 12),
            anchor: fits ? (gS > 0 ? .leading : .trailing) : .center, .white.opacity(0.7))
    }
  }
}
