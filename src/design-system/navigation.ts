import { DarkTheme, DefaultTheme, type Stack, type Theme as NavigationTheme } from 'expo-router';
import type { ComponentProps } from 'react';
import { Platform } from 'react-native';

import type { Theme } from './theme';

type StackScreenOptions = NonNullable<ComponentProps<typeof Stack>['screenOptions']>;

/** Theme cho React Navigation (nền màn, màu header mặc định). */
export function navigationTheme(t: Theme): NavigationTheme {
  const nav = t.name === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...nav,
    colors: {
      ...nav.colors,
      primary: t.color.accentContent,
      background: t.color.backgroundPrimary,
      card: t.color.backgroundPrimary,
      text: t.color.textPrimary,
      border: t.color.borderSubtle,
      notification: t.color.error,
    },
  };
}

/**
 * Native stack dùng chung. Large title + header trong suốt: iOS 26 tự lo scroll-edge effect,
 * nên không set `headerBlurEffect` (chồng hiệu ứng).
 */
export function stackScreenOptions(t: Theme): StackScreenOptions {
  return {
    headerLargeTitleEnabled: true,
    headerTransparent: true,
    headerShadowVisible: false,
    headerLargeTitleShadowVisible: false,
    // `automatic` không hiện khi header không có title (Today) → ép `soft` để nội dung mờ dần dưới status bar.
    scrollEdgeEffects: { top: 'soft', bottom: 'automatic', left: 'automatic', right: 'automatic' },
    headerTintColor: t.color.textPrimary,
    headerBackButtonDisplayMode: 'minimal',
    headerTitleStyle: { fontFamily: t.type.headline.fontFamily, color: t.color.textPrimary },
    headerLargeTitleStyle: { fontFamily: t.type.display.fontFamily, color: t.color.textPrimary },
    contentStyle: { backgroundColor: t.color.backgroundPrimary },
  };
}

/** Props cho NativeTabs. Tab không có animation chuyển — đổi tab là 100+ lần/ngày. */
export function tabBarProps(t: Theme) {
  return {
    tintColor: t.color.accentContent,
    iconColor: { default: t.color.textSecondary, selected: t.color.accentContent },
    labelStyle: {
      default: { fontFamily: t.type.captionSmall.fontFamily, color: t.color.textSecondary },
      selected: { fontFamily: t.type.captionSmall.fontFamily, color: t.color.accentContent },
    },
    // iOS giữ tab bar Liquid Glass mặc định; nền đặc chỉ cho Android.
    ...(Platform.OS === 'android' && {
      backgroundColor: t.color.backgroundSecondary,
      indicatorColor: t.color.accentMuted,
    }),
  } as const;
}
