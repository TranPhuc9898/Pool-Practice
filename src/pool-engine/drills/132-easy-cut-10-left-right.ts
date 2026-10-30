import type { PoolDrill } from '../types';

/**
 * Easy Cut 10° Left/Right, bài mới cho hạng H theo deep-research-report (ý bài: cắt 10° hai phía, ngưỡng 7/10). Toạ độ
 * báo cáo không dùng. Bi 1 ở (12.5", 25") và gương phải, bi cái lùi 18" sau ghost ball, đường cơ lệch 10° [đề xuất]. Tip,
 * lực, rate lấy từ `cutLR("132", deg: 10)` của `scripts/position-harness/` trên ShotPhysics `65a775f`: 42/45 mẫu vào lỗ
 * sạch mỗi phía, bi cái dừng cách chỗ chạm 4". Chưa kiểm trên bàn thật.
 */
export const easyCutTenLeftRight = {
  id: '132',
  number: 132,
  title: 'Easy Cut 10° Left/Right',
  subtitle: 'A 10° cut into each foot corner, cue ball stops near contact. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Cut Angle',
  difficulty: 1,
  objective: 'Cut the 1-ball five times into the left corner, then five times into the right.',
  cueBall: { x: 0.4846, y: 0.4147 },
  objectBalls: [{ number: 1, x: 0.25, y: 0.25 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
      ],
  recommendedContactPoint: { x: 0, y: -0.4 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    'Find the ghost ball first, then walk into the line.',
    'A thin cut like this is mostly a straight shot. Do not over-cut.',
  ],
  mistakes: [
    'Ball hits the near point of the pocket: aimed too thick, the cut needs a touch more angle.',
    'Ball hits the far point: over-cut. Trust the ghost ball.',
  ],
  rounds: [
    {
      title: 'Left',
      spin: 'stun',
      cueBall: { x: 0.4846, y: 0.4147 },
      objectBalls: [{ number: 1, x: 0.25, y: 0.25 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
      ],
      contactPoint: { x: 0, y: -0.4 },
      speed: 1.72,
      rate: 42,
      why: 'A 10° cut from 18" behind the ghost ball. Below center at 1.72 m/s stops the cue ball 4" from contact.',
    },
    {
      title: 'Right',
      spin: 'stun',
      cueBall: { x: 0.5154, y: 0.4147 },
      objectBalls: [{ number: 1, x: 0.75, y: 0.25 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
        { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
      ],
      contactPoint: { x: 0, y: -0.4 },
      speed: 1.72,
      rate: 42,
      why: 'Mirror of the left shot. Below center at 1.72 m/s stops the cue ball 4" from contact.',
    },
  ],
} satisfies PoolDrill;
