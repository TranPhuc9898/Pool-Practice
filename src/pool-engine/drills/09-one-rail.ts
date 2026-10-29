import type { PoolDrill } from '../types';

/**
 * Zone và cú cố định (tipY 0.05, 1.0 m/s) lấy từ quét lực trên ShotPhysics (2026-10-29): bi cái chạm băng phải một lần rồi
 * về giữa bàn. Zone cũ (0.612, 0.358) không tới được bằng một băng ở lực nào; lực medium 1.8 m/s ra hai băng, sai luật 3.
 * Lực nhạy: ±0.1 m/s dịch chỗ dừng chừng 6".
 */
export const oneRail = {
  id: '09',
  number: 9,
  title: 'One Rail',
  subtitle: 'Use one cushion to bring the cue ball back to the middle. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'oneRail',
  skillLabel: 'One Rail Position',
  difficulty: 4,
  objective: 'Pocket the 1-ball, go one rail, land in the zone. No side spin.',
  cueBall: { x: 0.2, y: 0.25 },
  objectBalls: [{ number: 1, x: 0.8, y: 0.15 }],
  targetPocket: 'footRight',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.596, y: 0.24 }, radius: 0.09 }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.05 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 6 },
  shots: [
    { ball: 1, pocket: 'footRight', tipY: 0.05, speed: 1, zone: 0, rate: 7, why: 'Natural roll. The cue ball touches the right rail once and comes back to the middle of the foot end.' },
  ],
  tips: ['Natural angle first, speed second.', 'Watch the rail contact, not the cue ball.'],
} satisfies PoolDrill;
