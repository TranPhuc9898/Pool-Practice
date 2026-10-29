import { Storage } from 'expo-sqlite/kv-store';
import { useSyncExternalStore } from 'react';

/**
 * Intro 4 màn lúc mở app lần đầu, key riêng `onboarding`.
 * `done`: đã bấm Start hoặc Skip. Root layout đọc cờ này để chọn nhóm route.
 */
const STORAGE_KEY = 'onboarding';
const SCHEMA_VERSION = 1;
type Persisted = { schemaVersion: 1; done: boolean };

function load(): boolean {
  try {
    const raw = Storage.getItemSync(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as Persisted) : null;
    if (data?.schemaVersion === SCHEMA_VERSION) return data.done;
    // Bản cũ chưa có key này: đã từng ghi tiến độ thì là người cũ, không chặn họ bằng intro.
    if (Storage.getItemSync('daily') || Storage.getItemSync('progress')) return true;
  } catch {
    // Đọc hỏng thì cho vào app, không kẹt ở intro.
    return true;
  }
  return false;
}

let done = load();
/** Logo outro đang chiếu. Không lưu: mở lại app giữa chừng thì thôi. */
let outro = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const emit = () => listeners.forEach((l) => l());

function write(next: boolean) {
  if (next === done) return;
  done = next;
  try {
    Storage.setItemSync(STORAGE_KEY, JSON.stringify({ schemaVersion: SCHEMA_VERSION, done } satisfies Persisted));
  } catch {
    // Ghi hỏng thì giữ trong bộ nhớ, lần ghi sau thử lại.
  }
  emit();
}

export function useOnboardingDone(): boolean {
  return useSyncExternalStore(subscribe, () => done);
}

export function useOutroPlaying(): boolean {
  return useSyncExternalStore(subscribe, () => outro);
}

/** Start hoặc Skip: root layout phủ logo outro lên trên stack. */
export function playOutro() {
  if (outro) return;
  outro = true;
  emit();
}

/** Outro mở xong ra home thì gỡ lớp phủ. */
export function endOutro() {
  if (!outro) return;
  outro = false;
  emit();
}

/** Bấm Start ở màn cuối, hoặc Skip. */
export function finishOnboarding() {
  write(true);
}

/** Settings › Show intro. Không đụng progress, daily hay hướng dẫn lần đầu. */
export function replayOnboarding() {
  write(false);
}
