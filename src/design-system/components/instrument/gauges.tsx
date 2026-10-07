import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { useTheme } from '../../theme';

export type MetricRingProps = {
  /** 0…1 */
  value: number;
  size?: number;
  /** Số vạch trên cả cung. Nhiều vạch = mịn, ít vạch = thô như đồng hồ cơ. */
  ticks?: number;
  /** Độ mở của cung, độ. 270 chừa khe dưới đáy kiểu đồng hồ tốc độ. */
  sweep?: number;
  children?: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Gauge mảnh dựng bằng vạch, không phải vòng tròn đặc. Mỗi 4 vạch có một vạch dài làm mốc.
 * Lần đầu hiện: vạch sáng lần lượt theo chiều kim, 6ms mỗi vạch. Reduce Motion: sáng cùng lúc.
 */
export function MetricRing({
  value,
  size = 132,
  ticks = 60,
  sweep = 270,
  children,
  accessibilityLabel,
  style,
}: MetricRingProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const lit = Math.round(Math.max(0, Math.min(1, value)) * ticks);
  const start = -sweep / 2;
  const step = sweep / (ticks - 1);

  return (
    <View
      style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}>
      {Array.from({ length: ticks }, (_, i) => {
        const major = i % 4 === 0;
        const len = major ? size * 0.085 : size * 0.055;
        const on = i < lit;
        const head = i === lit - 1;
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: size / 2 - 1,
              top: size / 2 - len / 2,
              width: major ? 2 : 1.5,
              height: len,
              borderRadius: 1,
              backgroundColor: on ? t.color.accent : t.color.dotInactive,
              boxShadow: head ? `0 0 8px ${t.color.glow}` : undefined,
              transform: [{ rotate: `${start + i * step}deg` }, { translateY: -(size / 2 - len / 2) }],
              transitionProperty: 'backgroundColor',
              transitionDuration: 120,
              transitionDelay: reduced ? 0 : i * 6,
            }}
          />
        );
      })}
      {children}
    </View>
  );
}

export type DotMark = 'on' | 'off' | 'pass' | 'fail';

export type DotProgressProps = {
  total: number;
  /** Số chấm sáng từ trái. Bỏ qua nếu có `marks`. */
  filled?: number;
  /** Trạng thái từng chấm, cho lượt tập: pass đặc, fail rỗng có viền. */
  marks?: readonly (DotMark | undefined)[];
  /** Đặt trên bảng điểm đen. */
  inverse?: boolean;
  dotSize?: number;
  gap?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Dải chấm: mỗi chấm là MỘT vật đếm được (một cú đánh). Không dùng để vẽ phần trăm.
 * Tĩnh, chỉ đổi màu chấm, không dời layout.
 */
export function DotProgress({
  total,
  filled = 0,
  marks,
  inverse = false,
  dotSize = 8,
  gap = 5,
  accessibilityLabel,
  style,
}: DotProgressProps) {
  const t = useTheme();
  const ink = inverse ? t.color.onSurfaceInverse : t.color.accent;
  const track = inverse ? 'rgba(255, 255, 255, 0.16)' : t.color.dotInactive;
  return (
    <View
      style={[{ flexDirection: 'row', flexWrap: 'wrap', gap }, style]}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}>
      {Array.from({ length: total }, (_, i) => {
        const mark: DotMark = marks ? (marks[i] ?? 'off') : i < filled ? 'on' : 'off';
        const lit = mark === 'on' || mark === 'pass';
        return (
          <Animated.View
            key={i}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: lit ? ink : mark === 'fail' ? 'transparent' : track,
              borderWidth: mark === 'fail' ? 1.5 : 0,
              borderColor: ink,
              transitionProperty: 'backgroundColor',
              transitionDuration: t.motion.duration.quick,
            }}
          />
        );
      })}
    </View>
  );
}

/** Thanh chia ô: mỗi ô là một vật đếm được (một drill trong buổi). 4/6 drill = 4 ô đặc trên 6. */
export function SegmentBar({
  total,
  filled,
  inverse = false,
  style,
}: {
  total: number;
  filled: number;
  inverse?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  return (
    <View style={[{ flexDirection: 'row', gap: 4 }, style]}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            backgroundColor:
              i < filled ? (inverse ? t.color.onSurfaceInverse : t.color.accent) : inverse ? 'rgba(255, 255, 255, 0.16)' : t.color.dotInactive,
          }}
        />
      ))}
    </View>
  );
}

/** Thanh liền cho đại lượng liên tục (kỹ năng 0…100). Không chia ô, vì 78% không phải 7,8 vật. */
export function MeterBar({
  value,
  inverse = false,
  height = 4,
  style,
}: {
  /** 0…1 */
  value: number;
  inverse?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  return (
    <View
      style={[
        {
          height,
          borderRadius: height / 2,
          overflow: 'hidden',
          backgroundColor: inverse ? 'rgba(255, 255, 255, 0.16)' : t.color.dotInactive,
        },
        style,
      ]}>
      <View
        style={{
          width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`,
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: inverse ? t.color.onSurfaceInverse : t.color.accent,
        }}
      />
    </View>
  );
}
