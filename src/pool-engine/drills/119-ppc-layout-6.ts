import type { PoolDrill } from '../types';

/**
 * Nguồn: Placement Pool Challenge của Dr. Dave Alciatore và Billiard University, layout 6 trong BU Exam V
 * (https://billiarduniversity.org/documents/BU_Exam-V_Placement_Pool_Challenge.pdf), anh lưu từ bài Dr. Dave
 * https://www.facebook.com/share/v/1E3xVY3Tyg/. Toạ độ đổi từ lưới diamond trong PDF [nguồn]. Luật PPC 8-ball: ball in hand, pot hết bi sọc thứ tự tuỳ ý rồi bi 8 [nguồn]. App bắt số tăng dần (luật 1): bốn bi sọc đổi thành bi trơn 1–4 đánh theo route, rồi bi 8. Bản PDF có thêm bi trơn làm vật chắn; drill bỏ chúng vì chuẩn drill mục 4 bắt pot hết bi trên bàn [suy luận].
 * Tip, lực và `rate` chép từ `sh scripts/rack-harness/run.sh 119` trên ShotPhysics working tree, không phải route
 * duy nhất. Route chạy lại 2026-10-29 với `maxRails: 2` trong harness: route cũ có cú bi 4 cắt 83° lực 3.2, bi cái chạm
 * 6 băng, quá `allowedRails` 2. Route mới đánh bi góc foot phải trước; cú 2 (68°) và cú 4 (64°) chỉ có rate 1/45, rất
 * mong manh [engine]. `attemptCount` 5, cần 3 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const ppcLayoutSix = {
  id: '119',
  number: 119,
  title: 'PPC Layout 6',
  subtitle: 'Dr. Dave PPC layout 6: two solids frozen on the head rail, two near the foot corners. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'pattern',
  skillLabel: 'Pattern',
  difficulty: 4,
  objective: 'Ball in hand for shot 1 only. Pot the four solids in order, 1 to 4, then the 8. A miss or a scratch ends the attempt.',
  cueBall: { x: 0.8263, y: 0.2509 },
  objectBalls: [
    { number: 3, x: 0.045, y: 0.125 },
    { number: 2, x: 0.25, y: 0.98875 },
    { number: 4, x: 0.75, y: 0.98875 },
    { number: 1, x: 0.955, y: 0.125 },
    { number: 8, x: 0.955, y: 0.875 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.8205, y: 0.1089 }, radius: 0.09, label: '2' },
    { kind: 'circle', center: { x: 0.1539, y: 0.4067 }, radius: 0.09, label: '3' },
    { kind: 'circle', center: { x: 0.0398, y: 0.1199 }, radius: 0.09, label: '4' },
    { kind: 'circle', center: { x: 0.8465, y: 0.312 }, radius: 0.09, label: '8' },
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
    { ball: 1, pocket: 'footRight', tipY: 0.2, speed: 0.8, zone: 0, rate: 40, why: '20° cut. Follow leaves the cue ball about 7 diamonds from ball 2 with a 68° cut into the head left corner.' },
    { ball: 2, pocket: 'headLeft', tipY: 0.4, speed: 1.4, zone: 1, rate: 1, why: '68° cut. Follow leaves the cue ball about 2 diamonds from ball 3 with a 1° cut into the foot left corner.' },
    { ball: 3, pocket: 'footLeft', tipY: 0, speed: 0.8, zone: 2, rate: 28, why: '1° cut. Center ball leaves the cue ball about 8 diamonds from ball 4 with a 64° cut into the head right corner.' },
    { ball: 4, pocket: 'headRight', tipY: 0.4, speed: 1.4, zone: 3, rate: 1, why: '64° cut. Follow leaves the cue ball about 5 diamonds from ball 8 with a 5° cut into the head right corner.' },
    { ball: 8, pocket: 'headRight', tipY: 0.2, speed: 0.8, rate: 25, why: '5° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
