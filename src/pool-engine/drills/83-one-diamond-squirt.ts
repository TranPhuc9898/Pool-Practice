import type { PoolDrill } from '../types';

/**
 * One-Diamond Squirt, bước squirt ở cự ly ngắn của chuỗi Ép phê (`docs/quyet-dinh/2026-10-25-muc-tieu-va-chu-de-pool.md`).
 * Bi 1 cố định, bi cái cách ghost 1 diamond ở góc cắt 30° và 15° vào lỗ góc, phê 9 mm (tipX 0.31 với R = 28.6 mm).
 * Chiều dày, mỏng khớp bảng Ignite 12.2 ở mục 8 của `docs/research/2026-10-25-ep-phe-1-diamond.md`, còn số inch và
 * lực, rate lấy từ `drill83()` của `scripts/position-harness/`: đánh lại với hướng ngắm của tip giữa, đo bi 1 lệch bao
 * nhiêu ở lỗ (cách 33.5"). Engine squirt 2.5° ở nửa bi, chưa có swerve, cơ nằm ngang. Data không có trục cơ nên BHE chỉ
 * nằm trong tips.
 */
export const oneDiamondSquirt = {
  id: '83',
  number: 83,
  title: 'One-Diamond Squirt',
  subtitle: 'Short cuts from one diamond with 9 mm of side. See how far squirt moves the hit and which way. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'english',
  skillLabel: 'English',
  difficulty: 3,
  objective: 'Pot the 1-ball from one diamond with center ball, then outside and inside english at 15° and 30°, two shots each.',
  cueBall: { x: 0.3051, y: 0.4449 },
  objectBalls: [{ number: 1, x: 0.3, y: 0.3 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    // Đường ngắm của tip giữa: Play các round phê đánh đúng hướng này để thấy squirt đẩy bi lệch.
    { kind: 'expectedCuePath', points: [{ x: 0.3051, y: 0.4449 }, { x: 0.3201, y: 0.3201 }] },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 7 },
  tips: [
    'Shoot the center round first and remember that aim. The english rounds start from it.',
    'Outside english hits fuller, inside english hits thinner. Even from one diamond the miss is several inches at the pocket.',
    'Rule of thumb: move the ghost about 60% of the tip offset. 9 mm of side means about 5 mm of ghost shift, thinner for outside, fuller for inside.',
    'BHE cancels squirt if your bridge sits at the cue\'s pivot length. Then only throw is left, about 1–2" at the pocket.',
    'Keep the cue level. Raising the butt adds swerve, which this drill does not measure.',
  ],
  mistakes: [
    'Undercut with outside english: you aimed the center line and squirt made it fuller.',
    'Overcut with inside english: squirt and throw both push it thin.',
    'Using more than 9 mm of side. Keep the tip offset the same so the misses compare.',
    'Adjusting aim and tip on the same shot. Change one thing at a time.',
  ],
  rounds: [
    {
      title: '30° center',
      spin: 'center',
      contactPoint: { x: 0, y: 0 },
      speed: 1.4,
      rate: 45,
      why: 'Baseline: 30° cut from one diamond at 1.4 m/s. No squirt; collision throw alone pushes the 1-ball 1.4° toward undercut.',
    },
    {
      title: '15° outside',
      spin: 'center',
      cueBall: { x: 0.3702, y: 0.4426 },
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
      ],
      contactPoint: { x: 0.31, y: 0 },
      speed: 1.3,
      rate: 45,
      why: 'Squirt 1.6° makes the hit fuller. Aimed at center the 1-ball lands 3.8" thick, so aim thinner until the cue ball still meets the ghost.',
    },
    {
      title: '15° inside',
      spin: 'center',
      cueBall: { x: 0.3702, y: 0.4426 },
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
      ],
      contactPoint: { x: -0.31, y: 0 },
      speed: 1.5,
      rate: 45,
      why: 'Squirt 1.6° makes the hit thinner and throw adds 1.2°. Aimed at center the 1-ball lands 5.2" thin, so aim fuller.',
    },
    {
      title: '30° outside',
      spin: 'center',
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
      ],
      contactPoint: { x: 0.31, y: 0 },
      speed: 1.3,
      rate: 45,
      why: 'Squirt 1.6° makes the hit fuller and the spin throws the 1-ball 1.4° the other way. Aimed at center it lands 3.9" thick, so aim thinner.',
    },
    {
      title: '30° inside',
      spin: 'center',
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
      ],
      contactPoint: { x: -0.31, y: 0 },
      speed: 1.4,
      rate: 45,
      why: 'Squirt 1.6° makes the hit thinner and throw adds 1.3°. Aimed at center it lands 6.7" thin, the biggest miss here, so aim fuller.',
    },
  ],
} satisfies PoolDrill;
