import { DrillCard } from '@/components/drill-card';
import { drillsIn, TRAINING_AREAS } from '@/components/home/training-areas';
import { Screen, Section } from '@/design-system';
import { useAllProgress } from '@/pool-engine/progress';

/** Thư viện đủ 10 drill, nhóm theo đúng 4 nhóm của Home. */
export default function DrillsScreen() {
  const progress = useAllProgress();

  return (
    <Screen gap="lg">
      {TRAINING_AREAS.map((area) => {
        const drills = drillsIn(area.id);
        if (drills.length === 0) return null;
        return (
          <Section key={area.id} title={area.title} caption={area.topics}>
            {drills.map((drill) => (
              <DrillCard key={drill.id} drill={drill} progress={progress.get(drill.id)} />
            ))}
          </Section>
        );
      })}
    </Screen>
  );
}
