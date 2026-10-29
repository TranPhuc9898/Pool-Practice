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
    topics: 'Stop · Follow · Draw · English',
    a11y: 'Stop, follow, draw, English',
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
  naturalAngle: 'positionPlay',
  drawAngle: 'cueBallControl',
  english: 'cueBallControl',
  bank: 'fundamentals',
  break: 'patterns',
  combo: 'fundamentals',
  speedControl: 'cueBallControl',
  safety: 'positionPlay',
  kick: 'fundamentals',
  jump: 'fundamentals',
  masse: 'fundamentals',
  test: 'patterns',
};

export const areaOf = (drill: PoolDrill) => TRAINING_AREAS.find((a) => a.id === areaBySkill[drill.skill])!;

/** Thứ tự trong từng nhóm, dễ trước khó sau, bài cùng dòng (Rail Cut) đứng liền. Drill chưa có tên ở đây xếp cuối nhóm. */
const ORDER: Record<TrainingAreaId, readonly string[]> = {
  fundamentals: ['01', '22', '21', '18', '19', '20', '27', '28', '89'],
  // Sau stop/follow/draw là chuỗi phê: đo NPL, squirt, throw, phê sau băng, phê trong điều bi.
  cueBallControl: ['02', '03', '04', '05', '06', '82', '26', '83', '48', '84', '85', '86', '25'],
  positionPlay: ['07', '08', '09', '11', '24', '93', '94'],
  // Sau 29 là bài giai đoạn 5–6: runout bàn rải, chuỗi áp lực, break.
  patterns: ['12', '13', '23', '15', '14', '10', '16', '17', '30', '29', '88', '87', '90', '91', '92', '96', '95'],
};

const rank = (area: TrainingAreaId, d: PoolDrill) => {
  const i = ORDER[area].indexOf(d.id);
  return i < 0 ? Infinity : i;
};

export const drillsIn = (area: TrainingAreaId) =>
  DRILLS.filter((d) => areaBySkill[d.skill] === area).sort((a, b) => rank(area, a) - rank(area, b));

/** Số 01…N của drill trong nhóm, khớp tab Drills và dòng nhóm trên màn drill. */
export const numberIn = (drill: PoolDrill) => {
  const i = drillsIn(areaBySkill[drill.skill]).findIndex((d) => d.id === drill.id);
  return String(i + 1).padStart(2, '0');
};

const levelLabel: Record<Difficulty, string> = {
  1: 'Beginner',
  2: 'Beginner',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Advanced',
};

export const levelOf = (drill: PoolDrill) => levelLabel[drill.difficulty];
