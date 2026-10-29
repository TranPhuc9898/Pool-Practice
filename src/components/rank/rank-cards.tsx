import { useIsFocused } from 'expo-router';
import { useEffect, useRef, type ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  FadeInDown,
  LinearTransition,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  AppIcon,
  AppText,
  makeStyles,
  PressableScale,
  RankProgress,
  rankTone,
  useTheme,
  type Rank,
} from '@/design-system';

import type { LevelSummary } from './rank-data';
import {
  CARET_W,
  MORPH_EDGE,
  morph,
  openRank,
  registerRankView,
  setPickedRank,
  usePickedRank,
  type Rect,
} from './rank-morph';

const clamp01 = (v: number) => {
  'worklet';
  return Math.min(Math.max(v, 0), 1);
};

/**
 * Độ dịch của từ trái (`side` -1) hoặc phải (1) ở dòng được bấm: pha 0 bị pill đẩy ra hai bên, pha 1 dính theo mép pill
 * đang dãn ra sát mép màn.
 */
function wordShift(side: -1 | 1, p: number, o: Rect | null, width: number) {
  'worklet';
  if (!o) return 0;
  const edge = side < 0 ? MORPH_EDGE - o.x : width - MORPH_EDGE - (o.x + o.width);
  return side * ((o.width - CARET_W) / 2) * clamp01(p + 1) + edge * clamp01(p);
}

/** Một từ cỡ display: font heavy của `displayLarge`, khít dòng, chữ sát nhau như clip. */
function DisplayWord({ text, color, size, glow }: { text: string; color: string; size: number; glow?: string }) {
  const t = useTheme();
  return (
    <AppText
      variant="displayLarge"
      allowFontScaling={false}
      numberOfLines={1}
      style={{
        color,
        fontSize: size,
        lineHeight: size * 1.02,
        letterSpacing: -size * 0.045,
        fontFamily: t.type.displayLarge.fontFamily,
        ...(glow && { textShadowColor: `${glow}80`, textShadowRadius: size * 0.25 }),
      }}>
      {text}
    </AppText>
  );
}

/** Chữ hạng cỡ lớn, màu `ink` của hạng, hắt nhẹ màu `glow`. */
export function RankLetter({ rank, size, glow = false }: { rank: Rank; size: number; glow?: boolean }) {
  const tone = rankTone[rank];
  return <DisplayWord text={tone.label} color={tone.ink} size={size} glow={glow ? tone.glow : undefined} />;
}

/** Khoá đo của dòng lớn trên tab Drills, nơi cú nở bắt đầu và thu về. */
export const RANK_HERO = 'hero';
/** Chờ chữ hạng gõ vào chỗ trống xong mới nở. */
const FILL_MS = 360;

/**
 * Tab Drills theo clip: một dòng lớn `Rank ▏E`, con trỏ nhấp nháy như ô nhập chữ. Chọn hạng ở bàn phím bên dưới thì chữ
 * hạng gõ vào sau con trỏ, rồi con trỏ mọc thành pill, dãn ngang, nở ra trang hạng. Bấm thẳng dòng lớn thì mở hạng đang
 * điền. Lúc nở, phần dưới dòng lớn mờ đi và bàn phím bị đẩy xuống khỏi màn.
 */
