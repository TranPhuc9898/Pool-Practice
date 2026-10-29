import { router } from 'expo-router';
import { View } from 'react-native';

import { numberIn } from '@/components/home/training-areas';
import { AppChip, AppIcon, AppText, makeStyles, MaterialCard, type ChipTone } from '@/design-system';
import { drillStatus, type DrillProgress, type DrillStatus } from '@/pool-engine/progress';
import { stageOf } from '@/pool-engine/stages';
import type { PoolDrill } from '@/pool-engine/types';

const statusMeta: Record<DrillStatus, { label: string; tone: ChipTone }> = {
  notStarted: { label: 'Not Started', tone: 'neutral' },
  inProgress: { label: 'In Progress', tone: 'accent' },
  passed: { label: 'Passed', tone: 'success' },
  notPassed: { label: 'Not Passed', tone: 'error' },
};

/**
 * Một dòng drill: số (mặc định số trong nhóm, `number` để màn gọi tự đánh), tên, kỹ năng · giai đoạn kèm hạng SABO tham
 * khảo · điểm, chip trạng thái. Bấm mở `/drill/[id]`.
 */
export function DrillCard({ drill, progress, number }: { drill: PoolDrill; progress?: DrillProgress; number?: string }) {
  const s = useStyles();
  const key = progress ? drillStatus(drill, progress) : 'notStarted';
  const status = statusMeta[key];
  const n = number ?? numberIn(drill);
  const stage = stageOf(drill);
  const best = progress?.best
    ? `Best ${progress.best}/${drill.attemptCount}`
    : `Pass ${drill.passCondition.required}/${drill.attemptCount}`;

  return (
    <MaterialCard
      padding="md"
      state={key === 'inProgress' ? 'active' : 'normal'}
      onPress={() => router.push(`/drill/${drill.number}`)}
      accessibilityLabel={`Drill ${n}, ${drill.title}, ${drill.skillLabel}, ${status.label}`}>
      <View style={s.row}>
        <AppText variant="mono" color="textTertiary" style={s.number}>
          {n}
        </AppText>
        <View style={s.flex}>
          <AppText variant="headline">{drill.title}</AppText>
          <AppText variant="caption" color="textTertiary">
            {drill.skillLabel} · Stage {stage.stage} ~{stage.sabo} · {best}
          </AppText>
        </View>
        <AppChip label={status.label} tone={status.tone} />
        <AppIcon name="chevron.right" size="small" color="textTertiary" weight="semibold" />
      </View>
    </MaterialCard>
  );
}

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: t.space.sm },
  number: { width: 24 },
  flex: { flex: 1, gap: 2 },
}));
