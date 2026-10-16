import type { PoolDrill } from '../types';

/**
 * BU Exam II S2 Rail Cut, cấp Bachelors. Layout [nguồn]: bi sát băng ở diamond 2 và 6 hai long rail, tâm hai
 * end rail, center spot. Bi trên hình BU trông frozen, text không nói rõ [suy luận]: tâm cách băng một bán kính.
 * BU chỉ đếm số bi vào /7; ngưỡng 5 là đề xuất, cùng tỉ lệ ~70% các drill khác.
 * Bi cái ball in hand: chỗ đặt là một vị trí hợp lệ cho bi 1, không phải chỗ bắt buộc.
 * https://billiarduniversity.org/documents/BU_Exam-II_Skills-Bachelors.pdf
 */
export const railCutBachelors = {
  id: '18',
  number: 18,
  title: 'Rail Cut · Bachelors',
  subtitle: 'Seven balls on the rails and the center spot. Ball in hand every shot.',
  category: 'shotMaking',
  skill: 'railCut',
  skillLabel: 'Rail Cut',
  difficulty: 3,
  objective: 'Pot all 7 in any order. No scratch, no combos, never touch another ball.',
  cueBall: { x: 0.25, y: 0.42 },
  objectBalls: [
    { number: 1, x: 0.0225, y: 0.25 },
    { number: 2, x: 0.0225, y: 0.75 },
    { number: 3, x: 0.9775, y: 0.25 },
    { number: 4, x: 0.9775, y: 0.75 },
    { number: 5, x: 0.5, y: 0.0113 },
    { number: 6, x: 0.5, y: 0.9887 },
    { number: 7, x: 0.5, y: 0.5 },
  ],
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
  attemptCount: 7,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: [
    'Ball in hand for every shot. Pick the order yourself.',
    'A frozen rail ball: aim at the rail a credit card width in front of the ball.',
    'BU scoring: two runs, keep the better. A miss or a foul ends the run.',
  ],
  mistakes: [
    'The 1-ball bounces off the rail: contact too full or too thin, or the cue ball hit the rail first.',
    'Cue rubs the rail: adjust your bridge and height, but do not jack up the cue more than you need.',
    'Hits the pocket point: check the line into the pocket opening before adding speed.',
  ],
} satisfies PoolDrill;
