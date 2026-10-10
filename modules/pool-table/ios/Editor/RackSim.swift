import Foundation

/// Engine nhiều bi cho planner, port nguyên `sim-lab/sim.js` (bàn có má lỗ, băng Mathavan 2010, ma sát bi Aim Lab).
/// Đơn vị inch, giây. Bàn x 0…50, y 0…100, foot ở y = 0, như `ShotPhysics`. Trục z hướng xuống mặt bàn.
/// Không thay `ShotPhysics`: guide và replay vẫn chạy engine cũ, file này chỉ phục vụ Gợi ý.
enum RackSim {
  static let G = 386.1, R = 1.125, D = 2.25, IPM = 39.37

  struct Params {
    var muS = 0.2, muR = 0.01, spinDecay = 10.9
    var eRail = 0.83, muRail = 0.14, noseH = 0.635
    var eBall = 0.95, squirtRatio = 25.0, miscue = 0.5
    var cornerMouth = 4.5, sideMouth = 5.0, cornerAngle = 142.0, sideAngle = 104.0
    var cornerShelf = 1.5, sideShelf = 0.2, facingDepth = 2.0
    var cornerHoleR = 3.0, sideHoleR = 2.8
  }
  static let P = Params()

  struct V3 {
    var x, y, z: Double
    static let zero = V3(x: 0, y: 0, z: 0)
    @inline(__always) static func + (a: V3, b: V3) -> V3 { V3(x: a.x + b.x, y: a.y + b.y, z: a.z + b.z) }
    @inline(__always) static func - (a: V3, b: V3) -> V3 { V3(x: a.x - b.x, y: a.y - b.y, z: a.z - b.z) }
    @inline(__always) static func * (a: V3, k: Double) -> V3 { V3(x: a.x * k, y: a.y * k, z: a.z * k) }
    @inline(__always) func dot(_ b: V3) -> Double { x * b.x + y * b.y + z * b.z }
    @inline(__always) func cross(_ b: V3) -> V3 { V3(x: y * b.z - z * b.y, y: z * b.x - x * b.z, z: x * b.y - y * b.x) }
    var len: Double { (x * x + y * y + z * z).squareRoot() }
  }

  struct P2 { var x, y: Double }
  @inline(__always) static func d2(_ a: P2, _ b: P2) -> Double { hypot(a.x - b.x, a.y - b.y) }
  @inline(__always) static func unit2(_ x: Double, _ y: Double) -> P2 { let l = hypot(x, y); return l > 0 ? P2(x: x / l, y: y / l) : P2(x: x, y: y) }

  enum Kind { case jaw, rail }
  struct Seg { let a, b: P2; let kind: Kind; let pocket: String? }
  struct Pt { let p: P2; let pocket: String }
  struct Hole { let id: String; let c: P2; let r: Double; let J1, J2, M, ax: P2; let corner: Bool }
  struct Table { let segs: [Seg]; let pts: [Pt]; let holes: [Hole] }

