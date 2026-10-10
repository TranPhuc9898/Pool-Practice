import { useState } from 'react';
import { View } from 'react-native';

import {
  AppCard,
  AppChip,
  AppIcon,
  AppSearchField,
  AppSegmentedControl,
  AppSlider,
  AppStepper,
  AppText,
  AppTextField,
  AppToggle,
  CategoryChip,
  CompletedChip,
  DestructiveButton,
  DifficultyChip,
  DrillCard,
  GhostButton,
  Grid,
  IconButton,
  ListGroup,
  makeStyles,
  MetricCard,
  NumericInput,
  PickerRow,
  PrimaryButton,
  Screen,
  SecondaryButton,
  Section,
  SelectableCard,
  SelectChip,
  SessionCard,
  StatCard,
  StatusChip,
  TrainingCard,
  useTheme,
  type IconName,
} from '@/design-system';
import { PoolBall } from '@/pool-domain/pool-ball';
import { BallColor, PoolColor, type BallNumber } from '@/pool-domain/pool-colors';

/**
 * Catalog nội bộ. Đổi token → mở màn này là thấy cả ngôn ngữ UI đổi theo.
 * Mỗi component mới của design system phải có mặt ở đây.
 */
export function DesignSystemPreview({ children }: { children?: React.ReactNode }) {
  return (
    <Screen gap="section">
      {children}
      <ColorsSection />
      <TypographySection />
      <ScaleSection />
      <ButtonsSection />
      <CardsSection />
      <InputsSection />
      <ChipsSection />
      <IconsSection />
      <MotionSection />
      <PoolSection />
    </Screen>
  );
}

/* ── Colors ─────────────────────────────────────────────── */

function ColorsSection() {
  const t = useTheme();
  const groups: Record<string, string[]> = {};
  for (const key of Object.keys(t.color)) {
    const group = key.match(/^[a-z]+/)?.[0] ?? 'other';
    (groups[group] ??= []).push(key);
  }
  return (
    <Section title="Color" caption="Semantic tokens — views never use hex.">
      {Object.entries(groups).map(([group, keys]) => (
        <Grid key={group} columns={2}>
          {keys.map((k) => (
            <Swatch key={k} name={k} value={t.color[k as keyof typeof t.color]} />
          ))}
        </Grid>
      ))}
    </Section>
  );
}

function Swatch({ name, value }: { name: string; value: string }) {
  const s = useStyles();
  return (
    <View style={s.swatch}>
      <View style={[s.swatchChip, { backgroundColor: value }]} />
      <View style={s.flex}>
        <AppText variant="callout" numberOfLines={1}>
          {name}
        </AppText>
        <AppText variant="captionSmall" color="textTertiary" numberOfLines={1}>
          {value.toUpperCase()}
        </AppText>
      </View>
    </View>
  );
}

/* ── Typography ─────────────────────────────────────────── */

function TypographySection() {
  const t = useTheme();
  const s = useStyles();
  return (
    <Section title="Typography" caption="Be Vietnam Pro · Doto cho tiêu đề chấm · Dynamic Type capped per style." gap="md">
      {(Object.keys(t.type) as (keyof typeof t.type)[]).map((k) => (
        <View key={k} style={s.typeRow}>
          <AppText variant="captionSmall" color="textTertiary">
            {k} · {t.type[k].fontSize}/{t.type[k].lineHeight}
          </AppText>
          <AppText variant={k} numberOfLines={1}>
            {k.includes('etric') ? '9 / 10' : k.startsWith('dot') ? 'Today' : 'Chạy hết bàn, đặt bi cái'}
          </AppText>
        </View>
      ))}
    </Section>
  );
}

/* ── Spacing, radius, border, shadow ────────────────────── */

