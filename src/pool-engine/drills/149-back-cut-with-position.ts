import type { PoolDrill } from '../types';

/**
 * Back-Cut with Position, bài mới cho hạng G theo deep-research-report (2) (ý bài: cắt ngược, ăn bi và để bi cái vào
 * zone). Toạ độ báo cáo không dùng. Bi 1 ở (30", 12") cắt ngược 25° vào lỗ góc chân trái, bi cái ở (45.1", 12.1"), zone 6"
 * ở (4.5", 39") sau một băng [đề xuất]. Tip, lực, rate lấy từ `drill149()` của `scripts/position-harness/` trên
 * ShotPhysics `65a775f`: 22/45 mẫu vào sạch, chạm một băng, dừng trong zone. Rate thấp nên ngưỡng 5/10. Chưa kiểm trên
 * bàn thật.
 */
export const backCutWithPosition = {
  id: '149',
  number: 149,
  title: 'Back-Cut with Position',
  subtitle: 'A 25° back cut along the foot rail, send the cue ball up the left side. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Cut Angle',
  difficulty: 3,
  objective: 'Back-cut the 1-ball into the foot left corner. The cue ball touches one rail and stops in the zone.',
  cueBall: { x: 0.9014, y: 0.1211 },
  objectBalls: [{ number: 1, x: 0.6, y: 0.12 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.09, y: 0.39 }, radius: 0.12 }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 5 },
  tips: ['Aim the ghost ball, not the edge of the 1. Back cuts look thinner than they are.', 'Center ball, medium pace: the cue ball follows the tangent off the rail.'],
  mistakes: ['Undercut, the 1 hits the long rail before the corner: aim thinner.', 'Cue ball stops before the zone: a touch more pace.'],
  rounds: [
    {
      title: 'Back cut',
      spin: 'center',
      zone: 0,
      contactPoint: { x: 0, y: 0 },
      speed: 1.34,
      rate: 22,
      why: '25° back cut. Center ball at 1.34 m/s, the cue ball runs the tangent off one rail and up into the zone.',
    },
  ],
} satisfies PoolDrill;
