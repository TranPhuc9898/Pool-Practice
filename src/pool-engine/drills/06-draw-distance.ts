import type { PoolDrill } from '../types';

export const drawDistance = {
  id: '06',
  number: 6,
  title: 'Draw Distance',
  subtitle: 'Control the amount of draw. Zones get smaller.',
  category: 'cueBallControl',
  skill: 'drawDistance',
  skillLabel: 'Draw Distance',
  difficulty: 3,
  objective: 'Draw back ½, then 1, then 1½ diamonds.',
  cueBall: { x: 0.825, y: 0.516 },
  objectBalls: [{ number: 1, x: 0.4, y: 0.25 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.506, y: 0.316 }, radius: 0.07, label: '½' },
    { kind: 'circle', center: { x: 0.584, y: 0.365 }, radius: 0.06, label: '1' },
    { kind: 'circle', center: { x: 0.662, y: 0.414 }, radius: 0.05, label: '1½' },
  ],
  guideLines: [{ kind: 'objectBallPath', ball: 1, pocket: 'footLeft' }],
  recommendedContactPoint: { x: 0, y: -0.5 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 9,
  passCondition: { kind: 'inZone', required: 6 },
  tips: ['No power draw needed.', 'Same tip height, change speed.'],
  rounds: [
    { title: '½ diamond', zone: 0, spin: 'draw' },
    { title: '1 diamond', zone: 1, spin: 'draw' },
    { title: '1½ diamonds', zone: 2, spin: 'draw' },
  ],
} satisfies PoolDrill;
