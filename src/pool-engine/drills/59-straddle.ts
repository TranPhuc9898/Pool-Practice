import type { PoolDrill } from '../types';

/**
 * Straddle, bài 59 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Billiard University
 * Exam VI #6 (https://billiarduniversity.org/documents/BU_Exam-VI_Safety_Challenge.pdf). Layout và hai chỗ bi dừng lấy
 * từ toạ độ "→ app" của research [nguồn], đo từ hình nên sai số khoảng ±¼ diamond [suy luận]. Bi 8 lăn về phía head
 * dừng sát long rail trái, bi cái đi về phía foot dừng sát cùng băng, bi 9 kẹp giữa. Điểm chạm, băng và chỗ dừng lấy từ
 * `ShotPhysics` (draw 0.3, soft 0.8 m/s, ngắm 185.37°): bi 8 lăn lên dừng gần băng trái, bi cái chạm long rail trái rồi
 * dừng cách tâm vòng 0.55", không đụng bi 9, cửa ngắm khoảng ±0.8° [suy luận]. Đường bi 8 vẽ bằng `objectBallBankPath`
 * hai điểm vì đích là chỗ dừng, không phải lỗ; `targetPocket` sideLeft chỉ là lỗ gần nhất. Vòng đích bán kính 3", 3 cú, ngưỡng 2/3 theo tiêu chí chung của nhóm [đề xuất].
 * Chưa kiểm trên bàn thật.
 */
export const straddle = {
  id: '59',
  number: 59,
  title: 'Straddle',
  subtitle: 'Cue ball and 8-ball end on either side of the 9 along the rail.',
  category: 'patternPlay',
  skill: 'safety',
  skillLabel: 'Safety',
  difficulty: 3,
  objective: 'Cut the 8-ball up-table to the left rail and let the cue ball roll down-table to the same rail, with the 9 between them.',
  cueBall: { x: 0.36, y: 0.295 },
  objectBalls: [
    { number: 8, x: 0.2, y: 0.305 },
    { number: 9, x: 0.085, y: 0.3 },
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.085, y: 0.213 }, radius: 0.06, label: 'Cue' }],
  guideLines: [
    { kind: 'objectBallBankPath', points: [{ x: 0.2, y: 0.305 }, { x: 0.1074, y: 0.3465 }] },
    { kind: 'expectedCuePath', points: [{ x: 0.36, y: 0.295 }, { x: 0.2316, y: 0.289 }, { x: 0.0228, y: 0.2239 }, { x: 0.0827, y: 0.2076 }] },
  ],
  recommendedContactPoint: { x: 0, y: -0.3 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'soft',
  allowedRails: 1,
  attemptCount: 3,
  passCondition: { kind: 'inZone', required: 2 },
  tips: [
    'Thin cut on the head side of the 8. The 8 goes up-table, the cue ball follows the tangent down-table.',
    'Both balls only need to reach the rail. Soft and smooth.',
    'Pass when the hit is legal and the 9 blocks the line from the cue ball to the 8.',
  ],
  mistakes: [
    'Too full: the 8 runs into the 9 and nothing is hidden.',
    'Too hard: both balls bounce off the rail and come back into the open.',
  ],
} satisfies PoolDrill;
