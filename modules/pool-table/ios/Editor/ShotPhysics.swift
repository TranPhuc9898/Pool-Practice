import CoreGraphics
import Foundation
import simd

// Port của docs/prototypes/soan-bai-v4.dc.html (sim, approach, hit, solve, shot, stunTip) và shotOf/fraction từ v7.
// Inch, giây. x 0..50, y 0..100, băng foot ở y = 0. Hằng số khớp docs/aiming-physics.md.
// Kiểm bằng `node docs/prototypes/soan-bai-v4.check.js`, cùng cú phải khớp ±0.1° và ±0.1".
enum ShotPhysics {
  static let ballRadius: CGFloat = 1.125
  static let ballDiameter: CGFloat = 2.25
  static let width: CGFloat = 50
  static let length: CGFloat = 100
  static let gravity: CGFloat = 386.1
  static let muSlide: CGFloat = 0.2 * gravity
  static let muRoll: CGFloat = 0.01 * gravity
  /// e bi–băng của `cushion()` trong docs/research/bi-cai-xoay.html.
  static let railRestitution: CGFloat = 0.82
  /// Va chạm hai bi, cùng Aim Lab.
  static let ballRestitution: CGFloat = 0.95
  /// Squirt ở phê 0.5R, shaft thường, độ.
  static let squirtDeg: CGFloat = 2.5
  static let inchesPerMeter: CGFloat = 39.37
  static let dt: CGFloat = 1 / 240
  /// Dưới tốc độ này coi như bi dừng: 0.004 m/s.
  static let stopSpeed: CGFloat = 0.004 * inchesPerMeter
  /// Bi cách tâm lỗ dưới mức này là rơi.
  static let pocketCatch: CGFloat = 2.4
  /// Bán kính rơi lỗ của bi đang chạy, theo `POCKETS` của docs/research/bi-cai-xoay.html: góc 0,062 m, giữa 0,056 m.
  static func catchRadius(_ pocket: String) -> CGFloat { pocket.hasPrefix("side") ? 2.2 : 2.44 }
  /// Lỗ giữa chỉ ăn bi tới gần vuông góc với băng dài; bi chạy dọc băng đập mũi băng bật ra. Vòng `catchRadius` không
  /// có mũi băng nên phải chặn ở luật cú. 60° là ước lượng [suy luận], chưa đối chiếu TP 3.5 của Dr. Dave.
  static let sideMaxAngle: CGFloat = 60
  /// Dr. Dave: miscue khoảng 0.5R–0.6R tuỳ phấn và đầu cơ. Kéo được tới 0.6R, quá 0.5R là cảnh báo.
  static let tipMax: CGFloat = 0.6
  static let miscueSafe: CGFloat = 0.5
  /// Mặt bi kéo được tới sát mép. Quá `tipMax` là trượt cơ: vẫn đặt được để thấy, nhưng không mô phỏng.
  static let padMax: CGFloat = 0.85
  static let rollTip: CGFloat = 0.4
  static let cutWarn: CGFloat = 75
  /// Phê (spin quanh trục đứng) hãm đều do ma sát xoáy với vải, rad/s² (TP B.8). Qua va chạm hai bi giữ nguyên.
  static let spinDecay: CGFloat = 10.9
  /// Băng theo `cushion()` của docs/research/bi-cai-xoay.html: điểm chạm cao hơn tâm sinE·R, ma sát dọc băng.
  static let railSinE: CGFloat = 0.27
  static let railMu: CGFloat = 0.14

  static let pockets: [String: CGPoint] = [
    "footLeft": CGPoint(x: 0, y: 0), "footRight": CGPoint(x: 50, y: 0),
    "sideLeft": CGPoint(x: 0, y: 50), "sideRight": CGPoint(x: 50, y: 50),
    "headLeft": CGPoint(x: 0, y: 100), "headRight": CGPoint(x: 50, y: 100),
  ]
  static let pocketNames = [
    "footLeft": "top-left corner", "footRight": "top-right corner", "sideLeft": "left side",
    "sideRight": "right side", "headLeft": "bottom-left corner", "headRight": "bottom-right corner",
  ]

  // MARK: đích

  /// Đích của bi mục tiêu là một trong sáu lỗ, hoặc một điểm trên băng với id `railLeft@37.5` (băng và inch dọc
  /// băng). Với băng, đích là tâm bi lúc chạm băng, cách mũi băng một bán kính; bi tới đó rồi dội ra theo `cushion`.
  static let railNames = ["railLeft": "left rail", "railRight": "right rail", "railFoot": "top rail", "railHead": "bottom rail"]
  static func isPocket(_ id: String) -> Bool { pockets[id] != nil }
  /// id đích băng, inch làm tròn nửa inch để cùng một chỗ chạm cho cùng một id.
  static func railId(_ side: String, at s: CGFloat) -> String {
    side + "@" + String(format: "%.1f", Double((s * 2).rounded() / 2))
  }
  /// Điểm trên mũi băng của đích băng, nil nếu id không phải băng.
  static func railNose(_ id: String) -> CGPoint? {
    let parts = id.split(separator: "@")
    guard parts.count == 2, let s = Double(parts[1]) else { return nil }
    let v = CGFloat(s)
    switch parts[0] {
    case "railLeft": return CGPoint(x: 0, y: v)
    case "railRight": return CGPoint(x: width, y: v)
    case "railFoot": return CGPoint(x: v, y: 0)
    case "railHead": return CGPoint(x: v, y: length)
    default: return nil
    }
  }
  /// Tâm lỗ, hoặc tâm bi lúc chạm băng. nil nếu id lạ.
  static func target(_ id: String) -> CGPoint? {
    if let p = pockets[id] { return p }
    guard let n = railNose(id) else { return nil }
    return CGPoint(x: min(max(n.x, ballRadius), width - ballRadius), y: min(max(n.y, ballRadius), length - ballRadius))
  }
  static func targetName(_ id: String) -> String {
    pocketNames[id] ?? id.split(separator: "@").first.flatMap { railNames[String($0)] } ?? id
  }
  struct Obstacle { let n: Int; let p: CGPoint }

