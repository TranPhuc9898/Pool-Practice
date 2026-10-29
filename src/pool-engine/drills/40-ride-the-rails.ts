import type { PoolDrill } from '../types';

/**
 * Ride the Rails, bài 40 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, Larry Schwartz, Billiards Digest
 * (http://www.billiardsdigest.com/showdrill.php?id=16). Luật [nguồn]: năm bi trơn và bi 8, mỗi bi giữa một đoạn băng, cách
 * băng đúng một bề rộng bi; ball in hand cú đầu, chạy kiểu 8-ball, gọi lỗ, bi 8 cuối; chạy được thì dời bi sát băng hơn.
 * Sáu đoạn băng là [suy luận]; hạng F thêm một lần ball in hand, đạt 3/5 rack là [đề xuất]. Toạ độ theo research. Bi cái
 * cú đầu đặt (0.2, 0.45) [đề xuất] để bi 1 vào footLeft cắt khoảng 12°, cú sau đánh từ chỗ bi cái dừng. Thứ tự, tip, lực
 * và `rate` là một route chép từ `sh scripts/rack-harness/run.sh 40` trên ShotPhysics ddf3049, không phải route duy nhất.
 * Hash khác thì chạy lại harness, chép lại số. Chưa kiểm trên bàn thật.
 */
export const rideTheRails = {
  id: '40',
  number: 40,
  title: 'Ride the Rails',
  // Route, tip, lực và tỉ lệ chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle: 'Six balls near the rails, ball in hand. Run them all with the 8 last. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Rail Cuts',
  difficulty: 2,
  objective: 'Ball in hand, run the 1 to 5 in order and finish on the 8. Call every pocket.',
  cueBall: { x: 0.2, y: 0.45 },
  objectBalls: [
    // Bi đầu mảng là bi cú 1: stage lấy nó làm bi ngắm.
    { number: 1, x: 0.068, y: 0.25 },
    { number: 4, x: 0.5, y: 0.966 },
    { number: 2, x: 0.5, y: 0.034 },
    { number: 5, x: 0.068, y: 0.75 },
    { number: 3, x: 0.932, y: 0.75 },
    { number: 8, x: 0.932, y: 0.25 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.2 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 6,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'Ball in hand for the first shot only. After that, play from where the cue ball stops.',
    'Solids in number order, 1 to 5, then the 8. Call the pocket on every shot.',
    'Pass: run out 3 of 5 racks. At the F level you get one extra ball in hand per rack; run it without that and move up.',
    'Once you can run it, move the balls closer to the rails, and finally freeze them.',
    'Plan the cue ball along the rails: each ball sets up the next from the same side of the table.',
  ],
  mistakes: [
    'Cue ball stuck on the rail: you shot too firm at a ball near the rail. Let it die near the pocket.',
    'Wrong side of the next ball: decide the next shot before you hit this one.',
  ],
  shots: [
    { ball: 1, pocket: 'footLeft', tipY: 0.2, speed: 0.8, rate: 28, why: '12° cut. Follow leaves the cue ball about 2 diamonds from ball 2 with a 37° cut into the foot right corner.' },
    { ball: 2, pocket: 'footRight', tipY: 0.2, speed: 1, rate: 14, why: '37° cut. Follow leaves the cue ball about 4 diamonds from ball 3 with a 14° cut into the head right corner.' },
    { ball: 3, pocket: 'headRight', tipY: 0.4, speed: 0.8, rate: 14, why: '14° cut. Follow leaves the cue ball about 2 diamonds from ball 4 with a 39° cut into the head left corner.' },
    { ball: 4, pocket: 'headLeft', tipY: 0.2, speed: 1, rate: 8, why: '39° cut. Follow leaves the cue ball about 2 diamonds from ball 5 with a 60° cut into the head left corner.' },
    { ball: 5, pocket: 'headLeft', tipY: 0.4, speed: 1.2, rate: 13, why: '60° cut. Follow leaves the cue ball about 5 diamonds from ball 8 with a 34° cut into the foot right corner.' },
    { ball: 8, pocket: 'footRight', tipY: 0.4, speed: 1, rate: 15, why: '34° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
