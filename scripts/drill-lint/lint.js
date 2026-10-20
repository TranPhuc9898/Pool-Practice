// Duyệt DRILLS theo docs/chuan-drill.md mục 2–5, mỗi vi phạm một dòng: drill, mục, lý do, cú dính.
// Một cú lấy từ `shots` (nguồn engine), `rounds` (video khi có `replay`, vẽ tay khi có `expectedCuePath`),
// hoặc chính drill khi không có cả hai. Bàn chưa đo thật nên mọi cú engine và vẽ tay cần câu subtitle mục 5.
const { DRILLS } = require(process.argv[2]);
const only = process.argv.slice(3).map(Number);

const POCKETS = ['footLeft', 'footRight', 'sideLeft', 'sideRight', 'headLeft', 'headRight'];
// Bi còn lại trên bàn là bi chắn, rack hay bi phụ, không phải chuỗi cần pot.
const NO_CHAIN = new Set(['safety', 'kick', 'combo', 'break', 'jump', 'masse']);
const SIM = 'Checked in simulation, not on a real table.';
const DRAWN = 'Path drawn, not simulated.';

const target = (guides, balls, d) => {
  const g = guides.find((x) => x.kind === 'objectBallPath') ?? guides.find((x) => x.kind === 'ghostBall');
  return g ? { ball: g.ball, pocket: g.pocket } : { ball: balls[0]?.number, pocket: d.targetPocket };
};

function shotsOf(d) {
  if (d.shots?.length)
    return d.shots.map((s) => ({ src: 'engine', ball: s.ball, pocket: s.pocket, tipY: s.tipY, speed: s.speed, zone: s.zone, why: s.why }));
  const one = (r) => {
    const guides = r.guideLines ?? d.guideLines;
    const balls = r.objectBalls ?? d.objectBalls;
    const drawn = guides.some((g) => g.kind === 'expectedCuePath');
    return {
      ...target(guides, balls, d),
      src: r.replay ? 'video' : drawn ? 'drawn' : null,
      tipY: (r.contactPoint ?? d.recommendedContactPoint)?.y,
      speed: typeof r.speed === 'number' ? r.speed : null,
      zone: r.zone,
      cueBall: r.cueBall,
      balls,
      replay: !!r.replay,
    };
  };
  return d.rounds?.length ? d.rounds.map(one) : [one({})];
}

const span = (xs) => {
  const n = xs.map((i) => i + 1);
  const runs = [];
  for (const i of n) {
    const last = runs[runs.length - 1];
    if (last && last[1] === i - 1) last[1] = i;
    else runs.push([i, i]);
  }
  return 'cú ' + runs.map(([a, b]) => (a === b ? a : `${a}–${b}`)).join(', ');
};

