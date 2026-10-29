---
phase: 1
title: "Clip thật qua harness"
status: pending
priority: P1
effort: "2h"
dependencies: []
---

# Phase 1: Clip thật qua harness

## Goal

Biết Vision thật bắt cẳng tay đúng chỗ không, và `StrokeTracker` chấm góc lúc chạm có khớp cái anh cố tình làm không. Đây là lát mỏng xuyên hết lớp: clip thật → Vision → `PoseFrame` → `StrokeTracker` → phán xử, chạy trên Mac, không cần build app.

Harness hiện in số nhưng không cho nhìn khớp. Thiếu ảnh thì không phân biệt được "Vision đặt khuỷu sai" với "tracker tính sai".

## Files

- Sửa `scripts/pose-harness/main.swift`: cờ `--frames <thư mục>`, dòng dùng ở đầu file.
- Sửa `modules/pool-table/ios/Pose/PoseStroke.swift`: `StrokeReport` thêm thời điểm chạm (giá trị `contactTime(a)` sẵn có ở `:186`), dựng ở `:272`. Một trường, không đổi logic.
- Không đụng `PoseFrame.swift`, `PoseCoach.swift`.

## Tasks

- [x] 1. `StrokeReport` mang thời điểm chạm.
  ✓ 2026-10-21 10:55 · `PoseStroke.swift` thêm `contact` dựng từ `contactTime` · `sh scripts/pose-harness/run.sh --synthetic` → 7/7 ok, "synthetic ok"
- [x] 2. Harness `--frames`: lượt một chạy như cũ, gom thời điểm chạm của từng cú. Lượt hai đọc lại clip, tại khung gần nhất mỗi thời điểm chạm thì xuất `cu-NN.png`: khung đã xoay đứng theo `orientation`, vẽ vai–khuỷu–cổ tay của Vision và dây dọi từ khuỷu theo `down`, ghi góc cẳng tay và lỗi lên ảnh. Đọc hai lượt để khỏi giữ buffer 1080p trong RAM.
  ✓ 2026-10-21 10:57 · `run.sh --synthetic` → "synthetic ok" · smoke ngoài repo: clip 1280×720 rotation −90 → Vision `.right`, khớp giả đặt đúng toạ độ chấm màu, `saveContactFrames` ghi cu-01/02.png 720×1280, mốc tím ở góc trên trái, nét trúng chấm, +0° vàng/+18° trắng. Lượt một gom cú từ Vision thật chưa chạy, chờ clip (Verification 2).
- [ ] 3. Anh quay clip 9 cú bằng camera sau của app Camera (Settings › Camera › Record Video = 720p HD at 30 fps). Máy dựng đứng trên chân máy phía tay cơ, ngang khuỷu, cách 2–3 m, thấy cả người. Giữa các cú đứng dậy hẳn. Cùng buổi này quay luôn clip A/B/C của bước 3 plan `.claude/ke-hoach/2026-10-21-stance-nhan-tay-khong-nong.md`. Kịch bản:
  - cú 1–3: cẳng tay dựng đứng lúc chạm;
  - cú 4–6: khuỷu lùi ra sau rõ, cỡ 20°, cổ tay ra trước khuỷu;
  - cú 7–9: khuỷu đẩy về trước rõ, cỡ 20°, cổ tay lùi sau khuỷu.
- [ ] 4. Chạy, chép kết quả vào mục Kết quả bên dưới.
- [ ] 5. Quay thêm clip 9 cú y kịch bản bằng camera trước, cùng chỗ đặt máy, chạy cùng lệnh, so dòng "thấy tay". Mirror Front Camera bật thì clip bị lật, chạy với `--hand left` (suy đoán, ảnh PNG sẽ cho biết).

## Verification

Xong khi, theo thứ tự (mục 2–4 làm riêng cho clip camera sau và clip camera trước):

1. `sh scripts/pose-harness/run.sh --synthetic` vẫn in `synthetic ok`.
2. `sh scripts/pose-harness/run.sh clip.mov --frames out/` in `cú 9` và `out/` có 9 file PNG.
3. Mở 9 ảnh: ≥ 8/9 ảnh có đường khuỷu–cổ tay nằm trên cẳng tay thật, dây dọi dựng đứng theo khung.
4. Phán xử khớp kịch bản: cú 1–3 không ra `forearmForward`/`forearmBack`, cú 4–6 ra `forearmForward`, cú 7–9 ra `forearmBack`. Đạt ≥ 8/9.
5. Dòng "thấy tay" của hai clip chép cạnh nhau vào Kết quả. Clip trước thấp hơn clip sau quá 5 điểm thì ghi rõ, phase 2 dùng số này để cân lại mặc định.

Trượt mục 3 là Vision đặt khớp sai: dừng, ghi ảnh hỏng vào Kết quả. Trượt ở camera sau thì không sang phase 2. Chỉ trượt ở camera trước thì vẫn sang, nhưng mặc định để camera sau. Mục 3 đạt mà mục 4 trượt là tracker sai: ghi góc từng cú, mở plan riêng chỉnh tracker vì ngưỡng nằm ngoài phạm vi.

## Rủi ro

- Clip app Camera (HDR, ổn định hình) khác buffer 720p của app → số harness lệch số thật. Kiểm ở phase 3: so dòng `Address · forearm …` trên máy với góc address harness in cho cùng tư thế.
- Anh làm "cỡ 20°" không chuẩn → mục 4 trượt oan. Ảnh PNG ghi góc từng cú, đọc góc trước khi kết luận tracker sai.

## Kết quả

_(điền khi chạy)_
