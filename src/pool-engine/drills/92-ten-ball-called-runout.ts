import type { PoolDrill } from '../types';

/**
 * Mười bi rotation, gọi lỗ từng cú như luật 10 bi: bi vào lỗ khác lỗ đã gọi là hỏng lượt. Tự soạn cho giai đoạn 6 của
 * `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lấy từ nguồn. Engine không chấm
 * lỗ đã gọi nên người chơi tự chấm [suy luận]; lỗ gọi chính là `pocket` của từng cú. Giai đoạn 6 qua `OVERRIDE` trong
 * `stages.ts`. Tip, lực và `rate` chép từ `sh scripts/rack-harness/run.sh 92` trên ShotPhysics ddf3049 cộng thay đổi chưa
 * commit trong working tree, không phải route duy nhất. Ngưỡng 2/5 [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const tenBallCalledRunout = {
  id: '92',
  number: 92,
  title: '10-Ball Called Runout',
  subtitle: 'Ten balls, call every pocket. Wrong pocket counts as a miss. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'runout',
  skillLabel: 'Runout',
  difficulty: 5,
  objective: 'Ball in hand for shot 1 only. Run 1 through 10 in rotation and call the pocket out loud before every shot. A ball in any other pocket ends the run.',
  cueBall: { x: 0.09, y: 0.7128 },
  objectBalls: [
    { number: 1, x: 0.3, y: 0.75 },
    { number: 2, x: 0.7, y: 0.8 },
    { number: 3, x: 0.5, y: 0.6 },
    { number: 4, x: 0.15, y: 0.4 },
    { number: 5, x: 0.85, y: 0.45 },
    { number: 6, x: 0.35, y: 0.35 },
    { number: 7, x: 0.65, y: 0.25 },
    { number: 8, x: 0.2, y: 0.1 },
    { number: 9, x: 0.8, y: 0.1 },
    { number: 10, x: 0.5, y: 0.15 },
  ],
  targetPocket: 'headRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.704, y: 0.662 }, radius: 0.08, label: '2' },
    { kind: 'circle', center: { x: 0.1011, y: 0.6456 }, radius: 0.08, label: '3' },
    { kind: 'circle', center: { x: 0.6129, y: 0.6271 }, radius: 0.08, label: '4' },
    { kind: 'circle', center: { x: 0.8361, y: 0.3486 }, radius: 0.08, label: '5' },
    { kind: 'circle', center: { x: 0.7986, y: 0.5428 }, radius: 0.08, label: '6' },
    { kind: 'circle', center: { x: 0.1816, y: 0.354 }, radius: 0.08, label: '7' },
    { kind: 'circle', center: { x: 0.6147, y: 0.3414 }, radius: 0.08, label: '8' },
    { kind: 'circle', center: { x: 0.2068, y: 0.0901 }, radius: 0.08, label: '9' },
    { kind: 'circle', center: { x: 0.4344, y: 0.315 }, radius: 0.08, label: '10' },
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
  attemptCount: 5,
  passCondition: { kind: 'pocketed', required: 2 },
  tips: [
    'Call the pocket before you get down on the shot, not while aiming.',
    'Side pockets carry most of this route. Keep speed soft so the ball does not rattle the jaws.',
  ],
  mistakes: ['Cheating the pocket on a long cut: the ball drops in the other corner and the run is over.'],
  shots: [
    { ball: 1, pocket: 'headRight', tipY: 0.4, speed: 0.8, zone: 0, rate: 16, why: '20° cut. Follow leaves the cue ball about 1 diamond from ball 2 with a 44° cut into the head right corner.' },
    { ball: 2, pocket: 'headRight', tipY: 0.4, speed: 1, zone: 1, rate: 8, why: '44° cut. Follow leaves the cue ball about 2 diamonds from ball 3 with a 10° cut into the right side pocket.' },
    { ball: 3, pocket: 'sideRight', tipY: 0.2, speed: 0.8, zone: 2, rate: 36, why: '10° cut. Follow leaves the cue ball about 3 diamonds from ball 4 with a 37° cut into the foot left corner.' },
    { ball: 4, pocket: 'footLeft', tipY: 0.4, speed: 1, zone: 3, rate: 6, why: '37° cut. Follow leaves the cue ball about 1 diamond from ball 5 with a 5° cut into the head right corner.' },
    { ball: 5, pocket: 'headRight', tipY: 0.2, speed: 1, zone: 4, rate: 34, why: '5° cut. Follow leaves the cue ball about 2 diamonds from ball 6 with a 25° cut into the foot left corner.' },
    { ball: 6, pocket: 'footLeft', tipY: 0.2, speed: 1, zone: 5, rate: 9, why: '25° cut. Follow leaves the cue ball about 2 diamonds from ball 7 with a 34° cut into the foot right corner.' },
    { ball: 7, pocket: 'footRight', tipY: 0.2, speed: 1, zone: 6, rate: 7, why: '34° cut. Follow leaves the cue ball about 3 diamonds from ball 8 with a 5° cut into the foot left corner.' },
    { ball: 8, pocket: 'footLeft', tipY: 0, speed: 0.8, zone: 7, rate: 37, why: '5° cut. Center ball leaves the cue ball about 2 diamonds from ball 9 with a 50° cut into the foot right corner.' },
    { ball: 9, pocket: 'footRight', tipY: 0.4, speed: 0.8, zone: 8, rate: 3, why: '50° cut. Follow leaves the cue ball about 1 diamond from ball 10 with a 54° cut into the foot right corner.' },
    { ball: 10, pocket: 'footRight', tipY: 0.4, speed: 1.2, rate: 15, why: '54° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
