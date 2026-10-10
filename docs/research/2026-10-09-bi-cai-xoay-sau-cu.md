---
title: Bi cái xoáy thế nào sau khi cơ chạm — số đo thật, swerve/massé, quan sát video
date: 2026-10-09
type: research
---

# Bi cái xoáy thế nào sau khi cơ chạm

Phạm vi: bổ sung cho các số đã có sẵn (trượt→lăn τs = 2|u0|/(7μs g), μs 0,2, μr 0,01, phê α ≈ 10,9 rad/s², v = 2V0/(1+m/M+5/2(a²+b²)), |ω|R/v = 5/2·√(a²+b²), miscue 0,5R, squirt Shepard 2001, natural roll 2/5R). Không lặp lại các số đó.

Ký hiệu nguồn: **[đã đọc]** = đã mở trang/PDF, **[snippet]** = chỉ thấy kết quả search.

Ghi chú truy cập: `drdavepoolinfo.com` (đích redirect của `billiards.colostate.edu`) từ chối kết nối trực tiếp từ máy này (ECONNREFUSED), nên các PDF của Dr. Dave được đọc qua proxy `r.jina.ai`. Bản text trích từ PDF Mathcad bị vỡ một phần, **một số dấu +/− trong phương trình phải dựng lại** từ các phép kiểm trong chính tài liệu; chỗ nào dựng lại đều có ghi.

---

## 1. Số đo thật về tốc độ quay bi cái

### 1.1 SRF tối đa đo được bằng high-speed video: 1,37

- Dr. Dave đo loạt HSV A.98–A.109 (các độ cứng đầu cơ, 3 tốc độ, tăng dần offset đến khi miscue). Cú lớn nhất chưa miscue là cú thứ 4 trong **HSV A.106: SRF = 1,37** (hơn natural roll 37%), map ngược theo TP A.12 ra **offset ≈ 0,55R**. Không thấy tip rubbing sau va chạm, nhưng A.106 suýt double-hit. [đã đọc] https://r.jina.ai/https://drdavepoolinfo.com/bd_articles/2005/oct05.pdf
- TP A.12: SRF = (5/2)(b/R); b_max = 9/16 in với R = 1,125 in → b/R = 0,5 → SRF 1,25; số đo max 1,37 ở HSV A.106. Không có số rps/rad/s trong TP. [đã đọc] https://r.jina.ai/https://drdavepoolinfo.com/technical_proofs/new/TP_A-12.pdf
- Coriolis phân tích spin còn tăng đến offset 0,6R; Dr. Dave nói thí nghiệm "có vẻ ủng hộ" 0,6 nhưng vẫn khuyên giới hạn thực tế 0,5R. [đã đọc] (cùng oct05.pdf)
- Cơ quá nặng/quá cứng có thể giới hạn offset tối đa (tách tip không kịp → double hit), dẫn TP A.30 tr. 7–8. [đã đọc] https://r.jina.ai/https://drdavepoolinfo.com/?p=2453
- Bóng tập Jim Rempe vẽ vùng phê tới miscue limit **0,7R** (một user AZB phê bình là quá rộng so với ~0,5R của người mới). [snippet] https://forums.azbilliards.com/threads/practice-ball.146071/latest

### 1.2 Số rps cụ thể (tính toán, không phải đo)

- TP B.10 (Alciatore, 11/9/2023, mô hình giải tích, μs 0,2, tip efficiency η 0,87): cue 15 mph → bi cái **11,194 mph, ω0 = 34,841 rps** (SRF 1,25, b = R/2). Sau 2 ft drag cơ ngang: 31,43 rps (SRF 1,186). Cơ nâng 5°: 30,118 rps (SRF 1,164); nâng 12°: 27,423 rps (SRF 1,129) — nâng cơ làm bi nảy, mỗi lần nảy mất spin. **Toàn bộ là số tính, tài liệu ghi rõ input "typical".** [đã đọc] https://r.jina.ai/https://drdavepoolinfo.com/technical_proofs/new/TP_B-10.pdf
  - Kiểm chéo (em tự tính): ω = 1,25·v/R = 1,25 × 5,004 / 0,028575 = 218,9 rad/s = 34,84 rps — khớp công thức 5/2·a đang có.
