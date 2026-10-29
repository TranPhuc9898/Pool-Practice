import type { PoolDrill } from '../types';

/**
 * L-drill bản 9 bi, khoảng hở 2 bi (bản gốc 15 bi, hở 1 bi). Góc chữ L trên foot spot. Ball in hand chỉ ở cú đầu, cú
 * sau đánh từ chỗ bi cái dừng. Chỗ đặt bi cái, tip, lực và `rate` là một route chép từ `sh scripts/rack-harness/run.sh 14`
 * trên ShotPhysics ddf3049, không phải route duy nhất. Hash khác thì chạy lại harness, chép lại số.
 */
export const lDrill = {
  id: '14',
  number: 14,
  title: 'L-Drill',
  // Route, tip, lực và tỉ lệ chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'Nine balls in an L. Run them in order, touch nothing. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'lineUp',
  skillLabel: 'Line-Up',
  difficulty: 4,
  objective: 'Ball in hand. Pot 1 to 9 in order without hitting another ball.',
  cueBall: { x: 0.5881, y: 0.691 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.5875 },
    { number: 2, x: 0.5, y: 0.52 },
    { number: 3, x: 0.5, y: 0.4525 },
    { number: 4, x: 0.5, y: 0.385 },
    { number: 5, x: 0.5, y: 0.3175 },
    { number: 6, x: 0.5, y: 0.25 },
    { number: 7, x: 0.635, y: 0.25 },
    { number: 8, x: 0.77, y: 0.25 },
    { number: 9, x: 0.905, y: 0.25 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'headRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.2 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 6,
  passCondition: { kind: 'pocketed', required: 4 },
  tips: [
    'Ball in hand for the first shot only. After that, play from where the cue ball stops.',
    'Harder: no rails at all, or every ball in one corner.',
    'Progressive: clear it 2 of 3, then add a ball and close the gaps.',
  ],
  shots: [
    { ball: 1, pocket: 'footLeft', tipY: 0.2, speed: 1.2, rate: 13, why: '0° cut. Follow leaves the cue ball about 1 diamond from ball 2 with a 20° cut into the head right corner.' },
    { ball: 2, pocket: 'headRight', tipY: 0.4, speed: 1, rate: 30, why: '20° cut. Follow leaves the cue ball about 1 diamond from ball 3 with a 34° cut into the foot left corner.' },
    { ball: 3, pocket: 'footLeft', tipY: -0.2, speed: 2.1, rate: 5, why: '34° cut. Draw leaves the cue ball about 3 diamonds from ball 4 with a 12° cut into the foot left corner.' },
    { ball: 4, pocket: 'footLeft', tipY: 0.4, speed: 1.4, rate: 13, why: '12° cut. Follow leaves the cue ball about 2 diamonds from ball 5 with a 49° cut into the left side pocket.' },
    { ball: 5, pocket: 'sideLeft', tipY: 0.2, speed: 1.2, rate: 13, why: '49° cut. Follow leaves the cue ball about 5 diamonds from ball 6 with a 31° cut into the foot left corner.' },
    { ball: 6, pocket: 'footLeft', tipY: 0.4, speed: 1, rate: 9, why: '31° cut. Follow leaves the cue ball about 1 diamond from ball 7 with a 19° cut into the left side pocket.' },
    { ball: 7, pocket: 'sideLeft', tipY: 0.4, speed: 0.8, rate: 28, why: '19° cut. Follow leaves the cue ball about 2 diamonds from ball 8 with a 14° cut into the foot right corner.' },
    { ball: 8, pocket: 'footRight', tipY: 0.4, speed: 0.8, rate: 21, why: '14° cut. Follow leaves the cue ball about 1 diamond from ball 9 with a 49° cut into the head right corner.' },
    { ball: 9, pocket: 'headRight', tipY: 0.4, speed: 1.6, rate: 14, why: '49° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
