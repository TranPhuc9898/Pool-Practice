import type { GuideLine, PoolDrill } from '../types';

/**
 * Break Evaluation, bài 71 (R1) của `docs/research/pool-practice-drills/drills-66-81-bank-break-jump-kiem-tra.md`, gốc BU
 * Exam II S10 https://billiarduniversity.org/documents/BU_Exam-II_Skills-Masters.pdf và Dr. Dave BD 05/2014
 * https://drdavepoolinfo.com/bd_articles/2014/may14.pdf. [nguồn]: rack 9-ball khít, bi 1 trên foot spot, bi cái in hand sau
 * head string, 3 lần break, mỗi lần 1 điểm cho từng tiêu chí trong 5 tiêu chí, lấy median của 3 lần, tối đa 5; zone là dải
 * giữa bàn y 0.25 → 0.75, hết bề ngang. Rack dùng lại đúng toạ độ rack của drill 30. [đề xuất]: đạt 3/5. [suy luận] của em:
 * app chỉ có Pass/Miss nên mỗi break ghi 5 lần, đúng thứ tự 5 tiêu chí, 3 round × 5 = 15, qua khi đạt 9 (3 mỗi break); tổng
 * không phải median, phải tự lấy median nếu muốn đúng điểm gốc. Không vẽ zone dải giữa bàn: schema chỉ có tròn, elip. Bi cái
 * in sẵn ở (0.5, 0.875) theo sơ đồ. Chưa kiểm trên bàn thật.
 * Round là cú phá đầu rack, vẽ tay như bài 74 và 95: chạm bi 1 thẳng rồi lùi về giữa bàn [suy luận], lực 8 m/s là lực Play dùng cho cú phá [đề xuất].
 */
const BREAK_PATH: GuideLine[] = [
  { kind: 'expectedCuePath', points: [{ x: 0.5, y: 0.875 }, { x: 0.5, y: 0.2725 }, { x: 0.5, y: 0.5 }] },
];

export const breakEvaluation = {
  id: '71',
  number: 71,
  title: 'Break Evaluation',
  subtitle: 'Three 9-ball breaks, five checks each. Score the median. Path drawn, not simulated.',
  category: 'patternPlay',
  skill: 'break',
  skillLabel: 'Break',
  difficulty: 3,
  objective:
    'Break three times. After each break tap Pass or Miss for the five checks in order: no scratch; no scratch and the cue ball touched no rail; no scratch and the cue ball stayed in the middle band, between the second diamonds from each end, the whole break; no scratch and a ball pocketed; no scratch and at least three balls pocketed or past the head string.',
  cueBall: { x: 0.5, y: 0.875 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.25 },
    { number: 2, x: 0.4775, y: 0.23051 },
    { number: 3, x: 0.5225, y: 0.23051 },
    { number: 4, x: 0.455, y: 0.21103 },
    { number: 9, x: 0.5, y: 0.21103 },
    { number: 5, x: 0.545, y: 0.21103 },
    { number: 6, x: 0.4775, y: 0.19154 },
    { number: 7, x: 0.5225, y: 0.19154 },
    { number: 8, x: 0.5, y: 0.17206 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'firm',
  allowedRails: 0,
  attemptCount: 15,
  passCondition: { kind: 'pocketed', required: 9 },
  tips: [
    'Rack tight with the 1 on the foot spot. Cue ball anywhere behind the head string.',
    'A scratch zeroes the whole break: every check starts with "no scratch".',
    'The original score is the median break: drop the best and worst, keep the middle one, out of 5. Three is the pass mark here.',
    'Hit the 1 square with a touch of topspin left at contact, and the cue ball squats in the middle without touching a rail.',
  ],
  mistakes: [
    'Cue ball flies back toward the head rail: it arrived with draw. Move the tip up toward center.',
  ],
  rounds: [
    { title: 'Break 1', spin: 'center', contactPoint: { x: 0, y: 0 }, speed: 8, why: 'Square hit on the 1 at break speed, center ball. A little roll left at contact squats the cue ball in the middle band.', guideLines: BREAK_PATH },
    { title: 'Break 2', spin: 'center', contactPoint: { x: 0, y: 0 }, speed: 8, why: 'Square hit on the 1 at break speed, center ball. A little roll left at contact squats the cue ball in the middle band.', guideLines: BREAK_PATH },
    { title: 'Break 3', spin: 'center', contactPoint: { x: 0, y: 0 }, speed: 8, why: 'Square hit on the 1 at break speed, center ball. A little roll left at contact squats the cue ball in the middle band.', guideLines: BREAK_PATH },
  ],
} satisfies PoolDrill;
