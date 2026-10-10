#!/usr/bin/env node
// Chạy vật lý của soan-bai-v4.dc.html trên một cú bất kỳ, in cùng dòng với ShotPhysicsFixture bên Swift.
//   node docs/prototypes/soan-bai-v4.check.js <cx> <cy> <ox> <oy> <pocket> <tipX> <tipY> <v m/s>
//   node docs/prototypes/soan-bai-v4.check.js d03        # bốn cú mẫu Drill 03
const fs = require('fs');
const path = require('path');

const POCKETS = {
  footLeft: [0, 0], footRight: [50, 0], sideLeft: [0, 50], sideRight: [50, 50], headLeft: [0, 100], headRight: [50, 100],
};

const html = fs.readFileSync(path.join(__dirname, 'soan-bai-v4.dc.html'), 'utf8');
const src = html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
class DCLogic {
  constructor(props) { this.props = props; }
  setState(s) { Object.assign(this.state, s); }
}
// eslint-disable-next-line no-new-func
const Component = new Function('DCLogic', `${src}\nreturn Component;`)(DCLogic);

function run(cx, cy, ox, oy, pocket, tipX, tipY, v) {
  Component.K.CUE = [cx, cy];
  Component.K.OBJ = [ox, oy];
  Component.K.POCKET = POCKETS[pocket];
  const c = new Component({});
  const s = c.shot(tipX, tipY, v);
  if (s.slip) return `tip (${tipX.toFixed(2)}, ${tipY.toFixed(2)}) v ${v.toFixed(1)} | trượt cơ`;
  if (s.short) {
    const p = s.ap ? s.ap.pts[s.ap.pts.length - 1] : [cx, cy];
    return `tip (${tipX.toFixed(2)}, ${tipY.toFixed(2)}) v ${v.toFixed(1)} | cue stop (${p[0].toFixed(2)}, ${p[1].toFixed(2)}) short cue`;
  }
  const h = s.h, stop = s.post.pts[s.post.pts.length - 1];
  const sunk = s.post.sunk ? `scratch ${Object.keys(POCKETS).find((k) => Math.hypot(POCKETS[k][0] - stop[0], POCKETS[k][1] - stop[1]) < 2.45)}` : '-';
  const vC = Math.hypot(h.ap.v[0], h.ap.v[1]);
  return `tip (${tipX.toFixed(2)}, ${tipY.toFixed(2)}) v ${v.toFixed(1)} | squirt ${h.sq.toFixed(2)}° throw ${h.throwDeg.toFixed(2)}° f ${s.fC.toFixed(4)} vC ${vC.toFixed(2)} | cue stop (${stop[0].toFixed(2)}, ${stop[1].toFixed(2)}) ${sunk} | ob gap ${s.gap.toFixed(2)}" ${s.ob.reached ? '-' : 'short ob'}`;
}

const a = process.argv.slice(2);
if (a[0] === 'd03') {
  // Drill 03: bi cái (0.56, 0.66), bi 1 (0.75, 0.375), footRight.
  for (const [tx, ty, v] of [[0, 0.4, 1.8], [0, 0, 1.8], [0, -0.15, 3.2], [0.3, 0.4, 1.8]]) {
    console.log(run(28, 66, 37.5, 37.5, 'footRight', tx, ty, v));
  }
} else if (a.length === 8) {
  console.log(run(+a[0], +a[1], +a[2], +a[3], a[4], +a[5], +a[6], +a[7]));
} else {
  console.error('dùng: cx cy ox oy pocket tipX tipY v, hoặc d03');
  process.exit(2);
}
