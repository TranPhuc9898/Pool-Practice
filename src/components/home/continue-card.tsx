import { router } from 'expo-router';
import { View } from 'react-native';

import {
  AppIcon,
  AppText,
  DotMatrixDisplay,
  makeStyles,
  materialStyle,
  PressableScale,
  useTheme,
} from '@/design-system';
import { DRILLS } from '@/pool-engine/drills';
import type { PoolDrill } from '@/pool-engine/types';

import { SheenSweep } from './sheen-sweep';
import { TablePreview } from './table-preview';
import { areaOf, levelOf } from './training-areas';

const RADIUS = 28;

/**
 * Card hero của Home, cả card là một nút. Chỗ duy nhất của màn có dot-matrix, ánh gold và vệt quét.
 * `resume` false: người mới, chưa mở drill nào, thì chữ là "Start".
 */
export function ContinueCard({ drill, resume }: { drill: PoolDrill; resume: boolean }) {
  const t = useTheme();
  const s = useStyles();
  const area = areaOf(drill);
  const level = levelOf(drill);
  const total = String(DRILLS.length).padStart(2, '0');
  const action = resume ? 'Continue' : 'Start';

  return (
    <PressableScale
      onPress={() => router.push(`/drill/${drill.number}`)}
      accessibilityRole="button"
      accessibilityLabel={`${action} training. Drill ${drill.number} of ${DRILLS.length}, ${drill.title}. ${level}, ${area.title}.`}
      style={[s.card, materialStyle('graphite', ['goldCorner'], t.name)]}>
      <View style={s.head}>
        <AppText variant="title1" style={s.title}>
          {drill.title}
        </AppText>
        <View style={s.number}>
          <DotMatrixDisplay text={drill.id} size="lg" accessibilityLabel={`Drill ${drill.number}`} />
          <DotMatrixDisplay text={`/${total}`} size="sm" color="textTertiary" accessibilityLabel={`of ${total}`} />
        </View>
      </View>

      <AppText variant="body" color="textSecondary" numberOfLines={2} style={s.subtitle}>
        {drill.subtitle}
      </AppText>

      <View style={s.table}>
        <TablePreview drill={drill} />
      </View>

      <View style={s.foot}>
        <AppText variant="caption" color="textTertiary" style={s.flex} numberOfLines={1}>
          {level} · {area.title}
        </AppText>
        <View style={s.cta}>
          <AppText variant="button" color="accentGold" style={s.ctaText}>
            {action}
          </AppText>
          <AppIcon name="arrow.right" size="small" color="accentGold" weight="semibold" />
        </View>
      </View>

      {/* Vẽ sau cùng để vệt sáng lướt qua cả bàn, như phản chiếu trên mặt kính. */}
      <SheenSweep radius={RADIUS} />
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  card: {
    borderRadius: RADIUS,
    borderCurve: 'continuous',
    borderWidth: t.border.normal,
    padding: t.space.lg,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: t.space.md },
  title: { flex: 1, textTransform: 'uppercase', paddingTop: 2 },
  number: { alignItems: 'flex-end', gap: t.space.xs },
  subtitle: { marginTop: t.space.xs },
  table: { marginTop: t.space.md },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.sm,
    minHeight: t.layout.minTouchTarget,
    marginTop: t.space.sm,
  },
  flex: { flex: 1 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ctaText: { textTransform: 'uppercase', letterSpacing: 1 },
}));
