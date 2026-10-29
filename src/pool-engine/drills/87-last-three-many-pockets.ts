import type { PoolDrill } from '../types';

/**
 * Ba bi cuối của bàn 9 bi, mỗi bi có hai ba lỗ đi được, chọn lỗ để còn đường cho bi kế. Tự soạn cho giai đoạn 5 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. Tip, lực và `rate`
 * chép từ `sh scripts/rack-harness/run.sh 87` trên ShotPhysics ddf3049 cộng thay đổi chưa commit trong working tree,
 * không phải route duy nhất. Ngưỡng 7/10 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const lastThreeManyPockets = {
  id: '87',
  number: 87,
  title: 'Last Three, Many Pockets',
  subtitle: 'Three balls, several pockets each. Pick the pocket that leaves the next shot. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'runout',
  skillLabel: 'Runout',
  difficulty: 5,
  objective: 'Ball in hand for shot 1 only. Run 7, 8, 9 in order. Before each shot, name the pocket and where the cue ball stops.',
  cueBall: { x: 0.379, y: 0.5053 },
  objectBalls: [
    { number: 7, x: 0.3, y: 0.4 },
    { number: 8, x: 0.7, y: 0.55 },
    { number: 9, x: 0.45, y: 0.2 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.2542, y: 0.339 }, radius: 0.08, label: '8' },
    { kind: 'circle', center: { x: 0.4685, y: 0.5733 }, radius: 0.08, label: '9' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 7, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 7, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 7, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 2,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    'Each ball has more than one pocket. Choose the one whose cue ball path ends with an angle on the next ball.',
    'A straight-in on the next ball is a trap: you lose the angle to move the cue ball.',
  ],
  mistakes: ['Picking the nearest pocket every time: the 9 ends up with no angle to any pocket.'],
  shots: [
    { ball: 7, pocket: 'footLeft', tipY: 0.4, speed: 0.8, zone: 0, rate: 28, why: '0° cut. Follow leaves the cue ball about 2 diamonds from ball 8 with a 30° cut into the head right corner.' },
    { ball: 8, pocket: 'headRight', tipY: 0.4, speed: 1, zone: 1, rate: 5, why: '30° cut. Follow leaves the cue ball about 3 diamonds from ball 9 with a 50° cut into the foot left corner.' },
    { ball: 9, pocket: 'footLeft', tipY: 0.4, speed: 1.2, rate: 15, why: '50° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
