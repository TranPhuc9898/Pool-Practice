# Phase 1 — lát mỏng: 99 sang G, bài 142

Đi hết đường harness → file → `index.ts` → `levels.ts` → lint → simulator với một bài, để phase sau chỉ lặp lại.

## Quy trình mỗi bài (phase 2–4 dùng lại)

1. Thêm `drillNNN()` vào `scripts/position-harness/main.swift`: đặt bi, quét vị trí bi cái / tip / lực bằng `placed`, `zoned`, `chain`, `cutCue`. Chạy `ONLY=NNN sh scripts/position-harness/run.sh`.
2. Lấy cấu hình rate cao nhất (từ 35/45 trở lên). Không đạt thì đổi vị trí, không nới luật.
3. Viết `src/pool-engine/drills/NNN-<slug>.ts` theo khuôn 99/137: `shots` có `ball`, `pocket`, `tipY`, `speed`, `zone`, `rate`, `why`; header ghi tên hàm harness và commit ShotPhysics; subtitle kết "Checked in simulation, not on a real table."
4. Import vào `src/pool-engine/drills/index.ts`, thêm `NNN: 'G'` vào `LEVEL_BY_NUMBER` trong `src/pool-engine/levels.ts`.
5. `sh scripts/drill-lint/run.sh` → bài NNN "đạt".
6. Simulator: `xcrun simctl openurl booted "pooltraining://drill/NNN"`, Play từng cú (script `playall.sh` trong scratchpad) → không ra "Missed".

## Bước

- [x] 1. `levels.ts`: `99: 'H'` → `99: 'G'` → xong khi: `grep -n "99:" src/pool-engine/levels.ts` ra `'G'`.
- [x] 2. 142 Stun-Follow to Zone theo quy trình: cắt 10–15°, tip trên tâm nhẹ, zone 6" trước tiếp tuyến → xong khi: lint "đạt" cho 142, Play cú 1 vào lỗ và bi cái dừng trong zone.

## Rủi ro

- Simulator chưa chạy Metro → `lsof -i :8081` trước, có rồi thì dùng lại, không mở cổng mới; 8082 là của GymWorkout.
