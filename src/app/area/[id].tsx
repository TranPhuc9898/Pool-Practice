import { Stack, useLocalSearchParams } from 'expo-router';

import { DrillCard } from '@/components/drill-card';
import { drillsIn, TRAINING_AREAS } from '@/components/home/training-areas';
import { AppText, Screen } from '@/design-system';
import { useAllProgress } from '@/pool-engine/progress';

/** Drill của một nhóm, mở từ ô category trên Home. Push lên stack gốc nên có nút back về Home. */
export default function AreaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const progress = useAllProgress();
  const area = TRAINING_AREAS.find((a) => a.id === id) ?? TRAINING_AREAS[0];

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
