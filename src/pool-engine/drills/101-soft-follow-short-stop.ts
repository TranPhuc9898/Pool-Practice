import type { PoolDrill } from '../types';

/**
 * Hai bi, bi cái đặt sẵn: follow nhẹ bi 1 thẳng vào góc head left, bi cái lăn theo rồi dừng trong zone 3" ngay sau chỗ
 * bi 1, để cắt 8° bi 2 vào góc foot left. Tự soạn cho giai đoạn 5 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. Zone, tip, lực và
 * `rate` chép từ `sh scripts/rack-harness/run.sh 101` trên ShotPhysics của working tree 2026-10-27. Chưa kiểm trên bàn thật.
 */
export const softFollowShortStop = {
  id: '101',
  number: 101,
  title: 'Soft Follow, Short Stop',
  // Zone, tip và lực chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'Follow just enough to stop a few inches past contact. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'followDistance',
  skillLabel: 'Follow Distance',
  difficulty: 5,
  objective: 'Follow the 1 into the head left corner and stop the cue ball inside the small zone. Then pot the 2 in the foot left corner.',
  cueBall: { x: 0.54, y: 0.55 },
  objectBalls: [
    { number: 1, x: 0.3, y: 0.75 },
    { number: 2, x: 0.2, y: 0.45 },
  ],
  targetPocket: 'headLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.2566, y: 0.7861 }, radius: 0.06, label: '2' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'headLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'headLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'headLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.3 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: ['The pocket is close behind the zone. Let the speed, not the tip, decide how far the cue ball rolls.'],
  mistakes: ['Cue ball follows into the corner: too firm for a straight shot this close to the pocket.'],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Land here' },
    { label: 'STEP 3', caption: 'Pot 2' },
  ],
  shots: [
    { ball: 1, pocket: 'headLeft', tipY: 0.3, speed: 0.8, zone: 0, rate: 35, why: '0° cut. Follow leaves the cue ball about 3 diamonds from ball 2 with an 8° cut into the foot left corner.' },
    { ball: 2, pocket: 'footLeft', tipY: 0.3, speed: 1, rate: 15, why: '8° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
