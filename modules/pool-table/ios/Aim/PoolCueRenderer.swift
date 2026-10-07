import SwiftUI

/// Cây cơ nhìn từ sau lưng người cơ: đầu cơ ở xa (nhỏ), báng ở gần (to), thu nhỏ tuyến tính theo phối cảnh.
/// Vẽ theo dáng cơ Exceed: ferrule trắng, ngọn maple, khớp bạc, báng gỗ mun có mũi tulipwood.
/// Tự vẽ, không lấy ảnh hay logo của hãng.
enum PoolCueRenderer {
  /// Mỗi khúc: vị trí tính theo tỉ lệ chiều dài nhìn thấy, từ đầu cơ xuống.
  private struct Segment {
    let from: CGFloat
    let to: CGFloat
    let color: Color
  }

  private static let segments: [Segment] = [
    Segment(from: 0, to: 0.05, color: Color(hex: 0x3F6DA8)),  // đầu cơ đã đánh phấn
    Segment(from: 0.05, to: 0.15, color: Color(hex: 0xECE7DA)),  // ferrule
    Segment(from: 0.15, to: 0.52, color: Color(hex: 0xD6B584)),  // ngọn maple
    Segment(from: 0.52, to: 0.57, color: Color(hex: 0xC4C8CE)),  // khớp bạc
    Segment(from: 0.57, to: 1, color: Color(hex: 0x16100D)),  // báng gỗ mun
  ]

  static func draw(
    tipX: CGFloat,
    tipY: CGFloat,
    tipWidth: CGFloat,
    bottomWidth: CGFloat,
    height: CGFloat,
    in ctx: inout GraphicsContext
  ) {
    let length = height - tipY
    guard length > 0 else { return }
    let y = { (t: CGFloat) in tipY + length * t }
    let width = { (t: CGFloat) in tipWidth + (bottomWidth - tipWidth) * t }

    /// Dải dọc theo cơ: `a`…`b` là vị trí ngang theo tỉ lệ bề rộng (0 mép trái, 1 mép phải).
    func band(_ t0: CGFloat, _ t1: CGFloat, _ a: CGFloat = 0, _ b: CGFloat = 1) -> Path {
      var p = Path()
      let w0 = width(t0), w1 = width(t1)
      p.move(to: CGPoint(x: tipX - w0 / 2 + w0 * a, y: y(t0)))
      p.addLine(to: CGPoint(x: tipX - w0 / 2 + w0 * b, y: y(t0)))
      p.addLine(to: CGPoint(x: tipX - w1 / 2 + w1 * b, y: y(t1)))
      p.addLine(to: CGPoint(x: tipX - w1 / 2 + w1 * a, y: y(t1)))
      p.closeSubpath()
      return p
    }

    // Bóng cơ đổ lên vải, lệch phải như bóng bi.
    ctx.drawLayer { layer in
      layer.addFilter(.blur(radius: 6))
      layer.translateBy(x: bottomWidth * 0.12, y: 6)
      layer.fill(band(0.02, 1), with: .color(.black.opacity(0.5)))
    }

    let body = band(0, 1)
    ctx.drawLayer { layer in
      layer.clip(to: body)
      for s in segments {
        layer.fill(band(s.from, s.to), with: .color(s.color))
      }
      // Mũi tulipwood khảm vào báng, nhọn về phía đầu cơ.
      for (center, half) in [(0.5, 0.17), (0.0, 0.17), (1.0, 0.17)] as [(CGFloat, CGFloat)] {
        var point = Path()
        let apex = y(0.68), base = y(1)
        let wBase = width(1), wApex = width(0.68)
        point.move(to: CGPoint(x: tipX - wApex / 2 + wApex * center, y: apex))
        point.addLine(to: CGPoint(x: tipX - wBase / 2 + wBase * (center + half), y: base))
        point.addLine(to: CGPoint(x: tipX - wBase / 2 + wBase * (center - half), y: base))
        point.closeSubpath()
        layer.fill(point, with: .color(Color(hex: 0x9C4A33)))
      }
      // Khoen bạc mảnh dưới khớp.
      layer.fill(band(0.6, 0.605), with: .color(Color(hex: 0xC4C8CE)))

      // Khối trụ: hai mép tối, một vệt sáng lệch trái theo đèn.
      layer.fill(band(0, 1, 0, 0.14), with: .color(.black.opacity(0.35)))
      layer.fill(band(0, 1, 0.86, 1), with: .color(.black.opacity(0.45)))
      layer.fill(band(0, 1, 0.26, 0.38), with: .color(.white.opacity(0.22)))
    }
  }
}
