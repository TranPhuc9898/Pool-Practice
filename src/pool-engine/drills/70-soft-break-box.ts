import type { PoolDrill } from '../types';

/**
 * Soft Break from the Box, bài 70 (R5) của `docs/research/pool-practice-drills/drills-66-81-bank-break-jump-kiem-tra.md`,
 * gốc Bob Jewett BD 09/2008 http://www.sfbilliards.com/articles/2008.pdf. [nguồn]: rack 9-ball, bi 9 trên foot spot; break
 * hợp lệ khi ít nhất 3 bi vượt head string. Rack khít dùng lại đúng toạ độ rack của drill 29 (bi 1 ở 0.28897, research in
 * 0.28875). [suy luận] của research: box là nửa giữa kitchen, x 0.25 → 0.75, y 0.75 → 1; bi cái in sẵn ở giữa box
 * (0.5, 0.875) theo sơ đồ. [đề xuất]: đạt 7/10 break hợp lệ. [suy luận] của em: tip stun để bi cái đứng gần giữa bàn,
 * nguồn chỉ nói tập cho bi cái đứng giữa. Không chấm vị trí bi cái nên không có zone. Chưa kiểm trên bàn thật.
 */
export const softBreakBox = {
  id: '70',
  number: 70,
  title: 'Soft Break from the Box',
  subtitle: '9-ball on the spot. Break with control from the box, not full power.',
  category: 'patternPlay',
  skill: 'break',
  skillLabel: 'Break',
  difficulty: 2,
  objective: 'Break the 9-ball rack from the box with controlled speed. A break counts when at least three balls cross the head string.',
  cueBall: { x: 0.5, y: 0.875 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.28897 },
    { number: 2, x: 0.4775, y: 0.26949 },
    { number: 3, x: 0.5225, y: 0.26949 },
    { number: 4, x: 0.455, y: 0.25 },
    { number: 9, x: 0.5, y: 0.25 },
    { number: 5, x: 0.545, y: 0.25 },
    { number: 6, x: 0.4775, y: 0.23051 },
    { number: 7, x: 0.5225, y: 0.23051 },
    { number: 8, x: 0.5, y: 0.21103 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [],
  recommendedContactPoint: { x: 0, y: -0.2 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    'The box is the middle half of the kitchen: between the first and third diamonds across, behind the head string.',
    'Controlled speed. Hit the 1 square and try to leave the cue ball near the middle of the table.',
    'Count the balls that end up past the head string. Three or more makes it legal; a ball down with a shot left is a bonus.',
  ],
  mistakes: [
    'Fewer than three balls reach the head string: too soft or hit off center on the 1. Add a little speed, not power.',
    'Cue ball runs to the rails after the hit: it arrived rolling. Hit lower so it is still stunned at the 1.',
  ],
} satisfies PoolDrill;
