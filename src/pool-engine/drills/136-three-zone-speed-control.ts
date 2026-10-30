import type { PoolDrill } from '../types';

/**
 * Three-Zone Speed Control, bài mới cho hạng H theo deep-research-report (ý bài: ba zone gần, giữa, xa trên cùng một cú,
 * 9 cú, mỗi zone 2/3). Toạ độ báo cáo không dùng. Bi 1 ở (15", 40") thẳng vào lỗ góc chân trái, bi cái lùi 12.5" sau ghost
 * ball, ba zone 6" lăn theo 4", 16", 28" qua chỗ chạm [đề xuất]. Tip, lực, rate từng zone lấy từ `drill136()` của
 * `scripts/position-harness/` trên ShotPhysics `65a775f`, mẫu đạt khi vào sạch, dừng trong zone, không chạm băng. Chưa kiểm
 * trên bàn thật.
 */
export const threeZoneSpeedControl = {
  id: '136',
  number: 136,
  title: 'Three-Zone Speed Control',
  subtitle: 'One straight shot, follow into a near, middle and far zone. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'speedControl',
  skillLabel: 'Speed Control',
  difficulty: 2,
  objective: 'Same straight shot each round. Follow into A, then B, then C. Three tries each, two must land.',
  cueBall: { x: 0.4036, y: 0.5381 },
  objectBalls: [{ number: 1, x: 0.3, y: 0.4 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.288, y: 0.384 }, radius: 0.12, label: 'A' },
    { kind: 'circle', center: { x: 0.204, y: 0.271 }, radius: 0.12, label: 'B' },
    { kind: 'circle', center: { x: 0.12, y: 0.159 }, radius: 0.12, label: 'C' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.3 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 9,
  passCondition: { kind: 'roundQuota', required: 6, perRound: 2 },
  tips: ['Same stance, same bridge. Speed moves the cue ball from zone to zone.', 'Pick the zone before you get down on the shot.'],
  mistakes: ['Cue ball runs past C into the corner: too firm for the far zone.', 'All three land in the same place: the stroke does not change.'],
  rounds: [
    {
      title: 'A · Near',
      spin: 'follow',
      zone: 0,
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
        { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
      ],
      contactPoint: { x: 0, y: 0.5 },
      speed: 0.72,
      rate: 23,
      why: 'Soft top at 0.72 m/s rolls the cue ball 8" past contact.',
    },
    {
      title: 'B · Middle',
      spin: 'follow',
      zone: 1,
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
        { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
      ],
      contactPoint: { x: 0, y: 0.3 },
      speed: 1.1,
      rate: 28,
      why: 'A little more speed, 1.10 m/s, carries the cue ball 15" past contact.',
    },
    {
      title: 'C · Far',
      spin: 'follow',
      zone: 2,
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
        { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
      ],
      contactPoint: { x: 0, y: 0.2 },
      speed: 1.52,
      rate: 17,
      why: 'Firmer, 1.52 m/s, runs the cue ball 27" past contact and stops it short of the corner.',
    },
  ],
} satisfies PoolDrill;
