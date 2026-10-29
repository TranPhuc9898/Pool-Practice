import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View, type LayoutRectangle } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { makeStyles, useTheme } from '../theme';
import { RANKS, rankEdge, rankGlow, rankGradient, rankTone, type Rank } from '../tokens/rank';
import { AppIcon } from './app-icon';
import { AppText } from './app-text';
import { PressableScale } from './pressable-scale';

const PILL_H = 36;
const HERO_H = 168;
/**
 * Hai pha của `p`: 0 → STRETCH pill dài ra hết ngang, đẩy hai bên ra khỏi mép; RISE → 1 khung cao lên thành hero.
 * Hai pha gối nhau một chút để chuyển pha không khựng.
 */
const STRETCH = 0.45;
const RISE = 0.4;
/** Gradient nằm yên, khung trượt lên trên nó như cửa sổ mở dần. Lúc còn là dải, cửa sổ nhìn vào giữa cảnh. */
const SCENE_START = -(HERO_H - PILL_H) / 2;

/** Badge hạng: gradient của hạng, viền mảnh cùng màu. Chỗ duy nhất gradient hạng xuất hiện trên card drill. */
export function RankBadge({ rank, size = 'small' }: { rank: Rank; size?: 'small' | 'large' }) {
  const s = useStyles();
  const large = size === 'large';
  return (
    <View
      accessible
      accessibilityLabel={`Rank ${rankTone[rank].label}`}
      style={[
        s.badge,
        large && s.badgeLarge,
        { experimental_backgroundImage: rankGradient(rank), borderColor: rankEdge(rank) },
      ]}>
      <AppText variant={large ? 'headline' : 'captionSmall'} style={{ color: rankTone[rank].ink }}>
        {rankTone[rank].label}
      </AppText>
    </View>
  );
}

/** Thanh tiến độ trong hạng: rãnh trung tính, phần đầy mang gradient hạng nằm ngang. */
export function RankProgress({ rank, value }: { rank: Rank; value: number }) {
  const s = useStyles();
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={s.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }}>
      <View style={[s.fill, { width: `${pct}%`, experimental_backgroundImage: rankGradient(rank, 90) }]} />
    </View>
  );
}

type RankSelectorProps = {
  value: Rank | null;
  onChange: (rank: Rank | null) => void;
  ranks?: readonly Rank[];
  /** Dòng phụ trong hero, ví dụ "12 drills · Runs 3–4 balls". */
  caption?: (rank: Rank) => string;
};

/**
 * Hàng pill hạng. Chọn một pill thì nó nở tại chỗ thành hero mang gradient hạng, hai bên bị đẩy ra và mờ đi; bấm hero
 * thì thu về đúng pill cũ. Một shared value `p` 0 → 1 lái cả khung, hàng pill và nội dung hero.
 */
