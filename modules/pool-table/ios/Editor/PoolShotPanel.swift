import SwiftUI

/// Bảng cú đánh dưới bàn, port `shotPanel()` của prototype v7. Trái là mặt bi cái, phải là thanh lực,
/// dưới là nút Đánh. Kéo chỉ đổi model, nhấc tay mới commit.
struct PoolShotPanel: View {
  @ObservedObject var model: PoolEditorModel
  let onCommit: () -> Void
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  static let height: CGFloat = 184
  /// Thang tốc độ bi cái của Dr. Dave: chậm 0.45–0.89, vừa 0.89–1.9, nhanh 1.9–3.2, mạnh 3.2–4.5 m/s.
  /// Mốc đặt giữa từng khoảng. Phá bi (11 m/s trở lên) không thuộc bảng này.
  static let vMin: CGFloat = 0.3
  static let vMax: CGFloat = 4.5
  static let marks: [(v: CGFloat, label: String)] = [(0.7, "Chậm"), (1.4, "Vừa"), (2.5, "Nhanh"), (3.8, "Mạnh")]

  var body: some View {
    let verdict = model.aimBall.flatMap { b in
      model.aimPocket.flatMap { ShotPhysics.shotOf(ball: b, pocket: $0, balls: model.balls) }
    }
    let ms = verdict?.level == .bad ? nil : model.shotSetup
    let run = ms.map { ShotPhysics.runWith($0, tip: model.tip, speed: model.speed) }
    VStack(spacing: 12) {
      HStack(alignment: .center, spacing: 12) {
        PoolTipPad(model: model, stun: ms.flatMap { ShotPhysics.stunTip($0, speed: model.speed) }, onCommit: onCommit)
        VStack(alignment: .leading, spacing: 0) {
          row("Đầu cơ") { Text(Self.tipWord(model.tip)) }
          status(verdict: verdict, run: run)
          row("Lực") { Text("\(Self.fmt1(model.speed)) m/s · \(Self.powerWord(model.speed))") }
            .padding(.top, 6)
          // Không ghi chữ dưới vạch: bốn chữ không vừa thanh, tên khoảng lực đã nằm ở dòng Lực.
          PoolPowerTrack(model: model, onCommit: onCommit)
        }
      }
      HStack(spacing: 10) {
        paths
        shoot(enabled: ms != nil)
      }
    }
    .padding(.horizontal, 8)
    .frame(height: Self.height)
  }

  /// Trạng thái bi cái lúc chạm. Cú hỏng thì lý do đỏ thay chỗ, vì đó là thứ cần đọc trước.
  private func status(verdict: ShotPhysics.Verdict?, run: ShotPhysics.Run?) -> some View {
    let raw = verdict?.level == .bad ? verdict!.why : ShotPhysics.why(run)
    let f = run.flatMap { $0.short == .cue ? nil : $0.f }
    let slip = abs(model.tip) > ShotPhysics.tipMax + 0.001
    let why = slip ? "trượt cơ, quá 0.6R" : raw
    let miscue = why.isEmpty && abs(model.tip) > ShotPhysics.miscueSafe + 0.001
    return HStack(spacing: 6) {
      if !why.isEmpty {
        Image(systemName: "exclamationmark.triangle.fill").imageScale(.small)
        Text(why.prefix(1).uppercased() + why.dropFirst())
      } else if miscue {
        Image(systemName: "exclamationmark.triangle.fill").imageScale(.small)
        Text("Quá 0.5R, dễ trượt cơ")
      } else if let f {
        Circle().fill(PoolEditorGuides.spin[PoolEditorGuides.spinIndex(f)]).frame(width: 7, height: 7)
        Text("\(Self.contactWord(f).prefix(1).uppercased() + Self.contactWord(f).dropFirst()) lúc chạm")
      }
    }
    .font(.custom("Outfit-Medium", size: 13, relativeTo: .footnote))
    .foregroundStyle(!why.isEmpty ? PoolEditorGuides.red : miscue ? PoolEditorGuides.orange : Color.white.opacity(0.72))
    .lineLimit(1)
    .minimumScaleFactor(0.85)
    .frame(minHeight: 18)
  }

