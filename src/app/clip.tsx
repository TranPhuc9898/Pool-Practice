import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import {
  AppSegmentedControl,
  AppText,
  DestructiveButton,
  GhostButton,
  makeStyles,
  PrimaryButton,
  Screen,
  Section,
  SecondaryButton,
  SelectChip,
} from "@/design-system";
import { evaluate, formatMetric, METRICS, type MetricKey, sessionMedians } from "@/pool-engine/clip-feedback";
import {
  type ClipSession,
  deleteClipSession,
  type Discipline,
  newClipSessionId,
  saveClipSession,
  setClipBaseline,
  useClipSessions,
} from "@/pool-engine/clip-log";

import {
  type ClipAnalyzed,
  type ClipAxis,
  type ClipFrame,
  type ClipInfo,
  type ClipPhase,
  type ClipStroke,
  PoseClipView,
  PoseTrendView,
} from "../../modules/pool-table";

const px = (n?: number) => (n === undefined ? "–" : `${n > 0 ? "+" : ""}${Math.round(n)} px`);
const deg = (n?: number) => (n === undefined ? "–" : `${n > 0 ? "+" : ""}${n.toFixed(1)}°`);
const forearms = (n?: number) => (n === undefined ? "" : ` · ${n > 0 ? "+" : ""}${n.toFixed(2)} L`);

const PHASE: Record<ClipPhase, string> = {
  unknown: "Unknown",
  address: "Address",
  practice: "Practice stroke",
  backswing: "Backswing",
  pause: "Pause",
  forward: "Forward stroke",
  follow: "Follow-through",
  complete: "Shot complete",
};

/**
 * Phân tích clip quay từ sau lưng: chọn video, Vision chạy nền trên từng khung, chấm trục cơ bằng hai lần chạm, xem
 * lệch của cổ tay và khuỷu so với trục đó từng khung. Số đo trên ảnh 2D, không phải mm.
 */
