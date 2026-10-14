import SwiftUI

/// Thẻ bài: cú đang soạn viết thành chữ, mở trong `.sheet` hệ thống từ nút "Thẻ bài" trên thanh tiêu đề.
/// Port thẻ của Soạn bài v5.2: cùng chữ với bảng dưới bàn và hai hình, không đơn vị. Chỉ đọc, chưa lưu.
struct PoolShotCard: View {
  @ObservedObject var model: PoolEditorModel
  @Environment(\.dismiss) private var dismiss

  var body: some View {
    let t = ShotCardText(model)
    ScrollView {
      VStack(alignment: .leading, spacing: 12) {
        HStack {
          Text(ShotCardText.eyebrow)
            .font(.custom("BeVietnamPro-SemiBold", size: 12, relativeTo: .caption))
            .kerning(1)
            .foregroundStyle(PoolAimPalette.gold)
          Spacer()
          Button("Xong") { dismiss() }
            .font(.custom("BeVietnamPro-SemiBold", size: 15, relativeTo: .subheadline))
            .foregroundStyle(Color(hex: 0xF5F5F7))
            .padding(.horizontal, 14)
            .frame(minHeight: 30)
            .background(Capsule().fill(Color(red: 118 / 255, green: 118 / 255, blue: 128 / 255).opacity(0.24)))
            .buttonStyle(PoolPressStyle())
        }
        .padding(.top, 14)
        if let t {
          Text(t.title)
            .font(.custom("BeVietnamPro-SemiBold", size: 24, relativeTo: .title2))
            .tracking(-0.4)
            .foregroundStyle(.white)
            .padding(.top, -6)
          if !t.goal.isEmpty {
            Text(t.goal)
              .font(.custom("BeVietnamPro-Regular", size: 15, relativeTo: .body))
              .foregroundStyle(Color(hex: 0xF5F5F7))
          }
          Grid(alignment: .topLeading, horizontalSpacing: 12, verticalSpacing: 10) {
            row("Setup", t.place)
            row("Shot", t.shot)
            row("Aim adjust", t.comp)
            row("Cue ball", t.cue)
          }
          Text(ShotCardText.foot)
            .font(.custom("BeVietnamPro-Regular", size: 12, relativeTo: .caption))
            .foregroundStyle(Color(red: 235 / 255, green: 235 / 255, blue: 245 / 255).opacity(0.45))
            .padding(.top, 4)
        } else {
          Text("Pick a ball, then a pocket on the Table. The card fills itself in.")
            .font(.custom("BeVietnamPro-Regular", size: 15, relativeTo: .body))
            .foregroundStyle(Color.white.opacity(0.64))
        }
      }
      .padding(.horizontal, 20)
      .padding(.bottom, 26)
    }
    .presentationDetents([.medium, .large])
    .presentationDragIndicator(.visible)
  }

  private func row(_ key: String, _ value: String) -> some View {
    GridRow {
      Text(key)
        .font(.custom("BeVietnamPro-Medium", size: 13, relativeTo: .footnote))
        .foregroundStyle(Color(red: 235 / 255, green: 235 / 255, blue: 245 / 255).opacity(0.6))
        .frame(width: 76, alignment: .leading)
        .padding(.top, 1)
      Text(value)
        .font(.custom("BeVietnamPro-Regular", size: 15, relativeTo: .body))
        .foregroundStyle(.white)
        .frame(maxWidth: .infinity, alignment: .leading)
        .fixedSize(horizontal: false, vertical: true)
    }
  }
}

/// Chữ trên thẻ, đọc lại đúng chữ của `ShotPanelState` và `ShotFigure`, không tính riêng.
struct ShotCardText {
  static let eyebrow = "DRAFT · NOT SAVED"
  static let foot = "Coordinates (a, b): stand at the break end facing the rack. a counts diamonds from the left rail (0–4), b from the top rail (0–8). 9 ft table: 1 diamond = 31.75 cm."
  let title, goal, place, shot, comp, cue: String

  init?(_ m: PoolEditorModel) {
    guard let fig = ShotFigure(m), let pocket = m.aimPocket else { return nil }
    let pocketName = ShotPhysics.targetName(pocket)
    let ball = fig.ballName.capitalized
    let s = ShotPanelState(m)

    title = "\(ball) to \(pocketName)"
    goal = s.ran && !s.sunk ? "Then stop the cue ball inside the circle." : ""
    place = "Cue \(Self.dia(fig.c)) · \(ball) \(Self.dia(fig.o)) → \(pocketName)"
    shot = s.tipText + (s.sideText.isEmpty ? "" : ", " + s.sideText.lowercased())
      + " · speed " + PoolShotPanel.powerWord(m.speed).lowercased()
      + (s.spinText.isEmpty ? "" : " · " + s.spinText.lowercased())
    comp = fig.topSay + " " + fig.topComp
    cue = !s.ran ? "—" : s.sunk ? "Scratched, shot failed" : s.stop.map { "Stops at \(Self.dia($0))" } ?? "—"
  }

  /// Diamond tính từ băng trái và băng trên, làm tròn ⅛.
  private static let fr = ["", "⅛", "¼", "⅜", "½", "⅝", "¾", "⅞"]
  private static func dv(_ v: CGFloat) -> String {
    let e = Int((v * 8).rounded()), w = e / 8, f = fr[e % 8]
    return w == 0 && !f.isEmpty ? f : "\(w)\(f)"
  }
  static func dia(_ p: CGPoint) -> String {
    "(\(dv(p.x / ShotPhysics.width * 4)), \(dv(p.y / ShotPhysics.length * 8)))"
  }
}
