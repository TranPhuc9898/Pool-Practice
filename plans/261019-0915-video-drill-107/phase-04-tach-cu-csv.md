---
phase: 4
title: "Tách cú, bi cái dừng, vào/trượt, xuất CSV"
status: completed
priority: P1
effort: "2.5h"
dependencies: [2, 3]
---

# Phase 4: Tách cú và xuất CSV

## Goal
Mỗi cú trong lượt ra một dòng `shot,ball,tip_x,tip_y,cue_L,cue_W,made,t_start,t_end`, kèm `shots.png` top-down vẽ chỗ bi cái dừng sau từng cú.

## Files to Create / Modify
- Create: `scripts/video-harness/analyze.py`
- Create: `scripts/video-harness/run.sh` (đọc `VENV`, `VIDEO`, `OUT`; lệnh con `calib`, `tip`, mặc định là analyze)

## Tasks & Steps
1. Bi cái: blob trắng trong mask bàn (độ bão hoà thấp, sáng cao, đúng cỡ bi), theo dõi bằng ứng viên gần vị trí trước.
2. Tách cú: bi cái dời > 0.1 kim cương là bắt đầu; đứng yên ≥ 0.5 s là kết thúc. Bỏ chuyển động lúc bi cái biến mất (cầm tay đặt bi).
3. `ball` = cú thứ k đánh bi số k (luật numerical order). `made` = vị trí layout của bi k trống sau cú.
4. Tip của cú = giá trị overlay ngay trước `t_start`.
5. Ghi CSV và ảnh, in tóm tắt `made X/12`.

## Verification
- `VENV=… VIDEO=… OUT=… sh scripts/video-harness/run.sh` exit 0.
- Số dòng bằng số cú đếm trên contact sheet phase 1; `made` khớp từng cú; ghi kết quả đối chiếu vào `plans/reports/`.
