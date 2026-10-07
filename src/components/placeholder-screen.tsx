import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppCard, AppIcon, AppText, makeStyles, Screen, type IconName } from '@/design-system';

/** Màn tạm cho các tab chưa làm. Xoá khi tab có nội dung thật. */
export function PlaceholderScreen({
  icon,
  title,
  description,
  children,
}: {
  icon: IconName;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  const s = useStyles();
  return (
    <Screen>
      <AppCard padding="xxl" style={s.card}>
        <View style={s.icon}>
          <AppIcon name={icon} size="xLarge" color="accentContent" />
        </View>
        <AppText variant="title2" align="center">
          {title}
        </AppText>
        <AppText variant="body" color="textSecondary" align="center">
          {description}
        </AppText>
      </AppCard>
      {children}
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  card: { alignItems: 'center', gap: t.space.sm },
  icon: {
    width: 64,
    height: 64,
    borderRadius: t.radius.pill,
    backgroundColor: t.color.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: t.space.xs,
  },
}));
