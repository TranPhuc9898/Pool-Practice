import { useMemo } from 'react';

import { DRILLS } from '@/pool-engine/drills';
import { groupOf, SKILL_GROUPS } from '@/pool-engine/groups';
import { LEVEL_BENCHMARK, LEVELS, levelOf, suggestedLevel } from '@/pool-engine/levels';
import { drillStatus, useAllProgress, type DrillProgress } from '@/pool-engine/progress';
import type { PoolDrill, TrainingLevel } from '@/pool-engine/types';

const groupRank = new Map(SKILL_GROUPS.map((g, i) => [g.id, i]));

/** Bài trong một hạng, xếp theo thứ tự nhóm kỹ năng rồi số drill. Số 01.. trên card lấy từ thứ tự này. */
const byLevel = new Map<TrainingLevel, PoolDrill[]>(
  LEVELS.map((level) => [
    level,
    DRILLS.filter((d) => levelOf(d) === level).sort(
      (a, b) => groupRank.get(groupOf(a))! - groupRank.get(groupOf(b))! || a.number - b.number,
    ),
  ]),
);

/** Hạng có ít nhất một bài. Hạng trống không có ô. */
export const RANKS_WITH_DRILLS = LEVELS.filter((level) => byLevel.get(level)!.length > 0);

export const drillsOfLevel = (level: TrainingLevel) => byLevel.get(level)!;

export const numberInLevel = (drill: PoolDrill) =>
  String(byLevel.get(levelOf(drill))!.indexOf(drill) + 1).padStart(2, '0');

const isPassed = (progress: ReadonlyMap<string, DrillProgress>) => (drill: PoolDrill) => {
  const p = progress.get(drill.id);
  return !!p && drillStatus(drill, p) === 'passed';
};

export type LevelSummary = {
  level: TrainingLevel;
  benchmark: string;
  drills: readonly PoolDrill[];
  passed: number;
  /** Bài chưa qua đầu tiên theo thứ tự trong hạng; qua hết thì không có. */
  next?: PoolDrill;
};

/** Tiến độ thật của từng hạng và hạng nên tập tiếp, đọc từ `useAllProgress`. */
export function useLevelSummaries() {
  const progress = useAllProgress();
  return useMemo(() => {
    const passed = isPassed(progress);
    const summaries = new Map<TrainingLevel, LevelSummary>(
      RANKS_WITH_DRILLS.map((level) => {
        const drills = byLevel.get(level)!;
        return [
          level,
          {
            level,
            benchmark: LEVEL_BENCHMARK[level],
            drills,
            passed: drills.filter(passed).length,
            next: drills.find((d) => !passed(d)),
          },
        ];
      }),
    );
    return { summaries, suggested: suggestedLevel(DRILLS, passed), progress };
  }, [progress]);
}
