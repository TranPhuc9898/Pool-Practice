import type { PoolDrill } from '../types';

/**
 * Draw Trisect, bài kiểm của Tuấn ở `docs/research/pool-9ball/06-cue-ball-control.md` #4: bi 1 giữa bàn cắt 30° vào lỗ
 * góc foot phải, bi cái trên head string, draw tốt thì bi cái lùi 3 × 30° = 90° khỏi đường đánh, chạy ngang về lỗ giữa
 * trái. Tip chỉ lấy claim CONDITIONAL và VERIFIED của #4. Tip, lực, zone và `rate` chép từ
 * `sh scripts/position-harness/run.sh` trên ShotPhysics ddf3049: góc engine 93.7°, rate 2/45 vì draw rất nhạy với tip ±0.1.
 */
export const drawTrisect = {
  id: '25',
  number: 25,
  title: 'Draw Trisect',
  // Zone, tip, lực và tỉ lệ chỉ đo trên ShotPhysics, chưa đo bàn thật (plan `2026-10-18-hieu-chinh-engine.md` bước 2).
  subtitle: 'Draw back at three times the cut angle. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'drawAngle',
  skillLabel: 'Draw Angle',
  difficulty: 4,
  objective: 'Cut the 1-ball 30° into the far right corner and draw the cue ball across to stop at the mouth of the left side pocket.',
  cueBall: { x: 0.5075, y: 0.75 },
  objectBalls: [{ number: 1, x: 0.5, y: 0.5 }],
  targetPocket: 'footRight',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.0921, y: 0.5325 }, radius: 0.07, label: 'Side' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: -0.5 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'firm',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 5 },
  tips: [
    'With good draw and a cut up to 40°, the cue ball comes back at three times the cut angle. 30° here, so 90° off the cue line.',
    'Draw is harder to control than follow. Expect a lower score than on rolling shots.',
  ],
  mistakes: [
    'Cue ball comes back between the tangent line and the 90° line: not enough backspin left at contact. Hit lower or firmer.',
    'Cue ball drops in the side pocket: right line, too much pace. The zone is the mouth, stop short of it.',
  ],
  steps: [{ label: 'SHOT 1', caption: 'Draw, pot 1' }],
  shots: [
    {
      ball: 1,
      pocket: 'footRight',
      tipY: -0.5,
      speed: 2.25,
      zone: 0,
      rate: 2,
      why: 'Low draw at this pace comes back about 90° off the cue line, straight across to the side pocket mouth. Scratch in the side and the run fails.',
    },
  ],
} satisfies PoolDrill;
