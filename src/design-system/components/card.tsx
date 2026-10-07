import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { makeStyles, useTheme } from '../theme';
import type { SpacingToken } from '../tokens/scale';
import { PressableScale, type PressableScaleProps } from './pressable-scale';

/**
 * `inverse`: bề mặt đảo màu (mực đen trên light), mỗi màn tối đa một cái. Nội dung bên trong dùng `onSurfaceInverse*`.
 * `solid`: nền gold đặc, nội dung dùng `onAccent*`.
 */
type CardTone = 'default' | 'elevated' | 'accent' | 'solid' | 'inverse';

export type AppCardProps = {
  children?: ReactNode;
  tone?: CardTone;
  padding?: SpacingToken;
  style?: StyleProp<ViewStyle>;
  /** Có onPress thì card thành nút. */
  onPress?: PressableScaleProps['onPress'];
  accessibilityLabel?: string;
  accessibilityHint?: string;
  disabled?: boolean;
};

/**
 * Nền của mọi card: surface + radius + border + padding + pressed state.
 * Card con (Metric, Drill, …) chỉ lo nội dung, không tự vẽ khung.
 */
export function AppCard({
  children,
  tone = 'default',
  padding = 'lg',
  style,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  disabled,
}: AppCardProps) {
  const t = useTheme();
  const s = useStyles();
  const frame = [s.base, s[tone], { padding: t.space[padding] }];

  if (!onPress) {
    return (
      <View style={[frame, style]} accessibilityLabel={accessibilityLabel}>
        {children}
      </View>
    );
  }

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [frame, pressed && (tone === 'solid' ? s.solidPressed : tone === 'inverse' ? s.inversePressed : s.pressed), style]}>
      {children}
    </PressableScale>
  );
}

export type SelectableCardProps = Omit<AppCardProps, 'tone' | 'onPress'> & {
  selected: boolean;
  onSelect: () => void;
};

/**
 * Chọn một trong nhiều (game type, độ khó). Trạng thái chọn không chỉ bằng màu:
 * border dày + glow + `accessibilityState.selected`, view con nên thêm dấu check.
 */
export function SelectableCard({
  selected,
  onSelect,
  padding = 'lg',
  style,
  children,
  accessibilityLabel,
  disabled,
}: SelectableCardProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <PressableScale
      onPress={onSelect}
      disabled={disabled}
      haptic="selection"
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: !!disabled }}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        s.base,
        s.default,
        { padding: t.space[padding] },
        selected && s.selected,
        pressed && !selected && s.pressed,
        style,
      ]}>
      {children}
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    borderRadius: t.radius.card,
    borderCurve: 'continuous',
    borderWidth: t.border.normal,
  },
  default: {
    backgroundColor: t.color.surfacePrimary,
    borderColor: t.color.borderSubtle,
    ...t.shadow.card,
  },
  elevated: {
    backgroundColor: t.color.surfaceElevated,
    borderColor: t.color.borderPrimary,
    ...t.shadow.floating,
  },
  accent: {
    backgroundColor: t.color.accentMuted,
    borderColor: t.color.borderAccent,
  },
  solid: {
    backgroundColor: t.color.accent,
    borderColor: t.color.accentStrong,
    ...t.shadow.accentGlow,
  },
  inverse: {
    backgroundColor: t.color.surfaceInverse,
    borderColor: t.color.surfaceInverse,
    ...t.shadow.floating,
  },
  pressed: {
    backgroundColor: t.color.surfacePressed,
  },
  inversePressed: {
    opacity: 0.92,
  },
  solidPressed: {
    backgroundColor: t.color.accentPressed,
  },
  selected: {
    backgroundColor: t.color.accentMuted,
    borderColor: t.color.borderAccent,
    ...t.shadow.accentGlow,
  },
}));
