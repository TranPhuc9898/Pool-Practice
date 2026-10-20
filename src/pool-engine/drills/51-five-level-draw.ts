import type { PoolDrill } from '../types';

/**
 * Five-Level Draw, bài 51 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Bob Jewett
 * BD 01/2010 (https://www.sfbilliards.com/articles/2010.pdf). 5 level và mốc vị trí [nguồn]; toạ độ [suy luận]: bi 1
 * gần góc footLeft cách long rail trái 2.5", bi cái trên cùng đường dọc băng ở vị trí 1–7 cách nhau 1 diamond. Nguồn
 * chỉ nói "cú thẳng lỗ dọc băng"; engine nhắm tâm lỗ góc nên Play trên thế này thành cú cắt khoảng 34°.
 * Cách hiểu từng level là [suy luận] từ bảng tóm tắt: L1 vị trí 3 kéo về ít nhất 1 diamond tính từ bi 1; L2 vị trí 4
 * kéo về tới chỗ xuất phát; L3 vị trí 4 kéo quá chỗ xuất phát không quá 2 diamond; L4 bi cái sau head string, dừng
 * trong 1 diamond quanh head rail; L5 vị trí 4, ô 1 × 1 diamond quanh chỗ xuất phát. 3 cú mỗi level và ngưỡng 6/15
 * (qua L1, một phần L2, mốc F) là [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const fiveLevelDraw = {
  id: '51',
  number: 51,
  title: 'Five-Level Draw',
  subtitle: 'Straight shot down the rail. Draw farther and stop tighter each level.',
  category: 'cueBallControl',
  skill: 'drawDistance',
  skillLabel: 'Draw Distance',
  difficulty: 2,
  objective: 'Pot the 1-ball down the left rail and draw the cue ball into the zone for each level, three shots per level.',
  cueBall: { x: 0.05, y: 0.375 },
  objectBalls: [{ number: 1, x: 0.05, y: 0.037 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [
    { kind: 'ellipse', center: { x: 0.05, y: 0.28 }, radiusX: 0.05, radiusY: 0.19, label: '1+' },
    { kind: 'ellipse', center: { x: 0.05, y: 0.5 }, radiusX: 0.05, radiusY: 0.125, label: 'Start' },
    { kind: 'ellipse', center: { x: 0.05, y: 0.625 }, radiusX: 0.05, radiusY: 0.25, label: '≤2 past' },
    { kind: 'ellipse', center: { x: 0.05, y: 0.932 }, radiusX: 0.05, radiusY: 0.114, label: 'Head rail' },
    { kind: 'circle', center: { x: 0.125, y: 0.5 }, radius: 0.125, label: 'Box' },
  ],
  guideLines: [{ kind: 'objectBallPath', ball: 1, pocket: 'footLeft' }],
  recommendedContactPoint: { x: 0, y: -0.5 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 15,
  passCondition: { kind: 'inZone', required: 6 },
  tips: [
    'Work each level progressively: start close, and move the cue ball back one diamond each time you make it.',
    'Jewett grades it: level 1 from position 3 is beginner, level 2 from position 4 is advanced, level 3 past 4 is room champion.',
    'Level 4 is ball in hand behind the head string, drawing the length of the table back to the head rail.',
    'Level 5 is the pro test: stop in a one-diamond box more than half the time from position 4.',
  ],
  mistakes: [
    'Cue ball stops dead or rolls forward from far back: the draw wore off before contact. Hit lower, not harder.',
    'Draws back off the rail line: the tip was off the vertical axis. Check your tip before you add speed.',
    'Overshoots the start on level 3: you used power draw where a smooth stroke was enough.',
  ],
  rounds: [
    { title: 'Level 1 · Position 3', zone: 0, spin: 'draw', cueBall: { x: 0.05, y: 0.375 } },
    { title: 'Level 2 · Position 4', zone: 1, spin: 'draw', cueBall: { x: 0.05, y: 0.5 } },
    { title: 'Level 3 · Position 4', zone: 2, spin: 'draw', cueBall: { x: 0.05, y: 0.5 } },
    { title: 'Level 4 · Kitchen', zone: 3, spin: 'draw', cueBall: { x: 0.05, y: 0.875 } },
    { title: 'Level 5 · Position 4', zone: 4, spin: 'draw', cueBall: { x: 0.05, y: 0.5 } },
  ],
} satisfies PoolDrill;
