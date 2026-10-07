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
