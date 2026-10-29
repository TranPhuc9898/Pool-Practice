import type { PoolDrill } from '../types';

/**
 * Nguồn: hệ bank "twice-plus-tenths" (TPT) của Dr. Dave Alciatore, bài anh lưu https://www.facebook.com/share/v/1TRYDTdW86/,
 * công thức đối chiếu ở https://forums.azbilliards.com/goto/post?id=7607695 [nguồn]: số diamond điểm xuất phát = 2 × số
 * diamond điểm chạm băng + chừng ấy phần mười (b = 3 → 6.3), cho cú bank trượt (stun) chéo góc, đo ở rãnh băng đối diện
 * diamond. [suy luận]: rãnh băng lấy bằng đường tâm bi (x 0.0225 / 0.9775), diamond đếm từ băng đầu bàn về phía lỗ góc
 * đích headLeft, bi 1 đặt trên đường xuất phát → điểm chạm ở 42%, bi cái thẳng sau ở 12%. Năm mốc b, tip, lực, ngưỡng
 * 6/10 [đề xuất]. Chưa kiểm trên bàn thật.
 * Engine (`drill110()` trong `scripts/position-harness/main.swift`, tipY −0.2): lực 1.6 không tới góc ở cả 5 round; lực 2.4
 * vào với điểm băng thấp hơn điểm hệ 3.15", 5.05", 6.9", 8.65", 10.35" (b = 1 … 3). Drill giữ đường của hệ TPT vì đó là
 * thứ bài dạy, không ép theo engine; lực đặt 2.4.
 */
export const twicePlusTenthsBank = {
  id: '110',
  number: 110,
  title: 'Twice-Plus-Tenths Bank',
  subtitle: 'Dr. Dave TPT: cross-corner banks off the right rail, five banking diamonds. Path drawn, not simulated.',
  category: 'shotMaking',
  skill: 'bank',
  skillLabel: 'Bank',
  difficulty: 5,
  objective: 'Bank the 1 cross-corner into the far left corner. Five setups, two tries each. Work out the start diamond before you look at the line.',
  cueBall: { x: 0.1371, y: 0.754 },
  objectBalls: [{ number: 1, x: 0.4236, y: 0.7953 }],
  targetPocket: 'headLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallBankPath', points: [{ x: 0.4236, y: 0.7953 }, { x: 0.9775, y: 0.875 }, { x: 0, y: 1 }] },
    { kind: 'railContact', point: { x: 1, y: 0.875 } },
  ],
  recommendedContactPoint: { x: 0, y: -0.2 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'Count diamonds from the head rail. Pick the banking diamond, double it, add that many tenths: 3 becomes 6.3.',
    'Measure at the rail grooves across from the diamonds, not on the diamonds themselves.',
    'The system is for a sliding bank. Stun, medium pace. Roll or hard hits change the angle.',
  ],
  mistakes: [
    'Using plain twice (mirror): sliding banks come off long, so the ball hits the long rail before the corner.',
    'Following through the ball: rolling banks shorten and the system no longer fits.',
  ],
  rounds: [
    {
      title: 'Bank at 1, from 2.1',
      spin: 'stun',
      speed: 2.4,
      contactPoint: { x: 0, y: -0.2 },
      cueBall: { x: 0.1371, y: 0.754 },
      objectBalls: [{ number: 1, x: 0.4236, y: 0.7953 }],
      why: 'Banking diamond 1: twice is 2, plus 1 tenths of a diamond, so the line starts at 2.1 on the left rail. Dr. Dave TPT.',
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.4236, y: 0.7953 }, { x: 0.9775, y: 0.875 }, { x: 0, y: 1 }] },
        { kind: 'railContact', point: { x: 1, y: 0.875 } },
        { kind: 'expectedCuePath', points: [{ x: 0.1371, y: 0.754 }, { x: 0.2588, y: 0.7715 }, { x: 0.3804, y: 0.7891 }] },
      ],
    },
    {
      title: 'Bank at 1.5, from 3.15',
      spin: 'stun',
      speed: 2.4,
      contactPoint: { x: 0, y: -0.2 },
      cueBall: { x: 0.1371, y: 0.631 },
      objectBalls: [{ number: 1, x: 0.4236, y: 0.6929 }],
      why: 'Banking diamond 1.5: twice is 3, plus 1.5 tenths of a diamond, so the line starts at 3.15 on the left rail. Dr. Dave TPT.',
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.4236, y: 0.6929 }, { x: 0.9775, y: 0.8125 }, { x: 0, y: 1 }] },
        { kind: 'railContact', point: { x: 1, y: 0.8125 } },
        { kind: 'expectedCuePath', points: [{ x: 0.1371, y: 0.631 }, { x: 0.2597, y: 0.6575 }, { x: 0.3823, y: 0.684 }] },
      ],
    },
    {
      title: 'Bank at 2, from 4.2',
      spin: 'stun',
      speed: 2.4,
      contactPoint: { x: 0, y: -0.2 },
      cueBall: { x: 0.1371, y: 0.508 },
      objectBalls: [{ number: 1, x: 0.4236, y: 0.5905 }],
      why: 'Banking diamond 2: twice is 4, plus 2 tenths of a diamond, so the line starts at 4.2 on the left rail. Dr. Dave TPT.',
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.4236, y: 0.5905 }, { x: 0.9775, y: 0.75 }, { x: 0, y: 1 }] },
        { kind: 'railContact', point: { x: 1, y: 0.75 } },
        { kind: 'expectedCuePath', points: [{ x: 0.1371, y: 0.508 }, { x: 0.2609, y: 0.5436 }, { x: 0.3846, y: 0.5793 }] },
      ],
    },
    {
      title: 'Bank at 2.5, from 5.25',
      spin: 'stun',
      speed: 2.4,
      contactPoint: { x: 0, y: -0.2 },
      cueBall: { x: 0.1371, y: 0.385 },
      objectBalls: [{ number: 1, x: 0.4236, y: 0.4881 }],
      why: 'Banking diamond 2.5: twice is 5, plus 2.5 tenths of a diamond, so the line starts at 5.25 on the left rail. Dr. Dave TPT.',
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.4236, y: 0.4881 }, { x: 0.9775, y: 0.6875 }, { x: 0, y: 1 }] },
        { kind: 'railContact', point: { x: 1, y: 0.6875 } },
        { kind: 'expectedCuePath', points: [{ x: 0.1371, y: 0.385 }, { x: 0.2621, y: 0.43 }, { x: 0.3871, y: 0.475 }] },
      ],
    },
    {
      title: 'Bank at 3, from 6.3',
      spin: 'stun',
      speed: 2.4,
      contactPoint: { x: 0, y: -0.2 },
      cueBall: { x: 0.1371, y: 0.262 },
      objectBalls: [{ number: 1, x: 0.4236, y: 0.3858 }],
      why: 'Banking diamond 3: twice is 6, plus 3 tenths of a diamond, so the line starts at 6.3 on the left rail. Dr. Dave TPT.',
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.4236, y: 0.3858 }, { x: 0.9775, y: 0.625 }, { x: 0, y: 1 }] },
        { kind: 'railContact', point: { x: 1, y: 0.625 } },
        { kind: 'expectedCuePath', points: [{ x: 0.1371, y: 0.262 }, { x: 0.2633, y: 0.3165 }, { x: 0.3895, y: 0.3711 }] },
      ],
    },
  ],
} satisfies PoolDrill;