  /// Bật tắt đường bi cái và bi mục tiêu. Bấm nhiều nên không animation, đổi icon và độ sáng là đủ.
  private var paths: some View {
    Button { model.showPaths.toggle() } label: {
      Label("Đường đi", systemImage: model.showPaths ? "eye" : "eye.slash")
        .font(.custom("Outfit-Medium", size: 15, relativeTo: .subheadline))
        .foregroundStyle(model.showPaths ? Color.white : Color.white.opacity(0.64))
        .padding(.horizontal, 16)
        .frame(minHeight: 48)
        .background(Capsule().fill(Color.white.opacity(model.showPaths ? 0.16 : 0.08)))
        .contentShape(Capsule())
    }
    .buttonStyle(PoolPressStyle())
    .accessibilityAddTraits(model.showPaths ? .isSelected : [])
    .accessibilityHint("Bật tắt đường bi cái và bi mục tiêu, giữ ghost và điểm chạm")
  }

  private func shoot(enabled: Bool) -> some View {
    let playing = model.replay != nil
    return Button {
      model.toggleReplay(reduceMotion: reduceMotion)
    } label: {
      Label(playing ? "Dừng" : "Đánh", systemImage: playing ? "stop.fill" : "play.fill")
        .font(.custom("Outfit-SemiBold", size: 17, relativeTo: .body))
        .foregroundStyle(.black)
        .frame(maxWidth: .infinity, minHeight: 48)
        .background(Capsule().fill(PoolAimPalette.gold))
        .contentShape(Capsule())
    }
    .buttonStyle(PoolPressStyle())
    .disabled(!enabled && !playing)
    .opacity(enabled || playing ? 1 : 0.4)
    .accessibilityHint(playing ? "Dừng chạy thử" : "Chạy thử cú này trên bàn")
  }

  private func row<V: View>(_ key: String, @ViewBuilder value: () -> V) -> some View {
    HStack(alignment: .firstTextBaseline) {
      Text(key)
        .font(.custom("Outfit-Medium", size: 13, relativeTo: .footnote))
        .foregroundStyle(Color.white.opacity(0.64))
      Spacer(minLength: 10)
      value()
        .font(.custom("Outfit-SemiBold", size: 15, relativeTo: .subheadline))
        .monospacedDigit()
        .foregroundStyle(.white)
        .lineLimit(1)
    }
    .frame(minHeight: 20)
  }

