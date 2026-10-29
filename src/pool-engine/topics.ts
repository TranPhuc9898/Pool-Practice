import { DRILLS } from './drills';
import { STAGES, stageOf, type Stage } from './stages';
import type { DrillSkill, PoolDrill } from './types';

/**
 * Chủ đề drill, gộp 30 skill thành 12 nhóm theo kiểu trang drill của Dr. Dave. `required` là các hạng không được trống:
 * ô đã có drill hoặc ô vá trong `plans/261027-2246-drills-theo-chu-de-hang/plan.md`.
 */
export type Topic = {
  id: string;
  title: string;
  skills: readonly DrillSkill[];
  required: readonly Stage['stage'][];
};

export const TOPICS: Topic[] = [
  { id: 'stroke', title: 'Stroke & Aim', skills: ['straightStroke', 'spotShot', 'lineUp'], required: [1, 2, 3, 4] },
  { id: 'cuts', title: 'Cut Shots', skills: ['cutAngle', 'railCut', 'combo'], required: [1, 2, 3, 4, 5, 6] },
  { id: 'banks', title: 'Banks', skills: ['bank'], required: [2, 3, 4, 5, 6] },
  { id: 'kicks', title: 'Kicks', skills: ['kick'], required: [3, 4, 5, 6] },
  { id: 'safety', title: 'Safety', skills: ['safety'], required: [3, 4, 5, 6] },
  { id: 'break', title: 'Break', skills: ['break'], required: [2, 4, 6] },
  {
    id: 'cueBall',
    title: 'Stop, Follow, Draw',
    skills: ['stop', 'follow', 'followDistance', 'draw', 'drawDistance', 'drawAngle'],
    required: [1, 2, 3, 4, 5],
  },
  {
    id: 'position',
    title: 'Speed & Position',
    skills: ['speedControl', 'tangent', 'naturalAngle', 'threePositions', 'wagonWheel', 'oneRail', 'noRail', 'correctSide'],
    required: [1, 2, 3, 4, 5, 6],
  },
  { id: 'english', title: 'English', skills: ['english'], required: [3, 4, 5] },
  { id: 'jumpMasse', title: 'Jump & Massé', skills: ['jump', 'masse'], required: [4, 5, 6] },
  { id: 'patterns', title: 'Patterns & Runouts', skills: ['pattern', 'runout'], required: [2, 3, 4, 5, 6] },
  { id: 'tests', title: 'Tests', skills: ['test'], required: [1, 3, 4, 5, 6] },
];

export function topicOf(drill: PoolDrill): Topic | undefined {
  return TOPICS.find((t) => t.skills.includes(drill.skill));
}

export function drillsByRank(topic: Topic, drills: readonly PoolDrill[] = DRILLS): Record<Stage['stage'], PoolDrill[]> {
  const out: Record<Stage['stage'], PoolDrill[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  for (const d of drills) if (topicOf(d) === topic) out[stageOf(d).stage].push(d);
  return out;
}

/** Nhãn hạng tham khảo (`K–I` … `C`) của một giai đoạn, một chỗ duy nhất cho nhãn này. */
export function rankLabel(stage: Stage['stage']): string {
  return STAGES[stage - 1].sabo;
}
