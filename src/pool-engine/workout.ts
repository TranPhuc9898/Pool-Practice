import { atDistance, drillByNumber } from './drills';
import { downAndBack } from './drills/down-and-back';
import type { AttemptResult } from './progress';
import type { PoolDrill } from './types';

/** Khoá ngày theo giờ máy, `YYYY-MM-DD`. Cú sau 0h rơi sang ngày mới. */
export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** `diamonds`: khoảng cách bi cái → bi mục tiêu của mốc, khớp `distances` trong drill. */
export type WorkoutMark = { label: string; shots: number; diamonds?: number };
/**
 * `drill`: số bài trong thư viện dạy kỹ thuật của khối, để màn xem lại mở sang.
 * `ladder`: khoảng cách từng cú theo level (`ladderOf`), mốc chỉ còn chia cú thành loạt 10.
 */
export type WorkoutBlock = {
  id: 'stroke' | 'stop' | 'follow' | 'draw';
  title: string;
  goal: string;
  drill: number;
  marks: readonly WorkoutMark[];
  ladder?: boolean;
};

/** Stroke: bi cái đi dọc bàn rồi về; `diamonds` là khoảng cách bi cái → băng cuối, khớp `downAndBack`. */
const lengths = [
  { label: 'Short', shots: 10, diamonds: 2 },
  { label: 'Long', shots: 10, diamonds: 4 },
  { label: 'Very long', shots: 10, diamonds: 6 },
];
const diamondLabel = (d: number) => `${d} diamond${d > 1 ? 's' : ''}`;
const diamonds = [1, 2, 3].map((d) => ({ label: diamondLabel(d), shots: 10, diamonds: d }));
const sets = [1, 2, 3].map((n) => ({ label: `Set ${n}`, shots: 10 }));

/** Bật ladder cho khối Stop. Tắt là về mốc 1/2/3 diamond cố định như cũ. */
export const LADDER = true;
/** Ngày bật ladder. Cú Stop trước đó đánh theo mốc cố định nên không tính vào level. */
export const LADDER_FROM = '2026-10-16';
/** Khoảng cách ladder đi được, diamond: đúng các mức có `distances` trong drill. */
export const LADDER_RUNGS = { min: 1, max: 3 };

/** Bài cố định 120 cú. Thứ tự ở đây chính là thứ tự cú trong mảng ngày của store `daily`. */
export const WORKOUT: readonly WorkoutBlock[] = [
  { id: 'stroke', title: 'Stroke', goal: 'Cue ball returns to the tip', drill: 1, marks: lengths },
  { id: 'stop', title: 'Stop', goal: 'Cue ball stops in the zone', drill: 2, marks: LADDER ? sets : diamonds, ladder: LADDER },
  { id: 'follow', title: 'Follow', goal: 'Cue ball rolls into the zone', drill: 3, marks: diamonds },
  { id: 'draw', title: 'Draw', goal: 'Cue ball draws back into the zone', drill: 5, marks: diamonds },
];

/**
 * Thế bi của một mốc: Stroke dùng `downAndBack`, các khối khác dùng drill thư viện ở đúng mức.
 * Khối ladder truyền `diamonds` theo level thay cho mức của mốc.
 */
export function markDrill(block: WorkoutBlock, mark: WorkoutMark, diamonds = mark.diamonds): PoolDrill {
  const base = block.id === 'stroke' ? downAndBack : (drillByNumber(block.drill) ?? downAndBack);
  return diamonds ? atDistance(base, diamonds) : base;
}

const blockSize = (b: WorkoutBlock) => b.marks.reduce((n, m) => n + m.shots, 0);

export type Ladder = { rung: number; streak: number; label: string };

/**
 * Luật 2-down-1-up: vào 2 cú liền thì lùi bi cái thêm 1 diamond, trượt 1 cú thì tiến lại 1.
 * Tỉ lệ vào hội tụ quanh 71%, nên level luôn nằm sát giới hạn tay. `streak` là số cú vào liền ở mức hiện tại.
 */
export function ladderRung(results: readonly AttemptResult[], { min, max } = LADDER_RUNGS) {
  let rung = min;
  let streak = 0;
  for (const r of results) {
    if (r === 'fail') {
      rung = Math.max(min, rung - 1);
      streak = 0;
    } else if (++streak === 2) {
      rung = Math.min(max, rung + 1);
      streak = 0;
    }
  }
  return { rung, streak };
}

/** Cú của một khối trong mảng một ngày, theo thứ tự đã đánh. */
function blockShots(day: readonly AttemptResult[], id: WorkoutBlock['id']): readonly AttemptResult[] {
  let start = 0;
  for (const b of WORKOUT) {
    if (b.id === id) return day.slice(start, start + blockSize(b));
    start += blockSize(b);
  }
  return [];
}

/** Level của khối tính trên mọi ngày từ `LADDER_FROM`, nối theo thứ tự ngày, kể cả hôm nay. */
export function ladderOf(days: Readonly<Record<string, readonly AttemptResult[]>>, id: WorkoutBlock['id']): Ladder {
  const shots = Object.keys(days)
    .filter((k) => k >= LADDER_FROM)
    .sort()
    .flatMap((k) => blockShots(days[k], id));
  const { rung, streak } = ladderRung(shots);
  return { rung, streak, label: diamondLabel(rung) };
}
export const WORKOUT_TOTAL = WORKOUT.reduce((n, b) => n + blockSize(b), 0);

export type WorkoutProgress = {
  done: number;
  /** Số cú đã đánh trong từng khối, cùng thứ tự `WORKOUT`. */
  blocks: readonly { done: number; total: number }[];
  /** Cú kế tiếp nằm ở đâu; `null` khi đã đủ 120. */
  next: { block: number; mark: number; shot: number } | null;
};

export function progressOf(shots: number): WorkoutProgress {
  const done = Math.min(shots, WORKOUT_TOTAL);
  let left = done;
  let next: WorkoutProgress['next'] = null;
  const blocks = WORKOUT.map((b, bi) => {
    const total = blockSize(b);
    const inBlock = Math.min(left, total);
    left -= inBlock;
    if (!next && inBlock < total) {
      let rest = inBlock;
      const mi = b.marks.findIndex((m) => (rest < m.shots ? true : ((rest -= m.shots), false)));
      next = { block: bi, mark: mi, shot: rest };
    }
    return { done: inBlock, total };
  });
  return { done, blocks, next };
}

/**
 * Số ngày liền có tập, tính tới hôm nay. Hôm nay chưa tập thì chưa đứt chuỗi:
 * đếm lùi từ hôm qua.
 */
export function streak(trained: (key: string) => boolean, today: Date): number {
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!trained(dayKey(day))) day.setDate(day.getDate() - 1);
  let n = 0;
  while (trained(dayKey(day))) {
    n += 1;
    day.setDate(day.getDate() - 1);
  }
  return n;
}
