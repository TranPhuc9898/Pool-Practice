import { Text, type TextProps } from 'react-native';

import { useTheme } from '../theme';
import type { ColorToken } from '../tokens/color';
import type { TypographyToken } from '../tokens/typography';

export type AppTextProps = TextProps & {
  variant?: TypographyToken;
  color?: ColorToken;
  align?: 'left' | 'center' | 'right';
  /** Số liệu đổi liên tục (timer, điểm) — chữ số rộng đều, không nhảy. */
  tabular?: boolean;
};

/** Mọi chữ trong app đi qua đây. Không `fontSize` tay trong view. */
export function AppText({
  variant = 'body',
  color = 'textPrimary',
  align,
  tabular,
  style,
  ...rest
}: AppTextProps) {
  const t = useTheme();
  const { maxScale, ...type } = t.type[variant];
  return (
    <Text
      maxFontSizeMultiplier={maxScale}
      style={[
        type,
        { color: t.color[color] },
        align && { textAlign: align },
        tabular && { fontVariant: ['tabular-nums'] },
        style,
      ]}
      {...rest}
    />
  );
}
