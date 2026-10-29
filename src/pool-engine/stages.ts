import type { PoolDrill } from './types';

/**
 * Giai đoạn giáo trình. Việt Nam không có thang hạng chính thức, nên `sabo` chỉ là hạng tham khảo trên bảng ELO của
 * SABO Arena (K 1000 … C 1900+), không phải hạng người chơi đạt được khi qua giai đoạn.
 * Nguồn: `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`.
 */
export type Stage = {
  stage: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  sabo: string;
  /** Mốc qua, đo được trên bàn. */
  benchmark: string;
  /** Số drill làm bài kiểm qua giai đoạn. */
  gate: number;
};

export const STAGES: Stage[] = [
  { stage: 1, title: 'Foundations', sabo: 'K–I', benchmark: 'Ten straight-ins in a row', gate: 32 },
  { stage: 2, title: 'Club', sabo: 'H–H+', benchmark: 'Follow and draw to a set zone, 3–4 balls a run', gate: 51 },
  { stage: 3, title: 'Craftsman', sabo: 'G–G+', benchmark: '4–5 balls a run, cuts and short banks', gate: 76 },
  { stage: 4, title: 'Advanced', sabo: 'F', benchmark: '6–7 balls a run, basic safeties', gate: 78 },
  { stage: 5, title: 'Expert', sabo: 'E–D', benchmark: 'Runs out a 9-ball rack in 3 of 10 tries', gate: 81 },
  { stage: 6, title: 'Pro', sabo: 'C', benchmark: 'Call-pocket 10-ball runouts, controlled break', gate: 80 },
];

/** Drill lệch khỏi giai đoạn suy từ `difficulty`, theo số drill. */
const OVERRIDE: Record<number, Stage['stage']> = {
  7: 2, // tiếp tuyến bằng stun là khái niệm đầu tiên của chạy bi, đi liền stop/follow/draw
  13: 2, // ba bi đúng phía, khớp mốc 3–4 bi một lượt của giai đoạn 2
  24: 2, // đọc đường bi cái lăn tự nhiên, nền cho mọi bài Position sau
  30: 4, // break đánh vào giữa bàn đi cùng break 29 ở giai đoạn 4
  43: 4, // cắt bi dính băng ở mọi diamond khó hơn mốc cắt cơ bản của giai đoạn 3
  48: 4, // throw bằng bi dính cặp cần hiểu phê, đi cùng chuỗi phê 82–86
  55: 4, // về nhà từ sáu lỗ là kiểm soát lực toàn bàn, mức 6–7 bi một lượt
  59: 4, // safety kẹp bi 9, giai đoạn 4 mới vào safety cơ bản
  60: 4, // snooker sau cụm bi, như trên
  64: 4, // kick một băng là bài thoát safety, đi cùng safety giai đoạn 4
  65: 4, // kick một băng sát bi, như trên
  66: 4, // bank chéo sang lỗ giữa dài hơn bank ngắn của giai đoạn 3
  67: 4, // bank chéo năm vị trí bi cái, như trên
  82: 4, // chuỗi phê đo NPL, squirt, throw, phê sau băng đi liền 86
  83: 4,
  84: 4,
  85: 4,
  71: 6,
  80: 6,
  92: 6,
  93: 6,
  94: 6,
  95: 6,
  96: 6,
  104: 6, // bài vá giai đoạn 6, difficulty chỉ tới 5
  105: 6,
  106: 6,
  107: 6,
  108: 6,
  111: 6, // kick 2 băng theo hệ trừ, ô Kicks · C
  122: 6, // Compact Play 15 bi, ô Patterns · C
};

/** Giai đoạn 1–5 bám `difficulty` 1–5; giai đoạn 6 chỉ có qua `OVERRIDE`. */
export function stageOf(drill: PoolDrill): Stage {
  return STAGES[(OVERRIDE[drill.number] ?? drill.difficulty) - 1];
}

/**
 * Giáo trình mỗi giai đoạn, theo id drill: Fundamentals, Cue Ball Control, Position Play, Patterns, bài kiểm `gate`
 * đứng cuối. Đích là 12 bài, đủ 4 nhóm, mỗi nhóm ít nhất 2; giai đoạn còn thiếu thì drill-lint báo.
 */
export const CURRICULUM: Record<Stage['stage'], readonly string[]> = {
  1: ['01', '33', '34', '36', '02', '49', '99', '97', '98', '35', '74', '32'],
  2: ['37', '38', '41', '03', '04', '05', '50', '07', '24', '13', '70', '51'],
  3: ['22', '18', '27', '06', '53', '26', '57', '58', '12', '23', '15', '76'],
  4: ['19', '28', '68', '54', '25', '56', '08', '09', '11', '14', '29', '78'],
  5: ['20', '89', '100', '101', '102', '103', '10', '88', '17', '87', '91', '81'],
  6: ['104', '105', '106', '107', '93', '94', '108', '95', '92', '96', '71', '80'],
};

/** Số 01…12 của drill trong giáo trình giai đoạn của nó, `undefined` khi drill nằm ngoài giáo trình. */
export function stageNumberIn(drill: PoolDrill): string | undefined {
  const i = CURRICULUM[stageOf(drill).stage].indexOf(drill.id);
  return i < 0 ? undefined : String(i + 1).padStart(2, '0');
}
