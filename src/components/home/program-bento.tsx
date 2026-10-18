import { router } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { numberIn } from '@/components/home/training-areas';
import { AppIcon, AppText, DotMatrixDisplay, homeSurfaces, makeStyles, PressableScale, useTheme } from '@/design-system';
import type { PoolDrill } from '@/pool-engine/types';

/** Cỡ AX1 trở lên (fontScale ≥ 1.6) thì bento 2 cột chật, xếp 1 cột. xxxL (1.35) vẫn 2 cột, đã xem trên simulator. */
const ONE_COLUMN_FONT_SCALE = 1.6;
const TRACK_DOTS = 29;

export type ProgramStat = { total: number; done: number };

export type ProgramBentoProps = {
  /** Drill chưa qua kế tiếp của program; `null` khi đã qua hết. Hero giờ là daily nên con trỏ program nằm ở đây. */
  next: { drill: PoolDrill; label: string } | null;
  fundamentals: ProgramStat;
  /** `current`: drill đang tập trong Cue Ball Control, 0-based, -1 nếu đang ở program khác. */
  cueBall: ProgramStat & { current: number };
  /** Position Play gộp 9-Ball Patterns: hai nhóm cuối, ít bài. */
  advanced: ProgramStat;
};

const pct = (n: number, total: number) => Math.round((n / total) * 100);

/** Ba ô: Cue Ball Control vuông bên trái, hai pill xếp chồng bên phải. Không gold đặc, gold chỉ ở vạch.
 * Dưới cùng là ô Điểm chết rộng bằng cả hàng: tự xếp lại thế bi hay hỏng để tập riêng. */
export function ProgramBento({ next, fundamentals, cueBall, advanced }: ProgramBentoProps) {
  const s = useStyles();
  const { fontScale } = useWindowDimensions();
  const stacked = fontScale >= ONE_COLUMN_FONT_SCALE;

  return (
    <View style={s.stack}>
      {next && <UpNextTile {...next} />}
      <View style={[s.row, stacked && s.column]}>
        <CueBallTile {...cueBall} stacked={stacked} />
        <View style={[s.right, stacked && s.rightStacked]}>
          <FundamentalsPill {...fundamentals} />
          <AdvancedPill {...advanced} />
        </View>
      </View>
      <DeadSpotTile />
    </View>
  );
}

function CueBallTile({ total, done, current, stacked }: ProgramStat & { current: number; stacked: boolean }) {
  const t = useTheme();
  const s = useStyles();
  const reduced = useReducedMotion();
  const allDone = done === total;
  const frac = current >= 0 ? current / (total - 1) : allDone ? 1 : 0;
  const ink = homeSurfaces.ink;

  return (
    <PressableScale
      onPress={() => router.push('/area/cueBallControl')}
      accessibilityRole="button"
      accessibilityLabel={`Cue Ball Control, ${done} of ${total} passed${current >= 0 ? `, on drill ${current + 1}` : ''}.`}
      style={[s.tile, s.cbc, stacked && s.cbcStacked, homeSurfaces.graphiteTile]}>
      <AppText variant="tileTitle" style={s.title}>
        Cue Ball Control
      </AppText>

      <View style={s.big}>
        {done > 0 && (
          <AppText variant="monoSmall" style={[s.side, s.sideTop]}>
            {pct(done - 1, total)}%
          </AppText>
        )}
        <DotMatrixDisplay text={`${pct(done, total)}%`} size="md" />
        {!allDone && (
          <AppText variant="monoSmall" style={[s.side, s.sideBottom]}>
            {pct(done + 1, total)}%
          </AppText>
        )}
      </View>

      <View>
        <View style={s.track}>
          {Array.from({ length: TRACK_DOTS }, (_, i) => (
            <View key={i} style={s.trackDot} />
          ))}
          <Animated.View
            style={[
              s.trackFill,
              {
                width: `${frac * 100}%`,
                transitionProperty: 'width',
                transitionDuration: reduced ? 0 : 240,
                transitionTimingFunction: t.motion.curve.easeOut,
              },
            ]}
          />
          <Animated.View
            style={[
              s.trackMark,
              {
                left: `${frac * 100}%`,
                opacity: current >= 0 || allDone ? 1 : 0,
                transitionProperty: ['left', 'opacity'],
                transitionDuration: reduced ? 0 : 240,
                transitionTimingFunction: t.motion.curve.easeOut,
              },
            ]}
          />
        </View>
        <View style={s.trackLabels}>
          <AppText variant="monoSmall" style={{ color: ink.faint }}>
            Drill 1
          </AppText>
          <AppText variant="monoSmall" style={{ color: ink.faint }}>
            {total}
          </AppText>
        </View>
      </View>
    </PressableScale>
  );
}

