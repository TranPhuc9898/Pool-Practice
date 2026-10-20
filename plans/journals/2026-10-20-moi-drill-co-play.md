---
title: Việc ngày 2026-10-20, mọi drill có Play
date: 2026-10-20
summary: "Drill 12 chuỗi 4 cú, chuẩn drill theo drill 31, 81/81 drill có nút Play và 32 drill mới bật đều chạy cú"
---

# Việc ngày 2026-10-20, mọi drill có Play

## What happened
- Drill 31: Play diễn lại đường bi cái từ video eJldkCO6TeA, bàn không chớp khi chuyển cú (journal riêng cùng ngày).
- Thêm 50 drill 32–81, đánh lại số khớp app. Home pill Position Play mở cả 34 drill (`/area/positionPlay?with=patterns`), màn khu gộp nhóm thành section.
- Drill 12 Line of Balls: sửa thứ tự bi, Play chạy chuỗi 4 cú, bi cái dừng đâu đánh tiếp từ đó. Đã quay video trên simulator.
- Chuẩn drill: `docs/chuan-drill.md` lấy drill 31 làm mẫu. Plan `plans/261020-1745-chuan-drill-play-chuoi/` 8 bước, chưa chạy bước nào.
- Mọi drill có Play. Trước đó 49/81, thiếu 32 drill (27–30, 45, 47, 48, 57–81) vì gate `NO_PLAN` ở JS chặn bank, break, combo, safety, kick, jump, masse, test.
  - `modules/pool-table/ios/Editor/DrillShotPlanner.swift` mới: ngắm theo guide của drill, dò hướng cơ quanh đó bằng `ShotPhysics` tới khi cú đạt yêu cầu bài. Không dò ra thì vẫn đánh hướng danh nghĩa, `pass` false để Play báo trượt.
  - `PoolShotReplay.swift`: `ShotReplay.pass`, `playDrill` dò ở queue nền rồi diễn trên main.
  - `src/app/drill/[id].tsx`: Play hiện khi có cú và không phải bàn legacy. `NO_PLAN` chỉ còn dùng để chọn đích.

## Kiểm
- Harness dò cú: 88/89 trường hợp đạt. Trượt duy nhất là drill 69 round 5.
- AXe mở cả 81 drill: 81/81 có nút "Play shot".
- 32 drill mới bật: quay video từng drill, bấm Play, cả 32 thấy bi chạy (bank vào lỗ, break bung rack, combo, safety, kick, nhảy, massé cong).
- 49 drill có Play từ trước: đang chụp trước/sau Play để soát hồi quy, chưa xong lúc ghi.
- `npx tsc --noEmit` và `npx expo lint` exit 0.

## Decision
- Dò hướng trong engine thay vì vẽ tay. Cú nào engine không ra thì Play báo trượt thật, không giả vào lỗ.
- Bank thử lực tăng dần tới 5 m/s vì băng của engine chưa hiệu chỉnh.

## Pitfalls
- File Swift mới phải `cd ios && pod install`, không thì build báo "cannot find 'DrillShotPlanner' in scope".
- Mở drill liên tục bằng deep link chồng màn lên stack. Sau khoảng 110 màn, app ăn 99% CPU, AXe mất 26 s mỗi lệnh. Khởi động lại app giữa các lần mở.

## Còn hở
- Drill 69 round 5 engine không ra cú đạt, Play báo trượt.
- Một số bank đánh mạnh hơn lực của drill (67 r3, 68 r4–6, 69 r3, r5). Break đánh lực phóng to.
- Nhảy bỏ qua bi chắn, massé chỉ gần đúng. Safety "đạt" chỉ nghĩa là chạm hợp lệ, không rơi bi cái, đường sạch. Phê ngang chưa có swerve.
- 12 drill nhiều bi (10, 13, 14, 16, 17, 34, 35, 40, 42, 43, 46, 49) chưa chạy chuỗi, là bước 5 của plan.
- Drill theo round bấm Play xong bàn về thế đầu round, card không sang round kế.
- Subtitle mục 5 của `docs/chuan-drill.md` chưa thêm vào drill nào.

## Next steps
- Chạy plan `261020-1745-chuan-drill-play-chuoi` từ bước 1 (drill-lint).
