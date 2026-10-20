import type { PoolDrill } from '../types';

/**
 * Jewett Spot Progression, bài 36 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, Bob Jewett, Progressive
 * Practice Fig. 2 (https://drdavepoolinfo.com/resource_files/progpract.pdf). Luật thang [nguồn]: vào thì lùi một chỗ, trượt
 * thì tiến một chỗ, 15 cú, chỗ cuối là điểm 50%; người trên trung bình rẽ được góc tới chỗ 5. Toạ độ bảy chỗ a–g là
 * [suy luận], cần đối chiếu hình gốc. App chưa có thang thích nghi nên round đi cố định a → g, mỗi chỗ 2 cú; ngưỡng 7/14
 * (50%) là [đề xuất]. Góc cắt theo ghost ball: 0, 20, 28, 32, 35, 47, 58°. Chưa kiểm trên bàn thật.
 */
export const jewettSpotProgression = {
  id: '36',
  number: 36,
  title: 'Jewett Spot Progression',
  subtitle: 'Spot ball into the right corner. The cue ball walks back and around until the cut gets away from you.',
  category: 'shotMaking',
  skill: 'spotShot',
  skillLabel: 'Spot Shot',
  difficulty: 1,
  objective: 'Pot the spot ball in the right foot corner from seven cue ball spots, two shots each.',
  cueBall: { x: 0.25, y: 0.375 },
  objectBalls: [{ number: 1, x: 0.5, y: 0.25 }],
  targetPocket: 'footRight',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 14,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    'Spot 1 is straight in. Each spot after it is a thinner cut.',
    "Jewett's ladder on a real table: make it and move back one spot, miss and move up one. After 15 shots, where you stand is your 50% spot.",
    'An above-average player gets to spot 5, the corner where the spots turn along the head rail.',
    'For a steadier number, move up two spots on a miss and back one on a make.',
  ],
  mistakes: [
    'Undercuts from spot 5 on: you are aiming at the ball. Find the ghost ball first.',
    'Rattles in the jaws on the far spots: you added speed as the cut got thinner. Keep the pace and trust the aim.',
  ],
  rounds: [
    { title: 'Spot 1', spin: 'center', cueBall: { x: 0.25, y: 0.375 } },
    { title: 'Spot 2', spin: 'center', cueBall: { x: 0.25, y: 0.5 } },
    { title: 'Spot 3', spin: 'center', cueBall: { x: 0.25, y: 0.625 } },
    { title: 'Spot 4', spin: 'center', cueBall: { x: 0.25, y: 0.75 } },
    { title: 'Spot 5', spin: 'center', cueBall: { x: 0.25, y: 0.875 } },
    { title: 'Spot 6', spin: 'center', cueBall: { x: 0.5, y: 0.875 } },
    { title: 'Spot 7', spin: 'center', cueBall: { x: 0.75, y: 0.875 } },
  ],
} satisfies PoolDrill;
