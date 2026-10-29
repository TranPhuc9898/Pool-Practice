import { openDatabaseSync } from 'expo-sqlite';
import { useSyncExternalStore } from 'react';

import type { StrokeMeasures } from './clip-feedback';
import { uuid7 } from './uuid7';

/**
 * Các phiên phân tích clip sau lưng và số đo từng cú. Một clip mở ra là một phiên; lưu lại thì thay hết cú cũ của
 * phiên đó, để sửa pha hay chấm lại trục không đẻ thêm dòng. `baseline` chỉ một phiên có giá trị 1.
 */
const db = openDatabaseSync('clips.db');
db.execSync(
  `CREATE TABLE IF NOT EXISTS clip_sessions (
    id TEXT PRIMARY KEY NOT NULL,
    at INTEGER NOT NULL,
    clip_uri TEXT NOT NULL,
    hand TEXT NOT NULL,
    discipline TEXT NOT NULL,
    frames INTEGER NOT NULL,
    arm_ratio REAL NOT NULL,
    baseline INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS clip_strokes (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    idx INTEGER NOT NULL,
    start_t REAL NOT NULL,
    end_t REAL NOT NULL,
    pause REAL,
    confidence REAL NOT NULL,
    phase_source TEXT NOT NULL,
    address_wrist_l REAL,
    back_wrist_l REAL,
    follow_wrist_l REAL,
    elbow_range_l REAL,
    back_cue REAL,
    follow_cue REAL,
    cue_conf REAL
  );
  CREATE INDEX IF NOT EXISTS clip_strokes_session ON clip_strokes (session_id, idx);`,
);

export type Discipline = 'nine-ball' | 'chinese-eight';

export type ClipSession = {
  id: string;
  at: number;
  clipUri: string;
  hand: 'right' | 'left';
  discipline: Discipline;
  frames: number;
  armRatio: number;
  baseline: boolean;
  strokes: StrokeMeasures[];
};

export type StrokeRecord = StrokeMeasures & {
  start: number;
  end: number;
  pause?: number;
  source: 'auto' | 'manual';
};

type SessionRow = {
  id: string;
  at: number;
  clip_uri: string;
  hand: 'right' | 'left';
  discipline: Discipline;
  frames: number;
  arm_ratio: number;
  baseline: number;
};

type StrokeRow = {
  session_id: string;
  confidence: number;
  address_wrist_l: number | null;
  back_wrist_l: number | null;
  follow_wrist_l: number | null;
  elbow_range_l: number | null;
  back_cue: number | null;
  follow_cue: number | null;
  cue_conf: number | null;
};

const n = (v: number | null) => v ?? undefined;

let version = 0;
let cache: { version: number; sessions: ClipSession[] } | undefined;
const listeners = new Set<() => void>();

function changed() {
  version++;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function newClipSessionId(): string {
  return uuid7();
}

/** Ghi hoặc ghi đè phiên `id` cùng toàn bộ cú của nó. Lỗi ném ra để màn clip báo lưu hỏng. */
export function saveClipSession(
  s: Omit<ClipSession, 'baseline' | 'strokes' | 'at'> & { strokes: StrokeRecord[] },
) {
  const at = Date.now();
  db.withTransactionSync(() => {
    db.runSync(
      `INSERT INTO clip_sessions (id, at, clip_uri, hand, discipline, frames, arm_ratio) VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET hand = excluded.hand, discipline = excluded.discipline,
         frames = excluded.frames, arm_ratio = excluded.arm_ratio`,
      [s.id, at, s.clipUri, s.hand, s.discipline, s.frames, s.armRatio],
    );
    db.runSync('DELETE FROM clip_strokes WHERE session_id = ?', [s.id]);
    s.strokes.forEach((k, i) =>
      db.runSync(
        `INSERT INTO clip_strokes (id, session_id, idx, start_t, end_t, pause, confidence, phase_source, address_wrist_l,
           back_wrist_l, follow_wrist_l, elbow_range_l, back_cue, follow_cue, cue_conf)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuid7(at),
          s.id,
          i,
          k.start,
          k.end,
          k.pause ?? null,
          k.confidence,
          k.source,
          k.addressWristL ?? null,
          k.backWristL ?? null,
          k.followWristL ?? null,
          k.elbowRangeL ?? null,
          k.backCue ?? null,
          k.followCue ?? null,
          k.cueConfidence ?? null,
        ],
      ),
    );
  });
  changed();
}

/** Đặt `id` làm baseline, bỏ cờ của phiên cũ. */
export function setClipBaseline(id: string) {
  try {
    db.runSync('UPDATE clip_sessions SET baseline = (id = ?)', [id]);
  } catch {
    return;
  }
  changed();
}

export function deleteClipSession(id: string) {
  try {
    db.withTransactionSync(() => {
      db.runSync('DELETE FROM clip_strokes WHERE session_id = ?', [id]);
      db.runSync('DELETE FROM clip_sessions WHERE id = ?', [id]);
    });
  } catch {
    return;
  }
  changed();
}

function readSessions(): ClipSession[] {
  if (cache?.version === version) return cache.sessions;
  let sessions: ClipSession[] = [];
  try {
    const rows = db.getAllSync<SessionRow>('SELECT * FROM clip_sessions ORDER BY at DESC');
    const strokes = db.getAllSync<StrokeRow>('SELECT * FROM clip_strokes ORDER BY session_id, idx');
    const by = new Map<string, StrokeMeasures[]>();
    for (const k of strokes) {
      const list = by.get(k.session_id) ?? [];
      list.push({
        confidence: k.confidence,
        addressWristL: n(k.address_wrist_l),
        backWristL: n(k.back_wrist_l),
        followWristL: n(k.follow_wrist_l),
        elbowRangeL: n(k.elbow_range_l),
        backCue: n(k.back_cue),
        followCue: n(k.follow_cue),
        cueConfidence: n(k.cue_conf),
      });
      by.set(k.session_id, list);
    }
    sessions = rows.map((r) => ({
      id: r.id,
      at: r.at,
      clipUri: r.clip_uri,
      hand: r.hand,
      discipline: r.discipline,
      frames: r.frames,
      armRatio: r.arm_ratio,
      baseline: r.baseline === 1,
      strokes: by.get(r.id) ?? [],
    }));
  } catch {
    // Đọc hỏng thì History trống, không chặn màn clip.
  }
  cache = { version, sessions };
  return sessions;
}

/** Mọi phiên, mới nhất trước. */
export function useClipSessions(): ClipSession[] {
  return useSyncExternalStore(subscribe, readSessions);
}
