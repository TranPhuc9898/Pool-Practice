---
phase: 3
title: "Màn Analyze a clip"
status: in-progress
priority: P1
effort: "1.5d"
dependencies: [2]
---

# Phase 3: Màn Analyze a clip

## Goal

Từ Stance Check mở được màn chọn clip, chấm trục, phân tích và lùi từng khung với overlay. Đây là toàn bộ Phase 1 của prompt trên máy thật.

## Files

- Cài `expo-image-picker` bằng `npx expo install expo-image-picker`. Đọc `https://docs.expo.dev/versions/v57.0.0/sdk/imagepicker/` trước: tuỳ chọn chọn video, giữ chất lượng gốc (không nén lại), và chuỗi quyền Photos trong config plugin.
- Sửa `app.json`: plugin `expo-image-picker` với chuỗi quyền Photos tiếng Anh, giọng như `NSCameraUsageDescription` hiện có.
- Tạo `modules/pool-table/ios/Pose/PoseClipView.swift` (ExpoView):
  - `AVPlayerLayer` cùng một `CAShapeLayer` overlay đặt theo `videoRect`;
  - `CADisplayLink` đọc `player.currentTime()`, tìm khung gần nhất trong mảng `PoseFrame` đã sắp theo `t` bằng tìm nhị phân, vẽ vai–khuỷu–cổ tay, trục tham chiếu (một màu), các trục chấm thêm (màu khác), vệt cổ tay 1 s gần nhất;
  - chạm khi `marking` bật: hai lần chạm thành một `CueAxis` tại khung đang dừng, phát `onAxis`;
  - lệnh `play`, `pause`, `step(count)` qua `AVPlayerItem.step(byCount:)`, `seek(t)` với tolerance zero;
  - chạy `analyzeClip` trong `Task` riêng khi đổi `uri` hoặc `hand`, huỷ khi view rời màn hoặc đổi `uri`.
  - Props: `uri`, `hand`, `marking`, `axes`. Events: `onInfo`, `onProgress`, `onAnalyzed`, `onAxis`, `onFrame` (giới hạn 10 lần/giây).
- Sửa `modules/pool-table/ios/PoolTableModule.swift`: đăng ký `View(PoseClipView.self)` cùng props, events và `AsyncFunction` lệnh của view.
- Tạo `modules/pool-table/src/PoseClipView.tsx`: kiểu props và events, theo lối `PoseCoachView.tsx`. Sửa `modules/pool-table/index.ts` export thêm.
- Tạo `src/app/clip.tsx`: nút chọn clip, dòng info (độ phân giải, fps, độ dài), chọn tay bằng `AppSegmentedControl`, nút "Mark cue axis", tiến độ phân tích, `PoseClipView`, hàng nút ◀︎ ▶︎ từng khung và play/pause, khối số đo của khung đang xem. Cuối màn có dòng giới hạn: số đo trên ảnh 2D, đơn vị px và bội số cẳng tay, không phải mm.
- Sửa `src/app/stance.tsx`: một `GhostButton` "Analyze a clip" trong Section Setup, `router.push("/clip")`.

## Tasks

- [ ] 1. Kiểm `expo-image-picker` trả `uri` mở được bằng `AVURLAsset`, và fps, độ phân giải không đổi so với file gốc. Lệch thì dùng tuỳ chọn export gốc của picker. Không có tuỳ chọn đó thì dừng, báo anh, cân `PHPickerViewController` trong Swift.
- [x] 2. `PoseClipView` phát lại và lùi từng khung, chưa overlay.
- [x] 3. Phân tích nền: tiến độ lên đều, kéo thanh, lùi khung trong lúc phân tích vẫn mượt, huỷ khi back.
- [x] 4. Overlay khớp và vệt cổ tay. Khung có khớp nil thì không vẽ khớp đó, không nối đoạn.
- [x] 5. Chấm trục, trục đầu tiên là tham chiếu, các trục sau hiện độ lệch so với tham chiếu.
- [x] 6. Khối số đo khung hiện tại lấy từ `ClipMeasure`. Khung chưa có trục thì chỉ hiện `forearmLean`.
- [x] 7. Thanh tua: dùng control có sẵn trong `@/design-system` nếu có. Không có thì vẽ thanh scrub trong `PoseClipView`, không thêm package.

## Verification

- `npx expo lint` và `npx tsc --noEmit` sạch.
- `sh scripts/pose-harness/run.sh --unit` vẫn in `unit ok`.
- `npx expo run:ios --device` build qua. Trên máy: chọn R1, info hiện 1920×1080, 60 fps, độ dài khớp Photos.
- Quay màn hình một lượt đủ bước 2–6 với R1, gửi anh xem.

## Kết quả

Bước 2–7 (2026-10-22):

- Đã viết code `PoseClipView.swift` và `src/app/clip.tsx`.
- Đã kiểm: `tsc` và `expo lint` sạch, `--unit` in `unit ok`. xcodebuild không có lỗi Swift. Build vẫn fail ở link `RCTPackagerConnection` của expo-dev-launcher, lỗi này có từ trước, không liên quan Pose.

Còn treo:

- Bước 1 và mọi kiểm trên máy chờ anh.

Lệch khỏi plan:

- Thanh tua và nút lùi khung nằm trong native view (`PoseClipTransport`), không dùng design-system. Lý do: design-system không có control scrub.
