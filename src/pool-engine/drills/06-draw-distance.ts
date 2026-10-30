import type { PoolDrill } from '../types';

// Mỗi round mang guide riêng thì app tách zone theo round, không thì round nào cũng đánh zone đầu.
const guides: PoolDrill['guideLines'] = [{ kind: 'objectBallPath', ball: 1, pocket: 'footLeft' }];

export const drawDistance = {
  id: '06',
  number: 6,
  title: 'Draw Distance',
  subtitle: 'Control the amount of draw. Zones get smaller. Checked in simulation, not on a real table.',
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
  guideLines: guides,
  recommendedContactPoint: { x: 0, y: -0.5 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 9,
  passCondition: { kind: 'inZone', required: 6 },
  tips: ['No power draw needed.', 'Same tip height, change speed.'],
  rounds: [
    {
      title: '½ diamond',
      zone: 0,
      spin: 'draw',
      guideLines: guides,
      contactPoint: { x: 0, y: -0.5 },
      speed: 2.4,
      rate: 4,
      why: 'Full draw at 2.40 m/s pulls the cue ball 10" back from contact.',
    },
    {
      title: '1 diamond',
      zone: 1,
      spin: 'draw',
      guideLines: guides,
      contactPoint: { x: 0, y: -0.4 },
      speed: 2.74,
      rate: 2,
      why: 'Less tip, more speed: 2.74 m/s pulls the cue ball 10" back on a wider line.',
    },
    {
      title: '1½ diamonds',
      zone: 2,
      spin: 'draw',
      guideLines: guides,
      contactPoint: { x: 0, y: -0.5 },
      speed: 2.52,
      rate: 2,
      why: 'Full draw at 2.52 m/s pulls the cue ball 19" back from contact.',
    },
  ],
} satisfies PoolDrill;
