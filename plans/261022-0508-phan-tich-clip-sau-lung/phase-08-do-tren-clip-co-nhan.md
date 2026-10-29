---
phase: 8
title: "Đo trên clip có nhãn, điều tra Core ML"
status: in-progress
priority: P3
effort: "1d"
dependencies: [6]
---

# Phase 8: Đo trên clip có nhãn, điều tra Core ML

## Goal

Mỗi số app hiển thị có sai số đo được trên clip có nhãn tay. Biết có đáng làm mô hình Core ML dò cơ hay không.

## Files

- Sửa `scripts/pose-harness/main.swift`: `--eval <nhan.csv>` đọc nhãn tay (khớp, trục cơ, mốc pha theo khung), chạy lõi phân tích, in sai số trung vị và p90 cho từng số đo.
- Tạo `plans/reports/research-<ngày>-core-ml-do-co.md`: mô hình có sẵn kèm giấy phép, hoặc kế hoạch dữ liệu nếu tự huấn luyện (Create ML object detection hoặc keypoint), số khung cần nhãn, chi phí gán nhãn.
- Không đổi code app trong phase này, trừ nhãn "experimental" ở bước 3.

## Tasks

- [ ] 1. Gán nhãn 3 clip (R1, R2, R3), mỗi clip 60 khung rải đều, xuất CSV từ màn clip. Khớp chỉnh tay trên khung nào Vision sai.
- [x] 2. `--eval` và bảng sai số. Thêm một dòng hiệu năng: ms mỗi khung cho Vision, lọc, tracker cơ, đo bằng `ContinuousClock`.
- [ ] 3. Số nào sai quá ngưỡng (lệch ngang > 0,1 L, góc cơ > 2°, mốc pha > 3 khung; các ngưỡng này là đoán) thì gắn "experimental" trên màn clip.
- [x] 4. Report Core ML.

## Verification

- `sh scripts/pose-harness/run.sh R1.mov --eval r1-nhan.csv` in đủ bảng.
- Report có URL nguồn cho mọi mô hình nhắc tới, và một khuyến nghị: làm hay không, vì sao.

## Kết quả

Bước 2 (2026-10-22): `--eval nhan.csv` trong harness.

Format nhãn: `t,wrist_x,wrist_y,elbow_x,elbow_y,cue_ax,cue_ay,cue_bx,cue_by,phase`, pixel ảnh đứng gốc trên trái, ô trống được.

Cách tính:

- In trung vị và p90 của bốn số:
  - lệch ngang cổ tay và khuỷu, tính bằng L so với trục nhãn đầu tiên đã bù rung;
  - góc cơ;
  - mốc pha theo khung.
- Thêm tỉ lệ pha đúng.
- Thêm ms mỗi khung cho Vision kèm rung, pha, bám cơ, đo bằng `ContinuousClock` trên Mac chứ không phải iPhone.
- Số nào có p90 vượt ngưỡng thì in "→ experimental".
- Vision mất khớp mà nhãn có khớp thì tính sai 1 L. Tracker không có ước lượng thì tính sai 90°. Mất khớp vì thế không làm số đẹp lên.

Đã kiểm: smoke test trên clip `ffmpeg testsrc` (không có người, không có cơ). Chạy hết đường, in bảng, số xấu đúng như dự đoán. Vision cộng rung tốn 12,4 ms mỗi khung trên Mac.

Bước 4: report ở `plans/reports/research-2026-10-22-core-ml-do-co.md`, đã thêm khuyến nghị: chưa làm Core ML, đo tracker cạnh trên clip có nhãn trước.

Còn treo: bước 1 (gán nhãn R1–R3) và bước 3. Hiện các số cơ trên màn đã gắn "experimental" sẵn, gỡ khi `--eval` qua ngưỡng.
