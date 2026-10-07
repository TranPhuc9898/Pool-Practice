import { ActivityIndicator, View } from 'react-native';

import { makeStyles, useTheme, type Theme } from '../theme';
import type { ColorToken } from '../tokens/color';
import { AppIcon, type IconName } from './app-icon';
import { AppText } from './app-text';
import { PressableScale, type PressableScaleProps } from './pressable-scale';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'inverse';
export type ButtonSize = 'large' | 'medium';

type VariantSpec = {
  bg: ColorToken | 'transparent';
  bgPressed: ColorToken | 'transparent';
  fg: ColorToken;
  border?: ColorToken;
  /** Icon khác màu chữ — nút đen trên card gold có mũi tên gold. */
  iconColor?: ColorToken;
};

/** Một bảng duy nhất quyết định nhìn của 4 loại nút. */
const variants: Record<ButtonVariant, VariantSpec> = {
  primary: { bg: 'accent', bgPressed: 'accentPressed', fg: 'onAccent' },
  secondary: { bg: 'surfaceElevated', bgPressed: 'surfacePressed', fg: 'textPrimary', border: 'borderPrimary' },
  ghost: { bg: 'transparent', bgPressed: 'surfacePrimary', fg: 'textPrimary' },
  destructive: { bg: 'errorMuted', bgPressed: 'surfacePressed', fg: 'error' },
  /** Đặt trên bề mặt gold đặc. */
  inverse: { bg: 'backgroundPrimary', bgPressed: 'surfacePressed', fg: 'textPrimary', iconColor: 'accentContent' },
};

const resolve = (t: Theme, c: ColorToken | 'transparent') => (c === 'transparent' ? 'transparent' : t.color[c]);

export type AppButtonProps = Omit<PressableScaleProps, 'children' | 'style'> & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: 'leading' | 'trailing';
  loading?: boolean;
  fullWidth?: boolean;
};

export function AppButton({
  title,
  variant = 'primary',
  size = 'large',
  icon,
  iconPosition = 'leading',
  loading = false,
  fullWidth = true,
  disabled,
  accessibilityLabel,
  ...rest
}: AppButtonProps) {
  const t = useTheme();
  const s = useStyles();
  const spec = variants[variant];
  const inactive = disabled || loading;
  const fg: ColorToken = disabled ? 'textDisabled' : spec.fg;
  const iconFg: ColorToken = disabled ? 'textDisabled' : (spec.iconColor ?? spec.fg);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!inactive, busy: loading }}
      disabled={inactive}
      style={({ pressed }) => [
        s.base,
        size === 'large' ? s.large : s.medium,
        !fullWidth && s.hug,
        {
          backgroundColor: disabled
            ? t.color.surfacePrimary
            : resolve(t, pressed ? spec.bgPressed : spec.bg),
          borderColor: spec.border ? t.color[spec.border] : 'transparent',
        },
      ]}
      {...rest}>
      {/* Giữ label trong layout khi loading để nút không đổi cỡ. */}
      <View style={[s.content, loading && s.hidden]}>
        {icon && iconPosition === 'leading' && <AppIcon name={icon} size="medium" color={iconFg} />}
        <AppText variant={size === 'large' ? 'buttonLarge' : 'button'} color={fg} numberOfLines={1}>
          {title}
        </AppText>
        {icon && iconPosition === 'trailing' && <AppIcon name={icon} size="medium" color={iconFg} />}
      </View>
      {loading && <ActivityIndicator style={s.spinner} color={t.color[spec.fg]} />}
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    borderRadius: t.radius.medium,
    borderWidth: t.border.normal,
    borderCurve: 'continuous',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: t.space.xl,
  },
  large: { minHeight: t.layout.buttonHeight },
  medium: { minHeight: t.layout.buttonHeightCompact, paddingHorizontal: t.space.md },
  hug: { alignSelf: 'flex-start' },
  content: { flexDirection: 'row', alignItems: 'center', gap: t.space.xs },
  hidden: { opacity: 0 },
  spinner: { position: 'absolute' },
}));

/* Tên theo spec — mỏng, chỉ cố định variant. */
type Named = Omit<AppButtonProps, 'variant'>;
export const PrimaryButton = (p: Named) => <AppButton variant="primary" {...p} />;
export const SecondaryButton = (p: Named) => <AppButton variant="secondary" {...p} />;
export const GhostButton = (p: Named) => <AppButton variant="ghost" {...p} />;
export const DestructiveButton = (p: Named) => <AppButton variant="destructive" {...p} />;
export const InverseButton = (p: Named) => <AppButton variant="inverse" {...p} />;

export type IconButtonProps = Omit<PressableScaleProps, 'children' | 'style'> & {
  icon: IconName;
  /** Bắt buộc: icon-only không có chữ cho VoiceOver. */
  accessibilityLabel: string;
  variant?: 'filled' | 'tinted' | 'plain';
  selected?: boolean;
};

/** Nút tròn 44pt — đúng sàn touch target. */
export function IconButton({ icon, variant = 'filled', selected, disabled, ...rest }: IconButtonProps) {
  const t = useTheme();
  const s = useIconStyles();
  const fg: ColorToken = disabled ? 'textDisabled' : selected || variant === 'tinted' ? 'accentContent' : 'textPrimary';
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, selected: !!selected }}
      disabled={disabled}
      style={({ pressed }) => [
        s.base,
        variant !== 'plain' && {
          backgroundColor:
            variant === 'tinted' || selected
              ? t.color.accentMuted
              : pressed
                ? t.color.surfacePressed
                : t.color.backgroundSecondary,
          borderColor: selected ? t.color.borderAccent : t.color.borderSubtle,
        },
      ]}
      {...rest}>
      <AppIcon name={icon} size="medium" color={fg} />
    </PressableScale>
  );
}

const useIconStyles = makeStyles((t) => ({
  base: {
    width: t.layout.minTouchTarget,
    height: t.layout.minTouchTarget,
    borderRadius: t.radius.pill,
    borderWidth: t.border.normal,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
