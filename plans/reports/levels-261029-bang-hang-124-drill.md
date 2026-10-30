# Bảng hạng 124 drill — chờ anh duyệt

Sinh từ `src/pool-engine/levels.ts` và `groups.ts` ngày 2026-10-29. Hạng là phán đoán giáo trình theo kỹ năng và độ khó thực tế của bài, chưa có nguồn quy đổi chính thức. Anh sửa dòng nào thì em đổi trong `LEVEL_BY_NUMBER`.

## Tổng

| Hạng | H | G | F | E | D | C− | C+ | B− | B+ | A− | A+ | PRO |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Số drill | 14 | 10 | 13 | 14 | 14 | 15 | 17 | 13 | 10 | 7 | 3 | 2 |

Nhóm: Fundamentals 37, Cue Ball Control 24, Position Play 25, Kick 4, Bank 9, Spin 8, Advanced 25.

Ngưỡng gợi ý "Next" đề xuất: hạng qua khi pass ≥ 2/3 số drill của hạng (H cần 10/14, C+ cần 12/17).

## Chỗ em không chắc

- 2026-10-30, phương án B (`plans/reports/brainstorm-261030-1012-level-h.md`): 36 → F, 49 → E, 03 G → H, thêm drill 131. Tổng giờ là 125 drill. 33 qua khi mỗi round vào 3/5 (`roundQuota`).
- 2026-10-30, H lên 14 bài: thêm 132–138 theo deep-research-report, toạ độ dò lại trên harness `ONLY=H`. Bỏ 139 Safety vì engine chưa chấm chạm hợp lệ. Tổng giờ là 132 drill.

- A+ chỉ 3 bài, PRO chỉ 2 bài. Phase 5 thêm Corner-5 4 băng vào A+, nhưng PRO vẫn mỏng.
- Kick chỉ 4 bài cho tới khi phase 5 thêm 6 bài.
- RDS chia theo file: 74 → G, 75 → E, 76 → D, 78 → C+, 81 → B+.
- Câu mốc là tiếng Anh vì UI app đang tiếng Anh.

### H · 14 drill

Mốc: Ten straight-ins in a row, cue ball stops dead

| # | Tên | Skill | Diff | Stage | Nhóm |
|---|---|---|---|---|---|
| 1 | Straight-In | straightStroke | 1 | 1 | Fundamentals |
| 2 | Stop Shot | stop | 1 | 1 | Fundamentals |
| 3 | Follow | follow | 2 | 2 | Fundamentals |
| 32 | 10 Straight-In in a Row | straightStroke | 1 | 1 | Fundamentals |
| 33 | Short Stop / Follow / Draw | straightStroke | 1 | 1 | Fundamentals |
| 99 | Stop and Go | stop | 1 | 1 | Fundamentals |
| 131 | Short Straight-In Left/Right | straightStroke | 1 | 1 | Fundamentals |
| 132 | Easy Cut 10° Left/Right | cutAngle | 1 | 1 | Fundamentals |
| 133 | Easy Cut 15° Left/Right | cutAngle | 1 | 1 | Fundamentals |
| 134 | Basic Follow | follow | 1 | 1 | Fundamentals |
| 135 | Basic Draw | draw | 1 | 1 | Fundamentals |
| 136 | Three-Zone Speed Control | speedControl | 2 | 2 | Cue Ball Control |
| 137 | Two-Ball Rolling Sequence | pattern | 2 | 2 | Position Play |
| 138 | Short Position Wide Zone | drawAngle | 2 | 2 | Cue Ball Control |

### G · 10 drill

Mốc: Easy cuts, stop and follow on demand