  /// Lỗ: hai má thẳng theo góc cắt WPA, hai mũi má, vòng rơi lùi sau miệng đúng bằng shelf.
  static func buildTable(_ p: Params = P) -> Table {
    var segs: [Seg] = [], pts: [Pt] = [], holes: [Hole] = []
    let defs: [(String, P2, P2, P2, P2?)] = [
      ("footLeft", P2(x: 0, y: 0), P2(x: 1, y: 0), P2(x: 0, y: 1), nil),
      ("footRight", P2(x: 50, y: 0), P2(x: -1, y: 0), P2(x: 0, y: 1), nil),
      ("headLeft", P2(x: 0, y: 100), P2(x: 1, y: 0), P2(x: 0, y: -1), nil),
      ("headRight", P2(x: 50, y: 100), P2(x: -1, y: 0), P2(x: 0, y: -1), nil),
      ("sideLeft", P2(x: 0, y: 50), P2(x: 0, y: 1), P2(x: 0, y: -1), P2(x: -1, y: 0)),
      ("sideRight", P2(x: 50, y: 50), P2(x: 0, y: 1), P2(x: 0, y: -1), P2(x: 1, y: 0)),
    ]
    for (id, C, u1, u2, on0) in defs {
      let corner = on0 == nil
      let h = corner ? p.cornerMouth / 2.0.squareRoot() : p.sideMouth / 2
      let J1 = P2(x: C.x + h * u1.x, y: C.y + h * u1.y)
      let J2 = P2(x: C.x + h * u2.x, y: C.y + h * u2.y)
      let ax = on0 ?? unit2(-(u1.x + u2.x), -(u1.y + u2.y))
      let ang = (corner ? p.cornerAngle : p.sideAngle) * .pi / 180
      let M = P2(x: (J1.x + J2.x) / 2, y: (J1.y + J2.y) / 2)
      for (J, u) in [(J1, u1), (J2, u2)] {
        let k = ax.x * u.x + ax.y * u.y
        let on = unit2(ax.x - k * u.x, ax.y - k * u.y)
        let c = cos(ang), s = sin(ang)
        let f1 = P2(x: u.x * c - u.y * s, y: u.x * s + u.y * c), f2 = P2(x: u.x * c + u.y * s, y: -u.x * s + u.y * c)
        let f = f1.x * on.x + f1.y * on.y > 0 ? f1 : f2
        let L = p.facingDepth / (f.x * on.x + f.y * on.y)
        segs.append(Seg(a: J, b: P2(x: J.x + f.x * L, y: J.y + f.y * L), kind: .jaw, pocket: id))
        pts.append(Pt(p: J, pocket: id))
      }
      let shelf = corner ? p.cornerShelf : p.sideShelf
      let rh = corner ? p.cornerHoleR : p.sideHoleR
      holes.append(Hole(id: id, c: P2(x: M.x + ax.x * (shelf + rh), y: M.y + ax.y * (shelf + rh)), r: rh, J1: J1, J2: J2, M: M, ax: ax, corner: corner))
    }
    let H = Dictionary(uniqueKeysWithValues: holes.map { ($0.id, $0) })
    func rail(_ a: P2, _ b: P2) { segs.append(Seg(a: a, b: b, kind: .rail, pocket: nil)) }
    rail(H["footLeft"]!.J1, H["footRight"]!.J1)
    rail(H["headLeft"]!.J1, H["headRight"]!.J1)
    rail(H["footLeft"]!.J2, H["sideLeft"]!.J2)
    rail(H["sideLeft"]!.J1, H["headLeft"]!.J2)
    rail(H["footRight"]!.J2, H["sideRight"]!.J2)
    rail(H["sideRight"]!.J1, H["headRight"]!.J2)
    return Table(segs: segs, pts: pts, holes: holes)
  }

  /// `id` 0 là bi cái, như model của editor.
  struct Ball {
    let id: Int
    var c: P2
    var v = V3.zero, w = V3.zero
    var on = true, stopped = true
    var pocket: String?
    init(_ id: Int, _ c: P2) { self.id = id; self.c = c }
  }

  enum EventKind { case ball, rail, jaw, pocket }
  struct Event { let kind: EventKind; let ball: Int; var other: Int = -1; var pocket: String? }

  /// Cơ chạm bi cái: `a` phê (phải +), `b` cao thấp (culê +), theo R. Squirt đẩy bi cái ngược phía phê.
  static func strike(_ ball: inout Ball, dir: P2, a a0: Double, b b0: Double, vms: Double, _ p: Params = P) {
    var a = a0, b = b0
    let d = unit2(dir.x, dir.y)
    let right = P2(x: -d.y, y: d.x)
    let off = hypot(a, b)
    if off > p.miscue { a *= p.miscue / off; b *= p.miscue / off }
    let sq = (a > 0 ? 1.0 : a < 0 ? -1.0 : 0) * atan(2.5 * abs(a) * (1 - a * a).squareRoot() / (1 + p.squirtRatio + 2.5 * a * a))
    let dd = P2(x: d.x * cos(sq) - right.x * sin(sq), y: d.y * cos(sq) - right.y * sin(sq))
    let v = vms * IPM
    ball.v = V3(x: dd.x * v, y: dd.y * v, z: 0)
    ball.w = V3(x: a * right.x, y: a * right.y, z: -b).cross(V3(x: d.x, y: d.y, z: 0)) * (2.5 * v / R)
    ball.stopped = false
  }