- TP B.8 "Draw shot physics" (rev. 7/10/2011): tốc độ bi cái khi kéo điển hình **slow 8 / medium 10 / fast 14 / power 19 mph**; η = 0,87; bi chạm giữa với tip hoàn hảo đi ≈ 152% tốc độ cơ, với η 0,87 ≈ 127%. Toàn bộ là số tính. [đã đọc] https://r.jina.ai/https://drdavepoolinfo.com/technical_proofs/new/TP_B-8.pdf
- Công thức nhanh của "Jal" trên AZB (21/1/2016): **W[rps] = 6,23·(b/R)·V[mph]**, W[rad/s] = 39,1·(b/R)·V; ở b/R = 0,5 thì tốc độ mặt bi = 5/4·V. Bob Jewett cùng thread: follow full ~15 mph, break ~30 mph. [đã đọc] https://forums.azbilliards.com/goto/post?id=5433639
  - Suy ra (em tính, không phải đo): kéo "power" 19 mph ở 0,5R → ~59 rps (~3.550 rpm); ở SRF 1,37 → ~65 rps.

### 1.3 DigiBall

- SRF định nghĩa bởi dev (nataddrho, 19/9/2026): số vòng quay / số chu vi đã đi; lăn hoàn hảo = 1,0. Số đo thật duy nhất có trong thread: **piqué có thể > 2,0** ("I've gotten close"), **jump thường < 0,75** (23/9/2026). Không có số SRF cho draw/follow; không nói SRF được lấy mẫu lúc nào. [đã đọc] https://forums.azbilliards.com/posts/8519197/ , https://forums.azbilliards.com/posts/8521272/ , https://forums.azbilliards.com/posts/8518179/
- Feature list (12/2023): hiển thị spin **0 đến >1000 RPM**. Draw "drag slope" **16,4 rpm/m** đo **trên thảm (carpet), không phải bàn**; topspin rolling slope −1,4 rpm/m. Va chạm 1000–5000 G. [đã đọc] https://forums.azbilliards.com/threads/rank-of-digiball-features.559672/
- Một user (DaWizard, 24/10/2023) chụp màn hình cú right-spin: max 351 rpm, hiện tại 292 rpm; không có tốc độ bi kèm theo. [đã đọc] https://forums.azbilliards.com/threads/live-ball-spin-feedback.558227
- **Không tìm được** số rps max đo bằng DigiBall cho cú kéo mạnh nhất.

### 1.4 Bob Jewett / video tốc độ cao khác

- Jacksonville Experiments (1998): tip tiếp xúc ~0,001 s. [snippet] (kết quả search "revolutions per second", không mở trang gốc)
- **Không tìm được** bảng rps đo trực tiếp bằng camera cho draw từ Jewett.

### 1.5 So với lý thuyết 5/2·a

| Nguồn | SRF | Loại |
|---|---|---|
| Lý thuyết a = 0,5R | 1,25 | công thức |
| HSV A.106, a ≈ 0,55R | **1,37** | **đo** |
| Coriolis giới hạn 0,6R | 1,5 (5/2 × 0,6, em tính) | phân tích |
| DigiBall piqué | > 2,0 | đo (cơ nâng cao, chia cho vận tốc ngang) |

---

## 2. Swerve / massé khi cơ nâng

### 2.1 Định tính (Dr. Dave)

- Swerve chỉ xảy ra **khi bi còn trượt**; lăn rồi thì đi thẳng. Swerve tăng theo góc nâng; tốc độ nhanh → swerve đến muộn hơn; vải dính → sớm hơn; follow swerve **sớm** hơn draw nhưng góc swerve của **draw lớn hơn**; squerve có thể = 0 ở tổ hợp tốc độ/góc nâng nhất định. Không có số. [đã đọc] https://r.jina.ai/https://drdavepoolinfo.com/bd_articles/2008/march08.pdf
- "Swerve is just mini massé"; cơ nâng âm (đánh hướng lên) cong ngược chiều. [đã đọc] https://r.jina.ai/https://drdavepoolinfo.com/?p=2582
- Massé: bi nảy/skip, mức độ tùy góc nâng và tốc độ, nhưng hướng cuối gần như không đổi; vải dính khó cong lớn; aiming Coriolis "BAR" (hướng cuối ‖ đường từ điểm nằm của bi R tới điểm ngắm A trên vải). [đã đọc] https://r.jina.ai/https://drdavepoolinfo.com/bd_articles/2005/nov05.pdf

### 2.2 TP A.19 — mô hình đơn giản nhất (Alciatore)

[đã đọc, text PDF vỡ dấu một phần] https://r.jina.ai/https://drdavepoolinfo.com/technical_proofs/new/TP_A-19.pdf

