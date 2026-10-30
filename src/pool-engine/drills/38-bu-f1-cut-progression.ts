import type { PoolDrill } from '../types';

/**
 * BU F1 Cut Progression, bài 38 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, Billiard University Exam I
 * F1 (https://billiarduniversity.org/documents/BU_Exam-I_Fundamentals.pdf). Luật [nguồn]: bi 1 cách foot rail một khe đúng
 * một bi, đi dọc foot rail vào footLeft, bảy chỗ bi cái trên đường W 3, bắt đầu ở chỗ 4, vào lùi một chỗ, trượt tiến một
 * chỗ, 10 cú, điểm = chỗ cuối + 1 cho mỗi cú vào ở chỗ 7, tối đa 10. Toạ độ đo từ hình [suy luận], sai số khoảng ±¼
 * diamond. App chưa có thang thích nghi nên round đi cố định chỗ 1 → 7, mỗi chỗ 2 cú; ngưỡng 9/14 ứng với điểm BU 5 (đạt
 * hạng F) là [đề xuất]. Góc cắt theo ghost ball: 3, 25, 39, 47, 52, 55, 58°. Chưa kiểm trên bàn thật.
 * Lực và rate từng chỗ lấy từ `drill38()` của `scripts/position-harness/` (`ONLY=G0`) trên ShotPhysics `65a775f`.
 */
export const buF1CutProgression = {
  id: '38',
  number: 38,
  title: 'BU F1 Cut Progression',
  subtitle: 'One ball along the foot rail. The cue ball moves up the table and the cut gets thinner. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Cut Angle',
  difficulty: 2,
  objective: 'Cut the 1-ball along the foot rail into the left corner from seven spots, two shots each.',
  cueBall: { x: 0.75, y: 0.125 },
  objectBalls: [{ number: 1, x: 0.25, y: 0.0375 }],
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
  passCondition: { kind: 'pocketed', required: 9 },
  tips: [
    'BU scoring on a real table: start at spot 4, make it and move back one spot, miss and move up one. Ten shots.',
    'Score is the spot you finish on, plus one for every make from spot 7. Ten is the maximum, 5 passes this grade.',
    'Scratches do not count against you here.',
    'Then mirror the layout and cut the other way.',
  ],
  mistakes: [
    'The 1-ball hits the foot rail before the pocket: undercut. Aim at the ghost ball, not the 1-ball.',
    'Hits the long rail point: overcut, usually from steering with the bridge hand.',
  ],
  rounds: [
    {
      title: 'Spot 1',
      spin: 'center',
      speed: 2.4,
      rate: 33,
      why: '3° cut along the foot rail. Center ball at 2.4 m/s, the cue ball stops 11" from the nearest pocket.',
      cueBall: { x: 0.75, y: 0.125 },
    },
    {
      title: 'Spot 2',
      spin: 'center',
      speed: 1.86,
      rate: 30,
      why: '25° cut along the foot rail. Center ball at 1.86 m/s, the cue ball stops 4" from the nearest pocket.',
      cueBall: { x: 0.75, y: 0.25 },
    },
    {
      title: 'Spot 3',
      spin: 'center',
      speed: 1.64,
      rate: 30,
      why: '39° cut along the foot rail. Center ball at 1.64 m/s, the cue ball stops 22" from the nearest pocket.',
      cueBall: { x: 0.75, y: 0.375 },
    },
    {
      title: 'Spot 4',
      spin: 'center',
      speed: 1.82,
      rate: 15,
      why: '47° cut along the foot rail. Center ball at 1.82 m/s, the cue ball stops 17" from the nearest pocket.',
      cueBall: { x: 0.75, y: 0.5 },
    },
    {
      title: 'Spot 5',
      spin: 'center',
      speed: 1.88,
      rate: 15,
      why: '52° cut along the foot rail. Center ball at 1.88 m/s, the cue ball stops 27" from the nearest pocket.',
      cueBall: { x: 0.75, y: 0.625 },
    },
    {
      title: 'Spot 6',
      spin: 'center',
      speed: 1.94,
      rate: 15,
      why: '55° cut along the foot rail. Center ball at 1.94 m/s, the cue ball stops 31" from the nearest pocket.',
      cueBall: { x: 0.75, y: 0.75 },
    },
    {
      title: 'Spot 7',
      spin: 'center',
      speed: 2,
      rate: 15,
      why: '58° cut along the foot rail. Center ball at 2 m/s, the cue ball stops 28" from the nearest pocket.',
      cueBall: { x: 0.75, y: 0.875 },
    },
  ],
} satisfies PoolDrill;
