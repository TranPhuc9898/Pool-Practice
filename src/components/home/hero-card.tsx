import { router } from 'expo-router';
import { View } from 'react-native';

import { AppText, homeSurfaces, makeStyles, PressableScale } from '@/design-system';
import type { PoolDrill } from '@/pool-engine/types';

import { ProgramGauge } from './program-gauge';
import { SheenSweep } from './sheen-sweep';

const RADIUS = 24;

export type HeroCardProps = {
  drill: PoolDrill;
  /** Tên program, hoặc "First program" cho người mới. */
  eyebrow: string;
  cta: string;
  gauge: { total: number; focus: number; passed: (seg: number) => boolean; caption: string };
  accessibilityLabel: string;
};

/**
 * Card hero: một nút cả card. Chỗ duy nhất của màn có gold đặc (CTA) và ánh gold (góc dưới phải).
 * Grain của mockup bỏ: RN không có feTurbulence, cần PNG noise mà ở 0.12 opacity gần như không thấy.
 */
export function HeroCard({ drill, eyebrow, cta, gauge, accessibilityLabel }: HeroCardProps) {
  const s = useStyles();
  return (
    <PressableScale
      onPress={() => router.push(`/drill/${drill.number}`)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[s.card, homeSurfaces.hero]}>
      <AppText variant="eyebrow" color="textTertiary" style={s.eyebrow}>
        {eyebrow}
      </AppText>

      <ProgramGauge {...gauge} />

      <View style={s.text}>
        <AppText variant="heroTitle" align="center" style={s.title}>
          {drill.title}
        </AppText>
        <AppText variant="callout" align="center" numberOfLines={2} style={s.body}>
          {drill.subtitle}
        </AppText>
      </View>

      <View style={[s.cta, homeSurfaces.cta]}>
        <AppText variant="button" style={s.ctaText}>
          {cta}
        </AppText>
      </View>

      <SheenSweep radius={RADIUS} />
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  card: {
    borderRadius: RADIUS,
    borderCurve: 'continuous',
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 6,
  },
  eyebrow: { letterSpacing: 1.2 },
  text: { alignItems: 'center', gap: t.space.xs, marginTop: 18 },
  title: { color: homeSurfaces.ink.title },
  body: { color: homeSurfaces.ink.body, fontFamily: t.type.body.fontFamily, maxWidth: 300 },
  cta: {
    height: 56,
    borderRadius: 14,
    borderCurve: 'continuous',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: homeSurfaces.ink.ctaText, textTransform: 'uppercase', letterSpacing: 1.2 },
}));
