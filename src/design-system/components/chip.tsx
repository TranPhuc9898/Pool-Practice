import { View } from 'react-native';

import { makeStyles, useTheme } from '../theme';
import type { ColorToken } from '../tokens/color';
import { AppIcon, type IconName } from './app-icon';
import { AppText } from './app-text';
import { PressableScale } from './pressable-scale';

export type ChipTone = 'neutral' | 'accent' | 'success' | 'warning' | 'error';

const tones: Record<ChipTone, { bg: ColorToken; fg: ColorToken }> = {
  neutral: { bg: 'backgroundSecondary', fg: 'textSecondary' },
  accent: { bg: 'accentMuted', fg: 'accentContent' },
  success: { bg: 'successMuted', fg: 'success' },
  warning: { bg: 'warningMuted', fg: 'warning' },
  error: { bg: 'errorMuted', fg: 'error' },
};

type AppChipProps = {
  label: string;
  tone?: ChipTone;
  icon?: IconName;
  /** Nhãn đọc cho VoiceOver khi chữ trên chip quá ngắn. */
  accessibilityLabel?: string;
};

/** Chip tĩnh — chỉ hiển thị. Muốn bấm được dùng `SelectChip`. */
export function AppChip({ label, tone = 'neutral', icon, accessibilityLabel }: AppChipProps) {
  const t = useTheme();
  const s = useStyles();
  const { bg, fg } = tones[tone];
  return (
    <View
      style={[s.base, { backgroundColor: t.color[bg] }]}
      accessible
      accessibilityLabel={accessibilityLabel ?? label}>
      {icon && <AppIcon name={icon} size="small" color={fg} weight="semibold" />}
      <AppText variant="captionSmall" color={fg} style={s.label}>
        {label}
      </AppText>
    </View>
  );
}

/* ── Domain chips ─────────────────────────────────────────── */

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const difficultyMeta: Record<Difficulty, { label: string; level: 1 | 2 | 3 }> = {
  beginner: { label: 'Beginner', level: 1 },
  intermediate: { label: 'Intermediate', level: 2 },
  advanced: { label: 'Advanced', level: 3 },
};

/** Độ khó báo bằng chữ + số chấm đầy, không chỉ bằng màu. */
export function DifficultyChip({ level }: { level: Difficulty }) {
  const t = useTheme();
  const s = useStyles();
  const meta = difficultyMeta[level];
  return (
    <View
      style={[s.base, { backgroundColor: t.color.backgroundSecondary }]}
      accessible
      accessibilityLabel={`Difficulty: ${meta.label}`}>
      <View style={s.dots}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[s.dot, { backgroundColor: i <= meta.level ? t.color.accent : t.color.borderStrong }]}
          />
        ))}
      </View>
      <AppText variant="captionSmall" color="textSecondary" style={s.label}>
        {meta.label}
      </AppText>
    </View>
  );
}

export const CategoryChip = ({ label }: { label: string }) => <AppChip label={label} tone="neutral" />;

export const CompletedChip = () => <AppChip label="Completed" tone="success" icon="checkmark" />;

export type Status = 'completed' | 'inProgress' | 'notStarted' | 'failed';

const statusMeta: Record<Status, { label: string; tone: ChipTone; icon: IconName }> = {
  completed: { label: 'Completed', tone: 'success', icon: 'checkmark' },
  inProgress: { label: 'In Progress', tone: 'accent', icon: 'circle.lefthalf.filled' },
  notStarted: { label: 'Not Started', tone: 'neutral', icon: 'circle' },
  failed: { label: 'Missed', tone: 'error', icon: 'xmark' },
};

export function StatusChip({ status }: { status: Status }) {
  const m = statusMeta[status];
  return <AppChip label={m.label} tone={m.tone} icon={m.icon} />;
}

type SelectChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
};

/** Chip lọc bấm được (9-Ball / 10-Ball / All). Chọn = card trắng viền mực + dấu check; bỏ chọn = chữ mờ, không nền. */
export function SelectChip({ label, selected, onPress, icon }: SelectChipProps) {
  const t = useTheme();
  const s = useStyles();
  const fg: ColorToken = selected ? 'textPrimary' : 'textTertiary';
  return (
    <PressableScale
      onPress={onPress}
      haptic="selection"
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        s.base,
        s.selectable,
        {
          backgroundColor: pressed ? t.color.surfacePressed : selected ? t.color.surfacePrimary : 'transparent',
          borderColor: selected ? t.color.borderAccent : t.color.borderStrong,
        },
      ]}>
      {selected ? (
        <AppIcon name="checkmark" size="small" color={fg} weight="bold" />
      ) : (
        icon && <AppIcon name={icon} size="small" color={fg} />
      )}
      <AppText variant="callout" color={fg}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: t.space.xxs + 2,
    paddingHorizontal: t.space.xs + 2,
    paddingVertical: t.space.xxs + 1,
    borderRadius: t.radius.pill,
  },
  selectable: {
    minHeight: 36,
    paddingHorizontal: t.space.md,
    gap: t.space.xs - 2,
    borderWidth: t.border.normal,
  },
  label: { textTransform: 'uppercase' },
  dots: { flexDirection: 'row', gap: 2 },
  dot: { width: 5, height: 5, borderRadius: t.radius.pill },
}));
