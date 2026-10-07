import { router, Stack } from 'expo-router';
import { View } from 'react-native';

import { HeroCard } from '@/components/home/hero-card';
import { ProgramBento } from '@/components/home/program-bento';
import { QuickPractice } from '@/components/home/quick-practice';
import { areaOf, drillsIn } from '@/components/home/training-areas';
import { AppIcon, AppText, GhostButton, IconButton, makeStyles, PressableScale, Screen } from '@/design-system';
import { DRILLS } from '@/pool-engine/drills';
import { drillStatus, useAllProgress, useLastDrillId } from '@/pool-engine/progress';
import type { PoolDrill } from '@/pool-engine/types';

/** Ô tập nhanh: kỹ năng bi cái lõi. Bài đang nằm trong hero thì bỏ qua, lấy ô dự phòng. */
const QUICK: readonly (readonly [string, string])[] = [
  ['02', 'Stop'],
  ['03', 'Follow'],
  ['05', 'Draw'],
  ['04', 'Follow Distance'],
];

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Home: hero theo program đang tập, ba ô program, ba ô tập nhanh. Mọi số đọc từ progress đã lưu, không bịa.
 * Continue đọc `lastDrillId` đã lưu đĩa, nên mở lại app vẫn về đúng bài.
 */
export default function HomeScreen() {
  const s = useStyles();
  const progress = useAllProgress();
  const lastId = useLastDrillId();

  const isPassed = (d: PoolDrill) => {
    const p = progress.get(d.id);
    return !!p && drillStatus(d, p) === 'passed';
  };

  // Bài tập gần nhất nếu chưa qua, không thì bài chưa qua kế tiếp tính từ nó.
  const lastIndex = Math.max(0, DRILLS.findIndex((d) => d.id === lastId));
  const order = DRILLS.map((_, k) => (lastIndex + k) % DRILLS.length);
  const nextIndex = order.find((i) => !isPassed(DRILLS[i]));
  const allDone = nextIndex === undefined;
  const current = DRILLS[nextIndex ?? lastIndex];
  const fresh = lastId === null;

  const area = areaOf(current);
  const program = drillsIn(area.id);
  const focus = allDone ? -1 : program.indexOf(current);
  const programPassed = program.filter(isPassed).length;
  const stat = (id: Parameters<typeof drillsIn>[0]) => {
    const list = drillsIn(id);
    return { list, total: list.length, done: list.filter(isPassed).length };
  };
  const fund = stat('fundamentals');
  const cbc = stat('cueBallControl');
  const pos = stat('positionPlay');
  const pat = stat('patterns');

  const quick = QUICK.filter(([id]) => id !== current.id)
    .slice(0, 3)
    .flatMap(([id, name]) => {
      const drill = DRILLS.find((d) => d.id === id);
      return drill ? [{ drill, name, passed: isPassed(drill) }] : [];
    });

  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <Screen gap="xl">
      <Stack.Screen options={{ headerRight: () => <HeaderActions /> }} />

      <View>
        <AppText variant="eyebrow" color="textTertiary">
          {date}
        </AppText>
        <AppText variant="display" accessibilityRole="header">
          Today
        </AppText>
      </View>

      <HeroCard
        drill={current}
        eyebrow={fresh ? 'First program' : allDone ? 'All drills passed' : area.title}
        cta={fresh ? 'Start training' : 'Continue training'}
        gauge={{
          total: program.length,
          focus,
          passed: (seg) => isPassed(program[seg]),
          caption: fresh ? 'Drill · first one' : allDone ? 'Complete' : `Drill · ${programPassed} passed`,
        }}
        accessibilityLabel={
          `${fresh ? 'Start' : 'Continue'} training. ${current.title}, ${area.title}, ` +
          `drill ${program.indexOf(current) + 1} of ${program.length}.`
        }
      />

      <View style={s.block}>
        <AppText variant="eyebrow" color="textTertiary" accessibilityRole="header">
          Your program
        </AppText>
        <ProgramBento
          fundamentals={{ total: fund.total, done: fund.done }}
          cueBall={{ total: cbc.total, done: cbc.done, current: allDone ? -1 : cbc.list.indexOf(current) }}
          advanced={{ total: pos.total + pat.total, done: pos.done + pat.done }}
        />
      </View>

      <View style={s.block}>
        <AppText variant="eyebrow" color="textTertiary" accessibilityRole="header">
          Quick practice
        </AppText>
        <QuickPractice items={quick} />
        <PressableScale
          onPress={() => router.navigate('/drills')}
          accessibilityRole="button"
          accessibilityLabel={`All drills, ${pad(DRILLS.length)}`}
          style={s.all}>
          <AppText variant="callout" color="textSecondary">
            All drills
          </AppText>
          <AppIcon name="arrow.right" size="small" color="textSecondary" weight="semibold" />
        </PressableScale>
      </View>

      {__DEV__ && (
        <GhostButton title="Open Design System" icon="paintpalette" onPress={() => router.push('/design-system')} />
      )}
    </Screen>
  );
}

/** Nằm trong headerRight: iOS 26 bọc capsule glass sẵn, nên nút dùng `plain`. */
function HeaderActions() {
  return (
    <IconButton icon="gearshape" variant="plain" accessibilityLabel="Settings" onPress={() => router.push('/settings')} />
  );
}

const useStyles = makeStyles((t) => ({
  block: { gap: t.space.sm },
  all: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: t.layout.minTouchTarget,
  },
}));
