import type { PoolDrill } from '../types';

/**
 * Follow Matrix, bài 53 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Billiard University
 * Exam VIII (https://billiarduniversity.org/documents/BU_Exam-VIII_Follow_Matrix_Drill.pdf). Luật [nguồn]: 5 chỗ bi
 * mục tiêu × 5 cự ly follow 1–5 diamond, quãng sau khi bật foot rail vẫn tính, tâm bi cái dừng trong ½ diamond quanh
 * đích. Toạ độ đo từ hình [suy luận], sai số khoảng ±¼ diamond. Bản gốc 3 cú mỗi ô (75 cú); ở đây 1 cú mỗi ô (25 cú)
 * cho vừa trần 30 cú, ngưỡng 10/25 giữ mốc D 40/100 [đề xuất]. Đích tính theo L, gập ở foot rail: L > 8 thì 16 − L, L = 8
 * đặt ở L 7.75 vì tâm bi không chạm được băng. Cột đích giữ W = 0.5 như bi mục tiêu [suy luận]; bi cái thật lệch dần
 * theo đường vào lỗ. Spot 4 · 2 và Spot 5 · 1 có vòng Rail riêng dời ra W ≈ 1.1: bi gần foot rail, bi cái theo thẳng vào
 * góc footLeft và rơi lỗ trước khi tới vòng Rail W = 0.5 [engine]. Chín ô (Spot 1 · 2–5, Spot 2 · 2, Spot 4 · 5, Spot 5 · 3–5) có `cueBall` riêng, quét lại 2026-10-29
 * trên ShotPhysics: bi cái ở x 0.2 trôi sang băng trái rồi chạm ≥ 2 băng, quá `allowedRails` 1. Dời bi cái theo trục x
 * (y giữ 0.75) đến chỗ có cú ≤ 1 băng dừng trong vòng [engine]; lệch layout BU. Tip mọi ô ≤ 0.6 (`ShotPhysics.tipMax`, quá là
 * miscue, Play không đánh); Spot 1 · 4–5 dời bi cái về x 0.10 và 0.06.
 * Chưa kiểm trên bàn thật.
 */
