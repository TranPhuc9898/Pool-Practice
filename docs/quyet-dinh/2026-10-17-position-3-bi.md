# Position 3 bi: drill 23 soạn tay, engine đo độ nhạy — 2026-10-17

## Câu hỏi
Nên đi đường nào để Pool Practice dạy được "đánh bi 1 thế nào để bi cái tới chỗ đánh bi 2, rồi từ bi 2 sang chỗ tốt cho bi 3", bắt đầu từ audit code và Gold Standard 3 bi.

## Bối cảnh
Run hỏng ở góc để lại từ cú trước (research 08/10 §1.5). App hiện chưa dạy được chỗ đó:
- `PoolDrill` có một `targetPocket` và một spin/speed cho cả bài. `DrillRound` là nhóm attempt, không phải chuỗi cú.
- Native chỉ truyền zone đầu cho solver (`PoolEditorView.swift:325`, `DrillTargetSolver.zones(...).first`). Drill 15 chỉ có đích cho cú 1→2.
- Pot, Position, Runout gộp làm 1 bit. Không ghi chỗ bi cái dừng. Replay không có cú trước/cú sau. Không có câu "vì sao".
- `DrillTargetSolver` giải một cú, không kiểm độ nhạy. `RackPlanner` đi tiến, trọng số chưa hiệu chỉnh.
- Độ nhạy là thật: research 09/10 chạy cùng một cú draw 3.5 m/s ba lần, bi cái dừng ở (38.5, 44.9), (40.6, 18.9), (44.2, 39.7).
- Engine: squirt tuyến tính, không có swerve khi cơ nằm ngang, lỗ không có jaw, thông số vải chưa hiệu chỉnh. Follow/stun/draw và slide→roll có mô hình.
- Không nguồn nào cho toạ độ chuẩn của thế 3 bi. Drill 15 là một layout mẫu của bài Scott Lee tung ngẫu nhiên.

Ràng buộc:
- Không viết lại engine. Không thiết kế lại UI (memory).
- `progress` không có nhánh migrate: version khác 1 thì `load` trả trống và lần ghi sau đè mất (`progress.ts:30-41`). Không bump.
- `attempts.db` không có user_version hay ALTER. Không thêm giá trị mới vào cột `result`.
- Đổi `attemptCount` hay `rounds` của drill đã có data sẽ đọc sai attempt cũ. Không sửa 15/17.

Ngoài phạm vi:
- Roadmap 50 drill, 4 chế độ Learn/Preview/Practice/Review, Visual Coach (anh đã gật bỏ).
- Layout ngẫu nhiên, mô phỏng swerve, cú có ép phê ngang.
- Nhập chỗ bi cái dừng thật rồi tính lại (giai đoạn 2).
- Sửa luật chấm của Rail Cut 18–20 và Spot Shot 21 (lệch A/B, ghi ở audit, chưa xử).

## Các hướng đã cân
- **(a) Bài soạn tay, engine kiểm.** Chọn.
- **(b) Planner ngược tự động** (Z3 → Z2 → cú 1 bằng hai lần `DrillTargetSolver` cộng lấy mẫu nhiễu). Hoãn: solver chọn cú đẹp ở thế danh nghĩa, câu vì sao sinh từ con số dễ thành văn rỗng, vài tuần native trên cost function chưa hiệu chỉnh. Giữ làm động cơ giai đoạn 2.
- **(c) Vòng bàn thật trước** (chạm chỗ bi cái dừng, ghi Pot/Position/Runout). Hoãn: đo được nhưng không trả lời "đánh bi 1 thế nào", ba lần chạm mỗi run là ma sát lớn.
- **(d) Mở rộng `RackPlanner` 9-ball xuống 3 bi.** Loại: đi tiến, V hay để lại cú dài, 4/15 bàn chết vì hết cú thẳng. Hiện nó như lời thầy là đem heuristic chưa hiệu chỉnh ra làm chuẩn.
- Reel RioBilliard (anh gửi làm ví dụ): ăn bi 8, ba băng về bi 9, lực nhẹ ngắm dày hơn, lực mạnh ngắm mỏng hơn vì swerve. Đây là mẫu cho card từng cú, nhưng engine chưa mô phỏng được swerve, nên v1 không dạy cú loại này.

