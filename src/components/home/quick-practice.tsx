import { router } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';

import { AppIcon, AppText, homeSurfaces, makeStyles, PressableScale, type IconName } from '@/design-system';
import type { PoolDrill } from '@/pool-engine/types';

const ONE_COLUMN_FONT_SCALE = 1.6;

/** Hướng bi cái sau va chạm, vẽ bằng SF Symbol. Stop: bi cái đứng lại, không mũi tên. */
const ARROW: Partial<Record<PoolDrill['skill'], IconName>> = {
  follow: 'arrow.up',
  followDistance: 'arrow.up',
  draw: 'arrow.down',
  drawDistance: 'arrow.down',
};

export type QuickItem = { drill: PoolDrill; name: string; passed: boolean };

/** Ba ô tập nhanh. Chữ to: thành hàng dọc, mỗi ô một dòng. */
export function QuickPractice({ items }: { items: readonly QuickItem[] }) {
  const s = useStyles();
  const { fontScale } = useWindowDimensions();
  const stacked = fontScale >= ONE_COLUMN_FONT_SCALE;

  return (
    <View style={[s.row, stacked && s.column]}>
      {items.map(({ drill, name, passed }) => (
        <PressableScale
          key={drill.id}
          onPress={() => router.push(`/drill/${drill.number}`)}
          accessibilityRole="button"
          accessibilityLabel={`${name}, drill ${drill.number}. ${passed ? 'Passed' : 'Not passed yet'}.`}
          style={[s.tile, !stacked && s.flex, homeSurfaces.quickTile]}>
          <View style={s.top}>
            <BallGlyph arrow={ARROW[drill.skill]} />
            <AppText variant="monoSmall" color="textTertiary">
              {drill.id}
            </AppText>
          </View>
          <View style={s.bottom}>
            <AppText variant="tileTitle" style={s.title} numberOfLines={stacked ? undefined : 1}>
              {name}
            </AppText>
            <View style={s.status}>
              {passed && <AppIcon name="checkmark" size="small" color="textTertiary" weight="semibold" />}
              <AppText variant="caption" color="textTertiary">
                {passed ? 'Passed' : 'Not yet'}
              </AppText>
            </View>
          </View>
        </PressableScale>
      ))}
    </View>
  );
}

/** Bi cái trắng có quầng, bi mục tiêu là vòng rỗng, mũi tên là hướng bi cái đi sau va chạm. */
function BallGlyph({ arrow }: { arrow?: IconName }) {
  const s = useStyles();
  return (
    <View style={s.glyph} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={s.cue} />
      <View style={s.object} />
      {arrow && <AppIcon name={arrow} size="small" color="textTertiary" weight="semibold" />}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', gap: 10 },
  column: { flexDirection: 'column' },
  flex: { flex: 1 },
  tile: {
    minHeight: 116,
    borderRadius: 20,
    borderCurve: 'continuous',
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 13,
    justifyContent: 'space-between',
    gap: t.space.sm,
  },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bottom: { gap: 2 },
  title: { color: homeSurfaces.ink.title },
  status: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  glyph: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 22 },
  cue: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#F5F5F3',
    boxShadow: '0 0 6px rgba(255, 255, 255, 0.35)',
  },
  object: { width: 9, height: 9, borderRadius: 4.5, borderWidth: 1.2, borderColor: 'rgba(236, 234, 238, 0.6)' },
}));