  /// Cú chính đã đủ dữ kiện: bi cái, bi mục tiêu, đích (lỗ hay băng), các bi còn lại. `ball` chỉ để ghi số bi mục tiêu
  /// vào `Trace.hit` của bi khác.
  struct Setup {
    let c: CGPoint
    let o: CGPoint
    let pocket: String
    let others: [Obstacle]
    var ball = 1
    var P: CGPoint { ShotPhysics.target(pocket) ?? .zero }
    var toRail: Bool { !ShotPhysics.isPocket(pocket) }
  }

  enum Level { case ok, warn, bad }
  struct Verdict { var cut: CGFloat?; var level: Level = .ok; var why = "" }

  /// `sRoll` là quãng bi cái bắt đầu lăn đều, nil nếu còn trượt lúc chạm.
  struct Approach { var v: CGFloat; var f: CGFloat; var s: CGFloat; var t: CGFloat = 0; var sRoll: CGFloat? }

  /// Bi cái lúc chạm bi mục tiêu với một hướng cơ cho trước. `reached` false là bi cái dừng trước khi tới.
  struct Contact {
    var reached = false
    var ap: Approach
    /// Hướng bi cái đi sau squirt, và tâm bi cái lúc chạm.
    var L: CGPoint
    var P: CGPoint = .zero
    var obV: CGPoint = .zero
    var cueV: CGPoint = .zero
    var cueW: CGPoint = .zero
    /// Phê còn lại lúc chạm, rad/s.
    var cueWz: CGFloat = 0
    /// Đường bi cái từ đầu cơ tới chỗ chạm (giây tính từ lúc đánh). Nâng cơ thì cong.
    var pre = Trace()
    /// Lệch hướng bi mục tiêu so với tâm lỗ, radian, dương là lệch sang phải hướng đi.
    var err: CGFloat = 0
    var squirtDeg: CGFloat = 0
    var throwDeg: CGFloat = 0
    /// Phê làm mặt tiếp xúc hết trượt ngang (gearing), theo bán kính bi.
    var gear: CGFloat = 0
  }

  enum Short { case cue, ob }
  struct Run {
    /// Bi cái từ đầu cơ tới chỗ chạm (hay chỗ dừng nếu không tới), giây tính từ lúc đánh.
    var pre = Trace()
    var pts: [CGPoint] = []
    /// Giây tính từ lúc chạm, cùng chỉ số với `pts`.
    var ts: [CGFloat] = []
    /// Spin dạng vận tốc tương đương (inch/s) tại từng điểm, cùng chỉ số với `pts`. Lăn đều thì bằng vận tốc.
    var ws: [CGPoint] = []
    /// Vận tốc (inch/s) và phê (rad/s, dương ngược chiều kim đồng hồ nhìn từ trên), cùng chỉ số với `pts`.
    var vs: [CGPoint] = []
    var wzs: [CGFloat] = []
    /// Quãng bi cái bắt đầu lăn trên đường tới bi mục tiêu, nil nếu còn trượt lúc chạm.
    var sRoll: CGFloat?
    var stop: CGPoint = .zero
    var scratch: String?
    var hit: Int?
    /// Bi mục tiêu và các bi khác bị đụng mà rời chỗ, cùng mô phỏng với bi cái.
    var ob = Trace()
    var moved: [Int: Trace] = [:]
    /// Đích là băng, không phải lỗ.
    var toRail = false
    var short: Short?
    /// Thiếu bao nhiêu inch nữa thì tới đích.
    var gap: CGFloat = 0
    var obStop: CGPoint?
    var f: CGFloat = 0
    var vC: CGFloat = 0
    /// Tốc độ bi mục tiêu rời chỗ, inch/s.
    var vO: CGFloat = 0
    /// Tâm bi cái lúc chạm (đã squirt, không còn là ghost hình học) và hướng bi mục tiêu đi (đã throw).
    var ghost: CGPoint = .zero
    var d: CGPoint = .zero
    /// Hướng bi cái đi tới chỗ chạm.
    var a: CGPoint = .zero
    var squirtDeg: CGFloat = 0
    var throwDeg: CGFloat = 0
    var gear: CGFloat = 0
  }

  // MARK: hình học

  static func unit(_ x: CGFloat, _ y: CGFloat) -> CGPoint {
    let l = max(hypot(x, y), 1e-9)
    return CGPoint(x: x / l, y: y / l)
  }

  static func segDist(_ p: CGPoint, _ a: CGPoint, _ b: CGPoint) -> CGFloat {
    let vx = b.x - a.x, vy = b.y - a.y
    let l = vx * vx + vy * vy == 0 ? 1e-6 : vx * vx + vy * vy
    let t = min(max(((p.x - a.x) * vx + (p.y - a.y) * vy) / l, 0), 1)
    return hypot(p.x - a.x - t * vx, p.y - a.y - t * vy)
  }

