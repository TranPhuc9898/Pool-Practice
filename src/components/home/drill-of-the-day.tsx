import { router } from 'expo-router';
import { View } from 'react-native';

import { AppIcon, AppText, makeStyles, materialStyle, PressableScale, useTheme } from '@/design-system';
import { DRILLS } from '@/pool-engine/drills';
import type { PoolDrill } from '@/pool-engine/types';

import { TablePreview } from './table-preview';

/**
 * Chọn theo ngày lịch máy: cả ngày một drill, qua nửa đêm đổi. Không phải gợi ý theo điểm yếu.
 * Trùng drill của card Continue thì lấy drill kế, để hai card không nói cùng một thứ.
 */
export function pickDrillOfTheDay(avoid: PoolDrill, now = new Date()): PoolDrill {
  const day = Math.floor((now.getTime() - now.getTimezoneOffset() * 60_000) / 86_400_000);
  const i = day % DRILLS.length;
  const pick = DRILLS[i];
  return pick.id === avoid.id ? DRILLS[(i + 1) % DRILLS.length] : pick;
}

export function DrillOfTheDay({ drill }: { drill: PoolDrill }) {
  const t = useTheme();
  const s = useStyles();

  return (
    <PressableScale
      onPress={() => router.push(`/drill/${drill.number}`)}
      accessibilityRole="button"
      accessibilityLabel={`Drill of the day. Drill ${drill.number}, ${drill.title}. ${drill.attemptCount} shots.`}
      style={[s.card, materialStyle('graphite', [], t.name)]}>
      <View style={s.head}>
        <View style={s.flex}>
          <AppText variant="title3" style={s.title}>
            {drill.title}
          </AppText>
          <AppText variant="callout" color="textSecondary" numberOfLines={2}>
            {drill.subtitle}
          </AppText>
        </View>
        <AppText variant="mono" color="textTertiary">
          {drill.id}
        </AppText>
      </View>

      <TablePreview drill={drill} />

      <View style={s.foot}>
        <AppText variant="label" color="textTertiary" style={s.flex}>
          {drill.attemptCount} shots
        </AppText>
        <View style={s.cta}>
          <AppText variant="callout" style={s.ctaText}>
            View drill
          </AppText>
          <AppIcon name="arrow.right" size="small" weight="semibold" />
        </View>
      </View>
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  card: {
    gap: t.space.md,
    borderRadius: t.radius.xLarge,
    borderCurve: 'continuous',
    borderWidth: t.border.normal,
    padding: t.space.lg,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: t.space.md },
  flex: { flex: 1, gap: t.space.xxs },
  title: { textTransform: 'uppercase' },
  foot: { flexDirection: 'row', alignItems: 'center', gap: t.space.sm, minHeight: t.layout.minTouchTarget },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ctaText: { fontFamily: t.type.button.fontFamily, textTransform: 'uppercase', letterSpacing: 1 },
}));
