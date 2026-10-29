---
title: "Clip sau lưng: code phase 2–8, chờ iPhone"
date: 2026-10-22
summary: "Code xong phase 2–3 và 5–8 của plan phân tích clip sau lưng. Chưa có gì chạy trên máy, chưa có clip thật, mọi ngưỡng đều là đoán."
---

# Clip sau lưng: code phase 2–8, chờ iPhone

## What happened
- Pose module có thêm `PoseClip`, `PoseClipView`, `PoseFilter`, `PoseRear`, `PoseCue` (EdgeBandCueTracker) và `PoseTrendView` (Swift Charts).
- TS có thêm `clip-feedback.ts` (baseline trung vị/MAD, cờ khi 3/5 cú lệch), `clip-log.ts` (expo-sqlite `clips.db`) và màn `src/app/clip.tsx`.
- Harness có thêm `--eval nhan.csv`: in sai số cổ tay, khuỷu, góc cơ, mốc pha theo median/p90 và ms mỗi khung.
- Report Core ML có khuyến nghị: chưa train. Không có mô hình cơ nào license rõ chạy được on-device.

## Verified
- tsc và expo lint sạch. `--unit` in `unit ok`. xcodebuild không có lỗi Swift. Build fail ở link expo-dev-launcher, lỗi có từ trước.
- Luật nhận xét kiểm một lần bằng node.
- `--eval` smoke test trên clip ffmpeg testsrc.

## Decision
- CueAxis lưu pixel ảnh đứng, gốc trên trái.
- Tracker dùng gradient 1D theo pháp tuyến, không dùng Sobel. Có sàn `noiseEdge`.
- Phiên được lưu khi bấm nút.
- Sửa pha bằng chạm.

## Next steps
- Anh quay R1–R3 rồi chạy phase 4 trên iPhone.
- Gán nhãn để chạy `--eval`, hiệu chỉnh ngưỡng.
- Phase 9 chờ kế hoạch stance nhận tay không nóng.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
