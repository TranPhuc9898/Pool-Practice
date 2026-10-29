import type { PoolDrill } from '../types';

/**
 * Random A→B, bài 55 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Bob Jewett BD 2011
 * (https://www.sfbilliards.com/articles/2011.pdf) [nguồn] và bản AZB
 * (https://forums.azbilliards.com/goto/post?id=8099099) [forum]. Luật [nguồn]: thả bi mục tiêu và tờ giấy đích ngẫu
 * nhiên, bi cái in hand, vào bi mục tiêu lần lượt cả 6 lỗ, mỗi lần đưa bi cái về tờ giấy, 4 vòng không băng, 1, 2, 3 băng.
 * Bi 1 (0.65, 0.575) và đích (0.25, 0.25) là ví dụ của research [đề xuất]. Chỗ bi cái chỉ cho cú mặc định vào lỗ giữa
 * phải, cắt 30° để tiếp tuyến chạy về đích [suy luận]. Vòng đích bán kính một bề rộng bi, 1 cú mỗi lỗ, ngưỡng 8/24
 * (1 trong 3) là [đề xuất]. Mỗi round một chỗ bi cái (ball in hand), tip và lực dò bằng `ShotPhysics` cho bi 1 vào
 * lỗ giữa phải và bi cái về đích sau đúng 0, 1, 2, 3 băng [engine]; spin của round theo tip đó. Chưa kiểm trên bàn thật.
 */
export const randomAToB = {
  id: '55',
  number: 55,
  title: 'Random A→B',
  subtitle: 'One ball, one target. Pot it in all six pockets and bring the cue ball home.',
  category: 'cueBallControl',
  skill: 'speedControl',
  skillLabel: 'Speed Control',
  difficulty: 3,
  objective: 'With ball in hand, pot the 1-ball in each of the six pockets and stop the cue ball on the target, first with no rail, then 1, 2 and 3 rails.',
  cueBall: { x: 0.3211, y: 0.776 },
  objectBalls: [{ number: 1, x: 0.65, y: 0.575 }],
  targetPocket: 'sideRight',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.25, y: 0.25 }, radius: 0.045, label: 'Paper' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideRight' },
  ],
  recommendedContactPoint: { x: 0, y: -0.1 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 3,
  attemptCount: 24,
  passCondition: { kind: 'inZone', required: 8 },
  tips: [
    'Drop the ball and a paper target anywhere. Ball in hand for every shot: pick the cue ball spot that makes the route easy.',
    'One round per rail count. In each round, pot the ball once in every pocket, six shots.',
    'Each round shows one example cue ball spot that reaches the zone. With ball in hand, move it to suit the pocket you were given.',
    'Jewett calls this one of the best position drills there is.',
  ],
  mistakes: [
    'Choosing the route after placing the cue ball: decide the route first, then place the ball to match.',
    'Good line, wrong distance: on rail routes, speed off the last rail is what matters. Watch where it slows.',
  ],
  rounds: [
    { title: 'No rail', zone: 0, spin: 'stun', cueBall: { x: 0.5, y: 0.62 }, contactPoint: { x: 0, y: -0.1 }, speed: 3.4 },
    { title: '1 rail', zone: 0, spin: 'draw', cueBall: { x: 0.46, y: 0.64 }, contactPoint: { x: 0, y: -0.2 }, speed: 3.4 },
    { title: '2 rails', zone: 0, spin: 'follow', cueBall: { x: 0.22, y: 0.7 }, contactPoint: { x: 0, y: 0.2 }, speed: 3.8 },
    { title: '3 rails', zone: 0, spin: 'follow', cueBall: { x: 0.42, y: 0.62 }, contactPoint: { x: 0, y: 0.5 }, speed: 4 },
  ],
} satisfies PoolDrill;
