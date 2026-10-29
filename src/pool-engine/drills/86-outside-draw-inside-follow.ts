import type { PoolDrill } from '../types';

/**
 * Outside Draw / Inside Follow, bước phê trong điều bi của chuỗi Ép phê (`docs/quyet-dinh/2026-10-25-muc-tieu-va-chu-de-pool.md`),
 * từ #39 trong `docs/research/nguon/2026-10-25-nguon-messenger-bida.md`. Thế cắt 30° của drill 84 (bi cái cách ghost
 * 2 diamond), hai cách đưa bi cái về cùng một zone: kéo phê ngoài và theo phê trong. Tip, lực, rate và zone lấy từ
 * `drill86()` của `scripts/position-harness/`: zone là trung điểm chỗ dừng của hai cú danh nghĩa, bán kính ½ diamond.
 * Engine chưa có swerve, cơ nằm ngang.
 */
export const outsideDrawInsideFollow = {
  id: '86',
  number: 86,
  title: 'Outside Draw / Inside Follow',
  subtitle: 'One cut shot, two ways to the same spot: draw with outside english, then follow with inside. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'english',
  skillLabel: 'English',
  difficulty: 4,
  objective: 'Pot the 1-ball and stop the cue ball in the zone near the right long rail, three times with outside draw and three times with inside follow.',
  cueBall: { x: 0.2902, y: 0.5697 },
  objectBalls: [{ number: 1, x: 0.3, y: 0.3 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.9224, y: 0.137 }, radius: 0.125, label: 'Zone' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0.2, y: -0.35 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'firm',
  allowedRails: 2,
  attemptCount: 6,
  passCondition: { kind: 'inZone', required: 4 },
  tips: [
    'Same pot, same zone, two different tips. Outside draw and inside follow both reach this spot; the point is to own both.',
    'Outside english squirts the cue ball out and makes the hit fuller. Inside does the reverse and makes it thinner. Adjust the aim before you add spin.',
    'Outside draw needs a touch more pace than inside follow here, about 2.1 against 2.0 m/s.',
    'When a pattern blocks one path, the other is your way in.',
  ],
  mistakes: [
    'Missing thin with inside follow: squirt and throw both push the 1-ball toward undercut. Aim fuller.',
    'Missing thick with outside draw: squirt makes the hit fuller. Aim a hair thinner.',
    'Losing the draw on the outside round: the tip slid up. Keep the low hit and add side, do not trade one for the other.',
  ],
  rounds: [
    {
      title: 'Outside draw',
      zone: 0,
      spin: 'draw',
      contactPoint: { x: 0.2, y: -0.35 },
      speed: 2.1,
      rate: 12,
      why: 'Draw with outside english. Squirt 1.0° makes the hit fuller and the 1-ball still drops, the cue ball stops 1.5" from the zone center.',
    },
    {
      title: 'Inside follow',
      zone: 0,
      spin: 'follow',
      contactPoint: { x: -0.2, y: 0.25 },
      speed: 1.15,
      rate: 15,
      why: 'Follow with inside english. Squirt −1.0° and throw −0.8° make the hit thinner, the cue ball stops 1.5" from the same zone center.',
    },
  ],
} satisfies PoolDrill;
