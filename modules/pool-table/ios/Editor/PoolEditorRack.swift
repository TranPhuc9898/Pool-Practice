import Foundation
import SwiftUI

/// Nhiều bi và Gợi ý đường. Không thêm khay hay panel: chạm đúp nỉ là đặt bi, thả bi vào lỗ là cất bi,
/// nút Gợi ý nằm trên thanh tiêu đề. Đường gợi ý vẽ bằng guide và replay sẵn có.
extension PoolEditorModel {
  /// Lời gợi ý chỉ đúng cho đúng thế bi và đúng cú lúc gợi ý. Đổi bất cứ gì là lời đó thôi hiện.
  struct Hint: Equatable {
    let text: String
    let good: Bool
    let balls: [Int: CGPoint]
    let shot: [CGFloat]

    func current(_ m: PoolEditorModel) -> Bool { m.balls == balls && Self.key(m) == shot }
    static func key(_ m: PoolEditorModel) -> [CGFloat] {
      [CGFloat(m.aimBall ?? -1), CGFloat((m.aimPocket ?? "").hashValue), m.tipX, m.tipY, m.speed]
    }
  }

  var hintText: String? {
    if suggesting { return "Đang tìm đường…" }
    return hint.flatMap { $0.current(self) ? $0.text : nil }
  }

  /// Chạm đúp chỗ trống trên nỉ: đặt bi số nhỏ nhất còn thiếu (1…9), chưa có bi cái thì đặt bi cái trước.
  func addBall(at p: CGPoint) -> Bool {
    let r = PoolTableSpec.ballDiameter / 2
    let c = CGPoint(x: min(max(p.x, r), Self.width - r), y: min(max(p.y, r), Self.length - r))
    if balls.values.contains(where: { hypot($0.x - c.x, $0.y - c.y) < PoolTableSpec.ballDiameter }) {
      EditorHaptics.fire(.warning, "Chỗ này đã có bi")
      return false
    }
    guard let n = (0...9).first(where: { balls[$0] == nil }) else {
      EditorHaptics.fire(.warning, "Đủ 9 bi rồi")
      return false
    }
    replay = nil
    picking = nil
    balls[n] = c
    EditorHaptics.fire(.light, "Đặt \(ShotPhysics.name(n))")
    return true
  }

  /// Thả bi mục tiêu sát miệng lỗ là cất bi khỏi bàn. Bi cái giữ lại vì cú nào cũng cần.
  func pocketIfDropped(_ n: Int) -> Bool {
    guard n != 0, let p = balls[n], ShotPhysics.pockets.values.contains(where: { hypot($0.x - p.x, $0.y - p.y) < ShotPhysics.pocketCatch }) else { return false }
    balls[n] = nil
    if aimBall == n { aimBall = nil; aimPocket = nil }
    EditorHaptics.fire(.light, "Cất \(ShotPhysics.name(n))")
    return true
  }

  /// Tìm cú tự nhiên nhất cho bi số nhỏ nhất theo luật 9-ball, chạy nền. Xong thì đặt cú vào model để guide tự vẽ.
  func suggest(onDone: @escaping () -> Void) {
    guard !suggesting else { return }
    guard let cue = balls[0] else { return note("Chưa có bi cái", good: false) }
    let obs = balls.filter { $0.key != 0 }
    guard let n = obs.keys.min() else { return note("Chạm đúp lên nỉ để đặt bi", good: false) }
    let P2 = { (p: CGPoint) in RackPlanner.P2(x: Double(p.x), y: Double(p.y)) }
    let L = RackPlanner.Layout(cue: P2(cue), balls: obs.mapValues(P2))
    let before = balls
    replay = nil
    picking = nil
    suggesting = true
    DispatchQueue.global(qos: .userInitiated).async {
      let r = RackPlanner.plan(L)
      NSLog("[suggest] %.0f ms, %d sims, %d aims, best %@", r.ms, r.stats.sims, r.stats.aim,
            r.best.map { "\($0.n)→\($0.pocket) a \($0.s.a) b \($0.s.b) v \($0.s.v) p \($0.p)" } ?? "none")
      DispatchQueue.main.async {
        self.suggesting = false
        // Bàn đã đổi trong lúc tính thì bỏ kết quả, cú đó không còn đúng.
        guard self.balls == before else { return }
        guard let b = r.best else {
          return self.note("\(ShotPhysics.name(n).capitalized) không có cú thẳng nào ăn", good: false)
        }
        self.aimBall = b.n
        self.aimPocket = b.pocket
        self.tipX = CGFloat((b.s.a * 100).rounded() / 100)
        self.tipY = CGFloat((b.s.b * 100).rounded() / 100)
        self.speed = CGFloat((b.s.v * 10).rounded() / 10)
        // Một dòng trong cột chữ của panel: tỉ lệ vào và bi kế tiếp, không tên lỗ.
        var text = "Gợi ý \(Int((b.p * 100).rounded()))% vào"
        if b.win { text += ", hết bàn" } else if let c = b.childBall { text += ", tiếp \(ShotPhysics.name(c))" }
        self.note(text, good: true)
        onDone()
      }
    }
  }

  private func note(_ text: String, good: Bool) {
    hint = Hint(text: text, good: good, balls: balls, shot: Hint.key(self))
    EditorHaptics.fire(good ? .selection : .warning, "Gợi ý: " + text)
  }
}