function ScaleSection() {
  const t = useTheme();
  const s = useStyles();
  return (
    <>
      <Section title="Spacing" caption="Base 4pt.">
        {Object.entries(t.space)
          .filter(([, v]) => v > 0)
          .map(([k, v]) => (
            <View key={k} style={s.scaleRow}>
              <AppText variant="caption" color="textSecondary" style={s.scaleLabel}>
                {k} · {v}
              </AppText>
              <View style={[s.spaceBar, { width: v * 3 }]} />
            </View>
          ))}
      </Section>

      <Section title="Radius">
        <View style={s.wrap}>
          {Object.entries(t.radius)
            .filter(([k]) => k !== 'none')
            .map(([k, v]) => (
              <View key={k} style={s.radiusItem}>
                <View style={[s.radiusBox, { borderRadius: Math.min(v, 36) }]} />
                <AppText variant="captionSmall" color="textTertiary">
                  {k} · {v}
                </AppText>
              </View>
            ))}
        </View>
      </Section>

      <Section title="Border & Shadow">
        <View style={s.wrap}>
          <SampleBox label="subtle" style={{ borderColor: t.color.borderSubtle }} />
          <SampleBox label="primary" style={{ borderColor: t.color.borderPrimary }} />
          <SampleBox label="strong" style={{ borderColor: t.color.borderStrong }} />
          <SampleBox label="accent" style={{ borderColor: t.color.borderAccent }} />
        </View>
        <View style={s.wrap}>
          <SampleBox label="card" style={t.shadow.card} />
          <SampleBox label="floating" style={t.shadow.floating} />
          <SampleBox label="accentGlow" style={[t.shadow.accentGlow, { borderColor: t.color.borderAccent }]} />
        </View>
      </Section>
    </>
  );
}

function SampleBox({ label, style }: { label: string; style: object }) {
  const s = useStyles();
  return (
    <View style={s.radiusItem}>
      <View style={[s.sampleBox, style]} />
      <AppText variant="captionSmall" color="textTertiary">
        {label}
      </AppText>
    </View>
  );
}

/* ── Buttons ────────────────────────────────────────────── */

function ButtonsSection() {
  const s = useStyles();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const fakeLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };
  return (
    <Section title="Buttons" gap="sm">
      <PrimaryButton title="Start Training" icon="play.fill" onPress={fakeLoad} loading={loading} />
      <SecondaryButton title="Explore Drills" icon="square.grid.2x2" onPress={() => {}} />
      <GhostButton title="Skip for now" onPress={() => {}} />
      <DestructiveButton title="End Session" icon="stop.fill" onPress={() => {}} />
      <PrimaryButton title="Disabled" disabled />
      <View style={s.wrap}>
        <PrimaryButton title="Save" size="medium" fullWidth={false} onPress={() => {}} />
        <SecondaryButton title="Next" size="medium" fullWidth={false} icon="chevron.right" iconPosition="trailing" />
        <GhostButton title="Cancel" size="medium" fullWidth={false} />
      </View>
      <View style={s.wrap}>
        <IconButton icon="xmark" accessibilityLabel="Close" />
        <IconButton icon="pause.fill" accessibilityLabel="Pause" variant="tinted" />
        <IconButton
          icon="star"
          accessibilityLabel="Favorite"
          selected={selected}
          onPress={() => setSelected((v) => !v)}
          haptic="light"
        />
        <IconButton icon="ellipsis" accessibilityLabel="More" variant="plain" />
        <IconButton icon="trash" accessibilityLabel="Delete" disabled />
      </View>
    </Section>
  );
}

/* ── Cards ──────────────────────────────────────────────── */

