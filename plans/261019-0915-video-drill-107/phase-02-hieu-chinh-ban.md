---
phase: 2
title: "Hiệu chỉnh bàn: homography + kiểm bằng 12 bi"
status: completed
priority: P1
effort: "1.5h"
dependencies: [1]
---

# Phase 2: Hiệu chỉnh bàn

## Goal
Đổi pixel trong video sang toạ độ kim cương, và chứng minh bằng 12 bi xếp sẵn rằng sai số đủ nhỏ.

## Files to Create / Modify
- Create: `scripts/video-harness/calib.py` (homography, chế độ `--pick` cho anh click 4 góc, chế độ `--check`)
- Create: `scripts/video-harness/table.py` (hằng hệ toạ độ, `px_to_lw`, `warp_topdown`)
- Create: `scripts/video-harness/corners-GrWQMQSqaHY.json` (4 góc mũi băng theo pixel)

## Tasks & Steps
1. 4 điểm là giao mũi băng ở 4 góc lỗ (L,W) = (0,0) (0,4) (8,0) (8,4). Lấy từ khung đầu đoạn, đọc trên ảnh có lưới pixel; `--pick` dành cho anh làm lại bằng chuột.
2. Bi là quả cầu, tâm ảnh nằm cao hơn điểm chạm mặt bàn: dời tâm blob xuống theo chiều dọc ảnh một khoảng bằng bán kính blob trước khi chiếu.
3. Nhận bi trên ảnh top-down: mask bàn, tách khỏi màu nỉ theo HSV, lọc diện tích theo kích thước bi.
4. `--check`: ghép 12 bi phát hiện với layout (gần nhất), in sai số từng bi, trung vị, tối đa; lưu ảnh top-down vẽ chồng layout.

## Verification
- `run.sh calib --check` in trung vị ≤ 0.1 kim cương, tối đa ≤ 0.2, đủ 12 bi.
