import * as Clipboard from 'expo-clipboard';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useCallback, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AimReadout,
  FooterNav,
  GoldAction,
  GraphiteAction,
  GuideToggles,
  Scoreboard,
  SpecStrip,
  ViewSwitch,
} from '@/components/drill/drill-ui';
import { areaOf, drillsIn } from '@/components/home/training-areas';
import { AppText, homeSurfaces, IconButton, makeStyles, SecondaryButton, useGutter } from '@/design-system';
import { aimOf, fullnessLabel } from '@/pool-engine/aim';
import { DRILLS, drillByNumber } from '@/pool-engine/drills';
import { drillStatus, passes, recordAttempt, resetDrill, startDrill, useDrillProgress } from '@/pool-engine/progress';
import type { PoolDrill } from '@/pool-engine/types';

import { PoolAimView, PoolTableView, type BallMoveEvent } from '../../../modules/pool-table';

const spinLabel: Record<PoolDrill['recommendedSpin'], string> = {
  center: 'Center',
  stun: 'Stun',
  follow: 'Follow',
  draw: 'Draw',
};

/** Tổng cả băng: 61" × 111". Khung bàn giữ đúng tỉ lệ này thì native không chừa dải trống. */
const TABLE_ASPECT = 111 / 61;

type GuideKey = 'showGhostBall' | 'showTangentLine' | 'showCuePath' | 'showTarget';
const GUIDES: { key: GuideKey; label: string }[] = [
  { key: 'showGhostBall', label: 'Ghost' },
  { key: 'showTangentLine', label: 'Tangent' },
  { key: 'showCuePath', label: 'Path' },
  { key: 'showTarget', label: 'Target' },
];

type Mode = 'table' | 'aim';
const MODES: { key: Mode; label: string }[] = [
  { key: 'table', label: 'Table' },
  { key: 'aim', label: 'Aim' },
];

const pad = (n: number) => String(n).padStart(2, '0');

