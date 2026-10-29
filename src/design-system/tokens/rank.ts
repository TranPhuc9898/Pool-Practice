/**
 * Màu hạng H … PRO. Thang đi từ lạnh và trầm (H–F) qua xanh, chàm, tím (E–C+) lên đỏ thẫm, ruby, vàng (B−–PRO).
 * Nền app vẫn là mono dark của `color.ts`; gradient hạng chỉ dùng cho badge, trạng thái chọn, thanh tiến độ và hero
 * của hạng. Không tô nền màn, không tô card drill, không tô chữ thân bài.
 *
 * Mỗi hạng có:
 * - `stops`: gradient 135°, tối → sáng. Stop đầu luôn gần đen để badge chìm vào nền, chỉ mép sáng phát màu.
 * - `glow`: màu hắt quanh badge đang chọn, dùng ở alpha thấp (≤ 0.35). Không neon.
 * - `ink`: màu chữ/hạt màu của hạng trên nền đen. Contrast trên #0D0D0D ≥ 4.5:1.
 */
export const RANKS = ['H', 'G', 'F', 'E', 'D', 'C-', 'C+', 'B-', 'B+', 'A-', 'A+', 'PRO'] as const;
export type Rank = (typeof RANKS)[number];

export type RankTone = {
  /** Nhãn hiển thị, dấu trừ thật (U+2212) thay gạch nối. */
  label: string;
  stops: readonly string[];
  glow: string;
  ink: string;
};

export const rankTone: Record<Rank, RankTone> = {
  // Lạnh và trầm: graphite → thép → thép xanh.
  H: { label: 'H', stops: ['#15181C', '#262B32', '#4A5361'], glow: '#6B7785', ink: '#9AA4B2' },
  G: { label: 'G', stops: ['#141920', '#232E3B', '#4E6178'], glow: '#7F93AA', ink: '#A2B3C7' },
  F: { label: 'F', stops: ['#101823', '#1C2F44', '#46698D'], glow: '#7FA3C7', ink: '#94B6D8' },
  // Giữa: xanh sâu → chàm → tím.
  E: { label: 'E', stops: ['#0D152C', '#1A2C59', '#3B61AD'], glow: '#6E92E0', ink: '#8CAAEB' },
  D: { label: 'D', stops: ['#0F102A', '#232864', '#4C52BE'], glow: '#7F84F0', ink: '#9EA2F5' },
  'C-': { label: 'C−', stops: ['#130F2A', '#2C2366', '#5E4EC6'], glow: '#9083F2', ink: '#AFA5F6' },
  'C+': { label: 'C+', stops: ['#170D28', '#371D61', '#7643C6'], glow: '#A57CF0', ink: '#C0A3F5' },
  // Cao: mận → đỏ thẫm → ruby → ruby ánh vàng.
  'B-': { label: 'B−', stops: ['#1B0B22', '#431853', '#8A389B'], glow: '#C06FCE', ink: '#D59BE0' },
  'B+': { label: 'B+', stops: ['#1F0A12', '#531426', '#A0253E'], glow: '#D9546B', ink: '#EB8C9C' },
  'A-': { label: 'A−', stops: ['#21070D', '#60101E', '#B51D34'], glow: '#E8485F', ink: '#F2909D' },
  'A+': { label: 'A+', stops: ['#200909', '#5B1913', '#B0502A', '#D9A24A'], glow: '#E7B25C', ink: '#EDC27E' },
  // Đỉnh: đen tuyền, vàng chỉ ở mép.
  PRO: { label: 'PRO', stops: ['#050505', '#16120A', '#8A6A2A', '#E6C77A'], glow: '#C9A45C', ink: '#E6C77A' },
};

/** `linear-gradient` cho `experimental_backgroundImage`. */
export const rankGradient = (rank: Rank, angle = 135) => {
  const { stops } = rankTone[rank];
  const step = 100 / (stops.length - 1);
  return `linear-gradient(${angle}deg, ${stops.map((c, i) => `${c} ${Math.round(i * step)}%`).join(', ')})`;
};

/** Viền mảnh và hắt sáng quanh phần tử đang chọn. Alpha cố định thấp để không thành neon. */
export const rankEdge = (rank: Rank) => `${rankTone[rank].glow}59`;
export const rankGlow = (rank: Rank, blur = 24) => `0 0 ${blur}px ${rankTone[rank].glow}40`;