export default function ClipScreen() {
  const s = useStyles();
  const [uri, setUri] = useState<string | null>(null);
  const [hand, setHand] = useState<"right" | "left">("right");
  const [info, setInfo] = useState<ClipInfo | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [analyzed, setAnalyzed] = useState<ClipAnalyzed | null>(null);
  const [marking, setMarking] = useState(false);
  const [axes, setAxes] = useState<ClipAxis[]>([]);
  const [lastDeviation, setLastDeviation] = useState<number | undefined>();
  const [frame, setFrame] = useState<ClipFrame | null>(null);
  const [strokes, setStrokes] = useState<ClipStroke[]>([]);
  const [discipline, setDiscipline] = useState<Discipline>("nine-ball");
  const [sessionId, setSessionId] = useState(newClipSessionId);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const [trend, setTrend] = useState<MetricKey>("backWristL");
  const sessions = useClipSessions();
  const baseline = sessions.find((x) => x.baseline);
  const saved = sessions.find((x) => x.id === sessionId);
  const feedback = evaluate(baseline?.strokes, strokes);

  const save = () => {
    if (!uri || analyzed?.frames === undefined) return;
    try {
      saveClipSession({
        id: sessionId,
        clipUri: uri,
        hand,
        discipline,
        frames: analyzed.frames,
        armRatio: analyzed.armRatio ?? 0,
        strokes,
      });
      setSaveError(null);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : String(e));
    }
  };

  const pick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      videoExportPreset: ImagePicker.VideoExportPreset.Passthrough,
      preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Current,
    });
    const asset = res.canceled ? undefined : res.assets[0];
    if (!asset) return;
    setUri(asset.uri);
    setInfo(null);
    setProgress(0);
    setAnalyzed(null);
    setAxes([]);
    setLastDeviation(undefined);
    setFrame(null);
    setStrokes([]);
    setSessionId(newClipSessionId());
    setSaveError(null);
  };

  const reanalyze = (v: "right" | "left") => {
    setHand(v);
    if (uri) {
      setProgress(0);
      setAnalyzed(null);
      setFrame(null);
      setStrokes([]);
    }
  };

  return (
    <Screen gap="xl">
      <Stack.Screen options={{ title: "Clip Analysis" }} />

      {uri ? (
        <View style={s.player}>
          <PoseClipView
            style={s.fill}
            uri={uri}
            hand={hand}
            marking={marking}
            axes={axes}
            onInfo={(e) => setInfo(e.nativeEvent)}
            onProgress={(e) => setProgress(e.nativeEvent.fraction)}
            onAnalyzed={(e) => {
              setAnalyzed(e.nativeEvent);
              setProgress(null);
            }}
            onAxis={(e) => {
              const { deviation, ...axis } = e.nativeEvent;
              setAxes((list) => [...list, axis]);
              setLastDeviation(deviation);
              setMarking(false);
            }}
            onFrame={(e) => setFrame(e.nativeEvent)}
            onStrokes={(e) => setStrokes(e.nativeEvent.strokes)}
          />
        </View>
      ) : (
        <PrimaryButton title="Pick a video" icon="film" onPress={pick} />
      )}

      <View style={s.status}>
        <AppText variant="callout" color="textSecondary">
          {statusLine(uri, info, progress, analyzed)}
        </AppText>
        {uri && <GhostButton title="Pick another video" icon="film" onPress={pick} />}
      </View>

      {uri && (
        <Section title="Cue axis" gap="md" caption="Pause on a frame, then tap two points along the cue.">
          <GhostButton
            title={marking ? "Tap two points on the cue…" : axes.length ? "Mark another axis" : "Mark cue axis"}
            icon="scope"
            onPress={() => setMarking((m) => !m)}
          />
          {axes.length > 0 && (
            <AppText variant="body" color="textSecondary">
              {axes.length === 1
                ? "Reference axis set at " + axes[0].t.toFixed(2) + " s."
                : `${axes.length - 1} more ${axes.length === 2 ? "axis" : "axes"} · last one ${deg(lastDeviation)} from the reference`}
            </AppText>
          )}
          {axes.length > 0 && (
            <GhostButton
              title="Clear axes"
              icon="xmark"
              onPress={() => {
                setAxes([]);
                setLastDeviation(undefined);
                setMarking(false);
              }}
            />
          )}
        </Section>
      )}

      {uri && (
        <Section title="This frame" gap="sm">
          {frame ? (
            <>
              <Row label="Frame" value={`${frame.index + 1} / ${frame.frames} · ${frame.t.toFixed(2)} s`} />
              <Row label="Phase" value={frame.phase ? PHASE[frame.phase] : "–"} />
              <Row label="Wrist to axis" value={px(frame.wrist) + forearms(frame.wristL)} />
              <Row label="Elbow to axis" value={px(frame.elbow) + forearms(frame.elbowL)} />
              <Row label="Forearm to axis" value={deg(frame.forearmToAxis)} />
              <Row label="Forearm length" value={frame.L === undefined ? "–" : `${Math.round(frame.L)} px`} />
              {axes.length > 0 && (
                <>
                  <Row label="Cue vs reference · experimental" value={cueLine(frame)} />
                  <Row label="Cue sideways" value={px(frame.cueOffset)} />
                  {frame.cueLost && (
                    <AppText variant="caption" color="textTertiary">
                      Cue lost. Mark the axis again on this frame.
                    </AppText>
                  )}
                </>
              )}
            </>
          ) : (
            <AppText variant="body" color="textSecondary">
              {analyzed?.frames ? "Play or step the video to see each frame." : "Measurements show once analysis is done."}
            </AppText>
          )}
          {frame && axes.length === 0 && (
            <AppText variant="caption" color="textTertiary">
              Mark the cue axis to measure the arm against it.
            </AppText>
          )}
        </Section>
      )}

      {analyzed?.frames !== undefined && (
        <Section
          title="Strokes"
          gap="sm"
          caption="Found from the phase bar under the video. Tap a segment there to correct its phase."
        >
          {strokes.length === 0 ? (
            <AppText variant="body" color="textSecondary">
              No complete stroke found. Phases need a still address, a backswing and a follow-through.
            </AppText>
          ) : (
            strokes.map((k) => <StrokeRow key={k.n} stroke={k} hasAxis={axes.length > 0} />)
          )}
        </Section>
      )}

      {analyzed?.frames !== undefined && (
        <Section
          title="Results"
          gap="sm"
          caption={
            baseline
              ? `Compared with your baseline from ${new Date(baseline.at).toLocaleDateString()}, last 5 confident strokes.`
              : "Set a saved session as baseline in History to get observations."
          }
        >
          {feedback.map((f) => (
            <View key={f.key} style={s.stroke}>
              <Row label={f.label} value={f.status === "flag" ? "Off baseline" : f.status === "ok" ? "Consistent" : "Inconclusive"} />
              <AppText variant="caption" color="textTertiary">
                {f.text}
              </AppText>
            </View>
          ))}
          <AppText variant="caption" color="textTertiary">
            Measured on the 2D image against your own baseline, not an ideal technique. A flag means a repeated change,
            not a confirmed fault. Cue angles are experimental.
          </AppText>
          <SecondaryButton
            title={saved ? "Update saved session" : "Save session"}
            icon="square.and.arrow.down"
            onPress={save}
            disabled={strokes.length === 0}
          />
          {saveError && (
            <AppText variant="caption" color="textSecondary">
              Could not save. {saveError}
            </AppText>
          )}
        </Section>
      )}

      {sessions.length > 0 && (
        <Section title="History" gap="sm" caption="Tap two sessions to compare their medians.">
          {sessions.map((x) => (
            <SessionRow
              key={x.id}
              session={x}
              selected={compare.includes(x.id)}
              onSelect={() =>
                setCompare((c) => (c.includes(x.id) ? c.filter((id) => id !== x.id) : [...c, x.id].slice(-2)))
              }
            />
          ))}
          {compare.length === 2 && <Compare a={sessions.find((x) => x.id === compare[0])} b={sessions.find((x) => x.id === compare[1])} />}
          {sessions.length > 1 && (
            <>
              <View style={s.chips}>
                {METRICS.map((m) => (
                  <SelectChip key={m.key} label={m.label} selected={trend === m.key} onPress={() => setTrend(m.key)} />
                ))}
              </View>
              <PoseTrendView
                style={s.trend}
                unit={METRICS.find((m) => m.key === trend)!.unit}
                points={sessions.flatMap((x) => {
                  const v = sessionMedians(x.strokes)[trend];
                  return v === undefined ? [] : [{ at: x.at, value: v, baseline: x.baseline }];
                })}
              />
            </>
          )}
        </Section>
      )}

      <Section title="Setup" gap="md">
        <AppSegmentedControl
          segments={[
            { value: "right", label: "Right hand" },
            { value: "left", label: "Left hand" },
          ]}
          value={hand}
          onChange={reanalyze}
          accessibilityLabel="Cue hand"
        />
        <AppSegmentedControl
          segments={[
            { value: "nine-ball", label: "9-Ball" },
            { value: "chinese-eight", label: "Chinese 8-Ball" },
          ]}
          value={discipline}
          onChange={setDiscipline}
          accessibilityLabel="Discipline"
        />
      </Section>

      <Section title="Limits">
        <Tip>Measured on the 2D image, in pixels and multiples of your forearm length. Not millimetres.</Tip>
        <Tip>Positive means right of the axis on screen. Small camera shake is measured on the lower part of the frame and taken out; a moved phone is not.</Tip>
        <Tip>The orange line is the cue found from image edges, starting at the first marked axis. Experimental, not checked against hand labels yet.</Tip>
        <Tip>Phases are detected from the wrist moving on screen. Thresholds are a first guess, not calibrated yet.</Tip>
        <Tip>Behind the player, 2–3 m back, looking down the line of the cue, landscape on a tripod.</Tip>
      </Section>
    </Screen>
  );
}