  static func stepCloth(_ b: inout Ball, _ dt: Double, _ p: Params) {
    var v = b.v, w = b.w
    let ux = v.x + R * w.y, uy = v.y - R * w.x, us = hypot(ux, uy)
    let k = p.muS * G * dt
    if us > 3.5 * k {
      let ax = -p.muS * G * ux / us, ay = -p.muS * G * uy / us
      v.x += ax * dt; v.y += ay * dt
      w.x += -2.5 / R * ay * dt; w.y += 2.5 / R * ax * dt
    } else {
      // Bước cuối pha trượt: xung J = −2/7 m u triệt trượt, giữ mômen quanh điểm chạm.
      if us > 0 {
        let jx = -2.0 / 7 * ux, jy = -2.0 / 7 * uy
        v.x += jx; v.y += jy; w.x += -2.5 / R * jy; w.y += 2.5 / R * jx
      }
      let sp = hypot(v.x, v.y)
      let ns = max(0, sp - p.muR * G * dt), r = sp > 0 ? ns / sp : 0
      v.x *= r; v.y *= r; w.x = v.y / R; w.y = -v.x / R
      if ns < 0.05 { b.v = .zero; b.w = .zero; b.stopped = true; return }
    }
    let dz = p.spinDecay * dt
    w.z = abs(w.z) <= dz ? 0 : w.z - (w.z > 0 ? dz : -dz)
    b.v = v; b.w = w
    b.c.x += v.x * dt; b.c.y += v.y * dt
  }

  /// Mathavan, Jackson, Parkin 2010, chép theo pooltool `mathavan_2010/model.py`.
  /// Khung băng: y vào băng, z lên, x = y × z. Khối lượng đơn vị, xung tính bằng in/s.
  static func cushion(_ b: inout Ball, n2: P2, th: Double, _ p: Params) -> Double {
    let eY = V3(x: -n2.x, y: -n2.y, z: 0), eZ = V3(x: 0, y: 0, z: -1), eX = eY.cross(eZ)
    var vx = b.v.dot(eX), vy = b.v.dot(eY)
    if vy <= 0 { return 0 }
    var wx = b.w.dot(eX), wy = b.w.dot(eY), wz = b.w.dot(eZ)
    let st = sin(th), ct = cos(th), ms = p.muS, mw = p.muRail, k = 2.5 / R, vin = vy
    @inline(__always) func step(_ dp: Double) {
      let a = atan2(-vy * st + wx * R, vx + wy * R * st - wz * R * ct)
      let a2 = atan2(vy + wx * R, vx - wy * R)
      let sa = sin(a), ca = cos(a), sa2 = sin(a2), ca2 = cos(a2)
      let tbl = ms * (st + mw * sa * ct)
      vx -= (mw * ca + tbl * ca2) * dp
      vy -= (ct - mw * st * sa + tbl * sa2) * dp
      wx += -k * (mw * sa + tbl * sa2) * dp
      wy += -k * (mw * ca * st - tbl * ca2) * dp
      wz += k * (mw * ca * ct) * dp
    }
    let N = 4000.0, dp = vin / N
    var W = 0.0
    while vy > 0 {
      let vy0 = vy
      step(dp)
      W += dp * abs(vy0 > 0 && vy > 0 ? vy : vy0) * ct
      if vy <= 0 { break }
    }
    // Nén dừng khi vy về 0; pha hồi trả e²·W.
    let target = p.eRail * p.eRail * W
    var Wr = 0.0, guard_ = 0
    while Wr < target && guard_ < 50 * Int(N) {
      guard_ += 1
      let d = min(dp, (target - Wr) / max(abs(vy) * ct, 1e-9))
      step(d); Wr += d * abs(vy) * ct
    }
    let v3 = eX * vx + eY * vy
    b.v = V3(x: v3.x, y: v3.y, z: 0)
    b.w = eX * wx + eY * wy + eZ * wz
    b.stopped = false
    return vin
  }

  /// Hai bi: xung pháp tuyến e, ma sát theo tốc trượt mặt tiếp xúc (Aim Lab).
  static func ballHit(_ b1: inout Ball, _ b2: inout Ball, _ p: Params) -> Bool {
    let u2 = unit2(b2.c.x - b1.c.x, b2.c.y - b1.c.y)
    let n = V3(x: u2.x, y: u2.y, z: 0)
    let r1 = n * R, r2 = n * -R
    let u = (b1.v + b1.w.cross(r1)) - (b2.v + b2.w.cross(r2))
    let un = u.dot(n)
    if un <= 0 { return false }
    let Jn = (1 + p.eBall) / 2 * un
    let ut = u - n * un, s = ut.len
    var J = n * Jn
    if s > 1e-9 {
      let mu = 9.951e-3 + 0.108 * exp(-1.088 * s / IPM)
      J = J + ut * (min(mu * Jn, s / 7) / s)
    }
    b2.v = b2.v + J; b1.v = b1.v - J; b1.v.z = 0; b2.v.z = 0
    b2.w = b2.w + r2.cross(J) * (2.5 / (R * R))
    b1.w = b1.w + r1.cross(J * -1) * (2.5 / (R * R))
    b1.stopped = false; b2.stopped = false
    return true
  }