| # | Tên | Skill | Diff | Stage | Nhóm |
|---|---|---|---|---|---|
| 34 | Ring Around the Side | cutAngle | 1 | 1 | Fundamentals |
| 35 | 15-Ball Lineup | lineUp | 1 | 1 | Fundamentals |
| 37 | Long Diagonal Straight-In | straightStroke | 2 | 2 | Fundamentals |
| 38 | BU F1 Cut Progression | cutAngle | 2 | 2 | Fundamentals |
| 39 | BU F6 Ball Pocketing | cutAngle | 2 | 2 | Fundamentals |
| 40 | Ride the Rails | cutAngle | 2 | 2 | Fundamentals |
| 41 | Jewett Progressive Cut | cutAngle | 2 | 2 | Fundamentals |
| 74 | RDS Levels 1–3 | test | 1 | 1 | Advanced |
| 97 | Wide Zones: Stop, Follow, Draw | threePositions | 1 | 1 | Cue Ball Control |
| 98 | Stun to the Second Ball | tangent | 1 | 1 | Cue Ball Control |

### F · 13 drill

Mốc: Thin cuts and draw a diamond back

| # | Tên | Skill | Diff | Stage | Nhóm |
|---|---|---|---|---|---|
| 5 | Draw | draw | 2 | 2 | Fundamentals |
| 7 | Tangent Line | tangent | 3 | 2 | Cue Ball Control |
| 21 | Spot Shot Challenge | spotShot | 3 | 3 | Fundamentals |
| 22 | Cut Angle Ladder | cutAngle | 3 | 3 | Fundamentals |
| 24 | Natural Angle | naturalAngle | 3 | 2 | Cue Ball Control |
| 36 | Jewett Spot Progression | spotShot | 1 | 1 | Fundamentals |
| 42 | The Ladder | cutAngle | 3 | 3 | Fundamentals |
| 44 | Tom Ross Rail Shot | cutAngle | 3 | 3 | Fundamentals |
| 45 | Edge Love | cutAngle | 3 | 3 | Fundamentals |
| 46 | Jal Circle | cutAngle | 3 | 3 | Fundamentals |
| 50 | Lag Ladder | speedControl | 2 | 2 | Cue Ball Control |
| 51 | Five-Level Draw | drawDistance | 2 | 2 | Cue Ball Control |
| 70 | Soft Break from the Box | break | 2 | 2 | Advanced |

### E · 14 drill

Mốc: Follow and draw to a set zone at three speeds

| # | Tên | Skill | Diff | Stage | Nhóm |
|---|---|---|---|---|---|
| 4 | Follow Distance | followDistance | 2 | 2 | Cue Ball Control |
| 6 | Draw Distance | drawDistance | 3 | 3 | Cue Ball Control |
| 8 | Three Positions | threePositions | 4 | 4 | Cue Ball Control |
| 13 | Red-Black | correctSide | 3 | 2 | Position Play |
| 29 | Break: 1 to Side | break | 4 | 4 | Advanced |
| 30 | Break: Squat | break | 3 | 4 | Advanced |
| 47 | Combo Progression | combo | 3 | 3 | Fundamentals |
| 49 | Soft Touch | speedControl | 1 | 1 | Cue Ball Control |
| 52 | BU F8 Grid Target | speedControl | 3 | 3 | Cue Ball Control |
| 53 | Follow Matrix | follow | 3 | 3 | Fundamentals |
| 56 | Kill the Cue Ball | stop | 4 | 4 | Fundamentals |
| 75 | RDS Levels 4–6 | test | 3 | 3 | Advanced |
| 109 | Bank Without the Double Kiss | bank | 2 | 2 | Bank |
| 114 | PPC Layout 1 | pattern | 2 | 2 | Position Play |

### D · 14 drill

Mốc: One-rail position and one-rail kicks

