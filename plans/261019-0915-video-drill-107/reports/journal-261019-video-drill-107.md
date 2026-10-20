# Nhật ký: v0 đọc video drill 107 ra CSV

**Ngày**: 2026-10-19 · **Mức**: Medium · **Phần**: `scripts/video-harness/` · **Trạng thái**: Xong v0, chưa kiểm trên video thứ hai

## Đã làm

`scripts/video-harness/` gồm `table.py`, `calib.py`, `tip.py`, `analyze.py`, `run.sh` và `corners-GrWQMQSqaHY.json`. Bộ này đọc video `GrWQMQSqaHY` (drill 107 của poolbilliards.co, camera cố định) và xuất `shots.csv` cùng ảnh top-down chỗ bi cái dừng. Kết quả là 12 cú, 12/12 vào, cả lượt chạy khoảng 22 giây. Số liệu chi tiết nằm ở `reports/261019-video-drill-107-v0.md`.

## Quyết định

- Homography fit từ tâm 12 bi xếp sẵn, không dùng 4 góc click tay. Tâm bi cùng nằm trên một mặt phẳng cao hơn mặt nỉ 1 R, nên fit thẳng sang (L, W) là đủ. Kiểm bằng leave-one-out: trung vị 0.038, tối đa 0.119 kim cương. Bốn góc click tay chiếu lại lệch tới 0.16, vì miệng lỗ không trùng mũi băng.
- Tách cú theo các đoạn của ô overlay điểm chạm (12 đoạn có chấm cam), không quét chuyển động cả video. Đoạn ngắn dưới 1 s được gộp vào đoạn sau.
- Chỗ bi cái dừng sau cú k lấy bằng chỗ nó đứng lúc bắt đầu ngắm cú k+1. Lúc bi chạy nhanh nó bị nhoè và tracker bám nhầm, còn luật drill chỉ cho đặt tay ở cú đầu.

## Chỗ vấp

- Ngưỡng HSV của nỉ để rộng quá, nuốt sọc xanh bi 10 và nửa bi 2, mean-shift kéo hai bi lệch 0.33 kim cương. Siết `felt_hsv` còn H 94–104, V ≥ 170 thì hết.
- Nỉ sát băng trái tối hơn ngưỡng nỉ, nên chỗ bi đã vào vẫn bị coi là còn bi. Phải thêm `spot_hsv` riêng cho bước xét vào/trượt.
- Mảng trắng của bi sọc 9–12, tay và đầu cơ lừa tracker bi cái. Sửa bằng `STRIPE_GAP = 0.2` (loại ứng viên sát chỗ bi sọc), ngưỡng `fill < 0.4`, và logic `settles` (đòi 3 mẫu liền ở chỗ ngắm).
- `python -I` bỏ thư mục script khỏi `sys.path`, import `table` hỏng. Cả ba script phải tự chèn thư mục của mình vào `sys.path`.
- Phần dựng môi trường tốn công hơn dự tính: Python 3.14 của Homebrew lỗi `pyexpat`, còn yt-dlp chạy trên 3.9 bị YouTube chặn. Cuối cùng phải dùng binary `yt-dlp_macos` và env Python 3.9 hệ thống.

## Chưa kiểm

- Đơn vị tip: đang giả định mép vòng overlay bằng mép bi cái (±1 R). Chưa đối chiếu với nguồn nào của poolbilliards.co, nên `tip_x, tip_y` chỉ đúng tương đối.
- Mọi ngưỡng màu được chỉnh riêng cho video này. Chưa biết chúng có dùng lại được cho video khác hay không.

## Bài học

Kiểm homography bằng leave-one-out, đừng dùng sai số fit trên chính các điểm đã fit. Khi nguồn có sẵn tín hiệu cấu trúc như ô overlay, nên tách cú theo tín hiệu đó trước khi viết detector chuyển động.

## Bước sau

Chạy cùng harness trên `OmhTaPvX7eg` (Wojtek Szewczyk, drill 107, camera cố định) để đo chi phí đổi video: chỉ cần đo lại góc và ngưỡng màu, hay phải sửa code. Kết quả này quyết định v1 có đáng làm thành công cụ chung không.
