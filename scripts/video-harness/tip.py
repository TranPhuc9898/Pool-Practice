"""Đọc điểm chạm cơ từ ô overlay góc phải trên của video poolbilliards.co.

python tip.py <video> <out-dir> [--dump] [--step 0.5]
  in mốc thời gian mỗi khi chấm màu trong ô đổi vị trí; --dump lưu crop ô ở mỗi mốc để đọc bằng mắt

Ô overlay là vòng trắng có chữ thập. Lúc chưa chọn điểm thì giữa vòng là đĩa xám nhạt, lúc có điểm thì có chấm màu.
tip_x dương là phải (outside/inside tuỳ hướng), tip_y dương là trên (follow), đơn vị R của bi cái, nằm trong [-1, 1].
"""
import sys
from pathlib import Path

import cv2
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))  # chạy bằng python -I thì thư mục script không nằm sẵn trong sys.path
import table as T  # noqa: E402

MIN_DOT_PX = 40  # chấm nhỏ hơn thế coi như nhiễu nén video


def read_tip(frame, cfg):
    """(tip_x, tip_y) hoặc None khi ô không có chấm màu."""
    (cx, cy), r = cfg['tip_roi']['c'], cfg['tip_roi']['r']
    x0, y0 = cx - r, cy - r
    roi = frame[y0:y0 + 2 * r + 1, x0:x0 + 2 * r + 1]
    lo, hi = cfg['orange_hsv']
    dot = cv2.inRange(cv2.cvtColor(roi, cv2.COLOR_BGR2HSV), np.array(lo), np.array(hi))
    yy, xx = np.mgrid[0:roi.shape[0], 0:roi.shape[1]]
    dot[(xx - r) ** 2 + (yy - r) ** 2 > (0.97 * r) ** 2] = 0
    n, lab, stats, cent = cv2.connectedComponentsWithStats(dot)
    if n < 2:
        return None
    k = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    if stats[k, cv2.CC_STAT_AREA] < MIN_DOT_PX:
        return None
    dx, dy = cent[k][0] - r, cent[k][1] - r
    return float(dx / r), float(-dy / r)


def scan(cap, cfg, step, t_end=None):
    """[(t, tip)] mỗi `step` giây; tip là None khi ô trống."""
    dur = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)
    t_end = min(t_end or dur, dur - step)
    out, t = [], 0.0
    while t <= t_end:
        out.append((t, read_tip(T.frame_at(cap, t), cfg)))
        t = round(t + step, 3)
    return out


def changes(series, tol=0.05):
    """Gộp chuỗi quét thành các đoạn liền có cùng giá trị tip (lệch ≤ tol R)."""
    segs = []
    for t, v in series:
        same = segs and ((v is None and segs[-1][2] is None) or (
            v is not None and segs[-1][2] is not None and np.hypot(v[0] - segs[-1][2][0], v[1] - segs[-1][2][1]) <= tol))
        if same:
            segs[-1][1] = t
        else:
            segs.append([t, t, v])
    return segs


def crop(frame, cfg):
    (cx, cy), r = cfg['tip_roi']['c'], cfg['tip_roi']['r']
    return frame[cy - r:cy + r + 1, cx - r:cx + r + 1]


def main(video, out, *flags):
    cfg = T.load_cfg(Path(video).stem)
    step = float(flags[flags.index('--step') + 1]) if '--step' in flags else 0.5
    cap = cv2.VideoCapture(video)
    segs = changes(scan(cap, cfg, step))
    print('từ     tới     tip_x  tip_y')
    for a, b, v in segs:
        print(f'{a:6.1f} {b:6.1f}  ' + ('  —      —' if v is None else f'{v[0]:+.2f}  {v[1]:+.2f}'))
    if '--dump' in flags:
        d = Path(out) / 'tip'
        d.mkdir(parents=True, exist_ok=True)
        for a, b, v in segs:
            if v is not None:
                img = crop(T.frame_at(cap, (a + b) / 2), cfg).copy()
                cv2.putText(img, f'{v[0]:+.2f},{v[1]:+.2f}', (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                cv2.imwrite(str(d / f'tip-{a:06.1f}.png'), img)


if __name__ == '__main__':
    main(*sys.argv[1:])
