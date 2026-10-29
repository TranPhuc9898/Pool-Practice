---
phase: 2
title: "Tự bù độ ngả"
status: pending
priority: P1
effort: "1h"
dependencies: [1]
---

# Phase 2: Tự bù độ ngả

## Goal

Máy ngả tới 30° vẫn chấm đúng mà không bắt anh dựng dọc. Dây dọi tính tại khuỷu từ trọng lực 3 trục cộng tiêu cự và tâm ảnh của camera (intrinsic matrix của từng khung). Status chỉ báo "Phone tilted" khi máy ngả quá 30°, tức lúc đường không còn chấm.

## Files

- `modules/pool-table/ios/Pose/PoseFrame.swift`: trọng lực theo trục buffer, `PoseLens`, dây dọi tại một điểm, góc cẳng tay đo theo dây dọi tại khuỷu.
- `modules/pool-table/ios/Pose/PoseCoach.swift`: bật intrinsic matrix, đọc nó mỗi khung, state `tilted` theo `maxLineTilt`.
- `modules/pool-table/ios/Pose/PoseCoachView.swift`: vẽ dây dọi theo dây dọi tại khuỷu.
- `modules/pool-table/ios/Pose/PoseStroke.swift`: sửa chú thích `maxLineTilt`.

## Tasks

- [ ] 1. Dây dọi theo từng điểm, status `tilted` chỉ khi ngả quá 30° → xong khi: `npx tsc --noEmit` và `npx expo lint` exit 0, `npx expo run:ios --device 00008150-000C04892E99401C --configuration Release --no-bundler` exit 0.
- [ ] 2. Mở app trên máy, đọc log khung đầu (cần 1 xong trước) → xong khi: dòng `[pose] front buffer 720x1280` có `lens f` là số, `cx` trong 324–396, `cy` trong 576–704.
- [ ] 3. Anh ngả máy 20–30°, đứng lần lượt ở nửa trái và nửa phải khung, thả cẳng tay thẳng rồi nghiêng, quay màn hình (cần 2 xong trước) → xong khi: video không có chữ "Phone tilted"; dây dọi đứt nét song song cạnh đứng gần nhất trong phòng (khung cửa, góc tường); đường xanh lúc thả thẳng và đỏ lúc nghiêng, ở cả hai nửa khung.

## Vỡ ở đâu

- Front camera không hỗ trợ intrinsic matrix, hoặc không bật được khi đổi camera lúc session đang chạy → kiểm bằng: log task 2 in `lens none`. Gặp thì báo, không tự đoán tiêu cự từ góc nhìn.
- Dấu của trục z sai (camera trước nhìn theo +z của máy) → kiểm bằng: video task 3, dây dọi xoè ngược chiều cạnh cửa.

## Kết quả

## Phát sinh