function statusLine(
  uri: string | null,
  info: ClipInfo | null,
  progress: number | null,
  analyzed: ClipAnalyzed | null,
): string {
  if (!uri) return "Pick a clip filmed from behind, along the cue.";
  if (analyzed?.error) return `Could not read this video. ${analyzed.error}`;
  const head = info
    ? `${Math.round(info.width)}×${Math.round(info.height)} · ${Math.round(info.fps)} fps · ${info.duration.toFixed(1)} s`
    : "Opening video…";
  if (progress !== null) return `${head} · analysing ${Math.round(progress * 100)}%`;
  if (analyzed?.frames !== undefined)
    return (
      `${head} · ${analyzed.frames} frames, arm seen in ${Math.round((analyzed.armRatio ?? 0) * 100)}%` +
      (analyzed.shake === undefined ? "" : ` · shake ${analyzed.shake.toFixed(1)} px`)
    );
  return head;
}

function cueLine(f: ClipFrame): string {
  if (f.cueTracking) return "tracking…";
  if (f.cueDeviation === undefined) return "not found";
  return `${deg(f.cueDeviation)} · confidence ${Math.round((f.cueConfidence ?? 0) * 100)}%`;
}

function StrokeRow({ stroke: k, hasAxis }: { stroke: ClipStroke; hasAxis: boolean }) {
  const s = useStyles();
  const wrist = (v?: number, l?: number) => px(v) + forearms(l);
  return (
    <View style={s.stroke}>
      <Row
        label={`Stroke ${k.n}${k.source === "manual" ? " · corrected" : ""}`}
        value={`${k.start.toFixed(2)}–${k.end.toFixed(2)} s · confidence ${Math.round(k.confidence * 100)}%`}
      />
      <Row label="Pause at the back" value={k.pause === undefined ? "not seen" : `${k.pause.toFixed(2)} s`} />
      {hasAxis ? (
        <>
          <Row label="Wrist at address" value={wrist(k.addressWrist, k.addressWristL)} />
          <Row label="Wrist at backswing end" value={wrist(k.backWrist, k.backWristL)} />
          <Row label="Wrist at follow-through end" value={wrist(k.followWrist, k.followWristL)} />
          {(k.addressCue ?? k.backCue ?? k.followCue) !== undefined && (
            <Row
              label="Cue at address / back / follow"
              value={[k.addressCue, k.backCue, k.followCue].map(deg).join(" / ")}
            />
          )}
          <Row
            label="Elbow sideways range"
            value={k.elbowRange === undefined ? "–" : `${Math.round(k.elbowRange)} px` + forearms(k.elbowRangeL).replace("+", "")}
          />
        </>
      ) : (
        <AppText variant="caption" color="textTertiary">
          Mark the cue axis to measure the wrist and elbow against it.
        </AppText>
      )}
      {k.confidence < 0.6 && (
        <AppText variant="caption" color="textTertiary">
          Low confidence: the arm was hard to see. Treat these numbers as inconclusive.
        </AppText>
      )}
    </View>
  );
}

