import type { PoolDrill } from '../types';

/**
 * Two-Ball Route – Draw, bài mới cho hạng G theo deep-research-report (2) (ý bài: bi 1, draw vào zone, bi 2). Toạ độ báo
 * cáo không dùng. Bi 1 ở (15", 30") cắt 10° vào lỗ góc chân trái, bi cái ở (20.3", 46.4"), zone 6" ở (20", 29"), bi 2 ở
 * (34.4", 15.1") vào lỗ góc chân phải từ zone [đề xuất]. Tip, lực, rate lấy từ `route("153", …)` trong `drill153()` của
 * `scripts/position-harness/` trên ShotPhysics `65a775f`. Chưa kiểm trên bàn thật.
 */
export const twoBallRouteDraw = {
  id: '153',
  number: 153,
  title: 'Two-Ball Route – Draw',
  subtitle: 'Pot the 1, draw back into the zone, pot the 2. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'pattern',
  skillLabel: 'Pattern',
  difficulty: 2,
  objective: 'Pot the 1 in the foot left corner and draw the cue ball into the zone, then pot the 2 in the foot right corner.',
  cueBall: { x: 0.4057, y: 0.4639 },
  objectBalls: [
    { number: 1, x: 0.3, y: 0.3 },
    { number: 2, x: 0.6876, y: 0.151 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.4, y: 0.29 }, radius: 0.12, label: '2' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: -0.3 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: ['Draw only enough to stop the cue ball in the zone. Short draw beats long draw.', 'Look at the 2 before you shoot the 1.'],
  mistakes: ['Cue ball drifts along the tangent: more draw.', 'Cue ball comes back past the zone: less pace.'],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Land here' },
    { label: 'STEP 3', caption: 'Pot 2' },
  ],
  shots: [
    { ball: 1, pocket: 'footLeft', tipY: -0.3, speed: 1.68, zone: 0, rate: 27, why: '10° cut. Low tip at 1.68 m/s holds the cue ball near the contact spot inside the zone.' },
    { ball: 2, pocket: 'footRight', tipY: 0, speed: 1.2, rate: 45, why: 'From the zone the 2 is a short cut. Center ball at 1.20 m/s, the cue ball stops near the foot rail.' },
  ],
} satisfies PoolDrill;
