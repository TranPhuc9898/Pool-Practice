import type { ViewStyle } from 'react-native';

/**
 * Vật liệu và phản chiếu. Không có PNG, không có lib gradient:
 * mọi lớp là `experimental_backgroundImage` (radial/linear CSS) của RN New Arch, vẽ trên UI thread.
 *
 * Luật dùng: phản chiếu chỉ ở góc, cạnh, vùng số liệu, và trạng thái active/selected.
 * Không phủ cả card, không đặt sau chữ thân.
 */

export type MaterialName = 'flat' | 'graphite' | 'solid' | 'glass' | 'active';

export type ReflectionPosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'top' | 'bottom';

export type CardReflection = {
  position: ReflectionPosition;
  /** `r, g, b` — alpha tính từ `intensity`. */
  color: string;
  /** 0…1, alpha ở tâm vệt sáng. */
  intensity: number;
  /** Bán kính vệt sáng, pt. */
  radius: number;
  /** 0…1, độ nhoè mép. 0 là mép cứng, 1 là tan hết từ tâm. */
  blur: number;
};

const at: Record<ReflectionPosition, string> = {
  topLeft: '0% 0%',
  topRight: '100% 0%',
  bottomLeft: '0% 100%',
  bottomRight: '100% 100%',
  top: '50% 0%',
  bottom: '50% 100%',
};

/**
 * Một vệt sáng thành một radial-gradient. `blur` đẩy điểm giữa vào gần tâm.
 * Viết `ellipse r r` thay vì `circle r`: parser RN 0.86 đọc một kích thước xong thì nuốt luôn chữ `at`,
 * vị trí bị hiểu thành kích thước và vệt rơi về tâm card.
 */
export function reflectionLayer({ position, color, intensity, radius, blur }: CardReflection) {
  const mid = Math.round(60 - blur * 45);
  return (
    `radial-gradient(ellipse ${radius}px ${radius}px at ${at[position]}, ` +
    `rgba(${color}, ${intensity}) 0%, rgba(${color}, ${(intensity * 0.35).toFixed(3)}) ${mid}%, ` +
    `rgba(${color}, 0) 100%)`
  );
}

const WHITE = '255, 255, 255';
const GOLD = '201, 164, 92';

/** Vệt sáng dựng sẵn. Theme mono: chỉ còn ánh trắng, không màu. View chọn theo tên, không tự chế số. */
export const reflections = {
  /** Đèn bàn hắt vào góc trên trái: mọi card graphite. */
  edgeLight: { position: 'topLeft', color: WHITE, intensity: 0.07, radius: 220, blur: 0.6 },
  /** Cạnh trên sáng mảnh, cho cảm giác mép kim loại vát. */
  topSheen: { position: 'top', color: WHITE, intensity: 0.05, radius: 160, blur: 0.8 },
  /** Ánh trắng rất nhẹ bám đáy: card active / selected. */
  floorSheen: { position: 'bottom', color: WHITE, intensity: 0.05, radius: 260, blur: 0.7 },
  /** Ánh gold hắt góc dưới phải. Chỉ card hero của Home, một màn một cái. */
  goldCorner: { position: 'bottomRight', color: GOLD, intensity: 0.22, radius: 240, blur: 0.5 },
} as const satisfies Record<string, CardReflection>;

export type ReflectionName = keyof typeof reflections;

type MaterialSpec = {
  backgroundColor: string;
  borderColor: string;
  /** Lớp gradient dưới cùng của vật liệu, trước khi chồng phản chiếu. */
  base?: string;
  reflections: readonly ReflectionName[];
  shadow?: ViewStyle['boxShadow'];
};

const INK = '10, 10, 10';
const cardShadow = `0 1px 2px rgba(${INK}, 0.04), 0 10px 24px rgba(${INK}, 0.05)`;

/**
 * Light: `flat` xám lõm (locked). `graphite` card trắng nổi bằng bóng, viền gần như không thấy.
 * `solid` khối mực đen: bảng điểm và CTA, có đèn hắt góc. `glass` lớp nổi trên bàn. `active` card trắng viền mực.
 * Dark giữ nguyên bộ cũ để đổi theme một dòng.
 */
