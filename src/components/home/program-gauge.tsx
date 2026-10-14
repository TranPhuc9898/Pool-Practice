import { useState } from 'react';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { AppText, DotMatrixDisplay, homeSurfaces, makeStyles, useTheme } from '@/design-system';

/** Hệ toạ độ gốc của mockup: viewBox 300×162, tâm cung (150, 156). Mọi số dưới đây nhân `k = width / 300`. */
const VB_W = 300;
const VB_H = 162;
const CX = 150;
const CY = 156;
const R_OUT = 140;
const R_IN = 129;
const R_EDGE = 124;
const R_LABEL = 108;
const R_DASH = 114;
const TICKS = 44;
const GAP = 2;

const ang = (t: number) => Math.PI - t * Math.PI;
const pad = (n: number) => String(n).padStart(2, '0');

type Tick = { seg: number; a: number; edge: boolean; j: number };

/** Mỗi drill một cung vạch, giữa hai cung một khe 2 vạch. Program 1 drill: một cung liền, không nhãn. */
function layout(n: number) {
  const per = n === 1 ? TICKS : Math.round(TICKS / n);
  const slots = n * per + (n - 1) * GAP;
  const ticks: Tick[] = [];
  const segAng: number[] = [];
  for (let s = 0, slot = 0; s < n; s++, slot += GAP) {
    segAng.push(ang((slot + per / 2) / slots));
    for (let j = 0; j < per; j++, slot++) {
      ticks.push({ seg: s, a: ang((slot + 0.5) / slots), edge: j === 0 || j === per - 1, j });
    }
  }
  return { ticks, segAng, per };
}

export type ProgramGaugeProps = {
  /** Số drill của program. */
  total: number;
  /** Drill đang tập, 0-based. `-1` khi program đã xong: không còn marker. */
  focus: number;
  /** Phần đã xong của từng cung, 0…1. Vạch sáng từ trái sang theo tỉ lệ này. */
  fill: (seg: number) => number;
  /** Số lớn giữa vòng: `value/of`. */
  value: number;
  of: number;
  caption: string;
};

/**
 * Gauge nửa vòng của card hero, dựng bằng View xoay như `MetricRing`, không cần react-native-svg.
 * Pass xong: chỉ vạch đổi trạng thái mới chuyển màu (160ms, trễ ≤18ms), marker xoay 240ms ease-out.
 * Reduce Motion: màu vẫn chuyển, marker nhảy thẳng.
 */
export function ProgramGauge({ total, focus, fill, value, of, caption }: ProgramGaugeProps) {
  const t = useTheme();
  const s = useStyles();
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const k = width / VB_W;
  const { ticks, segAng, per } = layout(total);
  const markDeg = focus >= 0 ? ((Math.PI / 2 - segAng[focus]) * 180) / Math.PI : 0;
  const ink = homeSurfaces.ink;

  return (
    <View
      style={s.box}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      {width > 0 && (
        <>
          {/* Cung đứt trong cùng: một vòng tròn viền chấm, cắt lấy nửa trên. */}
          <View
            pointerEvents="none"
            style={{ position: 'absolute', left: (CX - R_DASH) * k, top: (CY - R_DASH) * k, width: R_DASH * 2 * k, height: R_DASH * k, overflow: 'hidden' }}>
            <View
              style={{
                width: R_DASH * 2 * k,
                height: R_DASH * 2 * k,
                borderRadius: R_DASH * k,
                borderWidth: 0.6,
                borderStyle: 'dotted',
                borderColor: 'rgba(255, 255, 255, 0.12)',
              }}
            />
          </View>

          {ticks.map(({ seg, a, edge, j }, i) => {
            const now = seg === focus;
            const lit = j < Math.round(fill(seg) * per);
            const rIn = edge ? R_EDGE : R_IN;
            const len = (R_OUT - rIn) * k;
            const mid = ((R_OUT + rIn) / 2) * k;
            const w = now ? 1.8 : 1.4;
            return (
              <Animated.View
                key={i}
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: CX * k + mid * Math.cos(a) - w / 2,
                  top: CY * k - mid * Math.sin(a) - len / 2,
                  width: w,
                  height: len,
                  borderRadius: w / 2,
                  backgroundColor: lit ? (now ? ink.gold : ink.tickPast) : ink.tickOff,
                  transform: [{ rotate: `${((Math.PI / 2 - a) * 180) / Math.PI}deg` }],
                  transitionProperty: 'backgroundColor',
                  transitionDuration: 160,
                  transitionDelay: reduced ? 0 : Math.min(j, 18),
                  transitionTimingFunction: t.motion.curve.easeOut,
                }}
              />
            );
          })}

          {total > 1 &&
            segAng.map((a, seg) => {
              const now = seg === focus;
              const past = !now && fill(seg) >= 1;
              return (
                <AppText
                  key={seg}
                  variant="monoSmall"
                  color={past ? 'textSecondary' : 'textTertiary'}
                  style={[
                    s.label,
                    { left: CX * k + R_LABEL * k * Math.cos(a) - 12, top: CY * k - R_LABEL * k * Math.sin(a) - 7 },
                    now && { color: ink.gold },
                  ]}>
                  {seg + 1}
                </AppText>
              );
            })}

          {/* Marker: điểm xoay đặt đúng tâm cung, tam giác treo ở đỉnh. */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: CX * k,
              top: CY * k,
              width: 0,
              height: 0,
              // Program 1 drill: cả cung đã là drill đang tập, marker chỉ vào giữa cung không mang thông tin.
              opacity: focus >= 0 && total > 1 ? 1 : 0,
              transform: [{ rotate: `${markDeg}deg` }],
              transitionProperty: ['transform', 'opacity'],
              transitionDuration: reduced ? 0 : 240,
              transitionTimingFunction: t.motion.curve.easeOut,
            }}>
            <View
              style={{
                position: 'absolute',
                left: -4.5 * k,
                top: (3.5 - CY) * k,
                width: 0,
                height: 0,
                borderLeftWidth: 4.5 * k,
                borderRightWidth: 4.5 * k,
                borderTopWidth: 7 * k,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: ink.gold,
              }}
            />
          </Animated.View>
        </>
      )}

      <View style={s.mid}>
        <View style={s.nums}>
          <DotMatrixDisplay text={pad(value)} size="lg" glow />
          <DotMatrixDisplay text={`/${pad(of)}`} size="sm" color="textTertiary" />
        </View>
        <AppText variant="label" color="textTertiary" style={s.cap}>
          {caption}
        </AppText>
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  box: { width: '100%', aspectRatio: VB_W / VB_H },
  label: { position: 'absolute', width: 24, textAlign: 'center' },
  mid: { position: 'absolute', left: 0, right: 0, bottom: '3%', alignItems: 'center', gap: t.space.sm },
  nums: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  cap: { letterSpacing: 1.5 },
}));
