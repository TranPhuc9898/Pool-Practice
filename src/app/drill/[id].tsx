import * as Clipboard from "expo-clipboard";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useCallback, useState } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  FooterNav,
  GoldAction,
  GraphiteAction,
  GuideToggles,
  Scoreboard,
  ShotCard,
} from "@/components/drill/drill-ui";
import {
  spinLabel,
  stageHeightFor,
  stageState,
  speedMs,
  TABLE_ASPECT,
} from "@/components/drill/stage";
import { areaOf, drillsIn } from "@/components/home/training-areas";
import {
  AppText,
  homeSurfaces,
  IconButton,
  makeStyles,
  SecondaryButton,
  useGutter,
} from "@/design-system";
import { useSessionHistory } from "@/pool-engine/attempt-log";
import { atDistance, DRILLS, drillByNumber } from "@/pool-engine/drills";
import { downAndBack } from "@/pool-engine/drills/down-and-back";
import type { PoolDrill } from "@/pool-engine/types";
import {
  passes,
  recordAttempt,
  resetDrill,
  startDrill,
  undoAttempt,
  useDrillProgress,
} from "@/pool-engine/progress";
import { recordRun, useLastRun, type ShotResult } from "@/pool-engine/shot-log";

import {
  PoolEditorView,
  PoolTableView,
  type BallMoveEvent,
  type TargetPick,
} from "../../../modules/pool-table";

type GuideKey =
  "showGhostBall" | "showTangentLine" | "showCuePath" | "showTarget";
