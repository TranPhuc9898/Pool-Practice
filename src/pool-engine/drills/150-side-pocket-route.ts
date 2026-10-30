import type { PoolDrill } from '../types';

/**
 * Side-Pocket Route, bài mới cho hạng G theo deep-research-report (2) (ý bài: bi 1 vào lỗ giữa, bi cái vào zone, không
 * rơi lỗ). Toạ độ báo cáo không dùng. Bi 1 ở (12.5", 50") cắt 15° vào lỗ giữa trái, bi cái ở (32.1", 54.7"), zone 6" ở
 * (10", 45"), bi 2 ở (25.9", 47") vào lỗ giữa phải từ zone [đề xuất]. Tip, lực, rate lấy từ `route("150", …)` trong
 * `drill150()` của `scripts/position-harness/` trên ShotPhysics `65a775f`. Chưa kiểm trên bàn thật.
 */
export const sidePocketRoute = {
  id: '150',
  number: 150,
  title: 'Side-Pocket Route',
  subtitle: 'Pot the 1 in the side, hold the cue ball in the zone, pot the 2 in the other side. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'pattern',
  skillLabel: 'Pattern',
  difficulty: 2,
  objective: 'Pot the 1 in the left side pocket and draw the cue ball into the zone, then pot the 2 in the right side pocket.',
  cueBall: { x: 0.6427, y: 0.5466 },
  objectBalls: [
    { number: 1, x: 0.25, y: 0.5 },
    { number: 2, x: 0.5175, y: 0.4698 },
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.2, y: 0.45 }, radius: 0.12, label: '2' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'sideRight' },
  ],
  recommendedContactPoint: { x: 0, y: -0.3 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: ['A little draw holds the cue ball short of the side pocket.', 'Side pockets are narrow at an angle. Keep the pace soft on both shots.'],
  mistakes: ['Cue ball follows the 1 toward the side pocket: more draw.', 'Too firm on the 2: the ball rattles in the side.'],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Land here' },
    { label: 'STEP 3', caption: 'Pot 2' },
  ],
  shots: [
    { ball: 1, pocket: 'sideLeft', tipY: -0.3, speed: 1.08, zone: 0, rate: 43, why: '15° cut into the side. Low tip at 1.08 m/s checks the cue ball into the zone, clear of the pocket.' },
    { ball: 2, pocket: 'sideRight', tipY: 0, speed: 1.2, rate: 45, why: 'From the zone the 2 is almost straight. Center ball at 1.20 m/s, the cue ball stops near the middle.' },
  ],
} satisfies PoolDrill;
