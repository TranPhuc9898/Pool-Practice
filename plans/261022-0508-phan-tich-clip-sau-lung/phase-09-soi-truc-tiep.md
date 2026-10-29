---
phase: 9
title: "Soi trực tiếp từ sau lưng"
status: pending
priority: P3
effort: "1d"
dependencies: [7, 8]
---

# Phase 9: Soi trực tiếp từ sau lưng

## Goal

Stance Check có chế độ đặt máy sau lưng, chạy cùng `RearTracker`, `PoseFilter` và `CueTracker` của phân tích clip, không viết lại logic.

## Điều kiện vào

- Plan `.claude/ke-hoach/2026-10-21-stance-nhan-tay-khong-nong.md` đã xong bước 6 (Vision chạy theo nhịp, hạ capture khi máy nóng). Không thì chế độ này thêm việc cho một pipeline đang nóng.
- Phase 8 cho thấy số đo pha và lệch ngang không bị gắn "experimental". Bị gắn thì chế độ trực tiếp chỉ vẽ overlay, không báo nhận xét.

## Files

- Sửa `modules/pool-table/ios/Pose/PoseCoach.swift`: prop `placement` `side | rear`. `rear` đưa `PoseFrame` qua `PoseFilter` và `RearTracker`, chạy `CueTracker` từ trục người chơi chấm trên preview.
- Sửa `modules/pool-table/ios/Pose/PoseCoachView.swift`: vẽ trục tham chiếu, trục đo và vệt cổ tay, dùng chung hàm vẽ với `PoseClipView.swift` (tách thành một file nếu hai nơi cùng dùng).
- Sửa `modules/pool-table/src/PoseCoachView.tsx`, `src/app/stance.tsx`: control Side / Behind trong Section Setup. Đổi giữa chừng thì tracker bắt lại từ đầu, như đổi camera.

## Tasks

- [ ] 1. Tách hàm vẽ overlay dùng chung.
- [ ] 2. Đường `rear` trong `PoseCoach`.
- [ ] 3. Chấm trục trên preview trực tiếp.
- [ ] 4. Chạy 10 phút trên chân máy, so số cú và pha với clip quay cùng lúc bằng máy thứ hai qua màn clip.

## Verification

- `npx expo lint`, `npx tsc --noEmit`, `sh scripts/pose-harness/run.sh --unit` sạch.
- Bước 4: số cú trực tiếp bằng số cú phân tích clip ± 1, log `pose-perf` không lên thermal `serious`.
