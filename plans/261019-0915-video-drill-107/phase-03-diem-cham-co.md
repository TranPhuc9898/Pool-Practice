---
phase: 3
title: "Đọc ô điểm chạm cơ"
status: completed
priority: P2
effort: "1h"
dependencies: [1]
---

# Phase 3: Đọc ô điểm chạm cơ

## Goal
Từ ô overlay góc phải trên (vòng tròn có chữ thập, chấm cam), đọc ra `tip_x, tip_y` theo đơn vị R, có giá trị trong [-1, 1].

## Files to Create / Modify
- Create: `scripts/video-harness/tip.py`
- Modify: `scripts/video-harness/corners-GrWQMQSqaHY.json` (thêm `tip_roi`: tâm và bán kính vòng overlay)

## Tasks & Steps
1. Đo tâm và bán kính vòng overlay trên một khung, ghi `tip_roi`.
2. Mask chấm cam theo HSV trong ROI, lấy tâm, chia cho bán kính vòng. Trục y dương là trên (follow), âm là dưới (draw).
3. Quét toàn đoạn mỗi 0.5 s, in các mốc chấm cam đổi vị trí. Nếu overlay không đổi theo cú thì dừng phase, ghi `## Phát sinh`, cột tip để trống.

## Verification
- `run.sh tip --dump` lưu crop ROI ở 5 cú, so với giá trị in ra: lệch ≤ 0.15 R khi đọc bằng mắt.
