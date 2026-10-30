import type { PoolDrill } from '../types';

/**
 * Short Stop / Follow / Draw into Side, bài 33 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, Dr. Dave
 * BD 05/2020 #6 (https://drdavepoolinfo.com/bd_articles/2020/may20.pdf). Layout bi cái ở center, bi 1 cách 1 diamond thẳng
 * lỗ giữa trái, ba bài stop, follow, draw, mỗi bài 5 cú liên tiếp là [nguồn]. Ba round 5 cú, qua khi mỗi round vào 3/5
 * là ngưỡng hạng H, nhẹ hơn nguồn [đề xuất]. Điểm chạm cơ và lực medium là [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const shortStopFollowDraw = {
  id: '33',
  number: 33,
  title: 'Short Stop / Follow / Draw',
  subtitle: 'One short straight shot into the side. Stop it, follow it in, draw it across.',
  category: 'shotMaking',
  skill: 'straightStroke',
  skillLabel: 'Straight-In',
  difficulty: 1,
  objective:
    'Five shots with each stroke: stop, follow into the same side pocket, draw back to the opposite side. Make 3 of 5 in every round.',
  cueBall: { x: 0.5, y: 0.5 },
  objectBalls: [{ number: 1, x: 0.25, y: 0.5 }],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.1 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 15,
  passCondition: { kind: 'roundQuota', required: 9, perRound: 3 },
  tips: [
    'Make 3 of 5 with every stroke. Extra makes in one stroke do not cover misses in another.',
    'Stop: the cue ball parks where the 1-ball was.',
    'Follow: the cue ball rolls in right behind the 1-ball. Draw: it comes straight back into the far side pocket.',
    'Same aim for all three. Only the tip height changes.',
  ],
  mistakes: [
    'Follow or draw drifts off the line: tip off the vertical center, or the shot is not dead straight.',
    'Draw dies halfway: the stroke stops at the ball. Finish through the cue ball.',
  ],
  rounds: [
    { title: 'Stop', spin: 'stun', contactPoint: { x: 0, y: -0.1 } },
    { title: 'Follow', spin: 'follow', contactPoint: { x: 0, y: 0.4 }, speed: 0.85 },
    { title: 'Draw', spin: 'draw', contactPoint: { x: 0, y: -0.4 } },
  ],
} satisfies PoolDrill;
