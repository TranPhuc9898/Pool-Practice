import type { PoolDrill } from '../types';

/**
 * Ghép từ Cuestars Red-Black, đổi sang pool: bi 8 là key, 3 và 11 là "đỏ" (hai bi đỏ của bộ pool, số tăng dần theo thứ tự đánh). Layout là suy luận chuyển đổi. Bản gốc pot
 * một đỏ rồi bi 8, đặt lại cả hai rồi đánh tiếp; app không đặt lại bi nên chạy chuỗi 3 → 8 → 11, bi cái đặt sẵn ở cú 1.
 * Zone 8 giữ chỗ vẽ tay cũ, zone 11 đặt quanh chỗ bi cái dừng sau cú 2. Trường cấp bài (`targetPocket`, spin, lực) mô tả
 * cú 1. Tip, lực, zone và `rate` chép từ `sh scripts/rack-harness/run.sh 13` trên ShotPhysics ddf3049, không phải route
 * duy nhất. Hash khác thì chạy lại harness, chép lại số.
 */
export const redBlack = {
  id: '13',
  number: 13,
  title: 'Red-Black',
  // Zone, tip, lực và tỉ lệ chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'Pot a red, then the 8, then the other red. Always from the correct side. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'correctSide',
  skillLabel: 'Correct Side',
  difficulty: 3,
  objective: 'Pot the 3, the 8, then the 11. After the 3 and the 8 the cue ball must stop inside the zone.',
  cueBall: { x: 0.24, y: 0.32 },
  objectBalls: [
    { number: 3, x: 0.5, y: 0.1875 },
    { number: 8, x: 0.5, y: 0.125 },
    { number: 11, x: 0.5, y: 0.0625 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.32, y: 0.21 }, radius: 0.07, label: '8' },
    { kind: 'circle', center: { x: 0.3702, y: 0.0509 }, radius: 0.07, label: '11' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 3, pocket: 'footRight' },
    { kind: 'ghostBall', ball: 3, pocket: 'footRight' },
    { kind: 'cueBallPath', ball: 3, pocket: 'footRight' },
    { kind: 'objectBallPath', ball: 8, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: -0.6 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    'Wrong side of the 8 counts as a miss, even if it drops.',
    'Ladder: 5, then 10, then 20 in a row.',
  ],
  steps: [
    { label: 'STEP 1', caption: 'Pot the red 3' },
    { label: 'STEP 2', caption: 'Pot the 8' },
    { label: 'STEP 3', caption: 'Pot the red 11' },
  ],
  shots: [
    { ball: 3, pocket: 'footRight', tipY: -0.6, speed: 1.6, zone: 0, rate: 9, why: '10° cut. Draw leaves the cue ball about 1 diamond from ball 8 with a 20° cut into the foot right corner.' },
    { ball: 8, pocket: 'footRight', tipY: -0.4, speed: 1.4, zone: 1, rate: 12, why: '20° cut. Draw leaves the cue ball about 1 diamond from ball 11 with a 36° cut into the foot right corner.' },
    { ball: 11, pocket: 'footRight', tipY: 0.4, speed: 0.8, rate: 45, why: '36° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
