/**
 * Màu của miền bida — bàn, bi, đường ngắm. TÁCH khỏi design system:
 * nhận diện app vẫn là đen / ngà / vàng; màu ở đây chỉ dùng trong hình vẽ bàn và bi.
 */
export const PoolColor = {
  tableGreen: '#0E5A3A',
  tableCloth: '#11694A',
  tableRail: '#1C1C1C',
  tablePocket: '#030303',
  diamond: '#E9E4D4',

  cueBall: '#F4F1E8',
  /** Số trên bi — luôn mực đen, không theo theme. */
  ballInk: '#111111',
  objectBall: '#F5C542',
  ghostBall: 'rgba(244, 241, 232, 0.35)',
  aimLine: 'rgba(244, 241, 232, 0.75)',
  cuePath: 'rgba(245, 197, 66, 0.9)',
  targetPocket: '#3DD68C',
  contactPoint: '#FF6369',
} as const;

/** Màu chuẩn bi số 1–10 (bộ WPA). Bi 9 sọc vàng, bi 10 sọc xanh dương. */
export const BallColor = {
  1: '#F2C230',
  2: '#1F4FB8',
  3: '#D3322C',
  4: '#5B2A86',
  5: '#E8752A',
  6: '#1E7A46',
  7: '#7A2A22',
  8: '#111111',
  9: '#F2C230',
  10: '#1F4FB8',
} as const;

export type BallNumber = keyof typeof BallColor;

/** Bi 9 trở lên là bi sọc. */
export const isStripe = (n: BallNumber) => n >= 9;
