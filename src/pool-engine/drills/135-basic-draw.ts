import type { PoolDrill } from '../types';

/**
 * Basic Draw, bài mới cho hạng H theo deep-research-report (ý bài: draw về zone, ngưỡng 6/10). Toạ độ báo cáo không dùng.
 * Bi 1 ở (12.5", 25") thẳng vào lỗ góc chân trái, bi cái lùi 12.5" sau ghost ball, zone 6" kéo về 6" sau chỗ chạm
 * [đề xuất]. Tip, lực, rate lấy từ `drill134()` của `scripts/position-harness/` trên ShotPhysics `65a775f`: 29/45 mẫu vào
 * sạch, dừng trong zone, không chạm băng. Chưa kiểm trên bàn thật.
 */
export const basicDraw = {
  id: '135',
  number: 135,
  title: 'Basic Draw',
  subtitle: 'Straight in, draw the cue ball back half a diamond. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'draw',
  skillLabel: 'Draw',
  difficulty: 1,
  objective: 'Pot the 1-ball and draw the cue ball back into the zone without touching a rail.',
  cueBall: { x: 0.3819, y: 0.3819 },
  objectBalls: [{ number: 1, x: 0.25, y: 0.25 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.324, y: 0.324 }, radius: 0.12 }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.5 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 6 },
  tips: ['Half a tip below center, smooth stroke through the ball.', 'Keep the cue level. Lifting the butt kills the draw.'],
  mistakes: ['Cue ball stops dead: the tip is not low enough or the stroke quits at the ball.', 'Draws past the zone: too firm.'],
  rounds: [
    {
      title: 'Draw',
      spin: 'draw',
      zone: 0,
      contactPoint: { x: 0, y: -0.5 },
      speed: 1.48,
      rate: 29,
      why: 'Straight in from one diamond. Low tip at 1.48 m/s pulls the cue ball 2" back from contact, inside the zone.',
    },
  ],
} satisfies PoolDrill;
