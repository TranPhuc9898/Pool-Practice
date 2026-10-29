# Hiệu chỉnh engine bằng số đo bàn thật — 2026-10-18

**Xong là:** `sh scripts/calib-harness/run.sh` in 7 dòng (S, A, E, CD30±, CD45±), mỗi dòng có `sim=` nằm trong ±1 sd của `đo=` (n ≥ 10, ghi ngày đo), chạy trên đúng hằng số đang nằm trong `ShotPhysics.swift`; `sh scripts/position-harness/run.sh` in `rate=K/45` cho cú 1 và cú 2 trên engine mới.
**Cách làm:** harness Swift ngoài app (mẫu `scripts/rack-harness/`) dựng lại từng test bằng chính `ShotPhysics`, `run.sh` đổi `static let` thành `static var` trong bản chép để quét tham số, rồi mới sửa hằng trong app. Lý do: quyết định `docs/quyet-dinh/2026-10-17-position-3-bi.md` cấm bịa số, và cú 2 drill 23 hỏng đúng ở squirt + băng có phê, hai chỗ chưa có số đo nào.
**Đánh đổi:** chấp nhận engine khớp đúng một bàn (bàn anh đo), và mọi cú đang giải bằng engine (target drill 02/03/05, rack 18–20, preview Soạn bài) đổi theo hằng mới, để có số đo thay số đoán. Hiệu chỉnh xong mà cú 2 vẫn dưới 32/45 thì nghĩa là độ nhạy đó có thật, phải đổi layout chứ không đổi engine.
**Không làm:** TEST B (e_r đã chỉnh theo WPA, sim 0,828), F (lỗ), G (throw); swerve, massé; `railSinE` (hình học băng, giữ); sửa trần `240 * 20` ở `ShotPhysics.swift:355` hay đổi dt; profile nhiều bàn; sửa data drill cũ.

## Bước

- [x] 1. Harness 4 test trong `scripts/calib-harness/main.swift` + `run.sh` + `do.csv` (chỉ header `test,lan,gia_tri,ngay`): S = lệch ngang ở băng xa sau 80" khi tipX 0,5R; A = μr suy từ d, t của bi lăn 1 m/s; E = b để bi cái đứng ở 20", 2 m/s; CD = góc ra khi bi lăn 1 m/s vào băng 30° và 45°, phê ±0,4R → xong khi: `sh scripts/calib-harness/run.sh` exit 0, in 7 dòng (S, A, E, CD30+, CD30−, CD45+, CD45−), mỗi dòng có `sim=` và `đo=chưa có`; dòng S ra 3,5" ±0,1 (80·tan 2,5°).
  ✓ 2026-10-18 01:56 · `run.sh` exit 0, 7 dòng `đo=chưa có`: S 3.49" · A 0.0101 · E −0.29R · CD30± 43.0°/21.5° · CD45± 53.9°/42.3°
- [ ] 2. Phiếu đo trong `docs/research/2026-10-18-phieu-do-ban.md`: dụng cụ, cách đặt bi, cách đọc số từ video 240 fps (`ffmpeg` có sẵn để tách khung), cột ghi khớp `do.csv`; anh làm thử một lần test A → xong khi: `do.csv` có 1 dòng A do anh đo, `run.sh` dòng A có `đo=` kèm `n=1`.
- [ ] 3. Anh đo đủ S, A, E, CD theo phiếu, 10 lần mỗi ô, ghi vào `scripts/calib-harness/do.csv` (cần 2) → xong khi: `run.sh` in 7 dòng đều có `đo=` trung bình ± sd kèm `n=10`, và `sd/tb ≤ 15%` ở mọi dòng.
- [ ] 4. Fit trong `scripts/calib-harness/main.swift`, chế độ `run.sh --fit`, theo thứ tự squirtDeg ← S, muRoll ← A, muSlide ← E, railMu + spinDecay ← CD30 (cần 3) → xong khi: `sh scripts/calib-harness/run.sh --fit` in 5 tham số fit, và hai dòng CD45 (không dùng để fit) có sim trong ±1 sd của đo.
- [ ] 5. Chép 5 số fit vào `modules/pool-table/ios/Editor/ShotPhysics.swift`, mỗi hằng một comment `đo bàn` kèm ngày đo (cần 4) → xong khi: `sh scripts/calib-harness/run.sh` (không `--fit`) in 7 dòng sim trong ±1 sd; `git diff --stat` chỉ đổi `ShotPhysics.swift`.
- [ ] 6. Chạy lại harness drill 23: làm bước 1 của `.claude/ke-hoach/2026-10-17-position-3-bi.md` (dựng `scripts/position-harness/` từ bản nháp scratchpad), ghi K vào `## Phát sinh` của plan đó (cần 5) → xong khi: `sh scripts/position-harness/run.sh` in dòng `shot 1 … rate=K/45` và `shot 2 … rate=K/45`. Đạt 32 hay không là quyết định của plan kia, không phải của plan này.

