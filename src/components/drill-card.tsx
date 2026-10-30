import { router } from 'expo-router';
import { View } from 'react-native';

import { numberIn } from '@/components/home/training-areas';
import { AppChip, AppIcon, AppText, makeStyles, MaterialCard, rankTone, type ChipTone } from '@/design-system';
import { groupOf, SKILL_GROUPS } from '@/pool-engine/groups';
import { levelOf } from '@/pool-engine/levels';
import { drillStatus, passLabel, type DrillProgress, type DrillStatus } from '@/pool-engine/progress';
import type { PoolDrill } from '@/pool-engine/types';

const statusMeta: Record<DrillStatus, { label: string; tone: ChipTone }> = {
  notStarted: { label: 'Not Started', tone: 'neutral' },
  inProgress: { label: 'In Progress', tone: 'accent' },
  passed: { label: 'Passed', tone: 'success' },
  notPassed: { label: 'Not Passed', tone: 'error' },
};

/**
 * Một dòng drill: số (mặc định số trong nhóm, `number` để màn gọi tự đánh), tên, hạng · nhóm kỹ năng · điểm, chip
 * trạng thái. Card không mang màu hạng, hạng chỉ là chữ. `compact` cho trang một hạng, nơi hạng và nhóm đã nằm ở
 * header: dòng phụ chỉ còn kỹ năng · điểm. Bấm mở `/drill/[id]`.
 */
export function DrillCard({
  drill,
  progress,
  number,
  compact = false,
}: {
  drill: PoolDrill;
  progress?: DrillProgress;
  number?: string;
  compact?: boolean;
}) {
  const s = useStyles();
  const key = progress ? drillStatus(drill, progress) : 'notStarted';
  const status = statusMeta[key];
  const n = number ?? numberIn(drill);
  const group = SKILL_GROUPS.find((g) => g.id === groupOf(drill))?.title ?? drill.skillLabel;
  // `best` của roundQuota là điểm đã chặn theo round, so với `required` chứ không với số cú.
  const outOf = drill.passCondition.kind === 'roundQuota' ? drill.passCondition.required : drill.attemptCount;
  const best = progress?.best ? `Best ${progress.best}/${outOf}` : `Pass ${passLabel(drill)}`;

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
            {compact ? `${drill.skillLabel} · ${best}` : `Rank ${rankTone[levelOf(drill)].label} · ${group} · ${best}`}
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
