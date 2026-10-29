// Sinh assets/lottie/logo.json từ assets/images/icon.png.
// Hình cuối là path trace bằng potrace (giữ nét cọ gốc). Thân puck và vòng enso lộ dần
// qua alpha matte là nét bút dày chạy theo đường vẽ; chấm bi rơi xuống chỗ hở rồi nảy.
//
//   node scripts/logo-lottie/build.js            # ghi assets/lottie/logo.json
//   node scripts/logo-lottie/build.js --debug=<dir>   # ghi thêm <dir>/logo-debug.svg: đường matte đè lên icon.png
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { parsePotraceSvg } = require('./potrace-svg');

const root = path.resolve(process.argv[1], '../../..');
const iconPng = path.join(root, 'assets/images/icon.png');
const outJson = path.join(root, 'assets/lottie/logo.json');

// Khung cắt từ icon 1024×1024, chừa chỗ phía trên cho bi rơi.
const OFFSET = [135, 205];
const W = 760;
const H = 600;
const FPS = 60;
const END = 150;

const GOLD = ['#F0E2BF', '#D9C08E', '#B8955A'];
const DOT_CENTER = [824, 346];

// Đường tâm của nét matte, toạ độ icon 1024. Thứ tự điểm là chiều bút đi.
const ROUTES = {
  rim: [
    [772, 300], [690, 266], [590, 247], [480, 245], [380, 262], [300, 300], [252, 352], [236, 410],
    [258, 468], [318, 518], [405, 557], [505, 582], [605, 586], [705, 566], [790, 526], [845, 480],
    [862, 432], [856, 398],
  ],
  side: [
    [238, 420], [212, 475], [186, 532], [174, 580], [192, 634], [252, 692], [342, 737], [452, 766],
    [562, 776], [662, 760], [742, 720], [792, 660], [822, 582], [846, 502], [862, 440],
  ],
  enso: [
    [706, 334], [640, 310], [560, 301], [470, 309], [402, 336], [366, 380], [374, 430], [422, 470],
    [502, 499], [592, 505], [672, 486], [726, 452], [745, 420], [738, 392],
  ],
};
const MATTE_WIDTH = { rim: 84, side: 84, enso: 96 };

// ---------- trace ----------
function trace() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'logo-lottie-'));
  const bmp = path.join(tmp, 'icon.bmp');
  const svg = path.join(tmp, 'icon.svg');
  execFileSync('sips', ['-s', 'format', 'bmp', iconPng, '--out', bmp], { stdio: 'ignore' });
  execFileSync('potrace', ['-i', '-k', '0.35', '-t', '40', '-O', '0.4', '-b', 'svg', '-o', svg, bmp]);
  const contours = parsePotraceSvg(svg);
  fs.rmSync(tmp, { recursive: true, force: true });
  return contours;
}

