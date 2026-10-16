import type { AttemptResult } from './progress';

export type LogRow = { result: string; at: number; session_id: string | null };

/** Một lượt đã gộp từ attempt log: cú bị `void` đã bỏ ra. */
export type SessionSummary = { sessionId: string; at: number; attempts: AttemptResult[]; passes: number };

/**
 * Gộp các dòng log (đúng thứ tự ghi) thành lượt, mới nhất trước. `void` gỡ cú pass/fail gần nhất của
 * cùng lượt như một stack. Dòng không có `session_id` (log trước v2) bỏ qua vì không biết thuộc lượt nào.
 */
export function foldSessions(rows: readonly LogRow[]): SessionSummary[] {
  const bySession = new Map<string, SessionSummary>();
  for (const row of rows) {
    if (!row.session_id) continue;
    let s = bySession.get(row.session_id);
    if (!s) {
      s = { sessionId: row.session_id, at: row.at, attempts: [], passes: 0 };
      bySession.set(row.session_id, s);
    }
    if (row.result === 'void') s.attempts.pop();
    else if (row.result === 'pass' || row.result === 'fail') s.attempts.push(row.result);
  }
  const sessions = [...bySession.values()];
  for (const s of sessions) s.passes = s.attempts.filter((a) => a === 'pass').length;
  return sessions.reverse();
}
