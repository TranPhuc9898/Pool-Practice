import type { PoolDrill } from '../types';

/**
 * Equal Offense, bài 79 của `docs/research/pool-practice-drills/drills-66-81-bank-break-jump-kiem-tra.md`, gốc Jerry Briesath,
 * BCA 1977, qua Bob Jewett https://www.sfbilliards.com/articles/2010.pdf và
 * https://thepoolscene.com/posts/billiard-instructional-practice-games. [nguồn]: rack 15 bi, open break, sau break chơi luật
 * 14.1 gọi bi tới khi trượt hoặc đủ 20 bi thì hết inning, 10 inning, tối đa 200 điểm; thang Jewett bàn 9 ft: 20+ beginner,
 * 50+ intermediate, 80+ advanced (mốc hạng B), 100+ top room, 120+ top city, 140+ semi-pro; percentile Kudrick 25 = 5%,
 * 51 = 25%, 71 = 50%, 136 = 95%, 160 = 99%. Rack in sẵn là rack 15 bi khít, bi 1 trên foot spot, theo thứ tự số; luật 14.1 không
 * bắt thứ tự trong rack. [suy luận] của em: app chỉ có Pass/Miss nên mỗi inning một lượt, Pass khi inning đó được 8 bi trở lên
 * (trung bình của mốc 80), qua ở 5/10; điểm thật là tổng bi cả 10 inning, ghi tay. Chưa kiểm trên bàn thật.
 */
export const equalOffense = {
  id: '79',
  number: 79,
  title: 'Equal Offense',
  subtitle: 'Ten innings of straight pool, 20 balls max each. Score out of 200.',
  category: 'patternPlay',
  skill: 'test',
  skillLabel: 'Equal Offense',
  difficulty: 4,
  objective:
    'Rack 15 and open break. Then call your shots under 14.1 rules until you miss or reach 20 balls. That is one inning. Ten innings, 200 points max.',
  cueBall: { x: 0.5, y: 0.875 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.25 },
    { number: 2, x: 0.4775, y: 0.23051 },
    { number: 3, x: 0.5225, y: 0.23051 },
    { number: 4, x: 0.455, y: 0.21103 },
    { number: 5, x: 0.5, y: 0.21103 },
    { number: 6, x: 0.545, y: 0.21103 },
    { number: 7, x: 0.4325, y: 0.19154 },
    { number: 8, x: 0.4775, y: 0.19154 },
    { number: 9, x: 0.5225, y: 0.19154 },
    { number: 10, x: 0.5675, y: 0.19154 },
    { number: 11, x: 0.41, y: 0.17206 },
    { number: 12, x: 0.455, y: 0.17206 },
    { number: 13, x: 0.5, y: 0.17206 },
    { number: 14, x: 0.545, y: 0.17206 },
    { number: 15, x: 0.59, y: 0.17206 },
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
    'Tap Pass for an inning of 8 balls or more. Keep the real score on paper: total balls over the ten innings.',
    'Jewett, 9-foot table: 20+ beginner, 50+ intermediate, 80+ advanced, 100+ top room player, 120+ top city player, 140+ semi-pro.',
    'For reference, 71 is the median player and 136 is the top 5%.',
    'Straight pool: leave one ball out as a break ball when you get down to the last few, and re-rack the 14.',
  ],
  mistakes: [
    'Breaking up clusters too early with no safe ball to come back to. Clear the open balls first, then use one to get into the cluster.',
  ],
} satisfies PoolDrill;
