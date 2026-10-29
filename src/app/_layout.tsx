import { Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { darkTheme, navigationTheme, stackScreenOptions, ThemeProvider, useAppFonts } from '@/design-system';
import { LogoOutro } from '@/components/onboarding/logo-outro';
import { useOnboardingDone, useOutroPlaying } from '@/pool-engine/onboarding';

SplashScreen.preventAutoHideAsync();

// Deep link thẳng vào màn con (vd. /drill/5) vẫn có (tabs) nằm dưới, nên luôn có nút back.
export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  const fontsReady = useAppFonts();
  const onboarded = useOnboardingDone();
  const outroPlaying = useOutroPlaying();

  useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync();
  }, [fontsReady]);

  if (!fontsReady) return null;

  const theme = darkTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.color.backgroundPrimary }}>
      <ThemeProvider theme={theme}>
        <NavigationThemeProvider value={navigationTheme(theme)}>
          <StatusBar style={theme.name === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={stackScreenOptions(theme)}>
            {/* Chưa xem intro thì chỉ có intro; xem xong thì intro biến mất khỏi stack. */}
            <Stack.Protected guard={!onboarded}>
              <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
            </Stack.Protected>
            <Stack.Protected guard={onboarded}>
              {/* Logo outro phủ lên và tự expand ra home, không để stack trượt home từ phải vào. */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
              <Stack.Screen name="design-system" options={{ title: 'Design System' }} />
              <Stack.Screen name="settings" />
              <Stack.Screen name="workout" />
              <Stack.Screen name="stance" />
              <Stack.Screen name="clip" />
              <Stack.Screen name="editor" />
              <Stack.Screen name="drill/[id]" />
              <Stack.Screen name="area/[id]" />
              <Stack.Screen
                name="rank/[id]"
                options={{
                  headerShown: false,
                  presentation: 'transparentModal',
                  animation: 'none',
                  gestureEnabled: false,
                  contentStyle: { backgroundColor: 'transparent' },
                }}
              />
            </Stack.Protected>
          </Stack>
          {outroPlaying && <LogoOutro />}
        </NavigationThemeProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
