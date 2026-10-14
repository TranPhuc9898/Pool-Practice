import SwiftUI
import UIKit

/// Thứ tự trùng `PoolTableGeometry.pockets`.
let editorPocketIds = ["footLeft", "footRight", "sideLeft", "sideRight", "headLeft", "headRight"]

extension PoolEditorModel {
  /// Chạm bi mục tiêu: vào chế độ chọn lỗ, chạm lại là thôi. Bi cái không có lỗ để chọn.
  func tapBall(_ n: Int) {
    picking = n == 0 || picking == n ? nil : n
  }

  /// Chọn lỗ, hoặc một điểm trên băng, cho bi đang chọn. Một haptic: `.warning` nếu cú không đánh được hoặc bi cái vào lỗ.
  func choose(pocket: String) {
    guard let ball = picking else { return }
    aimBall = ball
    aimPocket = pocket
    picking = nil
    let verdict = ShotPhysics.shotOf(ball: ball, pocket: pocket, balls: balls)
    var why = verdict?.level == .bad ? verdict!.why : ""
    if why.isEmpty, let ms = shotSetup {
      why = ShotPhysics.why(ShotPhysics.runWith(ms, tipX: tipX, tipY: tipY, theta: theta, speed: speed))
    }
    EditorHaptics.fire(why.isEmpty ? .selection : .warning, "\(ShotPhysics.name(ball)) → \(pocket)\(why.isEmpty ? "" : ": " + why)")
  }

  /// Cú chính đủ dữ kiện để mô phỏng, nil nếu thiếu bi cái, thiếu đích, hoặc đầu cơ quá mức trượt cơ.
  var shotSetup: ShotPhysics.Setup? {
    guard hypot(tipX, tipY) <= ShotPhysics.tipMax + 0.001, let ball = aimBall, let pocket = aimPocket, let c = balls[0], let o = balls[ball] else { return nil }
    let others = balls.filter { $0.key != 0 && $0.key != ball }.map { ShotPhysics.Obstacle(n: $0.key, p: $0.value) }
    return ShotPhysics.Setup(c: c, o: o, pocket: pocket, others: others, ball: ball)
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
/// Bốn băng cũng sáng mờ: chạm vào băng là đích băng tại chỗ đó, như trang bi-cai-xoay.html cho bi đi vào băng.
struct PoolEditorPocketPicker: View {
  let geometry: PoolTableGeometry
  let onPick: (String) -> Void

  var body: some View {
    let gold = PoolAimPalette.gold
    rails(gold)
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

  /// Vùng băng: dải từ mép gỗ tới 2" trong nỉ, trừ lỗ (lỗ nằm trên trong ZStack nên ăn chạm trước). Giữa nỉ vẫn là
  /// thôi chọn. Chạm đâu lấy băng gần nhất, inch dọc băng kẹp cách góc 4" và tránh lỗ giữa 4" để bi tới băng mà không rơi lỗ.
  private func rails(_ gold: Color) -> some View {
    let W = ShotPhysics.width, L = ShotPhysics.length, tr = geometry.tableRect
    var band = Path()
    band.addRect(CGRect(origin: .zero, size: tr.size))
    band.addRect(geometry.playRect.offsetBy(dx: -tr.minX, dy: -tr.minY).insetBy(dx: 2 * geometry.scale, dy: 2 * geometry.scale))
    return Rectangle().fill(.clear)
      .frame(width: tr.width, height: tr.height)
      .overlay(
        Rectangle().stroke(gold.opacity(0.55), lineWidth: max(1, 0.3 * geometry.scale))
          .frame(width: geometry.playRect.width, height: geometry.playRect.height)
      )
      .contentShape(band, eoFill: true)
      .position(x: tr.midX, y: tr.midY)
      .gesture(SpatialTapGesture(coordinateSpace: .named(PoolEditorBall.space)).onEnded { v in
        let n = geometry.normalized(v.location)
        let x = n.x * W, y = n.y * L
        let dl = x, dr = W - x, df = y, dh = L - y
        let m = min(dl, dr, df, dh)
        let pick: String
        if m == dl || m == dr {
          var s = min(max(y, 4), L - 4)
          if abs(s - L / 2) < 4 { s = s < L / 2 ? L / 2 - 4 : L / 2 + 4 }
          pick = ShotPhysics.railId(m == dl ? "railLeft" : "railRight", at: s)
        } else {
          pick = ShotPhysics.railId(m == df ? "railFoot" : "railHead", at: min(max(x, 4), W - 4))
        }
        onPick(pick)
      })
      .accessibilityElement()
      .accessibilityLabel("Rail")
      .accessibilityHint("Tap a rail to send the object ball to that spot")
  }
}