export function RankHero({ summaries, suggested }: { summaries: ReadonlyMap<Rank, LevelSummary>; suggested: Rank }) {
  const s = useStyles();
  const { height } = useWindowDimensions();
  const rank = usePickedRank() ?? suggested;
  const { benchmark, drills, passed } = summaries.get(rank)!;
  const opening = useRef(false);
  const reduced = useReducedMotion();
  // Trang hạng là màn trong suốt phủ lên tab này. Lúc nó mở, VoiceOver không được đọc xuyên xuống dòng lớn và bàn phím.
  const hidden = !useIsFocused();

  const pick = (next: Rank) => {
    if (opening.current) return;
    opening.current = true;
    setPickedRank(next);
    setTimeout(
      () => openRank(RANK_HERO, next).finally(() => (opening.current = false)),
      next === rank || reduced ? 120 : FILL_MS,
    );
  };

  const pushed = useAnimatedStyle(() => {
    const o = morph.origin.get();
    if (morph.originKey.get() !== RANK_HERO || !o) return { transform: [{ translateY: 0 }] };
    return { transform: [{ translateY: (height - (o.y + o.height)) * clamp01(morph.progress.get() - 1) }] };
  });

  return (
    <View
      style={s.hero}
      accessibilityElementsHidden={hidden}
      importantForAccessibility={hidden ? 'no-hide-descendants' : 'auto'}>
      <Animated.View entering={FadeInDown.duration(420)}>
        <RankLine
          morphKey={RANK_HERO}
          rank={rank}
          size={80}
          accessibilityLabel={`Open rank ${rankTone[rank].label}, ${passed} of ${drills.length} passed`}
          onPress={() => pick(rank)}
          above={
            <AppText variant="eyebrow" color="textSecondary">
              {rank === suggested ? 'Up next' : 'Pick a rank'}
            </AppText>
          }>
          <AppText variant="headline" color="textSecondary" numberOfLines={2} style={s.center}>
            {benchmark}
          </AppText>
          <View style={s.progress}>
            <View style={s.flex}>
              <RankProgress rank={rank} value={passed / drills.length} />
            </View>
            <AppText variant="captionSmall" color="textSecondary">
              {`${passed}/${drills.length} passed`}
            </AppText>
          </View>
        </RankLine>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(120).duration(420)}>
        <Animated.View style={pushed}>
          <RankKeys summaries={summaries} picked={rank} suggested={suggested} onPick={pick} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

/** Bàn phím hạng: 12 phím H → PRO, hai hàng. Hạng nên tập có chấm Next, hạng đã qua có dấu tick. */
function RankKeys({
  summaries,
  picked,
  suggested,
  onPick,
}: {
  summaries: ReadonlyMap<Rank, LevelSummary>;
  picked: Rank;
  suggested: Rank;
  onPick: (rank: Rank) => void;
}) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={s.keys}>
      {[...summaries.values()].map(({ level, drills, passed }) => {
        const tone = rankTone[level];
        const cleared = passed >= Math.ceil((drills.length * 2) / 3);
        const on = level === picked;
        return (
          <PressableScale
            key={level}
            haptic="selection"
            accessibilityRole="button"
            accessibilityLabel={`Rank ${tone.label}, ${drills.length} drills, ${passed} passed${level === suggested ? ', suggested next' : ''}`}
            accessibilityState={{ selected: on }}
            onPress={() => onPick(level)}
            style={[
              s.key,
              {
                backgroundColor: on ? `${tone.glow}26` : t.color.surfacePrimary,
                borderColor: on ? `${tone.ink}99` : t.color.borderSubtle,
              },
            ]}>
            <RankLetter rank={level} size={tone.label.length > 2 ? 20 : 26} />
            <View style={s.keyMark}>
              {level === suggested ? (
                <View style={[s.nextDot, { backgroundColor: tone.ink }]} />
              ) : (
                cleared && <AppIcon name="checkmark" size="small" color="textTertiary" />
              )}
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}

/**
 * Dòng chữ `Rank ▏E` theo clip: con trỏ giữa hai từ mọc thành pill đẩy hai từ ra hai bên, pill dãn ngang sát mép đẩy
 * hai từ văng khỏi màn, rồi nở dọc ra full màn. Khung do trang hạng vẽ (xem `rank-morph`), dòng này chỉ dịch chữ theo
 * `morph.progress`. Đổi hạng thì chữ hạng mới gõ vào sau con trỏ.
 */
function RankLine({
  morphKey,
  rank,
  size,
  accessibilityLabel,
  onPress,
  above,
  children,
}: {
  morphKey: string;
  rank: Rank;
  size: number;
  accessibilityLabel: string;
  onPress: () => void;
  above?: ReactNode;
  children: ReactNode;
}) {
  const t = useTheme();
  const s = useStyles();
  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();
  const tone = rankTone[rank];

  // Đăng ký con trỏ trong effect, không qua ref callback: callback chạy lại mỗi lần render và lần gọi null sau cùng xoá mất view.
  const caretView = useRef<View>(null);
  useEffect(() => {
    registerRankView(morphKey, rank, caretView.current);
    return () => registerRankView(morphKey, rank, null);
  }, [morphKey, rank]);

  // Con trỏ nhấp nháy như ô nhập chữ.
  const pulse = useSharedValue(1);
  useEffect(() => {
    if (reduced) return;
    pulse.set(withRepeat(withSequence(withTiming(0.15, { duration: 520 }), withTiming(1, { duration: 520 })), -1));
    return () => cancelAnimation(pulse);
  }, [reduced, pulse]);

  const left = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          morph.originKey.get() === morphKey ? wordShift(-1, morph.progress.get(), morph.origin.get(), width) : 0,
      },
    ],
  }));
  const right = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          morph.originKey.get() === morphKey ? wordShift(1, morph.progress.get(), morph.origin.get(), width) : 0,
      },
    ],
  }));
  const caret = useAnimatedStyle(() => ({
    opacity: morph.originKey.get() === morphKey && morph.progress.get() > -1 ? 0 : pulse.get(),
  }));
  const fade = useAnimatedStyle(() => ({
    opacity: morph.originKey.get() === morphKey ? 1 - clamp01(morph.progress.get() + 1) : 1,
  }));

  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={s.line}>
      {above && <Animated.View style={fade}>{above}</Animated.View>}
      <Animated.View layout={LinearTransition.duration(240)} style={[s.words, { gap: size * 0.12 }]}>
        <Animated.View layout={LinearTransition.duration(240)}>
          <Animated.View style={left}>
            <DisplayWord text="Rank" color={t.color.textPrimary} size={size} />
          </Animated.View>
        </Animated.View>
        <Animated.View layout={LinearTransition.duration(240)}>
          <Animated.View
            ref={caretView}
            collapsable={false}
            style={[s.caret, { height: size, backgroundColor: tone.ink }, caret]}
          />
        </Animated.View>
        <Animated.View style={right}>
          <Animated.View
            key={rank}
            entering={
              reduced
                ? undefined
                : FadeInDown.duration(260).withInitialValues({ transform: [{ translateY: size * 0.4 }] })
            }>
            <DisplayWord text={tone.label} color={tone.ink} size={size} glow={tone.glow} />
          </Animated.View>
        </Animated.View>
      </Animated.View>
      <Animated.View style={[s.below, fade]}>{children}</Animated.View>
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  hero: { gap: t.space.xxl, paddingTop: t.space.xl },
  line: { alignItems: 'center', gap: t.space.xs, paddingVertical: t.space.sm },
  words: { flexDirection: 'row', alignItems: 'center' },
  caret: { width: CARET_W, borderRadius: CARET_W / 2 },
  below: { alignItems: 'center', gap: t.space.sm, alignSelf: 'stretch' },
  progress: { flexDirection: 'row', alignItems: 'center', gap: t.space.xs, width: '60%' },
  keys: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: t.space.xs },
  key: {
    width: 52,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.card,
    borderWidth: t.border.hairline,
    borderCurve: 'continuous',
  },
  keyMark: { position: 'absolute', bottom: 5, height: 12, justifyContent: 'center' },
  nextDot: { width: 5, height: 5, borderRadius: 2.5 },
}));
