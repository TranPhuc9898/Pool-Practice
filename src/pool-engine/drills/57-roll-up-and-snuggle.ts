import type { PoolDrill } from '../types';

/**
 * Roll Up and Snuggle, bài 57 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Billiard
 * University Exam VI #3 (https://billiarduniversity.org/documents/BU_Exam-VI_Safety_Challenge.pdf). Layout và hai chỗ
 * bi dừng lấy từ toạ độ "→ app" của research [nguồn], đo từ hình nên sai số khoảng ±¼ diamond [suy luận]. Bi 2 về sát
 * long rail trái, bi cái dừng ngay sau bi 9 để bi 9 chắn đường tới bi 2. Ghost ball cho góc cắt khoảng 2°, gần như
 * chạm dày. Đường bi 2 vẽ bằng `objectBallBankPath` hai điểm vì đích là chỗ dừng sát băng, không phải lỗ; `targetPocket`
 * headLeft chỉ là lỗ gần nhất. Vòng đích bán kính 3", 3 cú, ngưỡng 2/3 theo tiêu chí chung của nhóm [đề xuất].
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
    { kind: 'objectBallBankPath', points: [{ x: 0.16, y: 0.557 }, { x: 0.04, y: 0.758 }] },
    { kind: 'expectedCuePath', points: [{ x: 0.2, y: 0.483 }, { x: 0.1729, y: 0.5354 }, { x: 0.185, y: 0.607 }] },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 3,
  passCondition: { kind: 'inZone', required: 2 },
  tips: [
    'Hit the 2-ball nearly full. A touch of follow lets the cue ball creep after it and die behind the 9.',
    'Speed is everything: the 2-ball only needs to reach the rail.',
    'Pass when the hit is legal and there is no straight line from the cue ball to the 2-ball.',
  ],
  mistakes: [
    'Too firm: the cue ball rolls past the 9 and leaves a clear shot.',
    'Too thin: the cue ball drifts away from the 9 instead of tucking in behind it.',
  ],
} satisfies PoolDrill;
