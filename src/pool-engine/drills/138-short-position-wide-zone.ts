import type { PoolDrill } from '../types';

/**
 * Short Position Wide Zone, bài mới cho hạng H theo deep-research-report (ý bài: cắt 10–15° rồi về một zone rộng, ngưỡng
 * 6/10). Toạ độ báo cáo không dùng. Bi 1 ở (15", 30") cắt 12° vào lỗ góc chân trái, bi cái lùi 25" sau ghost ball, zone
 * 8" ở (23.5", 29") [đề xuất]. Tip, lực, rate lấy từ `drill136()` của `scripts/position-harness/` trên ShotPhysics
 * `65a775f`: 24/45 mẫu vào sạch, dừng trong zone, không chạm băng. Chưa kiểm trên bàn thật.
 */
export const shortPositionWideZone = {
  id: '138',
  number: 138,
  title: 'Short Position Wide Zone',
  subtitle: 'A 12° cut, draw the cue ball back into a wide zone. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'drawAngle',
  skillLabel: 'Draw Angle',
  difficulty: 2,
  objective: 'Cut the 1-ball into the foot left corner and draw the cue ball into the zone without touching a rail.',
  cueBall: { x: 0.4459, y: 0.5621 },
  objectBalls: [{ number: 1, x: 0.3, y: 0.3 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.47, y: 0.29 }, radius: 0.16 }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.4 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 6 },
  tips: ['The zone is big. Pot the ball first, the draw only has to be close.', 'Low tip, medium stroke, let the cut angle carry the cue ball sideways.'],
  mistakes: ['Cue ball drifts toward the foot rail: not enough draw.', 'Cue ball comes back past the zone: too firm.'],
  rounds: [
    {
      title: 'Draw',
      spin: 'draw',
      zone: 0,
      contactPoint: { x: 0, y: -0.4 },
      speed: 2.06,
      rate: 24,
      why: '12° cut from 25". Low tip at 2.06 m/s draws the cue ball 8" off contact into the middle of the zone.',
    },
  ],
} satisfies PoolDrill;
