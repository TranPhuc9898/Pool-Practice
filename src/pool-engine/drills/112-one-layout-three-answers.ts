import type { PoolDrill } from '../types';

/**
 * Nguồn: RioBilliard, ba bài anh lưu về safety https://www.facebook.com/share/v/152EhjcN7nk/,
 * https://www.facebook.com/share/v/1EkW5onSgE/, https://www.facebook.com/share/v/1CGx8zZwGW/. Ý chung của ba bài [nguồn]:
 * cùng một thế bi, chọn giữa cắt mỏng giấu bi cái, đẩy bi mục tiêu đi xa, hay ăn bi kèm vị trí. Thế bi, đường đi và lực
 * do em dựng cho ba lựa chọn đó [suy luận]: bi 1 gần băng chân, bi 2 và 3 làm tường gần băng đầu. Đường bi cái, bi 1, phê và lực
 * lấy từ `ShotPhysics` cho từng round, bi không đụng 2, 3 [suy luận]. Cửa ngắm cả ba round chỉ khoảng ±0.1°: round 1 và 2
 * cần bi cái đi ba bốn băng mới khuất sau bi 2, 3, round 3 vừa ăn vừa về vòng nên khe hẹp [suy luận]. `attemptCount` 9, cần 6
 * [đề xuất]. Chưa kiểm trên bàn thật.
 */
export const oneLayoutThreeAnswers = {
  id: '112',
  number: 112,
  title: 'One Layout, Three Answers',
  subtitle: 'Same balls, three ways out: hide the cue ball, send the 1-ball long, or pot it with shape.',
  category: 'patternPlay',
  skill: 'safety',
  skillLabel: 'Safety',
  difficulty: 5,
  objective: 'Three shots per round from the same layout. Round 1 and 2 score when the 2 and 3 block every straight line from the cue ball to the 1-ball. Round 3 scores when the 1 drops and the cue ball stops in the circle.',
  cueBall: { x: 0.5, y: 0.55 },
  objectBalls: [
    { number: 1, x: 0.75, y: 0.2 },
    { number: 2, x: 0.52, y: 0.88 },
    { number: 3, x: 0.58, y: 0.88 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.478, y: 0.92 }, radius: 0.06, label: 'Hide' },
    { kind: 'circle', center: { x: 0.2, y: 0.262 }, radius: 0.06, label: 'Stay' },
    { kind: 'circle', center: { x: 0.6, y: 0.45 }, radius: 0.08, label: 'Shape' },
  ],
  guideLines: [],
  recommendedContactPoint: { x: 0.4, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'firm',
  allowedRails: 4,
  attemptCount: 9,
  passCondition: { kind: 'inZone', required: 6 },
  tips: [
    'Read the table before you pick: is the pot on, and if you miss, what do you leave?',
    'Thin cut: the 1-ball barely moves, the cue ball does the travelling. Pace it to die near the head rail.',
    'Long push: the 1-ball runs four rails to the wall, the cue ball comes back down to the foot end.',
  ],
  mistakes: [
    'Cutting too thick on the hide: the 1-ball rolls out from the rail and the wall no longer covers it.',
    'Hiding with no rail after contact. That is a foul, not a safety.',
    'Potting the 1 with no plan for the cue ball: you made the ball and lost the table.',
  ],
  rounds: [
    {
      title: 'Thin cut, hide the cue ball',
      zone: 0,
      spin: 'center',
      contactPoint: { x: 0.4, y: 0 },
      speed: 2.8,
      why: 'Thin on the left of the 1 with right english. The 1 taps the foot rail and comes back to its spot, the cue ball goes right, left and head rails and stops behind the 2 and 3.',
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.75, y: 0.2 }, { x: 0.8333, y: 0.0112 }, { x: 0.7531, y: 0.1998 }] },
        {
          kind: 'expectedCuePath',
          points: [
            { x: 0.5, y: 0.55 },
            { x: 0.7399, y: 0.2219 },
            { x: 0.9775, y: 0.1905 },
            { x: 0.0225, y: 0.7683 },
            { x: 0.3785, y: 0.9888 },
            { x: 0.4775, y: 0.9197 },
          ],
        },
      ],
    },
    {
      title: 'Push the 1-ball long',
      zone: 1,
      spin: 'follow',
      contactPoint: { x: 0, y: 0.3 },
      speed: 2.8,
      why: 'Fuller hit sends the 1 four rails up behind the 2 and 3. The cue ball runs to the head rail and comes back down the left side.',
      guideLines: [
        {
          kind: 'objectBallBankPath',
          points: [
            { x: 0.75, y: 0.2 },
            { x: 0.9775, y: 0.0911 },
            { x: 0.7855, y: 0.0112 },
            { x: 0.0225, y: 0.2986 },
            { x: 0.9775, y: 0.75 },
            { x: 0.5205, y: 0.9563 },
          ],
        },
        {
          kind: 'expectedCuePath',
          points: [
            { x: 0.5, y: 0.55 },
            { x: 0.7172, y: 0.2154 },
            { x: 0.5415, y: 0.0112 },
            { x: 0.0938, y: 0.9888 },
            { x: 0.0225, y: 0.8074 },
            { x: 0.2002, y: 0.2616 },
          ],
        },
      ],
    },
    {
      title: 'Pot the 1 with shape',
      zone: 2,
      spin: 'follow',
      contactPoint: { x: 0, y: 0.5 },
      speed: 1.8,
      why: 'Cut into the foot right corner with follow. The cue ball goes into the foot rail and back to the middle with an open table.',
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
        { kind: 'ghostBall', ball: 1, pocket: 'footRight' },
        {
          kind: 'expectedCuePath',
          points: [{ x: 0.5, y: 0.55 }, { x: 0.7263, y: 0.2191 }, { x: 0.6515, y: 0.0114 }, { x: 0.5647, y: 0.4648 }],
        },
      ],
    },
  ],
} satisfies PoolDrill;