export const materials: Record<'light' | 'dark', Record<MaterialName, MaterialSpec>> = {
  light: {
    flat: {
      backgroundColor: '#EDEDED',
      borderColor: `rgba(${INK}, 0.04)`,
      reflections: [],
    },
    graphite: {
      backgroundColor: '#FFFFFF',
      borderColor: `rgba(${INK}, 0.05)`,
      reflections: [],
      shadow: cardShadow,
    },
    solid: {
      backgroundColor: '#0A0A0A',
      borderColor: '#0A0A0A',
      base: 'linear-gradient(180deg, #1C1C1C 0%, #0A0A0A 100%)',
      reflections: ['edgeLight'],
      shadow: `0 2px 4px rgba(${INK}, 0.08), 0 16px 32px rgba(${INK}, 0.18)`,
    },
    glass: {
      backgroundColor: 'rgba(255, 255, 255, 0.82)',
      borderColor: `rgba(${INK}, 0.06)`,
      reflections: [],
      shadow: `0 8px 24px rgba(${INK}, 0.08)`,
    },
    active: {
      backgroundColor: '#FFFFFF',
      borderColor: '#0A0A0A',
      reflections: [],
      shadow: cardShadow,
    },
  },
  dark: {
    flat: {
      backgroundColor: '#050505',
      borderColor: 'rgba(255, 255, 255, 0.06)',
      reflections: [],
    },
    graphite: {
      backgroundColor: '#0D0D0D',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      base: 'linear-gradient(180deg, #131313 0%, #0B0B0B 100%)',
      reflections: ['edgeLight'],
      shadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 12px 28px rgba(0, 0, 0, 0.6)',
    },
    solid: {
      backgroundColor: '#FFFFFF',
      borderColor: '#FFFFFF',
      base: 'linear-gradient(180deg, #FFFFFF 0%, #E6E6E6 100%)',
      reflections: [],
      shadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    },
    glass: {
      backgroundColor: 'rgba(13, 13, 13, 0.72)',
      borderColor: 'rgba(255, 255, 255, 0.10)',
      reflections: ['topSheen'],
      shadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
    },
    active: {
      backgroundColor: '#0D0D0D',
      borderColor: 'rgba(255, 255, 255, 0.85)',
      base: 'linear-gradient(180deg, #161616 0%, #0B0B0B 100%)',
      reflections: ['floorSheen', 'edgeLight'],
      shadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 12px 28px rgba(0, 0, 0, 0.6)',
    },
  },
};

/** Style đầy đủ của một vật liệu, kèm phản chiếu thêm (thứ tự: phản chiếu trên, base dưới). */
export function materialStyle(
  name: MaterialName,
  extra: readonly ReflectionName[] = [],
  scheme: 'light' | 'dark' = 'light',
): ViewStyle {
  const m = materials[scheme][name];
  const layers = [...extra, ...m.reflections].map((r) => reflectionLayer(reflections[r]));
  if (m.base) layers.push(m.base);
  return {
    backgroundColor: m.backgroundColor,
    borderColor: m.borderColor,
    ...(layers.length > 0 && { experimental_backgroundImage: layers.join(', ') }),
    ...(m.shadow && { boxShadow: m.shadow }),
  };
}

/**
 * Dải sáng quét ngang card hero: trắng pha gold, tan hai mép. Vẽ dọc, view tự nghiêng và dời.
 * Dùng với `mixBlendMode: 'screen'` để chỉ làm sáng, không phủ xám lên nội dung.
 */
export const sheenSweep =
  'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.025) 30%, ' +
  `rgba(255, 255, 255, 0.09) 47%, rgba(${GOLD}, 0.13) 51%, rgba(255, 255, 255, 0.03) 66%, rgba(255, 255, 255, 0) 100%)`;

/** Token của dot-matrix. Chữ số 5×7 chấm, đo bằng pt. */
export const dotMatrix = {
  /** Số trong vòng nhỏ (ring 54pt): "1/1". */
  xs: { dotSize: 1.5, dotSpacing: 0.8, glyphGap: 2.5 },
  sm: { dotSize: 2.5, dotSpacing: 1.25, glyphGap: 2.5 },
  md: { dotSize: 3.5, dotSpacing: 1.5, glyphGap: 3.5 },
  lg: { dotSize: 5, dotSpacing: 2, glyphGap: 5 },
  xl: { dotSize: 7, dotSpacing: 2.5, glyphGap: 7 },
  /** Chấm tắt ẩn hẳn, chỉ còn nét số. */
  inactiveOpacity: 0,
  activeOpacity: 1,
  glowRadius: 6,
} as const;

export type DotMatrixSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const HOME_GOLD = '216, 180, 81';

/**
 * Mép vát mềm thay cho viền 1px: sáng mỏng ở cạnh trên, tối loang ở cạnh dưới, quầng trong theo màu ô.
 * Viền 1px chạy quanh góc squircle thành nét cứng, nhìn như dán sticker; vát thì góc tự tan vào nền.
 */
