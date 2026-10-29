import type { PoolDrill } from '../types';

/**
 * Bank gọi lỗ: bi 1 ở (0.6, 0.35), bank một băng phải vào lỗ giữa trái. Tự soạn cho giai đoạn 6 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. [suy luận]: điểm
 * chạm băng là điểm gương hình học (tâm bi ở x = 1 − 1.125", không throw, không cut-induced spin); bi cái thẳng sau bi
 * 12" theo hướng điểm chạm băng, stun để bi cái đứng ở ghost ball tránh double kiss. Tip, lực và ngưỡng 6/10 [đề xuất].
 * Chưa kiểm trên bàn thật.
 */
export const calledSideBank = {
  id: '105',
  number: 105,
  title: 'Called Side Bank',
  subtitle: 'Call the side pocket, bank it once off the right rail. Path drawn, not simulated.',
  category: 'shotMaking',
  skill: 'bank',
  skillLabel: 'Bank',
  difficulty: 5,
  objective: 'Bank the 1 off the right rail into the left side pocket. Call it before you shoot. Ten tries.',
  cueBall: { x: 0.3217, y: 0.3192 },
  objectBalls: [{ number: 1, x: 0.6, y: 0.35 }],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallBankPath', points: [{ x: 0.6, y: 0.35 }, { x: 0.9775, y: 0.3918 }, { x: 0, y: 0.5 }] },
    { kind: 'railContact', point: { x: 1, y: 0.3918 } },
  ],
  recommendedContactPoint: { x: 0, y: -0.2 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'The rail mark is the plain mirror point. Note whether your table banks short or long and move it.',
    'Stun it. The cue ball stays on the ghost ball, out of the way of the 1 coming back.',
  ],
  mistakes: [
    'Bank goes long: too soft, or a touch of outside spin.',
    'Bank goes short: hit too hard, the ball sinks into the cushion and comes off at a wider angle.',
  ],
  rounds: [
    {
      title: 'Bank the 1',
      spin: 'stun',
      speed: 2,
      contactPoint: { x: 0, y: -0.2 },
      why: 'Nearly straight behind the bank line, so stun stops the cue ball and it never meets the 1 on the way back.',
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.6, y: 0.35 }, { x: 0.9775, y: 0.3918 }, { x: 0, y: 0.5 }] },
        { kind: 'railContact', point: { x: 1, y: 0.3918 } },
        { kind: 'expectedCuePath', points: [{ x: 0.3217, y: 0.3192 }, { x: 0.4389, y: 0.3322 }, { x: 0.5561, y: 0.3451 }] },
      ],
    },
  ],
} satisfies PoolDrill;
