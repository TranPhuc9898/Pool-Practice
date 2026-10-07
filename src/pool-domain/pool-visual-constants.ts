/**
 * Tỉ lệ hình học bàn bida để vẽ sơ đồ drill. Đơn vị là tỉ lệ so với chiều dài mặt bàn,
 * nên vẽ ở cỡ nào cũng đúng — không cố định pixel.
 */
export const PoolTable = {
  /** Mặt chơi 9ft: 100 × 50 inch → 2:1. */
  aspectRatio: 2,
  /** Băng so với chiều dài mặt chơi. */
  railRatio: 0.045,
  /** Đường kính bi 2.25" trên 100". */
  ballRatio: 0.0225,
  /** Miệng lỗ góc ~4.5" trên 100". */
  pocketRatio: 0.045,
  /** Cạnh dài chia 8 khoảng (6 diamond + lỗ giữa), cạnh ngắn chia 4 (3 diamond). */
  diamondsLong: 6,
  diamondsShort: 3,
} as const;

export const PoolStroke = {
  aimLine: 1.5,
  cuePath: 2,
  ghostBallDash: [4, 4] as const,
} as const;

export const GameType = {
  nineBall: { id: 'nine-ball', label: '9-Ball', balls: 9 },
  tenBall: { id: 'ten-ball', label: '10-Ball', balls: 10 },
} as const;

export type GameTypeId = (typeof GameType)[keyof typeof GameType]['id'];
