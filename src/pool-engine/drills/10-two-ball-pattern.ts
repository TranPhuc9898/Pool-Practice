import type { PoolDrill } from '../types';

export const twoBallPattern = {
  id: '10',
  number: 10,
  title: 'Two-Ball Pattern',
  subtitle: "Don't play only the current shot. Play the next shot.",
  category: 'patternPlay',
  skill: 'pattern',
  skillLabel: 'Pattern Play',
  difficulty: 5,
  objective: 'Pocket the 1, land in the zone, then pocket the 2.',
  cueBall: { x: 0.6, y: 0.75 },
  objectBalls: [
    { number: 1, x: 0.8, y: 0.3 },
    { number: 2, x: 0.24, y: 0.4 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.404, y: 0.572 }, radius: 0.09, label: '2' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footRight' },
    {
      kind: 'expectedCuePath',
      points: [
        { x: 0.786, y: 0.321 },
        { x: 0.404, y: 0.572 },
      ],
    },
    { kind: 'objectBallPath', ball: 2, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.3 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: ['Decide where the cue ball goes before you aim the 1.'],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Land here' },
    { label: 'STEP 3', caption: 'Pot 2' },
  ],
} satisfies PoolDrill;