  static func ghost(_ o: CGPoint, _ P: CGPoint) -> (g: CGPoint, d: CGPoint) {
    let d = unit(P.x - o.x, P.y - o.y)
    return (CGPoint(x: o.x - d.x * ballDiameter, y: o.y - d.y * ballDiameter), d)
  }

  // MARK: luật cú đánh

  static func shotOf(ball: Int, pocket: String, balls: [Int: CGPoint]) -> Verdict? {
    guard let o = balls[ball], let P = target(pocket) else { return nil }
    let (G, d) = ghost(o, P)
    var r = Verdict()
    func bad(_ why: String) -> Verdict { r.level = .bad; r.why = why; return r }
    let tol: CGFloat = 0.05
    if G.x < ballRadius - tol || G.x > width - ballRadius + tol || G.y < ballRadius - tol || G.y > length - ballRadius + tol {
      return bad("frozen to the rail, can't make this pocket")
    }
    if pocket.hasPrefix("side"), acos(min(abs(d.x), 1)) * 180 / .pi > sideMaxAngle {
      return bad("too steep for the side pocket")
    }
    let c = balls[0]
    if let c {
      let v = unit(G.x - c.x, G.y - c.y)
      let cut = acos(min(max(v.x * d.x + v.y * d.y, -1), 1)) * 180 / .pi
      r.cut = cut
      if cut >= 89.5 { return bad("no angle to hit") }
    }
    for (m, q) in balls.sorted(by: { $0.key < $1.key }) where m != ball && m != 0 {
      if let c, segDist(q, c, G) < ballDiameter - 0.02 { return bad("\(name(m)) blocks the cue ball") }
      if segDist(q, o, P) < ballDiameter - 0.02 { return bad("\(name(m)) blocks the path \(isPocket(pocket) ? "to the pocket" : "to the rail")") }
    }
    if let cut = r.cut, cut > cutWarn { r.level = .warn; r.why = "too thin" }
    return r
  }

  static func name(_ n: Int) -> String { n == 0 ? "cue ball" : "ball \(n)" }

  private static let fracs: [(CGFloat, String)] = [(1, "full ball"), (0.75, "¾ ball"), (0.5, "½ ball"), (0.25, "¼ ball"), (0.125, "⅛ ball")]

  /// Phần bi chồng nhau nhìn từ bi cái: 1 − sin(góc cắt), làm tròn về mốc người chơi dùng.
  static func fraction(cut: CGFloat) -> String {
    let f = 1 - sin(cut * .pi / 180)
    return fracs.min(by: { abs($0.0 - f) < abs($1.0 - f) })!.1
  }

  // MARK: bi cái từ đầu cơ tới ghost

  /// Đầu cơ lệch tâm cho Rω = 2.5·tip·v, trượt tới khi lăn đều, rồi lăn chậm dần. Cùng bước với `sim` của prototype:
  /// ma sát kéo độ trượt v − w về 0 nhanh gấp 3.5 lần v. v = 0 nghĩa là bi cái dừng trước khi tới.
  /// `sample` nhận (giây, inch đã đi, vận tốc, spin) mỗi bước, chỉ bản chạy thử cần.
  static func approach(L: CGFloat, tip: CGFloat, v0: CGFloat,
                       sample: ((_ t: CGFloat, _ s: CGFloat, _ v: CGFloat, _ w: CGFloat) -> Void)? = nil) -> Approach {
    var v = v0, w = 2.5 * tip * v0, s: CGFloat = 0, t: CGFloat = 0, sRoll: CGFloat?
    let k = muSlide * dt
    while s < L {
      if v < stopSpeed { return Approach(v: 0, f: 0, s: s, t: t, sRoll: sRoll) }
      let u = v - w
      if abs(u) > 3.5 * k {
        let d = u < 0 ? -k : k
        v -= d; w += 2.5 * d
      } else {
        if sRoll == nil { sRoll = s }
        v = max(0, v - muRoll * dt); w = v
      }
      s += v * dt; t += dt
      sample?(t, s, v, w)
    }
    return Approach(v: v, f: w / v, s: L, t: t, sRoll: sRoll)
  }

  /// Phê sau `t` giây, hãm đều `spinDecay` về 0.
  static func spin(_ w0: CGFloat, after t: CGFloat) -> CGFloat {
    w0 > 0 ? max(0, w0 - spinDecay * t) : min(0, w0 + spinDecay * t)
  }

