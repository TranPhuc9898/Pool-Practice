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
import { wagonWheel } from './11-wagon-wheel';
import { lineOfBalls } from './12-line-of-balls';
import { redBlack } from './13-red-black';
import { lDrill } from './14-l-drill';
import { threeBall } from './15-three-ball';
import { noRailT } from './16-no-rail-t';
import { nineBallRunout } from './17-nine-ball-runout';

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
  wagonWheel,
  lineOfBalls,
  redBlack,
  lDrill,
  threeBall,
  noRailT,
  nineBallRunout,
];

export function drillByNumber(n: number): PoolDrill | undefined {
  return DRILLS.find((d) => d.number === n);
}
