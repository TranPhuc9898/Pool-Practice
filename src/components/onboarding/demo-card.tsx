import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText, makeStyles } from '@/design-system';

/** Khung chung của demo bàn: bàn ở trên, dòng trạng thái ở dưới. Cả khối đọc như một ảnh cho VoiceOver. */
export function DemoCard({ table, footer, accessibilityLabel }: { table: ReactNode; footer: ReactNode; accessibilityLabel: string }) {
  const s = useStyles();
  return (
    <View style={s.card} accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      {table}
      {footer}
    </View>
  );
}

/** Trái: đang làm gì, Pass thì đổi gold. Phải: số Doto kèm đơn vị. */
export function DemoStatus({ say, pass, value, unit }: { say: string; pass: boolean; value: number; unit: string }) {
  const s = useStyles();
  return (
    <View style={s.status}>
      <AppText variant={pass ? 'callout' : 'caption'} color={pass ? 'accentGold' : 'textTertiary'} style={s.say}>
        {say}
      </AppText>
      <View style={s.far}>
        <AppText variant="dotMetric" tabular>
          {value}
        </AppText>
        <AppText variant="label" color="textTertiary">
          {unit}
        </AppText>
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  card: {
    width: '100%',
    padding: t.space.xs,
    borderRadius: t.radius.card,
    backgroundColor: t.color.surfacePrimary,
    borderWidth: t.border.hairline,
    borderColor: t.color.borderSubtle,
  },
  status: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: t.space.sm,
    paddingHorizontal: t.space.xxs,
    paddingBottom: t.space.xxs,
  },
  say: { flex: 1, marginRight: t.space.sm },
  far: { alignItems: 'flex-end' },
}));
