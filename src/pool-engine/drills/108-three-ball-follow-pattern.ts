import type { PoolDrill } from '../types';

/**
 * Ba bi, bi cái đặt sẵn giữa bàn: bi 1 vào góc head left, bi 2 vào góc foot right, bi 3 vào góc foot left, cả ba bằng
 * follow, mỗi cú đưa bi cái vào zone 3" cho bi kế. Tự soạn cho giai đoạn 6 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. Zone, tip, lực và
 * `rate` chép từ `sh scripts/rack-harness/run.sh 108` trên ShotPhysics của working tree 2026-10-27. Chưa kiểm trên bàn thật.
 */
export const threeBallFollowPattern = {
  id: '108',
  number: 108,
  title: 'Three-Ball Follow Pattern',
  // Zone, tip và lực chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'Three balls, three corners, follow into each zone. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'pattern',
  skillLabel: 'Pattern Play',
  difficulty: 5,
  objective: 'Run the 1, 2 and 3 in order, landing the cue ball in each zone. Count it only when all three go.',
  cueBall: { x: 0.5, y: 0.55 },
  objectBalls: [
    { number: 1, x: 0.25, y: 0.7 },
    { number: 2, x: 0.7, y: 0.3 },
    { number: 3, x: 0.3, y: 0.2 },
  ],
  targetPocket: 'headLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.0797, y: 0.7152 }, radius: 0.06, label: '2' },
    { kind: 'circle', center: { x: 0.9216, y: 0.258 }, radius: 0.06, label: '3' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'headLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'headLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'headLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.3 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: ['Walk the pattern before the first shot: where the cue ball must stop for the 2, then for the 3.'],
  mistakes: ['Cue ball short of zone 3: the 49° cut on the 3 gets thinner than it needs to be.'],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Pot 2' },
    { label: 'STEP 3', caption: 'Pot 3' },
  ],
  shots: [
    { ball: 1, pocket: 'headLeft', tipY: 0.3, speed: 0.8, zone: 0, rate: 16, why: '19° cut. Follow leaves the cue ball about 4 diamonds from ball 2 with an 11° cut into the foot right corner.' },
    { ball: 2, pocket: 'footRight', tipY: 0.3, speed: 1, zone: 1, rate: 11, why: '11° cut. Follow leaves the cue ball about 3 diamonds from ball 3 with a 45° cut into the foot left corner.' },
    { ball: 3, pocket: 'footLeft', tipY: 0.4, speed: 1, rate: 15, why: '45° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
