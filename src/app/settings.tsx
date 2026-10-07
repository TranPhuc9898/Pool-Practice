import { router, Stack } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';
import { ListGroup, PickerRow, Section } from '@/design-system';

/** Mở từ nút gear trên Home. Chưa có account: app chạy guest, tiến độ lưu trên máy. */
export default function SettingsScreen() {
  return (
    <PlaceholderScreen
      icon="gearshape"
      title="Settings"
      description="Playing as guest. Your progress is saved on this device.">
      <Stack.Screen options={{ title: 'Settings' }} />
      {__DEV__ && (
        <Section title="Developer">
          <ListGroup>
            <PickerRow
              label="Design System"
              value="Catalog"
              icon="paintpalette"
              onPress={() => router.push('/design-system')}
            />
          </ListGroup>
        </Section>
      )}
    </PlaceholderScreen>
  );
}
