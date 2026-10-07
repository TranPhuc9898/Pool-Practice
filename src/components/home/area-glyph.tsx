import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '@/design-system';

import type { TrainingAreaId } from './training-areas';

/** Khung vẽ cố định 120×40 pt, toạ độ như một SVG nhỏ. Không cần thư viện vẽ cho vài nét. */
const W = 120;
const H = 40;

type P = readonly [number, number];

function Seg({ a, b, color, w = 1.2 }: { a: P; b: P; color: string; w?: number }) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return (
    <View
      style={{
        position: 'absolute',
        left: (a[0] + b[0]) / 2 - len / 2,
        top: (a[1] + b[1]) / 2 - w / 2,
        width: len,
        height: w,
        borderRadius: w / 2,
        backgroundColor: color,
        transform: [{ rotate: `${Math.atan2(b[1] - a[1], b[0] - a[0])}rad` }],
      }}
    />
  );
}

function Ball({
  c,
  r,
  fill,
  stroke,
  dashed,
  children,
}: {
  c: P;
  r: number;
  fill?: string;
  stroke?: string;
  dashed?: boolean;
  children?: ReactNode;
}) {
  return (
    <View
      style={{
        position: 'absolute',
        left: c[0] - r,
        top: c[1] - r,
        width: r * 2,
        height: r * 2,
        borderRadius: r,
        backgroundColor: fill ?? 'transparent',
        borderWidth: stroke ? 1.3 : 0,
        borderColor: stroke,
        borderStyle: dashed ? 'dashed' : 'solid',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {children}
    </View>
  );
}

/** Hình hình học bàn bi cho từng nhóm. Chỉ trắng xám, gold để dành cho card hero. */
export function AreaGlyph({ area }: { area: TrainingAreaId }) {
  const t = useTheme();
  const ink = t.color.textPrimary;
  const line = t.color.textTertiary;
  const faint = t.color.borderStrong;
  const felt = t.color.surfacePrimary;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: W, height: H }}>
      {area === 'fundamentals' && (
        <>
          <Seg a={[18, 20]} b={[57, 20]} color={line} />
          <Seg a={[70, 20]} b={[99, 20]} color={faint} />
          <Ball c={[12, 20]} r={5.5} fill={ink} />
          <Ball c={[63, 20]} r={5.5} fill={felt} stroke={ink} />
          <Ball c={[63, 20]} r={1.4} fill={ink} />
          <Ball c={[108, 20]} r={7} fill={t.color.backgroundPrimary} stroke={faint} />
        </>
      )}

      {area === 'cueBallControl' && (
        <>
          {/* Bi cái chạy tới rồi kéo ngược về: đường draw. */}
          <Seg a={[18, 30]} b={[78, 30]} color={line} />
          <Ball c={[84, 30]} r={5.5} fill={felt} stroke={ink} />
          <Seg a={[76, 12]} b={[34, 12]} color={line} />
          <Seg a={[34, 12]} b={[39, 8]} color={line} />
          <Seg a={[34, 12]} b={[39, 16]} color={line} />
          <Ball c={[12, 30]} r={5.5} fill={ink} />
          <Ball c={[22, 12]} r={5} stroke={faint} dashed />
        </>
      )}

      {area === 'positionPlay' && (
        <>
          <Seg a={[2, 3]} b={[118, 3]} color={faint} />
          <Seg a={[16, 32]} b={[64, 5]} color={line} />
          <Seg a={[64, 5]} b={[98, 26]} color={line} />
          <Ball c={[11, 34]} r={5.5} fill={ink} />
          <Ball c={[104, 29]} r={8} stroke={faint} dashed />
        </>
      )}

      {area === 'patterns' && (
        <>
          <Seg a={[25, 20]} b={[45, 20]} color={line} />
          <Seg a={[69, 20]} b={[89, 20]} color={line} />
          {(['1', '2', '3'] as const).map((n, i) => (
            <Ball key={n} c={[14 + i * 44, 20]} r={9} fill={felt} stroke={i === 0 ? ink : line}>
              {/* Số trên bi là hình, không phải chữ đọc: cỡ cố định theo bi, không theo Dynamic Type. */}
              <Text
                allowFontScaling={false}
                style={{ fontFamily: t.type.captionSmall.fontFamily, fontSize: 10, color: i === 0 ? ink : line }}>
                {n}
              </Text>
            </Ball>
          ))}
        </>
      )}
    </View>
  );
}
