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
  // Route, tip, lực và tỉ lệ chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'Eleven rail balls. More balls in the way on every end rail. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'railCut',
  skillLabel: 'Rail Cut',
  difficulty: 4,
  objective: 'Pot all 11 in number order, 1 to 11. No scratch, no combos, never touch another ball.',
  cueBall: { x: 0.0936, y: 0.3556 },
  objectBalls: [
    // Bi đầu mảng là bi cú 1: stage lấy nó làm bi ngắm.
    { number: 9, x: 0.5, y: 0.5 },
    { number: 1, x: 0.0225, y: 0.25 },
    { number: 7, x: 0.0225, y: 0.75 },
    { number: 8, x: 0.9775, y: 0.25 },
    { number: 4, x: 0.9775, y: 0.75 },
    { number: 3, x: 0.25, y: 0.0113 },
    { number: 6, x: 0.5, y: 0.0113 },
    { number: 2, x: 0.75, y: 0.0113 },
    { number: 11, x: 0.25, y: 0.9887 },
    { number: 10, x: 0.5, y: 0.9887 },
    { number: 5, x: 0.75, y: 0.9887 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.2 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 11,
  passCondition: { kind: 'pocketed', required: 8 },
  tips: [
    'Ball in hand for the first shot only. After that, play from where the cue ball stops, lowest number first.',
    'A frozen rail ball: aim at the rail a credit card width in front of the ball.',
    'BU scoring: two runs, keep the better. A miss or a foul ends the run.',
  ],
  mistakes: [
    'The 1-ball bounces off the rail: contact too full or too thin, or the cue ball hit the rail first.',
    'Cue rubs the rail: adjust your bridge and height, but do not jack up the cue more than you need.',
    'Hits the pocket point: check the line into the pocket opening before adding speed.',
  ],
  shots: [
    { ball: 1, pocket: 'footLeft', tipY: 0.2, speed: 0.8, rate: 41, why: '20° cut. Follow leaves the cue ball about 3 diamonds from ball 2 with a 34° cut into the foot right corner.' },
    { ball: 2, pocket: 'footRight', tipY: 0.2, speed: 0.8, rate: 17, why: '34° cut. Follow leaves the cue ball about 2 diamonds from ball 3 with a 23° cut into the foot left corner.' },
    { ball: 3, pocket: 'footLeft', tipY: 0.2, speed: 0.8, rate: 29, why: '23° cut. Follow leaves the cue ball about 6 diamonds from ball 4 with a 28° cut into the head right corner.' },
    { ball: 4, pocket: 'headRight', tipY: 0.4, speed: 1, rate: 8, why: '28° cut. Follow leaves the cue ball about 2 diamonds from ball 5 with a 63° cut into the head right corner.' },
    { ball: 5, pocket: 'headRight', tipY: 0.4, speed: 1, rate: 10, why: '63° cut. Follow leaves the cue ball about 2 diamonds from ball 6 with an 18° cut into the foot left corner.' },
    { ball: 6, pocket: 'footLeft', tipY: 0.4, speed: 0.8, rate: 27, why: '18° cut. Follow leaves the cue ball about 5 diamonds from ball 7 with a 15° cut into the head left corner.' },
    { ball: 7, pocket: 'headLeft', tipY: 0.2, speed: 1.2, rate: 14, why: '15° cut. Follow leaves the cue ball about 6 diamonds from ball 8 with a 26° cut into the foot right corner.' },
    { ball: 8, pocket: 'footRight', tipY: 0.4, speed: 1, rate: 12, why: '26° cut. Follow leaves the cue ball about 3 diamonds from ball 9 with a 26° cut into the head right corner.' },
    { ball: 9, pocket: 'headRight', tipY: 0.2, speed: 1.2, rate: 11, why: '26° cut. Follow leaves the cue ball about 2 diamonds from ball 10 with a 31° cut into the head right corner.' },
    { ball: 10, pocket: 'headRight', tipY: 0.4, speed: 0.8, rate: 16, why: '31° cut. Follow leaves the cue ball about 2 diamonds from ball 11 with a 46° cut into the head left corner.' },
    { ball: 11, pocket: 'headLeft', tipY: 0.4, speed: 0.8, rate: 15, why: '46° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
