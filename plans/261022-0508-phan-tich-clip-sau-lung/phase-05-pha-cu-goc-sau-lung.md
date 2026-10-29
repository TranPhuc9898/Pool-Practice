---
phase: 5
title: "Pha cú góc sau lưng"
status: in-progress
priority: P2
effort: "1.5d"
dependencies: [4]
---

# Phase 5: Pha cú góc sau lưng

## Goal

Tự chia clip thành các cú và pha, với `unknown` khi không đủ bằng chứng, và cho anh sửa tay. Làm mượt khớp và tách rung máy khỏi chuyển động thật.

## Điều kiện vào

Đọc mục Kết quả của phase 1. Nếu tỉ số biên độ / rung của cả wrist.y lẫn L đều dưới 3 thì bỏ bước 3, phase này chỉ còn bước 1, 2, 4, 5: pha do anh đánh dấu tay, app tính số trong từng pha.

## Files

- Tạo `modules/pool-table/ios/Pose/PoseFilter.swift`: lọc theo cách của Good-GYM (`exercise_counters.py`, `smooth_angle`): cửa sổ 5 khung, bỏ điểm lệch trung vị quá 2σ, lấy trung bình phần còn lại. Áp riêng từng toạ độ. Khung nil phá cửa sổ, không lấp.
- Tạo `modules/pool-table/ios/Pose/PoseRear.swift`:
  - `enum RearPhase { unknown, address, practice, backswing, pause, forward, follow, complete }`;
  - `RearTracker.push(_ f: PoseFrame, shift: CGVector)` dùng tín hiệu phase 1 chọn, hai ngưỡng có trễ như `up_angle`/`down_angle` của Good-GYM, thời gian ở tối thiểu mỗi pha, và khoảng chặn giữa hai cú như `min_rep_time`. Ngưỡng tính theo rung đo lúc address của chính clip đó (bội số σ), không theo pixel cứng;
  - không có mốc chạm bi: `follow` bắt đầu khi cổ tay vượt vị trí address, không gọi đó là lúc chạm;
  - độ tin cậy mỗi khung: tích độ tin cậy khuỷu, cổ tay và tỉ lệ khung có tay trong cửa sổ.
- Sửa `PoseClip.swift`: rung máy đo bằng `VNTranslationalImageRegistrationRequest` giữa hai khung liền, trên một dải ảnh không có người (anh chọn lúc chấm trục, mặc định 20% dưới khung là mặt bàn). Trừ dịch chuyển này khỏi toạ độ khớp trước khi lọc.
- Sửa `PoseClipView.swift` và `src/app/clip.tsx`: dải pha trên thanh tua; chạm giữ một đoạn để đổi pha của nó. Pha sửa tay được ưu tiên hơn pha tự bắt.
- Sửa `scripts/pose-harness/main.swift`: `--rear` in pha từng khung và số cú; `--unit` thêm case.

## Tasks

- [x] 1. `PoseFilter`, case unit: chuỗi có một gai lớn thì gai bị bỏ; chuỗi có nil ở giữa không sinh giá trị cho khung nil.
- [ ] 2. Đo rung máy. Case kiểm trên clip: R1 đặt máy cố định thì dịch chuyển trung vị < 0,5 px; anh gõ nhẹ chân máy trong một clip ngắn thì thấy gai ở đúng lúc gõ.
- [x] 3. `RearTracker` với case synthetic: 3 cú dựng tay có feather trước mỗi cú ra đúng 3 cú, không đếm feather; khung mất tay quá 0,5 s giữa cú ra `unknown` và không đếm cú đó.
- [x] 4. Sửa pha tay trên màn và lưu cùng phiên trong bộ nhớ (lưu đĩa ở phase 7).
- [x] 5. Số đo theo pha: lệch ngang cổ tay lúc address, cuối backswing, đầu follow; dao động khuỷu trong cú; thời gian dừng sau khi pha `pause` thấy được.

## Verification

- `sh scripts/pose-harness/run.sh --unit` in `unit ok`.
- R1 và R2 qua harness: số cú tự bắt bằng 10 ± 1, mỗi cú lệch mốc backswing của phase 1 ≤ 3 khung. Bước 3 bị bỏ thì ghi lý do vào Kết quả.
- Trên máy: sửa pha một đoạn rồi lùi khung qua đó, khối số đo dùng pha đã sửa.

## Kết quả

Bước 1, 3, 4, 5 (2026-10-22):

- Đã viết code: `PoseFilter`, `RearTracker` trong `PoseRear.swift`, sửa pha bằng chạm trên thanh pha, Section Strokes trên màn clip.
- Đã kiểm: `--unit` có case lọc gai, case nil, case 3 cú có feather. `--synthetic` in `synthetic ok`.

Còn treo:

- Bước 2 (rung máy trên clip thật) và verification R1/R2 ±3 khung.
- Ngưỡng của `RearTracker` là đoán. Tín hiệu (`wristY` hay `length`) chờ số của phase 1.

Lệch khỏi plan:

- Sửa pha bằng chạm vào đoạn trên thanh pha để xoay vòng pha, không dùng long-press.
- Dải đo rung là 40% dưới ảnh, không phải 20%. Harness dựng ra dải mỏng hơn khoảng 30% thì Vision trả số lệch hoặc nil.
- `RearTracker` đổi luật:
  - feather chỉ được tính là cú khi có follow;
  - mất tay quá 0,5 s thì cú đó ra `unknown`.
