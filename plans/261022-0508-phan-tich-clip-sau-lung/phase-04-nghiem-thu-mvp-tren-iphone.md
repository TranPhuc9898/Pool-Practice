---
phase: 4
title: "Nghiệm thu MVP trên iPhone"
status: pending
priority: P1
effort: "2h"
dependencies: [3]
---

# Phase 4: Nghiệm thu MVP trên iPhone

## Goal

Cổng của prompt: chưa qua phase này thì không sang phase 5. Anh cầm máy, em ghi số.

## Files

- Sửa `modules/pool-table/ios/Pose/PoseClip.swift`: `Logger` in `[clip] analyzed N frames in X s, arm Y%` khi xong một lượt.
- Không file nào khác, trừ khi phải sửa lỗi phát hiện ở đây.

## Tasks

- [ ] 1. Tốc độ: R1 cắt còn 30 s, phân tích trên máy, ghi thời gian từ log. Trong lúc chạy, kéo thanh tua và bấm từng khung, UI không đứng.
- [ ] 2. Huỷ: bấm back giữa lượt, log không in dòng `analyzed`, Xcode › Debug Navigator thấy CPU về mức nghỉ trong 2 s.
- [ ] 3. Khớp đúng chỗ: chọn ngẫu nhiên 10 khung của R1 (`jot -r 10 0 <số khung>`), anh nhìn overlay từng khung. Đếm khung có khuỷu và cổ tay nằm trên khớp thật.
- [ ] 4. Khớp với harness: cùng R1, % khung thấy tay trong log app bằng số harness in ra.
- [ ] 5. Tay trái: R1 lật ngang bằng `ffmpeg -vf hflip`, chọn tay trái, overlay vẫn bám tay cơ, dấu lệch ngang đảo đúng.
- [ ] 6. Xoay khung: một clip quay dọc, overlay không lệch, không méo tỉ lệ.
- [ ] 7. R2: năm cú cuối có độ lệch ngang cổ tay so với trục khác rõ năm cú đầu. Ghi trung vị hai nhóm.

## Verification

- Bước 1: 30 s clip 60 fps phân tích xong trong ≤ 90 s. Ngưỡng này là đoán, ghi số thật vào Kết quả kể cả khi đạt.
- Bước 3: ≥ 8/10 khung đúng.
- Bước 4: chênh ≤ 1 điểm %.
- Bước 5, 6: đạt bằng mắt, có ảnh chụp màn hình.
- Bước 7 chỉ ghi số, không chặn cổng. Không thấy khác biệt thì ghi vào Phát sinh cho phase 5.

## Kết quả

_Chưa chạy. Cổng nghiệm thu cần anh cầm iPhone và clip R1, R2._
