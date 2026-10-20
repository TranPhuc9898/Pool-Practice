import type { PoolDrill } from '../types';

/**
 * Equal Separation, bài 58 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Billiard
 * University Exam VI #5 (https://billiarduniversity.org/documents/BU_Exam-VI_Safety_Challenge.pdf). Layout và hai chỗ
 * bi dừng lấy từ toạ độ "→ app" của research [nguồn], đo từ hình nên sai số khoảng ±¼ diamond [suy luận]. Bi 8 bật
 * foot rail về long rail phải, bi cái bật foot rail về long rail trái, bi 9 nằm giữa. Điểm chạm băng tính bằng gương
 * qua đường tâm bi lúc chạm băng; ghost ball cho góc cắt khoảng 38°, khớp "mỏng hơn nửa bi một chút" [suy luận]. Đường
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
        { x: 0.5872, y: 0.01125 },
        { x: 0.975, y: 0.262 },
      ],
    },
    {
      kind: 'expectedCuePath',
      points: [
        { x: 0.51, y: 0.5 },
        { x: 0.5075, y: 0.0628 },
        { x: 0.4295, y: 0.01125 },
        { x: 0.05, y: 0.262 },
      ],
    },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'medium',
  allowedRails: 1,
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
