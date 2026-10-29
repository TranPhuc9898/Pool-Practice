import type { PoolDrill } from '../types';

/**
 * Nguồn: Ron.thepoolstudent, bài bank tránh double kiss anh lưu (https://www.facebook.com/share/r/14snmuLdn3H/). Ý chính
 * [nguồn]: chọn độ dày và phía đánh để bi cái rời khỏi đường bi mục tiêu bật về. [suy luận]: điểm chạm băng là điểm gương
 * (tâm bi ở x = 1 − 1.125", không throw); bi cái tiếp cận từ phía đầu bàn nên đường tiếp tuyến stun đi về phía chân bàn,
 * cách đường bank về ≥ 6". Ba độ cắt 10°, 20°, 30°, tip và ngưỡng 6/9 [đề xuất]. Engine (`drill109()` trong
 * `scripts/position-harness/main.swift`, bi cái thẳng sau bi 1, tipY −0.2): lực 1.2 và 1.6 không tới lỗ giữa, lực 2.2 vào với
 * điểm băng y 39.95" (cửa sổ 39.7–40.2"), lệch điểm vẽ −0.55", nên lực đặt 2.2 và giữ điểm vẽ. Chưa kiểm trên bàn thật.
 */
export const bankNoDoubleKiss = {
  id: '109',
  number: 109,
  title: 'Bank Without the Double Kiss',
  subtitle: 'Bank the 1 into the side and send the cue ball off the bank line. Path drawn, not simulated.',
  category: 'shotMaking',
  skill: 'bank',
  skillLabel: 'Bank',
  difficulty: 2,
  objective: 'Bank the 1 off the right rail into the left side pocket from three cut angles, three tries each.',
  cueBall: { x: 0.3959, y: 0.3733 },
  objectBalls: [{ number: 1, x: 0.72, y: 0.38 }],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallBankPath', points: [{ x: 0.72, y: 0.38 }, { x: 0.9775, y: 0.405 }, { x: 0, y: 0.5 }] },
    { kind: 'railContact', point: { x: 1, y: 0.405 } },
  ],
  recommendedContactPoint: { x: 0, y: -0.2 },
  recommendedSpin: 'stun',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 9,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'Before you shoot, trace where the 1 comes back off the rail. The cue ball must not sit on that line.',
    'Cut it from the side that sends the cue ball away from the return path, then stun so it leaves on the tangent.',
  ],
  mistakes: [
    'Hitting it full from the bank side: the cue ball parks on the return line and the 1 kisses it.',
    'Rolling the cue ball: follow drags it forward into the 1 on its way back.',
  ],
  rounds: [
    {
      title: '10° cut',
      spin: 'stun',
      speed: 2.2,
      contactPoint: { x: 0, y: -0.2 },
      cueBall: { x: 0.3959, y: 0.3733 },
      why: 'Thin side of the bank line. Stun sends the cue ball down the table, about 6" clear of the 1 coming back. Ron.thepoolstudent.',
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.72, y: 0.38 }, { x: 0.9775, y: 0.405 }, { x: 0, y: 0.5 }] },
        { kind: 'railContact', point: { x: 1, y: 0.405 } },
        { kind: 'expectedCuePath', points: [{ x: 0.3959, y: 0.3733 }, { x: 0.6758, y: 0.3757 }, { x: 0.6957, y: 0.3246 }] },
      ],
    },
    {
      title: '20° cut',
      spin: 'stun',
      speed: 2.2,
      contactPoint: { x: 0, y: -0.2 },
      cueBall: { x: 0.3993, y: 0.3976 },
      why: 'More cut, the cue ball leaves faster on the tangent. Same rail mark, same side of the line.',
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.72, y: 0.38 }, { x: 0.9775, y: 0.405 }, { x: 0, y: 0.5 }] },
        { kind: 'railContact', point: { x: 1, y: 0.405 } },
        { kind: 'expectedCuePath', points: [{ x: 0.3993, y: 0.3976 }, { x: 0.6758, y: 0.3757 }, { x: 0.715, y: 0.275 }] },
      ],
    },
    {
      title: '30° cut',
      spin: 'stun',
      speed: 2.2,
      contactPoint: { x: 0, y: -0.2 },
      cueBall: { x: 0.4111, y: 0.4213 },
      why: 'Widest cut. Aim stays on the mirror point; the cue ball is gone long before the 1 returns.',
      guideLines: [
        { kind: 'objectBallBankPath', points: [{ x: 0.72, y: 0.38 }, { x: 0.9775, y: 0.405 }, { x: 0, y: 0.5 }] },
        { kind: 'railContact', point: { x: 1, y: 0.405 } },
        { kind: 'expectedCuePath', points: [{ x: 0.4111, y: 0.4213 }, { x: 0.6758, y: 0.3757 }, { x: 0.7331, y: 0.2285 }] },
      ],
    },
  ],
} satisfies PoolDrill;
