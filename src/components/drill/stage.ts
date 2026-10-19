import type { PoolDrill } from "@/pool-engine/types";

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

/**
 * Drill bank: điểm thứ hai của `objectBallBankPath` là chỗ bi 1 chạm băng, đổi sang đích băng của `ShotPhysics` để
 * ghost, ô Ngắm và vạch bi cái nhắm vào điểm bank thay vì thẳng vào lỗ.
 */
export function bankTarget(d: PoolDrill): string | undefined {
  const g = d.guideLines.find((l) => l.kind === "objectBallBankPath");
  const b = g?.kind === "objectBallBankPath" ? g.points[1] : undefined;
  if (!b) return undefined;
  if (b.x >= 0.97) return `railRight@${(b.y * 100).toFixed(1)}`;
  if (b.x <= 0.03) return `railLeft@${(b.y * 100).toFixed(1)}`;
  if (b.y <= 0.03) return `railFoot@${(b.x * PLAY_WIDTH).toFixed(1)}`;
  if (b.y >= 0.97) return `railHead@${(b.x * PLAY_WIDTH).toFixed(1)}`;
  return undefined;
}

/**
 * `rev` theo số drill và mức khoảng cách: Prev/Next hay đổi mức là Swift nạp lại thế bi.
 * Bài chỉ có bi cái (Stroke): ngắm thẳng lên băng cuối, đích băng `railFoot@<inch>` ngay trước bi cái.
 * Bài có `shots`: tip và lực đúng cú 1 trong data, khớp cú native chơi khi bấm Play.
 */
export const stageState = (d: PoolDrill, diamonds: number): EditorState => ({
  rev: d.number * 10 + diamonds,
  balls: [{ number: 0, ...d.cueBall }, ...d.objectBalls],
  aimBall: d.objectBalls[0]?.number ?? -1,
  aimPocket: d.objectBalls.length
    ? bankTarget(d) ?? d.targetPocket
    : `railFoot@${(d.cueBall.x * PLAY_WIDTH).toFixed(1)}`,
  tipX: d.shots ? 0 : d.recommendedContactPoint.x,
  tipY: d.shots?.[0].tipY ?? d.recommendedContactPoint.y,
  speed: d.shots?.[0].speed ?? speedMs[d.recommendedSpeed],
  theta: 0,
});
