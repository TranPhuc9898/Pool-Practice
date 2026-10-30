import SwiftUI

/// Vùng bi cái phải dừng. Bán kính tính theo bề rộng mặt chơi nên hình tròn vẫn tròn trên màn.
enum PoolTargetPath {
  static func path(for zone: TargetZoneRecord, geometry g: PoolTableGeometry) -> Path {
    let w = PoolTableSpec.playWidth
    let center = PoolGuideMath.inches(x: zone.center.x, y: zone.center.y)
    let rx = (zone.kind == "ellipse" ? zone.radiusX : zone.radius) * w
    let ry = (zone.kind == "ellipse" ? zone.radiusY : zone.radius) * w
    var path = Path()
    let samples = 64
    for i in 0..<samples {
      let a = CGFloat(i) / CGFloat(samples) * 2 * .pi
      let p = g.point(inchesX: center.x + cos(a) * rx, inchesY: center.y + sin(a) * ry)
      if i == 0 { path.move(to: p) } else { path.addLine(to: p) }
    }
    path.closeSubpath()
    return path
  }
}

/// Lớp target. Mờ hiện 200ms mỗi lần đổi drill, Reduce Motion vẫn giữ vì chỉ là opacity.
struct PoolTargetLayer: View {
  let drillId: String
  let zones: [TargetZoneRecord]
  let geometry: PoolTableGeometry
  @State private var visible = false

  var body: some View {
    ZStack(alignment: .topLeading) {
      ForEach(zones.indices, id: \.self) { i in
        let zone = zones[i]
        let path = PoolTargetPath.path(for: zone, geometry: geometry)
        ZStack {
          PoolStaticShape(path: path).fill(PoolTableTheme.tournament.signal.opacity(0.12))
          PoolStaticShape(path: path).stroke(PoolTableTheme.tournament.signal.opacity(0.9), lineWidth: 1.25)
        }
        .accessibilityElement()
        .accessibilityLabel(zone.label.map { "Target Zone \($0)" } ?? "Target Zone")

        if let label = zone.label {
          Text(label)
            .font(.system(size: 12, weight: .bold, design: .rounded))
            .foregroundStyle(PoolTableTheme.tournament.signal)
            .position(geometry.point(x: zone.center.x, y: zone.center.y))
            .accessibilityHidden(true)
        }
      }
    }
    .opacity(visible ? 1 : 0)
    .allowsHitTesting(false)
    .task(id: drillId) {
      var reset = Transaction()
      reset.disablesAnimations = true
      withTransaction(reset) { visible = false }
      try? await Task.sleep(for: .milliseconds(16))
      withAnimation(.easeOut(duration: 0.2)) { visible = true }
    }
  }
}

/// Đích bi cái dạng vòng nhỏ cỡ bi, nét đứt như vòng chỗ bi cái dừng, chữ A/B/C cạnh vòng. Đích đang tập sáng, đích khác mờ.
struct PoolZoneMarks: View {
  let zones: [TargetZoneRecord]
  let current: PointRecord?
  let geometry: PoolTableGeometry

  var body: some View {
    let r = geometry.ballDiameter * PoolEditorModel.ballZoom / 2
    ZStack(alignment: .topLeading) {
      ForEach(zones.indices, id: \.self) { i in
        let z = zones[i]
        let on = zones.count == 1 || current == z.center
        let c = geometry.point(x: z.center.x, y: z.center.y)
        Circle()
          .stroke(PoolTableTheme.tournament.signal.opacity(on ? 0.95 : 0.4), style: StrokeStyle(lineWidth: on ? 1.5 : 1, dash: [3, 2]))
          .frame(width: r * 2, height: r * 2)
          .position(c)
        if let label = z.label {
          Text(label)
            .font(.system(size: 10, weight: .bold, design: .rounded))
            .foregroundStyle(PoolTableTheme.tournament.signal.opacity(on ? 1 : 0.5))
            .position(x: c.x + r + 7, y: c.y)
        }
      }
    }
    .allowsHitTesting(false)
    .accessibilityHidden(true)
  }
}
