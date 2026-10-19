import type { PoolDrill } from '../types';

/**
 * Long Bank, mục 4 của `docs/research/pool-9ball/08-rail-and-kick-systems.md`: cùng góc bank, bi 1 lùi xa băng dần, tìm lực
 * tối thiểu. Bốn bi 1 nằm trên cùng đường tới lỗ ảo 0.8 W của drill 27 (P' = (90", 0)), nên điểm bank 0.8 W giữ nguyên
 * y = 19.58". Bi cái thẳng sau bi 1 cách 12". Harness: ở 0.8 m/s không round nào bank tới lỗ, 1.8 m/s chỉ tới ở round 1;
 * ở 2.6 m/s điểm bank engine lệch +0.1" đến +6.0" so với 0.8 W (k engine 0.84–1.82), quá một bi nên không có Play.
 */
export const longBank = {
  id: '28',
  number: 28,
  title: 'Long Bank',
  subtitle: 'Same bank angle, the 1-ball moves away from the rail. Find the softest speed that still drops it.',
  category: 'shotMaking',
  skill: 'bank',
  skillLabel: 'Bank',
  difficulty: 4,
  objective: 'Bank the 1-ball into the bottom-left corner as it moves off the rail, three shots per spot.',
  cueBall: { x: 0.6583, y: 0.2718 },
  objectBalls: [{ number: 1, x: 0.875, y: 0.2202 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallBankPath', points: [{ x: 0.875, y: 0.2202 }, { x: 0.9775, y: 0.1958 }, { x: 0, y: 0 }] },
    { kind: 'railContact', point: { x: 1, y: 0.1958 } },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 12,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'Same ghost pocket every round. Only the distance to the rail changes.',
    'The farther the 1-ball, the harder you hit: it has to reach the cushion still sliding.',
    'Find the softest speed that still drops it and note it for each spot.',
    '0.8 is a starting point, not the answer. Note short or long before you blame the speed.',
    'No Play here. The simulated cushion is not calibrated yet and banks more than a ball long.',
  ],
  mistakes: [
    'Soft on the far ball: the 1-ball is rolling by the cushion, topspin bends it off the line.',
    'Changing the aim between rounds. The ghost pocket stays put, only the speed moves.',
    'Any english. The ghost pocket only holds with a center hit.',
  ],
  rounds: [
    {
      title: '½ diamond',
      spin: 'center',
      cueBall: { x: 0.6583, y: 0.2718 },
      objectBalls: [{ number: 1, x: 0.875, y: 0.2202 }],
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.875, y: 0.2202 }, { x: 0.9775, y: 0.1958 }, { x: 0, y: 0 }] },
        { kind: 'railContact', point: { x: 1, y: 0.1958 } },
      ],
    },
    {
      title: '1 diamond',
      spin: 'center',
      cueBall: { x: 0.5333, y: 0.3016 },
      objectBalls: [{ number: 1, x: 0.75, y: 0.25 }],
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.75, y: 0.25 }, { x: 0.9775, y: 0.1958 }, { x: 0, y: 0 }] },
        { kind: 'railContact', point: { x: 1, y: 0.1958 } },
      ],
    },
    {
      title: '1½ diamonds',
      spin: 'center',
      cueBall: { x: 0.4083, y: 0.3314 },
      objectBalls: [{ number: 1, x: 0.625, y: 0.2798 }],
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.625, y: 0.2798 }, { x: 0.9775, y: 0.1958 }, { x: 0, y: 0 }] },
        { kind: 'railContact', point: { x: 1, y: 0.1958 } },
      ],
    },
    {
      title: '2½ diamonds',
      spin: 'center',
      cueBall: { x: 0.1583, y: 0.3909 },
      objectBalls: [{ number: 1, x: 0.375, y: 0.3393 }],
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.375, y: 0.3393 }, { x: 0.9775, y: 0.1958 }, { x: 0, y: 0 }] },
        { kind: 'railContact', point: { x: 1, y: 0.1958 } },
      ],
    },
  ],
} satisfies PoolDrill;
