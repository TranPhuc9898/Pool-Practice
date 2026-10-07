import SwiftUI

/// Màu bộ Aramith Tournament BLACK, lấy mẫu từ ảnh sản phẩm (gần đúng, chưa đo máy).
/// Nguồn: aramith.com/new-aramith-black-pool-set, tribilliards.com/aramith-black-ball-set.html,
/// pooldawg.com/aramith-black-measles-cue-ball.
enum TournamentBlackPalette {
  struct Tone {
    let mid: Color
    let highlight: Color
  }

  /// Bi 1–8. Bi 9–15 dùng màu của `number - 8`.
  static let tones: [Int: Tone] = [
    1: Tone(mid: Color(hex: 0xE99C00), highlight: Color(hex: 0xF9C01B)),
    2: Tone(mid: Color(hex: 0x053E7F), highlight: Color(hex: 0x6A8DC1)),
    3: Tone(mid: Color(hex: 0xAF0022), highlight: Color(hex: 0xE27573)),
    4: Tone(mid: Color(hex: 0xF26D85), highlight: Color(hex: 0xFDB2BB)),
    5: Tone(mid: Color(hex: 0x59478B), highlight: Color(hex: 0x9F96C6)),
    6: Tone(mid: Color(hex: 0x25916B), highlight: Color(hex: 0x7BC8AB)),
    7: Tone(mid: Color(hex: 0x82441F), highlight: Color(hex: 0xC18F73)),
    8: Tone(mid: Color(hex: 0x1D1D1D), highlight: Color(hex: 0x3B3B3B)),
  ]

  /// Hai cực của bi sọc: đen thay cho trắng, là nét nhận diện của bộ BLACK.
  static let stripePole = Color(hex: 0x181818)
  static let cue = Color(hex: 0xFBFAE9)
  static let cueDot = Color(hex: 0x2F2D2D)
  static let disc = Color.white
  static let discInk = Color(hex: 0x111111)

  static func tone(for number: Int) -> Tone {
    tones[number > 8 ? number - 8 : number] ?? Tone(mid: cue, highlight: .white)
  }
}
