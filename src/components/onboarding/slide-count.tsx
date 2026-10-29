import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { AppText, makeStyles, useTheme } from '@/design-system';
import { alpha } from '@/design-system/tokens/color';

import { randomGlyph, scramble, useDemoLoop, wait, type Alive } from './timeline';

const BLOCKS = ['STROKE', 'STOP', 'FOLLOW', 'DRAW'] as const;

/** 120 cú một ngày: số tự xáo chữ rồi khoá lại, mưa chữ Doto chạy phía sau. */
export function CountArt({ active }: { active: boolean }) {
  const s = useStyles();
  const reduced = useReducedMotion();
  const [total, setTotal] = useState('120');
  const [parts, setParts] = useState<string[]>(() => BLOCKS.map(() => '30'));

  const run = async (alive: Alive) => {
    // Reduce Motion: số đứng yên, vẫn chờ để vòng lặp không quay rỗng.
    if (reduced) return wait(2600);
    await Promise.all([
      scramble(setTotal, '120', 1100, alive),
      ...BLOCKS.map(async (_, i) => {
        await wait(250 + i * 140);
        await scramble((v) => setParts((p) => p.map((x, j) => (j === i ? v : x))), '30', 700, alive);
      }),
    ]);
    await wait(2600);
  };

  useDemoLoop(active, run);

  return (
    <View
      style={s.root}
      accessible
      accessibilityRole="image"
      accessibilityLabel="120 shots a day: 30 stroke, 30 stop, 30 follow, 30 draw.">
      {!reduced && <GlyphRain active={active} />}
      <AppText variant="dotDisplay" align="center" tabular style={s.total}>
        {total}
      </AppText>
      <AppText variant="label" color="textSecondary" align="center">
        SHOTS A DAY
      </AppText>
      <View style={s.blocks}>
        {BLOCKS.map((b, i) => (
          <View key={b} style={s.block}>
            <AppText variant="dotMetric" tabular>
              {parts[i]}
            </AppText>
            <AppText variant="label" color="textTertiary">
              {b}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

/* Mưa chữ: mỗi cột một đầu rơi, ký tự sau đầu mờ dần. Mép khung phủ gradient nền nên mưa tan vào nền. */

const CELL_W = 13;
const CELL_H = 16;
const TAIL = 9;
type Column = { head: number; speed: number; glyphs: string[]; gold: boolean[] };

const makeColumn = (rows: number): Column => ({
  head: -Math.floor(Math.random() * rows),
  speed: Math.random() < 0.5 ? 1 : 2,
  glyphs: Array.from({ length: rows }, randomGlyph),
  gold: Array.from({ length: rows }, () => Math.random() < 0.08),
});

function GlyphRain({ active }: { active: boolean }) {
  const s = useStyles();
  const t = useTheme();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [cols, setCols] = useState<Column[]>([]);
  const rows = Math.ceil(size.h / CELL_H);

  useEffect(() => {
    if (!active || size.w === 0) return;
    const n = Math.ceil(size.w / CELL_W);
    const id = setInterval(() => {
      setCols((prev) =>
        // Lần đầu hoặc đổi cỡ khung: dựng lại đủ cột.
        (prev.length === n ? prev : Array.from({ length: n }, () => makeColumn(rows))).map((c) => {
          const head = c.head + c.speed;
          if (head - TAIL > rows) return makeColumn(rows);
          const glyphs = c.glyphs.slice();
          // Vài ký tự trong đuôi tự đổi, nhìn như chữ đang chạy.
          glyphs[Math.floor(Math.random() * rows)] = randomGlyph();
          return { ...c, head, glyphs };
        }),
      );
    }, 70);
    return () => clearInterval(id);
  }, [active, size.w, rows]);

  const bg = t.color.backgroundPrimary;
  const mask = `radial-gradient(ellipse ${Math.round(size.w * 0.6)}px ${Math.round(size.h * 0.6)}px at 50% 40%, ${alpha(bg, 0)} 0%, ${alpha(bg, 0.55)} 55%, ${bg} 100%)`;

  return (
    <View
      style={s.rain}
      pointerEvents="none"
      onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
      {cols.map((c, x) => (
        <Text key={x} allowFontScaling={false} style={[s.column, { left: x * CELL_W }]}>
          {c.glyphs.map((g, y) => {
            const d = c.head - y;
            if (d < 0 || d > TAIL) return ' \n';
            const color = c.gold[y] ? t.color.accentGold : t.color.textTertiary;
            return (
              <Text key={y} style={{ color: alpha(color, d === 0 ? 0.9 : 0.5 * (1 - d / (TAIL + 1))) }}>
                {g + '\n'}
              </Text>
            );
          })}
        </Text>
      ))}
      {size.w > 0 && <View style={[s.mask, { experimental_backgroundImage: mask }]} />}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  root: { width: '100%', paddingVertical: t.space.xl, justifyContent: 'center' },
  total: { fontSize: 96, lineHeight: 100, letterSpacing: 2 },
  blocks: { flexDirection: 'row', gap: t.space.xs, marginTop: t.space.xl },
  block: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: t.space.sm,
    borderRadius: t.radius.large,
    backgroundColor: t.color.surfacePrimary,
    gap: t.space.xxs,
  },
  rain: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' },
  column: {
    position: 'absolute',
    top: 0,
    width: CELL_W,
    textAlign: 'center',
    fontFamily: t.type.dotMetric.fontFamily,
    fontSize: 14,
    lineHeight: CELL_H,
  },
  mask: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
}));
