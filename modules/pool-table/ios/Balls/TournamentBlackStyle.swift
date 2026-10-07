import SwiftUI

/// Aramith Tournament BLACK: bi sọc có hai cực đen, bi cái kem với 6 chấm đen,
/// đĩa số trắng viền đen mảnh, số đen.
struct TournamentBlackStyle: PoolBallStyle {
  typealias Palette = TournamentBlackPalette

  func draw(number: Int, in rect: CGRect, context: inout GraphicsContext) {
    let r = rect.width / 2
    let center = CGPoint(x: rect.midX, y: rect.midY)
    let sphere = Path(ellipseIn: rect)

    context.drawLayer { layer in
      layer.clip(to: sphere)

      if number == 0 {
        layer.fill(sphere, with: .color(Palette.cue))
        drawCueDots(center: center, r: r, in: &layer)
      } else if number <= 8 {
        fillTone(Palette.tone(for: number), rect: rect, center: center, r: r, in: &layer)
      } else {
        layer.fill(sphere, with: .color(Palette.stripePole))
        layer.drawLayer { band in
          band.clip(to: stripeBand(center: center, r: r))
          fillTone(Palette.tone(for: number), rect: rect, center: center, r: r, in: &band)
        }
      }

      if number > 0 {
        drawDisc(number: number, center: center, r: r, in: &layer)
      }

      // Mép tối dần cho cảm giác khối cầu.
      layer.fill(
        sphere,
        with: .radialGradient(
          Gradient(stops: [
            .init(color: .clear, location: 0.55),
            .init(color: .black.opacity(0.38), location: 1),
          ]),
          center: CGPoint(x: center.x - r * 0.12, y: center.y - r * 0.15),
          startRadius: 0,
          endRadius: r * 1.1
        )
      )
      // Viền sáng phản từ vải ở mép dưới phải: tách bi khỏi nền tối mà không cần viền.
      layer.stroke(
        Path(ellipseIn: rect.insetBy(dx: r * 0.04, dy: r * 0.04)),
        with: .linearGradient(
          Gradient(stops: [
            .init(color: .clear, location: 0.55),
            .init(color: Color(red: 0.62, green: 0.76, blue: 0.86).opacity(0.35), location: 1),
          ]),
          startPoint: CGPoint(x: center.x - r, y: center.y - r),
          endPoint: CGPoint(x: center.x + r * 0.7, y: center.y + r)
        ),
        lineWidth: r * 0.08
      )
      // Đốm bóng: quầng mềm + một điểm gắt ở tâm quầng, như đèn bàn phản trên nhựa phenolic.
      layer.fill(
        Path(ellipseIn: CGRect(x: center.x - r * 0.62, y: center.y - r * 0.7, width: r * 0.55, height: r * 0.4)),
        with: .radialGradient(
          Gradient(colors: [.white.opacity(0.75), .white.opacity(0)]),
          center: CGPoint(x: center.x - r * 0.36, y: center.y - r * 0.5),
          startRadius: 0,
          endRadius: r * 0.3
        )
      )
      let pin = r * 0.11
      layer.fill(
        Path(ellipseIn: CGRect(x: center.x - r * 0.38 - pin, y: center.y - r * 0.52 - pin * 0.7, width: pin * 2, height: pin * 1.4)),
        with: .color(.white.opacity(0.9))
      )
    }
  }

  private func fillTone(_ tone: Palette.Tone, rect: CGRect, center: CGPoint, r: CGFloat, in context: inout GraphicsContext) {
    context.fill(
      Path(ellipseIn: rect),
      with: .radialGradient(
        Gradient(colors: [tone.highlight, tone.mid]),
        center: CGPoint(x: center.x - r * 0.35, y: center.y - r * 0.4),
        startRadius: 0,
        endRadius: r * 1.2
      )
    )
  }

  /// Dải màu giữa bi sọc, mép cong theo khối cầu.
  private func stripeBand(center: CGPoint, r: CGFloat) -> Path {
    let half = r * 0.56
    let bow = r * 0.14
    var p = Path()
    p.move(to: CGPoint(x: center.x - r, y: center.y - half + bow))
    p.addQuadCurve(to: CGPoint(x: center.x + r, y: center.y - half + bow), control: CGPoint(x: center.x, y: center.y - half - bow))
    p.addLine(to: CGPoint(x: center.x + r, y: center.y + half - bow))
    p.addQuadCurve(to: CGPoint(x: center.x - r, y: center.y + half - bow), control: CGPoint(x: center.x, y: center.y + half + bow))
    p.closeSubpath()
    return p
  }

  private func drawDisc(number: Int, center: CGPoint, r: CGFloat, in context: inout GraphicsContext) {
    let dr = r * 0.44
    let disc = Path(ellipseIn: CGRect(x: center.x - dr, y: center.y - dr, width: dr * 2, height: dr * 2))
    context.fill(disc, with: .color(Palette.disc))
    context.stroke(disc, with: .color(Palette.discInk), lineWidth: max(0.5, r * 0.04))
    let size = r * (number >= 10 ? 0.42 : 0.52)
    let text = Text("\(number)")
      .font(.system(size: size, weight: .heavy))
      .foregroundColor(Palette.discInk)
    context.draw(text, at: CGPoint(x: center.x, y: center.y + r * 0.02))
  }

  /// Sáu chấm: một vòng năm chấm quanh một chấm giữa, chấm xa tâm dẹt lại theo khối cầu.
  private func drawCueDots(center: CGPoint, r: CGFloat, in context: inout GraphicsContext) {
    let dot = r * 0.17
    var spots: [(CGPoint, CGFloat)] = [(center, 1)]
    for i in 0..<5 {
      let angle = Double(i) * 2 * .pi / 5 - .pi / 2
      let reach = r * 0.6
      spots.append((CGPoint(x: center.x + reach * cos(angle), y: center.y + reach * sin(angle)), 0.8))
    }
    for (p, squash) in spots {
      let w = dot * 2 * squash
      context.fill(
        Path(ellipseIn: CGRect(x: p.x - w / 2, y: p.y - w / 2, width: w, height: w)),
        with: .color(Palette.cueDot)
      )
    }
  }
}
