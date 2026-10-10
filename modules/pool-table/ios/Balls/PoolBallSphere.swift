import SwiftUI
import UIKit
import simd

/// Hướng bi lúc vẽ. Quaternion đưa toạ độ thân bi sang khung vẽ: X phải, Y lên màn hình, Z hướng vào mắt.
/// `blur` là các tư thế trong lúc màn trập mở, cũ trước mới sau; rỗng là bi đứng yên.
struct BallPose: Equatable {
  var q: simd_quatf
  var blur: [simd_quatf] = []

  static let rest = BallPose(q: simd_quatf(ix: 0, iy: 0, iz: 0, r: 1))

  static func == (a: Self, b: Self) -> Bool {
    a.q.vector == b.q.vector && a.blur.count == b.blur.count && zip(a.blur, b.blur).allSatisfy { $0.vector == $1.vector }
  }
}

/// Bi cầu vẽ từng pixel trên CPU, cùng công thức với trang nghiên cứu `docs/research/bi-cai-xoay.html`:
/// tia từ mắt chạm cầu ra pháp tuyến n, hoa văn tra theo toạ độ thân bi `qᵀ·n`, đèn Blinn trên trái, tối mép.
/// Hoa văn gắn vào thân bi nên bi xoay thật: chấm, sọc, đĩa số đều quay theo spin.
///
/// Thân bi: đĩa số ở ±z, sọc là dải |y| < 0,465 (chứa đĩa số), bi cái có 6 chấm ở ±x ±y ±z, chấm +x màu xanh
/// để mắt đọc được chiều xoay.
enum PoolBallSphere {
  typealias Palette = TournamentBlackPalette

  /// Bi cái đứng yên nhìn dọc (1,1,1): thấy ba chấm, có chấm xanh, như bi measles đặt ngẫu nhiên trên bàn.
  static func restPose(_ number: Int) -> simd_quatf {
    number == 0 ? simd_quatf(from: simd_normalize(SIMD3<Float>(1, 1, 1)), to: SIMD3<Float>(0, 0, 1)) : BallPose.rest.q
  }

  private static let cache = NSCache<NSString, CGImage>()

  /// Ảnh vuông `px`×`px`, alpha premultiplied. Chỉ cache tư thế đứng yên: replay mỗi khung một hướng, cache vô ích.
  static func image(number: Int, px: Int, pose: BallPose) -> CGImage? {
    let rest = pose.blur.isEmpty && pose.q.vector == restPose(number).vector
    let key = "\(number)-\(px)" as NSString
    if rest, let hit = cache.object(forKey: key) { return hit }
    let img = render(number: number, px: px, poses: pose.blur.isEmpty ? [pose.q] : pose.blur)
    if rest, let img { cache.setObject(img, forKey: key) }
    return img
  }

  // MARK: hoa văn

  private struct Look {
    var kind: Kind
    var base: SIMD3<Float>
    var digit: DigitMask?
    enum Kind { case cue, solid, stripe }
  }

  private static func rgb(_ hex: UInt32) -> SIMD3<Float> {
    SIMD3(Float((hex >> 16) & 0xFF), Float((hex >> 8) & 0xFF), Float(hex & 0xFF)) / 255
  }

  /// Màu giữa của bảng Tournament BLACK, cùng số với `TournamentBlackPalette.tones`.
  private static let tones: [UInt32] = [0xE99C00, 0x053E7F, 0xAF0022, 0xF26D85, 0x59478B, 0x25916B, 0x82441F, 0x1D1D1D]
  private static let ivory = rgb(0xF0EDE3)
  private static let pole = rgb(0x181818)
  private static let ink = rgb(0x111111)
  private static let spot = SIMD3<Float>(0.78, 0.09, 0.11)
  private static let mark = SIMD3<Float>(0.10, 0.27, 0.66)
  private static let cloth = SIMD3<Float>(0.62, 0.76, 0.86)

