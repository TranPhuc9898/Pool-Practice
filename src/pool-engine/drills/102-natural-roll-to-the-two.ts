import type { PoolDrill } from '../types';

/**
 * Hai bi, bi cái đặt sẵn: cắt 21° bi 1 vào lỗ giữa trái bằng center ball lực nhẹ, bi cái đi theo góc tự nhiên vào zone 3"
 * rồi cắt 13° bi 2 vào góc head right. Tự soạn cho giai đoạn 5 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. Zone, tip, lực và
 * `rate` chép từ `sh scripts/rack-harness/run.sh 102` trên ShotPhysics của working tree 2026-10-27. Chưa kiểm trên bàn thật.
 */
export const naturalRollToTheTwo = {
  id: '102',
  number: 102,
  title: 'Natural Roll to the Two',
  // Zone, tip và lực chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'No spin, just speed: let the natural angle carry the cue ball. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'naturalAngle',
  skillLabel: 'Natural Angle',
  difficulty: 5,
  objective: 'Cut the 1 into the left side pocket with center ball and stop the cue ball inside the small zone. Then pot the 2 in the head right corner.',
  cueBall: { x: 0.6, y: 0.3 },
  objectBalls: [
    { number: 1, x: 0.25, y: 0.45 },
    { number: 2, x: 0.6, y: 0.8 },
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.2524, y: 0.5345 }, radius: 0.06, label: '2' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'headRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: ['Before you shoot, call where the cue ball stops. Speed is the only thing you change.'],
  mistakes: ['Cue ball drifts past the zone toward the head rail: too much speed.'],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Land here' },
    { label: 'STEP 3', caption: 'Pot 2' },
  ],
  shots: [
    { ball: 1, pocket: 'sideLeft', tipY: 0, speed: 0.8, zone: 0, rate: 25, why: '21° cut. Center ball leaves the cue ball about 3 diamonds from ball 2 with a 13° cut into the head right corner.' },
    { ball: 2, pocket: 'headRight', tipY: 0.4, speed: 0.8, rate: 15, why: '13° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
