import type { DrillRound, PoolDrill } from '../types';

/**
 * Ring Around the Side, bài 34 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, Mosconi qua Jewett BD
 * 01/2010 (https://www.sfbilliards.com/articles/2010.pdf). Luật [nguồn]: 5 bi nửa vòng quanh lỗ giữa trái, vào 1 → 5.
 * Đây là bản hạng G: ball in hand mỗi cú, đạt 5/5 hai lượt liền [đề xuất], nên 10 round là hai lượt 1 → 5.
 * Toạ độ [suy luận]: research đặt bi 1 và 5 ở 73° so với pháp tuyến lỗ giữa, quá giới hạn 60° của `ShotPhysics`, nên ở đây
 * năm bi chia đều trên cung bán kính 1 diamond quanh tâm lỗ ở 55°, 27.5°, 0°. Chỗ đặt bi cái thẳng sau mỗi bi 1 diamond là
 * [đề xuất], ball in hand chọn chỗ khác cũng được. Bản gốc (draw, không chạm băng, đánh từ chỗ bi dừng) để ở tips.
 * Lực và `rate` chép từ `sh scripts/position-harness/run.sh` trên ShotPhysics ddf3049: năm cú cùng thẳng lỗ từ 1 diamond
 * nên ra cùng số. Hash khác thì chạy lại harness, chép lại số. Chưa kiểm trên bàn thật.
 */
/** Một cú cho cả năm bi: thẳng lỗ, bi cái cách bi 1 diamond. */
const shot = {
  speed: 0.78,
  rate: 45,
  why: 'Straight in from one diamond. Center ball at 0.78 m/s lets the cue ball roll 4" past contact and stop 11" short of the pocket.',
};

const ring = [
  {
    title: 'Ball 1',
    spin: 'center',
    ...shot,
    cueBall: { x: 0.2868, y: 0.7048 },
    objectBalls: [
      { number: 1, x: 0.1434, y: 0.6024 },
      { number: 2, x: 0.2218, y: 0.5577 },
      { number: 3, x: 0.25, y: 0.5 },
      { number: 4, x: 0.2218, y: 0.4423 },
      { number: 5, x: 0.1434, y: 0.3976 },
    ],
    guideLines: [
      { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
      { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
    ],
  },
  {
    title: 'Ball 2',
    spin: 'center',
    ...shot,
    cueBall: { x: 0.4435, y: 0.6154 },
    objectBalls: [
      { number: 2, x: 0.2218, y: 0.5577 },
      { number: 3, x: 0.25, y: 0.5 },
      { number: 4, x: 0.2218, y: 0.4423 },
      { number: 5, x: 0.1434, y: 0.3976 },
    ],
    guideLines: [
      { kind: 'objectBallPath', ball: 2, pocket: 'sideLeft' },
      { kind: 'ghostBall', ball: 2, pocket: 'sideLeft' },
    ],
  },
  {
    title: 'Ball 3',
    spin: 'center',
    ...shot,
    cueBall: { x: 0.5, y: 0.5 },
    objectBalls: [
      { number: 3, x: 0.25, y: 0.5 },
      { number: 4, x: 0.2218, y: 0.4423 },
      { number: 5, x: 0.1434, y: 0.3976 },
    ],
    guideLines: [
      { kind: 'objectBallPath', ball: 3, pocket: 'sideLeft' },
      { kind: 'ghostBall', ball: 3, pocket: 'sideLeft' },
    ],
  },
  {
    title: 'Ball 4',
    spin: 'center',
    ...shot,
    cueBall: { x: 0.4435, y: 0.3846 },
    objectBalls: [
      { number: 4, x: 0.2218, y: 0.4423 },
      { number: 5, x: 0.1434, y: 0.3976 },
    ],
    guideLines: [
      { kind: 'objectBallPath', ball: 4, pocket: 'sideLeft' },
      { kind: 'ghostBall', ball: 4, pocket: 'sideLeft' },
    ],
  },
  {
    title: 'Ball 5',
    spin: 'center',
    ...shot,
    cueBall: { x: 0.2868, y: 0.2952 },
    objectBalls: [{ number: 5, x: 0.1434, y: 0.3976 }],
    guideLines: [
      { kind: 'objectBallPath', ball: 5, pocket: 'sideLeft' },
      { kind: 'ghostBall', ball: 5, pocket: 'sideLeft' },
    ],
  },
] satisfies DrillRound[];

export const ringAroundTheSide = {
  id: '34',
  number: 34,
  title: 'Ring Around the Side',
  subtitle: 'Five balls in a half ring around the side pocket. Every one comes in at a different angle. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Cut Angle',
  difficulty: 1,
  objective: 'Ball in hand every shot. Pot 1 through 5 in the left side pocket, twice through without a miss.',
  cueBall: { x: 0.2868, y: 0.7048 },
  objectBalls: [
    { number: 1, x: 0.1434, y: 0.6024 },
    { number: 2, x: 0.2218, y: 0.5577 },
    { number: 3, x: 0.25, y: 0.5 },
    { number: 4, x: 0.2218, y: 0.4423 },
    { number: 5, x: 0.1434, y: 0.3976 },
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 10 },
  tips: [
    'Two runs of 1 to 5 in a row. A miss restarts the run.',
    'The steep balls near the rail need the softest touch. A side pocket rejects fast balls that come in at an angle.',
    'Original version: ball in hand on the first shot only, then play from where the cue ball stops, draw only, no rails.',
    'Run all five the original way and you are ready for the next grade.',
  ],
  mistakes: [
    'Rattles in the jaws on balls 1 and 5: too much speed for the angle. Slow down before you change the aim.',
  ],
  rounds: [...ring, ...ring],
} satisfies PoolDrill;
