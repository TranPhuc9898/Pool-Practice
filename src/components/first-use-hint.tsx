import { View } from 'react-native';
import Animated, { FadeIn, FadeOut, ReduceMotion } from 'react-native-reanimated';

import { AppText, makeStyles, PressableScale, useTheme } from '@/design-system';
import { finishGuide } from '@/pool-engine/first-use';

/**
 * Một dòng hướng dẫn nằm ngay trên nút nó nói tới, không che màn, không chặn thao tác.
 * Chấm gold là điểm nhấn duy nhất. Bỏ qua tắt hẳn cả chuỗi, không chỉ dòng này.
 */
export function FirstUseHint({ text }: { text: string }) {
  const t = useTheme();
  const s = useStyles();
  return (
    <Animated.View
      entering={FadeIn.duration(t.motion.duration.standard).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(t.motion.duration.quick).reduceMotion(ReduceMotion.System)}
      style={s.row}>
      <View style={s.dot} />
      <AppText variant="callout" color="textSecondary" style={s.text}>
        {text}
      </AppText>
      <PressableScale
        onPress={finishGuide}
        accessibilityRole="button"
        accessibilityLabel="Bỏ qua hướng dẫn"
        style={s.skip}>
        <AppText variant="caption" color="textTertiary">
          Bỏ qua
        </AppText>
      </PressableScale>
    </Animated.View>
  );
}

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: t.space.sm, marginBottom: -t.space.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: t.color.accentGold },
  text: { flex: 1 },
  skip: { minHeight: 44, justifyContent: 'center', paddingLeft: t.space.xs },
}));
