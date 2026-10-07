import { router } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';

import { AppText, Grid, makeStyles, materialStyle, PressableScale, useTheme } from '@/design-system';

import { AreaGlyph } from './area-glyph';
import { TRAINING_AREAS } from './training-areas';

/** Chữ to tới mức này thì 2 cột không đủ chỗ cho tiêu đề. Ngưỡng ước lượng, chưa đo trên máy. */
const ONE_COLUMN_FONT_SCALE = 1.35;

/** 2×2 trên iPhone, 4 cột trên iPad, 1 cột khi chữ rất to. Không gold: gold chỉ ở card hero. */
export function TrainingAreaGrid() {
  const t = useTheme();
  const s = useStyles();
  const { width, fontScale } = useWindowDimensions();
  const columns = fontScale >= ONE_COLUMN_FONT_SCALE ? 1 : width >= t.layout.largeBreakpoint ? 4 : 2;

  return (
    <Grid columns={columns}>
      {TRAINING_AREAS.map((area) => (
        <PressableScale
          key={area.id}
          onPress={() => router.push(`/area/${area.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`${area.title}. ${area.a11y}.`}
          style={[s.card, materialStyle('graphite', [], t.name)]}>
          <View style={s.text}>
            <AppText variant="headline" style={s.title}>
              {area.title}
            </AppText>
            <AppText variant="caption" color="textTertiary">
              {area.topics}
            </AppText>
          </View>
          <AreaGlyph area={area.id} />
        </PressableScale>
      ))}
    </Grid>
  );
}

const useStyles = makeStyles((t) => ({
  card: {
    flex: 1,
    minHeight: 152,
    justifyContent: 'space-between',
    gap: t.space.md,
    borderRadius: 22,
    borderCurve: 'continuous',
    borderWidth: t.border.normal,
    padding: t.space.md,
  },
  text: { gap: t.space.xxs },
  title: { textTransform: 'uppercase', letterSpacing: 0.6 },
}));
