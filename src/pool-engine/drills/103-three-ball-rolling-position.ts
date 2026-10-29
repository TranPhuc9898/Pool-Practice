import type { PoolDrill } from '../types';

/**
 * Ba bi, bi cái đặt sẵn, thứ tự 1–2–3: cả ba cú follow nhẹ, mỗi cú phải dừng trong zone 3" để cú sau còn góc cắt dưới
 * 20°. Tự soạn cho giai đoạn 5 của `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không
 * lấy từ nguồn. Zone, tip, lực và `rate` chép từ `sh scripts/rack-harness/run.sh 103` trên ShotPhysics của working tree
 * 2026-10-27. Chưa kiểm trên bàn thật.
 */
export const threeBallRollingPosition = {
  id: '103',
  number: 103,
  title: 'Three-Ball Rolling Position',
  // Zone, tip và lực chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'Three balls, three small zones, a rolling cue ball every time. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'naturalAngle',
  skillLabel: 'Natural Angle',
  difficulty: 5,
  objective: 'Pot the 1, 2 and 3 in order. After each of the first two, the cue ball must stop inside its zone.',
  cueBall: { x: 0.4, y: 0.45 },
  objectBalls: [
    { number: 1, x: 0.7, y: 0.25 },
    { number: 2, x: 0.3, y: 0.6 },
    { number: 3, x: 0.75, y: 0.85 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.9615, y: 0.1681 }, radius: 0.06, label: '2' },
    { kind: 'circle', center: { x: 0.0608, y: 0.6432 }, radius: 0.06, label: '3' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.3 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: ['Count it only when all three go and both zones are hit.'],
  mistakes: ['Missing the first zone by a ball turns the 2 into a long thin cut.'],
  shots: [
    { ball: 1, pocket: 'footRight', tipY: 0.2, speed: 1.2, zone: 0, rate: 18, why: '6° cut. Follow leaves the cue ball about 4 diamonds from ball 2 with an 18° cut into the head left corner.' },
    { ball: 2, pocket: 'headLeft', tipY: 0.5, speed: 1, zone: 1, rate: 15, why: '18° cut. Follow leaves the cue ball about 3 diamonds from ball 3 with a 20° cut into the head right corner.' },
    { ball: 3, pocket: 'headRight', tipY: 0.3, speed: 0.8, rate: 15, why: '20° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
