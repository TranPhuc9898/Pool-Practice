import type { PoolDrill } from '../types';

/**
 * Hai bi, bi cái đặt sẵn: bi 1 gần thẳng vào lỗ giữa phải bằng cú mềm gần center, bi cái lăn ngắn vào zone 2.5" để lại bi
 * 2 gần thẳng vào góc foot left. Tự soạn cho giai đoạn 6 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. Zone, tip, lực và
 * `rate` chép từ `sh scripts/rack-harness/run.sh 107` trên ShotPhysics của working tree 2026-10-27. Chưa kiểm trên bàn thật.
 */
export const softSidePocketStop = {
  id: '107',
  number: 107,
  title: 'Soft Side Pocket Stop',
  // Zone, tip và lực chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'A soft roll into the side, the cue ball stops short in a small zone. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'speedControl',
  skillLabel: 'Speed Control',
  difficulty: 5,
  objective: 'Pot the 1 in the right side pocket softly and stop the cue ball in the zone. Then pot the 2 in the foot left corner.',
  cueBall: { x: 0.3, y: 0.75 },
  objectBalls: [
    { number: 1, x: 0.7, y: 0.6 },
    { number: 2, x: 0.3, y: 0.25 },
  ],
  targetPocket: 'sideRight',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.7199, y: 0.5807 }, radius: 0.05, label: '2' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'sideRight' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.1 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: ['Side pockets reject fast balls. The soft speed that holds the cue ball is also the one that keeps the 1 in.'],
  mistakes: ['Cue ball rolls past the zone toward the side pocket: too firm, risk of a scratch.'],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Land here' },
    { label: 'STEP 3', caption: 'Pot 2' },
  ],
  shots: [
    { ball: 1, pocket: 'sideRight', tipY: 0.1, speed: 0.8, zone: 0, rate: 37, why: '3° cut. Center ball leaves the cue ball about 3 diamonds from ball 2 with a 2° cut into the foot left corner.' },
    { ball: 2, pocket: 'footLeft', tipY: 0.4, speed: 0.8, rate: 15, why: '2° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
