import type { PoolDrill } from '../types';

/**
 * Thin Hit, Freeze Beside the Stripe, bài 63 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`,
 * Billiard University Exam VI #10 (https://billiarduniversity.org/documents/BU_Exam-VI_Safety_Challenge.pdf). Layout
 * lấy từ toạ độ "→ app" của research [nguồn], đo từ hình nên sai số khoảng ±¼ diamond [suy luận]. Bi sọc `x` không có
 * số trong nguồn, ở đây đặt là bi 10 [suy luận]. Chạm bi 10 thật mỏng cho nó gần như đứng yên, bi cái dừng sát cạnh nó
 * phía bi 8. Mục đích (chắn đường tới bi đối thủ) là đoán của research [suy luận]. Vòng đích bán kính 1.25" quanh chỗ
 * bi cái gần chạm bi 10, khớp tiêu chí cách bi sọc dưới ¼ bi [đề xuất]. Không vẽ đường bi 10 vì nó gần như không đi.
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
    { kind: 'expectedCuePath', points: [{ x: 0.41, y: 0.062 }, { x: 0.53, y: 0.0595 }, { x: 0.565, y: 0.055 }] },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 3,
  passCondition: { kind: 'inZone', required: 2 },
  tips: [
    'Aim to just brush the top of the 10. The thinner the hit, the less it moves.',
    'Very soft. The cue ball should lose almost all its speed by the time it passes the 10.',
    'Pass when the hit is legal and the cue ball ends within a quarter ball of the 10.',
  ],
  mistakes: [
    'Too full: the 10 is pushed into the rail and the cue ball stops short of it.',
    'No ball reaches a rail after contact: on a thin feather hit that is easy to miss. Check it every shot.',
  ],
} satisfies PoolDrill;
