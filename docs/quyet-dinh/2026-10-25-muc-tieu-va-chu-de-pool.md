# Chia phần pool theo mục tiêu và chủ đề, ưu tiên ép phê

Ngày 25/10/2026. Trạng thái: đề xuất, chờ anh duyệt. Chưa code.

Nguồn: `docs/research/nguon/2026-10-25-nguon-messenger-bida.md` (45 tin), `docs/research/2026-10-25-ep-phe-1-diamond.md`
(số engine, Ignite 12.2), `docs/research/pool-9ball/07-spin-and-deflection.md`, 81 drill trong `src/pool-engine/drills/`.

## 1. Bảy mục tiêu, xếp theo độ hổng

Đếm drill theo `skill` trong code [đã kiểm]. Độ quan trọng cho 9 bi là nhận định của em [suy đoán, theo nguồn].

| # | Mục tiêu | Chủ đề con | Drill đang có | Hổng |
|---|---|---|---|---|
| 1 | **Ép phê**: biết phê làm lệch bao nhiêu và bù ra sao | squirt/BHE, throw (CIT/SIT), gearing, phê đổi đường sau băng, outside draw/inside follow, tốc + phê | **1** (26), cộng 48 chạm throw | **Lớn nhất** |
| 2 | Ngắm và ăn bi | thẳng, góc cắt, bi sát băng, spot, combo | ~22 (cutAngle 13, straight 4, railCut 3, spot 2) | Nhỏ: Center Line (#17, #36) |
| 3 | Điều bi cái | stop, follow, draw, stun, tốc | 14 | Vừa: stun follow (#0), stun của Gorst (#24), draw hỏng vì nâng cơ (#60) |
| 4 | Vị trí | tangent, góc tự nhiên, 1 băng, wagon wheel, một thế nhiều cách | 5 + 24, 25 | Vừa: "một thế nhiều phương án" (#2, #32, #45), hệ 4 diamond ½-ball (#40) |
| 5 | Pattern và run-out | line-up, 3 bi, runout, test | 22 | Nhỏ: Mountain (#19), Tyler Styer (#38), Short-side (#14), Compact Play (#26) |
| 6 | Thủ, bank, kick | safety, bank, kick, jump, massé | 7 + 6 + 2 + 2 | Vừa: 2 băng công thức trừ (#52), bank tránh double kiss (#50) |
| 7 | Break | box, xếp thấp | 4 | Nhỏ: luật 2/3-point (#59) |

Mục 1 hổng nhất, cũng là chuyện anh đang hỏi, và engine đã có đủ vật lý để chấm [đã kiểm trong `ShotPhysics.swift`]:
squirt (`squirtDeg`, dòng 21 và 482), throw theo tốc trượt kèm gear (dòng 477–508), băng nhận phê `wz` (`cushion`, dòng 261).
Chưa có swerve, nên mọi drill phê giữ cơ nằm ngang.

## 2. Mục tiêu Ép phê: chủ đề và drill

Đi theo thứ tự: đo cơ mình trước, rồi từng hiệu ứng một, cuối cùng ghép vào cú thật.

| Bước | Chủ đề | Drill | Có sẵn hay mới | Chấm gì |
|---|---|---|---|---|
| 1 | Đo cơ (NPL) | **NPL Gate**: bi cái cách lỗ 2 diamond, 2 bi làm cổng, ngắm tâm, BHE phê đậm, dời cầu tay tới khi qua cổng cả hai phía | Mới, theo 07 mục 4 | Pass khi qua cổng 4/5 mỗi phía. Ghi NPL (inch) |
| 2 | Squirt | **English Check** | Có (26). Giữ 3 round vì có thể đã có attempt. Phê 9 mm và BHE chuyển sang bước 3 | Như cũ, 6/9 |
| 3 | Squirt ở 1 diamond | **One-Diamond Squirt**: bi cách bi 1 diamond, cắt 0/15/30°, phê trái rồi phải | Mới, số lấy từ doc ép phê mục 8 | Ăn bi. Ghi dày hay mỏng khi trượt |
| 4 | Throw (CIT/SIT) | **Frozen Pair & Throw** | Có (48), đổi `skill` sang `english` | Như cũ, 7/10 |
| 5 | Throw ở cú ½ bi | **Throw Check**: cắt ½ bi, trơn chậm, trơn nhanh, phê ngoài gearing | Mới | Ăn bi. Chậm trơn phải canh mỏng hơn |
| 6 | Phê sau băng | **1 Tip = 1 Diamond**: bi cái chạm băng dài, trơn, rồi 1/2/3 tip; đích là diamond trên băng đối diện | Mới, từ #58 | Bi cái dừng trong vùng ±½ diamond |
| 7 | Phê trong điều bi | **Outside Draw / Inside Follow**: cùng một thế, hai cách tới cùng một vùng | Mới, từ #39 | Bi cái vào vùng 2 lần mỗi cách |

Số trong drill 3 và 5 lấy từ harness Ignite 12.2 (squirt 2,3° ở 0,5R) [suy luận từ NPL người dùng tự đo]. Drill 1 là chỗ
đổi số đó thành số đo của chính anh.

## 3. Hướng gắn vào app

Ràng buộc:

- Memory: giai đoạn này không thiết kế lại UI.
- Home có lưới area (`training-area-grid.tsx`, 2 cột iPhone, 4 cột iPad), có `AreaGlyph` cho mỗi area, có `ProgramGauge`
  cộng cứng 3 khúc (`(today)/index.tsx`: `fund`, `cbc`, `pos + pat`). Đã kiểm.

| Cách | Làm gì | Giả định chịu lực | Vỡ đầu tiên khi |
|---|---|---|---|
| **A. Chỉ đổi data** | `english` chuyển từ `fundamentals` sang `cueBallControl`. Topics thành "Stop · Follow · Draw · English". `ORDER` của nhóm này xếp chuỗi 7 bước sau 5 bài stop/follow/draw. | Phê là một phần điều bi cái, người chơi tìm ở đó | Nhóm Cue Ball Control phình lên khoảng 21 bài, chuỗi phê lẫn vào |
| B. Area thứ 5 "Spin & English" | Thêm `TrainingAreaId`, glyph mới, quyết khúc gauge | Thêm 1 ô vào lưới chưa tính là thiết kế lại | iPad 4 cột ra hàng lẻ 4 + 1. Phải vẽ glyph. Gauge phải chọn khúc. Đụng memory |
| C. Lớp "Mục tiêu" riêng | Bảng `GOALS` → chủ đề → drill, màn mới | Anh muốn lộ trình theo mục tiêu ngay trong app | Cần màn mới, rõ ràng là UI mới |

**Chốt A.** Chỉ sửa `training-areas.ts`, không chạm UI. Chuỗi 7 bước nằm liền nhau nhờ `ORDER`. Khi nào anh mở lại việc
UI thì nâng lên B, vì data đã gom sẵn. A bỏ đi rất rẻ: đổi một dòng trong `areaBySkill`.

## 4. Contract cho plan

- **Outcome:** mở Cue Ball Control thấy chuỗi Ép phê 7 bước, theo thứ tự, mỗi bài chạy và chấm được trong engine.
- **Constraints:** không đổi UI, `DrillCategory` và schema `PoolDrill`. Drill mới qua `scripts/drill-lint`. Không swerve.
- **Non-goals:** area thứ 5, màn Mục tiêu, các mục tiêu 2–7, chỉnh `squirtDeg` mặc định (thuộc plan
  hiệu chỉnh engine), lưu NPL lên server.
- **Acceptance:** 5 drill mới có trong `DRILLS`. 26 giữ 3 round và qua lint, 48 đổi skill. Plan: `plans/261025-1420-chuoi-ep-phe/plan.md`. `drill-lint` qua cả 86 bài.
  `ORDER.cueBallControl` xếp đủ 7 bước. Lint và typecheck qua.

## 5. Cố tình bỏ (80% còn lại)

- Mục tiêu 2–7: 9 drill từ Messenger (Compact Play, Mountain, Tyler Styer, Center Line ×2, Short-side, stun Gorst,
  "một thế nhiều cách", 2 băng công thức trừ). Để batch sau, cùng cách gắn.
- Fundamentals vẫn khoảng 34 bài, lẫn bank, kick, jump, massé. Tách ra là việc UI, cùng lúc với B.
- NPL đo xong chưa chảy vào engine. Drill 1 chỉ ghi số. Nối số đó vào `squirtDeg` theo người chơi cần chỗ lưu. Câu hỏi này
  đã nằm trong plan `2026-10-19-drill-tu-research.md` bước 8 (`docs/quyet-dinh/2026-10-19-drill-do-so.md`).
- SAWS 3 × 3: bảng cá nhân, không có đáp án chung, khó chấm pass/fail. Bỏ ra khỏi chuỗi.
- Wagon Wheel, Land Mine: Messenger chỉ có tên, phải xem video mới có layout.

## 6. Còn mở

- Plan `2026-10-19-drill-tu-research.md` bước 8 cũng sửa `ORDER` và `topics` của `training-areas.ts`. Nên chạy bước đó trước,
  hoặc gộp vào plan này, để hai bên không đè nhau.
- Ngưỡng pass của 5 drill mới là đề xuất, chưa đo trên bàn.
