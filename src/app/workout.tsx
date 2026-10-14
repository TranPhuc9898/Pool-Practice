import { router, Stack } from "expo-router";
import { View } from "react-native";

import {
  GoldAction,
  GraphiteAction,
  Scoreboard,
} from "@/components/drill/drill-ui";
import { AppText, makeStyles, Screen } from "@/design-system";
import { recordShot, useDaily } from "@/pool-engine/daily";
import { progressOf, WORKOUT, WORKOUT_TOTAL } from "@/pool-engine/workout";

/**
 * Daily workout: một màn cho cả 100 cú. Vị trí khối và mốc suy ra từ số cú đã ghi hôm nay,
 * nên đánh đủ mốc là màn tự sang mốc kế, không cần state riêng.
 */
export default function WorkoutScreen() {
  const s = useStyles();
  const today = useDaily();
  const day = progressOf(today.length);
  const at = day.next;

  if (!at) {
    return (
      <Screen gap="xl">
        <Stack.Screen options={{ title: "Daily Workout" }} />
        <View style={s.head}>
          <AppText variant="eyebrow" color="textTertiary">
            {`${WORKOUT_TOTAL}/${WORKOUT_TOTAL} shots`}
          </AppText>
          <AppText variant="heroTitle">Workout complete</AppText>
          <AppText variant="callout" color="textSecondary">
            {`${today.filter((r) => r === "pass").length} passed today. Come back tomorrow.`}
          </AppText>
        </View>
        <GoldAction
          title="Back to Home"
          icon="house"
          onPress={() => router.back()}
        />
      </Screen>
    );
  }

  const block = WORKOUT[at.block];
  const mark = block.marks[at.mark];
  // Các cú của mốc đang đánh nằm ở cuối mảng hôm nay.
  const shots = today.slice(today.length - at.shot);
  const passed = shots.filter((r) => r === "pass").length;

  return (
    <Screen gap="xl">
      <Stack.Screen options={{ title: "Daily Workout" }} />

      <View style={s.head}>
        <AppText variant="eyebrow" color="textTertiary">
          {`Block ${at.block + 1} of ${WORKOUT.length} · ${day.done}/${WORKOUT_TOTAL} shots`}
        </AppText>
        <AppText variant="heroTitle">{`${block.title} · ${mark.label}`}</AppText>
        <AppText variant="callout" color="textSecondary">
          {block.goal}
        </AppText>
      </View>

      <Scoreboard
        attempts={shots}
        total={mark.shots}
        passed={passed}
        required={mark.shots}
        isPassed={false}
        caption={`Shot ${at.shot + 1} of ${mark.shots}`}
      />

      <View style={s.row}>
        <GoldAction
          title="Pass"
          icon="checkmark"
          haptic="light"
          style={s.flex}
          onPress={() => recordShot("pass")}
        />
        <GraphiteAction
          title="Miss"
          icon="xmark"
          style={s.flex}
          onPress={() => recordShot("fail")}
        />
      </View>
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  head: { gap: t.space.xs },
  row: { flexDirection: "row", gap: 12 },
  flex: { flex: 1 },
}));
