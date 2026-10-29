import type { PoolDrill } from '../types';

/**
 * Nguồn: Giỏi Bi-a, bài kick hai băng anh lưu (https://www.facebook.com/share/v/1BGmEfWtxP/). Công thức trong caption
 * [nguồn]: số bi cái − số điểm đích = số điểm ngắm (ví dụ 7 − 2 = 5). [suy luận]: đường vẽ tính bằng gương kép qua
 * đường tâm bi (băng chân y 0.01125 rồi băng phải x 0.9775), không phải từ công thức, chưa tính băng nảy ngắn/dài; đã
 * kiểm bi 9 nằm trên đường thẳng tới bi 1 (< 1") và đường kick cách bi 9 ≥ 12". Bốn thế, lực 1.5 m/s, ngưỡng 5/8
 * [đề xuất]. Renderer vẫn vẽ đường bi 1 → `targetPocket`, lỗ đó chỉ để đủ schema. Chưa kiểm trên bàn thật.
 */
export const twoRailKickSubtraction = {
  id: '111',
  number: 111,
  title: 'Two-Rail Kick by Subtraction',
  subtitle: 'The 9 blocks the 1. Kick right rail then foot rail, aim with cue-ball number minus target number. Path drawn, not simulated.',
  category: 'shotMaking',
  skill: 'kick',
  skillLabel: 'Kick',
  difficulty: 5,
  objective: 'Make a legal two-rail kick on the 1 without touching the 9. Four setups, two tries each.',
  cueBall: { x: 0.2, y: 0.8 },
  objectBalls: [
    { number: 1, x: 0.25, y: 0.15 },
    { number: 9, x: 0.24, y: 0.5 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'expectedCuePath', points: [{ x: 0.2, y: 0.8 }, { x: 0.9775, y: 0.3208 }, { x: 0.4751, y: 0.0112 }, { x: 0.2784, y: 0.1325 }] },
    { kind: 'railContact', point: { x: 1, y: 0.3208 } },
    { kind: 'railContact', point: { x: 0.4751, y: 0 } },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 8,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: [
    'Read the cue-ball number off the rail, read the target number, subtract: that is the diamond to aim at (7 − 2 = 5).',
    'Center ball, medium pace, so the rails give back the angle the system expects.',
    'A point is a legal hit: no scratch, the 9 untouched, and a ball reaches a rail after contact.',
  ],
  mistakes: [
    'Hitting harder to be safe: the ball digs into the first rail and comes off short.',
    'Adding side spin by accident: running english lengthens the second leg.',
  ],
  rounds: [
    {
      title: 'Long kick, 1 near the foot',
      spin: 'center',
      speed: 1.5,
      contactPoint: { x: 0, y: 0 },
      cueBall: { x: 0.2, y: 0.8 },
      objectBalls: [
        { number: 1, x: 0.25, y: 0.15 },
        { number: 9, x: 0.24, y: 0.5 },
      ],
      why: 'The 9 sits dead on the line. Right rail just below the side, foot rail left of center, into the 1 from below.',
      guideLines: [
        {
          kind: 'expectedCuePath',
          points: [{ x: 0.2, y: 0.8 }, { x: 0.9775, y: 0.3208 }, { x: 0.4751, y: 0.0112 }, { x: 0.2784, y: 0.1325 }],
        },
        { kind: 'railContact', point: { x: 1, y: 0.3208 } },
        { kind: 'railContact', point: { x: 0.4751, y: 0 } },
      ],
    },
    {
      title: 'From the head end',
      spin: 'center',
      speed: 1.5,
      contactPoint: { x: 0, y: 0 },
      cueBall: { x: 0.4, y: 0.85 },
      objectBalls: [
        { number: 1, x: 0.15, y: 0.25 },
        { number: 9, x: 0.28, y: 0.55 },
      ],
      why: 'Cue ball further up the table: the right-rail mark moves up toward the side pocket.',
      guideLines: [
        {
          kind: 'expectedCuePath',
          points: [{ x: 0.4, y: 0.85 }, { x: 0.9775, y: 0.4071 }, { x: 0.4613, y: 0.0112 }, { x: 0.1746, y: 0.2312 }],
        },
        { kind: 'railContact', point: { x: 1, y: 0.4071 } },
        { kind: 'railContact', point: { x: 0.4613, y: 0 } },
      ],
    },
    {
      title: 'Short angle',
      spin: 'center',
      speed: 1.5,
      contactPoint: { x: 0, y: 0 },
      cueBall: { x: 0.15, y: 0.6 },
      objectBalls: [
        { number: 1, x: 0.4, y: 0.12 },
        { number: 9, x: 0.27, y: 0.36 },
      ],
      why: 'The 1 close to the foot rail: the first rail mark drops to below diamond 2 and the second rail moves right.',
      guideLines: [
        {
          kind: 'expectedCuePath',
          points: [{ x: 0.15, y: 0.6 }, { x: 0.9775, y: 0.1892 }, { x: 0.6191, y: 0.0112 }, { x: 0.4319, y: 0.1041 }],
        },
        { kind: 'railContact', point: { x: 1, y: 0.1892 } },
        { kind: 'railContact', point: { x: 0.6191, y: 0 } },
      ],
    },
    {
      title: '1 on the left side',
      spin: 'center',
      speed: 1.5,
      contactPoint: { x: 0, y: 0 },
      cueBall: { x: 0.55, y: 0.7 },
      objectBalls: [
        { number: 1, x: 0.12, y: 0.35 },
        { number: 9, x: 0.34, y: 0.53 },
      ],
      why: 'Long way round to a ball near the left rail. Same subtraction, same aim at the right rail.',
      guideLines: [
        {
          kind: 'expectedCuePath',
          points: [{ x: 0.55, y: 0.7 }, { x: 0.9775, y: 0.3582 }, { x: 0.5436, y: 0.0112 }, { x: 0.1439, y: 0.3309 }],
        },
        { kind: 'railContact', point: { x: 1, y: 0.3582 } },
        { kind: 'railContact', point: { x: 0.5436, y: 0 } },
      ],
    },
  ],
} satisfies PoolDrill;
