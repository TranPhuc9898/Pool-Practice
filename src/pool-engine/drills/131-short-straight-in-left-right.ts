import type { PoolDrill } from '../types';

/**
 * Short Straight-In Left/Right, bài mới cho hạng H theo `plans/reports/brainstorm-261030-1012-level-h.md`. Ý bài (cú thẳng
 * cự ly ngắn, gương hai lỗ góc chân) lấy từ deep-research-report, toạ độ báo cáo (bi cái 0.25, 0.50) cắt 27° nên không dùng.
 * Bi 1 ở (12.5", 25"), bi cái lùi 1 diamond (12.5") đúng trên đường bi 1 tới lỗ, round phải là ảnh gương [đề xuất]. Tip,
 * lực, rate lấy từ `drill131()` của `scripts/position-harness/` trên ShotPhysics `65a775f`: 45/45 mẫu vào lỗ sạch, bi cái
 * dừng cách chỗ chạm 0.6", cách lỗ 27". Chưa kiểm trên bàn thật.
 */
export const shortStraightInLeftRight = {
  id: '131',
  number: 131,
  title: 'Short Straight-In Left/Right',
  subtitle: 'A one-diamond straight shot into each foot corner. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'straightStroke',
  skillLabel: 'Straight-In',
  difficulty: 1,
  objective: 'Pot the 1-ball five times into the left corner, then five times into the right, with a stop shot.',
  cueBall: { x: 0.3618, y: 0.3618 },
  objectBalls: [{ number: 1, x: 0.25, y: 0.25 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.1 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    'Same shot on both sides. If one side misses more, the stance changes, not the stroke.',
    'Stop the cue ball where it hits the 1-ball.',
    'Stay down until the ball drops.',
  ],
  mistakes: [
    'Misses only on one side: the body is not square to the line on that side. Reset the feet before every shot.',
    'Cue ball rolls forward after contact: hit a touch lower.',
  ],
  rounds: [
    {
      title: 'Left',
      spin: 'stun',
      cueBall: { x: 0.3618, y: 0.3618 },
      objectBalls: [{ number: 1, x: 0.25, y: 0.25 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
      ],
      contactPoint: { x: 0, y: -0.1 },
      speed: 2.12,
      rate: 45,
      why: 'Straight in from one diamond. A touch below center stops the cue ball on the contact spot, 27" from the pocket.',
    },
    {
      title: 'Right',
      spin: 'stun',
      cueBall: { x: 0.6382, y: 0.3618 },
      objectBalls: [{ number: 1, x: 0.75, y: 0.25 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
        { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
      ],
      contactPoint: { x: 0, y: -0.1 },
      speed: 2.12,
      rate: 45,
      why: 'Mirror of the left shot. A touch below center stops the cue ball on the contact spot, 27" from the pocket.',
    },
  ],
} satisfies PoolDrill;
