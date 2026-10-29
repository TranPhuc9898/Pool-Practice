import { useEffect, useRef } from 'react';

/** Điểm trên bàn, toạ độ khung 520×280 của `PoolTable`. */
export type Pt = readonly [number, number];
export type Alive = () => boolean;

export const R = 8;
export const add = (p: Pt, v: Pt, k = 1): Pt => [p[0] + v[0] * k, p[1] + v[1] * k];
export const unit = (a: Pt, b: Pt): Pt => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy);
  return [dx / l, dy / l];
};
export const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Chạy `f(k)` mỗi khung với k đi 0→1 theo ease-out. Demo bị huỷ thì dừng ngay, không chạy nốt. */
export function tween(ms: number, f: (k: number) => void, alive: Alive) {
  return new Promise<void>((resolve) => {
    const t0 = Date.now();
    const step = () => {
      if (!alive()) return resolve();
      const t = Math.min(1, (Date.now() - t0) / ms);
      f(easeOutCubic(t));
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

const GLYPHS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789#%&*+';
export const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/** Chữ ngẫu nhiên 45% đầu thời gian, sau đó khoá dần từng ký tự từ trái sang thành `target`. */
export function scramble(set: (s: string) => void, target: string, ms: number, alive: Alive) {
  return new Promise<void>((resolve) => {
    const t0 = Date.now();
    const n = target.length;
    const tick = () => {
      if (!alive()) return resolve();
      const t = (Date.now() - t0) / ms;
      if (t >= 1) {
        set(target);
        return resolve();
      }
      set([...target].map((c, i) => (t > 0.45 + (0.55 * (i + 1)) / n ? c : randomGlyph())).join(''));
      setTimeout(tick, 55);
    };
    tick();
  });
}

/**
 * Chạy lặp `run` khi slide đang hiện. Rời slide hoặc unmount thì `alive()` thành false,
 * mọi bước `await` sau đó tự thoát.
 */
export function useDemoLoop(active: boolean, run: (alive: Alive) => Promise<void>) {
  const latest = useRef(run);
  useEffect(() => {
    latest.current = run;
  });
  useEffect(() => {
    if (!active) return;
    let on = true;
    const alive = () => on;
    (async () => {
      while (on) await latest.current(alive);
    })();
    return () => {
      on = false;
    };
  }, [active]);
}
