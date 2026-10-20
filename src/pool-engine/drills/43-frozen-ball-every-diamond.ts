import type { PoolDrill } from '../types';

/**
 * Frozen Ball Every Diamond, bài 43 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, AZBilliards
 * (https://forums.azbilliards.com/threads/the-best-pool-drill.57129). Luật [forum]: bi ép băng ở các diamond, ball in hand
 * cú đầu rồi đánh từ chỗ bi cái dừng, thứ tự tuỳ ý, hết lượt khi chạm bi khác, trượt hoặc scratch; hạng E 5 bi liên tiếp
 * là [đề xuất]. Tip chạm bi và băng cùng lúc là kỹ thuật chung [suy luận]. Bàn có 18 diamond nhưng app chỉ có 15 bi, nên bỏ ba
 * diamond trên head rail [suy luận]: bi 1–6 băng trái, 7–12 băng phải ở y ⅛…⅞ trừ hai lỗ giữa, 13–15 foot rail. Bi cái
 * (0.15, 0.3) [đề xuất] cho cú đầu bi 1 vào footLeft cắt khoảng 17°. Chưa kiểm trên bàn thật.
 */
export const frozenBallEveryDiamond = {
  id: '43',
  number: 43,
  title: 'Frozen Ball Every Diamond',
  subtitle: 'A ball frozen to the rail at every diamond. Ball in hand, run as many as you can.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Rail Cuts',
  difficulty: 3,
  objective: 'Ball in hand, pot 5 frozen rail balls in a row.',
  cueBall: { x: 0.15, y: 0.3 },
  objectBalls: [
    { number: 1, x: 0.0225, y: 0.125 },
    { number: 2, x: 0.0225, y: 0.25 },
    { number: 3, x: 0.0225, y: 0.375 },
    { number: 4, x: 0.0225, y: 0.625 },
    { number: 5, x: 0.0225, y: 0.75 },
    { number: 6, x: 0.0225, y: 0.875 },
    { number: 7, x: 0.9775, y: 0.125 },
    { number: 8, x: 0.9775, y: 0.25 },
    { number: 9, x: 0.9775, y: 0.375 },
    { number: 10, x: 0.9775, y: 0.625 },
    { number: 11, x: 0.9775, y: 0.75 },
    { number: 12, x: 0.9775, y: 0.875 },
    { number: 13, x: 0.25, y: 0.01125 },
    { number: 14, x: 0.5, y: 0.01125 },
    { number: 15, x: 0.75, y: 0.01125 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 5,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: [
    'Any order. Your turn ends on a miss, a scratch, or touching another ball. Five in a row passes.',
    'Hit the ball and the rail at the same time, or a hair rail-first. Ball-first makes it jump off the rail.',
    'Soft speed: a frozen ball takes the pocket better slow.',
    'The forum suggests an hour straight on this one.',
  ],
  mistakes: [
    'Ball wobbles along the rail and stops in the jaws: too fast, or hit ball-first.',
    'Cue ball stuck on the rail afterwards: pick shots that bring it back to the middle.',
  ],
} satisfies PoolDrill;
