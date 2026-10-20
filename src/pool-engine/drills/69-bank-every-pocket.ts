import type { PoolDrill } from '../types';

/**
 * Bank to Every Pocket, bài 69 của `docs/research/pool-practice-drills/drills-66-81-bank-break-jump-kiem-tra.md`, gốc Eddie
 * Taylor qua VEPP #146 và Dr. Dave BD 02/2013 https://drdavepoolinfo.com/bd_articles/2013/feb13.pdf. [nguồn]: bi mục tiêu ép
 * băng phải ở diamond thứ 2 tính từ góc foot, bank vào cả sáu lỗ, ba lỗ một băng, ba lỗ từ hai băng, ball in hand mỗi cú,
 * điểm là tổng số lần thử cho đủ sáu lỗ. Research in x 0.978, em lấy 0.9775 cho đúng tâm bi ép băng. [đề xuất] của research:
 * dưới 20 lần là qua, dưới 12 là tốt. [suy luận]: bi ép băng không đẩy ra xa băng được, nên băng đầu luôn là băng phải nó
 * đang nằm; ba lỗ bên trái là một băng, ba lỗ bên phải là hai băng (phải rồi trái). Điểm chạm băng trái là điểm gương hình học.
 * Chỗ bi cái in sẵn: góc tới bằng góc ra so với băng phải, cách bi 12". App không đếm "tới khi vào", nên mỗi lỗ 3 cú, qua
 * khi vào 6/18 (khoảng tỉ lệ của mốc 20 lần). Chưa kiểm trên bàn thật.
 */
export const bankEveryPocket = {
  id: '69',
  number: 69,
  title: 'Bank to Every Pocket',
  subtitle: 'One ball frozen on the right rail. Bank it into all six pockets.',
  category: 'shotMaking',
  skill: 'bank',
  skillLabel: 'Bank',
  difficulty: 4,
  objective: 'Bank the 1-ball, frozen on the right rail two diamonds from the far corner, into each of the six pockets. Three shots per pocket.',
  cueBall: { x: 0.7638, y: 0.3046 },
  objectBalls: [{ number: 1, x: 0.9775, y: 0.25 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallBankPath', points: [{ x: 0.9775, y: 0.25 }, { x: 0.9775, y: 0.25 }, { x: 0, y: 0 }] },
    { kind: 'railContact', point: { x: 1, y: 0.25 } },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 18,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'Ball in hand every shot. A frozen ball always comes off its own rail first: the left-side pockets are one rail, the right-side pockets go across and back.',
    'The original scoring: stay on a pocket until it drops and count every shot for all six. Under 20 passes, under 12 is strong.',
    'Here it is three shots per pocket. Six made out of 18 is about the same rate as 20 tries.',
    'The lines are plain mirror geometry. Note short or long on each pocket and adjust.',
  ],
  mistakes: [
    'Hitting the object ball thin along the rail: it barely comes off the cushion. Drive it into the rail.',
    'Running english on the two-rail banks without meaning to: the second rail angle changes. Start with a center hit.',
  ],
  rounds: [
    {
      title: 'Far left corner, 1 rail',
      spin: 'center',
      cueBall: { x: 0.7638, y: 0.3046 },
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.9775, y: 0.25 }, { x: 0.9775, y: 0.25 }, { x: 0, y: 0 }] },
        { kind: 'railContact', point: { x: 1, y: 0.25 } },
      ],
    },
    {
      title: 'Left side, 1 rail',
      spin: 'center',
      cueBall: { x: 0.7638, y: 0.1954 },
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.9775, y: 0.25 }, { x: 0.9775, y: 0.25 }, { x: 0, y: 0.5 }] },
        { kind: 'railContact', point: { x: 1, y: 0.25 } },
      ],
    },
    {
      title: 'Near left corner, 1 rail',
      spin: 'center',
      cueBall: { x: 0.8465, y: 0.1495 },
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.9775, y: 0.25 }, { x: 0.9775, y: 0.25 }, { x: 0, y: 1 }] },
        { kind: 'railContact', point: { x: 1, y: 0.25 } },
      ],
    },
    {
      title: 'Far right corner, 2 rails',
      spin: 'center',
      cueBall: { x: 0.7452, y: 0.2801 },
      guideLines: [
        {
          kind: 'objectBallBankPath',
          points: [{ x: 0.9775, y: 0.25 }, { x: 0.9775, y: 0.25 }, { x: 0.0225, y: 0.1265 }, { x: 1, y: 0 }],
        },
        { kind: 'railContact', point: { x: 1, y: 0.25 } },
        { kind: 'railContact', point: { x: 0, y: 0.1265 } },
      ],
    },
    {
      title: 'Right side, 2 rails',
      spin: 'center',
      cueBall: { x: 0.7452, y: 0.2199 },
      guideLines: [
        {
          kind: 'objectBallBankPath',
          points: [{ x: 0.9775, y: 0.25 }, { x: 0.9775, y: 0.25 }, { x: 0.0225, y: 0.3735 }, { x: 1, y: 0.5 }],
        },
        { kind: 'railContact', point: { x: 1, y: 0.25 } },
        { kind: 'railContact', point: { x: 0, y: 0.3735 } },
      ],
    },
    {
      title: 'Near right corner, 2 rails',
      spin: 'center',
      cueBall: { x: 0.7879, y: 0.1764 },
      guideLines: [
        {
          kind: 'objectBallBankPath',
          points: [{ x: 0.9775, y: 0.25 }, { x: 0.9775, y: 0.25 }, { x: 0.0225, y: 0.6206 }, { x: 1, y: 1 }],
        },
        { kind: 'railContact', point: { x: 1, y: 0.25 } },
        { kind: 'railContact', point: { x: 0, y: 0.6206 } },
      ],
    },
  ],
} satisfies PoolDrill;
