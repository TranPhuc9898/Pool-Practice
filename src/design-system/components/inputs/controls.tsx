import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Switch, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { makeStyles, useTheme } from '../../theme';
import { AppIcon, type IconName } from '../app-icon';
import { AppText } from '../app-text';
import { IconButton } from '../button';
import { PressableScale } from '../pressable-scale';

/* ── Toggle ─────────────────────────────────────────────────
 * Switch native, chỉ đổi màu. Không tự vẽ lại — hệ thống làm tốt hơn và có sẵn haptic/VO.
 */
type AppToggleProps = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
};

export function AppToggle({ label, description, value, onValueChange, disabled }: AppToggleProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={s.row}>
      <View style={s.flex}>
        <AppText variant="bodyLarge" color={disabled ? 'textDisabled' : 'textPrimary'}>
          {label}
        </AppText>
        {description && (
          <AppText variant="caption" color="textTertiary">
            {description}
          </AppText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        accessibilityLabel={label}
        trackColor={{ true: t.color.accent, false: t.color.surfacePressed }}
        ios_backgroundColor={t.color.surfacePressed}
      />
    </View>
  );
}

/* ── Stepper ────────────────────────────────────────────── */
type AppStepperProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: (v: number) => string;
};

export function AppStepper({ label, value, onChange, min = 0, max = 99, step = 1, format = String }: AppStepperProps) {
  const s = useStyles();
  const set = (v: number) => {
    const next = Math.min(max, Math.max(min, v));
    if (next !== value) {
      Haptics.selectionAsync();
      onChange(next);
    }
  };
  return (
    <View
      style={s.row}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min, max, now: value, text: format(value) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => set(value + (e.nativeEvent.actionName === 'increment' ? step : -step))}>
      <AppText variant="bodyLarge" style={s.flex}>
        {label}
      </AppText>
      <View style={s.stepper}>
        <IconButton icon="minus" accessibilityLabel={`Decrease ${label}`} onPress={() => set(value - step)} disabled={value <= min} />
        <AppText variant="title3" tabular align="center" style={s.stepperValue}>
          {format(value)}
        </AppText>
        <IconButton icon="plus" accessibilityLabel={`Increase ${label}`} onPress={() => set(value + step)} disabled={value >= max} />
      </View>
    </View>
  );
}

/* ── Segmented control ──────────────────────────────────────
 * Pill vàng chạy bằng transform (absolute, không con) — 200ms ease-out, ngắt được.
 */
type Segment<T extends string> = { value: T; label: string };

type AppSegmentedControlProps<T extends string> = {
  segments: readonly Segment<T>[];
  value: T;
  onChange: (v: T) => void;
  accessibilityLabel: string;
};

export function AppSegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  accessibilityLabel,
}: AppSegmentedControlProps<T>) {
  const t = useTheme();
  const s = useStyles();
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const index = Math.max(0, segments.findIndex((sg) => sg.value === value));
  const inset = t.space.xxs - 1;
  const segmentWidth = width > 0 ? (width - inset * 2) / segments.length : 0;

  return (
    <View
      style={s.track}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}>
      {segmentWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            s.pill,
            {
              top: inset,
              bottom: inset,
              left: inset,
              width: segmentWidth,
              transform: [{ translateX: index * segmentWidth }],
              transitionProperty: 'transform',
              transitionDuration: reduced ? 0 : t.motion.duration.standard - 50,
              transitionTimingFunction: t.motion.curve.easeOut,
            },
          ]}
        />
      )}
      {segments.map((sg) => {
        const selected = sg.value === value;
        return (
          <PressableScale
            key={sg.value}
            scale={false}
            style={s.segment}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={sg.label}
            onPress={() => {
              if (!selected) {
                Haptics.selectionAsync();
                onChange(sg.value);
              }
            }}>
            <AppText variant="callout" color={selected ? 'onAccent' : 'textSecondary'} numberOfLines={1}>
              {sg.label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

/* ── Picker row ─────────────────────────────────────────────
 * Dòng mở picker/sheet. Giá trị hiện bên phải, chevron chỉ đường đi tiếp.
 */
type PickerRowProps = {
  label: string;
  value?: string;
  icon?: IconName;
  onPress: () => void;
  disabled?: boolean;
};

export function PickerRow({ label, value, icon, onPress, disabled }: PickerRowProps) {
  const t = useTheme();
  const s = useStyles();
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      scale={false}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      style={({ pressed }) => [s.pickerRow, pressed && { backgroundColor: t.color.surfacePressed }]}>
      {icon && (
        <View style={s.rowIcon}>
          <AppIcon name={icon} size="small" color="accentContent" />
        </View>
      )}
      <AppText variant="bodyLarge" color={disabled ? 'textDisabled' : 'textPrimary'} style={s.flex}>
        {label}
      </AppText>
      {value && (
        <AppText variant="body" color="textSecondary">
          {value}
        </AppText>
      )}
      <AppIcon name="chevron.right" size="small" color="textTertiary" weight="semibold" />
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  flex: { flex: 1 },
  row: {
    minHeight: t.layout.rowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.md,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: t.space.xs },
  stepperValue: { minWidth: t.space.xxxl },
  track: {
    flexDirection: 'row',
    minHeight: t.layout.minTouchTarget,
    borderRadius: t.radius.medium,
    borderCurve: 'continuous',
    backgroundColor: t.color.surfacePrimary,
    borderWidth: t.border.normal,
    borderColor: t.color.borderSubtle,
    padding: t.space.xxs - 1,
  },
  pill: {
    position: 'absolute',
    borderRadius: t.radius.small + 1,
    borderCurve: 'continuous',
    backgroundColor: t.color.accent,
  },
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: t.space.xs },
  pickerRow: {
    minHeight: t.layout.rowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.sm,
    paddingHorizontal: t.space.md,
  },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: t.radius.small,
    backgroundColor: t.color.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
