import type { PoolDrill } from '../types';

/**
 * Hai bi, bi cái đặt sẵn đầu bàn: bi 1 gần thẳng dài vào góc foot right bằng follow, bi cái lăn về zone để lại cú cắt mỏng
 * 74° bi 2 vào góc foot left. Tự soạn cho giai đoạn 6 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. Zone, tip, lực và
 * `rate` chép từ `sh scripts/rack-harness/run.sh 104` trên ShotPhysics của working tree 2026-10-27. Chưa kiểm trên bàn thật.
 */
export const followToAThinCut = {
  id: '104',
  number: 104,
  title: 'Follow to a Thin Cut',
  // Zone, tip và lực chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'Long shot down the table, then a 74° cut. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Cut Angle',
  difficulty: 5,
  objective: 'Pot the 1 down the table with follow, then cut the 2 thin into the foot left corner.',
  cueBall: { x: 0.4, y: 0.85 },
  objectBalls: [
    { number: 1, x: 0.85, y: 0.2 },
    { number: 2, x: 0.15, y: 0.2 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.8555, y: 0.1794 }, radius: 0.08, label: '2' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.3 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: ['On the 74° cut aim at the edge of the 2, not at a ghost ball. A thin cut misses thick far more often than thin.'],
  mistakes: ['Thin cut hit thick: the 2 hits the foot rail short of the pocket.'],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Land here' },
    { label: 'STEP 3', caption: 'Cut 2' },
  ],
  shots: [
    { ball: 1, pocket: 'footRight', tipY: 0.3, speed: 0.8, zone: 0, rate: 2, why: '2° cut. Follow leaves the cue ball about 3 diamonds from ball 2 with a 74° cut into the foot left corner.' },
    { ball: 2, pocket: 'footLeft', tipY: 0.3, speed: 2.6, rate: 3, why: '74° cut, last ball. Follow at firm pace, the thin cut needs speed to reach the corner.' },
  ],
} satisfies PoolDrill;
