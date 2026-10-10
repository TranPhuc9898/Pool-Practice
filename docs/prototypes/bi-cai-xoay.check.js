#!/usr/bin/env node
// Đối chiếu engine của trang docs/research/bi-cai-xoay.html (artifact "Bi cái xoay") với ShotPhysics.swift trên cùng một cú.
// Toạ độ theo app: inch, x 0..50, y 0..100, băng foot ở y = 0. Trang web dùng mét và y = 0 ở đầu bàn, script tự đổi.
//
//   node docs/prototypes/bi-cai-xoay.check.js                      # thế bi mặc định của trang, kéo −0,5R, quét lực
//   node docs/prototypes/bi-cai-xoay.check.js <cx> <cy> <ox> <oy> <pocket> <tipX> <tipY> <v m/s> [n:x,y ...]
//   node docs/prototypes/bi-cai-xoay.check.js --no-swift ...       # chỉ chạy web
//   node docs/prototypes/bi-cai-xoay.check.js --theta 60 ...        # nâng cơ (độ), massé: bi cái cong trước khi chạm
//   node docs/prototypes/bi-cai-xoay.check.js --aim-ghost ...       # Swift cũng ngắm thẳng tâm ghost như web, không solve
//                                                                  # (bù throw + squirt), để so cú có phê hay nâng cơ
//
//   <pocket> cũng nhận đích băng kiểu railLeft@37.5 (băng và inch dọc băng, như ShotPhysics.railId).
//
// Mỗi dòng in: ρ bi cái lúc chạm, hướng bi mục tiêu rời chỗ, chỗ bi cái dừng, chỗ bi mục tiêu dừng (hay vào lỗ), và bi
// khác bị đụng dừng ở đâu. Cả bàn chạy chung một mô phỏng ở cả hai bên (collide + rails của trang).
// Khác biệt đã biết, cố ý giữ: Swift có throw (tới 1,4°) và bù squirt, web không; dt 1/240 so với 1/2000. Cú kéo dài đi
// hơn 2 m thì hai bên lệch nhau tới 7". Web bắt va chạm sau khi hai bi đã lún vào nhau một bước 1/2000 s, nên hướng bi
// mục tiêu rời chỗ ở web lệch tới 0,8° khi cắt dày và đánh trên 3 m/s. Ngưỡng báo LỆCH đặt 10" và 1°: vượt là có người
// sửa một engine mà quên engine kia.
// Đừng so cú có phê (tipX ≠ 0) ở chế độ bàn xếp: web không bù squirt lúc ngắm nên bi mục tiêu đi lệch hẳn, Swift thì bù.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const IN = 39.37;
const POCKET_IDX = { headLeft: 0, headRight: 1, footLeft: 2, footRight: 3, sideLeft: 4, sideRight: 5 };

const html = fs.readFileSync(path.join(__dirname, '..', 'research', 'bi-cai-xoay.html'), 'utf8');
const src = html.match(/<script id="physics">([\s\S]*?)<\/script>/)[1];
const mod = { exports: {} };
// eslint-disable-next-line no-new-func
new Function('module', src + '\nmodule.exports.POCKETS = POCKETS;')(mod);
const { P, simulate, HZ, POCKETS } = mod.exports;

const toWeb = ([x, y]) => [x / IN, (100 - y) / IN];
const toApp = (x, y) => [x * IN, (P.L - y) * IN];

// Đích băng: điểm tâm bi lúc chạm băng, cách mũi băng một bán kính, như ShotPhysics.target.
function railTarget(id) {
  const [side, s] = id.split('@'), v = Number(s), R = P.R * IN, W = 50, L = 100;
  const t = { railLeft: [0, v], railRight: [W, v], railFoot: [v, 0], railHead: [v, L] }[side];
  if (!t) return null;
  return [Math.min(Math.max(t[0], R), W - R), Math.min(Math.max(t[1], R), L - R)];
}

