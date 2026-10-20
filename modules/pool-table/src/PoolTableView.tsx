import { requireNativeView } from 'expo';
import type { ViewProps } from 'react-native';

/**
 * Hình dạng mà Swift decode được (`ios/Drills/DrillRecord.swift`).
 * `PoolDrill` của app khớp cấu trúc nên truyền thẳng được, trường thừa bị bỏ qua.
 */
export type NativePoint = { x: number; y: number };
export type NativeBall = NativePoint & { number: number };
export type NativeTargetZone =
  | { kind: 'circle'; center: NativePoint; radius: number; label?: string }
  | { kind: 'ellipse'; center: NativePoint; radiusX: number; radiusY: number; label?: string };
export type NativeGuideLine =
  | { kind: 'objectBallPath' | 'cueBallPath' | 'ghostBall' | 'tangentLine'; ball: number; pocket: string }
  | { kind: 'expectedCuePath' | 'objectBallBankPath'; points: NativePoint[] }
  | { kind: 'railContact'; point: NativePoint };
export type NativeDrill = {
  id: string;
  cueBall: NativePoint;
  objectBalls: readonly NativeBall[];
  targetPocket: string;
  cueBallTargetZones: readonly NativeTargetZone[];
  guideLines: readonly NativeGuideLine[];
  /** Đường bi cái ghi sẵn, khớp `CueReplay` của `src/pool-engine/types.ts`. Có thì Play diễn lại nó thay cho engine. */
  replay?: { dt: number; contact: number; xy: readonly number[] };
};

/** Toạ độ chuẩn hoá (3 số lẻ) của bi vừa thả; `ball` 0 là bi cái. */
export type BallMoveEvent = { ball: number; x: number; y: number };

export type PoolTableViewProps = ViewProps & {
  drill: NativeDrill;
  showGeometry?: boolean;
  /** Mặc định bật. Tắt thì mất mọi đường guide, target zone vẫn còn. */
  showGuide?: boolean;
  /** Từng nhóm guide, đều mặc định bật và chỉ có tác dụng khi `showGuide` bật. */
  showGhostBall?: boolean;
  /** Gồm cả điểm chạm băng. */
  showTangentLine?: boolean;
  /** Đường bi cái tới bi mục tiêu và đường bi cái dự kiến sau va chạm. */
  showCuePath?: boolean;
  /** Target zone của bi cái. */
  showTarget?: boolean;
  /** Dev: kéo được bi, nhãn x/y lúc kéo. */
  devMode?: boolean;
  onBallMove?: (event: { nativeEvent: BallMoveEvent }) => void;
};

export const PoolTableView = requireNativeView<PoolTableViewProps>('PoolTable', 'PoolTableView');

export const PoolBallRackView = requireNativeView<ViewProps>('PoolTable', 'PoolBallRackView');

/** Góc nhìn người cơ: bi mục tiêu phóng to, điểm chạm, ghost ball, cây cơ. */
export const PoolAimView = requireNativeView<ViewProps & { drill: NativeDrill }>('PoolTable', 'PoolAimView');
