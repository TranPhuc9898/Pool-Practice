import type { PoolDrill } from '../types';

/**
 * Natural Angle, research `docs/research/pool-9ball/06-cue-ball-control.md` #3 (Tuấn), đối chiếu Shepard và Jewett 1995
 * Shot 2. Bi cái lăn đều (tipY 0.4), bốn round cắt 10/30/60/75° vào lỗ giữa trái, mỗi round một zone ở chỗ bi cái dừng.
 * Tip chỉ lấy claim APPROXIMATION và VERIFIED của #3. Toạ độ, lực, zone chép từ `sh scripts/position-harness/run.sh`
 * trên ShotPhysics ddf3049: góc engine lệch Shepard +4.3 / +0.1 / −2.1 / −0.9°, rate 45 / 42 / 39 / 20 trên 45.
 */
export const naturalAngle = {
  id: '24',
  number: 24,
  title: 'Natural Angle',
  // Zone, lực và góc chỉ đo trên ShotPhysics, chưa đo bàn thật (plan `2026-10-18-hieu-chinh-engine.md` bước 2).
  subtitle: 'Read where a rolling cue ball goes after contact. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'naturalAngle',
  skillLabel: 'Natural Angle',
  difficulty: 3,
  objective: 'Rolling cue ball, four cut angles into the side pocket. Pot the 1-ball and stop the cue ball in the zone.',
  cueBall: { x: 0.2292, y: 0.3857 },
  objectBalls: [{ number: 1, x: 0.0919, y: 0.4614 }],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.1163, y: 0.4699 }, radius: 0.07, label: '10°' },
    { kind: 'circle', center: { x: 0.1401, y: 0.366 }, radius: 0.07, label: '30°' },
    { kind: 'circle', center: { x: 0.1158, y: 0.0713 }, radius: 0.07, label: '60°' },
    { kind: 'circle', center: { x: 0.8328, y: 0.0582 }, radius: 0.07, label: '75°' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 2,
  attemptCount: 12,
  passCondition: { kind: 'inZone', required: 8 },
  tips: [
    'Call where the cue ball will stop before every shot, then compare.',
    'Under about 15° of cut, a rolling cue ball leaves the cue line at about twice the cut angle.',
    'From 15° to 45° it leaves at about 30°, widest near a half-ball hit at about 34°.',
    'From 60° up it leaves at about two thirds of the angle left to the tangent line.',
  ],
  mistakes: [
    'Cue ball runs out toward the tangent line before it bends: hit too hard. Pace shifts the path out parallel to the soft-shot line.',
    'Expected 30° on the thin cuts and the cue ball overshot the zone: past 60° the angle shrinks, use two thirds of the angle to the tangent line.',
  ],
  rounds: [
    { title: '10°', zone: 0, spin: 'follow', speed: 0.4, cueBall: { x: 0.2292, y: 0.3857 }, objectBalls: [{ number: 1, x: 0.0919, y: 0.4614 }] },
    { title: '30°', zone: 1, spin: 'follow', speed: 0.9, cueBall: { x: 0.284, y: 0.4331 }, objectBalls: [{ number: 1, x: 0.0919, y: 0.4614 }] },
    { title: '60°', zone: 2, spin: 'follow', speed: 0.9, cueBall: { x: 0.3047, y: 0.5435 }, objectBalls: [{ number: 1, x: 0.1576, y: 0.4861 }] },
    { title: '75°', zone: 3, spin: 'follow', speed: 2.5, cueBall: { x: 0.4128, y: 0.3851 }, objectBalls: [{ number: 1, x: 0.3545, y: 0.4687 }] },
  ],
} satisfies PoolDrill;
