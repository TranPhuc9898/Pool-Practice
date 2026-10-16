import { DRILLS } from '@/pool-engine/drills';
import type { Difficulty, DrillSkill, PoolDrill } from '@/pool-engine/types';

export type TrainingAreaId = 'fundamentals' | 'cueBallControl' | 'positionPlay' | 'patterns';

export type TrainingArea = { id: TrainingAreaId; title: string; topics: string; a11y: string };

/**
 * Bốn nhóm dùng chung cho Home, tab Drills và màn `/area/[id]`, gom theo `skill`.
 * `DrillCategory` (3 nhóm) trong data giữ nguyên, chưa đổi schema.
 */
export const TRAINING_AREAS: readonly TrainingArea[] = [
  {
    id: 'fundamentals',
    title: 'Fundamentals',
    topics: 'Straight shots · Aim · Stroke · Speed',
    a11y: 'Straight shots, aim, stroke, speed',
  },
  {
    id: 'cueBallControl',
    title: 'Cue Ball Control',
    topics: 'Stop · Follow · Draw · Speed',
    a11y: 'Stop, follow, draw, speed control',
  },
  {
    id: 'positionPlay',
    title: 'Position Play',
    topics: 'Tangent · One rail · Wagon wheel',
    a11y: 'Tangent line, one rail, wagon wheel',
  },
  {
    id: 'patterns',
    title: '9-Ball Patterns',
    topics: 'Line-ups · 3-ball · Runouts',
    a11y: 'Line-ups, three ball, runouts',
  },
];

const areaBySkill: Record<DrillSkill, TrainingAreaId> = {
  straightStroke: 'fundamentals',
  stop: 'cueBallControl',
  follow: 'cueBallControl',
  followDistance: 'cueBallControl',
  draw: 'cueBallControl',
  drawDistance: 'cueBallControl',
  tangent: 'positionPlay',
  threePositions: 'positionPlay',
  oneRail: 'positionPlay',
  pattern: 'patterns',
  wagonWheel: 'positionPlay',
  lineUp: 'patterns',
  correctSide: 'patterns',
  noRail: 'patterns',
  runout: 'patterns',
  railCut: 'fundamentals',
  spotShot: 'fundamentals',
  cutAngle: 'fundamentals',
};

export const areaOf = (drill: PoolDrill) => TRAINING_AREAS.find((a) => a.id === areaBySkill[drill.skill])!;

export const drillsIn = (area: TrainingAreaId) => DRILLS.filter((d) => areaBySkill[d.skill] === area);

const levelLabel: Record<Difficulty, string> = {
  1: 'Beginner',
  2: 'Beginner',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Advanced',
};

export const levelOf = (drill: PoolDrill) => levelLabel[drill.difficulty];
