import type { PoolDrill } from '../types';

/**
 * Roll Up and Snuggle, bài 57 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Billiard
 * University Exam VI #3 (https://billiarduniversity.org/documents/BU_Exam-VI_Safety_Challenge.pdf). Layout và hai chỗ
 * bi dừng lấy từ toạ độ "→ app" của research [nguồn], đo từ hình nên sai số khoảng ±¼ diamond [suy luận]. Bi 2 về sát
 * long rail trái, bi cái dừng ngay sau bi 9 để bi 9 chắn đường tới bi 2. Điểm chạm, băng và chỗ dừng lấy từ
 * `ShotPhysics` (giữa bi, soft 0.8 m/s, ngắm 102.06°): bi 2 chạm long rail trái rồi nhả ra, bi cái dừng cách tâm vòng
 * 1.4", không đụng bi 9, cửa ngắm khoảng ±0.8° [suy luận]. Đường bi 2 vẽ bằng `objectBallBankPath` dù điểm cuối không
 * phải lỗ; `targetPocket` headLeft chỉ là lỗ gần nhất. Vòng đích bán kính 3", 3 cú, ngưỡng 2/3 theo tiêu chí chung của nhóm [đề xuất].
 * Chưa kiểm trên bàn thật.
 */
export const rollUpAndSnuggle = {
  id: '57',
  number: 57,
  title: 'Roll Up and Snuggle',
  subtitle: 'Roll the 2-ball to the rail and park the cue ball behind the 9.',
  category: 'patternPlay',
  skill: 'safety',
  skillLabel: 'Safety',
  difficulty: 3,
  objective: 'Hit the 2-ball almost full and soft so it rolls to the left rail, and stop the cue ball right behind the 9-ball.',
  cueBall: { x: 0.2, y: 0.483 },
  objectBalls: [
    { number: 2, x: 0.16, y: 0.557 },
    { number: 9, x: 0.185, y: 0.63 },
  ],
  targetPocket: 'headLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.185, y: 0.607 }, radius: 0.06, label: 'Cue' }],
  guideLines: [
    { kind: 'objectBallBankPath', points: [{ x: 0.16, y: 0.557 }, { x: 0.0226, y: 0.7285 }, { x: 0.0873, y: 0.8229 }] },
    { kind: 'expectedCuePath', points: [{ x: 0.2, y: 0.483 }, { x: 0.1773, y: 0.5362 }, { x: 0.2049, y: 0.5971 }] },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 3,
  passCondition: { kind: 'inZone', required: 2 },
  tips: [
    'Hit the 2-ball nearly full with a center hit. The cue ball creeps after it and dies behind the 9.',
    'Speed is everything: the 2-ball only needs to reach the rail.',
    'Pass when the hit is legal and there is no straight line from the cue ball to the 2-ball.',
  ],
  mistakes: [
    'Too firm: the cue ball rolls past the 9 and leaves a clear shot.',
    'Too thin: the cue ball drifts away from the 9 instead of tucking in behind it.',
  ],
} satisfies PoolDrill;