function bbox(c) {
  const xs = c.v.map((p) => p[0]);
  const ys = c.v.map((p) => p[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

// Chia contour theo phần tử: chấm bi, vòng enso, còn lại là thân puck.
function classify(contours) {
  const parts = { body: [], enso: [], dot: [] };
  const big = contours.map(bbox).reduce((a, b, k, all) => (area(b) > area(all[a]) ? k : a), 0);
  contours.forEach((c, k) => {
    const [x0, y0, x1, y1] = bbox(c);
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    if (k === big) parts.body.push(c);
    else if (x0 <= DOT_CENTER[0] && DOT_CENTER[0] <= x1 && y0 <= DOT_CENTER[1] && DOT_CENTER[1] <= y1) parts.dot.push(c);
    else if (cx > 340 && cx < 760 && cy > 290 && cy < 530) parts.enso.push(c);
    else parts.body.push(c);
  });
  return parts;
}
const area = ([x0, y0, x1, y1]) => (x1 - x0) * (y1 - y0);

// ---------- Lottie helpers ----------
const shift = ([x, y]) => [round(x - OFFSET[0]), round(y - OFFSET[1])];
const round = (n) => Math.round(n * 100) / 100;
const hex = (h) => [1, 3, 5].map((k) => round(parseInt(h.slice(k, k + 2), 16) / 255));
const fixed = (k) => ({ a: 0, k });

const EASE = {
  inOut: { o: [0.65, 0], i: [0.35, 1] },
  out: { o: [0.2, 0.8], i: [0.3, 1] },
  in: { o: [0.55, 0], i: [0.9, 0.6] },
};

// keys: [[frame, value, ease?], ...]; ease áp cho đoạn từ key đó tới key sau.
function animated(keys) {
  return {
    a: 1,
    k: keys.map(([t, s, ease = 'inOut'], n) => {
      const v = Array.isArray(s) ? s : [s];
      if (n === keys.length - 1) return { t, s: v };
      const e = EASE[ease];
      const dim = v.length;
      return {
        t, s: v,
        o: { x: Array(dim).fill(e.o[0]), y: Array(dim).fill(e.o[1]) },
        i: { x: Array(dim).fill(e.i[0]), y: Array(dim).fill(e.i[1]) },
      };
    }),
  };
}

function contourShape(c) {
  const v = c.v.map(shift);
  return {
    ty: 'sh',
    ks: fixed({
      c: true,
      v,
      i: c.i.map(shift).map((p, n) => [round(p[0] - v[n][0]), round(p[1] - v[n][1])]),
      o: c.o.map(shift).map((p, n) => [round(p[0] - v[n][0]), round(p[1] - v[n][1])]),
    }),
  };
}

// Catmull-Rom qua các điểm → path mở, mượt.
function routeShape(points) {
  const v = points.map(shift);
  const tan = v.map((p, n) => {
    const a = v[Math.max(n - 1, 0)];
    const b = v[Math.min(n + 1, v.length - 1)];
    return [(b[0] - a[0]) / 6, (b[1] - a[1]) / 6];
  });
  return {
    ty: 'sh',
    ks: fixed({
      c: false,
      v,
      i: tan.map(([x, y]) => [round(-x), round(-y)]),
      o: tan.map(([x, y]) => [round(x), round(y)]),
    }),
  };
}

const groupTransform = () => ({
  ty: 'tr', p: fixed([0, 0]), a: fixed([0, 0]), s: fixed([100, 100]), r: fixed(0), o: fixed(100),
});

function goldFill(x0, y0, x1, y1) {
  const stops = GOLD.flatMap((h, n) => [n / (GOLD.length - 1), ...hex(h)]);
  return {
    ty: 'gf', o: fixed(100), r: 2, t: 1,
    s: fixed(shift([x0, y0])), e: fixed(shift([x1, y1])),
    g: { p: GOLD.length, k: fixed(stops) },
  };
}

function layer(ind, nm, shapes, extra = {}) {
  return {
    ddd: 0, ind, ty: 4, nm, sr: 1,
    ks: {
      o: fixed(100), r: fixed(0), p: fixed([0, 0, 0]), a: fixed([0, 0, 0]), s: fixed([100, 100, 100]),
      ...extra.ks,
    },
    ao: 0, shapes, ip: 0, op: END, st: 0, bm: 0,
    ...extra.props,
  };
}

function fillLayer(ind, nm, contours, props) {
  return layer(ind, nm, [{
    ty: 'gr', nm,
    it: [...contours.map(contourShape), goldFill(240, 240, 860, 780), groupTransform()],
  }], { props });
}

// Mỗi route một group: stroke trắng dày + trim từ 0 tới 100 trong [from, to].
function matteLayer(ind, nm, routes) {
  return layer(ind, nm, routes.map(({ key, from, to, ease }) => ({
    ty: 'gr', nm: key,
    it: [
      routeShape(ROUTES[key]),
      { ty: 'st', c: fixed([1, 1, 1, 1]), o: fixed(100), w: fixed(MATTE_WIDTH[key]), lc: 2, lj: 2 },
      { ty: 'tm', s: fixed(0), e: animated([[from, 0, ease], [to, 100]]), o: fixed(0), m: 1 },
      groupTransform(),
    ],
  })), { props: { td: 1 } });
}

// Chấm bi vẽ bằng ellipse thay cho contour trace (trace chỉ có 5 đỉnh, ra hình méo).
function dotLayer(ind, contours) {
  const [x0, y0, x1, y1] = bbox(contours[0]);
  const c = shift([(x0 + x1) / 2, (y0 + y1) / 2]);
  const DROP = 120;
  return layer(ind, 'dot', [{
    ty: 'gr', nm: 'dot',
    it: [
      { ty: 'el', p: fixed(c), s: fixed([round(x1 - x0), round(y1 - y0)]), d: 1 },
      goldFill(790, 320, 860, 370),
      groupTransform(),
    ],
  }], {
    ks: {
      a: fixed([...c, 0]),
      p: animated([
        [92, [c[0], c[1] - DROP, 0], 'in'],
        [108, [c[0], c[1], 0], 'out'],
        [116, [c[0], c[1] - 16, 0], 'in'],
        [123, [c[0], c[1], 0], 'out'],
        [127, [c[0], c[1] - 4, 0], 'in'],
        [130, [c[0], c[1], 0]],
      ]),
      s: animated([
        [92, [80, 80, 100]],
        [106, [92, 108, 100], 'out'],
        [109, [118, 84, 100], 'out'],
        [116, [96, 104, 100], 'out'],
        [123, [106, 94, 100], 'out'],
        [130, [100, 100, 100]],
      ]),
      o: animated([[92, 0, 'out'], [100, 100]]),
    },
  });
}

function build() {
  const parts = classify(trace());
  const layers = [
    dotLayer(1, parts.dot),
    matteLayer(2, 'enso matte', [{ key: 'enso', from: 40, to: 98, ease: 'out' }]),
    fillLayer(3, 'enso', parts.enso, { tt: 1 }),
    matteLayer(4, 'body matte', [
      { key: 'rim', from: 0, to: 52 },
      { key: 'side', from: 16, to: 64 },
    ]),
    fillLayer(5, 'body', parts.body, { tt: 1 }),
  ];
  const json = { v: '5.7.4', fr: FPS, ip: 0, op: END, w: W, h: H, nm: 'logo', ddd: 0, assets: [], layers };
  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  fs.writeFileSync(outJson, JSON.stringify(json));
  console.log(`${path.relative(root, outJson)}  ${(fs.statSync(outJson).size / 1024).toFixed(1)} KB`,
    `body ${parts.body.length} · enso ${parts.enso.length} · dot ${parts.dot.length} contour`);

  const debugDir = process.argv.find((a) => a.startsWith('--debug='))?.slice('--debug='.length);
  if (debugDir) {
    const pts = (r) => r.map((p) => p.join(',')).join(' ');
    const lines = Object.entries(ROUTES).map(([k, r]) =>
      `<polyline points="${pts(r)}" fill="none" stroke="red" stroke-opacity=".35" stroke-width="${MATTE_WIDTH[k]}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<polyline points="${pts(r)}" fill="none" stroke="cyan" stroke-width="2"/>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><image href="icon.png" width="1024" height="1024"/>${lines}</svg>`;
    fs.writeFileSync(path.join(debugDir, 'logo-debug.svg'), svg);
  }
}

build();
