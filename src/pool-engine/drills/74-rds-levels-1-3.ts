import type { PoolDrill } from '../types';

/**
 * RDS Levels 1–3, bài 74 của `docs/research/pool-practice-drills/drills-66-81-bank-break-jump-kiem-tra.md`, gốc BU Exam IV (RDS).
 * [nguồn]: luật chung và luật từng level đọc thẳng từ PDF BU Exam IV
 * https://billiarduniversity.org/documents/BU_Exam-IV_Runout_Drill_System.pdf (đọc lại ngày 2026-10-20), khớp bản research.
 * Hình rack theo hình vẽ trong PDF, bi 1 trên foot spot, khít như rack drill 30; bi cái in sẵn ở (0.5, 0.875) theo sơ đồ.
 * [suy luận] của em: app chỉ có Pass/Miss và round cố định, nên mỗi level 3 rack theo thứ tự, Pass là chạy hết rack, qua ở
 * 2/3 tổng số rack, gần với luật "2/3 rack thì lên level" nhưng không xét riêng từng level.
 * Level 1 (bỏ bi cái, chọc thẳng bi mục tiêu, lau vết phấn) research còn để ngỏ, em lấy theo PDF. [suy luận] của research:
 * qua level 3 là xong hạng G.
 * Chưa kiểm trên bàn thật.
 */
export const rdsLevels1To3 = {
  id: '74',
  number: 74,
  title: 'RDS Levels 1–3',
  subtitle: 'Break and run six balls, with plenty of help.',
  category: 'patternPlay',
  skill: 'test',
  skillLabel: 'RDS',
  difficulty: 1,
  objective:
    'Break a 6-ball rack and run it, three racks per level. Level 1: take the cue ball off and shoot each object ball directly with the cue, any order. Level 2: ball in hand on every shot, any order. Level 3: ball in hand after the break and any 3 other times, any order.',
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
    'Level 1 is optional in the source. Wipe the chalk marks off the balls when you are done.',
  ],
  rounds: [
    {
      title: 'Level 1',
      spin: 'center',
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
      title: 'Level 2',
      spin: 'center',
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
      title: 'Level 3',
      spin: 'center',
      objectBalls: [
        { number: 1, x: 0.5, y: 0.25 },
        { number: 2, x: 0.4775, y: 0.23051 },
        { number: 3, x: 0.5225, y: 0.23051 },
        { number: 4, x: 0.455, y: 0.21103 },
        { number: 6, x: 0.5, y: 0.21103 },
        { number: 5, x: 0.545, y: 0.21103 },
      ],
    },
  ],
} satisfies PoolDrill;
