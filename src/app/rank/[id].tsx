import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useReducedMotion,
  useScrollOffset,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { DrillCard } from '@/components/drill-card';
import { RANK_HERO, RankLetter } from '@/components/rank/rank-cards';
import { numberInLevel, RANKS_WITH_DRILLS, useLevelSummaries } from '@/components/rank/rank-data';
import { frameAt, morph, PILL_W, retargetRank, type Rect } from '@/components/rank/rank-morph';
import {
  AppIcon,
  AppText,
  makeStyles,
  PressableScale,
  RankProgress,
  rankGradient,
  rankTone,
  Section,
  useGutter,
  useTheme,
  type Rank,
} from '@/design-system';
import { groupOf, SKILL_GROUPS } from '@/pool-engine/groups';

const HERO_H = 380;
/** Số trang hạng đang mount, để biết khi nào trang cuối cùng rời đi. */
let mounted = 0;

const EASE_WIDE = Easing.bezier(0.22, 1, 0.36, 1);
const EASE_TALL = Easing.bezier(0.65, 0, 0.35, 1);

/**
 * Trang một hạng, mở như clip "pill opens into a landscape": thẻ hạng vừa bấm dãn ngang thành pill gần full bề rộng, đẩy
 * thẻ bên cạnh văng ra, rồi nở dọc ra full màn. Nền gradient đứng yên theo màn, khung chỉ là cửa sổ mở dần ra nó. Nở xong
 * nội dung trang mới hiện. Back chạy ngược lại về đúng ô. Màn là `transparentModal` nên tab Drills vẫn nằm phía sau.
 * Hero gradient, chữ hạng khổng lồ, mốc, tiến độ và nút tập bài chưa qua đầu tiên. Dưới là toàn bộ bài của hạng chia
 * theo nhóm kỹ năng, cuối trang là lối sang hạng kế. Kéo quá đầu thì hero giãn, cuộn xuống thì chữ hạng trôi chậm hơn.
 */
