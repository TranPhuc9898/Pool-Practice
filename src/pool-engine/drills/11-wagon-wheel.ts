import type { PoolDrill } from '../types';

/** BU Exam I F7, chuyển sang bàn dọc. Vị trí 10 target là suy luận, chưa có diagram gốc. */
export const wagonWheel = {
  id: '11',
  number: 11,
  title: 'Wagon Wheel',
  subtitle: 'One pot, ten directions. Send the cue ball to every rail.',
  category: 'cueBallControl',
  skill: 'wagonWheel',
  skillLabel: 'Position Anywhere',
  difficulty: 4,
  objective: 'Pot the 1 in the side, then stop the cue ball on target 1 to 10. Two tries each.',
  // Quét cả bàn trên sim (trần 4,5 m/s): chỗ duy nhất đánh vào được cả 10 vùng mà không dời bi.
  cueBall: { x: 0.36, y: 0.3 },
  objectBalls: [{ number: 1, x: 0.12, y: 0.47 }],
  targetPocket: 'sideLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.06, y: 0.15 }, radius: 0.06, label: '1' },
    { kind: 'circle', center: { x: 0.5, y: 0.03 }, radius: 0.06, label: '2' },
    { kind: 'circle', center: { x: 0.94, y: 0.12 }, radius: 0.06, label: '3' },
    { kind: 'circle', center: { x: 0.94, y: 0.3 }, radius: 0.06, label: '4' },
    { kind: 'circle', center: { x: 0.94, y: 0.5 }, radius: 0.06, label: '5' },
    { kind: 'circle', center: { x: 0.94, y: 0.7 }, radius: 0.06, label: '6' },
    { kind: 'circle', center: { x: 0.94, y: 0.88 }, radius: 0.06, label: '7' },
    { kind: 'circle', center: { x: 0.5, y: 0.97 }, radius: 0.06, label: '8' },
    { kind: 'circle', center: { x: 0.06, y: 0.85 }, radius: 0.06, label: '9' },
    { kind: 'circle', center: { x: 0.06, y: 0.7 }, radius: 0.06, label: '10' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'sideLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'sideLeft' },
    { kind: 'tangentLine', ball: 1, pocket: 'sideLeft' },
  ],
  // Cú mở màn trước khi chọn đích, quét trên sim từ chỗ bi cái: ⅓ phải, nhỉnh trên, firm 2,6 m/s → dừng cách tâm vùng 10
  // 1,8". Phê phải 0,2…0,4 đều vào vùng 10. Đánh giữa ở medium hay firm không vào vùng nào.
  recommendedContactPoint: { x: 0.3, y: 0.1 },
  recommendedSpin: 'center',
  recommendedSpeed: 'firm',
  allowedRails: 3,
  attemptCount: 20,
  passCondition: { kind: 'inZone', required: 14 },
  tips: [
    'Same spot for all ten targets: spin and speed do the steering. Tap a target to see the shot.',
    'A rail-first hit counts only if it lands right next to the target.',
  ],
} satisfies PoolDrill;
