---
phase: 2
title: "Hai camera, người chơi chọn"
status: pending
priority: P1
effort: "3h"
dependencies: [1]
---

# Phase 2: Hai camera, người chơi chọn

## Goal

Stance Check chạy được bằng cả camera trước lẫn camera sau, người chơi chọn ở mục Setup sẵn có, mặc định camera trước. Camera trước cho người chơi thấy màn lúc cúi (phát tiếng đã bỏ). Camera sau giữ cho ai muốn khung hình nét hơn hoặc đặt máy xa.

## Files

- Sửa `modules/pool-table/src/PoseCoachView.tsx`: prop `camera?: 'front' | 'back'` cạnh `hand` (`:40`).
- Sửa `modules/pool-table/ios/Pose/PoseCoachView.swift`: `@Field var camera` cạnh `hand` (`:8`), `onChange` như `hand` (`:31`) gọi coach đổi camera.
- Sửa `modules/pool-table/ios/Pose/PoseCoach.swift`: `run()` (`:91–116`) lấy thiết bị theo camera đang chọn thay cho `.back` cố định (`:96`); đổi camera thì dựng lại input trong session, reset tracker. Kiểm `isVideoMirrored` của connection data output (`:111`) và preview.
- Sửa `modules/pool-table/ios/Pose/PoseFrame.swift`: `PoseOrientation` (`:28–54`) thêm ánh xạ hướng cho buffer camera trước. Comment hiện ghi ánh xạ theo buffer cảm biến camera sau, camera trước nhiều khả năng khác (suy đoán, chưa đo).
- Sửa `modules/pool-table/ios/Pose/PoseCoachView.swift` `draw` (`:96+`) chỉ khi overlay lệch: nó đi qua `layerPointConverted(fromCaptureDevicePoint:)`, nhiều khả năng đã tính lật gương (suy đoán).
- Sửa `src/app/stance.tsx`: state `camera` mặc định `"front"`, thêm một `AppSegmentedControl` "Front camera / Back camera" vào Section Setup theo đúng khuôn control tay cơ (`:107–118`), đổi thì xoá strokes như đổi tay; chữ `:41` "No back camera on this device." thành câu theo camera đang chọn; comment `:56`.

## Tasks

- [ ] 1. Prop `camera` từ TS xuống Swift, coach đổi thiết bị khi prop đổi. Log một lần `isVideoMirrored` và `videoRotationAngle` của hai connection mỗi lần đổi.
- [ ] 2. Buffer đưa vào Vision luôn là ảnh không lật, để nhãn tay phải của Vision là tay phải thật ở cả hai camera. Data output camera trước đang lật thì tắt lật ở connection data output, để preview lật như gương.
- [ ] 3. Ánh xạ `PoseOrientation` cho camera trước, chọn theo vị trí thiết bị đang chạy.
- [ ] 4. Control chọn camera và chữ trong `stance.tsx`.

## Verification

Xong khi, trên iPhone (`npx expo run:ios --device`), máy dựng đứng trên chân máy, tay cơ = Right. Làm cả 5 mục với **Front camera**, rồi mục 1–4 với **Back camera**:

1. Mở màn lần đầu, control đang ở Front camera, preview là camera trước và lật như gương (giơ tay phải, hình giơ bên phải màn). Bấm Back camera: preview đổi trong ≤ 1 s, Scoreboard về 0.
2. Overlay vai–khuỷu–cổ tay nằm trên tay thật.
3. Đứng buông thõng tay cơ: tay vàng, dây dọi thẳng đứng. Nâng cẳng tay ngang: tay trắng. Sai hướng 90° hoặc 180° sẽ trượt bước này.
4. Cúi, cú khuỷu lùi ra sau rõ: Scoreboard ra "Forearm forward at contact", không phải "Forearm back". Lật gương sai sẽ đảo hai câu này.
5. `npx tsc --noEmit` và `npx expo lint` exit 0.

## Rủi ro

- Camera trước góc khác, cách 2–3 m người chơi nhỏ hơn trong khung → "thấy tay" tụt. Mục 5 của phase 1 cho số trước khi làm phase này; tụt quá 5 điểm thì vẫn làm, nhưng ghi số vào Kết quả và cân lại mặc định.
- Đổi camera giữa lúc session chạy làm rò hoặc treo session. Kiểm bằng: bấm qua lại 10 lần, preview vẫn chạy, Console không có lỗi AVFoundation.
- Ánh xạ hướng sai chỉ lộ khi xoay máy. Máy khoá dọc (`PoseCoachView.swift:92–94`) và chỉ dùng trên chân máy, nên chỉ cần đúng hướng dọc. Ghi giới hạn này vào comment `PoseOrientation`.

