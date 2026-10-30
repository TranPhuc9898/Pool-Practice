import type { PoolDrill } from '../types';

/**
 * Side-Pocket Easy Cut Left/Right, bài mới cho hạng H theo deep-research-report (1) (ý bài: cắt nhẹ vào lỗ giữa hai phía).
 * Toạ độ báo cáo không dùng. Bi 1 cách băng dài 12.5" ngang lỗ giữa và gương phải, bi cái lùi 18" sau ghost ball, đường cơ
 * lệch 10° [đề xuất]. Tip, lực, rate lấy từ `drill139()` của `scripts/position-harness/` trên ShotPhysics `65a775f`: 45/45
 * mẫu vào lỗ sạch mỗi phía, bi cái dừng cách chỗ chạm 6". Chưa kiểm trên bàn thật.
 */
export const sidePocketEasyCutLeftRight = {
  id: '139',
  number: 139,
  title: 'Side-Pocket Easy Cut Left/Right',
  subtitle: 'A 10° cut into each side pocket, cue ball stops near contact. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Cut Angle',
  difficulty: 1,
  objective: 'Cut the 1-ball five times into the left side pocket, then five times into the right.',
  cueBall: { x: 0.6495, y: 0.4687 },
  objectBalls: [{ number: 1, x: 0.25, y: 0.5 }],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.4 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    'The side pocket is narrower than a corner. Aim for the middle of the opening.',
    'Find the ghost ball first, then walk into the line.',
  ],
  mistakes: [
    'Ball rattles in the jaws: hit too hard. Medium pace is enough from here.',
    'Ball hits the near point: aimed too thick, the cut needs a touch more angle.',
  ],
  rounds: [
    {
      title: 'Left',
      spin: 'stun',
      cueBall: { x: 0.6495, y: 0.4687 },
      objectBalls: [{ number: 1, x: 0.25, y: 0.5 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
      ],
      contactPoint: { x: 0, y: -0.4 },
      speed: 1.92,
      rate: 45,
      why: 'A 10° cut into the side from 18" behind the ghost ball. Below center at 1.92 m/s stops the cue ball 6" from contact.',
    },
    {
      title: 'Right',
      spin: 'stun',
      cueBall: { x: 0.3505, y: 0.4687 },
      objectBalls: [{ number: 1, x: 0.75, y: 0.5 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'sideRight' },
        { kind: 'ghostBall', ball: 1, pocket: 'sideRight' },
      ],
      contactPoint: { x: 0, y: -0.4 },
      speed: 1.92,
      rate: 45,
      why: 'Mirror of the left shot. Below center at 1.92 m/s stops the cue ball 6" from contact.',
    },
  ],
} satisfies PoolDrill;
