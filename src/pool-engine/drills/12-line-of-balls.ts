import type { PoolDrill } from '../types';

/** BU Exam II S1, cấp Bachelors: 4 bi, khoảng hở 3 bi. */
export const lineOfBalls = {
  id: '12',
  number: 12,
  title: 'Line of Balls',
  subtitle: 'Four balls on the long string. Wrong angle and the line stops you.',
  category: 'patternPlay',
  skill: 'lineUp',
  skillLabel: 'Line-Up',
  difficulty: 3,
  objective: 'Ball in hand. Pot 1 to 4 in order without touching the others.',
  cueBall: { x: 0.8, y: 0.48 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.45 },
    { number: 2, x: 0.5, y: 0.36 },
    { number: 3, x: 0.5, y: 0.27 },
    { number: 4, x: 0.5, y: 0.18 },
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.66, y: 0.44 }, radius: 0.08, label: '2' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.3 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'soft',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    'Stay on the same side of the line the whole way.',
    'Masters: 7 balls, 2-ball gaps. Doctorate: 10 balls, 1-ball gaps.',
  ],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1 side' },
    { label: 'STEP 2', caption: 'Land left of 2' },
    { label: 'STEP 3', caption: 'Keep the angle' },
  ],
} satisfies PoolDrill;