function FundamentalsPill({ total, done }: ProgramStat) {
  const s = useStyles();
  const complete = done === total;
  return (
    <PressableScale
      onPress={() => router.push('/area/fundamentals')}
      accessibilityRole="button"
      accessibilityLabel={`Fundamentals, ${done} of ${total} passed.`}
      style={[s.tile, s.pill, homeSurfaces.purplePill]}>
      <View style={s.ptext}>
        <AppText variant="tileTitle" style={s.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
          Fundamentals
        </AppText>
        <AppText variant="caption" style={s.meta}>
          {complete ? 'Complete' : 'Up next'}
        </AppText>
      </View>
      {/* Một program một drill: vòng hoặc trống hoặc đầy, không có cung lưng chừng để vẽ. */}
      <View style={s.ring}>
        <View style={[s.ringTrack, complete && s.ringDone]} />
        <DotMatrixDisplay text={`${done}/${total}`} size="xs" />
      </View>
    </PressableScale>
  );
}

function AdvancedPill({ total, done }: ProgramStat) {
  const s = useStyles();
  return (
    <PressableScale
      onPress={() => router.push('/area/positionPlay')}
      accessibilityRole="button"
      accessibilityLabel={`Position Play and 9-Ball Patterns, ${done} of ${total} drills passed.`}
      style={[s.tile, s.pill, homeSurfaces.indigoPill]}>
      <View style={s.ptext}>
        <AppText variant="tileTitle" style={s.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
          Position Play
        </AppText>
        <AppText variant="caption" style={s.meta} numberOfLines={1}>
          + 9-Ball Patterns
        </AppText>
      </View>
      <View style={s.cap}>
        <View style={s.knob}>
          <AppIcon name="arrow.right" size="small" color="textInverse" weight="semibold" />
        </View>
        <AppText variant="monoSmall" color="textPrimary" style={s.capText}>
          {done}/{total}
        </AppText>
      </View>
    </PressableScale>
  );
}

function UpNextTile({ drill, label }: { drill: PoolDrill; label: string }) {
  const s = useStyles();
  return (
    <PressableScale
      onPress={() => router.push(`/drill/${drill.number}`)}
      accessibilityRole="button"
      accessibilityLabel={`${label}: drill ${numberIn(drill)}, ${drill.title}.`}
      style={[s.tile, s.pill, s.wide, homeSurfaces.graphiteTile]}>
      <DotMatrixDisplay text={numberIn(drill)} size="xs" />
      <View style={s.ptext}>
        <AppText variant="caption" style={s.meta} numberOfLines={1}>
          {label}
        </AppText>
        <AppText variant="tileTitle" style={s.title} numberOfLines={1}>
          {drill.title}
        </AppText>
      </View>
      <View style={s.knob}>
        <AppIcon name="arrow.right" size="small" color="textInverse" weight="semibold" />
      </View>
    </PressableScale>
  );
}

function DeadSpotTile() {
  const s = useStyles();
  return (
    <PressableScale
      onPress={() => router.push('/editor')}
      accessibilityRole="button"
      accessibilityLabel="Weak spots. Set up the layouts you miss and drill them."
      style={[s.tile, s.pill, s.wide, homeSurfaces.graphiteTile]}>
      <View style={s.ptext}>
        <AppText variant="tileTitle" style={s.title} numberOfLines={1}>
          Weak spots
        </AppText>
        <AppText variant="caption" style={s.meta} numberOfLines={2}>
          Rebuild the layouts you miss and drill them
        </AppText>
      </View>
      <View style={s.knob}>
        <AppIcon name="arrow.right" size="small" color="textInverse" weight="semibold" />
      </View>
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  stack: { gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
  column: { flexDirection: 'column' },
  right: { flex: 1.35, gap: 12 },
  rightStacked: { flex: 0 },
  tile: { borderCurve: 'continuous', overflow: 'hidden' },
  cbc: { flex: 1, aspectRatio: 0.76, borderRadius: 22, padding: 18, justifyContent: 'space-between' },
  cbcStacked: { aspectRatio: undefined, minHeight: 220, gap: t.space.md },
  title: { color: homeSurfaces.ink.title },
  meta: { color: homeSurfaces.ink.meta },
  big: { alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
  side: { position: 'absolute', color: homeSurfaces.ink.faint },
  sideTop: { top: 0, left: 0 },
  sideBottom: { bottom: 0, right: 0 },
  track: { height: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 2 },
  trackDot: { width: 1.5, height: 1.5, borderRadius: 0.75, backgroundColor: 'rgba(255, 255, 255, 0.38)' },
  trackFill: {
    position: 'absolute',
    left: 0,
    top: 6.25,
    height: 1.5,
    borderRadius: 0.75,
    backgroundColor: homeSurfaces.ink.gold,
  },
  trackMark: {
    position: 'absolute',
    top: -3,
    marginLeft: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 6.2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: homeSurfaces.ink.gold,
  },
  trackLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  pill: {
    flex: 1,
    minHeight: 100,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.sm,
    paddingVertical: 12,
    paddingLeft: 18,
    paddingRight: 12,
  },
  wide: { flex: 0, paddingRight: 18 },
  ptext: { flex: 1, gap: 2 },
  ring: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center' },
  ringTrack: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  ringDone: { borderStyle: 'solid', borderWidth: 2, borderColor: homeSurfaces.ink.gold },
  cap: {
    height: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 3,
    paddingRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  knob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9D7DE',
  },
  capText: { letterSpacing: 0.8 },
}));
