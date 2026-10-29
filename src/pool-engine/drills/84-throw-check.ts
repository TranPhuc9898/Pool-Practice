import type { PoolDrill } from '../types';

/**
 * Throw Check, bước throw ở cú nửa bi của chuỗi Ép phê (`docs/quyet-dinh/2026-10-25-muc-tieu-va-chu-de-pool.md`).
 * Cắt 30° vào lỗ góc, bi cái cách ghost 2 diamond, bi 1 cách lỗ 33.5". Ba round: tip giữa chậm, tip giữa nhanh, phê ngoài
 * vừa gearing. Lực, rate, throw lấy từ `drill84()` của `scripts/position-harness/`; tipX gearing là chỗ `throwDeg` của
 * cú danh nghĩa đổi dấu ở 1.6 m/s. Engine chưa có swerve, cơ nằm ngang.
 */
export const throwCheck = {
  id: '84',
  number: 84,
  title: 'Throw Check',
  subtitle: 'Same half-ball cut slow, fast, and with gearing outside english. Feel how speed and spin change throw. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'english',
  skillLabel: 'English',
  difficulty: 3,
  objective: 'Pot the 1-ball on a half-ball cut three ways: slow center ball, firm center ball, and gearing outside english, three shots each.',
  cueBall: { x: 0.2902, y: 0.5697 },
  objectBalls: [{ number: 1, x: 0.3, y: 0.3 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 9,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'Throw drags the object ball along with the cue ball, toward undercut. Slow shots throw the most.',
    'On the slow round aim a touch thinner than the ghost ball. On the firm round aim closer to it.',
    'Gearing outside english is a small tip offset, here about 0.18 of the way to the edge. It rolls the cue ball across the object ball so there is nothing to throw.',
    'Past gearing the throw flips to overcut. More side is not more correction.',
  ],
  mistakes: [
    'Undercutting the slow round: throw pulled the 1-ball short of the pocket line.',
    'Overcutting the firm round after fixing the slow one: firm shots throw less, so the old correction is too much.',
    'Too much outside on the gearing round: the throw turns the other way and squirt makes the hit fuller.',
    'Changing speed and aim on the same shot. Change one thing at a time.',
  ],
  rounds: [
    {
      title: 'Slow center',
      spin: 'center',
      contactPoint: { x: 0, y: 0 },
      speed: 1.1,
      rate: 11,
      why: 'Just enough pace to reach the pocket. Throw is largest when slow: 1.8° toward undercut, about 1" at the pocket.',
    },
    {
      title: 'Firm center',
      spin: 'center',
      contactPoint: { x: 0, y: 0 },
      speed: 2.4,
      rate: 14,
      why: 'Same aim line, more pace. Throw drops to 1.0°, about half an inch at the pocket, so aim closer to the ghost.',
    },
    {
      title: 'Gearing outside',
      spin: 'center',
      contactPoint: { x: 0.18, y: 0 },
      speed: 1.6,
      rate: 18,
      why: 'Outside english at gearing: the surfaces roll without slipping, so throw is 0°. Squirt 0.9° still makes the hit a hair fuller.',
    },
  ],
} satisfies PoolDrill;
