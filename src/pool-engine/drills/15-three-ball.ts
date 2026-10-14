import type { PoolDrill } from '../types';

/** Scott Lee: tung 3 bi ngẫu nhiên. Đây là một layout mẫu, ngoài bàn tung lại sau mỗi lượt. */
export const threeBall = {
  id: '15',
  number: 15,
  title: 'Three-Ball, 30° Max',
  subtitle: 'Every shot must leave the next cut at 30° or less.',
  category: 'patternPlay',
  skill: 'runout',
  skillLabel: '3-Ball Pattern',
  difficulty: 3,
  objective: 'Ball in hand. Run 1, 2, 3. Any leave over 30° and the run does not count.',
  cueBall: { x: 0.55, y: 0.8 },
  objectBalls: [
    { number: 1, x: 0.3, y: 0.62 },
    { number: 2, x: 0.72, y: 0.35 },
    { number: 3, x: 0.35, y: 0.18 },
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.56, y: 0.5 }, radius: 0.09, label: '2' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.2 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 20,
  passCondition: { kind: 'pocketed', required: 15 },
  tips: [
    '15 of 20 clean runs, then move to 4 and 5 balls.',
    'Failed run: set it up again and pick a different route.',
  ],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Angle on 2' },
    { label: 'STEP 3', caption: 'Angle on 3' },
  ],
} satisfies PoolDrill;
