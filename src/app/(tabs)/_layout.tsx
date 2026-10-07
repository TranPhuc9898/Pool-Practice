import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { tabBarProps, useTheme } from '@/design-system';

/** Hai tab: Home để quay lại bàn tập, Drills để tra thư viện. Settings nằm ở header Home. */
export default function TabsLayout() {
  const t = useTheme();
  return (
    <NativeTabs {...tabBarProps(t)} minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(today)">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="drills">
        <NativeTabs.Trigger.Label>Drills</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }} md="list" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
