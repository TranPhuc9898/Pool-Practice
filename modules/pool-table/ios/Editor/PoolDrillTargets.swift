import SwiftUI

/// Màn drill: chạm một vùng đích là ra cú đưa bi cái tới đó. Dò lưới đầu cơ × lực bằng chính `ShotPhysics.runWith`
/// một lần cho cả drill (chạy nền), rồi mỗi vùng lấy cú gọn nhất trong số cú bi cái dừng trong vùng.
enum DrillTargetSolver {
  struct Shot {
    let tipX, tipY, speed: CGFloat
    let stop: CGPoint
    /// Chỗ dừng cách tâm vùng, inch.
    let miss: CGFloat
    let inZone: Bool
  }

  struct Zone { let c: CGPoint; let r: CGFloat }

  static let tipXs: [CGFloat] = (-5...5).map { CGFloat($0) / 10 }
  static let tipYs: [CGFloat] = (-5...5).map { CGFloat($0) / 10 }
  /// Trần 4,5 m/s, bằng đầu thanh Lực của Soạn bài: cú nào giải ra cũng mở lại được, và mạnh hơn thì khó lặp đều tay.
  static let speeds: [CGFloat] = (3...22).map { CGFloat($0) / 5 } + [PoolShotPanel.vMax]
  /// Đầu cơ xa tâm hơn 0,5R là vùng trượt cơ, không dò.
  static let tipLimit: CGFloat = 0.5

  /// Thế drill cố định nên kết quả theo id dùng lại được cả phiên. Chỉ đọc ghi trên main.
  static var cache: [String: [Shot?]] = [:]

  private typealias Run = (a: CGFloat, b: CGFloat, v: CGFloat, stop: CGPoint)

  static func setup(_ d: DrillRecord) -> ShotPhysics.Setup? {
    guard let o = d.objectBalls.first, ShotPhysics.target(d.targetPocket) != nil else { return nil }
    let at = { (x: Double, y: Double) in CGPoint(x: x * ShotPhysics.width, y: y * ShotPhysics.length) }
    let others = d.objectBalls.dropFirst().map { ShotPhysics.Obstacle(n: $0.number, p: at($0.x, $0.y)) }
    return ShotPhysics.Setup(c: at(d.cueBall.x, d.cueBall.y), o: at(o.x, o.y), pocket: d.targetPocket, others: others, ball: o.number)
  }

  static func zones(_ d: DrillRecord) -> [Zone] {
    d.cueBallTargetZones.map { z in
      let r = z.kind == "ellipse" ? min(z.radiusX, z.radiusY) : z.radius
      return Zone(c: CGPoint(x: z.center.x * ShotPhysics.width, y: z.center.y * ShotPhysics.length), r: r * ShotPhysics.width)
    }
  }

  private static func runs(_ ms: ShotPhysics.Setup, xs: [CGFloat], ys: [CGFloat], vs: [CGFloat]) -> [Run] {
    var out: [Run] = []
    for a in xs {
      for b in ys where hypot(a, b) <= tipLimit + 1e-6 {
        for v in vs {
          let r = ShotPhysics.runWith(ms, tipX: a, tipY: b, speed: v)
          guard r.short == nil, r.scratch == nil, r.moved.isEmpty else { continue }
          out.append((a, b, v, r.stop))
        }
      }
    }
    return out
  }

