import { stageOf } from './stages';
import type { PoolDrill, TrainingLevel } from './types';

export const LEVELS: readonly TrainingLevel[] = ['H', 'G', 'F', 'E', 'D', 'C-', 'C+', 'B-', 'B+', 'A-', 'A+', 'PRO'];

/**
 * Mốc của mỗi hạng, đo được trên bàn, cùng kiểu `STAGES.benchmark`. Người chơi đọc lướt và dừng ở câu đầu tiên mình
 * chưa làm được. Đây là phán đoán giáo trình, chưa có nguồn quy đổi hạng chính thức.
 */
export const LEVEL_BENCHMARK: Record<TrainingLevel, string> = {
  H: 'Ten straight-ins in a row, cue ball stops dead',
  G: 'Easy cuts, stop and follow on demand',
  F: 'Thin cuts and draw a diamond back',
  E: 'Follow and draw to a set zone at three speeds',
  D: 'One-rail position and one-rail kicks',
  'C-': 'Three-ball patterns and simple banks',
  'C+': 'Five-ball runs and basic safeties',
  'B-': 'Two-rail kicks, long banks, tight safeties',
  'B+': 'Runs out a 9-ball rack in 3 of 10 tries',
  'A-': 'Wins the safety battle and the push-out',
  'A+': 'Call-pocket 10-ball runouts, controlled break',
  PRO: 'Runs racks under match pressure',
};

/** Hạng của drill chưa có trong `LEVEL_BY_NUMBER`: hạng thấp của cặp ứng với giai đoạn. */
const LEVEL_BY_STAGE: readonly TrainingLevel[] = ['H', 'F', 'D', 'C+', 'B+', 'A+'];

/**
 * Hạng theo số drill, gán theo kỹ năng của bài rồi chỉnh theo độ khó thực tế. Bảng duyệt ở
 * `plans/reports/levels-261029-bang-hang-124-drill.md`. Thêm drill mới thì thêm dòng ở đây.
 */
const LEVEL_BY_NUMBER: Record<number, TrainingLevel> = {
  // H: cú thẳng, spot, stop gần, lực nhẹ.
  1: 'H',
  2: 'H',
  32: 'H',
  33: 'H',
  36: 'H',
  49: 'H',
  99: 'H',
  // G: cắt dễ, stop/follow theo ý, vùng bi cái rộng, RDS nhập môn.
  3: 'G',
  34: 'G',
  35: 'G',
  37: 'G',
  38: 'G',
  39: 'G',
  40: 'G',
  41: 'G',
  74: 'G',
  97: 'G',
  98: 'G',
  // F: cắt mỏng, draw, tiếp tuyến, lực theo nấc.
  5: 'F',
  7: 'F',
  21: 'F',
  22: 'F',
  24: 'F',
  42: 'F',
  44: 'F',
  45: 'F',
  46: 'F',
  50: 'F',
  51: 'F',
  70: 'F',
  // E: khoảng cách follow/draw, lực tới zone, break chính xác, bi đúng phía.
  4: 'E',
  6: 'E',
  8: 'E',
  13: 'E',
  29: 'E',
  30: 'E',
  47: 'E',
  52: 'E',
  53: 'E',
  56: 'E',
  75: 'E',
  109: 'E',
  114: 'E',
  // D: wagon wheel, rail cut, kick một băng, điều bi một băng, đo NPL.
  9: 'D',
  11: 'D',
  18: 'D',
  25: 'D',
  26: 'D',
  43: 'D',
  54: 'D',
  55: 'D',
  64: 'D',
  65: 'D',
  76: 'D',
  82: 'D',
  121: 'D',
  124: 'D',
  // C−: line-up, pattern ba bi, bank dễ, squirt và throw, safety lăn sát.
  12: 'C-',
  14: 'C-',
  15: 'C-',
  23: 'C-',
  27: 'C-',
  48: 'C-',
  57: 'C-',
  58: 'C-',
  66: 'C-',
  83: 'C-',
  84: 'C-',
  85: 'C-',
  102: 'C-',
  117: 'C-',
  123: 'C-',
  // C+: pattern dài hơn, safety cơ bản, kick biến thể, zone hẹp.
  10: 'C+',
  19: 'C+',
  28: 'C+',
  59: 'C+',
  60: 'C+',
  67: 'C+',
  68: 'C+',
  77: 'C+',
  78: 'C+',
  86: 'C+',
  89: 'C+',
  100: 'C+',
  101: 'C+',
  103: 'C+',
  113: 'C+',
  118: 'C+',
  119: 'C+',
  // B−: kick hai băng, bank khó, safety hai băng, nhảy bi, bài không băng.
  16: 'B-',
  20: 'B-',
  31: 'B-',
  61: 'B-',
  62: 'B-',
  63: 'B-',
  69: 'B-',
  72: 'B-',
  79: 'B-',
  87: 'B-',
  110: 'B-',
  111: 'B-',
  120: 'B-',
  // B+: runout 9 bi, massé, bi khó trước, safety ba lựa chọn.
  17: 'B+',
  71: 'B+',
  73: 'B+',
  81: 'B+',
  88: 'B+',
  90: 'B+',
  104: 'B+',
  105: 'B+',
  112: 'B+',
  129: 'B+',
  // A−: bàn rải, đổi safety, push-out, lực tinh ở lỗ giữa.
  91: 'A-',
  93: 'A-',
  94: 'A-',
  106: 'A-',
  107: 'A-',
  108: 'A-',
  130: 'A-',
  // A+: 10 bi gọi lỗ, break kiểm soát, đấu ghost 10 bi.
  80: 'A+',
  92: 'A+',
  95: 'A+',
  // PRO: chạy bàn dưới áp lực trận, 15 bi compact.
  96: 'PRO',
  122: 'PRO',
};

export const levelOf = (drill: PoolDrill): TrainingLevel =>
  LEVEL_BY_NUMBER[drill.number] ?? LEVEL_BY_STAGE[stageOf(drill).stage - 1];

/**
 * Hạng nên tập tiếp: hạng đầu tiên (trong các hạng có bài) chưa qua. Qua một hạng khi pass ít nhất 2/3 số bài của hạng,
 * làm tròn lên. Chưa có tiến độ thì ra hạng thấp nhất; qua hết thì ra hạng cao nhất.
 */
export function suggestedLevel(drills: readonly PoolDrill[], isPassed: (drill: PoolDrill) => boolean): TrainingLevel {
  const present = LEVELS.filter((level) => drills.some((d) => levelOf(d) === level));
  const open = present.find((level) => {
    const inLevel = drills.filter((d) => levelOf(d) === level);
    return inLevel.filter(isPassed).length < Math.ceil((inLevel.length * 2) / 3);
  });
  return open ?? present[present.length - 1] ?? LEVELS[0];
}
