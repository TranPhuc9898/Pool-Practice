import type { PoolDrill } from '../types';

/**
 * Jewett Progressive Cut, bài 41 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, Bob Jewett, Progressive
 * Practice Fig. 1 (https://drdavepoolinfo.com/resource_files/progpract.pdf). Luật thang [nguồn]: bi 1 gần foot rail, cắt
 * dọc băng vào footLeft, bi cái trên đường giữa bàn, vào thì lùi một diamond, trượt thì tiến nửa diamond, 15 cú; hạng F
 * là thường xuyên lên được chỗ 4 trở đi. Toạ độ [suy luận]: bi 1 cách foot rail 1 inch (tâm y 0.02125), bi cái x 0.5, y 0.125 →
 * 0.875. App chưa có thang thích nghi nên round đi cố định 7 chỗ, mỗi chỗ 2 cú; ngưỡng 7/14 là [đề xuất]. Góc cắt theo
 * ghost ball: 26, 48, 58, 63, 66, 68, 69°. Chưa kiểm trên bàn thật.
 * Lực và rate từng chỗ lấy từ `drill41()` của `scripts/position-harness/` (`ONLY=G0`) trên ShotPhysics `65a775f`.
 */
export const jewettProgressiveCut = {
  id: '41',
  number: 41,
  title: 'Jewett Progressive Cut',
  subtitle: 'Cut a ball near the foot rail into the corner. The cue ball backs up the center line. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Cut Angle',
  difficulty: 2,
  objective: 'Cut the 1-ball along the foot rail into the left corner from seven spots up the center line, two each.',
  cueBall: { x: 0.5, y: 0.125 },
  objectBalls: [{ number: 1, x: 0.2, y: 0.02125 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 14,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    "Jewett's ladder on a real table: make it and move back one diamond, miss and move up half a diamond. 15 shots.",
    'F level: you regularly reach spot 4 or farther.',
    'Harder: put the 1-ball one ball-width off the rail. Hardest: cue ball on the long rail, shot off a rail bridge.',
  ],
  mistakes: [
    'Undercut into the foot rail: the most common miss on thin cuts. Aim at the ghost ball, then trust it.',
    'Cue ball scratches in the far side: at thin cuts it runs on. Use less speed.',
  ],
  rounds: [
    {
      title: 'Spot 1',
      spin: 'center',
      speed: 1.28,
      rate: 45,
      why: '26° cut along the foot rail. Center ball at 1.28 m/s, the cue ball stops 25" from the nearest pocket.',
      cueBall: { x: 0.5, y: 0.125 },
    },
    {
      title: 'Spot 2',
      spin: 'center',
      speed: 1.2,
      rate: 30,
      why: '48° cut along the foot rail. Center ball at 1.2 m/s, the cue ball stops 10" from the nearest pocket.',
      cueBall: { x: 0.5, y: 0.25 },
    },
    {
      title: 'Spot 3',
      spin: 'center',
      speed: 1.84,
      rate: 15,
      why: '58° cut along the foot rail. Center ball at 1.84 m/s, the cue ball stops 22" from the nearest pocket.',
      cueBall: { x: 0.5, y: 0.375 },
    },
    {
      title: 'Spot 4',
      spin: 'center',
      speed: 1.94,
      rate: 15,
      why: '63° cut along the foot rail. Center ball at 1.94 m/s, the cue ball stops 16" from the nearest pocket.',
      cueBall: { x: 0.5, y: 0.5 },
    },
    {
      title: 'Spot 5',
      spin: 'center',
      speed: 2.38,
      rate: 20,
      why: '66° cut along the foot rail. Center ball at 2.38 m/s, the cue ball stops 24" from the nearest pocket.',
      cueBall: { x: 0.5, y: 0.625 },
    },
    {
      title: 'Spot 6',
      spin: 'center',
      speed: 2.1,
      rate: 15,
      why: '68° cut along the foot rail. Center ball at 2.1 m/s, the cue ball stops 30" from the nearest pocket.',
      cueBall: { x: 0.5, y: 0.75 },
    },
    {
      title: 'Spot 7',
      spin: 'center',
      speed: 2.16,
      rate: 15,
      why: '69° cut along the foot rail. Center ball at 2.16 m/s, the cue ball stops 31" from the nearest pocket.',
      cueBall: { x: 0.5, y: 0.875 },
    },
  ],
} satisfies PoolDrill;
