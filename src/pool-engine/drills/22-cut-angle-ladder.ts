import type { PoolDrill } from '../types';

/**
 * Cut Angle Ladder, bài 03 + 05 của bản nháp `pool_practice_drills_01_10.md`. Bản nháp đo góc theo
 * đường bi cái → bi mục tiêu nên nhãn lệch 2–4°. Ở đây góc là góc thật theo ghost ball, bi cái cách
 * ghost ball 2 diamond, cả năm chỗ cùng một phía. Bi 1 và lỗ giữ nguyên, mỗi round chỉ dời bi cái.
 * Ngưỡng 10/15 giữ tỉ lệ 8/12 của bản nháp. Chưa kiểm trên bàn thật.
 */
export const cutAngleLadder = {
  id: '22',
  number: 22,
  title: 'Cut Angle Ladder',
  subtitle: 'Same ball, same pocket. The cut gets thinner every three shots.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Cut Angle',
  difficulty: 3,
  objective: 'Pot the 1-ball in the corner from 0° up to a 60° cut, three shots per angle.',
  cueBall: { x: 0.8405, y: 0.5253 },
  objectBalls: [{ number: 1, x: 0.5, y: 0.3125 }],
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
  attemptCount: 15,
  passCondition: { kind: 'pocketed', required: 10 },
  tips: [
    'Find the ghost ball first: the line from the pocket through the 1-ball, one ball back.',
    'Aim the center of the cue ball at the ghost ball, not at the 1-ball.',
    'Center ball and the same speed at every angle. No sidespin to help the cut.',
  ],
  mistakes: [
    'Pots at 0° but misses at 30°: you are aiming at the 1-ball. Aim at the ghost ball instead.',
    'Undercut, not enough angle: contact too full. Most common from 45° up, so look for the thinner contact point.',
    'Overcut, too much angle: contact too thin.',
    'On line but stops short of the pocket: check speed. Do not change your aim for it.',
    'Change one thing at a time. Never adjust speed and aim on the same shot.',
  ],
  rounds: [
    { title: '0°', spin: 'center', cueBall: { x: 0.8405, y: 0.5253 } },
    { title: '15°', spin: 'center', cueBall: { x: 0.7288, y: 0.5591 } },
    { title: '30°', spin: 'center', cueBall: { x: 0.6034, y: 0.5772 } },
    { title: '45°', spin: 'center', cueBall: { x: 0.4729, y: 0.5785 } },
    { title: '60°', spin: 'center', cueBall: { x: 0.3462, y: 0.5629 } },
  ],
} satisfies PoolDrill;
