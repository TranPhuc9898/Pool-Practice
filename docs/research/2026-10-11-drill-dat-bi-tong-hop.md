---
title: Drill đặt bi sẵn: vào bi, bank/kick/safety/break, app và schema
date: 2026-10-11
type: research-synthesis
nguon:
  - nguon/2026-10-11-nguon-shot-making.md
  - nguon/2026-10-11-nguon-bank-kick-safety-break.md
  - nguon/2026-10-11-nguon-app-va-dinh-dang-drill.md
tiep-noi: 2026-10-08-drill-dieu-bi-tong-hop.md
---

# Drill đặt bi sẵn: tổng hợp đợt 2

Bản 08/10 phủ điều bi cái. Bản này lấp phần còn lại: vào bi và ngắm (43 drill), bank/kick/safety/break/jump (54 drill), app trên thị trường (15 app), cách các chuẩn ghi drill, đổi cỡ bàn, và mảng VN/châu Á. Tổng khoảng 130 URL đã mở, chi tiết và URL nằm trong 3 file nguồn.

Quy ước nhãn giữ như bản 08/10: **[nguồn]**, **[forum]**, **[snippet]**, **[suy luận]**, **[đề xuất]**.

Toạ độ trong file này dùng hệ của app: `x` 0…1 theo bề rộng 50", `y` 0…1 theo chiều dài 100", foot rail ở `y = 0`. Ba file nguồn dùng hệ diamond khác nhau (ghi ở đầu mỗi file), lúc nhập vào app phải quy đổi.

---

## 0. Kết luận trong 1 phút

1. **Bộ drill đáng nhập nhất là của Billiard University.** Layout đọc từ diagram lưới diamond, có thang điểm, phủ đủ vào bi (F1, F6, S2), bank (S7), kick (S6), safety (S5), break (S10), jump (S9). Khoảng 28 drill bank/kick/safety/break/jump và 4 drill vào bi dựng lại tin được. [nguồn]
2. **Test vào bi chuẩn nhất là Colin Colenso /80**, có thang từ dưới beginner tới pro (<20 … 70–79 pro-level). Nhưng cặp vị trí bi cái ↔ bi mục tiêu do agent đo từ hình, chưa chắc, phải đối chiếu PDF trước khi nhập. [nguồn cho luật và thang, suy luận cho toạ độ]
3. **Schema hiện tại là nút thắt, không phải thiếu drill.** `PoolDrill` chỉ có một `targetPocket` và một cách đặt bi cái. Phần lớn drill có điểm (F6 10 cú, Colin 16 cú, BU S6/S7 nhiều vị trí, Jewett progressive) cần ít nhất `shots[]` và `progression`. [suy luận, đối chiếu code]
4. **Thị trường đã chuyển sang adaptive.** Cueist chọn drill để xác suất thắng ghost khoảng 50%, Self-Trainer có luật lên/xuống mức công khai. Thuật toán progressive của Jewett (vào thì khó lên một nấc, trượt thì lùi) cho app adaptive mà không cần server. [nguồn]
5. **Kick và bank phải hiệu chỉnh theo bàn.** Corner-5 lý thuyết là 5−3=2, bàn pool thực tế gần 5−2=3. Nên có bước "table checkout" (K7, K8, B8) trước các drill kick/bank. [nguồn: BD 12/2010]

---

## 1. App đang có gì (17 drill, cập nhật 11/10)

