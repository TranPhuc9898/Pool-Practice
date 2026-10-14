import { View, type StyleProp, type ViewStyle } from "react-native";

import {
  AppIcon,
  AppText,
  DotMatrixNumber,
  DotProgress,
  homeSurfaces,
  makeStyles,
  PressableScale,
  sheenSweepStrong,
  type IconName,
} from "@/design-system";
import { SheenSweep } from "@/components/home/sheen-sweep";
import type { AttemptResult } from "@/pool-engine/progress";

/** Ba thông số kỹ thuật của drill trong một dải, ngăn bằng hairline. Toàn bộ đọc từ data drill. */
export function SpecStrip({
  items,
}: {
  items: readonly { label: string; value: string }[];
}) {
  const s = useStyles();
  return (
    <View style={[s.spec, homeSurfaces.quickTile]}>
      {items.map((it, i) => (
        <View key={it.label} style={[s.specCell, i > 0 && s.specDivider]}>
          <AppText variant="label" color="textTertiary">
            {it.label}
          </AppText>
          <AppText
            variant="callout"
            style={s.specValue}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {it.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

/** Ngưỡng tốc bi cái (m/s), trùng `powerWord` của Soạn bài để hai màn gọi cùng một tên. */
const POWER = [
  { max: 0.45, word: "Touch" },
  { max: 0.89, word: "Soft" },
  { max: 1.9, word: "Medium" },
  { max: 3.2, word: "Firm" },
  { max: Infinity, word: "Power" },
] as const;
const powerStep = (v: number) => POWER.findIndex((p) => v < p.max);

/** 1 tip ≈ 0,45R (đầu cơ 13 mm, bi 57,15 mm), làm tròn tới ¼ tip. */
const TIP_R = 0.45;
const QUARTER = ["", "¼", "½", "¾"];
const tips = (r: number) => {
  const q = Math.round(Math.abs(r) / TIP_R / 0.25);
  const whole = Math.floor(q / 4);
  return q === 0 ? "" : `${whole || ""}${QUARTER[q % 4]} tip`;
};
const tipLines = (x: number, y: number) => {
  const v = tips(y) && `${tips(y)} ${y > 0 ? "high" : "low"}`;
  const h = tips(x) && `${tips(x)} ${x > 0 ? "right" : "left"}`;
  return [v, h].filter(Boolean).join(" · ") || "Center";
};

const FACE = 64;

/**
 * Cú đánh đọc được ở bàn: mặt bi cái nhìn từ chỗ người cầm cơ (chấm gold là điểm đánh, vòng đứt là 0,5R, ngoài
 * nữa dễ trượt cơ) và thanh lực 5 bậc. `shot` trống là drill nhiều đích chưa chọn đích nào.
 */
export function ShotCard({
  title,
  shot,
  pass,
}: {
  title: string;
  shot?: { tipX: number; tipY: number; speed: number };
  pass: string;
}) {
  const s = useStyles();
  const step = shot ? powerStep(shot.speed) : -1;
  const spin = shot
    ? tipLines(shot.tipX, shot.tipY)
    : "Tap a target on the table";
  const power = shot
    ? `${POWER[step].word} · ${shot.speed.toFixed(1)} m/s`
    : " ";
  return (
    <View
      style={[s.spec, s.shot, homeSurfaces.quickTile]}
      accessible
      accessibilityLabel={
        shot
          ? `${title}. ${spin}. ${power}. Pass ${pass}`
          : `${title}. ${spin}. Pass ${pass}`
      }
    >
      <View style={s.face}>
        <View style={s.faceRing} />
        <View style={[s.faceAxis, { width: 1, height: FACE }]} />
        <View style={[s.faceAxis, { width: FACE, height: 1 }]} />
        {shot && (
          <View
            style={[
              s.faceDot,
              {
                left: FACE / 2 + (shot.tipX * FACE) / 2 - 6,
                top: FACE / 2 - (shot.tipY * FACE) / 2 - 6,
              },
            ]}
          />
        )}
      </View>
      <View style={s.shotMid}>
        <AppText variant="label" color="textTertiary" numberOfLines={1}>
          {title}
        </AppText>
        <AppText
          variant="callout"
          style={s.specValue}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {spin}
        </AppText>
        <View style={s.bars}>
          {POWER.map((p, i) => (
            <View
              key={p.word}
              style={[
                s.bar,
                {
                  backgroundColor:
                    i <= step
                      ? homeSurfaces.ink.gold
                      : homeSurfaces.ink.tickOff,
                },
              ]}
            />
          ))}
        </View>
        <AppText variant="monoSmall" color="textTertiary" numberOfLines={1}>
          {power}
        </AppText>
      </View>
      <View style={[s.specCell, s.specDivider, s.shotPass]}>
        <AppText variant="label" color="textTertiary">
          Pass
        </AppText>
        <AppText variant="callout" style={s.specValue} numberOfLines={1}>
          {pass}
        </AppText>
      </View>
    </View>
  );
}

/** Bật tắt guide trên bàn. Bốn ô bằng nhau, không cuộn ngang, không tràn mép. */
export function GuideToggles<K extends string>({
  items,
  value,
  onToggle,
}: {
  items: readonly { key: K; label: string }[];
  value: Record<K, boolean>;
  onToggle: (key: K) => void;
}) {
  const s = useStyles();
  return (
    <View style={s.toggles}>
      {items.map((g) => {
        const on = value[g.key];
        return (
          <PressableScale
            key={g.key}
            onPress={() => onToggle(g.key)}
            accessibilityRole="switch"
            accessibilityState={{ checked: on }}
            accessibilityLabel={`${g.label} guide`}
            style={[s.toggle, on ? s.toggleOn : s.toggleOff]}
          >
            <AppText
              variant="captionSmall"
              color={on ? "textPrimary" : "textTertiary"}
              numberOfLines={1}
            >
              {g.label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

/** Hai chế độ của khung bàn: toàn bàn hoặc góc nhìn ngắm. Đổi tức thì, không animation (bấm chục lần mỗi buổi). */
export function ViewSwitch<K extends string>({
  items,
  value,
  onChange,
}: {
  items: readonly { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
}) {
  const s = useStyles();
  return (
    <View style={s.switch} accessibilityRole="tablist">
      {items.map((it) => {
        const on = it.key === value;
        return (
          <PressableScale
            key={it.key}
            onPress={() => onChange(it.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={[s.switchItem, on && s.switchOn]}
          >
            <AppText
              variant="captionSmall"
              color={on ? "textPrimary" : "textTertiary"}
              style={s.upper}
            >
              {it.label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

/** Số đọc của cú ngắm: góc cắt, độ dày, phía điểm chạm. Mọi số tính từ toạ độ drill. */
export function AimReadout({
  items,
}: {
  items: readonly { label: string; value: string }[];
}) {
  const s = useStyles();
  return (
    <View style={s.readout}>
      {items.map((it) => (
        <View key={it.label} style={s.readoutCell}>
          <AppText variant="monoSmall" color="textTertiary">
            {it.label}
          </AppText>
          <AppText
            variant="callout"
            style={[s.specValue, s.readoutValue]}
            numberOfLines={1}
          >
            {it.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

/**
 * Bảng điểm: chấm là từng cú (đặc pass, rỗng fail), số dot-matrix là số cú pass trên ngưỡng.
 * Đạt ngưỡng thì nhãn đổi sang gold, chỗ gold duy nhất ngoài nút chính.
 */
export function Scoreboard({
  attempts,
  total,
  passed,
  required,
  isPassed,
  caption,
}: {
  attempts: readonly AttemptResult[];
  total: number;
  passed: number;
  required: number;
  isPassed: boolean;
  caption: string;
}) {
  const s = useStyles();
  return (
    <View style={[s.board, homeSurfaces.hero]}>
      <View style={s.boardLeft}>
        <AppText variant="label" color="textTertiary">
          {caption}
        </AppText>
        <DotProgress
          total={total}
          marks={attempts}
          inverse
          dotSize={10}
          gap={6}
          accessibilityLabel={`${passed} of ${attempts.length} attempts passed`}
        />
      </View>
      <View style={s.boardRight}>
        <DotMatrixNumber value={passed} pad={2} size="lg" />
        <AppText
          variant="label"
          color={isPassed ? undefined : "textTertiary"}
          style={isPassed && s.gold}
        >
          {isPassed ? "Passed" : `of ${required}`}
        </AppText>
      </View>
    </View>
  );
}

type ActionProps = {
  title: string;
  icon: IconName;
  onPress: () => void;
  haptic?: "light" | "medium";
  style?: StyleProp<ViewStyle>;
  /** Dải sáng quét qua như card hero Home, cho nút cần kéo mắt. */
  sheen?: boolean;
};

/** Nút chính gold đặc, cùng chất với CTA của Home. Một màn một cái đang hiện. */
export function GoldAction({
  title,
  icon,
  onPress,
  haptic,
  style,
}: ActionProps) {
  const s = useStyles();
  return (
    <PressableScale
      onPress={onPress}
      haptic={haptic}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[s.action, homeSurfaces.cta, style]}
    >
      <AppIcon name={icon} size="small" color="textInverse" weight="bold" />
      <AppText variant="button" style={s.goldText}>
        {title}
      </AppText>
    </PressableScale>
  );
}

/** Nút phụ graphite: Miss. Cùng cao với nút gold để hai nút đứng thành một hàng phẳng. */
export function GraphiteAction({
  title,
  icon,
  onPress,
  style,
  sheen,
}: ActionProps) {
  const s = useStyles();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[s.action, homeSurfaces.quickTile, style]}
    >
      {sheen && (
        <SheenSweep radius={14} cycle={3600} image={sheenSweepStrong} />
      )}
      <AppIcon name={icon} size="small" color="textSecondary" weight="bold" />
      <AppText variant="button" color="textPrimary" style={s.upper}>
        {title}
      </AppText>
    </PressableScale>
  );
}

/** Prev / Reset / Next: chữ nhỏ, không nền. Điều hướng phụ, không tranh với nút chính. */
export function FooterNav({
  canPrev,
  canNext,
  onPrev,
  onReset,
  onNext,
}: {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onReset: () => void;
  onNext: () => void;
}) {
  const s = useStyles();
  const item = (
    label: string,
    icon: IconName,
    onPress: () => void,
    enabled: boolean,
    trailing = false,
  ) => (
    <PressableScale
      onPress={onPress}
      disabled={!enabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[s.navItem, !enabled && s.disabled]}
    >
      {!trailing && (
        <AppIcon
          name={icon}
          size="small"
          color="textSecondary"
          weight="semibold"
        />
      )}
      <AppText variant="callout" color="textSecondary">
        {label}
      </AppText>
      {trailing && (
        <AppIcon
          name={icon}
          size="small"
          color="textSecondary"
          weight="semibold"
        />
      )}
    </PressableScale>
  );
  return (
    <View style={s.nav}>
      {item("Prev", "chevron.left", onPrev, canPrev)}
      {item("Reset", "arrow.counterclockwise", onReset, true)}
      {item("Next", "chevron.right", onNext, canNext, true)}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  spec: {
    flexDirection: "row",
    borderRadius: 18,
    borderCurve: "continuous",
    paddingVertical: 12,
  },
  specCell: { flex: 1, gap: 4, paddingHorizontal: 14 },
  specDivider: {
    borderLeftWidth: t.border.hairline,
    borderLeftColor: "rgba(255, 255, 255, 0.08)",
  },
  specValue: { color: homeSurfaces.ink.title },
  shot: { alignItems: "center", paddingHorizontal: 14, gap: 14 },
  shotMid: { flex: 1, gap: 4 },
  shotPass: {
    flex: 0,
    alignSelf: "stretch",
    justifyContent: "center",
    paddingRight: 0,
  },
  face: {
    width: FACE,
    height: FACE,
    borderRadius: FACE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9E7EA",
    experimental_backgroundImage:
      "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #E9E7EA 45%, #B9B6BC 100%)",
  },
  faceRing: {
    position: "absolute",
    width: FACE / 2,
    height: FACE / 2,
    borderRadius: FACE / 4,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(0, 0, 0, 0.28)",
  },
  faceAxis: { position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.1)" },
  faceDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: homeSurfaces.ink.gold,
    borderWidth: 1.5,
    borderColor: "#0A0A0A",
  },
  bars: { flexDirection: "row", gap: 3, marginTop: 2 },
  bar: { flex: 1, height: 5, borderRadius: 2.5 },
  toggles: { flexDirection: "row", gap: 8 },
  switch: {
    flexDirection: "row",
    alignSelf: "flex-start",
    padding: 3,
    gap: 2,
    borderRadius: 12,
    borderCurve: "continuous",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  switchItem: {
    minWidth: 72,
    height: 30,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  switchOn: { backgroundColor: "rgba(255, 255, 255, 0.12)" },
  readout: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 6,
  },
  readoutCell: { flex: 1, gap: 2 },
  readoutValue: { fontVariant: ["tabular-nums"] },
  toggle: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: t.border.hairline,
  },
  toggleOn: {
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
  toggleOff: {
    backgroundColor: "rgba(255, 255, 255, 0.025)",
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  board: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.space.md,
    borderRadius: 22,
    borderCurve: "continuous",
    padding: 18,
  },
  boardLeft: { flex: 1, gap: 10 },
  boardRight: { alignItems: "flex-end", gap: 6 },
  gold: { color: homeSurfaces.ink.gold },
  action: {
    height: 56,
    borderRadius: 14,
    borderCurve: "continuous",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  goldText: {
    color: homeSurfaces.ink.ctaText,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  upper: { textTransform: "uppercase", letterSpacing: 1.2 },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: t.layout.minTouchTarget,
    paddingHorizontal: 4,
  },
  disabled: { opacity: 0.3 },
}));
