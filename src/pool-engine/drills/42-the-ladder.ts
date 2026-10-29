import type { PoolDrill } from '../types';

/**
 * The Ladder, bài 42 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, AZBilliards
 * (https://forums.azbilliards.com/threads/the-ladder.37742), bản 12 bi Feijen / Kinister. Luật [forum]: ba bi cho mỗi lỗ
 * góc, ball in hand cú đầu, mỗi bi vào đúng góc của cụm mình, không chạm bi khác, không bank, không combo, trượt làm lại.
 * Hình research là ký hiệu, toạ độ đặt theo mô tả chữ [suy luận]: x 0.0375 / 0.9625, y ⅛, 3⁄16, ⅜ tính từ góc. Bi cái (0.1563, 0.2177) của harness để cú đầu
 * bi 1 vào footLeft cắt khoảng 30°. App đếm số bi vào, chuỗi liên tiếp người tập tự giữ.
 * Bi cách long rail một bề ngang ngón cái, ở diamond 1, 1.5 và 3 tính từ góc là [forum]; mốc E/C/A là [đề xuất]. Thứ tự
 * góc tự do, trong mỗi góc bi gần lỗ đi trước vì nó chắn đường hai bi kia. Bi cái và cú 1 chép từ
 * `sh scripts/rack-harness/run.sh 42`. Harness chỉ ra được cú 1: từ cú 2 bi cái sau cú cắt sát băng chạm bi
 * khác trên băng [suy luận, chưa in lý do từng ứng viên], nên Play chỉ diễn cú 1, phần còn lại người tập tự đi. Chuỗi 12 cú cũ của engine ddf3049 bỏ vì cú 2
 * bi cái xuyên bi 8. Chưa kiểm trên bàn thật.
 */
export const theLadder = {
  id: '42',
  number: 42,
  title: 'The Ladder',
  subtitle: 'Three balls near each corner. Climb around the table without a miss. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Cut Angle',
  difficulty: 3,
  objective: 'Ball in hand for shot 1 only. Corners in any order. Pot 4 in a row, each ball into its own corner, the nearest ball of a corner first.',
  cueBall: { x: 0.1563, y: 0.2177 },
  objectBalls: [
    { number: 1, x: 0.0375, y: 0.125 },
    { number: 2, x: 0.0375, y: 0.1875 },
    { number: 3, x: 0.0375, y: 0.375 },
    { number: 4, x: 0.9625, y: 0.125 },
    { number: 5, x: 0.9625, y: 0.1875 },
    { number: 6, x: 0.9625, y: 0.375 },
    { number: 7, x: 0.9625, y: 0.875 },
    { number: 8, x: 0.9625, y: 0.8125 },
    { number: 9, x: 0.9625, y: 0.625 },
    { number: 10, x: 0.0375, y: 0.875 },
    { number: 11, x: 0.0375, y: 0.8125 },
    { number: 12, x: 0.0375, y: 0.625 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 4,
  passCondition: { kind: 'pocketed', required: 4 },
  tips: [
    'Corners in any order. In each corner the nearest ball goes first, it blocks the path of the other two.',
    'Four in a row passes here. Eight in a row is C level, all twelve is A level.',
    'No touching other balls, no banks, no combos. A miss starts you over.',
    'Too hard? Move the balls a few inches off the rail.',
  ],
  mistakes: [
    'Next ball blocked by its neighbor: you came in too shallow. Leave an angle from the middle of the table.',
    'Cue ball on the rail after a rail cut: too much speed for the distance.',
  ],
  shots: [
    { ball: 1, pocket: 'footLeft', tipY: 0, speed: 0.8, rate: 45, why: '30° cut. Center ball, soft, the cue ball stays off the other rail balls.' },
  ],
} satisfies PoolDrill;
