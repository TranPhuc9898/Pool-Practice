import type { PoolDrill } from '../types';

/**
 * BU F6 Ball Pocketing, bài 39 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, Billiard University Exam I
 * F6 (https://billiarduniversity.org/documents/BU_Exam-I_Fundamentals.pdf). Danh sách 10 cú (chỗ bi cái, chỗ bi, lỗ) là
 * [nguồn]; toạ độ đo từ hình [suy luận]. Mỗi cú chỉ một bi trên bàn, nên round nào cũng dùng bi 1. Điểm = số cú vào,
 * scratch là hỏng [nguồn]; ngưỡng 7/10 cho hạng F là [đề xuất]. Cú 4 và 9 cắt khoảng 68° vào lỗ giữa, cú 5 và 10 thẳng
 * lỗ. Chưa kiểm trên bàn thật.
 */
export const buF6BallPocketing = {
  id: '39',
  number: 39,
  title: 'BU F6 Ball Pocketing',
  subtitle: 'Ten set shots into side and corner pockets from two cue ball spots.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Cut Angle',
  difficulty: 2,
  objective: 'Ten different shots, one try each. A scratch counts as a miss. Pot 7 of 10.',
  cueBall: { x: 0.25, y: 0.75 },
  objectBalls: [{ number: 1, x: 0.25, y: 0.625 }],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    'Shots 1–5 from the left spot, 6–10 from the right. The second half mirrors the first.',
    'Shots 5 and 10 are dead straight. Shots 4 and 9 are the thin cuts into the side.',
    'Watch the cue ball on the side pocket cuts. A scratch is a miss.',
  ],
  mistakes: [
    'Thin side pocket cuts rattle: too much speed. A side pocket takes a slow ball at an angle better than a fast one.',
    'Scratch in the corner on the straight shots: center ball rolls through. Hit a touch below center to stop it.',
  ],
  rounds: [
    {
      title: 'Shot 1 · Left side',
      spin: 'center',
      cueBall: { x: 0.25, y: 0.75 },
      objectBalls: [{ number: 1, x: 0.25, y: 0.625 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
      ],
    },
    {
      title: 'Shot 2 · Top left',
      spin: 'center',
      cueBall: { x: 0.25, y: 0.75 },
      objectBalls: [{ number: 1, x: 0.25, y: 0.625 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
      ],
    },
    {
      title: 'Shot 3 · Top right',
      spin: 'center',
      cueBall: { x: 0.25, y: 0.75 },
      objectBalls: [{ number: 1, x: 0.5, y: 0.25 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
        { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
      ],
    },
    {
      title: 'Shot 4 · Right side',
      spin: 'center',
      cueBall: { x: 0.25, y: 0.75 },
      objectBalls: [{ number: 1, x: 0.5, y: 0.5 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'sideRight' },
        { kind: 'ghostBall', ball: 1, pocket: 'sideRight' },
      ],
    },
    {
      title: 'Shot 5 · Top right',
      spin: 'center',
      cueBall: { x: 0.25, y: 0.75 },
      objectBalls: [{ number: 1, x: 0.5, y: 0.5 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
        { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
      ],
    },
    {
      title: 'Shot 6 · Right side',
      spin: 'center',
      cueBall: { x: 0.75, y: 0.75 },
      objectBalls: [{ number: 1, x: 0.75, y: 0.625 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'sideRight' },
        { kind: 'ghostBall', ball: 1, pocket: 'sideRight' },
      ],
    },
    {
      title: 'Shot 7 · Top right',
      spin: 'center',
      cueBall: { x: 0.75, y: 0.75 },
      objectBalls: [{ number: 1, x: 0.75, y: 0.625 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
        { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
      ],
    },
    {
      title: 'Shot 8 · Top left',
      spin: 'center',
      cueBall: { x: 0.75, y: 0.75 },
      objectBalls: [{ number: 1, x: 0.5, y: 0.25 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
      ],
    },
    {
      title: 'Shot 9 · Left side',
      spin: 'center',
      cueBall: { x: 0.75, y: 0.75 },
      objectBalls: [{ number: 1, x: 0.5, y: 0.5 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
      ],
    },
    {
      title: 'Shot 10 · Top left',
      spin: 'center',
      cueBall: { x: 0.75, y: 0.75 },
      objectBalls: [{ number: 1, x: 0.5, y: 0.5 }],
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
      ],
    },
  ],
} satisfies PoolDrill;
