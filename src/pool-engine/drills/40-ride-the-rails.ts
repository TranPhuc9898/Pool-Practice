import type { PoolDrill } from '../types';

/**
 * Ride the Rails, bài 40 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, Larry Schwartz, Billiards Digest
 * (http://www.billiardsdigest.com/showdrill.php?id=16). Luật [nguồn]: năm bi trơn và bi 8, mỗi bi giữa một đoạn băng, cách
 * băng đúng một bề rộng bi; ball in hand cú đầu, chạy kiểu 8-ball, gọi lỗ, bi 8 cuối; chạy được thì dời bi sát băng hơn.
 * Sáu đoạn băng là [suy luận]; hạng F thêm một lần ball in hand, đạt 3/5 rack là [đề xuất]. Toạ độ theo research. App không có round cho bài chạy rack: một layout, mỗi
 * lượt bi cái về chỗ đặt sẵn (0.2, 0.45) [đề xuất] để cú đầu là bi 4 vào footLeft cắt khoảng 12°. objectBalls xếp bi đánh
 * đầu lên trước, thứ tự còn lại là gợi ý [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const rideTheRails = {
  id: '40',
  number: 40,
  title: 'Ride the Rails',
  subtitle: 'Six balls near the rails, ball in hand. Run them all with the 8 last.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Rail Cuts',
  difficulty: 2,
  objective: 'Ball in hand, run all six balls and finish on the 8. Call every pocket.',
  cueBall: { x: 0.2, y: 0.45 },
  objectBalls: [
    { number: 4, x: 0.068, y: 0.25 },
    { number: 1, x: 0.5, y: 0.966 },
    { number: 2, x: 0.5, y: 0.034 },
    { number: 3, x: 0.068, y: 0.75 },
    { number: 5, x: 0.932, y: 0.75 },
    { number: 8, x: 0.932, y: 0.25 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 4, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 4, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 6,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'Any order you like, but the 8 goes last. Call the pocket on every shot.',
    'Pass: run out 3 of 5 racks. At the F level you get one extra ball in hand per rack; run it without that and move up.',
    'Once you can run it, move the balls closer to the rails, and finally freeze them.',
    'Plan the cue ball along the rails: each ball sets up the next from the same side of the table.',
  ],
  mistakes: [
    'Cue ball stuck on the rail: you shot too firm at a ball near the rail. Let it die near the pocket.',
    'Wrong side of the next ball: decide the next shot before you hit this one.',
  ],
} satisfies PoolDrill;
