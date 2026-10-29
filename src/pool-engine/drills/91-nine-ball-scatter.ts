import type { PoolDrill } from '../types';

/**
 * Chín bi rải khắp bàn như sau một cú break mở, đếm số lần dọn sạch trong 10 lượt. App chưa rải bi ngẫu nhiên
 * (`objectBalls` cố định) nên dùng một bàn rải sẵn thay cho bàn ngẫu nhiên [suy luận]. Tự soạn cho giai đoạn 5 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. Harness phải lên
 * trần lực 1.8 m/s mới ra route 9/9; trần 1.2–1.6 chỉ được 5/9. Tip, lực và `rate` chép từ
 * `sh scripts/rack-harness/run.sh 91` trên ShotPhysics ddf3049 cộng thay đổi chưa commit trong working tree, không phải
 * route duy nhất. Ngưỡng 3/10 lấy theo mốc giai đoạn 5 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const nineBallScatter = {
  id: '91',
  number: 91,
  title: '9-Ball Scatter',
  subtitle: 'Nine balls spread like an open break. Count clean runouts out of ten. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'runout',
  skillLabel: 'Runout',
  difficulty: 5,
  objective: 'Ball in hand for shot 1 only. Run 1 through 9 in rotation. Tap Pass only when the whole rack goes down without a miss.',
  cueBall: { x: 0.5297, y: 0.811 },
  objectBalls: [
    { number: 1, x: 0.7, y: 0.7 },
    { number: 2, x: 0.3, y: 0.85 },
    { number: 3, x: 0.15, y: 0.5 },
    { number: 4, x: 0.6, y: 0.45 },
    { number: 5, x: 0.85, y: 0.6 },
    { number: 6, x: 0.4, y: 0.3 },
    { number: 7, x: 0.8, y: 0.15 },
    { number: 8, x: 0.2, y: 0.15 },
    { number: 9, x: 0.55, y: 0.08 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.079, y: 0.593 }, radius: 0.09, label: '2' },
    { kind: 'circle', center: { x: 0.1471, y: 0.6039 }, radius: 0.09, label: '3' },
    { kind: 'circle', center: { x: 0.3308, y: 0.3768 }, radius: 0.09, label: '4' },
    { kind: 'circle', center: { x: 0.9529, y: 0.3485 }, radius: 0.09, label: '5' },
    { kind: 'circle', center: { x: 0.5698, y: 0.6898 }, radius: 0.09, label: '6' },
    { kind: 'circle', center: { x: 0.4777, y: 0.972 }, radius: 0.09, label: '7' },
    { kind: 'circle', center: { x: 0.6438, y: 0.0268 }, radius: 0.09, label: '8' },
    { kind: 'circle', center: { x: 0.3007, y: 0.2209 }, radius: 0.09, label: '9' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'medium',
  allowedRails: 3,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 3 },
  tips: [
    'Look at the whole table before shot 1: which balls are near rails, which pockets are open.',
    'The 6 and the 8 need firm speed. Get a good angle on them so the extra speed goes into position, not risk.',
  ],
  mistakes: ['Planning one ball at a time: by the 5 the cue ball is on the wrong side of the table.'],
  shots: [
    { ball: 1, pocket: 'footRight', tipY: 0.4, speed: 1.2, zone: 0, rate: 7, why: '30° cut. Follow leaves the cue ball about 2 diamonds from ball 2 with a 47° cut into the head right corner.' },
    { ball: 2, pocket: 'headRight', tipY: -0.4, speed: 2.1, zone: 1, rate: 2, why: '47° cut. Draw leaves the cue ball about 1 diamond from ball 3 with a 12° cut into the foot left corner.' },
    { ball: 3, pocket: 'footLeft', tipY: 0.2, speed: 1, zone: 2, rate: 22, why: '12° cut. Follow leaves the cue ball about 1 diamond from ball 4 with a 48° cut into the head right corner.' },
    { ball: 4, pocket: 'headRight', tipY: 0.4, speed: 1.4, zone: 3, rate: 5, why: '48° cut. Follow leaves the cue ball about 2 diamonds from ball 5 with a 38° cut into the head left corner.' },
    { ball: 5, pocket: 'headLeft', tipY: 0.4, speed: 1.2, zone: 4, rate: 5, why: '38° cut. Follow leaves the cue ball about 3 diamonds from ball 6 with a 60° cut into the foot right corner.' },
    { ball: 6, pocket: 'footRight', tipY: 0.4, speed: 1.6, zone: 5, rate: 5, why: '60° cut. Follow leaves the cue ball about 7 diamonds from ball 7 with a 23° cut into the foot right corner.' },
    { ball: 7, pocket: 'footRight', tipY: 0.2, speed: 1, zone: 6, rate: 6, why: '23° cut. Follow leaves the cue ball about 2 diamonds from ball 8 with a 59° cut into the head left corner.' },
    { ball: 8, pocket: 'headLeft', tipY: 0.4, speed: 2.1, zone: 7, rate: 4, why: '59° cut. Follow leaves the cue ball about 2 diamonds from ball 9 with a 33° cut into the foot right corner.' },
    { ball: 9, pocket: 'footRight', tipY: 0.4, speed: 0.8, rate: 29, why: '33° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
