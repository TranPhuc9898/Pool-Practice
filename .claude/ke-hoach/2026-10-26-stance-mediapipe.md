# Stance Check dò khớp bằng MediaPipe thay Vision — 2026-10-26

**Xong là:** trên 01.thanggg12, đứng tư thế stance sát camera trước, nét cẳng tay vàng bám tay cơ, không vẽ tay sau, đánh 5 cú khan thì app đếm đủ 5.
**Cách làm:** PoseLandmarker (model lite, chế độ VIDEO, `numPoses 1`) chạy đồng bộ trên hàng capture, thay đúng chỗ `VNImageRequestHandler` trong `PoseCoach.swift`, rồi đổ ra `PoseFrame` như cũ. Lý do: đo trên 103 khung thật, MediaPipe thấy cổ tay ở 81/103 khung, Vision chỉ 13/103 (`plans/reports/research-261026-1547-vision-vs-mediapipe-cang-tay.md`). Giữ `PoseFrame` thì `PoseStroke`/`PoseRear`/harness không phải viết lại.
**Đánh đổi:**
- Phân tích clip (`PoseClip`) vẫn chạy Vision, nên số đo trên clip và lúc live có thể lệch nhau. Chấp nhận để plan gọn.
- App nặng thêm framework MediaPipe cộng ~6 MB model.
**Không làm:**
- Không đổi `PoseClip`.
- Không dùng model full/heavy.
- Không vẽ bàn tay hay mặt.
- Không đụng plan `2026-10-21-stance-nhan-tay-khong-nong.md`.
- Không làm Android.

## Bước

- [x] 1. Dò pod: thêm `s.dependency 'MediaPipeTasksVision', '1.0.0'` và `s.resources` cho `pose_landmarker_lite.task` (lấy cùng file web 0.10.14 đang dùng) vào `modules/pool-table/ios/PoolTable.podspec`, chạy `npx pod-install` → xong khi: build sim Debug 0 error, và `find` trong `PoolTraining.app` ra đúng 1 file `pose_landmarker_lite.task`
  ✓ 2026-10-26 16:2x · `** BUILD SUCCEEDED **` exit 0 · `find` trong app container sim ra `PoolTraining.app/pose_landmarker_lite.task`
- [ ] 2. Lát xuyên (cần 1): tạo `modules/pool-table/ios/Pose/PoseLandmarks.swift` với `PoseFrame.init(landmarks:…)`.
  - Toạ độ: đổi từ gốc trên trái về gốc dưới trái, rồi `unrotate`.
  - Lấy visibility làm confidence, map đủ 12 `joints`.
  - `PoseCoach.swift` gọi `detect(videoFrame:timestampInMilliseconds:)` thay cho Vision, log thêm ms mỗi khung vào dòng `[pose] arm`.
  - → xong khi: build Release lên máy, `idevicesyslog` 30 s lúc đứng stance có ≥ 2/3 số dòng `wrist` ≥ 0.5, và nét cẳng tay trên màn hình nằm dọc cẳng tay
- [ ] 3. Đo tốc độ trên máy (cần 2) → xong khi: 60 s log cho trung vị ms ≤ 30. Nếu vượt thì chạy detect cách một khung, đo lại cho tới khi đạt, ghi số chốt vào Phát sinh
- [ ] 4. Bỏ tay sau trong `modules/pool-table/ios/Pose/PoseCoachView.swift`: chỉ vẽ tay cơ, một chấm khuỷu, một nhãn góc → xong khi: trên máy giơ tay kia lên mà màn hình không hiện nét vàng thứ hai
- [ ] 5. Hiệu chỉnh ngưỡng (cần 2):
  - `PoseStroke.minConfidence` và tích confidence trong `PoseRear.swift:64` theo phân bố visibility đo ở bước 2.
  - Clip vẫn dùng Vision nên tách ngưỡng live khỏi ngưỡng clip.
  - → xong khi: `sh scripts/pose-harness/run.sh --synthetic` in đủ 7 ca `ok` và `synthetic ok`, trên máy 5 cú khan đếm đủ 5
- [ ] 6. Chốt (cần 1–5): đọc diff, kiểm cả repo → xong khi: `npx tsc --noEmit` và `npx expo lint` exit 0, build Release 0 error, anh xác nhận trên máy

## Vỡ ở đâu

