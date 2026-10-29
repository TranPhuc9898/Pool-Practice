import type { DrillSkill, PoolDrill, SkillGroup } from './types';

export const SKILL_GROUPS: readonly { id: SkillGroup; title: string }[] = [
  { id: 'fundamentals', title: 'Fundamentals' },
  { id: 'cueBallControl', title: 'Cue Ball Control' },
  { id: 'positionPlay', title: 'Position Play' },
  { id: 'kick', title: 'Kick' },
  { id: 'bank', title: 'Bank' },
  { id: 'spin', title: 'Spin' },
  { id: 'advanced', title: 'Advanced' },
];

/**
 * Nhóm của mỗi kỹ năng. `Record` để thêm `DrillSkill` mới mà quên gán nhóm thì tsc báo.
 * Combo vào Fundamentals vì là cú ăn bi, stun không có skill riêng nên nằm theo `stop`/`tangent`.
 */
const groupBySkill: Record<DrillSkill, SkillGroup> = {
  straightStroke: 'fundamentals',
  spotShot: 'fundamentals',
  lineUp: 'fundamentals',
  stop: 'fundamentals',
  follow: 'fundamentals',
  draw: 'fundamentals',
  cutAngle: 'fundamentals',
  railCut: 'fundamentals',
  combo: 'fundamentals',
  followDistance: 'cueBallControl',
  drawDistance: 'cueBallControl',
  drawAngle: 'cueBallControl',
  tangent: 'cueBallControl',
  naturalAngle: 'cueBallControl',
  speedControl: 'cueBallControl',
  threePositions: 'cueBallControl',
  oneRail: 'positionPlay',
  noRail: 'positionPlay',
  wagonWheel: 'positionPlay',
  correctSide: 'positionPlay',
  pattern: 'positionPlay',
  runout: 'positionPlay',
  kick: 'kick',
  bank: 'bank',
  english: 'spin',
  break: 'advanced',
  safety: 'advanced',
  jump: 'advanced',
  masse: 'advanced',
  test: 'advanced',
};

export const groupOf = (drill: PoolDrill): SkillGroup => groupBySkill[drill.skill];
