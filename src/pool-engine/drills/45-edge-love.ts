import type { PoolDrill } from '../types';

/**
 * Edge Love, bài 45 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, Mosconi qua AZBilliards
 * (https://forums.azbilliards.com/threads/willie-mosconis-aiming-system.515592/post-6712243). Luật và mốc 8/10 mỗi chỗ là
 * [forum]; trúng khi bi chạm băng trong vòng một bề rộng bi quanh đồng xu là [đề xuất]. Layout gốc không lấy được, layout
 * research là [đề xuất]: bi 1 trên foot spot, đích là diamond thứ nhất của foot rail. Chỗ A dời x 0.75 → 0.7618 cho thẳng
 * tuyệt đối; B cắt khoảng 30°, C khoảng 58° theo ghost ball [suy luận]. Đích dựng bằng objectBallBankPath hai điểm để
 * stage ngắm điểm băng thay vì lỗ; targetPocket footLeft chỉ để có giá trị. App đếm bi vào lỗ, không chấm điểm chạm băng,
 * nên người tập tự ghi. Chưa kiểm trên bàn thật.
 */
export const edgeLove = {
  id: '45',
  number: 45,
  title: 'Edge Love',
  subtitle: 'No pocket. Drive the 1-ball into a coin on the foot rail diamond.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Aim Point',
  difficulty: 3,
  objective: 'Send the 1-ball into the first foot rail diamond, within one ball of the coin, from three spots.',
  cueBall: { x: 0.7618, y: 0.5 },
  objectBalls: [{ number: 1, x: 0.5, y: 0.25 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallBankPath', points: [{ x: 0.5, y: 0.25 }, { x: 0.25, y: 0.01125 }] },
    { kind: 'railContact', point: { x: 0.25, y: 0 } },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 30,
  passCondition: { kind: 'pocketed', required: 24 },
  tips: [
    'Put a coin against the rail at the first diamond. A hit within one ball of it counts.',
    'Ten from each spot: A is straight, B a medium cut, C a thin cut. 8 of 10 per spot passes.',
    'The target is smaller than a pocket, so a make here means your aim is truly on.',
    'Then mirror it to the third diamond.',
  ],
  mistakes: [
    'Misses always on one side of the coin: a steady aim error. Shift your ghost ball, do not just try harder.',
    'Good from A, wild from C: you are cutting by feel. Find the ghost ball on every shot.',
  ],
  rounds: [
    { title: 'Straight · A', spin: 'center', cueBall: { x: 0.7618, y: 0.5 } },
    { title: 'Cut · B', spin: 'center', cueBall: { x: 0.5, y: 0.5 } },
    { title: 'Thin cut · C', spin: 'center', cueBall: { x: 0.25, y: 0.5 } },
  ],
} satisfies PoolDrill;
