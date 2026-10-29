---
phase: 7
title: "Lịch sử phiên và nhận xét"
status: in-progress
priority: P2
effort: "1.5d"
dependencies: [5, 6]
---

# Phase 7: Lịch sử phiên và nhận xét

## Goal

Lưu từng phiên phân tích, so các phiên với nhau, và đưa nhận xét chỉ khi có bằng chứng so với baseline của chính người chơi.

## Files

- Tạo `src/pool-engine/clip-log.ts`, theo lối `src/pool-engine/attempt-log.ts`: bảng `clip_sessions` (id, at, clip_uri, hand, discipline `nine-ball | chinese-eight`, frames, arm_ratio) và `clip_strokes` (id, session_id, index, các số đo theo pha của phase 5, cue_dev, cue_conf, confidence, phase_source `auto | manual`). Chỉ `CREATE TABLE IF NOT EXISTS`, không đụng bảng cũ.
- Tạo `src/pool-engine/clip-feedback.ts`: hàm thuần, không I/O.
  - baseline của một số đo = trung vị và MAD của các cú trong phiên anh chọn làm baseline;
  - gắn cờ khi ≥ 3 trong 5 cú gần nhất nằm ngoài trung vị ± 3·MAD và độ tin cậy cú ≥ 0,6;
  - không đủ 5 cú có độ tin cậy hoặc chưa có baseline thì trả `inconclusive` kèm lý do;
  - câu nhận xét nói rõ số đo trên ảnh 2D và hướng lệch, không nói "lỗi" khi chưa có cờ.
- Sửa `modules/pool-table/src/PoseClipView.tsx` và `PoseClipView.swift`: `onAnalyzed` trả số đo từng cú.
- Sửa `src/app/clip.tsx`: Section "Results" (số từng cú, cờ, giới hạn đo), Section "History" (danh sách phiên, đặt baseline, so hai phiên theo trung vị từng số đo).
- Biểu đồ xu hướng: kiểm `@/design-system` có biểu đồ không. Không có thì tạo `modules/pool-table/ios/Pose/PoseTrendView.swift` bằng Swift Charts, chỉ vẽ trung vị mỗi phiên của một số đo.

## Tasks

- [x] 1. `clip-log.ts` và luồng ghi sau khi phân tích xong.
- [x] 2. `clip-feedback.ts`. Hỏi anh trước khi thêm test TS (repo chưa có runner). Không test thì kiểm bằng một script `node` một lần trong scratchpad, không commit.
- [x] 3. Results và History trên màn clip.
- [x] 4. Biểu đồ xu hướng.

## Verification

- `npx expo lint` và `npx tsc --noEmit` sạch.
- Trên máy: phân tích R1 đặt làm baseline, rồi phân tích R2. Phiên R2 gắn cờ lệch ngang cổ tay, hướng đúng với hướng anh cố tình đẩy. R1 phân tích lại lần hai không gắn cờ nào.
- Xoá app, cài lại: không crash khi bảng chưa có.

## Kết quả

Bước 1–4 (2026-10-22):

- `src/pool-engine/clip-log.ts`: bảng `clip_sessions` (thêm cột `baseline`) và `clip_strokes`, chỉ `CREATE TABLE IF NOT EXISTS`, nằm ở DB riêng `clips.db`.
- `src/pool-engine/clip-feedback.ts`:
  - baseline lấy trung vị và MAD;
  - cờ bật khi ≥ 3 trong 5 cú tin cậy (≥ 0,6) gần nhất nằm ngoài trung vị ± 3·MAD;
  - MAD có sàn 0,02 L và 0,2°, sàn này là đoán;
  - số đo cơ còn cần `cueConfidence` ≥ 0,6.
- Màn clip có:
  - Results: từng số đo, cờ, giới hạn đo, nút Save hoặc Update session;
  - History: Compare hai phiên theo trung vị, Set as baseline, Delete, biểu đồ;
  - control chọn 9-Ball hoặc Chinese 8-Ball trong Setup.
- Biểu đồ: `@/design-system` không có chart, nên dùng `PoseTrendView.swift` (Swift Charts), baseline là vạch xanh.

Đã kiểm:

- tsc và lint sạch. xcodebuild không có lỗi Swift.
- Luật nhận xét chạy một lần bằng node trong scratchpad (không có test runner, không commit):
  - năm cú như baseline ra ok;
  - bốn cú đẩy +0,23 L ra cờ "4 of 5 right of your baseline by 0.23 L";
  - ba cú tin cậy ra inconclusive;
  - chưa có baseline ra inconclusive.

Còn treo: verification trên máy (R1 baseline, R2 có cờ, cài lại app không crash).

Lệch khỏi plan:

- `onAnalyzed` không trả số đo từng cú. `onStrokes` của phase 5 đã có đủ, nên lưu từ đó.
- Lưu bằng nút bấm chứ không tự lưu, để sửa pha hay chấm lại trục xong mới ghi. Ghi lại thì thay hết cú của phiên.