function lint(d) {
  const out = [];
  const add = (sec, why, idx) => out.push(`§${sec} ${why}${idx?.length ? `: ${span(idx)}` : ''}`);
  const shots = shotsOf(d);
  const pick = (f) => shots.flatMap((s, i) => (f(s, i) ? [i] : []));

  // Mục 2: toạ độ, lỗ, bi cái chỉ đặt ở cú 1, bi chưa tới lượt đứng yên.
  const pts = [d.cueBall, ...d.objectBalls, ...d.cueBallTargetZones.map((z) => z.center ?? z)];
  for (const r of d.rounds ?? []) pts.push(r.cueBall, ...(r.objectBalls ?? []));
  for (const g of [d.guideLines, ...(d.rounds ?? []).map((r) => r.guideLines ?? [])].flat())
    if (g.points) pts.push(...g.points);
  const bad = pts.filter((p) => p && (typeof p.x !== 'number' || p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1));
  if (bad.length) add(2, `toạ độ ngoài [0,1]: ${bad.map((p) => `(${p.x},${p.y})`).join(' ')}`);
  const pockets = [d.targetPocket, ...shots.map((s) => s.pocket)];
  if (pockets.some((p) => p && !POCKETS.includes(p))) add(2, `lỗ không phải PocketId: ${pockets.filter((p) => p && !POCKETS.includes(p)).join(', ')}`);

  const inHand = /ball in hand/i.test(d.objective);
  const replaced = [], moved = [];
  if (d.rounds?.length)
    shots.forEach((s, i) => {
      if (i === 0) return;
      const prev = shots[i - 1].balls;
      const cont = s.balls.length < prev.length && s.balls.every((b) => prev.some((p) => p.number === b.number));
      if (!cont) return;
      if (s.cueBall && !s.replay && !inHand) replaced.push(i);
      if (s.balls.some((b) => prev.some((p) => p.number === b.number && (p.x !== b.x || p.y !== b.y)))) moved.push(i);
    });
  if (replaced.length) add(2, 'bi cái đặt lại giữa chuỗi, objective không ghi ball in hand', replaced);
  if (moved.length) add(2, 'bi chưa tới lượt đổi chỗ giữa chuỗi', moved);

  // Mục 3: một cú phải có đủ.
  const noBall = pick((s, i) => s.ball === undefined || !s.pocket || !(s.balls ?? d.objectBalls).some((b) => b.number === s.ball));
  if (d.objectBalls.length && noBall.length) add(3, 'không xác định được bi mục tiêu và lỗ', noBall);
  const noTip = pick((s) => typeof s.tipY !== 'number');
  if (noTip.length) add(3, 'thiếu điểm chạm cơ', noTip);
  const noSpeed = pick((s) => typeof s.speed !== 'number');
  if (noSpeed.length) add(3, `thiếu lực m/s, chỉ có bậc '${d.recommendedSpeed}'`, noSpeed);
  const noPath = pick((s) => !s.src);
  if (noPath.length) add(3, 'thiếu nguồn đường bi cái (shots, replay hay expectedCuePath)', noPath);
  const noZone = pick((s, i) => s.src === 'engine' && i < shots.length - 1 && (s.zone === undefined || s.zone === null));
  if (noZone.length) add(3, 'cú engine thiếu zone bi cái', noZone);
  const zoneOut = pick((s) => typeof s.zone === 'number' && !d.cueBallTargetZones[s.zone]);
  if (zoneOut.length) add(3, 'zone trỏ ra ngoài cueBallTargetZones', zoneOut);
  const noWhy = pick((s) => !s.why?.trim());
  if (noWhy.length) add(3, 'thiếu câu vì sao chọn cú', noWhy);

  // Mục 4: từ hai bi mục tiêu trở lên phải chạy chuỗi tới bi cuối.
  if (d.objectBalls.length >= 2 && !NO_CHAIN.has(d.skill)) {
    const hit = new Set(shots.map((s) => s.ball));
    const miss = d.objectBalls.map((b) => b.number).filter((n) => !hit.has(n));
    if (shots.length < 2) add(4, `${d.objectBalls.length} bi mục tiêu mà chỉ có một cú`);
    else if (miss.length) add(4, `chuỗi không pot bi ${miss.join(', ')}`);
  }

  // Mục 5: câu subtitle theo nguồn đường đi.
  if (shots.some((s) => s.src === 'engine') && !d.subtitle.includes(SIM)) add(5, `cú engine, subtitle thiếu "${SIM}"`);
  if (shots.some((s) => s.src === 'drawn') && !d.subtitle.includes(DRAWN)) add(5, `cú vẽ tay, subtitle thiếu "${DRAWN}"`);
  return out;
}

let total = 0, clean = 0;
for (const d of DRILLS) {
  if (only.length && !only.includes(d.number)) continue;
  const v = lint(d);
  total += v.length;
  if (!v.length) clean++;
  console.log(`${String(d.number).padStart(2)} ${d.title} · ${v.length ? `${v.length} vi phạm` : 'đạt'}`);
  for (const line of v) console.log(`     ${line}`);
}
console.log(`\nTổng: ${total} vi phạm, ${clean} drill đạt.`);
process.exitCode = total ? 1 : 0;
