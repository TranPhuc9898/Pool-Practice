import type { GuideLine, PoolDrill } from '../types';

/**
 * Break: 1 to Side, clip #1 của `docs/research/pool-9ball/09-break-techniques.md` và BD 1/2021 (VERIFIED / CONDITIONAL:
 * chỉ đúng khi luật giải đặt bi 9 trên spot). Rack khít, bi 9 trên foot spot (25", 25"), cả rack lùi hai hàng về phía
 * head: bi 1 ở 25" + 2·R·√3. Hàng 2 là 2, 3; hàng 3 là 4, 9, 5; hàng 4 là 6, 7; hàng 5 là 8, cùng thứ tự với rack của
 * drill 30. Bi cái trên head string, round dời từ mép box (8") vào gần giữa (2"), box 9" mỗi bên head spot như US
 * International Open. Bi 1 vào lỗ giữa nhờ dội từ rack, không theo đường cắt, nên không có guide ghost hay đường bi 1.
 * Lỗ giữa phía đối diện bi cái là suy luận của em, chưa đo. Không có Play: planner native chỉ giải cú pot, không có break.
 * Tip chỉ lấy claim VERIFIED, CONDITIONAL, APPROXIMATION; độ dày "mỏng hơn nửa bi một sợi tóc" còn NEEDS CALIBRATION.
 * Round là cú phá vẽ tay: bi cái chạm thẳng bi 1 rồi lùi ngược đường tới 22.75" [suy luận], lực 8 m/s là lực Play dùng cho cú phá [đề xuất]. Độ dày thật của cú còn NEEDS CALIBRATION.
 */
export const breakOneToSide = {
  id: '29',
  number: 29,
  title: 'Break: 1 to Side',
  subtitle: '9-ball on the spot. Break from the box and send the 1-ball into a side pocket. Path drawn, not simulated.',
  category: 'patternPlay',
  skill: 'break',
  skillLabel: 'Break',
  difficulty: 4,
  objective: 'Break from three spots in the box and drop the 1-ball in a side pocket, three breaks per spot.',
  cueBall: { x: 0.34, y: 0.75 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.28897 },
    { number: 2, x: 0.4775, y: 0.26949 },
    { number: 3, x: 0.5225, y: 0.26949 },
    { number: 4, x: 0.455, y: 0.25 },
    { number: 9, x: 0.5, y: 0.25 },
    { number: 5, x: 0.545, y: 0.25 },
    { number: 6, x: 0.4775, y: 0.23051 },
    { number: 7, x: 0.5225, y: 0.23051 },
    { number: 8, x: 0.5, y: 0.21103 },
  ],
  targetPocket: 'sideRight',
  cueBallTargetZones: [],
  guideLines: [],
  recommendedContactPoint: { x: 0, y: -0.2 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'firm',
  allowedRails: 0,
  attemptCount: 9,
  passCondition: { kind: 'pocketed', required: 3 },
  tips: [
    'Hit the 1-ball square and the same way every time. Steering the 2-ball comes later.',
    'With the 9 on the spot the wing balls rarely drop. The 1 in the side is the shot this rack leaves.',
    'Near the edge of the box hit fuller with less draw. Closer to the center, thinner with more draw.',
    'Note where the 1 lands on each break, high or low of the side. Keep the spot that repeats.',
  ],
  mistakes: [
    'Cue ball in a pocket: too much cut. Come back toward a fuller hit.',
    'The 1 drops but few balls reach the head string: fine here, but under a 3-ball rule that break does not count.',
  ],
  rounds: [
    { title: 'Box edge', spin: 'stun', cueBall: { x: 0.34, y: 0.75 }, contactPoint: { x: 0, y: -0.2 }, speed: 8, why: 'Full hit on the 1 from box edge with a low tip. The cue ball draws back toward the middle and the 1 rebounds off the rack toward the side.', guideLines: [{ kind: 'expectedCuePath', points: [{ x: 0.34, y: 0.75 }, { x: 0.4923, y: 0.3111 }, { x: 0.4145, y: 0.5353 }] }] },
    { title: 'Mid box', spin: 'stun', cueBall: { x: 0.4, y: 0.75 }, contactPoint: { x: 0, y: -0.2 }, speed: 8, why: 'Full hit on the 1 from mid box with a low tip. The cue ball draws back toward the middle and the 1 rebounds off the rack toward the side.', guideLines: [{ kind: 'expectedCuePath', points: [{ x: 0.4, y: 0.75 }, { x: 0.4951, y: 0.3113 }, { x: 0.4461, y: 0.5375 }] }] },
    { title: 'Near center', spin: 'stun', cueBall: { x: 0.46, y: 0.75 }, contactPoint: { x: 0, y: -0.2 }, speed: 8, why: 'Full hit on the 1 from near center with a low tip. The cue ball draws back toward the middle and the 1 rebounds off the rack toward the side.', guideLines: [{ kind: 'expectedCuePath', points: [{ x: 0.46, y: 0.75 }, { x: 0.498, y: 0.3114 }, { x: 0.4783, y: 0.5387 }] }] },
  ],
} satisfies PoolDrill;