  /// Băng theo `cushion()` của docs/research/bi-cai-xoay.html: phản lực và ma sát dọc băng cùng đặt ở điểm chạm cao hơn
  /// tâm sinE·R, khối lượng 1, I = 0,4R². Spin giữ qua băng, nên bi culê hay kéo rời băng vẫn còn trượt và ma sát vải bẻ cong
  /// đường. `n` là pháp tuyến băng hướng vào bàn. Bi không đi vào băng thì trả nguyên trạng thái.
  static func cushion(v: CGPoint, w: CGPoint, wz: CGFloat, n: CGPoint) -> (v: CGPoint, w: CGPoint, wz: CGFloat) {
    // Sang khung thuận tay phải z lên: lật y. Spin tương đương W = (Rωy, −Rωx), nên ω = (w.y, w.x, wz) theo R.
    let R = Double(ballRadius), sinE = Double(railSinE), cosE = (1 - sinE * sinE).squareRoot()
    let N = SIMD3<Double>(Double(n.x), -Double(n.y), 0), V = SIMD3<Double>(Double(v.x), -Double(v.y), 0)
    let vn = simd_dot(V, N)
    guard vn < 0 else { return (v, w, wz) }
    let om = SIMD3<Double>(Double(w.y) / R, Double(w.x) / R, Double(wz))
    let r = SIMD3<Double>(-R * cosE * N.x, -R * cosE * N.y, R * sinE)
    let t = SIMD3<Double>(-N.y, N.x, 0)
    let I = 0.4 * R * R
    // Xung pháp tuyến đặt ở điểm chạm nên có mômen: e áp cho vận tốc điểm chạm, chia khối lượng hiệu dụng. Bỏ mômen thì
    // topspin qua băng nguyên vẹn, bi lăn đập thẳng băng chỉ dội ra 30% tốc và góc ra mở quá rộng (Han 2005, Mathavan 2010).
    let rxn = simd_cross(r, N), un = simd_dot(V + simd_cross(om, r), N)
    let Jn = un < 0 ? -(1 + Double(railRestitution)) * un / (1 + simd_dot(rxn, rxn) / I) : 0
    let ut = simd_dot(V + simd_cross(om, r), t)
    let rxt = simd_cross(r, t), meff = 1 / (1 + simd_dot(rxt, rxt) / I)
    let Jt = ut == 0 ? 0 : -(ut > 0 ? 1 : -1) * min(Double(railMu) * Jn, abs(ut) * meff)
    let V2 = V + Jn * N + Jt * t, om2 = om + simd_cross(r, Jn * N + Jt * t) / I
    return (CGPoint(x: V2.x, y: -V2.y), CGPoint(x: R * om2.y, y: R * om2.x), CGFloat(om2.z))
  }

  // MARK: bi lăn sau va chạm

  /// Đường một bi trong mô phỏng sau va chạm: mẫu thưa theo quãng, cùng chỉ số. `pocket` là lỗ bi rơi, `hit` là bi khác
  /// chạm vào đầu tiên, `bounces` là số lần chạm băng.
  struct Trace {
    var pts: [CGPoint] = []
    var ts: [CGFloat] = []
    var vs: [CGPoint] = []
    var ws: [CGPoint] = []
    var wzs: [CGFloat] = []
    var stop: CGPoint = .zero
    var pocket: String?
    var hit: Int?
    var bounces = 0
    var moved: Bool { pts.count > 1 }
  }

  private struct Body {
    let n: Int
    var x: CGFloat, y: CGFloat, vx: CGFloat, vy: CGFloat, wx: CGFloat, wy: CGFloat, wz: CGFloat
    var alive = true
    var acc: CGFloat = 0, last: CGFloat = 0
    /// Quãng đã đi, và quãng lúc hết trượt sang lăn (nil nếu còn trượt).
    var path: CGFloat = 0, sRoll: CGFloat?
    var tr = Trace()
    init(n: Int, p: CGPoint, v: CGPoint = .zero, w: CGPoint = .zero, wz: CGFloat = 0) {
      self.n = n; x = p.x; y = p.y; vx = v.x; vy = v.y; wx = w.x; wy = w.y; self.wz = wz
      tr.pts = [p]; tr.ts = [0]; tr.vs = [v]; tr.ws = [w]; tr.wzs = [wz]
    }
    var still: Bool { hypot(vx, vy) < stopSpeed && hypot(vx - wx, vy - wy) <= 3.5 * muSlide * dt }
    mutating func sample(_ t: CGFloat) {
      tr.pts.append(CGPoint(x: x, y: y)); tr.ts.append(t); tr.ws.append(CGPoint(x: wx, y: wy))
      tr.vs.append(CGPoint(x: vx, y: vy)); tr.wzs.append(wz); acc = 0; last = t
    }
  }

  /// Vùng cạnh lỗ không có băng, như `CZ`/`SZ` của docs/research/bi-cai-xoay.html (0,08 m và 0,06 m): bi vào đó đi thẳng
  /// ra khỏi bàn và rơi lỗ, không dội ngược lại.
  static let cornerZone: CGFloat = 0.08 * inchesPerMeter
  static let sideZone: CGFloat = 0.06 * inchesPerMeter

  /// Một bước trượt–lăn của một bi trên vải, `step()` của demo. `dt` truyền vào để bước cuối trước va chạm cắt ngắn được.
  private static func step(_ b: inout Body, dt: CGFloat) {
    let k = muSlide * dt
    let sp = hypot(b.vx, b.vy), vx0 = b.vx, vy0 = b.vy
    let ux = b.vx - b.wx, uy = b.vy - b.wy, us = hypot(ux, uy)
    if us > 3.5 * k {
      b.vx -= k * ux / us; b.vy -= k * uy / us; b.wx += 2.5 * k * ux / us; b.wy += 2.5 * k * uy / us
    } else {
      if us > 0 {
        // Bước cuối pha trượt như `step()` của demo: xoá hẳn u, giữ mômen quanh điểm chạm. Bỏ u đi thì sai tốc tới
        // muSlide·dt, và với ma sát lăn 0,01 sai đó thành vài inch quãng lăn.
        b.vx -= ux / 3.5; b.vy -= uy / 3.5
      } else if sp > 0 {
        let r = max(0, sp - muRoll * dt) / sp
        b.vx *= r; b.vy *= r
      }
      b.wx = b.vx; b.wy = b.vy
      if b.sRoll == nil { b.sRoll = b.path }
    }
    b.wz = spin(b.wz, after: dt)
    // Vị trí theo trung bình hai vận tốc như demo: dùng vận tốc mới thì cú kéo dài lệch demo hơn 1".
    b.x += (vx0 + b.vx) / 2 * dt; b.y += (vy0 + b.vy) / 2 * dt
    let ds = hypot(b.vx, b.vy) * dt
    b.acc += ds; b.path += ds
  }