const DISCIPLINE: Record<Discipline, string> = { "nine-ball": "9-Ball", "chinese-eight": "Chinese 8-Ball" };

function SessionRow({ session: x, selected, onSelect }: { session: ClipSession; selected: boolean; onSelect: () => void }) {
  const s = useStyles();
  return (
    <View style={s.stroke}>
      <Row
        label={`${new Date(x.at).toLocaleString()}${x.baseline ? " · baseline" : ""}`}
        value={`${DISCIPLINE[x.discipline]} · ${x.strokes.length} strokes`}
      />
      <View style={s.chips}>
        <SelectChip label={selected ? "Comparing" : "Compare"} selected={selected} onPress={onSelect} />
        {!x.baseline && <GhostButton size="medium" title="Set as baseline" icon="flag" onPress={() => setClipBaseline(x.id)} />}
        <DestructiveButton size="medium" title="Delete" icon="trash" onPress={() => deleteClipSession(x.id)} />
      </View>
    </View>
  );
}

function Compare({ a, b }: { a?: ClipSession; b?: ClipSession }) {
  const s = useStyles();
  if (!a || !b) return null;
  const [first, second] = a.at < b.at ? [a, b] : [b, a];
  const ma = sessionMedians(first.strokes), mb = sessionMedians(second.strokes);
  return (
    <View style={s.stroke}>
      <AppText variant="caption" color="textTertiary">
        Median per session, older → newer. Only strokes with confidence 60% or more.
      </AppText>
      {METRICS.map((m) => (
        <Row key={m.key} label={m.label} value={`${formatMetric(m.key, ma[m.key])} → ${formatMetric(m.key, mb[m.key])}`} />
      ))}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const s = useStyles();
  return (
    <View style={s.row}>
      <AppText variant="body" color="textSecondary">
        {label}
      </AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

function Tip({ children }: { children: string }) {
  return (
    <AppText variant="body" color="textSecondary">
      {children}
    </AppText>
  );
}

const useStyles = makeStyles((t) => ({
  player: {
    aspectRatio: 3 / 4,
    borderRadius: t.radius.xLarge,
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: "#000",
  },
  fill: { flex: 1 },
  status: { gap: t.space.sm, marginTop: -t.space.md },
  row: { flexDirection: "row", justifyContent: "space-between", gap: t.space.md },
  stroke: { gap: t.space.xs, paddingVertical: t.space.sm },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: t.space.sm, alignItems: "center" },
  trend: { height: 180 },
}));
