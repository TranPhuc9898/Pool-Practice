import type { PoolDrill } from '../types';

/**
 * Bank the 7 Long, Hide Behind the 8, bài 61 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`,
 * Billiard University Exam VI #17 (https://billiarduniversity.org/documents/BU_Exam-VI_Safety_Challenge.pdf). Layout
 * và hai chỗ bi dừng lấy từ toạ độ "→ app" của research [nguồn], đo từ hình nên sai số khoảng ±¼ diamond [suy luận].
 * Bi 7 bật head rail chạy về gần foot rail, bi cái dừng sau bi 8. Điểm chạm băng tính bằng gương; góc cắt chỉ khoảng 5°
 * nên bi cái gần như đứng tại ghost ball rồi trôi theo tiếp tuyến, vì vậy chọn stun [suy luận]. Đường về của bi 7 cắt
 * qua chỗ bi cái đứng lúc đầu, lúc đó bi cái đã đi khỏi. Đường bi 7 vẽ bằng `objectBallBankPath` dù điểm cuối không
 * phải lỗ; `targetPocket` footRight chỉ là lỗ gần nhất. Vòng đích bán kính 2.5", 3 cú, ngưỡng 2/3 theo tiêu chí chung
 * của nhóm [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const bankSevenHideBehindEight = {
  id: '61',
  number: 61,
  title: 'Bank the 7 Long, Hide Behind the 8',
  subtitle: 'Bank the 7 the length of the table and tuck the cue ball behind the 8.',
  category: 'patternPlay',
  skill: 'safety',
  skillLabel: 'Safety',
  difficulty: 4,
  objective: 'Bank the 7-ball off the head rail down near the foot rail and leave the cue ball hidden behind the 8-ball.',
  cueBall: { x: 0.76, y: 0.818 },
  objectBalls: [
    { number: 7, x: 0.76, y: 0.97 },
    { number: 8, x: 0.625, y: 0.885 },
    { number: 9, x: 0.515, y: 0.625 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.625, y: 0.912 }, radius: 0.05, label: 'Cue' }],
  guideLines: [
    {
      kind: 'objectBallBankPath',
      points: [
        { x: 0.76, y: 0.97 },
        { x: 0.763, y: 0.98875 },
        { x: 0.89, y: 0.2 },
      ],
    },
    { kind: 'expectedCuePath', points: [{ x: 0.76, y: 0.818 }, { x: 0.7564, y: 0.9476 }, { x: 0.625, y: 0.912 }] },
  ],
  recommendedContactPoint: { x: 0, y: -0.1 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 3,
  passCondition: { kind: 'inZone', required: 2 },
  tips: [
    'Almost full on the 7, cut just enough to send it to the right of the cue ball line on the way back.',
    'Stun the cue ball. It stays near the contact point and slides over behind the 8.',
    'Pass when the hit is legal and the 8 blocks the line from the cue ball to the 7.',
  ],
  mistakes: [
    'Hit it straight: the 7 comes back into the cue ball.',
    'Follow on the cue ball: it chases the 7 into the head rail and stays in the open.',
  ],
} satisfies PoolDrill;
