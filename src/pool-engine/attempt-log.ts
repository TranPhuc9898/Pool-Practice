import { openDatabaseSync } from 'expo-sqlite';

import type { AttemptResult } from './progress';
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

export function logAttempt(drillId: string, result: AttemptResult, sessionId?: string) {
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
}
