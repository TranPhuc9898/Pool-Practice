---
title: Mọi drill theo chuẩn drill 31, Play chạy chuỗi bi
status: pending
created: 2026-10-20
---

# Mọi drill theo chuẩn drill 31, Play chạy chuỗi bi

## Bối cảnh

Chuẩn: `docs/chuan-drill.md`, mẫu gốc drill 31. Kiểm kê 81 drill ngày 2026-10-20 (transpile `DRILLS`, gate `NO_PLAN` ở `src/app/drill/[id].tsx:69`):

| Nhóm | Drill | Số |
|---|---|---|
| Đã chuỗi đúng chuẩn | 12, 15, 18, 19, 20, 23, 31 | 7 |
| Nhiều bi, Play chỉ một cú hoặc solver tự chọn | 10, 13, 14, 16, 17, 34, 35, 40, 42, 43, 46, 49 | 12 |
| Một bi, có Play | 1–9, 11, 21, 22, 24, 25, 26, 32, 33, 36–39, 41, 44, 45, 50–56 | 31 |
| Không có Play (`NO_PLAN`: bank, break, combo, safety, kick, jump, masse, test) | 27–30, 47, 48, 57–81 | 31 |

## Xong là

- `scripts/drill-lint` in 0 vi phạm trên cả 81 drill.
- Mọi drill có Play. Drill nhiều bi bấm Play liên tiếp từ cú 1 tới cú cuối, card về `N/N`.
- `npx tsc --noEmit` và `npx expo lint` exit 0.

## Không làm

- Không thêm màn, component hay layout mới. Chỉ dùng màn drill hiện có.
- Không đổi số round của drill đã có attempt mà chưa có cách giữ lịch sử (xem Vỡ ở đâu).
- Không hiệu chỉnh engine bằng số đo bàn thật. Việc đó thuộc plan hiệu chỉnh engine riêng.

## Bước

- [ ] 1. `scripts/drill-lint/` đọc `DRILLS`, kiểm mục 2–5 của chuẩn, in bảng vi phạm theo drill → xong khi: 7 drill nhóm "đã chuẩn" ra 0 vi phạm, mỗi drill còn lại in lý do từng dòng, tổng số vi phạm ghi vào Phát sinh làm mốc
- [ ] 2. Card và guide đồng nhất: tiêu đề `SHOT i/N · SPIN` cho cả `shots` lẫn `rounds`, ô Aim và Thickness luôn có cú → xong khi: ảnh sim drill 12 và 31 cùng khuôn card
- [ ] 3. Native `FixedShot` nhận tipX khác 0 (phê ngang), harness `scripts/position-harness/` cùng đổi → xong khi: harness chạy lại drill 12, 15, 23 ra đúng rate cũ, drill thử có tipX ra rate in được
- [ ] 4. Đường vẽ tay: `CueReplay` thêm đường bi mục tiêu tuỳ chọn, Play diễn khi có, `NO_PLAN` bỏ cho drill đã có đường → xong khi: một drill bank (27) Play được trên sim, ảnh thấy bi đi qua băng vào lỗ
- [ ] 5. 12 drill nhiều bi (nhóm 2) sang chuỗi `shots` qua harness, hoặc `rounds` + replay khi engine không ra → xong khi: lint 0 vi phạm cho nhóm này, rate từng cú ghi trong file (cần 1, 3)
- [ ] 6. 31 drill một bi (nhóm 3) qua lint, sửa thiếu sót → xong khi: lint 0 vi phạm cho nhóm này (cần 1, 2)
- [ ] 7. 31 drill không Play (nhóm 4): engine trước, không ra thì vẽ tay → xong khi: lint 0 vi phạm, `NO_PLAN` xoá khỏi `src/app/drill/[id].tsx` (cần 4)
- [ ] 8. Simulator: script AXe mở từng drill, Play tới cú cuối, chụp ảnh khung cuối → xong khi: 81/81 drill card về `N/N`, ảnh lưu trong scratchpad (cần 5, 6, 7)

## Phát sinh

- 2026-10-21 đối chiếu: bảng Bối cảnh lệch repo. Nhóm không Play thật là 32 drill (thêm 45), và từ commit 37341c2 cả 81 drill đã có Play qua `DrillShotPlanner` (engine dò cú), không qua đường vẽ tay. `NO_PLAN` còn ở `src/app/drill/[id].tsx:69` nhưng chỉ dùng chọn đích. Giả định của bước 4 và 7 đã đổi, bước 1 không ảnh hưởng.
- 2026-10-21 bước 1 chạy lần đầu `sh scripts/drill-lint/run.sh`: tổng 245 vi phạm, 3 drill đạt (12, 23, 25). Trong 7 drill "đã chuẩn" có 5 drill vi phạm: 15 (subtitle mục 5), 18, 19, 20 (cú engine thiếu zone, subtitle mục 5), 31 (không cú nào có câu vì sao, `DrillRound` không có field `why`). Chưa tick bước 1, chờ anh quyết.

## Vỡ ở đâu

- Round suy từ thứ tự cú trong attempt log (`types.ts`, chú thích `DrillRound`). Chuyển drill từ `rounds` sang `shots` hay đổi số round sẽ lệch lịch sử tập. Trước bước 5, kiểm drill nào đã có attempt, chọn cách giữ hay chấp nhận reset, hỏi anh.
- Break (29, 30, 70, 71) cần chín bi cùng chạy. Chưa biết `ShotPhysics` có giải va chạm nhiều bi không. Kiểm ở bước 7 trước khi chọn engine hay vẽ tay.
- Nhảy và massé (72, 73) chắc chắn phải vẽ tay. Play khi đó là minh hoạ, không phải mô phỏng.
- Safety và kick không có lỗ đích. Play chạy tới chỗ bi dừng, "vào sạch" đổi thành "dừng trong zone".
