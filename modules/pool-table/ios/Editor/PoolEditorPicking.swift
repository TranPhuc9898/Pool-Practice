import SwiftUI
import UIKit

/// Thứ tự trùng `PoolTableGeometry.pockets`.
let editorPocketIds = ["footLeft", "footRight", "sideLeft", "sideRight", "headLeft", "headRight"]

extension PoolEditorModel {
  /// Chạm bi mục tiêu: vào chế độ chọn lỗ, chạm lại là thôi. Bi cái không có lỗ để chọn.
  func tapBall(_ n: Int) {
    picking = n == 0 || picking == n ? nil : n
  }

  /// Chọn lỗ cho bi đang chọn. Một haptic: `.warning` nếu cú không đánh được hoặc bi cái vào lỗ.
  func choose(pocket: String) {
    guard let ball = picking else { return }
    aimBall = ball
    aimPocket = pocket
    picking = nil
    let verdict = ShotPhysics.shotOf(ball: ball, pocket: pocket, balls: balls)
    var why = verdict?.level == .bad ? verdict!.why : ""
    if why.isEmpty, let ms = shotSetup {
      why = ShotPhysics.why(ShotPhysics.runWith(ms, tip: tip, speed: speed))
    }
    EditorHaptics.fire(why.isEmpty ? .selection : .warning, "\(ShotPhysics.name(ball)) → \(pocket)\(why.isEmpty ? "" : ": " + why)")
  }

  /// Cú chính đủ dữ kiện để mô phỏng, nil nếu thiếu bi cái, thiếu đường vào lỗ, hoặc đầu cơ quá mức trượt cơ.
  var shotSetup: ShotPhysics.Setup? {
    guard abs(tip) <= ShotPhysics.tipMax + 0.001, let ball = aimBall, let pocket = aimPocket, let c = balls[0], let o = balls[ball] else { return nil }
    let others = balls.filter { $0.key != 0 && $0.key != ball }.map { ShotPhysics.Obstacle(n: $0.key, p: $0.value) }
    return ShotPhysics.Setup(c: c, o: o, pocket: pocket, others: others)
  }
}

enum EditorHaptics {
  enum Kind: String { case selection = ".selection", warning = ".warning", light = ".impact(.light)" }

  private static let selection = UISelectionFeedbackGenerator()
  private static let notification = UINotificationFeedbackGenerator()
  private static let impact = UIImpactFeedbackGenerator(style: .light)

  /// Simulator không rung, nên mỗi haptic ghi một dòng log để kiểm.
  static func fire(_ kind: Kind, _ why: String) {
    switch kind {
    case .selection: selection.selectionChanged()
    case .warning: notification.notificationOccurred(.warning)
    case .light: impact.impactOccurred()
    }
    NSLog("[Haptic] %@ %@", kind.rawValue, why)
  }
}

/// Sáu lỗ sáng gold cùng lúc khi đang chọn lỗ, không fade. Vùng chạm tối thiểu 44pt.
struct PoolEditorPocketPicker: View {
  let geometry: PoolTableGeometry
  let onPick: (String) -> Void

  var body: some View {
    let gold = PoolAimPalette.gold
    ForEach(Array(zip(editorPocketIds, geometry.pockets)), id: \.0) { id, pocket in
      let glow = pocket.radius + 0.9 * geometry.scale
      let hit = max(22, glow)
      ZStack {
        Circle().fill(gold.opacity(0.16))
        Circle().stroke(gold, lineWidth: max(1, 0.3 * geometry.scale))
      }
      .frame(width: glow * 2, height: glow * 2)
      .frame(width: hit * 2, height: hit * 2)
      .contentShape(Circle())
      .position(pocket.center)
      .onTapGesture { onPick(id) }
      .accessibilityElement()
      .accessibilityLabel("Pocket \(id)")
      .accessibilityAddTraits(.isButton)
    }
  }
}
