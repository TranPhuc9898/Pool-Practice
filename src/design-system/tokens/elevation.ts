import type { ViewStyle } from 'react-native';

export type ShadowToken = 'none' | 'card' | 'floating' | 'accentGlow';
export type ShadowTokens = Record<ShadowToken, ViewStyle>;

/** Dark: phân tầng bằng surface + border, bóng chỉ phụ. */
export const darkShadow: ShadowTokens = {
  none: {},
  card: { boxShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' },
  floating: { boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55)' },
  accentGlow: { boxShadow: '0 0 20px rgba(245, 197, 66, 0.22)' },
};

/** Light: card trắng trên nền ngà, tách nhau bằng bóng mềm hai lớp thay vì border đậm. */
export const lightShadow: ShadowTokens = {
  none: {},
  card: { boxShadow: '0 1px 2px rgba(17, 17, 17, 0.04), 0 4px 16px rgba(17, 17, 17, 0.05)' },
  floating: { boxShadow: '0 12px 32px rgba(17, 17, 17, 0.14)' },
  accentGlow: { boxShadow: '0 6px 20px rgba(217, 169, 39, 0.28)' },
};
