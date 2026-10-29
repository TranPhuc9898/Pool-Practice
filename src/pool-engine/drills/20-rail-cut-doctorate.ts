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
  // Route, tip, lực và tỉ lệ chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'Fifteen rail balls. Balls near the corners crowd the pocket. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'railCut',
  skillLabel: 'Rail Cut',
  difficulty: 5,
  objective: 'Pot all 15 in number order, 1 to 15. No scratch, no combos, never touch another ball.',
  cueBall: { x: 0.442, y: 0.0652 },
  objectBalls: [
    // Bi đầu mảng là bi cú 1: stage lấy nó làm bi ngắm.
    { number: 5, x: 0.5, y: 0.5 },
    // Bi 1 bị bi 2 chắn đường vào footLeft.
    { number: 4, x: 0.0225, y: 0.125 },
    { number: 6, x: 0.0225, y: 0.25 },
    { number: 9, x: 0.0225, y: 0.75 },
    { number: 7, x: 0.0225, y: 0.875 },
    { number: 13, x: 0.9775, y: 0.25 },
    { number: 8, x: 0.9775, y: 0.125 },
    { number: 14, x: 0.9775, y: 0.75 },
    { number: 11, x: 0.9775, y: 0.875 },
    { number: 1, x: 0.25, y: 0.0113 },
    { number: 3, x: 0.5, y: 0.0113 },
    { number: 2, x: 0.75, y: 0.0113 },
    { number: 10, x: 0.25, y: 0.9887 },
    { number: 15, x: 0.5, y: 0.9887 },
    { number: 12, x: 0.75, y: 0.9887 },
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
  attemptCount: 15,
  passCondition: { kind: 'pocketed', required: 11 },
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
    { ball: 1, pocket: 'footLeft', tipY: 0.2, speed: 0.8, rate: 45, why: '30° cut. Follow leaves the cue ball about 3 diamonds from ball 2 with a 26° cut into the foot right corner.' },
    { ball: 2, pocket: 'footRight', tipY: 0.4, speed: 0.8, rate: 25, why: '26° cut. Follow leaves the cue ball about 2 diamonds from ball 3 with a 42° cut into the foot left corner.' },
    { ball: 3, pocket: 'footLeft', tipY: 0.2, speed: 1, rate: 14, why: '42° cut. Follow leaves the cue ball about 2 diamonds from ball 4 with a 27° cut into the foot left corner.' },
    { ball: 4, pocket: 'footLeft', tipY: 0.2, speed: 0.8, rate: 27, why: '27° cut. Follow leaves the cue ball about 3 diamonds from ball 5 with an 8° cut into the head right corner.' },
    { ball: 5, pocket: 'headRight', tipY: 0.4, speed: 1, rate: 14, why: '8° cut. Follow leaves the cue ball about 4 diamonds from ball 6 with a 29° cut into the foot left corner.' },
    { ball: 6, pocket: 'footLeft', tipY: 0.2, speed: 1, rate: 14, why: '29° cut. Follow leaves the cue ball about 6 diamonds from ball 7 with a 10° cut into the head left corner.' },
    { ball: 7, pocket: 'headLeft', tipY: 0.4, speed: 0.8, rate: 25, why: '10° cut. Follow leaves the cue ball about 7 diamonds from ball 8 with a 26° cut into the foot right corner.' },
    { ball: 8, pocket: 'footRight', tipY: 0.4, speed: 1, rate: 15, why: '26° cut. Follow leaves the cue ball about 6 diamonds from ball 9 with a 23° cut into the head left corner.' },
    { ball: 9, pocket: 'headLeft', tipY: 0.4, speed: 1, rate: 8, why: '23° cut. Follow leaves the cue ball about 1 diamond from ball 10 with a 55° cut into the head left corner.' },
    { ball: 10, pocket: 'headLeft', tipY: 0.4, speed: 0.8, rate: 14, why: '55° cut. Follow leaves the cue ball about 4 diamonds from ball 11 with a 44° cut into the head right corner.' },
    { ball: 11, pocket: 'headRight', tipY: 0.4, speed: 0.8, rate: 10, why: '44° cut. Follow leaves the cue ball about 1 diamond from ball 12 with a 34° cut into the head right corner.' },
    { ball: 12, pocket: 'headRight', tipY: 0, speed: 0.8, rate: 35, why: '34° cut. Center ball leaves the cue ball about 5 diamonds from ball 13 with a 7° cut into the foot right corner.' },
    { ball: 13, pocket: 'footRight', tipY: 0.2, speed: 1, rate: 14, why: '7° cut. Follow leaves the cue ball about 4 diamonds from ball 14 with a 3° cut into the head right corner.' },
    { ball: 14, pocket: 'headRight', tipY: 0.4, speed: 0.8, rate: 13, why: '3° cut. Follow leaves the cue ball about 3 diamonds from ball 15 with a 43° cut into the head left corner.' },
    { ball: 15, pocket: 'headLeft', tipY: 0.4, speed: 1, rate: 15, why: '43° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
