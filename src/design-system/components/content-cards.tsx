import type { ReactNode } from 'react';
import { View } from 'react-native';

import { makeStyles } from '../theme';
import { AppIcon, type IconName } from './app-icon';
import { AppText } from './app-text';
import { AppCard, type AppCardProps } from './card';
import { AppChip, DifficultyChip, StatusChip, type Difficulty, type Status } from './chip';

/*
 * Card nội dung. Tất cả dựng trên AppCard — không cái nào tự vẽ khung.
 * Dữ liệu truyền vào là props thô; model domain (Drill, Session…) định nghĩa sau.
 */

export type StatCardProps = Pick<AppCardProps, 'onPress' | 'style'> & {
  label: string;
  value: string;
  icon?: IconName;
};

/** Ô số nhỏ, xếp lưới 2–3 cột. */
export function StatCard({ label, value, icon, ...card }: StatCardProps) {
  const s = useStyles();
  return (
    <AppCard padding="md" {...card} accessibilityLabel={`${label}: ${value}`}>
      {icon && (
        <View style={s.iconBadge}>
          <AppIcon name={icon} size="small" color="accentContent" />
        </View>
      )}
      <AppText variant="metric" tabular>
        {value}
      </AppText>
      <AppText variant="captionSmall" color="textTertiary" style={s.upper}>
        {label}
      </AppText>
    </AppCard>
  );
}

export type TrainingCardProps = Pick<AppCardProps, 'onPress' | 'style'> & {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: IconName;
  meta?: string;
  /** Hành động chính của màn — viền vàng. Mỗi màn nhiều nhất một cái. */
  featured?: boolean;
};

export function TrainingCard({ eyebrow, title, description, icon, meta, featured, ...card }: TrainingCardProps) {
  const s = useStyles();
  return (
    <AppCard tone={featured ? 'accent' : 'default'} accessibilityLabel={`${eyebrow}. ${title}. ${description ?? ''}`} {...card}>
      <View style={s.header}>
        <AppText variant="captionSmall" color={featured ? 'accentContent' : 'textTertiary'} style={s.upper}>
          {eyebrow}
        </AppText>
        {icon && <AppIcon name={icon} size="large" color={featured ? 'accentContent' : 'textSecondary'} />}
      </View>
      <AppText variant="title2" style={s.title}>
        {title}
      </AppText>
      {description && (
        <AppText variant="body" color="textSecondary">
          {description}
        </AppText>
      )}
      {(meta || card.onPress) && (
        <View style={[s.inline, s.footer]}>
          {meta && (
            <AppText variant="callout" color="textSecondary" style={s.flex}>
              {meta}
            </AppText>
          )}
          {card.onPress && <AppIcon name="chevron.right" size="small" color="textTertiary" weight="semibold" />}
        </View>
      )}
    </AppCard>
  );
}

export type DrillCardProps = Pick<AppCardProps, 'onPress' | 'style'> & {
  title: string;
  category: string;
  difficulty: Difficulty;
  durationLabel: string;
  status?: Status;
};

export function DrillCard({ title, category, difficulty, durationLabel, status, ...card }: DrillCardProps) {
  const s = useStyles();
  return (
    <AppCard padding="md" {...card} accessibilityLabel={`${title}, ${category}, ${durationLabel}`}>
      <View style={s.chips}>
        <AppChip label={category} />
        <DifficultyChip level={difficulty} />
      </View>
      <AppText variant="headline" style={s.titleTight}>
        {title}
      </AppText>
      <View style={s.inline}>
        <AppIcon name="clock" size="small" color="textTertiary" />
        <AppText variant="caption" color="textTertiary" style={s.flex}>
          {durationLabel}
        </AppText>
        {status && <StatusChip status={status} />}
      </View>
    </AppCard>
  );
}

export type SessionCardProps = Pick<AppCardProps, 'onPress' | 'style'> & {
  title: string;
  dateLabel: string;
  accuracy: string;
  shots: string;
  duration: string;
};

export function SessionCard({ title, dateLabel, accuracy, shots, duration, ...card }: SessionCardProps) {
  const s = useStyles();
  return (
    <AppCard padding="md" {...card} accessibilityLabel={`${title}, ${dateLabel}. Accuracy ${accuracy}, ${shots} shots, ${duration}`}>
      <View style={s.header}>
        <View style={s.flex}>
          <AppText variant="headline">{title}</AppText>
          <AppText variant="caption" color="textTertiary">
            {dateLabel}
          </AppText>
        </View>
        {card.onPress && <AppIcon name="chevron.right" size="small" color="textTertiary" weight="semibold" />}
      </View>
      <View style={s.statsRow}>
        <InlineStat label="Accuracy" value={accuracy} highlight />
        <InlineStat label="Shots" value={shots} />
        <InlineStat label="Time" value={duration} />
      </View>
    </AppCard>
  );
}

