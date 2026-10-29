---
phase: 1
title: "Clip sau lưng qua harness"
status: in-progress
priority: P1
effort: "3h"
dependencies: []
---

# Phase 1: Clip sau lưng qua harness

## Goal

Biết Vision thấy gì khi máy đặt sau lưng trên đường cơ, và cổ tay có để lại tín hiệu đủ lớn để bắt pha cú không. Chưa có số này thì mọi thiết kế phía sau là đoán.

## Files

- Sửa `scripts/pose-harness/main.swift`: cờ `--rear`, ghi CSV từng khung gồm `t, shoulder.x/y, elbow.x/y, wrist.x/y, L, conf_shoulder, conf_elbow, conf_wrist`. Toạ độ chuẩn hoá theo ảnh đã xoay đứng, gốc trên trái, để đọc thẳng bằng mắt trên ảnh.
- Không đụng file trong `modules/`.

## Tasks

- [x] 1. Cờ `--rear <out.csv>` trong `runVideo`. Dùng lại `PoseFrame` và `armConfidence` sẵn có, bỏ qua `StrokeTracker`. Cuối lượt in: % khung thấy khuỷu và cổ tay, % khung thấy vai, trung vị L.
- [ ] 2. Anh quay bằng app Camera (Settings › Camera › Record Video = 1080p at 60 fps), máy trên chân máy sau lưng, cao ngang vai, cách 2 m, khung ngang:
  - R1: 10 cú bình thường, máy đúng đường cơ;
  - R2: 10 cú cố tình đẩy cổ tay ra ngoài ở 5 cú cuối;
  - R3: 10 cú như R1 nhưng máy lệch khỏi đường cơ 15–20°.
  Quay cùng buổi với clip của `plans/261021-0336-stance-soi-tay-sau-chay-that/phase-01-clip-that-qua-harness.md` bước 3.
- [ ] 3. Chạy `sh scripts/pose-harness/run.sh R1.mov --rear r1.csv` cho cả ba clip. Từ CSV, đánh dấu tay khung bắt đầu backswing và khung chạm của 5 cú (xem trên QuickTime, lùi từng khung), rồi tính:
  - rung lúc address: độ lệch chuẩn của wrist.y và L trong 0,4 s trước backswing;
  - biên độ: chênh wrist.y và chênh L giữa address và cuối backswing;
  - tỉ số biên độ / rung.
- [ ] 4. Ghi bảng 3 clip vào mục Kết quả, kèm kết luận cho phase 5: tín hiệu nào dùng được (wrist.y, L, hay không cái nào).

## Verification

- `sh scripts/pose-harness/run.sh --synthetic` vẫn in `synthetic ok`.
- Ba file CSV có số dòng bằng số khung clip (60 fps × độ dài, sai số ±2).
- Bảng Kết quả đủ: % thấy khuỷu và cổ tay, % thấy vai, tỉ số biên độ / rung của wrist.y và L, cho R1, R2, R3.
- Dừng và báo anh nếu R1 thấy khuỷu và cổ tay dưới 70% khung.

## Kết quả

Bước 1 (2026-10-22): `runRear` trong `scripts/pose-harness/main.swift`. Đã kiểm: `--synthetic` in `synthetic ok`; chạy trên một screen recording 1320×2868, 43,3 s ra 2599 khung và CSV đúng 2599 dòng dữ liệu, khung không thấy tay để ô trống. Chưa kiểm: phép đổi toạ độ về ảnh đứng cho clip có transform xoay (screen recording ra `.up`), cần một clip iPhone quay dọc.

Bước 2–4: chờ clip R1, R2, R3.
