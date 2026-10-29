import type { PoolDrill } from '../types';

/**
 * Frozen Pair & Throw, bài 48 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, AZBilliards
 * (https://forums.azbilliards.com/goto/post?id=4745603). Layout và kỹ thuật [forum]: bi 1 và bi 2 ép vào nhau và ép long
 * rail trái giữa lỗ sideLeft và headLeft, bi cái gần giữa foot rail, đánh dày vào bi 2 đẩy bi 1 vào headLeft; throw đẩy bi 1
 * khỏi băng, sửa bằng rail-first nhẹ. Bài phụ throw lấy từ VEPP "maximum throw" [nguồn]. Toạ độ theo research, bi ép băng
 * ở x 0.0225 [suy luận]. Ngưỡng 7/10 là [đề xuất]; forum chỉ gợi ý khoảng 15 lần rồi thêm 10–15 lần cuối buổi.
 * objectBalls[0] là bi 1, bi rơi lỗ. Chưa kiểm trên bàn thật. Thuộc chuỗi phê vì bài dạy throw: lực và rate từ `drill48()`
 * của `scripts/position-harness/`. `shots[0].ball` là bi 2, bi cái ngắm vào nó; cú đạt khi bi 1 bị đẩy rơi đúng headLeft.
 */
export const frozenPairThrow = {
  id: '48',
  number: 48,
  title: 'Frozen Pair & Throw',
  subtitle: 'Two balls frozen together on the rail. Push the front one down the rail into the corner. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'english',
  skillLabel: 'English',
  difficulty: 3,
  objective: 'Hit the 2-ball full and drive the 1-ball along the rail into the left head corner. Pot 7 of 10.',
  cueBall: { x: 0.5, y: 0.0625 },
  objectBalls: [
    { number: 1, x: 0.0225, y: 0.75 },
    { number: 2, x: 0.0225, y: 0.7275 },
  ],
  targetPocket: 'headLeft',
  cueBallTargetZones: [],
  guideLines: [{ kind: 'objectBallPath', ball: 1, pocket: 'headLeft' }],
  shots: [
    {
      ball: 2,
      pocket: 'headLeft',
      tipY: 0,
      speed: 1.85,
      rate: 45,
      why: 'Full hit on the 2 at 1.85 m/s. The engine throws only 0.7° here, so all 45 samples drop; on a real table throw drags the 1 off the rail.',
    },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    'Throw pushes the 1-ball off the rail. Fix it by hitting the rail a hair before the 2-ball.',
    'A clean simultaneous hit only works when the pair is within about 1.5 diamonds of the pocket.',
    'Side drill: a half-ball cut from 3 feet with no throw correction. Watch how far the ball misses the pocket center.',
    'About 15 shots, then another 10–15 at the end of the session.',
  ],
  mistakes: [
    'The 1-ball comes off the rail and hits the point: throw. Go a touch rail-first.',
    'The 2-ball follows the 1 and blocks the pocket: shoot slower.',
  ],
} satisfies PoolDrill;
