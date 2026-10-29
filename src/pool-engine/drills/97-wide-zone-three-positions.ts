import type { PoolDrill } from '../types';

/**
 * Ba vị trí trên cú thẳng: stop dừng ở ghost ball, follow lăn thêm nửa diamond, draw kéo về hai diamond. Bản giai đoạn 1
 * của drill 08, cú thẳng và zone rộng. Tự soạn cho giai đoạn 1 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. Đường vẽ tay theo
 * đường thẳng qua tâm bi, bàn 50" × 100"; tip, lực và ngưỡng 6/9 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const wideZoneThreePositions = {
  id: '97',
  number: 97,
  title: 'Wide Zones: Stop, Follow, Draw',
  subtitle: 'One straight shot, three big zones on the same line. Path drawn, not simulated.',
  category: 'cueBallControl',
  skill: 'threePositions',
  skillLabel: 'Stop / Draw / Follow',
  difficulty: 1,
  objective: 'Same straight shot each round. Stop in A, follow into B, draw back into C. Three tries each.',
  cueBall: { x: 0.5555, y: 0.5554 },
  objectBalls: [{ number: 1, x: 0.2, y: 0.2 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.2201, y: 0.2201 }, radius: 0.08, label: 'A' },
    { kind: 'circle', center: { x: 0.1664, y: 0.1665 }, radius: 0.08, label: 'B' },
    { kind: 'circle', center: { x: 0.4438, y: 0.4436 }, radius: 0.1, label: 'C' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.3 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 9,
  passCondition: { kind: 'inZone', required: 6 },
  tips: [
    'Keep the same stance and bridge for all three. Only the tip height changes.',
    'Follow only half a diamond. A soft roll is enough, the pocket is close behind.',
  ],
  mistakes: [
    'Cue ball scratches on the follow round: too much speed, not too much top.',
    'Draw dies early: the tip is not low enough or the stroke stops at the ball.',
  ],
  rounds: [
    {
      title: 'A · Stop',
      spin: 'stun',
      zone: 0,
      speed: 2.55,
      contactPoint: { x: 0, y: -0.3 },
      why: 'Three diamonds away the cue ball rolls before contact, so a little below center is what stops it dead.',
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
        { kind: 'expectedCuePath', points: [{ x: 0.5555, y: 0.5554 }, { x: 0.3878, y: 0.3878 }, { x: 0.2201, y: 0.2201 }] },
      ],
    },
    {
      title: 'B · Follow',
      spin: 'follow',
      zone: 1,
      speed: 0.8,
      contactPoint: { x: 0, y: 0.4 },
      why: 'Soft top keeps the cue ball rolling half a diamond on the same line and short of the pocket.',
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
        { kind: 'expectedCuePath', points: [{ x: 0.5555, y: 0.5554 }, { x: 0.2201, y: 0.2201 }, { x: 0.1664, y: 0.1665 }] },
      ],
    },
    {
      title: 'C · Draw',
      spin: 'draw',
      zone: 2,
      speed: 2.95,
      contactPoint: { x: 0, y: -0.45 },
      why: 'Low tip and a firmer stroke bring the cue ball two diamonds straight back toward you.',
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
        { kind: 'expectedCuePath', points: [{ x: 0.5555, y: 0.5554 }, { x: 0.2201, y: 0.2201 }, { x: 0.4438, y: 0.4436 }] },
      ],
    },
  ],
} satisfies PoolDrill;
