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

  /** Bi cái và hai cực bi sọc theo bộ Aramith Tournament BLACK, khớp `TournamentBlackPalette.swift`. */
  cueBall: '#FBFAE9',
  stripePole: '#181818',
  /** Đĩa số trên bi. */
  ballDisc: '#FFFFFF',
  /** Số trên bi — luôn mực đen, không theo theme. */
  ballInk: '#111111',
  objectBall: '#F5C542',
  ghostBall: 'rgba(244, 241, 232, 0.35)',
  aimLine: 'rgba(244, 241, 232, 0.75)',
  cuePath: 'rgba(245, 197, 66, 0.9)',
  targetPocket: '#3DD68C',
  contactPoint: '#FF6369',
} as const;

/**
 * Màu giữa bi 1–10 theo bộ Aramith Tournament BLACK, cùng số với `TournamentBlackPalette.tones` bên native.
 * Bi 9–15 dùng màu của số trừ 8, sọc có hai cực đen.
 */
export const BallColor = {
  1: '#E99C00',
  2: '#053E7F',
  3: '#AF0022',
  4: '#F26D85',
  5: '#59478B',
  6: '#25916B',
  7: '#82441F',
  8: '#1D1D1D',
  9: '#E99C00',
  10: '#053E7F',
} as const;

export type BallNumber = keyof typeof BallColor;

/** Bi 9 trở lên là bi sọc. */
export const isStripe = (n: BallNumber) => n >= 9;