const GUIDES: { key: GuideKey; label: string }[] = [
  { key: "showGhostBall", label: "Ghost" },
  { key: "showTangentLine", label: "Tangent" },
  { key: "showCuePath", label: "Path" },
  { key: "showTarget", label: "Target" },
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function DrillScreen() {
  // `debug=1` bật lưới hình học, `w=<pt>` ép bề rộng container để kiểm tỉ lệ, `guide=0` tắt guide,
  // `dev=1` (chỉ bản dev) kéo bi + Copy JSON để soạn toạ độ drill. `debug`, `guide=0`, `dev` dùng bàn ngang cũ.
  // `d=<1|2|3>` mở drill ở mức khoảng cách trong `distances`, từ Daily Workout.
  const { id, debug, w, guide, dev, d } = useLocalSearchParams<{
    id: string;
    d?: string;
    debug?: string;
    w?: string;
    guide?: string;
    dev?: string;
  }>();
  const s = useStyles();
  const gutter = useGutter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const landscape = windowWidth > windowHeight;
  const [showInfo, setShowInfo] = useState(false);
  const devMode = __DEV__ && dev === "1";
  // Bàn ngang cũ chỉ còn cho công cụ dev: kéo bi, lưới hình học, tắt guide.
  const legacyTable = devMode || debug === "1" || guide === "0";
  const [guides, setGuides] = useState<Record<GuideKey, boolean>>({
    showGhostBall: true,
    showTangentLine: true,
    showCuePath: true,
    showTarget: true,
  });
  const [pick, setPick] = useState<{ drillId: string; shot: TargetPick }>();
  const [playRev, setPlayRev] = useState(0);
  // Drill có `shots`: cú đang xem và số lần bấm cú trước/cú sau, để native dựng lại bàn kể cả khi chỉ số không đổi.
  const [shotAt, setShotAt] = useState<{
    drillId: string;
    i: number;
    rev: number;
  }>();
  // Drill có `shots`: kết quả các cú của run đang đánh, chỉ trong bộ nhớ tới khi run khép.
  const [run, setRun] = useState<{ drillId: string; results: ShotResult[] }>();
  const [moves, setMoves] = useState<{
    drillId: string;
    balls: Record<number, BallMoveEvent>;
  }>();

  // Cả app khoá dọc (initialOrientation); chỉ màn bàn được xoay ngang, rời màn thì khoá lại.
  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.unlockAsync();
      return () => {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        );
      };
    }, []),
  );

  const width = w ? Number(w) : undefined;
  // Stroke của Daily Workout không nằm trong thư viện, mở bằng id `stroke`.
  const base: PoolDrill =
    id === downAndBack.id
      ? downAndBack
      : (drillByNumber(Number(id)) ?? DRILLS[0]);
  const level = base.distances?.find((l) => l.diamonds === Number(d));
  const leveled = level ? atDistance(base, level.diamonds) : base;
  const progress = useDrillProgress(leveled.id);
  const done = progress.attempts.length;
  const total = leveled.attemptCount;
  const rounds = leveled.rounds;
  const roundIndex = rounds
    ? Math.min(Math.floor(done / (total / rounds.length)), rounds.length - 1)
    : 0;
  const round = rounds?.[roundIndex];
  // Thang góc cắt: mỗi round đặt bi cái một chỗ, bàn và guide đọc theo chỗ đó.
  const drill = round?.cueBall
    ? { ...leveled, cueBall: round.cueBall }
    : leveled;
  const area = areaOf(drill);
  const program = drillsIn(area.id);

  // Bi đã kéo đè lên data gốc, để guide vẽ lại theo chỗ mới. Đổi drill thì bỏ. React Compiler tự memo.
  const balls = moves?.drillId === drill.id ? moves.balls : undefined;
  const at = (n: number, p: { x: number; y: number }) =>
    balls?.[n] ? { x: balls[n].x, y: balls[n].y } : p;
  const tableDrill = balls
    ? {
        ...drill,
        cueBall: at(0, drill.cueBall),
        objectBalls: drill.objectBalls.map((b) => ({
          ...b,
          ...at(b.number, b),
        })),
      }
    : drill;
  const onBallMove = ({ nativeEvent: e }: { nativeEvent: BallMoveEvent }) =>
    setMoves((m) => ({
      drillId: drill.id,
      balls: { ...(m?.drillId === drill.id ? m.balls : {}), [e.ball]: e },
    }));
  const copyJson = () =>
    Clipboard.setStringAsync(
      JSON.stringify(
        { cueBall: tableDrill.cueBall, objectBalls: tableDrill.objectBalls },
        null,
        2,
      ),
    );
  // Vùng đích đang chọn trên bàn: Spin/Speed đổi theo cú tới vùng đó. Đổi drill thì bỏ.
  const target =
    pick?.drillId === drill.id && pick.shot.label ? pick.shot : undefined;
  const zoneCount = drill.cueBallTargetZones.length;
  // Drill nhiều đích: cú gợi ý chung không đúng cho đích nào, phải chọn đích mới có cú.
  // Drill có `shots` thì mỗi zone đã gắn sẵn một cú, không phải chọn.
  const multi = zoneCount > 1 && !legacyTable && !drill.shots;
  // Đang chạy thì card theo cú native báo, rảnh thì theo cú đang xem.
  const shotIndex = shotAt?.drillId === drill.id ? shotAt.i : 0;
  const shown = target?.shot ?? shotIndex;
  const planned = drill.shots?.[shown];
  const plannedSpin =
    planned &&
    spinLabel[
      planned.tipY > 0.05 ? "follow" : planned.tipY < -0.05 ? "draw" : "center"
    ];
  const showShot = (i: number) => {
    setPick(undefined);
    setShotAt((v) => ({ drillId: drill.id, i, rev: (v?.rev ?? 0) + 1 }));
  };
  const stepShot = (by: number) => showShot(shown + by);
  const runResults = run?.drillId === drill.id ? run.results : [];
  const runShot = drill.shots?.[runResults.length];
  // Trượt hoặc xong cú cuối thì khép run vào progress; còn không thì card sang cú kế.
  const logShot = (r: ShotResult) => {
    const results = [...runResults, r];
    if (!r.pot || results.length === drill.shots?.length) {
      recordRun(drill, results);
      setRun(undefined);
      showShot(0);
    } else {
      setRun({ drillId: drill.id, results });
      showShot(results.length);
    }
  };
  const lastRun = useLastRun(drill);
  const shot = planned
    ? { tipX: 0, tipY: planned.tipY, speed: planned.speed }
    : target?.found
      ? {
          tipX: target.tipX ?? 0,
          tipY: target.tipY ?? 0,
          speed: target.speed ?? 0,
        }
      : multi
        ? undefined
        : {
            tipX: drill.recommendedContactPoint.x,
            tipY: drill.recommendedContactPoint.y,
            speed: speedMs[drill.recommendedSpeed],
          };
  const targetNote =
    !target || target.runout
      ? undefined
      : !target.found
        ? `Target ${target.label}: no clean shot from here.`
        : `Target ${target.label}: ${
            target.inZone
              ? `cue ball stops ${Math.round(target.miss ?? 0)}" from center.`
              : `out of reach from this spot. Closest shot stops ${Math.round(target.miss ?? 0)}" off.`
          }`;
  const required = drill.passCondition.required;
  const finished = !progress.started && done === total;
  // Chỉ lượt đủ số cú mới so được với nhau; lượt bỏ dở hay đang chạy không tính.
  const history = useSessionHistory(drill.id).filter(
    (h) => h.attempts.length >= total,
  );
  const pct = (n: number) => Math.round((100 * n) / total);
  const last = history[0];
  const prev = history[1];
  const lastLine =
    last &&
    [
      `Last ${last.passes}/${total}`,
      `${pct(last.passes)}%`,
      last.passes >= required ? "Passed" : "Not passed",
      prev &&
        `${last.passes >= prev.passes ? "+" : ""}${pct(last.passes) - pct(prev.passes)} pts vs previous`,
    ]
      .filter(Boolean)
      .join(" · ");
  const day = (at: number) =>
    new Date(at).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });
  const unit = drill.shots ? "Run" : "Shot";
  const caption = progress.started
    ? `${round ? `${round.title} · ` : ""}${unit} ${Math.min(done + 1, total)} of ${total}`
    : finished
      ? "Last session"
      : `${total} ${unit.toLowerCase()}s`;

  // Prev/Next đổi param tại chỗ: bàn native giữ nguyên, chỉ data drill đổi.
  const go = (n: number) => {
    setShotAt(undefined);
    setRun(undefined);
    router.setParams({ id: String(n), d: undefined });
  };

  // Native chỉ nạp lại bàn khi `rev` đổi, nên round dời bi cái phải có `rev` riêng.
  const baseStage = stageState(drill, level?.diamonds ?? 0);
  const stage = round?.cueBall
    ? { ...baseStage, rev: baseStage.rev * 10 + roundIndex }
    : baseStage;

  const stageWidth = (width ?? windowWidth) - 2 * gutter;
  const stageHeight = stageHeightFor(stageWidth);

  const table = legacyTable ? (
    <View
      style={[
        s.tableCard,
        homeSurfaces.graphiteTile,
        landscape && s.tableCardLandscape,
      ]}
    >
      <PoolTableView
        style={[
          landscape ? s.flex : s.tablePortrait,
          width ? { width, alignSelf: "center" } : null,
        ]}
        drill={tableDrill}
        showGeometry={debug === "1"}
        showGuide={guide !== "0"}
        {...guides}
        devMode={devMode}
        onBallMove={onBallMove}
      />
    </View>
  ) : (
    // Khối bàn của Soạn bài: bàn dọc bên trái, Ngắm và Dày mỏng bên phải, chạm ô là nở ra.
    <PoolEditorView
      style={landscape ? s.flex : { width: stageWidth, height: stageHeight }}
      stageOnly
      state={stage}
      drill={drill}
      {...guides}
      playRev={playRev}
      shotIndex={shotIndex}
      shotRev={shotAt?.rev ?? 0}
      onTargetPick={({ nativeEvent: shot }) => {
        // Drill có `shots`: Play đánh một cú, vào sạch thì card và bàn sang cú kế, chờ bấm Play tiếp.
        if (shot.ended) {
          const next = (shot.shot ?? -1) + 1;
          if (shot.ok && drill.shots && next > 0 && next < drill.shots.length) showShot(next);
          return;
        }
        setPick({ drillId: drill.id, shot });
      }}
    />
  );

  const panel = (
    <>
      <View style={s.heading}>
        <AppText variant="eyebrow" color="textTertiary" style={s.eyebrow}>
          {area.title}
          {program.includes(base) &&
            ` · ${pad(program.indexOf(base) + 1)}/${pad(program.length)}`}
          {level &&
            ` · ${level.diamonds} diamond${level.diamonds > 1 ? "s" : ""}`}
        </AppText>
        <AppText variant="heroTitle" accessibilityRole="header" style={s.title}>
          {drill.title}
        </AppText>
      </View>

      <View style={s.copy}>
        <AppText variant="tileTitle" style={s.title}>
          {drill.objective}
        </AppText>
        <AppText variant="callout" style={s.body}>
          {drill.subtitle}
        </AppText>
        {drill.steps && (
          <AppText variant="monoSmall" color="textTertiary">
            {drill.steps
              .map((step) => `${step.label} ${step.caption}`)
              .join("  ·  ")}
          </AppText>
        )}
      </View>

      <ShotCard
        title={
          planned && drill.shots
            ? `Shot ${shown + 1}/${drill.shots.length} · ${plannedSpin}`
            : target?.found
              ? `Shot → ${target.label}`
              : multi
                ? "Shot"
                : `Shot · ${spinLabel[drill.recommendedSpin]}`
        }
        shot={shot}
        pass={`${required} of ${total}`}
      />
      {/* K/45: số mẫu đạt khi lực lệch ±10% và đầu cơ lệch ±0.1, harness `scripts/position-harness/`. */}
      {planned && (
        <View style={s.copy}>
          <AppText variant="callout" style={s.body}>
            {planned.why}
          </AppText>
          <AppText variant="monoSmall" color="textTertiary">
            {planned.zone === undefined
              ? `${planned.rate}/45 potted`
              : `${planned.rate}/45 in zone ${drill.cueBallTargetZones[planned.zone]?.label ?? planned.zone + 1}`}
            {" · pace ±10%, tip ±0.1"}
          </AppText>
        </View>
      )}
      {/* Chạy đúng cú ô Shot đang hiện. Drill nhiều đích chưa chọn đích thì chưa có cú để chạy. */}
      {shot && !legacyTable && (
        <GraphiteAction
          sheen
          title="Play shot"
          icon="play.fill"
          onPress={() => setPlayRev((n) => n + 1)}
        />
      )}
      {drill.shots && !legacyTable && (
        <View style={s.row}>
          <View style={s.flex}>
            <SecondaryButton
              title="Previous shot"
              icon="chevron.left"
              size="medium"
              disabled={shown === 0}
              onPress={() => stepShot(-1)}
            />
          </View>
          <View style={s.flex}>
            <SecondaryButton
              title="Next shot"
              icon="chevron.right"
              iconPosition="trailing"
              size="medium"
              disabled={shown >= drill.shots.length - 1}
              onPress={() => stepShot(1)}
            />
          </View>
        </View>
      )}
      {targetNote && (
        <AppText variant="monoSmall" color="textTertiary">
          {targetNote}
        </AppText>
      )}

      <GuideToggles
        items={GUIDES}
        value={guides}
        onToggle={(k) => setGuides((v) => ({ ...v, [k]: !v[k] }))}
      />

      {devMode && (
        <SecondaryButton
          title="Copy JSON"
          icon="doc.on.doc"
          size="medium"
          fullWidth
          onPress={copyJson}
        />
      )}

      <Scoreboard
        attempts={progress.attempts}
        total={total}
        passed={passes(progress)}
        required={required}
        // Theo lượt đang hiện, không theo `best`: lượt cuối trượt mà vẫn ghi Passed là nói ngược dòng Last bên dưới.
        isPassed={passes(progress) >= required}
        caption={caption}
      />
      {lastRun && (
        <AppText variant="callout" style={s.body}>
          {`Last run · Pot ${lastRun.pots}/${lastRun.shots} · Position ${lastRun.positions}/${lastRun.zones} · ${lastRun.runout ? "Runout" : "No runout"}`}
        </AppText>
      )}
      {lastLine && (
        <View style={s.copy}>
          <AppText variant="callout" style={s.body}>
            {lastLine}
          </AppText>
          {history.length > 1 && (
            <AppText variant="monoSmall" color="textTertiary">
              {history
                .slice(0, 5)
                .map((h) => `${day(h.at)} ${h.passes}/${total}`)
                .join("  ·  ")}
            </AppText>
          )}
        </View>
      )}

      {progress.started && runShot?.zone !== undefined ? (
        // Cú có zone ghi thêm bi cái có dừng trong zone không.
        <>
          <GoldAction
            title="Pot + zone"
            icon="scope"
            haptic="light"
            onPress={() => logShot({ pot: true, position: true })}
          />
          <View style={s.row}>
            <GraphiteAction
              title="Pot"
              icon="checkmark"
              style={s.flex}
              onPress={() => logShot({ pot: true, position: false })}
            />
            <GraphiteAction
              title="Miss"
              icon="xmark"
              style={s.flex}
              onPress={() => logShot({ pot: false, position: false })}
            />
          </View>
        </>
      ) : progress.started && runShot ? (
        <View style={s.row}>
          <GoldAction
            title="Pot"
            icon="checkmark"
            haptic="light"
            style={s.flex}
            onPress={() => logShot({ pot: true })}
          />
          <GraphiteAction
            title="Miss"
            icon="xmark"
            style={s.flex}
            onPress={() => logShot({ pot: false })}
          />
        </View>
      ) : progress.started ? (
        <View style={s.row}>
          <GoldAction
            title="Pass"
            icon="checkmark"
            haptic="light"
            style={s.flex}
            onPress={() => recordAttempt(drill, "pass")}
          />
          <GraphiteAction
            title="Miss"
            icon="xmark"
            style={s.flex}
            onPress={() => recordAttempt(drill, "fail")}
          />
        </View>
      ) : (
        <GoldAction
          title={finished ? "Go again" : "Start drill"}
          icon="play.fill"
          haptic="medium"
          onPress={() => {
            setRun(undefined);
            startDrill(drill.id);
          }}
        />
      )}
      {/* Bấm nhầm Pass/Miss: huỷ cú vừa ghi, kể cả cú cuối vừa khép lượt. Giữa run thì huỷ cú trong run. */}
      {(progress.started || finished) && (done > 0 || runResults.length > 0) && (
        <SecondaryButton
          title="Undo last shot"
          icon="arrow.uturn.backward"
          size="medium"
          fullWidth
          onPress={() => {
            if (runResults.length === 0) return undoAttempt(drill);
            setRun({ drillId: drill.id, results: runResults.slice(0, -1) });
            showShot(runResults.length - 1);
          }}
        />
      )}

      {/* Mẹo nằm dưới cùng để không đẩy Pass/Miss xuống khi bật info. */}
      {showInfo && (
        <View style={[s.info, homeSurfaces.quickTile]}>
          {drill.allowedRails > 0 && (
            <AppText variant="label" color="textTertiary">
              {drill.allowedRails} rail allowed
            </AppText>
          )}
          {drill.tips.map((tip) => (
            <AppText key={tip} variant="callout" style={s.body}>
              {tip}
            </AppText>
          ))}
          {drill.mistakes && (
            <>
              <AppText variant="label" color="textTertiary">
                Common mistakes
              </AppText>
              {drill.mistakes.map((m) => (
                <AppText key={m} variant="callout" style={s.body}>
                  {m}
                </AppText>
              ))}
            </>
          )}
        </View>
      )}

      <FooterNav
        canPrev={drill.number > 1}
        canNext={drill.number < DRILLS.length}
        onPrev={() => go(drill.number - 1)}
        onReset={() => {
          setRun(undefined);
          resetDrill(drill.id);
        }}
        onNext={() => go(drill.number + 1)}
      />
    </>
  );

  return (
    <View
      style={[
        s.root,
        landscape && s.rootLandscape,
        landscape && { paddingHorizontal: gutter },
      ]}
    >
      <Stack.Screen
        options={{
          // Tên drill nằm trong nội dung, thanh trên chỉ giữ back và info.
          title: "",
          headerLargeTitleEnabled: false,
          headerRight: () => (
            <IconButton
              icon={showInfo ? "info.circle.fill" : "info.circle"}
              variant="plain"
              selected={showInfo}
              accessibilityLabel="Drill tips"
              onPress={() => setShowInfo((v) => !v)}
            />
          ),
        }}
      />

      {landscape ? (
        <>
          <View style={[s.flex, s.tableColumn]}>{table}</View>
          <ScrollView
            style={s.panelLandscape}
            contentContainerStyle={s.panel}
            showsVerticalScrollIndicator={false}
          >
            {panel}
          </ScrollView>
        </>
      ) : (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={[
            s.panel,
            { paddingHorizontal: gutter, paddingBottom: insets.bottom + 16 },
          ]}
        >
          {table}
          {panel}
        </ScrollView>
      )}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  root: { flex: 1, backgroundColor: t.color.backgroundPrimary },
  rootLandscape: {
    flexDirection: "row",
    gap: t.space.md,
    paddingBottom: t.space.md,
  },
  flex: { flex: 1 },
  tableCard: { borderRadius: 24, borderCurve: "continuous", padding: 8 },
  tableCardLandscape: { flex: 1 },
  tablePortrait: { width: "100%", aspectRatio: TABLE_ASPECT },
  tableColumn: { gap: t.space.sm },
  panel: { gap: t.space.md },
  panelLandscape: { width: 340, flexGrow: 0 },
  heading: { gap: 2, marginTop: t.space.xs },
  eyebrow: { letterSpacing: 1.2 },
  title: { color: homeSurfaces.ink.title },
  body: { color: homeSurfaces.ink.body },
  copy: { gap: t.space.xxs },
  info: {
    gap: t.space.xs,
    borderRadius: 20,
    borderCurve: "continuous",
    padding: 16,
  },
  row: { flexDirection: "row", gap: 10 },
}));
