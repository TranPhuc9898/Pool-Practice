import { Storage } from 'expo-sqlite/kv-store';
import { useSyncExternalStore } from 'react';

/**
 * Hướng dẫn lần đầu, key riêng `firstUse`. Không suy từ `lastDrillId` vì người mới có thể chỉ tập Daily Workout.
 * `play`: chờ bấm Play shot. `record`: chờ ghi Pass/Miss. `done`: tắt hẳn, chỉ Settings mở lại.
 */
export type GuideStep = 'play' | 'record' | 'done';

const STORAGE_KEY = 'firstUse';
const SCHEMA_VERSION = 1;
type Persisted = { schemaVersion: 1; step: GuideStep };

function load(): GuideStep {
  try {
    const raw = Storage.getItemSync(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as Persisted) : null;
    if (data?.schemaVersion === SCHEMA_VERSION) return data.step;
    // Bản cũ chưa có key này: đã từng ghi tiến độ thì là người cũ, không bật hướng dẫn.
    if (Storage.getItemSync('daily') || Storage.getItemSync('progress')) return 'done';
  } catch {
    // Đọc hỏng thì không làm phiền bằng hướng dẫn.
    return 'done';
  }
  return 'play';
}

let step: GuideStep = load();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function write(next: GuideStep) {
  if (next === step) return;
  step = next;
  try {
    Storage.setItemSync(STORAGE_KEY, JSON.stringify({ schemaVersion: SCHEMA_VERSION, step } satisfies Persisted));
  } catch {
    // Ghi hỏng thì giữ trong bộ nhớ, lần ghi sau thử lại.
  }
  listeners.forEach((l) => l());
}

export function useGuideStep(): GuideStep {
  return useSyncExternalStore(subscribe, () => step);
}

/** Đã bấm Play: chuyển sang hint ghi kết quả. Chỉ đi tới, không lùi. */
export function guideSawPlay() {
  if (step === 'play') write('record');
}

/** Đã ghi cú thật đầu tiên, hoặc bấm Bỏ qua. */
export function finishGuide() {
  write('done');
}

/** Settings › Hướng dẫn nhanh. Không đụng progress, daily hay attempt log. */
export function replayGuide() {
  write('play');
}
