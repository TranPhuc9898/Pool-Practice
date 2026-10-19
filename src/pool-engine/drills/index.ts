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
import { railCutBachelors } from './18-rail-cut-bachelors';
import { railCutMasters } from './19-rail-cut-masters';
import { railCutDoctorate } from './20-rail-cut-doctorate';
import { spotShot } from './21-spot-shot';
import { cutAngleLadder } from './22-cut-angle-ladder';
import { threeBallPosition } from './23-three-ball-position';
import { naturalAngle } from './24-natural-angle';
import { drawTrisect } from './25-draw-trisect';
import { englishCheck } from './26-english-check';
import { bankGhostPocket } from './27-bank-ghost-pocket';
import { longBank } from './28-long-bank';

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
  railCutBachelors,
  railCutMasters,
  railCutDoctorate,
  spotShot,
  cutAngleLadder,
  threeBallPosition,
  naturalAngle,
  drawTrisect,
  englishCheck,
  bankGhostPocket,
  longBank,
];

export function drillByNumber(n: number): PoolDrill | undefined {
  return DRILLS.find((d) => d.number === n);
}

/** Drill ở một mức khoảng cách; mức không có trong data thì trả drill gốc. */
export function atDistance(d: PoolDrill, diamonds: number): PoolDrill {
  const level = d.distances?.find((l) => l.diamonds === diamonds);
  return level
    ? {
        ...d,
        cueBall: level.cueBall,
        recommendedContactPoint: level.recommendedContactPoint,
        recommendedSpeed: level.recommendedSpeed,
      }
    : d;
}
