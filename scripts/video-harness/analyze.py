"""Đọc lượt drill 107 trong video, xuất mỗi cú một dòng CSV và ảnh top-down chỗ bi cái dừng.

python analyze.py <video> <out-dir> [--track]
  --track  chỉ ghi track.csv (t, L, W của bi cái) để soi, không tách cú

Cú lấy theo ô overlay điểm chạm: mỗi đoạn ô có chấm là một cú (tip.py). Trong đoạn đó, cú bắt đầu lúc bi cái rời chỗ
đứng quá 0.1 kim cương và kết thúc khi bi cái đứng yên ≥ 0.5 s. Bi mục tiêu là bi số nhỏ nhất chưa vào (luật đánh theo
số); vào hay trượt đọc ở chỗ đặt bi đó sau cú.
"""
import csv
import sys
from pathlib import Path

import cv2
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))  # chạy bằng python -I thì thư mục script không nằm sẵn trong sys.path
import calib  # noqa: E402
import table as T  # noqa: E402
import tip as TIP  # noqa: E402

STEP = 3  # đọc 1 khung trong 3, khoảng 10 khung/giây
MOVE = 0.1  # kim cương, bi cái dời quá mức này là đang chạy
REST = 0.5  # giây đứng yên thì coi là dừng
STRIPES = (9, 10, 11, 12)  # bi sọc có mảng trắng, ứng viên bi cái cách chỗ đặt các bi này dưới STRIPE_GAP bị loại
STRIPE_GAP = 0.2  # mảng trắng của bi sọc lệch tâm bi tới cỡ 1 R, cộng biên


def cue_candidates(frame, cfg, H, poly, spots):
    """Các (L, W, fill) có thể là bi cái: mảng trắng đúng cỡ bi, đầy đĩa, nằm trong bàn, không trùng chỗ bi sọc."""
    white = T.white_mask(frame, cfg)
    clip = np.zeros_like(white)
    cv2.fillPoly(clip, [poly], 255)
    white &= clip
    n, _, stats, cent = cv2.connectedComponentsWithStats(white)
    out = []
    for k in range(1, n):
        lw = T.to_lw(H, [cent[k]])[0]
        r = T.radius_px(H, lw)
        if not 0.35 * np.pi * r * r <= stats[k, cv2.CC_STAT_AREA] <= 2.5 * np.pi * r * r:
            continue
        c = T.refine_center(white, cent[k], r)
        fill = T.disk_fill(white, c, r)
        lw = T.to_lw(H, [c])[0]
        if fill < 0.4 or any(np.hypot(*(lw - s)) < STRIPE_GAP for s in spots):
            continue
        out.append((float(lw[0]), float(lw[1]), fill))
    return out


def track(video, cfg, H, layout):
    """[(t, L, W)] của bi cái, NaN khi không thấy. Nhiều ứng viên thì lấy cái gần vị trí trước, chưa có thì cái đầy nhất."""
    cap = cv2.VideoCapture(video)
    fps = cap.get(cv2.CAP_PROP_FPS)
    poly = T.table_poly(H)
    spots = [np.array(layout[n]) for n in STRIPES]
    out, last, i = [], None, 0
    while True:
        if i % STEP:
            if not cap.grab():
                break
            i += 1
            continue
        ok, f = cap.read()
        if not ok:
            break
        cands = cue_candidates(f, cfg, H, poly, spots)
        if cands:
            if last is None:
                best = max(cands, key=lambda c: c[2])
            else:
                best = min(cands, key=lambda c: np.hypot(c[0] - last[0], c[1] - last[1]))
            last = best[:2]
            out.append((i / fps, best[0], best[1]))
        else:
            out.append((i / fps, np.nan, np.nan))
        i += 1
    return out


def tip_windows(cap, cfg):
    """[(a, b, tip)] mỗi đoạn ô overlay có chấm. Đoạn ngắn hơn 1 s là lúc chấm đang hiện dần, gộp vào đoạn liền sau."""
    segs = [s for s in TIP.changes(TIP.scan(cap, cfg, 0.5)) if s[2] is not None]
    out = []
    for a, b, v in segs:
        if out and a - out[-1][1] <= 0.5 and out[-1][1] - out[-1][0] < 1:
            out[-1] = [out[-1][0], b, v]
        else:
            out.append([a, b, v])
    return out


