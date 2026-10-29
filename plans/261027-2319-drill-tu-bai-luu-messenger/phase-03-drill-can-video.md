# Phase 3: Xem video, soạn 8 drill còn lại (cần phase 2)

Caption chỉ có tên drill. Layout phải lấy từ khung hình video: mở link trong Chrome, dừng ở khung bày bi, chụp màn, ghi toạ độ theo diamond.

| Bài gốc | Drill | Chủ đề · hạng dự kiến |
|---|---|---|
| #8, #27 Eddie Vonderau | Center Line (lỗ góc + lỗ giữa) | Speed & Position · G–G+ |
| #5 Eddie Vonderau | Short-side back and forth | Speed & Position · F |
| #15 APA / Fedor | Stun drill | Stop, Follow, Draw · G–G+ (bỏ nếu trùng 98) |
| #58 RioBilliard | 6 bi follow | Stop, Follow, Draw · H–H+ (bỏ nếu trùng 53) |
| #10 Margarita Fefilova Styer | Mountain Drill | Speed & Position · F |
| #32 Fedor | Corner drill | Patterns & Runouts · F |
| #59 Arielle / Niels Feijen | Rock Around The Clock | Patterns & Runouts · E–D |
| #40 Dragon Billiards | Land Mine | Patterns & Runouts · E–D |

## Việc

- Mỗi drill: lưu ảnh khung bày bi vào `docs/research/drill-video/<slug>.png`, ghi toạ độ, rồi soạn theo chuẩn drill. Bài vị trí dùng engine, bài runout dài dùng vẽ tay.
- Trùng drill sẵn có (cách xếp khác ≤ 1 bi) thì không thêm. Ghi "trùng <id>" vào Phát sinh.
- Riêng #67 Đặng Thành Kiên "Hạng F thì tập gì": xem video, đối chiếu cột F của bảng chủ đề, ghi khác biệt vào report. Không soạn drill.

## Xong khi

- `ls docs/research/drill-video/*.png | wc -l` ra 8, mỗi bài một ảnh, kể cả bài bị bỏ vì trùng.
- `sh scripts/drill-lint/run.sh <id mới>` ra 0 vi phạm.
- `npx tsc --noEmit` exit 0.
- Anh mở 2 drill bất kỳ trên iPhone, so với video, thấy khớp layout.

## Phát sinh (ghi giữa chừng 2026-10-28, chưa xong phase)

- Đã viết, wire, lint đạt: 124 Short-Side (engine, layout dịch so với video), 129 Rock Around The Clock (engine; bỏ thứ tự theo chiều kim đồng hồ vì engine không dọn được).
- Harness `scripts/rack-harness/main.swift` có thêm `tipSet` (bộ tipY riêng cho bài một kiểu đánh) và config 125, 126.
- Engine không dọn được 125 Stun (2/4, trần 2.1) và 126 Six-ball follow (1/6). Việc còn lại: viết drawn, ball in hand mỗi cú, mẫu theo 120. 125 và 126 không trùng 98 và 53. Vòng tròn đích của 126 chưa có lời giải thích [suy luận], không chấm vị trí.
- 128 Corner (Fedor #32): engine 1/5, còn lại viết drawn ball in hand mỗi cú, cắt ~20–25° dọc băng vào headRight.
- 127 Mountain (#10 https://www.facebook.com/share/v/1Do4uhZmrc/): còn phải lấy layout từ video (mountain.png mờ). Link share mở trên Chrome hiện chuyển nhầm sang một trang cá nhân không liên quan, cần mở lại.
- #67 so với cột F: chưa ghi vào report.
- Chưa chạy: lint 109–130, topic lint, `npx tsc --noEmit`, `npx expo lint`.
