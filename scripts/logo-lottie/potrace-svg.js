// Đọc SVG của potrace (lệnh m/l/c tương đối, transform translate(0,H) scale(0.1,-0.1))
// thành các contour khép kín, mỗi contour là danh sách đỉnh kiểu Lottie: { v, i, o } toạ độ tuyệt đối.
const fs = require('fs');

function parsePotraceSvg(file) {
  const svg = fs.readFileSync(file, 'utf8');
  const height = Number(svg.match(/viewBox="0 0 [\d.]+ ([\d.]+)"/)[1]);
  const map = ([x, y]) => [x * 0.1, height - y * 0.1];
  const contours = [];
  for (const [, d] of svg.matchAll(/<path d="([^"]+)"/g)) {
    const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+/g);
    let k = 0, cmd = null, cur = [0, 0], start = [0, 0], pts = null;
    const num = () => Number(tokens[k++]);
    const close = () => { if (pts && pts.length) contours.push(toLottie(pts)); pts = null; };
    while (k < tokens.length) {
      if (/[a-zA-Z]/.test(tokens[k])) cmd = tokens[k++];
      const rel = cmd === cmd.toLowerCase();
      const abs = (x, y) => (rel ? [cur[0] + x, cur[1] + y] : [x, y]);
      switch (cmd.toLowerCase()) {
        case 'm': {
          close();
          cur = abs(num(), num()); start = cur;
          pts = [{ p: cur, c1: null }];
          cmd = rel ? 'l' : 'L';
          break;
        }
        case 'l': {
          const p = abs(num(), num());
          pts.push({ p, c1: cur, c2: p, line: true });
          cur = p;
          break;
        }
        case 'c': {
          const c1 = abs(num(), num()), c2 = abs(num(), num()), p = abs(num(), num());
          pts.push({ p, c1, c2 });
          cur = p;
          break;
        }
        case 'z': { cur = start; close(); break; }
        default: throw new Error('lệnh SVG chưa hỗ trợ: ' + cmd);
      }
    }
    close();
  }
  return contours.map((c) => ({ ...c, v: c.v.map(map), i: c.iAbs.map(map), o: c.oAbs.map(map) }));
}

// Segment j đi từ pts[j-1].p tới pts[j].p; đoạn cuối quay về pts[0] nếu trùng điểm thì gộp.
function toLottie(pts) {
  const segs = pts.slice(1);
  const last = segs[segs.length - 1];
  const first = pts[0].p;
  if (last && Math.hypot(last.p[0] - first[0], last.p[1] - first[1]) < 1e-6) segs.pop();
  else segs.push({ p: first, c1: last.p, c2: first, line: true });
  // Đỉnh: v[0] = first, v[j] = segs[j-1].p (j < n). Segment j (0-based) nối v[j] -> v[j+1 mod n].
  const v = [first, ...segs.slice(0, -1).map((s) => s.p)];
  const n = v.length;
  const oAbs = new Array(n), iAbs = new Array(n);
  segs.forEach((s, j) => {
    const from = j, to = (j + 1) % n;
    oAbs[from] = s.line ? v[from] : s.c1;
    iAbs[to] = s.line ? v[to] : s.c2;
  });
  return { v, iAbs, oAbs };
}

module.exports = { parsePotraceSvg };

if (require.main === module) {
  const cs = parsePotraceSvg(process.argv[2]);
  cs.forEach((c, n) => {
    const xs = c.v.map((p) => p[0]), ys = c.v.map((p) => p[1]);
    let area = 0;
    c.v.forEach((p, j) => { const q = c.v[(j + 1) % c.v.length]; area += p[0] * q[1] - q[0] * p[1]; });
    console.log(n, c.v.length, 'bbox', Math.min(...xs) | 0, Math.min(...ys) | 0, Math.max(...xs) | 0, Math.max(...ys) | 0, 'area', (area / 2) | 0);
  });
}
