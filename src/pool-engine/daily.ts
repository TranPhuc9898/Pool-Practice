import { Storage } from 'expo-sqlite/kv-store';
import { useSyncExternalStore } from 'react';

import type { AttemptResult } from './progress';
import { dayKey } from './workout';

/**
 * Daily workout lưu key riêng `daily`, tách khỏi `progress` để không đổi schema cũ.
 * Mỗi ngày một mảng kết quả theo đúng thứ tự cú trong workout: vị trí cú suy ra khối và mốc.
 */
const STORAGE_KEY = 'daily';
const SCHEMA_VERSION = 1;
type Days = Record<string, readonly AttemptResult[]>;
type Persisted = { schemaVersion: 1; days: Days };

const NONE: readonly AttemptResult[] = [];

function load(): Days {
  try {
    const raw = Storage.getItemSync(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as Persisted) : null;
    if (data?.schemaVersion === SCHEMA_VERSION) return data.days;
  } catch {
    // Dữ liệu hỏng thì bắt đầu lại từ trống, không chặn app.
  }
  return {};
}

let days: Days = load();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function write(next: Days) {
  days = next;
  try {
    Storage.setItemSync(STORAGE_KEY, JSON.stringify({ schemaVersion: SCHEMA_VERSION, days } satisfies Persisted));
  } catch {
    // Ghi hỏng thì giữ trong bộ nhớ, lần ghi sau thử lại.
  }
  listeners.forEach((l) => l());
}

/** Toàn bộ lịch sử theo ngày, để tính streak. */
export function useDailyDays(): Days {
  return useSyncExternalStore(subscribe, () => days);
}

/** Các cú đã đánh hôm nay. */
export function useDaily(): readonly AttemptResult[] {
  return useSyncExternalStore(subscribe, () => days[dayKey(new Date())] ?? NONE);
}

export function recordShot(result: AttemptResult) {
  const key = dayKey(new Date());
  write({ ...days, [key]: [...(days[key] ?? NONE), result] });
}
