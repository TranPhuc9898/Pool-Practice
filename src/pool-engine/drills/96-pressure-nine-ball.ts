import type { PoolDrill } from '../types';

/**
 * Bàn 9 bi rải, vùng bi cái hẹp (bán kính 0.07), phải dọn ba lượt liên tiếp, sai một lượt là hỏng. App không có reset
 * chuỗi nên dùng `required === attemptCount` [suy luận]. Tự soạn cho giai đoạn 6 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md` (break-and-run tính chuỗi, bỏ cú break
 * vì engine chưa mô phỏng break), không lấy từ nguồn. Giai đoạn 6 qua `OVERRIDE` trong `stages.ts`. Harness trần 1.2 chỉ
 * được 5/9, lên 1.4 m/s mới ra route 9/9. Tip, lực và `rate` chép từ `sh scripts/rack-harness/run.sh 96` trên ShotPhysics
 * ddf3049 cộng thay đổi chưa commit trong working tree, không phải route duy nhất. Chưa kiểm trên bàn thật.
 */
export const pressureNineBall = {
  id: '96',
  number: 96,
  title: 'Pressure 9-Ball',
  subtitle: 'Nine balls, tight zones, three runouts in a row. One miss and you start over. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'runout',
  skillLabel: 'Runout',
  difficulty: 5,
  objective: 'Ball in hand for shot 1 only. Run 1 through 9 in rotation, three times in a row. A miss or a scratch ends the session.',
  cueBall: { x: 0.3339, y: 0.6183 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.8 },
    { number: 2, x: 0.2, y: 0.65 },
    { number: 3, x: 0.8, y: 0.7 },
    { number: 4, x: 0.4, y: 0.5 },
    { number: 5, x: 0.75, y: 0.35 },
    { number: 6, x: 0.25, y: 0.3 },
    { number: 7, x: 0.6, y: 0.2 },
    { number: 8, x: 0.3, y: 0.08 },
    { number: 9, x: 0.7, y: 0.06 },
  ],
  targetPocket: 'headRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.3324, y: 0.8994 }, radius: 0.07, label: '2' },
    { kind: 'circle', center: { x: 0.331, y: 0.5358 }, radius: 0.07, label: '3' },
    { kind: 'circle', center: { x: 0.0872, y: 0.6868 }, radius: 0.07, label: '4' },
    { kind: 'circle', center: { x: 0.7216, y: 0.4379 }, radius: 0.07, label: '5' },
    { kind: 'circle', center: { x: 0.6205, y: 0.2487 }, radius: 0.07, label: '6' },
    { kind: 'circle', center: { x: 0.8054, y: 0.1444 }, radius: 0.07, label: '7' },
    { kind: 'circle', center: { x: 0.0779, y: 0.1371 }, radius: 0.07, label: '8' },
    { kind: 'circle', center: { x: 0.3642, y: 0.0533 }, radius: 0.07, label: '9' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'headRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'headRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'headRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 2,
  attemptCount: 3,
  passCondition: { kind: 'pocketed', required: 3 },
  tips: [
    'The 2 needs draw into the side. Commit to the stroke, half-hearted draw leaves no angle on the 3.',
    'After a miss, stop and start a new session. Pass needs three runouts with no miss.',
  ],
  mistakes: ['Letting the cue ball drift long on the 6 and 7: the zones are small, the 8 then becomes a thin cut.'],
  shots: [
    { ball: 1, pocket: 'headRight', tipY: 0.4, speed: 0.8, zone: 0, rate: 8, why: '30° cut. Follow leaves the cue ball about 2 diamonds from ball 2 with a 21° cut into the left side pocket.' },
    { ball: 2, pocket: 'sideLeft', tipY: 0.2, speed: 0.8, zone: 1, rate: 14, why: '21° cut. Follow leaves the cue ball about 2 diamonds from ball 3 with a 39° cut into the head right corner.' },
    { ball: 3, pocket: 'headRight', tipY: 0.4, speed: 1, zone: 2, rate: 7, why: '39° cut. Follow leaves the cue ball about 2 diamonds from ball 4 with a 10° cut into the foot right corner.' },
    { ball: 4, pocket: 'footRight', tipY: 0.4, speed: 1, zone: 3, rate: 7, why: '10° cut. Follow leaves the cue ball about 1 diamond from ball 5 with a 14° cut into the foot right corner.' },
    { ball: 5, pocket: 'footRight', tipY: 0, speed: 1, zone: 4, rate: 13, why: '14° cut. Center ball leaves the cue ball about 2 diamonds from ball 6 with a 47° cut into the left side pocket.' },
    { ball: 6, pocket: 'sideLeft', tipY: 0.2, speed: 1, zone: 5, rate: 5, why: '47° cut. Follow leaves the cue ball about 1 diamond from ball 7 with a 20° cut into the left side pocket.' },
    { ball: 7, pocket: 'sideLeft', tipY: 0.2, speed: 1, zone: 6, rate: 21, why: '20° cut. Follow leaves the cue ball about 1 diamond from ball 8 with a 17° cut into the foot right corner.' },
    { ball: 8, pocket: 'footRight', tipY: 0, speed: 1, zone: 7, rate: 21, why: '17° cut. Center ball leaves the cue ball about 1 diamond from ball 9 with a 28° cut into the foot right corner.' },
    { ball: 9, pocket: 'footRight', tipY: 0, speed: 0.8, rate: 28, why: '28° cut, last ball. Center ball, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