## Chọn
**(a), lấy phần đo độ nhạy của (b) làm thước.**

1. **Drill 23 mới**, thêm ở cuối catalog, dùng layout mẫu của drill 15. Không sửa drill 15/17.
2. **Trường tuỳ chọn `shots?` trên `PoolDrill`**, mỗi phần tử gồm bi, lỗ, zone, tip, lực, câu vì sao. Native `DrillRecord` đọc trường này. Đây là "schema v2 bản nhỏ nhất" mà quyết định 15/10 cho phép: chỉ thêm, không đổi nghĩa trường cũ. Trường cấp bài (`targetPocket`, `recommendedSpin`…) của drill 23 vẫn mô tả cú 1.
3. **Zone soạn ngược từ bi 3.** Z3: dải đứng cho bi 3 có góc ≤30° (luật Scott Lee), khác 0°, đúng phía. Z3 không phải chỗ gần bi 3 nhất: chọn dải mà bi cái từ bi 2 đi vào song song đường bắn bi 3. Z2: chỗ đứng cho bi 2 mà từ đó có cú đưa bi cái vào Z3 ổn định. Cú 1 nhắm Z2.
4. **Công thức chỉ dùng trục dọc** (follow/stun/draw, tipX = 0), phần engine có mô hình.
5. **Engine đo tỉ lệ rơi zone** của từng cú khi lệch lực ±10% và tip ±0.1 (số tự đặt), hiện tỉ lệ đó trên card.
6. **Card từng cú và nút cú trước/cú sau** gắn vào màn drill hiện có, không thêm màn hay chế độ mới.
7. **Log Pot/Position từng cú** vào bảng SQLite mới tạo bằng `IF NOT EXISTS`. Runout suy ra từ đó. Không ALTER `attempts`, không đụng `progress`.
8. **Nhãn trên bài:** "kiểm bằng mô phỏng, chưa kiểm trên bàn".

**Đánh đổi:** mất layout ngẫu nhiên kiểu Scott Lee và cú ép phê như trong reel, để được một bài mà mọi con số đều do engine đo và câu vì sao do người viết. Nhập chỗ dừng thật và tính lại lùi sang giai đoạn 2.

## Sẽ đổi ý nếu
- Cú 1 hoặc cú 2 của drill 23 rơi zone dưới 70% khi lệch lực ±10%, tip ±0.1, kể cả sau khi nới zone tới bán kính 0.12: engine chưa đủ tin để dạy position. Dừng, hiệu chỉnh engine trước.
- Native `DrillRecord` không đọc được `shots` mà không đổi trường cũ: viết plan schema riêng trước.
- Anh coi nút cú trước/cú sau là thiết kế lại UI: rút về dạng chữ trong khối info hiện có.
- Sau 5 lượt anh tập drill 23 trên bàn thật, quá nửa số cú bi cái dừng ngoài zone dù engine báo ≥70%: chuyển ưu tiên sang (c), đo bàn thật trước.

## Bước đi
1. **Đo độ nhạy trước** (rủi ro lớn nhất, làm được hôm nay). Dựng harness theo mẫu `scripts/rack-harness/` cho layout drill 15: soạn Z3, Z2, tìm công thức trục dọc cho cú 1 và cú 2, chạy lưới lực ±10% × tip ±0.1, in tỉ lệ rơi zone. **Điểm kiểm tra:** cả hai cú ≥70% thì đi tiếp. Dưới thì theo mục "Sẽ đổi ý nếu".
2. Thêm `shots?` vào `PoolDrill` và `DrillRecord`, viết drill 23 bằng số từ bước 1. Drill cũ mở ra vẫn y như trước.
3. Native truyền zone theo cú thay vì `.first`. Play shot chạy đủ 3 cú, nghỉ giữa các cú như chuỗi rack.
4. Card từng cú và nút cú trước/cú sau trên màn drill.
5. Bảng log Pot/Position. **Điểm kiểm tra:** kill app mở lại, `best` và History của mọi drill cũ còn nguyên.
6. Lint, typecheck, kiểm drill 23 trên simulator.
