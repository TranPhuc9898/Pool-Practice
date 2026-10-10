# Planner 9-ball v1: tìm đường tự nhiên nhất

Ngày 2026-10-09. Mọi số dưới đây đều lấy từ `node plan-bench.js` (depth 2, 3 chuỗi nhiễu) và một lần đo riêng cho depth 1/2/3, chạy trên Apple M4 Pro, node v24.18.0. Sim dùng `sim.js` nguyên trạng, không sửa dòng nào.

File:
- `planner.js`: planner.
- `plan-bench.js`: bench. Kết quả ghi ra `plan-bench.txt` (bảng từng cú) và `plan-runs.json` (quỹ đạo thật).
- `planner-viz.tpl.html` cộng `build-viz.js` sinh ra `planner-viz.html`, một file tự chứa 235 KB.

## Phạm vi v1: đã cắt những gì

Planner chỉ làm **cú đánh thẳng bi số nhỏ nhất vào một lỗ**. Phần cố tình bỏ, và đây là phần chiếm 80% độ khó của 9-ball thật:
- Không có combo, carom, bank hay kick.
- Không đánh phòng thủ (safety). Gặp thế không có cú thẳng thì planner dừng và báo "cần phòng thủ".
- Không có cú phá cụm có chủ đích. Bi khác bị chạm chỉ bị tính phạt.
- Không có break, không có push-out, không có ball-in-hand sau lỗi.
- Không có cú masse hay nhấc cơ. Sim không có độ nghiêng cơ, nên bi cái luôn đi thẳng tới lúc chạm.
- Luật đã cài:
  - Bi cái phải chạm bi nhỏ nhất trước.
  - Rơi bi cái là lỗi.
  - Bi mục tiêu phải vào lỗ, lỗ nào cũng được, nhưng chỉ tính cú vào đúng lỗ đã định.
  - Bi 9 rơi trong một cú hợp lệ thì thắng.

## Cách chấm

1. **Lọc hình học** cho từng lỗ trong 6 lỗ, loại khi gặp một trong các điều kiện sau:
   - Ghost ball nằm ngoài mặt bàn.
   - Góc cắt lớn hơn 82°.
   - Đường bi cái tới ghost bị chặn, hoặc đường bi mục tiêu tới miệng lỗ bị chặn. "Bị chặn" nghĩa là có bi cách đoạn thẳng dưới D.
   - Lỗ giữa mà góc vào so với trục lỗ lớn hơn 55°.
2. **Lưới ứng viên** (tầng đầu):
   - b ∈ {−0.4, −0.2, 0, 0.2, 0.4}, a ∈ {−0.3, 0, 0.3}, đơn vị R.
   - 8 mức lực: 0.8, 1.2, 1.6, 2.0, 2.5, 3.0, 3.5, 4.0 m/s.
   - Mỗi tổ hợp thử 3 điểm ngắm trong miệng lỗ (giữa, 35%, 65%), dừng ở điểm đầu tiên ăn được.
3. **Giải hướng ngắm**:
   - Dùng secant trên hướng bi mục tiêu ngay sau va chạm, so với hướng tới điểm ngắm.
   - Lần chạy sim chỉ có 2 bi và cắt ngay ở va chạm đầu. Vì vậy squirt và throw đúng như `sim.js` tính, không dùng công thức riêng.
4. **Lần chạy danh nghĩa**: `run` đủ mọi bi, dt 1/500. Loại ứng viên nếu có lỗi, rơi bi cái, hoặc bi không vào đúng lỗ.
5. **Xếp sơ bộ** theo `e^(−phạt) · V(thế sau)`, giữ 8 ứng viên đầu.
6. **Căn giữa cửa sổ ngắm**:
   - Quét hai mép cửa sổ φ (bước 0.04°, sau đó bisect 2 lần), rồi đặt hướng ngắm vào giữa.
   - Lý do: hướng hội tụ của secant nằm lệch trong cửa sổ, nên căn giữa làm p tăng rõ.
   - Độ rộng cửa sổ cho thêm `pWin = erf(w/2 / (√2·σφ))`.
7. **p_pot**:
   - Lấy 16 mẫu nhiễu ICGA (σφ 0.125°, σV 0.075 m/s, σa,b 0.5 mm/R), PRNG mulberry32 có seed theo thế và ứng viên, nên kết quả tất định.
   - Mỗi mẫu chạy `run` đủ bi, dt 1/1000.
   - Công thức: `p = (số mẫu ăn + 4·pWin) / 20`. Nghĩa là co về ước lượng giải tích bằng 4 mẫu giả, để giảm nhiễu xếp hạng của 16 mẫu.
