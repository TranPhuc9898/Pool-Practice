import type { PoolDrill } from '../types';

/**
 * BU Exam II S2 Rail Cut, cấp Masters. Layout [nguồn]: 4 bi long rail như Bachelors, mỗi end rail 3 bi ở
 * W = 1, 2, 3, thêm center spot. Bi sát băng như drill 18 [suy luận]. BU đếm /11; ngưỡng 8 là đề xuất.
 * https://billiarduniversity.org/documents/BU_Exam-II_Skills-Masters.pdf
 */
export const railCutMasters = {
  id: '19',
  number: 19,
  title: 'Rail Cut · Masters',
  subtitle: 'Eleven rail balls. More balls in the way on every end rail.',
  category: 'shotMaking',
  skill: 'railCut',
  skillLabel: 'Rail Cut',
  difficulty: 4,
  objective: 'Pot all 11 in any order. No scratch, no combos, never touch another ball.',
  cueBall: { x: 0.25, y: 0.42 },
  objectBalls: [
    { number: 1, x: 0.0225, y: 0.25 },
    { number: 2, x: 0.0225, y: 0.75 },
    { number: 3, x: 0.9775, y: 0.25 },
    { number: 4, x: 0.9775, y: 0.75 },
    { number: 5, x: 0.25, y: 0.0113 },
    { number: 6, x: 0.5, y: 0.0113 },
    { number: 7, x: 0.75, y: 0.0113 },
    { number: 8, x: 0.25, y: 0.9887 },
    { number: 9, x: 0.5, y: 0.9887 },
    { number: 10, x: 0.75, y: 0.9887 },
    { number: 11, x: 0.5, y: 0.5 },
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
  attemptCount: 11,
  passCondition: { kind: 'pocketed', required: 8 },
  tips: [
    'Ball in hand for every shot. Clear the end-rail balls before they block each other.',
    'A frozen rail ball: aim at the rail a credit card width in front of the ball.',
    'BU scoring: two runs, keep the better. A miss or a foul ends the run.',
  ],
  mistakes: [
    'The 1-ball bounces off the rail: contact too full or too thin, or the cue ball hit the rail first.',
    'Cue rubs the rail: adjust your bridge and height, but do not jack up the cue more than you need.',
    'Hits the pocket point: check the line into the pocket opening before adding speed.',
  ],
} satisfies PoolDrill;
