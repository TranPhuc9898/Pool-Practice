import type { PoolDrill } from '../types';

/**
 * BU Exam II S2 Rail Cut, cấp Bachelors. Layout [nguồn]: bi sát băng ở diamond 2 và 6 hai long rail, tâm hai
 * end rail, center spot. Bi trên hình BU trông frozen, text không nói rõ [suy luận]: tâm cách băng một bán kính.
 * BU chỉ đếm số bi vào /7; ngưỡng 5 là đề xuất, cùng tỉ lệ ~70% các drill khác.
 * Luật BU [nguồn]: "pocket the balls in any order starting with ball in hand", tức ball in hand chỉ ở cú đầu, cú sau
 * đánh từ chỗ bi cái dừng. App bắt thứ tự số tăng dần (luật 1), số bi đánh theo route. Thứ tự, tip, lực và `rate` là một route chép từ `sh scripts/rack-harness/run.sh` trên
 * ShotPhysics ddf3049 (`git log -1 --format=%h -- modules/pool-table/ios/Editor/ShotPhysics.swift`), không phải route
 * duy nhất. Hash khác thì chạy lại harness, chép lại số.
 * https://billiarduniversity.org/documents/BU_Exam-II_Skills-Bachelors.pdf
 */
export const railCutBachelors = {
  id: '18',
  number: 18,
  title: 'Rail Cut · Bachelors',
  // Route, tip, lực và tỉ lệ chỉ đo trên ShotPhysics, chưa đo bàn thật.
  subtitle:
    'Seven balls on the rails and the center spot. Ball in hand for the first shot only. Checked in simulation, not on a real table.',
  category: 'shotMaking',
  skill: 'railCut',
  skillLabel: 'Rail Cut',
  difficulty: 3,
  objective: 'Pot all 7 in number order, 1 to 7. No scratch, no combos, never touch another ball.',
  cueBall: { x: 0.0326, y: 0.3624 },
  objectBalls: [
    { number: 1, x: 0.0225, y: 0.25 },
    { number: 6, x: 0.0225, y: 0.75 },
    { number: 4, x: 0.9775, y: 0.25 },
    { number: 3, x: 0.9775, y: 0.75 },
    { number: 2, x: 0.5, y: 0.0113 },
    { number: 7, x: 0.5, y: 0.9887 },
    { number: 5, x: 0.5, y: 0.5 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
    { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'objectBallPath', ball: 2, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0.4 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 7,
  passCondition: { kind: 'pocketed', required: 5 },
  tips: [
    'Ball in hand for the first shot only. After that, play from where the cue ball stops, lowest number first.',
    'A frozen rail ball: aim at the rail a credit card width in front of the ball.',
    'BU scoring: two runs, keep the better. A miss or a foul ends the run.',
  ],
  mistakes: [
    'The 1-ball bounces off the rail: contact too full or too thin, or the cue ball hit the rail first.',
    'Cue rubs the rail: adjust your bridge and height, but do not jack up the cue more than you need.',
    'Hits the pocket point: check the line into the pocket opening before adding speed.',
  ],
  shots: [
    { ball: 1, pocket: 'footLeft', tipY: 0.4, speed: 0.8, rate: 45, why: '0° cut. Follow leaves the cue ball about 2 diamonds from ball 2 with a 36° cut into the foot right corner.' },
    { ball: 2, pocket: 'footRight', tipY: 0.2, speed: 1, rate: 14, why: '36° cut. Follow leaves the cue ball about 4 diamonds from ball 3 with a 19° cut into the head right corner.' },
    { ball: 3, pocket: 'headRight', tipY: 0.4, speed: 0.8, rate: 14, why: '19° cut. Follow leaves the cue ball about 4 diamonds from ball 4 with a 5° cut into the foot right corner.' },
    { ball: 4, pocket: 'footRight', tipY: 0.2, speed: 1, rate: 15, why: '5° cut. Follow leaves the cue ball about 3 diamonds from ball 5 with an 11° cut into the head left corner.' },
    { ball: 5, pocket: 'headLeft', tipY: 0.4, speed: 1, rate: 14, why: '11° cut. Follow leaves the cue ball about 2 diamonds from ball 6 with a 21° cut into the head left corner.' },
    { ball: 6, pocket: 'headLeft', tipY: 0.2, speed: 0.8, rate: 16, why: '21° cut. Follow leaves the cue ball about 2 diamonds from ball 7 with a 55° cut into the head right corner.' },
    { ball: 7, pocket: 'headRight', tipY: 0.4, speed: 1.2, rate: 15, why: '55° cut, last ball. Follow, soft enough to keep the cue ball out of the pockets.' },
  ],
} satisfies PoolDrill;
