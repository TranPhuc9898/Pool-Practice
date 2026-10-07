import SwiftUI

/// Guide của cú chính, port từ render() của prototype v7. Vẽ trong một Canvas, không nhận chạm.
/// Đang chọn lỗ thì tắt hết. Mọi kích thước tính bằng inch rồi nhân `geometry.scale`.
struct PoolEditorGuides: View {
  @ObservedObject var model: PoolEditorModel
  let geometry: PoolTableGeometry

  static let red = Color(red: 1, green: 0x45 / 255, blue: 0x3A / 255)
  static let orange = Color(red: 1, green: 0x9F / 255, blue: 0x0A / 255)
  /// draw, stun, follow. Dịu, không trùng đỏ cam của cảnh báo và gold của nút.
  static let spin: [Color] = [
    Color(red: 0xC3 / 255, green: 0xA6 / 255, blue: 1),
    .white,
    Color(red: 0x8E / 255, green: 0xE0 / 255, blue: 0xB0 / 255),
  ]
  static let stub: CGFloat = 9

  static func spinIndex(_ f: CGFloat) -> Int { f < -0.05 ? 0 : f < 0.12 ? 1 : 2 }

  var body: some View {
    Canvas { ctx, _ in draw(&ctx) }
      .allowsHitTesting(false)
  }

  private func draw(_ ctx: inout GraphicsContext) {
    guard model.picking == nil, model.replay == nil, let ball = model.aimBall, let pocket = model.aimPocket,
          let o = model.balls[ball], let P = ShotPhysics.pockets[pocket],
          let verdict = ShotPhysics.shotOf(ball: ball, pocket: pocket, balls: model.balls)
    else { return }
    let k = geometry.scale
    let pt = { (p: CGPoint) in geometry.point(inchesX: p.x, inchesY: p.y) }
    let BR = ShotPhysics.ballRadius
    let felt = Path(geometry.playRect)
    let ms = verdict.level == .bad ? nil : model.shotSetup
    let run = ms.map { ShotPhysics.runWith($0, tip: model.tip, speed: model.speed) }

    func line(_ pts: [CGPoint], _ color: Color, _ width: CGFloat, dash: [CGFloat] = [], clip: Bool = false) {
      var path = Path()
      path.addLines(pts.map(pt))
      var c = ctx
      if clip { c.clip(to: felt) }
      c.stroke(path, with: .color(color),
               style: StrokeStyle(lineWidth: width * k, lineCap: .round, lineJoin: .round, dash: dash.map { $0 * k }))
    }
    func circle(_ p: CGPoint, _ r: CGFloat) -> Path {
      let c = pt(p)
      return Path(ellipseIn: CGRect(x: c.x - r * k, y: c.y - r * k, width: 2 * r * k, height: 2 * r * k))
    }

    // Đường bi cái: cú đang chọn đi hết đường, màu theo spin lúc chạm. Hai nhánh 9" cho draw và follow tối đa
    // cùng lực, chỉ vẽ nhánh khác loại với cú đang chọn.
    if model.showPaths, let ms, let run {
      if run.short != .cue {
        let kind = Self.spinIndex(run.f)
        for t in [-ShotPhysics.miscueSafe, ShotPhysics.miscueSafe] {
          let r = ShotPhysics.runWith(ms, tip: t, speed: model.speed)
          let rk = Self.spinIndex(r.f)
          guard r.short != .cue, rk != kind, let first = r.pts.first else { continue }
          var stub = [first], acc: CGFloat = 0
          for i in 1..<r.pts.count where acc < Self.stub {
            acc += hypot(r.pts[i].x - r.pts[i - 1].x, r.pts[i].y - r.pts[i - 1].y)
            stub.append(r.pts[i])
          }
          line(stub, Self.spin[rk].opacity(0.75), 0.16)
          ctx.fill(circle(stub.last!, 0.38), with: .color(Self.spin[rk].opacity(0.9)))
        }
        let col = run.scratch != nil ? Self.red : run.hit != nil ? Self.orange : Self.spin[kind]
        line(run.pts, col.opacity(0.9), 0.18, dash: [1.1, 0.7])
        if run.scratch == nil {
          let stop = circle(run.stop, BR)
          ctx.fill(stop, with: .color(col.opacity(0.1)))
          ctx.stroke(stop, with: .color(col.opacity(0.8)), lineWidth: 0.13 * k)
        }
      } else {
        ctx.stroke(circle(run.stop, BR), with: .color(Self.red),
                   style: StrokeStyle(lineWidth: 0.16 * k, dash: [0.45 * k, 0.32 * k]))
      }
    }

    let d = ShotPhysics.unit(P.x - o.x, P.y - o.y)
    let G = CGPoint(x: o.x - d.x * ShotPhysics.ballDiameter, y: o.y - d.y * ShotPhysics.ballDiameter)
    let col: Color = verdict.level == .bad ? Self.red : verdict.level == .warn ? Self.orange : .white

    // Hình quạt góc cắt tới 75° quanh ghost, chỉ khi đang kéo bi cái hoặc bi mục tiêu.
    if model.dragging == 0 || model.dragging == ball {
      let phi = atan2(-d.y, -d.x), R: CGFloat = 160, A = ShotPhysics.cutWarn * .pi / 180
      var wedge = Path()
      wedge.move(to: pt(G))
      for i in -8...8 {
        let t = phi + A * CGFloat(i) / 8
        wedge.addLine(to: pt(CGPoint(x: G.x + R * cos(t), y: G.y + R * sin(t))))
      }
      wedge.closeSubpath()
      var c = ctx
      c.clip(to: felt)
      c.fill(wedge, with: .color(.white.opacity(0.06)))
      for t in [phi - A, phi + A] {
        line([G, CGPoint(x: G.x + R * cos(t), y: G.y + R * sin(t))], .white.opacity(0.3), 0.12, dash: [0.6, 0.5], clip: true)
      }
    }

    // Đường bi mục tiêu. Thiếu lực thì đỏ tới chỗ bi dừng, mờ phần còn lại tới lỗ.
    if !model.showPaths {
      // Không vẽ đường bi mục tiêu.
    } else if let run, run.short == .ob, let q = run.obStop {
      line([o, q], Self.red, 0.22)
      line([q, P], Self.red.opacity(0.35), 0.14, dash: [0.5, 0.5])
      ctx.stroke(circle(q, BR), with: .color(Self.red), style: StrokeStyle(lineWidth: 0.14 * k, dash: [0.45 * k, 0.32 * k]))
    } else {
      line([o, P], col, 0.24, dash: [0.8, 0.55])
    }

    // Tangent qua ghost: hướng bi cái đi nếu chạm bằng stun. Mốc để so, không phải đường thật.
    if model.showPaths, let run, run.short != .cue, let cut = verdict.cut, cut > 1 {
      let t = CGPoint(x: -d.y, y: d.x)
      let sg: CGFloat = (t.x * run.a.x + t.y * run.a.y) < 0 ? -1 : 1
      line([G, CGPoint(x: G.x + t.x * sg * 12, y: G.y + t.y * sg * 12)], PoolAimPalette.gold.opacity(0.55), 0.12,
           dash: [0.6, 0.6], clip: true)
    }

    let ghost = circle(G, BR)
    ctx.fill(ghost, with: .color(col.opacity(0.07)))
    // Tắt đường đi thì ghost là thứ chính trên bàn, nét đậm hơn.
    ctx.stroke(ghost, with: .color(col.opacity(model.showPaths ? 0.85 : 1)),
               style: StrokeStyle(lineWidth: (model.showPaths ? 0.13 : 0.2) * k, dash: [0.45 * k, 0.32 * k]))
    if let c = model.balls[0] {
      line([c, G], col.opacity(verdict.level == .ok ? 0.24 : 0.6), 0.12)
    }
  }
}

