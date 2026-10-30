import type { PoolDrill } from '../types';

// Mỗi round mang guide riêng thì app tách zone theo round, không thì round nào cũng đánh zone đầu.
const guides: PoolDrill['guideLines'] = [
  { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
  { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  { kind: 'tangentLine', ball: 1, pocket: 'footLeft' },
];

export const threePositions = {
  id: '08',
  number: 8,
  title: 'Three Positions',
  subtitle: 'One shot, three cue-ball paths: draw, stun, follow. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'threePositions',
  skillLabel: 'Stop / Draw / Follow',
  difficulty: 4,
  objective: 'Same cut each round. Land in A with draw, B with stun, C with follow.',
  cueBall: { x: 0.354, y: 0.459 },
  objectBalls: [{ number: 1, x: 0.3, y: 0.26 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.737, y: 0.257 }, radius: 0.07, label: 'A' },
    { kind: 'circle', center: { x: 0.817, y: 0.07 }, radius: 0.07, label: 'B' },
    { kind: 'circle', center: { x: 0.523, y: 0.109 }, radius: 0.07, label: 'C' },
  ],
  guideLines: guides,
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 9,
  passCondition: { kind: 'inZone', required: 6 },
  tips: ['The tangent is the stun line. Draw bends back from it, follow bends forward.'],
  rounds: [
    {
      title: 'A · Draw',
      zone: 0,
      spin: 'draw',
      guideLines: guides,
      contactPoint: { x: 0, y: -0.5 },
      speed: 1.82,
      rate: 3,
      why: 'Full draw at 1.82 m/s sends the cue ball 22" off contact to A.',
    },
    {
      title: 'B · Stun',
      zone: 1,
      spin: 'stun',
      guideLines: guides,
      contactPoint: { x: 0, y: -0.3 },
      speed: 1.72,
      rate: 3,
      why: 'Less draw at 1.72 m/s holds the tangent line 30" to B.',
    },
    {
      title: 'C · Follow',
      zone: 2,
      spin: 'follow',
      guideLines: guides,
      contactPoint: { x: 0, y: 0.4 },
      speed: 0.74,
      rate: 15,
      why: 'Follow at 0.74 m/s bends the cue ball forward 23" to C.',
    },
  ],
} satisfies PoolDrill;
