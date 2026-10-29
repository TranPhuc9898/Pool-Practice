import type { PoolDrill } from '../types';

/**
 * Năm bi rotation, phải dọn ba lần liên tiếp, sai một lần là làm lại từ đầu. App không có reset chuỗi nên dùng
 * `required === attemptCount`: một lượt Miss là hỏng cả lượt [suy luận]. Tự soạn cho giai đoạn 5 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md` (bài "áp lực"), không lấy từ nguồn. Tip,
 * lực và `rate` chép từ `sh scripts/rack-harness/run.sh 90` trên ShotPhysics ddf3049 cộng thay đổi chưa commit trong
 * working tree, không phải route duy nhất. Chưa kiểm trên bàn thật.
 */
export const pressureLine = {
  id: '90',
  number: 90,
  title: 'Pressure Line',
  subtitle: 'Five balls, three clean runs in a row. One miss and you start over. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'runout',
  skillLabel: 'Runout',
  difficulty: 5,
  objective: 'Ball in hand for shot 1 only. Run 1 through 5 in rotation, three times in a row. A miss or a scratch ends the session.',
  cueBall: { x: 0.374, y: 0.7403 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.65 },
    { number: 2, x: 0.2, y: 0.45 },
    { number: 3, x: 0.8, y: 0.35 },
    { number: 4, x: 0.35, y: 0.2 },
    { number: 5, x: 0.65, y: 0.1 },
  ],
  targetPocket: 'sideRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.385, y: 0.2718 }, radius: 0.09, label: '2' },
    { kind: 'circle', center: { x: 0.3048, y: 0.6829 }, radius: 0.09, label: '3' },
    { kind: 'circle', center: { x: 0.8189, y: 0.3206 }, radius: 0.09, label: '4' },
    { kind: 'circle', center: { x: 0.0993, y: 0.2537 }, radius: 0.09, label: '5' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'sideRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 2,
  attemptCount: 3,
  passCondition: { kind: 'pocketed', required: 3 },
  tips: [
    'Same routine every shot: stand, aim, three practice strokes, pause, shoot.',
    'After a miss, stop the session and start a new one. Pass needs three runs with no miss.',
  ],
  mistakes: ['Speeding up on the third run: the last two balls are where the nerves show.'],
  shots: [
    { ball: 1, pocket: 'sideRight', tipY: 0.4, speed: 0.8, zone: 0, rate: 17, why: '30° cut. Follow leaves the cue ball about 2 diamonds from ball 2 with a 40° cut into the left side pocket.' },
    { ball: 2, pocket: 'sideLeft', tipY: 0, speed: 0.8, zone: 1, rate: 15, why: '40° cut. Center ball leaves the cue ball about 3 diamonds from ball 3 with a 22° cut into the foot right corner.' },
    { ball: 3, pocket: 'footRight', tipY: 0.2, speed: 1, zone: 2, rate: 11, why: '22° cut. Follow leaves the cue ball about 2 diamonds from ball 4 with a 24° cut into the foot left corner.' },
    { ball: 4, pocket: 'footLeft', tipY: 0.4, speed: 0.8, zone: 3, rate: 13, why: '24° cut. Follow leaves the cue ball about 3 diamonds from ball 5 with a 1° cut into the foot right corner.' },
    { ball: 5, pocket: 'footRight', tipY: 0.2, speed: 0.8, rate: 29, why: '1° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
