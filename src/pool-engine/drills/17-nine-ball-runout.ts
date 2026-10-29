import type { PoolDrill } from '../types';

/**
 * Layout mở, không cụm, để tập chạy bàn có kế hoạch. Tự soạn, không lấy từ nguồn. Bi cái, bi 1, bi 2 và zone sau cú 1 giữ
 * như bản đầu; bi 3–9 đặt lại vì bản đầu kẹt ở bi 3 (route 2/9). Cú 2 cắt 38° vì bi 2 và zone đó cố định, các cú sau cắt
 * 11–33°. Tip, lực và `rate` chép từ `sh scripts/rack-harness/run.sh 17` trên ShotPhysics ddf3049, không phải route duy
 * nhất. Hash khác thì chạy lại harness, chép lại số. Chưa kiểm trên bàn thật.
 */
export const nineBallRunout = {
  id: '17',
  number: 17,
  title: '9-Ball Runout',
  subtitle: 'Open table, ball in hand. Plan three balls ahead. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'runout',
  skillLabel: 'Runout',
  difficulty: 5,
  objective: 'Ball in hand for shot 1 only. Run 1 through 9 in rotation. Before each shot, say where the cue ball stops.',
  cueBall: { x: 0.45, y: 0.85 },
  objectBalls: [
    { number: 1, x: 0.25, y: 0.7 },
    { number: 2, x: 0.78, y: 0.62 },
    { number: 3, x: 0.72, y: 0.8 },
    { number: 4, x: 0.34, y: 0.96 },
    { number: 5, x: 0.52, y: 0.71 },
    { number: 6, x: 0.36, y: 0.32 },
    { number: 7, x: 0.74, y: 0.28 },
    { number: 8, x: 0.58, y: 0.13 },
    { number: 9, x: 0.4, y: 0.21 },
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.2, y: 0.71 }, radius: 0.09, label: '2' },
    { kind: 'circle', center: { x: 0.6148, y: 0.747 }, radius: 0.09, label: '3' },
    { kind: 'circle', center: { x: 0.8603, y: 0.7955 }, radius: 0.09, label: '4' },
    { kind: 'circle', center: { x: 0.322, y: 0.9349 }, radius: 0.09, label: '5' },
    { kind: 'circle', center: { x: 0.3148, y: 0.3676 }, radius: 0.09, label: '6' },
    { kind: 'circle', center: { x: 0.156, y: 0.0452 }, radius: 0.09, label: '7' },
    { kind: 'circle', center: { x: 0.893, y: 0.2681 }, radius: 0.09, label: '8' },
    { kind: 'circle', center: { x: 0.548, y: 0.0544 }, radius: 0.09, label: '9' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'sideRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.1 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 2,
  attemptCount: 5,
  passCondition: { kind: 'pocketed', required: 2 },
  tips: ['Find the problem ball first, then plan back to it.', 'Missed position: reset and try another route.'],
  shots: [
    { ball: 1, pocket: 'sideLeft', tipY: 0.1, speed: 0.8, zone: 0, rate: 26, why: '2° cut. Center ball leaves the cue ball about 2 diamonds from ball 2 with a 38° cut into the right side pocket.' },
    { ball: 2, pocket: 'sideRight', tipY: 0.4, speed: 0.8, zone: 1, rate: 6, why: '38° cut. Follow leaves the cue ball about 1 diamond from ball 3 with a 14° cut into the head right corner.' },
    { ball: 3, pocket: 'headRight', tipY: 0, speed: 0.8, zone: 2, rate: 39, why: '14° cut. Center ball leaves the cue ball about 2 diamonds from ball 4 with a 21° cut into the head left corner.' },
    { ball: 4, pocket: 'headLeft', tipY: 0.2, speed: 0.8, zone: 3, rate: 22, why: '21° cut. Follow leaves the cue ball about 2 diamonds from ball 5 with a 27° cut into the right side pocket.' },
    { ball: 5, pocket: 'sideRight', tipY: 0.2, speed: 1, zone: 4, rate: 3, why: '27° cut. Follow leaves the cue ball about 1 diamond from ball 6 with a 33° cut into the foot right corner.' },
    { ball: 6, pocket: 'footRight', tipY: 0, speed: 1.2, zone: 5, rate: 26, why: '33° cut. Center ball leaves the cue ball about 3 diamonds from ball 7 with a 22° cut into the right side pocket.' },
    { ball: 7, pocket: 'sideRight', tipY: 0.4, speed: 0.8, zone: 6, rate: 13, why: '22° cut. Follow leaves the cue ball about 2 diamonds from ball 8 with a 19° cut into the foot left corner.' },
    { ball: 8, pocket: 'footLeft', tipY: 0.4, speed: 0.8, zone: 7, rate: 21, why: '19° cut. Follow leaves the cue ball about 1 diamond from ball 9 with an 11° cut into the left side pocket.' },
    { ball: 9, pocket: 'sideLeft', tipY: 0.4, speed: 0.8, rate: 30, why: '11° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
