import type { PoolDrill } from '../types';

/** L-drill bản 9 bi, khoảng hở 2 bi (bản gốc 15 bi, hở 1 bi). Góc chữ L trên foot spot. */
export const lDrill = {
  id: '14',
  number: 14,
  title: 'L-Drill',
  subtitle: 'Nine balls in an L. Run them in order, touch nothing.',
  category: 'patternPlay',
  skill: 'lineUp',
  skillLabel: 'Line-Up',
  difficulty: 4,
  objective: 'Ball in hand. Pot 1 to 9 in order without hitting another ball.',
  cueBall: { x: 0.72, y: 0.68 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.5875 },
    { number: 2, x: 0.5, y: 0.52 },
    { number: 3, x: 0.5, y: 0.4525 },
    { number: 4, x: 0.5, y: 0.385 },
    { number: 5, x: 0.5, y: 0.3175 },
    { number: 6, x: 0.5, y: 0.25 },
    { number: 7, x: 0.635, y: 0.25 },
    { number: 8, x: 0.77, y: 0.25 },
    { number: 9, x: 0.905, y: 0.25 },
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
    { kind: 'tangentLine', ball: 1, pocket: 'sideLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.2 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'soft',
  allowedRails: 1,
  attemptCount: 6,
  passCondition: { kind: 'pocketed', required: 4 },
  tips: [
    'Harder: no rails at all, or every ball in one corner.',
    'Progressive: clear it 2 of 3, then add a ball and close the gaps.',
  ],
} satisfies PoolDrill;
