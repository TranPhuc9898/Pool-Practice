import type { PoolDrill } from '../types';

/**
 * Nguồn: Dragon Billiards, bài anh lưu #40 https://www.facebook.com/share/v/1EBz4UnEvJ/ (Land Mine). Toạ độ 9 bi ước từ
 * khung video `docs/research/drill-video/land-mine.png` [suy luận]. Caption chỉ có tên drill; luật chạm bi là "mìn" là cách em đọc tên bài [suy luận]. App bắt số tăng dần (luật 1), số bi đánh theo route. Tip, lực và `rate` chép từ `sh scripts/rack-harness/run.sh 130` trên ShotPhysics working tree, không phải route
 * duy nhất. `attemptCount` 5, cần 6 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const landMine = {
  id: '130',
  number: 130,
  title: 'Land Mine',
  subtitle: 'Nine balls spread down the middle of the table, clear them in number order. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'runout',
  skillLabel: 'Runout',
  difficulty: 5,
  objective: 'Ball in hand for shot 1 only. Pot all nine balls in number order, 1 to 9, without touching another ball with the cue ball. A miss, a scratch or a cue-ball touch ends the attempt.',
  cueBall: { x: 0.9016, y: 0.886 },
  objectBalls: [
    { number: 8, x: 0.5, y: 0.97 },
    { number: 1, x: 0.5, y: 0.9 },
    { number: 4, x: 0.2, y: 0.83 },
    { number: 7, x: 0.78, y: 0.83 },
    { number: 5, x: 0.5, y: 0.75 },
    { number: 2, x: 0.2, y: 0.62 },
    { number: 9, x: 0.88, y: 0.62 },
    { number: 6, x: 0.5, y: 0.45 },
    { number: 3, x: 0.5, y: 0.3 },
  ],
  targetPocket: 'headLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.1817, y: 0.7773 }, radius: 0.09, label: '2' },
    { kind: 'circle', center: { x: 0.6869, y: 0.0182 }, radius: 0.09, label: '3' },
    { kind: 'circle', center: { x: 0.8261, y: 0.7643 }, radius: 0.09, label: '4' },
    { kind: 'circle', center: { x: 0.8374, y: 0.6463 }, radius: 0.09, label: '5' },
    { kind: 'circle', center: { x: 0.215, y: 0.7304 }, radius: 0.09, label: '6' },
    { kind: 'circle', center: { x: 0.5707, y: 0.3445 }, radius: 0.09, label: '7' },
    { kind: 'circle', center: { x: 0.6186, y: 0.9669 }, radius: 0.09, label: '8' },
    { kind: 'circle', center: { x: 0.4425, y: 0.9507 }, radius: 0.09, label: '9' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'headLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'headLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'headLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 2,
  attemptCount: 5,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'The middle balls are the mines: plan a route that never sends the cue ball through the cluster.',
    'Clear the balls near the head rail first so the cue ball has room to come back.',
  ],
  mistakes: [
    'Running the cue ball through the middle and bumping a ball off its line.',
  ],
  shots: [
    { ball: 1, pocket: 'headLeft', tipY: 0.4, speed: 0.8, zone: 0, rate: 9, why: '20° cut. Follow leaves the cue ball about 1 diamond from ball 2 with a 34° cut into the foot right corner.' },
    { ball: 2, pocket: 'footRight', tipY: 0.4, speed: 1.2, zone: 1, rate: 5, why: '34° cut. Follow leaves the cue ball about 2 diamonds from ball 3 with a 36° cut into the left side pocket.' },
    { ball: 3, pocket: 'sideLeft', tipY: 0.2, speed: 1, zone: 2, rate: 1, why: '36° cut. Follow leaves the cue ball about 3 diamonds from ball 4 with a 51° cut into the head left corner.' },
    { ball: 4, pocket: 'headLeft', tipY: 0.4, speed: 1, zone: 3, rate: 7, why: '51° cut. Follow leaves the cue ball about 2 diamonds from ball 5 with a 15° cut into the head left corner.' },
    { ball: 5, pocket: 'headLeft', tipY: 0.4, speed: 0.8, zone: 4, rate: 12, why: '15° cut. Follow leaves the cue ball about 3 diamonds from ball 6 with a 2° cut into the foot right corner.' },
    { ball: 6, pocket: 'footRight', tipY: 0.4, speed: 1, zone: 5, rate: 12, why: '2° cut. Follow leaves the cue ball about 4 diamonds from ball 7 with a 22° cut into the head right corner.' },
    { ball: 7, pocket: 'headRight', tipY: 0.4, speed: 0.8, zone: 6, rate: 9, why: '22° cut. Follow leaves the cue ball about 1 diamond from ball 8 with a 6° cut into the head left corner.' },
    { ball: 8, pocket: 'headLeft', tipY: 0, speed: 0.8, zone: 7, rate: 32, why: '6° cut. Center ball leaves the cue ball about 3 diamonds from ball 9 with a 30° cut into the foot right corner.' },
    { ball: 9, pocket: 'footRight', tipY: 0.4, speed: 1.2, rate: 15, why: '30° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