  /// Mọi bi cùng lăn như `simulate()` của docs/research/bi-cai-xoay.html: từng bi trượt rồi lăn trên vải, bi chạm nhau
  /// truyền xung theo pháp tuyến không ma sát (e = `ballRestitution`, spin giữ nguyên), chạm băng theo `cushion`, rơi lỗ
  /// khi vào bán kính `catchRadius` hoặc ra khỏi bàn qua vùng cạnh lỗ. Bi đứng yên vẫn bị bi khác đánh bật.
  /// `untilContact`: đoạn tiếp cận. Dừng ngay lúc bi 0 chạm bi 1, bước cuối cắt ngắn để hai bi vừa chạm chứ không lún;
  /// trả về `contact` true. Không chạm mà bi 0 dừng thì `contact` false.
  private static func simulate(_ start: [Body], untilContact: Bool = false) -> (bodies: [Body], contact: Bool) {
    var bs = start
    let lo = ballRadius, hiX = width - ballRadius, hiY = length - ballRadius
    var t: CGFloat = 0
    for _ in 0..<(240 * 20) {
      var kick = [Bool](repeating: false, count: bs.count)
      var moving = false
      let before = bs[0]
      for i in bs.indices where bs[i].alive && !bs[i].still {
        moving = true
        step(&bs[i], dt: dt)
      }
      if !moving { break }
      t += dt
      if untilContact {
        let dx = bs[1].x - bs[0].x, dy = bs[1].y - bs[0].y
        if hypot(dx, dy) < ballDiameter {
          // Tìm phần bước s để |p0 + s·Δ − O| = D, rồi chạy lại bước với s·dt từ trạng thái trước.
          let ex = bs[0].x - before.x, ey = bs[0].y - before.y
          let rx = before.x - bs[1].x, ry = before.y - bs[1].y
          let A = ex * ex + ey * ey, B = 2 * (rx * ex + ry * ey), C = rx * rx + ry * ry - ballDiameter * ballDiameter
          var s: CGFloat = 0
          if A > 0 {
            let disc = B * B - 4 * A * C
            if disc >= 0 { s = min(max((-B - sqrt(disc)) / (2 * A), 0), 1) }
          }
          var b = before
          if s > 0 { step(&b, dt: s * dt) }
          t -= (1 - s) * dt
          b.sample(t); bs[0] = b
          for i in bs.indices { bs[i].tr.stop = CGPoint(x: bs[i].x, y: bs[i].y) }
          return (bs, true)
        }
      }
      // `collide()` của demo: xung pháp tuyến, đẩy hai bi rời nhau, không đổi spin.
      for i in bs.indices where bs[i].alive {
        for j in bs.indices where j > i && bs[j].alive {
          let dx = bs[j].x - bs[i].x, dy = bs[j].y - bs[i].y, dist = hypot(dx, dy)
          if dist >= ballDiameter || dist == 0 { continue }
          let nx = dx / dist, ny = dy / dist
          let vrel = (bs[i].vx - bs[j].vx) * nx + (bs[i].vy - bs[j].vy) * ny
          if vrel <= 0 { continue }
          let J = (1 + ballRestitution) / 2 * vrel, push = (ballDiameter - dist) / 2
          bs[i].vx -= J * nx; bs[i].vy -= J * ny; bs[j].vx += J * nx; bs[j].vy += J * ny
          bs[i].x -= nx * push; bs[i].y -= ny * push; bs[j].x += nx * push; bs[j].y += ny * push
          if bs[i].tr.hit == nil { bs[i].tr.hit = bs[j].n }
          if bs[j].tr.hit == nil { bs[j].tr.hit = bs[i].n }
          kick[i] = true; kick[j] = true
        }
      }
      // `rails()` của demo: rơi lỗ trước, rồi băng, trừ vùng cạnh lỗ.
      for i in bs.indices where bs[i].alive {
        var b = bs[i]
        let x = b.x, y = b.y
        var pot: String?
        for (id, q) in pockets where hypot(x - q.x, y - q.y) < catchRadius(id) { pot = id; break }
        if pot == nil, x < -ballRadius || x > width + ballRadius || y < -ballRadius || y > length + ballRadius {
          pot = pockets.min { hypot(x - $0.value.x, y - $0.value.y) < hypot(x - $1.value.x, y - $1.value.y) }!.key
        }
        if let pot {
          b.alive = false; b.vx = 0; b.vy = 0; b.wx = 0; b.wy = 0; b.wz = 0; b.tr.pocket = pot
          b.sample(t); bs[i] = b
          continue
        }
        let nearCornerX = x < cornerZone || x > width - cornerZone, nearCornerY = y < cornerZone || y > length - cornerZone
        let nearSide = abs(y - length / 2) < sideZone
        var bounced = false
        func bank(_ nx: CGFloat, _ ny: CGFloat) {
          let c = cushion(v: CGPoint(x: b.vx, y: b.vy), w: CGPoint(x: b.wx, y: b.wy), wz: b.wz, n: CGPoint(x: nx, y: ny))
          b.vx = c.v.x; b.vy = c.v.y; b.wx = c.w.x; b.wy = c.w.y; b.wz = c.wz
          b.tr.bounces += 1; bounced = true
        }
        if x < lo && b.vx < 0 && !nearCornerY && !nearSide { b.x = lo; bank(1, 0) }
        else if x > hiX && b.vx > 0 && !nearCornerY && !nearSide { b.x = hiX; bank(-1, 0) }
        if y < lo && b.vy < 0 && !nearCornerX { b.y = lo; bank(0, 1) }
        else if y > hiY && b.vy > 0 && !nearCornerX { b.y = hiY; bank(0, -1) }
        // Lấy mẫu theo quãng, và theo giờ khi bi gần đứng mà còn xoáy mạnh (kéo, stop) để replay dựng được hướng quay.
        if bounced || kick[i] || b.acc > 0.6 || (t - b.last > 1 / 120 && !b.still) { b.sample(t) }
        bs[i] = b
      }
    }
    for i in bs.indices where bs[i].alive {
      if hypot(bs[i].vx, bs[i].vy) < stopSpeed { bs[i].vx = 0; bs[i].vy = 0 }
      bs[i].sample(t)
    }
    for i in bs.indices { bs[i].tr.stop = CGPoint(x: bs[i].x, y: bs[i].y) }
    return (bs, false)
  }