| # | Tên | Skill | Diff | Stage | Nhóm |
|---|---|---|---|---|---|
| 9 | One Rail | oneRail | 4 | 4 | Position Play |
| 11 | Wagon Wheel | wagonWheel | 4 | 4 | Position Play |
| 18 | Rail Cut · Bachelors | railCut | 3 | 3 | Fundamentals |
| 25 | Draw Trisect | drawAngle | 4 | 4 | Cue Ball Control |
| 26 | English Check | english | 3 | 3 | Spin |
| 43 | Frozen Ball Every Diamond | cutAngle | 3 | 4 | Fundamentals |
| 54 | Draw Matrix | draw | 4 | 4 | Fundamentals |
| 55 | Random A→B | speedControl | 3 | 4 | Cue Ball Control |
| 64 | BU S6 One-Rail Kick | kick | 3 | 4 | Kick |
| 65 | Shallow One-Rail Kick | kick | 3 | 4 | Kick |
| 76 | RDS Levels 7–9 | test | 3 | 3 | Advanced |
| 82 | NPL Gate | english | 3 | 4 | Spin |
| 121 | Half-Ball Four Diamonds | naturalAngle | 4 | 4 | Cue Ball Control |
| 124 | Short-Side Back and Forth | speedControl | 4 | 4 | Cue Ball Control |

### C− · 15 drill

Mốc: Three-ball patterns and simple banks

| # | Tên | Skill | Diff | Stage | Nhóm |
|---|---|---|---|---|---|
| 12 | Line of Balls | lineUp | 3 | 3 | Fundamentals |
| 14 | L-Drill | lineUp | 4 | 4 | Fundamentals |
| 15 | Three-Ball, 30° Max | runout | 3 | 3 | Position Play |
| 23 | Three-Ball Position | runout | 3 | 3 | Position Play |
| 27 | Bank Ghost Pocket | bank | 3 | 3 | Bank |
| 48 | Frozen Pair & Throw | english | 3 | 4 | Spin |
| 57 | Roll Up and Snuggle | safety | 3 | 3 | Advanced |
| 58 | Equal Separation | safety | 3 | 3 | Advanced |
| 66 | Cross-Side Bank | bank | 3 | 4 | Bank |
| 83 | One-Diamond Squirt | english | 3 | 4 | Spin |
| 84 | Throw Check | english | 3 | 4 | Spin |
| 85 | 1 Tip = 1 Diamond | english | 3 | 4 | Spin |
| 102 | Natural Roll to the Two | naturalAngle | 5 | 5 | Cue Ball Control |
| 117 | PPC Layout 4 | pattern | 4 | 4 | Position Play |
| 123 | Line of Balls (VEPP) | pattern | 4 | 4 | Position Play |

### C+ · 17 drill

Mốc: Five-ball runs and basic safeties

| # | Tên | Skill | Diff | Stage | Nhóm |
|---|---|---|---|---|---|
| 10 | Two-Ball Pattern | pattern | 5 | 5 | Position Play |
| 19 | Rail Cut · Masters | railCut | 4 | 4 | Fundamentals |
| 28 | Long Bank | bank | 4 | 4 | Bank |
| 59 | Straddle | safety | 3 | 4 | Advanced |
| 60 | BU S5 Snooker Behind a Cluster | safety | 3 | 4 | Advanced |
| 67 | Cross-Side Bank: Five Spots | bank | 3 | 4 | Bank |
| 68 | Cross-Corner Bank Ladder | bank | 4 | 4 | Bank |
| 77 | 9-Ball Progress | test | 4 | 4 | Advanced |
| 78 | RDS Levels 10–12 | test | 4 | 4 | Advanced |
| 86 | Outside Draw / Inside Follow | english | 4 | 4 | Spin |
| 89 | One- and Two-Rail Kicks | kick | 5 | 5 | Kick |
| 100 | Draw to a Narrow Zone | drawDistance | 5 | 5 | Cue Ball Control |
| 101 | Soft Follow, Short Stop | followDistance | 5 | 5 | Cue Ball Control |
| 103 | Three-Ball Rolling Position | naturalAngle | 5 | 5 | Cue Ball Control |
| 113 | English Speed Check | english | 5 | 5 | Spin |
| 118 | PPC Layout 5 | pattern | 4 | 4 | Position Play |
| 119 | PPC Layout 6 | pattern | 4 | 4 | Position Play |

