import { Stack } from "expo-router";
import { useState } from "react";
import { Linking, View } from "react-native";

import {
  AppSegmentedControl,
  AppText,
  GhostButton,
  makeStyles,
  Scoreboard,
  Screen,
  Section,
} from "@/design-system";

import {
  PoseCoachView,
  type PoseFault,
  type PoseStatus,
  type PoseStroke,
  type PoseVoiceMode,
} from "../../modules/pool-table";

const VERDICT: Record<PoseFault, string> = {
  good: "Good stroke",
  forearmForward: "Forearm forward at contact",
  forearmBack: "Forearm back at contact",
  elbow: "Elbow moved before contact",
  head: "Head came up",
  pause: "No pause at the back",
};

const signed = (n: number) => `${n > 0 ? "+" : ""}${Math.round(n)}°`;

function statusLine(st: PoseStatus | null): string {
  if (!st) return "Starting camera…";
  const arm = st.forearm === undefined ? "" : ` · forearm ${signed(st.forearm)}`;
  switch (st.state) {
    case "denied":
      return "Camera access is off.";
    case "unavailable":
      return "No back camera on this device.";
    case "searching":
      return "Looking for your cue arm. Whole body side-on in frame.";
    case "tilted":
      return `Phone tilted ${st.tilt}°. Stand it upright.`;
    case "ready":
      return `Arm found. Get down on the shot${arm}.`;
    case "address":
      return `Address${arm}`;
    case "stroke":
      return `Stroke${arm}`;
  }
}

/**
 * Soi tư thế từ bên hông: camera sau đặt phía tay cơ, Vision bắt vai, khuỷu, cổ tay, báo bằng tiếng sau mỗi cú.
 * Ngưỡng là tạm, chưa hiệu chuẩn trên clip thật (`modules/pool-table/ios/Pose/PoseStroke.swift`).
 */
export default function StanceScreen() {
  const s = useStyles();
  const [hand, setHand] = useState<"right" | "left">("right");
  const [voice, setVoice] = useState<PoseVoiceMode>("vi");
  const [status, setStatus] = useState<PoseStatus | null>(null);
  const [strokes, setStrokes] = useState<PoseStroke[]>([]);
  const last = strokes.at(-1);
  const good = strokes.filter((r) => r.fault === "good").length;

  return (
    <Screen gap="xl">
      <Stack.Screen options={{ title: "Stance Check" }} />

      <View style={s.camera}>
        <PoseCoachView
          style={s.fill}
          hand={hand}
          voice={voice}
          onStatus={(e) => setStatus(e.nativeEvent)}
          onStroke={(e) => setStrokes((list) => [...list, e.nativeEvent])}
        />
      </View>
      <View style={s.status}>
        <AppText variant="callout" color="textSecondary">
          {statusLine(status)}
        </AppText>
        {status?.state === "denied" && (
          <GhostButton title="Open Settings" icon="gearshape" onPress={() => Linking.openSettings()} />
        )}
      </View>

      <Scoreboard
        label="Strokes"
        value={strokes.length}
        pad={2}
        caption={last ? `${good} good · ${VERDICT[last.fault]}` : "Waiting for a stroke"}
        stats={
          last && [
            { label: "Forearm", value: Math.round(last.forearmContact), suffix: "°" },
            { label: "Elbow", value: Math.round(last.elbowDrift), suffix: "°" },
            { label: "Head", value: Math.round(last.headLift ?? 0), suffix: "cm" },
            { label: "Pause", value: Number(last.backPause.toFixed(1)), suffix: "s" },
          ]
        }
      />

      <Section title="Setup" gap="md">
        <AppSegmentedControl
          segments={[
            { value: "right", label: "Right hand" },
            { value: "left", label: "Left hand" },
          ]}
          value={hand}
          onChange={(v) => {
            setHand(v);
            setStrokes([]);
          }}
          accessibilityLabel="Cue hand"
        />
        <AppSegmentedControl
          segments={[
            { value: "vi", label: "Tiếng Việt" },
            { value: "en", label: "English" },
            { value: "beep", label: "Beep" },
            { value: "off", label: "Off" },
          ]}
          value={voice}
          onChange={setVoice}
          accessibilityLabel="Feedback"
        />
      </Section>

      <Section title="Phone placement">
        <Tip>Stand the phone upright on a tripod, on your cue-arm side, level with your elbow.</Tip>
        <Tip>2–3 m away, square to the line of the shot, so the cue runs left to right across the frame.</Tip>
        <Tip>Keep your whole body in frame. Dark clothes on a dark wall make the arm hard to see.</Tip>
      </Section>

      <Section title="What it checks" caption="Thresholds are a first guess, not calibrated yet.">
        <Tip>Forearm hangs vertical at address and at contact, within 10°. Nolan, EBSA.</Tip>
        <Tip>Upper arm still until the cue hits the ball, within 6°. The elbow may drop after. Dr. Dave Alciatore.</Tip>
        <Tip>Head stays down through contact, under 3 cm of lift.</Tip>
        <Tip>A pause at the back of the backswing, at least 0.2 s.</Tip>
      </Section>
    </Screen>
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
  camera: {
    aspectRatio: 3 / 4,
    borderRadius: t.radius.xLarge,
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: "#000",
  },
  fill: { flex: 1 },
  status: { gap: t.space.sm, marginTop: -t.space.md },
}));
