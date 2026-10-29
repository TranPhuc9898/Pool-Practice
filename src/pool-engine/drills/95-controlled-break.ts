import type { DrillRound, GuideLine, PoolDrill } from '../types';

/**
 * Break 9 bi đưa bi cái dừng trong vòng giữa bàn, mười lần. Tự soạn cho giai đoạn 6 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. Rack dùng lại đúng
 * toạ độ rack của drill 71. Engine chưa mô phỏng break nên đường bi cái vẽ tay: chạm bi 1 thẳng, lùi về giữa bàn
 * [suy luận]. Lực 8 m/s là tầm break của người chơi khá, vòng bán kính 0.1 và ngưỡng 6/10 [đề xuất]. Giai đoạn 6 qua
 * `OVERRIDE` trong `stages.ts`. Chưa kiểm trên bàn thật.
 */
const PATH: GuideLine[] = [
  { kind: 'expectedCuePath', points: [{ x: 0.5, y: 0.875 }, { x: 0.5, y: 0.2725 }, { x: 0.5, y: 0.5 }] },
];

const BREAK: Omit<DrillRound, 'title'> = {
  spin: 'stun',
  contactPoint: { x: 0, y: -0.15 },
  speed: 8,
  zone: 0,
  why: 'Square hit on the 1 with no spin left at contact: the cue ball stops near the center instead of flying back.',
  guideLines: PATH,
};

export const controlledBreak = {
  id: '95',
  number: 95,
  title: 'Controlled Break',
  subtitle: 'Ten 9-ball breaks. Park the cue ball in the center circle. Path drawn, not simulated.',
  category: 'patternPlay',
  skill: 'break',
  skillLabel: 'Break',
  difficulty: 5,
  objective: 'Break ten times from the head string. Tap Pass when there is no scratch and the cue ball stops inside the center circle.',
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
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.5, y: 0.5 }, radius: 0.1, label: 'Cue' }],
  guideLines: PATH,
  recommendedContactPoint: { x: 0, y: -0.15 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'firm',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 6 },
  tips: [
    'Speed you can control beats top speed. Back off until the cue ball stops in the circle, then add a little.',
    'Cue ball flying back toward you: it arrived with draw. Aim the tip a touch higher.',
    'Cue ball following into the rack: too much topspin left. Lower the tip a touch.',
  ],
  mistakes: ['Lifting up during the break: the hit drifts off center and the cue ball heads for a side rail.'],
  rounds: Array.from({ length: 10 }, (_, i) => ({ title: `Break ${i + 1}`, ...BREAK })),
} satisfies PoolDrill;
