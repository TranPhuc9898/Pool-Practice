import type { PoolDrill } from '../types';

/**
 * Thin Cut with Containment, bài mới cho hạng G theo deep-research-report (2) (ý bài: cắt mỏng, bi cái không chạy lung
 * tung). Toạ độ báo cáo không dùng. Bi 1 ở (10", 15") cắt 40° vào lỗ góc chân trái, bi cái ở (9.9", 28.8"), zone 8" ở
 * (29.5", 11") sau một băng chân [đề xuất]. Tip, lực, rate lấy từ `drill148()` của `scripts/position-harness/` trên
 * ShotPhysics `65a775f`: 26/45 mẫu vào sạch, chạm một băng, dừng trong zone. Chưa kiểm trên bàn thật.
 */
export const thinCutWithContainment = {
  id: '148',
  number: 148,
  title: 'Thin Cut with Containment',
  subtitle: 'A 40° cut with soft pace, keep the cue ball inside the zone. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Cut Angle',
  difficulty: 2,
  objective: 'Cut the 1-ball thin into the foot left corner. The cue ball touches one rail at most and stops in the zone.',
  cueBall: { x: 0.1986, y: 0.288 },
  objectBalls: [{ number: 1, x: 0.2, y: 0.15 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.59, y: 0.11 }, radius: 0.16 }],
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
  tips: ['Thin cuts need less pace than they look. Let the 1 crawl into the pocket.', 'Center ball: the cue ball keeps most of the speed, so soft is enough.'],
  mistakes: ['Cue ball runs two rails and out of the zone: too firm.', 'Overcut, the 1 hits the foot rail first: aim a touch fuller.'],
  rounds: [
    {
      title: 'Thin cut',
      spin: 'center',
      zone: 0,
      contactPoint: { x: 0, y: 0 },
      speed: 0.94,
      rate: 26,
      why: '40° cut. Center ball at 0.94 m/s, the cue ball runs along the tangent off the foot rail into the zone.',
    },
  ],
} satisfies PoolDrill;
