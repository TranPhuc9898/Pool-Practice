# Chấm lại từng drill theo 2 luật, 2026-10-28

Tôi chạy lại 124 drill, gồm 399 trường hợp drill×round. Code dùng là bản sau khi siết `clean()` và chặn ăn bừa trong planner. Harness gọi đúng `ShotPhysics`, `DrillShotPlanner` và nhánh dispatch Play của app.

## Cách chấm
**Luật 1: đánh đúng thứ tự, đúng bi, đúng lỗ, không ăn bừa.**

| Mức | Nghĩa |
|---|---|
| ✅ | Mọi cú vào đúng bi và đúng lỗ, không có bi nào khác rơi, bi cái không xuyên bi. Drill rack chạy hết lượt. |
| ❌ SAI | App chấm đạt nhưng cú thật ra là sai. |
| ❌ HỤT | Đánh đúng thông số của drill mà engine không vào. |
| ⛔ CHẶN | Round không dựng được. |

Các trường hợp miễn:
- Thứ tự do đề quy định. Đề ghi "any order" thì thứ tự tự do, gồm 16, 18–20, 40, 117–119, 123, 129, 130. Drill 13 và 42 có thứ tự riêng ghi trong đề.
- Break và test: bi cái không rơi là đạt.
- Combo: bi bị đánh trước có thể khác bi đích.
- Kick và safety: chạm đúng là đạt.
- Jump 72: được bay qua bi.
- 48: cặp bi sát.

**Luật 2: đường vẽ phải khớp đường chạy thật.**

| Mức | Nghĩa |
|---|---|
| ⚠️ LỆCH | Có ít nhất một dấu hiệu dưới đây. |
| ❔ | Round phát video, chưa kiểm. |
| — | Drill chỉ có bi cái, harness chưa phủ. |

Dấu hiệu LỆCH:
- Đường vẽ lệch đường engine chạy hơn 2.25".
- Lực ghi trên thẻ khác lực đánh thật hơn 0.05 m/s.
- Preview trước cú lệch cú Play hơn 2.25".

## Tổng
- Đạt cả hai luật: **70/124**.
- Luật 1: 106 ✅, 13 HỤT (22, 33, 37, 38, 39, 44, 56, 69, 83, 93, 94, 99, 111), 2 CHẶN (31, 120), 0 SAI, 3 chưa phủ (50, 82, 85).
- Sau khi siết, không còn drill nào bị app chấm đạt khi đánh sai.
- Luật 2: 74 ✅, 46 LỆCH, 1 video (31), 3 chưa phủ.

Các drill lệch luật 2 chia thành các nhóm sau.

| Nhóm | Drill | Hiện tượng |
|---|---|---|
| Bank | 27, 28, 66–69, 105, 109, 110 | Planner tăng lực, preview không vào lỗ, đường bank lệch dần theo round |
| Kick | 64, 65, 89, 111 | Đường bi cái lệch đường vẽ |
| Safety | 57–63, 93, 94, 112 | Đường bank của bi lệch tới 75" ở 61 và 112 |
| Break và test | 29, 30, 70, 71, 95, 74–81 | Thẻ ghi 1.8–2.6 m/s, đánh thật 7.8 m/s |
| Lẻ | 9, 39, 44, 47, 48, 56, 73, 83, 98, 99, 120 | Đường bi cái hoặc bi mục tiêu lệch |

Với break, §5 trong `docs/chuan-drill.md` cho phép đường vẽ tay. Lực trên thẻ vẫn sai so với lực thật.

## Từng bài