8. **Giá trị thế sau V**:
   - Lấy bi nhỏ nhất kế tiếp và lỗ dễ nhất.
   - Xác suất ăn kiểu người chơi khá: σ ngắm 0.5°, sai số hướng bi ≈ σ·d1/(D·cosθ), dung sai lỗ ≈ nửa bề rộng hiệu dụng / d2.
   - Đường bị chặn hoặc góc cắt lớn hơn 80° thì bằng 0. Hết bi thì V = 1. Không còn cú thẳng nào thì V = 0.03.
   - **V được lấy trung bình trên các mẫu nhiễu ăn được, không lấy từ thế danh nghĩa.** Xem điểm yếu số 3 để biết vì sao.
9. **Phạt "không tự nhiên"**: `1.2|a| + 1.0·max(0,|b|−0.2) + 0.25·max(0, v−2) + 0.15·(số va chạm bi ngoài cú chạm đầu)`.
10. **Lookahead**:
    - Beam 3, depth 2.
    - Tầng sau dùng lưới gọn: a = 0, b ∈ {−0.4, 0, 0.4}, 4 mức lực, top 3. p chỉ lấy từ cửa sổ, không lấy mẫu.
    - Điểm của một cú ở tầng đầu: `p · e^(−phạt) · (½·điểm tốt nhất tầng sau + ½·V trung bình)`.
    - Ứng viên ngoài beam bị nhân 0.5.

Ý tưởng lấy từ CueCard (Archibald, thắng ICGA 2008: lấy mẫu nhiễu, đào sâu theo beam), PickPocket (Smith 2007: giá trị vị trí theo xác suất ăn cú sau) và mô hình nhiễu của giải ICGA computational pool. Planner chỉ dựng lại theo tinh thần, không bám số liệu của họ.

## Bench (`plan-bench.txt`)

Có 5 thế, mỗi thế chơi 3 lần với 3 chuỗi nhiễu thực thi khác nhau. Mỗi cú thực thi là cú planner chọn, cộng một mẫu nhiễu ICGA.

| Thế | Kết quả 3 lần |
|---|---|
| 3 bi cuối bàn (7-8-9) | trượt cú 1, trượt cú 1, **sạch bàn 3 cú** |
| 9 bi sau break | trượt cú 4, trượt cú 1, **sạch bàn 9 cú** |
| Có cụm bi (3-4-5 dính nhau) | cả 3 lần dừng vì không có cú thẳng vào bi 3 hoặc 4 |
| Bi sát băng | trượt cú 1, trượt cú 6, trượt cú 1 |
| Thế khó | trượt cú 3, hết cú thẳng ở cú 2, trượt cú 1 |

- **Sạch bàn: 2/15 bàn.**
- Cú ăn trên cú đánh: 30/39.
- Tổng p_pot dự báo cho 39 cú là 34.0, thực tế ăn 30. Planner hơi lạc quan, nhưng cỡ mẫu còn nhỏ.
- 9 cú trượt đều ứng với nhiễu φ từ 0.06° tới 0.32°, nghĩa là từ 0.5σ tới 2.6σ. Không thấy cú nào trượt vì lỗi sim hay lỗi luật.
- Phân bố nhiễu thực thi: độ lệch chuẩn 1.15σ trên 39 mẫu, có 3 mẫu vượt 2σ. Kiểm riêng PRNG trên 20 000 mẫu: sd 0.998.

Kiểu cú planner chọn, đếm trên 29 quyết định riêng biệt:
- Có side (a ≠ 0): 6 cú.
- Draw hoặc follow tối đa (|b| = 0.4): 7 cú.
- Lực từ 3.5 m/s trở lên: 7 cú.
- Còn lại là bi giữa hoặc gần giữa, lực vừa. Phần phạt "không tự nhiên" có tác dụng.

Ở cú mà bi mục tiêu phải đi 30 inch tới lỗ, cửa sổ ngắm chỉ còn 0.15–0.25°. Đó là lý do p rơi về 0.5–0.75 với nhiễu ICGA. Đây là hành vi đúng của mô hình, không phải bug: dung sai ±1.1 inch ở lỗ chia cho hệ số khuếch đại d1/D ≈ 20.

## Thời gian

CPU một lõi, đo bằng `process.cpuUsage` trên M4 Pro:

| | trung vị | max | số lần sim mỗi quyết định |
|---|---|---|---|
| depth 2 (33 quyết định trong bench) | **2.2 s** | 3.4 s | khoảng 450–700 lần `run` cộng 200–700 lần giải ngắm |
| depth 1 (đo riêng 2 thế) | 1.6–2.0 s | | |
| depth 3 (đo riêng 2 thế) | 5.1–5.4 s | | 1200–1600 |

- Depth 3 ra **cùng cú** với depth 2 ở cả 2 thế đã thử. Mới thử 2 thế nên chưa kết luận depth 3 vô ích, nhưng hiện chưa đáng gấp đôi thời gian.
- Lần chạy đầu có một quyết định đo bằng đồng hồ tường ra 702 s, trong khi CPU chỉ 66 s cho cả bench. Máy bị treo hoặc ngủ giữa chừng, nên giờ chỉ báo thời gian CPU.

