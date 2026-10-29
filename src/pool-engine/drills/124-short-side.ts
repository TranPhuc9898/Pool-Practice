import type { PoolDrill } from '../types';

/**
 * Nguồn: Eddie Vonderau, bài anh lưu #5 https://www.facebook.com/share/r/17uUBoVDny/ (Short-side back and forth). Hai bi cách
 * băng dài ~5" ngay trên lỗ giữa, bi cái gần băng head, ước từ khung `docs/research/drill-video/short-side.png` [suy luận]. Tip, lực và `rate` chép từ `sh scripts/rack-harness/run.sh 124` trên ShotPhysics working tree, không phải route
 * duy nhất. `attemptCount` 5, cần 3 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const shortSide = {
  id: '124',
  number: 124,
  title: 'Short-Side Back and Forth',
  subtitle: 'Two balls just above the side pockets, one on each long rail. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'speedControl',
  skillLabel: 'Speed control',
  difficulty: 4,
  objective: 'Cue ball starts near the head rail. Pot the 1 in the left side pocket, then cross the table and pot the 2 in the right side pocket. Re-rack and go again.',
  cueBall: { x: 0.55, y: 0.95 },
  objectBalls: [
    { number: 1, x: 0.1, y: 0.57 },
    { number: 2, x: 0.9, y: 0.57 },
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.1111, y: 0.5594 }, radius: 0.06, label: '2' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'sideLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.1 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 5,
  passCondition: { kind: 'pocketed', required: 3 },
  tips: [
    'Both balls are short-sided: the cue ball must stop on the pocket side of the table, not past it.',
    'Soft pace. A hard hit on a side pocket cut rattles the ball out.',
  ],
  mistakes: [
    'Coming across the table too far and leaving the 2 with no angle into the side.',
  ],
  shots: [
    { ball: 1, pocket: 'sideLeft', tipY: 0.1, speed: 0.8, zone: 0, rate: 34, why: '5° cut. Center ball leaves the cue ball about 3 diamonds from ball 2 with a 59° cut into the right side pocket.' },
    { ball: 2, pocket: 'sideRight', tipY: 0.5, speed: 0.8, rate: 15, why: '59° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
