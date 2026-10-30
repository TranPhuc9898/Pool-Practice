import type { PoolDrill } from '../types';

/**
 * One-Rail Position – Long, bài mới cho hạng G theo deep-research-report (2) (ý bài: ăn bi, bi cái chạm một băng rồi lên
 * nửa bàn đối diện). Toạ độ báo cáo không dùng. Bi 1 ở (15", 15") cắt 20° vào lỗ góc chân trái, bi cái ở (22.9", 30.2"),
 * zone 10" ở (25", 51") quanh vạch giữa sau một băng chân [đề xuất]. Tip, lực, rate lấy từ `drill146()` của
 * `scripts/position-harness/` trên ShotPhysics `65a775f`: 22/45 mẫu vào sạch, chạm một băng, dừng trong zone. Rate thấp
 * nên ngưỡng 5/10. Chưa kiểm trên bàn thật.
 */
export const oneRailPositionLong = {
  id: '146',
  number: 146,
  title: 'One-Rail Position – Long',
  subtitle: 'A 20° cut with follow, the cue ball goes off the foot rail up to the middle of the table. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'oneRail',
  skillLabel: 'One Rail',
  difficulty: 3,
  objective: 'Cut the 1-ball into the foot left corner. The cue ball touches the foot rail once and travels up into the zone.',
  cueBall: { x: 0.4586, y: 0.3019 },
  objectBalls: [{ number: 1, x: 0.3, y: 0.15 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.5, y: 0.51 }, radius: 0.2 }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 5 },
  tips: ['High tip and a medium stroke. Follow carries the cue ball into the foot rail and back up the table.', 'Speed matters more than aim on the rail: the zone is wide.'],
  mistakes: ['Cue ball stops short of the middle: more pace.', 'Cue ball runs to the head rail: too firm.'],
  rounds: [
    {
      title: 'One rail long',
      spin: 'follow',
      zone: 0,
      contactPoint: { x: 0, y: 0.4 },
      speed: 1.58,
      rate: 22,
      why: '20° cut. High tip at 1.58 m/s follows into the foot rail and brings the cue ball back up to the middle of the table.',
    },
  ],
} satisfies PoolDrill;
