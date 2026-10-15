# RackRun ball in hand cho Rail Cut — 2026-10-15

**Xong là:** `sh scripts/rack-harness/run.sh` in `18: 7/7 moved 0`, `19: 11/11 moved 0`, `20: 15/15 moved 0`. Trên simulator mở `pooltraining://drill/20`, bấm Play, burst cuối thấy bàn chỉ còn bi cái.
**Cách làm:** thêm chế độ `inHand` vào `startRack` và một solver thuần `RackInHandSolver.swift`. Mỗi cú solver tự đặt bi cái rồi chọn bi và lỗ tuỳ ý, cú nào bi cái chạm bi khác thì loại. Lý do: hạ tầng chuỗi replay đã có sẵn, luật D27 (BU) chỉ khác runout ở chỗ đặt bi cái và thứ tự bi.
**Đánh đổi:** chấp nhận để solver tự chọn thứ tự và chỗ đặt bi cái, có thể khác cách người giỏi dọn bàn. Đổi lại có minh hoạ đủ 15 cú mà không cần soạn tay từng cú (schema v2). Repo thêm một harness `swiftc` trong `scripts/`.
**Không làm:** schema v2 `shots[]`. Không đổi `RackShotSolver` hay luật runout của drill 15/17. Không thêm UI mới (nhãn "Shot 3/15", nút đặt bi). Không tự chấm Pass/Miss từ replay. Không làm luật 2 lượt lấy lượt tốt.

## Bước

- [x] 1. Lát mỏng đầu-cuối. Tạo `modules/pool-table/ios/Editor/RackInHandSolver.swift`: chỉ Foundation/CoreGraphics, không dùng `DrillTargetSolver`. Bản ngây thơ: với mỗi bi × lỗ, đặt bi cái sau ghost 12", lấy cú đầu tiên `shotOf` không bad. Thêm `inHand` vào `startRack` trong `PoolEditorRack.swift`, sửa gate ở `PoolEditorView.swift:101` cho nhận `railCut` → xong khi: `npx expo run:ios` build xong. Mở `pooltraining://drill/18`, bấm Play (212,757), burst thấy cú 2 bắt đầu với bi cái ở chỗ khác chỗ cú 1 dừng.
  ✓ 2026-10-15 · expo run:ios EXIT 0 (0 error). Burst drill 18: cú 1 bi cái dừng ~(1,20), cú 2 bắt đầu ở (1.3,89) cạnh bi 2. Chuỗi dọn hết 7 bi
- [x] 2. Harness `scripts/rack-harness/run.sh` + `main.swift`. Bỏ `ShotPhysicsFixture` khỏi bản chép bằng `sed '/^enum ShotPhysicsFixture/,$d'`. Biên dịch cùng `RackPlanner.swift`, `RackSim.swift`, `RackInHandSolver.swift`. Layout 18/19/20 chép từ `src/pool-engine/drills/18…20-*.ts`, đổi sang inch (x·50, y·100) → xong khi: `sh scripts/rack-harness/run.sh` exit 0, in một dòng mỗi cú (bi, lỗ, ms, số bi bị chạm) và ba dòng tổng dạng `18: 5/7 moved 1`.
  ✓ 2026-10-15 · run.sh EXIT 0, dòng cú `18 #1 b1→footLeft cue (1.8,39.2) ms 0 moved 0 in`, tổng `18: 7/7 moved 0` · `19: 5/11 moved 0` · `20: 1/15 moved 0`
- [x] 3. Luật D27 trong solver: loại cú có `moved` không rỗng, scratch, combo (cần 2 xong trước) → xong khi: `run.sh` ra `moved 0` trên cả ba dòng tổng.
  ✓ 2026-10-15 · run.sh: `18: 7/7 moved 0` · `19: 5/11 moved 0` · `20: 1/15 moved 0`, solver lọc qua `RackInHandSolver.legal`
