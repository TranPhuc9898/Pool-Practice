---
title: Drill 31 Play nối cú theo chỗ bi cái dừng
date: 2026-10-19
summary: "Round kế nối bi cái từ engine, báo trượt, Previous/Next cho round, ghi lượt không kéo round; chưa kiểm simulator"
---

# Drill 31 Play nối cú theo chỗ bi cái dừng

## What happened
- Play một cú trước đây không báo về JS: `toggleReplay` chặn im lặng khi cú `.bad`, và round kế nhảy bi cái về vị trí video.
- Native: `PoolEditorModel.onReplayEnd` gọi khi replay tự đóng. `PoolEditorView` gửi `ended` kèm `ok`, `cueX/cueY`, `scratch`, `blocked`.
- Harness h107 beam2: 12/12 vào khi lệch ±0.1 m/s và làm tròn 4 số, sai trung bình 0.44 kc, lớn nhất 2.05 ở bi 3. Từ vị trí video chỉ vào 9/12 (trượt 2, 3, 10).
- JS `src/app/drill/[id].tsx`:
  - `roundAt { i, cue? }` bỏ buộc theo `done`.
  - `missAt` hiện note ở chỗ `targetNote`.
  - Nút Previous/Next dùng chung cho `shots` và round pattern.
  - Pass/Miss sang bi kế, Undo lùi một, Start Drill về bi 1.

## Decision
- Previous/Next dựng bàn từ `round.playCue` (chuỗi engine), không phải `cueBall` video, vì `playSpeed` fit theo chuỗi.
- Có `cueX/cueY` native báo thì ưu tiên, để đúng cả khi bi bị kéo.

## Next steps
- Phase 4 trên simulator chưa chạy. Máy khoá màn nên cliclick không chạm được.
- Cần kiểm: Play 12 lần đi hết, Previous/Next, Pass ở bi 5 sang bi 6.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
