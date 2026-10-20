import type { PoolDrill } from '../types';

/**
 * Shallow One-Rail Kick, bài 65 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Dr. Dave
 * VEPP #129–131, Billiards Digest 01/2013 (https://drdavepoolinfo.com/bd_articles/2013/jan13.pdf). Layout bi 9 gần
 * góc footLeft cách long rail trái một bề rộng bi và hai biến thể ½ bi, 1½ bi [nguồn]. Ba chỗ bi cái A, B, C và ngưỡng
 * 5/9 là [đề xuất], nguồn không có tiêu chí. Ghost ball nhắm bi 9 vào điểm góc lỗ footLeft; điểm chạm băng tính bằng
 * gương qua đường tâm bi lúc chạm băng, chưa tính băng nảy ngắn hay dài [suy luận]. 9 round = 3 khoảng cách × 3 chỗ bi
 * cái, 1 cú mỗi round. Chưa kiểm trên bàn thật.
 */
export const shallowOneRailKick = {
  id: '65',
  number: 65,
  title: 'Shallow One-Rail Kick',
  subtitle: 'Kick off the left rail just before a 9-ball sitting off the rail and send it to the corner.',
  category: 'shotMaking',
  skill: 'kick',
  skillLabel: 'Kick',
  difficulty: 3,
  objective: 'Kick off the left rail into the 9-ball near the bottom-left corner and pot it, or hit its contact point, from three cue ball spots and three rail gaps.',
  cueBall: { x: 0.25, y: 0.5 },
  objectBalls: [{ number: 9, x: 0.068, y: 0.088 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'expectedCuePath', points: [{ x: 0.25, y: 0.5 }, { x: 0.0225, y: 0.1924 }, { x: 0.0842, y: 0.109 }] },
    { kind: 'railContact', point: { x: 0, y: 0.1924 } },
    { kind: 'objectBallPath', ball: 9, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 9,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: [
    'The cue ball meets the rail just before the 9, at a shallow angle. Pick the rail spot that sends it into the contact point.',
    'The wider the gap to the rail, the farther up the rail you hit.',
    'Count a make or a clean hit on the contact point.',
  ],
  mistakes: [
    'Aiming at the 9 itself instead of its contact point: the 9 goes along the rail, not into the corner.',
    'Running side spin by accident: on a shallow kick it bends the rebound a lot. Stay on the vertical center.',
  ],
  rounds: [
    {
      title: '½ ball · Cue A',
      spin: 'center',
      cueBall: { x: 0.25, y: 0.5 },
      objectBalls: [{ number: 9, x: 0.045, y: 0.088 }],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.25, y: 0.5 }, { x: 0.0225, y: 0.1601 }, { x: 0.0561, y: 0.1098 }] },
        { kind: 'railContact', point: { x: 0, y: 0.1601 } },
        { kind: 'objectBallPath', ball: 9, pocket: 'footLeft' },
      ],
    },
    {
      title: '½ ball · Cue B',
      spin: 'center',
      cueBall: { x: 0.375, y: 0.625 },
      objectBalls: [{ number: 9, x: 0.045, y: 0.088 }],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.375, y: 0.625 }, { x: 0.0225, y: 0.1547 }, { x: 0.0561, y: 0.1098 }] },
        { kind: 'railContact', point: { x: 0, y: 0.1547 } },
        { kind: 'objectBallPath', ball: 9, pocket: 'footLeft' },
      ],
    },
    {
      title: '½ ball · Cue C',
      spin: 'center',
      cueBall: { x: 0.5, y: 0.75 },
      objectBalls: [{ number: 9, x: 0.045, y: 0.088 }],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.5, y: 0.75 }, { x: 0.0225, y: 0.1519 }, { x: 0.0561, y: 0.1098 }] },
        { kind: 'railContact', point: { x: 0, y: 0.1519 } },
        { kind: 'objectBallPath', ball: 9, pocket: 'footLeft' },
      ],
    },
    {
      title: '1 ball · Cue A',
      spin: 'center',
      cueBall: { x: 0.25, y: 0.5 },
      objectBalls: [{ number: 9, x: 0.068, y: 0.088 }],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.25, y: 0.5 }, { x: 0.0225, y: 0.1924 }, { x: 0.0842, y: 0.109 }] },
        { kind: 'railContact', point: { x: 0, y: 0.1924 } },
        { kind: 'objectBallPath', ball: 9, pocket: 'footLeft' },
      ],
    },
    {
      title: '1 ball · Cue B',
      spin: 'center',
      cueBall: { x: 0.375, y: 0.625 },
      objectBalls: [{ number: 9, x: 0.068, y: 0.088 }],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.375, y: 0.625 }, { x: 0.0225, y: 0.1859 }, { x: 0.0842, y: 0.109 }] },
        { kind: 'railContact', point: { x: 0, y: 0.1859 } },
        { kind: 'objectBallPath', ball: 9, pocket: 'footLeft' },
      ],
    },
    {
      title: '1 ball · Cue C',
      spin: 'center',
      cueBall: { x: 0.5, y: 0.75 },
      objectBalls: [{ number: 9, x: 0.068, y: 0.088 }],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.5, y: 0.75 }, { x: 0.0225, y: 0.1824 }, { x: 0.0842, y: 0.109 }] },
        { kind: 'railContact', point: { x: 0, y: 0.1824 } },
        { kind: 'objectBallPath', ball: 9, pocket: 'footLeft' },
      ],
    },
    {
      title: '1½ balls · Cue A',
      spin: 'center',
      cueBall: { x: 0.25, y: 0.5 },
      objectBalls: [{ number: 9, x: 0.09, y: 0.088 }],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.25, y: 0.5 }, { x: 0.0225, y: 0.2174 }, { x: 0.1105, y: 0.108 }] },
        { kind: 'railContact', point: { x: 0, y: 0.2174 } },
        { kind: 'objectBallPath', ball: 9, pocket: 'footLeft' },
      ],
    },
    {
      title: '1½ balls · Cue B',
      spin: 'center',
      cueBall: { x: 0.375, y: 0.625 },
      objectBalls: [{ number: 9, x: 0.09, y: 0.088 }],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.375, y: 0.625 }, { x: 0.0225, y: 0.2113 }, { x: 0.1105, y: 0.108 }] },
        { kind: 'railContact', point: { x: 0, y: 0.2113 } },
        { kind: 'objectBallPath', ball: 9, pocket: 'footLeft' },
      ],
    },
    {
      title: '1½ balls · Cue C',
      spin: 'center',
      cueBall: { x: 0.5, y: 0.75 },
      objectBalls: [{ number: 9, x: 0.09, y: 0.088 }],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.5, y: 0.75 }, { x: 0.0225, y: 0.2079 }, { x: 0.1105, y: 0.108 }] },
        { kind: 'railContact', point: { x: 0, y: 0.2079 } },
        { kind: 'objectBallPath', ball: 9, pocket: 'footLeft' },
      ],
    },
  ],
} satisfies PoolDrill;
