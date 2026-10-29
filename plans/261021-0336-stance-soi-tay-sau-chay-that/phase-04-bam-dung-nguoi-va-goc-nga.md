---
phase: 4
title: "Bám đúng người chơi, số độ ngả chạy theo máy"
status: pending
priority: P1
effort: "1.5h"
dependencies: [2]
---

# Phase 4: Bám đúng người chơi, số độ ngả chạy theo máy

Chen trước phase 3: phase 3 quay ở chỗ có người khác lọt khung, nên phải bám đúng người trước.

## Goal

Khi có người khác lọt khung, overlay vẫn nằm trên người chơi. Lúc máy ngả, số độ trên status thay đổi theo máy thật để người chơi tự chỉnh cho tới khi status chuyển sang tìm tay. Có log mỗi giây để biết vì sao tay không hiện: không thấy người, hay thấy người mà khớp tay dưới 0.4.

## Bằng chứng từ clip 15:32

- Harness ảnh tĩnh trên khung quay màn: giây 16–21 Vision thấy 2 người, overlay app nằm trên người áo đen. Đây là lỗi chọn người (`PoseFrame.swift:76` chọn tay rõ nhất). Giây 12–15 Vision chỉ thấy 1 người vì mặt anh ra ngoài mép phải, nên đổi cách chọn không cứu được đoạn đó.
- `PoseCoach.swift:229` chỉ phát status khi state hoặc góc cẳng tay đổi. Lúc tilted thì tracker reset, cẳng tay nil, nên số độ đứng yên ở giá trị đầu tiên. "Phone tilted 12°" suốt 38 s là số đóng băng, không phải độ ngả thật.
- Giới hạn: khung quay màn nhỏ hơn và có UI đè lên, không phải buffer 720p của camera. Đây chỉ là số đại diện.

## Files

- `scripts/pose-harness/main.swift`: chế độ ảnh tĩnh in thêm toạ độ mũi của người được chọn.
- `modules/pool-table/ios/Pose/PoseFrame.swift`: chọn người.
- `modules/pool-table/ios/Pose/PoseCoach.swift`: `status`, log mỗi giây.

## Tasks

- [x] 1. Harness ảnh tĩnh in `mũi (x, y)` chuẩn hoá, gốc trên trái → xong khi: chạy `run.sh` trên 6 khung giây 16–21 của clip 15:32 (code cũ), cả 6 dòng in toạ độ mũi nằm trên mặt người áo đen, so bằng mắt với ảnh.
  ✓ 2026-10-21 16:04 · 5/6 người áo đen (`s10.png: 2 người … | mũi (0.61, 0.58)`), `s11` chọn anh; anh chốt đạt với 5/6 ("rồi thì cook đi")
- [x] 2. Chọn người có khung bao các khớp thấy được (≥ `minConfidence`) lớn nhất → xong khi: cùng 6 khung đó in mũi nằm trên mặt anh, và `run.sh --synthetic` in `synthetic ok`.
  ✓ 2026-10-21 16:06 · 6/6 mũi trên mặt anh (`s14.png: 2 người … | mũi (0.82, 0.46)`, đánh dấu lên ảnh đối chiếu), `synthetic ok`; sửa lần 1: khung tính khớp ≥ 0.1 thay vì ≥ 0.4
- [ ] 3. Lúc tilted, status phát lại khi số độ đổi, số làm tròn lên → xong khi: trên máy, ngả dần máy từ dọc ra sau, số trên status tăng theo và không lần nào hiện "12°". Dựng thẳng lại thì status thành "Looking for your cue arm…".
- [ ] 4. Log `[pose] arm` mỗi giây: số người Vision thấy, độ tin cậy vai/khuỷu/cổ tay của người được chọn → xong khi: console máy in đúng 1 dòng mỗi giây lúc màn Stance mở.
- [x] 5. Build Release lên máy → xong khi: `npx expo run:ios --device … --configuration Release --no-bundler` exit 0, `npx tsc --noEmit` và `npx expo lint` exit 0.
  ✓ 2026-10-21 16:16 · build exit 0 (`› Build Succeeded`, `0 error(s), and 9 warning(s)`, cài lên 01.thanggg12 `Complete 100%`), tsc exit 0, lint exit 0

## Verification

Xong khi, trên iPhone, Front camera, tay cơ Right. Máy dựng đứng thẳng ngang khuỷu, đặt bên phải anh, cách 2–2,5 m, lọt khung từ đầu tới gối. Một người khác ngồi hoặc đứng phía sau, xa máy hơn anh:

