import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { materialStyle, type MaterialName, type ReflectionName } from '../../tokens/material';
import type { SpacingToken } from '../../tokens/scale';
import { AppIcon } from '../app-icon';
import { AppText } from '../app-text';
import { DotMatrixNumber } from './dot-matrix';
import { PressableScale, type PressableScaleProps } from '../pressable-scale';

export type CardState = 'normal' | 'active' | 'selected' | 'mastered' | 'locked';

const stateMaterial: Record<CardState, { material: MaterialName; extra: readonly ReflectionName[] }> = {
  normal: { material: 'graphite', extra: [] },
  active: { material: 'active', extra: [] },
  selected: { material: 'graphite', extra: ['floorSheen'] },
  mastered: { material: 'graphite', extra: [] },
  locked: { material: 'flat', extra: [] },
};

export type MaterialCardProps = {
  children?: ReactNode;
  state?: CardState;
  /** Ghi đè vật liệu theo state, ví dụ `solid` cho bảng điểm. */
  material?: MaterialName;
  padding?: SpacingToken;
  style?: StyleProp<ViewStyle>;
  onPress?: PressableScaleProps['onPress'];
  accessibilityLabel?: string;
};

/**
 * Card instrument: vật liệu + phản chiếu theo state. State không chỉ báo bằng màu:
 * selected và active có viền mực, mastered có dấu, locked có khoá và mờ nội dung.
 */
export function MaterialCard({
  children,
  state = 'normal',
  material,
  padding = 'lg',
  style,
  onPress,
  accessibilityLabel,
}: MaterialCardProps) {
  const t = useTheme();
  const s = useStyles();
  const spec = stateMaterial[state];
  const frame = [
    s.base,
    materialStyle(material ?? spec.material, spec.extra, t.name),
    state === 'selected' && s.selected,
    { padding: t.space[padding] },
    style,
  ];
  const body = (
    <>
      <View style={state === 'locked' && s.lockedBody}>{children}</View>
      {state === 'locked' && (
        <View style={s.badge} pointerEvents="none">
          <AppIcon name="lock.fill" size="small" color="textTertiary" />
        </View>
      )}
      {state === 'mastered' && (
        <View style={s.badge} pointerEvents="none">
          <AppIcon name="checkmark.seal.fill" size="small" color="accentContent" />
        </View>
      )}
    </>
  );

  if (!onPress || state === 'locked') {
    return (
      <View
        style={frame}
        accessible={!!accessibilityLabel}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: state === 'locked', selected: state === 'selected' }}>
        {body}
      </View>
    );
  }
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: state === 'selected' }}
      style={frame}>
      {body}
    </PressableScale>
  );
}

export type MetricCardProps = Omit<MaterialCardProps, 'children'> & {
  label: string;
  value: number;
  suffix?: string;
  pad?: number;
  caption?: string;
};

/** Số đo phụ: nhãn in hoa, số Be Vietnam Pro tabular. Không dot-matrix — dot dành cho bảng điểm. */
export function MetricCard({ label, value, suffix, pad, caption, state = 'normal', accessibilityLabel, ...card }: MetricCardProps) {
  const s = useStyles();
  return (
    <MaterialCard
      {...card}
      state={state}
      accessibilityLabel={accessibilityLabel ?? `${label}: ${value}${suffix ?? ''}${caption ? `, ${caption}` : ''}`}>
      <View style={s.metric}>
        <AppText variant="label" color="textTertiary">
          {label}
        </AppText>
        <StatValue value={value} suffix={suffix} pad={pad} />
        {caption && (
          <AppText variant="caption" color="textTertiary" numberOfLines={1}>
            {caption}
          </AppText>
        )}
      </View>
    </MaterialCard>
  );
}

/** Số Be Vietnam Pro tabular + hậu tố nhỏ. Dùng cho mọi con số không phải bảng điểm. */
export function StatValue({
  value,
  suffix,
  pad = 1,
  inverse = false,
}: {
  value: number;
  suffix?: string;
  pad?: number;
  inverse?: boolean;
}) {
  const s = useStyles();
  return (
    <View style={s.stat}>
      <AppText variant="metric" tabular color={inverse ? 'onSurfaceInverse' : 'textPrimary'}>
        {String(value).padStart(pad, '0')}
      </AppText>
      {suffix && (
        <AppText variant="headline" color={inverse ? 'onSurfaceInverseSecondary' : 'textTertiary'}>
          {suffix}
        </AppText>
      )}
    </View>
  );
}

export type ScoreboardProps = Omit<MaterialCardProps, 'children' | 'material' | 'state'> & {
  label: string;
  value: number;
  suffix?: string;
  pad?: number;
  /** Góc phải trên, ví dụ "+6 this week". */
  caption?: string;
  /** Số phụ ở chân bảng, chữ Be Vietnam Pro. */
  stats?: readonly { label: string; value: number; suffix?: string; pad?: number }[];
  children?: ReactNode;
};

/**
 * Bảng điểm: khối mực đen, số dot-matrix trắng. MỖI MÀN ĐÚNG MỘT CÁI, cho con số chính của màn.
 * Dot-matrix chỉ sống ở đây, vì nó đọc như bảng LED trên bàn bida; rải khắp nơi thì mất nghĩa.
 */
export function Scoreboard({
  label,
  value,
  suffix,
  pad,
  caption,
  stats,
  children,
  padding = 'xl',
  accessibilityLabel,
  ...card
}: ScoreboardProps) {
  const s = useStyles();
  return (
    <MaterialCard
      {...card}
      material="solid"
      padding={padding}
      accessibilityLabel={accessibilityLabel ?? `${label}: ${value}${suffix ?? ''}${caption ? `, ${caption}` : ''}`}>
      <View style={s.boardTop}>
        <AppText variant="label" color="onSurfaceInverseSecondary">
          {label}
        </AppText>
        {caption && (
          <AppText variant="caption" color="onSurfaceInverseSecondary" numberOfLines={1}>
            {caption}
          </AppText>
        )}
      </View>
      <DotMatrixNumber value={value} suffix={suffix} pad={pad} size="xl" color="onSurfaceInverse" style={s.boardValue} />
      {children}
      {stats && stats.length > 0 && (
        <View style={s.boardStats}>
          {stats.map((st, i) => (
            <View key={st.label} style={[s.boardStat, i > 0 && s.boardStatDivider]}>
              <AppText variant="label" color="onSurfaceInverseSecondary">
                {st.label}
              </AppText>
              <StatValue value={st.value} suffix={st.suffix} pad={st.pad} inverse />
            </View>
          ))}
        </View>
      )}
    </MaterialCard>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    borderRadius: t.radius.xLarge,
    borderCurve: 'continuous',
    borderWidth: t.border.normal,
    overflow: 'hidden',
  },
  selected: { borderColor: t.color.borderAccent },
  lockedBody: { opacity: 0.4 },
  badge: { position: 'absolute', top: t.space.md, right: t.space.md },
  metric: { gap: t.space.xs },
  stat: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  boardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: t.space.sm },
  boardValue: { marginTop: t.space.lg, marginBottom: t.space.lg },
  boardStats: {
    flexDirection: 'row',
    marginTop: t.space.xs,
    paddingTop: t.space.md,
    borderTopWidth: t.border.hairline,
    borderTopColor: 'rgba(255, 255, 255, 0.14)',
  },
  boardStat: { flex: 1, gap: t.space.xxs },
  boardStatDivider: { paddingLeft: t.space.md, borderLeftWidth: t.border.hairline, borderLeftColor: 'rgba(255, 255, 255, 0.14)' },
}));