def still(tr, a, b):
    """Vị trí trung vị của bi cái trong [a, b], None nếu không thấy mẫu nào."""
    ps = [(L, W) for t, L, W in tr if a <= t <= b and not np.isnan(L)]
    return np.median(ps, axis=0) if ps else None


def strike(tr, a, b, p0, p1):
    """(t_start, t_end) của cú trong đoạn overlay [a, b]: bi cái đứng ở p0 lúc ngắm, dừng ở p1. Lúc ngắm, đầu cơ hay tay
    có thể lọt vài mẫu trắng xa p0, nên tìm ngược từ lúc dừng: kết thúc là mẫu đầu tiên tới sát p1 rồi ở yên đó REST giây,
    bắt đầu là mẫu ngay sau lần cuối có ba mẫu liền ở p0 trước lúc kết thúc (bi đang chạy đi ngang p0 chỉ để lại một
    mẫu). Cú mà bi cái dừng trong vòng MOVE quanh p0 (stop tại
    chỗ) thì không tách được, trả None."""
    seg = [(t, np.array([L, W])) for t, L, W in tr if a <= t <= b + 5 and not np.isnan(L)]
    if len(seg) < 3 or np.hypot(*(p1 - p0)) <= MOVE:
        return None
    near1 = [np.hypot(*(p - p1)) < 0.05 for _, p in seg]

    def settles(i):
        win = [j for j in range(i, len(seg)) if seg[j][0] <= seg[i][0] + REST]
        return near1[i] and not near1[i - 1] and seg[-1][0] >= seg[i][0] + REST and all(near1[j] for j in win)

    i1 = next((i for i in range(1, len(seg)) if settles(i)), None)
    if i1 is None:
        return None
    at0 = [np.hypot(*(p - p0)) <= MOVE for _, p in seg]
    i0 = max((i for i in range(2, i1) if at0[i] and at0[i - 1] and at0[i - 2]), default=None)
    if i0 is None:
        return None
    return seg[i0 + 1][0], seg[i1][0]


def spot_fill(cap, cfg, H, lw, times):
    """Tỉ lệ không-phải-nỉ thấp nhất trong đĩa 0.8 R ở chỗ đặt bi qua các khung `times`. Bi đã rơi không quay lại, người
    chơi che chỉ làm tăng tỉ lệ, nên lấy giá trị nhỏ nhất."""
    r = 0.8 * T.radius_px(H, lw)
    c = T.to_px(H, [lw])[0]
    lo, hi = cfg['spot_hsv']
    felt = lambda f: cv2.inRange(cv2.cvtColor(f, cv2.COLOR_BGR2HSV), np.array(lo), np.array(hi))  # noqa: E731
    return min(1 - T.disk_fill(felt(T.frame_at(cap, t)), c, r) for t in times)