export default function RankScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const rank = (RANKS_WITH_DRILLS.includes(id as Rank) ? id : RANKS_WITH_DRILLS[0]) as Rank;
  const t = useTheme();
  const s = useStyles();
  const gutter = useGutter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const reduced = useReducedMotion();
  const { summaries, progress } = useLevelSummaries();
  const { benchmark, drills, passed, next } = summaries.get(rank)!;
  const tone = rankTone[rank];
  const after = RANKS_WITH_DRILLS[RANKS_WITH_DRILLS.indexOf(rank) + 1];

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const offset = useScrollOffset(scrollRef);
  const stretch = useAnimatedStyle(() => {
    const y = offset.get();
    const grow = y < 0 ? (HERO_H - y) / HERO_H : 1;
    return { transform: [{ translateY: y < 0 ? y / 2 : 0 }, { scale: grow }] };
  });
  const drift = useAnimatedStyle(() => ({
    opacity: interpolate(offset.get(), [0, HERO_H * 0.6], [0.1, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(offset.get(), [-HERO_H, 0, HERO_H], [-HERO_H * 0.3, 0, HERO_H * 0.45]),
      },
    ],
  }));

  const fallback: Rect = { x: width / 2 - PILL_W / 2, y: height / 2 - 28, width: PILL_W, height: 56 };
  // Chữ hạng nền đặt ngang tâm dòng vừa bấm, để lúc còn là pill khung đã cắt ngang qua chữ như clip cắt ngang đường chân trời.
  const letterSize = Math.round((width * 0.9) / Math.max(1, tone.label.length * 0.62));
  const [measured, setMeasured] = useState(() => morph.origin.get());
  const origin = measured ?? fallback;
  const letterTop = Math.min(
    Math.max(origin.y + origin.height / 2 - letterSize * 0.51, insets.top),
    height - letterSize * 1.02,
  );
  const shown = useSharedValue(morph.progress.get() >= 2 ? 1 : 0);
  const closing = useRef(false);

  useEffect(() => {
    // Sang từ hạng trước bằng thẻ Next rank: khung đã full màn, chỉ hiện nội dung.
    if (morph.progress.get() >= 2) return;
    let cancelled = false;
    const open = () => {
      if (cancelled) return;
      if (reduced) {
        morph.progress.set(2);
        shown.set(withTiming(1, { duration: 200 }));
        return;
      }
      morph.progress.set(
        withSequence(
          withTiming(0, { duration: 400, easing: EASE_WIDE }),
          withDelay(60, withTiming(1, { duration: 380, easing: EASE_WIDE })),
          withDelay(
            60,
            withTiming(2, { duration: 440, easing: EASE_TALL }, (done) => {
              if (done) shown.set(withTiming(1, { duration: 260 }));
            }),
          ),
        ),
      );
    };
    if (morph.originKey.get() !== null) open();
    else
      // Vào thẳng bằng deep link: điền hạng này lên dòng lớn tab Drills rồi nở từ đó. Tab chưa mount thì nở từ giữa màn.
      retargetRank(RANK_HERO, rank).then(() => {
        if (!cancelled) setMeasured(morph.origin.get());
        open();
      });
    return () => {
      cancelled = true;
    };
    // Chỉ chạy lúc mount: `rank` đổi thì màn đã được thay bằng màn mới.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, shown]);

  useEffect(() => {
    mounted += 1;
    return () => {
      mounted -= 1;
      // Màn bị gỡ không qua beforeRemove (Fast Refresh, reset điều hướng) thì trả danh sách hạng về chỗ cũ. Chờ một nhịp vì
      // `router.replace` gỡ màn cũ trước khi màn mới chạy effect.
      setTimeout(() => {
        if (mounted > 0) return;
        morph.progress.set(-1);
        morph.origin.set(null);
        morph.originKey.set(null);
      }, 0);
    };
  }, []);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (closing.current || e.data.action.type === 'REPLACE') return;
        e.preventDefault();
        closing.current = true;
        const leave = () => navigation.dispatch(e.data.action);
        const end = (done?: boolean) => {
          'worklet';
          if (done) scheduleOnRN(leave);
        };
        shown.set(withTiming(0, { duration: 160 }));
        if (reduced) {
          morph.progress.set(withDelay(160, withTiming(-1, { duration: 0 }, end)));
          return;
        }
        morph.progress.set(
          withDelay(
            120,
            withSequence(
              withTiming(1, { duration: 340, easing: EASE_TALL }),
              withTiming(0, { duration: 300, easing: EASE_WIDE }),
              withTiming(-1, { duration: 260, easing: EASE_TALL }, end),
            ),
          ),
        );
      }),
    [navigation, reduced, shown],
  );

  const frame = useAnimatedStyle(() => {
    const f = frameAt(morph.progress.get(), morph.origin.get() ?? fallback, width, height);
    return { left: f.x, top: f.y, width: f.width, height: f.height, borderRadius: f.radius };
  });
  const anchor = useAnimatedStyle(() => {
    const f = frameAt(morph.progress.get(), morph.origin.get() ?? fallback, width, height);
    return { transform: [{ translateX: -f.x }, { translateY: -f.y }] };
  });
  const page = useAnimatedStyle(() => ({ opacity: shown.get() }));
  const rise = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - shown.get()) * 24 }] }));

  const groups = SKILL_GROUPS.map((g) => ({
    ...g,
    drills: drills.filter((d) => groupOf(d) === g.id),
  })).filter((g) => g.drills.length > 0);

  return (
    <View style={s.fill}>
      <Animated.View style={[s.frame, frame]}>
        <Animated.View style={[{ width, height }, anchor]}>
          <View
            style={[
              s.fill,
              {
                experimental_backgroundImage: `radial-gradient(circle at 80% 20%, ${tone.glow}55 0%, transparent 60%), ${rankGradient(rank, 160)}`,
              },
            ]}
          />
          <View pointerEvents="none" style={[s.backdropLetter, { top: letterTop }]}>
            <RankLetter rank={rank} size={letterSize} glow />
          </View>
          <Animated.View style={[s.page, page]}>
            <Animated.ScrollView
              ref={scrollRef}
              contentInsetAdjustmentBehavior="never"
              contentContainerStyle={{
                paddingBottom: insets.bottom + t.space.section,
              }}
              scrollEventThrottle={16}>
              <View style={{ height: HERO_H + insets.top }}>
                <Animated.View
                  style={[
                    s.heroBg,
                    stretch,
                    {
                      experimental_backgroundImage: `radial-gradient(circle at 80% 20%, ${tone.glow}55 0%, transparent 60%), ${rankGradient(rank, 160)}`,
                    },
                  ]}
                />
                <View
                  pointerEvents="none"
                  style={[
                    s.heroFade,
                    {
                      experimental_backgroundImage: `linear-gradient(180deg, transparent 0%, ${t.color.backgroundPrimary} 100%)`,
                    },
                  ]}
                />
                <Animated.View pointerEvents="none" style={[s.watermark, drift]}>
                  <RankLetter rank={rank} size={Math.round((width * 0.78) / Math.max(1, tone.label.length * 0.62))} />
                </Animated.View>
                <Animated.View style={[s.heroBody, { paddingHorizontal: gutter }, rise]}>
                  <AppText variant="eyebrow" color="textSecondary">
                    Rank
                  </AppText>
                  <RankLetter rank={rank} size={112} glow />
                  <AppText variant="title3" color="textPrimary">
                    {benchmark}
                  </AppText>
                  <View style={s.progressRow}>
                    <View style={s.flex}>
                      <RankProgress rank={rank} value={passed / drills.length} />
                    </View>
                    <AppText variant="caption" color="textSecondary">
                      {`${passed}/${drills.length} passed`}
                    </AppText>
                  </View>
                  {next && (
                    <PressableScale
                      onPress={() => router.push(`/drill/${next.number}`)}
                      haptic="medium"
                      accessibilityRole="button"
                      accessibilityLabel={`${passed === 0 ? 'Start' : 'Continue'} with ${next.title}`}
                      style={[s.cta, { backgroundColor: tone.ink }]}>
                      <AppIcon name="play.fill" size="small" color="textInverse" />
                      <AppText variant="headline" color="textInverse" numberOfLines={1} style={s.ctaText}>
                        {`${passed === 0 ? 'Start' : 'Continue'} · ${numberInLevel(next)} ${next.title}`}
                      </AppText>
                    </PressableScale>
                  )}
                </Animated.View>
              </View>

              <Animated.View style={[s.list, { paddingHorizontal: gutter }, rise]}>
                {groups.map((g) => (
                  <Section
                    key={g.id}
                    title={g.title}
                    caption={g.drills.length === 1 ? '1 drill' : `${g.drills.length} drills`}>
                    {g.drills.map((drill) => (
                      <DrillCard
                        key={drill.id}
                        drill={drill}
                        progress={progress.get(drill.id)}
                        number={numberInLevel(drill)}
                        compact
                      />
                    ))}
                  </Section>
                ))}

                {after && (
                  <PressableScale
                    onPress={async () => {
                      await retargetRank(RANK_HERO, after);
                      router.replace({ pathname: '/rank/[id]', params: { id: after } });
                    }}
                    haptic="selection"
                    accessibilityRole="button"
                    accessibilityLabel={`Next rank, ${rankTone[after].label}`}
                    style={[
                      s.nextRank,
                      {
                        borderColor: t.color.borderSubtle,
                        experimental_backgroundImage: `radial-gradient(circle at 100% 50%, ${rankTone[after].glow}30 0%, transparent 65%)`,
                      },
                    ]}>
                    <View style={s.flex}>
                      <AppText variant="eyebrow" color="textTertiary">
                        Next rank
                      </AppText>
                      <AppText variant="callout" color="textSecondary" numberOfLines={2}>
                        {summaries.get(after)!.benchmark}
                      </AppText>
                    </View>
                    <RankLetter rank={after} size={44} />
                    <AppIcon name="chevron.right" size="small" color="textTertiary" weight="semibold" />
                  </PressableScale>
                )}
              </Animated.View>
            </Animated.ScrollView>
            <PressableScale
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Back"
              style={[s.back, { top: insets.top + t.space.xs, left: gutter }]}>
              <AppIcon name="chevron.left" size="small" color="textPrimary" weight="semibold" />
            </PressableScale>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  flex: { flex: 1 },
  frame: { position: 'absolute', overflow: 'hidden', borderCurve: 'continuous' },
  backdropLetter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    opacity: 0.2,
  },
  page: { flex: 1, backgroundColor: t.color.backgroundPrimary },
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transformOrigin: 'top',
  },
  heroFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 160 },
  watermark: { position: 'absolute', right: -40, top: 24 },
  heroBody: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: t.space.lg,
    gap: t.space.xs,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.sm,
    marginTop: t.space.xs,
  },
  cta: {
    marginTop: t.space.md,
    height: 52,
    borderRadius: t.radius.pill,
    paddingHorizontal: t.space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space.xs,
  },
  ctaText: { flexShrink: 1 },
  back: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  list: { gap: t.space.xl, marginTop: t.space.md },
  nextRank: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space.md,
    padding: t.space.lg,
    borderRadius: t.radius.card,
    borderWidth: t.border.hairline,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
}));