export function RankSelector({ value, onChange, ranks = RANKS, caption }: RankSelectorProps) {
  const t = useTheme();
  const s = useStyles();
  const layouts = useRef(new Map<Rank, LayoutRectangle>());
  const scrollX = useRef(0);
  const [width, setWidth] = useState(0);
  const [shown, setShown] = useState<Rank | null>(value);
  const p = useSharedValue(value ? 1 : 0);
  const from = useSharedValue({ x: 0, w: PILL_H });
  const selected = useSharedValue(value ? ranks.indexOf(value) : -1);
  // Worklet chỉ được bắt số, không bắt cả theme (theme chứa easing không copy sang UI thread được).
  const heroRadius = t.radius.xLarge;
  const motion = { ...t.motion.spring.gentle, duration: 700 };

  // Màn gọi xoá lọc từ chỗ khác (nút Clear) thì hero cũng thu về.
  useEffect(() => {
    if (value !== null) return;
    p.set(withSpring(0, { ...t.motion.spring.gentle, duration: 700 }, (done) => {
      if (done) scheduleOnRN(setShown, null);
    }));
  }, [value, p, t.motion.spring.gentle]);

  // Báo màn gọi sau khi hero mở xong: màn gọi lọc lại danh sách giữa chừng là khựng khung đầu.
  const open = (rank: Rank) => {
    const l = layouts.current.get(rank);
    if (l) from.set({ x: l.x - scrollX.current, w: l.width });
    selected.set(ranks.indexOf(rank));
    setShown(rank);
    p.set(withSpring(1, motion, (done) => {
      if (done) scheduleOnRN(onChange, rank);
    }));
  };

  // Thu tại chỗ, không chờ màn gọi: bấm lúc đang mở dở thì spring mở bị huỷ, `onChange(rank)` không bắn.
  const close = () => {
    p.set(withSpring(0, motion, (done) => {
      if (done) scheduleOnRN(setShown, null);
    }));
    onChange(null);
  };

  const frame = useAnimatedStyle(() => ({
    height: interpolate(p.get(), [RISE, 1], [PILL_H, HERO_H], Extrapolation.CLAMP),
  }));

  const heroLeft = (v: number) => {
    'worklet';
    return interpolate(v, [0, STRETCH], [from.get().x, 0], Extrapolation.CLAMP);
  };

  const hero = useAnimatedStyle(() => {
    const v = p.get();
    return {
      left: heroLeft(v),
      width: interpolate(v, [0, STRETCH], [from.get().w, width], Extrapolation.CLAMP),
      height: interpolate(v, [RISE, 1], [PILL_H, HERO_H], Extrapolation.CLAMP),
      borderRadius: interpolate(v, [RISE, 1], [PILL_H / 2, heroRadius], Extrapolation.CLAMP),
    };
  });

  // Cảnh bù ngược đúng phần khung đã dời, nên đứng yên trên màn trong khi khung mở.
  const scene = useAnimatedStyle(() => {
    const v = p.get();
    return {
      left: -heroLeft(v),
      top: interpolate(v, [RISE, 1], [SCENE_START, 0], Extrapolation.CLAMP),
    };
  });

  // Bóng hắt nằm ở lớp riêng, cỡ cố định, chỉ đổi opacity: blur không phải vẽ lại theo kích thước khung từng frame.
  const glow = useAnimatedStyle(() => ({
    opacity: interpolate(p.get(), [0.85, 1], [0, 1], Extrapolation.CLAMP),
  }));

  const pillLabel = useAnimatedStyle(() => ({
    opacity: interpolate(p.get(), [0, 0.25], [1, 0], Extrapolation.CLAMP),
  }));

  const heroContent = useAnimatedStyle(() => ({
    opacity: interpolate(p.get(), [0.55, 1], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(p.get(), [0.55, 1], [10, 0], Extrapolation.CLAMP) }],
  }));

  return (
    <Animated.View style={[s.frame, frame]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <ScrollView
        horizontal
        scrollEnabled={!shown}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => (scrollX.current = e.nativeEvent.contentOffset.x)}
        contentContainerStyle={s.row}
        pointerEvents={shown ? 'none' : 'auto'}>
        {ranks.map((rank, i) => (
          <RankPill
            key={rank}
            rank={rank}
            index={i}
            p={p}
            selected={selected}
            hidden={shown === rank}
            width={width}
            onPress={() => open(rank)}
            onLayout={(l) => layouts.current.set(rank, l)}
          />
        ))}
      </ScrollView>

      {shown && (
        <Animated.View style={[s.glow, glow, { width, borderRadius: heroRadius, boxShadow: rankGlow(shown) }]} />
      )}
      {shown && (
        <Animated.View style={[s.hero, hero, { borderColor: rankEdge(shown) }]}>
          <Animated.View
            style={[
              s.scene,
              scene,
              {
                width,
                experimental_backgroundImage: `radial-gradient(circle at 85% 15%, ${rankTone[shown].glow}33 0%, transparent 60%), ${rankGradient(shown)}`,
              },
            ]}>
            <Animated.View style={[s.heroContent, heroContent]}>
              <View style={s.heroTop}>
                <AppText variant="eyebrow" color="textSecondary">
                  Rank
                </AppText>
                <AppIcon name="xmark" size="small" color="textSecondary" weight="semibold" />
              </View>
              <AppText variant="displayLarge" style={{ color: rankTone[shown].ink }}>
                {rankTone[shown].label}
              </AppText>
              {caption && (
                <AppText variant="caption" color="textSecondary" numberOfLines={1}>
                  {caption(shown)}
                </AppText>
              )}
            </Animated.View>
          </Animated.View>
          <Pressable
            style={s.press}
            onPress={close}
            accessibilityRole="button"
            accessibilityLabel={`Rank ${rankTone[shown].label} selected. Double tap to clear.`}>
            <Animated.View style={[s.pillLabel, pillLabel]}>
              <AppText variant="callout" style={{ color: rankTone[shown].ink }}>
                {rankTone[shown].label}
              </AppText>
            </Animated.View>
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );
}

function RankPill({
  rank,
  index,
  p,
  selected,
  hidden,
  width,
  onPress,
  onLayout,
}: {
  rank: Rank;
  index: number;
  p: SharedValue<number>;
  selected: SharedValue<number>;
  hidden: boolean;
  /** Bề ngang khung: pill hai bên bị đẩy đúng chừng này để ra hẳn khỏi mép. */
  width: number;
  onPress: () => void;
  onLayout: (l: LayoutRectangle) => void;
}) {
  const t = useTheme();
  const s = useStyles();
  const push = useAnimatedStyle(() => {
    const side = Math.sign(index - selected.get());
    return {
      opacity: interpolate(p.get(), [STRETCH * 0.6, STRETCH], [1, 0], Extrapolation.CLAMP),
      transform: [{ translateX: interpolate(p.get(), [0, STRETCH], [0, side * width], Extrapolation.CLAMP) }],
    };
  });

  return (
    <Animated.View style={[push, hidden && s.invisible]} onLayout={(e) => onLayout(e.nativeEvent.layout)}>
      <PressableScale
        onPress={onPress}
        haptic="selection"
        accessibilityRole="button"
        accessibilityLabel={`Rank ${rankTone[rank].label}`}
        style={({ pressed }) => [
          s.pill,
          { backgroundColor: pressed ? t.color.surfacePressed : 'transparent', borderColor: t.color.borderStrong },
        ]}>
        <View style={[s.dot, { backgroundColor: rankTone[rank].ink }]} />
        <AppText variant="callout" color="textSecondary">
          {rankTone[rank].label}
        </AppText>
      </PressableScale>
    </Animated.View>
  );
}

const useStyles = makeStyles((t) => ({
  badge: {
    alignSelf: 'flex-start',
    minWidth: 28,
    alignItems: 'center',
    paddingHorizontal: t.space.xs,
    paddingVertical: 3,
    borderRadius: t.radius.pill,
    borderWidth: t.border.hairline,
  },
  badgeLarge: { minWidth: 48, paddingHorizontal: t.space.sm, paddingVertical: t.space.xxs + 2 },
  track: { height: 4, borderRadius: t.radius.pill, backgroundColor: t.color.dotInactive, overflow: 'hidden' },
  fill: { flex: 1, borderRadius: t.radius.pill },
  press: { flex: 1 },
  frame: { overflow: 'visible' },
  row: { gap: t.space.xs, alignItems: 'center' },
  pill: {
    height: PILL_H,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.xs - 2,
    paddingHorizontal: t.space.md,
    borderRadius: t.radius.pill,
    borderWidth: t.border.normal,
  },
  dot: { width: 6, height: 6, borderRadius: t.radius.pill },
  invisible: { opacity: 0 },
  hero: { position: 'absolute', top: 0, overflow: 'hidden', borderWidth: t.border.hairline },
  pillLabel: { position: 'absolute', top: 0, left: 0, right: 0, height: PILL_H, alignItems: 'center', justifyContent: 'center' },
  scene: { position: 'absolute', height: HERO_H },
  glow: { position: 'absolute', top: 0, left: 0, height: HERO_H, backgroundColor: t.color.backgroundPrimary },
  heroContent: { flex: 1, padding: t.space.lg, justifyContent: 'flex-end', gap: t.space.xxs },
  heroTop: { position: 'absolute', top: t.space.md, left: t.space.lg, right: t.space.md, flexDirection: 'row', justifyContent: 'space-between' },
}));
