import type { PoolDrill } from '../types';

/**
 * Nguồn: Fedor Gorst, bài tập của Tyler Styer https://www.facebook.com/share/r/1AZkaLF6mr/ (#29). Ý bài [nguồn]: năm bi dọc
 * băng dài, một bi cách băng ngắn chừng một bi; ăn một bi trong hàng, sang bi băng ngắn, bi đó vào thì đặt lại, rồi về bi
 * kế trong hàng. Khoảng cách 7.5" tới băng, chỗ đặt bi (0.25, 0.966) và chỗ đặt bi cái đầu [đề xuất]; cách 5" thì bi hàng
 * sang lỗ giữa dốc quá 60°, app chặn cú. Chín cú, lỗ, tip, lực, rate lấy từ `drill120()` của `scripts/position-harness/`:
 * beam rộng 40, mỗi cú phải là cú app cho đánh, để cú kế cắt không quá 50° và bi cái không dừng lên chỗ đặt bi 9. Bi
 * hàng 1, 3 đi lỗ giữa phải, 5, 7, 9 đi lỗ góc chân phải, bi chỗ đặt đi lỗ góc đầu trái. Bản gốc đặt lại một bi 9; app bắt
 * số tăng dần (luật 1) nên hàng mang số lẻ, mỗi lần đặt lại là bi chẵn kế tiếp (2, 4, 6, 8), bàn và cú giữ nguyên. Cú bi 1, 5, 7, 9 sửa lại tip/lực
 * và zone 1 dời theo chỗ dừng (quét tip × lực trên ShotPhysics, 2026-10-29) để bi cái không quá 2 băng (luật 3); các cú
 * này bỏ `rate` vì số cũ không còn đúng. Ngưỡng 7/9 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const railRowReturn = {
  id: '120',
  number: 120,
  title: 'Rail Row Return',
  subtitle: 'Odd balls along the right rail, even balls one at a time on the spot near the head rail. Rail, spot, rail, in number order. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'speedControl',
  skillLabel: 'Speed Control',
  difficulty: 5,
  objective: 'Pot 1 to 9 in order: odd balls up the rail row, each even ball from the spot near the head rail. The next even ball goes on the spot after each pot. Ball in hand at the marked spot each shot, so a miss does not end the round.',
  cueBall: { x: 0.7, y: 0.72 },
  objectBalls: [
    { number: 1, x: 0.85, y: 0.55 },
    { number: 3, x: 0.85, y: 0.62 },
    { number: 5, x: 0.85, y: 0.69 },
    { number: 7, x: 0.85, y: 0.76 },
    { number: 9, x: 0.85, y: 0.83 },
    { number: 2, x: 0.25, y: 0.966 },
  ],
  targetPocket: 'sideRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.5614, y: 0.8048 }, radius: 0.08, label: '1' },
    { kind: 'circle', center: { x: 0.339, y: 0.767 }, radius: 0.08, label: '2' },
    { kind: 'circle', center: { x: 0.562, y: 0.6699 }, radius: 0.08, label: '3' },
    { kind: 'circle', center: { x: 0.3036, y: 0.9359 }, radius: 0.08, label: '4' },
    { kind: 'circle', center: { x: 0.6968, y: 0.5396 }, radius: 0.08, label: '5' },
    { kind: 'circle', center: { x: 0.6075, y: 0.8785 }, radius: 0.08, label: '6' },
    { kind: 'circle', center: { x: 0.7698, y: 0.8654 }, radius: 0.08, label: '7' },
    { kind: 'circle', center: { x: 0.5719, y: 0.9809 }, radius: 0.08, label: '8' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 9,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    'Every shot has two jobs: pot this ball and leave an angle on the next one. Pick the spot before you aim.',
    'Coming back to the row, stay above the next ball so the cut runs down the rail, not into it.',
    'The spot shots are the easy ones. Use their speed to set up the long rail cut, not to show off draw.',
  ],
  mistakes: [
    'Landing straight in line with the row ball: no angle to come back up for the spot ball.',
    'Stopping on the spot where the next even ball goes.',
    'Hitting the long rail cuts too thin, so the row ball rattles in the jaws.',
  ],
  rounds: [
    {
      title: 'Ball 1',
      zone: 0,
      spin: 'center',
      cueBall: { x: 0.7, y: 0.72 },
      objectBalls: [{ number: 1, x: 0.85, y: 0.55 }, { number: 3, x: 0.85, y: 0.62 }, { number: 5, x: 0.85, y: 0.69 }, { number: 7, x: 0.85, y: 0.76 }, { number: 9, x: 0.85, y: 0.83 }, { number: 2, x: 0.25, y: 0.966 }],
      contactPoint: { x: 0, y: -0.1 },
      speed: 2.85,

      why: '37° cut into the right side pocket. Center ball sends the cue ball to the circle for a 41° cut on the 2.',
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'sideRight' },
        { kind: 'ghostBall', ball: 1, pocket: 'sideRight' },
      ],
    },
    {
      title: 'Ball 2 on the spot',
      zone: 1,
      spin: 'draw',
      cueBall: { x: 0.5614, y: 0.8048 },
      objectBalls: [{ number: 3, x: 0.85, y: 0.62 }, { number: 5, x: 0.85, y: 0.69 }, { number: 7, x: 0.85, y: 0.76 }, { number: 9, x: 0.85, y: 0.83 }, { number: 2, x: 0.25, y: 0.966 }],
      contactPoint: { x: 0, y: -0.4 },
      speed: 1.5,

      why: '41° cut into the head left corner. Draw sends the cue ball to the circle for a 30° cut on the 3.',
      guideLines: [
        { kind: 'objectBallPath', ball: 2, pocket: 'headLeft' },
        { kind: 'ghostBall', ball: 2, pocket: 'headLeft' },
      ],
    },
    {
      title: 'Ball 3',
      zone: 2,
      spin: 'center',
      cueBall: { x: 0.339, y: 0.767 },
      objectBalls: [{ number: 3, x: 0.85, y: 0.62 }, { number: 5, x: 0.85, y: 0.69 }, { number: 7, x: 0.85, y: 0.76 }, { number: 9, x: 0.85, y: 0.83 }, { number: 4, x: 0.25, y: 0.966 }],
      contactPoint: { x: 0, y: 0 },
      speed: 1.2,
      rate: 30,
      why: '30° cut into the right side pocket. Center ball sends the cue ball to the circle for a 50° cut on the 4.',
      guideLines: [
        { kind: 'objectBallPath', ball: 3, pocket: 'sideRight' },
        { kind: 'ghostBall', ball: 3, pocket: 'sideRight' },
      ],
    },
    {
      title: 'Ball 4 on the spot',
      zone: 3,
      spin: 'center',
      cueBall: { x: 0.562, y: 0.6699 },
      objectBalls: [{ number: 5, x: 0.85, y: 0.69 }, { number: 7, x: 0.85, y: 0.76 }, { number: 9, x: 0.85, y: 0.83 }, { number: 4, x: 0.25, y: 0.966 }],
      contactPoint: { x: 0, y: 0 },
      speed: 2.55,
      rate: 30,
      why: '50° cut into the head left corner. Center ball sends the cue ball to the circle for a 44° cut on the 5.',
      guideLines: [
        { kind: 'objectBallPath', ball: 4, pocket: 'headLeft' },
        { kind: 'ghostBall', ball: 4, pocket: 'headLeft' },
      ],
    },
    {
      title: 'Ball 5',
      zone: 4,
      spin: 'center',
      cueBall: { x: 0.3036, y: 0.9359 },
      objectBalls: [{ number: 5, x: 0.85, y: 0.69 }, { number: 7, x: 0.85, y: 0.76 }, { number: 9, x: 0.85, y: 0.83 }, { number: 6, x: 0.25, y: 0.966 }],
      contactPoint: { x: 0, y: 0.05 },
      speed: 1.75,

      why: '44° cut into the foot right corner. Center ball sends the cue ball to the circle for a 49° cut on the 6.',
      guideLines: [
        { kind: 'objectBallPath', ball: 5, pocket: 'footRight' },
        { kind: 'ghostBall', ball: 5, pocket: 'footRight' },
      ],
    },
    {
      title: 'Ball 6 on the spot',
      zone: 5,
      spin: 'draw',
      cueBall: { x: 0.6968, y: 0.5396 },
      objectBalls: [{ number: 7, x: 0.85, y: 0.76 }, { number: 9, x: 0.85, y: 0.83 }, { number: 6, x: 0.25, y: 0.966 }],
      contactPoint: { x: 0, y: -0.2 },
      speed: 3,
      rate: 12,
      why: '49° cut into the head left corner. Light draw sends the cue ball to the circle for a 45° cut on the 7.',
      guideLines: [
        { kind: 'objectBallPath', ball: 6, pocket: 'headLeft' },
        { kind: 'ghostBall', ball: 6, pocket: 'headLeft' },
      ],
    },
    {
      title: 'Ball 7',
      zone: 6,
      spin: 'draw',
      cueBall: { x: 0.6075, y: 0.8785 },
      objectBalls: [{ number: 7, x: 0.85, y: 0.76 }, { number: 9, x: 0.85, y: 0.83 }, { number: 8, x: 0.25, y: 0.966 }],
      contactPoint: { x: 0, y: -0.25 },
      speed: 2.2,

      why: '45° cut into the foot right corner. Light draw sends the cue ball to the circle for a 6° cut on the 8.',
      guideLines: [
        { kind: 'objectBallPath', ball: 7, pocket: 'footRight' },
        { kind: 'ghostBall', ball: 7, pocket: 'footRight' },
      ],
    },
    {
      title: 'Ball 8 on the spot',
      zone: 7,
      spin: 'draw',
      cueBall: { x: 0.7698, y: 0.8654 },
      objectBalls: [{ number: 9, x: 0.85, y: 0.83 }, { number: 8, x: 0.25, y: 0.966 }],
      contactPoint: { x: 0, y: -0.4 },
      speed: 2.55,
      rate: 38,
      why: '6° cut into the head left corner. Draw sends the cue ball to the circle for a 42° cut on the 9.',
      guideLines: [
        { kind: 'objectBallPath', ball: 8, pocket: 'headLeft' },
        { kind: 'ghostBall', ball: 8, pocket: 'headLeft' },
      ],
    },
    {
      title: 'Ball 9',
      spin: 'draw',
      cueBall: { x: 0.5719, y: 0.9809 },
      objectBalls: [{ number: 9, x: 0.85, y: 0.83 }, { number: 10, x: 0.25, y: 0.966 }],
      contactPoint: { x: 0, y: -0.6 },
      speed: 2,

      why: '42° cut into the foot right corner, last ball of the row. Light draw at firm speed keeps the cue ball off the rails and out of the pockets.',
      guideLines: [
        { kind: 'objectBallPath', ball: 9, pocket: 'footRight' },
        { kind: 'ghostBall', ball: 9, pocket: 'footRight' },
      ],
    },
  ],
} satisfies PoolDrill;
