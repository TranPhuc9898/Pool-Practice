import type { PoolDrill } from '../types';

/**
 * Push-out sau break 9 bi: bi 5 chắn bi 1, đẩy bi cái tới chỗ cắt dài và mỏng mà đối thủ khó nhận; round 2 tự nhận lại
 * thế đó và cắt bi 1 vào footLeft. Tự soạn cho giai đoạn 6 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. App không chấm
 * luật push-out nên người chơi tự chấm [suy luận]. Vùng push ở (0.15, 0.75), lực 0.46 và round 2 qua audit engine (push
 * không chạm bi, bi 1 vào footLeft). Vùng bán kính 0.06 và ngưỡng 5/8 [đề xuất]. Giai đoạn 6 qua `OVERRIDE` trong `stages.ts`. Chưa kiểm trên bàn thật.
 */
export const pushOutChoice = {
  id: '94',
  number: 94,
  title: 'Push-Out Choice',
  subtitle: 'After the break, push to a shot your opponent should pass. Then take it yourself. Path drawn, not simulated.',
  category: 'patternPlay',
  skill: 'safety',
  skillLabel: 'Safety',
  difficulty: 5,
  objective:
    'Round 1: the 5 blocks the 1. Push the cue ball softly into the circle, leaving a long thin cut on the 1. Round 2: from the circle, cut the 1 into the foot left corner. Four tries each.',
  cueBall: { x: 0.5, y: 0.6 },
  objectBalls: [
    { number: 1, x: 0.15, y: 0.15 },
    { number: 5, x: 0.35, y: 0.38 },
    { number: 9, x: 0.6, y: 0.3 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.15, y: 0.75 }, radius: 0.06, label: 'Push' }],
  guideLines: [
    { kind: 'expectedCuePath', points: [{ x: 0.5, y: 0.6 }, { x: 0.15, y: 0.75 }] },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 8,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: [
    'A good push leaves a shot that is makeable but low percentage, so either answer is uncomfortable for your opponent.',
    'Round 1 passes when the cue ball stops in the circle. Round 2 passes when the 1 drops.',
  ],
  mistakes: ['Pushing to a shot you would happily take yourself: your opponent takes it too.'],
  rounds: [
    {
      title: 'Push out',
      spin: 'center',
      speed: 0.46,
      zone: 0,
      why: 'From the circle the 1 is a 45° cut down the whole left rail: hard to refuse, hard to make.',
    },
    {
      title: 'Take the shot',
      spin: 'stun',
      speed: 1.2,
      why: 'Long cut along the left side. Stun keeps the cue ball near the middle after contact.',
      cueBall: { x: 0.15, y: 0.75 },
      contactPoint: { x: 0, y: 0 },
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
      ],
    },
  ],
} satisfies PoolDrill;
