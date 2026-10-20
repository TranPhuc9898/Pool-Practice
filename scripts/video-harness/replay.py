"""Đường bi cái từng cú của drill 31 cho Play diễn lại, cắt từ track video eJldkCO6TeA.

Chạy: python3 -I scripts/video-harness/replay.py scripts/video-harness/data/eJldkCO6TeA src/pool-engine/drills/31-twelve-ball-rails.replay.ts

Mỗi cú: cắt quanh t_start..t_end, vá khung mất bi, bỏ đoạn đứng yên hai đầu, đổi sang toạ độ chuẩn hoá
(x = 1 − W/4, y = L/8). Không làm mượt: track đã êm, làm mượt cắt góc chạm và góc băng. Kéo lệch tuyến tính theo
quãng đường để điểm đầu trùng `cueBall` của round và điểm cuối trùng `cueBall` của round kế (cú cuối giữ chỗ dừng
video). `contact` là mẫu gần bi mục tiêu nhất, đặt vào ghost ball.
"""

import csv
import math
import sys

DT = 0.06
UNIT = 12.5  # inch mỗi đơn vị video (một kim cương)
W_IN, L_IN, BALL = 50.0, 100.0, 2.25
STILL = 2.0  # inch/s

POCKET = {
    'footLeft': (0, 0), 'footRight': (1, 0), 'sideLeft': (0, 0.5),
    'sideRight': (1, 0.5), 'headLeft': (0, 1), 'headRight': (1, 1),
}
# Chép từ `31-twelve-ball-rails.ts`: bi mục tiêu, lỗ guide, chỗ bi cái trước cú (video).
OB = {
    1: (0.955, 0.8125), 2: (0.5, 0.25), 3: (0.045, 0.8125), 4: (0.5, 0.2062), 5: (0.955, 0.6875), 6: (0.5, 0.1625),
    7: (0.045, 0.6875), 8: (0.5, 0.1187), 9: (0.955, 0.5625), 10: (0.5, 0.075), 11: (0.045, 0.5625), 12: (0.5, 0.0312),
}
POCKET_OF = {
    1: 'headRight', 2: 'footRight', 3: 'headLeft', 4: 'footLeft', 5: 'headRight', 6: 'footRight',
    7: 'headLeft', 8: 'footRight', 9: 'headRight', 10: 'footRight', 11: 'headLeft', 12: 'footLeft',
}
CUE = {
    1: (0.5025, 0.4963), 2: (0.28, 0.285), 3: (0.55, 0.4888), 4: (0.6125, 0.3088), 5: (0.695, 0.51), 6: (0.155, 0.2587),
    7: (0.665, 0.5613), 8: (0.355, 0.1925), 9: (0.61, 0.3588), 10: (0.3725, 0.0575), 11: (0.1675, 0.4088),
    12: (0.7175, 0.1062),
}


def inch(a, b):
    return math.hypot((a[0] - b[0]) * W_IN, (a[1] - b[1]) * L_IN)


def ghost_of(n):
    o, pk = OB[n], POCKET[POCKET_OF[n]]
    d = inch(pk, o)
    return (o[0] - BALL * (pk[0] - o[0]) / d, o[1] - BALL * (pk[1] - o[1]) / d)


def fill(tr, a, b, via):
    """Thay các mẫu giữa hai mẫu thấy bi `a`, `b` bằng chuyển động đều theo đường gấp khúc qua `via`."""
    poly = [tr[a][1:], *via, tr[b][1:]]
    seg = [inch(poly[i], poly[i + 1]) for i in range(len(poly) - 1)]
    for i in range(a + 1, b):
        u = (tr[i][0] - tr[a][0]) / (tr[b][0] - tr[a][0]) * sum(seg)
        k = 0
        while k < len(seg) - 1 and u > seg[k]:
            u -= seg[k]
            k += 1
        f = u / seg[k] if seg[k] else 0
        tr[i] = (tr[i][0], poly[k][0] + (poly[k + 1][0] - poly[k][0]) * f, poly[k][1] + (poly[k + 1][1] - poly[k][1]) * f)


