import type { PoolDrill } from '../types';

/**
 * Tom Ross Rail Shot, bài 44 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, Tom Ross, CueTimes 2000
 * (https://drdavepoolinfo.com/resource_files/trcd/CueTimes%20PDFs/700%20Pocketing%20Rail%20Shots.pdf). Kỹ thuật [nguồn]:
 * bi cách băng ½ inch thì ngắm cho bi chạy song song băng, chạm mép băng long rail ở miệng lỗ, cắt dày hơn chút bù cling và
 * throw; bi ép băng thì "chơi như không có băng"; góc trên 45° thì rail-first, english mạnh cùng phía cắt. Toạ độ đo từ
 * hình [suy luận], research đã quay hình gốc để end rail đích thành foot rail. Mỗi chỗ 5 cú thay vì 10 vì trần 30 cú,
 * ngưỡng 21/30 (7/10) là [đề xuất]. Rail-first chỉ làm ở chỗ C (khoảng 60°); điểm chạm băng x 0.5, ngay trước bi, là
 * [suy luận]; bi 1 đi về bên phải đường bi cái nên dùng english phải, contactPoint x 0.5. Chưa kiểm trên bàn thật.
 */
export const tomRossRailShot = {
  id: '44',
  number: 44,
  title: 'Tom Ross Rail Shot',
  subtitle: 'A ball near the foot rail, cut along it into the corner. Then frozen, then rail-first with english.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Rail Cuts',
  difficulty: 3,
  objective: 'Cut the 1-ball along the foot rail into the right corner from three spots: off the rail, frozen, then rail-first.',
  cueBall: { x: 0.175, y: 0.1 },
  objectBalls: [{ number: 1, x: 0.55, y: 0.01625 }],
  targetPocket: 'footRight',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 30,
  passCondition: { kind: 'pocketed', required: 21 },
  tips: [
    'Ball off the rail: send it parallel to the rail at the long rail point of the pocket, not the pocket center. Cut a hair thick for cling and throw.',
    'Ball frozen: play it as if the rail were not there.',
    'Past 45°: hit the rail just before the ball with strong english toward the cut. The spin pulls the 1-ball in. Try it from B too.',
    'Tom Ross: anyone can learn the rail-first shot in 15 minutes or less.',
  ],
  mistakes: [
    'Ball rattles off the near point: aimed at the pocket center. Aim at the far point.',
    'Rail-first shot jumps off the rail: too far from the ball, or not enough english.',
  ],
  rounds: [
    { title: 'Off rail · A', spin: 'center', contactPoint: { x: 0, y: 0 }, speed: 0.9, cueBall: { x: 0.175, y: 0.1 } },
    { title: 'Off rail · B', spin: 'center', contactPoint: { x: 0, y: 0 }, speed: 1.05, cueBall: { x: 0.175, y: 0.188 } },
    { title: 'Off rail · C', spin: 'center', contactPoint: { x: 0, y: 0 }, speed: 1.5, cueBall: { x: 0.263, y: 0.256 } },
    {
      title: 'Frozen · A',
      spin: 'center', contactPoint: { x: 0, y: 0 }, speed: 0.9,
      cueBall: { x: 0.175, y: 0.1 },
      objectBalls: [{ number: 1, x: 0.55, y: 0.01125 }],
    },
    {
      title: 'Frozen · B',
      spin: 'center', contactPoint: { x: 0, y: 0 }, speed: 1.1,
      cueBall: { x: 0.175, y: 0.188 },
      objectBalls: [{ number: 1, x: 0.55, y: 0.01125 }],
    },
    {
      title: 'Rail-first · C',
      spin: 'center',
      cueBall: { x: 0.263, y: 0.256 },
      contactPoint: { x: 0.3, y: 0 }, speed: 1.45,
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
        { kind: 'railContact', point: { x: 0.5, y: 0 } },
      ],
    },
  ],
} satisfies PoolDrill;