  /// Bi mục tiêu phải vào, bi cái không rơi lỗ, không đụng bi khác. Bi cái luôn ở đúng chỗ của drill: dò lưới đầy đủ,
  /// mỗi cột phê ngang một việc song song, rồi dò mịn quanh cú tốt nhất của từng vùng.
  static func solve(_ ms: ShotPhysics.Setup, _ zones: [Zone]) -> [Shot?] {
    let lock = NSLock()
    var all: [Run] = []
    DispatchQueue.concurrentPerform(iterations: tipXs.count) { j in
      let r = runs(ms, xs: [tipXs[j]], ys: tipYs, vs: speeds)
      lock.lock(); all += r; lock.unlock()
    }
    func best(_ rs: [Run], _ z: Zone) -> (run: Run, miss: CGFloat)? {
      let scored = rs.map { (run: $0, miss: hypot($0.stop.x - z.c.x, $0.stop.y - z.c.y)) }
      let inside = scored.filter { $0.miss <= z.r }
      return inside.isEmpty ? scored.min { $0.miss < $1.miss } : inside.min { cost($0.run, $0.miss / z.r) < cost($1.run, $1.miss / z.r) }
    }
    var out = [Shot?](repeating: nil, count: zones.count)
    // Dò mịn quanh cú tốt nhất: đầu cơ ±0,1R, lực ±0,4 m/s.
    DispatchQueue.concurrentPerform(iterations: zones.count) { k in
      let z = zones[k]
      guard let f = best(all, z)?.run else { return }
      let near = runs(ms, xs: [-0.1, 0, 0.1].map { f.a + $0 }, ys: [-0.1, -0.05, 0, 0.05, 0.1].map { f.b + $0 },
                      vs: (-4...4).map { f.v + CGFloat($0) / 10 }.filter { $0 >= 0.3 && $0 <= PoolShotPanel.vMax })
      guard let b = best([f] + near, z) else { return }
      let shot = Shot(tipX: b.run.a, tipY: b.run.b, speed: b.run.v, stop: b.run.stop, miss: b.miss, inZone: b.miss <= z.r)
      lock.lock(); out[k] = shot; lock.unlock()
    }
    return out
  }

  /// Phê ngang đắt nhất, rồi lực, rồi độ lệch tâm. Đơn vị tuỳ ý, chỉ để so.
  private static func cost(_ r: Run, _ off: CGFloat) -> CGFloat {
    10 * abs(r.a) + r.v + 1.5 * off
  }
}

/// Cú đã chọn: tô đậm vùng, vẽ vệt bi cái và bi mục tiêu như đường dự đoán của Soạn bài, vòng chỗ bi cái dừng.
struct PoolDrillPickLayer: View {
  let replay: ShotReplay
  let zone: TargetZoneRecord
  let geometry: PoolTableGeometry
  var trails = true

  var body: some View {
    Canvas { ctx, _ in
      ctx.fill(PoolTargetPath.path(for: zone, geometry: geometry), with: .color(PoolTableTheme.tournament.signal.opacity(0.3)))
      guard trails else { return }
      PoolShotReplayLayer.trails(&ctx, replay, replay.end, geometry)
      if let e = replay.cue.pts.last {
        let q = geometry.point(inchesX: e.x, inchesY: e.y), r = geometry.ballDiameter * PoolEditorModel.ballZoom / 2
        let ring = Path(ellipseIn: CGRect(x: q.x - r, y: q.y - r, width: 2 * r, height: 2 * r))
        ctx.fill(ring, with: .color(.white.opacity(0.12)))
        ctx.stroke(ring, with: .color(.white.opacity(0.9)), style: StrokeStyle(lineWidth: 1.2, dash: [3, 2]))
      }
    }
    .allowsHitTesting(false)
  }
}

/// Vùng chạm 44pt trên mỗi vùng đích. Nằm ngoài lớp bàn vì màn drill tắt chạm trên bàn.
struct PoolDrillTargetPicker: View {
  let zones: [TargetZoneRecord]
  let geometry: PoolTableGeometry
  let picked: Int?
  let onPick: (Int) -> Void

  var body: some View {
    ZStack(alignment: .topLeading) {
      ForEach(zones.indices, id: \.self) { i in
        Color.clear
          .frame(width: 44, height: 44)
          .contentShape(Rectangle())
          .position(geometry.point(x: zones[i].center.x, y: zones[i].center.y))
          .onTapGesture { onPick(i) }
          .accessibilityElement()
          .accessibilityLabel("Target \(zones[i].label ?? String(i + 1))")
          .accessibilityHint("Shows spin, speed and cue ball path")
          .accessibilityAddTraits(picked == i ? [.isButton, .isSelected] : .isButton)
      }
    }
  }
}