## Kết quả

_(điền khi chạy)_

## Phát sinh

- 2026-10-21: anh chọn làm phase này trước khi có clip phase 1 (task 3–5 phase 1 chưa chạy), nên rủi ro 1 chưa có số "thấy tay" camera trước để so.
- Verification 4 ghi "lật gương sai sẽ đảo hai câu này". Thực tế `forward` của `StrokeTracker` lấy theo mũi so với vai (`PoseStroke.swift:288–294`), không theo nhãn trái/phải, nên lật gương không đảo dấu; lật sai chỉ làm Vision gán nhầm tay. Mục 4 vẫn kiểm như ghi, chỉ là không bắt được lỗi lật gương.
- Ánh xạ camera trước: bản đầu giả định góc 0° là buffer gốc cảm biến (dọc xoay `.right`). Log thật trên iPhone 17 Pro Max 15:11: `[pose] front data mirrored false angle 270 → mirrored false angle 0`, `[pose] preview mirrored true angle 90`. Góc mặc định 270 chứ không phải 0, nên góc tính theo hướng máy, 0° là đúng chiều khi home bên phải như camera sau. Đã đổi sang `down = (gy, gx)`, dọc xoay `.left`. Vẫn là suy luận, mục 3 trên máy mới xác nhận.
- Camera trước bị ghi đè 270° → 0°, connection dữ liệu xoay buffer từng khung (tài liệu Apple `videoRotationAngle`). Tốn bao nhiêu chưa đo. Hướng rẻ hơn: giữ góc mặc định, đưa góc vào `PoseOrientation`. Thuộc plan chống nóng, không làm ở đây.
- 15:18, máy thật: preview camera trước ở 90° ra hình nằm ngang, đỉnh đầu bên trái (ảnh chụp màn của anh). Header SDK (`AVCaptureSession.h` `videoRotationAngle`, `AVCaptureDevice.h` `RotationCoordinator`) ghi 0° là hướng gốc cảm biến, và góc mặc định khác 0 chính là cái xoay buffer. Vậy hai dòng trên sai: 0° không phải "home bên phải" cho mọi camera, và ghi đè về 0° là bỏ xoay chứ không thêm. Sửa lần 2: data giữ 0°, góc dọc lấy từ `RotationCoordinator.videoRotationAngleForHorizonLevelPreview` cho cả preview lẫn `PoseOrientation.down`, overlay tự xoay theo góc đó thay cho `layerPointConverted(fromCaptureDevicePoint:)`. Log mới: `[pose] preview … capture …`, `[pose] front buffer WxH upright … vision …`.
- 15:32, log sau sửa lần 2: `preview mirrored true angle 0, capture 0`, `front buffer 720x1280 upright 0 vision 1`. Clip quay màn 15:32 (38 s, máy để trên bàn, cách người khoảng nửa mét, ngửa lên trần): preview đứng dọc, chấm mũi nằm đúng trên mũi anh ở giây 3 và 33. Chưa có khung nào vẽ được tay anh: cổ tay ra ngoài mép dưới, vai sát mép trên. Cả clip status là `Phone tilted 12°` (ngưỡng `> 12`, số làm tròn xuống), nên anh không thấy được câu "Whole body side-on in frame". Giây 12–18 overlay bám vào một người áo đen ngồi phía sau, vì `PoseFrame` chọn người có tổng độ tin cậy tay cao nhất (`PoseFrame.swift:76`), không chọn người to nhất. Chưa tick mục nào: chưa giơ tay kiểm lật gương, chưa thấy overlay nằm trên tay.
- Việc ngoài plan, chờ anh: (a) chọn người có khung thân lớn nhất thay cho tay rõ nhất; (b) status góc ngả hiện số làm tròn lên, để không hiện "12°" khi ngưỡng là 12.
- 16:05: (a) và (b) chuyển sang phase 4. Sửa lại một nhận định ở dòng 15:32: harness trên khung quay màn cho thấy giây 12–15 Vision chỉ thấy 1 người, vì mặt anh ra ngoài mép phải. Overlay nằm trên người áo đen ở đoạn đó không do cách chọn người. Lỗi chọn người chỉ đúng cho giây 16–21, khi Vision thấy cả 2 người. Số "12°" đứng yên suốt clip là do `status` không phát lại khi độ ngả đổi (`PoseCoach.swift:229`), không phải do làm tròn.
