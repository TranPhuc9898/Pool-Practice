import { router, Stack } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';
import { ListGroup, PickerRow, Section } from '@/design-system';
import { replayGuide } from '@/pool-engine/first-use';
import { replayOnboarding } from '@/pool-engine/onboarding';

/** Mở từ nút gear trên Home. Chưa có account: app chạy guest, tiến độ lưu trên máy. */
export default function SettingsScreen() {
  return (
    <PlaceholderScreen
      icon="gearshape"
      title="Settings"
      description="Playing as guest. Your progress is saved on this device.">
      <Stack.Screen options={{ title: 'Settings' }} />
      <Section title="Help">
        <ListGroup>
          {/* Bật lại hai hint rồi mở thẳng Workout, back vẫn về Settings. */}
          <PickerRow
            label="Hướng dẫn nhanh"
            icon="questionmark.circle"
            onPress={() => {
              replayGuide();
              router.push('/workout');
            }}
          />
          {/* Cờ đổi thì root layout tự thay stack bằng intro. */}
          <PickerRow label="Giới thiệu app" icon="sparkles" onPress={replayOnboarding} />
        </ListGroup>
      </Section>
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
