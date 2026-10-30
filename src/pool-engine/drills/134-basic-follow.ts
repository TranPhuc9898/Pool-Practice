import type { PoolDrill } from '../types';

/**
 * Basic Follow, bài mới cho hạng H theo deep-research-report (ý bài: follow vào zone, ngưỡng 7/10). Toạ độ báo cáo không
 * dùng. Bi 1 ở (12.5", 25") thẳng vào lỗ góc chân trái, bi cái lùi 18" sau ghost ball, zone 6" lăn theo 6" qua chỗ chạm
 * [đề xuất]. Tip, lực, rate lấy từ `drill134()` của `scripts/position-harness/` trên ShotPhysics `65a775f`: 30/45 mẫu vào
 * sạch, dừng trong zone, không chạm băng. Chưa kiểm trên bàn thật.
 */
export const basicFollow = {
  id: '134',
  number: 134,
  title: 'Basic Follow',
  subtitle: 'Straight in, roll the cue ball half a diamond past contact. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'follow',
  skillLabel: 'Follow',
  difficulty: 1,
  objective: 'Pot the 1-ball and follow the cue ball into the zone without touching a rail.',
  cueBall: { x: 0.4311, y: 0.4311 },
  objectBalls: [{ number: 1, x: 0.25, y: 0.25 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.216, y: 0.216 }, radius: 0.12 }],
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
  passCondition: { kind: 'inZone', required: 7 },
  tips: ['A little above center and a soft stroke. The pocket is close behind the zone.', 'Follow through straight down the line.'],
  mistakes: ['Cue ball scratches: too much speed, not too much top.', 'Cue ball stops at contact: the tip is too low.'],
  rounds: [
    {
      title: 'Follow',
      spin: 'follow',
      zone: 0,
      contactPoint: { x: 0, y: 0.2 },
      speed: 0.86,
      rate: 30,
      why: 'Straight in from 18". A touch of top at 0.86 m/s rolls the cue ball 7" past contact and keeps it out of the pocket.',
    },
  ],
} satisfies PoolDrill;
