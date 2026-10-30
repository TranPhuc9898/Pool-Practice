import type { GuideLine, PoolDrill } from '../types';

/**
 * RDS Levels 4–6, bài 75 của `docs/research/pool-practice-drills/drills-66-81-bank-break-jump-kiem-tra.md`, gốc BU Exam IV (RDS).
 * [nguồn]: luật chung và luật từng level đọc thẳng từ PDF BU Exam IV
 * https://billiarduniversity.org/documents/BU_Exam-IV_Runout_Drill_System.pdf (đọc lại ngày 2026-10-20), khớp bản research.
 * Hình rack theo hình vẽ trong PDF, bi 1 trên foot spot, khít như rack drill 30; bi cái in sẵn ở (0.5, 0.875) theo sơ đồ.
 * [suy luận] của em: app chỉ có Pass/Miss và round cố định, nên mỗi level 3 rack theo thứ tự, Pass là chạy hết rack, qua ở
 * 2/3 tổng số rack, gần với luật "2/3 rack thì lên level" nhưng không xét riêng từng level.
 * Rack level 6: 1-2-3-1, bi 8 giữa hàng ba, bi cuối nằm thẳng sau bi 8 như hình PDF. [nguồn] research: level 4–5 là hạng E,
 * qua level 6 là chạm D.
 * Chưa kiểm trên bàn thật.
 * Round là cú phá đầu rack, vẽ tay như bài 74 và 95: chạm bi 1 thẳng rồi lùi về giữa bàn [suy luận], lực 8 m/s là lực Play dùng cho cú phá [đề xuất].
 */
const BREAK_PATH: GuideLine[] = [
  { kind: 'expectedCuePath', points: [{ x: 0.5, y: 0.875 }, { x: 0.5, y: 0.2725 }, { x: 0.5, y: 0.5 }] },
];

export const rdsLevels4To6 = {
  id: '75',
  number: 75,
  title: 'RDS Levels 4–6',
  subtitle: 'Break and run six or seven balls with fewer ball-in-hands. Path drawn, not simulated.',
  category: 'patternPlay',
  skill: 'test',
  skillLabel: 'RDS',
  difficulty: 3,
  objective:
    'Break and run, three racks per level, ball in hand after the break. Level 4: 6 balls, any order, 2 extra ball-in-hands. Level 5: 6 balls, any order, 1 extra. Level 6: 3 solids, 3 stripes and the 8 under 8-ball rules, 1 extra ball in hand; run one group, then the 8.',
  cueBall: { x: 0.5, y: 0.875 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.25 },
    { number: 2, x: 0.4775, y: 0.23051 },
    { number: 3, x: 0.5225, y: 0.23051 },
    { number: 4, x: 0.455, y: 0.21103 },
    { number: 6, x: 0.5, y: 0.21103 },
    { number: 5, x: 0.545, y: 0.21103 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 9,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'Break, then ball in hand. A miss or a scratch after the break ends the rack. A scratch on the break costs nothing and balls made on the break stay down.',
    'Tap Pass only for a full run. Three racks per level here; in the full system 2 of 3 moves you up, 1 of 3 keeps you there, 0 of 3 drops you a level.',
    'WPA rules, cue-ball fouls only. Rotation racks: combos and slop count. 8-ball racks: called pockets, and the 8 made on the break is spotted or re-racked.',
  ],
  rounds: [
    {
      title: 'Level 4',
      spin: 'stun',
      contactPoint: { x: 0, y: -0.15 },
      speed: 8,
      why: 'Square hit on the 1 at break speed. A touch below center stops the cue ball near the middle, away from the rails and pockets.',
      guideLines: BREAK_PATH,
      objectBalls: [
        { number: 1, x: 0.5, y: 0.25 },
        { number: 2, x: 0.4775, y: 0.23051 },
        { number: 3, x: 0.5225, y: 0.23051 },
        { number: 4, x: 0.455, y: 0.21103 },
        { number: 6, x: 0.5, y: 0.21103 },
        { number: 5, x: 0.545, y: 0.21103 },
      ],
    },
    {
      title: 'Level 5',
      spin: 'stun',
      contactPoint: { x: 0, y: -0.15 },
      speed: 8,
      why: 'Square hit on the 1 at break speed. A touch below center stops the cue ball near the middle, away from the rails and pockets.',
      guideLines: BREAK_PATH,
      objectBalls: [
        { number: 1, x: 0.5, y: 0.25 },
        { number: 2, x: 0.4775, y: 0.23051 },
        { number: 3, x: 0.5225, y: 0.23051 },
        { number: 4, x: 0.455, y: 0.21103 },
        { number: 6, x: 0.5, y: 0.21103 },
        { number: 5, x: 0.545, y: 0.21103 },
      ],
    },
    {
      title: 'Level 6',
      spin: 'stun',
      contactPoint: { x: 0, y: -0.15 },
      speed: 8,
      why: 'Square hit on the 1 at break speed. A touch below center stops the cue ball near the middle, away from the rails and pockets.',
      guideLines: BREAK_PATH,
      objectBalls: [
        { number: 1, x: 0.5, y: 0.25 },
        { number: 9, x: 0.4775, y: 0.23051 },
        { number: 2, x: 0.5225, y: 0.23051 },
        { number: 10, x: 0.455, y: 0.21103 },
        { number: 8, x: 0.5, y: 0.21103 },
        { number: 3, x: 0.545, y: 0.21103 },
        { number: 11, x: 0.5, y: 0.18853 },
      ],
    },
  ],
} satisfies PoolDrill;
