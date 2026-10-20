import type { PoolDrill } from '../types';

/**
 * BU Exam II S2 Rail Cut, cấp Masters. Layout [nguồn]: 4 bi long rail như Bachelors, mỗi end rail 3 bi ở
 * W = 1, 2, 3, thêm center spot. Bi sát băng như drill 18 [suy luận]. BU đếm /11; ngưỡng 8 là đề xuất.
 * Ball in hand chỉ ở cú đầu như drill 18. Route chép từ `sh scripts/rack-harness/run.sh` trên ShotPhysics ddf3049,
 * không phải route duy nhất. Hash khác thì chạy lại harness, chép lại số.
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
  cueBall: { x: 0.7223, y: 0.5156 },
  objectBalls: [
    // Bi đầu mảng là bi cú 1: stage lấy nó làm bi ngắm.
    { number: 11, x: 0.5, y: 0.5 },
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
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 11, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 11, pocket: 'sideLeft' },
    { kind: 'cueBallPath', ball: 11, pocket: 'sideLeft' },
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 11,
  passCondition: { kind: 'pocketed', required: 8 },
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
    { ball: 11, pocket: 'sideLeft', tipY: 0, speed: 0.8, rate: 38, why: '10° cut. Center ball leaves the cue ball about 2 diamonds from ball 1 with a 45° cut into the foot left corner.' },
    { ball: 1, pocket: 'footLeft', tipY: 0.2, speed: 1.2, rate: 15, why: '45° cut. Follow leaves the cue ball about 2 diamonds from ball 7 with a 37° cut into the foot right corner.' },
    { ball: 7, pocket: 'footRight', tipY: 0.2, speed: 0.8, rate: 18, why: '37° cut. Follow leaves the cue ball about 6 diamonds from ball 2 with a 25° cut into the head left corner.' },
    { ball: 2, pocket: 'headLeft', tipY: 0.4, speed: 1.2, rate: 15, why: '25° cut. Follow leaves the cue ball about 2 diamonds from ball 10 with a 21° cut into the head right corner.' },
    { ball: 10, pocket: 'headRight', tipY: 0, speed: 0.8, rate: 25, why: '21° cut. Center ball leaves the cue ball about 6 diamonds from ball 3 with a 7° cut into the foot right corner.' },
    { ball: 3, pocket: 'footRight', tipY: 0.4, speed: 1, rate: 15, why: '7° cut. Follow leaves the cue ball about 3 diamonds from ball 5 with a 23° cut into the foot left corner.' },
    { ball: 5, pocket: 'footLeft', tipY: 0.2, speed: 0.8, rate: 28, why: '23° cut. Follow leaves the cue ball about 1 diamond from ball 6 with a 6° cut into the foot right corner.' },
    { ball: 6, pocket: 'footRight', tipY: 0.2, speed: 0.8, rate: 45, why: '6° cut. Follow leaves the cue ball about 6 diamonds from ball 4 with a 14° cut into the head right corner.' },
    { ball: 4, pocket: 'headRight', tipY: 0.4, speed: 1, rate: 15, why: '14° cut. Follow leaves the cue ball about 3 diamonds from ball 8 with a 28° cut into the head left corner.' },
    { ball: 8, pocket: 'headLeft', tipY: 0.2, speed: 0.8, rate: 24, why: '28° cut. Follow leaves the cue ball about 1 diamond from ball 9 with an 8° cut into the head right corner.' },
    { ball: 9, pocket: 'headRight', tipY: 0.2, speed: 0.8, rate: 45, why: '8° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
