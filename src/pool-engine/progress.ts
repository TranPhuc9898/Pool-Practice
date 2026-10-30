import { Storage } from 'expo-sqlite/kv-store';
import { useSyncExternalStore } from 'react';

import { logAttempt } from './attempt-log';
import type { PoolDrill } from './types';
import { uuid7 } from './uuid7';

/** Tiến độ lưu một khoá JSON trong SQLite kv-store, đọc đồng bộ lúc khởi động. */
export type AttemptResult = 'pass' | 'fail';
/**
 * `sessionId` sinh lúc Start, gắn vào mọi cú của lượt đó trong attempt log. `bestBefore` là `best` lúc Start,
 * để Undo trả lại được. Cả hai optional nên dữ liệu v1 vẫn đọc được.
 */
export type DrillProgress = {
  started: boolean;
  attempts: readonly AttemptResult[];
  best: number;
  sessionId?: string;
  bestBefore?: number;
};
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

/**
 * Điểm so với `passCondition.required`. `roundQuota` chia cú theo round như màn drill (cú i thuộc round
 * floor(i / cú mỗi round)) và mỗi round chỉ tính tối đa `perRound` pass, nên dồn pass vào một round không qua được.
 */
export function drillScore(drill: PoolDrill, attempts: readonly AttemptResult[]): number {
  const c = drill.passCondition;
  if (c.kind !== 'roundQuota' || !drill.rounds?.length) return attempts.filter((a) => a === 'pass').length;
  const size = drill.attemptCount / drill.rounds.length;
  const perRound = drill.rounds.map(() => 0);
  attempts.forEach((a, i) => {
    const r = Math.min(Math.floor(i / size), perRound.length - 1);
    if (a === 'pass') perRound[r] = Math.min(perRound[r] + 1, c.perRound);
  });
  return perRound.reduce((sum, n) => sum + n, 0);
}

/** Ngưỡng qua để hiện trên card và màn drill. */
export function passLabel(drill: PoolDrill): string {
  const c = drill.passCondition;
  return c.kind === 'roundQuota'
    ? `${c.perRound}/${drill.attemptCount / (drill.rounds?.length || 1)} each round`
    : `${c.required}/${drill.attemptCount}`;
}

export function startDrill(id: string) {
  const p = snapshot.get(id) ?? EMPTY;
  lastDrillId = id;
  write(id, { ...p, started: true, attempts: [], sessionId: uuid7(), bestBefore: p.best });
}

/** `id`: id dòng attempt log, khi `shot_results` cần trỏ vào run này. */
export function recordAttempt(drill: PoolDrill, result: AttemptResult, id?: string) {
  const p = snapshot.get(drill.id) ?? EMPTY;
  if (!p.started || p.attempts.length >= drill.attemptCount) return;
  const attempts = [...p.attempts, result];
  const done = attempts.length === drill.attemptCount;
  const score = drillScore(drill, attempts);
  write(drill.id, { ...p, started: !done, attempts, best: Math.max(p.best, score) });
  logAttempt(drill.id, result, p.sessionId, id);
}

/** Huỷ cú vừa ghi, kể cả cú cuối của lượt: lượt mở lại, log thêm dòng `void` chứ không xoá. */
export function undoAttempt(drill: PoolDrill) {
  const p = snapshot.get(drill.id) ?? EMPTY;
  if (p.attempts.length === 0 || !p.sessionId) return;
  if (!p.started && p.attempts.length < drill.attemptCount) return;
  const attempts = p.attempts.slice(0, -1);
  const score = drillScore(drill, attempts);
  // Lượt bắt đầu trước khi có `bestBefore` thì không biết best cũ, giữ nguyên.
  const best = p.bestBefore === undefined ? p.best : Math.max(p.bestBefore, score);
  write(drill.id, { ...p, started: true, attempts, best });
  logAttempt(drill.id, 'void', p.sessionId);
}

export function resetDrill(id: string) {
  const p = snapshot.get(id) ?? EMPTY;
  write(id, { ...p, started: false, attempts: [] });
}

/** Passed khi đạt ngưỡng trong lượt hiện tại hoặc điểm cao nhất từng đạt. */
export function drillStatus(drill: PoolDrill, p: DrillProgress): DrillStatus {
  const required = drill.passCondition.required;
  if (drillScore(drill, p.attempts) >= required || p.best >= required) return 'passed';
  if (p.started) return 'inProgress';
  if (p.attempts.length > 0) return 'notPassed';
  return 'notStarted';
}
