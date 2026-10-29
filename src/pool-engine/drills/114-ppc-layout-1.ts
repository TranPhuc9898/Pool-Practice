import type { PoolDrill } from '../types';

/**
 * Nguồn: Placement Pool Challenge của Dr. Dave Alciatore và Billiard University, layout 1 trong BU Exam V
 * (https://billiarduniversity.org/documents/BU_Exam-V_Placement_Pool_Challenge.pdf), anh lưu từ bài Dr. Dave
 * https://www.facebook.com/share/v/1E3xVY3Tyg/. Toạ độ đổi từ lưới diamond trong PDF [nguồn]. Luật PPC: ball in hand, 9-ball đánh rotation, slop tính [nguồn].
 * Tip, lực và `rate` chép từ `sh scripts/rack-harness/run.sh 114` trên ShotPhysics working tree, không phải route
 * duy nhất. `attemptCount` 5, cần 3 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const ppcLayoutOne = {
  id: '114',
  number: 114,
  title: 'PPC Layout 1',
  subtitle: 'Dr. Dave PPC layout 1: five balls on the diamond grid, run 5 through 9 in rotation. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'pattern',
  skillLabel: 'Pattern',
  difficulty: 2,
  objective: 'Ball in hand for shot 1 only. Run 5 through 9 in rotation. A miss or a scratch ends the attempt.',
  cueBall: { x: 0.1337, y: 0.971 },
  objectBalls: [
    { number: 5, x: 0.25, y: 0.875 },
    { number: 6, x: 0.75, y: 0.625 },
    { number: 7, x: 0.75, y: 0.875 },
    { number: 8, x: 0.25, y: 0.625 },
    { number: 9, x: 0.25, y: 0.375 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.7521, y: 0.7258 }, radius: 0.09, label: '6' },
    { kind: 'circle', center: { x: 0.4351, y: 0.2764 }, radius: 0.09, label: '7' },
    { kind: 'circle', center: { x: 0.5837, y: 0.9342 }, radius: 0.09, label: '8' },
    { kind: 'circle', center: { x: 0.3058, y: 0.5369 }, radius: 0.09, label: '9' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 5, pocket: 'footRight' },
    { kind: 'ghostBall', ball: 5, pocket: 'footRight' },
    { kind: 'cueBallPath', ball: 5, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 5,
  passCondition: { kind: 'pocketed', required: 3 },
  tips: [
    'Plan the whole layout from ball in hand before the first shot.',
    'Pick the side of each ball that sends the cue ball toward the next one, not the closest pocket.',
  ],
  mistakes: [
    'Shooting the easiest ball first and leaving the next one blocked.',
  ],
  shots: [
    { ball: 5, pocket: 'footRight', tipY: 0.4, speed: 1.2, zone: 0, rate: 5, why: '10° cut. Follow leaves the cue ball about 1 diamond from ball 6 with a 56° cut into the right side pocket.' },
    { ball: 6, pocket: 'sideRight', tipY: 0.2, speed: 1.2, zone: 1, rate: 7, why: '56° cut. Follow leaves the cue ball about 5 diamonds from ball 7 with a 31° cut into the head right corner.' },
    { ball: 7, pocket: 'headRight', tipY: 0.4, speed: 0.8, zone: 2, rate: 9, why: '31° cut. Follow leaves the cue ball about 3 diamonds from ball 8 with an 18° cut into the left side pocket.' },
    { ball: 8, pocket: 'sideLeft', tipY: 0.2, speed: 0.8, zone: 3, rate: 20, why: '18° cut. Follow leaves the cue ball about 1 diamond from ball 9 with a 10° cut into the foot left corner.' },
    { ball: 9, pocket: 'footLeft', tipY: 0.4, speed: 0.8, rate: 29, why: '10° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
