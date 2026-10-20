---
title: Plan drill 31 diễn lại theo video
date: 2026-10-19
summary: Play drill 31 sẽ chạy đường bi cái ghi từ video eJldkCO6TeA thay engine; plan 4 phase ở plans/261020-0125-drill-31-video-replay
---

# Plan drill 31 diễn lại theo video

## What happened
Engine chạy nối 12 cú lệch video tới 25.6 in ở bi 4, 11.5 in ở bi 8. Anh chọn cách diễn lại đúng đường bi cái từ video thay vì tiếp tục fit `playSpeed`.

## Decision
- Track bi cái (track.csv, 0.06 s/mẫu) cắt theo t_start..t_end, làm mượt, kéo hai đầu khớp `cueBall` round n và n+1, ghi vào round dưới dạng `replay {dt, xy, contact}`.
- Native dựng `ShotReplay` thẳng từ mẫu, không qua `ShotPhysics`. Bi mục tiêu đi thẳng từ lúc chạm vào lỗ guide.
- Engine giữ làm nhánh chốt chặn khi bàn lệch thế video; màn drill tắt kéo bi nên hiện chưa có đường UI vào.
- Bỏ `playCue`, Previous/Next dựng từ `cueBall` video.

## Next steps
Chờ anh duyệt rồi ak:cook phase 1. Dữ liệu track đang chỉ ở scratchpad, phase 1 chép vào repo trước.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
