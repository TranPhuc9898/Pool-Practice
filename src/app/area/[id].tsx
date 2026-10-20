import { Stack, useLocalSearchParams } from 'expo-router';

import { DrillCard } from '@/components/drill-card';
import { drillsIn, TRAINING_AREAS } from '@/components/home/training-areas';
import { AppText, Screen, Section } from '@/design-system';
import { useAllProgress } from '@/pool-engine/progress';

/** Drill của một nhóm, mở từ ô category trên Home. Push lên stack gốc nên có nút back về Home.
 * `with` gộp thêm nhóm khác thành từng section, như tab Drills, để danh sách khớp số đếm trên ô. */
export default function AreaScreen() {
  const { id, with: extra } = useLocalSearchParams<{ id: string; with?: string }>();
  const progress = useAllProgress();
  const area = TRAINING_AREAS.find((a) => a.id === id) ?? TRAINING_AREAS[0];
  const also = TRAINING_AREAS.filter((a) => a.id === extra && a.id !== area.id);

  if (also.length === 0) {
    return (
      <Screen gap="md">
        <Stack.Screen options={{ title: area.title }} />
        <AppText variant="callout" color="textSecondary">
          {area.topics}
        </AppText>
        {drillsIn(area.id).map((drill) => (
          <DrillCard key={drill.id} drill={drill} progress={progress.get(drill.id)} />
        ))}
      </Screen>
    );
  }

  return (
    <Screen gap="lg">
      <Stack.Screen options={{ title: area.title }} />
      {[area, ...also].map((a) => (
        <Section key={a.id} title={a.title} caption={a.topics}>
          {drillsIn(a.id).map((drill) => (
            <DrillCard key={drill.id} drill={drill} progress={progress.get(drill.id)} />
          ))}
        </Section>
      ))}
    </Screen>
  );
}
