import type { PoolDrill } from '../types';

/**
 * Cross-Side Bank, bài 66 (B1) của `docs/research/pool-practice-drills/drills-66-81-bank-break-jump-kiem-tra.md`, gốc BU
 * Exam II S7 Bachelors https://billiarduniversity.org/documents/BU_Exam-II_Skills-Bachelors.pdf. [nguồn]: ba bi trên trục
 * giữa (0.5, 0.625 / 0.675 / 0.725), mỗi cú một bi, bank băng trái vào lỗ giữa phải, 1 điểm mỗi bi, tối đa 3. Toạ độ giữ
 * đúng bản research (đã lật gương so với hình gốc). [đề xuất]: đạt 2/3. [suy luận]: điểm chạm băng là điểm gương hình học
 * (đường tâm bi ở x = 1.125", không throw, không cut-induced spin); bi cái ball in hand, chỗ in sẵn là thẳng sau bi mục
 * tiêu 12" theo hướng điểm chạm băng, đánh stun để bi cái đứng lại tránh double kiss. Chưa kiểm trên bàn thật.
 */
export const crossSideBank = {
  id: '66',
  number: 66,
  title: 'Cross-Side Bank',
  subtitle: 'One ball on the center line. Bank it off the left rail into the right side pocket.',
  category: 'shotMaking',
  skill: 'bank',
  skillLabel: 'Bank',
  difficulty: 3,
  objective: 'Bank each ball off the left rail into the right side pocket. One shot per ball, one ball on the table at a time.',
  cueBall: { x: 0.7365, y: 0.6453 },
  objectBalls: [{ number: 1, x: 0.5, y: 0.625 }],
  targetPocket: 'sideRight',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallBankPath', points: [{ x: 0.5, y: 0.625 }, { x: 0.0225, y: 0.584 }, { x: 1, y: 0.5 }] },
    { kind: 'railContact', point: { x: 0, y: 0.584 } },
  ],
  recommendedContactPoint: { x: 0, y: -0.1 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 3,
  passCondition: { kind: 'pocketed', required: 2 },
  tips: [
    'Ball in hand on every shot. Place the cue ball so it is out of the way when the object ball comes back across.',
    'Stun it. A rolling cue ball follows the object ball toward the rail and kisses it on the way back.',
    'The rail mark is the plain mirror point. Note whether your table banks short or long and move it.',
  ],
  mistakes: [
    'Object ball hits the cue ball coming back: double kiss. Move the cue ball off the line or kill it with stun.',
    'Cut to the outside banks short, cut to the inside banks long. Keep the cue ball nearly straight behind.',
  ],
  rounds: [
    {
      title: 'Ball 1',
      spin: 'stun',
      cueBall: { x: 0.7365, y: 0.6453 },
      objectBalls: [{ number: 1, x: 0.5, y: 0.625 }],
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.5, y: 0.625 }, { x: 0.0225, y: 0.584 }, { x: 1, y: 0.5 }] },
        { kind: 'railContact', point: { x: 0, y: 0.584 } },
      ],
    },
    {
      title: 'Ball 2',
      spin: 'stun',
      cueBall: { x: 0.7333, y: 0.7031 },
      objectBalls: [{ number: 2, x: 0.5, y: 0.675 }],
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.5, y: 0.675 }, { x: 0.0225, y: 0.6176 }, { x: 1, y: 0.5 }] },
        { kind: 'railContact', point: { x: 0, y: 0.6176 } },
      ],
    },
    {
      title: 'Ball 3',
      spin: 'stun',
      cueBall: { x: 0.7293, y: 0.7605 },
      objectBalls: [{ number: 3, x: 0.5, y: 0.725 }],
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.5, y: 0.725 }, { x: 0.0225, y: 0.6512 }, { x: 1, y: 0.5 }] },
        { kind: 'railContact', point: { x: 0, y: 0.6512 } },
      ],
    },
  ],
} satisfies PoolDrill;
