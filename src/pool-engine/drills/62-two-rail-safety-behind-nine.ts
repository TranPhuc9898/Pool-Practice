import type { PoolDrill } from '../types';

/**
 * Two-Rail Safety Behind the 9, bài 62 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`,
 * Billiard University Exam VI #18 (https://billiarduniversity.org/documents/BU_Exam-VI_Safety_Challenge.pdf). Layout
 * lấy từ toạ độ "→ app" của research [nguồn], đo từ hình nên sai số khoảng ±¼ diamond [suy luận].
 * Bi 7 bật head rail rồi long rail trái ra giữa bàn, bi cái bật head rail rồi long rail phải dừng sau bi 9. Điểm chạm
 * băng và chỗ dừng lấy từ `ShotPhysics` (draw ¼ tip, medium 1.8 m/s, ngắm 111.1°): bi cái dừng cách tâm vòng 1.2",
 * không đụng bi 8, 9, cửa ngắm chỉ khoảng ±0.2° [suy luận]. Đường bi 7 vẽ bằng `objectBallBankPath` dù điểm cuối không
 * phải lỗ; `targetPocket` footRight chỉ là lỗ gần nhất. Vòng đích bán kính 2.5", 3 cú, ngưỡng 2/3
 * theo tiêu chí chung của nhóm [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const twoRailSafetyBehindNine = {
  id: '62',
  number: 62,
  title: 'Two-Rail Safety Behind the 9',
  subtitle: 'Both balls go two rails. The 7 goes out, the cue ball hides behind the 9.',
  category: 'patternPlay',
  skill: 'safety',
  skillLabel: 'Safety',
  difficulty: 4,
  objective: 'Send the 7-ball off the head and left rails into the middle of the table, and the cue ball off the head and right rails behind the 9-ball.',
  cueBall: { x: 0.775, y: 0.75 },
  objectBalls: [
    { number: 7, x: 0.655, y: 0.875 },
    { number: 8, x: 0.52, y: 0.875 },
    { number: 9, x: 0.885, y: 0.875 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.925, y: 0.892 }, radius: 0.05, label: 'Cue' }],
  guideLines: [
    {
      kind: 'objectBallBankPath',
      points: [
        { x: 0.655, y: 0.875 },
        { x: 0.4136, y: 0.9888 },
        { x: 0.0225, y: 0.8002 },
        { x: 0.542, y: 0.563 },
      ],
    },
    {
      kind: 'expectedCuePath',
      points: [
        { x: 0.775, y: 0.75 },
        { x: 0.6895, y: 0.8606 },
        { x: 0.8811, y: 0.9888 },
        { x: 0.9775, y: 0.914 },
        { x: 0.9394, y: 0.8821 },
      ],
    },
  ],
  recommendedContactPoint: { x: 0, y: -0.2 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 3,
  passCondition: { kind: 'inZone', required: 2 },
  tips: [
    'Cut the 7 to the left so it clears the 8 on its way to the head rail.',
    'A touch of draw keeps the cue ball from running too far off the right rail.',
    'Pass when the hit is legal and the 9 blocks the line from the cue ball to the 7.',
  ],
  mistakes: [
    'Too thick: the 7 clips the 8 and stays near the head rail.',
    'Too hard: the cue ball comes off the right rail past the 9 and into the open.',
  ],
} satisfies PoolDrill;
