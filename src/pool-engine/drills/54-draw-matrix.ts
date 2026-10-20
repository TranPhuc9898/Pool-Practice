import type { PoolDrill } from '../types';

/**
 * Draw Matrix, bài 54 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Billiard University
 * Exam VII (https://billiarduniversity.org/documents/BU_Exam-VII_Draw_Matrix_Drill.pdf). Luật [nguồn]: bi mục tiêu
 * trên foot string cắt nhẹ vào footLeft, bi cái ở 4 chỗ, kéo về 1–4 diamond tính từ bi mục tiêu, tâm bi cái dừng trong
 * ½ diamond quanh đích và cách long rail không quá 1 diamond. Toạ độ đo từ hình [suy luận], sai số khoảng ±¼ diamond;
 * góc cắt theo ghost ball khoảng 17°, research ghi 14°. Bản gốc 3 cú mỗi ô (48 cú); ở đây 1 cú mỗi ô (16 cú) cho vừa
 * trần 30 cú, ngưỡng 10/16 giữ mốc C 60/100 [đề xuất]. Vòng đích bán kính ½ diamond tâm W = 0.5 nằm gọn trong dải
 * 1 diamond sát băng. Chưa kiểm trên bàn thật.
 */
export const drawMatrix = {
  id: '54',
  number: 54,
  title: 'Draw Matrix',
  subtitle: 'Four cue ball spots, four draw distances. Stop within half a diamond.',
  category: 'cueBallControl',
  skill: 'draw',
  skillLabel: 'Draw',
  difficulty: 4,
  objective: 'Pot the 1-ball in the far left corner and draw back 1 to 4 diamonds from it, from four cue ball spots.',
  cueBall: { x: 0.125, y: 0.375 },
  objectBalls: [{ number: 1, x: 0.125, y: 0.25 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.125, y: 0.375 }, radius: 0.125, label: '1' },
    { kind: 'circle', center: { x: 0.125, y: 0.5 }, radius: 0.125, label: '2' },
    { kind: 'circle', center: { x: 0.125, y: 0.625 }, radius: 0.125, label: '3' },
    { kind: 'circle', center: { x: 0.125, y: 0.75 }, radius: 0.125, label: '4' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.4 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 16,
  passCondition: { kind: 'inZone', required: 10 },
  tips: [
    'Distance counts back from the 1-ball, not from where the cue ball started.',
    'The cue ball center must stop within half a diamond of the target and no more than a diamond off the left rail.',
    'From the far spots, short draw needs a soft, low hit. Long draw from close needs a smooth, full stroke.',
    'BU shoots each box three times, 48 shots, and scores passes × 25/12 out of 100.',
  ],
  mistakes: [
    'Cue ball ends more than a diamond off the rail: the 17° cut pulls the draw sideways. More draw, not more speed, keeps it closer to the line.',
    'Draw dies from the far spots: the backspin wore off on the way. Lower tip before more speed.',
  ],
  rounds: [
    { title: 'Cue A · 1 diamond', zone: 0, spin: 'draw', cueBall: { x: 0.125, y: 0.375 } },
    { title: 'Cue A · 2 diamonds', zone: 1, spin: 'draw', cueBall: { x: 0.125, y: 0.375 } },
    { title: 'Cue A · 3 diamonds', zone: 2, spin: 'draw', cueBall: { x: 0.125, y: 0.375 } },
    { title: 'Cue A · 4 diamonds', zone: 3, spin: 'draw', cueBall: { x: 0.125, y: 0.375 } },
    { title: 'Cue B · 1 diamond', zone: 0, spin: 'draw', cueBall: { x: 0.125, y: 0.5 } },
    { title: 'Cue B · 2 diamonds', zone: 1, spin: 'draw', cueBall: { x: 0.125, y: 0.5 } },
    { title: 'Cue B · 3 diamonds', zone: 2, spin: 'draw', cueBall: { x: 0.125, y: 0.5 } },
    { title: 'Cue B · 4 diamonds', zone: 3, spin: 'draw', cueBall: { x: 0.125, y: 0.5 } },
    { title: 'Cue C · 1 diamond', zone: 0, spin: 'draw', cueBall: { x: 0.125, y: 0.625 } },
    { title: 'Cue C · 2 diamonds', zone: 1, spin: 'draw', cueBall: { x: 0.125, y: 0.625 } },
    { title: 'Cue C · 3 diamonds', zone: 2, spin: 'draw', cueBall: { x: 0.125, y: 0.625 } },
    { title: 'Cue C · 4 diamonds', zone: 3, spin: 'draw', cueBall: { x: 0.125, y: 0.625 } },
    { title: 'Cue D · 1 diamond', zone: 0, spin: 'draw', cueBall: { x: 0.125, y: 0.75 } },
    { title: 'Cue D · 2 diamonds', zone: 1, spin: 'draw', cueBall: { x: 0.125, y: 0.75 } },
    { title: 'Cue D · 3 diamonds', zone: 2, spin: 'draw', cueBall: { x: 0.125, y: 0.75 } },
    { title: 'Cue D · 4 diamonds', zone: 3, spin: 'draw', cueBall: { x: 0.125, y: 0.75 } },
  ],
} satisfies PoolDrill;