  // MARK: va chạm

  static func dot(_ a: CGPoint, _ b: CGPoint) -> CGFloat { a.x * b.x + a.y * b.y }
  /// Phê phải (t > 0) đẩy bi cái sang trái hướng cơ. Cùng `rot()` của Aim Lab.
  static func rot(_ a: CGPoint, _ t: CGFloat) -> CGPoint {
    CGPoint(x: a.x * cos(t) + a.y * sin(t), y: -a.x * sin(t) + a.y * cos(t))
  }

  /// Cú cơ như `strike()` của docs/research/bi-cai-xoay.html: xung dọc trục cơ đặt tại điểm chạm trên mặt cầu,
  /// ω = (r × J)/I với I = 0,4mR². `L` là hướng bi cái đi (đã squirt), `theta` nâng cơ theo độ. Vì `speed` là tốc bi cái
  /// chứ không phải tốc cơ (chế độ bàn xếp của web), khối lượng cơ và e đầu cơ triệt tiêu: ω = (r×d)·V/(0,4R²cosθ).
  /// Trả spin dạng vận tốc tương đương `w` (inch/s) và phê `wz` (rad/s) theo quy ước của `cushion`. Cơ nằm ngang ra đúng
  /// |w| = 2,5·tip·V và wz = 2,5·tipX·V/R như trước.
  static func strike(_ L: CGPoint, tipX a: CGFloat, tipY b: CGFloat, theta deg: CGFloat, speed vms: CGFloat)
    -> (v: CGPoint, w: CGPoint, wz: CGFloat) {
    let R = Double(ballRadius), V = Double(vms * inchesPerMeter), th = Double(deg) * .pi / 180
    // Khung web thuận tay phải z lên: lật y.
    let h = SIMD3<Double>(Double(L.x), -Double(L.y), 0)
    let d = SIMD3<Double>(h.x * cos(th), h.y * cos(th), -sin(th))
    let right = SIMD3<Double>(h.y, -h.x, 0), up = simd_cross(right, d)
    let o = (right * Double(a) + up * Double(b)) * R
    let dep = max(0, R * R - simd_dot(o, o)).squareRoot()
    let rxd = simd_cross(o - d * dep, d)
    let om = rxd * (V / (0.4 * R * R * max(cos(th), 0.05)))
    return (CGPoint(x: L.x * CGFloat(V), y: L.y * CGFloat(V)), CGPoint(x: R * om.y, y: R * om.x), CGFloat(om.z))
  }

  /// Tốc bi cái (m/s) ngay sau cú với tốc cơ `stick`, đúng xung `j` của `strike()` trên web (cơ 0,54 kg, bi 0,17 kg,
  /// e đầu cơ 1, điểm chạm kẹp 0,5R). Điểm chạm vuông góc trục cơ nên |r×d|² = (a²+b²)R²; squirt không đổi độ lớn.
  static func cueBallSpeed(stick: CGFloat, tipX: CGFloat, tipY: CGFloat, theta: CGFloat) -> CGFloat {
    let M: CGFloat = 0.54, m: CGFloat = 0.17
    let k = min(1, 0.5 / max(hypot(tipX, tipY), 1e-9)), r2 = (tipX * tipX + tipY * tipY) * k * k
    let j = 2 * stick / (1 / M + (1 + 2.5 * r2) / m)
    return cos(theta * .pi / 180) * j / m
  }

