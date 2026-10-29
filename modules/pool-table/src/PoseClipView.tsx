import { requireNativeView } from 'expo';
import type { ViewProps } from 'react-native';

/** Trục cơ chấm tay, pixel ảnh đứng gốc trên trái, kèm `t` giây của khung đã chấm. */
export type ClipAxis = { ax: number; ay: number; bx: number; by: number; t: number };

/** Cỡ ảnh đứng sau khi xoay theo hướng quay, fps danh nghĩa và độ dài clip, giây. */
export type ClipInfo = { width: number; height: number; fps: number; duration: number };

/** Xong thì có `frames`; không đọc được clip thì chỉ có `error`. */
export type ClipAnalyzed = {
  frames?: number;
  armRatio?: number;
  seconds?: number;
  /** Ảnh trôi xa nhất so với khung đầu vì máy rung, pixel ảnh đứng. */
  shake?: number;
  error?: string;
};

/** Pha cú từ sau lưng. `unknown` là không đủ bằng chứng; `follow` tính từ lúc cổ tay vượt vị trí address. */
export type ClipPhase =
  | 'unknown'
  | 'address'
  | 'practice'
  | 'backswing'
  | 'pause'
  | 'forward'
  | 'follow'
  | 'complete';

/**
 * Một cú tìm từ dãy pha. Lệch so với trục tham chiếu đã bù rung máy, pixel ảnh đứng, `…L` là bội số cẳng tay; chưa có
 * trục thì vắng. `source` là "manual" khi trong cú có khung đã sửa pha tay. `confidence` 0…1.
 */
export type ClipStroke = {
  n: number;
  start: number;
  end: number;
  pause?: number;
  confidence: number;
  source: 'auto' | 'manual';
  addressWrist?: number;
  addressWristL?: number;
  backWrist?: number;
  backWristL?: number;
  followWrist?: number;
  followWristL?: number;
  elbowRange?: number;
  elbowRangeL?: number;
  /** Trục cơ dò được so với tham chiếu ở ba mốc, độ. Thử nghiệm. */
  addressCue?: number;
  backCue?: number;
  followCue?: number;
  /** Độ tin cậy thấp nhất của trục cơ dò được ở ba mốc, 0–1. */
  cueConfidence?: number;
};

/**
 * Khung đang xem. Số đo so với trục tham chiếu `axes[0]`, ảnh 2D: pixel ảnh đứng, `…L` là bội số cẳng tay của chính
 * khung đó, không phải mm. Dương là phía phải của ảnh. Thiếu khớp hoặc chưa có trục thì trường đó vắng.
 */
export type ClipFrame = {
  t: number;
  index: number;
  frames: number;
  phase?: ClipPhase;
  wrist?: number;
  elbow?: number;
  wristL?: number;
  elbowL?: number;
  /** Cẳng tay so với trục, độ. */
  forearmToAxis?: number;
  forearmLean?: number;
  /** Cẳng tay, pixel ảnh đứng. */
  L?: number;
  /** Trục cơ dò được ở khung này so với tham chiếu, độ. Thử nghiệm: dò theo cạnh sáng tối quanh trục đã chấm. */
  cueDeviation?: number;
  /** Lệch ngang trung điểm trục cơ dò được so với tham chiếu, pixel ảnh đứng. */
  cueOffset?: number;
  /** 0–1, tỉ lệ mặt cắt khớp nhân độ phủ dọc cơ. */
  cueConfidence?: number;
  /** Dò mất cơ ba khung liền, cần chấm lại trục. */
  cueLost: boolean;
  /** Đang dò cơ nền. */
  cueTracking: boolean;
};

export type PoseClipViewProps = ViewProps & {
  /** `file://` của video. Đổi thì huỷ lượt phân tích cũ và chạy lại. */
  uri: string;
  hand?: 'right' | 'left';
  /** Bật thì hai lần chạm trên video thành một trục, phát `onAxis`. */
  marking?: boolean;
  /** Trục đầu là tham chiếu. */
  axes?: ClipAxis[];
  onInfo?: (event: { nativeEvent: ClipInfo }) => void;
  onProgress?: (event: { nativeEvent: { fraction: number } }) => void;
  onAnalyzed?: (event: { nativeEvent: ClipAnalyzed }) => void;
  /** `deviation` là góc so với trục tham chiếu, độ; vắng khi đây là trục đầu. */
  onAxis?: (event: { nativeEvent: ClipAxis & { deviation?: number } }) => void;
  onFrame?: (event: { nativeEvent: ClipFrame }) => void;
  /** Phát lại mỗi khi pha tự bắt xong, pha được sửa tay, hoặc trục tham chiếu đổi. */
  onStrokes?: (event: { nativeEvent: { strokes: ClipStroke[] } }) => void;
};

export const PoseClipView = requireNativeView<PoseClipViewProps>('PoolTable', 'PoseClipView');

export type TrendPoint = { at: number; value: number; baseline: boolean };

export type PoseTrendViewProps = ViewProps & {
  /** Trung vị mỗi phiên của một số đo, `at` mili giây epoch. */
  points: TrendPoint[];
  unit: string;
};

/** Swift Charts: trung vị từng phiên theo thời gian, baseline là vạch xanh. */
export const PoseTrendView = requireNativeView<PoseTrendViewProps>('PoolTable', 'PoseTrendView');
