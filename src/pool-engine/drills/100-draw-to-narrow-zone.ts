import type { PoolDrill } from '../types';

/**
 * Hai bi, bi cái đặt sẵn: draw thẳng bi 1 vào góc foot left, bi cái lùi một diamond vào zone 3" rồi cắt 23° bi 2 vào góc
 * foot right. Tự soạn cho giai đoạn 5 của `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`,
 * không lấy từ nguồn. Zone đặt tay, tip, lực và `rate` chép từ `sh scripts/rack-harness/run.sh 100` trên ShotPhysics của
 * working tree 2026-10-27. Cú 1 chỉ 9/45 mẫu lệch tay còn vào zone: đúng độ khó giai đoạn 5. Chưa kiểm trên bàn thật.
 */
export const drawToNarrowZone = {
  id: '100',
  number: 100,
  title: 'Draw to a Narrow Zone',
  // Zone, tip và lực chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'Draw the cue ball exactly one diamond back. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'drawDistance',
  skillLabel: 'Draw Distance',
  difficulty: 5,
  objective: 'Draw the 1 straight in and stop the cue ball inside the small zone. Then pot the 2 in the foot right corner.',
  cueBall: { x: 0.52, y: 0.39 },
  objectBalls: [
    { number: 1, x: 0.4, y: 0.3 },
    { number: 2, x: 0.82, y: 0.35 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.62, y: 0.465 }, radius: 0.06, label: '2' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: -0.6 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: ['Same low tip every time. Change only the speed until the cue ball stops in the zone.'],
  mistakes: ['Cue ball comes back past the zone: too firm. The 2 becomes a thin cut.'],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Land here' },
    { label: 'STEP 3', caption: 'Pot 2' },
  ],
  shots: [
    { ball: 1, pocket: 'footLeft', tipY: -0.6, speed: 1.4, zone: 0, rate: 9, why: '0° cut. Draw leaves the cue ball about 1 diamond from ball 2 with a 23° cut into the foot right corner.' },
    { ball: 2, pocket: 'footRight', tipY: 0.5, speed: 0.8, rate: 45, why: '23° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
