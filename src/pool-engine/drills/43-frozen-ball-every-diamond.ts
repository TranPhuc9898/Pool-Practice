import type { PoolDrill } from '../types';

/**
 * Frozen Ball Every Diamond, bài 43 của `docs/research/pool-practice-drills/drills-32-48-dua-bi.md`, AZBilliards
 * (https://forums.azbilliards.com/threads/the-best-pool-drill.57129). Luật [forum]: bi ép băng ở các diamond, ball in hand
 * cú đầu rồi đánh từ chỗ bi cái dừng, thứ tự tuỳ ý ở bản gốc; app bắt số tăng dần (luật 1) nên số bi đánh theo route, hết lượt khi chạm bi khác, trượt hoặc scratch; hạng E 5 bi liên tiếp
 * là [đề xuất]. Tip chạm bi và băng cùng lúc là kỹ thuật chung [suy luận]. Bàn có 18 diamond nhưng app chỉ có 15 bi, nên bỏ ba
 * diamond trên head rail [suy luận]: sáu bi băng trái, sáu bi băng phải ở y ⅛…⅞ trừ hai lỗ giữa, ba bi foot rail. Bi cái
 * (0.13, 0.78) [đề xuất] cho cú đầu bi 1 vào headLeft cắt khoảng 30°. Thứ tự, tip, lực và `rate` là một route chép từ
 * `sh scripts/rack-harness/run.sh 43` trên ShotPhysics ddf3049, không phải route duy nhất. Hash khác thì chạy lại harness,
 * chép lại số. Chưa kiểm trên bàn thật.
 */
export const frozenBallEveryDiamond = {
  id: '43',
  number: 43,
  title: 'Frozen Ball Every Diamond',
  // Route, tip, lực và tỉ lệ chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle:
    'A ball frozen to the rail at every diamond. Ball in hand, run as many as you can. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'cutAngle',
  skillLabel: 'Rail Cuts',
  difficulty: 3,
  objective: 'Ball in hand, pot 5 frozen rail balls in a row, in number order.',
  cueBall: { x: 0.1301, y: 0.779 },
  objectBalls: [
    { number: 2, x: 0.0225, y: 0.125 },
    { number: 4, x: 0.0225, y: 0.25 },
    { number: 6, x: 0.0225, y: 0.375 },
    { number: 14, x: 0.0225, y: 0.625 },
    { number: 5, x: 0.0225, y: 0.75 },
    { number: 1, x: 0.0225, y: 0.875 },
    { number: 8, x: 0.9775, y: 0.125 },
    { number: 11, x: 0.9775, y: 0.25 },
    { number: 15, x: 0.9775, y: 0.375 },
    { number: 10, x: 0.9775, y: 0.625 },
    { number: 7, x: 0.9775, y: 0.75 },
    { number: 3, x: 0.9775, y: 0.875 },
    { number: 9, x: 0.25, y: 0.01125 },
    { number: 13, x: 0.5, y: 0.01125 },
    { number: 12, x: 0.75, y: 0.01125 },
  ],
  targetPocket: 'headLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'headLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'headLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'headLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0.2 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 5,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: [
    'Ball in hand for the first shot only. After that, play from where the cue ball stops.',
    'Any order. Your turn ends on a miss, a scratch, or touching another ball. Five in a row passes.',
    'Hit the ball and the rail at the same time, or a hair rail-first. Ball-first makes it jump off the rail.',
    'Soft speed: a frozen ball takes the pocket better slow.',
    'The forum suggests an hour straight on this one.',
  ],
  mistakes: [
    'Ball wobbles along the rail and stops in the jaws: too fast, or hit ball-first.',
    'Cue ball stuck on the rail afterwards: pick shots that bring it back to the middle.',
  ],
  shots: [
    { ball: 1, pocket: 'headLeft', tipY: 0.2, speed: 0.8, rate: 45, why: '30° cut. Follow leaves the cue ball about 6 diamonds from ball 2 with a 6° cut into the foot left corner.' },
    { ball: 2, pocket: 'footLeft', tipY: 0.4, speed: 0.8, rate: 13, why: '6° cut. Follow leaves the cue ball about 7 diamonds from ball 3 with a 27° cut into the head right corner.' },
    { ball: 3, pocket: 'headRight', tipY: 0.4, speed: 1, rate: 15, why: '27° cut. Follow leaves the cue ball about 6 diamonds from ball 4 with a 22° cut into the foot left corner.' },
    { ball: 4, pocket: 'footLeft', tipY: 0.4, speed: 1, rate: 15, why: '22° cut. Follow leaves the cue ball about 5 diamonds from ball 5 with a 12° cut into the head left corner.' },
    { ball: 5, pocket: 'headLeft', tipY: 0.2, speed: 1, rate: 14, why: '12° cut. Follow leaves the cue ball about 4 diamonds from ball 6 with a 9° cut into the foot left corner.' },
    { ball: 6, pocket: 'footLeft', tipY: 0.2, speed: 1, rate: 13, why: '9° cut. Follow leaves the cue ball about 5 diamonds from ball 7 with a 46° cut into the head right corner.' },
    { ball: 7, pocket: 'headRight', tipY: 0.4, speed: 1.2, rate: 15, why: '46° cut. Follow leaves the cue ball about 6 diamonds from ball 8 with a 17° cut into the foot right corner.' },
    { ball: 8, pocket: 'footRight', tipY: 0.2, speed: 1, rate: 14, why: '17° cut. Follow leaves the cue ball about 3 diamonds from ball 9 with a 14° cut into the foot left corner.' },
    { ball: 9, pocket: 'footLeft', tipY: 0.2, speed: 0.8, rate: 30, why: '14° cut. Follow leaves the cue ball about 5 diamonds from ball 10 with a 32° cut into the head right corner.' },
    { ball: 10, pocket: 'headRight', tipY: 0.2, speed: 1.2, rate: 11, why: '32° cut. Follow leaves the cue ball about 4 diamonds from ball 11 with a 31° cut into the foot right corner.' },
    { ball: 11, pocket: 'footRight', tipY: 0.2, speed: 1.2, rate: 13, why: '31° cut. Follow leaves the cue ball about 2 diamonds from ball 12 with a 21° cut into the foot right corner.' },
    { ball: 12, pocket: 'footRight', tipY: 0, speed: 0.8, rate: 24, why: '21° cut. Center ball leaves the cue ball about 1 diamond from ball 13 with a 21° cut into the foot left corner.' },
    { ball: 13, pocket: 'footLeft', tipY: 0.2, speed: 0.8, rate: 27, why: '21° cut. Follow leaves the cue ball about 5 diamonds from ball 14 with a 21° cut into the head left corner.' },
    { ball: 14, pocket: 'headLeft', tipY: 0.2, speed: 1.2, rate: 10, why: '21° cut. Follow leaves the cue ball about 4 diamonds from ball 15 with a 33° cut into the foot right corner.' },
    { ball: 15, pocket: 'footRight', tipY: 0.4, speed: 1.2, rate: 15, why: '33° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