/// Điểm chạm có quầng, vẽ trên bi mục tiêu nên nằm trên lớp bi.
struct PoolEditorContactPoint: View {
  @ObservedObject var model: PoolEditorModel
  let geometry: PoolTableGeometry

  var body: some View {
    Canvas { ctx, _ in
      guard model.picking == nil, model.replay == nil, let ball = model.aimBall, let pocket = model.aimPocket,
            let o = model.balls[ball], let P = ShotPhysics.pockets[pocket],
            ShotPhysics.shotOf(ball: ball, pocket: pocket, balls: model.balls)?.level != .bad
      else { return }
      let k = geometry.scale
      let d = ShotPhysics.unit(P.x - o.x, P.y - o.y)
      let c = geometry.point(inchesX: o.x - d.x * ShotPhysics.ballRadius, inchesY: o.y - d.y * ShotPhysics.ballRadius)
      let halo = Path(ellipseIn: CGRect(x: c.x - 1.1 * k, y: c.y - 1.1 * k, width: 2.2 * k, height: 2.2 * k))
      ctx.fill(halo, with: .radialGradient(Gradient(colors: [PoolAimPalette.gold.opacity(0.55), .clear]),
                                           center: c, startRadius: 0, endRadius: 1.1 * k))
      let dot = Path(ellipseIn: CGRect(x: c.x - 0.36 * k, y: c.y - 0.36 * k, width: 0.72 * k, height: 0.72 * k))
      ctx.fill(dot, with: .color(PoolAimPalette.gold))
      ctx.stroke(dot, with: .color(.black.opacity(0.6)), lineWidth: 0.06 * k)
    }
    .allowsHitTesting(false)
  }
}
