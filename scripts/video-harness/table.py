"""Hệ toạ độ bàn và nhận bi trên ảnh cho harness video drill 107.

Toạ độ ra theo kim cương như bộ drill 31–80: L 0→8 dọc, W 0→4 ngang, 1 bi = 0.18. Homography fit thẳng từ tâm bi
trên ảnh, vì tâm mọi bi nằm trên một mặt phẳng cao hơn mặt bàn 1 R, nên không cần dời tâm xuống điểm chạm nỉ.
"""
import json
from pathlib import Path

import cv2
import numpy as np

BALL = 0.18
R = BALL / 2
HERE = Path(__file__).resolve().parent
LAYOUT = HERE / '../../docs/research/pool-practice-drills/drill-107-layout.json'


def load_cfg(video_id):
    return json.loads((HERE / f'corners-{video_id}.json').read_text(encoding='utf-8'))


def load_layout(diagram):
    d = json.loads(LAYOUT.read_text(encoding='utf-8'))['diagrams'][diagram - 1]['balls']
    return {int(k): tuple(v) for k, v in d.items()}


def to_lw(H, pts):
    p = np.asarray(pts, np.float64).reshape(-1, 1, 2)
    return cv2.perspectiveTransform(p, H).reshape(-1, 2)


def to_px(H, lw):
    return to_lw(np.linalg.inv(H), lw)


def radius_px(H, lw):
    """Bán kính bi trên ảnh tại (L, W), đo theo chiều ngang bàn."""
    L, W = lw
    a, b = to_px(H, [(L, W - R), (L, W + R)])
    return float(np.hypot(*(a - b))) / 2


def frame_at(cap, t):
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
    ok, f = cap.read()
    if not ok:
        raise SystemExit(f'không đọc được khung ở {t}s')
    return f


def felt_mask(frame, cfg):
    """255 ở chỗ là nỉ xanh. Ngưỡng HSV nằm trong file cấu hình để chỉnh theo từng video."""
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    lo, hi = cfg['felt_hsv']
    return cv2.inRange(hsv, np.array(lo), np.array(hi))


def white_mask(frame, cfg):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    lo, hi = cfg['white_hsv']
    return cv2.inRange(hsv, np.array(lo), np.array(hi))


def table_poly(H, margin=0.0):
    """Đa giác mặt bàn trên ảnh, thu vào `margin` kim cương mỗi cạnh."""
    m = margin
    return to_px(H, [(m, m), (m, 4 - m), (8 - m, 4 - m), (8 - m, m)]).astype(np.int32)


def disk_fill(mask, c, r):
    """Tỉ lệ điểm 255 của `mask` trong đĩa tâm c bán kính r."""
    x, y = int(round(c[0])), int(round(c[1]))
    ri = int(np.ceil(r))
    h, w = mask.shape
    x0, x1, y0, y1 = max(0, x - ri), min(w, x + ri + 1), max(0, y - ri), min(h, y + ri + 1)
    if x0 >= x1 or y0 >= y1:
        return 0.0
    yy, xx = np.mgrid[y0:y1, x0:x1]
    disk = (xx - c[0]) ** 2 + (yy - c[1]) ** 2 <= r * r
    return float((mask[y0:y1, x0:x1][disk] > 0).mean()) if disk.any() else 0.0


def refine_center(mask, c, r, iters=10):
    """Mean-shift tâm đĩa bán kính r về trọng tâm các điểm 255 trong `mask`. Cửa sổ giới hạn đúng một bi nên hai bi
    sát nhau không kéo tâm lệch như khi lấy trọng tâm cả vùng liền."""
    c = np.array(c, np.float64)
    ri = int(np.ceil(r))
    h, w = mask.shape
    for _ in range(iters):
        x, y = int(round(c[0])), int(round(c[1]))
        x0, x1, y0, y1 = max(0, x - ri), min(w, x + ri + 1), max(0, y - ri), min(h, y + ri + 1)
        if x0 >= x1 or y0 >= y1:
            break
        yy, xx = np.mgrid[y0:y1, x0:x1]
        sel = ((xx - c[0]) ** 2 + (yy - c[1]) ** 2 <= r * r) & (mask[y0:y1, x0:x1] > 0)
        if not sel.any():
            break
        n = np.array([xx[sel].mean(), yy[sel].mean()])
        if np.hypot(*(n - c)) < 0.2:
            c = n
            break
        c = n
    return c
