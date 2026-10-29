import type { PoolDrill } from '../types';

/**
 * Sáu bi rotation, bi 4 nằm sát long rail trái là bi khó, phải tính đường về nó từ bi 2 và 3. Tự soạn cho giai đoạn 5
 * của `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md` (bài "gỡ bi khó giữa pattern"),
 * không lấy từ nguồn. Engine không có cụm thật nên bi khó là bi sát băng thay cho cụm [suy luận]. Tip, lực và `rate` chép
 * từ `sh scripts/rack-harness/run.sh 88` trên ShotPhysics ddf3049 cộng thay đổi chưa commit trong working tree, không phải
 * route duy nhất. Ngưỡng 3/5 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const problemBallFirst = {
  id: '88',
  number: 88,
  title: 'Problem Ball First',
  subtitle: 'Six balls in rotation. The 4 is on the rail, plan back to it. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'pattern',
  skillLabel: 'Pattern',
  difficulty: 5,
  objective: 'Ball in hand for shot 1 only. Run 1 through 6 in rotation. Find the 4 on the rail first, then plan the 2 and 3 to reach it.',
  cueBall: { x: 0.8039, y: 0.7949 },
  objectBalls: [
    { number: 1, x: 0.6, y: 0.75 },
    { number: 2, x: 0.25, y: 0.55 },
    { number: 3, x: 0.75, y: 0.4 },
    { number: 4, x: 0.04, y: 0.3 },
    { number: 5, x: 0.55, y: 0.2 },
    { number: 6, x: 0.3, y: 0.12 },
  ],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.1836, y: 0.8227 }, radius: 0.09, label: '2' },
    { kind: 'circle', center: { x: 0.7629, y: 0.3 }, radius: 0.09, label: '3' },
    { kind: 'circle', center: { x: 0.2399, y: 0.6585 }, radius: 0.09, label: '4' },
    { kind: 'circle', center: { x: 0.0501, y: 0.2792 }, radius: 0.09, label: '5' },
    { kind: 'circle', center: { x: 0.9681, y: 0.3009 }, radius: 0.09, label: '6' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'sideLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 2,
  attemptCount: 5,
  passCondition: { kind: 'pocketed', required: 3 },
  tips: [
    'A ball on the rail only goes down the rail. Get the cue ball close to the same rail, a short way up the table.',
    'Plan backward: where must the cue ball be for the 4, then for the 3, then for the 2.',
  ],
  mistakes: ['Playing the 3 for an easy look at the 4 from the middle of the table: the rail cut is then a long, thin shot.'],
  shots: [
    { ball: 1, pocket: 'sideLeft', tipY: 0.4, speed: 0.8, zone: 0, rate: 23, why: '20° cut. Follow leaves the cue ball about 2 diamonds from ball 2 with a 21° cut into the foot left corner.' },
    { ball: 2, pocket: 'footLeft', tipY: 0.4, speed: 1, zone: 1, rate: 5, why: '21° cut. Follow leaves the cue ball about 1 diamond from ball 3 with a 20° cut into the head right corner.' },
    { ball: 3, pocket: 'headRight', tipY: 0.4, speed: 1, zone: 2, rate: 18, why: '20° cut. Follow leaves the cue ball about 3 diamonds from ball 4 with a 13° cut into the foot left corner.' },
    { ball: 4, pocket: 'footLeft', tipY: 0.4, speed: 0.8, zone: 3, rate: 27, why: '13° cut. Follow leaves the cue ball about 2 diamonds from ball 5 with a 26° cut into the foot right corner.' },
    { ball: 5, pocket: 'footRight', tipY: 0.4, speed: 0.8, zone: 4, rate: 14, why: '26° cut. Follow leaves the cue ball about 3 diamonds from ball 6 with an 11° cut into the foot left corner.' },
    { ball: 6, pocket: 'footLeft', tipY: 0.2, speed: 0.8, rate: 14, why: '11° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
