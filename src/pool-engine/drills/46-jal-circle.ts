import type { DrillRound, PoolBallPlacement, PoolDrill } from '../types';

/**
 * Jal Circle, bài 46 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, Jal trên AZBilliards
 * (https://forums.azbilliards.com/threads/shot-making-drills.56705). Cung và quy tắc độ dày = 1 − W/4 là [forum]: bảy bi trên
 * cung tâm lỗ footLeft, bán kính nửa chiều dài bàn, W 0.5 → 3.5. Bi cái song song long rail sau bi, lùi 2 diamond về phía
 * head [suy luận]; với cách đặt này sin(góc cắt) = W/4 đúng tuyệt đối vì x bi cái là điểm ghost ball. Góc cắt 7, 15, 22,
 * 30, 39, 49, 61°. Mỗi bi 4 cú, ngưỡng 23/28 (khoảng 4/5) là [đề xuất]; forum không có tiêu chí. Mỗi round bàn còn các bi
 * chưa đánh. Chưa kiểm trên bàn thật.
 */
const arc = [
  { number: 1, x: 0.125, y: 0.4961 },
  { number: 2, x: 0.25, y: 0.4841 },
  { number: 3, x: 0.375, y: 0.4635 },
  { number: 4, x: 0.5, y: 0.433 },
  { number: 5, x: 0.625, y: 0.3903 },
  { number: 6, x: 0.75, y: 0.3307 },
  { number: 7, x: 0.875, y: 0.2421 },
] satisfies PoolBallPlacement[];

/** Bi cái nằm trên đường song song long rail qua ghost ball của từng bi, cùng thứ tự với `arc`. */
const cueSpots = [
  { x: 0.1306, y: 0.7461 },
  { x: 0.2612, y: 0.7341 },
  { x: 0.3919, y: 0.7135 },
  { x: 0.5225, y: 0.683 },
  { x: 0.6531, y: 0.6403 },
  { x: 0.7837, y: 0.5807 },
  { x: 0.9144, y: 0.4921 },
];

const thickness = ['7/8', '3/4', '5/8', '1/2', '3/8', '1/4', '1/8'];

export const jalCircle = {
  id: '46',
  number: 46,
  title: 'Jal Circle',
  subtitle: 'Seven balls on an arc around the corner. Each one is a known fraction of ball.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Ball Fraction',
  difficulty: 3,
  objective: 'Cut each ball into the left foot corner, shooting parallel to the long rail. Four shots per ball.',
  cueBall: cueSpots[0],
  objectBalls: arc,
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 28,
  passCondition: { kind: 'pocketed', required: 23 },
  tips: [
    "Jal's rule: hit thickness = 1 − W/4. Ball 1 is a 7/8 hit, ball 4 a half ball, ball 7 a 1/8 hit.",
    'Shoot every shot parallel to the long rail, so only the fraction changes.',
    'Get 4 of 5 on a ball before moving to the next.',
    'Variation: move the whole arc one diamond up the table.',
  ],
  mistakes: [
    'Half-ball shot goes thick or thin: for a half-ball hit, aim the cue ball center at the object ball edge.',
    'Thin balls 6 and 7 undercut: thin cuts feel wrong. Trust the fraction.',
  ],
  rounds: arc.map((ball, i): DrillRound => ({
    title: `Ball ${ball.number} · ${thickness[i]}`,
    spin: 'center',
    cueBall: cueSpots[i],
    objectBalls: arc.slice(i),
    guideLines: [
      { kind: 'objectBallPath', ball: ball.number, pocket: 'footLeft' },
      { kind: 'ghostBall', ball: ball.number, pocket: 'footLeft' },
    ],
  })),
} satisfies PoolDrill;
