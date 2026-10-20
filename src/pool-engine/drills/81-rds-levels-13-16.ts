import type { PoolDrill } from '../types';

/**
 * RDS Levels 13–16, bài 81 của `docs/research/pool-practice-drills/drills-66-81-bank-break-jump-kiem-tra.md`, gốc BU Exam IV (RDS).
 * [nguồn]: luật chung và luật từng level đọc thẳng từ PDF BU Exam IV
 * https://billiarduniversity.org/documents/BU_Exam-IV_Runout_Drill_System.pdf (đọc lại ngày 2026-10-20), khớp bản research.
 * Hình rack theo hình vẽ trong PDF, bi 1 trên foot spot, khít như rack drill 30; bi cái in sẵn ở (0.5, 0.875) theo sơ đồ.
 * [suy luận] của em: app chỉ có Pass/Miss và round cố định, nên mỗi level 3 rack theo thứ tự, Pass là chạy hết rack, qua ở
 * 2/3 tổng số rack, gần với luật "2/3 rack thì lên level" nhưng không xét riêng từng level.
 * Rack level 16 là rack rotation: 1 ở đỉnh, 2 và 3 ở hai góc sau, 15 giữa; PDF chỉ vẽ bi 1, phần còn lại là suy luận.
 * Mốc tham chiếu khác [nguồn] research: thắng 9-ball ghost (ball in hand sau break, race to 11) thì có thể nghĩ tới giải pro.
 * Chưa kiểm trên bàn thật.
 */
export const rdsLevels13To16 = {
  id: '81',
  number: 81,
  title: 'RDS Levels 13–16',
  subtitle: 'Shortstop to pro: 8-ball, 9-ball and rotation runouts.',
  category: 'patternPlay',
  skill: 'test',
  skillLabel: 'RDS',
  difficulty: 5,
  objective:
    'Break and run, three racks per level, ball in hand after the break only. Level 13: 4 solids, 4 stripes and the 8 under 8-ball rules, then the rest in rotation. Level 14: 9-ball rules; a legal 9 at any time, even on the break, wins the rack. Level 15: 15 balls under 8-ball rules, then the rest in rotation. Level 16: 15 balls in rotation.',
  cueBall: { x: 0.5, y: 0.875 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.25 },
    { number: 9, x: 0.4775, y: 0.23051 },
    { number: 2, x: 0.5225, y: 0.23051 },
    { number: 10, x: 0.455, y: 0.21103 },
    { number: 8, x: 0.5, y: 0.21103 },
    { number: 3, x: 0.545, y: 0.21103 },
    { number: 11, x: 0.4775, y: 0.19154 },
    { number: 4, x: 0.5225, y: 0.19154 },
    { number: 12, x: 0.5, y: 0.17206 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 12,
  passCondition: { kind: 'pocketed', required: 8 },
  tips: [
    'Break, then ball in hand. A miss or a scratch after the break ends the rack. A scratch on the break costs nothing and balls made on the break stay down.',
    'Tap Pass only for a full run. Three racks per level here; in the full system 2 of 3 moves you up, 1 of 3 keeps you there, 0 of 3 drops you a level.',
    'WPA rules, cue-ball fouls only. Rotation racks: combos and slop count. 8-ball racks: called pockets, and the 8 made on the break is spotted or re-racked.',
    'Rotation: if you pocket the highest ball early you still have to run the rest in order, except Level 14.',
    'Another benchmark: beat the 9-ball ghost, ball in hand after the break, race to 11.',
  ],
  rounds: [
    {
      title: 'Level 13',
      spin: 'center',
      objectBalls: [
        { number: 1, x: 0.5, y: 0.25 },
        { number: 9, x: 0.4775, y: 0.23051 },
        { number: 2, x: 0.5225, y: 0.23051 },
        { number: 10, x: 0.455, y: 0.21103 },
        { number: 8, x: 0.5, y: 0.21103 },
        { number: 3, x: 0.545, y: 0.21103 },
        { number: 11, x: 0.4775, y: 0.19154 },
        { number: 4, x: 0.5225, y: 0.19154 },
        { number: 12, x: 0.5, y: 0.17206 },
      ],
    },
    {
      title: 'Level 14',
      spin: 'center',
      objectBalls: [
        { number: 1, x: 0.5, y: 0.25 },
        { number: 2, x: 0.4775, y: 0.23051 },
        { number: 3, x: 0.5225, y: 0.23051 },
        { number: 4, x: 0.455, y: 0.21103 },
        { number: 9, x: 0.5, y: 0.21103 },
        { number: 5, x: 0.545, y: 0.21103 },
        { number: 6, x: 0.4775, y: 0.19154 },
        { number: 7, x: 0.5225, y: 0.19154 },
        { number: 8, x: 0.5, y: 0.17206 },
      ],
    },
    {
      title: 'Level 15',
      spin: 'center',
      objectBalls: [
        { number: 1, x: 0.5, y: 0.25 },
        { number: 9, x: 0.4775, y: 0.23051 },
        { number: 2, x: 0.5225, y: 0.23051 },
        { number: 10, x: 0.455, y: 0.21103 },
        { number: 8, x: 0.5, y: 0.21103 },
        { number: 3, x: 0.545, y: 0.21103 },
        { number: 11, x: 0.4325, y: 0.19154 },
        { number: 7, x: 0.4775, y: 0.19154 },
        { number: 14, x: 0.5225, y: 0.19154 },
        { number: 4, x: 0.5675, y: 0.19154 },
        { number: 5, x: 0.41, y: 0.17206 },
        { number: 13, x: 0.455, y: 0.17206 },
        { number: 15, x: 0.5, y: 0.17206 },
        { number: 6, x: 0.545, y: 0.17206 },
        { number: 12, x: 0.59, y: 0.17206 },
      ],
    },
    {
      title: 'Level 16',
      spin: 'center',
      objectBalls: [
        { number: 1, x: 0.5, y: 0.25 },
        { number: 9, x: 0.4775, y: 0.23051 },
        { number: 10, x: 0.5225, y: 0.23051 },
        { number: 11, x: 0.455, y: 0.21103 },
        { number: 15, x: 0.5, y: 0.21103 },
        { number: 12, x: 0.545, y: 0.21103 },
        { number: 4, x: 0.4325, y: 0.19154 },
        { number: 13, x: 0.4775, y: 0.19154 },
        { number: 14, x: 0.5225, y: 0.19154 },
        { number: 5, x: 0.5675, y: 0.19154 },
        { number: 2, x: 0.41, y: 0.17206 },
        { number: 6, x: 0.455, y: 0.17206 },
        { number: 7, x: 0.5, y: 0.17206 },
        { number: 8, x: 0.545, y: 0.17206 },
        { number: 3, x: 0.59, y: 0.17206 },
      ],
    },
  ],
} satisfies PoolDrill;