  private static func look(_ n: Int) -> Look {
    if n <= 0 { return Look(kind: .cue, base: ivory) }
    let base = rgb(tones[(n > 8 ? n - 8 : n) - 1])
    return Look(kind: n > 8 ? .stripe : .solid, base: base, digit: DigitMask.of(n))
  }

  @inline(__always) private static func step(_ a: Float, _ b: Float, _ x: Float) -> Float {
    let t = min(max((x - a) / (b - a), 0), 1)
    return t * t * (3 - 2 * t)
  }

  /// `e` là nửa bề rộng mép, theo cỡ pixel: bi nhỏ thì mép mềm hơn để không răng cưa.
  @inline(__always) private static func albedo(_ b: SIMD3<Float>, _ l: Look, _ e: Float) -> SIMD3<Float> {
    let a = simd_abs(b)
    if l.kind == .cue {
      let d = step(0.957 - e, 0.957 + e, max(a.x, max(a.y, a.z)))
      return d == 0 ? l.base : simd_mix(l.base, b.x > 0.9 ? mark : spot, SIMD3(repeating: d))
    }
    var col = l.kind == .stripe ? simd_mix(l.base, pole, SIMD3(repeating: step(0.465 - e, 0.465 + e, a.y))) : l.base
    let disc = step(0.882 - e, 0.882 + e, a.z)
    guard disc > 0 else { return col }
    // Viền đen mảnh ở mép đĩa, rồi nền trắng, rồi số.
    let face = step(0.899 - e, 0.899 + e, a.z)
    var inner = SIMD3<Float>(repeating: 0.95)
    if face > 0, let m = l.digit {
      let u = b.x * (b.z < 0 ? -1 : 1), v = b.y
      let k = m.at(0.5 + u / 0.94, 0.5 - v / 0.94)
      inner = simd_mix(inner, ink, SIMD3(repeating: k))
    }
    col = simd_mix(col, simd_mix(ink, inner, SIMD3(repeating: face)), SIMD3(repeating: disc))
    return col
  }

  // MARK: vẽ

  private static let L = simd_normalize(SIMD3<Float>(-0.35, 0.5, 0.8))
  private static let H = simd_normalize(L + SIMD3<Float>(0, 0, 1))
  private static let bounce = simd_normalize(SIMD2<Float>(0.6, -0.8))

  private static func render(number: Int, px: Int, poses: [simd_quatf]) -> CGImage? {
    guard px > 0, !poses.isEmpty else { return nil }
    let l = look(number)
    // Ma trận thế giới → thân bi cho từng mẫu nhoè.
    let mats = poses.map { simd_transpose(simd_float3x3($0)) }
    let inv = 1 / Float(mats.count)
    let r = Float(px) / 2
    let aa = 1.5 / r
    let e = max(0.003, 0.25 / r)
    var buf = [UInt8](repeating: 0, count: px * px * 4)
    buf.withUnsafeMutableBufferPointer { out in
      for j in 0..<px {
        let y = (r - Float(j) - 0.5) / r
        for i in 0..<px {
          let x = (Float(i) + 0.5 - r) / r
          let rr = x * x + y * y
          guard rr < 1 else { continue }
          let alpha = 1 - step(1 - aa, 1, rr.squareRoot())
          let z = max(0, 1 - rr).squareRoot()
          let n = SIMD3<Float>(x, y, z)
          var alb = SIMD3<Float>(repeating: 0)
          for m in mats { alb += albedo(m * n, l, e) }
          alb *= inv
          let dif = max(simd_dot(n, L), 0)
          let spec = pow(max(simd_dot(n, H), 0), 90)
          let rim = 0.7 + 0.3 * z
          var c = alb * (0.27 + 0.8 * dif) * rim + SIMD3(repeating: spec * 0.55)
          // Ánh vải hắt lên mép dưới phải: tách bi đen khỏi nền tối.
          let side = max(0, x * bounce.x + y * bounce.y)
          c += cloth * (0.22 * (1 - z) * (1 - z) * side)
          c = simd_clamp(c, SIMD3(repeating: 0), SIMD3(repeating: 1)) * alpha
          let o = (j * px + i) * 4
          out[o] = UInt8(c.x * 255 + 0.5)
          out[o + 1] = UInt8(c.y * 255 + 0.5)
          out[o + 2] = UInt8(c.z * 255 + 0.5)
          out[o + 3] = UInt8(alpha * 255 + 0.5)
        }
      }
    }
    guard let provider = CGDataProvider(data: Data(buf) as CFData) else { return nil }
    return CGImage(width: px, height: px, bitsPerComponent: 8, bitsPerPixel: 32, bytesPerRow: px * 4,
                   space: CGColorSpace(name: CGColorSpace.sRGB)!,
                   bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue),
                   provider: provider, decode: nil, shouldInterpolate: true, intent: .defaultIntent)
  }
}

