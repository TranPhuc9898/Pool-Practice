import type { PoolDrill } from '../types';

/**
 * One-Rail Position – Short, bài mới cho hạng G theo deep-research-report (2) (ý bài: ăn bi, bi cái chạm một băng rồi về
 * zone gần). Toạ độ báo cáo không dùng. Bi 1 ở (15", 15") cắt 20° vào lỗ góc chân trái, bi cái ở (30.2", 22.9"), zone 6"
 * ở (7", 20") sau một băng dọc trái [đề xuất]. Tip, lực, rate lấy từ `drill145()` của `scripts/position-harness/` trên
 * ShotPhysics `65a775f`: 37/45 mẫu vào sạch, chạm đúng một băng, dừng trong zone. Chưa kiểm trên bàn thật.
 */
export const oneRailPositionShort = {
  id: '145',
  number: 145,
  title: 'One-Rail Position – Short',
  subtitle: 'A 20° cut, the cue ball goes off the side rail into a near zone. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'oneRail',
  skillLabel: 'One Rail',
  difficulty: 2,
  objective: 'Cut the 1-ball into the foot left corner. The cue ball touches the left rail once and stops in the zone.',
  cueBall: { x: 0.6037, y: 0.2293 },
  objectBalls: [{ number: 1, x: 0.3, y: 0.15 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.14, y: 0.2 }, radius: 0.12 }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 6 },
  tips: ['Center ball. The rail does the turning, not the spin.', 'Pick the spot on the rail before you aim the 1.'],
  mistakes: ['Cue ball comes off the rail past the zone: too firm.', 'Cue ball dies before the rail: a touch more pace.'],
  rounds: [
    {
      title: 'One rail',
      spin: 'center',
      zone: 0,
      contactPoint: { x: 0, y: 0 },
      speed: 1.16,
      rate: 37,
      why: '20° cut. Center ball at 1.16 m/s sends the cue ball along the tangent into the left rail and back out into the zone.',
    },
  ],
} satisfies PoolDrill;
