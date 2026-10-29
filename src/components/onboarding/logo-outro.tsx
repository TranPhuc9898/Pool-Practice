import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { makeStyles, useTheme } from '@/design-system';
import { endOutro, finishOnboarding } from '@/pool-engine/onboarding';

const LOGO = require('../../../assets/lottie/logo.json');
const ASPECT = 760 / 600;
/** Logo vẽ xong thì đứng yên một nhịp rồi mới mở ra home. */
const HOLD_MS = 500;
/** Chờ home mount xong dưới lớp phủ rồi mới expand. */
const MOUNT_MS = 80;
const EXPAND_MS = 560;
const EXPAND_SCALE = 7;

/**
 * Phủ kín màn hình ở root layout sau intro: logo tự vẽ, bi rơi vào chỗ hở,
 * rồi ghi cờ onboarding (home mount bên dưới) và logo phóng to, lớp phủ tan để lộ home.
 */
export function LogoOutro() {
  const s = useStyles();
  const t = useTheme();
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const expand = useSharedValue(0);
  const logoWidth = Math.min(width * 0.7, 360);

  const open = () => {
    finishOnboarding();
    expand.value = withDelay(
      MOUNT_MS,
      withTiming(1, { duration: EXPAND_MS, easing: Easing.in(Easing.cubic) }, (ok) => {
        if (ok) scheduleOnRN(endOutro);
      }),
    );
  };

  const finish = (delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(open, delay);
  };

  // Giảm chuyển động: hiện khung cuối, không vẽ, chỉ tan chứ không phóng.
  useEffect(() => {
    if (reduceMotion) finish(HOLD_MS * 2);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  const fade = useAnimatedStyle(() => ({ opacity: interpolate(expand.value, [0.35, 1], [1, 0], 'clamp') }));
  const grow = useAnimatedStyle(() => ({
    transform: [{ scale: reduceMotion ? 1 : interpolate(expand.value, [0, 1], [1, EXPAND_SCALE]) }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(t.motion.duration.quick).reduceMotion(ReduceMotion.System)}
      style={[s.root, fade]}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <Animated.View style={grow}>
        <LottieView
          source={LOGO}
          autoPlay={!reduceMotion}
          progress={reduceMotion ? 1 : undefined}
          loop={false}
          resizeMode="contain"
          onAnimationFinish={() => finish(HOLD_MS)}
          // Không render được thì vẫn cho vào app, không kẹt ở màn này.
          onAnimationFailure={() => {
            finishOnboarding();
            endOutro();
          }}
          style={{ width: logoWidth, height: logoWidth / ASPECT }}
        />
      </Animated.View>
    </Animated.View>
  );
}

const useStyles = makeStyles((t) => ({
  root: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.color.backgroundPrimary,
  },
}));
