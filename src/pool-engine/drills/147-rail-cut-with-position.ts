import type { PoolDrill } from '../types';

/**
 * Rail Cut with Position, bài mới cho hạng G theo deep-research-report (2) (ý bài: bi sát băng dài, ăn dọc băng và để bi
 * cái vào zone). Toạ độ báo cáo không dùng. Bi 1 ở (1.5", 30") sát băng trái, cắt 19° vào lỗ góc chân trái, bi cái ở
 * (8.4", 48.8"), zone 6" ở (10.5", 26") [đề xuất]. Tip, lực, rate lấy từ `drill147()` của `scripts/position-harness/`
 * trên ShotPhysics `65a775f`: 25/45 mẫu vào sạch, chạm tối đa một băng, dừng trong zone. Chưa kiểm trên bàn thật.
 */
export const railCutWithPosition = {
  id: '147',
  number: 147,
  title: 'Rail Cut with Position',
  subtitle: 'Pot the ball frozen on the side rail and leave the cue ball in the zone. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Rail Cut',
  difficulty: 2,
  objective: 'Cut the 1-ball down the left rail into the foot left corner and stop the cue ball in the zone.',
  cueBall: { x: 0.1673, y: 0.4879 },
  objectBalls: [{ number: 1, x: 0.0305, y: 0.3 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.21, y: 0.26 }, radius: 0.12 }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.2 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 6 },
  tips: ['Soft pace keeps the 1 hugging the rail all the way to the corner.', 'A touch of top so the cue ball drifts forward instead of stopping on the rail.'],
  mistakes: ['The 1 jumps off the rail and hits the corner point: too firm.', 'Cue ball sticks to the rail: hit a touch higher.'],
  rounds: [
    {
      title: 'Rail cut',
      spin: 'follow',
      zone: 0,
      contactPoint: { x: 0, y: 0.2 },
      speed: 0.92,
      rate: 25,
      why: '19° rail cut. A touch of top at 0.92 m/s keeps the 1 on the rail and rolls the cue ball into the zone.',
    },
  ],
} satisfies PoolDrill;
