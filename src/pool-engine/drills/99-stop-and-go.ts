import type { PoolDrill } from '../types';

/**
 * Stop shot có mục đích: bi 1 thẳng vào góc foot left, bi cái dừng tại ghost ball là thẳng bi 2 vào lỗ giữa phải. Tự soạn
 * cho giai đoạn 1 của `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn.
 * Bi cái lùi 12.5" sau ghost ball, zone 4" quanh ghost ball [đề xuất]. Tip, lực, rate lấy từ `chain("99 back 12.5 r 4.0")`
 * trong `drill099()` của `scripts/position-harness/` trên ShotPhysics `65a775f`. Chưa kiểm trên bàn thật.
 */
export const stopAndGo = {
  id: '99',
  number: 99,
  title: 'Stop and Go',
  subtitle: 'Stop the cue ball dead and the next ball is straight in. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'stop',
  skillLabel: 'Stop Shot',
  difficulty: 1,
  objective: 'Pot the 1 straight in and stop the cue ball on the spot. Then pot the 2 straight into the right side pocket. Ten tries.',
  cueBall: { x: 0.3819, y: 0.3819 },
  objectBalls: [
    { number: 1, x: 0.25, y: 0.25 },
    { number: 2, x: 0.6932, y: 0.4034 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.27, y: 0.27 }, radius: 0.08 }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'sideRight' },
  ],
  recommendedContactPoint: { x: 0, y: -0.2 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: ['Count it only when both balls go. A stop that drifts a ball off leaves a cut on the 2.'],
  mistakes: [
    'Cue ball rolls forward after contact: it was rolling at contact, aim lower or hit a touch firmer.',
    'Cue ball spins back: too low for this distance.',
  ],
  steps: [
    { label: 'STEP 1', caption: 'Pot 1' },
    { label: 'STEP 2', caption: 'Stop here' },
    { label: 'STEP 3', caption: 'Pot 2' },
  ],
  shots: [
    { ball: 1, pocket: 'footLeft', tipY: -0.2, speed: 1.88, zone: 0, rate: 42, why: 'Straight in from 12.5". A touch below center at 1.88 m/s and the cue ball stops on the contact spot.' },
    { ball: 2, pocket: 'sideRight', tipY: -0.3, speed: 1.4, rate: 45, why: 'Straight in from the stop. Same stroke again keeps the cue ball away from the side pocket.' },
  ],
} satisfies PoolDrill;