1. Trong 30 s, overlay không lần nào nhảy sang người phía sau.
2. Log `[pose] arm` cho vai, khuỷu, cổ tay của anh ≥ 0.4 ở ≥ 25/30 giây. Không đạt thì ghi số vào Kết quả: đó là bằng chứng camera trước ở 2 m không đủ, không phải lỗi dựng máy.
3. Chạy tiếp Verification phase 2 trong cùng buổi.

## Rủi ro

- Có người đi ngang sát máy thì khung của họ to hơn người chơi, overlay nhảy sang họ trong lúc đó. Mục 1 vẫn nhảy thì làm thêm bám người của khung trước, không làm trước.
- Người chơi cúi lúc address làm khung thấp đi. Ước tính: khung ngang rộng ra theo cơ và chân sau, diện tích vẫn lớn hơn lúc đứng. Mục 1 kiểm luôn lúc cúi.

## Không làm

- Chế độ ngồi sát máy kiểu selfie. Vision cần thấy cả người, ở nửa mét tay chiếm cả khung.
- Câu báo "lùi ra xa". Câu tìm tay đã có sẵn "Whole body side-on in frame", chỉ bị status tilted che.
- Đổi ngưỡng ngả 12°.

## Kết quả

_(điền khi chạy)_

## Phát sinh

- 2026-10-21 16:01, task 1: harness đã in `mũi (x, y)`. Chạy trên `s09`–`s14` (giây 16–21, khung quay màn 1320x2868, code chọn người cũ). Năm khung chọn người áo đen: `s09 (0.61, 0.58)`, `s10 (0.61, 0.58)`, `s12 (0.59, 0.58)`, `s13 (0.58, 0.58)`, `s14 (0.58, 0.58)`, đã đánh dấu lên ảnh để đối chiếu. Riêng `s11 (0.60, 0.47)` chọn anh, trong khi ở khung đó app lại vẽ lên người áo đen. Xong khi ghi "cả 6", thực tế 5/6, nên chưa tick, chờ anh quyết. Khung giây 11 cho thấy cách chọn theo tay rõ nhất nhảy qua lại giữa hai người ngay trong cùng một cảnh. Harness và app cũng lệch nhau, vì khung quay màn khác buffer camera.
- 2026-10-21 16:08, task 3–4: đã có code (`PoseCoach.swift` `status` phát lại theo `lastTilt`, số làm tròn lên; log `[pose] arm people N shoulder … elbow … wrist … tilt …` in khi sang giây mới của buffer; `PoseFrame.armConfidence` giữ độ tin cậy kể cả dưới ngưỡng). `swiftc -typecheck` bốn file Pose với SDK iOS 16.4 exit 0, `run.sh --synthetic` ra `synthetic ok`. Chưa tick vì "xong khi" của cả hai phải quan sát trên máy, còn `devicectl` báo iPhone `unavailable`. Log có thêm `tilt` ngoài phần task ghi, để lúc kiểm task 3 so được số trên status với độ ngả thật.
- 2026-10-21 16:20, task 4: lần mở màn Stance đầu tiên sau build 16:16, console in 3 dòng `[pose] arm` liền nhau (16:20:04.761, 16:20:05.417, 16:20:06.424, mỗi giây một dòng, `people 0`, tilt 29/22/27), rồi `devicectl` mất kết nối (`CoreDeviceError error 3`, "The connection was invalidated"). Ba giây chưa đủ để tick, phải chạy lại có màn Stance mở lâu hơn. 19:14 `devicectl` vẫn báo iPhone `unavailable`.
- 2026-10-22 00:50, task 4: chạy lại `console5.log`, Stance mở 00:47:05–00:49:45, 162 dòng `[pose] arm` phủ đủ 161 giây liên tục, không giây nào trống. Riêng giây mở màn 00:47:05 có 2 dòng (05.222 là khung đầu vì `lastArmSecond` khởi tạo -1, 05.331 là lúc buffer sang giây mới), từ đó về sau đúng 1 dòng mỗi giây. Chưa tick vì "đúng 1 dòng mỗi giây" lệch ở giây đầu, chờ anh quyết. Cùng lần chạy: tilt ≤ 12° chỉ 3/161 giây, từ 00:47:19 máy ngả 36°, từ 00:48:00 nằm phẳng 89°. Vision thấy người 16/161 giây, không giây nào đủ vai, khuỷu, cổ tay ≥ 0.4 (vai cao nhất 0.41, khuỷu 0.67, cổ tay 0.55). Đây không phải lần chạy Verification vì máy không dựng đứng.
