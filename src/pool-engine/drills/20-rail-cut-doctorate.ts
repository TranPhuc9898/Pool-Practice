import type { PoolDrill } from '../types';

/**
 * BU Exam II S2 Rail Cut, cấp Doctorate. Layout [nguồn]: long rail ở diamond 1, 2, 6, 7 cả hai rail (8 bi),
 * mỗi end rail 3 bi ở W = 1, 2, 3, thêm center spot. Bi sát băng như drill 18 [suy luận]. BU đếm /15;
 * ngưỡng 11 là đề xuất. Ball in hand chỉ ở cú đầu như drill 18. Route chép từ `sh scripts/rack-harness/run.sh` trên
 * ShotPhysics ddf3049, không phải route duy nhất. Hash khác thì chạy lại harness, chép lại số.
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
  cueBall: { x: 0.725, y: 0.5 },
  objectBalls: [
    // Bi đầu mảng là bi cú 1: stage lấy nó làm bi ngắm.
    { number: 15, x: 0.5, y: 0.5 },
    // Bi 1 bị bi 2 chắn đường vào footLeft.
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
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 15, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 15, pocket: 'sideLeft' },
    { kind: 'cueBallPath', ball: 15, pocket: 'sideLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 15,
  passCondition: { kind: 'pocketed', required: 11 },
  tips: [
    'Ball in hand for the first shot only. After that, play from where the cue ball stops, in any order.',
    'A frozen rail ball: aim at the rail a credit card width in front of the ball.',
    'BU scoring: two runs, keep the better. A miss or a foul ends the run.',
  ],
  mistakes: [
    'The 1-ball bounces off the rail: contact too full or too thin, or the cue ball hit the rail first.',
    'Cue rubs the rail: adjust your bridge and height, but do not jack up the cue more than you need.',
    'Hits the pocket point: check the line into the pocket opening before adding speed.',
  ],
  shots: [
    { ball: 15, pocket: 'sideLeft', tipY: 0, speed: 0.8, rate: 39, why: '0° cut. Center ball leaves the cue ball about 3 diamonds from ball 2 with a 27° cut into the foot left corner.' },
    { ball: 2, pocket: 'footLeft', tipY: 0.2, speed: 0.8, rate: 22, why: '27° cut. Follow leaves the cue ball about 7 diamonds from ball 8 with a 27° cut into the head right corner.' },
    { ball: 8, pocket: 'headRight', tipY: 0.2, speed: 1, rate: 13, why: '27° cut. Follow leaves the cue ball about 3 diamonds from ball 12 with a 14° cut into the head left corner.' },
    { ball: 12, pocket: 'headLeft', tipY: 0.2, speed: 0.8, rate: 30, why: '14° cut. Follow leaves the cue ball about 6 diamonds from ball 1 with a 7° cut into the foot left corner.' },
    { ball: 1, pocket: 'footLeft', tipY: 0.2, speed: 1, rate: 23, why: '7° cut. Follow leaves the cue ball about 6 diamonds from ball 7 with a 41° cut into the head right corner.' },
    { ball: 7, pocket: 'headRight', tipY: 0.4, speed: 1, rate: 13, why: '41° cut. Follow leaves the cue ball about 2 diamonds from ball 13 with a 54° cut into the head left corner.' },
    { ball: 13, pocket: 'headLeft', tipY: 0.4, speed: 1.2, rate: 10, why: '54° cut. Follow leaves the cue ball about 2 diamonds from ball 4 with a 60° cut into the head left corner.' },
    { ball: 4, pocket: 'headLeft', tipY: 0.4, speed: 1, rate: 15, why: '60° cut. Follow leaves the cue ball about 7 diamonds from ball 6 with an 18° cut into the foot right corner.' },
    { ball: 6, pocket: 'footRight', tipY: 0.2, speed: 1, rate: 24, why: '18° cut. Follow leaves the cue ball about 3 diamonds from ball 9 with a 14° cut into the foot left corner.' },
    { ball: 9, pocket: 'footLeft', tipY: 0.2, speed: 0.8, rate: 30, why: '14° cut. Follow leaves the cue ball about 6 diamonds from ball 3 with a 7° cut into the head left corner.' },
    { ball: 3, pocket: 'headLeft', tipY: 0.4, speed: 1, rate: 15, why: '7° cut. Follow leaves the cue ball about 3 diamonds from ball 14 with a 23° cut into the head right corner.' },
    { ball: 14, pocket: 'headRight', tipY: 0.2, speed: 0.8, rate: 28, why: '23° cut. Follow leaves the cue ball about 6 diamonds from ball 5 with a 7° cut into the foot right corner.' },
    { ball: 5, pocket: 'footRight', tipY: 0.4, speed: 1, rate: 15, why: '7° cut. Follow leaves the cue ball about 2 diamonds from ball 10 with a 40° cut into the foot left corner.' },
    { ball: 10, pocket: 'footLeft', tipY: 0.2, speed: 1, rate: 14, why: '40° cut. Follow leaves the cue ball about 1 diamond from ball 11 with a 24° cut into the foot right corner.' },
    { ball: 11, pocket: 'footRight', tipY: 0, speed: 0.8, rate: 44, why: '24° cut, last ball. Center ball, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
