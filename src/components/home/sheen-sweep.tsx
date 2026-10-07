import { useIsFocused } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { sheenSweep, useTheme } from '@/design-system';

/** Một vòng 7s: quét ~1.7s rồi nghỉ. Home mở chục lần một ngày, quét liên tục thành nhiễu. */
const CYCLE_MS = 7000;
const SWEEP_END = '24%';
const DELAY_MS = 900;
const BAND = 0.55;
const SKEW = '-14deg';

/**
 * Dải sáng nghiêng quét ngang card hero, như đèn bàn lướt qua mặt kính.
 * CSS animation của Reanimated, chỉ dời `transform`, chạy ngoài JS thread.
 * Rời tab thì dừng. Reduce Motion thì không vẽ.
 */
export function SheenSweep({ radius }: { radius: number }) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const focused = useIsFocused();
  const [width, setWidth] = useState(0);

  if (reduced) return null;

  const band = width * BAND;
  const from = { transform: [{ translateX: -band * 1.2 }, { skewX: SKEW }] };
  const to = { transform: [{ translateX: width + band * 0.2 }, { skewX: SKEW }] };

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[StyleSheet.absoluteFill, { borderRadius: radius, borderCurve: 'continuous', overflow: 'hidden' }]}>
      {width > 0 && (
        <Animated.View
          style={{
            position: 'absolute',
            top: '-20%',
            bottom: '-20%',
            left: 0,
            width: band,
            mixBlendMode: 'screen',
            experimental_backgroundImage: sheenSweep,
            animationName: { '0%': from, [SWEEP_END]: to, '100%': to },
            animationDuration: CYCLE_MS,
            animationDelay: DELAY_MS,
            animationIterationCount: 'infinite',
            animationFillMode: 'both',
            animationTimingFunction: t.motion.curve.easeInOut,
            animationPlayState: focused ? 'running' : 'paused',
          }}
        />
      )}
    </View>
  );
}
