---
title: Plan phân tích clip tay sau quay từ sau lưng
date: 2026-10-22
summary: "Master prompt AI Billiards Coach gắn vào module Pose hiện có, 9 phase, cổng nghiệm thu ở phase 4"
---

# Plan phân tích clip tay sau quay từ sau lưng

## What happened
Anh dán master prompt AI Billiards Coach (app Swift riêng, quay từ sau lưng). Brainstorm chọn hướng A: gắn vào `modules/pool-table/ios/Pose/` thay vì làm app mới. Plan: `plans/261022-0508-phan-tich-clip-sau-lung/`.

Good-GYM (đọc README, `exercise_counters.py`, `data/exercises.json`; clone thất bại, API 403) chỉ có góc 3 điểm, lọc median±2σ cửa sổ 5, máy trạng thái 2 ngưỡng và `min_rep_time` 0,5 s. Mình lấy lại bộ lọc và cách chặn đếm đôi.

## Decision
- `StrokeTracker` đo cổ tay vuông góc với dây dọi, nên chỉ đúng cho góc bên hông. Từ sau lưng, backswing đi dọc trục ống kính. Pha cú cho góc sau lưng viết mới ở phase 5, và chỉ tự bắt khi clip thật ở phase 1 cho tỉ số biên độ/rung ≥ 3.
- Lõi đọc clip `PoseClip.swift` dùng chung cho harness và app. Test là `run.sh --unit`. Lưu trữ dùng expo-sqlite, không SwiftData.

## Next steps
Phase 1: thêm `--rear` vào harness, anh quay R1/R2/R3 (1080p60, sau lưng, máy cách 2 m).

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
