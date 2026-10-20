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

- [x] 1. `scripts/drill-lint/` đọc `DRILLS`, kiểm mục 2–5 của chuẩn, in bảng vi phạm theo drill → xong khi: 7 drill nhóm "đã chuẩn" ra 0 vi phạm, mỗi drill còn lại in lý do từng dòng, tổng số vi phạm ghi vào Phát sinh làm mốc
  ✓ 2026-10-21 00:30 · `run.sh 12 15 18 19 20 23 31` → "Tổng: 0 vi phạm, 7 drill đạt." exit 0 · `run.sh` cả 81 → "Tổng: 237 vi phạm, 8 drill đạt." · `npx tsc --noEmit` exit 0
- [x] 2. Card và guide đồng nhất: tiêu đề `SHOT i/N · SPIN` cho cả `shots` lẫn `rounds`, ô Aim và Thickness luôn có cú → xong khi: ảnh sim drill 12 và 31 cùng khuôn card
  ✓ 2026-10-21 00:40 · sim: drill 12 "SHOT 1/4 · FOLLOW · 1¼ tip high · Soft 0.8 m/s · 7 of 10", drill 31 "SHOT 1/12 · DRAW · ¾ tip low · ½ tip left · Power 3.2 m/s · 9 of 12", Play xong cú 1 ra "SHOT 2/12 · FOLLOW", ô Aim/Thickness cả ba ảnh đều có cú, câu why dưới card · `npx tsc --noEmit` exit 0 · `npx expo lint` exit 0
- [x] 3. Native `FixedShot` nhận tipX khác 0 (phê ngang), harness `scripts/position-harness/` cùng đổi → xong khi: harness chạy lại drill 12, 15, 23 ra đúng rate cũ, drill thử có tipX ra rate in được
  ✓ 2026-10-21 00:55 · `sh scripts/position-harness/run.sh` exit 0 → 12 rate 32/27/40/33, 15 rate 26/37/45, 23 rate 37/36/45, khớp số trong file drill và bản HEAD · "31 thử shot 1 tipX -0.21 tipY -0.37 speed 3.00 zone(14.0,28.5,5.0) rate=2/45", "31 thử shot 2 tipX +0.07 tipY +0.47 speed 1.35 zone(-) rate=45/45" · `npx tsc --noEmit` exit 0 · `npx expo lint` exit 0
- [ ] 4. Play nhóm 4 dùng `DrillShotPlanner` sẵn có. Đường vẽ tay (`CueReplay` thêm đường bi mục tiêu tuỳ chọn) chỉ làm cho drill engine không ra, dự kiến 72, 73 → xong khi: một drill bank (27) Play được trên sim, ảnh thấy bi đi qua băng vào lỗ
- [ ] 5. 12 drill nhiều bi (nhóm 2) sang chuỗi `shots` qua harness, hoặc `rounds` + replay khi engine không ra → xong khi: lint 0 vi phạm cho nhóm này, rate từng cú ghi trong file (cần 1, 3)
- [ ] 6. 31 drill một bi (nhóm 3) qua lint, sửa thiếu sót → xong khi: lint 0 vi phạm cho nhóm này (cần 1, 2)
- [ ] 7. 31 drill không Play (nhóm 4): engine trước, không ra thì vẽ tay → xong khi: lint 0 vi phạm (cần 4)
- [ ] 8. Simulator: script AXe mở từng drill, Play tới cú cuối, chụp ảnh khung cuối → xong khi: 81/81 drill card về `N/N`, ảnh lưu trong scratchpad (cần 5, 6, 7)

## Phát sinh

