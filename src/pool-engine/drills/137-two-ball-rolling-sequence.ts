import type { PoolDrill } from '../types';

/**
 * Two-Ball Rolling Sequence, bài mới cho hạng H theo deep-research-report (ý bài: bi 1, lăn vào zone, bi 2, ngưỡng 5/8).
 * Toạ độ báo cáo không dùng. Bi 1 ở (16", 32") cắt 10° vào lỗ góc chân trái, bi cái lùi 12.5" sau ghost ball, zone 6"
 * ở (19", 23"), bi 2 ở (35.1", 11.1") gần thẳng vào lỗ góc chân phải từ zone [đề xuất]. Tip, lực, rate lấy từ
 * `chain("137 back 12.5")` trong `drill137()` của `scripts/position-harness/` trên ShotPhysics `65a775f`. Chưa kiểm trên
 * bàn thật.
 */
export const twoBallRollingSequence = {
  id: '137',
  number: 137,
  title: 'Two-Ball Rolling Sequence',
  subtitle: 'Pot the 1, roll into the zone, pot the 2 straight. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'pattern',
  skillLabel: 'Pattern',
  difficulty: 2,
  objective: 'Pot the 1 in the foot left corner and roll the cue ball into the zone, then pot the 2 in the foot right corner.',
  cueBall: { x: 0.4114, y: 0.4599 },
  objectBalls: [
    { number: 1, x: 0.32, y: 0.32 },
    { number: 2, x: 0.702, y: 0.111 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.38, y: 0.23 }, radius: 0.12, label: '2' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.2 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 8,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: ['Roll the cue ball, do not hit it. The zone leaves the 2 almost straight.', 'Look at the zone before the 1, not after.'],
  mistakes: ['Cue ball stops short of the zone: the 2 becomes a long cut.', 'Too firm on the 1: the ball rattles in the long corner shot.'],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Land here' },
    { label: 'STEP 3', caption: 'Pot 2' },
  ],
  shots: [
    { ball: 1, pocket: 'footLeft', tipY: 0.2, speed: 0.9, zone: 0, rate: 30, why: '10° cut. A touch of top at 0.90 m/s rolls the cue ball 11" past contact, 20" from the 2 and nearly straight.' },
    { ball: 2, pocket: 'footRight', tipY: 0, speed: 1.2, rate: 45, why: 'Straight in from the zone. Center ball at 1.20 m/s, cue ball stops 11" from the corner.' },
  ],
} satisfies PoolDrill;
