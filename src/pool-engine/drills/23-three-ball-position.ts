import type { PoolDrill } from '../types';

/**
 * Ba bi bày sẵn, ba cú cố định: follow vào lỗ giữa phải, draw vào lỗ góc đầu bàn, bi 3 cùng lỗ. Cú 1 và cú 2 phải để
 * bi cái dừng trong zone, từ chính chỗ đó đánh được bi kế. Trường cấp bài (`targetPocket`, spin, lực) mô tả cú 1.
 * Toạ độ, tip, lực, zone và `rate` chép từ `sh scripts/position-harness/run.sh` trên ShotPhysics ddf3049
 * (`git log -1 --format=%h -- modules/pool-table/ios/Editor/ShotPhysics.swift`). Hash khác thì chạy lại harness, chép lại số.
 */
export const threeBallPosition = {
  id: '23',
  number: 23,
  title: 'Three-Ball Position',
  // Zone, tip, lực và tỉ lệ chỉ đo trên ShotPhysics, chưa đo bàn thật (plan `2026-10-18-hieu-chinh-engine.md` bước 2).
  subtitle: 'Pot each ball and stop the cue ball in the zone for the next one. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'runout',
  skillLabel: 'Position Play',
  difficulty: 3,
  objective: 'Cue ball where shown. Run 1, 2, 3 in order. After shots 1 and 2 the cue ball must stop inside the zone.',
  cueBall: { x: 0.47, y: 0.588 },
  objectBalls: [
    { number: 1, x: 0.69, y: 0.568 },
    { number: 2, x: 0.896, y: 0.79 },
    { number: 3, x: 0.852, y: 0.859 },
  ],
  targetPocket: 'sideRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.88, y: 0.699 }, radius: 0.07, label: '2' },
    { kind: 'circle', center: { x: 0.816, y: 0.765 }, radius: 0.07, label: '3' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'sideRight' },
    { kind: 'objectBallPath', ball: 2, pocket: 'headRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.3 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'Call the zone before every shot. Potted but out of the zone: log Pot and play the next ball from where the cue ball stopped.',
    'Run fails: put all three balls back and start again from shot 1.',
  ],
  mistakes: [
    'Cue ball stops short of zone 2: hit too soft or too low, the follow never took.',
    'Cue ball rolls after ball 2 toward the corner: tip too high, the draw wore off.',
  ],
  steps: [
    { label: 'SHOT 1', caption: 'Follow, pot 1' },
    { label: 'SHOT 2', caption: 'Draw, pot 2' },
    { label: 'SHOT 3', caption: 'Pot 3' },
  ],
  shots: [
    {
      ball: 1,
      pocket: 'sideRight',
      tipY: 0.3,
      speed: 1.4,
      zone: 0,
      rate: 37,
      why: 'Follow carries the cue ball past ball 1 and up to zone 2, about 9" below ball 2 with a 13° cut into the corner. Stop short and ball 2 becomes a thin cut along the rail.',
    },
    {
      ball: 2,
      pocket: 'headRight',
      tipY: -0.4,
      speed: 1.2,
      zone: 1,
      rate: 36,
      why: 'Draw pulls the cue ball back 7" instead of rolling after ball 2 into the corner, which leaves a 21° cut on ball 3 into the same pocket.',
    },
    {
      ball: 3,
      pocket: 'headRight',
      tipY: 0,
      speed: 1.4,
      rate: 45,
      why: 'Last ball, no position to play. Center ball, medium pace.',
    },
  ],
} satisfies PoolDrill;