function CardsSection() {
  const s = useStyles();
  const [game, setGame] = useState<'nine' | 'ten'>('nine');
  return (
    <Section title="Cards" gap="sm">
      <AppCard>
        <AppText variant="headline">AppCard · default</AppText>
        <AppText variant="body" color="textSecondary">
          Surface, radius, border, padding — shared by every card.
        </AppText>
      </AppCard>
      <AppCard tone="elevated" onPress={() => {}}>
        <AppText variant="headline">AppCard · elevated, pressable</AppText>
      </AppCard>
      <Grid columns={2}>
        <MetricCard label="Accuracy" value={68} suffix="%" caption="+4% this week" />
        <MetricCard label="Streak" value={7} pad={2} state="active" caption="days" />
      </Grid>
      <MetricCard label="Cue control" value={74} suffix="%" state="selected" />
      <Grid columns={2}>
        <MetricCard label="Stop" value={92} state="mastered" />
        <MetricCard label="Masse" value={0} pad={2} state="locked" />
      </Grid>
      <Grid columns={2}>
        <StatCard label="Run-outs" value="3" icon="checkmark.seal" />
        <StatCard label="Break & run" value="1" icon="bolt" />
      </Grid>
      <TrainingCard
        featured
        eyebrow="Today's Training"
        title="Cue Ball Control"
        description="Stop shot, follow and draw."
        icon="scope"
        meta="25 min · 4 drills"
        onPress={() => {}}
      />
      <DrillCard
        title="Stop Shot Ladder"
        category="Cue Ball"
        difficulty="beginner"
        durationLabel="10 min"
        status="completed"
        onPress={() => {}}
      />
      <DrillCard
        title="Three-Ball Pattern"
        category="Position"
        difficulty="advanced"
        durationLabel="15 min"
        status="inProgress"
        onPress={() => {}}
      />
      <SessionCard
        title="9-Ball · Run-out practice"
        dateLabel="Today, 19:40"
        accuracy="72%"
        shots="86"
        duration="42m"
        onPress={() => {}}
      />
      <View style={s.row}>
        {(['nine', 'ten'] as const).map((g) => (
          <SelectableCard
            key={g}
            selected={game === g}
            onSelect={() => setGame(g)}
            accessibilityLabel={g === 'nine' ? '9-Ball' : '10-Ball'}
            style={s.flex}>
            <View style={s.selectableHeader}>
              <PoolBall number={g === 'nine' ? 9 : 10} size={28} />
              {game === g && <AppIcon name="checkmark.circle.fill" color="accentContent" />}
            </View>
            <AppText variant="headline">{g === 'nine' ? '9-Ball' : '10-Ball'}</AppText>
          </SelectableCard>
        ))}
      </View>
    </Section>
  );
}

/* ── Inputs ─────────────────────────────────────────────── */

function InputsSection() {
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [attempts, setAttempts] = useState('10');
  const [mode, setMode] = useState<'all' | 'nine' | 'ten'>('all');
  const [sound, setSound] = useState(true);
  const [racks, setRacks] = useState(5);
  const [power, setPower] = useState(60);
  return (
    <Section title="Inputs" gap="lg">
      <AppTextField label="Player name" placeholder="Efren" value={name} onChangeText={setName} helper="Shown on your profile." />
      <AppTextField label="Email" placeholder="you@club.com" value="not-an-email" error="Enter a valid email." />
      <AppTextField label="Disabled" value="Locked" disabled />
      <AppSearchField value={query} onChangeText={setQuery} placeholder="Search drills" />
      <NumericInput label="Attempts" value={attempts} onChangeText={setAttempts} suffix="shots" />
      <AppSegmentedControl
        accessibilityLabel="Game type"
        value={mode}
        onChange={setMode}
        segments={[
          { value: 'all', label: 'All' },
          { value: 'nine', label: '9-Ball' },
          { value: 'ten', label: '10-Ball' },
        ]}
      />
      <AppToggle label="Shot sounds" description="Play a tick on every logged shot." value={sound} onValueChange={setSound} />
      <AppStepper label="Racks" value={racks} onChange={setRacks} min={1} max={20} />
      <AppSlider label="Stroke power" value={power} onChange={setPower} step={5} format={(v) => `${v}%`} />
      <ListGroup>
        <PickerRow label="Preferred game" value="9-Ball" icon="circle.grid.cross" onPress={() => {}} />
        <PickerRow label="Table size" value="9 ft" icon="rectangle" onPress={() => {}} />
        <PickerRow label="Handedness" value="Right" icon="hand.raised" onPress={() => {}} />
      </ListGroup>
    </Section>
  );
}

/* ── Chips ──────────────────────────────────────────────── */

function ChipsSection() {
  const s = useStyles();
  const [filter, setFilter] = useState('9-Ball');
  return (
    <Section title="Chips" gap="md">
      <View style={s.wrap}>
        <DifficultyChip level="beginner" />
        <DifficultyChip level="intermediate" />
        <DifficultyChip level="advanced" />
      </View>
      <View style={s.wrap}>
        <CategoryChip label="9-Ball" />
        <CategoryChip label="10-Ball" />
        <CompletedChip />
        <StatusChip status="inProgress" />
        <StatusChip status="notStarted" />
        <StatusChip status="failed" />
        <AppChip label="New" tone="accent" icon="sparkles" />
        <AppChip label="Hard" tone="warning" />
      </View>
      <View style={s.wrap}>
        {['All', '9-Ball', '10-Ball', 'Safety'].map((f) => (
          <SelectChip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
        ))}
      </View>
    </Section>
  );
}

