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
import { breakOneToSide } from './29-break-one-to-side';
import { breakSquat } from './30-break-squat';
import { twelveBallRails } from './31-twelve-ball-rails';
import { tenStraightIn } from './32-ten-straight-in-a-row';
import { shortStopFollowDraw } from './33-short-stop-follow-draw';
import { ringAroundTheSide } from './34-ring-around-the-side';
import { fifteenBallLineup } from './35-fifteen-ball-lineup';
import { jewettSpotProgression } from './36-jewett-spot-progression';
import { longDiagonalStraightIn } from './37-long-diagonal-straight-in';
import { buF1CutProgression } from './38-bu-f1-cut-progression';
import { buF6BallPocketing } from './39-bu-f6-ball-pocketing';
import { rideTheRails } from './40-ride-the-rails';
import { jewettProgressiveCut } from './41-jewett-progressive-cut';
import { theLadder } from './42-the-ladder';
import { frozenBallEveryDiamond } from './43-frozen-ball-every-diamond';
import { tomRossRailShot } from './44-tom-ross-rail-shot';
import { edgeLove } from './45-edge-love';
import { jalCircle } from './46-jal-circle';
import { comboProgression } from './47-combo-progression';
import { frozenPairThrow } from './48-frozen-pair-throw';
import { softTouch } from './49-soft-touch';
import { lagLadder } from './50-lag-ladder';
import { fiveLevelDraw } from './51-five-level-draw';
import { buF8GridTarget } from './52-bu-f8-grid-target';
import { followMatrix } from './53-follow-matrix';
import { drawMatrix } from './54-draw-matrix';
import { randomAToB } from './55-random-a-to-b';
import { killTheCueBall } from './56-kill-the-cue-ball';
import { rollUpAndSnuggle } from './57-roll-up-and-snuggle';
import { equalSeparation } from './58-equal-separation';
import { straddle } from './59-straddle';
import { buS5SnookerBehindCluster } from './60-bu-s5-snooker-behind-cluster';
import { bankSevenHideBehindEight } from './61-bank-seven-hide-behind-eight';
import { twoRailSafetyBehindNine } from './62-two-rail-safety-behind-nine';
import { thinHitFreezeBesideStripe } from './63-thin-hit-freeze-beside-stripe';
import { buS6OneRailKick } from './64-bu-s6-one-rail-kick';
import { shallowOneRailKick } from './65-shallow-one-rail-kick';
import { crossSideBank } from './66-cross-side-bank';
import { crossSideBankFiveSpots } from './67-cross-side-bank-five-spots';
import { crossCornerBankLadder } from './68-cross-corner-bank-ladder';
import { bankEveryPocket } from './69-bank-every-pocket';
import { softBreakBox } from './70-soft-break-box';
import { breakEvaluation } from './71-break-evaluation';
import { jumpTheGap } from './72-jump-the-gap';
import { progressiveMasse } from './73-progressive-masse';
import { rdsLevels1To3 } from './74-rds-levels-1-3';
import { rdsLevels4To6 } from './75-rds-levels-4-6';
import { rdsLevels7To9 } from './76-rds-levels-7-9';
import { nineBallProgress } from './77-nine-ball-progress';
import { rdsLevels10To12 } from './78-rds-levels-10-12';
import { equalOffense } from './79-equal-offense';
import { tenBallGhost } from './80-ten-ball-ghost';
import { rdsLevels13To16 } from './81-rds-levels-13-16';

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
  breakOneToSide,
  breakSquat,
  twelveBallRails,
  tenStraightIn,
  shortStopFollowDraw,
  ringAroundTheSide,
  fifteenBallLineup,
  jewettSpotProgression,
  longDiagonalStraightIn,
  buF1CutProgression,
  buF6BallPocketing,
  rideTheRails,
  jewettProgressiveCut,
  theLadder,
  frozenBallEveryDiamond,
  tomRossRailShot,
  edgeLove,
  jalCircle,
  comboProgression,
  frozenPairThrow,
  softTouch,
  lagLadder,
  fiveLevelDraw,
  buF8GridTarget,
  followMatrix,
  drawMatrix,
  randomAToB,
  killTheCueBall,
  rollUpAndSnuggle,
  equalSeparation,
  straddle,
  buS5SnookerBehindCluster,
  bankSevenHideBehindEight,
  twoRailSafetyBehindNine,
  thinHitFreezeBesideStripe,
  buS6OneRailKick,
  shallowOneRailKick,
  crossSideBank,
  crossSideBankFiveSpots,
  crossCornerBankLadder,
  bankEveryPocket,
  softBreakBox,
  breakEvaluation,
  jumpTheGap,
  progressiveMasse,
  rdsLevels1To3,
  rdsLevels4To6,
  rdsLevels7To9,
  nineBallProgress,
  rdsLevels10To12,
  equalOffense,
  tenBallGhost,
  rdsLevels13To16,
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