| # | Drill | Nguồn layout | Độ tin layout |
|---|---|---|---|
| 01–10 | Straight-In … Two-Ball Pattern | Bản 08/10 | Như bản 08/10 |
| 11 | Wagon Wheel | BU Exam I F7 | Luật [nguồn], 10 vị trí target [suy luận] |
| 12 | Line of Balls | BU Exam II S1 Bachelors | [nguồn] |
| 13 | Red-Black | Cuestars, chuyển sang pool | [suy luận chuyển đổi] |
| 14 | L-Drill | Phổ biến, rút còn 9 bi hở 2 bi | [suy luận]. Bản gốc 15 bi hở 1 bi sẽ chồng nhau khi vẽ bi phóng 2.5× |
| 15 | Three-Ball, 30° Max | Scott Lee | Luật [nguồn], layout là mẫu (ngoài bàn tung ngẫu nhiên) |
| 16 | No-Rail T | Cuestars "No Cushions" | [suy luận chuyển đổi] |
| 17 | 9-Ball Runout | Tự soạn | [đề xuất] |

Trống hoàn toàn: bank, kick, safety, break, jump/massé, rail shot, combo.

---

## 2. Shortlist nhập tiếp

Xếp theo (giá trị tập) × (độ tin layout) ÷ (phải đổi schema bao nhiêu). Cột "Schema" cho biết nhập được ngay hay cần trường mới ở mục 3.

### 2.1 Nhập được ngay với schema hiện tại

| Drill | Bi | Luật tóm tắt | Đạt khi | Ghi chú |
|---|---|---|---|---|
| **BU S2 Rail Cut, Bachelors** (shot-making D27) | 7 | Bi sát băng tại 2 và 6 diamond hai long rail, tâm hai end rail, center spot. BIH, thứ tự tuỳ ý, không scratch, không combo, không chạm bi khác. Hai lượt, lấy lượt tốt hơn | /7 [nguồn] | Masters 11 bi, Doctorate 15 bi: nhập thành 2 drill nữa. Bi nhiều, đúng thứ anh muốn |
| **Spot Shot Challenge** (D25) | 1 | OB ở foot spot, BIH trong kitchen. Vào bi và đưa bi cái về kitchen, đánh tiếp từ chỗ dừng | Số cú liên tiếp [nguồn] | Hợp lệ với schema nếu chấp nhận "attempt = một cú" |
| **15-Ball Lineup** (D01) | 15 | Scott Lee, straight-in liên tiếp | Đếm /15 | 15 bi sát nhau sẽ chồng hình khi phóng 2.5×, phải giãn hoặc giảm zoom |
| **BU S5 hide-behind-target** (bank/kick S1) | 2–3 | Vào nhẹ OB, giấu bi cái sau bi chắn | 6/10/14 theo cấp [nguồn] | Zone vẽ được bằng `cueBallTargetZones` |
| **Lag ladder / Touch-and-stay** (S12, S13) | 1–2 | Đo khoảng dừng | Đếm bi, nắm tay/gang tay/1 bi [nguồn] | Rẻ, hợp khởi động |

### 2.2 Cần `shots[]` và `cueBallPlacement` (mục 3.1, 3.2)

| Drill | Vì sao đáng | Đạt khi |
|---|---|---|
| **Colin Colenso /80** (D24) | Test vào bi có thang tới pro, 16 cú × 5 lần | <20 / 20–29 / 30–44 C / 45–59 B / 60–69 A / 70–79 pro [nguồn] |
| **BU F6 Ball Pocketing** (D23) | 10 cú từ 2 vị trí bi cái, side + corner, cắt trái/phải | /10 [nguồn] |
| **BU S7 Bank** (B1–B3) | Cross-side 3 bi → cross-corner 7 vị trí | /3, /5, /7 [nguồn] |
| **BU S6 Kick** (K1–K3) | One-rail vào hàng bi → 2 băng → 3 băng | Có thang [nguồn] |
| **BU S10 Break** (R1) | 5 tiêu chí mỗi cú, lấy median | Tối đa 5 [nguồn] |

### 2.3 Cần `progression` (mục 3.3)

| Drill | Cơ chế |
|---|---|
| **BU F1 Cut Shot** (D14) | Ladder góc cắt, thang Exam I /10 [nguồn] |
| **Jewett Progressive Cut 1D–5D** (D15–D17, D35, D36) | Vào thì lùi bi 1 nấc, trượt thì tiến lại. Điểm = vị trí cuối, tự hội tụ về mức 50% [nguồn] |
| **VEPP #143/#144 bank ladder** (B4), **#149 jump ball-gap** (J4), **Jewett massé** (J8) | Cùng khuôn progressive |

