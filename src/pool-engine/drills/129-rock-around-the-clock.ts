import type { PoolDrill } from '../types';

/**
 * Nguồn: Arielle Harrison / Niels Feijen, bài anh lưu #59 https://www.facebook.com/share/v/19sgqfX9mX/ (Rock Around The Clock).
 * Mười hai bi cách băng một bi ước từ khung `docs/research/drill-video/rock-around-the-clock.png` [suy luận]. Pot theo vòng
 * đồng hồ engine không dọn được, nên đánh theo route của harness, số bi đánh lại cho tăng dần (luật 1) [suy luận]. Tip, lực và `rate` chép từ `sh scripts/rack-harness/run.sh 129` trên ShotPhysics working tree, không phải route
 * duy nhất. `attemptCount` 5, cần 3 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const rockAroundTheClock = {
  id: '129',
  number: 129,
  title: 'Rock Around the Clock',
  subtitle: 'Twelve balls one ball off the rails, around the table like a clock face. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'runout',
  skillLabel: 'Runout',
  difficulty: 5,
  objective: 'Ball in hand for shot 1 only. Pot all twelve balls in number order, 1 to 12. A miss or a scratch ends the attempt.',
  cueBall: { x: 0.4671, y: 0.9365 },
  objectBalls: [
    { number: 1, x: 0.25, y: 0.966 },
    { number: 3, x: 0.75, y: 0.966 },
    { number: 6, x: 0.9325, y: 0.875 },
    { number: 11, x: 0.9325, y: 0.625 },
    { number: 10, x: 0.9325, y: 0.375 },
    { number: 8, x: 0.9325, y: 0.125 },
    { number: 2, x: 0.75, y: 0.034 },
    { number: 4, x: 0.25, y: 0.034 },
    { number: 5, x: 0.0675, y: 0.125 },
    { number: 7, x: 0.0675, y: 0.375 },
    { number: 12, x: 0.0675, y: 0.625 },
    { number: 9, x: 0.0675, y: 0.875 },
  ],
  targetPocket: 'headLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.2464, y: 0.9665 }, radius: 0.09, label: '2' },
    { kind: 'circle', center: { x: 0.5745, y: 0.9451 }, radius: 0.09, label: '3' },
    { kind: 'circle', center: { x: 0.7602, y: 0.9623 }, radius: 0.09, label: '4' },
    { kind: 'circle', center: { x: 0.4226, y: 0.9418 }, radius: 0.09, label: '5' },
    { kind: 'circle', center: { x: 0.0757, y: 0.1138 }, radius: 0.09, label: '6' },
    { kind: 'circle', center: { x: 0.9194, y: 0.8822 }, radius: 0.09, label: '7' },
    { kind: 'circle', center: { x: 0.9175, y: 0.2617 }, radius: 0.09, label: '8' },
    { kind: 'circle', center: { x: 0.8427, y: 0.0812 }, radius: 0.09, label: '9' },
    { kind: 'circle', center: { x: 0.1089, y: 0.9029 }, radius: 0.09, label: '10' },
    { kind: 'circle', center: { x: 0.3402, y: 0.3026 }, radius: 0.09, label: '11' },
    { kind: 'circle', center: { x: 0.0457, y: 0.7119 }, radius: 0.09, label: '12' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'headLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'headLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'headLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.2 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'soft',
  allowedRails: 2,
  attemptCount: 5,
  passCondition: { kind: 'pocketed', required: 3 },
  tips: [
    'Every ball sits one ball off a rail, so the cue ball keeps meeting the cushion. Plan where it comes off.',
    'Work one end of the table at a time; long crossings cost the most position.',
  ],
  mistakes: [
    'Freezing the cue ball to the rail behind a ball and leaving a cut you cannot follow through.',
  ],
  shots: [
    { ball: 1, pocket: 'headLeft', tipY: -0.2, speed: 0.8, zone: 0, rate: 43, why: '0° cut. Draw leaves the cue ball about 8 diamonds from ball 2 with a 61° cut into the foot right corner.' },
    { ball: 2, pocket: 'footRight', tipY: 0.4, speed: 1.2, zone: 1, rate: 4, why: '61° cut. Follow leaves the cue ball about 1 diamond from ball 3 with a 2° cut into the head right corner.' },
    { ball: 3, pocket: 'headRight', tipY: -0.2, speed: 0.8, zone: 2, rate: 45, why: '2° cut. Draw leaves the cue ball about 8 diamonds from ball 4 with a 61° cut into the foot left corner.' },
    { ball: 4, pocket: 'footLeft', tipY: 0.4, speed: 1.2, zone: 3, rate: 4, why: '61° cut. Follow leaves the cue ball about 7 diamonds from ball 5 with a 3° cut into the foot left corner.' },
    { ball: 5, pocket: 'footLeft', tipY: 0.4, speed: 0.8, zone: 4, rate: 13, why: '3° cut. Follow leaves the cue ball about 7 diamonds from ball 6 with a 15° cut into the head right corner.' },
    { ball: 6, pocket: 'headRight', tipY: 0.2, speed: 1, zone: 5, rate: 13, why: '15° cut. Follow leaves the cue ball about 5 diamonds from ball 7 with a 36° cut into the foot left corner.' },
    { ball: 7, pocket: 'footLeft', tipY: 0.4, speed: 1.2, zone: 6, rate: 7, why: '36° cut. Follow leaves the cue ball about 1 diamond from ball 8 with a 14° cut into the foot right corner.' },
    { ball: 8, pocket: 'footRight', tipY: 0, speed: 0.8, zone: 7, rate: 43, why: '14° cut. Center ball leaves the cue ball about 7 diamonds from ball 9 with an 11° cut into the head left corner.' },
    { ball: 9, pocket: 'headLeft', tipY: 0.4, speed: 1, zone: 8, rate: 14, why: '11° cut. Follow leaves the cue ball about 5 diamonds from ball 10 with a 34° cut into the foot right corner.' },
    { ball: 10, pocket: 'footRight', tipY: 0.2, speed: 1.2, zone: 9, rate: 5, why: '34° cut. Follow leaves the cue ball about 4 diamonds from ball 11 with a 39° cut into the head right corner.' },
    { ball: 11, pocket: 'headRight', tipY: 0.2, speed: 1.2, zone: 10, rate: 7, why: '39° cut. Follow leaves the cue ball about 1 diamond from ball 12 with a 14° cut into the foot left corner.' },
    { ball: 12, pocket: 'footLeft', tipY: 0.4, speed: 1, rate: 44, why: '14° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
