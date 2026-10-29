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

  /// `spin` lấy từ vòng của drill trỏ vào vùng này; rỗng là không ràng buộc.
  struct Zone { let c: CGPoint; let r: CGFloat; var spin = "" }

  static let tipXs: [CGFloat] = (-5...5).map { CGFloat($0) / 10 }
  static let tipYs: [CGFloat] = (-5...5).map { CGFloat($0) / 10 }
  /// Trần 4,5 m/s, bằng đầu thanh Lực của Soạn bài: cú nào giải ra cũng mở lại được, và mạnh hơn thì khó lặp đều tay.
  static let speeds: [CGFloat] = (3...22).map { CGFloat($0) / 5 } + [PoolShotPanel.vMax]
  /// Đầu cơ xa tâm hơn 0,5R là vùng trượt cơ, không dò.
  static let tipLimit: CGFloat = 0.5

  /// Thế drill cố định nên kết quả theo id dùng lại được cả phiên. Chỉ đọc ghi trên main.
  static var cache: [String: [Shot?]] = [:]

  /// `f` là w/v của bi cái lúc chạm: 1 lăn, 0 stun, âm là draw.
  private typealias Run = (a: CGFloat, b: CGFloat, v: CGFloat, f: CGFloat, stop: CGPoint)

  static func setup(_ d: DrillRecord) -> ShotPhysics.Setup? {
    guard let o = d.objectBalls.first, ShotPhysics.target(d.targetPocket) != nil else { return nil }
    let at = { (x: Double, y: Double) in CGPoint(x: x * ShotPhysics.width, y: y * ShotPhysics.length) }
    let others = d.objectBalls.dropFirst().map { ShotPhysics.Obstacle(n: $0.number, p: at($0.x, $0.y)) }
    return ShotPhysics.Setup(c: at(d.cueBall.x, d.cueBall.y), o: at(o.x, o.y), pocket: d.targetPocket, others: others, ball: o.number)
  }

  static func zones(_ d: DrillRecord) -> [Zone] {
    d.cueBallTargetZones.enumerated().map { i, z in
      let r = z.kind == "ellipse" ? min(z.radiusX, z.radiusY) : z.radius
      return Zone(c: CGPoint(x: z.center.x * ShotPhysics.width, y: z.center.y * ShotPhysics.length), r: r * ShotPhysics.width,
                  spin: d.rounds.first { $0.zone == i }?.spin ?? "")
    }
  }

  private static func runs(_ ms: ShotPhysics.Setup, xs: [CGFloat], ys: [CGFloat], vs: [CGFloat]) -> [Run] {
    var out: [Run] = []
    for a in xs {
      for b in ys where hypot(a, b) <= tipLimit + 1e-6 {
        for v in vs {
          let r = ShotPhysics.runWith(ms, tipX: a, tipY: b, speed: v)
          guard r.short == nil, r.scratch == nil, r.moved.isEmpty else { continue }
          out.append((a, b, v, r.f, r.stop))
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
      // Vùng có kiểu spin thì chỉ xét cú đúng kiểu đó; không cú nào đúng kiểu thì mới lấy cú gần nhất bất kể spin.
      let typed = rs.filter { fits($0, z.spin) }
      let scored = (typed.isEmpty ? rs : typed).map { (run: $0, miss: hypot($0.stop.x - z.c.x, $0.stop.y - z.c.y)) }
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

  /// Draw và stun xét theo f lúc chạm, vì bi cái trượt hết hay chưa tuỳ cả lực lẫn quãng. Follow thêm điều kiện
  /// đầu cơ trên tâm: đánh tâm đi xa cũng lăn tới f = 1, nhưng bài follow phải dạy đánh trên.
  private static func fits(_ r: Run, _ spin: String) -> Bool {
    switch spin {
    case "draw": r.f <= -0.3
    case "stun": abs(r.f) <= 0.2
    case "follow": r.b >= 0.2 && r.f >= 0.5
    default: true
    }
  }

  /// Phê ngang đắt nhất, rồi lực, rồi độ lệch tâm. Đơn vị tuỳ ý, chỉ để so.
  private static func cost(_ r: Run, _ off: CGFloat) -> CGFloat {
    10 * abs(r.a) + r.v + 1.5 * off
  }
}

/// Cú đã chọn: vẽ vệt bi cái và bi mục tiêu như đường dự đoán của Soạn bài, vòng chỗ bi cái dừng.
struct PoolDrillPickLayer: View {
  let replay: ShotReplay
  let geometry: PoolTableGeometry
  var trails = true
  /// Vòng ghost ở chỗ bi cái chạm bi mục tiêu, thay ghost vẽ tay khi vệt này là cú của round.
  var ghost = false

  var body: some View {
    Canvas { ctx, _ in
      guard trails else { return }
      PoolShotReplayLayer.trails(&ctx, replay, replay.end, geometry)
      let r = geometry.ballDiameter * PoolEditorModel.ballZoom / 2
      if let e = replay.cue.pts.last {
        let q = geometry.point(inchesX: e.x, inchesY: e.y)
        let ring = Path(ellipseIn: CGRect(x: q.x - r, y: q.y - r, width: 2 * r, height: 2 * r))
        ctx.fill(ring, with: .color(.white.opacity(0.12)))
        ctx.stroke(ring, with: .color(.white.opacity(0.9)), style: StrokeStyle(lineWidth: 1.2, dash: [3, 2]))
      }
      if ghost, let t = replay.contact {
        let g = replay.cue.at(t), q = geometry.point(inchesX: g.x, inchesY: g.y)
        ctx.stroke(Path(ellipseIn: CGRect(x: q.x - r, y: q.y - r, width: 2 * r, height: 2 * r)), with: .color(PoolGuidePalette.ghost), lineWidth: 1.2)
      }
    }
    .allowsHitTesting(false)
  }
}

/// Vùng chạm 44pt quanh mỗi vùng đích. Nằm ngoài lớp bàn vì màn drill tắt chạm trên bàn.
/// Vùng đích sát nhau (Follow Distance cách nhau chưa tới 20pt) thì các ô chồng lên nhau: gộp thành một lớp chạm,
/// chạm đâu chọn vùng có tâm gần nhất, thay vì để ô vẽ sau nuốt chạm của ô trước.
struct PoolDrillTargetPicker: View {
  let zones: [TargetZoneRecord]
  let geometry: PoolTableGeometry
  let picked: Int?
  let onPick: (Int) -> Void

  var body: some View {
    let pts = zones.map { geometry.point(x: $0.center.x, y: $0.center.y) }
    var hit = Path()
    for p in pts { hit.addEllipse(in: CGRect(x: p.x - 22, y: p.y - 22, width: 44, height: 44)) }
    return ZStack(alignment: .topLeading) {
      Color.clear
        .contentShape(hit)
        .gesture(SpatialTapGesture().onEnded { v in
          let d = { (p: CGPoint) in hypot(p.x - v.location.x, p.y - v.location.y) }
          if let i = pts.indices.min(by: { d(pts[$0]) < d(pts[$1]) }) { onPick(i) }
        })
        .accessibilityHidden(true)
      ForEach(zones.indices, id: \.self) { i in
        Color.clear
          .frame(width: 44, height: 44)
          .position(pts[i])
          .allowsHitTesting(false)
          .accessibilityElement()
          .accessibilityAction { onPick(i) }
          .accessibilityLabel("Target \(zones[i].label ?? String(i + 1))")
          .accessibilityHint("Shows spin, speed and cue ball path")
          .accessibilityAddTraits(picked == i ? [.isButton, .isSelected] : .isButton)
      }
    }
  }
}
