import { Platform, type TextStyle } from 'react-native';

/**
 * Font families. Đổi font cả app: đổi map này + danh sách load trong `fonts.ts`.
 * iOS cần mỗi weight là một family riêng với font custom, nên weight nằm ở đây, không ở `fontWeight`.
 */
export const fontFamily = {
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semibold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
  heavy: 'Outfit_800ExtraBold',
  /** SF Mono trên iOS (Fabric map `ui-monospace` → system monospaced). Nhãn kỹ thuật, số liệu nhỏ. */
  mono: Platform.select({ ios: 'ui-monospace', default: 'monospace' }),
} as const;

type TypeStyle = Required<Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing'>> &
  Pick<TextStyle, 'fontWeight' | 'textTransform'> & {
  /** Trần Dynamic Type. Chữ to không cần phóng tới 200%, chữ thân thì cần. */
  maxScale: number;
};

const style = (
  family: keyof typeof fontFamily,
  fontSize: number,
  lineHeight: number,
  letterSpacing: number,
  maxScale: number,
  extra?: Pick<TextStyle, 'fontWeight' | 'textTransform'>,
): TypeStyle => ({ fontFamily: fontFamily[family], fontSize, lineHeight, letterSpacing, maxScale, ...extra });

/** Tracking âm cho chữ to, gần 0 cho chữ thân. Leading chặt ở tiêu đề, thoáng ở thân. */
export const typography = {
  /** Tên app trên Home: "POOL TRAINING". */
  displayXL: style('heavy', 48, 48, -1.8, 1.2, { textTransform: 'uppercase' }),
  displayLarge: style('heavy', 40, 44, -1.4, 1.3),
  display: style('bold', 34, 38, -0.9, 1.3),
  title1: style('semibold', 28, 32, -0.6, 1.4),
  title2: style('semibold', 24, 28, -0.4, 1.5),
  title3: style('semibold', 20, 25, -0.2, 1.6),
  headline: style('semibold', 17, 22, -0.1, 2),
  bodyLarge: style('regular', 17, 24, 0, 2),
  body: style('regular', 15, 21, 0, 2),
  callout: style('medium', 14, 19, 0, 2),
  caption: style('regular', 13, 17, 0.1, 2),
  captionSmall: style('medium', 11, 13, 0.4, 2),
  buttonLarge: style('semibold', 17, 22, -0.1, 1.6),
  button: style('semibold', 15, 20, 0, 1.6),
  metricLarge: style('bold', 44, 46, -1.5, 1.2),
  metric: style('bold', 28, 30, -0.8, 1.3),
  /** Nhãn in hoa nhỏ trên tiêu đề: "TODAY'S TRAINING". */
  eyebrow: style('semibold', 12, 16, 0.9, 1.6, { textTransform: 'uppercase' }),
  /** Nhãn kỹ thuật in hoa, tracking rộng: "CUE CONTROL", "STOP". */
  label: style('medium', 11, 14, 1.6, 1.6, { textTransform: 'uppercase' }),
  mono: style('mono', 13, 18, 0.2, 1.8, { fontWeight: '500' }),
  /** Nhãn số nhỏ trên gauge, mã drill: "02". */
  monoSmall: style('mono', 11, 14, 0.4, 1.6, { fontWeight: '500' }),
  /** Tên drill giữa card hero. Medium, không semibold: số to đã đủ nặng. */
  heroTitle: style('medium', 26, 31, -0.4, 1.4),
  /** Tên ô bento và ô Quick Practice. */
  tileTitle: style('medium', 17, 21, -0.1, 1.6),
} as const;

export type TypographyToken = keyof typeof typography;
