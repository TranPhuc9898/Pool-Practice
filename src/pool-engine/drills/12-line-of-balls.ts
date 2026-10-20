import type { PoolDrill } from '../types';

/**
 * BU Exam II S1, cấp Bachelors: 4 bi, khoảng hở 3 bi. Bốn cú cố định đổi bên dãy bi: 1 lỗ giữa trái, 2 góc chân phải,
 * 3 lỗ giữa trái, 4 lỗ giữa phải. Cú 1–3 phải để bi cái dừng trong zone. Trường cấp bài (`targetPocket`, spin, lực) mô tả cú 1.
 * Tip, lực, zone và `rate` chép từ beam search + verifier 45 mẫu trên ShotPhysics ddf3049
 * (`git log -1 --format=%h -- modules/pool-table/ios/Editor/ShotPhysics.swift`). Hash khác thì chạy lại, chép lại số.
 */
export const lineOfBalls = {
  id: '12',
  number: 12,
  title: 'Line of Balls',
  // Zone, tip, lực và tỉ lệ chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'Four balls on the long string. Wrong angle and the line stops you. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'lineUp',
  skillLabel: 'Line-Up',
  difficulty: 3,
  objective: 'Cue ball where shown. Run 1 to 4 in order without touching the others. After shots 1 to 3 the cue ball must stop inside the zone.',
  cueBall: { x: 0.66, y: 0.43 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.45 },
    { number: 2, x: 0.5, y: 0.36 },
    { number: 3, x: 0.5, y: 0.27 },
    { number: 4, x: 0.5, y: 0.18 },
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.3, y: 0.5 }, radius: 0.1, label: '2' },
    { kind: 'circle', center: { x: 0.63, y: 0.24 }, radius: 0.1, label: '3' },
    { kind: 'circle', center: { x: 0.32, y: 0.05 }, radius: 0.1, label: '4' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.6 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    'Cross the line on purpose: left of it for 2, right for 3, left again for 4. Never through it.',
    'Run fails: put all four balls back and start again from shot 1.',
    'Masters: 7 balls, 2-ball gaps. Doctorate: 10 balls, 1-ball gaps.',
  ],
  steps: [
    { label: 'SHOT 1', caption: 'Soft follow, pot 1' },
    { label: 'SHOT 2', caption: 'Center, pot 2' },
    { label: 'SHOT 3', caption: 'Follow, pot 3' },
    { label: 'SHOT 4', caption: 'Pot 4' },
  ],
  shots: [
    {
      ball: 1,
      pocket: 'sideLeft',
      tipY: 0.6,
      speed: 0.8,
      zone: 0,
      rate: 32,
      why: 'Near-straight into the side, so soft follow rolls the cue ball 11" after ball 1 to the left of the line. From there ball 2 is almost straight into the right foot corner.',
    },
    {
      ball: 2,
      pocket: 'footRight',
      tipY: 0,
      speed: 1.4,
      zone: 1,
      rate: 27,
      why: 'Almost straight, so center ball rolls the cue ball 13" after ball 2 down the same line, passing right of ball 3. That leaves a 25° cut on 3 back to the left side.',
    },
    {
      ball: 3,
      pocket: 'sideLeft',
      tipY: 0.4,
      speed: 1.4,
      zone: 2,
      rate: 40,
      why: 'The cut sends the cue ball down to the foot rail; follow keeps it moving left so it settles behind ball 4 for a near-straight shot to the right side.',
    },
    {
      ball: 4,
      pocket: 'sideRight',
      tipY: -0.2,
      speed: 1.6,
      rate: 33,
      why: 'Last ball, 18" away. A touch of draw stops the cue ball from following 4 into the side.',
    },
  ],
} satisfies PoolDrill;
