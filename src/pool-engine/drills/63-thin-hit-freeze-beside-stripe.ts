import type { PoolDrill } from '../types';

/**
 * Thin Hit, Freeze Beside the Stripe, bài 63 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`,
 * Billiard University Exam VI #10 (https://billiarduniversity.org/documents/BU_Exam-VI_Safety_Challenge.pdf). Layout
 * lấy từ toạ độ "→ app" của research [nguồn], đo từ hình nên sai số khoảng ±¼ diamond [suy luận]. Bi sọc `x` không có
 * số trong nguồn, ở đây đặt là bi 10 [suy luận]. Chạm mỏng bi 10, bi cái chạm foot rail rồi dừng sát cạnh bi 10
 * phía bi 8. Điểm chạm, băng và chỗ dừng lấy từ `ShotPhysics` (phê phải 0.2, draw 0.4, 0.7 m/s, ngắm -37.27°): bi 10 trôi
 * 2.6" về phía bi 8, bi cái dừng cách tâm vòng 0.14" và cách bi 10 chưa tới ⅓ bi, không đụng bi 8 [suy luận]. Ở
 * soft 0.8 m/s engine không tìm ra cú nào giữ bi cái trong vòng, nên lực nằm trong một round 0.7 m/s [suy luận]. Mục đích (chắn đường tới bi đối thủ) là đoán của research [suy luận]. Vòng đích bán kính 1.25" quanh chỗ
 * bi cái gần chạm bi 10, khớp tiêu chí cách bi sọc dưới ¼ bi [đề xuất].
 * `targetPocket` footRight chỉ là lỗ gần nhất. 3 cú, ngưỡng 2/3 theo tiêu chí chung của nhóm [đề xuất].
 * Chưa kiểm trên bàn thật.
 */
export const thinHitFreezeBesideStripe = {
  id: '63',
  number: 63,
  title: 'Thin Hit, Freeze Beside the Stripe',
  subtitle: 'Feather the 10-ball and park the cue ball against it on the foot rail.',
  category: 'patternPlay',
  skill: 'safety',
  skillLabel: 'Safety',
  difficulty: 4,
  objective: 'Hit the 10-ball as thin as you can so it barely moves, and stop the cue ball touching or nearly touching it.',
  cueBall: { x: 0.41, y: 0.062 },
  objectBalls: [
    { number: 10, x: 0.53, y: 0.037 },
    { number: 8, x: 0.85, y: 0.025 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.565, y: 0.055 }, radius: 0.025, label: 'Freeze' }],
  guideLines: [
    { kind: 'objectBallBankPath', points: [{ x: 0.53, y: 0.037 }, { x: 0.6151, y: 0.0442 }] },
    {
      kind: 'expectedCuePath',
      points: [
        { x: 0.41, y: 0.062 },
        { x: 0.4861, y: 0.032 },
        { x: 0.5061, y: 0.0114 },
        { x: 0.5629, y: 0.0559 },
      ],
    },
  ],
  recommendedContactPoint: { x: 0.2, y: -0.4 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'soft',
  allowedRails: 1,
  attemptCount: 3,
  passCondition: { kind: 'inZone', required: 2 },
  tips: [
    'Brush the 10 on its foot-rail side. The cue ball goes into the foot rail and draws back beside the 10.',
    'Very soft, under normal soft speed. The 10 should drift only a couple of inches.',
    'Pass when the hit is legal and the cue ball ends in the circle beside the 10.',
  ],
  mistakes: [
    'Too full: the 10 is pushed into the rail and the cue ball stops short of it.',
    'No ball reaches a rail after contact: on a thin feather hit that is easy to miss. Check it every shot.',
  ],
  rounds: [
    {
      title: 'Feather and freeze',
      spin: 'draw',
      contactPoint: { x: 0.2, y: -0.4 },
      speed: 0.7,
      why: 'Below normal soft speed: at 0.8 m/s the cue ball runs past the circle.',
    },
  ],
} satisfies PoolDrill;
