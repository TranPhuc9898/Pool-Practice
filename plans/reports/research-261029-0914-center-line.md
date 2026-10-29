# Drill 123 Center Line: cách tập và kiểm luật

Ngày 2026-10-29. File: `src/pool-engine/drills/123-center-line.ts`.

## Kết luận

Drill 123 đạt cả ba luật trên bản drill hiện tại. Ảnh shot 3/7 anh gửi (aim panel ghi "5", bi trái nhất về headLeft) là của bundle cũ, chụp trước khi drill được đánh số lại theo route. Bundle mới (Metro 8082) hiện đúng: shot 3 là bi 3 đỏ, về footLeft.

## Cách tập

Xếp bàn: bi cái đặt ở center spot. Bảy bi xếp một hàng ngang ở đầu bàn (head), cách băng đầu khoảng một kim cương. Thứ tự từ trái sang phải là 1, 4, 2, 5, 3, 6, 7.

| Cú | Bi → lỗ | Phê | Lực | Bi cái phải về |
|---|---|---|---|---|
| 1 | 1 → góc head trái | follow ½ tip | Soft 0.8 m/s | zone 2 |
| 2 | 2 → giữa phải | follow ½ tip | Medium 1.2 | zone 3 |
| 3 | 3 → góc foot trái | follow 1 tip | Medium 1.2 | zone 4 |
| 4 | 4 → góc head trái | follow ½ tip | Soft 0.8 | zone 5 |
| 5 | 5 → giữa phải | follow ½ tip | 1.0 | zone 6 |
| 6 | 6 → giữa trái | follow ½ tip | Medium 1.2 | zone 7 |
| 7 | 7 → góc head phải | follow ½ tip | Soft 0.8 | — |

- Một lượt là chạy hết 7 bi. Trượt một bi hoặc bi cái rơi lỗ thì hết lượt. Bài đạt khi 5 lượt sạch.
- Trọng tâm của bài là kiểm soát lực trong vùng chật: các bi xếp sát nhau, nên bi cái lăn dư là đụng bi kế bên. Mỗi cú phải để bi cái về đúng zone của bi sau, không quá 2 băng.
- Cú khó nhất là cú 3, vì phải cắt dọc bàn về lỗ foot. Trong 45 tổ hợp lệch (lực ±10%, tip ±0.1) chỉ có 12 tổ hợp vào zone. Cú 7 dễ nhất, 42/45.

## Kiểm luật (đã chạy)

Audit chạy với `ShotPhysics` và `DrillShotPlanner` thật (`q.sh 123`, rebuild):

- Luật 1: thứ tự là 1 đến 7, đúng bi và đúng lỗ ở cả 7 cú. Không cú nào xuyên bi, không scratch, không đụng bi ngoài kế hoạch, không rơi bi thừa.
- Luật 2: đường bi mục tiêu vẽ ra lệch đường Play từ 0 đến 0.0001". Thẻ hiện đúng lực Play dùng (đã đối chiếu trên simulator ở shot 1, 2 và 3).
- Luật 3: số băng bi cái chạm sau khi chạm bi là 1, 1, 0, 0, 1, 2 (cú 7 không chấm zone). Tất cả đều trong giới hạn `allowedRails` 2. Grade chấm OK cả hai chế độ.

## Lỗi audit phát hiện thêm

Trường `moved` của audit liệt kê mọi bi trên bàn, kể cả bi đứng yên: `ShotPhysics` lấy mẫu mọi bi ở bước cuối, nên trace của bi nào cũng có 2 điểm. Vì vậy kiểm tra "đụng bi ngoài kế hoạch" trước đây không có tác dụng. Đã sửa ở `main.swift` của audit: giờ chỉ tính bi lệch quá 0.05". Chạy lại toàn bộ, có 15 drill đụng bi không rơi lỗ:

- Đụng bi là chủ ý của bài, không phải lỗi: các bài break (29, 30, 70, 71, 74–81) và 49 Soft Touch (bài này cố tình hôn bi 2).
- Cần soát lại: 46 (r3 đụng bi 5, r4 đụng bi 6), 60 (r1, r3) và 95 (mọi round đụng 3, 5, 6, 9).

Chưa sửa ba bài này. Grade hiện chưa dùng `moved` để đánh rớt bài.

## Nguồn

Theo ghi chú local, nguồn là reel của Eddie Vonderau, DOTW #14 (lấy cảm hứng từ Fedor Gorst). Tìm trên web không ra bản mô tả gốc, nên vị trí bi trong app được suy ra từ một frame video, chưa đối chiếu với sơ đồ chính thức.
