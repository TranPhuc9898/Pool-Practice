import type { PoolDrill } from '../types';

/**
 * Stun-Follow to Zone, bài mới cho hạng G theo deep-research-report (2) (ý bài: cắt nhẹ, lăn bi cái vào zone trước
 * tiếp tuyến). Toạ độ báo cáo không dùng. Bi 1 ở (15", 30") cắt 15° vào lỗ góc chân trái, bi cái lùi 18" sau ghost ball,
 * zone 6" ở (20.5", 20") [đề xuất]. Tip ép +0.2 để khác 98 (stop thẳng). Tip, lực, rate lấy từ `drill142()` của
 * `scripts/position-harness/` trên ShotPhysics `65a775f`: 27/45 mẫu vào sạch, dừng trong zone, không chạm băng. Chưa kiểm
 * trên bàn thật.
 */
export const stunFollowToZone = {
  id: '142',
  number: 142,
  title: 'Stun-Follow to Zone',
  subtitle: 'A 15° cut, roll the cue ball a few inches past contact into the zone. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'follow',
  skillLabel: 'Follow',
  difficulty: 2,
  objective: 'Cut the 1-ball into the foot left corner and roll the cue ball into the zone without touching a rail.',
  cueBall: { x: 0.3923, y: 0.4965 },
  objectBalls: [{ number: 1, x: 0.3, y: 0.3 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.41, y: 0.2 }, radius: 0.12 }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.2 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 6 },
  tips: ['A touch above center and a soft stroke. The cue ball only has to drift forward a little.', 'Watch the tangent line: the cut sends the cue ball right, the top bends it forward.'],
  mistakes: ['Cue ball slides straight along the tangent: hit a touch higher.', 'Cue ball rolls past the zone toward the foot rail: too firm.'],
  rounds: [
    {
      title: 'Follow',
      spin: 'follow',
      zone: 0,
      contactPoint: { x: 0, y: 0.2 },
      speed: 0.86,
      rate: 27,
      why: '15° cut from 18". A touch of top at 0.86 m/s bends the cue ball forward off the tangent into the zone.',
    },
  ],
} satisfies PoolDrill;
