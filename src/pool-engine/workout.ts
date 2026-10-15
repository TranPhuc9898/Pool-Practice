/** Khoá ngày theo giờ máy, `YYYY-MM-DD`. Cú sau 0h rơi sang ngày mới. */
export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** `diamonds`: khoảng cách bi cái → bi mục tiêu của mốc, khớp `distances` trong drill. */
export type WorkoutMark = { label: string; shots: number; diamonds?: number };
/** `drill`: số bài trong thư viện dạy kỹ thuật của khối, để màn xem lại mở sang. */
export type WorkoutBlock = { id: 'stroke' | 'stop' | 'follow' | 'draw'; title: string; goal: string; drill: number; marks: readonly WorkoutMark[] };

const diamonds = [1, 2, 3].map((d) => ({ label: `${d} diamond${d > 1 ? 's' : ''}`, shots: 10, diamonds: d }));

/** Bài cố định 100 cú. Thứ tự ở đây chính là thứ tự cú trong mảng ngày của store `daily`. */
export const WORKOUT: readonly WorkoutBlock[] = [
  { id: 'stroke', title: 'Stroke', goal: 'Cue ball returns to the tip', drill: 1, marks: [{ label: 'Down and back', shots: 10 }] },
  { id: 'stop', title: 'Stop', goal: 'Cue ball stops in the zone', drill: 2, marks: diamonds },
  { id: 'follow', title: 'Follow', goal: 'Cue ball rolls into the zone', drill: 3, marks: diamonds },
  { id: 'draw', title: 'Draw', goal: 'Cue ball draws back into the zone', drill: 5, marks: diamonds },
];

const blockSize = (b: WorkoutBlock) => b.marks.reduce((n, m) => n + m.shots, 0);
export const WORKOUT_TOTAL = WORKOUT.reduce((n, b) => n + blockSize(b), 0);

export type WorkoutProgress = {
  done: number;
  /** Số cú đã đánh trong từng khối, cùng thứ tự `WORKOUT`. */
  blocks: readonly { done: number; total: number }[];
  /** Cú kế tiếp nằm ở đâu; `null` khi đã đủ 100. */
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