Tham số: D = 0,057 m, μ = 0,2, g = 9,807; v_e = tốc độ bi khi đánh thẳng; φ = góc nâng cơ; a = offset ngang (phải tâm), b = offset dọc (dưới tâm).

- v_x0 = 0, v_y0 = v_e cos φ (thành phần đứng bị bàn hấp thụ)
- ω_x0 = 5 v_e b / (2R²)  (draw/follow)
- ω_y0 = 5 v_e a sin φ / (2R²)  (thành phần massé, trục nằm ngang dọc hướng đi)
- Vận tốc điểm tiếp xúc: v_Cx = v_x0 + R ω_y0, v_Cy = v_y0 − R ω_x0 (dấu dựng lại)
- Δt = 2 v_C0 / (7 μ g); quỹ đạo trượt là parabola: x(t) = v_x0 t − μ g (v_Cx/v_C0) t²/2, y(t) tương tự
- Cuối trượt: v_f = v_0 − (2/7)·v_C0 (vector)
- Hướng cuối (Coriolis): tan θ_c = a sin φ / (R cos φ − b). Thực đo thường hụt nhẹ so với dự đoán (squirt, tip–ball jamming).
- Ví dụ trong TP: 6/9/12 mph, φ = 70–85°, a = b = 0,25R; swerve nhẹ: 6 mph, a = 0,5R·cos45°, φ_draw 4°, φ_follow 3° → θ_c ≈ 2,193° (draw) / 0,784° (follow).

### 2.3 pooltool — có hỗ trợ góc nâng theta

- `Cue.theta` (độ): 0 = song song bàn (không massé), 90 = đâm thẳng xuống (massé tối đa). Mặc định V0 2,0 m/s, b 0,25. [đã đọc] https://pooltool.readthedocs.io/en/v0.3.0/autoapi/pooltool/objects/cue/index.html
- Mã `cue_strike` (InstantaneousPoint3D, dẫn TP A.30) [đã đọc, mã nguồn] https://raw.githubusercontent.com/ekiefl/pooltool/main/pooltool/physics/resolve/stick_ball/instantaneous_point/__init__.py :

```python
I_m = 2/5 * R**2
temp = a**2 + (b*cos(theta))**2 + (c*sin(theta))**2 - 2*b*c*cos(theta)*sin(theta)
v = 2*V0 / (1 + m/M + temp/I_m)
v_B = -v * [0, cos(theta), sin(theta)]
w_B = v/I_m * [-c*sin(theta) + b*cos(theta),  a*sin(theta),  -a*cos(theta)]
```
  Trong `solve()`, (a, c, b) của bi = điểm chạm cue-frame xoay theo theta: c_cue = √(1−a²−b²), ball_c = cosθ·c_cue − sinθ·b_cue, ball_b = sinθ·c_cue + cosθ·b_cue. Bản 2D đặt v_z = 0.
  - Em tự rút gọn (đại số, chưa chạy code): b_ball·cosθ − c_ball·sinθ = b_cue, nên temp = a² + b_cue² → **v không phụ thuộc theta**, trùng công thức strike anh đang có. Spin: ω_ngang(draw/follow) = (5/2)(v/R)·b; ω_massé = (5/2)(v/R)·a·sinθ; ω_đứng(english) = (5/2)(v/R)·a·cosθ. Khớp TP A.19.
  - Docstring nói điểm chạm Q = (a, b)/(1 + tip_radius/R) (tip radius 10,6 mm → hệ số ≈ 0,73), nhưng trong `solve()` em không thấy phép chia này — chưa kiểm hết call-site.
- Squirt trong pooltool (dẫn TP A.31): α = −arctan( (5/2)·a·√(1−a²) / (1 + m_b/m_e + (5/2)(1−a²)) ), end_mass mặc định = m_ball/30. [đã đọc] https://raw.githubusercontent.com/ekiefl/pooltool/main/pooltool/physics/resolve/stick_ball/squirt.py
- Pha trượt (`_evolve_slide_state`): hướng trượt tương đối û0 **cố định** suốt pha trượt; r = v0 t − ½ μs g t² û0; v = v0 − μs g t û0; ω = ω0 − (5/(2R)) μs g t (û0 × ẑ); ω_z giảm tuyến tính riêng với α = 5 u_sp g/(2R). [đã đọc] https://raw.githubusercontent.com/ekiefl/pooltool/main/pooltool/physics/evolve/__init__.py
- Mặc định bi: m 0,170097, R 0,028575, u_s 0,2, u_r 0,01, u_sp = (4/9)·R → α = 5·(4/9)·9,81/2 = **10,9 rad/s²** (khớp số anh đang có). Cơ mặc định M = 0,567 kg. [đã đọc] https://raw.githubusercontent.com/ekiefl/pooltool/main/pooltool/objects/ball/params.py , https://raw.githubusercontent.com/ekiefl/pooltool/main/pooltool/objects/cue/datatypes.py

