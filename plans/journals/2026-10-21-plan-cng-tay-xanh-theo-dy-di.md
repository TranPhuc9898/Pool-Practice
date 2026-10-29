---
title: Plan cẳng tay xanh đỏ theo dây dọi
date: 2026-10-21
summary: "Đường cẳng tay đổi xanh/đỏ, chỉ cần khuỷu và cổ tay, tô màu khi máy ngả tới 30°"
---

# Plan cẳng tay xanh đỏ theo dây dọi

## What happened

Video quay màn hình 01:45 ngày 2026-10-22: app vẽ đường trắng đúng trên cẳng tay thả thẳng nhưng không đổi màu. Màu chỉ tính khi máy ngả ≤ 12° (`PoseCoach.swift:202`) và thấy vai ≥ 0.4 (`PoseStroke.swift:110`). Trong video máy ngả 23°, vai cao nhất 0.37. Log 23 giây: Vision thấy người 8/23 giây, khuỷu và cổ tay cùng ≥ 0.4 chỉ 1/23 giây, vì máy đặt sát và ngửa lên trần. Chạy Vision lên 8 khung video thì 5 khung không ra người nào.

## Decision

Cách A: màu chỉ cần khuỷu và cổ tay, ngưỡng ngả riêng 30° cho màu, phần bắt cú giữ 12°, dây dọi theo trọng lực như cũ. Bỏ cách B (chỉnh dây dọi theo từng điểm ảnh) vì chưa chắc cần, bỏ cách C (giữ 12°) vì đặt máy như video sẽ hỏng y như cũ. Plan: `plans/261022-0200-cang-tay-xanh-do/`.

## Next steps

Task 1 kiểm trên Mac bằng harness với ảnh TikTok xoay ±12°. Task 2 dựng bản Release lên máy. Task 3 anh đặt máy cách 1,5–2 m quay 30 giây.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
