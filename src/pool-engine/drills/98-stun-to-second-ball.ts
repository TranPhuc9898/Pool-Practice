import type { PoolDrill } from '../types';

/**
 * Hai bi: cắt nhẹ 20° bi 1 vào lỗ giữa trái bằng stun, bi cái chạy theo tiếp tuyến vào zone rộng giữa bàn, rồi bi 2 gần
 * thẳng vào góc head right. Tự soạn cho giai đoạn 1 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. Đường vẽ tay: cú 1
 * theo tiếp tuyến 90°, khoảng chạy 25" là ước lượng; cú 2 stop ở ghost ball. Bàn 50" × 100"; tip, lực và ngưỡng 6/10
 * [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const stunToSecondBall = {
  id: '98',
  number: 98,
  title: 'Stun to the Second Ball',
  subtitle: 'Small cut, stun the cue ball along the tangent into a big zone. Path drawn, not simulated.',
  category: 'cueBallControl',
  skill: 'tangent',
  skillLabel: 'Tangent Line',
  difficulty: 1,
  objective:
    'Pot the 1 in the left side pocket with stun so the cue ball runs along the tangent into the zone. Then pot the 2 in the head right corner. Ten tries.',
  cueBall: { x: 0.4834, y: 0.2357 },
  objectBalls: [
    { number: 1, x: 0.15, y: 0.45 },
    { number: 2, x: 0.8194, y: 0.8803 },
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.4654, y: 0.6455 }, radius: 0.1, label: 'Zone' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
    { kind: 'tangentLine', ball: 1, pocket: 'sideLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.2 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'Before you shoot, point your cue along the tangent line. That is where the cue ball goes with stun.',
    'The zone is big. Any spot inside leaves a near-straight shot on the 2.',
  ],
  mistakes: [
    'Cue ball curves forward past the zone: it was rolling at contact, aim a bit lower.',
    'Cue ball curves back toward the left rail: too much draw.',
  ],
  rounds: [
    {
      title: 'Stun the 1',
      spin: 'stun',
      zone: 0,
      speed: 1.5,
      contactPoint: { x: 0, y: -0.2 },
      why: 'With stun the cue ball leaves contact at 90° to the 1-ball line, straight into the middle of the table.',
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
        { kind: 'expectedCuePath', points: [{ x: 0.4834, y: 0.2357 }, { x: 0.1874, y: 0.4375 }, { x: 0.4654, y: 0.6455 }] },
      ],
    },
    {
      title: 'Pot the 2',
      spin: 'stun',
      speed: 1.6,
      contactPoint: { x: 0, y: -0.3 },
      why: 'From the zone the 2 is almost straight in, so a stop shot finishes the pattern with no risk.',
      objectBalls: [{ number: 2, x: 0.8194, y: 0.8803 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 2, pocket: 'headRight' },
        { kind: 'ghostBall', ball: 2, pocket: 'headRight' },
        { kind: 'expectedCuePath', points: [{ x: 0.4654, y: 0.6455 }, { x: 0.628, y: 0.754 }, { x: 0.7924, y: 0.8623 }] },
      ],
    },
  ],
} satisfies PoolDrill;
