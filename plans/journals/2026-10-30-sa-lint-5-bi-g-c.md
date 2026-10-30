---
title: Sửa lint 5 bài G cũ
date: 2026-10-30
summary: "37/38/39/41/74 đạt drill-lint, lint miễn §4 cho bàn rack như engine"
---

# Sửa lint 5 bài G cũ

## What happened
37, 38, 39 và 41 thiếu lực m/s, rate và câu why ở mọi round. Harness `ONLY=G0` sinh `placed(...)` cho từng round. 37 phải thêm ràng buộc `stop` (round stop chạy 22") và `back: 12` (round draw chỉ lùi 1"). 74 có ba round phá vẽ tay `BREAK_PATH`.

## Decision
74 §4 ("chuỗi không pot bi 2..6"): lint thêm `racked` chép từ `DrillShotPlanner.racked`, vì engine cũng coi bàn rack là cú phá. Skill 74 giữ nguyên `test`, vì nó là bài Tests duy nhất ở stage 1.

## Kết quả
19/19 bài G đạt lint. tsc và expo lint sạch. Simulator không báo Missed ở round nào. Trên simulator, 37 đứng "Shot 1/4" sau mỗi Play. Đây là đúng thiết kế, không phải lỗi: round không dời bàn thì sang round theo 5 lượt ghi.

## Next steps
RDS 75/76/78/81 và các bài break 29/30/70/71 còn cùng lỗi §3, chưa làm.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