- MediaPipe là xcframework tĩnh kèm `MediaPipeTasksCommon`. Đặt dưới `static_framework` của module Expo 57 có thể lỗi link hoặc thiếu symbol → kiểm bằng: build sim ở bước 1, chưa đụng code Swift nào
- Trái/phải: MediaPipe tính theo người trong hình, còn camera trước bị mirror → kiểm bằng: ở bước 2 giơ riêng tay cơ, nét vàng phải đi theo đúng tay đó
- Chế độ VIDEO đòi timestamp tăng ngặt, khung trùng ms thì throw và bị `try?` nuốt im → kiểm bằng: đếm số khung lỗi trong log bước 2, phải bằng 0

## Phát sinh
- **Bước 1:**
  - `npx pod-install` vỡ vì CocoaPods dưới Ruby 4 lỗi encoding. Chạy `LANG=en_US.UTF-8 pod install` trong `ios/` thì qua.
  - Build sim Debug lỗi link thiếu symbol React (`RCTPackagerConnection`). Bỏ MediaPipe ra vẫn lỗi y hệt, nên lỗi không do pod mới. Nguyên nhân: sau `pod install`, `React-Core-prebuilt` nằm ở flavor Release, trong khi script đổi flavor thấy không có build trước thì cứ coi là Debug. Gỡ bằng cách build sim Release một lần, sau đó Debug qua.
  - MediaPipe 1.0.0 đòi iOS 15, module đang đặt 16.4. `MediaPipeTasksCommon` tự thêm `-force_load` vào target app.
  - Model `pose_landmarker_lite.task` nặng 5 777 746 byte, sha256 `59929e1d…574a`.
  - Hook chặn đường dẫn có chữ "build", nên `find` chạy trong app container của sim sau `simctl install`.
- **Bước 2:**
  - `detect` chỉ nhận `32BGRA`, nên output camera đổi từ `420YpCbCr` sang BGRA. Reader của clip (`PoseClip`, `PoseCue`) vẫn để YUV.
  - Thêm file Swift mới phải chạy lại `pod install` thì project Pods mới thấy file.
  - Header không nói landmark trả về theo hệ toạ độ nào. Code đang giả định là buffer gốc, gốc trên trái, nên không gọi `unrotate`. Log `[pose] arm` có thêm `head`: góc vai→mũi so với hướng lên, gần 0 là giả định đúng. Còn chờ kiểm trên máy.
  - Không còn dùng `PoseLock` vì `numPoses 1`. PoseClip vẫn dùng `PoseLock`.
  - Build sim Debug: `** BUILD SUCCEEDED **`. Máy báo `tunnelState: unavailable`, chưa build Release lên máy được.
  - Thu `idevicesyslog` 150 s được 0 dòng `[pose] arm`. Chưa biết vì sao, nghi iOS 27 không đẩy `NSLog` bản Release qua syslog relay. Tiêu chí bước 2 cần số này nên chưa tick.
  - Video anh quay 17:03: khuỷu nhảy giữa hai khung liền nhau, góc đổi 93° → 151° → 110° → 62° → 30°. Lúc đó máy nằm thấp quay lên, tay cơ chĩa vào ống kính nên khuỷu bị che. Lúc đứng thẳng thì nét ổn. One Euro beta 0.02 không ghìm được cú nhảy cả trăm pixel.
  - Anh duyệt thêm `BoneGate` trong `PoseCoachView.swift`, ngoài plan: chặn khung tay cơ khi xương vai–khuỷu hoặc khuỷu–cổ tay lệch quá 35% so với trung vị 1 s gần nhất, giữ nét cũ tối đa 0,3 s rồi nhận tư thế mới. Chỉ áp cho lớp vẽ, số đo vẫn lấy điểm thô. Còn chờ clip đặt máy nhìn ngang để biết lỗi do góc máy hay do model.
  - Thu bằng `devicectl --console` lúc 17:28:16–17:28:59 được 44 dòng `[pose] arm`, sau đó app bị tắt. 35/44 dòng thấy người, 12/44 dòng `wrist` ≥ 0.5, trung vị ms 10.5, `err` 0. `head` dao động từ −171 đến 177. Chưa có clip nên chưa biết dòng nào là lúc đứng stance, nên chưa tick.
- **Bước 4:** anh yêu cầu thêm ngày 27/10: xoá layer `body` (đường bạc vai, thân, chân) trong `PoseCoachView.swift`. Giờ chỉ còn tay cơ, chấm khuỷu, nhãn góc và dây dọi.
- **Bước 4:** làm cùng lúc với `BoneGate`. Build Release `generic/platform=iOS` ra `** BUILD SUCCEEDED **`. Máy `unavailable` nên chưa cài, chưa kiểm được tiêu chí.
