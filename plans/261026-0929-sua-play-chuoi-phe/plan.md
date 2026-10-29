---
title: Sửa Play 83, 48 và nhãn phê trên card chuỗi Ép phê
description: Ba lỗi còn lại sau khi kiểm chuỗi phê trên sim. Card ghi CENTER khi round có phê, 83 luôn vào lỗ, 48 Play lệch harness.
status: completed
priority: P2
branch: feat/pool-editor
created: 2026-10-26
---

# Sửa Play 83, 48 và nhãn phê trên card chuỗi Ép phê

## Bối cảnh

Nối tiếp `plans/261025-1420-chuoi-ep-phe/plan.md`. Đó là các mục Phát sinh "sim 82/83/84", "sim 48", "sim 83". Đã kiểm ngày 26/10:

- `Spin` trong `src/pool-engine/types.ts:65` chỉ có `center | stun | follow | draw`. Header card lấy `spinLabel[round.spin]` (`src/app/drill/[id].tsx:429`). Round chỉ có phê ngang nên buộc phải ghi `center`, header ra "CENTER". Không sửa được bằng data mà không đổi schema.
- `ShotPhysics.solve()` (`ShotPhysics.swift:514`) dò góc ngắm bằng secant cho tới khi bi mục tiêu vào lỗ, đã tính cả squirt và throw. Vì thế Play của 83 luôn vào lỗ. `run(aim:)` ở dòng 540 đã có sẵn nhánh đánh đúng một hướng cho trước.
- `drill48()` của harness: bi cái đánh **bi 2**, bi 1 là vật chắn, đạt khi bi 1 rơi headLeft. Data 48 lại ghi `shots[0].ball: 1`. Em đoán Play ngắm thẳng bi 1, nên vướng bi 2. Chưa đọc code native để xác nhận.

## Xong là

- Card của 82–85 không còn ghi "CENTER" ở round có phê ngang.
- Trên sim, 83 round trơn vào lỗ. Round có phê trượt về đúng chiều dày hay mỏng như `why`, note trượt hiện đúng chữ.
- Trên sim, 48 Play vào lỗ, khớp harness 45/45, hoặc lệch có lý do ghi vào Phát sinh.
- `sh scripts/drill-lint/run.sh 26 48 82 83 84 85 86` ra 0 vi phạm. `npx tsc --noEmit` và `npx expo lint` exit 0. Output harness cũ không đổi dòng nào.

## Không làm

- Không đổi schema `PoolDrill`, không thêm giá trị vào `Spin`. Không thiết kế lại card.
- Không sửa nhãn tip lệch thang ở 82 ("1 tip left" so với chữ "Half-tip"), không chấm landing cho đích băng, không vẽ zone 85/86.
- Không đổi `solve()` cho các drill khác. Đi ngắm cố định chỉ bật khi data báo.

## Bước

- [x] 1. Header card: round `spin: 'center'` mà `contactPoint.x ≠ 0` thì ghi "English" thay vì "Center", sửa trong `src/app/drill/[id].tsx` chỗ dựng header → xong khi: tsc và lint exit 0, trên sim card của 82, 83 (round phê), 84 (gearing) và 85 hiện "English", round trơn vẫn "Center"
- [x] 2. 48: đọc nhánh native dựng cú từ `shots` (aim ball, ball rơi lỗ), xác nhận Play ngắm bi nào. Sửa data hoặc native sao cho Play đánh bi 2, chấm bi 1 rơi headLeft như `drill48()` → xong khi: nguyên nhân ghi vào Phát sinh kèm file:dòng, sim Play 2/2 vào lỗ
- [x] 3. 83: thêm tín hiệu ngắm cố định không cần đổi schema. Đề xuất là `expectedCuePath` 2 điểm từ bi cái tới ghost của round trơn, cùng cơ chế với `cueOnlyTarget`. Native thấy tín hiệu thì gọi `run(aim:)` thay vì `solve()` → xong khi: harness và Play cùng hướng ngắm, sim round trơn vào lỗ, round phê ngoài lệch dày và phê trong lệch mỏng như `drill83()`, note trượt hiện đúng chữ
- [x] 4. Kiểm cuối: lint 7 drill, tsc, expo lint, harness 12/15/23/83/48. Sim quay video Play từng round của 48 và 83, chụp card 82–85 (cần 1–3) → xong khi: đủ điều kiện ở Xong là, ảnh và video trong scratchpad, ghi kết quả vào Phát sinh của plan này

## Vỡ ở đâu

