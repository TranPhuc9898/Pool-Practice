import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

import { darkColors, lightColors, type ColorTokens } from './tokens/color';
import { darkShadow, lightShadow, type ShadowTokens } from './tokens/elevation';
import { dotMatrix } from './tokens/material';
import { curve, duration, easing, pressScale, spring } from './tokens/motion';
import { borderWidth, iconSize, layout, radius, spacing } from './tokens/scale';
import { typography } from './tokens/typography';

/**
 * Theme là điểm duy nhất view đọc design token.
 * Đổi giao diện cả app: sửa token, hoặc truyền theme khác vào <ThemeProvider>. Không sửa view.
 */
const base = {
  type: typography,
  space: spacing,
  radius,
  border: borderWidth,
  icon: iconSize,
  layout,
  dot: dotMatrix,
  motion: { duration, curve, easing, spring, pressScale },
} as const;

export type Theme = typeof base & {
  name: 'light' | 'dark';
  color: ColorTokens;
  shadow: ShadowTokens;
};

export const lightTheme: Theme = { ...base, name: 'light', color: lightColors, shadow: lightShadow };
export const darkTheme: Theme = { ...base, name: 'dark', color: darkColors, shadow: darkShadow };

const ThemeContext = createContext<Theme>(lightTheme);

export function ThemeProvider({ theme = lightTheme, children }: PropsWithChildren<{ theme?: Theme }>) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * `const useStyles = makeStyles((t) => ({ box: { padding: t.space.md } }))`
 * Style phụ thuộc theme, tính lại chỉ khi theme đổi.
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (t: Theme) => T & StyleSheet.NamedStyles<T>,
) {
  return function useStyles(): T {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