function runWeb(shot) {
  // Đích băng: nhét thêm một "lỗ" bán kính 0 để layoutAim ngắm vào đó, rails() không bao giờ bắt.
  const rail = railTarget(shot.pocket);
  POCKETS.length = 6;
  if (rail) POCKETS.push([...toWeb(rail), 0]);
  const lay = {
    cue: toWeb(shot.c), target: 0, pocket: rail ? 6 : POCKET_IDX[shot.pocket],
    balls: [{ n: shot.n, p: toWeb(shot.o) }, ...shot.others.map((b) => ({ n: b.n, p: toWeb(b.p) }))],
  };
  const s = simulate({ a: shot.tipX, b: shot.tipY, theta: shot.theta || 0, V0: 1, aim: 0, obj: 'layout', D: 0.9, force: shot.v, layout: lay });
  const cue = s.balls[0], ob = s.balls[1], n = cue.buf.length / 12;
  let k = 1;
  for (; k < n; k++) if (Math.hypot(ob.buf[k * 12 + 6], ob.buf[k * 12 + 7]) > 1e-6) break;
  const b = cue.buf, a = (k - 1) * 12, z = k * 12;
  const sp2 = b[a + 6] ** 2 + b[a + 7] ** 2;
  const rho = k < n ? P.R * (b[a + 9] * b[a + 6] - b[a + 8] * b[a + 7]) / sp2 : NaN;
  const obDir = k < n ? Math.atan2(-ob.buf[z + 7], ob.buf[z + 6]) * 180 / Math.PI : NaN;
  const last = (n - 1) * 12, stop = toApp(b[last], b[last + 1]);
  const obStop = toApp(ob.buf[last], ob.buf[last + 1]);
  const others = s.balls.slice(2).map((B) => ({ n: B.n, stop: toApp(B.buf[last], B.buf[last + 1]), sunk: !B.alive }));
  return { rho, obDir, stop, scratch: !cue.alive, sunk: !ob.alive, reached: k < n, obStop, others };
}

function runSwift(shots, aimGhost) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bi-cai-xoay-'));
  const physics = fs.readFileSync(path.join(__dirname, '..', '..', 'modules', 'pool-table', 'ios', 'Editor', 'ShotPhysics.swift'), 'utf8')
    .split('\n/// Chỉ để kiểm')[0];
  fs.writeFileSync(path.join(dir, 'ShotPhysics.swift'), physics);
  const lines = shots.map((s) => {
    const others = s.others.map((b) => `ShotPhysics.Obstacle(n: ${b.n}, p: CGPoint(x: ${b.p[0]}, y: ${b.p[1]}))`).join(', ');
    return `run(c: CGPoint(x: ${s.c[0]}, y: ${s.c[1]}), o: CGPoint(x: ${s.o[0]}, y: ${s.o[1]}), pocket: "${s.pocket}", others: [${others}], tipX: ${s.tipX}, tipY: ${s.tipY}, theta: ${s.theta || 0}, v: ${s.v})`;
  });
  fs.writeFileSync(path.join(dir, 'main.swift'), `import Foundation
import CoreGraphics
func run(c: CGPoint, o: CGPoint, pocket: String, others: [ShotPhysics.Obstacle], tipX: CGFloat, tipY: CGFloat, theta: CGFloat, v: CGFloat) {
  let ms = ShotPhysics.Setup(c: c, o: o, pocket: pocket, others: others)
  let g = ShotPhysics.ghost(o, ms.P).g
  let aim: CGFloat? = ${aimGhost ? 'atan2(g.y - c.y, g.x - c.x)' : 'nil'}
  let r = ShotPhysics.runWith(ms, tipX: tipX, tipY: tipY, theta: theta, speed: v, aim: aim)
  let reached = r.short != .cue
  var line = String(format: "%d %.4f %.3f %.3f %.3f %d %d %.3f %.3f", reached ? 1 : 0, r.f, atan2(r.d.y, r.d.x) * 180 / .pi, r.stop.x, r.stop.y, r.scratch == nil ? 0 : 1, r.ob.pocket == nil ? 0 : 1, r.ob.stop.x, r.ob.stop.y)
  for b in others {
    let t = r.moved[b.n]
    line += String(format: " %d:%.3f,%.3f,%d", b.n, t?.stop.x ?? b.p.x, t?.stop.y ?? b.p.y, t?.pocket == nil ? 0 : 1)
  }
  print(line)
}
${lines.join('\n')}
`);
  execFileSync('swiftc', ['-O', '-o', path.join(dir, 'run'), path.join(dir, 'main.swift'), path.join(dir, 'ShotPhysics.swift')], { stdio: ['ignore', 'ignore', 'inherit'] });
  return execFileSync(path.join(dir, 'run'), { encoding: 'utf8' }).trim().split('\n').map((l) => {
    const [head, ...rest] = [l.split(' ').slice(0, 9), ...l.split(' ').slice(9)];
    const [reached, rho, obDir, sx, sy, scratch, sunk, ox, oy] = head.map(Number);
    const others = rest.map((w) => { const [n, xyz] = w.split(':'); const [x, y, k] = xyz.split(',').map(Number); return { n: Number(n), stop: [x, y], sunk: !!k }; });
    return { reached: !!reached, rho, obDir, stop: [sx, sy], scratch: !!scratch, sunk: !!sunk, obStop: [ox, oy], others };
  });
}