- Bước 3: drill-lint đã đòi đường vẽ tay > 2 điểm. Một `expectedCuePath` 2 điểm tới ghost phải không bị `cueOnlyTarget` hiểu nhầm là đích lỗ hoặc băng. Phân biệt bằng điểm cuối: trùng ghost của bi mục tiêu thì ngắm cố định.
- Bước 3: lệch ở lỗ chỉ khoảng 4–7" (`drill83()`). Round phê trong có thể vẫn vào lỗ nếu miệng lỗ rộng. Khi đó ghi số đo, không chỉnh data để ép trượt.
- Bước 2: harness coi bi 2 là bi bị đánh, nhưng `shots` có một trường `ball` vừa để ngắm vừa để chấm. Nếu không tách được hai vai mà không đổi schema thì dừng lại hỏi anh.

## Phát sinh

- **Nguyên nhân 48 (đã đọc code):** `FixedShot.setup` (`PoolEditorRack.swift:307–310`) lấy `cur[s.ball]` làm bi mục tiêu và đẩy mọi bi khác vào `others` làm vật cản. `startRack` (dòng 204) chấm bằng cùng `s.ball, s.pocket`. Data ghi `ball: 1` nên Play ngắm thẳng bi 1, vướng bi 2. Harness thì đánh bi 2 và chấm bi 1. Một trường `ball` không tách được hai vai ngắm và chấm, nên dừng lại hỏi anh theo mục Vỡ ở đâu. Khuyến nghị: data đổi thành `ball: 2`. Thêm luật chấm "bi khác rơi đúng `s.pocket` cũng tính", luật này cần `Track` lưu lỗ của bi khác. Cách này không đổi schema.
- **Sim 83 (26/10):** Video `83-r1…r5.mp4` và tile nằm trong scratchpad của phiên.
  - r1 (center): vào lỗ.
  - r2 (15° phê ngoài): chạm băng trên, phía phải lỗ góc, tức lệch dày.
  - r3 (15° phê trong): chạm băng trái, phía dưới lỗ góc, tức lệch mỏng.
  - r4 (30° phê ngoài): lệch dày.
  - r5 (30° phê trong): lệch mỏng.
  - Các round trượt đều hiện note "Missed Ball 1 · Play to retry.".
- **Header:** 83 r1 ghi "CENTER", r2–r5 ghi "ENGLISH". 82 ghi "SHOT 2/2 · ENGLISH". 84 r1 ghi "Center", đúng vì `contactPoint.x = 0`. Riêng 84 r3 (`x: 0.18`) chưa thấy trên sim, vì muốn tới round đó phải Pass thêm 6 cú. Em suy ra nó hiện "English" từ cùng biểu thức đã chạy đúng ở 83.
- **Progress 83 trên sim:** Muốn chuyển round phải bấm Pass, nên đã ghi 8 cú `pass` vào log. `resetDrill` xoá attempts nhưng giữ `best`, nên 83 trên sim giờ giữ `best = 8` và hiện passed.
- **Harness không chạy lại:** `ShotPhysics.swift` không đổi trong plan này. Native chỉ thêm `centerAim` và tham số `aim` cho `toggleReplay`.
- **Lệch base của 83:** Native lấy hướng ngắm tip giữa ở lực của round, harness dùng speed 2. Hai bên lệch nhau phần throw phụ thuộc lực, tức vài phần mười độ. Chiều lệch dày hay mỏng không đổi.
- **Sửa 48 (anh chốt 26/10):** Data `shots[0].ball` đổi thành 2. `Track` thêm `pocket`, `ShotReplay.potted(pocket)` tính bi mục tiêu rơi lỗ nào cũng được, còn bi khác chỉ tính khi rơi đúng lỗ của cú. Luật này chỉ áp cho cú cố định của drill có `shots`, trong `startRack` và `FixedShot.before`. Chạy bàn bằng solver vẫn chấm `ob.sink` như cũ. Toast lúc vào sạch ghi tên bi thực rơi. Lệch so với harness: harness còn đòi bi 2 không rơi, native thì bi 2 rơi bất kỳ lỗ nào cũng tính.
- **Kiểm 48:** lint 7 drill 0 vi phạm, `tsc` và `expo lint` exit 0, harness 48 vẫn 45/45 ở tipX 0 và ±0.2. Build sim 0 error. Play trên sim: bi cái đánh bi 2, bi 1 chạy dọc băng rơi headLeft, bi 2 ở lại. Video `48-play.mp4`, tile `48-play-tile.png`. Mới Play một lần; engine tất định nên lần sau ra y vậy.
- **Còn hở:** Ô Aim trước khi Play vẫn vẽ bi 1 với "¾ ball" vì lấy từ `guideLines`, sau Play mới đổi sang bi 2. Harness 12/15/23/83 không chạy lại vì `ShotPhysics.swift` không đổi.
