import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { makeStyles, useTheme } from '../../theme';
import { AppText } from '../app-text';

type AppSliderProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: (v: number) => string;
};

const THUMB = 28;

function toStepped(progress: number, min: number, max: number, step: number) {
  'worklet';
  const raw = min + progress * (max - min);
  return Math.min(max, Math.max(min, Math.round(raw / step) * step));
}

/**
 * Kéo 1:1, giữ chỗ cầm (offset từ giá trị đang hiện, không nhảy thumb về ngón tay).
 * Chạm vào track thì nhảy tới đó. Haptic selection mỗi nấc, gọi JS chỉ khi qua nấc — không mỗi khung.
 */
export function AppSlider({ label, value, onChange, min = 0, max = 100, step = 1, format = String }: AppSliderProps) {
  const t = useTheme();
  const s = useStyles();
  const range = max - min;
  const toProgress = (v: number) => (range === 0 ? 0 : (v - min) / range);

  const width = useSharedValue(0);
  const progress = useSharedValue(toProgress(value));
  const start = useSharedValue(0);
  const dragging = useSharedValue(false);
  const tapped = useSharedValue<number | null>(null);

  // Giá trị đổi từ ngoài (stepper, reset) khi không kéo thì đồng bộ lại.
  useEffect(() => {
    if (!dragging.get()) progress.set(withSpring(toProgress(value), t.motion.spring.snappy));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Ref để gesture không phụ thuộc onChange của cha — dựng lại gesture giữa lúc kéo là rớt drag.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });
  const emit = useCallback((v: number) => {
    Haptics.selectionAsync();
    onChangeRef.current(v);
  }, []);

  useAnimatedReaction(
    () => toStepped(progress.get(), min, max, step),
    (stepped, prev) => {
      if (prev !== null && stepped !== prev && dragging.get()) scheduleOnRN(emit, stepped);
    },
  );
  // Tap đi qua shared value thay vì gọi emit trong gesture — gesture không chạm tới ref, compiler khỏi bail.
  useAnimatedReaction(
    () => tapped.get(),
    (v) => {
      if (v === null) return;
      tapped.set(null);
      scheduleOnRN(emit, v);
    },
  );

  // Rút spring ra ngoài: worklet mà chạm `t` sẽ capture cả theme, gồm `cubicBezier` không copy được.
  const snappy = t.motion.spring.snappy;
  const gesture = useMemo(() => {
    const clamp = (p: number) => {
      'worklet';
      return Math.min(1, Math.max(0, p));
    };
    const snap = () => {
      'worklet';
      const steps = range / step;
      const snapped = steps > 0 ? Math.round(progress.get() * steps) / steps : 0;
      progress.set(withSpring(snapped, snappy));
    };
    const pan = Gesture.Pan()
      .activeOffsetX([-6, 6])
      .failOffsetY([-12, 12])
      .onStart(() => {
        dragging.set(true);
        start.set(progress.get());
      })
      .onUpdate((e) => {
        if (width.get() > 0) progress.set(clamp(start.get() + e.translationX / width.get()));
      })
      .onFinalize(() => {
        snap();
        dragging.set(false);
      });
    const tap = Gesture.Tap().onEnd((e) => {
      if (width.get() <= 0) return;
      const v = toStepped(clamp((e.x - THUMB / 2) / width.get()), min, max, step);
      progress.set(withSpring(range === 0 ? 0 : (v - min) / range, snappy));
      tapped.set(v);
    });
    return Gesture.Race(pan, tap);
  }, [min, max, range, step, snappy, dragging, progress, start, tapped, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: progress.get() * width.get() + THUMB / 2 }));
  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: progress.get() * width.get() }] }));

  const set = (v: number) => onChange(Math.min(max, Math.max(min, v)));

  return (
    <View style={s.wrapper}>
      <View style={s.header}>
        <AppText variant="bodyLarge">{label}</AppText>
        <AppText variant="headline" color="accentContent" tabular>
          {format(value)}
        </AppText>
      </View>
      <GestureDetector gesture={gesture}>
        <View
          style={s.hit}
          onLayout={(e) => width.set(e.nativeEvent.layout.width - THUMB)}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={label}
          accessibilityValue={{ min, max, now: value, text: format(value) }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={(e) => set(value + (e.nativeEvent.actionName === 'increment' ? step : -step))}>
          <View style={s.track} />
          {/* Fill là absolute không con — animate width ở đây không kéo layout pass. */}
          <Animated.View style={[s.track, s.fill, fillStyle]} />
          <Animated.View style={[s.thumb, thumbStyle]} />
        </View>
      </GestureDetector>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  wrapper: { gap: t.space.xs },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  hit: { height: t.layout.minTouchTarget, justifyContent: 'center' },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    borderRadius: t.radius.pill,
    backgroundColor: t.color.surfacePressed,
  },
  fill: { right: undefined, backgroundColor: t.color.accent },
  thumb: {
    position: 'absolute',
    left: 0,
    width: THUMB,
    height: THUMB,
    borderRadius: t.radius.pill,
    backgroundColor: t.color.textPrimary,
    ...t.shadow.floating,
  },
}));
