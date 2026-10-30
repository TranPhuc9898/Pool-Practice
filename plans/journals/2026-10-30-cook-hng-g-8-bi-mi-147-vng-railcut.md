---
title: "Cook hạng G: 8 bài mới, 147 vướng railCut"
date: 2026-10-30
summary: "G lên 19 bài, lint đạt 9/9, Play simulator vào sạch cả 9"
---

# Cook hạng G: 8 bài mới, 147 vướng railCut

## What happened
Viết 142, 145–150, 153 từ số harness `drillG()` trên ShotPhysics 65a775f, chuyển 99 H → G. drill-lint đạt 9/9, tsc sạch.
Simulator: 147 báo "Missed Ball 1" mà bi không chạy. `replan()` trong `PoolEditorView.swift` bỏ qua skill `railCut` (dành cho bài rack), nên Play bài một cú không có cú đã giải.

## Decision
147 đổi skill sang `cutAngle`, nhãn giữ "Rail Cut". Bỏ 143 vì trùng 138. Ngưỡng 5/10 cho 146, 149 (rate 22/45).

## Next steps
Zone trên app chưa đọc bằng máy, mới thấy vào lỗ. Chưa commit.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
