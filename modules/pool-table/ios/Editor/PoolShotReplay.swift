import SwiftUI

/// Một lần chạy thử cú chính theo đúng thời gian vật lý: bi cái tới ghost, rồi bi cái và bi mục tiêu tách ra.
/// Cùng mô phỏng với guide, nên bi đi đúng đường đang vẽ.
struct ShotReplay {
  /// Vị trí theo thời gian. `sink` là bi rơi xuống lỗ ở cuối đường.
  struct Track {
    var ts: [CGFloat]
    var pts: [CGPoint]
    var sink = false
    var end: CGFloat { ts.last ?? 0 }

    func at(_ t: CGFloat) -> CGPoint {
      guard let first = ts.first, t > first else { return pts[0] }
      guard t < end else { return pts[pts.count - 1] }
      var lo = 0, hi = ts.count - 1
      while hi - lo > 1 {
        let m = (lo + hi) / 2
        if ts[m] <= t { lo = m } else { hi = m }
      }
      let k = (t - ts[lo]) / max(ts[hi] - ts[lo], 1e-6)
      return CGPoint(x: pts[lo].x + (pts[hi].x - pts[lo].x) * k, y: pts[lo].y + (pts[hi].y - pts[lo].y) * k)
    }
  }

  let id = UUID()
  let ball: Int
  let cue: Track
  let ob: Track
  /// Giây tới lúc chạm, nil nếu bi cái không tới.
  let contact: CGFloat?
  /// Giảm động: hiện thẳng vị trí cuối, không chạy.
  let jump: Bool
  let start = Date()
  var end: CGFloat { max(cue.end, ob.end) }

  init(_ ms: ShotPhysics.Setup, ball: Int, tip: CGFloat, speed: CGFloat, jump: Bool) {
    self.ball = ball
    self.jump = jump
    let r = ShotPhysics.runWith(ms, tip: tip, speed: speed)
    let c = ms.c, a = r.a
    var cue = Track(ts: [0], pts: [c])
    let ap = ShotPhysics.approach(L: hypot(r.ghost.x - c.x, r.ghost.y - c.y), tip: tip,
                                  v0: speed * ShotPhysics.inchesPerMeter) { t, s in
      cue.ts.append(t)
      cue.pts.append(CGPoint(x: c.x + a.x * s, y: c.y + a.y * s))
    }
    guard r.short != .cue else {
      self.cue = cue
      self.ob = Track(ts: [0], pts: [ms.o])
      contact = nil
      return
    }
    let t0 = ap.t
    for (t, p) in zip(r.ts, r.pts) {
      cue.ts.append(t0 + t)
      cue.pts.append(p)
    }
    cue.sink = r.scratch != nil
    self.cue = cue
    contact = t0

    // Bi mục tiêu nhận v·cosφ, trượt tới 5/7 rồi lăn. Cùng công thức `reach` của runWith.
    let mS = ShotPhysics.muSlide, mR = ShotPhysics.muRoll
    let cosc: CGFloat = a.x * r.d.x + a.y * r.d.y
    let vo: CGFloat = r.vC * cosc, v1: CGFloat = 5 / 7 * vo
    let t1 = (vo - v1) / mS, s1 = (vo * vo - v1 * v1) / (2 * mS), tStop = t1 + v1 / mR
    let dP = hypot(ms.P.x - ms.o.x, ms.P.y - ms.o.y) - ShotPhysics.ballRadius
    let sinks = r.short != .ob
    func s(_ t: CGFloat) -> CGFloat {
      if t < t1 { return vo * t - mS * t * t / 2 }
      let u = min(t, tStop) - t1
      return s1 + v1 * u - mR * u * u / 2
    }
    var ob = Track(ts: [t0], pts: [ms.o], sink: sinks)
    var t: CGFloat = 0
    while t < tStop {
      t += 1 / 120
      let d = s(t)
      if sinks && d >= dP { break }
      ob.ts.append(t0 + t)
      ob.pts.append(CGPoint(x: ms.o.x + r.d.x * d, y: ms.o.y + r.d.y * d))
    }
    if sinks {
      ob.ts.append(t0 + t)
      ob.pts.append(CGPoint(x: ms.o.x + r.d.x * dP, y: ms.o.y + r.d.y * dP))
    }
    self.ob = ob
  }
}

extension PoolEditorModel {
  /// Bấm Đánh: chạy cú, bấm lần nữa là dừng. Một haptic, đúng lúc bi cái chạm bi mục tiêu.
  func toggleReplay(reduceMotion: Bool) {
    if replay != nil { replay = nil; return }
    guard let ball = aimBall, let pocket = aimPocket, let ms = shotSetup,
          ShotPhysics.shotOf(ball: ball, pocket: pocket, balls: balls)?.level != .bad
    else { return }
    let r = ShotReplay(ms, ball: ball, tip: tip, speed: speed, jump: reduceMotion)
    replay = r
    if let c = r.contact, !r.jump {
      DispatchQueue.main.asyncAfter(deadline: .now() + c) { [weak self] in
        guard self?.replay?.id == r.id else { return }
        EditorHaptics.fire(.light, "Bi cái chạm \(ShotPhysics.name(ball))")
      }
    }
    // Giữ vị trí cuối một nhịp cho mắt đọc, rồi bàn về như cũ.
    let hold = r.jump ? 1.2 : r.end + 0.6
    DispatchQueue.main.asyncAfter(deadline: .now() + hold) { [weak self] in
      guard let self, self.replay?.id == r.id else { return }
      withAnimation(.easeOut(duration: 0.2)) { self.replay = nil }
    }
  }
}

/// Hai bi chạy thử, vẽ thay bi cái và bi mục tiêu thật trong lúc chạy.
struct PoolShotReplayLayer: View {
  let replay: ShotReplay
  let geometry: PoolTableGeometry

  var body: some View {
    TimelineView(.animation(paused: replay.jump)) { tl in
      let t = replay.jump ? replay.end : CGFloat(tl.date.timeIntervalSince(replay.start))
      ZStack(alignment: .topLeading) {
        ball(0, replay.cue, t)
        ball(replay.ball, replay.ob, t)
      }
    }
    .allowsHitTesting(false)
  }

  private func ball(_ n: Int, _ track: ShotReplay.Track, _ t: CGFloat) -> some View {
    let p = track.at(t)
    // Rơi xuống lỗ: mờ và nhỏ lại 15% trong 150ms, không bao giờ về 0.
    let k = track.sink ? min(max((t - track.end) / 0.15, 0), 1) : 0
    return PoolBallView(number: n, diameter: geometry.ballDiameter).equatable()
      .scaleEffect(1 - 0.15 * k)
      .opacity(1 - k)
      .position(geometry.point(inchesX: p.x, inchesY: p.y))
  }
}
