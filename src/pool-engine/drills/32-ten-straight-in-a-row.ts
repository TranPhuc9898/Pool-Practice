import type { PoolDrill } from '../types';

/**
 * 10 Straight-In in a Row, bài 32 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, Dr. Dave BD 05/2020 #3
 * (https://drdavepoolinfo.com/bd_articles/2020/may20.pdf). Tiêu chí 10 cú liên tiếp, trượt đếm lại từ 0 là [nguồn].
 * Nguồn không cho toạ độ: bi 1 ở (L 6, W 1), bi cái lùi 2 diamond trên đường lỗ footLeft qua bi 1 là [đề xuất]; toạ độ
 * bi cái tính lại cho thẳng lỗ tuyệt đối (research in 0.472, 0.474). Lực medium là [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const tenStraightIn = {
  id: '32',
  number: 32,
  title: '10 Straight-In in a Row',
  subtitle: 'One dead-straight shot, ten times, no misses.',
  category: 'shotMaking',
  skill: 'straightStroke',
  skillLabel: 'Straight-In',
  difficulty: 1,
  objective: 'Pot the 1-ball 10 times in a row with a stop shot. A miss resets the count to zero.',
  cueBall: { x: 0.4736, y: 0.4736 },
  objectBalls: [{ number: 1, x: 0.25, y: 0.25 }],
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
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 10 },
  tips: [
    'Ten in a row. Miss once and start again from zero.',
    'Mark both balls with paper rings so every shot is the exact same setup.',
    'Stop the cue ball where it hits the 1-ball. Stay down until the ball drops.',
    'Dr. Dave: if ten in a row will not come, get a lesson on your stroke.',
  ],
  mistakes: [
    'Misses always to the same side: the stroke is crooked, not the aim. Watch the tip follow through on the line.',
    'Cue ball rolls forward after contact: hit a touch lower or a touch firmer.',
  ],
} satisfies PoolDrill;
