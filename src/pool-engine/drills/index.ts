import type { PoolDrill } from '../types';

import { straightIn } from './01-straight-in';
import { stopShot } from './02-stop';
import { followControl } from './03-follow';
import { followDistance } from './04-follow-distance';
import { drawControl } from './05-draw';
import { drawDistance } from './06-draw-distance';
import { tangentLine } from './07-tangent';
import { threePositions } from './08-three-positions';
import { oneRail } from './09-one-rail';
import { twoBallPattern } from './10-two-ball-pattern';

/** Thứ tự là lộ trình: đánh trúng → kiểm soát bi cái → đi bài. */
export const DRILLS: readonly PoolDrill[] = [
  straightIn,
  stopShot,
  followControl,
  followDistance,
  drawControl,
  drawDistance,
  tangentLine,
  threePositions,
  oneRail,
  twoBallPattern,
];

export function drillByNumber(n: number): PoolDrill | undefined {
  return DRILLS.find((d) => d.number === n);
}
