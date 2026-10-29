---
title: Chuỗi Ép phê 7 bước trong Cue Ball Control
description: Thêm 5 drill phê, đưa 26 và 48 qua chuẩn drill, gom cả 7 bài liền nhau trong Cue Ball Control, chỉ sửa data.
status: pending
priority: P2
branch: feat/pool-editor
created: 2026-10-25
---

# Chuỗi Ép phê 7 bước trong Cue Ball Control

## Bối cảnh

Quyết định gốc: `docs/quyet-dinh/2026-10-25-muc-tieu-va-chu-de-pool.md` (hướng A). Số squirt, throw cho Ignite 12.2:
`docs/research/2026-10-25-ep-phe-1-diamond.md` mục 8. Luật một cú: `docs/chuan-drill.md` §3, cần `speed` m/s, `rate` từ
harness và `why`. Gộp nửa `ORDER`/`topics` của bước 8 trong `.claude/ke-hoach/2026-10-19-drill-tu-research.md`.

Đã kiểm ngày 25/10: `sh scripts/drill-lint/run.sh 26 48` ra 6 vi phạm, mỗi drill 3 (thiếu m/s, thiếu nguồn đường bi cái,
thiếu why). `pick()` và `sample()` trong `scripts/position-harness/main.swift` gán cứng `tipX: 0`. `NO_CHAIN` của lint
không có `english`.

## Xong là

- Tab Drills, nhóm Cue Ball Control: sau 5 bài stop/follow/draw là 7 bài phê liền nhau theo thứ tự 82, 26, 83, 48, 84, 85, 86.
- `sh scripts/drill-lint/run.sh 26 48 82 83 84 85 86` ra 0 vi phạm. Tổng vi phạm 86 drill không cao hơn mốc đo ở bước 1.
- `npx tsc --noEmit` và `npx expo lint` exit 0. Rate của drill 12, 15, 23 trên harness giữ như cũ.

## Không làm

- Không thêm area, màn, glyph. Không đụng `ProgramGauge`, không đổi schema `PoolDrill`.
- Không đổi số round của 26 (3 round, có thể đã có attempt). Phê 9 mm và BHE chuyển sang drill 83.
- Không lưu NPL, không nối NPL vào `squirtDeg`. Quyết định chỗ lưu vẫn thuộc bước 8 của plan 10-19.
- Không chỉnh `squirtDeg` mặc định 2,5°. Không làm mục tiêu 2–7.

## Bước

- [x] 1. Harness: `pick()`, `sample()`, `placed()` nhận `tipX`. Ghi mốc lint 81 drill → xong khi: 12, 15, 23 ra đúng rate cũ, một dòng thử cắt 30° với tipX ±0.5 in rate kèm `squirtDeg`/`throwDeg`, mốc ghi vào Phát sinh
  ✓ 25/10: `sample()`, `pick()`, `placed()` nhận `tipX` (mặc định 0), aim qua `aimOf()` cộng lại squirt. Harness exit 0, 12 ra 32/27/40/33, 15 ra 26/37/45, 23 ra 37/36/45 như cũ. Dòng `tipXTrial` in đủ rate, squirtDeg, throwDeg
- [x] 2. Drill 26, 48: round nào cũng có `speed`, `rate`, `why` từ harness. 48 đổi `skill` sang `english`, lint thêm `english` vào `NO_CHAIN` (cổng của 82 có 2 bi không để ăn) (cần 1) → xong khi: lint 26 48 ra 0 vi phạm
  ✓ 25/10: lint 26 48 ra 0 vi phạm, tổng 86→81 drill còn 184 (mốc 190). 26: speed 1,7/1,7/1,75, rate 15/15/15. 48: một `shots`, 1,85 m/s, rate 45/45, skill `english`
