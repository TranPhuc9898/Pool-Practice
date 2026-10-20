import type { PoolDrill } from '../types';

/**
 * Kill the Cue Ball, bài 56 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Bob Jewett
 * "Get to the Point" Diag. 3 (https://www.sfbilliards.com/articles/2007.pdf). Layout bi 1 cách foot rail 3 diamond,
 * cách long rail 1 diamond, cắt 20–30° vào footLeft, vào thì lùi bi cái ½ diamond [nguồn]. Chỗ bi cái và tiêu chí dừng
 * trong một bề rộng bi quanh ghost ball là [đề xuất]; ghost ball cho góc cắt 27°. Ba round là bi cái ở chỗ research
 * rồi lùi ½ và 1 diamond trên cùng đường ngắm ghost ball, giữ nguyên góc cắt [suy luận]. 4 cú mỗi round, ngưỡng 6/12
 * [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const killTheCueBall = {
  id: '56',
  number: 56,
  title: 'Kill the Cue Ball',
  subtitle: 'Soft draw that dies at the ghost ball. Back up half a diamond when it works.',
  category: 'cueBallControl',
  skill: 'stop',
  skillLabel: 'Stop',
  difficulty: 4,
  objective: 'Pot the 1-ball in the far left corner and stop the cue ball within one ball width of the ghost ball.',
  cueBall: { x: 0.193, y: 0.625 },
  objectBalls: [{ number: 1, x: 0.25, y: 0.375 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.2642, y: 0.3963 }, radius: 0.045, label: 'Ghost' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: -0.4 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 12,
  passCondition: { kind: 'inZone', required: 6 },
  tips: [
    'Soft draw: keep a little backspin at contact. It pulls against the tangent roll and the cue ball dies near the ghost ball.',
    'Make it, back the cue ball up half a diamond. Miss or overrun, move it closer again.',
    'Note the farthest spot you can still kill it from. That is your score.',
  ],
  mistakes: [
    'Cue ball drifts forward along the tangent: no draw left at contact. Lower tip, not more speed.',
    'Cue ball spins back toward you: too much draw for this speed. Raise the tip a little.',
  ],
  rounds: [
    { title: 'Start', zone: 0, spin: 'draw', cueBall: { x: 0.193, y: 0.625 } },
    { title: '+½ diamond', zone: 0, spin: 'draw', cueBall: { x: 0.1738, y: 0.6868 } },
    { title: '+1 diamond', zone: 0, spin: 'draw', cueBall: { x: 0.1545, y: 0.7485 } },
  ],
} satisfies PoolDrill;
