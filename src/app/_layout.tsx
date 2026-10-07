import { Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { darkTheme, navigationTheme, stackScreenOptions, ThemeProvider, useAppFonts } from '@/design-system';

SplashScreen.preventAutoHideAsync();

// Deep link thẳng vào màn con (vd. /drill/5) vẫn có (tabs) nằm dưới, nên luôn có nút back.
export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  const fontsReady = useAppFonts();

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
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="design-system" options={{ title: 'Design System' }} />
          </Stack>
        </NavigationThemeProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