### 2.4 Để sau

- **Jump/massé BU III (J10–J16), kick 3 băng K4:** độ khó 5, ít người dùng app tập tới.
- **Combo/carom (D39–D43):** không drill nào có thang điểm số. [nguồn: gap mục 5 shot-making]
- **PAT:** chỉ có khung điểm từ forum (§1.04 max 150, tổng PAT-1 1530), không có layout. [forum]

---

## 3. Schema `PoolDrill` thiếu gì

Thứ tự theo số drill mỗi trường mở khoá. Hai agent (shot-making và app/format) độc lập đi tới cùng hai trường đầu.

1. **`shots[]`**: mỗi cú có bi cái, bi mục tiêu, lỗ đích, zone riêng. Mở khoá F6, Colin, S6, S7, và cho Line/L/T hiện đúng lỗ của từng bi. Hiện app chỉ vẽ guide cho bi đầu và một lỗ.
2. **`cueBallPlacement`**: `eachAttempt | firstShotOnly | playFromRest`, kèm vùng đặt (kitchen, cách băng N bi). Spot Shot, Ten in the Side, Red-Black liên tục đều cần.
3. **`progression`**: tham số biến thiên (khoảng cách, góc), bước khi đạt/trượt, điểm = vị trí cuối. Đây cũng là đường rẻ nhất tới adaptive.
4. **Guide bank/kick**: `GuideLine` hiện chỉ có đường bi mục tiêu thẳng. Bank cần đường OB qua băng, kick cần đường bi cái tới băng trước khi chạm bi. `expectedCuePath` có điểm chạm băng nhưng chỉ cho bi cái sau va chạm. [suy luận, đọc `types.ts`]
5. **`scoring` tổng quát**: điểm theo outcome (pot, inZone, safe, scratch), max, cách gộp (sum/avg/median). Giữ `pocketed N / inZone N` như trường hợp riêng.
6. **`tableSize` / `pocketSize`** ở kết quả, và `anchor: table | ball` cho từng phần tử (mục 4).
7. **`constraints`** (cấm chạm băng, thứ tự băng, cấm chạm bi khác) và **`mirror`**. Hiện ghi được bằng chữ trong `objective`, chưa máy đọc được.

**Đổi schema là cửa một chiều** với dữ liệu tiến độ đã lưu (`progress.ts` gắn theo `drill.id` và `attemptCount`). Nên thêm trường tuỳ chọn, giữ trường cũ, không đổi nghĩa `attemptCount`. [đề xuất]

---

## 4. Đổi cỡ bàn 7 / 8 / 9 ft

- Mặt chơi 7' = 40×80", 8' = 44×88" hoặc 46×92", 9' = 50×100". Bi cùng cỡ, lỗ tương đối to hơn trên bàn nhỏ. [forum 2007]
- Hệ kick/diamond chạy như nhau trên mọi cỡ. Position phải chỉnh, có người giảm lực 20–25% khi từ 9' xuống bar box. [forum]
- Cueist ban đầu chỉ có drill cho 9ft, người dùng phàn nàn bàn 7ft không ổn. Dev vẽ lại mỗi drill thành 3 bản theo cỡ bàn và tính rating riêng từng cỡ (31/03/2025). Không công bố cách scale. [forum]
- Không có nguồn chính thức nào hướng dẫn scale drill.
- VN: 9' phổ biến ở quán và giải (Sapo 04/2026). [nguồn]

Khuyến nghị [suy luận]: toạ độ chuẩn hoá theo mặt chơi như hiện tại là đúng cho thứ gắn với lỗ và băng. Thứ gắn với bi (khe giữa bi, khoảng CB–OB trong drill stop/draw, zone tính theo bề rộng bi) lưu theo đường kính bi. App giữ 9' làm mặc định, ghi `tableSize` vào kết quả trước khi tính chuyện vẽ lại.

