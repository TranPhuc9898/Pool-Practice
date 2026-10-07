/**
 * Raw palette — the ONLY place hex values live.
 * Views never import this file; they use semantic tokens via `useTheme().color`.
 */
const palette = {
  // MONO DARK — giữ lại để đổi theme một dòng. Surface tách nhau từng bậc ~8.
  black: '#000000',
  ash950: '#050505',
  ash900: '#0D0D0D',
  ash850: '#161616',
  ash800: '#1F1F1F',
  ash700: '#4D4D4D',
  ash500: '#8A8A8A',
  ash300: '#BDBDBD',
  ash200: '#D9D9D9',

  white: '#FFFFFF',

  // MONO LIGHT — theme đang dùng. Nền xám giấy, card trắng tách bằng bóng chứ không bằng viền.
  mono50: '#F7F7F7',
  mono75: '#F4F4F4',
  mono100: '#EFEFEF',
  mono300: '#B0B0B0',
  mono500: '#6B6B6B',
  mono700: '#3A3A3A',
  mono800: '#262626',
  mono950: '#0A0A0A',

  // GOLD — màu nhấn duy nhất, dè sẻn: CTA của card hero, đường guide. Không tô nền, không tô icon tab.
  gold500: '#C9A45C',
  gold700: '#8A6A2A',
} as const;

const alpha = (hex: string, opacity: number) => {
  const a = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
};

/**
 * MONO DARK — nền đen thuần, chữ trắng, không màu nhấn. "Accent" là trắng: nút chính trắng chữ đen.
 * Trạng thái (pass/fail) phân biệt bằng hình (đặc / rỗng), không bằng màu.
 * Contrast trên #0D0D0D: white 19.4:1, ash300 10.6:1, ash500 5.6:1.
 */
export const darkColors = {
  backgroundPrimary: palette.black,
  backgroundSecondary: palette.ash950,
  surfacePrimary: palette.ash900,
  surfaceElevated: palette.ash850,
  surfacePressed: palette.ash800,

  textPrimary: palette.white,
  textSecondary: palette.ash300,
  textTertiary: palette.ash500,
  textDisabled: palette.ash700,
  textInverse: palette.black,

  accent: palette.white,
  accentPressed: palette.ash200,
  accentStrong: palette.white,
  accentWarm: palette.ash200,
  accentMuted: alpha(palette.white, 0.08),
  accentContent: palette.white,
  /** Gold trên #000: 8.95:1, trên #131313: 7.9:1. */
  accentGold: palette.gold500,
  onAccent: palette.black,
  onAccentSecondary: alpha(palette.black, 0.64),

  /** Bề mặt nổi bật nhất màn: xám than sáng hơn surface một bậc, không đảo trắng. */
  surfaceInverse: palette.ash850,
  onSurfaceInverse: palette.white,
  onSurfaceInverseSecondary: palette.ash300,

  borderSubtle: alpha(palette.white, 0.06),
  borderPrimary: alpha(palette.white, 0.1),
  borderStrong: alpha(palette.white, 0.18),
  borderAccent: palette.white,

  /** Chỉ còn cho dải tiến độ (DotProgress, DotBar, ring): cần thấy tổng số ô. Dot-matrix không dùng. */
  dotInactive: alpha(palette.white, 0.12),
  glow: 'transparent',

  success: palette.white,
  successMuted: alpha(palette.white, 0.08),
  warning: palette.ash300,
  warningMuted: alpha(palette.white, 0.08),
  error: palette.white,
  errorMuted: alpha(palette.white, 0.08),

  overlay: alpha(palette.black, 0.7),
} as const;

export type ColorTokens = { [K in keyof typeof darkColors]: string };

/**
 * MONO LIGHT — nền xám giấy, card trắng, mực đen. "Accent" là mực đen: nút chính đen chữ trắng.
 * Mỗi màn có đúng một bảng điểm đen (`surfaceInverse`) — chỗ duy nhất có số dot-matrix.
 * Trạng thái (pass/fail) phân biệt bằng hình (đặc / rỗng), không bằng màu.
 * Contrast tính trên trắng: mono950 19.8:1, mono700 11.4:1, mono500 5.3:1.
 */
export const lightColors: ColorTokens = {
  backgroundPrimary: palette.mono75,
  backgroundSecondary: palette.mono50,
  surfacePrimary: palette.white,
  surfaceElevated: palette.white,
  surfacePressed: palette.mono100,

  textPrimary: palette.mono950,
  textSecondary: palette.mono700,
  textTertiary: palette.mono500,
  textDisabled: palette.mono300,
  textInverse: palette.white,

  accent: palette.mono950,
  accentPressed: palette.mono800,
  accentStrong: palette.mono950,
  accentWarm: palette.mono800,
  accentMuted: alpha(palette.mono950, 0.06),
  accentContent: palette.mono950,
  /** Gold đậm cho nền sáng: 5.0:1 trên trắng. */
  accentGold: palette.gold700,
  onAccent: palette.white,
  onAccentSecondary: alpha(palette.white, 0.7),

  surfaceInverse: palette.mono950,
  onSurfaceInverse: palette.white,
  onSurfaceInverseSecondary: alpha(palette.white, 0.62),

  borderSubtle: alpha(palette.mono950, 0.06),
  borderPrimary: alpha(palette.mono950, 0.1),
  borderStrong: alpha(palette.mono950, 0.18),
  borderAccent: palette.mono950,

  /** Rãnh của DotProgress, SegmentBar, MeterBar: cần thấy tổng số ô. Dot-matrix không dùng. */
  dotInactive: alpha(palette.mono950, 0.09),
  glow: 'transparent',

  success: palette.mono950,
  successMuted: alpha(palette.mono950, 0.06),
  warning: palette.mono700,
  warningMuted: alpha(palette.mono950, 0.06),
  error: palette.mono950,
  errorMuted: alpha(palette.mono950, 0.06),

  overlay: alpha(palette.mono950, 0.4),
};
export type ColorToken = keyof ColorTokens;
