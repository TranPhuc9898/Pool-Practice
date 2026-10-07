import type { PocketId, PoolDrill } from './types';

/** Kích thước tính bằng inch, khớp `PoolTableSpec` bên Swift. */
const PLAY_W = 50;
const PLAY_L = 100;
const BALL = 2.25;

const POCKET: Record<PocketId, { x: number; y: number }> = {
  footLeft: { x: 0, y: 0 },
  footRight: { x: PLAY_W, y: 0 },
  sideLeft: { x: 0, y: PLAY_L / 2 },
  sideRight: { x: PLAY_W, y: PLAY_L / 2 },
  headLeft: { x: 0, y: PLAY_L },
  headRight: { x: PLAY_W, y: PLAY_L },
};

export type Aim = {
  /** Góc cắt, độ. 0 là cú thẳng. */
  cutDeg: number;
  /** Phía cắt nhìn từ người cơ: điểm chạm nằm bên nào của tâm bi mục tiêu. */
  side: 'left' | 'right' | 'straight';
  /** Độ dày cú chạm, 1 là full ball. Bằng `1 − sin(cut)`. */
  fullness: number;
};

const unit = (x: number, y: number) => {
  const len = Math.max(Math.hypot(x, y), 1e-4);
  return { x: x / len, y: y / len };
};

/**
 * Ghost ball: tâm bi cái lúc chạm nằm lùi một đường kính từ bi mục tiêu, ngược hướng lỗ.
 * Mirror của `PoolAim` trong `modules/pool-table/ios/Aim/PoolAimView.swift`.
 */
export function aimOf(drill: PoolDrill): Aim | null {
  const guide = drill.guideLines.find((g) => g.kind === 'objectBallPath' || g.kind === 'ghostBall');
  const number = guide && 'ball' in guide ? guide.ball : drill.objectBalls[0]?.number;
  const ball = drill.objectBalls.find((b) => b.number === number);
  if (!ball) return null;

  const pocket = POCKET[guide && 'pocket' in guide ? guide.pocket : drill.targetPocket];
  const o = { x: ball.x * PLAY_W, y: ball.y * PLAY_L };
  const cue = { x: drill.cueBall.x * PLAY_W, y: drill.cueBall.y * PLAY_L };
  const d = unit(pocket.x - o.x, pocket.y - o.y);
  const ghost = { x: o.x - d.x * BALL, y: o.y - d.y * BALL };
  const a = unit(ghost.x - cue.x, ghost.y - cue.y);
  // Hệ y hướng xuống: bên phải của hướng ngắm là (−a.y, a.x).
  const side = Math.max(-1, Math.min(1, -(d.x * -a.y + d.y * a.x)));
  const cutDeg = Math.round((Math.asin(Math.abs(side)) * 180) / Math.PI);

  return {
    cutDeg,
    side: cutDeg === 0 ? 'straight' : side > 0 ? 'right' : 'left',
    fullness: 1 - Math.abs(side),
  };
}

/** Gọi tên theo phân số quen thuộc của người chơi: full, ¾, ½, ¼, thin. */
export function fullnessLabel(fullness: number) {
  const marks = [
    [1, 'Full ball'],
    [0.75, '¾ ball'],
    [0.5, '½ ball'],
    [0.25, '¼ ball'],
    [0.08, 'Thin'],
  ] as const;
  const [value, label] = marks.reduce((best, m) => (Math.abs(m[0] - fullness) < Math.abs(best[0] - fullness) ? m : best));
  return Math.abs(value - fullness) < 0.04 ? label : `≈ ${label}`;
}