const f = (x, d) => (Number.isFinite(x) ? x.toFixed(d) : '—');
const at = (p) => `(${f(p[0], 1)}, ${f(p[1], 1)})`;
function line(tag, r) {
  if (!r.reached) return `${tag} bi cái không tới · trắng dừng ${at(r.stop)}`;
  const moved = r.others.filter((b) => b.sunk || Math.hypot(b.stop[0] - b.start[0], b.stop[1] - b.start[1]) > 0.05);
  const tail = moved.map((b) => ` · bi ${b.n} ${b.sunk ? 'vào lỗ' : 'dừng ' + at(b.stop)}`).join('');
  return `${tag} ρ ${f(r.rho, 2)} · bi đi ${f(r.obDir, 2)}° · trắng dừng ${at(r.stop)}${r.scratch ? ' scratch' : ''} · bi ${r.sunk ? 'vào lỗ ' : 'dừng '}${at(r.obStop)}${tail}`;
}

const argv = process.argv.slice(2);
const noSwift = argv.includes('--no-swift');
const aimGhost = argv.includes('--aim-ghost');
const thetaAt = argv.indexOf('--theta');
const theta = thetaAt >= 0 ? Number(argv[thetaAt + 1]) : 0;
const args = argv.filter((a, i) => a !== '--no-swift' && a !== '--aim-ghost' && i !== thetaAt && i !== thetaAt + 1);
let shots;
if (args.length >= 8) {
  const [cx, cy, ox, oy, pocket, tipX, tipY, v] = args;
  const others = args.slice(8).map((s) => { const [n, xy] = s.split(':'); const [x, y] = xy.split(',').map(Number); return { n: Number(n), p: [x, y] }; });
  shots = [{ c: [+cx, +cy], o: [+ox, +oy], n: 1, pocket, tipX: +tipX, tipY: +tipY, theta, v: +v, others }];
} else {
  // Layout mặc định của trang, đổi sang inch app.
  const base = { c: [25, (2.54 - 0.55) * IN], o: [0.95 * IN, (2.54 - 1.75) * IN], n: 1, pocket: 'footRight', tipX: 0, tipY: -0.5,
    others: [{ n: 2, p: [0.35 * IN, (2.54 - 1.35) * IN] }, { n: 3, p: [0.75 * IN, (2.54 - 2.2) * IN] }] };
  shots = [1.6, 2, 2.5, 3, 3.5, 4].map((v) => ({ ...base, theta, v }));
  // Cùng thế bàn, bi 1 đi vào băng trên ở x = 12 thay vì vào lỗ, đường không chạm bi 3: kiểm bi mục tiêu dội băng và bi cái sau đó.
  shots.push({ ...base, pocket: 'railFoot@12.0', v: 2.5 }, { ...base, pocket: 'railFoot@12.0', tipY: 0.3, v: 3.2 });
  // Đích băng ngay sau bi 3: bi 1 đụng bi 3 trên đường đi, kiểm va chạm bi–bi.
  shots.push({ ...base, pocket: 'railFoot@24.0', v: 2 });
}

const web = shots.map(runWeb);
const sw = noSwift ? null : runSwift(shots, aimGhost);
shots.forEach((s, i) => { for (const r of [web[i], sw && sw[i]]) if (r) r.others.forEach((b) => { b.start = s.others.find((o) => o.n === b.n).p; }); });
let bad = 0;
shots.forEach((s, i) => {
  console.log(`tip (${s.tipX}, ${s.tipY})${s.theta ? ` θ ${s.theta}°` : ''} ${s.v} m/s ${s.pocket}${aimGhost ? ' · ngắm ghost' : ''}`);
  console.log(line('  web   ', web[i]));
  if (!sw) return;
  console.log(line('  swift ', sw[i]));
  const w = web[i], m = sw[i];
  if (w.reached && m.reached) {
    const dStop = Math.hypot(w.stop[0] - m.stop[0], w.stop[1] - m.stop[1]);
    const dOb = w.sunk && m.sunk ? 0 : Math.hypot(w.obStop[0] - m.obStop[0], w.obStop[1] - m.obStop[1]);
    const dOthers = Math.max(0, ...w.others.map((b, j) => (b.sunk && m.others[j].sunk ? 0 : Math.hypot(b.stop[0] - m.others[j].stop[0], b.stop[1] - m.others[j].stop[1]))));
    const dDir = Math.abs(w.obDir - m.obDir);
    if (dStop > 10 || dOb > 10 || dOthers > 10 || dDir > 1 || w.sunk !== m.sunk) {
      bad++; console.log(`  LỆCH: trắng ${dStop.toFixed(1)}" · bi ${dOb.toFixed(1)}" · bi khác ${dOthers.toFixed(1)}" · hướng ${dDir.toFixed(2)}°`);
    }
  } else if (w.reached !== m.reached) { bad++; console.log('  LỆCH: một bên không tới'); }
  else {
    const dStop = Math.hypot(w.stop[0] - m.stop[0], w.stop[1] - m.stop[1]);
    if (dStop > 10) { bad++; console.log(`  LỆCH: trắng ${dStop.toFixed(1)}"`); }
  }
});
if (sw) console.log(bad ? `\n${bad} cú lệch` : '\nKhớp.');
process.exit(bad ? 1 : 0);
