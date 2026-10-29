import type { PoolDrill } from '../types';

/**
 * Long Diagonal Straight-In, bài 37 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, Dr. Dave BD 05/2020
 * #7 (https://drdavepoolinfo.com/bd_articles/2020/may20.pdf). Tiêu chí [nguồn]: stop 10 liên tiếp, follow-to-scratch 5
 * liên tiếp, draw-to-scratch 1/5 trở lên là tốt. Toạ độ [suy luận]: bi cái gần góc headRight, bi 1 dời về đúng đường chéo
 * bàn (W 1.875 thay vì 1.9) cho thẳng lỗ footLeft tuyệt đối. Bốn round 5 cú: hai round stop cho đủ 10 cú, follow, draw.
 * App chỉ đếm bi vào, không chấm scratch, nên ngưỡng 16/20 là 10 + 5 + 1 của nguồn [đề xuất]. Lực firm [đề xuất].
 * Chưa kiểm trên bàn thật.
 */
export const longDiagonalStraightIn = {
  id: '37',
  number: 37,
  title: 'Long Diagonal Straight-In',
  subtitle: 'Corner to corner down the diagonal. Stop it, follow it in, then draw it all the way back.',
  category: 'shotMaking',
  skill: 'straightStroke',
  skillLabel: 'Straight-In',
  difficulty: 2,
  objective: 'Ten stop shots in a row, five follow-to-scratch in a row, then try to draw back into the near corner.',
  cueBall: { x: 0.9375, y: 0.9375 },
  objectBalls: [{ number: 1, x: 0.4688, y: 0.4688 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.1 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'firm',
  allowedRails: 0,
  attemptCount: 20,
  passCondition: { kind: 'pocketed', required: 16 },
  tips: [
    'Stop: ten in a row. Follow: the cue ball chases the 1-ball into the same corner, five in a row.',
    'Draw: bring the cue ball all the way back into the near corner. One in five is good.',
    'Mark both balls with donut stickers so the shot never changes.',
    'Long and straight shows every stroke flaw. Stay down until the 1-ball drops.',
  ],
  mistakes: [
    'Cue ball rolls forward on the stop shot: at this distance the backspin wears off. Hit lower or firmer.',
    'Follow or draw drifts off the diagonal: the tip was off the vertical center.',
    'Draw dies halfway back: you slowed the cue down at contact. Accelerate through the ball.',
  ],
  rounds: [
    { title: 'Stop', spin: 'stun', contactPoint: { x: 0, y: -0.1 } },
    { title: 'Stop', spin: 'stun', contactPoint: { x: 0, y: -0.1 } },
    { title: 'Follow to scratch', spin: 'follow', contactPoint: { x: 0, y: 0.4 }, speed: 1.75 },
    { title: 'Draw to scratch', spin: 'draw', contactPoint: { x: 0, y: -0.4 } },
  ],
} satisfies PoolDrill;
