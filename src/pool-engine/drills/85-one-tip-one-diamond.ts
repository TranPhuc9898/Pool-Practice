import type { PoolDrill } from '../types';

/**
 * 1 Tip = 1 Diamond, bước phê sau băng của chuỗi Ép phê (`docs/quyet-dinh/2026-10-25-muc-tieu-va-chu-de-pool.md`),
 * luật #58 trong `docs/research/nguon/2026-10-25-nguon-messenger-bida.md`: mỗi tip phê dời chỗ bi cái tới băng đối diện
 * khoảng 1 diamond. Chỉ bi cái: ngắm băng dài trái ở 78" (tính từ foot), bi cái chạm băng trái rồi về băng phải. Ba round
 * tip giữa, ½ tip, 1 tip phê thuận (tipX 0, 0.22, 0.44). Lực và zone dò bằng `ShotPhysics` theo đúng cú Play
 * (`soloReplay`: ngắm thẳng điểm băng, không bù squirt): lực 1.05/1.05/1.0, bi cái dừng ở 5.5, 5.3, 4.4 diamond tính từ
 * foot. Lực 2.1/1.85/1.7 cũ của `drill85()` làm bi cái giữa và 1 tip rơi lỗ giữa phải. Chưa đo lại rate.
 * Engine chưa có swerve, cơ nằm ngang.
 */
export const oneTipOneDiamond = {
  id: '85',
  number: 85,
  title: '1 Tip = 1 Diamond',
  subtitle: 'Cue ball only, one rail across the table. Watch how far each tip of running english moves the landing spot. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'english',
  skillLabel: 'English',
  difficulty: 3,
  objective: 'Send the cue ball off the left long rail to stop near the right long rail, with center ball, half a tip and one tip of running english, three shots each.',
  cueBall: { x: 0.8, y: 0.875 },
  objectBalls: [],
  targetPocket: 'footLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.95, y: 0.682 }, radius: 0.125, label: 'Center' },
    { kind: 'circle', center: { x: 0.972, y: 0.662 }, radius: 0.125, label: '½ tip' },
    { kind: 'circle', center: { x: 0.924, y: 0.555 }, radius: 0.125, label: '1 tip' },
  ],
  // Ngắm băng trái ở 78", đúng hướng của `drill85()` trong harness.
  guideLines: [{ kind: 'expectedCuePath', points: [{ x: 0.8, y: 0.875 }, { x: 0, y: 0.78 }] }],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 2,
  attemptCount: 9,
  passCondition: { kind: 'inZone', required: 5 },
  tips: [
    'Keep the same aim on every round: the left long rail about 1¾ diamonds from the head rail. Only the tip and the pace change.',
    'Right english is running english here. It opens the angle off the rail and sends the cue ball further toward the foot.',
    'The common rule says one tip moves the cue ball about one diamond. In this simulation half a tip moves it 1.7 diamonds and one tip 3.2, so trust the zones, not the rule.',
    'Side spin costs pace. The english rounds need a little less speed than center ball to stop at the rail, not more.',
  ],
  mistakes: [
    'Changing the aim to chase the zone. Hold the aim and let the english do the moving.',
    'Hitting harder with english "to make it work": the cue ball runs past the zone along the rail.',
    'Using the one-diamond rule from memory on this table: the landing spot moves much further than that.',
  ],
  rounds: [
    {
      title: 'Center ball',
      zone: 0,
      spin: 'center',
      cueBall: { x: 0.8, y: 0.875 },
      contactPoint: { x: 0, y: 0 },
      speed: 1.05,
      why: 'Baseline: center ball off the left rail stops on the right rail 5.5 diamonds from the foot rail.',
    },
    {
      title: 'Half tip running',
      zone: 1,
      spin: 'center',
      cueBall: { x: 0.8, y: 0.875 },
      contactPoint: { x: 0.22, y: 0 },
      speed: 1.05,
      why: 'Half a tip of running english, same aim and speed: it stops only 2 inches further down. Half a tip is not enough to see a diamond.',
    },
    {
      title: 'One tip running',
      zone: 2,
      spin: 'center',
      cueBall: { x: 0.8, y: 0.875 },
      contactPoint: { x: 0.44, y: 0 },
      speed: 1,
      why: 'One tip lands 4.4 diamonds from the foot rail, about one diamond past center. The rule of thumb holds here.',
    },
  ],
} satisfies PoolDrill;
