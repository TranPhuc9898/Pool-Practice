import { useState, type PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';

import { makeStyles, useTheme } from '@/design-system';
import { alpha } from '@/design-system/tokens/color';

import { add, lerp, R, tween, type Alive, type Pt } from './timeline';

/**
 * Bàn bida vẽ bằng View, không cần svg. Mọi con trong `PoolTable` dùng toạ độ khung 520×280
 * như prototype; khung được scale và dịch để chỉ hiện nửa giữa bàn (x 112…408).
 */
const FULL_W = 520;
const FULL_H = 280;
const VIEW_X = 112;
const VIEW_W = 296;
const DIAMONDS_X = [80, 140, 200, 320, 380, 440];
const POCKETS: readonly Pt[] = [
  [18, 18],
  [260, 14],
  [502, 18],
  [18, 262],
  [260, 266],
  [502, 262],
];

export function PoolTable({ children }: PropsWithChildren) {
  const s = useStyles();
  const [w, setW] = useState(0);
  return (
    <View style={s.frame} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w > 0 && (
        <View style={[s.full, { transform: [{ scale: w / VIEW_W }, { translateX: -VIEW_X }] }]}>
          <View style={s.felt} />
          {DIAMONDS_X.flatMap((x) => [
            <View key={`t${x}`} style={[s.diamond, { left: x - 2.2, top: 10 - 2.2 }]} />,
            <View key={`b${x}`} style={[s.diamond, { left: x - 2.2, top: 270 - 2.2 }]} />,
          ])}
          {POCKETS.map(([x, y]) => (
            <View key={`${x},${y}`} style={[s.pocket, { left: x - 13, top: y - 13 }]} />
          ))}
          {children}
        </View>
      )}
    </View>
  );
}

/* Bi: vị trí, cỡ, độ hiện chạy trên shared value nên tween không re-render. */

export type BallActor = { x: SharedValue<number>; y: SharedValue<number>; size: SharedValue<number>; shown: SharedValue<number> };

export function useBall(): BallActor {
  return { x: useSharedValue(0), y: useSharedValue(0), size: useSharedValue(1), shown: useSharedValue(0) };
}

export const at = (b: BallActor, p: Pt) => {
  b.x.value = p[0];
  b.y.value = p[1];
};

export const place = (b: BallActor, p: Pt) => {
  at(b, p);
  b.size.value = 1;
  b.shown.value = 1;
};

export const roll = (b: BallActor, a: Pt, to: Pt, ms: number, alive: Alive) =>
  tween(ms, (k) => at(b, lerp(a, to, k)), alive);

/** Bi lăn vào lỗ, nhỏ dần (r 8 → 5) rồi biến mất. */
export async function sink(b: BallActor, a: Pt, pocket: Pt, alive: Alive, ms = 380) {
  await tween(
    ms,
    (k) => {
      at(b, lerp(a, pocket, k));
      b.size.value = 1 - (3 / R) * k;
    },
    alive,
  );
  b.shown.value = 0;
}

export function Ball({ actor, cue, label }: { actor: BallActor; cue?: boolean; label?: string }) {
  const s = useStyles();
  const style = useAnimatedStyle(() => ({
    opacity: actor.shown.value,
    transform: [{ translateX: actor.x.value - R }, { translateY: actor.y.value - R }, { scale: actor.size.value }],
  }));
  return (
    <Animated.View style={[s.ball, cue ? s.cueBall : s.objectBall, style]}>
      {/* Số trên bi là một phần hình vẽ, phóng theo bàn chứ không theo Dynamic Type. */}
      {label && (
        <Text allowFontScaling={false} style={s.ballLabel}>
          {label}
        </Text>
      )}
    </Animated.View>
  );
}

/* Cơ: đầu cơ cách bi cái `gap`, nằm sau bi theo hướng đánh `dir`. */

export type CueActor = { x: SharedValue<number>; y: SharedValue<number>; deg: SharedValue<number> };

export function useCue(): CueActor {
  return { x: useSharedValue(0), y: useSharedValue(0), deg: useSharedValue(0) };
}