export type TileCardProps = Pick<AppCardProps, 'onPress' | 'style'> & {
  /** `<AppIcon color="accentContent" />`, bi, logo. */
  icon?: ReactNode;
  eyebrow: string;
  value: string;
  unit?: string;
  caption?: string;
};

/** Ô vuông nửa bề ngang: một con số kèm ngữ cảnh. Xếp đôi trong Grid 2 cột. */
export function TileCard({ icon, eyebrow, value, unit, caption, ...card }: TileCardProps) {
  const s = useStyles();
  return (
    <AppCard padding="md" {...card} style={[s.tile, card.style]} accessibilityLabel={`${eyebrow}: ${value} ${unit ?? ''}. ${caption ?? ''}`}>
      {icon}
      <View style={s.tileBody}>
        <AppText variant="callout" color="textSecondary">
          {eyebrow}
        </AppText>
        <View style={s.valueRow}>
          <AppText variant="metric" tabular>
            {value}
          </AppText>
          {unit && (
            <AppText variant="headline" color="textTertiary">
              {unit}
            </AppText>
          )}
        </View>
        {caption && (
          <AppText variant="caption" color="textTertiary" numberOfLines={2}>
            {caption}
          </AppText>
        )}
      </View>
    </AppCard>
  );
}

export type AgendaCardProps = Pick<AppCardProps, 'onPress' | 'style'> & {
  icon: IconName;
  title: string;
  subtitle?: string;
  value: string;
  unit?: string;
};

/** Dòng lịch: icon · tên · nhãn phụ · con số bên phải. */
export function AgendaCard({ icon, title, subtitle, value, unit, ...card }: AgendaCardProps) {
  const s = useStyles();
  return (
    <AppCard padding="md" {...card} accessibilityLabel={`${title}. ${subtitle ?? ''}. ${value} ${unit ?? ''}`}>
      <View style={s.agenda}>
        <View style={s.agendaIcon}>
          <AppIcon name={icon} size="medium" color="accentContent" />
        </View>
        <View style={s.flex}>
          <AppText variant="headline" numberOfLines={1}>
            {title}
          </AppText>
          {subtitle && (
            <AppText variant="caption" color="textSecondary" numberOfLines={1}>
              {subtitle}
            </AppText>
          )}
        </View>
        <View style={s.agendaValue}>
          <AppText variant="headline" tabular>
            {value}
          </AppText>
          {unit && (
            <AppText variant="caption" color="textTertiary">
              {unit}
            </AppText>
          )}
        </View>
      </View>
    </AppCard>
  );
}

function InlineStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  const s = useStyles();
  return (
    <View style={s.flex}>
      <AppText variant="title3" color={highlight ? 'accentContent' : 'textPrimary'} tabular>
        {value}
      </AppText>
      <AppText variant="captionSmall" color="textTertiary" style={s.upper}>
        {label}
      </AppText>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  flex: { flex: 1 },
  upper: { textTransform: 'uppercase' },
  tile: { flex: 1, gap: t.space.xl },
  tileBody: { gap: t.space.xxs },
  agenda: { flexDirection: 'row', alignItems: 'center', gap: t.space.sm },
  agendaIcon: {
    width: t.layout.minTouchTarget,
    height: t.layout.minTouchTarget,
    borderRadius: t.radius.medium,
    borderCurve: 'continuous',
    backgroundColor: t.color.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agendaValue: { alignItems: 'flex-end' },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: t.space.xxs, marginTop: t.space.xxs },
  inline: { flexDirection: 'row', alignItems: 'center', gap: t.space.xxs + 2 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: t.space.sm },
  title: { marginTop: t.space.sm, marginBottom: t.space.xxs },
  titleTight: { marginVertical: t.space.xs },
  footer: { marginTop: t.space.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: t.space.xs },
  statsRow: { flexDirection: 'row', marginTop: t.space.md, gap: t.space.sm },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: t.radius.small,
    backgroundColor: t.color.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: t.space.sm,
  },
}));
