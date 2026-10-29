import type { PoolDrill } from '../types';

/**
 * English Check, mục 4 của `docs/research/pool-9ball/07-spin-and-deflection.md`. Thế bi lấy round 30° của drill 22:
 * cắt nửa bi sang trái vào lỗ góc, bi cái chạm phía phải bi 1 nên phê thuận là phê phải (x dương), phê nghịch là phê
 * trái. Round Center để có đường gốc. Engine có squirt và throw nhưng không có swerve, cơ nằm ngang. Lực, rate và số
 * squirt, throw trong why lấy từ `drill26()` của `scripts/position-harness/`.
 * Tip chỉ lấy claim VERIFIED của 07; số pivot và tỉ lệ trộn BHE/FHE còn chờ đo nên không đưa vào.
 */
export const englishCheck = {
  id: '26',
  number: 26,
  title: 'English Check',
  subtitle: 'Same half-ball cut three ways: center, outside, inside. See which way sidespin pushes the hit. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'english',
  skillLabel: 'English',
  difficulty: 3,
  objective: 'Pot the 1-ball in the corner with center ball, then outside and inside english, three shots each.',
  cueBall: { x: 0.6034, y: 0.5772 },
  objectBalls: [{ number: 1, x: 0.5, y: 0.3125 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 9,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'Keep the aim from the center round. Only the tip moves, so the miss tells you what the english did.',
    'Outside english here is right english. Squirt pushes the cue ball toward the center of the 1-ball, so the hit gets fuller.',
    'Inside english pushes it the other way: thinner hit.',
    'The effect is biggest on short, firm shots.',
    'BHE pivots the cue at the bridge, FHE at the back hand. Both cancel part of the squirt.',
  ],
  mistakes: [
    'Undercut with outside english: squirt made the hit too full. Note it, do not fix it mid-round.',
    'Overcut with inside english: the hit came out too thin.',
    'Missing the center round too: fix the aim first. The english rounds mean nothing without a clean baseline.',
    'Change one thing at a time. Never adjust aim and tip on the same shot.',
  ],
  rounds: [
    {
      title: 'Center',
      spin: 'center',
      contactPoint: { x: 0, y: 0 },
      speed: 1.7,
      rate: 15,
      why: 'Baseline: 30° cut at 1.7 m/s, no squirt. Collision throw alone pushes the 1-ball about 1.2° toward undercut.',
    },
    {
      title: 'Outside',
      spin: 'center',
      contactPoint: { x: 0.5, y: 0 },
      speed: 1.7,
      rate: 15,
      why: 'Squirt 2.5° makes the hit fuller. The spin goes past gearing and throws the 1-ball 1.2° the other way.',
    },
    {
      title: 'Inside',
      spin: 'center',
      contactPoint: { x: -0.5, y: 0 },
      speed: 1.75,
      rate: 15,
      why: 'Squirt 2.5° makes the hit thinner, and throw still adds 0.8° of undercut. Aim fuller than the center round.',
    },
  ],
} satisfies PoolDrill;
