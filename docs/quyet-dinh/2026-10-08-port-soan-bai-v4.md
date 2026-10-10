# Port màn Soạn bài v4.1 sang Swift, thay bước 5 của plan editor — 2026-10-08

## Câu hỏi
Sau ngày 2026-10-07, làm tiếp gì để editor về đích mà không phải làm hai lần?

## Bối cảnh
Plan `.claude/ke-hoach/2026-10-07-pool-editor-swift.md` còn bước 3 (chờ anh chạm), 5, 6, 7. Bước 5 dựng pad dọc, nhưng bản thiết kế lại `docs/prototypes/soan-bai-v4.dc.html` đã thay bằng pad 2D (cao thấp + phê) và đổi vật lý sang mô hình Aim Lab: squirt 2.5° ở 0.5R, throw theo μ(slip), va chạm e = 0.95, tìm hướng cơ bằng secant. Anh gật ngày 2026-10-08: "làm đi, làm cho nó đẹp hơn".
Ràng buộc: chỉ iOS, Swift giữ vật lý, JS chỉ nhận snapshot lúc nhấc tay. Ngoài phạm vi: Android, lưu "Bài của tôi", bản vật lý TS.

## Các hướng đã cân
- (a) Chạy hết plan cũ rồi port sau: loại, bước 5 dựng đúng cái pad v4.1 vứt đi.
- (b) Port ngay, bỏ bước 5: chọn, vì anh đã duyệt hướng và nói rõ muốn đẹp hơn.
- (c) Làm bước 6 trước trong lúc chờ duyệt: hết lý do khi anh đã duyệt.
- (d) Bỏ editor sang việc khác: loại, editor chưa xuất được JSON thì chưa có gì để nối.

## Chọn
(b). Plan mới `.claude/ke-hoach/2026-10-08-soan-bai-v4-swift.md`, vật lý đi trước vì mọi số trên màn phụ thuộc nó. Bước 5 của plan cũ không tick, ghi lý do ở Phát sinh; bước 3 và 6 giữ nguyên.
Đánh đổi: mất ba số đã khớp prototype v7 ở bước 2 (e = 1, không throw). Mốc kiểm mới là node harness chạy trên chính file prototype v4.1. Schema snapshot đổi `tip` thành `tipX`/`tipY`, drill nào soạn trước đó phải nhập lại; hôm nay chưa có drill nào.

## Sẽ đổi ý nếu
- Drill 03 với vật lý mới không còn cú nào ở 1.8 m/s cho bi 1 vào footRight: dừng, hỏi anh, vì "Xong là" của plan cũ hết đúng.
- `solve` làm p95 khung hình lúc kéo pad vượt 16.7 ms trên simulator Release: cache theo (tipX, tipY, speed) làm tròn 0.01, chưa đủ thì giảm vòng secant 14 → 6.

## Bước đi
Trong file plan. Điểm kiểm tra: sau bước 1, Swift phải khớp node harness ±0.1° throw và ±0.1" điểm dừng; lệch là mô hình port sai, không đi tiếp.