  static func x(of v: CGFloat, width: CGFloat) -> CGFloat { sqrt(max(v - vMin, 0) / (vMax - vMin)) * width }
  static func v(at x: CGFloat, width: CGFloat) -> CGFloat {
    let k = min(max(x / width, 0), 1)
    return vMin + k * k * (vMax - vMin)
  }
  static func fmt1(_ v: CGFloat) -> String { String(format: "%.1f", Double(v)) }
  static func powerWord(_ v: CGFloat) -> String {
    v < 0.45 ? "chạm nhẹ" : v < 0.89 ? "chậm" : v < 1.9 ? "vừa" : v < 3.2 ? "nhanh" : "mạnh"
  }
  static func contactWord(_ f: CGFloat) -> String {
    f < -0.05 ? "còn draw" : f < 0.12 ? "stun" : f < 0.9 ? "follow một phần" : f <= 1.04 ? "lăn đều" : "follow mạnh"
  }
  static func tipWord(_ t: CGFloat) -> String {
    abs(t) < 0.025 ? "tâm" : t > 0 ? String(format: "cao %.2fR", Double(t)) : String(format: "thấp %.2fR", Double(-t))
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

/// Mặt bi cái. Chạm đâu đặt đó theo chiều dọc, hít vào mốc trong 0.03R, mỗi lần hít một haptic.
struct PoolTipPad: View {
  @ObservedObject var model: PoolEditorModel
  let stun: CGFloat?
  let onCommit: () -> Void
  @State private var held = false
  @State private var snap: String?

  static let size: CGFloat = 96
  /// Chừa bên phải mặt bi cho chữ của vạch, để chữ không đè vòng miscue.
  static let width: CGFloat = 124
  /// Mặt bi bán kính 44 trong hệ 100 của prototype.
  private static let unit = size / 100

  private struct Detent { let id: String; let t: CGFloat; let color: Color }

  private var detents: [Detent] {
    var d = [Detent(id: "roll", t: ShotPhysics.rollTip, color: PoolEditorGuides.spin[2]),
             Detent(id: "center", t: 0, color: .black.opacity(0.35))]
    if let stun { d.append(Detent(id: "stun", t: stun, color: Color(white: 0x3A / 255))) }
    return d
  }

  var body: some View {
    let detents = detents
    Canvas { ctx, size in
      let u = Self.unit
      let c = CGPoint(x: Self.size / 2, y: size.height / 2)
      let y = { (t: CGFloat) in c.y - t * 44 * u }
      let face = Path(ellipseIn: CGRect(x: c.x - 44 * u, y: c.y - 44 * u, width: 88 * u, height: 88 * u))
      ctx.fill(face, with: .radialGradient(
        Gradient(stops: [.init(color: .white, location: 0),
                         .init(color: Color(red: 0xEC / 255, green: 0xE8 / 255, blue: 0xDE / 255), location: 0.5),
                         .init(color: Color(red: 0xA8 / 255, green: 0xA4 / 255, blue: 0x9A / 255), location: 1)]),
        center: CGPoint(x: c.x - 44 * u + 0.35 * 88 * u, y: c.y - 44 * u + 0.32 * 88 * u),
        startRadius: 0, endRadius: 0.75 * 88 * u))
      var cross = Path()
      cross.move(to: CGPoint(x: c.x, y: c.y - 44 * u)); cross.addLine(to: CGPoint(x: c.x, y: c.y + 44 * u))
      ctx.stroke(cross, with: .color(.black.opacity(0.16)), lineWidth: 1)
      var h = Path()
      h.move(to: CGPoint(x: c.x - 44 * u, y: c.y)); h.addLine(to: CGPoint(x: c.x + 44 * u, y: c.y))
      ctx.stroke(h, with: .color(.black.opacity(0.1)), lineWidth: 1)
      // Vòng miscue 0.5R. Ngoài vòng tới 0.6R chấm cam, quá 0.6R chấm đỏ và không đánh được.
      let r = 44 * ShotPhysics.miscueSafe * u
      ctx.stroke(Path(ellipseIn: CGRect(x: c.x - r, y: c.y - r, width: 2 * r, height: 2 * r)),
                 with: .color(.black.opacity(0.28)), style: StrokeStyle(lineWidth: 1, dash: [3 * u, 3 * u]))
      for d in detents where d.id != "center" {
        var l = Path()
        l.move(to: CGPoint(x: c.x - 14 * u, y: y(d.t))); l.addLine(to: CGPoint(x: c.x + 14 * u, y: y(d.t)))
        ctx.stroke(l, with: .color(d.color), style: StrokeStyle(lineWidth: 2 * u, lineCap: .round))
        // Gạch nối từ vạch ra chữ ngoài mép bi.
        var lead = Path()
        lead.move(to: CGPoint(x: c.x + 44 * u + 2, y: y(d.t))); lead.addLine(to: CGPoint(x: c.x + 44 * u + 6, y: y(d.t)))
        ctx.stroke(lead, with: .color(.white.opacity(0.4)), lineWidth: 1)
        ctx.draw(Text(d.id == "roll" ? "lăn" : "stun")
                   .font(.custom("Outfit-Medium", size: 11))
                   .foregroundColor(.white.opacity(0.64)),
                 at: CGPoint(x: c.x + 44 * u + 9, y: y(d.t)), anchor: .leading)
      }
      let ty = y(model.tip)
      let off = abs(model.tip)
      let tipColor = off > ShotPhysics.tipMax + 0.001 ? PoolEditorGuides.red
        : off > ShotPhysics.miscueSafe + 0.001 ? PoolEditorGuides.orange
        : Color(red: 63 / 255, green: 109 / 255, blue: 168 / 255)
      ctx.fill(Path(ellipseIn: CGRect(x: c.x - 13 * u, y: ty - 13 * u, width: 26 * u, height: 26 * u)),
               with: .color(tipColor.opacity(0.3)))
      let dot = Path(ellipseIn: CGRect(x: c.x - 7.5 * u, y: ty - 7.5 * u, width: 15 * u, height: 15 * u))
      ctx.fill(dot, with: .color(tipColor))
      ctx.stroke(dot, with: .color(Color(red: 13 / 255, green: 26 / 255, blue: 43 / 255)), lineWidth: 1.5 * u)
    }
    .frame(width: Self.width, height: Self.size)
    .contentShape(Rectangle())
    .gesture(
      DragGesture(minimumDistance: 0)
        .onChanged { v in
          if !held { held = true; snap = nil; model.replay = nil }
          set(y: v.location.y, detents)
        }
        .onEnded { _ in
          held = false
          onCommit()
        }
    )
    .accessibilityElement()
    .accessibilityLabel("Điểm đặt đầu cơ trên bi cái, cao là follow, thấp là draw")
    .accessibilityValue(PoolShotPanel.tipWord(model.tip))
    .accessibilityAdjustableAction { dir in
      let d: CGFloat = dir == .increment ? 0.05 : dir == .decrement ? -0.05 : 0
      guard d != 0 else { return }
      model.tip = (min(max(model.tip + d, -ShotPhysics.padMax), ShotPhysics.padMax) * 100).rounded() / 100
      onCommit()
    }
  }

  private func set(y: CGFloat, _ detents: [Detent]) {
    var t = min(max(-(y / Self.size * 100 - 50) / 44, -ShotPhysics.padMax), ShotPhysics.padMax)
    var hit: String?
    for d in detents where abs(t - d.t) < 0.03 { t = d.t; hit = d.id }
    if let hit, hit != snap {
      let what = hit == "roll" ? "lăn đều 0.4R" : hit == "stun" ? "stun " + PoolShotPanel.tipWord(t) : "tâm"
      EditorHaptics.fire(.selection, "Đầu cơ hít mốc \(what)")
    }
    snap = hit
    model.tip = (t * 100).rounded() / 100
  }
}

/// Thanh lực 0.3 đến 4.5 m/s. Kéo tương đối, thumb không nhảy về ngón tay.
/// Chạm không kéo thì đặt đúng chỗ chạm, gần mốc trong 0.25 thì hít mốc.
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
        Capsule().fill(Color.white.opacity(0.14))
          .frame(width: w, height: 5).offset(y: 18)
        Capsule().fill(PoolAimPalette.gold)
          .frame(width: max(5, x), height: 5).offset(y: 18)
        ForEach(PoolShotPanel.marks, id: \.v) { m in
          RoundedRectangle(cornerRadius: 1).fill(Color.white.opacity(0.5))
            .frame(width: 2, height: 11)
            .offset(x: PoolShotPanel.x(of: m.v, width: w) - 1, y: 15)
        }
        Circle().fill(.white)
          .shadow(color: .black.opacity(0.5), radius: 3, y: 2)
          .frame(width: 24, height: 24)
          .scaleEffect(drag != nil && !reduceMotion ? 1.12 : 1)
          .animation(.spring(response: 0.25, dampingFraction: 1), value: drag != nil)
          .offset(x: x - 12, y: 8)
      }
      .frame(width: w, height: 40, alignment: .topLeading)
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
    .frame(height: 40)
    .accessibilityElement()
    .accessibilityLabel("Lực, tốc độ bi cái lúc rời đầu cơ")
    .accessibilityValue("\(PoolShotPanel.fmt1(model.speed)) mét mỗi giây, \(PoolShotPanel.powerWord(model.speed))")
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
