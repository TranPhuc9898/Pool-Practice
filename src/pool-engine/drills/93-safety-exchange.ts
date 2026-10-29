import type { PoolDrill } from '../types';

/**
 * Đổi phòng thủ: round 1 cắt mỏng bi 1 sang long rail trái, giấu bi cái sau bi 8 ở góc foot right; round 2 giải chính thế
 * đó bằng kick một băng foot rail. Tự soạn cho giai đoạn 6 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. Đường vẽ tay, điểm
 * chạm băng tính bằng gương qua đường tâm bi lúc chạm băng, chưa tính băng nảy ngắn hay dài [suy luận]. Round 2 đặt lại
 * bàn theo chỗ dừng lý tưởng của round 1, không theo bàn thật. Lực và ngưỡng 5/8 [đề xuất]. Giai đoạn 6 qua `OVERRIDE`
 * trong `stages.ts`. Chưa kiểm trên bàn thật.
 */
export const safetyExchange = {
  id: '93',
  number: 93,
  title: 'Safety Exchange',
  subtitle: 'Hide the cue ball behind the 8, then kick out of your own safe. Path drawn, not simulated.',
  category: 'patternPlay',
  skill: 'safety',
  skillLabel: 'Safety',
  difficulty: 5,
  objective:
    'Round 1: thin-cut the 1 to the left rail and stop the cue ball behind the 8 so the 1 is hidden. Round 2: from that spot, kick off the foot rail for a legal hit on the 1. Four tries each.',
  cueBall: { x: 0.5, y: 0.75 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.35 },
    { number: 8, x: 0.8, y: 0.093 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.93, y: 0.07 }, radius: 0.05, label: 'Cue' }],
  guideLines: [
    { kind: 'objectBallBankPath', points: [{ x: 0.5, y: 0.35 }, { x: 0.0225, y: 0.25 }, { x: 0.2, y: 0.2 }] },
    {
      kind: 'expectedCuePath',
      points: [{ x: 0.5, y: 0.75 }, { x: 0.5375, y: 0.364 }, { x: 0.9775, y: 0.18 }, { x: 0.93, y: 0.07 }],
    },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 8,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: [
    'Round 1 is a speed shot. Thin hit, just enough for the cue ball to reach the right rail and roll behind the 8.',
    'Round 2: mirror the 1 across the foot rail. The rail contact is close, so a small aim error grows fast.',
    'Pass in round 1 when the 8 blocks the straight line to the 1. Pass in round 2 on a legal hit.',
  ],
  mistakes: [
    'Too thick in round 1: the 1 stays in the middle and the cue ball stops in the open.',
    'Hitting the 8 first in round 2: the rail contact is too far right.',
  ],
  rounds: [
    {
      title: 'Play the safe',
      spin: 'center',
      speed: 1.2,
      zone: 0,
      why: 'A thin cut sends the 1 to the left rail and the cue ball across to the right rail and down behind the 8.',
    },
    {
      title: 'Kick out',
      spin: 'center',
      speed: 1.4,
      why: 'Mirror of the 1 across the foot rail. The kick passes under the 8 and comes up into the 1.',
      cueBall: { x: 0.93, y: 0.07 },
      objectBalls: [
        { number: 1, x: 0.2, y: 0.2 },
        { number: 8, x: 0.8, y: 0.093 },
      ],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.93, y: 0.07 }, { x: 0.757, y: 0.01125 }, { x: 0.2196, y: 0.1918 }] },
        { kind: 'railContact', point: { x: 0.757, y: 0 } },
      ],
    },
  ],
} satisfies PoolDrill;