- [x] 3. Drill 83 One-Diamond Squirt: bi mục tiêu cách bi cái 1 diamond, 5 round: trơn 30° làm gốc, rồi 15° và 30°, mỗi góc phê ngoài và trong 9 mm (tipX ≈ ±0.31). Why ghi canh dày hay mỏng theo bảng mục 8. BHE chỉ nằm trong tip vì data không có trục cơ (cần 1) → xong khi: lint 0 vi phạm, chiều dày/mỏng trong why khớp dấu harness in
  ✓ 25/10: lint 83 ra 0 vi phạm. `drill83()` ngắm theo tip giữa rồi đo lệch ở lỗ (33,5"): 30° ngoài +3,9" dày, trong −6,7" mỏng; 15° ngoài +3,8" dày, trong −5,2" mỏng. Chiều khớp bảng mục 8. Rate 45/45 cả 5 round, output harness cũ không đổi dòng nào
- [x] 4. Drill 84 Throw Check: cắt ½ bi, 3 round: trơn chậm, trơn nhanh, phê ngoài vừa gearing. Why lấy `throwDeg` của harness (cần 1) → xong khi: lint 0 vi phạm, round chậm có throw lớn hơn round nhanh
  ✓ 25/10: lint 84 ra 0 vi phạm. `drill84()` (cắt 30°, bi cái cách ghost 2 diamond): chậm 1,1 m/s throw −1,79° rate 11; nhanh 2,4 m/s throw −1,00° rate 14; gearing tipX 0,18 ở 1,6 m/s throw +0,01° rate 18. Chậm throw lớn hơn nhanh
- [x] 5. Drill 85 1 Tip = 1 Diamond: chỉ bi cái, chạm băng dài, 3 round tip 0, ½, 1 tip. Harness thêm case không bi mục tiêu, đo bi cái dịch bao nhiêu diamond trên băng đối diện. Lệch luật #58 quá ½ diamond thì zone theo engine, tip ghi rõ là không khớp (cần 1) → xong khi: harness in độ dịch mỗi round, lint 0 vi phạm
  ✓ 25/10: lint 85 ra 0 vi phạm. `drill85()` (bi cái (40, 87.5), ngắm băng trái ở 78" từ foot, chỉ bi cái): tip giữa 2,1 m/s chạm băng phải 4,40 diamond rate 18; ½ tip thuận (tipX 0,22) 1,85 m/s ở 2,71 rate 8; 1 tip (0,44) 1,7 m/s ở 1,22 rate 17. Dịch +1,69 và +3,18 diamond, lệch #58 quá ½ diamond nên zone theo engine, tips ghi rõ
- [x] 6. Drill 86 Outside Draw / Inside Follow: một thế, 2 round cùng về một zone (cần 1) → xong khi: lint 0 vi phạm, cả 2 round có rate trên zone đó
  ✓ 25/10: lint 86 ra 0 vi phạm. `drill86()` (thế của 84, quét kéo + phê ngoài và theo + phê trong, ghép cặp chỗ dừng gần nhau): kéo tip (0,2, −0,35) 2,1 m/s rate 12, theo tip (−0,2, 0,25) 2,0 m/s rate 15, cùng zone (0,9224, 0,137) bán kính ½ diamond, mỗi cú danh nghĩa dừng cách tâm 1,5"
- [x] 7. Drill 82 NPL Gate: bi cái cách lỗ 2 diamond, 2 bi làm cổng, 2 round phê trái và phải. Harness kiểm cổng: tipX 0,5 ngắm tâm thì trượt cổng, có bù góc BHE thì qua (cần 1, 2) → xong khi: lint 0 vi phạm, harness in cả hai trường hợp
  ✓ 25/10: lint 82 ra 0 vi phạm. `drill82()` (bi cái cách footLeft 25" theo chéo 45°, cổng ở giữa, mỗi bên hở 0,35"): tipX ±0,5 ngắm tâm lệch 0,55" ở cổng, chạm bi cổng 45/45, rate 0; bù BHE đủ 2,5° lệch 0,06", qua cổng vào lỗ 45/45. Bù nửa (1,25°) lệch 0,28" cũng qua, tức cổng 0,35" chỉ phân biệt được NPL sai quá khoảng 2 lần
- [x] 8. `training-areas.ts`: `english` sang `cueBallControl`, topics "Stop · Follow · Draw · English", `ORDER` xếp chuỗi phê. Thêm 24–30 theo bước 8 plan 10-19: 24 vào Position Play, 25 vào Cue Ball Control, 27–28 vào Fundamentals, 29–30 vào 9-Ball Patterns. Ghi một dòng Phát sinh vào plan 10-19 (cần 2–7) → xong khi: tab Drills đúng thứ tự trong Xong là
  ✓ 25/10: `english` → `cueBallControl`, topics "Stop · Follow · Draw · English". In `drillsIn()`: Cue Ball Control ra 02 03 04 05 06 82 26 83 48 84 85 86 25 rồi các bài không có trong ORDER. 24 cuối ORDER Position Play, 27 28 cuối Fundamentals, 30 29 cuối 9-Ball Patterns. Dòng Phát sinh đã ghi vào plan 10-19
- [x] 9. Kiểm cuối: lint cả 86 drill, `npx tsc --noEmit`, `npx expo lint`, harness 12/15/23. Simulator: Play từng round của 7 drill (cần 8) → xong khi: đủ điều kiện ở Xong là, ảnh Play lưu trong scratchpad

## Vỡ ở đâu

- Engine chưa hiệu chỉnh: squirt 2,5° so với 2,3° suy ra cho Ignite, chưa có swerve. Zone và rate là số engine, không phải số bàn.
- Bước 5 có thể vỡ ngay vì `SP.runWith` cần bi mục tiêu. Khi đó dùng `simulate()` cho bi cái đi một mình. Không được thì 85 sang đường vẽ tay (§5.3).
- Bước 7: `pocketed` đếm bi mục tiêu, mà 82 cần bi cái qua cổng. Dùng `inZone` với zone ngay sau cổng. Card và cách ghi kết quả có hợp không thì phải xem trên sim.
- Chuyển 26 và 48 khỏi Fundamentals làm số 01…N của các bài đứng sau chúng trong nhóm đó đổi. Số này chỉ để hiển thị, không lưu.
- 9 mm đổi ra tipX theo R = 28,6 mm. Squirt trong engine chỉ tăng tới tipX 0,55 (`ShotPhysics.swift:482` kẹp ở 1,1 × 0,5), nên round nào cần phê đậm hơn khoảng 15,7 mm thì không đo được.

## Phát sinh

- 25/10, mốc lint 81 drill trước plan: **190 vi phạm, 20 drill đạt** (`sh scripts/drill-lint/run.sh`). Mốc 237 của plan chuẩn drill đã cũ.
- 25/10, `tipXTrial` (cắt 30° vào footLeft, bi cái cách ghost 12,5", speed 1,5): tipX 0 rate 42/45 throw −1,31°; tipX +0,5 rate 39/45 squirt +2,50° throw +1,34°; tipX −0,5 rate 44/45 squirt −2,50° throw −0,90°. tipX +0,5 là phê ngoài ở thế này (đã kiểm theo dấu `slipH = v·t + R·wz` trong `ShotPhysics.hit`: phê làm slip đổi dấu). Gearing theo engine nằm ở 2,5·tipX = sin(cắt), tức tipX ≈ 0,2 cho 30° (suy từ `strike`, kiểm ở bước 4), nên +0,5 vượt gearing và lật throw. Round gearing của drill 84 dùng tipX = sin(cắt)/2,5.
- 25/10, `ShotPhysics.solve()` bắt đầu secant ở hướng ghost **đã bù squirt** (app code, 1 dòng). Trước đó round Inside của 26 (tipX −0,5, cắt 30°, bi cái cách 27") trượt hẳn bi 1 ngay lần ngắm đầu, solve bỏ cuộc, harness và Play đều ra "cue ball doesn't reach". Đã kiểm: toàn bộ output harness cũ (12/15/23/31/24/25/30/27/28/34/35/46/49) giống hệt từng dòng trước và sau sửa.
- 25/10, 48 dùng `shots` một cú với `ball: 1`. Harness đánh bi 2 có bi 1 làm vật chắn, còn Play trong app có thể ngắm thẳng bi 1 (bị bi 2 chắn). Xem ở bước 9.
- 25/10, gearing thật của engine ở cắt 30°, 1,6 m/s, bi cái cách ghost 25" là tipX 0,18 (chia đôi trên `throwDeg`), không phải sin(cắt)/2,5 = 0,2. `gear` của `hit` ra 0,145 vì tính theo phê lúc đánh, chưa trừ phần phê mất trên đường.
- 25/10, drill 85: phê nghịch (tipX âm) bão hoà, −0,22 tới −0,44 chỉ dời ngược 0,5–0,85 diamond và cần ≥2,4 m/s mới tới băng phải; phê thuận dời không tuyến tính (0,11 → 0,7 diamond, 0,22 → 1,7). Chuỗi chỉ dùng phê thuận. Round ½ tip rate 8/45, nhạy lực nhất.
- 25/10, drill 86: zone 3,5" như drill 23 thì kéo phê ngoài chỉ đạt 1–4/45 (đường dài, qua băng). Mở lên ½ diamond. Rate trần khoảng 15 do chính cú ăn bi cách ghost 2 diamond (giống 84).
- 25/10, `ShotPhysics.runWith` chỉ thả `others` vào mô phỏng sau khi bi cái chạm bi mục tiêu; đoạn `pre` đi xuyên bi khác. Harness 82 xét chạm cổng bằng khoảng cách tâm trên `pre.pts`. Play của 82 (và 85 nếu có bi chắn) có thể vẽ bi cái đi xuyên bi cổng: xem ở bước 9, chưa sửa engine.
- 25/10, chiều dời cầu tay trong tips của 82 theo hình học BHE (sinψ = b/L: cầu tay ngắn thì ψ lớn, bi cái lệch về phía phê, dời cầu tay ra sau). `07-spin-and-deflection.md` mục 4 ghi ngược lại ("chạm phía ngược phê thì cầu tay ngắn quá"). Chưa đối chiếu nguồn Dr. Dave.
- 25/10, sim: Play bỏ qua tip của round vì native chỉ nạp lại bàn khi `rev` đổi. `src/app/drill/[id].tsx` cho round có `contactPoint` riêng một `rev` (trước chỉ round dời bi). Đã kiểm trên sim: 83 và 84 đổi đường đi theo round. tsc, expo lint exit 0 sau sửa.
- 25/10, sim 82: Play cắt bi 2 vào lỗ vì `aimBall = objectBalls[0]`, không đưa bi cái qua cổng như ý đồ (cả 2 round). Card 82 ghi "1 tip left" trong khi chữ ghi "Half-tip": nhãn tip lệch thang.
- 25/10, sim 82/83/84: header card ghi "CENTER" vì data round để `spin: 'center'` dù `contactPoint` lệch. Lỗi data, sửa `spin` từng round.
- 25/10, sim 48: Play 2/2 lần không vào, bi 1 trôi khỏi băng dừng gần headLeft, card và harness ghi 45/45. Không hiện note trượt vì drill `shots` không báo. Chưa rõ Play lệch harness ở đâu (ngắm hay bi 2 chắn).
- 25/10, sim 83: Play luôn vào lỗ dù why nói ngắm tâm sẽ trượt. Suy đoán Play bù squirt khi giải góc ngắm, nên không minh hoạ được lỗi BHE.
- 25/10, sim 85: Play bắn bi cái thẳng lên băng ngắn, không về băng dài trái ở 78" như `drill85()`, vì data không có hướng ngắm cho drill không bi mục tiêu. Zone không vẽ trên bàn. Sau Play hiện "Missed Ball undefined" (`missNote` lấy `objectBalls[0]`). 3 round đều sai ý đồ.
- 25/10, sim 86: 2 round đều vào và bi cái dừng sát zone ở băng phải gần footLeft, khớp harness.
- 25/10, sửa Play cho bài chỉ đánh bi cái: guideLines `expectedCuePath` 2 điểm, điểm đầu trùng bi cái, là tín hiệu (`cueOnlyTarget` trong `stage.ts`) cho `aimBall` −1 và đích là lỗ hoặc băng. Native `soloReplay` bỏ điều kiện một bi, đích lỗ thì bù squirt, `pass = cue.sink == isPocket`. Note trượt thôi ghi "Ball undefined". 82 và 85 thêm `expectedCuePath`; drill-lint `drawn` đòi > 2 điểm để đường ngắm không tính là đường vẽ tay.
- 25/10, sim sau sửa: 82 cả 2 round bi cái qua cổng giữa bi 2 và 3 rồi vào lỗ góc trên trái. 85 cả 3 round bi cái chạm băng trái ở 78" rồi sang băng phải, điểm dừng lên dần center → ½ tip → 1 tip. Không còn note trượt. Chưa thấy chữ note khi trượt thật vì chưa có cú nào trượt.
- 25/10, còn mở: đích băng luôn pass trừ khi scratch (chưa chấm landing); zone không vẽ trên bàn ở 85 và 86; header card "CENTER" ở 82/83/84 và 85; bộ đếm 82 hiện "01" sau 5 lần Pass.
