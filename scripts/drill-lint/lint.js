// Duyệt DRILLS theo docs/chuan-drill.md mục 2–5, mỗi vi phạm một dòng: drill, mục, lý do, cú dính.
// Một cú lấy từ `shots` (nguồn engine), `rounds` (video khi có `replay`, vẽ tay khi có `expectedCuePath`, engine khi có
// `speed` và `rate` từ harness), hoặc chính drill khi không có cả hai. Bàn chưa đo thật nên mọi cú engine và vẽ tay cần
// câu subtitle mục 5.
const { DRILLS } = require(process.argv[2]);
const { STAGES, stageOf, CURRICULUM } = require(require('path').join(process.argv[2], '../../stages.js'));
const { TOPICS, topicOf, drillsByRank, rankLabel } = require(require('path').join(process.argv[2], '../../topics.js'));
const only = process.argv.slice(3).map(Number);

const POCKETS = ['footLeft', 'footRight', 'sideLeft', 'sideRight', 'headLeft', 'headRight'];
// Bi còn lại trên bàn là bi chắn, rack, bi phụ, cổng hay đích cho bi cái dừng sát, không phải chuỗi cần pot.
const NO_CHAIN = new Set(['safety', 'kick', 'combo', 'break', 'jump', 'masse', 'speedControl', 'english']);
// Bàn xếp rack thì engine đánh cú phá như skill break, chép từ `DrillShotPlanner.racked`: từ năm bi mục tiêu, bi nào
// cũng có bi khác cách tâm dưới 2.25" + 0.3". Toạ độ ra inch như harness: x × 50, y × 100.
const racked = (balls) =>
  balls.length >= 5 &&
  balls.every((p) => balls.some((q) => q !== p && Math.hypot((q.x - p.x) * 50, (q.y - p.y) * 100) < 2.25 + 0.3));