def topdown(rows, layout, start, path, s=100):
    """Ảnh bàn nhìn từ trên, cùng hướng với camera: L=0 ở dưới, W=0 bên trái. Chỗ đặt bi xám, chỗ bi cái dừng sau cú k
    ghi số k (đỏ nếu trượt), vòng rỗng là chỗ đặt bi cái bằng tay lúc đầu."""
    pad = 30
    img = np.full((8 * s + 2 * pad, 4 * s + 2 * pad, 3), (150, 110, 20), np.uint8)
    px = lambda lw: (int(pad + lw[1] * s), int(pad + (8 - lw[0]) * s))  # noqa: E731
    cv2.rectangle(img, px((0, 0)), px((8, 4)), (90, 60, 10), 2)
    for L in range(9):
        cv2.line(img, px((L, 0)), px((L, 4)), (120, 90, 15), 1)
    for W in range(5):
        cv2.line(img, px((0, W)), px((8, W)), (120, 90, 15), 1)
    rb = int(T.R * s)
    for n, lw in layout.items():
        cv2.circle(img, px(lw), rb, (200, 200, 200), 1)
        cv2.putText(img, str(n), (px(lw)[0] - 6, px(lw)[1] + 5), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (200, 200, 200), 1)
    prev = start
    for r in rows:
        cur = (r['cue_L'], r['cue_W'])
        cv2.line(img, px(prev), px(cur), (255, 255, 255), 1, cv2.LINE_AA)
        col = (255, 255, 255) if r['made'] else (0, 0, 255)
        cv2.circle(img, px(cur), rb, col, -1)
        cv2.putText(img, str(r['shot']), (px(cur)[0] + rb + 2, px(cur)[1] + 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, col, 1)
        prev = cur
    cv2.circle(img, px(start), rb, (255, 255, 255), 1)
    cv2.imwrite(str(path), img)


def main(video, out, *flags):
    cfg = T.load_cfg(Path(video).stem)
    layout = T.load_layout(cfg['diagram'])
    H, _ = calib.fit(T.frame_at(cv2.VideoCapture(video), cfg['calib_t']), cfg, layout)
    Path(out).mkdir(parents=True, exist_ok=True)
    tr = track(video, cfg, H, layout)
    with open(Path(out) / 'track.csv', 'w', newline='') as fh:
        w = csv.writer(fh)
        w.writerow(['t', 'L', 'W'])
        w.writerows([(f'{t:.2f}', f'{L:.3f}', f'{W:.3f}') for t, L, W in tr])
    if '--track' in flags:
        return
    cap = cv2.VideoCapture(video)
    wins = tip_windows(cap, cfg)
    # Chỉ cú đầu được đặt bi bằng tay, nên chỗ bi cái dừng sau cú k là chỗ nó đứng lúc bắt đầu ngắm cú k+1.
    # Cú cuối không có đoạn sau: lấy nửa giây cuối bi cái còn thấy được, vì video có thể hết ngay khi bi vừa dừng.
    t_last = max(t for t, L, _ in tr if t <= wins[-1][1] + 5 and not np.isnan(L))
    heads = [still(tr, a, a + 2) for a, _, _ in wins] + [still(tr, t_last - 0.5, t_last)]
    dur = tr[-1][0]
    left, rows, start = sorted(layout), [], heads[0]
    for k, (a, b, v) in enumerate(wins):
        cue = heads[k + 1]
        s = None if cue is None or heads[k] is None else strike(tr, a, b, heads[k], cue)
        if s is None or not left:
            print(f'đoạn {a:.1f}–{b:.1f}s: không thấy bi cái chạy, bỏ qua')
            continue
        t0, t1 = s
        ball = left[0]
        nxt = wins[k + 1][0] if k + 1 < len(wins) else t1 + 3
        made = spot_fill(cap, cfg, H, layout[ball], np.arange(t1, min(max(nxt, t1 + 1), dur), 0.5)) < 0.3
        if made:
            left.remove(ball)
        rows.append({'shot': len(rows) + 1, 'ball': ball, 'tip_x': round(v[0], 2) + 0.0, 'tip_y': round(v[1], 2) + 0.0,
                     'cue_L': round(cue[0], 2), 'cue_W': round(cue[1], 2), 'made': int(made),
                     't_start': round(t0, 1), 't_end': round(t1, 1)})
    with open(Path(out) / 'shots.csv', 'w', newline='') as fh:
        w = csv.DictWriter(fh, ['shot', 'ball', 'tip_x', 'tip_y', 'cue_L', 'cue_W', 'made', 't_start', 't_end'])
        w.writeheader()
        w.writerows(rows)
    topdown(rows, layout, start, Path(out) / 'shots.png')
    print((Path(out) / 'shots.csv').read_text(), end='')
    print(f'made {sum(r["made"] for r in rows)}/{len(layout)}, bi cái đặt tay ban đầu ({start[0]:.2f}, {start[1]:.2f})')


if __name__ == '__main__':
    main(*sys.argv[1:])
