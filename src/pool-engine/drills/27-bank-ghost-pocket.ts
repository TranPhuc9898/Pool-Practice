import type { PoolDrill } from '../types';

/**
 * Bank Ghost Pocket, clip #10 và mục 4 của `docs/research/pool-9ball/08-rail-and-kick-systems.md`. Bank băng phải sang lỗ góc
 * footLeft. Lỗ ảo cách băng 0.8 W = 40", cùng hoành độ lỗ, đo từ mũi băng: P' = (90", 0). Điểm bank 0.8 W là giao của
 * bi 1 → P' với đường tâm bi lúc chạm băng (x = 48.875"). Bi cái đặt thẳng sau bi 1 cách 14" theo hướng điểm bank.
 * Bốn round: bi 1 cách băng 1 và 2 diamond, cao 2 và 3 diamond. Harness: engine chỉ bank tới lỗ ở 2.6 m/s, điểm bank
 * engine lệch +0.85" đến +6.3" so với 0.8 W (k engine 1.00–1.90), quá một bi nên không có Play.
 */
export const bankGhostPocket = {
  id: '27',
  number: 27,
  title: 'Bank Ghost Pocket',
  subtitle: 'Aim the 1-ball at a ghost pocket past the rail and bank it into the corner.',
  category: 'shotMaking',
  skill: 'bank',
  skillLabel: 'Bank',
  difficulty: 3,
  objective: 'Bank the 1-ball off the right rail into the bottom-left corner from four spots, three shots each.',
  cueBall: { x: 0.4972, y: 0.3102 },
  objectBalls: [{ number: 1, x: 0.75, y: 0.25 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallBankPath', points: [{ x: 0.75, y: 0.25 }, { x: 0.9775, y: 0.1958 }, { x: 0, y: 0 }] },
    { kind: 'railContact', point: { x: 1, y: 0.1958 } },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'firm',
  allowedRails: 1,
  attemptCount: 12,
  passCondition: { kind: 'pocketed', required: 8 },
  tips: [
    'The ghost pocket sits 0.8 table widths past the bank rail, level with the corner. Send the 1-ball at it.',
    '0.8 is a starting point, not the answer. Tables bank anywhere from about 0.6 to 0.9: note short or long and move the ghost pocket.',
    'It works best with the 1-ball close to the rail. Hit firm so the 1-ball is still sliding when it reaches the cushion.',
    'No Play here. The simulated cushion is not calibrated yet and banks more than a ball long.',
  ],
  mistakes: [
    'Mirror aiming at the rail: it always comes up short.',
    'Cut to the outside banks short, cut to the inside banks long. Keep the cue ball almost straight behind the 1-ball.',
    'Rolling the 1-ball into the cushion: topspin bends it after the rail and the ghost pocket no longer holds.',
    'Moving the ghost pocket after one miss. Shoot all three, then adjust.',
  ],
  rounds: [
    {
      title: 'Close, low',
      spin: 'center',
      cueBall: { x: 0.4972, y: 0.3102 },
      objectBalls: [{ number: 1, x: 0.75, y: 0.25 }],
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.75, y: 0.25 }, { x: 0.9775, y: 0.1958 }, { x: 0, y: 0 }] },
        { kind: 'railContact', point: { x: 1, y: 0.1958 } },
      ],
    },
    {
      title: 'Close, high',
      spin: 'center',
      cueBall: { x: 0.5222, y: 0.4564 },
      objectBalls: [{ number: 1, x: 0.75, y: 0.375 }],
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.75, y: 0.375 }, { x: 0.9775, y: 0.2938 }, { x: 0, y: 0 }] },
        { kind: 'railContact', point: { x: 1, y: 0.2938 } },
      ],
    },
    {
      title: 'Wide, low',
      spin: 'center',
      cueBall: { x: 0.2387, y: 0.3003 },
      objectBalls: [{ number: 1, x: 0.5, y: 0.25 }],
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.5, y: 0.25 }, { x: 0.9775, y: 0.1582 }, { x: 0, y: 0 }] },
        { kind: 'railContact', point: { x: 1, y: 0.1582 } },
      ],
    },
    {
      title: 'Wide, high',
      spin: 'center',
      cueBall: { x: 0.2575, y: 0.445 },
      objectBalls: [{ number: 1, x: 0.5, y: 0.375 }],
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.5, y: 0.375 }, { x: 0.9775, y: 0.2373 }, { x: 0, y: 0 }] },
        { kind: 'railContact', point: { x: 1, y: 0.2373 } },
      ],
    },
  ],
} satisfies PoolDrill;