### B− · 13 drill

Mốc: Two-rail kicks, long banks, tight safeties

| # | Tên | Skill | Diff | Stage | Nhóm |
|---|---|---|---|---|---|
| 16 | No-Rail T | noRail | 5 | 5 | Position Play |
| 20 | Rail Cut · Doctorate | railCut | 5 | 5 | Fundamentals |
| 31 | Twelve-Ball Rail Pattern | pattern | 5 | 5 | Position Play |
| 61 | Bank the 7 Long, Hide Behind the 8 | safety | 4 | 4 | Advanced |
| 62 | Two-Rail Safety Behind the 9 | safety | 4 | 4 | Advanced |
| 63 | Thin Hit, Freeze Beside the Stripe | safety | 4 | 4 | Advanced |
| 69 | Bank to Every Pocket | bank | 4 | 4 | Bank |
| 72 | Jump the Gap | jump | 4 | 4 | Advanced |
| 79 | Equal Offense | test | 4 | 4 | Advanced |
| 87 | Last Three, Many Pockets | runout | 5 | 5 | Position Play |
| 110 | Twice-Plus-Tenths Bank | bank | 5 | 5 | Bank |
| 111 | Two-Rail Kick by Subtraction | kick | 5 | 6 | Kick |
| 120 | Rail Row Return | speedControl | 5 | 5 | Cue Ball Control |

### B+ · 10 drill

Mốc: Runs out a 9-ball rack in 3 of 10 tries

| # | Tên | Skill | Diff | Stage | Nhóm |
|---|---|---|---|---|---|
| 17 | 9-Ball Runout | runout | 5 | 5 | Position Play |
| 71 | Break Evaluation | break | 3 | 6 | Advanced |
| 73 | Progressive Massé | masse | 4 | 4 | Advanced |
| 81 | RDS Levels 13–16 | test | 5 | 5 | Advanced |
| 88 | Problem Ball First | pattern | 5 | 5 | Position Play |
| 90 | Pressure Line | runout | 5 | 5 | Position Play |
| 104 | Follow to a Thin Cut | cutAngle | 5 | 6 | Fundamentals |
| 105 | Called Side Bank | bank | 5 | 6 | Bank |
| 112 | One Layout, Three Answers | safety | 5 | 5 | Advanced |
| 129 | Rock Around the Clock | runout | 5 | 5 | Position Play |

### A− · 7 drill

Mốc: Wins the safety battle and the push-out

| # | Tên | Skill | Diff | Stage | Nhóm |
|---|---|---|---|---|---|
| 91 | 9-Ball Scatter | runout | 5 | 5 | Position Play |
| 93 | Safety Exchange | safety | 5 | 6 | Advanced |
| 94 | Push-Out Choice | safety | 5 | 6 | Advanced |
| 106 | Center Ball Pace | speedControl | 5 | 6 | Cue Ball Control |
| 107 | Soft Side Pocket Stop | speedControl | 5 | 6 | Cue Ball Control |
| 108 | Three-Ball Follow Pattern | pattern | 5 | 6 | Position Play |
| 130 | Land Mine | runout | 5 | 5 | Position Play |

### A+ · 3 drill

Mốc: Call-pocket 10-ball runouts, controlled break

| # | Tên | Skill | Diff | Stage | Nhóm |
|---|---|---|---|---|---|
| 80 | 10-Ball Ghost | test | 4 | 6 | Advanced |
| 92 | 10-Ball Called Runout | runout | 5 | 6 | Position Play |
| 95 | Controlled Break | break | 5 | 6 | Advanced |

### PRO · 2 drill

Mốc: Runs racks under match pressure

| # | Tên | Skill | Diff | Stage | Nhóm |
|---|---|---|---|---|---|
| 96 | Pressure 9-Ball | runout | 5 | 6 | Position Play |
| 122 | Compact Play | runout | 5 | 6 | Position Play |