---

## 5. Thị trường app

- **Ba cách ghi kết quả:**
  - tap made/missed, phần lớn app dùng;
  - chấm chỗ bi cái dừng lên diagram rồi tính điểm theo khoảng cách (Bullseye, 400 shot);
  - camera tự đếm (DrillRoom). Theo số dev công bố năm 2022, khoảng 7% cú bị nhận sai, và app hỏng hẳn với carom, bi chạm bi.
- **Giá:**
  - Bullseye $9.99/tháng hoặc $199.99 lifetime;
  - WPB $79.99/năm;
  - Cueist $95.90/năm;
  - DrillRoom $89.99/năm.
- **Lời chê lặp lại:**
  - paywall;
  - setup lâu giữa các cú;
  - không tính cỡ lỗ;
  - drill dựng cho 9ft;
  - không có drill nhiều bi và safety (Cueist 2025).
- **Không có app drill tiếng Việt nào.** App Trung Quốc trên App Store thiên về cảm biến cơ và overlay ngắm, không có thư viện layout. [nguồn]

Chỗ đứng hợp lý cho app [suy luận]:
- Drill dọc, guide đúng hình học, nhiều bi, có thang điểm từ nguồn.
- Ghi kết quả bằng tap trước. Chấm vị trí dừng kiểu Bullseye đáng làm sau, vì trên màn đã có bàn dọc.

---

## 6. Việt Nam / châu Á

- Không tìm được trang text nào của HLV hay CLB VN mô tả bài đặt bi. Nội dung dạy gần như chắc nằm trên YouTube/Facebook/TikTok, công cụ không mở được. [suy luận]
- Thuật ngữ tiếng Việt ("kéo bi", "chặn bi", "đi bi", "phê") chưa có nguồn định nghĩa. Muốn chốt nhãn tiếng Việt cho app thì hỏi người chơi hoặc xem video. [snippet]
- Trung Quốc: chỉ có một bài Toutiao do AI viết. Các tên "米字练习", "一条龙", "九宫格走位" không tìm ra nguồn. [nguồn chất lượng thấp]
- Philippines: Reyes, Bustamante, de la Cruz dẫn ban huấn luyện NLBSPh (06/2026), không nói phương pháp. [nguồn]

---

## 7. Chỗ nguồn mâu thuẫn hoặc cần kiểm lại

| Chủ đề | Mâu thuẫn | Xử lý |
|---|---|---|
| drdavepoolinfo.com | Agent app không thử vì được dặn là bị chặn. Hai agent kia mở bình thường | Coi là mở được. Agent app có thể đã sót nguồn từ domain này |
| Corner-5 | Lý thuyết 5−3, thực tế gần 5−2 | Drill checkout trước, số do người tập tự đo |
| Colin /80 | Cặp CB↔OB đo từ hình, sai số khoảng ±¼ diamond | Đối chiếu `Colin_potting_drill.pdf` trước khi nhập |
| Toạ độ Jewett | Đọc từ ảnh scan OCR | Dựng thử trên bàn thật trước khi khoá |
| "Lòng bàn 142×284 cm" cho bàn VN | Lệch với 9' quốc tế 127×254 cm | Coi là nhầm số phủ bì |

---

## 8. Cố tình bỏ

- **Sách và DVD thương mại:** Tucker, Eberle, Capelle, Kinister, Feijen gốc. Không có bản đọc được, agent không điền từ trí nhớ.
- **VEPP Disc IV–V:** layout nằm trong video, chỉ có tên drill.
- **Push-out 9-ball:** không có drill nào có layout.
- **Phía app:**
  - leaderboard, rating kiểu Elo (cần dữ liệu nhiều người);
  - camera tracking (đắt mà vẫn sai khoảng 7%);
  - timer, video demo.
