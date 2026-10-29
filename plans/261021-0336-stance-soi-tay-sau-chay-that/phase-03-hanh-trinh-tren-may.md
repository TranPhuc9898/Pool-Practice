---
phase: 3
title: "Hành trình trên máy"
status: pending
priority: P1
effort: "1h"
dependencies: [1, 2, 4]
---

# Phase 3: Hành trình trên máy

## Goal

Một bản ghi màn hình iPhone cho thấy hành trình thật đi đúng thứ tự như bản mô phỏng, từ lúc cài mới tới Scoreboard, kèm nhánh từ chối quyền. Không sửa code ở phase này. Mốc nào trượt thì ghi vào Kết quả và quay lại phase gây ra.

## Files

- Không sửa file nào. Đọc chữ trạng thái ở `src/app/stance.tsx:35–51` để so với bản ghi.

## Tasks

- [ ] 1. Xoá app khỏi iPhone để quyền camera về trạng thái chưa hỏi. `npx expo run:ios --device`.
- [ ] 2. Bật quay màn hình iOS (Control Center), máy lên chân máy theo tip trong màn, mở Stance Check.
- [ ] 3. Đi hết kịch bản bên dưới với Front camera (mặc định), dừng quay, chép bảng mốc vào Kết quả.
- [ ] 4. Bấm Back camera, quay lại mốc 2–7 với máy đặt cùng chỗ, chép bảng mốc riêng.
- [ ] 5. Settings › Pool Training › Camera tắt, mở lại Stance Check, quay nhánh từ chối.

## Verification

Xong khi bản ghi cho thấy, đúng thứ tự:

1. Alert xin quyền camera có dòng usage string ở `app.json:14` ("Stance Check uses the camera to watch your cue arm…").
2. "Looking for your cue arm. Whole body side-on in frame."
3. Bước vào khung: "Arm found. Get down on the shot · forearm …".
4. Đứng buông thõng tay cơ: tay vàng. Nâng cẳng tay ngang: tay trắng.
5. Cúi vào cú, đứng yên: "Address · forearm …".
6. Cú cẳng tay dựng đứng: Scoreboard dòng 01, phán xử không phải "Forearm forward/back at contact".
7. Cú khuỷu lùi ra sau rõ: dòng 02 "Forearm forward at contact".
8. Nhánh từ chối: "Camera access is off." và nút Open Settings mở đúng trang Settings của app.

Mốc 1 và 8 chỉ cần một lần. Mốc 2–7 phải đạt trên cả hai camera.

Góc address trên máy (mốc 5) lệch góc harness in cho cùng tư thế và cùng camera ở phase 1 không quá 5°. Lệch hơn thì ghi vào Kết quả: clip app Camera không đại diện buffer của app.

## Rủi ro

- Quay màn hình iOS ăn CPU, đẩy nhiệt, làm Vision trễ khung → mốc 5 vào chậm. Chấp nhận, ghi độ trễ nếu thấy, không đo nhiệt ở đây.

## Kết quả

_(điền khi chạy)_
