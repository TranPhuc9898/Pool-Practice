import { memo, useEffect, useRef, useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { useTheme } from '../../theme';
import type { ColorToken } from '../../tokens/color';
import type { DotMatrixSize } from '../../tokens/material';

/**
 * Font 5×7 chấm cho số liệu. Mỗi hàng là một chuỗi bit, trái sang phải.
 * Ký tự hẹp (`:` `.`) và `°` có bề rộng riêng để số không bị thưa.
 */
const GLYPHS: Record<string, readonly string[]> = {
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
  '%': ['11001', '11010', '00010', '00100', '01000', '01011', '10011'],
  ':': ['0', '0', '1', '0', '1', '0', '0'],
  '.': ['0', '0', '0', '0', '0', '0', '1'],
  '°': ['010', '101', '010', '000', '000', '000', '000'],
  '+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  ' ': ['000', '000', '000', '000', '000', '000', '000'],
};

export type DotMatrixDisplayProps = {
  /** Chỉ `0-9 % : . ° + - /` và dấu cách. Ký tự lạ thành dấu cách. */
  text: string;
  size?: DotMatrixSize;
  color?: ColorToken;
  /** Quầng sáng quanh chấm đang sáng. Chỉ cho số chính của màn, không rải khắp nơi. */
  glow?: boolean;
  /** Chuỗi đọc cho VoiceOver. Mặc định là `text`. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Hiển thị chuỗi bằng chấm. Chấm đổi trạng thái thì mờ chuyển 90ms, quét theo cột như LED. */
export function DotMatrixDisplay({
  text,
  size = 'md',
  color = 'textPrimary',
  glow = false,
  accessibilityLabel,
  style,
}: DotMatrixDisplayProps) {
  const t = useTheme();
  const m = t.dot[size];
  return (
    <View
      style={[{ flexDirection: 'row', gap: m.glyphGap }, style]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? text}>
      {Array.from(text).map((ch, i) => (
        <Glyph key={i} rows={GLYPHS[ch] ?? GLYPHS[' ']} size={size} color={color} glow={glow} />
      ))}
    </View>
  );
}

const Glyph = memo(function Glyph({
  rows,
  size,
  color,
  glow,
}: {
  rows: readonly string[];
  size: DotMatrixSize;
  color: ColorToken;
  glow: boolean;
}) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const m = t.dot[size];
  const fill = t.color[color];
  const shadow = glow ? `0 0 ${t.dot.glowRadius}px ${t.color.glow}` : undefined;
  return (
    <View style={{ gap: m.dotSpacing }}>
      {rows.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', gap: m.dotSpacing }}>
          {Array.from(row).map((bit, c) => {
            const on = bit === '1';
            return (
              <Animated.View
                key={c}
                style={{
                  width: m.dotSize,
                  height: m.dotSize,
                  borderRadius: m.dotSize / 2,
                  backgroundColor: fill,
                  opacity: on ? t.dot.activeOpacity : t.dot.inactiveOpacity,
                  boxShadow: on ? shadow : undefined,
                  transitionProperty: 'opacity',
                  transitionDuration: reduced ? 150 : 90,
                  transitionDelay: reduced ? 0 : c * 12,
                  transitionTimingFunction: t.motion.curve.easeOut,
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
});

export type DotMatrixNumberProps = Omit<DotMatrixDisplayProps, 'text'> & {
  value: number;
  /** Số chữ số tối thiểu, đệm 0 bên trái: `pad={2}` cho streak "07". */
  pad?: number;
  suffix?: string;
  prefix?: string;
};

const STEPS = 7;
const STEP_MS = 55;

/**
 * Số dạng đồng hồ đo. Đổi giá trị thì kim chạy qua vài nấc trung gian (ease-out, ~400ms)
 * rồi chốt, như màn LED của máy đo. Reduce Motion: nhảy thẳng tới giá trị mới.
 */
export function DotMatrixNumber({ value, pad = 1, suffix = '', prefix = '', accessibilityLabel, ...rest }: DotMatrixNumberProps) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? value : 0);
  const from = useRef(shown);

  useEffect(() => {
    if (reduced) {
      from.current = value;
      return;
    }
    const start = from.current;
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      const p = 1 - Math.pow(1 - step / STEPS, 3);
      const next = step >= STEPS ? value : Math.round(start + (value - start) * p);
      setShown(next);
      from.current = next;
      if (step >= STEPS) clearInterval(id);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [value, reduced]);

  const current = reduced ? value : shown;
  const digits = String(Math.abs(current)).padStart(pad, '0');
  const sign = current < 0 ? '-' : '';
  return (
    <DotMatrixDisplay
      {...rest}
      text={`${prefix}${sign}${digits}${suffix}`}
      accessibilityLabel={accessibilityLabel ?? `${prefix}${value}${suffix}`}
    />
  );
}
