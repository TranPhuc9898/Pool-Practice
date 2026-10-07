/** Spacing — base 4pt. */
export const spacing = {
  none: 0,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  section: 64,
} as const;

export const radius = {
  none: 0,
  small: 8,
  medium: 12,
  large: 16,
  card: 20,
  xLarge: 24,
  xxLarge: 32,
  pill: 999,
} as const;

/** Border widths. Màu border lấy từ color token (`borderSubtle`, `borderPrimary`…). */
export const borderWidth = {
  hairline: 0.5,
  normal: 1,
  strong: 1.5,
  focus: 2,
} as const;

export const iconSize = {
  small: 16,
  medium: 20,
  large: 24,
  xLarge: 32,
} as const;

export const layout = {
  gutter: 20,
  gutterCompact: 16,
  gutterLarge: 24,
  /** Dưới ngưỡng này (iPhone SE, mini) dùng gutterCompact. */
  compactBreakpoint: 375,
  /** Trên ngưỡng này (iPad) dùng gutterLarge. */
  largeBreakpoint: 700,
  maxContentWidth: 720,
  minTouchTarget: 44,
  buttonHeight: 52,
  buttonHeightCompact: 44,
  inputHeight: 52,
  rowHeight: 56,
} as const;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
export type IconSizeToken = keyof typeof iconSize;
