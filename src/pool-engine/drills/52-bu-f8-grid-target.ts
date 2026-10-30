import type { PoolDrill } from '../types';

/**
 * BU F8 Grid Target, bài 52 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Billiard
 * University Exam I F8 (https://billiarduniversity.org/documents/BU_Exam-I_Fundamentals.pdf). Luật, 5 ô, 4 cú mỗi ô,
 * tối đa 20 điểm [nguồn]; toạ độ bi và tâm ô đo từ hình [suy luận], sai số khoảng ±¼ diamond. Ô gốc 0.8 × 0.8 diamond,
 * ở đây vẽ thành vòng tròn bán kính 5" [suy luận]. Bi cái đặt tuỳ ý trong vùng giấy, chỗ trên bàn là ví dụ của research.
 * Spin từng ô là [đề xuất] từ tiếp tuyến của cú cắt khoảng 18°, chưa giải bằng engine. Ngưỡng E 10/20 [đề xuất].
 * Chưa kiểm trên bàn thật.
 */
// Mỗi round mang guide riêng thì app tách zone theo round, không thì round nào cũng đánh zone đầu.
const guides: PoolDrill['guideLines'] = [
  { kind: 'objectBallPath', ball: 1, pocket: 'headLeft' },
  { kind: 'ghostBall', ball: 1, pocket: 'headLeft' },
];

export const buF8GridTarget = {
  id: '52',
  number: 52,
  title: 'BU F8 Grid Target',
  subtitle: 'Same shot into the head corner. Send the cue ball to five different boxes. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'speedControl',
  skillLabel: 'Speed Control',
  difficulty: 3,
  objective: 'Pot the 1-ball in the near left corner and stop the cue ball in each of five targets, four shots per target.',
  cueBall: { x: 0.525, y: 0.812 },
  objectBalls: [{ number: 1, x: 0.275, y: 0.875 }],
  targetPocket: 'headLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.125, y: 0.75 }, radius: 0.1, label: 'T1' },
    { kind: 'circle', center: { x: 0.125, y: 0.25 }, radius: 0.1, label: 'T2' },
    { kind: 'circle', center: { x: 0.925, y: 0.25 }, radius: 0.1, label: 'T3' },
    { kind: 'circle', center: { x: 0.525, y: 0.5 }, radius: 0.1, label: 'T4' },
    { kind: 'circle', center: { x: 0.925, y: 0.75 }, radius: 0.1, label: 'T5' },
  ],
  guideLines: guides,
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 3,
  attemptCount: 20,
  passCondition: { kind: 'inZone', required: 10 },
  tips: [
    'Place the cue ball anywhere in the start area. Any route and any number of rails is fine.',
    'A ball touching the edge of the target counts. One point per shot, 20 max.',
    'Pick the route before you pick the speed. The stun line from this spot runs through T1 into the left rail.',
  ],
  mistakes: [
    'Right line, wrong distance: change speed only. Do not change tip and speed together.',
    'Cue ball hits the 1 and heads for the corner too: too much follow on a near-straight shot.',
  ],
  rounds: [
    {
      title: 'T1',
      zone: 0,
      spin: 'draw',
      guideLines: guides,
      contactPoint: { x: 0, y: -0.3 },
      speed: 1.58,
      rate: 33,
      why: 'Draw at 1.58 m/s, the cue ball stops 14" off contact in T1.',
    },
    {
      title: 'T2',
      zone: 1,
      spin: 'draw',
      guideLines: guides,
      contactPoint: { x: 0, y: -0.3 },
      speed: 3.44,
      rate: 2,
      why: 'Draw at 3.44 m/s, the cue ball runs one rail into T2.',
    },
    {
      title: 'T3',
      zone: 2,
      spin: 'draw',
      guideLines: guides,
      contactPoint: { x: 0, y: -0.5 },
      speed: 2.74,
      rate: 2,
      why: 'Full draw at 2.74 m/s, the cue ball runs two rails into T3.',
    },
    {
      title: 'T4',
      zone: 3,
      spin: 'draw',
      guideLines: guides,
      contactPoint: { x: 0, y: -0.5 },
      speed: 1.9,
      rate: 4,
      why: 'Full draw at 1.90 m/s, the cue ball stops 38" off contact in T4.',
    },
    {
      title: 'T5',
      zone: 4,
      spin: 'follow',
      guideLines: guides,
      contactPoint: { x: 0, y: 0.4 },
      speed: 1.64,
      rate: 19,
      why: 'Follow at 1.64 m/s, the cue ball runs two rails into T5.',
    },
  ],
} satisfies PoolDrill;
