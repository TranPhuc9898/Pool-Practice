import { Storage } from 'expo-sqlite/kv-store';
import { useSyncExternalStore } from 'react';

import { logAttempt } from './attempt-log';
import type { PoolDrill } from './types';
import { uuid7 } from './uuid7';

/** Tiến độ lưu một khoá JSON trong SQLite kv-store, đọc đồng bộ lúc khởi động. */
export type AttemptResult = 'pass' | 'fail';
/** `sessionId` sinh lúc Start, gắn vào mọi cú của lượt đó trong attempt log. Optional nên dữ liệu v1 vẫn đọc được. */
export type DrillProgress = { started: boolean; attempts: readonly AttemptResult[]; best: number; sessionId?: string };
export type DrillStatus = 'notStarted' | 'inProgress' | 'passed' | 'notPassed';

const EMPTY: DrillProgress = { started: false, attempts: [], best: 0 };

/** Đổi hình dạng dữ liệu thì tăng version và viết nhánh migrate trong `load`, đừng đổi key. */
const STORAGE_KEY = 'progress';
const SCHEMA_VERSION = 1;
type Persisted = { schemaVersion: 1; lastDrillId: string | null; drills: Record<string, DrillProgress> };

function load(): { drills: ReadonlyMap<string, DrillProgress>; lastDrillId: string | null } {
  try {
    const raw = Storage.getItemSync(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as Persisted) : null;
    if (data?.schemaVersion === SCHEMA_VERSION) {
      return { drills: new Map(Object.entries(data.drills)), lastDrillId: data.lastDrillId };
    }
  } catch {
    // Dữ liệu hỏng thì bắt đầu lại từ trống, không chặn app.
  }
  return { drills: new Map(), lastDrillId: null };
}

const initial = load();
let snapshot: ReadonlyMap<string, DrillProgress> = initial.drills;
let lastDrillId: string | null = initial.lastDrillId;
const listeners = new Set<() => void>();

function persist() {
  const data: Persisted = { schemaVersion: SCHEMA_VERSION, lastDrillId, drills: Object.fromEntries(snapshot) };
  try {
    Storage.setItemSync(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ghi hỏng thì giữ trong bộ nhớ, lần ghi sau thử lại.
  }
}

function write(id: string, next: DrillProgress) {
  const map = new Map(snapshot);
  map.set(id, next);
  snapshot = map;
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Drill vừa bấm Start gần nhất, sống qua lần mở app. `null` là người mới. */
export function useLastDrillId(): string | null {
  return useSyncExternalStore(subscribe, () => lastDrillId);
}

export function useAllProgress(): ReadonlyMap<string, DrillProgress> {
  return useSyncExternalStore(subscribe, () => snapshot);
}

export function useDrillProgress(id: string): DrillProgress {
  return useSyncExternalStore(subscribe, () => snapshot.get(id) ?? EMPTY);
}

export const passes = (p: DrillProgress) => p.attempts.filter((a) => a === 'pass').length;

export function startDrill(id: string) {
  const p = snapshot.get(id) ?? EMPTY;
  lastDrillId = id;
  write(id, { ...p, started: true, attempts: [], sessionId: uuid7() });
}

export function recordAttempt(drill: PoolDrill, result: AttemptResult) {
  const p = snapshot.get(drill.id) ?? EMPTY;
  if (!p.started || p.attempts.length >= drill.attemptCount) return;
  const attempts = [...p.attempts, result];
  const done = attempts.length === drill.attemptCount;
  const score = attempts.filter((a) => a === 'pass').length;
  write(drill.id, { started: !done, attempts, best: Math.max(p.best, score), sessionId: p.sessionId });
  logAttempt(drill.id, result, p.sessionId);
}

export function resetDrill(id: string) {
  const p = snapshot.get(id) ?? EMPTY;
  write(id, { ...p, started: false, attempts: [] });
}

/** Passed khi đạt ngưỡng trong lượt hiện tại hoặc điểm cao nhất từng đạt. */
export function drillStatus(drill: PoolDrill, p: DrillProgress): DrillStatus {
  const required = drill.passCondition.required;
  if (passes(p) >= required || p.best >= required) return 'passed';
  if (p.started) return 'inProgress';
  if (p.attempts.length > 0) return 'notPassed';
  return 'notStarted';
}
