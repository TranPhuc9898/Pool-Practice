import { View } from 'react-native';

import { AppIcon, AppText, makeStyles } from '@/design-system';

export type DayState = 'done' | 'rest' | 'today' | 'planned' | 'missed';
export type WeekDay = { label: string; name: string; state: DayState };

const stateLabel: Record<DayState, string> = {
  done: 'completed',
  rest: 'rest day',
  today: 'today',
  planned: 'planned',
  missed: 'missed',
};

/** Dải 7 ngày. Tĩnh — không animation: màn Today mở chục lần mỗi ngày. */
export function WeekStrip({ days }: { days: WeekDay[] }) {
  const s = useStyles();
  return (
    <View style={s.row} accessibilityRole="summary">
      {days.map((d) => {
        const today = d.state === 'today';
        return (
          <View
            key={d.name}
            style={[s.cell, today && s.today]}
            accessible
            accessibilityLabel={`${d.name}, ${stateLabel[d.state]}`}>
            <AppText variant="headline" color={today ? 'onAccent' : d.state === 'rest' ? 'textTertiary' : 'textPrimary'}>
              {d.label}
            </AppText>
            <View style={s.mark}>
              {d.state === 'done' && <AppIcon name="checkmark" size="small" color="accentContent" weight="bold" />}
              {d.state === 'missed' && <AppIcon name="xmark" size="small" color="textTertiary" weight="bold" />}
              {(d.state === 'rest' || today) && (
                <AppText
                  variant="eyebrow"
                  color={today ? 'onAccent' : 'textTertiary'}
                  style={s.markText}
                  numberOfLines={1}
                  adjustsFontSizeToFit>
                  {today ? 'Today' : 'Rest'}
                </AppText>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', gap: t.space.xxs },
  cell: {
    flex: 1,
    alignItems: 'center',
    gap: t.space.xxs,
    paddingVertical: t.space.sm,
    borderRadius: t.radius.medium,
    borderCurve: 'continuous',
    borderWidth: t.border.normal,
    borderColor: t.color.borderSubtle,
    backgroundColor: t.color.surfacePrimary,
  },
  today: { backgroundColor: t.color.accent, borderColor: t.color.accentStrong, ...t.shadow.accentGlow },
  mark: { height: t.icon.small, justifyContent: 'center' },
  markText: { letterSpacing: 0.2 },
}));
