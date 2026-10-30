import * as Clipboard from "expo-clipboard";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
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
  bankTarget,
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
  drillScore,
  passLabel,
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

type GuideKey = "showGhostBall" | "showTangentLine" | "showCuePath";
const GUIDES: { key: GuideKey; label: string }[] = [
  { key: "showGhostBall", label: "Ghost" },
  { key: "showTangentLine", label: "Tangent" },
  { key: "showCuePath", label: "Path" },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Solver vùng đích chỉ giải cú pot một bi: các bài này không nhận target. Play của chúng do `DrillShotPlanner` lo. */
const NO_PLAN: readonly PoolDrill["skill"][] = ["bank", "break", "combo", "safety", "kick", "jump", "masse", "test"];

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
  const overRank = useNavigation()
    .getState()
    ?.routes.some((r) => r.name === "rank/[id]");
  const devMode = __DEV__ && dev === "1";
  // Bàn ngang cũ chỉ còn cho công cụ dev: kéo bi, lưới hình học, tắt guide.
  const legacyTable = devMode || debug === "1" || guide === "0";
  const [guides, setGuides] = useState<Record<GuideKey, boolean>>({
    showGhostBall: true,
    showTangentLine: true,
    showCuePath: true,
  });
  const [pick, setPick] = useState<{ drillId: string; shot: TargetPick }>();
  const [playRev, setPlayRev] = useState(0);
  // Cú native giải một lần mỗi lần dựng bàn, gắn với `rev` của bàn đó.
  const [plan, setPlan] = useState<{ drillId: string; rev: number; tipX: number; tipY: number; speed: number }>();
  // Drill có `shots`: cú đang xem và số lần bấm cú trước/cú sau, để native dựng lại bàn kể cả khi chỉ số không đổi.
  const [shotAt, setShotAt] = useState<{
    drillId: string;
    i: number;
    rev: number;
  }>();
  // Drill pattern mà mỗi round là một cú: round đang đứng, kèm chỗ bi cái engine dừng sau cú trước để bàn nối từ đó.
  // Chưa đặt thì round theo số lượt, mở lại drill vẫn tiếp đúng bi.
  const [roundAt, setRoundAt] = useState<{ drillId: string; i: number; cue?: { x: number; y: number } }>();
  // Play một cú vừa trượt: báo ở dòng note, Play lại hay đổi round thì xoá.
  const [missAt, setMissAt] = useState<{ drillId: string; i: number; note: string }>();
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
  const roundIndex = !rounds
    ? 0
    : roundAt?.drillId === leveled.id
      ? Math.min(roundAt.i, rounds.length - 1)
      : Math.min(Math.floor(done / (total / rounds.length)), rounds.length - 1);
  const round = rounds?.[roundIndex];
  // Thang góc cắt, bank nhiều vị trí: round đè chỗ bi, guide, điểm đặt cơ; bàn và guide đọc theo round.
  const roundMovesTable = !!(round?.cueBall || round?.objectBalls || round?.guideLines);
  const drill =
    round && (roundMovesTable || round.contactPoint)
      ? {
          ...leveled,
          cueBall:
            (roundAt?.drillId === leveled.id && roundAt.i === roundIndex && roundAt.cue) ||
            (round.cueBall ?? leveled.cueBall),
          objectBalls: round.objectBalls ?? leveled.objectBalls,
          guideLines: round.guideLines ?? leveled.guideLines,
          // Round mỗi cú một lỗ (drill 31): Play ngắm đúng lỗ guide của round, không lấy lỗ chung của drill.
          targetPocket:
            round.guideLines?.flatMap((g) => (g.kind === "objectBallPath" ? [g.pocket] : []))[0] ??
            leveled.targetPocket,
          recommendedContactPoint: round.contactPoint ?? leveled.recommendedContactPoint,
          // Round dời bàn có zone riêng thì chỉ hiện zone đó, Play không phải chọn đích.
          cueBallTargetZones:
            roundMovesTable && round.zone !== undefined
              ? leveled.cueBallTargetZones.slice(round.zone, round.zone + 1)
              : leveled.cueBallTargetZones,
          zoneMarks: roundMovesTable && round.zone !== undefined ? leveled.cueBallTargetZones : [],
          // Drill 31: Play diễn lại đường bi cái của video thay cho engine.
          replay: round.replay,
        }
      : leveled;
  const area = areaOf(drill);
  const program = drillsIn(area.id);
  // Prev/Next đi trong nhóm, khớp số 01…N trên tab Drills.
  const slot = program.indexOf(base);

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
  // Drill break, safety, kick… không có cú giải tới zone nên không nhận target.
  const target =
    pick?.drillId === drill.id && pick.shot.label && !NO_PLAN.includes(drill.skill)
      ? pick.shot
      : undefined;
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
  const patternRounds = drill.skill === "pattern" ? rounds : undefined;
  const goRound = (i: number, cue?: { x: number; y: number }) => {
    setMissAt(undefined);
    setRoundAt({ drillId: drill.id, i, cue });
  };
  // Cú trước/cú sau: drill `shots` đi trong `shots`, drill pattern đi trong round và dựng bàn từ `cueBall` của round.
  // Drill round dời bàn (thang zone như 136): mỗi round là một cú riêng, Play và nút cú trước/sau đi qua từng round.
  const tableRounds = !patternRounds && roundMovesTable ? rounds : undefined;
  const step = patternRounds ?? tableRounds
    ? { at: roundIndex, last: (patternRounds ?? tableRounds)!.length - 1, go: (by: number) => goRound(roundIndex + by) }
    : drill.shots
      ? { at: shown, last: drill.shots.length - 1, go: stepShot }
      : undefined;
  const missNote = missAt?.drillId === drill.id && missAt.i === roundIndex ? missAt.note : undefined;
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
  // Native chỉ nạp lại bàn khi `rev` đổi, nên round dời bi, đổi guide hay đổi tip phải có `rev` riêng.
  const baseStage = stageState(drill, level?.diamonds ?? 0);
  const bank = bankTarget(drill);
  const stage = roundMovesTable || round?.contactPoint || round?.speed != null
    ? { ...baseStage, rev: baseStage.rev * 10 + roundIndex, speed: round?.playSpeed ?? round?.speed ?? baseStage.speed }
    : baseStage;

  // Cú native đã giải cho bàn đang dựng: thẻ ghi đúng phê và lực Play sẽ đánh, không phải số trong data.
  const solved = plan?.drillId === drill.id && plan.rev === stage.rev ? plan : undefined;
  const shot = planned
    ? { tipX: planned.tipX ?? 0, tipY: planned.tipY, speed: planned.speed }
    : target?.found
      ? {
          tipX: target.tipX ?? 0,
          tipY: target.tipY ?? 0,
          speed: target.speed ?? 0,
        }
      : multi
        ? undefined
        : solved
          ? { tipX: solved.tipX, tipY: solved.tipY, speed: solved.speed }
          : {
            tipX: drill.recommendedContactPoint.x,
            tipY: drill.recommendedContactPoint.y,
            speed: round?.speed ?? speedMs[drill.recommendedSpeed],
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
      drillScore(drill, last.attempts) >= required ? "Passed" : "Not passed",
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
      drill={bank ? { ...drill, targetPocket: bank } : drill}
      {...guides}
      playRev={playRev}
      shotIndex={shotIndex}
      shotRev={shotAt?.rev ?? 0}
      onTargetPick={({ nativeEvent: shot }) => {
        // Drill có `shots`, hay drill pattern mà mỗi round là một cú: Play đánh một cú, vào sạch thì card và bàn sang
        // cú kế, bi cái đứng chỗ engine dừng, chờ bấm Play tiếp. Ghi Pass/Miss thì round lại theo số lượt.
        if (shot.ended) {
          const next = (shot.shot ?? -1) + 1;
          if (shot.ok && drill.shots && next > 0 && next < drill.shots.length) showShot(next);
          if (shot.ok && patternRounds && roundIndex < patternRounds.length - 1)
            goRound(
              roundIndex + 1,
              shot.cueX !== undefined && shot.cueY !== undefined ? { x: shot.cueX, y: shot.cueY } : undefined,
            );
          // Round dời bàn đứng riêng: vào sạch thì sang round kế, hết round quay về round đầu, bi cái đặt lại chỗ cũ.
          if (shot.ok && tableRounds) goRound((roundIndex + 1) % tableRounds.length);
          // Play một cú trượt: báo lý do, bàn giữ thế cũ để Play lại.
          // Bài chỉ đánh bi cái (`aimBall` -1) thì trượt là bi cái không tới đích, không có bi nào để gọi tên.
          if (!shot.ok && shot.shot === -1) {
            const ball = stage.aimBall >= 0 ? `Ball ${stage.aimBall}` : undefined;
            setMissAt({
              drillId: drill.id,
              i: roundIndex,
              note: shot.blocked
                ? ball ? `No clean shot on ${ball}.` : "No clean shot."
                : `${shot.scratch ? "Cue ball scratched" : ball ? `Missed ${ball}` : "Cue ball missed the target"} · Play to retry.`,
            });
          }
          return;
        }
        if (shot.plan) {
          setPlan({ drillId: drill.id, rev: stage.rev, tipX: shot.tipX ?? 0, tipY: shot.tipY ?? 0, speed: shot.speed ?? 0 });
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
            ? `Shot ${shown + 1}/${drill.shots.length} ${drill.skill === "railCut" ? `→ Ball ${planned.ball}` : `· ${plannedSpin}`}`
            : target?.found
              ? `Shot → ${target.label}`
              : round && rounds
                ? `Shot ${roundIndex + 1}/${rounds.length} · ${round.spin === "center" && round.contactPoint?.x ? "English" : spinLabel[round.spin]}`
                : multi
                  ? "Shot"
                  : `Shot · ${spinLabel[drill.recommendedSpin]}`
        }
        shot={shot}
        pass={drill.passCondition.kind === "roundQuota" ? passLabel(drill) : `${required} of ${total}`}
      />
      {/* K/45: số mẫu đạt khi lực lệch ±10% và đầu cơ lệch ±0.1, harness `scripts/position-harness/`. Round không có rate. */}
      {(planned || round?.why) && (
        <View style={s.copy}>
          <AppText variant="callout" style={s.body}>
            {planned?.why ?? round?.why}
          </AppText>
          {planned && (
            <AppText variant="monoSmall" color="textTertiary">
              {planned.zone === undefined
                ? `${planned.rate}/45 potted`
                : `${planned.rate}/45 in zone ${drill.cueBallTargetZones[planned.zone]?.label ?? planned.zone + 1}`}
              {" · pace ±10%, tip ±0.1"}
            </AppText>
          )}
        </View>
      )}
      {/* Mọi drill có Play, chạy đúng cú ô Shot đang hiện. Drill nhiều đích chưa chọn đích thì chưa có cú để chạy.
          Bank, kick, combo, safety, break, nhảy, massé, test: native `DrillShotPlanner` dò cú theo guide của drill.
          Phê ngang chạy engine có squirt, chưa có swerve. */}
      {shot &&
        !legacyTable && (
        <GraphiteAction
          sheen
          title="Play shot"
          icon="play.fill"
          onPress={() => {
            setMissAt(undefined);
            setPlayRev((n) => n + 1);
          }}
        />
      )}
      {step && !legacyTable && (
        <View style={s.row}>
          <View style={s.flex}>
            <SecondaryButton
              title="Previous shot"
              icon="chevron.left"
              size="medium"
              disabled={step.at === 0}
              onPress={() => step.go(-1)}
            />
          </View>
          <View style={s.flex}>
            <SecondaryButton
              title="Next shot"
              icon="chevron.right"
              iconPosition="trailing"
              size="medium"
              disabled={step.at >= step.last}
              onPress={() => step.go(1)}
            />
          </View>
        </View>
      )}
      {(missNote ?? targetNote) && (
        <AppText variant="monoSmall" color="textTertiary">
          {missNote ?? targetNote}
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
        passed={drillScore(drill, progress.attempts)}
        required={required}
        // Theo lượt đang hiện, không theo `best`: lượt cuối trượt mà vẫn ghi Passed là nói ngược dòng Last bên dưới.
        isPassed={drillScore(drill, progress.attempts) >= required}
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
            onPress={() => {
              recordAttempt(drill, "pass");
              if (patternRounds) goRound(Math.min(roundIndex + 1, patternRounds.length - 1));
              if (tableRounds) setRoundAt(undefined);
            }}
          />
          <GraphiteAction
            title="Miss"
            icon="xmark"
            style={s.flex}
            onPress={() => {
              recordAttempt(drill, "fail");
              if (patternRounds) goRound(Math.min(roundIndex + 1, patternRounds.length - 1));
              if (tableRounds) setRoundAt(undefined);
            }}
          />
        </View>
      ) : (
        <GoldAction
          title={finished ? "Go again" : "Start drill"}
          icon="play.fill"
          haptic="medium"
          onPress={() => {
            setRun(undefined);
            setRoundAt(undefined);
            setMissAt(undefined);
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
            if (runResults.length === 0) {
              if (patternRounds) goRound(Math.max(roundIndex - 1, 0));
              if (tableRounds) setRoundAt(undefined);
              return undoAttempt(drill);
            }
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
        canPrev={slot > 0}
        canNext={slot >= 0 && slot < program.length - 1}
        onPrev={() => go(program[slot - 1].number)}
        onReset={() => {
          setRun(undefined);
          resetDrill(drill.id);
        }}
        onNext={() => go(program[slot + 1].number)}
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
          // Màn sau trang hạng (transparentModal) bị trình bày dạng modal nên mất nút back gốc.
          headerLeft: overRank
            ? () => (
                <IconButton
                  icon="chevron.left"
                  variant="plain"
                  accessibilityLabel="Back"
                  onPress={() => router.back()}
                />
              )
            : undefined,
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
