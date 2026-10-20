"""Homography pixel → kim cương cho video drill 107, kiểm bằng 12 bi xếp sẵn.

python calib.py <video> <out-dir> [--check] [--pick]
  --pick   anh click 4 miệng lỗ góc theo thứ tự (0,0) (0,4) (8,4) (8,0) rồi in JSON để chép vào corners-<id>.json
  --check  in sai số từng bi (fit đủ 12 bi và leave-one-out), sai số lỗ giữa, lưu calib.png
"""
import sys
from pathlib import Path

import cv2
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))  # chạy bằng python -I thì thư mục script không nằm sẵn trong sys.path
import table as T  # noqa: E402

CORNER_ORDER = ['0,0', '0,4', '8,4', '8,0']


def rough_h(cfg):
    src = np.array([cfg['corners'][k] for k in CORNER_ORDER], np.float64)
    dst = np.array([[float(v) for v in k.split(',')] for k in CORNER_ORDER], np.float64)
    return cv2.getPerspectiveTransform(src.astype(np.float32), dst.astype(np.float32))


def ball_centers(frame, cfg, H, layout):
    """Tâm ảnh của từng bi trong layout: bắt đầu ở chỗ H dự đoán, mean-shift trên mask không-phải-nỉ."""
    ball = cv2.bitwise_not(T.felt_mask(frame, cfg))
    ball = cv2.morphologyEx(ball, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    out = {}
    for n, lw in layout.items():
        p = T.to_px(H, [lw])[0]
        r = T.radius_px(H, lw)
        for _ in range(3):
            p = T.refine_center(ball, p, r)
        out[n] = p
    return out


def fit(frame, cfg, layout):
    """Hai vòng: H thô từ 4 góc để tìm bi, rồi fit lại từ tâm 12 bi; vòng hai dò lại bi trên H mới."""
    H = rough_h(cfg)
    for _ in range(2):
        px = ball_centers(frame, cfg, H, layout)
        ns = sorted(layout)
        H, _ = cv2.findHomography(np.array([px[n] for n in ns]), np.array([layout[n] for n in ns]), 0)
    return H, px


def check(frame, cfg, layout, out):
    H, px = fit(frame, cfg, layout)
    ns = sorted(layout)
    src = np.array([px[n] for n in ns])
    dst = np.array([layout[n] for n in ns])
    fit_err = np.hypot(*(T.to_lw(H, src) - dst).T)
    loo = []
    for i in range(len(ns)):
        keep = [j for j in range(len(ns)) if j != i]
        Hi, _ = cv2.findHomography(src[keep], dst[keep], 0)
        loo.append(float(np.hypot(*(T.to_lw(Hi, src[i:i + 1])[0] - dst[i]))))
    print('bi   L     W     fit   loo   (kim cương)')
    for n, e, l in zip(ns, fit_err, loo):
        print(f'{n:>2}  {layout[n][0]:4.2f}  {layout[n][1]:4.2f}  {e:.3f} {l:.3f}')
    print(f'fit: trung vị {np.median(fit_err):.3f} tối đa {fit_err.max():.3f}')
    print(f'leave-one-out: trung vị {np.median(loo):.3f} tối đa {max(loo):.3f}')
    corners = T.to_lw(H, [cfg['corners'][k] for k in CORNER_ORDER])
    for k, c in zip(CORNER_ORDER, corners):
        print(f'góc {k} đọc tay → ({c[0]:.2f}, {c[1]:.2f})')
    img = frame.copy()
    cv2.polylines(img, [T.table_poly(H)], True, (0, 255, 255), 2)
    for L in range(9):
        a, b = T.to_px(H, [(L, 0), (L, 4)])
        cv2.line(img, tuple(map(int, a)), tuple(map(int, b)), (0, 200, 255), 1)
    for W in range(5):
        a, b = T.to_px(H, [(0, W), (8, W)])
        cv2.line(img, tuple(map(int, a)), tuple(map(int, b)), (0, 200, 255), 1)
    for n in ns:
        e = T.to_px(H, [layout[n]])[0]
        cv2.circle(img, tuple(map(int, px[n])), int(T.radius_px(H, layout[n])), (0, 0, 255), 1)
        cv2.drawMarker(img, tuple(map(int, e)), (0, 255, 0), cv2.MARKER_CROSS, 10, 1)
        cv2.putText(img, str(n), (int(px[n][0]) + 14, int(px[n][1])), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
    cv2.imwrite(str(Path(out) / 'calib.png'), img)
    return np.median(loo) <= 0.1 and max(loo) <= 0.2


def pick(frame):
    pts = []
    win = 'click 4 goc: (0,0) (0,4) (8,4) (8,0)'

    def on(ev, x, y, *_):
        if ev == cv2.EVENT_LBUTTONDOWN:
            pts.append([x, y])
            print(f'{CORNER_ORDER[len(pts) - 1]}: [{x}, {y}]')

    cv2.namedWindow(win)
    cv2.setMouseCallback(win, on)
    while len(pts) < 4:
        cv2.imshow(win, frame)
        if cv2.waitKey(30) == 27:
            break
    cv2.destroyAllWindows()
    print('"corners": {' + ', '.join(f'"{k}": {p}' for k, p in zip(CORNER_ORDER, pts)) + '}')


def main(video, out, *flags):
    vid = Path(video).stem
    cfg = T.load_cfg(vid)
    frame = T.frame_at(cv2.VideoCapture(video), cfg['calib_t'])
    if '--pick' in flags:
        return pick(frame)
    Path(out).mkdir(parents=True, exist_ok=True)
    ok = check(frame, cfg, T.load_layout(cfg['diagram']), out)
    print('ĐẠT' if ok else 'CHƯA ĐẠT (cần trung vị ≤ 0.1, tối đa ≤ 0.2)')
    sys.exit(0 if ok else 1)


if __name__ == '__main__':
    main(*sys.argv[1:])
