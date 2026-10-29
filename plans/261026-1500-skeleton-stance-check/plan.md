---
title: Stance Check vẽ skeleton từ vai xuống như demo web
description: Overlay camera vẽ đủ hai tay, thân, chân, chấm khuỷu kèm góc, lọc rung One Euro. Không vẽ mặt. Logic chấm cú giữ nguyên.
status: in-progress
priority: P2
branch: feat/pool-editor
created: 2026-10-26
---

# Stance Check vẽ skeleton từ vai xuống như demo web

## Bối cảnh

Ngày 26/10 anh duyệt demo web (MediaPipe lite, scratchpad `pose-demo/index.html`). Demo vẽ hai tay đậm, khuỷu là chấm xanh kèm góc, thân và chân là nét trắng mờ, không có mặt hay ngón tay, có One Euro chống rung. Đã đọc code, hiện app đang như sau:

- `PoseFrame.init(observations:…)` (`modules/pool-table/ios/Pose/PoseFrame.swift:140`) chỉ lấy tay và chân phía `side`, cộng `nose`. Tay còn lại và nửa người còn lại bị bỏ.
- `PoseCameraUIView.draw` (`PoseCoachView.swift:118`) vẽ ba layer: `arm` (màu theo `ok`: xanh, đỏ, trắng), `leg` trắng 50%, `plumb` đứt nét. Không có chấm khớp, không có góc.
- `PoseFilter`/`PointFilter` (`PoseFilter.swift`) là lọc trung vị cửa sổ 5 khung, dùng cho đo. Mỗi khung nil là xoá cửa sổ.
- Harness `scripts/pose-harness/run.sh` biên dịch chung `PoseFrame.swift`, nên thêm trường vào `PoseFrame` sẽ chạm tới harness.

## Xong là

- Trên iPhone thật, camera trước: overlay vẽ hai vai, hai khuỷu, hai cổ tay, hông, gối, cổ chân hai bên. Không vẽ mặt.
- Khuỷu tay cơ có chấm và nhãn góc vai–khuỷu–cổ tay. Tay cơ vẫn đổi màu xanh, đỏ, trắng theo `ok` như hiện tại. Dây dọi giữ nguyên.
- Nét không rung khi đứng yên, và không trễ thấy rõ khi vung tay. Anh xác nhận bằng mắt trên máy.
- `sh scripts/pose-harness/run.sh --synthetic` vẫn in `synthetic ok`. Build Release 0 error.

## Không làm

- Không đổi số đo, `PoseStroke`, `PoseLimits`, giọng nói, `state`, event gửi JS.
- Không đổi `src/app/stance.tsx` hay UI quanh camera. Chỉ đổi lớp vẽ trên preview.
- Không thêm bàn tay (`VNDetectHumanHandPoseRequest`), không thêm MediaPipe vào app.
- Không đụng plan `.claude/ke-hoach/2026-10-21-stance-nhan-tay-khong-nong.md`. Plan đó vẫn chưa chạy.

## Bước

- [x] 1. `PoseFrame` thêm `joints: [PoseJoint: CGPoint]` cho 12 khớp hai bên (vai, khuỷu, cổ tay, hông, gối, cổ chân), lọc cùng `minConfidence`, chỉ dùng để vẽ. Các trường cũ để nguyên, `side` vẫn chọn tay đo → xong khi: `sh scripts/pose-harness/run.sh --synthetic` in `synthetic ok`, output không đổi dòng nào so với trước khi sửa
- [x] 2. `PoseCoachView.swift`: layer `body` vẽ thân, chân và tay còn lại bằng trắng mờ. Thêm layer `joint` vẽ chấm vai, cổ tay, khuỷu, và `CATextLayer` ghi góc khuỷu tay cơ. One Euro viết ngay trong file, áp cho điểm vẽ, không áp cho số đo. Khớp mất quá 0,3 s thì reset bộ lọc (cần 1) → xong khi: build sim 0 error, `npx tsc --noEmit` và `npx expo lint` exit 0
- [ ] 3. Build Release lên 01.thanggg12, anh mở Stance Check camera trước giơ hai tay, cúi vào tư thế (cần 2, cần máy online) → xong khi: anh xác nhận nét bám tay, không có mặt. Ghi tham số One Euro chốt cuối vào Phát sinh

