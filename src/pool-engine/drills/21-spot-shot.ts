import type { PoolDrill } from '../types';

/**
 * Spot Shot Challenge, Dr. Dave FAQ. Layout [nguồn]: bi mục tiêu ở foot spot, bi cái ball in hand trong kitchen.
 * Nguồn chấm bằng số cú liên tiếp; ở đây mỗi cú là một attempt, ngưỡng 5/10 là đề xuất.
 * Chỗ đặt bi cái là một vị trí hợp lệ trong kitchen, cú sau đánh từ chỗ bi cái dừng.
 * https://drdavepoolinfo.com/faq/drill/spot-shot/
 */
export const spotShot = {
  id: '21',
  number: 21,
  title: 'Spot Shot Challenge',
  subtitle: 'Pot the spot ball and bring the cue ball back to the kitchen.',
  category: 'shotMaking',
  skill: 'spotShot',
  skillLabel: 'Spot Shot',
  difficulty: 3,
  objective: 'Pot the ball on the foot spot and finish with the cue ball behind the head string.',
  cueBall: { x: 0.75, y: 0.8 },
  objectBalls: [{ number: 1, x: 0.5, y: 0.25 }],
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
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: [
    'Pass only if the ball drops and the cue ball ends behind the head string.',
    'Re-spot the ball and shoot from wherever the cue ball stopped.',
    'Dr. Dave scores the longest run in a row. Count your best streak too.',
  ],
  mistakes: [
    '1-ball stops short of the pocket: work on speed, but never add speed when the line is clearly off.',
    '1-ball misses on the outside: go back to ghost ball aiming.',
  ],
} satisfies PoolDrill;
