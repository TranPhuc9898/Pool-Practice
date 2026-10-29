import type { PoolDrill } from '../types';

/**
 * Bi 9 chắn đường thẳng tới bi 1, phải kick một băng (long rail trái) rồi hai băng (long rail phải, foot rail) để chạm
 * hợp lệ. Tự soạn cho giai đoạn 5 của `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`,
 * không lấy từ nguồn. Điểm chạm băng tính bằng gương qua đường tâm bi lúc chạm băng (x 0.0225 / 0.9775, y 0.01125), một
 * lần cho round 1, hai lần cho round 2, chưa tính băng nảy ngắn hay dài [suy luận]; đã kiểm đường kick cách bi 9 hơn
 * 3 inch. Lực 1.4 m/s và ngưỡng 6/8 [đề xuất]. Renderer vẫn vẽ đường bi 1 → `targetPocket`, lỗ đó chỉ để đủ schema.
 * Chưa kiểm trên bàn thật.
 */
export const kickOneAndTwoRails = {
  id: '89',
  number: 89,
  title: 'One- and Two-Rail Kicks',
  subtitle: 'The 9 blocks the 1. Kick one rail, then two rails, for a legal hit. Path drawn, not simulated.',
  category: 'shotMaking',
  skill: 'kick',
  skillLabel: 'Kick',
  difficulty: 5,
  objective: 'Make a legal hit on the 1-ball without touching the 9: one rail in round 1, two rails in round 2. Four tries each.',
  cueBall: { x: 0.75, y: 0.75 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.4 },
    { number: 9, x: 0.628, y: 0.58 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'expectedCuePath', points: [{ x: 0.75, y: 0.75 }, { x: 0.0225, y: 0.5387 }, { x: 0.4785, y: 0.4067 }] },
    { kind: 'railContact', point: { x: 0, y: 0.5387 } },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 8,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'Mirror the 1-ball across the rail and aim at the image. For two rails, mirror twice.',
    'Center ball, medium speed. Side spin or extra speed changes the rebound angle.',
    'A point is a legal hit: no scratch, the 9 untouched, and a ball reaches a rail after contact.',
  ],
  mistakes: [
    'Missing short on the two-rail kick every time: this table rebounds short. Move the aim point up the right rail.',
  ],
  rounds: [
    {
      title: 'One rail',
      spin: 'center',
      speed: 1.4,
      why: 'Mirror of the 1-ball across the left rail puts the contact a little above the side pocket, clear of the 9.',
      objectBalls: [
        { number: 1, x: 0.5, y: 0.4 },
        { number: 9, x: 0.628, y: 0.58 },
      ],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.75, y: 0.75 }, { x: 0.0225, y: 0.5387 }, { x: 0.4785, y: 0.4067 }] },
        { kind: 'railContact', point: { x: 0, y: 0.5387 } },
      ],
    },
    {
      title: 'Two rails',
      spin: 'center',
      speed: 1.4,
      why: 'Mirror twice, across the right rail then the foot rail. The cue ball comes off the foot rail into the 1 from below the 9.',
      cueBall: { x: 0.25, y: 0.8 },
      objectBalls: [
        { number: 1, x: 0.3, y: 0.15 },
        { number: 9, x: 0.27, y: 0.5 },
      ],
      guideLines: [
        {
          kind: 'expectedCuePath',
          points: [
            { x: 0.25, y: 0.8 },
            { x: 0.9775, y: 0.3197 },
            { x: 0.51, y: 0.01125 },
            { x: 0.3189, y: 0.1374 },
          ],
        },
        { kind: 'railContact', point: { x: 1, y: 0.3197 } },
        { kind: 'railContact', point: { x: 0.51, y: 0 } },
      ],
    },
  ],
} satisfies PoolDrill;
