import * as Haptics from 'expo-haptics';
import { useState, type ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { useTheme } from '../theme';

export type PressableScaleProps = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
  children?: ReactNode | ((state: { pressed: boolean }) => ReactNode);
  /** Haptic lúc commit (onPress), không lúc chạm. Mặc định tắt — một haptic một hành động. */
  haptic?: 'selection' | 'light' | 'medium';
  /** Tắt scale khi phần tử quá to (card full-width) hoặc nằm trong list cuộn dày. */
  scale?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const fireHaptic = (kind: NonNullable<PressableScaleProps['haptic']>) => {
  if (kind === 'selection') return Haptics.selectionAsync();
  return Haptics.impactAsync(
    kind === 'light' ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium,
  );
};

/**
 * Nền tảng của mọi thứ bấm được: phản hồi lúc chạm xuống (scale 0.97, 120ms, ease-out),
 * commit lúc nhấc lên. CSS transition của Reanimated — chạy ngoài JS thread, ngắt được giữa chừng.
 */
export function PressableScale({
  style,
  children,
  haptic,
  scale = true,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  ...rest
}: PressableScaleProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const [pressed, setPressed] = useState(false);
  const state = { pressed };
  const scaled = scale && !reduced && pressed && !disabled;

  return (
    <AnimatedPressable
      hitSlop={8}
      pressRetentionOffset={16}
      disabled={disabled}
      onPressIn={(e) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) fireHaptic(haptic);
        onPress?.(e);
      }}
      accessibilityState={{ disabled: !!disabled }}
      {...rest}
      style={[
        {
          transform: [{ scale: scaled ? t.motion.pressScale : 1 }],
          transitionProperty: ['transform', 'backgroundColor', 'borderColor', 'opacity'],
          transitionDuration: t.motion.duration.press,
          transitionTimingFunction: t.motion.curve.easeOut,
        },
        typeof style === 'function' ? style(state) : style,
      ]}>
      {typeof children === 'function' ? children(state) : children}
    </AnimatedPressable>
  );
}
