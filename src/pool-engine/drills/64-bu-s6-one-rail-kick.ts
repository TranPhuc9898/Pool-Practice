import type { PoolDrill } from '../types';

/**
 * BU S6 One-Rail Kick, bài 64 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Billiard
 * University Exam II S6 (https://billiarduniversity.org/documents/BU_Exam-II_Skills-Masters.pdf, bản Bachelors
 * https://billiarduniversity.org/documents/BU_Exam-II_Skills-Bachelors.pdf). Lý thuyết kick: Dr. Dave
 * (https://drdavepoolinfo.com/bd_articles/2014/april14.pdf). Luật [nguồn]: kick một băng vào long rail trái rồi chạm
 * bi mục tiêu, cú hợp lệ khi không scratch và có bi chạm băng sau va chạm, hoặc bi mục tiêu vào lỗ, 1 điểm mỗi cú.
 * Toạ độ đo từ hình [suy luận]: bi cái (L 1, W 3), bi 1 lần lượt ở L 2, 3, 4, 6 trên trục giữa. Điểm chạm băng tính
 * bằng gương qua đường tâm bi lúc chạm băng, nhắm chạm dày tâm bi 1, chưa tính băng nảy ngắn hay dài [suy luận]. Renderer
 * vẫn tự vẽ đường thẳng bi 1 → footRight; lỗ đó chỉ để đủ schema. Ngưỡng 3/4 [đề xuất]. Bachelors dùng 3 vị trí.
 * Chưa kiểm trên bàn thật.
 */
export const buS6OneRailKick = {
  id: '64',
  number: 64,
  title: 'BU S6 One-Rail Kick',
  subtitle: 'Kick off the left rail into the 1-ball from four distances.',
  category: 'shotMaking',
  skill: 'kick',
  skillLabel: 'Kick',
  difficulty: 3,
  objective: 'Kick the cue ball off the left rail and make a legal hit on the 1-ball at each of four spots down the center line.',
  cueBall: { x: 0.75, y: 0.875 },
  objectBalls: [{ number: 1, x: 0.5, y: 0.75 }],
  targetPocket: 'footRight',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'expectedCuePath', points: [{ x: 0.75, y: 0.875 }, { x: 0.0225, y: 0.7995 }, { x: 0.4559, y: 0.7546 }] },
    { kind: 'railContact', point: { x: 0, y: 0.7995 } },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 4,
  passCondition: { kind: 'pocketed', required: 3 },
  tips: [
    'Mirror the 1-ball across the left rail and aim at the image. Then adjust for how this table plays.',
    'Center ball, medium speed. Side spin or extra speed changes the rebound angle.',
    'A point is a legal hit: no scratch, and a ball reaches a rail after contact, or the 1-ball drops.',
  ],
  mistakes: [
    'Missing on the same side every time: this table rebounds short or long. Move the aim point on the rail, keep the stroke.',
    'Hitting the 1-ball dead full with no speed: nothing reaches a rail and it is a foul.',
  ],
  rounds: [
    {
      title: 'Spot 1',
      spin: 'center',
      objectBalls: [{ number: 1, x: 0.5, y: 0.75 }],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.75, y: 0.875 }, { x: 0.0225, y: 0.7995 }, { x: 0.4559, y: 0.7546 }] },
        { kind: 'railContact', point: { x: 0, y: 0.7995 } },
      ],
    },
    {
      title: 'Spot 2',
      spin: 'center',
      objectBalls: [{ number: 1, x: 0.5, y: 0.625 }],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.75, y: 0.875 }, { x: 0.0225, y: 0.7241 }, { x: 0.4584, y: 0.6336 }] },
        { kind: 'railContact', point: { x: 0, y: 0.7241 } },
      ],
    },
    {
      title: 'Spot 3',
      spin: 'center',
      objectBalls: [{ number: 1, x: 0.5, y: 0.5 }],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.75, y: 0.875 }, { x: 0.0225, y: 0.6486 }, { x: 0.4618, y: 0.5119 }] },
        { kind: 'railContact', point: { x: 0, y: 0.6486 } },
      ],
    },
    {
      title: 'Spot 4',
      spin: 'center',
      objectBalls: [{ number: 1, x: 0.5, y: 0.25 }],
      guideLines: [
        { kind: 'expectedCuePath', points: [{ x: 0.75, y: 0.875 }, { x: 0.0225, y: 0.4977 }, { x: 0.4688, y: 0.2662 }] },
        { kind: 'railContact', point: { x: 0, y: 0.4977 } },
      ],
    },
  ],
} satisfies PoolDrill;