/// Số trên đĩa, rasterize một lần thành mặt nạ alpha 96×96 phủ đúng đường kính đĩa.
private final class DigitMask {
  static let size = 96
  private static var all: [Int: DigitMask] = [:]
  private static let lock = NSLock()
  let a: [Float]

  static func of(_ n: Int) -> DigitMask {
    lock.lock(); defer { lock.unlock() }
    if let m = all[n] { return m }
    let m = DigitMask(n)
    all[n] = m
    return m
  }

  private init(_ n: Int) {
    let s = Self.size
    var px = [UInt8](repeating: 0, count: s * s)
    let ctx = CGContext(data: &px, width: s, height: s, bitsPerComponent: 8, bytesPerRow: s, space: CGColorSpaceCreateDeviceGray(),
                        bitmapInfo: CGImageAlphaInfo.none.rawValue)!
    UIGraphicsPushContext(ctx)
    ctx.translateBy(x: 0, y: CGFloat(s))
    ctx.scaleBy(x: 1, y: -1)
    // Cùng tỉ lệ bi 2D cũ: chữ 0,52R (hai chữ số 0,42R) trên đĩa đường kính 0,94R.
    let font = UIFont.systemFont(ofSize: CGFloat(s) * (n >= 10 ? 0.45 : 0.55), weight: .heavy)
    let str = NSAttributedString(string: "\(n)", attributes: [.font: font, .foregroundColor: UIColor.white])
    let b = str.size()
    str.draw(at: CGPoint(x: (CGFloat(s) - b.width) / 2, y: (CGFloat(s) - b.height) / 2))
    UIGraphicsPopContext()
    a = px.map { Float($0) / 255 }
  }

  /// Lấy mẫu song tuyến, ngoài khung là 0.
  @inline(__always) func at(_ u: Float, _ v: Float) -> Float {
    let s = Self.size
    let x = u * Float(s) - 0.5, y = v * Float(s) - 0.5
    guard x > -1, y > -1, x < Float(s), y < Float(s) else { return 0 }
    let x0 = Int(floor(x)), y0 = Int(floor(y)), fx = x - Float(x0), fy = y - Float(y0)
    func p(_ i: Int, _ j: Int) -> Float { i < 0 || j < 0 || i >= s || j >= s ? 0 : a[j * s + i] }
    let top = p(x0, y0) * (1 - fx) + p(x0 + 1, y0) * fx
    let bot = p(x0, y0 + 1) * (1 - fx) + p(x0 + 1, y0 + 1) * fx
    return top * (1 - fy) + bot * fy
  }
}

/// Style mặc định: bi cầu xoay được. Không có tư thế thì vẽ ở tư thế đứng yên của từng bi.
struct SphereBallStyle: PoolBallStyle {
  func draw(number: Int, in rect: CGRect, context: inout GraphicsContext) {
    draw(number: number, pose: BallPose(q: PoolBallSphere.restPose(number)), in: rect, context: &context)
  }

  func draw(number: Int, pose: BallPose, in rect: CGRect, context: inout GraphicsContext) {
    let scale = context.environment.displayScale
    let px = Int((rect.width * scale).rounded(.up))
    guard let img = PoolBallSphere.image(number: number, px: px, pose: pose) else { return }
    context.draw(Image(decorative: img, scale: scale), in: rect)
  }
}
