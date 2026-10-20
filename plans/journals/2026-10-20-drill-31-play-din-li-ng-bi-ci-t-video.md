---
title: Drill 31 Play diễn lại đường bi cái từ video
date: 2026-10-20
summary: "Play drill 31 chạy đường bi cái ghi từ video eJldkCO6TeA, 12 cú nối liền trên simulator"
---

# Drill 31 Play diễn lại đường bi cái từ video

## What happened
Play của drill 31 bỏ engine, diễn lại đường bi cái cắt từ track.csv của video eJldkCO6TeA. `scripts/video-harness/replay.py` sinh `31-twelve-ball-rails.replay.ts`. Native dựng `ShotReplay(recorded:)`: bi cái theo mẫu 0.06 s, bi mục tiêu đi thẳng vào lỗ guide từ lúc chạm. Engine chỉ chạy khi bàn lệch thế video quá 0.5 in.

## Decision
- Bỏ làm mượt track: làm mượt cắt góc chạm và góc băng, đẩy điểm chạm xa bi mục tiêu 3.5–4.5 in. Mẫu gần bi mục tiêu nhất được đặt đúng vào ghost ball.
- Kéo hai đầu đường theo quãng đường để điểm đầu trùng `cueBall` round này, điểm cuối trùng `cueBall` round kế. Lệch gốc ≤ 0.73 in.
- `playCue` bị gỡ. `playSpeed` giữ cho nhánh engine.

## Pitfalls
- Track hỏng ở cú 10 (mất bi lúc dội băng) và cú 11 (tracker kẹt), vá tay qua điểm mốc.
- Metro không thấy file mới sinh, phải khởi động lại.
- `simctl io screenshot` trả khung cũ giữa chừng, tưởng chuỗi kẹt ở bi 7. Chụp bằng `screencapture` thì thấy đúng.

## Next steps
Chưa kiểm Pass/Undo/Start Drill trên UI.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