  /// Một cú với hướng cơ `aim` (radian). Squirt lệch đường bi cái; bi cái trượt rồi lăn tới bi mục tiêu bằng đúng bước
  /// của `simulate()` (nâng cơ thì đường cong); va chạm có throw theo Aim Lab: μ giữa hai bi giảm theo tốc độ trượt mặt
  /// tiếp xúc, lực ngang không vượt mức làm mặt tiếp xúc hết trượt. `reached` false là bi cái dừng (hay trượt qua) mà
  /// không chạm, `pre.stop` là chỗ nó dừng.
  static func hit(_ ms: Setup, aim: CGFloat, tipX: CGFloat, tipY: CGFloat, theta: CGFloat = 0, speed vms: CGFloat) -> Contact? {
    let C = ms.c, O = ms.o
    let sq = squirtDeg * .pi / 180 * min(max(tipX / 0.5, -1.1), 1.1)
    let L = rot(CGPoint(x: cos(aim), y: sin(aim)), sq)
    let s = strike(L, tipX: tipX, tipY: tipY, theta: theta, speed: vms)
    let (bs, reached) = simulate([Body(n: 0, p: C, v: s.v, w: s.w, wz: s.wz), Body(n: ms.ball, p: O)], untilContact: true)
    let cue = bs[0]
    let v = CGPoint(x: cue.vx, y: cue.vy), W = CGPoint(x: cue.wx, y: cue.wy), sp = hypot(v.x, v.y)
    var h = Contact(ap: Approach(v: 0, f: 0, s: cue.path, t: cue.tr.ts.last ?? 0, sRoll: cue.sRoll), L: L, squirtDeg: sq * 180 / .pi)
    h.pre = cue.tr
    h.P = cue.tr.stop
    guard reached, sp > 0 else { return h }
    h.reached = true
    h.ap.v = sp; h.ap.f = dot(W, v) / (sp * sp)
    h.cueWz = cue.wz
    let n = unit(O.x - h.P.x, O.y - h.P.y), t = CGPoint(x: n.y, y: -n.x)
    // Throw tính bằng m/s, vì μ(slip) của Aim Lab đo ở đơn vị đó.
    let im = 1 / inchesPerMeter
    let slipH = (dot(v, t) + ballRadius * cue.wz) * im, slipV = dot(W, n) * im, slip = hypot(slipH, slipV)
    let Jn = (1 + ballRestitution) / 2 * dot(v, n) * im
    let mu = 9.951e-3 + 0.108 * exp(-1.088 * slip)
    let F = min(mu * Jn, slip / 7)
    let Fh = slip > 1e-9 ? F * slipH / slip : 0, Fv = slip > 1e-9 ? F * slipV / slip : 0
    h.obV = CGPoint(x: (n.x * Jn + t.x * Fh) / im, y: (n.y * Jn + t.y * Fh) / im)
    h.cueV = CGPoint(x: v.x - h.obV.x, y: v.y - h.obV.y)
    h.cueW = CGPoint(x: W.x - n.x * 2.5 * Fv / im, y: W.y - n.y * 2.5 * Fv / im)
    let toP = unit(ms.P.x - O.x, ms.P.y - O.y), ob = unit(h.obV.x, h.obV.y)
    h.err = atan2(toP.x * ob.y - toP.y * ob.x, dot(toP, ob))
    h.throwDeg = atan2(Fh, Jn) * 180 / .pi
    h.gear = -dot(v, t) * im / (2.5 * vms)
    return h
  }

  /// Hướng cơ cho bi mục tiêu vào đúng tâm lỗ, có tính throw và squirt: secant từ hướng ngắm ghost.
  static func solve(_ ms: Setup, tipX: CGFloat, tipY: CGFloat, theta: CGFloat = 0, speed: CGFloat) -> Contact? {
    let (G, _) = ghost(ms.o, ms.P)
    // Bắt đầu đã bù squirt: phê trong ở cú mỏng và xa, ngắm thẳng ghost có thể trượt hẳn bi mục tiêu.
    var a0 = atan2(G.y - ms.c.y, G.x - ms.c.x) + squirtDeg * .pi / 180 * min(max(tipX / 0.5, -1.1), 1.1)
    guard var r0 = hit(ms, aim: a0, tipX: tipX, tipY: tipY, theta: theta, speed: speed), r0.reached else {
      return hit(ms, aim: a0, tipX: tipX, tipY: tipY, theta: theta, speed: speed)
    }
    var a1 = a0 + 0.0035
    var r1 = hit(ms, aim: a1, tipX: tipX, tipY: tipY, theta: theta, speed: speed)
    for _ in 0..<14 {
      guard let c1 = r1, c1.reached, abs(c1.err) >= 1e-5 else { break }
      let den = c1.err - r0.err
      if abs(den) < 1e-12 { break }
      let a2 = a1 - c1.err * (a1 - a0) / den
      a0 = a1; r0 = c1; a1 = a2
      r1 = hit(ms, aim: a1, tipX: tipX, tipY: tipY, theta: theta, speed: speed)
    }
    // Đường cong (nâng cơ) có thể làm bước secant cuối trượt qua bi; giữ nghiệm gần nhất còn chạm.
    if let c1 = r1, c1.reached { return c1 }
    return r0
  }

  // MARK: cả cú

