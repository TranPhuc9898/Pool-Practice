import type { PoolDrill } from '../types';

/**
 * Combo Progression, bài 47 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, TableSkills
 * (https://www.tableskills.com/learn-to-play/combination-shot/). Luật [nguồn]: bi 1 gần miệng lỗ footRight, bi 2 thẳng
 * hàng bi 1 và lỗ, bi cái sau bi 2 khoảng 1 ft cùng đường; vào thì lùi bi 2, chắc rồi thì stop bi cái. Toạ độ và mốc
 * hạng D (7/10 với bi cái lệch 15°) là [đề xuất]. Bi 1 research ở x 0.993 lọt ngoài mặt bàn nên dời về x 0.9767,
 * y 0.07 trên đường lỗ → bi 2, cách lỗ khoảng 7" [suy luận]. Bi cái round thẳng cách bi 2 đúng 12"; round 15° quay quanh
 * bi 2 [suy luận]. objectBalls[0] là bi 1, bi rơi lỗ, nên stage ngắm bi 1 chứ không phải bi chạm đầu; Play ẩn với combo.
 * 3 round × 10 cú, ngưỡng 21/30 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const comboProgression = {
  id: '47',
  number: 47,
  title: 'Combo Progression',
  subtitle: 'Cue ball into the 2, the 2 into the 1, the 1 into the corner. Then stop it, then angle it.',
  category: 'shotMaking',
  skill: 'combo',
  skillLabel: 'Combo',
  difficulty: 3,
  objective: 'Make the straight combo, then the same combo with a stop shot, then from 15° off the line.',
  cueBall: { x: 0.7105, y: 0.8684 },
  objectBalls: [
    { number: 1, x: 0.9767, y: 0.07 },
    { number: 2, x: 0.75, y: 0.75 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [],
  guideLines: [{ kind: 'objectBallPath', ball: 1, pocket: 'footRight' }],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 30,
  passCondition: { kind: 'pocketed', required: 21 },
  tips: [
    'Aim the 2-ball at the 1, not at the pocket. The 1 only has to be hit full.',
    'Each make: move the 2-ball a few inches back toward the head rail.',
    'Stop round: the cue ball should die right where it hit the 2.',
    'D level: 7 of 10 with the cue ball 15° off the line.',
  ],
  mistakes: [
    'The 1 goes in the rail beside the pocket: the 2 was hit a little off line. Find the 2-ball ghost first.',
    'Combo misses on the angled shot: throw between the two balls. Shoot a bit firmer.',
  ],
  rounds: [
    { title: 'Straight', spin: 'center', cueBall: { x: 0.7105, y: 0.8684 } },
    { title: 'Stop', spin: 'stun', cueBall: { x: 0.7105, y: 0.8684 }, contactPoint: { x: 0, y: -0.1 } },
    { title: '15° off line', spin: 'center', contactPoint: { x: 0, y: 0 }, speed: 1.7, cueBall: { x: 0.6432, y: 0.8814 } },
  ],
} satisfies PoolDrill;
