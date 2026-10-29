import { router, Stack } from "expo-router";
import { useState } from "react";
import { useWindowDimensions, View } from "react-native";

import {
  GoldAction,
  GraphiteAction,
  Scoreboard,
  ShotCard,
} from "@/components/drill/drill-ui";
import {
  spinLabel,
  speedMs,
  stageHeightFor,
  stageState,
} from "@/components/drill/stage";
import { FirstUseHint } from "@/components/first-use-hint";
import {
  AppText,
  makeStyles,
  PressableScale,
  Screen,
  SecondaryButton,
  Section,
  useGutter,
} from "@/design-system";
import {
  recordShot,
  undoShot,
  useDaily,
  useDailyDays,
} from "@/pool-engine/daily";
import {
  finishGuide,
  guideSawPlay,
  useGuideStep,
} from "@/pool-engine/first-use";
import {
  LADDER_RUNGS,
  ladderOf,
  markDrill,
  progressOf,
  WORKOUT,
  WORKOUT_TOTAL,
} from "@/pool-engine/workout";

import { PoolEditorView } from "../../modules/pool-table";

/**
 * Daily workout: một màn cho cả bài. Vị trí khối và mốc suy ra từ số cú đã ghi hôm nay,
 * nên đánh đủ mốc là màn tự sang mốc kế, không cần state riêng.
 */
export default function WorkoutScreen() {
  const s = useStyles();
  const today = useDaily();
  const days = useDailyDays();
  const gutter = useGutter();
  const { width: windowWidth } = useWindowDimensions();
  const [playRev, setPlayRev] = useState(0);
  const guide = useGuideStep();
  const day = progressOf(today.length);
  const at = day.next;

  if (!at) {
    // Cú hôm nay xếp đúng thứ tự WORKOUT, nên cắt lần lượt theo số cú từng mốc.
    const review = [];
    let offset = 0;
    for (const block of WORKOUT) {
      const marks = [];
      for (const mark of block.marks) {
        marks.push({ mark, shots: today.slice(offset, offset + mark.shots) });
        offset += mark.shots;
      }
      review.push({ block, marks });
    }
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
        {review.map(({ block, marks }) => (
          <Section key={block.id} title={block.title} caption={block.goal}>
            {marks.map(({ mark, shots }) => (
              <PressableScale
                key={mark.label}
                haptic="selection"
                accessibilityRole="button"
                accessibilityHint={`Opens the ${block.title} drill`}
                onPress={() =>
                  router.push(
                    `/drill/${block.id === "stroke" ? "stroke" : block.drill}${mark.diamonds ? `?d=${mark.diamonds}` : ""}`,
                  )
                }
              >
                <Scoreboard
                  attempts={shots}
                  total={mark.shots}
                  passed={shots.filter((r) => r === "pass").length}
                  required={mark.shots}
                  isPassed={false}
                  caption={mark.label}
                />
              </PressableScale>
            ))}
          </Section>
        ))}
        <UndoShot />
      </Screen>
    );
  }

  const block = WORKOUT[at.block];
  const mark = block.marks[at.mark];
  // Các cú của mốc đang đánh nằm ở cuối mảng hôm nay.
  const shots = today.slice(today.length - at.shot);
  const passed = shots.filter((r) => r === "pass").length;
  // Khối ladder: khoảng cách theo level, tính trên cả các cú vừa đánh nên vào/trượt là đổi ngay cú sau.
  const ladder = block.ladder ? ladderOf(days, block.id) : null;
  const diamonds = ladder?.rung ?? mark.diamonds;
  // Bàn và cú gợi ý của mốc đang đánh, cùng khối bàn với màn drill.
  const drill = markDrill(block, mark, diamonds);
  const stageWidth = windowWidth - 2 * gutter;

  return (
    <Screen gap="xl">
      <Stack.Screen options={{ title: "Daily Workout" }} />

      <View style={s.head}>
        <AppText variant="eyebrow" color="textTertiary">
          {`Block ${at.block + 1} of ${WORKOUT.length} · ${day.done}/${WORKOUT_TOTAL} shots`}
        </AppText>
        <AppText variant="heroTitle">{`${block.title} · ${ladder?.label ?? mark.label}`}</AppText>
        <AppText variant="callout" color="textSecondary">
          {drill.objective}
        </AppText>
        {ladder && (
          <AppText variant="callout" color="textSecondary">
            {ladder.rung < LADDER_RUNGS.max
              ? `Level ${ladder.rung} · ${2 - ladder.streak} more in to move back`
              : `Level ${ladder.rung} · top distance`}
          </AppText>
        )}
      </View>

      <PoolEditorView
        style={{ width: stageWidth, height: stageHeightFor(stageWidth) }}
        stageOnly
        state={stageState(drill, diamonds ?? 0)}
        drill={drill}
        showGhostBall
        showTangentLine
        showCuePath
        showTarget
        playRev={playRev}
      />
      <ShotCard
        title={`Shot · ${spinLabel[drill.recommendedSpin]}`}
        shot={{
          tipX: drill.recommendedContactPoint.x,
          tipY: drill.recommendedContactPoint.y,
          speed: speedMs[drill.recommendedSpeed],
        }}
        pass={`${passed} of ${mark.shots}`}
      />
      {guide === "play" && (
        <FirstUseHint text="Bấm Play shot để xem đường bi. Chỉ là mô phỏng, chưa tính cú." />
      )}
      <GraphiteAction
        sheen
        title="Play shot"
        icon="play.fill"
        onPress={() => {
          setPlayRev((n) => n + 1);
          guideSawPlay();
        }}
      />

      <Scoreboard
        attempts={shots}
        total={mark.shots}
        passed={passed}
        required={mark.shots}
        isPassed={false}
        caption={`${ladder ? `${mark.label} · ` : ""}Shot ${at.shot + 1} of ${mark.shots}`}
      />

      {guide === "record" && (
        <FirstUseHint text="Đánh thật trên bàn, rồi ghi Pass hoặc Miss." />
      )}
      <View style={s.row}>
        <GoldAction
          title="Pass"
          icon="checkmark"
          haptic="light"
          style={s.flex}
          onPress={() => {
            recordShot("pass");
            finishGuide();
          }}
        />
        <GraphiteAction
          title="Miss"
          icon="xmark"
          style={s.flex}
          onPress={() => {
            recordShot("fail");
            finishGuide();
          }}
        />
      </View>
      {today.length > 0 && <UndoShot />}
    </Screen>
  );
}

/** Bấm nhầm Pass/Miss: mốc và level suy ra từ số cú, nên một cú nhầm làm lệch mọi cú sau. */
function UndoShot() {
  return (
    <SecondaryButton
      title="Undo last shot"
      icon="arrow.uturn.backward"
      size="medium"
      fullWidth
      onPress={undoShot}
    />
  );
}

const useStyles = makeStyles((t) => ({
  head: { gap: t.space.xs },
  row: { flexDirection: "row", gap: 12 },
  flex: { flex: 1 },
}));
