---
title: "Cook phase 1 clip sau lưng: cờ --rear"
date: 2026-10-22
summary: Harness thêm --rear ghi khớp tay từng khung; chờ clip R1-R3
---

# Cook phase 1 clip sau lưng: cờ --rear

## What happened
Thêm `runRear` vào `scripts/pose-harness/main.swift`: CSV mỗi khung một dòng (t, vai/khuỷu/cổ tay chuẩn hoá ảnh đứng gốc trên trái, L px, ba độ tin cậy), in % thấy khuỷu+cổ tay, % thấy vai, L trung vị. Smoke test trên screen recording 2599 khung ra 2599 dòng.

## Decision
Hàm riêng thay vì nhánh trong `runVideo`, để không chạm StrokeTracker. Không sửa file trong `modules/`.

## Next steps
Anh quay R1/R2/R3; chạy `--rear` cho ba clip, đánh mốc backswing, tính tỉ số biên độ/rung. Phép đổi toạ độ cho clip có transform xoay chưa kiểm.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
