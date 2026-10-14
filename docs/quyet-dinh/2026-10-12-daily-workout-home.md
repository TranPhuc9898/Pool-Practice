# Hero Home thành Daily Workout đếm cú — 2026-10-12

## Câu hỏi
Hero card ở Home nên thành bài tập hằng ngày (nhấp cơ, 30 đứng bi, 30 cu lê, 30 trô) với vòng gauge chạy theo tiến độ trong ngày như thế nào?

## Bối cảnh
- Hero hiện trỏ vào drill chưa qua kế tiếp. Nhóm Fundamentals chỉ có drill 01, nên gauge hiện `01/01` và không cho lý do mở app mỗi ngày.
- `src/pool-engine/progress.ts` lưu theo drill: 10 cú tự bấm Pass/Miss, ngưỡng qua bài 6–8. Không có ngày, không có streak. `startDrill` xoá lượt cũ.
- `ProgramGauge` nhận `passed(seg): boolean`, nghĩa là mỗi cung chỉ có sáng hoặc tắt, chưa sáng dần được.
- Ràng buộc:
  - Visual BLACK PRECISION đã khoá.
  - Không đổi schema key `progress`.
  - Tự chấm bằng tay, chưa có camera.
- Từ ngữ: cu lê = follow, đứng bi = stop, trô = draw.
- Research:
  - Không có nguồn nào cho đúng "30/30/30". Đây là số anh chọn.
  - Mỗi mốc khoảng cách làm 10 cú rồi lùi thêm 1 diamond, theo AZBilliards thread "1 hour a day".
  - Bài nhấp cơ: bi cái đi dọc bàn rồi về chạm đầu cơ.
  - Bottle drill bị bỏ vì luyện kiểu đẩy piston.
  - Pool Drill Tracker và Bricole có day streak.
- Ngoài phạm vi:
  - streak freeze;
  - người dùng tự sửa số cú;
  - daily thích nghi theo bài yếu;
  - chấm bằng camera.

## Các hướng đã cân
- **B. Playlist các drill sẵn có (02, 03, 05):** loại. Ngưỡng qua bài 7/10 đè lên khối lượng 30 cú/ngày, và `startDrill` xoá tiến độ qua bài.
- **C. Daily tự chọn bài yếu:** loại ở bản đầu. Hiện 0 bài passed nên chưa có dữ liệu để chọn.
- **D. Tính theo thời gian (vòng = 30 phút):** loại. Anh muốn đếm cú, và đồng hồ không đo được chất lượng.

## Chọn
**A. Daily Workout riêng.** Dữ liệu nằm ở key kv-store mới `daily`, ghi theo ngày (giờ máy), có `schemaVersion`. Bài tập cố định 100 cú:

| Khối | Cú | Đạt khi |
|---|---|---|
| Stroke: bi cái đi dọc bàn rồi về | 10 | về chạm đầu cơ |
| Stop | 3 mốc (1, 2, 3 diamond) × 10 | zone như drill 02 |
| Follow | 3 × 10 | zone như drill 03 |
| Draw | 3 × 10 | zone như drill 05 |

Cách hiển thị:
- Gauge có 4 cung ứng với 4 khối. Mỗi cung sáng dần theo số cú đã đánh trong khối.
- Giữa vòng hiện số cú đã đánh / 100.
- Eyebrow là "Daily · Fundamentals".
- CTA mở thẳng khối đang dở.
- Có day streak đơn giản: đếm số ngày liền có tập.
- Con trỏ "drill kế tiếp" chuyển xuống bento "Your program".

Đánh đổi: mỗi buổi phải chạm 100 lần Pass/Miss, đổi lại có số liệu từng cú.

## Sẽ đổi ý nếu
Sau 7 ngày dùng thật mà hơn một nửa số buổi đã bắt đầu bị bỏ dở trước cú thứ 50. Khi đó chuyển sang mỗi mốc nhập một lần "x/10".

## Bước đi
1. Model và store `daily`: định nghĩa workout, ghi cú theo ngày, tính streak, reset khi sang ngày mới. Đây là phần rủi ro nhất vì là schema mới.
2. Gauge hỗ trợ cung sáng một phần (fill 0…1). Bento và Straight-In cũ vẫn chạy như trước.
3. Hero đọc dữ liệu daily. Con trỏ program chuyển xuống bento.
4. Màn chạy workout: hiện khối và mốc, bộ đếm, nút Pass/Miss, tự sang mốc kế.
5. Kiểm trên sim: đánh vài cú, kill app rồi mở lại vẫn còn; đổi ngày máy thì về 0 và streak đúng.

Điểm kiểm tra: sau bước 3, Home phải hiện vòng daily đúng với dữ liệu giả ghi vào store. Nếu gauge đi sai thì dừng, sửa bước 2 trước khi làm màn chạy.
