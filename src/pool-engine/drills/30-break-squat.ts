import type { PoolDrill } from '../types';

/**
 * Break: Squat, clip #2 của `docs/research/pool-9ball/09-break-techniques.md`, BU Part X và Dr. Dave FAQ (VERIFIED: bi cái
 * đứng giữa bàn khi còn chút topspin lúc tới bi 1, đánh trô thì bật lại). Rack khít, bi 1 trên foot spot, đỉnh quay về
 * head, cùng rack với `drill30()` trong `scripts/position-harness/main.swift`; bi cái (0.5, 0.78) và zone giữa bàn 3.5"
 * cũng lấy từ đó. Harness chạy tipY −0.2 ở 5.7 m/s, rate 4/45, vượt vMax 4.5 của Play, nên không có Play. Tip hiện cú
 * giữa bi theo research, không theo harness: engine chưa hiệu chỉnh khối lượng hiệu dụng của rack (DISPUTED ⅔ hay 2×).
 */
export const breakSquat = {
  id: '30',
  number: 30,
  title: 'Break: Squat',
  subtitle: '1-ball on the spot. Break straight in and park the cue ball in the middle of the table.',
  category: 'patternPlay',
  skill: 'break',
  skillLabel: 'Break',
  difficulty: 3,
  objective: 'Break the rack head on and stop the cue ball within 3.5" of the table center.',
  cueBall: { x: 0.5, y: 0.78 },
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
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.5, y: 0.5 }, radius: 0.07, label: 'Center' }],
  guideLines: [],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'firm',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 5 },
  tips: [
    'A square hit on the 1-ball matters more than speed.',
    'The cue ball should still carry a little topspin when it reaches the 1. Then it squats and stays mid-table.',
    'Rack tight with the 1 on the spot and the wing balls often drop in the corners.',
  ],
  mistakes: [
    'Cue ball flies back toward the head rail: you hit it with draw or stun. Move the tip up toward center.',
  ],
} satisfies PoolDrill;