### 2.4 Công thức chốt cho JS (tổng hợp từ TP A.19 + pooltool; phần ghép là của em)

Hệ trục: x = hướng cơ (ngang), y = trái, z = lên. a = offset ngang (+ = phải), b = offset dọc (+ = trên), chuẩn hoá theo R. θ = góc nâng (rad).

```js
// 1) Strike — v không phụ thuộc theta (xem 2.3)
const v = 2*V0 / (1 + m/M + 2.5*(a*a + b*b));
const k = 2.5 * v / R;
let vx = v*Math.cos(theta), vy = 0;          // bỏ v_z (bàn hấp thụ), như pooltool 2D / TP A.19
let wy =  k*b;                               // top(+)/draw(-): lăn đúng khi vx = R*wy
let wx = -k*a*Math.sin(theta);               // massé; dấu chọn để a>0 (phải) cong sang phải (-y). Kiểm bằng mắt.
let wz = -k*a*Math.cos(theta);               // english, chỉ ảnh hưởng băng/va chạm
// (tuỳ chọn) xoay (vx,vy) một góc squirt trước khi trượt

// 2) Trượt: vận tốc điểm tiếp xúc u = v + w × (-R z)
const ux = vx - R*wy, uy = vy + R*wx, u0 = Math.hypot(ux, uy);
const ex = ux/u0, ey = uy/u0;                // cố định suốt pha trượt
const ts = 2*u0 / (7*mu_s*g);
// t <= ts:
//   x = vx*t - 0.5*mu_s*g*ex*t*t ;  y = vy*t - 0.5*mu_s*g*ey*t*t   (parabola)
//   vx(t) = vx - mu_s*g*ex*t ;      vy(t) = vy - mu_s*g*ey*t
//   wy(t) = wy - (2.5/R)*mu_s*g*ex*t ;  wx(t) = wx + (2.5/R)*mu_s*g*ey*t
//   wz(t) giảm tuyến tính với alpha = 10.9 rad/s^2 về 0
// 3) Hết trượt: v_f = v_0 - (2/7)*u_0 (vector), sau đó lăn thẳng theo v_f, giảm tốc mu_r*g.
```

Hướng cuối để kiểm unit test: tan θ_c = a sinθ / (cosθ − b) (TP A.19, a, b chuẩn hoá; b ở TP là offset *dưới* tâm, nên đổi dấu nếu dùng b+ = trên).

Ghi chú: DigiBall đo piqué SRF > 2,0. Theo mô hình này SRF so với vận tốc ngang ≈ (5/2)·√(a²+b²)/cos θ, nên cơ nâng cao thì SRF vượt 1,25 là hợp lý (đây là suy luận của em, không có nguồn đối chiếu).

---

## 3. Quan sát bằng mắt (video tốc độ cao, bi chấm)

### 3.1 Draw: backspin còn bao xa

- HSV 3.1 "Stop shot showing loss of bottom spin over distance"; backspin mòn theo quãng đường, cú chậm mất **tỉ lệ** backspin lớn hơn; cú nhanh đi theo tangent line lâu hơn mới bẻ (NV 4.21). Ví dụ "average draw" chạm OB với SRF 0,625. [đã đọc] https://r.jina.ai/https://drdavepoolinfo.com/bd_articles/2006/jan06.pdf
- TP A.18 (Alciatore, 2005/2009): quãng trượt đến khi lăn d = v²·[24 − 50(b/R) − 25(b/R)²] / (98 μ g) (dấu trừ dựng lại; kiểm: b = 0 → 12v²/(49μg), b/R = 0,4 → 0). Số trong tài liệu (μ 0,2, offset theo % b_max = 9/16 in): [đã đọc] https://r.jina.ai/https://drdavepoolinfo.com/technical_proofs/new/TP_A-18.pdf

