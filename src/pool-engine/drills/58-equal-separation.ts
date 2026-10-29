import type { PoolDrill } from '../types';

/**
 * Equal Separation, bài 58 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Billiard
 * University Exam VI #5 (https://billiarduniversity.org/documents/BU_Exam-VI_Safety_Challenge.pdf). Layout và hai chỗ
 * bi dừng lấy từ toạ độ "→ app" của research [nguồn], đo từ hình nên sai số khoảng ±¼ diamond [suy luận]. Bi 8 bật
 * foot rail về long rail phải, bi cái bật foot rail về long rail trái, bi 9 nằm giữa. Điểm chạm, băng và chỗ dừng lấy
 * từ `ShotPhysics` (phê trái 0.2, draw 0.3, medium 1.8 m/s, ngắm -90.96°): bi cái dừng cách tâm vòng 2.6", không đụng
 * bi 9, cửa ngắm chỉ khoảng ±0.1° nên đây là cú khó nhất nhóm [suy luận]. Đường
 * bi 8 vẽ bằng `objectBallBankPath` dù điểm cuối không phải lỗ; `targetPocket` footRight chỉ là lỗ gần nhất. Vòng đích
 * bán kính 4", 3 cú, ngưỡng 2/3 theo tiêu chí chung của nhóm [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const equalSeparation = {
  id: '58',
  number: 58,
  title: 'Equal Separation',
  subtitle: 'Split the 8 and the cue ball to opposite rails with the 9 between them.',
  category: 'patternPlay',
  skill: 'safety',
  skillLabel: 'Safety',
  difficulty: 3,
  objective: 'Cut the 8-ball a bit thinner than half so it banks off the foot rail to the right rail, and send the cue ball off the foot rail to the left rail.',
  cueBall: { x: 0.51, y: 0.5 },
  objectBalls: [
    { number: 8, x: 0.535, y: 0.045 },
    { number: 9, x: 0.56, y: 0.262 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.05, y: 0.262 }, radius: 0.08, label: 'Cue' }],
  guideLines: [
    {
      kind: 'objectBallBankPath',
      points: [
        { x: 0.535, y: 0.045 },
        { x: 0.5794, y: 0.0113 },
        { x: 0.8471, y: 0.2451 },
      ],
    },
    {
      kind: 'expectedCuePath',
      points: [
        { x: 0.51, y: 0.5 },
        { x: 0.5106, y: 0.0639 },
        { x: 0.4297, y: 0.0112 },
        { x: 0.0228, y: 0.2138 },
        { x: 0.092, y: 0.2475 },
      ],
    },
  ],
  recommendedContactPoint: { x: -0.2, y: -0.3 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 3,
  passCondition: { kind: 'inZone', required: 2 },
  tips: [
    'The cue ball passes close to the 9 on the way in. Aim past it, not through it.',
    'Both balls should travel about the same distance. Equal speed off the foot rail keeps them level.',
    'Pass when the hit is legal and the 9 blocks the line from the cue ball to the 8.',
  ],
  mistakes: [
    'Too full: the 8 comes straight back up the middle and the 9 hides nothing.',
    'Too soft: the cue ball stops near the foot rail with a clear look at the 8.',
  ],
} satisfies PoolDrill;
