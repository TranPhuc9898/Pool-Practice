import type { PoolDrill } from '../types';

/**
 * Hai bi, bi cái đặt sẵn, hai cú cố định: draw bi 1 vào góc foot phải để bi cái lùi thẳng về zone, rồi bi 2 vào góc foot
 * trái. Trường cấp bài (`targetPocket`, spin, lực) mô tả cú 1. `allowedRails` 0 nên zone đặt ở chỗ bi cái dừng khi draw
 * tipY −0.6, 2.7 m/s, không chạm băng (quét tip × lực trên ShotPhysics, 2026-10-29; tip ≤ 0.6 = `ShotPhysics.tipMax`).
 * Route follow cũ tới zone qua một băng, sai luật 3. Lực nhạy: ±0.05 m/s lệch khoảng 7" dọc đường lùi.
 */
export const twoBallPattern = {
  id: '10',
  number: 10,
  title: 'Two-Ball Pattern',
  // Zone, tip, lực và tỉ lệ chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: "Don't play only the current shot. Play the next shot. Checked in simulation, not on a real table.",
  category: 'patternPlay',
  skill: 'pattern',
  skillLabel: 'Pattern Play',
  difficulty: 5,
  objective: 'Pocket the 1, land in the zone, then pocket the 2.',
  cueBall: { x: 0.6, y: 0.75 },
  objectBalls: [
    { number: 1, x: 0.8, y: 0.3 },
    { number: 2, x: 0.24, y: 0.4 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.44, y: 0.594 }, radius: 0.09, label: '2' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.6 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'firm',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: ['Decide where the cue ball goes before you aim the 1.'],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Land here' },
    { label: 'STEP 3', caption: 'Pot 2' },
  ],
  shots: [
    { ball: 1, pocket: 'footRight', tipY: -0.6, speed: 2.7, zone: 0, rate: 2, why: '6° cut. Draw pulls the cue ball back off the 1, no rail, and leaves a 12° cut on ball 2 into the foot left corner.' },
    { ball: 2, pocket: 'footLeft', tipY: 0.6, speed: 1.2, rate: 15, why: '12° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
