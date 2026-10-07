import type { PoolDrill } from '../types';

export const oneRail = {
  id: '09',
  number: 9,
  title: 'One Rail',
  subtitle: 'Use one cushion to bring the cue ball back to the middle.',
  category: 'cueBallControl',
  skill: 'oneRail',
  skillLabel: 'One Rail Position',
  difficulty: 4,
  objective: 'Pocket the 1-ball, go one rail, land in the zone. No side spin.',
  cueBall: { x: 0.2, y: 0.25 },
  objectBalls: [{ number: 1, x: 0.8, y: 0.15 }],
  targetPocket: 'footRight',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.612, y: 0.358 }, radius: 0.09 }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footRight' },
    {
      kind: 'expectedCuePath',
      points: [
        { x: 0.775, y: 0.1687 },
        { x: 0.9775, y: 0.236 },
        { x: 0.612, y: 0.358 },
      ],
    },
    { kind: 'railContact', point: { x: 1, y: 0.236 } },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 6 },
  tips: ['Natural angle first, speed second.', 'Watch the rail contact, not the cue ball.'],
} satisfies PoolDrill;
