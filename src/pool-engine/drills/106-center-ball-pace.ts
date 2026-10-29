import type { PoolDrill } from '../types';

/**
 * Hai bi, bi cái đặt sẵn: cắt 21° bi 1 vào góc foot left bằng center ball, chỉ lực quyết bi cái dừng trong zone 2.5" sát
 * băng trái, rồi cắt 33° bi 2 vào góc head right. Tự soạn cho giai đoạn 6 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. Zone, tip, lực và
 * `rate` chép từ `sh scripts/rack-harness/run.sh 106` trên ShotPhysics của working tree 2026-10-27. Chưa kiểm trên bàn thật.
 */
export const centerBallPace = {
  id: '106',
  number: 106,
  title: 'Center Ball Pace',
  // Zone, tip và lực chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'Center ball, only the speed puts the cue ball in a small zone. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'speedControl',
  skillLabel: 'Speed Control',
  difficulty: 5,
  objective: 'Cut the 1 into the foot left corner with center ball and stop the cue ball in the zone. Then pot the 2 in the head right corner.',
  cueBall: { x: 0.6, y: 0.45 },
  objectBalls: [
    { number: 1, x: 0.3, y: 0.3 },
    { number: 2, x: 0.75, y: 0.6 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.0519, y: 0.2939 }, radius: 0.05, label: '2' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'headRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: ['Keep the tip on center every time. Change only the speed until the cue ball stops in the zone.'],
  mistakes: ['Cue ball comes off the left rail past the zone: too firm, the 2 gets longer and thinner.'],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Land here' },
    { label: 'STEP 3', caption: 'Pot 2' },
  ],
  shots: [
    { ball: 1, pocket: 'footLeft', tipY: 0, speed: 1.2, zone: 0, rate: 41, why: '21° cut. Center ball leaves the cue ball about 4 diamonds from ball 2 with a 33° cut into the head right corner.' },
    { ball: 2, pocket: 'headRight', tipY: 0.5, speed: 1, rate: 15, why: '33° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
