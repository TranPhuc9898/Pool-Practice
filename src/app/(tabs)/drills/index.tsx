import { DrillCard } from '@/components/drill-card';
import { Screen, Section } from '@/design-system';
import { DRILLS } from '@/pool-engine/drills';
import { useAllProgress } from '@/pool-engine/progress';
import { CURRICULUM, stageNumberIn, STAGES } from '@/pool-engine/stages';

const inCurriculum = new Set(Object.values(CURRICULUM).flat());
const byId = new Map(DRILLS.map((d) => [d.id, d]));
const extra = DRILLS.filter((d) => !inCurriculum.has(d.id));

/** Thư viện theo giáo trình 6 giai đoạn, bài kiểm cuối mỗi giai đoạn, không khoá. Bài ngoài giáo trình gom ở cuối. */
export default function DrillsScreen() {
  const progress = useAllProgress();

  return (
    <Screen gap="lg">
      {STAGES.map((stage) => (
        <Section key={stage.stage} title={`Stage ${stage.stage} · ${stage.title}`} caption={`${stage.sabo} · ${stage.benchmark}`}>
          {CURRICULUM[stage.stage].map((id) => {
            const drill = byId.get(id)!;
            return <DrillCard key={id} drill={drill} number={stageNumberIn(drill)} progress={progress.get(id)} />;
          })}
        </Section>
      ))}
      {extra.length > 0 && (
        <Section title="More drills" caption="Outside the six-stage curriculum">
          {extra.map((drill) => (
            <DrillCard key={drill.id} drill={drill} progress={progress.get(drill.id)} />
          ))}
        </Section>
      )}
    </Screen>
  );
}
