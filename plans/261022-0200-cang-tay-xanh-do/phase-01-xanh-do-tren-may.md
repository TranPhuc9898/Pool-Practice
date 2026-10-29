---
phase: 1
title: "Xanh/đỏ trên máy"
status: pending
priority: P1
effort: "1h"
dependencies: []
---

# Phase 1: Xanh/đỏ trên máy

## Goal

Đường khuỷu → cổ tay trên overlay có màu xanh khi |góc cẳng tay so với dây dọi| ≤ 10°, đỏ khi lớn hơn. Màu trắng khi không chấm, tức máy ngả quá 30°. Không thấy khuỷu hoặc cổ tay thì không vẽ, như hiện giờ.

## Files

- `modules/pool-table/ios/Pose/PoseFrame.swift`: góc cẳng tay so với `down`, chỉ cần khuỷu và cổ tay.
- `modules/pool-table/ios/Pose/PoseStroke.swift`: `PoseLimits` thêm ngưỡng ngả cho màu và hàm quyết màu, đặt ở đây để harness gọi được.
- `modules/pool-table/ios/Pose/PoseCoach.swift`: truyền kết quả màu cho overlay.
- `modules/pool-table/ios/Pose/PoseCoachView.swift`: xanh, đỏ, trắng.
- `scripts/pose-harness/main.swift`: chế độ ảnh tĩnh in góc và màu bằng code app, thay cho phép tính riêng ở dòng 68.

## Tasks

- [x] 1. Góc cẳng tay chỉ cần khuỷu và cổ tay, hàm màu trong `PoseLimits`, harness ảnh tĩnh in góc và màu từ code app → xong khi: `sh scripts/pose-harness/run.sh` chạy trên `tiktok.png` (scratchpad `front-probe/`) và hai bản xoay ±12° của nó: một bản in góc trong ±3° kèm `xanh`, một bản in |góc| ≥ 21° kèm `đỏ`, bản gốc in `đỏ`. `run.sh --synthetic` in `synthetic ok`.
  ✓ 2026-10-22 02:08 · `tiktok.png … cẳng tay -12° so với dọc đỏ`, `tiktok-r12.png … -24° … đỏ`, `tiktok-r-12.png … -1° … xanh`, `synthetic ok`
- [ ] 2. Overlay tô xanh/đỏ/trắng theo hàm màu, `onFrame` mang kết quả màu (cần 1 xong trước) → xong khi: `npx expo run:ios --device 35FB7B2D-7E84-59D1-BD4C-D0B512791805 --configuration Release --no-bundler` exit 0, `npx tsc --noEmit` và `npx expo lint` exit 0.
- [ ] 3. Anh đặt máy như mục Xong là của plan, vào thế 30 giây, lần lượt thả thẳng rồi nghiêng hẳn trái, phải, quay màn hình. Em đọc log (cần 2 xong trước) → xong khi: video có khung đường xanh lúc thả thẳng và khung đường đỏ lúc nghiêng; log `[pose] arm` có khuỷu và cổ tay ≥ 0.4 ở ≥ 25/30 giây.

## Vỡ ở đâu

- Ảnh TikTok nhỏ (311x644), xoay xong Vision có thể mất khớp, khi đó task 1 hỏng vì Vision chứ không vì code → kiểm bằng: dòng harness in `khuỷu —` hoặc `cổ tay —`. Gặp thì báo, không tự đổi ảnh.
- Máy ngả 20°+ và cẳng tay sát mép khung thì phối cảnh làm lệch tới khoảng 8°. Số này suy ra bằng hình học với góc nhìn ngang giả định 36°, chưa đo → kiểm bằng: video task 3, màu sai lúc tay lệch khỏi giữa khung thì mở cách B.
- Ở 1,5 m Vision vẫn không thấy đủ khuỷu và cổ tay → kiểm bằng: log task 3. Không đạt 25/30 thì ghi số vào Kết quả, không hạ ngưỡng 0.4.

## Kết quả

- 2026-10-22 02:14–02:15, `console7.log`: máy ngả 25–26°, có người trong khung 02:14:18–02:15:35. Trong 78 giây đó, khuỷu ≥ 0.4 ở 48 giây, cổ tay ≥ 0.4 ở 14 giây, cả hai ở 12 giây, vai ≥ 0.4 ở 0 giây. Cửa sổ 30 giây tốt nhất đạt 11/30, chưa tới mức 25/30. Khớp hụt là cổ tay. Log lấy một khung mỗi giây, nên đây là số mẫu chứ không phải số khung. Chưa có video quay màn hình.

## Phát sinh

- 2026-10-22 02:15 · Task 2: lệnh trong "xong khi" dùng ID CoreDevice `35FB7B2D-…`, expo không nhận (`CommandError: No device UDID or name matching "35fb7b2d-…"`, hai lần, `run-ios-7.log`, `run-ios-8.log`). Cùng lệnh với UDID phần cứng `00008150-000C04892E99401C` ra `Build Succeeded`, cài xong, exit 0 (`run-ios-9.log`). `npx tsc --noEmit` exit 0, `npx expo lint` exit 0. Ô chưa tick, chờ anh nhận bằng chứng này.