- 2026-10-21 đối chiếu: bảng Bối cảnh lệch repo. Nhóm không Play thật là 32 drill (thêm 45), và từ commit 37341c2 cả 81 drill đã có Play qua `DrillShotPlanner` (engine dò cú), không qua đường vẽ tay. `NO_PLAN` còn ở `src/app/drill/[id].tsx:69` nhưng chỉ dùng chọn đích. Giả định của bước 4 và 7 đã đổi, bước 1 không ảnh hưởng.
- 2026-10-21 bước 1 chạy lần đầu `sh scripts/drill-lint/run.sh`: tổng 245 vi phạm, 3 drill đạt (12, 23, 25). Trong 7 drill "đã chuẩn" có 5 drill vi phạm: 15 (subtitle mục 5), 18, 19, 20 (cú engine thiếu zone, subtitle mục 5), 31 (không cú nào có câu vì sao, `DrillRound` không có field `why`). Chưa tick bước 1, chờ anh quyết.
- 2026-10-21 xử 5 drill theo đề xuất trong `plans/journals/2026-10-21-drill-lint-va-viec-con-do.md`, anh bảo "làm tiếp": 15, 18–20 thêm câu subtitle mục 5. Chuẩn mục 3 và lint đổi luật zone thành chỉ bắt khi drill có `cueBallTargetZones`, vì Rail Cut BU chỉ đếm bi vào. `DrillRound` thêm `why`, drill 31 viết 12 câu lấy góc cắt, băng và khoảng cách từ replay.
- 2026-10-21 mốc mới: 237 vi phạm, 8 drill đạt (12, 15, 18, 19, 20, 23, 25, 31). Chia theo lý do: 73 thiếu câu vì sao, 72 thiếu lực m/s, 63 thiếu nguồn đường bi cái, 17 chuỗi mục 4, 10 subtitle vẽ tay, 2 bi cái đặt lại giữa chuỗi.
- 73 lỗi thiếu câu vì sao phần lớn là drill một cú: `PoolDrill` không có field `why`, nên bước 6 sẽ phải thêm field vào type.
- Drill 31 Ball 10: `expectedCuePath` cắt góc ở (0.82, 0.95), không chạm head rail. Replay thì chạm head rail ở mẫu 39 (y lên 0.986 rồi quay đầu). Câu why viết theo replay, đường guide chưa sửa.
- Bước 2: tiêu đề card trước đây lấy `drill.recommendedSpin` cho mọi round, nên drill 31 ghi "Draw" cả ở bốn cú follow 2, 4, 10, 12. Giờ lấy `spin` của round.
- Drill 4, 6, 8, 52 có round mang `zone` mà không dời bàn. Card hiện "Shot i/N · spin" kèm "Tap a target on the table" cho tới khi chạm đích. Drill 8 round 1, 3 và drill 52 round 2, 5 ghi spin draw/follow mà không có `contactPoint`, rơi về tip (0, 0) của drill. Chấm tip đang bị ẩn vì phải chọn đích, nên chưa lộ trên card. Xử ở bước 6.
- Ô Aim/Thickness về "No pocket chosen" khi chạm nỉ bỏ chọn lỗ, và có thể sau cú cuối của drill `rounds`. Kết luận này đọc từ code `PoolShotFigures.swift`, chưa kiểm trên sim.
- Bước 3: harness trong repo chỉ có drill 23. Harness của drill 12 và 15 là bản scratch, đã mất. Dựng lại thành `chain()` dùng chung, ba drill ra đúng rate cũ.
- Bước 3: 45 mẫu giữ hướng cơ bằng `atan2(nom.a)`, mà `nom.a` là hướng bi cái sau squirt, nên mẫu có tipX khác 0 bị squirt hai lần. Sửa bằng cách cộng lại `nom.squirtDeg`. Drill 31 thử: bi 1 từ 0/45 lên 2/45, bi 2 từ 30/45 lên 45/45. Rate của cú tipX 0 không đổi. `sample()` của drill 24, 25, 30 chưa sửa vì tipX danh nghĩa của chúng là 0.
- Drill 31 bi 1 ở lực video 3.2 m/s: bi cái engine đụng bi 6. Ở `playSpeed` 3.0 thì sạch nhưng chỉ 2/45 (34 mẫu trượt lỗ hoặc đụng bi, 9 mẫu ngoài zone). Drill 31 giữ `rounds` + replay.
- `scripts/rack-harness/main.swift` vẫn gán cứng tipX 0 cho drill 18–20. Data ba drill này không có tipX nên chưa sai. Drill nào trong đó thêm tipX thì phải sửa harness này.
- Swift sửa ở bước 3 (`DrillRecord.swift`, `PoolEditorRack.swift`, `PoolEditorView.swift`) chưa compile, vì chưa được bảo build. Trước khi kiểm trên sim hay làm bước 8 phải chạy `npx expo run:ios --device <sim> --no-bundler`.
- Lịch sử attempt nằm trong `attempts.db` (expo-sqlite) trên máy anh. Từ repo không biết được drill nào đã có attempt, nên câu hỏi trước bước 5 phải do anh trả lời.
- 2026-10-21 anh duyệt sửa bước 4 và 7 theo `DrillShotPlanner`. Bản cũ bước 4: "Đường vẽ tay: `CueReplay` thêm đường bi mục tiêu tuỳ chọn, Play diễn khi có, `NO_PLAN` bỏ cho drill đã có đường". Bản cũ xong khi bước 7: "lint 0 vi phạm, `NO_PLAN` xoá khỏi `src/app/drill/[id].tsx`". Vế xoá `NO_PLAN` bị bỏ vì nó đang chặn solver vùng đích (chỉ giải cú pot một bi) nhận target của drill bank, break (`[id].tsx:207`).
- 2026-10-21 anh trả lời câu hỏi trước bước 5: 12 drill nhóm 2 chưa có lịch sử tập đáng giữ, chấp nhận lệch round, không viết migration.
- 2026-10-21 01:55 build native cho Swift bước 3: `npx expo run:ios --device E68CC13C-926C-47B9-BA3D-451EB3E74443 --port 8095` → "Build Succeeded", "0 error(s), and 8 warning(s)", app cài lên sim và nạp bundle từ Metro 8095. Lệnh ghi ở dòng Swift phía trên không chạy được kèm `--port`: "--port and --no-bundler are mutually exclusive arguments". Bỏ `--no-bundler` thì `run:ios` tự mở Metro ở cổng đó.

## Vỡ ở đâu

- Round suy từ thứ tự cú trong attempt log (`types.ts`, chú thích `DrillRound`). Chuyển drill từ `rounds` sang `shots` hay đổi số round sẽ lệch lịch sử tập. Trước bước 5, kiểm drill nào đã có attempt, chọn cách giữ hay chấp nhận reset, hỏi anh.
- Break (29, 30, 70, 71) cần chín bi cùng chạy. Chưa biết `ShotPhysics` có giải va chạm nhiều bi không. Kiểm ở bước 7 trước khi chọn engine hay vẽ tay.
- Nhảy và massé (72, 73) chắc chắn phải vẽ tay. Play khi đó là minh hoạ, không phải mô phỏng.
- Safety và kick không có lỗ đích. Play chạy tới chỗ bi dừng, "vào sạch" đổi thành "dừng trong zone".