**Ước lượng cho iPhone (chưa đo):**
- Một lõi hiệu năng của A17 Pro/A18 ở mức gần M4 Pro trên điểm đơn nhân, cỡ 0.8–1×. Bản Swift dùng struct, không qua JIT, có lẽ nhanh ngang hoặc hơn node.
- Đoán 2–3 s mỗi quyết định trên một lõi.
- Các ứng viên độc lập nhau, nên chạy song song 2 lõi P cộng 4 lõi E có thể xuống khoảng 1 s.
- Chưa đủ nhanh để tính lại liên tục khi user kéo bi. Phải tính trên nền khi thả tay, hoặc giảm lưới.

## Ba điểm yếu lớn nhất

1. **Không có phòng thủ, combo, bank hay phá cụm.**
   - 4/15 bàn chết vì "không còn cú thẳng".
   - Thế cụm bi chưa lần nào qua bi 3. Với user, "đường tự nhiên nhất" khi bi bị chặn thường chính là một cú phá cụm hoặc một cú bank, và v1 không nhìn thấy những cú đó.
2. **Hàm giá trị vị trí V là heuristic chưa hiệu chỉnh, và lệch thang với p_pot.**
   - V dùng σ ngắm 0.5° kiểu người, còn p_pot dùng σ 0.125° kiểu ICGA.
   - Bề rộng hiệu dụng của lỗ là số tự đặt (góc 1.15", giữa 1.35"), giảm theo cos của góc vào.
   - Hệ quả: planner hay để lại cú dài, ví dụ thế bi sát băng có cú p = 0.41 và 0.49. V còn không phạt khoảng cách bi cái quá gần bi mục tiêu.
3. **Vị trí bi cái nhạy với nhiễu, trong khi tầng 2 chỉ đào từ thế danh nghĩa.**
   - Ở cú đầu thế 3 bi, cùng một cú thực thi 3 lần cho bi cái dừng ở (38.5, 44.9), (40.6, 18.9) và (44.2, 39.7). Đó là cú draw 3.5 m/s đi qua nhiều băng.
   - Đã giảm bớt bằng cách lấy V trung bình trên 16 mẫu và trộn nửa-nửa với điểm tầng sau. Nhưng tầng sau vẫn chỉ nhìn một thế, nên điểm depth 2 lạc quan với những cú lực mạnh.

## Số tự đặt hoặc chưa hiệu chỉnh

- Trọng số phạt: 1.2, 1.0, 0.25 và 0.15. Ngưỡng |b| > 0.2 và v > 2 m/s.
- Các số trong V: σ 0.5°, bề rộng hiệu dụng của lỗ, góc vào tối đa 62° cho lỗ góc và 50° cho lỗ giữa, sàn 0.03 khi không còn cú.
- Hệ số co 4 mẫu giả trong p. pWin chỉ tính theo φ, bỏ qua nhiễu lực.
- Cách trộn ½·tầng sau + ½·V trung bình. Phạt 0.5 cho ứng viên ngoài beam. Beam 3, top 8 / top 3.
- Lọc dt 1/500 ở lần chạy danh nghĩa. Trên lưới lỗ cũ đã kiểm là kết quả không nhạy với dt, nhưng va chạm nhiều bi ở 4 m/s chưa được kiểm riêng. p_pot và quỹ đạo vẽ ra dùng dt 1/1000.
- Bản thân `sim.js` vẫn mang các tham số trong báo cáo vật lý trước: μ, e, mô hình băng Mathavan, hình học lỗ. Không có gì ở đây được đo trên bàn thật.

## Viz

`planner-viz.html` gồm:
- Chọn thế và lần chơi, bấm từng cú.
- Đường bi cái (trắng, nét đứt) và bi mục tiêu (vàng gold).
- Bi khác bị chạm vẽ mờ, có vòng tròn ở các điểm chạm.
- Vòng gold đánh dấu chỗ bi cái dừng.
- Nút "Chạy" phát animation theo thời gian sim thật, tốc độ 1×, 0.5× hoặc 0.25×.

Dữ liệu quỹ đạo:
- Lấy từ frame 120 Hz của `run`, giữ 1 trên 4 frame.
- Cộng thêm ảnh chụp mọi bi ở đúng bước có va chạm, nên góc bật băng không bị cắt.
- Kiểm lại: vị trí trong track lệch tối đa 0.064 inch so với `event.at` của sim. Phần lệch đó là bước tách bi chồng nhau trong `run`.
- Khoảng trống dài nhất giữa hai điểm khi bi đang chạy là 34 ms.

Đã kiểm:
- Cú pháp JS và chạy hết 15 bàn × mọi cú với DOM giả, không lỗi.

Chưa kiểm:
- Chưa mở bằng trình duyệt thật và chưa chụp màn hình, nên bố cục ở 375 px mới dựa trên CSS (lưới 1 cột dưới 760 px, `overflow-x: hidden`).