| # | Drill | Skill | Luật 1 | Lý do | Luật 2 | Lý do |
|---|---|---|---|---|---|---|
| 1 | Straight-In | straightStroke | ✅ |  | ✅ |  |
| 2 | Stop Shot | stop | ✅ |  | ✅ |  |
| 3 | Follow | follow | ✅ |  | ✅ |  |
| 4 | Follow Distance | followDistance | ✅ |  | ✅ |  |
| 5 | Draw | draw | ✅ |  | ✅ |  |
| 6 | Draw Distance | drawDistance | ✅ |  | ✅ |  |
| 7 | Tangent Line | tangent | ✅ |  | ✅ |  |
| 8 | Three Positions | threePositions | ✅ |  | ✅ |  |
| 9 | One Rail | oneRail | ✅ |  | ⚠️ LỆCH |  expectedCue 6.4" |
| 10 | Two-Ball Pattern | pattern | ✅ |  | ✅ |  |
| 11 | Wagon Wheel | wagonWheel | ✅ |  | ✅ |  |
| 12 | Line of Balls | lineUp | ✅ |  | ✅ |  |
| 13 | Red-Black | correctSide | ✅ | thứ tự theo đề: 1-8-2 | ✅ |  |
| 14 | L-Drill | lineUp | ✅ |  | ✅ |  |
| 15 | Three-Ball, 30° Max | runout | ✅ |  | ✅ |  |
| 16 | No-Rail T | noRail | ✅ | thứ tự tự do theo đề | ✅ |  |
| 17 | 9-Ball Runout | runout | ✅ |  | ✅ |  |
| 18 | Rail Cut · Bachelors | railCut | ✅ | thứ tự tự do theo đề | ✅ |  |
| 19 | Rail Cut · Masters | railCut | ✅ | thứ tự tự do theo đề | ✅ |  |
| 20 | Rail Cut · Doctorate | railCut | ✅ | thứ tự tự do theo đề | ✅ |  |
| 21 | Spot Shot Challenge | spotShot | ✅ |  | ✅ |  |
| 22 | Cut Angle Ladder | cutAngle | ❌ HỤT | r3 bi cái rơi; r4 hụt | ✅ |  |
| 23 | Three-Ball Position | runout | ✅ |  | ✅ |  |
| 24 | Natural Angle | naturalAngle | ✅ |  | ✅ |  |
| 25 | Draw Trisect | drawAngle | ✅ |  | ✅ |  |
| 26 | English Check | english | ✅ |  | ✅ |  |
| 27 | Bank Ghost Pocket | bank | ✅ |  | ⚠️ LỆCH | r0 preview≠Play 10.2"; r1 preview≠Play 12.9"; r2 objectBallBank 5.5"; r2 preview≠Play 10.4"; r3 objectBallBank 7.1"; r3 preview≠Play 13.6" |
| 28 | Long Bank | bank | ✅ |  | ⚠️ LỆCH | r0 preview≠Play 2.6"; r1/r2/r3 lực thẻ 1.8→2.3; r1 preview≠Play 9.6"; r2 objectBallBank 4.7"; r2 preview≠Play 12.8"; r3 objectBallBank 7.1"; r3 preview≠Play 14.2" |
| 29 | Break: 1 to Side | break | ✅ |  | ⚠️ LỆCH | r0/r1/r2 lực thẻ 2.6→7.8; r0 preview≠Play 37.3"; r1 preview≠Play 29.8"; r2 preview≠Play 35.2" |
| 30 | Break: Squat | break | ✅ |  | ⚠️ LỆCH |  lực thẻ 2.6→7.8;  preview≠Play 25.5" |
| 31 | Twelve-Ball Rail Pattern | pattern | ⛔ CHẶN | round không tăng: 1,2,3,4,5,6,7,,9,10,11,12; r6 bi cái rơi; r7 bị chặn | ❔ video | 11 round video chưa kiểm |
| 32 | 10 Straight-In in a Row | straightStroke | ✅ |  | ✅ |  |
| 33 | Short Stop / Follow / Draw | straightStroke | ❌ HỤT | r1 bi cái rơi | ✅ |  |
| 34 | Ring Around the Side | cutAngle | ✅ | round không tăng: 1,2,3,4,5,1,2,3,4,5 | ✅ |  |
| 35 | 15-Ball Lineup | lineUp | ✅ |  | ✅ |  |
| 36 | Jewett Spot Progression | spotShot | ✅ |  | ✅ |  |
| 37 | Long Diagonal Straight-In | straightStroke | ❌ HỤT | r2 bi cái rơi | ✅ |  |
| 38 | BU F1 Cut Progression | cutAngle | ❌ HỤT | r0 bi cái rơi | ✅ |  |
| 39 | BU F6 Ball Pocketing | cutAngle | ❌ HỤT | r3/r8 hụt | ⚠️ LỆCH | r3/r8 objectBall 3.0" |
| 40 | Ride the Rails | cutAngle | ✅ | thứ tự theo đề: 4-2-5-1-3-8 | ✅ |  |
| 41 | Jewett Progressive Cut | cutAngle | ✅ |  | ✅ |  |
| 42 | The Ladder | cutAngle | ✅ | thứ tự theo đề: 1-7-2-8-3-4-9-10-5-11-6-12 | ✅ |  |
| 43 | Frozen Ball Every Diamond | cutAngle | ✅ | thứ tự theo đề: 1-12-2-11-3-10-7-6-8-5-9-13-15-14-4 | ✅ |  |
| 44 | Tom Ross Rail Shot | cutAngle | ❌ HỤT | r1/r2/r3/r4/r5 hụt | ⚠️ LỆCH | r1 objectBall 8.5"; r2 objectBall 15.4"; r4 objectBall 9.6"; r5 objectBall 15.0" |
| 45 | Edge Love | cutAngle | ✅ |  | ✅ |  |
| 46 | Jal Circle | cutAngle | ✅ |  | ✅ |  |
| 47 | Combo Progression | combo | ✅ |  | ⚠️ LỆCH | r0/r1 objectBall 3.7"; r0 preview≠Play 69.5"; r1 preview≠Play 74.7"; r2 objectBall 3.8"; r2 preview≠Play 67.2" |
| 48 | Frozen Pair & Throw | english | ✅ |  | ⚠️ LỆCH | cú 1 objectBall 23.1" |
| 49 | Soft Touch | speedControl | ✅ |  | ✅ |  |
| 50 | Lag Ladder | speedControl | — | chỉ bi cái, chưa phủ | — |  |
| 51 | Five-Level Draw | drawDistance | ✅ |  | ✅ |  |
| 52 | BU F8 Grid Target | speedControl | ✅ |  | ✅ |  |
| 53 | Follow Matrix | follow | ✅ |  | ✅ |  |
| 54 | Draw Matrix | draw | ✅ |  | ✅ |  |
| 55 | Random A→B | speedControl | ✅ |  | ✅ |  |
| 56 | Kill the Cue Ball | stop | ❌ HỤT | r0/r1/r2 hụt | ⚠️ LỆCH | r0 objectBall 34.7" |
| 57 | Roll Up and Snuggle | safety | ✅ |  | ⚠️ LỆCH |  preview≠Play 5.1" |
| 58 | Equal Separation | safety | ✅ |  | ⚠️ LỆCH |  expectedCue 5.5" |
| 59 | Straddle | safety | ✅ |  | ⚠️ LỆCH |  expectedCue 2.6";  preview≠Play 2.7" |
| 60 | BU S5 Snooker Behind a Cluster | safety | ✅ |  | ⚠️ LỆCH | r0 preview≠Play 29.8"; r1 preview≠Play 47.9"; r2 preview≠Play 31.6"; r4 preview≠Play 42.4" |
| 61 | Bank the 7 Long, Hide Behind the 8 | safety | ✅ |  | ⚠️ LỆCH |  expectedCue 3.7";  objectBallBank 75.9";  preview≠Play 3.8" |
| 62 | Two-Rail Safety Behind the 9 | safety | ✅ |  | ⚠️ LỆCH |  expectedCue 9.0";  objectBallBank 29.0" |
| 63 | Thin Hit, Freeze Beside the Stripe | safety | ✅ |  | ⚠️ LỆCH |  preview≠Play 16.6" |
| 64 | BU S6 One-Rail Kick | kick | ✅ |  | ⚠️ LỆCH | r0 preview≠Play 35.0"; r1 expectedCue 2.9"; r1 preview≠Play 57.0"; r2 expectedCue 4.4"; r2 preview≠Play 53.5"; r3 expectedCue 6.5"; r3 lực thẻ 1.8→2.3; r3 preview≠Play 28.8" |
| 65 | Shallow One-Rail Kick | kick | ✅ |  | ⚠️ LỆCH | r0 preview≠Play 2.9"; r1 preview≠Play 3.7"; r2 preview≠Play 4.0"; r3 preview≠Play 5.3"; r4 preview≠Play 5.8"; r5 preview≠Play 8.7"; r6 preview≠Play 6.7"; r7 expectedCue 2.6"; r7 preview≠Play 7.9"; r8 expectedCue 2.9"; r8 preview≠Play 8.6" |
| 66 | Cross-Side Bank | bank | ✅ |  | ⚠️ LỆCH | r0/r1/r2 lực thẻ 1.8→2.3; r0 preview≠Play 5.3"; r1 objectBallBank 2.6"; r1 preview≠Play 6.7"; r2 objectBallBank 3.6"; r2 preview≠Play 9.3" |
| 67 | Cross-Side Bank: Five Spots | bank | ✅ |  | ⚠️ LỆCH | r0/r1/r2 lực thẻ 1.8→2.3; r0 preview≠Play 4.5"; r1 preview≠Play 5.1"; r2 preview≠Play 5.9"; r3 lực thẻ 1.8→5.0; r3 preview≠Play 4.4"; r4 objectBallBank 6.5"; r4 lực thẻ 1.8→2.9; r4 preview≠Play 24.5" |
| 68 | Cross-Corner Bank Ladder | bank | ✅ |  | ⚠️ LỆCH | r0/r1/r3 lực thẻ 1.8→2.3; r0 preview≠Play 8.5"; r1 objectBallBank 2.3"; r1 preview≠Play 7.7"; r2 lực thẻ 1.8→2.9; r2 preview≠Play 7.6"; r3 objectBallBank 12.3"; r3 preview≠Play 12.3"; r4/r6 lực thẻ 1.8→5.0; r4 preview≠Play 6.0"; r5 lực thẻ 1.8→4.0; r5/r6 preview≠Play 5.6" |
| 69 | Bank to Every Pocket | bank | ❌ HỤT | r4 hụt | ⚠️ LỆCH | r0 objectBallBank 2.3"; r0 preview≠Play 12.5"; r1 lực thẻ 1.8→2.3; r1 preview≠Play 48.2"; r2 preview≠Play 3.2"; r3 objectBallBank 46.6"; r3/r5 lực thẻ 1.8→4.0; r3 preview≠Play 27.7"; r4 objectBallBank 20.9"; r4 preview≠Play 37.7"; r5 objectBallBank 9.0"; r5 preview≠Play 21.5" |
| 70 | Soft Break from the Box | break | ✅ |  | ⚠️ LỆCH |  lực thẻ 1.8→7.8;  preview≠Play 36.5" |
| 71 | Break Evaluation | break | ✅ |  | ⚠️ LỆCH | r0/r1/r2 lực thẻ 2.6→7.8; r0/r1/r2 preview≠Play 25.4" |
| 72 | Jump the Gap | jump | ✅ |  | ✅ |  |
| 73 | Progressive Massé | masse | ✅ |  | ⚠️ LỆCH |  preview≠Play 3.6" |
| 74 | RDS Levels 1–3 | test | ✅ |  | ⚠️ LỆCH | r0/r1/r2 lực thẻ 1.8→7.8; r0/r1/r2 preview≠Play 25.8" |
| 75 | RDS Levels 4–6 | test | ✅ |  | ⚠️ LỆCH | r0/r1/r2 lực thẻ 1.8→7.8; r0/r1 preview≠Play 25.8"; r2 preview≠Play 23.8" |
| 76 | RDS Levels 7–9 | test | ✅ |  | ⚠️ LỆCH | r0/r1/r2 lực thẻ 1.8→7.8; r0 preview≠Play 26.6"; r1 preview≠Play 28.6"; r2 preview≠Play 26.1" |
| 77 | 9-Ball Progress | test | ✅ |  | ✅ |  |
| 78 | RDS Levels 10–12 | test | ✅ |  | ⚠️ LỆCH | r0/r1/r2 lực thẻ 1.8→7.8; r0 preview≠Play 25.8"; r1 preview≠Play 26.1"; r2 preview≠Play 24.7" |
| 79 | Equal Offense | test | ✅ |  | ⚠️ LỆCH |  lực thẻ 1.8→7.8;  preview≠Play 26.1" |
| 80 | 10-Ball Ghost | test | ✅ |  | ⚠️ LỆCH |  lực thẻ 1.8→7.8;  preview≠Play 26.8" |
| 81 | RDS Levels 13–16 | test | ✅ |  | ⚠️ LỆCH | r0/r1/r2/r3 lực thẻ 1.8→7.8; r0 preview≠Play 28.6"; r1 preview≠Play 26.6"; r2 preview≠Play 24.7"; r3 preview≠Play 31.5" |
| 82 | NPL Gate | english | — | chỉ bi cái, chưa phủ | — |  |
| 83 | One-Diamond Squirt | english | ❌ HỤT | r1/r2/r3/r4 hụt | ⚠️ LỆCH | r1 objectBall 2.7"; r2 objectBall 3.4"; r3 objectBall 2.9"; r4 objectBall 4.0" |
| 84 | Throw Check | english | ✅ |  | ✅ |  |
| 85 | 1 Tip = 1 Diamond | english | — | chỉ bi cái, chưa phủ | — |  |
| 86 | Outside Draw / Inside Follow | english | ✅ |  | ✅ |  |
| 87 | Last Three, Many Pockets | runout | ✅ |  | ✅ |  |
| 88 | Problem Ball First | pattern | ✅ |  | ✅ |  |
| 89 | One- and Two-Rail Kicks | kick | ✅ |  | ⚠️ LỆCH | r0 expectedCue 4.7"; r0 preview≠Play 44.8"; r1 expectedCue 5.3"; r1 lực thẻ 1.4→2.6; r1 preview≠Play 18.7" |
| 90 | Pressure Line | runout | ✅ |  | ✅ |  |
| 91 | 9-Ball Scatter | runout | ✅ |  | ✅ |  |
| 92 | 10-Ball Called Runout | runout | ✅ |  | ✅ |  |
| 93 | Safety Exchange | safety | ❌ HỤT | r1 hụt | ⚠️ LỆCH | r0 expectedCue 9.8"; r0 objectBallBank 8.8"; r0 lực thẻ 1.2→1.8; r0 preview≠Play 7.2"; r0 bỏ speed của round; r1 expectedCue 7.6"; r1 preview≠Play 45.4" |
| 94 | Push-Out Choice | safety | ❌ HỤT | r0/r1 hụt; r1 bi cái xuyên bi 5 | ⚠️ LỆCH | r0 lực thẻ 0.6→0.8; r0 preview≠Play 47.6"; r0 bỏ speed của round; r1 expectedCue 10.3" |
| 95 | Controlled Break | break | ✅ |  | ⚠️ LỆCH | r0/r1/r2/r3/r4/r5/r6/r7/r8/r9 preview≠Play 45.9" |
| 96 | Pressure 9-Ball | runout | ✅ |  | ✅ |  |
| 97 | Wide Zones: Stop, Follow, Draw | threePositions | ✅ |  | ✅ |  |
| 98 | Stun to the Second Ball | tangent | ✅ |  | ⚠️ LỆCH | r0 expectedCue 14.7"; r1 expectedCue 10.6" |
| 99 | Stop and Go | stop | ❌ HỤT | r1 bi cái rơi | ⚠️ LỆCH | r1 expectedCue 22.6"; r1 objectBall 10.6" |
| 100 | Draw to a Narrow Zone | drawDistance | ✅ |  | ✅ |  |
| 101 | Soft Follow, Short Stop | followDistance | ✅ |  | ✅ |  |
| 102 | Natural Roll to the Two | naturalAngle | ✅ |  | ✅ |  |
| 103 | Three-Ball Rolling Position | naturalAngle | ✅ |  | ✅ |  |
| 104 | Follow to a Thin Cut | cutAngle | ✅ |  | ✅ |  |
| 105 | Called Side Bank | bank | ✅ |  | ⚠️ LỆCH | r0 lực thẻ 2→2.6; r0 preview≠Play 6.6" |
| 106 | Center Ball Pace | speedControl | ✅ |  | ✅ |  |
| 107 | Soft Side Pocket Stop | speedControl | ✅ |  | ✅ |  |
| 108 | Three-Ball Follow Pattern | pattern | ✅ |  | ✅ |  |
| 109 | Bank Without the Double Kiss | bank | ✅ |  | ⚠️ LỆCH | r0 preview≠Play 6.2"; r1 preview≠Play 14.0"; r2 lực thẻ 2.2→2.9; r2 preview≠Play 7.9" |
| 114 | PPC Layout 1 | pattern | ✅ |  | ✅ |  |
| 117 | PPC Layout 4 | pattern | ✅ | thứ tự tự do theo đề | ✅ |  |
| 118 | PPC Layout 5 | pattern | ✅ | thứ tự tự do theo đề | ✅ |  |
| 119 | PPC Layout 6 | pattern | ✅ | thứ tự tự do theo đề | ✅ |  |
| 110 | Twice-Plus-Tenths Bank | bank | ✅ |  | ⚠️ LỆCH | r0 objectBallBank 3.4"; r0 preview≠Play 6.5"; r1 objectBallBank 5.3"; r1 preview≠Play 10.3"; r2 objectBallBank 7.4"; r2 preview≠Play 14.1"; r3 objectBallBank 6.8"; r3/r4 lực thẻ 2.4→3.1; r3 preview≠Play 17.5"; r4 objectBallBank 8.8"; r4 preview≠Play 21.1" |
| 111 | Two-Rail Kick by Subtraction | kick | ❌ HỤT | r1 hụt | ⚠️ LỆCH | r0 expectedCue 5.5"; r0/r3 lực thẻ 1.5→2.6; r0 preview≠Play 19.0"; r1 expectedCue 30.1"; r1 preview≠Play 36.1"; r2 expectedCue 4.8"; r2 lực thẻ 1.5→2.0; r2 preview≠Play 14.9"; r3 expectedCue 7.9"; r3 preview≠Play 33.0" |
| 123 | Center Line | speedControl | ✅ | thứ tự tự do theo đề | ✅ |  |
| 130 | Land Mine | runout | ✅ | thứ tự tự do theo đề | ✅ |  |
| 113 | English Speed Check | english | ✅ |  | ✅ |  |
| 112 | One Layout, Three Answers | safety | ✅ |  | ⚠️ LỆCH | r0 expectedCue 40.5"; r0 preview≠Play 4.5"; r1 expectedCue 4.8"; r1 objectBallBank 75.6" |
| 120 | Rail Row Return | speedControl | ⛔ CHẶN | round không tăng: 1,2,,3,3,,4,,5; r1/r3 hụt; r1/r3 aimPocket khác guide; r2/r5/r7 bị chặn | ⚠️ LỆCH | r1 objectBall 55.4"; r3 objectBall 46.1" |
| 121 | Half-Ball Four Diamonds | naturalAngle | ✅ |  | ✅ |  |
| 122 | Compact Play | runout | ✅ |  | ✅ |  |
| 124 | Short-Side Back and Forth | speedControl | ✅ |  | ✅ |  |
| 129 | Rock Around the Clock | runout | ✅ | thứ tự tự do theo đề | ✅ |  |

## Đã kiểm và chưa phủ
**Đã kiểm bằng mô phỏng**: mọi ô trong bảng. Ngưỡng dùng là 2.25", số liệu gốc nằm ở `rows.json` trong scratchpad.

**Chưa phủ**:
- Video replay của drill 31.
- Ba drill chỉ có bi cái (50, 82, 85).
- Mức khoảng cách.
- Lượt chạy tự do của RackShotSolver.
- Độ đúng của engine so với bàn thật.
- Chưa bấm thử từng bài trên app.

**Suy đoán**: drill 43 đánh 15 bi theo layout, không theo số. Đề chỉ ghi "in a row" nên tôi xếp vào loại tự do. Cần anh chốt.