export const followMatrix = {
  id: '53',
  number: 53,
  title: 'Follow Matrix',
  subtitle: 'Five ball spots, five follow distances. One diamond more each shot.',
  category: 'cueBallControl',
  skill: 'follow',
  skillLabel: 'Follow',
  difficulty: 3,
  objective: 'Pot the 1-ball in the far left corner and follow 1 to 5 diamonds past it, from five spots.',
  cueBall: { x: 0.2, y: 0.75 },
  objectBalls: [{ number: 1, x: 0.125, y: 0.625 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.125, y: 0.5 }, radius: 0.125, label: 'L4' },
    { kind: 'circle', center: { x: 0.125, y: 0.375 }, radius: 0.125, label: 'L5' },
    { kind: 'circle', center: { x: 0.125, y: 0.25 }, radius: 0.125, label: 'L6' },
    { kind: 'circle', center: { x: 0.125, y: 0.125 }, radius: 0.125, label: 'L7' },
    { kind: 'circle', center: { x: 0.125, y: 0.03125 }, radius: 0.125, label: 'Rail' },
    { kind: 'circle', center: { x: 0.27, y: 0.06 }, radius: 0.125, label: 'Rail' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 25,
  passCondition: { kind: 'inZone', required: 10 },
  tips: [
    'Distance counts from the 1-ball. Past the foot rail, the distance coming back still counts.',
    'The cue ball center must stop within half a diamond of the target. Zone labels are diamonds from the head rail.',
    'Keep the tip height and change only speed between distances.',
    'BU shoots each box three times, 75 shots, and scores passes × 4/3 out of 100.',
  ],
  mistakes: [
    'Short on the long distances: the follow is still building when it hits the 1. Smooth stroke, a bit more speed.',
    'Long on the one-diamond shots: the cue ball rolls further than you think. Softer, same tip.',
  ],
  rounds: [
    { title: 'Spot 1 · 1 diamond', zone: 0, spin: 'follow', contactPoint: { x: 0, y: 0.4 }, speed: 1, objectBalls: [{ number: 1, x: 0.125, y: 0.625 }] },
    { title: 'Spot 1 · 2 diamonds', zone: 1, spin: 'follow', cueBall: { x: 0.17, y: 0.75 }, contactPoint: { x: 0, y: 0.55 }, speed: 1.25, objectBalls: [{ number: 1, x: 0.125, y: 0.625 }] },
    { title: 'Spot 1 · 3 diamonds', zone: 2, spin: 'follow', cueBall: { x: 0.17, y: 0.75 }, contactPoint: { x: 0, y: 0.2 }, speed: 1.9, objectBalls: [{ number: 1, x: 0.125, y: 0.625 }] },
    { title: 'Spot 1 · 4 diamonds', zone: 3, spin: 'follow', cueBall: { x: 0.1, y: 0.75 }, contactPoint: { x: 0, y: 0.1 }, speed: 3.75, objectBalls: [{ number: 1, x: 0.125, y: 0.625 }] },
    { title: 'Spot 1 · 5 diamonds', zone: 4, spin: 'follow', cueBall: { x: 0.06, y: 0.75 }, contactPoint: { x: 0, y: 0.25 }, speed: 1.9, objectBalls: [{ number: 1, x: 0.125, y: 0.625 }] },
    { title: 'Spot 2 · 1 diamond', zone: 1, spin: 'follow', contactPoint: { x: 0, y: 0.4 }, speed: 1.05, objectBalls: [{ number: 1, x: 0.125, y: 0.5 }] },
    { title: 'Spot 2 · 2 diamonds', zone: 2, spin: 'follow', cueBall: { x: 0.17, y: 0.75 }, contactPoint: { x: 0, y: 0.6 }, speed: 1.15, objectBalls: [{ number: 1, x: 0.125, y: 0.5 }] },
    { title: 'Spot 2 · 3 diamonds', zone: 3, spin: 'follow', contactPoint: { x: 0, y: 0.4 }, speed: 1.65, objectBalls: [{ number: 1, x: 0.125, y: 0.5 }] },
    { title: 'Spot 2 · 4 diamonds', zone: 4, spin: 'follow', objectBalls: [{ number: 1, x: 0.125, y: 0.5 }] },
    { title: 'Spot 2 · 5 diamonds', zone: 3, spin: 'follow', contactPoint: { x: 0, y: 0.4 }, speed: 1.65, objectBalls: [{ number: 1, x: 0.125, y: 0.5 }] },
    { title: 'Spot 3 · 1 diamond', zone: 2, spin: 'follow', contactPoint: { x: 0, y: 0.4 }, speed: 1.05, objectBalls: [{ number: 1, x: 0.125, y: 0.375 }] },
    { title: 'Spot 3 · 2 diamonds', zone: 3, spin: 'follow', objectBalls: [{ number: 1, x: 0.125, y: 0.375 }] },
    { title: 'Spot 3 · 3 diamonds', zone: 4, spin: 'follow', contactPoint: { x: 0, y: 0.4 }, speed: 1.6, objectBalls: [{ number: 1, x: 0.125, y: 0.375 }] },
    { title: 'Spot 3 · 4 diamonds', zone: 3, spin: 'follow', objectBalls: [{ number: 1, x: 0.125, y: 0.375 }] },
    { title: 'Spot 3 · 5 diamonds', zone: 2, spin: 'follow', contactPoint: { x: 0, y: 0.4 }, speed: 1.05, objectBalls: [{ number: 1, x: 0.125, y: 0.375 }] },
    { title: 'Spot 4 · 1 diamond', zone: 3, spin: 'follow', contactPoint: { x: 0, y: 0.45 }, speed: 0.9, objectBalls: [{ number: 1, x: 0.125, y: 0.25 }] },
    { title: 'Spot 4 · 2 diamonds', zone: 5, spin: 'follow', contactPoint: { x: 0, y: 0.2 }, speed: 1.3, objectBalls: [{ number: 1, x: 0.125, y: 0.25 }] },
    { title: 'Spot 4 · 3 diamonds', zone: 3, spin: 'follow', contactPoint: { x: 0, y: 0.45 }, speed: 0.9, objectBalls: [{ number: 1, x: 0.125, y: 0.25 }] },
    { title: 'Spot 4 · 4 diamonds', zone: 2, spin: 'follow', contactPoint: { x: 0, y: 0.5 }, speed: 0.65, objectBalls: [{ number: 1, x: 0.125, y: 0.25 }] },
    { title: 'Spot 4 · 5 diamonds', zone: 1, spin: 'follow', cueBall: { x: 0.32, y: 0.75 }, contactPoint: { x: 0, y: 0.35 }, speed: 2.3, objectBalls: [{ number: 1, x: 0.125, y: 0.25 }] },
    { title: 'Spot 5 · 1 diamond', zone: 5, spin: 'follow', contactPoint: { x: 0, y: 0.15 }, speed: 0.85, objectBalls: [{ number: 1, x: 0.125, y: 0.125 }] },
    { title: 'Spot 5 · 2 diamonds', zone: 3, spin: 'follow', contactPoint: { x: 0, y: 0.15 }, speed: 0.8, objectBalls: [{ number: 1, x: 0.125, y: 0.125 }] },
    { title: 'Spot 5 · 3 diamonds', zone: 2, spin: 'follow', cueBall: { x: 0.54, y: 0.75 }, contactPoint: { x: 0, y: 0.5 }, speed: 1.55, objectBalls: [{ number: 1, x: 0.125, y: 0.125 }] },
    { title: 'Spot 5 · 4 diamonds', zone: 1, spin: 'follow', cueBall: { x: 0.54, y: 0.75 }, contactPoint: { x: 0, y: 0.15 }, speed: 2.3, objectBalls: [{ number: 1, x: 0.125, y: 0.125 }] },
    { title: 'Spot 5 · 5 diamonds', zone: 0, spin: 'follow', cueBall: { x: 0.54, y: 0.75 }, contactPoint: { x: 0, y: 0.6 }, speed: 1.85, objectBalls: [{ number: 1, x: 0.125, y: 0.125 }] },
  ],
} satisfies PoolDrill;
