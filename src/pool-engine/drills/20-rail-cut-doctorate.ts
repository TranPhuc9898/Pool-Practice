import type { PoolDrill } from '../types';

/**
 * BU Exam II S2 Rail Cut, cấp Doctorate. Layout [nguồn]: long rail ở diamond 1, 2, 6, 7 cả hai rail (8 bi),
 * mỗi end rail 3 bi ở W = 1, 2, 3, thêm center spot. Bi sát băng như drill 18 [suy luận]. BU đếm /15;
 * ngưỡng 11 là đề xuất.
 * https://billiarduniversity.org/documents/BU_Exam-II_Skills-Doctorate.pdf
 */
export const railCutDoctorate = {
  id: '20',
  number: 20,
  title: 'Rail Cut · Doctorate',
  subtitle: 'Fifteen rail balls. Balls near the corners crowd the pocket.',
  category: 'shotMaking',
  skill: 'railCut',
  skillLabel: 'Rail Cut',
  difficulty: 5,
  objective: 'Pot all 15 in any order. No scratch, no combos, never touch another ball.',
  cueBall: { x: 0.25, y: 0.3 },
  objectBalls: [
    // Bi 2 đứng đầu: nó là cú mẫu của bàn. Bi 1 bị bi 2 chắn đường vào footLeft.
    { number: 2, x: 0.0225, y: 0.125 },
    { number: 1, x: 0.0225, y: 0.25 },
    { number: 3, x: 0.0225, y: 0.75 },
    { number: 4, x: 0.0225, y: 0.875 },
    { number: 5, x: 0.9775, y: 0.25 },
    { number: 6, x: 0.9775, y: 0.125 },
    { number: 7, x: 0.9775, y: 0.75 },
    { number: 8, x: 0.9775, y: 0.875 },
    { number: 9, x: 0.25, y: 0.0113 },
    { number: 10, x: 0.5, y: 0.0113 },
    { number: 11, x: 0.75, y: 0.0113 },
    { number: 12, x: 0.25, y: 0.9887 },
    { number: 13, x: 0.5, y: 0.9887 },
    { number: 14, x: 0.75, y: 0.9887 },
    { number: 15, x: 0.5, y: 0.5 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 2, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 2, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 15,
  passCondition: { kind: 'pocketed', required: 11 },
  tips: [
    'Ball in hand for every shot. Free the balls nearest each corner first.',
    'A frozen rail ball: aim at the rail a credit card width in front of the ball.',
    'BU scoring: two runs, keep the better. A miss or a foul ends the run.',
  ],
  mistakes: [
    'The 1-ball bounces off the rail: contact too full or too thin, or the cue ball hit the rail first.',
    'Cue rubs the rail: adjust your bridge and height, but do not jack up the cue more than you need.',
    'Hits the pocket point: check the line into the pocket opening before adding speed.',
  ],
} satisfies PoolDrill;
