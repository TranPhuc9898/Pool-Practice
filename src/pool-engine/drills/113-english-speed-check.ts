import type { PoolDrill } from '../types';

/**
 * Nguồn: RioBilliard, swing so với đánh xuyên https://www.facebook.com/share/v/1DAgDzNxCo/ (#65), Tuấn Monkey, độ cao đầu
 * cơ và bù phê https://www.facebook.com/share/v/19f4CbDR7U/ (#54), RioBilliard, squirt khi đánh phê
 * https://www.facebook.com/share/v/1C9HU8tcWy/ (#33). Ý chính [nguồn]: cùng một cú có phê, lượng bù đổi theo lực. Thế bi,
 * tip +0.4 và ba bậc lực [đề xuất]. Lực, rate, squirt và throw lấy từ `drill113()` của `scripts/position-harness/`: squirt
 * engine cố định 2°, throw giảm từ 1.8° xuống 0.77° khi lực tăng, nên hướng cơ bù gần như không đổi (+1.85° đến +1.9°).
 * Engine không có swerve, mà swerve mới là phần làm lượng bù đổi theo lực trên bàn thật [suy luận], nên drill để người tập
 * tự ghi lệch ở từng lực. Chưa kiểm trên bàn thật.
 */
export const englishSpeedCheck = {
  id: '113',
  number: 113,
  title: 'English Speed Check',
  subtitle: 'One 28° cut with outside english at soft, medium and firm speed. Find how much to adjust the aim at each speed. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'english',
  skillLabel: 'English',
  difficulty: 5,
  objective: 'Pot the 1-ball in the corner with center ball, then with outside english at three speeds, three shots each.',
  cueBall: { x: 0.3, y: 0.7 },
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
  attemptCount: 12,
  passCondition: { kind: 'pocketed', required: 8 },
  tips: [
    'Shoot the center round first. Its aim is the baseline for every english round.',
    'Keep the same tip offset in all three english rounds. Only the speed changes.',
    'Note after each round whether you overcut or undercut, and by how much, before you adjust.',
    'A long, soft shot with english curves more on a real table than a firm one.',
  ],
  mistakes: [
    'Changing the tip offset between speeds, so the miss no longer tells you what speed did.',
    'Using one fixed aim adjustment for every speed without checking it.',
    'Missing the center round too: fix the aim first.',
  ],
  rounds: [
    {
      title: 'Center',
      spin: 'center',
      contactPoint: { x: 0, y: 0 },
      speed: 1.75,
      rate: 15,
      why: 'Baseline: 28° cut from 40 in. Collision throw alone pushes the 1-ball about 1.1° toward undercut.',
    },
    {
      title: 'Outside, soft',
      spin: 'center',
      contactPoint: { x: 0.4, y: 0 },
      speed: 1.2,
      rate: 14,
      why: 'Squirt 2° and spin throw 1.8°. Aim about 1.85° off the center round.',
    },
    {
      title: 'Outside, medium',
      spin: 'center',
      contactPoint: { x: 0.4, y: 0 },
      speed: 1.75,
      rate: 15,
      why: 'Squirt 2° and spin throw 1.2°. Aim about 1.9° off the center round.',
    },
    {
      title: 'Outside, firm',
      spin: 'center',
      contactPoint: { x: 0.4, y: 0 },
      speed: 2.55,
      rate: 15,
      why: 'Squirt 2° and spin throw 0.8°. Aim about 1.9° off the center round. On a real table there is less swerve here than on the soft shot.',
    },
  ],
} satisfies PoolDrill;
