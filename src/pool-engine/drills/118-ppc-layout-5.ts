import type { PoolDrill } from '../types';

/**
 * Nguồn: Placement Pool Challenge của Dr. Dave Alciatore và Billiard University, layout 5 trong BU Exam V
 * (https://billiarduniversity.org/documents/BU_Exam-V_Placement_Pool_Challenge.pdf), anh lưu từ bài Dr. Dave
 * https://www.facebook.com/share/v/1E3xVY3Tyg/. Toạ độ đổi từ lưới diamond trong PDF [nguồn]. Luật PPC 8-ball: ball in hand, pot hết bi sọc thứ tự tuỳ ý rồi bi 8 [nguồn]. App bắt số tăng dần (luật 1): bốn bi sọc đổi thành bi trơn 1–4 đánh theo route, rồi bi 8. Bản PDF có thêm bi trơn làm vật chắn; drill bỏ chúng vì chuẩn drill mục 4 bắt pot hết bi trên bàn [suy luận].
 * Tip, lực và `rate` chép từ `sh scripts/rack-harness/run.sh 118` trên ShotPhysics working tree, không phải route
 * duy nhất. `attemptCount` 5, cần 3 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const ppcLayoutFive = {
  id: '118',
  number: 118,
  title: 'PPC Layout 5',
  subtitle: 'Dr. Dave PPC layout 5: solids around the foot end, the 8 frozen on the foot rail. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'pattern',
  skillLabel: 'Pattern',
  difficulty: 4,
  objective: 'Ball in hand for shot 1 only. Pot the four solids in order, 1 to 4, then the 8. A miss or a scratch ends the attempt.',
  cueBall: { x: 0.6421, y: 0.2225 },
  objectBalls: [
    { number: 4, x: 0.5, y: 0.125 },
    { number: 2, x: 0.75, y: 0.5 },
    { number: 1, x: 0.75, y: 0.125 },
    { number: 3, x: 0.955, y: 0.25 },
    { number: 8, x: 0.75, y: 0.01125 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.6775, y: 0.0277 }, radius: 0.09, label: '2' },
    { kind: 'circle', center: { x: 0.6223, y: 0.6343 }, radius: 0.09, label: '3' },
    { kind: 'circle', center: { x: 0.9383, y: 0.2409 }, radius: 0.09, label: '4' },
    { kind: 'circle', center: { x: 0.4526, y: 0.1072 }, radius: 0.09, label: '8' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 5,
  passCondition: { kind: 'pocketed', required: 3 },
  tips: [
    'Solids 1 to 4 in order: each shot sets up the next number.',
    'Leave the 8 an easy last shot before you pot the 4.',
  ],
  mistakes: [
    'Clearing the solids but leaving the cue ball on the wrong side of the 8.',
  ],
  shots: [
    { ball: 1, pocket: 'footRight', tipY: 0, speed: 0.8, zone: 0, rate: 43, why: '20° cut. Center ball leaves the cue ball about 4 diamonds from ball 2 with a 10° cut into the head right corner.' },
    { ball: 2, pocket: 'headRight', tipY: 0.4, speed: 1, zone: 1, rate: 10, why: '10° cut. Follow leaves the cue ball about 3 diamonds from ball 3 with a 19° cut into the foot right corner.' },
    { ball: 3, pocket: 'footRight', tipY: 0.4, speed: 0.8, zone: 2, rate: 28, why: '19° cut. Follow leaves the cue ball about 2 diamonds from ball 4 with a 1° cut into the foot left corner.' },
    { ball: 4, pocket: 'footLeft', tipY: 0.2, speed: 0.8, zone: 3, rate: 37, why: '1° cut. Follow leaves the cue ball about 1 diamond from ball 8 with a 32° cut into the foot right corner.' },
    { ball: 8, pocket: 'footRight', tipY: 0, speed: 0.8, rate: 35, why: '32° cut, last ball. Center ball, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
