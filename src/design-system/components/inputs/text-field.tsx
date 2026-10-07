import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { makeStyles, useTheme } from '../../theme';
import { AppIcon, type IconName } from '../app-icon';
import { AppText } from '../app-text';
import { PressableScale } from '../pressable-scale';

export type AppTextFieldProps = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  label?: string;
  helper?: string;
  error?: string;
  icon?: IconName;
  suffix?: string;
  disabled?: boolean;
  /** Nút xoá khi có chữ (search). */
  clearable?: boolean;
  tabular?: boolean;
};

export function AppTextField({
  label,
  helper,
  error,
  icon,
  suffix,
  disabled,
  clearable,
  tabular,
  value,
  onChangeText,
  onFocus,
  onBlur,
  accessibilityLabel,
  ...rest
}: AppTextFieldProps) {
  const t = useTheme();
  const s = useStyles();
  const [focused, setFocused] = useState(false);
  const { maxScale, ...type } = t.type.bodyLarge;

  const borderColor = error ? t.color.error : focused ? t.color.borderAccent : t.color.borderPrimary;

  return (
    <View style={s.wrapper}>
      {label && (
        <AppText variant="callout" color="textSecondary">
          {label}
        </AppText>
      )}
      <View
        style={[
          s.field,
          { borderColor, backgroundColor: disabled ? t.color.backgroundSecondary : t.color.surfacePrimary },
        ]}>
        {icon && <AppIcon name={icon} size="medium" color="textTertiary" />}
        <TextInput
          {...rest}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={error ?? helper}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          maxFontSizeMultiplier={maxScale}
          placeholderTextColor={t.color.textTertiary}
          selectionColor={t.color.accentContent}
          cursorColor={t.color.accentContent}
          keyboardAppearance={t.name}
          style={[
            type,
            s.input,
            { color: disabled ? t.color.textDisabled : t.color.textPrimary },
            tabular && { fontVariant: ['tabular-nums'] },
          ]}
        />
        {suffix && (
          <AppText variant="body" color="textTertiary">
            {suffix}
          </AppText>
        )}
        {clearable && !!value && (
          <PressableScale
            onPress={() => onChangeText?.('')}
            accessibilityRole="button"
            accessibilityLabel="Clear text">
            <AppIcon name="xmark.circle.fill" size="medium" color="textTertiary" />
          </PressableScale>
        )}
      </View>
      {(error || helper) && (
        <View style={s.message}>
          {error && <AppIcon name="exclamationmark.circle" size="small" color="error" />}
          <AppText variant="caption" color={error ? 'error' : 'textTertiary'}>
            {error ?? helper}
          </AppText>
        </View>
      )}
    </View>
  );
}

export function AppSearchField(props: Omit<AppTextFieldProps, 'icon' | 'clearable'>) {
  return (
    <AppTextField
      icon="magnifyingglass"
      clearable
      returnKeyType="search"
      autoCorrect={false}
      autoCapitalize="none"
      placeholder="Search"
      {...props}
    />
  );
}

/** Nhập số (số bi, số lần thử). Bàn phím số + chữ số đều cột. */
export function NumericInput(props: Omit<AppTextFieldProps, 'keyboardType' | 'tabular'>) {
  return <AppTextField keyboardType="number-pad" tabular inputMode="numeric" {...props} />;
}

const useStyles = makeStyles((t) => ({
  wrapper: { gap: t.space.xs },
  field: {
    minHeight: t.layout.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.sm,
    paddingHorizontal: t.space.md,
    borderRadius: t.radius.medium,
    borderCurve: 'continuous',
    borderWidth: t.border.normal,
  },
  input: { flex: 1, paddingVertical: t.space.sm },
  message: { flexDirection: 'row', alignItems: 'center', gap: t.space.xxs },
}));
