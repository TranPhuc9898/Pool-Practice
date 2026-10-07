import type { PoolDrill } from '../types';

export const threePositions = {
  id: '08',
  number: 8,
  title: 'Three Positions',
  subtitle: 'One shot, three cue-ball paths: draw, stun, follow.',
  category: 'cueBallControl',
  skill: 'threePositions',
  skillLabel: 'Stop / Draw / Follow',
  difficulty: 4,
  objective: 'Same cut each round. Land in A with draw, B with stun, C with follow.',
  cueBall: { x: 0.376, y: 0.578 },
  objectBalls: [{ number: 1, x: 0.3, y: 0.22 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.58, y: 0.248 }, radius: 0.07, label: 'A' },
    { kind: 'circle', center: { x: 0.574, y: 0.154 }, radius: 0.07, label: 'B' },
    { kind: 'circle', center: { x: 0.372, y: 0.114 }, radius: 0.07, label: 'C' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'tangentLine', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 9,
  passCondition: { kind: 'inZone', required: 6 },
  tips: ['The tangent is the stun line. Draw bends back from it, follow bends forward.'],
  rounds: [
    { title: 'A · Draw', zone: 0, spin: 'draw' },
    { title: 'B · Stun', zone: 1, spin: 'stun' },
    { title: 'C · Follow', zone: 2, spin: 'follow' },
  ],
} satisfies PoolDrill;