## Vỡ ở đâu

- Sim không có camera nên bước 2 chỉ kiểm được là build qua, không xem được nét. Mọi kiểm bằng mắt dồn vào bước 3.
- Vision gán nhầm trái/phải khi người quay nghiêng 90° → tay còn lại vẽ chồng lên tay cơ. Kiểm ở bước 3: đứng nghiêng như lúc đánh thật. Nếu chồng thì bỏ tay còn lại, chỉ giữ thân và chân.
- One Euro với `minCutoff` quá thấp làm nét trễ sau tay. Demo dùng `minCut 1.2, beta 0.02` trên toạ độ pixel 640. App đo pixel buffer 640×480 nên lấy y vậy, sai thì chỉnh ở bước 3.
- Góc khuỷu đọc trên ảnh 2D. Máy không vuông góc với mặt phẳng tay thì số lệch so với góc thật. Nhãn chỉ để người chơi nhìn, không đưa vào đo.

## Phát sinh
- **Bước 1:** tiêu chí "output không đổi dòng nào" không kiểm được. Synthetic thêm nhiễu bằng `SystemRandomNumberGenerator` không seed (`scripts/pose-harness/main.swift:547`), nên hai lần chạy cùng một code cũng ra số khác. Kiểm thay bằng: trước và sau khi sửa, cả 7 ca đều `ok` và in `synthetic ok`. `PoseFrame` thêm `side` để lớp vẽ biết tay nào là tay cơ.
- **Bước 2:** `leg` đổi tên thành `body`, vẽ hai vai, hai hông, hai chân và tay kia. Dây dọi giờ lấy khuỷu và cổ tay đã lọc, còn màu `ok` vẫn tính từ điểm thô. Chấm khuỷu tô cùng màu tay cơ, có viền trắng. Build sim Debug 0 error, `tsc` và `expo lint` exit 0. Sim không có camera nên chưa thấy nét.
- **Bước 3 (26/10 15:31):** build Release lên 01.thanggg12 xong, 0 error, 9 warning. App đã cài và launch. Chờ anh xác nhận nét trên máy.
- **Bước 3, đổi phối màu (26/10):** anh thấy chưa giống web, nên vẽ lại theo web 1:1. Cả hai tay màu gold `#e9b949`, dày 7. Chấm vai và cổ tay gold, r6. Cả hai khuỷu có vòng trắng r11, chấm xanh `#3ccf7a` r8, kèm nhãn góc. Thân và chân trắng 0.45, dày 3, không vẽ tay kia trong `body` nữa. Màu `ok` không còn tô tay cơ mà chuyển sang dây dọi: xanh khi trong dung sai, đỏ khi lệch, trắng khi chưa chấm. Mục "tay cơ vẫn đổi màu theo `ok`" ở Xong là vì vậy không còn đúng. Build sim 0 error, build Release lên máy 0 error, 9 warning, đã launch.
- **Đảo non-goal MediaPipe (26/10):** anh thấy cẳng tay vẫn lệch và tay sau vẽ sai. Đo lại thì lỗi nằm ở Vision chứ không phải ở lớp vẽ (`plans/reports/research-261026-1547-vision-vs-mediapipe-cang-tay.md`). Anh duyệt đổi sang MediaPipe. Mục "không thêm MediaPipe vào app" bỏ. Phần đổi model và bỏ tay sau làm ở `.claude/ke-hoach/2026-10-26-stance-mediapipe.md`. Bước 3 của plan này xác nhận chung với plan đó.
