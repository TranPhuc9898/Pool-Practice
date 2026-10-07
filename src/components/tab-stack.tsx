import { Stack } from 'expo-router';
import type { ComponentProps } from 'react';

import { stackScreenOptions, useTheme } from '@/design-system';

type Options = Exclude<ComponentProps<typeof Stack.Screen>['options'], undefined | ((...args: never[]) => unknown)>;

/** Stack native trong mỗi tab — cùng header style, chỉ khác title của màn gốc. */
export function TabStack({ title, rootOptions }: { title: string; rootOptions?: Options }) {
  const t = useTheme();
  return (
    <Stack screenOptions={stackScreenOptions(t)}>
      <Stack.Screen name="index" options={{ title, ...rootOptions }} />
    </Stack>
  );
}