## Vỡ ở đâu

- Đo tay tản mát quá tay (tốc 2 m/s ở E, phê 0,4R ở CD khó lặp đều) → kiểm bằng: ngưỡng `sd/tb ≤ 15%` ở bước 3; vượt thì dừng trước bước 4, sửa cách đo trong phiếu.
- railMu và spinDecay bù trừ nhau, fit khớp CD30 mà sai chỗ khác → kiểm bằng: CD45± giữ ngoài fit ở bước 4, lệch quá 1 sd thì dừng.
- Hằng mới làm cú drill cũ trượt lỗ → kiểm bằng: chạy `sh scripts/rack-harness/run.sh` trước và sau bước 5, so dòng `18|19|20: potted/total`; mở `/drill/02` trên simulator bấm Play shot, bi vẫn vào lỗ.

## Phát sinh
- 2026-10-18 · bước 1: A ở 1 m/s lăn 201" (5,1 m), dài hơn bàn 9 ft (2,54 m). Sim A chạy `approach` 1D không băng; mô hình hãm đều nên μr không theo tốc đầu. Phiếu đo dùng máng cho tốc thấp hơn để bi dừng trước băng.
- 2026-10-18 · bước 1: "cách 20"" ở E hiểu là khe giữa hai mép bi (tâm cách 22,25"), khớp sim −0,29R của research. Hiểu là tâm cách 20" thì ra −0,26R.
- 2026-10-18 · bước 2: E nhạy theo tốc (sim −0,38R ở 1,8 m/s, −0,23R ở 2,2 m/s), lệch ±10% tốc tay là đủ vượt sd 15%. Phiếu quy mỗi cú đứng (k, t) về tipY tương đương ở 2 m/s bằng công thức kín lấy từ mô hình trượt của `ShotPhysics`, đã khớp `stunTip` ở 1,8 / 2,0 / 2,2 m/s.
- 2026-10-18 · bước 2: A đo bằng hai vạch M1, M2 cộng chỗ dừng: μr = 2(√D1 − √D2)²/(g·t12²). Khi D2 = 0 công thức này trùng 2d/(g t²) của harness, và không cần bắt khoảnh khắc bi dừng.
- 2026-10-18 · bước 2: CD trong harness là góc tức thời ngay sau băng, camera không đọc được vì đường bi cong ngay (CD30+: dây cung 3–13 cm ra 59°, tức thời 43°). Đề xuất đổi `bank()` trong `scripts/calib-harness/main.swift` sang góc khi bi lăn lại (sim 68,1 / 49,1 / 74,9 / 68,7°). Việc này sửa artifact của bước 1 đã tick nên chờ anh duyệt. Phiếu đã viết theo góc lăn lại.
- 2026-10-18 · anh duyệt ("làm hết tất cả"): `bank()` trong `scripts/calib-harness/main.swift` đổi sang góc khi bi lăn lại. `run.sh` exit 0: CD30± 68.1°/49.1° · CD45± 74.9°/68.7°. S, A, E không đổi.
- 2026-10-18 · anh chọn làm drill 23 ngay trên engine hiện tại (đổi layout cho hai cú ≥32/45), plan này treo ở bước 2 chờ anh đo bàn. Đo xong thì fit, chép hằng, chạy lại harness drill 23.
