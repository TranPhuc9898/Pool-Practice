import { useRef, useState, type ComponentType } from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CountArt } from '@/components/onboarding/slide-count';
import { LadderArt } from '@/components/onboarding/slide-ladder';
import { PositionArt } from '@/components/onboarding/slide-position';
import { RefereeArt } from '@/components/onboarding/slide-referee';
import { AppText, makeStyles, PrimaryButton, useTheme } from '@/design-system';
import { playOutro } from '@/pool-engine/onboarding';

type Slide = { Art: ComponentType<{ active: boolean }>; kick: string; title: string; body: string };

const SLIDES: Slide[] = [
  {
    Art: CountArt,
    kick: 'DAILY WORKOUT',
    title: 'A gym session for your cue.',
    body: 'Four blocks of 30 shots. Same plan every day, so you see yourself get better.',
  },
  {
    Art: RefereeArt,
    kick: "YOU'RE THE REFEREE",
    title: 'Shoot. Tap Pass or Miss.',
    body: 'No camera, no setup. Seven of ten clears the set.',
  },
  {
    Art: LadderArt,
    kick: 'IT GROWS WITH YOU',
    title: 'Get better, it gets harder.',
    body: 'Pot it and stop the cue ball dead. Do it twice and it starts one diamond farther back.',
  },
  {
    Art: PositionArt,
    kick: 'THEN, POSITION',
    title: 'Pot one, set up the next.',
    body: 'Send the cue ball into the zone and ball 2 becomes an easy shot. The drill library takes it from here to full runouts.',
  },
];

/** Intro lần đầu mở app. Start hoặc Skip giao cho logo outro ở root layout, outro ghi cờ và mở ra home. */
export default function OnboardingScreen() {
  const s = useStyles();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const pager = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const last = page === SLIDES.length - 1;
  const pip = { transitionProperty: 'width', transitionDuration: t.motion.duration.smooth } as const;

  const finish = playOutro;

  const next = () => {
    if (last) return finish();
    pager.current?.scrollTo({ x: (page + 1) * width, animated: true });
    setPage(page + 1);
  };

  return (
    <View style={[s.root, { paddingTop: insets.top, paddingBottom: insets.bottom + t.space.md }]}>
      <View style={s.top}>
        <Pressable onPress={finish} hitSlop={12} accessibilityRole="button" disabled={last} style={[s.skip, last && s.hidden]}>
          <AppText variant="callout" color="textTertiary">
            Skip
          </AppText>
        </Pressable>
      </View>
      <ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
        style={s.pager}>
        {SLIDES.map(({ Art, kick, title, body }, i) => (
          <View key={kick} style={[s.slide, { width }]}>
            <View style={s.art}>
              <Art active={i === page} />
            </View>
            <View style={s.copy}>
              <AppText variant="eyebrow" color="accentGold">
                {kick}
              </AppText>
              <AppText variant="title1" accessibilityRole="header">
                {title}
              </AppText>
              <AppText variant="bodyLarge" color="textSecondary">
                {body}
              </AppText>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={s.footer}>
        <View style={s.pips} accessibilityLabel={`Page ${page + 1} of ${SLIDES.length}`}>
          {SLIDES.map((_, i) => (
            <Animated.View key={i} style={[s.pip, pip, { width: i === page ? 20 : 6 }, i === page && s.pipOn]} />
          ))}
        </View>
        <PrimaryButton title={last ? 'Start' : 'Next'} onPress={next} />
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  root: { flex: 1, backgroundColor: t.color.backgroundPrimary },
  top: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: t.space.lg, height: 44, alignItems: 'center' },
  skip: { paddingVertical: t.space.xs },
  hidden: { opacity: 0 },
  pager: { flex: 1 },
  slide: { flex: 1, paddingHorizontal: t.space.lg },
  art: { flex: 1, justifyContent: 'center' },
  copy: { gap: t.space.xs, paddingTop: t.space.lg },
  footer: { paddingHorizontal: t.space.lg, paddingTop: t.space.xl, gap: t.space.lg },
  pips: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  pip: { height: 6, borderRadius: 3, backgroundColor: t.color.borderPrimary },
  pipOn: { backgroundColor: t.color.textPrimary },
}));