/* ── Icons ──────────────────────────────────────────────── */

const sampleIcons = [
  'scope',
  'target',
  'flame',
  'chart.line.uptrend.xyaxis',
  'timer',
  'checkmark.seal',
] as const satisfies IconName[];

function IconsSection() {
  const t = useTheme();
  const s = useStyles();
  return (
    <Section title="Icons" caption="SF Symbols · color from tokens.">
      {(Object.keys(t.icon) as (keyof typeof t.icon)[]).map((size) => (
        <View key={size} style={s.scaleRow}>
          <AppText variant="caption" color="textSecondary" style={s.scaleLabel}>
            {size} · {t.icon[size]}
          </AppText>
          <View style={s.wrap}>
            {sampleIcons.map((n) => (
              <AppIcon key={n} name={n} size={size} color={size === 'xLarge' ? 'accentContent' : 'textPrimary'} />
            ))}
          </View>
        </View>
      ))}
    </Section>
  );
}

/* ── Motion ─────────────────────────────────────────────── */

function MotionSection() {
  const t = useTheme();
  return (
    <Section title="Motion" caption="Press any button above to feel press (120ms, scale 0.97).">
      <ListGroup>
        {Object.entries(t.motion.duration).map(([k, v]) => (
          <TokenRow key={k} name={`duration.${k}`} value={`${v}ms`} />
        ))}
        {Object.entries(t.motion.spring).map(([k, v]) => (
          <TokenRow key={k} name={`spring.${k}`} value={`${v.duration}ms · damping ${v.dampingRatio}`} />
        ))}
      </ListGroup>
    </Section>
  );
}

function TokenRow({ name, value }: { name: string; value: string }) {
  const s = useStyles();
  return (
    <View style={s.tokenRow}>
      <AppText variant="callout" style={s.flex}>
        {name}
      </AppText>
      <AppText variant="caption" color="textSecondary" tabular>
        {value}
      </AppText>
    </View>
  );
}

/* ── Pool domain ────────────────────────────────────────── */

function PoolSection() {
  const s = useStyles();
  return (
    <Section title="Pool Domain" caption="Separate from app identity. Table & ball drawings only.">
      <Grid columns={2}>
        {Object.entries(PoolColor).map(([k, v]) => (
          <Swatch key={k} name={k} value={v} />
        ))}
      </Grid>
      <View style={[s.felt, { backgroundColor: PoolColor.tableCloth, borderColor: PoolColor.tableRail }]}>
        <PoolBall cue size={32} />
        {(Object.keys(BallColor).map(Number) as BallNumber[]).map((n) => (
          <PoolBall key={n} number={n} size={32} />
        ))}
      </View>
    </Section>
  );
}

const useStyles = makeStyles((t) => ({
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: t.space.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: t.space.sm, alignItems: 'center' },
  swatch: { flexDirection: 'row', alignItems: 'center', gap: t.space.sm },
  swatchChip: {
    width: 40,
    height: 40,
    borderRadius: t.radius.medium,
    borderCurve: 'continuous',
    borderWidth: t.border.normal,
    borderColor: t.color.borderPrimary,
  },
  typeRow: { gap: t.space.xxs },
  scaleRow: { flexDirection: 'row', alignItems: 'center', gap: t.space.md },
  scaleLabel: { width: 96 },
  spaceBar: { height: t.space.xs, borderRadius: t.radius.pill, backgroundColor: t.color.accent },
  radiusItem: { alignItems: 'center', gap: t.space.xs },
  radiusBox: {
    width: 72,
    height: 72,
    borderCurve: 'continuous',
    backgroundColor: t.color.surfaceElevated,
    borderWidth: t.border.normal,
    borderColor: t.color.borderPrimary,
  },
  sampleBox: {
    width: 72,
    height: 72,
    borderRadius: t.radius.large,
    borderCurve: 'continuous',
    backgroundColor: t.color.surfacePrimary,
    borderWidth: t.border.strong,
    borderColor: t.color.borderSubtle,
  },
  selectableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: t.space.sm,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: t.layout.minTouchTarget,
    paddingHorizontal: t.space.md,
  },
  felt: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: t.space.sm,
    padding: t.space.lg,
    borderRadius: t.radius.large,
    borderWidth: t.space.xs,
  },
}));
