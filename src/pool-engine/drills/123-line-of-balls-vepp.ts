import type { PoolDrill } from '../types';

/**
 * Nguồn: Dr. Dave Alciatore, "VEPP – Part VI: Line-of-Balls Drill", Billiards Digest 9/2012,
 * https://drdavepoolinfo.com/faq/drill/line-of-balls/. Chín bi 1–9 dọc đường tâm, cách nhau một bi, bi 1 cách băng foot một
 * bi; ball in hand cú đầu; ăn theo thứ tự số, lỗ nào cũng được; đụng bi còn lại là hết lượt; điểm là số bi ăn liên tiếp
 * [nguồn]. Nguồn không cho tip, lực, góc, lỗ bi 6–9. Chỗ đặt bi cái, lỗ, tip, lực, zone và `rate` chép từ
 * `sh scripts/rack-harness/run.sh 123` trên ShotPhysics working tree (2026-10-29), không phải route duy nhất. Khoá zone theo
 * Diagram 1 thì engine chỉ dọn 8/9, nên drill dùng route thả tự do: cú 1 khớp nguồn (draw vào góc), từ cú 2 lệch sơ đồ
 * (cú 2 cắt 40° thay vì góc nhẹ) [suy luận]. Rate 4–15/45, route mong manh. `attemptCount` 5, cần 5 bi [đề xuất]. Chưa kiểm
 * trên bàn thật.
 */
export const lineOfBallsVepp = {
  id: '123',
  number: 123,
  title: 'Line of Balls (VEPP)',
  subtitle: 'Dr. Dave VEPP drill: nine balls on the long center line, one ball apart, the 1 one ball off the foot rail. Checked in simulation, not on a real table.',
  category: 'patternPlay',
  skill: 'pattern',
  skillLabel: 'Pattern',
  difficulty: 4,
  objective: 'Ball in hand for shot 1 only. Pot the 1 to 9 in number order, any pocket. Touching another ball, a miss or a scratch ends the attempt. Score is the number of balls potted in a row.',
  cueBall: { x: 0.2655, y: 0.1101 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.03375 },
    { number: 2, x: 0.5, y: 0.07875 },
    { number: 3, x: 0.5, y: 0.12375 },
    { number: 4, x: 0.5, y: 0.16875 },
    { number: 5, x: 0.5, y: 0.21375 },
    { number: 6, x: 0.5, y: 0.25875 },
    { number: 7, x: 0.5, y: 0.30375 },
    { number: 8, x: 0.5, y: 0.34875 },
    { number: 9, x: 0.5, y: 0.39375 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.3622, y: 0.159 }, radius: 0.08, label: '2' },
    { kind: 'circle', center: { x: 0.3517, y: 0.311 }, radius: 0.08, label: '3' },
    { kind: 'circle', center: { x: 0.2314, y: 0.5853 }, radius: 0.08, label: '4' },
    { kind: 'circle', center: { x: 0.2132, y: 0.3569 }, radius: 0.08, label: '5' },
    { kind: 'circle', center: { x: 0.5558, y: 0.1515 }, radius: 0.08, label: '6' },
    { kind: 'circle', center: { x: 0.904, y: 0.8323 }, radius: 0.08, label: '7' },
    { kind: 'circle', center: { x: 0.6533, y: 0.0574 }, radius: 0.08, label: '8' },
    { kind: 'circle', center: { x: 0.9635, y: 0.7845 }, radius: 0.08, label: '9' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: -0.4 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 5,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: [
    'The 1 to the 5 all go into the same foot corner: draw back to keep a small angle on the next ball.',
    'When a ball is almost straight in, draw straight back off the long rail and out.',
    'Keep the cue ball above the ball-to-pocket line, and avoid having to bank around the next ball.',
    'The side pockets open up after the first few balls, so the end of the rack gets easier.',
  ],
  mistakes: [
    'Rolling the cue ball into the rest of the line: any touch on another ball ends the attempt.',
    'Getting straight in on the 2 or 3 with no angle to come back out for the next ball.',
  ],
  shots: [
    { ball: 1, pocket: 'footRight', tipY: -0.4, speed: 1.6, zone: 0, rate: 6, why: '30° cut. Draw leaves the cue ball about 1 diamond from ball 2 with a 40° cut into the foot right corner.' },
    { ball: 2, pocket: 'footRight', tipY: -0.2, speed: 1.4, zone: 1, rate: 7, why: '40° cut. Draw leaves the cue ball about 2 diamonds from ball 3 with a 47° cut into the foot right corner.' },
    { ball: 3, pocket: 'footRight', tipY: 0.4, speed: 1, zone: 2, rate: 4, why: '47° cut. Follow leaves the cue ball about 4 diamonds from ball 4 with a 40° cut into the foot right corner.' },
    { ball: 4, pocket: 'footRight', tipY: 0.4, speed: 1, zone: 3, rate: 5, why: '40° cut. Follow leaves the cue ball about 2 diamonds from ball 5 with a 5° cut into the foot right corner.' },
    { ball: 5, pocket: 'footRight', tipY: 0.4, speed: 0.8, zone: 4, rate: 12, why: '5° cut. Follow leaves the cue ball about 1 diamond from ball 6 with a 39° cut into the left side pocket.' },
    { ball: 6, pocket: 'sideLeft', tipY: 0, speed: 1.2, zone: 5, rate: 5, why: '39° cut. Center ball leaves the cue ball about 5 diamonds from ball 7 with a 19° cut into the foot left corner.' },
    { ball: 7, pocket: 'footLeft', tipY: 0.4, speed: 1, zone: 6, rate: 10, why: '19° cut. Follow leaves the cue ball about 2 diamonds from ball 8 with a 47° cut into the left side pocket.' },
    { ball: 8, pocket: 'sideLeft', tipY: 0.4, speed: 1, zone: 7, rate: 4, why: '47° cut. Follow leaves the cue ball about 4 diamonds from ball 9 with a 2° cut into the foot left corner.' },
    { ball: 9, pocket: 'footLeft', tipY: 0.4, speed: 1, rate: 15, why: '2° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
