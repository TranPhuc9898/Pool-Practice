import type { PoolDrill } from '../types';

/**
 * Nguồn: Placement Pool Challenge của Dr. Dave Alciatore và Billiard University, layout 4 trong BU Exam V
 * (https://billiarduniversity.org/documents/BU_Exam-V_Placement_Pool_Challenge.pdf), anh lưu từ bài Dr. Dave
 * https://www.facebook.com/share/v/1E3xVY3Tyg/. Toạ độ đổi từ lưới diamond trong PDF [nguồn]. Luật PPC 8-ball: ball in hand, pot hết bi sọc thứ tự tuỳ ý rồi bi 8 [nguồn]. App bắt số tăng dần (luật 1): bốn bi sọc đổi thành bi trơn 1–4 đánh theo route, rồi bi 8.
 * Tip, lực và `rate` chép từ `sh scripts/rack-harness/run.sh 117` trên ShotPhysics working tree, không phải route
 * duy nhất. `attemptCount` 5, cần 3 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const ppcLayoutFour = {
  id: '117',
  number: 117,
  title: 'PPC Layout 4',
  subtitle: 'Dr. Dave PPC layout 4: four solids and the 8 on the diamond grid. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'pattern',
  skillLabel: 'Pattern',
  difficulty: 4,
  objective: 'Ball in hand for shot 1 only. Pot the four solids in order, 1 to 4, then the 8. A miss or a scratch ends the attempt.',
  cueBall: { x: 0.055, y: 0.9289 },
  objectBalls: [
    { number: 1, x: 0.25, y: 0.875 },
    { number: 2, x: 0.75, y: 0.875 },
    { number: 4, x: 0.75, y: 0.5 },
    { number: 3, x: 0.75, y: 0.125 },
    { number: 8, x: 0.25, y: 0.125 },
  ],
  targetPocket: 'sideRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.9631, y: 0.948 }, radius: 0.09, label: '2' },
    { kind: 'circle', center: { x: 0.4315, y: 0.8799 }, radius: 0.09, label: '3' },
    { kind: 'circle', center: { x: 0.475, y: 0.2022 }, radius: 0.09, label: '4' },
    { kind: 'circle', center: { x: 0.9331, y: 0.5861 }, radius: 0.09, label: '8' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'sideRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
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
    { ball: 1, pocket: 'sideRight', tipY: 0.4, speed: 1, zone: 0, rate: 18, why: '20° cut. Follow leaves the cue ball about 1 diamond from ball 2 with a 13° cut into the left side pocket.' },
    { ball: 2, pocket: 'sideLeft', tipY: 0.2, speed: 1, zone: 1, rate: 19, why: '13° cut. Follow leaves the cue ball about 6 diamonds from ball 3 with a 34° cut into the foot right corner.' },
    { ball: 3, pocket: 'footRight', tipY: 0.4, speed: 1, zone: 2, rate: 5, why: '34° cut. Follow leaves the cue ball about 3 diamonds from ball 4 with a 12° cut into the head right corner.' },
    { ball: 4, pocket: 'headRight', tipY: 0.4, speed: 1, zone: 3, rate: 14, why: '12° cut. Follow leaves the cue ball about 5 diamonds from ball 8 with a 9° cut into the foot left corner.' },
    { ball: 8, pocket: 'footLeft', tipY: 0.4, speed: 0.8, rate: 15, why: '9° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
