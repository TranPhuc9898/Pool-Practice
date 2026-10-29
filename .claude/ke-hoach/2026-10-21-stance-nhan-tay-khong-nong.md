# Stance Check nhận tay ổn định, không nóng máy — 2026-10-21

**Xong là:** `sh scripts/pose-harness/run.sh` trên clip A (áo sáng) và B (áo tối), mỗi clip 10 cú cúi liên tục, in `cú 10`, thấy tay ≥ 90%, `nhảy 0`, `rung ≤ 2°`; và Stance Check chạy 20 phút trên iPhone đặt chân máy, dòng `pose-perf` cuối trong Console.app báo thermal `nominal` hoặc `fair`.
**Cách làm:** đo trước rồi mới sửa: log hiệu năng trên máy và dòng chẩn đoán trong harness cho baseline, sửa nhận tay trong `PoseFrame`/`PoseStroke` (harness chạy được trên Mac), rồi cho Vision chạy theo nhịp trạng thái và hạ capture khi `systemPressureState` lên `serious` — vì chưa có clip thật nào nên sửa nhận tay bây giờ là đoán, còn Vision đang chạy đủ 30 khung/giây kể cả khi không có ai trong khung.
**Đánh đổi:** chấp nhận vào address trễ thêm tối đa ~0,2 s, overlay cập nhật thưa lúc chưa cúi, và khi máy nóng thì pause đo thưa còn 67 ms/khung, để Vision chạy ít đi phần lớn buổi tập. Bước 1, 3, 6, 7 cần anh cầm máy thật, em không tự làm được.
**Không làm:** phát tiếng (kể cả câu báo setup); dim màn hình hay đổi idle timer; đổi capture 720p; đổi ngưỡng `PoseLimits`; đổi UI hay `src/app/stance.tsx`; phần vào bộ (report `0911`); interruption và giọng `vi-VN` (report `0926`).

## Bước

- [ ] 1. Log `pose-perf` mỗi 10 s qua `Logger` trong `modules/pool-table/ios/Pose/PoseCoach.swift`: Vision/s, ms mỗi lần Vision, % khung thấy tay, % thời gian theo state, số lần lật `ready↔searching`, `thermalState`, `systemPressureState` → xong khi: `npx expo run:ios --device`, mở Stance Check 10 phút (10 cú, còn lại đi quanh bàn), Console.app lọc `pose-perf` ra một dòng mỗi 10 s đủ 7 trường; dòng phút 10 chép vào Phát sinh làm baseline.
- [ ] 2. Dòng chẩn đoán trong `scripts/pose-harness/main.swift`: % khung thiếu vai / khuỷu / cổ tay; `nhảy` = số khung cẳng tay đổi > 25° so với khung liền trước; `rung` = trung vị |Δ cẳng tay| giữa hai khung liền lúc address → xong khi: `sh scripts/pose-harness/run.sh --synthetic` vẫn in `synthetic ok`, chạy một clip bất kỳ in thêm dòng `thiếu … nhảy … rung …`.
- [ ] 3. Anh quay 3 clip bằng app Camera (Settings › Camera › Record Video = 720p HD at 30 fps, không có thì 1080p 30 fps), đặt máy theo tip trong màn: A 10 cú áo sáng, B 10 cú áo tối, C 1 phút đi quanh bàn rồi 5 cú; chạy `scripts/pose-harness/run.sh` mỗi clip ở `--fps` 30, 15, 10, 5 (cần 2) → xong khi: bảng 3 clip × 4 nhịp (thấy tay, cú, nhảy, rung, khớp thiếu nhiều nhất) nằm trong Phát sinh.
- [ ] 4. Sửa nhóm lỗi bước 3 chỉ ra nhiều nhất: chọn người và nhãn trái/phải trong `modules/pool-table/ios/Pose/PoseFrame.swift`, hoặc làm mượt khớp trong `modules/pool-table/ios/Pose/PoseStroke.swift`; bước 3 đã đạt thì tick kèm số (cần 3) → xong khi: clip A, B đạt đúng ngưỡng ở dòng **Xong là**, clip C vẫn in `cú 5`.
- [ ] 5. Hàm nhịp Vision theo phase của tracker (không theo `hasArm` từng khung) trong `PoseStroke.swift`, harness thêm cờ `--adaptive` dùng hàm đó (cần 4) → xong khi: `run.sh` clip A, B, C với `--adaptive` ra cùng số cú như bản 30 fps, và clip C in số lần chạy Vision ≤ 50% bản 30 fps.
- [ ] 6. `PoseCoach.swift` bỏ khung theo hàm nhịp; KVO `systemPressureState`, từ `serious` đặt `activeVideoMinFrameDuration` 1/15, về `fair` trả 1/30 (cần 1, 5) → xong khi: trên máy, `pose-perf` lúc đứng ngoài khung báo ≤ 6 Vision/s, lúc đang đánh ≥ 25/s; Xcode › Devices › Device Conditions › Thermal State = Serious thì trong 10 s log báo capture 15 fps, tắt thì về 30 (không đổi được `systemPressureState` thì nghe thêm `thermalStateDidChangeNotification`).
- [ ] 7. Chạy 20 phút trên chân máy như bước 1, đọc log `pose-perf` từ `PoseCoach.swift` (cần 6) → xong khi: dòng phút 20 báo thermal `nominal`/`fair`, Vision/s trung bình thấp hơn baseline bước 1, 10 cú đầu ra 10 dòng trên Scoreboard.

## Vỡ ở đâu

- Clip app Camera (HDR, ổn định hình) khác buffer 720p của app nên số harness lệch số thật → kiểm bằng: so % thấy tay clip A với trường `% khung thấy tay` của log bước 1 lúc đánh 10 cú, lệch quá 10 điểm thì quay lại clip trong app.
- Một khung mất tay giữa cú làm nhịp rơi về thưa và mất cú → kiểm bằng: bước 5 phải ra đủ 10 cú ở clip A, B với `--adaptive`.
- Nóng đến từ màn hình và camera chứ không từ Vision → kiểm bằng: bước 7 lên `serious` trong khi phần lớn dòng log ≤ 6 Vision/s thì dừng, ghi Phát sinh, mở plan riêng cho độ sáng màn.

## Phát sinh
