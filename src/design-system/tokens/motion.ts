import { cubicBezier, Easing, ReduceMotion } from 'react-native-reanimated';

/**
 * Motion tokens. Không có ease-in ở đây, cố ý.
 * `curve` dùng cho Reanimated CSS transitions; `easing` dùng cho withTiming.
 */
export const duration = {
  press: 120,
  quick: 150,
  standard: 250,
  smooth: 350,
} as const;

export const curve = {
  /** Vào, ra, đổi trạng thái — mặc định. */
  easeOut: cubicBezier(0.23, 1, 0.32, 1),
  /** Dời chỗ trên màn. */
  easeInOut: cubicBezier(0.77, 0, 0.175, 1),
} as const;

export const easing = {
  easeOut: Easing.bezier(0.23, 1, 0.32, 1),
  easeInOut: Easing.bezier(0.77, 0, 0.175, 1),
} as const;

/**
 * Spring theo tham số Apple (dampingRatio + duration).
 * `snappy` cho đổi trạng thái không có tay. `release` cho lúc thả gesture — truyền `velocity` vào.
 */
export const spring = {
  snappy: { duration: 300, dampingRatio: 1, reduceMotion: ReduceMotion.System },
  release: { duration: 350, dampingRatio: 0.8, reduceMotion: ReduceMotion.System },
  gentle: { duration: 450, dampingRatio: 1, reduceMotion: ReduceMotion.System },
} as const;

export const pressScale = 0.97;
