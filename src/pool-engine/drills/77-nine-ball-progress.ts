import type { PoolDrill } from '../types';

/**
 * 9-Ball Progress, bài 77 của `docs/research/pool-practice-drills/drills-66-81-bank-break-jump-kiem-tra.md`, gốc Ron Shepard
 * qua Bob Jewett BD 05/2002 https://www.sfbilliards.com/articles/2002.pdf. [nguồn]: tung bi lên bàn cho tự dừng ngẫu nhiên,
 * ball in hand, chạy theo thứ tự số; chạy hết thì lần sau thêm 1 bi, trượt thì bớt 1 bi; biến thể break rồi bỏ bi số nhỏ, thêm
 * 1 lần ball in hand, hoặc chỉ đổi số bi khi net ±3. Bố cục ngẫu nhiên nên sơ đồ là một ví dụ 2 bi: bi 1 (0.3, 0.625), bi 2
 * (0.75, 0.3125) (research in 0.312, làm tròn của 1 − 5.5/8), bi cái (0.625, 0.75). [đề xuất] của research: ổn định ở 5 bi là
 * C, 7 bi là B, 9 bi là A, nguồn không có thang. [suy luận] của em: app chỉ có Pass/Miss nên Pass là chạy hết số bi đang tập,
 * 10 lượt, qua ở 5, tức đứng được ở mức hiện tại. Chưa kiểm trên bàn thật.
 */
export const nineBallProgress = {
  id: '77',
  number: 77,
  title: '9-Ball Progress',
  subtitle: 'Run a few random balls in order. One more after every run, one less after a miss.',
  category: 'patternPlay',
  skill: 'test',
  skillLabel: '9-Ball Progress',
  difficulty: 4,
  objective:
    'Toss the balls onto the table, take ball in hand and run them in numerical order. Run them all: add a ball next time. Miss: take one away. Ten tries.',
  cueBall: { x: 0.625, y: 0.75 },
  objectBalls: [
    { number: 1, x: 0.3, y: 0.625 },
    { number: 2, x: 0.75, y: 0.3125 },
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [],
  guideLines: [],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: [
    'The layout is random. Roll the balls out by hand and let them stop where they stop; the diagram is just one example with two balls.',
    'Tap Pass when you run every ball on the table in order. Holding steady at 5 balls is about C level, 7 is B, 9 is A.',
    'Variations: break and then pick up the low balls, allow one extra ball in hand, or change the count only after a net of three runs or three misses.',
  ],
  mistakes: [
    'Shooting the easy ball first: it is rotation, always the lowest ball. Plan two balls ahead from ball in hand.',
  ],
} satisfies PoolDrill;