  /// Tiếp cận, rồi cả bàn lăn cùng nhau: bi cái, bi mục tiêu và bi nào bị đụng. Đích lỗ: bi mục tiêu phải rơi lỗ.
  /// Đích băng: bi mục tiêu phải chạm băng, rồi muốn dội đi đâu thì dội.
  /// `aim` cho sẵn thì đánh đúng hướng đó (chỉ để đối chiếu với web, web không solve); nil là `solve()`.
  static func runWith(_ ms: Setup, tipX: CGFloat, tipY: CGFloat, theta: CGFloat = 0, speed vms: CGFloat, aim: CGFloat? = nil) -> Run {
    let c = ms.c, o = ms.o, P = ms.P
    let h = aim.map { hit(ms, aim: $0, tipX: tipX, tipY: tipY, theta: theta, speed: vms) } ?? solve(ms, tipX: tipX, tipY: tipY, theta: theta, speed: vms)
    guard let h, h.reached else {
      var r = Run()
      r.pre = h?.pre ?? Trace()
      r.stop = h?.pre.stop ?? c; r.short = .cue
      r.ghost = ghost(o, P).g; r.d = ghost(o, P).d; r.a = h?.L ?? unit(o.x - c.x, o.y - c.y); r.squirtDeg = h?.squirtDeg ?? 0
      return r
    }
    var bodies = [Body(n: 0, p: h.P, v: h.cueV, w: h.cueW, wz: h.cueWz), Body(n: ms.ball, p: o, v: h.obV)]
    bodies += ms.others.map { Body(n: $0.n, p: $0.p) }
    let bs = simulate(bodies).bodies
    let cue = bs[0].tr, ob = bs[1].tr
    var r = Run()
    r.pre = h.pre
    r.pts = cue.pts; r.ts = cue.ts; r.ws = cue.ws; r.vs = cue.vs; r.wzs = cue.wzs
    r.stop = cue.stop; r.scratch = cue.pocket; r.hit = cue.hit
    r.ob = ob; r.toRail = ms.toRail
    for b in bs.dropFirst(2) where b.tr.moved { r.moved[b.n] = b.tr }
    let vo = hypot(h.obV.x, h.obV.y)
    r.f = h.ap.f; r.vC = h.ap.v; r.sRoll = h.ap.sRoll; r.vO = vo; r.ghost = h.P; r.d = unit(h.obV.x, h.obV.y); r.a = h.L
    r.squirtDeg = h.squirtDeg; r.throwDeg = h.throwDeg; r.gear = h.gear
    let missed = ms.toRail ? ob.bounces == 0 && ob.pocket == nil && ob.hit == nil : ob.pocket == nil
    if missed {
      r.short = .ob; r.obStop = ob.stop
      r.gap = max(0, hypot(P.x - ob.stop.x, P.y - ob.stop.y) - (ms.toRail ? 0 : catchRadius(ms.pocket)))
    }
    return r
  }

  /// Điểm đặt đầu cơ cho stun đúng lúc chạm. nil nếu draw tối đa vẫn tới nơi đã lăn.
  static func stunTip(_ ms: Setup, speed vms: CGFloat) -> CGFloat? {
    let L = hypot(ms.o.x - ms.c.x, ms.o.y - ms.c.y) - ballDiameter, v0 = vms * inchesPerMeter
    func f(_ t: CGFloat) -> CGFloat { let ap = approach(L: L, tip: t, v0: v0); return ap.v > 0 ? ap.f : .nan }
    var lo = -tipMax, hi: CGFloat = 0
    guard f(lo) < 0 else { return nil }
    for _ in 0..<14 {
      let m = (lo + hi) / 2
      if f(m) < 0 { lo = m } else { hi = m }
    }
    return (lo + hi) / 2
  }

  /// Lý do cú đánh hỏng theo mô phỏng, rỗng nếu ổn.
  static func why(_ r: Run?) -> String {
    guard let r else { return "" }
    switch r.short {
    case .cue: return "cue ball doesn't reach the object ball"
    case .ob:
      if let m = r.ob.hit { return "object ball hits \(name(m))" }
      if r.toRail { return "too soft, doesn't reach the rail" }
      if r.ob.bounces > 0 { return "object ball rattles off the rail, misses" }
      return "too soft, short of the pocket by \(max(1, Int(r.gap.rounded())))\""
    case nil: return r.scratch.map { "cue ball scratches in the \(pocketNames[$0] ?? $0)" } ?? ""
    }
  }
}

/// Chỉ để kiểm: bốn cú mẫu Drill 03, cùng dòng với `node docs/prototypes/soan-bai-v4.check.js`,
/// cộng thời gian 100 lần `runWith`.
enum ShotPhysicsFixture {
  static func logDrill03(_ model: PoolEditorModel) {
    guard let ball = model.aimBall, let pocket = model.aimPocket, let c = model.balls[0], let o = model.balls[ball] else {
      NSLog("[ShotPhysics] d03 missing cue ball or pocket line")
      return
    }
    let others = model.balls.filter { $0.key != 0 && $0.key != ball }.map { ShotPhysics.Obstacle(n: $0.key, p: $0.value) }
    let ms = ShotPhysics.Setup(c: c, o: o, pocket: pocket, others: others)
    NSLog("[ShotPhysics] d03 c (%.2f, %.2f) o (%.2f, %.2f) %@", c.x, c.y, o.x, o.y, pocket)
    for (tx, ty, v) in [(0, 0.4, 1.8), (0, 0, 1.8), (0, -0.15, 3.2), (0.3, 0.4, 1.8)] as [(CGFloat, CGFloat, CGFloat)] {
      let r = ShotPhysics.runWith(ms, tipX: tx, tipY: ty, speed: v)
      NSLog("[ShotPhysics] tip (%.2f, %.2f) v %.1f | squirt %.2f° throw %.2f° f %.4f vC %.2f | cue stop (%.2f, %.2f) %@ | ob gap %.2f\" %@",
            tx, ty, v, r.squirtDeg, r.throwDeg, r.f, r.vC / ShotPhysics.inchesPerMeter,
            r.stop.x, r.stop.y, r.scratch.map { "scratch \($0)" } ?? "-", r.gap, r.short.map { "short \($0)" } ?? "-")
    }
    let t0 = CFAbsoluteTimeGetCurrent()
    for _ in 0..<100 { _ = ShotPhysics.runWith(ms, tipX: 0.3, tipY: 0.4, speed: 1.8) }
    NSLog("[ShotPhysics] runWith avg %.3f ms", (CFAbsoluteTimeGetCurrent() - t0) * 10)
  }
}