def main(data, out):
    tr = [(float(r['t']), 1 - float(r['W']) / 4, float(r['L']) / 8) for r in csv.DictReader(open(f'{data}/track.csv'))]
    # Đoạn track hỏng phải vẽ lại bằng tay, mốc thời gian đọc từ track.csv:
    # cú 10 mất bi 123.00–123.42 lúc dội băng đầu bàn, nội suy thẳng sẽ cắt góc nên đi qua điểm chạm băng;
    # cú 11 tracker kẹt ở (0.46, 0.21) 134.40–135.36, bi cái thật vào chạm bi 11 rồi ra giữa bàn.
    bad = {(123.00, 123.42): [(0.88, 0.989)], (134.40, 135.36): [ghost_of(11)]}
    for (t0, t1), _ in bad.items():
        tr = [(t, math.nan, math.nan) if t0 - 1e-6 <= t <= t1 + 1e-6 else (t, x, y) for t, x, y in tr]
    ok = [i for i, r in enumerate(tr) if not math.isnan(r[1])]
    for a, b in zip(ok, ok[1:]):
        if b > a + 1:
            via = next((v for (t0, t1), v in bad.items() if t0 - 1e-6 <= tr[a + 1][0] <= t1 + 1e-6), [])
            fill(tr, a, b, via)
    shots = list(csv.DictReader(open(f'{data}/shots.csv')))
    rows = []
    print('ball  n   len_in  head_in  tail_in  contact  ob_in  ghost_in')
    for s in shots:
        n = int(s['ball'])
        t0, t1 = float(s['t_start']), float(s['t_end'])
        # t_start/t_end làm tròn 0.1 s, có cú bi đã chạy trước t_start: lấy rộng ra rồi cắt theo tốc.
        raw = [(x, y) for t, x, y in tr if t0 - 0.5 <= t <= t1 + 0.5]
        speed = [inch(raw[i], raw[i + 1]) / DT for i in range(len(raw) - 1)]
        moving = [i for i, v in enumerate(speed) if v > STILL]
        pts = raw[moving[0]:moving[-1] + 2]
        end = CUE.get(n + 1, (1 - float(s['cue_W']) / 4, float(s['cue_L']) / 8))
        head = (CUE[n][0] - pts[0][0], CUE[n][1] - pts[0][1])
        tail = (end[0] - pts[-1][0], end[1] - pts[-1][1])
        arc = [0.0]
        for i in range(1, len(pts)):
            arc.append(arc[-1] + inch(pts[i - 1], pts[i]))
        total = arc[-1]
        # Hiệu chỉnh góc bàn của video lệch tới nửa inch ở mép: kẹp tâm bi vào trong mũi băng.
        rx, ry = BALL / 2 / W_IN, BALL / 2 / L_IN
        fit = [(min(max(p[0] + head[0] + (tail[0] - head[0]) * u / total, rx), 1 - rx),
                min(max(p[1] + head[1] + (tail[1] - head[1]) * u / total, ry), 1 - ry)) for p, u in zip(pts, arc)]
        # Lúc chạm tâm bi cái cách tâm bi mục tiêu đúng một bi, không gần hơn: mẫu gần bi mục tiêu nhất là mẫu chạm.
        # Mẫu 0.06 s thì bi cái đi tới 6 in, nên đặt mẫu đó vào ghost ball để bi mục tiêu rời đi đúng hướng lỗ guide.
        # Mọi cú drill 31 chạm bi trước băng. Track mất bi lúc chạm thì đoạn nội suy sau băng có thể sát bi mục tiêu
        # hơn (cú 12), nên chỉ tìm trước mẫu đầu tiên bị kẹp vào mũi băng.
        o, ghost = OB[n], ghost_of(n)
        rail = next((i for i, p in enumerate(fit) if min(p[0] - rx, 1 - rx - p[0], p[1] - ry, 1 - ry - p[1]) < 1e-9), len(fit))
        contact = min(range(rail), key=lambda i: inch(fit[i], o))
        print(f'{n:>4} {len(fit):>3} {total:>8.1f} {inch(head, (0, 0)):>8.2f} {inch(tail, (0, 0)):>8.2f}'
              f' {contact:>8} {inch(fit[contact], o):>6.2f} {inch(fit[contact], ghost):>9.2f}')
        fit[contact] = ghost
        rows.append((n, contact, fit))

    with open(out, 'w') as f:
        f.write("import type { CueReplay } from '../types';\n\n")
        f.write('// Sinh bởi `scripts/video-harness/replay.py` từ track video eJldkCO6TeA. Đừng sửa tay.\n')
        f.write('export const twelveBallRailsReplay: CueReplay[] = [\n')
        for n, contact, fit in rows:
            xy = ', '.join(f'{v:.4f}'.rstrip('0').rstrip('.') for p in fit for v in p)
            f.write(f'  // Ball {n}\n  {{ dt: {DT}, contact: {contact}, xy: [{xy}] }},\n')
        f.write('];\n')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
