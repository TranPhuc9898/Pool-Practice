import type { DrillRound, PoolBallPlacement, PoolDrill } from '../types';

/**
 * 15-Ball Lineup, bài 35 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, Scott Lee
 * (https://www.mypoolblog.com/lessons-and-articles/15-ball-lineup-drill). Luật [nguồn]: 15 bi ngang bàn trên đường nối hai
 * lỗ giữa, stop shot, bi 1–8 vào footLeft, 9–15 vào footRight, trượt thì bỏ bi ra, không đánh lại. W chia đều 0.3 → 3.7
 * diamond theo research; ví dụ "bi 1 ở W 1" trong research chỉ là minh hoạ, ở đây bi 1 ở W 0.3. Bi cái mỗi round lùi
 * 2 diamond thẳng lỗ sau bi đang đánh [nguồn], bàn chỉ còn các bi chưa đánh. Ngưỡng 10/15 là [đề xuất] hạng G;
 * mốc 12–13/15 dưới intermediate, khoảng 95% là intermediate là [forum]
 * (https://forums.azbilliards.com/threads/your-percent-for-this-drill.503614/). Chưa kiểm trên bàn thật.
 */
const line = [
  { number: 1, x: 0.075, y: 0.5 },
  { number: 2, x: 0.1357, y: 0.5 },
  { number: 3, x: 0.1964, y: 0.5 },
  { number: 4, x: 0.2571, y: 0.5 },
  { number: 5, x: 0.3179, y: 0.5 },
  { number: 6, x: 0.3786, y: 0.5 },
  { number: 7, x: 0.4393, y: 0.5 },
  { number: 8, x: 0.5, y: 0.5 },
  { number: 9, x: 0.5607, y: 0.5 },
  { number: 10, x: 0.6214, y: 0.5 },
  { number: 11, x: 0.6821, y: 0.5 },
  { number: 12, x: 0.7429, y: 0.5 },
  { number: 13, x: 0.8036, y: 0.5 },
  { number: 14, x: 0.8643, y: 0.5 },
  { number: 15, x: 0.925, y: 0.5 },
] satisfies PoolBallPlacement[];

/** Bi cái thẳng lỗ, cách bi i đúng 2 diamond (25"), cùng thứ tự với `line`. */
const cueSpots = [
  { x: 0.1124, y: 0.7493 },
  { x: 0.2029, y: 0.7477 },
  { x: 0.2928, y: 0.7453 },
  { x: 0.3816, y: 0.7421 },
  { x: 0.4694, y: 0.7383 },
  { x: 0.5556, y: 0.7338 },
  { x: 0.6404, y: 0.7289 },
  { x: 0.7236, y: 0.7236 },
  { x: 0.3596, y: 0.7289 },
  { x: 0.4444, y: 0.7338 },
  { x: 0.5306, y: 0.7383 },
  { x: 0.6184, y: 0.7421 },
  { x: 0.7072, y: 0.7453 },
  { x: 0.7971, y: 0.7477 },
  { x: 0.8876, y: 0.7493 },
];

export const fifteenBallLineup = {
  id: '35',
  number: 35,
  title: '15-Ball Lineup',
  subtitle: 'Fifteen balls across the side pockets. One straight stop shot each, no second chances.',
  category: 'shotMaking',
  skill: 'lineUp',
  skillLabel: 'Line-Up',
  difficulty: 1,
  objective: 'Stop-shot each ball straight into a foot corner: 1–8 left, 9–15 right. Pot 10 of 15.',
  cueBall: cueSpots[0],
  objectBalls: line,
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.1 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 15,
  passCondition: { kind: 'pocketed', required: 10 },
  tips: [
    'Place the cue ball straight behind each ball, two diamonds back. A miss comes off the table, no retry.',
    'Too hard? Start one diamond back, then move to two once you make 10.',
    'Forum benchmark: 12–13 of 15 is just under intermediate, about 14 of 15 is intermediate.',
    'Harder: put the cue ball on the first diamond or right against the head rail.',
  ],
  mistakes: [
    'More misses on the middle balls: the object ball travels farthest there, so a crooked stroke shows. Check the follow-through.',
    'Cue ball drifts off after contact: the shot was not straight. Reset the cue ball before blaming the stroke.',
  ],
  rounds: line.map((ball, i): DrillRound => {
    const pocket = ball.number <= 8 ? 'footLeft' : 'footRight';
    return {
      title: `Ball ${ball.number}`,
      spin: 'stun',
      cueBall: cueSpots[i],
      objectBalls: line.slice(i),
      guideLines: [
        { kind: 'objectBallPath', ball: ball.number, pocket },
        { kind: 'ghostBall', ball: ball.number, pocket },
      ],
    };
  }),
} satisfies PoolDrill;
