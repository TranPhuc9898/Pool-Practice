# Hướng sản phẩm: Shot Lab dựng trên attempt log — 2026-10-14

## Câu hỏi
Pool Practice nên trở thành sản phẩm gì, ba trụ Practice / Academy / Shot Lab nối nhau ra sao, và làm gì trước?

## Bối cảnh
Mission đề xuất "Turn every missed shot into measurable improvement", nhưng code hiện tại vứt lịch sử:
- `src/pool-engine/progress.ts` chỉ giữ lượt hiện tại và `best` cho mỗi drill. Attempt không có timestamp, `resetDrill` xoá sạch attempts.
- Chuỗi thời gian duy nhất là store `daily` (`src/pool-engine/daily.ts`), và nó chỉ ghi workout.
- Shot Editor (`src/app/editor.tsx`) có vật lý, replay, planner 9-ball, nhưng state chỉ nằm trong `useState`, không lưu được. Ô "Weak spots" trên Home hứa "rebuild the layouts you miss" mà chưa làm được.
- `RackPlanner.swift` tự ghi trọng số chưa hiệu chỉnh với người thật.

Ràng buộc: một người làm, visual BLACK PRECISION đã khoá, backend đã chốt sync bảng `attempts` theo UUIDv7 (`2026-10-12-backend-railway.md`).
Ngoài phạm vi: giáo trình Academy đầy đủ, Rail & Kick, 10-ball, Rail Calculator, AI recommendation, tab Progress riêng.

## Các hướng đã cân
- (a) Practice log trước: làm móng, nhưng đứng riêng chỉ là máy đếm, không có lợi thế cạnh tranh.
- (b) Academy trước: loại, khoảng 600 khối nội dung cho một người viết, đọc một lần là xong nên không giữ chân, rail system lệch theo bàn.
- (c) Shot Lab trước: chọn, tái dùng khoảng 3.000 dòng Swift đã có, là thứ đối thủ không có.
- (d) Pattern trainer: hoãn, tệp người dùng hẹp, planner chưa hiệu chỉnh.

## Chọn
(c) dựng trên móng (a). Mission đổi thành "Every miss becomes a drill."
- Vòng lõi: drill → trượt → "Rebuild in Lab" → drill cá nhân → xuất hiện trong Daily.
- Academy là lớp "Why" theo ngữ cảnh, mở từ drill hoặc cú trong Lab. Không có tab riêng.
- Pattern Builder là phần mở rộng của Shot Editor, không làm tính năng độc lập.
- Rail Calculator hoãn: không có công thức đúng cho mọi bàn, làm ra là cho cảm giác chính xác giả.
- Ba tab: Home, Practice, Shot Lab. Progress nằm trong Home và từng drill. Có đủ 30 ngày dữ liệu thì mới tách thành tab.

Đánh đổi: chưa có Academy đầy đủ, 10-ball, Rail & Kick. Đổi lại vòng lõi khép kín trong 6 bước.

## Sẽ đổi ý nếu
- Thử trên máy thật, dựng lại một cú trong editor mất quá 60 giây ở cả 3 lần thử: bỏ (c), chuyển sang chọn từ thư viện layout mẫu hoặc chụp ảnh bàn.
- Sau 4 tuần dùng, drill cá nhân chiếm dưới 10% attempt trong log: Lab không kéo được người dùng, quay lại ưu tiên Daily thích nghi.

## Bước đi
1. Attempt log v2: mỗi attempt có `id` (UUIDv7), `drillId`, `result`, `at`, `sessionId`, khớp schema sync. Ghi vào bảng SQLite riêng, `progress` v1 giữ nguyên nên không cần migrate. Điểm kiểm tra: kill app mở lại, `best` cũ còn nguyên, attempt mới có timestamp.
2. Editor lưu được, có danh sách My Shots.
3. Chuyển shot thành drill cá nhân, chạy bằng màn `drill/[id]` đang có.
4. Trend từng drill, ô "Weakest" theo luật: tỉ lệ pass thấp nhất 7 ngày, tối thiểu 10 attempt.
5. Daily thêm một khối lấy từ bài yếu nhất.
6. Lớp "Why" cho 6 drill bi cái, nội dung lấy từ `docs/research`.
