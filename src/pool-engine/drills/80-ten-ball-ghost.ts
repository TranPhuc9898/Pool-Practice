import type { PoolDrill } from '../types';

/**
 * 10-Ball Ghost, bài 80 của `docs/research/pool-practice-drills/drills-66-81-bank-break-jump-kiem-tra.md`, gốc Joe Tucker trên
 * AZB https://forums.azbilliards.com/goto/post?id=2036320, biến thể 15 bi https://forums.azbilliards.com/goto/post?id=4520954.
 * [nguồn]: rack 10-ball, break, ghost thắng mọi rack không chạy hết. [forum]: thang qghunter (2009) Pro 70+, Semi-pro 60–69,
 * A 50–59, B 40–49, C 30–39, D 20–29; biến thể 15-ball ghost tính số lần ball in hand qua 10 rack, 0–20 Pro, 21–40 A, 41–60 B,
 * 61–80 C, 81–100 D. [suy luận] của research: 1 điểm mỗi bi, 10 rack, tối đa khoảng 100, cách tính chi tiết chưa lấy được.
 * Rack 10-ball khít, bi 1 trên foot spot, bi 10 giữa hàng ba; bi cái in sẵn ở (0.5, 0.875) theo sơ đồ. [suy luận] của em: app chỉ
 * có Pass/Miss nên mỗi rack một lượt, Pass khi rack đó vào từ 4 bi (trung bình của mốc B 40), qua ở 5/10; điểm thật ghi tay.
 * Chưa kiểm trên bàn thật.
 */
export const tenBallGhost = {
  id: '80',
  number: 80,
  title: '10-Ball Ghost',
  subtitle: 'Ten racks of 10-ball against the ghost. Every rack you do not run, the ghost wins.',
  category: 'patternPlay',
  skill: 'test',
  skillLabel: '10-Ball Ghost',
  difficulty: 4,
  objective:
    'Break and run ten racks of 10-ball. The ghost wins any rack you do not finish. Score one point per ball you make.',
  cueBall: { x: 0.5, y: 0.875 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.25 },
    { number: 2, x: 0.4775, y: 0.23051 },
    { number: 3, x: 0.5225, y: 0.23051 },
    { number: 4, x: 0.455, y: 0.21103 },
    { number: 10, x: 0.5, y: 0.21103 },
    { number: 5, x: 0.545, y: 0.21103 },
    { number: 6, x: 0.4325, y: 0.19154 },
    { number: 7, x: 0.4775, y: 0.19154 },
    { number: 8, x: 0.5225, y: 0.19154 },
    { number: 9, x: 0.5675, y: 0.19154 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: [
    'Tap Pass for a rack where you made 4 balls or more. Keep the total on paper: one point per ball over ten racks.',
    'Forum scale: Pro 70+, Semi-pro 60–69, A 50–59, B 40–49, C 30–39, D 20–29. The exact scoring is not confirmed.',
    'Harder version: 15-ball ghost. Count the ball-in-hands you need over ten racks. 0–20 Pro, 21–40 A, 41–60 B, 61–80 C, 81–100 D.',
  ],
  mistakes: [
    'Going for a big break with no control: a scratch hands the rack to the ghost. Break at a speed you can control.',
  ],
} satisfies PoolDrill;
