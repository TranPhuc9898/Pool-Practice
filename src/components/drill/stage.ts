import type { NormalizedPoint, PoolDrill } from "@/pool-engine/types";

import type { EditorState } from "../../../modules/pool-table";

export const spinLabel: Record<PoolDrill["recommendedSpin"], string> = {
  center: "Center",
  stun: "Stun",
  follow: "Follow",
  draw: "Draw",
};

/** Tổng cả băng: 61" × 111". Khung bàn giữ đúng tỉ lệ này thì native không chừa dải trống. */
export const TABLE_ASPECT = 111 / 61;
/** Bàn dọc chiếm nửa bề ngang khối, nửa kia là hai ô Ngắm / Dày mỏng; 12 là khe giữa, khớp Swift. */
const STAGE_TABLE_SHARE = 0.5;
const STAGE_GAP = 12;

/** Cao của khối bàn `stageOnly` theo bề ngang. */
export const stageHeightFor = (width: number) =>
  (width - STAGE_GAP) * STAGE_TABLE_SHARE * TABLE_ASPECT;

/** m/s, cùng thang thanh Lực của Soạn bài: Chậm < 0,89 ≤ Vừa < 1,9 ≤ Nhanh. */
export const speedMs: Record<PoolDrill["recommendedSpeed"], number> = {
  soft: 0.8,
  medium: 1.8,
  firm: 2.6,
};

/** Bề ngang mặt chơi, inch, khớp `ShotPhysics.width`. */
const PLAY_WIDTH = 50;

/** Điểm chuẩn hoá trên băng đổi sang đích băng của `ShotPhysics`, undefined nếu điểm không nằm sát băng nào. */
function railAt(b: NormalizedPoint): string | undefined {
  if (b.x >= 0.97) return `railRight@${(b.y * 100).toFixed(1)}`;
  if (b.x <= 0.03) return `railLeft@${(b.y * 100).toFixed(1)}`;
  if (b.y <= 0.03) return `railFoot@${(b.x * PLAY_WIDTH).toFixed(1)}`;
  if (b.y >= 0.97) return `railHead@${(b.x * PLAY_WIDTH).toFixed(1)}`;
  return undefined;
}

/**
 * Drill bank: điểm thứ hai của `objectBallBankPath` là chỗ bi 1 chạm băng, đổi sang đích băng của `ShotPhysics` để
 * ghost, ô Ngắm và vạch bi cái nhắm vào điểm bank thay vì thẳng vào lỗ.
 */
export function bankTarget(d: PoolDrill): string | undefined {
  const g = d.guideLines.find((l) => l.kind === "objectBallBankPath");
  const b = g?.kind === "objectBallBankPath" ? g.points[1] : undefined;
  return b && railAt(b);
}

const POCKETS: NormalizedPoint[] = [0, 0.5, 1].flatMap((y) => [{ x: 0, y }, { x: 1, y }]);

/**
 * Bài chỉ đánh bi cái, bi khác trên bàn (nếu có) là cổng hay vật cản: `expectedCuePath` đúng hai điểm, điểm đầu là
 * bi cái. Điểm cuối sát lỗ thì đích là `targetPocket`, sát băng thì là đích băng đó.
 */
export function cueOnlyTarget(d: PoolDrill): string | undefined {
  const g = d.guideLines.find((l) => l.kind === "expectedCuePath");
  if (g?.kind !== "expectedCuePath" || g.points.length !== 2) return undefined;
  const [a, b] = g.points;
  if (Math.hypot(a.x - d.cueBall.x, a.y - d.cueBall.y) > 0.005) return undefined;
  return POCKETS.some((p) => Math.hypot(p.x - b.x, p.y - b.y) < 0.04) ? d.targetPocket : railAt(b);
}

/** Bi `objectBallPath` vẽ, khi nó có trên bàn: round không đánh bi số nhỏ nhất (bi 9 xen giữa hàng ở drill 120). */
const guideBall = (d: PoolDrill): number | undefined => {
  const g = d.guideLines.find((l) => l.kind === "objectBallPath");
  return g?.kind === "objectBallPath" && d.objectBalls.some((b) => b.number === g.ball) ? g.ball : undefined;
};

/**
 * `rev` theo số drill và mức khoảng cách: Prev/Next hay đổi mức là Swift nạp lại thế bi.
 * Bài chỉ có bi cái (Stroke): ngắm thẳng lên băng cuối, đích băng `railFoot@<inch>` ngay trước bi cái.
 * Bài chỉ đánh bi cái có đích riêng (`cueOnlyTarget`): không bi mục tiêu, native đánh bi cái về đích đó.
 * Bài có `shots`: tip và lực đúng cú 1 trong data, khớp cú native chơi khi bấm Play.
 */
export const stageState = (d: PoolDrill, diamonds: number): EditorState => {
  const cueOnly = cueOnlyTarget(d);
  return {
    rev: d.number * 10 + diamonds,
    balls: [{ number: 0, ...d.cueBall }, ...d.objectBalls],
    aimBall: cueOnly ? -1 : (guideBall(d) ?? d.objectBalls[0]?.number ?? -1),
    aimPocket:
      cueOnly ??
      (d.objectBalls.length
        ? bankTarget(d) ?? d.targetPocket
        : `railFoot@${(d.cueBall.x * PLAY_WIDTH).toFixed(1)}`),
    tipX: d.shots ? (d.shots[0].tipX ?? 0) : d.recommendedContactPoint.x,
    tipY: d.shots?.[0].tipY ?? d.recommendedContactPoint.y,
    speed: d.shots?.[0].speed ?? speedMs[d.recommendedSpeed],
    theta: 0,
  };
};
