import type { PoolDrill } from '../types';

/**
 * Khối Stroke của Daily Workout: chỉ có bi cái, đánh thẳng lên băng cuối rồi về đầu cơ.
 * Không nằm trong `DRILLS`: thư viện là bài có bi mục tiêu. Bàn native chạy cú này qua `soloReplay`, đích băng do `stageState` dựng.
 * `diamonds` ở đây là khoảng cách bi cái → băng cuối: 2 (Short), 4 = center spot (Long), 6 = head spot (Very long).
 * Lực mỗi mức là ước lượng theo quãng đi-về 50", 100", 150" [suy luận], chưa chạy qua ShotPhysics.
 */
export const downAndBack = {
  id: 'stroke',
  number: 0,
  title: 'Down and Back',
  subtitle: 'Cue ball only. Shoot straight at the center diamond of the far rail.',
  category: 'shotMaking',
  skill: 'straightStroke',
  skillLabel: 'Stroke',
  difficulty: 1,
  objective: 'Place the cue ball on the spot shown, hit it dead center up the table. It should come straight back to your tip.',
  cueBall: { x: 0.5, y: 0.5 },
  objectBalls: [],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 10 },
  tips: ['Chalk mark the cue ball spot.', 'Freeze the cue after contact and watch where the ball returns.'],
  distances: [
    { diamonds: 2, cueBall: { x: 0.5, y: 0.25 }, recommendedContactPoint: { x: 0, y: 0 }, recommendedSpeed: 'soft' },
    { diamonds: 4, cueBall: { x: 0.5, y: 0.5 }, recommendedContactPoint: { x: 0, y: 0 }, recommendedSpeed: 'medium' },
    { diamonds: 6, cueBall: { x: 0.5, y: 0.75 }, recommendedContactPoint: { x: 0, y: 0 }, recommendedSpeed: 'firm' },
  ],
} satisfies PoolDrill;
