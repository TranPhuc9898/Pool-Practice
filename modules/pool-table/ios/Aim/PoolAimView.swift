import ExpoModulesCore
import SwiftUI

final class PoolAimViewProps: ExpoSwiftUI.ViewProps {
  @Field var drill: DrillRecord = DrillRecord()
}

/// Hình học cú ngắm, tính trong hệ inch như `PoolGuideMath`.
/// Mirror của `src/pool-engine/aim.ts`: sửa một bên thì sửa cả bên kia.
struct PoolAim {
  /// Số bi mục tiêu.
  let ball: Int
  /// Lệch ngang nhìn từ người cơ, theo bán kính bi, dương là phải. Điểm chạm lệch `side`, tâm ghost lệch `2 · side`.
  /// Trị tuyệt đối là sin của góc cắt.
  let side: CGFloat

  init?(drill: DrillRecord) {
    let guide = drill.guideLines.first { $0.kind == "objectBallPath" || $0.kind == "ghostBall" }
    let number = guide?.ball ?? drill.objectBalls.first?.number
    guard let number, let object = drill.objectBalls.first(where: { $0.number == number }),
      let pocket = PoolGuideMath.pocketAim(guide?.pocket ?? drill.targetPocket)
    else { return nil }

    let o = PoolGuideMath.inches(x: object.x, y: object.y)
    let cue = PoolGuideMath.inches(x: drill.cueBall.x, y: drill.cueBall.y)
    let d = PoolGuideMath.unit(CGPoint(x: pocket.x - o.x, y: pocket.y - o.y))
    let ghost = PoolGuideMath.ghost(object: o, pocket: pocket)
    let a = PoolGuideMath.unit(CGPoint(x: ghost.x - cue.x, y: ghost.y - cue.y))
    // Bên phải của hướng ngắm, trong hệ y hướng xuống.
    let right = CGPoint(x: -a.y, y: a.x)
    ball = number
    side = max(-1, min(1, -(d.x * right.x + d.y * right.y)))
  }
}

/// Góc nhìn của người cơ: nhìn dọc đường ngắm, bi mục tiêu phóng to.
/// Chấm gold là điểm chạm (contact point) trên bi mục tiêu. Vòng nét đứt là ghost ball, chỗ tâm bi cái phải tới.
/// Cây cơ chĩa vào tâm ghost, không vào chấm gold: ngắm thẳng vào điểm chạm là lỗi kinh điển, cú sẽ mỏng hơn.
struct PoolAimView: ExpoSwiftUI.View, ExpoSwiftUI.WithHostingView {
  @ObservedObject var props: PoolAimViewProps
  private let theme = PoolTableTheme.tournament

  var body: some View {
    GeometryReader { proxy in
      let size = proxy.size
      let aim = PoolAim(drill: props.drill)
      let d = min(size.height * 0.44, size.width * 0.24)
      let r = d / 2
      let side = aim?.side ?? 0
      // Căn giữa cặp bi mục tiêu + ghost, để cú cắt mỏng vẫn nằm trong khung.
      let object = CGPoint(x: size.width / 2 - r * side, y: size.height * 0.36)
      let ghost = CGPoint(x: object.x + d * side, y: object.y)
      let contact = CGPoint(x: object.x + r * side, y: object.y)

      ZStack(alignment: .topLeading) {
        Canvas { ctx, size in
          drawFelt(size: size, in: &ctx)
          // Bóng bi trên vải.
          ctx.fill(
            Path(ellipseIn: CGRect(x: object.x - r * 0.9, y: object.y + r * 0.78, width: d * 0.9, height: r * 0.42)),
            with: .color(.black.opacity(0.45))
          )
          ctx.drawLayer { layer in
            PoolBallStyles.current.draw(
              number: aim?.ball ?? 1,
              in: CGRect(x: object.x - r, y: object.y - r, width: d, height: d),
              context: &layer
            )
          }
          drawGhost(center: ghost, r: r, in: &ctx)
          // Nét ngắm nối dấu cộng xuống đầu cơ, chừa chỗ cho nhãn AIM HERE.
          drawAimLine(x: ghost.x, from: ghost.y + r * 0.2, to: ghost.y + r, in: &ctx)
          drawAimLine(x: ghost.x, from: object.y + r + 26, to: object.y + r + d * 0.3, in: &ctx)
          PoolCueRenderer.draw(
            tipX: ghost.x,
            tipY: object.y + r + d * 0.3,
            tipWidth: d * 0.23,
            bottomWidth: d * 1.05,
            height: size.height,
            in: &ctx
          )
          drawContact(at: contact, r: r, in: &ctx)
        }

        label("CONTACT POINT", gold: true)
          .position(x: contact.x, y: object.y - r - 14)
        label("AIM HERE", gold: false)
          .position(x: ghost.x, y: object.y + r + 14)
          .opacity(abs(side) < 0.12 ? 0 : 1)
      }
      .frame(width: size.width, height: size.height)
    }
    .clipped()
    .accessibilityElement()
    .accessibilityLabel("Aim view. Gold dot is the contact point on the object ball. Aim the cue ball center at the dashed ghost ball.")
  }

