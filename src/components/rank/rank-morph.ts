import { router } from 'expo-router';
import { useSyncExternalStore } from 'react';
import type { View } from 'react-native';
import { makeMutable } from 'react-native-reanimated';

import type { Rank } from '@/design-system';

export type Rect = { x: number; y: number; width: number; height: number };

/** Lề hai bên của khung khi dãn ngang hết pha 1. */
export const MORPH_EDGE = 12;
/** Con trỏ giữa hai chữ của dòng hạng, và bề rộng pill nó mọc thành ở pha 0. */
export const CARET_W = 3;
export const PILL_W = 112;

/** Pill mà con trỏ `caret` mọc thành: cùng tâm ngang, cùng chiều cao. */
export const pillOf = (caret: Rect): Rect => ({
  x: caret.x + caret.width / 2 - PILL_W / 2,
  y: caret.y,
  width: PILL_W,
  height: caret.height,
});

/**
 * Khung ở mốc `p` quanh pill `o`: -1 là con trỏ, 0 là pill, 1 là dãn ngang gần full bề rộng (giữ chiều cao), 2 là full
 * màn. Hai pha đầu khung luôn bo tròn hết cỡ như clip, pha cuối góc về 0.
 */
export function frameAt(p: number, o: Rect, width: number, height: number) {
  'worklet';
  const mix = (a: number, b: number, k: number) => a + (b - a) * k;
  const pill = Math.min(o.height / 2, 64);
  if (p <= 0) {
    const w = mix(CARET_W, o.width, Math.min(Math.max(p + 1, 0), 1));
    return { x: o.x + (o.width - w) / 2, y: o.y, width: w, height: o.height, radius: Math.min(w / 2, pill) };
  }
  const wide = Math.min(p, 1);
  const tall = Math.min(Math.max(p - 1, 0), 1);
  if (p <= 1) {
    return {
      x: mix(o.x, MORPH_EDGE, wide),
      y: o.y,
      width: mix(o.width, width - 2 * MORPH_EDGE, wide),
      height: o.height,
      radius: pill,
    };
  }
  return {
    x: mix(MORPH_EDGE, 0, tall),
    y: mix(o.y, 0, tall),
    width: mix(width - 2 * MORPH_EDGE, width, tall),
    height: mix(o.height, height, tall),
    radius: mix(pill, 0, tall),
  };
}

/**
 * Trạng thái chung của cú mở hạng, dùng chung giữa tab Drills (thẻ bị đẩy ra) và trang hạng (khung nở).
 * `progress` nghỉ ở -1. -1 → 0 con trỏ mọc thành pill, 0 → 1 dãn ngang, 1 → 2 nở dọc ra full màn. `rects` là khung
 * trong cửa sổ của con trỏ mọi dòng hạng đang hiện, đo lại đúng lúc bấm vì tab Drills cuộn được. `origin` là pill của
 * dòng được bấm.
 */
export const morph = {
  progress: makeMutable(-1),
  origin: makeMutable<Rect | null>(null),
  originKey: makeMutable<string | null>(null),
  rects: makeMutable<Record<string, Rect>>({}),
};

const views = new Map<string, { rank: Rank; view: View }>();

/** Dòng hạng đăng ký view con trỏ của mình. `key` riêng cho dòng Up next và dòng trong danh sách vì có thể cùng hạng. */
export function registerRankView(key: string, rank: Rank, view: View | null) {
  if (view) views.set(key, { rank, view });
  else views.delete(key);
}

function measureAll(): Promise<Record<string, Rect>> {
  const entries = [...views.entries()];
  return Promise.all(
    entries.map(
      ([key, { view }]) =>
        new Promise<[string, Rect]>((resolve) =>
          view.measureInWindow((x, y, width, height) => resolve([key, { x, y, width, height }])),
        ),
    ),
  ).then(Object.fromEntries);
}

/** Hạng đang điền trên dòng lớn của tab Drills. Trang hạng đổi được nó (thẻ Next rank) để lúc đóng thu về đúng chữ. */
let picked: Rank | null = null;
const listeners = new Set<() => void>();

export function setPickedRank(rank: Rank) {
  picked = rank;
  listeners.forEach((l) => l());
}

export function usePickedRank() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => picked,
  );
}

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

async function measureOrigin(key: string) {
  const rects = await measureAll();
  morph.rects.set(rects);
  // Tab đang ẩn có thể trả khung rỗng, coi như không đo được.
  const caret = rects[key]?.height ? rects[key] : null;
  morph.origin.set(caret ? pillOf(caret) : null);
  morph.originKey.set(caret ? key : null);
}

/** Đo mọi dòng, lấy pill của `key` làm khung gốc rồi mở trang hạng. Trang hạng tự chạy cú nở từ khung này. */
export async function openRank(key: string, rank: Rank) {
  await measureOrigin(key);
  router.push({ pathname: '/rank/[id]', params: { id: rank } });
}

/** Sang hạng kế từ trang hạng: điền hạng mới vào dòng lớn rồi đo lại, để lúc đóng thu về đúng chữ. */
export async function retargetRank(key: string, rank: Rank) {
  setPickedRank(rank);
  await nextFrame();
  await measureOrigin(key);
}
