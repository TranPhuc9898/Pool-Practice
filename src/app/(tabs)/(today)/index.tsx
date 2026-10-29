import { router, Stack } from "expo-router";
import { View } from "react-native";

import { HeroCard } from "@/components/home/hero-card";
import { ProgramBento } from "@/components/home/program-bento";
import { areaOf, drillsIn } from "@/components/home/training-areas";
import {
  AppText,
  GhostButton,
  IconButton,
  makeStyles,
  Screen,
} from "@/design-system";
import { DRILLS } from "@/pool-engine/drills";
import {
  drillStatus,
  useAllProgress,
  useLastDrillId,
} from "@/pool-engine/progress";
import { useDaily, useDailyDays } from "@/pool-engine/daily";
import { useGuideStep } from "@/pool-engine/first-use";
import {
  LADDER,
  ladderOf,
  progressOf,
  streak,
  WORKOUT,
  WORKOUT_TOTAL,
} from "@/pool-engine/workout";
import type { PoolDrill } from "@/pool-engine/types";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Home: hero theo program đang tập, ba ô program. Mọi số đọc từ progress đã lưu, không bịa.
 * Continue đọc `lastDrillId` đã lưu đĩa, nên mở lại app vẫn về đúng bài.
 */
export default function HomeScreen() {
  const s = useStyles();
  const progress = useAllProgress();
  const lastId = useLastDrillId();
  const today = useDaily();
  const days = useDailyDays();
  // Người mới, chưa đánh cú nào hôm nay: hero nói app dùng thế nào thay cho màn onboarding riêng.
  const firstShot = useGuideStep() !== "done" && today.length === 0;
  const run = streak((k) => (days[k]?.length ?? 0) > 0, new Date());

  const isPassed = (d: PoolDrill) => {
    const p = progress.get(d.id);
    return !!p && drillStatus(d, p) === "passed";
  };

  // Bài tập gần nhất nếu chưa qua, không thì bài chưa qua kế tiếp tính từ nó.
  const lastIndex = Math.max(
    0,
    DRILLS.findIndex((d) => d.id === lastId),
  );
  const order = DRILLS.map((_, k) => (lastIndex + k) % DRILLS.length);
  const nextIndex = order.find((i) => !isPassed(DRILLS[i]));
  const allDone = nextIndex === undefined;
  const current = DRILLS[nextIndex ?? lastIndex];
  const fresh = lastId === null;

  const area = areaOf(current);

  const day = progressOf(today.length);
  const at = day.next;
  const block = at ? WORKOUT[at.block] : null;
  const mark = at && block ? block.marks[at.mark] : null;
  const passes = today.filter((r) => r === "pass").length;
  const level = LADDER ? ` · Stop L${ladderOf(days, "stop").rung}` : "";
  const stat = (id: Parameters<typeof drillsIn>[0]) => {
    const list = drillsIn(id);
    return { list, total: list.length, done: list.filter(isPassed).length };
  };
  const fund = stat("fundamentals");
  const cbc = stat("cueBallControl");
  const pos = stat("positionPlay");
  const pat = stat("patterns");

  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Screen gap="xl">
      <Stack.Screen
        options={{
          headerRight: () => <HeaderActions />,
        }}
      />

      <AppText variant="eyebrow" color="textTertiary">
        {date}
      </AppText>

      <HeroCard
        title={
          firstShot ? "Tốt hơn từng cú đánh." : block ? block.title : "Workout complete"
        }
        subtitle={
          firstShot
            ? "Xem đường bi. Đánh thật. Ghi kết quả."
            : block && mark
              ? `${mark.label} · ${block.goal}`
              : `${WORKOUT_TOTAL} shots in. Come back tomorrow.`
        }
        eyebrow="Daily · Fundamentals"
        cta={
          firstShot
            ? "Bắt đầu tập"
            : today.length === 0
              ? "Start workout"
              : at
                ? "Continue workout"
                : "Review workout"
        }
        onPress={() => router.push("/workout")}
        gauge={{
          total: WORKOUT.length,
          focus: at ? at.block : -1,
          fill: (seg) => day.blocks[seg].done / day.blocks[seg].total,
          value: day.done,
          of: WORKOUT_TOTAL,
          caption:
            run > 0
              ? `${pad(passes)} passed${level} · ${run}-day streak`
              : `${pad(passes)} passed${level}`,
        }}
        accessibilityLabel={
          firstShot
            ? "Tốt hơn từng cú đánh. Xem đường bi, đánh thật, ghi kết quả. Bắt đầu tập."
            : `Daily workout, ${day.done} of ${WORKOUT_TOTAL} shots. ` +
          (block && mark ? `Next: ${block.title}, ${mark.label}.` : "Done for today.")
        }
      />

      <View style={s.block}>
        <AppText
          variant="eyebrow"
          color="textTertiary"
          accessibilityRole="header"
        >
          Your program
        </AppText>
        <ProgramBento
          next={
            allDone
              ? null
              : { drill: current, label: `${fresh ? "Start here" : "Up next"} · ${area.title}` }
          }
          fundamentals={{ total: fund.total, done: fund.done }}
          cueBall={{
            total: cbc.total,
            done: cbc.done,
            current: allDone ? -1 : cbc.list.indexOf(current),
          }}
          advanced={{ total: pos.total + pat.total, done: pos.done + pat.done }}
        />
      </View>

      <GhostButton
        title="Stance check"
        icon="figure.stand"
        onPress={() => router.push("/stance")}
      />

      {__DEV__ && (
        <GhostButton
          title="Open Design System"
          icon="paintpalette"
          onPress={() => router.push("/design-system")}
        />
      )}
    </Screen>
  );
}

/** Nằm trong headerRight: iOS 26 bọc capsule glass sẵn, nên nút dùng `plain`. */
function HeaderActions() {
  return (
    <IconButton
      icon="gearshape"
      variant="plain"
      accessibilityLabel="Settings"
      onPress={() => router.push("/settings")}
    />
  );
}

const useStyles = makeStyles((t) => ({
  block: { gap: t.space.sm },
}));