| | 3 mph | 7 mph | 12 mph |
|---|---|---|---|
| Stun (0%) | 0,737 ft | 4,012 ft | 11,789 ft |
| Draw 50% | 1,073 ft | 5,840 ft | 17,162 ft |
| Draw 100% | 1,312 ft | 7,146 ft | 20,999 ft |
| Follow 50% | 0,305 ft | 1,661 ft | 4,881 ft |

  - Kiểm chéo (em tính): với s = SRF, mô hình τs của anh cho d = 2v²(1+s)(6−s)/(49μg) — trùng TP A.18. Không mâu thuẫn.
  - Điểm **backspin = 0 (stun tức thời)** — em tự suy từ cùng mô hình, không có nguồn đo: t0 = 2 s v/(5μg), lúc đó tốc độ còn v(1 − 2s/5), quãng d0 = (v²/μg)(2s/5 − 2s²/25). Với s = 1,25: bi còn 50% tốc độ, d0 = 0,375 v²/(μg) (v = 3 m/s → ~1,7 m).
- **Không tìm được** số đo từ video về khoảng cách/thời gian đảo chiều backspin.

### 3.2 Stun

- Định nghĩa "sliding = stun = translation with no topspin or bottom spin"; drag đổi bottom spin → stun → forward roll; Video 3 (https://www.youtube.com/watch?v=fPQEBxbByD4) minh hoạ. [đã đọc] https://r.jina.ai/https://drdavepoolinfo.com/?p=2460
- Danh mục HSV stun: 6.5, 7.17, 7.18 (side view), A.31, A.134, A.141; draw: 4.1, A.35–A.42, A.150 (tip-ball impact medium draw), B.44 (vải lún khi draw ở các góc nâng). Trang index không ghi fps. [đã đọc] https://r.jina.ai/https://drdavepoolinfo.com/high-speed-video/

### 3.3 Trục quay nghiêng khi vừa lăn vừa phê

- Vệt mực ướt: lăn không phê → vòng tròn lớn thẳng đứng; có phê → vòng **nhỏ hơn và nghiêng**; phê càng nhiều/tốc độ càng thấp → càng nhỏ, càng nghiêng; quay tại chỗ → một chấm. Khi phê mòn, trục ngày càng nằm ngang; vệt là **đường xoắn ốc** bắt đầu từ một vĩ tuyến nghiêng nhỏ, kết thúc thành kinh tuyến thẳng đứng. Ẩn dụ "thùng phuy nghiêng lăn trên mép đáy" (Patrick Johnson / Mike Page). [đã đọc] https://r.jina.ai/https://drdavepoolinfo.com/?p=2460
- AZB "The physics of side spin" (12/2008): trục quay ví dụ qua 1:30–7:30; ở 45° spin chia đều side và follow; Patrick Johnson: trục "không lật ngược" mà đổi độ nghiêng dần. [đã đọc] https://forums.azbilliards.com/threads/the-physics-of-side-spin.123020
- Dev DigiBall: SRF không quyết định ngay góc trục quay, nhưng có thể ảnh hưởng tốc độ trục "dẹt dần" theo thời gian. [đã đọc] https://forums.azbilliards.com/posts/8521272/
- Bóng measles (Aramith 6 chấm đỏ): retailer nói giúp "visualize the rotation" của side/top/back spin. [snippet] https://www.pooldawg.com/aramith-pro-cup-6-red-dot-tv-measles-cue-ball
- Video "Drag spin loss and sidespin persistence, with spin-axis 'flip'" được nhắc trong forum, em không mở được video. [snippet]
- **"Spinning like a top": không tìm được** nguồn mô tả hình ảnh cụ thể.

---

## 4. Mâu thuẫn / lệch với số đang có

1. **Miscue a_max 0,5R** là giới hạn khuyến nghị, không phải trần vật lý: đo thật tới 0,55R (SRF 1,37, HSV A.106); Coriolis 0,6R; bóng Rempe vẽ 0,7R [snippet]. Nếu demo có slider "max", nên cho tới 0,55–0,6R và tô vùng nguy hiểm.
2. **Tip efficiency**: TP B.8/B.10 dùng η = 0,87 làm giảm tốc độ bi (127% thay vì 152% cue speed ở tâm). Công thức strike đang có không có η → tốc độ bi cao hơn thực ~16%. SRF ban đầu trong TP B.10 vẫn là 1,25, nên tỉ lệ spin/speed không đổi.
3. **Cơ nâng làm mất spin draw** (TP B.10: 12° mất ~13% spin sau 2 ft do nảy). Mô hình hiện tại nếu chỉ chiếu v·cosθ sẽ không có hiệu ứng này.
4. **pooltool docstring** gợi ý chia offset cho (1 + r_tip/R) ≈ 1,37; nếu a trong app là vị trí tâm đầu cơ thì điểm chạm thật nhỏ hơn ~27%. Chưa xác minh code có áp dụng không.
5. **α = 10,9 rad/s²** và **μs 0,2 / μr 0,01** khớp đúng mặc định pooltool. Không mâu thuẫn.
6. DigiBall hiển thị spin "0 đến >1000 RPM" trong khi tính toán cho kéo mạnh ra ~2.000–3.500 rpm. Chưa rõ đây là giới hạn cảm biến hay chỉ là thang hiển thị — không tìm được nguồn.

## Những gì đã bỏ qua

- Shepard "Amateur Physics for the Amateur Pool Player": không mở được bản PDF (link ozlabs 403, sfbilliards không thấy) → không có công thức massé từ Shepard.
- TP A.4, A.30, A.31 không mở trực tiếp; chỉ biết qua trích dẫn trong pooltool và TP A.19.
- Không xem video nào (YouTube/HSV), chỉ đọc chú thích.

## Sources

- https://r.jina.ai/https://drdavepoolinfo.com/technical_proofs/new/TP_A-12.pdf (TP A.12)
- https://r.jina.ai/https://drdavepoolinfo.com/bd_articles/2005/oct05.pdf (BD Oct 2005, Coriolis IV)
- https://r.jina.ai/https://drdavepoolinfo.com/?p=2453 (FAQ max spin)
- https://r.jina.ai/https://drdavepoolinfo.com/?p=2464 (FAQ spin/speed ratio)
- https://r.jina.ai/https://drdavepoolinfo.com/technical_proofs/new/TP_B-10.pdf (TP B.10)
- https://r.jina.ai/https://drdavepoolinfo.com/technical_proofs/new/TP_B-8.pdf (TP B.8)
- https://r.jina.ai/https://drdavepoolinfo.com/technical_proofs/new/TP_A-19.pdf (TP A.19)
- https://r.jina.ai/https://drdavepoolinfo.com/technical_proofs/new/TP_A-18.pdf (TP A.18)
- https://r.jina.ai/https://drdavepoolinfo.com/bd_articles/2008/march08.pdf (BD Mar 2008, squerve)
- https://r.jina.ai/https://drdavepoolinfo.com/bd_articles/2005/nov05.pdf (BD Nov 2005, massé)
- https://r.jina.ai/https://drdavepoolinfo.com/bd_articles/2006/jan06.pdf (BD Jan 2006, draw)
- https://r.jina.ai/https://drdavepoolinfo.com/?p=2582 (FAQ swerve)
- https://r.jina.ai/https://drdavepoolinfo.com/?p=2460 (FAQ sliding vs rolling, ink line)
- https://r.jina.ai/https://drdavepoolinfo.com/high-speed-video/ (HSV index)
- https://forums.azbilliards.com/posts/8519197/ (DigiBall SRF thread)
- https://forums.azbilliards.com/posts/8521272/
- https://forums.azbilliards.com/posts/8518179/
- https://forums.azbilliards.com/threads/rank-of-digiball-features.559672/
- https://forums.azbilliards.com/threads/live-ball-spin-feedback.558227
- https://forums.azbilliards.com/goto/post?id=5433639 (How fast does it spin?)
- https://forums.azbilliards.com/threads/the-physics-of-side-spin.123020
- https://pooltool.readthedocs.io/en/v0.3.0/autoapi/pooltool/objects/cue/index.html
- https://raw.githubusercontent.com/ekiefl/pooltool/main/pooltool/physics/resolve/stick_ball/instantaneous_point/__init__.py
- https://raw.githubusercontent.com/ekiefl/pooltool/main/pooltool/physics/resolve/stick_ball/squirt.py
- https://raw.githubusercontent.com/ekiefl/pooltool/main/pooltool/physics/evolve/__init__.py
- https://raw.githubusercontent.com/ekiefl/pooltool/main/pooltool/objects/ball/params.py
- https://raw.githubusercontent.com/ekiefl/pooltool/main/pooltool/objects/cue/datatypes.py
- [snippet] https://forums.azbilliards.com/threads/practice-ball.146071/latest
- [snippet] https://www.pooldawg.com/aramith-pro-cup-6-red-dot-tv-measles-cue-ball