  @inline(__always) static func closest(_ c: P2, _ a: P2, _ b: P2) -> P2? {
    let ex = b.x - a.x, ey = b.y - a.y
    let t = min(1, max(0, ((c.x - a.x) * ex + (c.y - a.y) * ey) / (ex * ex + ey * ey)))
    return t <= 0 || t >= 1 ? nil : P2(x: a.x + ex * t, y: a.y + ey * t)
  }

  static func hitTable(_ b: inout Ball, _ T: Table, _ th: Double, _ p: Params, _ events: inout [Event]) {
    func touch(_ q: P2, _ kind: Kind, _ pocket: String?) {
      let dx = b.c.x - q.x, dy = b.c.y - q.y, dd = hypot(dx, dy)
      if dd >= R || dd < 1e-9 { return }
      let n2 = P2(x: dx / dd, y: dy / dd)
      let hit = cushion(&b, n2: n2, th: th, p)
      b.c = P2(x: q.x + n2.x * R, y: q.y + n2.y * R)
      if hit > 0 { events.append(Event(kind: kind == .jaw ? .jaw : .rail, ball: b.id, pocket: pocket)) }
    }
    for s in T.segs { if let q = closest(b.c, s.a, s.b) { touch(q, s.kind, s.pocket) } }
    for s in T.pts { touch(s.p, .jaw, s.pocket) }
    for h in T.holes where d2(b.c, h.c) < h.r {
      b.on = false; b.pocket = h.id; b.stopped = true
      events.append(Event(kind: .pocket, ball: b.id, pocket: h.id))
      return
    }
    if b.c.x < -6 || b.c.x > 56 || b.c.y < -6 || b.c.y > 106 { b.on = false; b.stopped = true }
  }

  /// Chạy tới khi mọi bi đứng. `untilFirstHit` dừng ngay sau sự kiện đầu tiên (cho secant ngắm).
  /// `record` lấy mẫu vị trí mỗi `every` giây cho replay.
  static func run(_ balls: inout [Ball], _ T: Table, _ p: Params = P, dt: Double = 1.0 / 1000, maxT: Double = 15,
                  untilFirstHit: Bool = false, events: inout [Event],
                  record: ((Double, [Ball]) -> Void)? = nil, every: Double = 1.0 / 60) -> Double {
    let th = asin(min(0.9, max(-0.9, 2 * p.noseH - 1)))
    var t = 0.0, next = 0.0
    record?(0, balls)
    while t < maxT {
      var moving = false
      for i in balls.indices where balls[i].on && !balls[i].stopped { stepCloth(&balls[i], dt, p); moving = true }
      if !moving { break }
      for i in balls.indices {
        for j in (i + 1)..<balls.count {
          guard balls[i].on, balls[j].on, d2(balls[i].c, balls[j].c) < D else { continue }
          var A = balls[i], B = balls[j]
          if ballHit(&A, &B, p) {
            events.append(Event(kind: .ball, ball: A.id, other: B.id))
            let u = unit2(B.c.x - A.c.x, B.c.y - A.c.y), m = (D - d2(A.c, B.c)) / 2
            A.c.x -= u.x * m; A.c.y -= u.y * m; B.c.x += u.x * m; B.c.y += u.y * m
            balls[i] = A; balls[j] = B
          }
        }
      }
      for i in balls.indices where balls[i].on && !balls[i].stopped { hitTable(&balls[i], T, th, p, &events) }
      t += dt
      // Như `firstContact` bên JS: dừng ở sự kiện đầu tiên bất kể loại, bên gọi tự xem có phải va bi không.
      if untilFirstHit && !events.isEmpty { return t }
      if let record, t >= next { record(t, balls); next += every }
    }
    record?(t, balls)
    return t
  }
}
