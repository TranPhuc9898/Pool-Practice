import { useSyncExternalStore } from 'react';

import { db, logVersion, subscribe } from './attempt-log';
import { recordAttempt } from './progress';
import type { PoolDrill } from './types';
import { uuid7 } from './uuid7';

/**
 * Kết quả từng cú của drill có `shots`. Một run là một dòng `attempts` (pass = runout), các cú trỏ vào
 * nó qua `run_id`. Bảng riêng để không đổi bảng `attempts` mà server sync đang khớp.
 */
db.execSync(
  `CREATE TABLE IF NOT EXISTS shot_results (
    id TEXT PRIMARY KEY NOT NULL,
    run_id TEXT NOT NULL,
    drill_id TEXT NOT NULL,
    shot INTEGER NOT NULL,
    pot INTEGER NOT NULL,
    position INTEGER,
    at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS shot_results_run ON shot_results (run_id);`,
);

/** `position` chỉ có ở cú có zone. */
export type ShotResult = { pot: boolean; position?: boolean };

/** Run dừng ở cú trượt đầu tiên hoặc sau cú cuối. Runout = đủ cú và cú nào cũng vào. */
export function recordRun(drill: PoolDrill, results: readonly ShotResult[]) {
  const at = Date.now();
  const runId = uuid7(at);
  try {
    // Ghi cú trước: `recordAttempt` báo listener ngay, lúc đó dòng cú phải có sẵn.
    db.withTransactionSync(() => {
      results.forEach((r, i) =>
        db.runSync(
          'INSERT INTO shot_results (id, run_id, drill_id, shot, pot, position, at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [uuid7(at), runId, drill.id, i, r.pot ? 1 : 0, r.position === undefined ? null : r.position ? 1 : 0, at],
        ),
      );
    });
  } catch {
    // Ghi cú hỏng thì run vẫn vào progress, chỉ mất dòng Last run.
  }
  const runout = results.length === (drill.shots?.length ?? 0) && results.every((r) => r.pot);
  recordAttempt(drill, runout ? 'pass' : 'fail', runId);
}

export type LastRun = { pots: number; shots: number; positions: number; zones: number; runout: boolean };

type IdRow = { r: number; id: string; result: string; session_id: string | null };
type ShotRow = { pot: number; position: number | null };

const cache = new Map<string, { version: number; run: LastRun | undefined }>();

/** Run gần nhất chưa bị Undo: gộp `void` theo lượt như `foldSessions`, lấy dòng sống sót ghi sau cùng. */
function readLastRun(drill: PoolDrill): LastRun | undefined {
  const hit = cache.get(drill.id);
  if (hit?.version === logVersion()) return hit.run;
  let run: LastRun | undefined;
  try {
    const rows = db.getAllSync<IdRow>(
      'SELECT rowid AS r, id, result, session_id FROM attempts WHERE drill_id = ? ORDER BY rowid',
      [drill.id],
    );
    const stacks = new Map<string, IdRow[]>();
    for (const row of rows) {
      if (!row.session_id) continue;
      const stack = stacks.get(row.session_id) ?? [];
      stacks.set(row.session_id, stack);
      if (row.result === 'void') stack.pop();
      else stack.push(row);
    }
    let last: IdRow | undefined;
    for (const stack of stacks.values()) {
      const top = stack[stack.length - 1];
      if (top && (!last || top.r > last.r)) last = top;
    }
    if (last) {
      const shots = db.getAllSync<ShotRow>('SELECT pot, position FROM shot_results WHERE run_id = ? ORDER BY shot', [
        last.id,
      ]);
      if (shots.length > 0) {
        run = {
          pots: shots.filter((s) => s.pot === 1).length,
          shots: drill.shots?.length ?? 0,
          positions: shots.filter((s) => s.position === 1).length,
          zones: drill.shots?.filter((s) => s.zone !== undefined).length ?? 0,
          runout: last.result === 'pass',
        };
      }
    }
  } catch {
    // Đọc hỏng thì không hiện Last run, không chặn màn drill.
  }
  cache.set(drill.id, { version: logVersion(), run });
  return run;
}

export function useLastRun(drill: PoolDrill): LastRun | undefined {
  return useSyncExternalStore(subscribe, () => readLastRun(drill));
}
