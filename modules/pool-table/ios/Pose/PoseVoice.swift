import AVFoundation

/// Báo bằng tiếng sau mỗi lần vào address và mỗi cú: câu ngắn qua AVSpeechSynthesizer, hoặc tiếng bíp tự sinh.
/// Gọi trên main.
final class PoseVoice {
  enum Mode: String {
    case vi, en, beep, off
  }

  var mode: Mode = .vi
  private let speech = AVSpeechSynthesizer()
  /// Một tiếng cao, ngắn: address đúng, cú tốt. Không nói thành lời để khỏi chen vào lúc đang ngắm.
  private lazy var tick = Self.player([(1320, 0.07)])
  /// Hai tiếng trầm: có lỗi, ở chế độ bíp hoặc khi máy không có giọng của ngôn ngữ đã chọn.
  private lazy var buzz = Self.player([(330, 0.12), (0, 0.06), (330, 0.12)])

  func activate() {
    // Phát cả khi gạt im lặng, chồng lên nhạc của người chơi chứ không cắt nhạc.
    try? AVAudioSession.sharedInstance().setCategory(.playback, options: [.mixWithOthers])
    try? AVAudioSession.sharedInstance().setActive(true)
  }

  func deactivate() {
    speech.stopSpeaking(at: .immediate)
    try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
  }

  func address(ok: Bool, forearm: Double) {
    if ok { return play(tick) }
    say(forearm > 0 ? .forearmForward : .forearmBack)
  }

  func stroke(_ fault: StrokeFault) {
    say(fault)
  }

  private func say(_ fault: StrokeFault) {
    switch mode {
    case .off:
      return
    case .beep:
      play(fault == .good ? tick : buzz)
    case .vi, .en:
      guard let voice = AVSpeechSynthesisVoice(language: mode == .vi ? "vi-VN" : "en-US") else {
        return play(fault == .good ? tick : buzz)
      }
      let u = AVSpeechUtterance(string: Self.phrase(fault, vi: mode == .vi))
      u.voice = voice
      speech.stopSpeaking(at: .immediate)
      speech.speak(u)
    }
  }

  private func play(_ p: AVAudioPlayer?) {
    guard mode != .off, let p else { return }
    p.currentTime = 0
    p.play()
  }

  static func phrase(_ fault: StrokeFault, vi: Bool) -> String {
    switch fault {
    case .good: return vi ? "Tốt" : "Good"
    case .forearmForward: return vi ? "Cẳng tay đẩy ra trước" : "Forearm forward"
    case .forearmBack: return vi ? "Cẳng tay kéo về sau" : "Forearm back"
    case .elbow: return vi ? "Khuỷu tay di chuyển" : "Elbow moved"
    case .head: return vi ? "Đầu nhấc lên" : "Head up"
    case .pause: return vi ? "Dừng sau lâu hơn" : "Pause at the back"
    }
  }

  /// WAV 16 bit mono từ chuỗi (tần số Hz, giây). Tần số 0 là lặng.
  private static func player(_ tones: [(Double, Double)]) -> AVAudioPlayer? {
    let rate = 44_100.0
    var samples: [Int16] = []
    for (hz, seconds) in tones {
      let n = Int(rate * seconds)
      for i in 0..<n {
        // Vào ra 5 ms cho khỏi tiếng tách.
        let fade = min(1, Double(min(i, n - i)) / (rate * 0.005))
        samples.append(Int16(hz == 0 ? 0 : sin(2 * .pi * hz * Double(i) / rate) * fade * 0.5 * 32_767))
      }
    }
    var data = Data()
    func u32(_ v: UInt32) { withUnsafeBytes(of: v.littleEndian) { data.append(contentsOf: $0) } }
    func u16(_ v: UInt16) { withUnsafeBytes(of: v.littleEndian) { data.append(contentsOf: $0) } }
    let bytes = UInt32(samples.count * 2)
    data.append(contentsOf: Array("RIFF".utf8))
    u32(36 + bytes)
    data.append(contentsOf: Array("WAVEfmt ".utf8))
    u32(16)
    u16(1)
    u16(1)
    u32(UInt32(rate))
    u32(UInt32(rate) * 2)
    u16(2)
    u16(16)
    data.append(contentsOf: Array("data".utf8))
    u32(bytes)
    for s in samples { u16(UInt16(bitPattern: s)) }
    let p = try? AVAudioPlayer(data: data)
    p?.prepareToPlay()
    return p
  }
}