  private func label(_ text: String, gold: Bool) -> some View {
    Text(text)
      .font(.custom("Outfit-SemiBold", size: 10))
      .tracking(1.4)
      .foregroundStyle(gold ? PoolAimPalette.gold : Color.white.opacity(0.6))
      .fixedSize()
  }

  /// Vải nhìn nghiêng: xa tối, gần sáng dưới đèn.
  private func drawFelt(size: CGSize, in ctx: inout GraphicsContext) {
    let rect = CGRect(origin: .zero, size: size)
    ctx.fill(
      Path(rect),
      with: .linearGradient(
        Gradient(colors: [Color(hex: 0x0D1820), theme.cloth, theme.clothLit]),
        startPoint: .zero,
        endPoint: CGPoint(x: 0, y: size.height)
      )
    )
    ctx.fill(
      Path(rect),
      with: .radialGradient(
        Gradient(colors: [.clear, .black.opacity(0.5)]),
        center: CGPoint(x: size.width / 2, y: size.height * 0.55),
        startRadius: size.width * 0.2,
        endRadius: size.width * 0.75
      )
    )
  }

  private func drawGhost(center: CGPoint, r: CGFloat, in ctx: inout GraphicsContext) {
    let circle = Path(ellipseIn: CGRect(x: center.x - r, y: center.y - r, width: r * 2, height: r * 2))
    ctx.fill(circle, with: .color(.white.opacity(0.08)))
    ctx.stroke(circle, with: .color(.white.opacity(0.8)), style: StrokeStyle(lineWidth: 1.5, dash: [5, 4]))
    // Dấu cộng ở tâm ghost: chỗ tâm bi cái phải tới.
    var plus = Path()
    let k = r * 0.16
    plus.move(to: CGPoint(x: center.x - k, y: center.y))
    plus.addLine(to: CGPoint(x: center.x + k, y: center.y))
    plus.move(to: CGPoint(x: center.x, y: center.y - k))
    plus.addLine(to: CGPoint(x: center.x, y: center.y + k))
    ctx.stroke(plus, with: .color(.white.opacity(0.9)), lineWidth: 1.5)
  }

  private func drawAimLine(x: CGFloat, from top: CGFloat, to bottom: CGFloat, in ctx: inout GraphicsContext) {
    var line = Path()
    line.move(to: CGPoint(x: x, y: top))
    line.addLine(to: CGPoint(x: x, y: bottom))
    ctx.stroke(line, with: .color(.white.opacity(0.35)), style: StrokeStyle(lineWidth: 1, dash: [2, 4]))
  }

  private func drawContact(at p: CGPoint, r: CGFloat, in ctx: inout GraphicsContext) {
    let dot = max(4, r * 0.11)
    ctx.fill(
      Path(ellipseIn: CGRect(x: p.x - dot * 3, y: p.y - dot * 3, width: dot * 6, height: dot * 6)),
      with: .radialGradient(
        Gradient(colors: [PoolAimPalette.gold.opacity(0.55), .clear]),
        center: p,
        startRadius: 0,
        endRadius: dot * 3
      )
    )
    let core = Path(ellipseIn: CGRect(x: p.x - dot, y: p.y - dot, width: dot * 2, height: dot * 2))
    ctx.fill(core, with: .color(PoolAimPalette.gold))
    ctx.stroke(core, with: .color(.black.opacity(0.6)), lineWidth: 1)
  }
}

enum PoolAimPalette {
  /// Cùng gold với Home (`HOME_GOLD` bên TS).
  static let gold = Color(red: 216 / 255, green: 180 / 255, blue: 81 / 255)
}
