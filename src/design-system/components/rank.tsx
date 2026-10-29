import { useEffect, useRef, useState } from 'react';
import { ScrollView, View, type LayoutRectangle } from 'react-native';
import Animated, { Extrapolation, FadeIn, FadeOut, interpolate, useAnimatedStyle, useSharedValue, withSpring, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { makeStyles, useTheme } from '../theme';
import { RANKS, rankEdge, rankGlow, rankGradient, rankTone, type Rank } from '../tokens/rank';
import { AppIcon, type IconName } from './app-icon';
import { AppText } from './app-text';
import { PressableScale } from './pressable-scale';

const PILL_H = 36;
const HERO_H = 188;
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

export type RankInfo = {
  /** Một dòng dưới chữ hạng, ví dụ mốc của hạng. */
  caption?: string;
  passed?: number;
  total?: number;
  /** Nút trong hero, ví dụ "Start #04". */
  action?: { label: string; onPress: () => void };
};

type RankSelectorProps = {
  value: Rank | null;
  onChange: (rank: Rank | null) => void;
  ranks?: readonly Rank[];
  info?: (rank: Rank) => RankInfo;
  /** Hạng nên tập tiếp: pill có viền màu hạng và nhãn Next, hàng pill cuộn tới nó khi mở màn. */
  suggested?: Rank | null;
};

/**
 * Hàng pill hạng. Chọn một pill thì nó nở tại chỗ thành hero mang gradient hạng, hai bên bị đẩy ra và mờ đi. ‹ › trong
 * hero đổi sang hạng kề bằng crossfade, không nở lại; ✕ thu hero về pill của hạng đang xem. Một shared value `p` 0 → 1
 * lái cả khung, hàng pill và nội dung hero.
 */
export function RankSelector({ value, onChange, ranks = RANKS, info, suggested }: RankSelectorProps) {
  const t = useTheme();
  const s = useStyles();
  const scroller = useRef<ScrollView>(null);
  const layouts = useRef(new Map<Rank, LayoutRectangle>());
  const scrollX = useRef(0);
  const contentW = useRef(0);
  const scrolledTo = useRef<Rank | null>(null);
  const [width, setWidth] = useState(0);
  const [shown, setShown] = useState<Rank | null>(value);
  // Chỉ crossfade khi bước ‹ ›. Lúc mở, cảnh phải hiện cùng nhịp nở của khung.
  const [stepped, setStepped] = useState(false);
  const p = useSharedValue(value ? 1 : 0);
  const from = useSharedValue({ x: 0, w: PILL_H });
  const selected = useSharedValue(value ? ranks.indexOf(value) : -1);
  // Worklet chỉ được bắt số, không bắt cả theme (theme chứa easing không copy sang UI thread được).
  const heroRadius = t.radius.xLarge;
  const motion = t.motion.spring.gentle;

  // Màn gọi xoá lọc từ chỗ khác (nút Clear) thì hero cũng thu về.
  useEffect(() => {
    if (value !== null) return;
    p.set(withSpring(0, motion, (done) => {
      if (done) scheduleOnRN(setShown, null);
    }));
  }, [value, p, motion]);

  // Mở màn: đưa pill gợi ý vào giữa hàng, một lần cho mỗi hạng gợi ý.
  useEffect(() => {
    if (!width || !suggested || scrolledTo.current === suggested) return;
    const l = layouts.current.get(suggested);
    if (!l) return;
    scrolledTo.current = suggested;
    const x = Math.max(0, Math.min(l.x - (width - l.width) / 2, contentW.current - width));
    scroller.current?.scrollTo({ x, animated: false });
    scrollX.current = x;
  }, [width, suggested]);

  // Báo màn gọi sau khi hero mở xong: màn gọi lọc lại danh sách giữa chừng là khựng khung đầu.
  const open = (rank: Rank) => {
    const l = layouts.current.get(rank);
    if (l) from.set({ x: l.x - scrollX.current, w: l.width });
    selected.set(ranks.indexOf(rank));
    setStepped(false);
    setShown(rank);
    p.set(withSpring(1, motion, (done) => {
      if (done) scheduleOnRN(onChange, rank);
    }));
  };

  const step = (dir: -1 | 1) => {
    if (!shown) return;
    const next = ranks[ranks.indexOf(shown) + dir];
    if (!next) return;
    selected.set(ranks.indexOf(next));
    setStepped(true);
    setShown(next);
    onChange(next);
  };

  // Thu về pill của hạng đang xem. Sau ‹ › pill đó có thể nằm ngoài khung, nên cuộn hàng pill tới nó trước; lúc này
  // pill đang ẩn dưới hero nên cú cuộn không thấy.
  const close = () => {
    const l = shown ? layouts.current.get(shown) : undefined;
    if (l && width) {
      const x = Math.max(0, Math.min(l.x - (width - l.width) / 2, contentW.current - width));
      scroller.current?.scrollTo({ x, animated: false });
      scrollX.current = x;
      from.set({ x: l.x - x, w: l.width });
    }
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

  const at = shown ? ranks.indexOf(shown) : -1;
  const detail = shown && info ? info(shown) : undefined;
  const ratio = detail?.total ? (detail.passed ?? 0) / detail.total : undefined;

  return (
    <Animated.View style={[s.frame, frame]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <ScrollView
        ref={scroller}
        horizontal
        scrollEnabled={!shown}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => (scrollX.current = e.nativeEvent.contentOffset.x)}
        onContentSizeChange={(w) => (contentW.current = w)}
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
            suggested={suggested === rank}
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
            key={shown}
            entering={stepped ? FadeIn.duration(220) : undefined}
            exiting={FadeOut.duration(180)}
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
                  {suggested === shown ? 'Rank · Next' : 'Rank'}
                </AppText>
                <View style={s.heroButtons}>
                  <HeroButton icon="chevron.left" label="Previous rank" disabled={at <= 0} onPress={() => step(-1)} />
                  <HeroButton icon="chevron.right" label="Next rank" disabled={at >= ranks.length - 1} onPress={() => step(1)} />
                  <HeroButton icon="xmark" label="Show all ranks" onPress={close} />
                </View>
              </View>
              <View style={s.heroTitle}>
                <AppText variant="displayLarge" style={{ color: rankTone[shown].ink }}>
                  {rankTone[shown].label}
                </AppText>
                {detail?.action && (
                  <PressableScale
                    onPress={detail.action.onPress}
                    haptic="selection"
                    accessibilityRole="button"
                    style={({ pressed }) => [s.heroAction, pressed && s.heroActionPressed]}>
                    <AppText variant="callout" color="textPrimary">
                      {detail.action.label}
                    </AppText>
                    <AppIcon name="arrow.right" size="small" color="textPrimary" weight="semibold" />
                  </PressableScale>
                )}
              </View>
              {detail?.caption && (
                <AppText variant="caption" color="textSecondary" numberOfLines={2}>
                  {detail.caption}
                </AppText>
              )}
              {ratio !== undefined && (
                <View style={s.heroProgress}>
                  <View style={s.flex}>
                    <RankProgress rank={shown} value={ratio} />
                  </View>
                  <AppText variant="captionSmall" color="textSecondary">
                    {`${detail?.passed ?? 0}/${detail?.total} passed`}
                  </AppText>
                </View>
              )}
            </Animated.View>
          </Animated.View>
          <Animated.View pointerEvents="none" style={[s.pillLabel, pillLabel]}>
            <AppText variant="callout" style={{ color: rankTone[shown].ink }}>
              {rankTone[shown].label}
            </AppText>
          </Animated.View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

/** Nút tròn trên nền gradient: nền đen trong để đọc được trên mọi hạng, vùng chạm nới tới 44pt. */
function HeroButton({ icon, label, disabled, onPress }: { icon: IconName; label: string; disabled?: boolean; onPress: () => void }) {
  const s = useStyles();
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      haptic="selection"
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [s.heroButton, pressed && s.heroActionPressed, disabled && s.dim]}>
      <AppIcon name={icon} size="small" color="textPrimary" weight="semibold" />
    </PressableScale>
  );
}

function RankPill({
  rank,
  index,
  p,
  selected,
  hidden,
  suggested,
  width,
  onPress,
  onLayout,
}: {
  rank: Rank;
  index: number;
  p: SharedValue<number>;
  selected: SharedValue<number>;
  hidden: boolean;
  suggested: boolean;
  /** Bề ngang khung: pill hai bên bị đẩy đúng chừng này để ra hẳn khỏi mép. */
  width: number;
  onPress: () => void;
  onLayout: (l: LayoutRectangle) => void;
}) {
  const t = useTheme();
  const s = useStyles();
  const ink = rankTone[rank].ink;
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
        accessibilityLabel={`Rank ${rankTone[rank].label}${suggested ? ', suggested next' : ''}`}
        style={({ pressed }) => [
          s.pill,
          {
            backgroundColor: pressed ? t.color.surfacePressed : 'transparent',
            borderColor: suggested ? ink : t.color.borderStrong,
          },
        ]}>
        <View style={[s.dot, { backgroundColor: ink }]} />
        <AppText variant="callout" color={suggested ? 'textPrimary' : 'textSecondary'}>
          {rankTone[rank].label}
        </AppText>
        {suggested && (
          <AppText variant="captionSmall" style={{ color: ink }}>
            Next
          </AppText>
        )}
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
  flex: { flex: 1 },
  dim: { opacity: 0.35 },
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
  heroTop: {
    position: 'absolute',
    top: t.space.md,
    left: t.space.lg,
    right: t.space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroButtons: { flexDirection: 'row', gap: t.space.xs },
  heroButton: {
    width: 32,
    height: 32,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  heroTitle: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: t.space.sm },
  heroAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.xxs,
    height: 36,
    paddingHorizontal: t.space.md,
    marginBottom: t.space.xxs,
    borderRadius: t.radius.pill,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  heroActionPressed: { opacity: 0.7 },
  heroProgress: { flexDirection: 'row', alignItems: 'center', gap: t.space.sm, marginTop: t.space.xxs },
}));
