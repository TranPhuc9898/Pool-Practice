import { SymbolView, type SymbolViewProps } from 'expo-symbols';

import { useTheme } from '../theme';
import type { ColorToken } from '../tokens/color';
import type { IconSizeToken } from '../tokens/scale';

export type IconName = SymbolViewProps['name'];

type Props = {
  name: IconName;
  size?: IconSizeToken;
  color?: ColorToken;
  weight?: SymbolViewProps['weight'];
};

/** SF Symbols, màu luôn từ color token. Icon trang trí nên ẩn khỏi VoiceOver ở component cha. */
export function AppIcon({ name, size = 'medium', color = 'textPrimary', weight = 'medium' }: Props) {
  const t = useTheme();
  const px = t.icon[size];
  return (
    <SymbolView
      name={name}
      size={px}
      weight={weight}
      tintColor={t.color[color]}
      style={{ width: px, height: px }}
    />
  );
}
