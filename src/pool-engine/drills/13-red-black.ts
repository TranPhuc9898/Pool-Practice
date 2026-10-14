import type { PoolDrill } from '../types';

/** Ghép từ Cuestars Red-Black, đổi sang pool: bi 8 là key, 1 và 2 là "đỏ". Layout là suy luận chuyển đổi. */
export const redBlack = {
  id: '13',
  number: 13,
  title: 'Red-Black',
  subtitle: 'Pot a red, then the 8. Always from the correct side.',
  category: 'patternPlay',
  skill: 'correctSide',
  skillLabel: 'Correct Side',
  difficulty: 3,
  objective: 'Pot the 1, land on the correct side of the 8, pot the 8. Re-spot both and go again.',
  cueBall: { x: 0.24, y: 0.32 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.1875 },
    { number: 8, x: 0.5, y: 0.125 },
    { number: 2, x: 0.5, y: 0.0625 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.32, y: 0.21 }, radius: 0.07, label: '8' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'objectBallPath', ball: 8, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: -0.2 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    'Wrong side of the 8 counts as a miss, even if it drops.',
    'Ladder: 5, then 10, then 20 in a row.',
  ],
  steps: [
    { label: 'STEP 1', caption: 'Pot a red' },
    { label: 'STEP 2', caption: 'Correct side' },
    { label: 'STEP 3', caption: 'Pot the 8' },
  ],
} satisfies PoolDrill;
