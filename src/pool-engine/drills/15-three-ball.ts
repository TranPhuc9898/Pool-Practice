import type { PoolDrill } from '../types';

/**
 * Scott Lee: tung 3 bi ngẫu nhiên. Đây là một layout mẫu, ngoài bàn tung lại sau mỗi lượt.
 * Layout mẫu chạy ba cú cố định: draw bi 1 vào lỗ giữa trái, draw nhẹ bi 2 vào góc foot phải, bi 3 vào góc foot trái.
 * Bi cái chỉ đặt ở cú 1, cú sau đánh từ chỗ dừng thật. Zone r 6.5": đứng chỗ nào trong zone cú kế vẫn cắt ≤ 30°.
 * Chỗ đặt bi cái, tip, lực, zone và `rate` dò bằng harness scratch trên ShotPhysics ddf3049, cùng luật 45 mẫu của
 * `scripts/position-harness/` cộng điều kiện cú kế cắt ≤ 30°. Harness này chưa vào repo.
 */
export const threeBall = {
  id: '15',
  number: 15,
  title: 'Three-Ball, 30° Max',
  // Zone, tip, lực và tỉ lệ chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'Every shot must leave the next cut at 30° or less. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'runout',
  skillLabel: '3-Ball Pattern',
  difficulty: 3,
  objective: 'Ball in hand. Run 1, 2, 3. Any leave over 30° and the run does not count.',
  cueBall: { x: 0.45, y: 0.735 },
  objectBalls: [
    { number: 1, x: 0.3, y: 0.62 },
    { number: 2, x: 0.72, y: 0.35 },
    { number: 3, x: 0.35, y: 0.18 },
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.572, y: 0.541 }, radius: 0.13, label: '2' },
    { kind: 'circle', center: { x: 0.68, y: 0.31 }, radius: 0.13, label: '3' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: -0.4 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 20,
  passCondition: { kind: 'pocketed', required: 15 },
  tips: [
    '15 of 20 clean runs, then move to 4 and 5 balls.',
    'Failed run: set it up again and pick a different route.',
  ],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Angle on 2' },
    { label: 'STEP 3', caption: 'Angle on 3' },
  ],
  shots: [
    {
      ball: 1,
      pocket: 'sideLeft',
      tipY: -0.4,
      speed: 1.6,
      zone: 0,
      rate: 26,
      why: 'Draw holds the cue ball off the tangent line so it stops near the middle of the table, about 20" from ball 2 with a 5° cut into the corner. Anywhere in zone 2 leaves 22° or less.',
    },
    {
      ball: 2,
      pocket: 'footRight',
      tipY: -0.3,
      speed: 1.6,
      zone: 1,
      rate: 37,
      why: 'The draw wears off to a near stop, so the cue ball parks about 3" from where ball 2 sat instead of following it to the corner. That leaves a 7° cut on ball 3, 22" away.',
    },
    {
      ball: 3,
      pocket: 'footLeft',
      tipY: -0.2,
      speed: 1.6,
      rate: 45,
      why: 'Last ball, no position to play. A touch of draw, medium pace.',
    },
  ],
} satisfies PoolDrill;
