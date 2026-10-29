import { router, Stack } from "expo-router";
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
  type PoseStatus,
  type PoseVoiceMode,
} from "../../modules/pool-table";

const signed = (n: number) => `${n > 0 ? "+" : ""}${Math.round(n)}°`;

function statusLine(st: PoseStatus | null, camera: "front" | "back"): string {
  if (!st) return "Starting camera…";
  const arm = st.forearm === undefined ? "" : ` · forearm ${signed(st.forearm)}`;
  switch (st.state) {
    case "denied":
      return "Camera access is off.";
    case "unavailable":
      return `No ${camera} camera on this device.`;
    case "searching":
      return "Looking for your cue arm. Whole body side-on in frame.";
    case "tilted":
      return `Phone tilted ${st.tilt}°. Stand it upright at elbow height.`;
    case "ready":
      return `Arm found. Get down on the shot${arm}.`;
    case "address":
      return `Address${arm}`;
    case "stroke":
      return `Stroke${arm}`;
  }
}

/**
 * Soi tư thế từ bên hông: máy đặt phía tay cơ, camera trước hoặc sau, Vision bắt vai, khuỷu, cổ tay, báo bằng tiếng sau mỗi cú.
 * Ngưỡng là tạm, chưa hiệu chuẩn trên clip thật (`modules/pool-table/ios/Pose/PoseStroke.swift`).
 */
export default function StanceScreen() {
  const s = useStyles();
  const [hand, setHand] = useState<"right" | "left">("right");
  const [camera, setCamera] = useState<"front" | "back">("front");
  const [voice, setVoice] = useState<PoseVoiceMode>("vi");
  const [status, setStatus] = useState<PoseStatus | null>(null);
  const [sets, setSets] = useState(0);

  return (
    <Screen gap="xl">
      <Stack.Screen options={{ title: "Stance Check" }} />

      <View style={s.camera}>
        <PoseCoachView
          style={s.fill}
          hand={hand}
          camera={camera}
          voice={voice}
          onStatus={(e) => setStatus(e.nativeEvent)}
          onSet={(e) => setSets(e.nativeEvent.count)}
        />
      </View>
      <View style={s.status}>
        <AppText variant="callout" color="textSecondary">
          {statusLine(status, camera)}
        </AppText>
        {status?.state === "denied" && (
          <GhostButton title="Open Settings" icon="gearshape" onPress={() => Linking.openSettings()} />
        )}
      </View>

      <Scoreboard
        label="Straight arm"
        value={sets}
        pad={2}
        caption={sets ? "Set counted. Swing, then set again." : "Hold the forearm vertical and still"}
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
            setSets(0);
          }}
          accessibilityLabel="Cue hand"
        />
        <AppSegmentedControl
          segments={[
            { value: "front", label: "Front camera" },
            { value: "back", label: "Back camera" },
          ]}
          value={camera}
          onChange={(v) => {
            setCamera(v);
            setSets(0);
          }}
          accessibilityLabel="Camera"
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
        <GhostButton title="Analyze a clip" icon="film" onPress={() => router.push("/clip")} />
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
