---
phase: 2
title: "Lõi đọc clip dùng chung"
status: in-progress
priority: P1
effort: "5h"
dependencies: [1]
---

# Phase 2: Lõi đọc clip dùng chung

## Goal

Một file Swift không dính UIKit đọc clip, chạy Vision từng khung và tính số đo theo trục chấm tay. Harness và app cùng gọi nó, nên số trên Mac và trên máy là một.

## Files

- Tạo `modules/pool-table/ios/Pose/PoseClip.swift`:
  - `ClipInfo`: kích thước sau xoay, `nominalFrameRate`, độ dài, `CGImagePropertyOrientation`, `down`. Lấy hướng từ `preferredTransform` như `main.swift:100`.
  - `func analyzeClip(url:side:minConfidence:progress:) async throws -> (ClipInfo, [PoseFrame])`. `AVAssetReader` ra `kCVPixelFormatType_420YpCbCr8BiPlanarFullRange`, đưa thẳng `CVPixelBuffer` cho Vision, chỉ giữ toạ độ khớp. Kiểm `Task.isCancelled` mỗi khung, gọi `progress` mỗi 1%.
  - `CueAxis`: hai điểm pixel buffer gốc, gốc dưới trái như `PoseFrame`, kèm `t` của khung đã chấm.
  - `ClipMeasure` cho một khung: lệch ngang có dấu của cổ tay và khuỷu tới trục (px và ÷ L), góc cẳng tay so với trục, `forearmLean` sẵn có. Dấu dương là phía phải của ảnh đã xoay đứng.
  - `func axisDeviation(_ a: CueAxis, _ ref: CueAxis) -> Double`: góc có dấu giữa hai trục, độ, gói trong ±90° vì trục không có chiều.
  - `func videoRect(_ info: ClipInfo, in bounds: CGRect) -> CGRect` theo `AVMakeRect(aspectRatio:insideRect:)`, và hai hàm đổi điểm buffer ↔ điểm view qua rect đó.
- Sửa `scripts/pose-harness/main.swift`: `runVideo` và `--rear` gọi `analyzeClip` thay cho vòng đọc riêng. Thêm `--unit`.
- Sửa `scripts/pose-harness/run.sh`: chép thêm `PoseClip.swift`.

## Tasks

- [x] 1. Viết `PoseClip.swift`. Giữ lối viết của `PoseFrame.swift`: struct, hàm tĩnh, comment tiếng Việt chỉ ở chỗ không hiển nhiên.
- [x] 2. Đổi harness sang gọi `analyzeClip`. Harness chạy đồng bộ nên bọc bằng `Task` và `DispatchSemaphore`.
- [x] 3. `--unit` kiểm, mỗi case in một dòng `ok` hoặc `FAIL` kèm số:
  - `PoseOrientation.unrotate` bốn hướng, điểm đi một vòng về đúng chỗ;
  - `videoRect` cho video 1920×1080 trong view 390×844 và 844×390, điểm góc buffer rơi đúng góc rect, đổi đi rồi đổi về sai < 0,5 px;
  - lệch ngang có dấu: điểm bên phải trục dương, trên trục bằng 0, trục chấm ngược chiều cho cùng kết quả;
  - `axisDeviation`: trục 0° và 179° lệch 1°, không phải 179°;
  - `analyzeClip` huỷ giữa chừng thì ném `CancellationError`, không trả mảng dở.
- [ ] 4. Chạy lại R1 bằng harness mới, so với CSV của phase 1.

## Verification

- `sh scripts/pose-harness/run.sh --unit` in `unit ok`.
- `sh scripts/pose-harness/run.sh --synthetic` in `synthetic ok`.
- `run.sh R1.mov --rear r1b.csv` cho `r1b.csv` trùng `r1.csv` của phase 1 từng dòng (`diff` rỗng).
- `npx expo run:ios --device` build qua, Stance Check vẫn chạy như trước khi mở.

## Kết quả

Bước 1–3 (2026-10-22):

- Đã có `modules/pool-table/ios/Pose/PoseClip.swift`. Harness gọi `analyzeClip`.
- Đã kiểm: `--unit` in `unit ok`, đủ các case của bước 3.

Còn treo:

- Bước 4 chờ R1.
- Chưa chạy `expo run:ios --device` để xem Stance Check.

Lệch khỏi plan: `CueAxis` lưu pixel ảnh đứng gốc trên trái, không lưu toạ độ buffer, để màn clip, harness và tracker cơ dùng chung một hệ.
