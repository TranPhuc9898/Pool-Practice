import SwiftUI

/// Màu của bàn. Đổi theme là đổi struct này, renderer không giữ màu cứng nào.
struct PoolTableTheme: Equatable {
  var cloth: Color
  /// Vải dưới đèn: tâm sáng hơn mép một chút, tạo vũng sáng của đèn bàn.
  var clothLit: Color
  var cushion: Color
  var rail: Color
  var railHighlight: Color
  var pocket: Color
  var diamond: Color
  var spot: Color
  var debug: Color
  /// Màu tín hiệu: target, tangent, điểm chạm băng. App mono nên là trắng, nổi nhất trên vải tối.
  var signal: Color

  static let tournament = PoolTableTheme(
    // Vải giải đấu xanh xám, kéo về tối cho hợp nền #040404. Mã tự chọn, chưa lấy mẫu từ vải thật.
    cloth: Color(hex: 0x223A4C),
    clothLit: Color(hex: 0x2F4E64),
    cushion: Color(hex: 0x1B3040),
    rail: Color(hex: 0x0E0E0E),
    railHighlight: Color(hex: 0x262626),
    pocket: Color(hex: 0x000000),
    diamond: Color(hex: 0xC9C4B4),
    spot: Color(hex: 0xC9C4B4).opacity(0.45),
    debug: Color(hex: 0xFF6369),
    signal: Color(hex: 0xFFFFFF)
  )
}

extension Color {
  init(hex: UInt32, alpha: Double = 1) {
    self.init(
      .sRGB,
      red: Double((hex >> 16) & 0xFF) / 255,
      green: Double((hex >> 8) & 0xFF) / 255,
      blue: Double(hex & 0xFF) / 255,
      opacity: alpha
    )
  }
}