export default function DrillScreen() {
  // `debug=1` bật lưới hình học, `w=<pt>` ép bề rộng container để kiểm tỉ lệ, `guide=0` tắt guide,
  // `dev=1` (chỉ bản dev) kéo bi + Copy JSON để soạn toạ độ drill, `view=aim` mở thẳng góc ngắm.
  const { id, debug, w, guide, dev, view } = useLocalSearchParams<{
    id: string;
    debug?: string;
    w?: string;
    guide?: string;
    dev?: string;
    view?: string;
  }>();
  const s = useStyles();
  const gutter = useGutter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const landscape = windowWidth > windowHeight;
  const [showInfo, setShowInfo] = useState(false);
  const [picked, setMode] = useState<Mode>();
  const mode = picked ?? (view === 'aim' ? 'aim' : 'table');
  const devMode = __DEV__ && dev === '1';
  const [guides, setGuides] = useState<Record<GuideKey, boolean>>({
    showGhostBall: true,
    showTangentLine: true,
    showCuePath: true,
    showTarget: true,
  });
  const [moves, setMoves] = useState<{
    drillId: string;
    balls: Record<number, BallMoveEvent>;
  }>();

  // Cả app khoá dọc (initialOrientation); chỉ màn bàn được xoay ngang, rời màn thì khoá lại.
  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.unlockAsync();
      return () => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      };
    }, []),
  );

  const width = w ? Number(w) : undefined;
  const drill = drillByNumber(Number(id)) ?? DRILLS[0];
  const progress = useDrillProgress(drill.id);
  const area = areaOf(drill);
  const program = drillsIn(area.id);

  // Bi đã kéo đè lên data gốc, để guide vẽ lại theo chỗ mới. Đổi drill thì bỏ. React Compiler tự memo.
  const balls = moves?.drillId === drill.id ? moves.balls : undefined;
  const at = (n: number, p: { x: number; y: number }) => (balls?.[n] ? { x: balls[n].x, y: balls[n].y } : p);
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
      JSON.stringify({ cueBall: tableDrill.cueBall, objectBalls: tableDrill.objectBalls }, null, 2),
    );
  const status = drillStatus(drill, progress);
  const done = progress.attempts.length;
  const total = drill.attemptCount;
  const required = drill.passCondition.required;
  const finished = !progress.started && done === total;
  const rounds = drill.rounds;
  const round = rounds?.[Math.min(Math.floor(done / (total / rounds.length)), rounds.length - 1)];
  const caption = progress.started
    ? `${round ? `${round.title} · ` : ''}Shot ${Math.min(done + 1, total)} of ${total}`
    : finished
      ? 'Last session'
      : `${total} shots`;

  // Prev/Next đổi param tại chỗ: bàn native giữ nguyên, chỉ data drill đổi.
  const go = (n: number) => router.setParams({ id: String(n) });

  const aim = aimOf(tableDrill);
  const showAim = mode === 'aim' && aim !== null;

  const table = (
    <View style={[s.tableCard, homeSurfaces.graphiteTile, landscape && s.tableCardLandscape]}>
      {showAim ? (
        <>
          <PoolAimView drill={tableDrill} style={[landscape ? s.flex : s.tablePortrait, s.aim]} />
          <AimReadout
            items={[
              {
                label: 'CUT',
                value: aim.cutDeg === 0 ? 'Straight' : `${aim.cutDeg}°`,
              },
              { label: 'HIT', value: fullnessLabel(aim.fullness) },
              {
                label: 'CONTACT',
                value: aim.side === 'straight' ? 'Center' : aim.side === 'right' ? 'Right side' : 'Left side',
              },
            ]}
          />
        </>
      ) : (
        <PoolTableView
          style={[landscape ? s.flex : s.tablePortrait, width ? { width, alignSelf: 'center' } : null]}
          drill={tableDrill}
          showGeometry={debug === '1'}
          showGuide={guide !== '0'}
          {...guides}
          devMode={devMode}
          onBallMove={onBallMove}
        />
      )}
    </View>
  );

  const aimSwitch = aim && <ViewSwitch items={MODES} value={mode} onChange={setMode} />;

  const panel = (
    <>
      <View style={s.heading}>
        <AppText variant="eyebrow" color="textTertiary" style={s.eyebrow}>
          {area.title} · {pad(program.indexOf(drill) + 1)}/{pad(program.length)}
        </AppText>
        <AppText variant="heroTitle" accessibilityRole="header" style={s.title}>
          {drill.title}
        </AppText>
      </View>

      {showInfo ? (
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
        </View>
      ) : (
        <View style={s.copy}>
          <AppText variant="tileTitle" style={s.title}>
            {drill.objective}
          </AppText>
          <AppText variant="callout" style={s.body}>
            {drill.subtitle}
          </AppText>
          {drill.steps && (
            <AppText variant="monoSmall" color="textTertiary">
              {drill.steps.map((step) => `${step.label} ${step.caption}`).join('  ·  ')}
            </AppText>
          )}
        </View>
      )}

      <SpecStrip
        items={[
          { label: 'Spin', value: spinLabel[drill.recommendedSpin] },
          {
            label: 'Speed',
            value: drill.recommendedSpeed.charAt(0).toUpperCase() + drill.recommendedSpeed.slice(1),
          },
          { label: 'Pass', value: `${required} of ${total}` },
        ]}
      />

      <GuideToggles items={GUIDES} value={guides} onToggle={(k) => setGuides((v) => ({ ...v, [k]: !v[k] }))} />

      {devMode && <SecondaryButton title="Copy JSON" icon="doc.on.doc" size="medium" fullWidth onPress={copyJson} />}

      <Scoreboard
        attempts={progress.attempts}
        total={total}
        passed={passes(progress)}
        required={required}
        isPassed={status === 'passed'}
        caption={caption}
      />

      {progress.started ? (
        <View style={s.row}>
          <GoldAction
            title="Pass"
            icon="checkmark"
            haptic="light"
            style={s.flex}
            onPress={() => recordAttempt(drill, 'pass')}
          />
          <GraphiteAction title="Miss" icon="xmark" style={s.flex} onPress={() => recordAttempt(drill, 'fail')} />
        </View>
      ) : (
        <GoldAction
          title={finished ? 'Go again' : 'Start drill'}
          icon="play.fill"
          haptic="medium"
          onPress={() => startDrill(drill.id)}
        />
      )}

      <FooterNav
        canPrev={drill.number > 1}
        canNext={drill.number < DRILLS.length}
        onPrev={() => go(drill.number - 1)}
        onReset={() => resetDrill(drill.id)}
        onNext={() => go(drill.number + 1)}
      />
    </>
  );

  return (
    <View style={[s.root, landscape && s.rootLandscape, landscape && { paddingHorizontal: gutter }]}>
      <Stack.Screen
        options={{
          // Tên drill nằm trong nội dung, thanh trên chỉ giữ back và info.
          title: '',
          headerLargeTitleEnabled: false,
          headerRight: () => (
            <IconButton
              icon={showInfo ? 'info.circle.fill' : 'info.circle'}
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
          <View style={[s.flex, s.tableColumn]}>
            {aimSwitch}
            {table}
          </View>
          <ScrollView style={s.panelLandscape} contentContainerStyle={s.panel} showsVerticalScrollIndicator={false}>
            {panel}
          </ScrollView>
        </>
      ) : (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={[s.panel, { paddingHorizontal: gutter, paddingBottom: insets.bottom + 16 }]}>
          {aimSwitch}
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
    flexDirection: 'row',
    gap: t.space.md,
    paddingBottom: t.space.md,
  },
  flex: { flex: 1 },
  tableCard: { borderRadius: 24, borderCurve: 'continuous', padding: 8 },
  tableCardLandscape: { flex: 1 },
  tablePortrait: { width: '100%', aspectRatio: TABLE_ASPECT },
  tableColumn: { gap: t.space.sm },
  aim: { borderRadius: 16, borderCurve: 'continuous', overflow: 'hidden' },
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
    borderCurve: 'continuous',
    padding: 16,
  },
  row: { flexDirection: 'row', gap: 10 },
}));
