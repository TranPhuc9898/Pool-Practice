import { Text, View } from 'react-native';

import { useTheme } from '@/design-system';

import { BallColor, isStripe, PoolColor, type BallNumber } from './pool-colors';

type PoolBallProps = {
  number?: BallNumber;
  /** Bi cái — không số. */
  cue?: boolean;
  size?: number;
};

/** Bi vẽ bằng View — đủ cho icon, list, preview. Sơ đồ bàn sau này dùng Skia/SVG. */
export function PoolBall({ number, cue, size = 32 }: PoolBallProps) {
  const t = useTheme();
  const base = cue || !number ? PoolColor.cueBall : BallColor[number];
  const stripe = number != null && isStripe(number);
  const badge = size * 0.52;

  return (
    <View
      accessible
      accessibilityLabel={cue ? 'Cue ball' : `Ball ${number}`}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        backgroundColor: stripe ? PoolColor.cueBall : base,
        borderWidth: t.border.hairline,
        borderColor: t.color.borderPrimary,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {stripe && (
        <View style={{ position: 'absolute', left: 0, right: 0, height: size * 0.56, backgroundColor: base }} />
      )}
      {!cue && number != null && (
        <View
          style={{
            width: badge,
            height: badge,
            borderRadius: badge / 2,
            backgroundColor: PoolColor.cueBall,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: t.type.captionSmall.fontFamily,
              fontSize: badge * 0.62,
              lineHeight: badge * 0.8,
              color: PoolColor.ballInk,
            }}>
            {number}
          </Text>
        </View>
      )}
      {/* Điểm sáng nhẹ cho khối cầu — không skeuomorphic hơn thế. */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: size * 0.12,
          left: size * 0.2,
          width: size * 0.22,
          height: size * 0.14,
          borderRadius: size,
          backgroundColor: 'rgba(255,255,255,0.35)',
          transform: [{ rotate: '-25deg' }],
        }}
      />
    </View>
  );
}