const SIM = 'Checked in simulation, not on a real table.';
const DRAWN = 'Path drawn, not simulated.';
// Bốn nhóm theo skill, chép từ `areaBySkill` trong src/components/home/training-areas.ts (file đó dùng alias `@/` nên
// không biên dịch rời được). Đổi bên đó thì đổi theo.
const AREAS = [
  ['Fund', ['straightStroke', 'railCut', 'spotShot', 'cutAngle', 'bank', 'combo', 'kick', 'jump', 'masse']],
  ['CB', ['stop', 'follow', 'followDistance', 'draw', 'drawDistance', 'drawAngle', 'english', 'speedControl']],
  ['Pos', ['tangent', 'threePositions', 'oneRail', 'wagonWheel', 'naturalAngle', 'safety']],
  ['Pat', ['pattern', 'lineUp', 'correctSide', 'noRail', 'runout', 'break', 'test']],
];

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
    // Hai điểm từ bi cái là hướng ngắm của bài chỉ đánh bi cái (`cueOnlyTarget` của app), không phải đường vẽ tay.
    const drawn = guides.some((g) => g.kind === 'expectedCuePath' && g.points.length > 2);
    return {
      ...target(guides, balls, d),
      src: r.replay ? 'video' : drawn ? 'drawn' : typeof r.speed === 'number' && typeof r.rate === 'number' ? 'engine' : null,
      tipY: (r.contactPoint ?? d.recommendedContactPoint)?.y,
      speed: typeof r.speed === 'number' ? r.speed : null,
      zone: r.zone,
      why: r.why,
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
  // Bài không có zone chỉ đếm bi vào (Rail Cut BU), cú không cần zone.
  const noZone = pick(
    (s, i) => s.src === 'engine' && d.cueBallTargetZones.length > 0 && i < shots.length - 1 && (s.zone === undefined || s.zone === null),
  );
  if (noZone.length) add(3, 'cú engine thiếu zone bi cái', noZone);
  const zoneOut = pick((s) => typeof s.zone === 'number' && !d.cueBallTargetZones[s.zone]);
  if (zoneOut.length) add(3, 'zone trỏ ra ngoài cueBallTargetZones', zoneOut);
  // Round có zone mà không mang bàn riêng: app giữ đủ zone, solver chọn zone đầu cho mọi round, bàn vẽ guide tay nét liền.
  const flat = (d.rounds ?? []).flatMap((r, i) =>
    d.cueBallTargetZones.length > 1 && typeof r.zone === 'number' && !(r.cueBall || r.objectBalls || r.guideLines) ? [i] : [],
  );
  if (flat.length) add(3, 'round có zone nhưng thiếu cueBall/objectBalls/guideLines, app không tách zone của round', flat);
  const noWhy = pick((s) => !s.why?.trim());
  if (noWhy.length) add(3, 'thiếu câu vì sao chọn cú', noWhy);

  // Mục 4: từ hai bi mục tiêu trở lên phải chạy chuỗi tới bi cuối.
  if (d.objectBalls.length >= 2 && !NO_CHAIN.has(d.skill) && !racked(d.objectBalls)) {
    const hit = new Set(shots.map((s) => s.ball));
    const miss = d.objectBalls.map((b) => b.number).filter((n) => !hit.has(n));
    if (shots.length < 2) add(4, `${d.objectBalls.length} bi mục tiêu mà chỉ có một cú`);
    else if (miss.length) add(4, `chuỗi không pot bi ${miss.join(', ')}`);
  }
  // Luật 1: cú i ăn bi số nhỏ thứ i, số bi tăng dần theo thứ tự đánh.
  const order = (d.shots ?? []).map((s) => s.ball);
  if (order.some((b, i) => i > 0 && b <= order[i - 1])) add(4, `bi không tăng dần theo thứ tự cú: ${order.join('-')}`);

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
// Giai đoạn: bài kiểm phải là drill có thật và nằm đúng giai đoạn đó; giai đoạn 5, 6 cần ít nhất 5 bài. Chỉ chạy khi duyệt
// cả bộ, vì đếm theo cả bộ.
if (!only.length) {
  for (const st of STAGES) {
    const gate = DRILLS.find((d) => d.number === st.gate);
    const n = DRILLS.filter((d) => stageOf(d).stage === st.stage).length;
    const v = [];
    if (!gate) v.push(`bài kiểm ${st.gate} không có trong DRILLS`);
    else if (stageOf(gate).stage !== st.stage) v.push(`bài kiểm ${st.gate} thuộc giai đoạn ${stageOf(gate).stage}`);
    if (st.stage >= 5 && n < 5) v.push(`mới có ${n} bài, cần ít nhất 5`);
    total += v.length;
    for (const why of v) console.log(`stage ${st.stage} ${st.title} · ${why}`);
  }

  // Bảng số drill theo giai đoạn × nhóm, cả bộ, rồi kiểm giáo trình: 12 bài, mỗi nhóm ≥ 2, bài kiểm đứng cuối, id có thật,
  // đúng giai đoạn, không trùng.
  const areaOf = (d) => AREAS.find(([, skills]) => skills.includes(d.skill))?.[0] ?? '?';
  console.log(`\n${'stage'.padEnd(6)}${AREAS.map(([a]) => a.padStart(6)).join('')}${'tổng'.padStart(6)}`);
  for (const st of STAGES) {
    const inStage = DRILLS.filter((d) => stageOf(d).stage === st.stage);
    const cells = AREAS.map(([a]) => String(inStage.filter((d) => areaOf(d) === a).length).padStart(6));
    console.log(`${String(st.stage).padEnd(6)}${cells.join('')}${String(inStage.length).padStart(6)}`);
  }
  const seen = new Map();
  for (const st of STAGES) {
    const ids = CURRICULUM[st.stage];
    const v = [];
    if (ids.length !== 12) v.push(`${ids.length} bài, cần 12`);
    for (const id of ids) {
      const d = DRILLS.find((x) => x.id === id);
      if (!d) v.push(`id ${id} không có trong DRILLS`);
      else if (stageOf(d).stage !== st.stage) v.push(`id ${id} thuộc giai đoạn ${stageOf(d).stage}`);
      if (seen.has(id)) v.push(`id ${id} trùng với giai đoạn ${seen.get(id)}`);
      seen.set(id, st.stage);
    }
    const drills = ids.map((id) => DRILLS.find((x) => x.id === id)).filter(Boolean);
    for (const [a] of AREAS) {
      const n = drills.filter((d) => areaOf(d) === a).length;
      if (n < 2) v.push(`nhóm ${a} có ${n} bài, cần ít nhất 2`);
    }
    if (Number(ids[ids.length - 1]) !== st.gate) v.push(`bài cuối ${ids[ids.length - 1]}, cần bài kiểm ${st.gate}`);
    total += v.length;
    for (const why of v) console.log(`curriculum ${st.stage} ${st.title} · ${why}`);
  }

  // Chủ đề × hạng: drill nào không thuộc chủ đề nào thì báo, hạng nào trong `required` mà trống thì báo, rồi in bảng đếm.
  for (const d of DRILLS) {
    if (topicOf(d)) continue;
    total += 1;
    console.log(`topic ${d.number} ${d.title} · không có chủ đề (skill ${d.skill})`);
  }
  for (const t of TOPICS) {
    const by = drillsByRank(t, DRILLS);
    for (const st of t.required) {
      if (by[st].length) continue;
      total += 1;
      console.log(`topic ${t.id} ${rankLabel(st)} trống`);
    }
  }
  console.log(`\n${'chủ đề'.padEnd(20)}${STAGES.map((st) => st.sabo.padStart(6)).join('')}`);
  for (const t of TOPICS) {
    const by = drillsByRank(t, DRILLS);
    console.log(`${t.title.padEnd(20)}${STAGES.map((st) => String(by[st.stage].length).padStart(6)).join('')}`);
  }
}
console.log(`\nTổng: ${total} vi phạm, ${clean} drill đạt.`);
process.exitCode = total ? 1 : 0;
