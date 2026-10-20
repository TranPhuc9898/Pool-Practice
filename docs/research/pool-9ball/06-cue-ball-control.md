---
title: Pool 9 bi — điều bi cái (nhóm 2, clip #3–#7)
date: 2026-10-19
type: research-topic
status: xong (batch 1)
sources: transcript ASR clip #3–#7; docs/research/nguon/2026-10-08-nguon-nguyen-ly-dieu-bi.md; tính toán của em
---

# Điều bi cái — kiểm chứng nhóm 2

## Kết luận

| Clip | Claim | Nhãn | Căn cứ |
|---|---|---|---|
| #3 | Cắt 15–45° thì bi lăn lệch khoảng 30°, lớn nhất khoảng 34° ở nửa bi | APPROXIMATION | Shepard: 28–34° trong dải đó, đỉnh 33.7° |
| #3 | Cắt dưới 15° thì lệch bằng khoảng 2 lần góc cắt | APPROXIMATION | Shepard: 1.9–2.4×. Jewett dùng 3×, đoán dư |
| #3 | Cắt 60–80° thì lệch bằng khoảng 2/3 góc tới tangent line | APPROXIMATION | Shepard: sai dưới 1° |
| #3 | Đánh mạnh thì đường bi dịch song song ra phía tangent | VERIFIED | Jewett 1995 |
| #3 | Đánh quá nhẹ thì góc rộng ra vì ma sát bi-bi ăn topspin | UNVERIFIED (có cơ chế ứng viên) | Batch 2: Shepard cộng μ(v) của TP A.14 cho đúng chiều, độ lớn 1–2°. Tính toán của em, chưa có nguồn công bố, cần đo |
| #4 | Draw tốt, cắt 0–40° thì góc lùi bằng 3 lần góc cắt | CONDITIONAL | Trisect của Dr. Dave, cùng giới hạn 40° |
| #4 | Draw kém tin cậy hơn follow | VERIFIED | Jewett 2011: "touch with draw is much harder" |
| #5 | Follow, bi mục tiêu đi dọc băng: góc tới pháp tuyến cộng góc cắt bằng 60° | APPROXIMATION | Rút ra từ quy tắc 30°. Sai lớn khi cắt trên 50° |
| #5 | Draw tốt cho đường đối xứng với đường follow qua pháp tuyến | CONDITIONAL | Ghép với trisect thì chỉ đối xứng quanh cú cắt 30° |
| #6 | Bi mục tiêu trên đường lỗ giữa–lỗ góc, đánh stun thì bi cái vào băng ngắn 45° | VERIFIED (hình học) | Bàn 2:1 thì đường đó nghiêng đúng 45° |
| #6 | Vào băng ngắn 45° thì sau hai băng qua giữa bàn | CONDITIONAL | Mô hình phản xạ gương nói không phải lúc nào cũng qua tâm. Cần đo |
| #7 | Hệ đẩy 2 băng dài: 1/2 bi lên 4 diamond, 1/4 bi lên 3, 1/8 bi lên 2 | UNVERIFIED, NEEDS CALIBRATION | Không có nguồn độc lập |

Tóm lại: các quy tắc góc của Tuấn là bản nhẩm nhanh của cùng một công thức vật lý, và chúng khớp công thức đó. Hai hệ đi băng (#6, #7) thì phụ thuộc bàn, cần đo trước khi đưa vào app làm đích chấm điểm.

---

## 1. Nền vật lý dùng để kiểm

### 1.1 Stun: quy tắc 90°

Bi cái đang trượt lúc chạm (không top, không back) thì tách theo tangent line, vuông góc với đường tâm–tâm. Chứng minh của Jewett (BD 02/1995) dựa trên bảo toàn động lượng và năng lượng với va chạm đàn hồi hoàn toàn. Nguồn và chi tiết ở `nguon-nguyen-ly-dieu-bi.md` mục 1.1.

Sai lệch khi va chạm không đàn hồi hoàn toàn: em tính với hệ số đàn hồi bi-bi e. Bi cái còn lại thành phần vận tốc dọc đường tâm bằng (1−e)/2 · v·cosφ, nên góc tách thực nhỏ hơn 90°:

| Góc cắt φ | e = 1.0 | e = 0.95 (engine hiện tại) | e = 0.93 |
|---|---|---|---|
| 10° | 90.0° | 81.9° | 78.8° |
| 15° | 90.0° | 84.7° | 82.6° |
| 30° | 90.0° | 87.5° | 86.5° |
| 45° | 90.0° | 88.6° | 88.0° |
| 60° | 90.0° | 89.2° | 88.8° |

Con số 86° mà forum hay nhắc (nguồn mục 1.1) nằm đúng dải này. Cú càng dày thì góc tách càng hụt so với 90°.

### 1.2 Bi lăn tự nhiên: công thức Shepard

Ron Shepard (*Amateur Physics for the Amateur Pool Player*) cho góc lệch θ của bi cái lăn tự nhiên, tính từ đường đánh ban đầu, theo góc cắt φ:

```
tan θ = sin φ · cos φ / (sin² φ + 2/5)
```

Giả định: bi cái lăn tự nhiên hoàn toàn lúc chạm, va chạm bi-bi không ma sát và đàn hồi hoàn toàn, hướng tính là hướng cuối sau khi follow bám nỉ. Cực đại 33.75° tại φ ≈ 28.1°.

Bảng em tính, so với ba quy tắc nhẩm của Tuấn:

| φ | θ Shepard | 2×φ (dày) | 30° (giữa) | 2/3·(90−φ) (mỏng) |
|---|---|---|---|---|
| 5° | 12.0° | 10° | | |
| 10° | 21.7° | 20° | | |
| 15° | 28.2° | 30° | 30° | |
| 20° | 31.9° | | 30° | |
| 28.1° | 33.7° | | 30° (Tuấn nói khoảng 34° ở nửa bi: đúng) | |
| 35° | 32.8° | | 30° | |
| 40° | 31.2° | | 30° | |
| 45° | 29.1° | | 30° | 30.0° |
| 50° | 26.5° | | | 26.7° |
| 60° | 20.6° | | | 20.0° |
| 70° | 14.1° | | | 13.3° |
| 80° | 7.1° | | | 6.7° |

Đọc bảng:
- **Dải giữa 15–45°:** quy tắc 30° sai nhiều nhất khoảng 3.7° (ở đỉnh). Đủ tốt để nhẩm.
- **Dải dày dưới 15°:** hệ số thật khoảng 1.9–2.4×, Tuấn dùng 2× là sát hơn con số 3× của Jewett (Jewett 1995 cũng nói bi cái nặng thì hạ xuống 2.5× hoặc 2×). Ở 10°, 2× sai 1.7°, 3× sai 8.3°.
- **Dải mỏng 60–80°:** quy tắc 2/3 sai dưới 1°. Đây là quy tắc chính xác nhất trong ba.

Các nguồn lệch nhau về con số ở đỉnh: Jewett 1995 nói gần 37°, Shepard 33.75°, Dr. Dave dùng 30° cho thực hành. Lệch 3–7°, chưa có nguồn giải thích vì sao (ghi ở nguồn mục 1.2). Tuấn nói 34°, trùng Shepard.

### 1.3 Draw: trisect

Dr. Dave: với draw "good action" (đánh thấp gần giới hạn miscue, đủ tốc để giữ backspin tới lúc chạm), hướng cuối của bi cái lệch khỏi đường ngắm 3 lần góc cắt, chỉ đúng khi góc cắt dưới 40°. Nguồn: post của Dr. Dave trên AzBilliards (dẫn ở nguồn mục 1.4).

Tuấn nói đúng điều này, kể cả giới hạn 40° và điều kiện "trô tốt".

Cần nói rõ: nếu thiếu backspin lúc chạm thì đường đi nằm đâu đó giữa tangent line và đường trisect. Jewett gọi đây là "vùng xám" không có hệ nào tốt. App không được chấm draw theo đúng 3× nếu không đo được lượng spin lúc chạm.

---

## 2. Từng clip

### #3 — Góc ra tự nhiên

Ba quy tắc khớp Shepard như bảng 1.2. Hai ý phụ:

- "Đánh mạnh thì đường dịch song song": **VERIFIED**. Jewett 1995 mô tả đúng hiện tượng này: bi trượt ra phía tangent một đoạn rồi mới đi song song với đường của cú đánh nhẹ.
- "Đánh quá nhẹ thì góc rộng ra": **UNVERIFIED, có cơ chế ứng viên** (cập nhật batch 2, thay phỏng đoán throw của batch 1). Cơ chế Tuấn nêu đứng được về vật lý. Bi cái lăn thì tại điểm chạm vận tốc trượt có thành phần dọc đường nối tâm bằng v·cosφ. Ma sát bi-bi theo thành phần đó ăn bớt topspin, tỉ lệ khoảng k = 2.5·μ(v)·cos²φ·(1+e)/2. μ(v) của TP A.14 tăng khi tốc độ giảm, nên đánh nhẹ thì mất nhiều topspin hơn, bi cái cong ít hơn, góc ra rộng hơn. Em tính bằng Shepard cộng hạng này:

  | Góc cắt | 0.5 m/s | 3 m/s | Shepard lý tưởng |
  |---|---|---|---|
  | 15° | 30.4° | 28.6° | 28.2° |
  | 30° | 35.0° | 33.9° | 33.7° |
  | 45° | 29.5° | 29.1° | 29.1° |

  Đúng chiều Tuấn nói, độ lớn 1–2°, rõ nhất ở cú dày. Đây là **tính toán của em**, chưa có nguồn công bố cùng kết quả. Cần đo trên bàn hoặc chạy engine (engine có mô hình ma sát này, xem mục 3).

### #4 — Góc ra khi trô

Trisect đúng như 1.3. Bài kiểm của Tuấn (bi mục tiêu giữa bàn, bi cái trên head string, cắt khoảng 30° vào lỗ góc, bi cái lùi vào lỗ giữa) cho góc lùi 90°, tức đúng 3 × 30°. Hình học bài này chưa dựng lại để xem 30° có ra đúng từ vị trí đặt bi không. Việc này để batch 5, khi viết spec drill.

### #5 — Gần băng, "quy luật 60°"

Em rút ra được quy luật này từ quy tắc 30°:

- Bi mục tiêu đi dọc băng, nên tangent line vuông góc với băng, tức trùng pháp tuyến.
- Đường đánh của bi cái tạo với hướng bi mục tiêu góc φ, nên tạo với tangent line (pháp tuyến) góc 90° − φ.
- Bi lăn tự nhiên lệch khoảng 30° khỏi đường đánh, về phía tangent line. Góc còn lại tới pháp tuyến là (90° − φ) − 30° = **60° − φ**.

Vậy "góc tới pháp tuyến + góc cắt = 60°" là quy tắc 30° viết lại theo hệ quy chiếu băng. Nó thừa hưởng sai số của quy tắc 30°. Tính chính xác bằng Shepard, góc tới pháp tuyến là 90° − φ − θ:

| φ | Quy luật 60° | Shepard |
|---|---|---|
| 15° | 45° | 46.8° |
| 30° | 30° | 26.3° |
| 45° | 15° | 15.9° |
| 60° | 0° | 9.4° |
| 70° | (âm, vô nghĩa) | 5.9° |

Dùng được từ 15° tới khoảng 50°. Ở 60°, Tuấn nói "gần trùng pháp tuyến", thực tế còn lệch khoảng 9°. Cắt mỏng hơn nữa thì quy luật ra số âm, phải chuyển sang quy tắc 2/3.

Giả định của phép rút: bi mục tiêu đi song song với băng thật, không chạm băng trước khi vào lỗ, bi cái lăn tự nhiên lúc chạm.

Ý "draw tốt đối xứng với follow qua pháp tuyến": em kiểm bằng trisect. Draw lệch 3φ khỏi đường đánh. Pháp tuyến (tangent line) nằm cách đường đánh 90° − φ. Vậy draw vượt qua pháp tuyến một góc 3φ − (90° − φ) = 4φ − 90°. Follow nằm phía bên kia pháp tuyến, cách 60° − φ. Hai góc bằng nhau khi 4φ − 90 = 60 − φ, tức **φ = 30°**. Như vậy đường draw chỉ đối xứng với đường follow quanh cú cắt 30°. Ở 20° thì draw còn chưa qua pháp tuyến (−10°) trong khi follow cách 40°. Ở 40° thì draw vượt 70°, follow cách 20°. Nhãn: **CONDITIONAL**, chỉ đúng gần 30°. Đây là phép tính của em dựa trên hai quy tắc nhẩm, chưa đo.

Repo đã có drill 18–20 Rail Cut (Bachelors, Masters, Doctorate). Quy luật này có thể thành gợi ý đường bi cái cho các drill đó. Đề xuất, chưa làm.

### #6 — Quy tắc 45°

**Phần đứng được bằng hình học.** Bàn chơi 50 × 100 inch, tỉ lệ 2:1. Đường nối lỗ giữa (0, 50) với lỗ góc đối diện (50, 0) có phương trình x + y = 50, nghiêng đúng 45° so với băng. Bi mục tiêu nằm trên đường đó và được đánh dọc theo nó, thì tangent line vuông góc với nó, cũng nghiêng 45°. Đánh stun thì bi cái đi theo tangent line, nên vào băng ngắn ở 45° bất kể cắt dày hay mỏng. Đây là **VERIFIED về hình học**, với điều kiện tâm lỗ nằm đúng trên đường băng và bàn đúng 2:1. Trừ sai số do hệ số đàn hồi bi-bi (mục 1.1, 1–5° tuỳ độ dày).

**Phần chưa đứng được.** Với mô hình phản xạ gương lý tưởng (góc vào bằng góc ra), bi mục tiêu ở (a, 50 − a) thì sau băng ngắn và băng dài, bi cái cắt đường nối hai lỗ giữa tại x = 100 − 2a:

| a (inch) | Cắt đường lỗ giữa tại x |
|---|---|
| 30 | 40 |
| 35 | 30 |
| 37.5 | 25 (đúng tâm) |
| 40 | 20 |
| 45 | 10 |

Tức là phản xạ gương chỉ đưa bi qua tâm bàn ở một vị trí. Băng thật không phản xạ gương: góc ra ngắn lại theo tốc độ và spin (nguồn mục 1.6). Có thể độ rút ngắn góc lại kéo các đường về gần tâm, nhưng đó là **suy đoán của em**. Tuấn đánh dấu "khu giữa bàn" bằng nửa tờ A4 (khoảng 21 × 15 cm), một vùng khá rộng.

Nguồn ngoài duy nhất cho câu "vào băng ngắn 45° thì qua tâm bàn" là post của Mike Eckert trên AzBilliards (https://forums.azbilliards.com/goto/post?id=3803615), mức ý kiến diễn đàn.

Nhãn: **CONDITIONAL**. Cần đo trên bàn thật, hoặc chạy engine sau khi hiệu chỉnh băng (kế hoạch `.claude/ke-hoach/2026-10-18-hieu-chinh-engine.md`).

### #7 — Hệ đẩy 2 băng dài

Không tìm thấy nguồn độc lập nào cho bộ số 1/2 → 4, 1/4 → 3, 1/8 → 2 diamond. Đây là hệ thực nghiệm của Tuấn trên bàn của anh ấy. Bộ chỉnh (áp phê ±1 diamond, bi mục tiêu xa lỗ 1 diamond thì +2, bi cái lệch 1 diamond thì ±2, nỉ mới +1 tới 2) cũng thế.

Một điểm đáng lưu ý: chính Tuấn nói nỉ mới làm lệch 1–2 diamond. Nghĩa là sai số do bàn lớn ngang với bước nhảy giữa các mức độ dày của hệ. Không thể dùng bộ số này làm đáp án đúng trong app. Chỉ dùng được như một bài **tự hiệu chỉnh**: người chơi đánh 3 mức độ dày, ghi diamond thực tế, app lưu thành bảng của riêng bàn đó.

Nhãn: **UNVERIFIED**, **NEEDS CALIBRATION**.

---

## 3. Liên hệ với app (chỉ đề xuất, chưa làm)

Em chưa chạy harness nào. Những gì dưới đây suy ra từ báo cáo đọc code, chưa đo.

1. **Shepard là test case tốt cho engine.** *(Sửa ở batch 2: bản batch 1 ghi engine không có ma sát tiếp tuyến bi-bi. Sai. Em đọc code thấy có.)* Cả `ShotPhysics.hit()` (`ShotPhysics.swift:496–509`) và `RackSim.ballHit` (`RackSim.swift:180–199`) dùng μ(s) = 9.951e-3 + 0.108·exp(−1.088·s) của TP A.14, giới hạn ma sát ở s/7, và trừ topspin bi cái theo xung ma sát. e = 0.95. Vì vậy góc kỳ vọng của engine không phải bảng 1.2 nguyên bản. Phải cộng phần ma sát ăn topspin (+0.3° tới +2° tuỳ tốc độ, bảng ở mục #3) và trừ phần hụt do e < 1. Engine lệch xa bảng đã hiệu chỉnh này thì engine có lỗi. Đưa vào file 14.
2. **Quy tắc 90° trong engine sẽ không đúng 90°** vì e = 0.95. Guide `tangentLine` trong `PoolGuideRenderer.swift` (theo báo cáo) vẽ đúng 90°. Ở cú dày 10–15°, đường thật lệch 5–8° so với guide. Cần quyết định guide vẽ lý tưởng hay vẽ theo engine. Hỏi ở file 16.
3. **#6 và #7 phụ thuộc mô hình băng.** Engine dùng e = 0.82, sinE = 0.27, μ = 0.14 và chưa hiệu chỉnh. Không nên dựng drill chấm điểm theo đích của #6, #7 trước khi xong kế hoạch hiệu chỉnh engine.
4. **Chấm điểm hiện là tự báo** (`logShot({pot, position})`). Các quy tắc trong file này dùng tốt nhất ở dạng gợi ý trước cú đánh (vẽ đường dự kiến 30°, trisect, 60° − φ) và để người chơi tự so với kết quả, chưa dùng để chấm tự động.

### Drill có sẵn liên quan

| Drill trong repo | Quy tắc ở file này |
|---|---|
| 07 Tangent Line | 90° (#3, #6) |
| 03, 04 Follow; 15 Three-Ball 30° Max | 30°, 2×, 2/3 (#3) |
| 05, 06 Draw | Trisect (#4) |
| 18–20 Rail Cut | Quy luật 60° (#5) |
| 09 One Rail | Nền cho #6, #7 |

### Drill mới đáng viết spec ở batch 5

- **Carom 30°:** dời bi mục tiêu theo góc cắt 10°, 30°, 60°, 75°, ghi điểm dừng bi cái, so với bảng Shepard. Lấy từ Jewett 1995 Shot 2 và ba quy tắc của Tuấn.
- **Trisect vào lỗ giữa:** bài kiểm của Tuấn ở #4.
- **Hai băng qua tâm:** bi mục tiêu đặt dọc đường x + y = 50 ở ba vị trí, đánh stun, ghi điểm bi cái cắt đường lỗ giữa. Kết quả vừa là bài tập vừa là dữ liệu kiểm #6.
- **Tự hiệu chỉnh 2 băng dài:** 3 độ dày × 3 lần, ghi diamond. Kết quả thành bảng riêng của bàn.

## 4. Thông số NEEDS CALIBRATION

| Thông số | Vì sao cần đo | Đo bằng gì |
|---|---|---|
| Hệ số đàn hồi bi-bi e | Quyết định góc tách stun thực | Video 240 fps, theo `2026-10-18-phieu-do-ban.md` |
| Góc ra của bi cái sau băng theo tốc độ | Quyết định #6, #7 | Cùng phiếu đo |
| Điểm đến 2 băng dài theo độ dày | #7 | Bài tự hiệu chỉnh ở trên |
| Lượng backspin còn lại lúc chạm theo khoảng cách | Quyết định draw có đạt trisect không | Chưa có cách đo rẻ. Hỏi ở file 16 |