export function aimCue(c: CueActor, cb: Pt, dir: Pt, gap: number) {
  const tip = add(cb, dir, -(R + gap));
  c.x.value = tip[0];
  c.y.value = tip[1];
  c.deg.value = (Math.atan2(dir[0], -dir[1]) * 180) / Math.PI;
}

/** Kéo cơ về 22pt rồi thúc tới chạm bi. */
export async function strike(c: CueActor, cb: Pt, dir: Pt, alive: Alive) {
  await tween(450, (k) => aimCue(c, cb, dir, 6 + 22 * k), alive);
  await tween(120, (k) => aimCue(c, cb, dir, 28 - 28 * k), alive);
}

export function Cue({ actor }: { actor: CueActor }) {
  const s = useStyles();
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: actor.x.value - 3 }, { translateY: actor.y.value }, { rotate: `${actor.deg.value}deg` }],
  }));
  return (
    <Animated.View style={[s.cue, style]}>
      <View style={s.cueTip} />
    </Animated.View>
  );
}

/* Đường kẻ: nét liền hoặc nét đứt ghép từ đoạn nhỏ (iOS vẽ sai dashed border một cạnh). */

export function Segment({ a, b, dash, tone = 'gold' }: { a: Pt; b: Pt; dash?: readonly [number, number]; tone?: 'gold' | 'tick' }) {
  const t = useTheme();
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const color = tone === 'gold' ? t.color.accentGold : t.color.textTertiary;
  const thick = tone === 'gold' ? 1.5 : 1.2;
  const n = dash ? Math.ceil(len / (dash[0] + dash[1])) : 0;
  return (
    <View
      style={{
        position: 'absolute',
        left: a[0],
        top: a[1] - thick / 2,
        width: len,
        height: thick,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: dash ? undefined : color,
        transformOrigin: '0% 50%',
        transform: [{ rotate: `${angle}rad` }],
      }}>
      {Array.from({ length: n }, (_, i) => (
        <View key={i} style={{ width: dash![0], marginRight: dash![1], height: thick, backgroundColor: color }} />
      ))}
    </View>
  );
}

/** Vùng bi cái phải dừng vào. */
export function Zone({ at: p, r, filled }: { at: Pt; r: number; filled?: boolean }) {
  const t = useTheme();
  return (
    <View
      style={{
        position: 'absolute',
        left: p[0] - r,
        top: p[1] - r,
        width: r * 2,
        height: r * 2,
        borderRadius: r,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: t.color.accentGold,
        backgroundColor: filled ? alpha(t.color.accentGold, 0.1) : undefined,
      }}
    />
  );
}

const useStyles = makeStyles((t) => ({
  frame: { width: '100%', aspectRatio: VIEW_W / FULL_H, overflow: 'hidden' },
  full: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: FULL_W,
    height: FULL_H,
    borderRadius: 14,
    backgroundColor: t.color.tableRail,
    transformOrigin: '0% 0%',
  },
  felt: { position: 'absolute', left: 20, top: 20, width: 480, height: 240, backgroundColor: t.color.tableFelt },
  diamond: { position: 'absolute', width: 4.4, height: 4.4, borderRadius: 2.2, backgroundColor: t.color.textSecondary },
  pocket: { position: 'absolute', width: 26, height: 26, borderRadius: 13, backgroundColor: t.color.tablePocket },
  ball: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: R * 2,
    height: R * 2,
    borderRadius: R,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cueBall: { backgroundColor: t.color.ballCue, borderWidth: 1.2, borderColor: t.color.ballEdge },
  objectBall: { backgroundColor: t.color.ballObject, borderWidth: 0.6, borderColor: t.color.ballEdge },
  ballLabel: { color: t.color.ballCue, fontFamily: t.type.label.fontFamily, fontSize: 9, lineHeight: 11, fontWeight: '700' },
  cue: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 6,
    height: 300,
    borderRadius: 2,
    backgroundColor: t.color.accentGold,
    transformOrigin: '50% 0%',
  },
  cueTip: { width: 6, height: 8, backgroundColor: t.color.ballCue },
}));
