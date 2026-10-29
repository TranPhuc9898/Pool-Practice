import type { PoolDrill } from '../types';

/**
 * Cuestars "No Cushions" chuyển sang pool: chữ T quanh foot spot, mỗi nhánh 3 bi, cách nhau 6.5". Ball in hand chỉ ở cú
 * đầu, cú sau đánh từ chỗ bi cái dừng, bi cái không chạm băng ở cú nào. Số bi đánh lại theo thứ tự route (luật 1: cú i ăn bi số nhỏ thứ i). Thứ tự, tip, lực và `rate` là một route chép từ
 * `sh scripts/rack-harness/run.sh 16` trên ShotPhysics ddf3049, không phải route duy nhất. Hash khác thì chạy lại harness,
 * chép lại số.
 */
export const noRailT = {
  id: '16',
  number: 16,
  title: 'No-Rail T',
  // Route, tip, lực và tỉ lệ chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'Ten balls in a T. The cue ball never touches a cushion. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'noRail',
  skillLabel: 'No-Rail Runout',
  difficulty: 5,
  objective: 'Ball in hand. Clear all ten in number order, 1 to 10. Cue ball hits a rail and the run ends.',
  cueBall: { x: 0.24, y: 0.455 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.445 },
    { number: 2, x: 0.5, y: 0.38 },
    { number: 4, x: 0.5, y: 0.315 },
    { number: 6, x: 0.5, y: 0.25 },
    { number: 5, x: 0.37, y: 0.25 },
    { number: 8, x: 0.24, y: 0.25 },
    { number: 7, x: 0.11, y: 0.25 },
    { number: 3, x: 0.63, y: 0.25 },
    { number: 10, x: 0.76, y: 0.25 },
    { number: 9, x: 0.89, y: 0.25 },
  ],
  targetPocket: 'sideRight',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'sideRight' },
    { kind: 'objectBallPath', ball: 2, pocket: 'sideLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 5,
  passCondition: { kind: 'pocketed', required: 2 },
  tips: [
    'Ball in hand for the first shot only. After that, play from where the cue ball stops, lowest number first.',
    'Read the pattern for stop shots first.',
    'Log how many balls each run gets, not just clears.',
  ],
  shots: [
    { ball: 1, pocket: 'sideRight', tipY: 0.4, speed: 0.8, rate: 32, why: '20° cut. Follow leaves the cue ball about 1 diamond from ball 2 with an 8° cut into the left side pocket.' },
    { ball: 2, pocket: 'sideLeft', tipY: 0.4, speed: 0.8, rate: 45, why: '8° cut. Follow leaves the cue ball about 2 diamonds from ball 3 with a 10° cut into the foot right corner.' },
    { ball: 3, pocket: 'footRight', tipY: 0.4, speed: 0.8, rate: 14, why: '10° cut. Follow leaves the cue ball about 1 diamond from ball 4 with a 40° cut into the left side pocket.' },
    { ball: 4, pocket: 'sideLeft', tipY: 0.2, speed: 1, rate: 14, why: '40° cut. Follow leaves the cue ball about 6 diamonds from ball 5 with a 15° cut into the foot left corner.' },
    { ball: 5, pocket: 'footLeft', tipY: 0.4, speed: 1, rate: 13, why: '15° cut. Follow leaves the cue ball about 1 diamond from ball 6 with an 11° cut into the head right corner.' },
    { ball: 6, pocket: 'headRight', tipY: 0.4, speed: 1.2, rate: 21, why: '11° cut. Follow leaves the cue ball about 2 diamonds from ball 7 with a 4° cut into the foot left corner.' },
    { ball: 7, pocket: 'footLeft', tipY: 0.2, speed: 0.8, rate: 24, why: '4° cut. Follow leaves the cue ball about 1 diamond from ball 8 with a 25° cut into the right side pocket.' },
    { ball: 8, pocket: 'sideRight', tipY: 0, speed: 1.2, rate: 11, why: '25° cut. Center ball leaves the cue ball about 1 diamond from ball 9 with a 3° cut into the head right corner.' },
    { ball: 9, pocket: 'headRight', tipY: 0.4, speed: 1, rate: 7, why: '3° cut. Follow leaves the cue ball about 1 diamond from ball 10 with an 18° cut into the foot left corner.' },
    { ball: 10, pocket: 'footLeft', tipY: 0.2, speed: 1, rate: 21, why: '18° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