const bevel = (rim: string, glow: string) =>
  `inset 0 1.5px 1px ${rim}, inset 0 -3px 10px rgba(0, 0, 0, 0.45), inset 0 0 28px ${glow}, ` +
  'inset 0 0 0 0.5px rgba(255, 255, 255, 0.035)';

/**
 * Bề mặt riêng của Home (Black Precision). Mỗi ô một lớp nền, không dùng chung: tím cho Fundamentals,
 * indigo cho Position Play, graphite cho phần còn lại. Gold đặc chỉ ở CTA, ánh gold chỉ góc dưới phải hero.
 */
export const homeSurfaces = {
  hero: {
    backgroundColor: '#0E0E0E',
    experimental_backgroundImage:
      `radial-gradient(ellipse 320px 260px at 100% 100%, rgba(${HOME_GOLD}, 0.30) 0%, rgba(${HOME_GOLD}, 0.09) 42%, rgba(${HOME_GOLD}, 0) 100%), ` +
      'radial-gradient(ellipse 240px 200px at 0% 0%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 100%), ' +
      'linear-gradient(170deg, #161616 0%, #0E0E0E 50%, #090909 100%)',
    boxShadow: `${bevel('rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.025)')}, 0 18px 36px rgba(0, 0, 0, 0.6)`,
  },
  cta: {
    backgroundColor: '#C9A44A',
    experimental_backgroundImage: 'linear-gradient(180deg, #DDB955 0%, #C29C40 100%)',
    boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.32), inset 0 -1px 0 rgba(0, 0, 0, 0.18), 0 10px 24px rgba(${HOME_GOLD}, 0.10)`,
  },
  graphiteTile: {
    backgroundColor: '#121212',
    experimental_backgroundImage:
      'radial-gradient(ellipse 170px 140px at 18% 8%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 72%), ' +
      'linear-gradient(160deg, #1D1D1D 0%, #121212 55%, #0A0A0A 100%)',
    boxShadow: `${bevel('rgba(255, 255, 255, 0.13)', 'rgba(255, 255, 255, 0.03)')}, 0 14px 28px rgba(0, 0, 0, 0.55)`,
  },
  purplePill: {
    backgroundColor: '#18101B',
    experimental_backgroundImage:
      'radial-gradient(ellipse 210px 170px at 0% 0%, rgba(150, 98, 160, 0.42) 0%, rgba(150, 98, 160, 0) 70%), ' +
      'radial-gradient(ellipse 200px 180px at 100% 100%, rgba(92, 48, 104, 0.35) 0%, rgba(92, 48, 104, 0) 70%), ' +
      'linear-gradient(150deg, #2B1C30 0%, #18101B 55%, #0E0A10 100%)',
    boxShadow: bevel('rgba(232, 196, 240, 0.26)', 'rgba(140, 88, 152, 0.24)'),
  },
  indigoPill: {
    backgroundColor: '#0C0C17',
    experimental_backgroundImage:
      'radial-gradient(ellipse 240px 150px at 50% 120%, rgba(88, 84, 176, 0.5) 0%, rgba(60, 54, 130, 0.18) 55%, rgba(60, 54, 130, 0) 82%), ' +
      'linear-gradient(180deg, #08080F 0%, #10101F 100%)',
    boxShadow: bevel('rgba(196, 192, 255, 0.22)', 'rgba(96, 90, 190, 0.22)'),
  },
  quickTile: {
    backgroundColor: '#0F0F0F',
    experimental_backgroundImage:
      'radial-gradient(ellipse 120px 90px at 0% 0%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 70%), ' +
      'linear-gradient(160deg, #171717 0%, #0F0F0F 55%, #0A0A0A 100%)',
    boxShadow: `${bevel('rgba(255, 255, 255, 0.11)', 'rgba(255, 255, 255, 0.025)')}, 0 14px 28px rgba(0, 0, 0, 0.55)`,
  },
  /** Màu nét, không phải nền. */
  ink: {
    gold: `rgb(${HOME_GOLD})`,
    title: '#ECEAEE',
    body: 'rgba(236, 234, 238, 0.55)',
    meta: 'rgba(236, 234, 238, 0.58)',
    faint: 'rgba(236, 234, 238, 0.32)',
    tickOff: 'rgba(255, 255, 255, 0.12)',
    tickPast: 'rgba(236, 234, 238, 0.6)',
    ctaText: '#0A0A0A',
  },
} as const satisfies Record<string, ViewStyle | Record<string, string>>;
