import type { PoolDrill } from '../types';

/**
 * Stop shot có mục đích: bi 1 thẳng vào góc foot left, bi cái dừng tại ghost ball là thẳng bi 2 vào lỗ giữa phải. Tự soạn
 * cho giai đoạn 1 của `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn.
 * Đường vẽ tay theo đường thẳng qua tâm bi, bàn 50" × 100"; tip, lực và ngưỡng 7/10 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const stopAndGo = {
  id: '99',
  number: 99,
  title: 'Stop and Go',
  subtitle: 'Stop the cue ball dead and the next ball is straight in. Path drawn, not simulated.',
  category: 'cueBallControl',
  skill: 'stop',
  skillLabel: 'Stop Shot',
  difficulty: 1,
  objective: 'Pot the 1 straight in and stop the cue ball on the spot. Then pot the 2 straight into the right side pocket. Ten tries.',
  cueBall: { x: 0.4938, y: 0.4937 },
  objectBalls: [
    { number: 1, x: 0.25, y: 0.25 },
    { number: 2, x: 0.6932, y: 0.4034 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.2702, y: 0.2701 }, radius: 0.06, label: 'Stop' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.3 },
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
  rounds: [
    {
      title: 'Stop on the 1',
      spin: 'stun',
      zone: 0,
      speed: 1.5,
      contactPoint: { x: 0, y: -0.3 },
      why: 'A dead stop at the ghost ball is exactly where the 2 lines up straight with the side pocket.',
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
        { kind: 'expectedCuePath', points: [{ x: 0.4938, y: 0.4937 }, { x: 0.382, y: 0.382 }, { x: 0.2702, y: 0.2701 }] },
      ],
    },
    {
      title: 'Straight in on the 2',
      spin: 'stun',
      cueBall: { x: 0.2702, y: 0.2701 },
      speed: 1.5,
      contactPoint: { x: 0, y: -0.3 },
      why: 'Same stroke again. Stopping the cue ball keeps it away from the side pocket.',
      objectBalls: [{ number: 2, x: 0.6932, y: 0.4034 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 2, pocket: 'sideRight' },
        { kind: 'ghostBall', ball: 2, pocket: 'sideRight' },
        { kind: 'expectedCuePath', points: [{ x: 0.2702, y: 0.2701 }, { x: 0.462, y: 0.331 }, { x: 0.6552, y: 0.3914 }] },
      ],
    },
  ],
} satisfies PoolDrill;