- [x] 4. Đặt bi cái theo lưới khoảng cách × góc cắt, xét mọi bi, nhìn trước một tầng để không tự chặn bi còn lại → xong khi: `run.sh` ra `18: 7/7`, `19: 11/11`, `20: 15/15`, và mọi dòng cú có ms ≤ 1500.
  ✓ 2026-10-15 · run.sh: 18: 7/7 moved 0 · 19: 11/11 moved 0 · 20: 15/15 moved 0 · ms lớn nhất 93
- [x] 5. Cú 1 dùng `cueBall`, `objectBalls[0]`, `targetPocket` của drill để khớp hình tĩnh. Từ cú 2 mới ball in hand. Harness kiểm cú mẫu. Nếu cú mẫu chạm bi (drill 20 đang đè bi 9) thì sửa dữ liệu trong `src/pool-engine/drills/20-rail-cut-doctorate.ts` → xong khi: `run.sh` in `shot1 ok moved 0` cho 18, 19, 20.
  ✓ 2026-10-15 · run.sh: `18 shot1 ok moved 0` · `19 shot1 ok moved 0` · `20 shot1 ok moved 0`; cú mẫu drill 20 không chạm bi 9, không sửa file drill
- [x] 6. Kiểm app với `PoolEditorRack.swift` đã sửa ở bước 1–5, build lại → xong khi: burst Play drill 20 tấm cuối chỉ còn bi cái. Burst Play drill 17 vẫn thấy từ 2 cú nối nhau trở lên.
  ✓ 2026-10-15 · expo run:ios EXIT 0 (0 error). Burst drill 20: 70 tấm, từ tấm ~37 chỉ còn bi cái. Burst drill 17: 9 cú nối nhau, bi cái đi tiếp từ chỗ dừng, dọn hết bàn
  ✓ 2026-10-15 · build lại sau sideMaxAngle: expo run:ios EXIT 0 (0 error, 3 warning). Burst drill 20: 70 tấm, từ tấm ~46 chỉ còn bi cái. Burst drill 17: 40 tấm, bi 1→9 nối nhau, tấm cuối chỉ còn bi cái
- [x] 7. `npm run lint` và `npm run typecheck` → xong khi: cả hai exit 0.
  ✓ 2026-10-15 · npm run lint EXIT 0 · npm run typecheck EXIT 0

## Vỡ ở đâu

- ShotPhysics xử lý bi frozen sát băng sai, cú rail cut luôn bad → kiểm bằng: bước 2 in `why` của `shotOf` cho mỗi cú bị loại.
- Lưới đặt bi × 15 bi × 6 lỗ quá nặng, cú đầu trên máy chờ lâu → kiểm bằng: cột ms của `run.sh`. Trên simulator, đo từ lúc bấm Play tới frame đầu của burst.
- Bản chép trong harness lệch code app → kiểm bằng: `run.sh` chép file mới mỗi lần chạy, không giữ bản cũ.

## Phát sinh

- `ShotPhysics.Run.moved` chứa cả bi đứng yên (`Trace.moved` = `pts.count > 1`, `simulate` lấy mẫu mọi bi). `RackShotSolver` phạt `0.15 * r.moved.count` nên đang phạt đều mọi cú theo số bi trên bàn. Harness đếm bằng `hit != nil || pocket != nil`. Chưa sửa `RackShotSolver` (plan cấm).
- Giữa bước 5 và 6, phiên chính sửa `ShotPhysics.shotOf`: loại cú vào lỗ giữa khi góc tới > `sideMaxAngle` 60° (bi sát băng chạy dọc băng vào lỗ giữa, ngoài đời không vào). Không sửa lại ShotPhysics. Harness sau sửa vẫn 7/7 · 11/11 · 15/15 moved 0, không còn cú `→side`. Build bước 6 lúc 09:14 sớm hơn sửa đổi 09:18, nên build và burst lại.
