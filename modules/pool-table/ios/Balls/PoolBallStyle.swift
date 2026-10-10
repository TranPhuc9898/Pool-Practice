import SwiftUI

/// Cách vẽ một viên bi. Số 0 là bi cái, 1–8 bi trơn, 9–15 bi sọc.
protocol PoolBallStyle {
  func draw(number: Int, in rect: CGRect, context: inout GraphicsContext)
  /// Vẽ theo hướng thân bi. Style phẳng bỏ qua hướng.
  func draw(number: Int, pose: BallPose, in rect: CGRect, context: inout GraphicsContext)
}

extension PoolBallStyle {
  func draw(number: Int, pose: BallPose, in rect: CGRect, context: inout GraphicsContext) {
    draw(number: number, in: rect, context: &context)
  }
}

enum PoolBallStyles {
  /// Đổi style cho mọi bi trong app ở đúng một dòng này.
  static let current: any PoolBallStyle = SphereBallStyle()
}

/// Stub để kiểm việc đổi style: hình tròn phẳng, chỉ có số.
struct FlatBallStyle: PoolBallStyle {
  func draw(number: Int, in rect: CGRect, context: inout GraphicsContext) {
    let color = number == 0 ? TournamentBlackPalette.cue : TournamentBlackPalette.tone(for: number).mid
    context.fill(Path(ellipseIn: rect), with: .color(color))
    guard number > 0 else { return }
    let text = Text("\(number)").font(.system(size: rect.width * 0.45, weight: .bold)).foregroundColor(.white)
    context.draw(text, at: CGPoint(x: rect.midX, y: rect.midY))
  }
}

/// Một viên bi vẽ bằng style hiện hành.
struct PoolBallView: View, Equatable {
  let number: Int
  let diameter: CGFloat
  /// nil: tư thế đứng yên của style.
  var pose: BallPose?

  var body: some View {
    Canvas { context, size in
      let rect = CGRect(origin: .zero, size: size)
      if let pose {
        PoolBallStyles.current.draw(number: number, pose: pose, in: rect, context: &context)
      } else {
        PoolBallStyles.current.draw(number: number, in: rect, context: &context)
      }
    }
    .frame(width: diameter, height: diameter)
    // Bóng tiếp xúc: lệch về phía xa đèn, đậm và gần để bi "ngồi" trên vải.
    .shadow(color: .black.opacity(0.55), radius: diameter * 0.1, x: diameter * 0.05, y: diameter * 0.09)
    .accessibilityLabel(number == 0 ? "Cue ball" : "Ball \(number)")
  }
}
