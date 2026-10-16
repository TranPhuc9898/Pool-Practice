import { openDatabaseSync } from 'expo-sqlite';
import { useSyncExternalStore } from 'react';

import type { AttemptResult } from './progress';
import { foldSessions, type LogRow, type SessionSummary } from './sessions';
import { uuid7 } from './uuid7';

/**
 * Nhật ký mọi cú Pass/Miss, chỉ thêm dòng. Store `progress` giữ lượt hiện tại và `best`,
 * bảng này giữ lịch sử có thời gian để tính trend. Cột khớp bảng `attempts` của server sync.
 */
const db = openDatabaseSync('attempts.db');
db.execSync(
  `CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY NOT NULL,
    drill_id TEXT NOT NULL,
    result TEXT NOT NULL,
    at INTEGER NOT NULL,
    session_id TEXT
  );
  CREATE INDEX IF NOT EXISTS attempts_drill_at ON attempts (drill_id, at);`,
);

/** `void` huỷ cú pass/fail gần nhất chưa bị huỷ trong cùng session: undo mà không xoá dòng nào. */
export type LoggedResult = AttemptResult | 'void';

export function logAttempt(drillId: string, result: LoggedResult, sessionId?: string) {
  const at = Date.now();
  try {
    db.runSync('INSERT INTO attempts (id, drill_id, result, at, session_id) VALUES (?, ?, ?, ?, ?)', [
      uuid7(at),
      drillId,
      result,
      at,
      sessionId ?? null,
    ]);
  } catch {
    // Ghi log hỏng không được chặn cú đánh: progress vẫn ghi như cũ.
  }
  version++;
  listeners.forEach((l) => l());
}

/** Đếm số lần ghi, để snapshot History chỉ đọc lại DB khi log đổi. */
let version = 0;
const listeners = new Set<() => void>();
const cache = new Map<string, { version: number; sessions: SessionSummary[] }>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** `rowid` là thứ tự ghi thật; `at` trùng millisecond thì không phân được pass với void ngay sau nó. */
function readSessions(drillId: string): SessionSummary[] {
  const hit = cache.get(drillId);
  if (hit?.version === version) return hit.sessions;
  let rows: LogRow[] = [];
  try {
    rows = db.getAllSync<LogRow>('SELECT result, at, session_id FROM attempts WHERE drill_id = ? ORDER BY rowid', [
      drillId,
    ]);
  } catch {
    // Đọc hỏng thì History trống, không chặn màn drill.
  }
  const sessions = foldSessions(rows);
  cache.set(drillId, { version, sessions });
  return sessions;
}

/** Các lượt của drill, mới nhất trước, gồm cả lượt đang dở. */
export function useSessionHistory(drillId: string): SessionSummary[] {
  return useSyncExternalStore(subscribe, () => readSessions(drillId));
}
