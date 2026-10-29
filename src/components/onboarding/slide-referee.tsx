import { useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AppText, makeStyles, useTheme } from '@/design-system';

import { useDemoLoop, wait, type Alive } from './timeline';

/** Tự bấm mẫu một loạt 10 cú, 7 Pass: đủ qua loạt. */
const SEQ = [1, 1, 0, 1, 1, 1, 0, 1, 0, 1] as const;
type Mark = 'pass' | 'miss' | null;

export function RefereeArt({ active }: { active: boolean }) {
  const s = useStyles();
  const t = useTheme();
  const press = { transitionProperty: 'transform', transitionDuration: t.motion.duration.press } as const;
  const [marks, setMarks] = useState<Mark[]>(() => SEQ.map(() => null));
  const [hit, setHit] = useState<'pass' | 'miss' | null>(null);
  const passed = marks.filter((m) => m === 'pass').length;
  const cleared = marks.every((m) => m !== null);

  const run = async (alive: Alive) => {
    setMarks(SEQ.map(() => null));
    await wait(500);
    for (let i = 0; i < SEQ.length; i++) {
      if (!alive()) return;
      const m = SEQ[i] ? 'pass' : 'miss';
      setHit(m);
      setMarks((prev) => prev.map((x, j) => (j === i ? m : x)));
      await wait(140);
      setHit(null);
      await wait(280);
    }
    await wait(1600);
  };

  useDemoLoop(active, run);

  return (
    <View
      style={s.root}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Demo: after each shot, tap Pass or Miss. Seven passes out of ten clears the set.">
      <View style={s.board}>
        <View>
          <AppText variant="dotDisplay" color="onSurfaceInverse" tabular>
            {passed}
          </AppText>
          <AppText variant="label" color="onSurfaceInverseSecondary" style={s.need}>
            PASSED · NEED 7
          </AppText>
        </View>
        <View style={s.marks}>
          {marks.map((m, i) => (
            <View key={i} style={[s.mark, m === 'pass' && s.markPass]}>
              {m === 'miss' && <View style={s.slash} />}
            </View>
          ))}
        </View>
      </View>
      <View style={s.taps}>
        <Animated.View style={[s.tap, s.miss, press, { transform: [{ scale: hit === 'miss' ? 0.94 : 1 }] }]}>
          <AppText variant="buttonLarge">Miss</AppText>
        </Animated.View>
        <Animated.View style={[s.tap, s.pass, press, { transform: [{ scale: hit === 'pass' ? 0.94 : 1 }] }]}>
          <AppText variant="buttonLarge" color="onAccent">
            Pass
          </AppText>
        </Animated.View>
      </View>
      <AppText variant="callout" color="accentGold" align="center" style={[s.cleared, { opacity: cleared ? 1 : 0 }]}>
        Set cleared
      </AppText>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  root: { width: '100%' },
  board: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: t.space.md,
    borderRadius: t.radius.card,
    backgroundColor: t.color.surfaceInverse,
  },
  need: { marginTop: t.space.xxs },
  marks: { flexDirection: 'row', gap: 5 },
  mark: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: t.border.strong,
    borderColor: t.color.onSurfaceInverseSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markPass: { backgroundColor: t.color.onSurfaceInverse, borderColor: t.color.onSurfaceInverse },
  slash: { width: 8, height: 1.5, backgroundColor: t.color.onSurfaceInverseSecondary, transform: [{ rotate: '45deg' }] },
  taps: { flexDirection: 'row', gap: t.space.sm, marginTop: t.space.sm },
  tap: {
    flex: 1,
    height: 56,
    borderRadius: t.radius.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miss: { backgroundColor: t.color.surfaceElevated, borderWidth: t.border.hairline, borderColor: t.color.borderPrimary },
  pass: { backgroundColor: t.color.accent },
  cleared: { marginTop: t.space.md },
}));
