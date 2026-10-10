# Massé: nâng cơ θ cho engine Soạn bài, kèm trục ω — 2026-10-10

**Xong là:** chip "Massé 60°" trên panel làm bi cái cong đường trước khi chạm, và `node docs/prototypes/bi-cai-xoay.check.js --theta 60 …` không in LỆCH.
**Cách làm:** đoạn tiếp cận của bi cái chuyển từ `approach()` 1D sang mô phỏng số cùng bước với `simulate()`, cú đánh tính bằng `strike()` 3D của web — vì massé làm spin không còn song song hướng đi, đường thẳng tới ghost không còn đúng.
**Đánh đổi:** chấp nhận đoạn tiếp cận θ = 0 lệch analytic vài phần trăm inch (Euler dt 1/240 hai bên) để chỉ còn một đường code cho mọi θ.
**Không làm:** không bù squirt kiểu web (giữ `squirtDeg` 2,5°), không có Hướng đánh / Cách bi tự do, không đổi `stunTip`, không vẽ cơ nghiêng trong ô Dày mỏng.
Thay bước 5 và 6 của `.claude/ke-hoach/2026-10-09-dem-web-vao-soan-bai.md`.

## Bước

- [x] 1. `theta` xuyên TS→Swift: `EditorStateRecord` trong `modules/pool-table/ios/Editor/PoolEditorModel.swift`, `EditorState` trong `modules/pool-table/src/PoolEditorView.tsx`, state + param `?theta=` trong `src/app/editor.tsx`, `snapshot()` ghi và log θ → xong khi: mở `exp+pool-training://editor?theta=60`, `log stream` ra dòng `[editor] commit … θ 60`
- [x] 2. `ShotPhysics.swift`: `strike()` 3D (r×d, I = 0,4mR²) ra v, W, wz; `hit()` tích phân bi cái một mình bằng bước trượt của `simulate()` tới khi cách bi mục tiêu 2R, trả thêm `Run.pre: Trace`; `solve()`/`runWith()` nhận `theta` → xong khi: `node docs/prototypes/bi-cai-xoay.check.js` (9 dòng mặc định) không có LỆCH
- [x] 3. `docs/prototypes/bi-cai-xoay.check.js` thêm `--theta N` và `--aim-ghost` (hai bên cùng ngắm thẳng tâm ghost, không solve) (cần 2) → xong khi: `node docs/prototypes/bi-cai-xoay.check.js --theta 60 --aim-ghost 25 70 25 30 footLeft 0.4 0 3` ra hai dòng web / swift, không LỆCH
- [x] 4. `PoolShotReplay.swift` dựng đoạn trước chạm từ `Run.pre` thay `approach()`; `PoolEditorGuides.swift` vẽ đường tới ghost theo `pre.pts` (cần 2) → xong khi: mở `?fixture=play@0.5&theta=60&tipX=0.4&speed=2` (anh đổi từ v 3 sang v 2 ngày 10/10 vì v 3 võng 0,4" không thấy), screenshot thấy vệt bi cái cong, không nằm trên đường thẳng tới ghost; `?fixture=play@0.5` không theta vẫn thẳng
- [x] 5. `PoolShotPanel.swift`: slider "Nâng cơ" 0–75° dưới Lực, preset Massé (0,4 / 0 / θ 60 / 3) vào `PoolEditorModel.presets`, `cardHeight`/`height` cộng 44 (cần 1) → xong khi: mở `?fixture=preset:Massé 60°`, log ra `tip (0.40, 0.00) θ 60 v 3.0`, screenshot bàn không bị panel che
- [x] 6. Trục ω trên bi cái lúc chạy trong `PoolShotReplay.swift` (lớp vẽ), ẩn khi tắt Đường đi → xong khi: `?fixture=play@0.3&tipX=0.45` screenshot thấy chấm trục giữa bi (trục đứng) (kiểm bằng `play@0.05&tipX=0.45&tip=0` ngày 10/10, xem Phát sinh: fixture gốc trượt cơ và ở 0,3 s bi đã lăn); `?fixture=play@0.3&tip=-0.5` thấy vạch ngang vuông góc hướng đi
- [x] 7. Đóng plan cũ: ghi vào `## Phát sinh` của `2026-10-09-dem-web-vao-soan-bai.md` rằng bước 5–6 chuyển sang file này, chuyển nó vào `.claude/ke-hoach/xong/` → xong khi: `ls .claude/ke-hoach/*.md` không còn `2026-10-09-dem-web-vao-soan-bai.md`

## Vỡ ở đâu

- Tích phân số đoạn tiếp cận lệch analytic ở cú kéo dài, 9 dòng check hiện có bật LỆCH → kiểm bằng: bước 2 chạy check trước khi đụng replay; lệch thì quay về numeric chỉ khi θ > 0
- `solve()` secant trên đường cong có nhiều nghiệm hoặc không hội tụ với θ lớn → kiểm bằng: chip Massé trên bàn mặc định, panel không báo "Lực yếu quá", `err` trong log dưới 0,01 rad
- Panel 426 che bàn trên màn nhỏ → kiểm bằng: screenshot bước 5, bàn còn thấy đủ sáu lỗ

## Phát sinh
- Bước 1: Metro chạy từ hôm qua không thấy `editor.tsx` đổi (console.log không ra), mất 20 phút nghi native. Khởi động lại `expo start --clear` là xong. Lần sau JS không ăn thì restart Metro trước.
- Bước 2: đoạn tiếp cận chỉ mô phỏng bi cái + bi mục tiêu; bi khác chắn trên đường cong massé vẫn bị xuyên qua (đường thẳng thì `shotOf` đã chặn từ trước). Muốn đúng phải đưa cả bàn vào `untilContact`, để sau.
- Bước 3: `--aim-ghost` cần `runWith(..., aim:)` nên đụng thêm `ShotPhysics.swift` 3 dòng. Cú θ 45° + tipX 0,3 + kéo 0,2 lệch hướng bi 1,6° (web không có throw, Swift có): chênh đã biết từ header check.js, không phải lỗi tiếp cận.
- Bước 4: code xong, build xong, nhưng fixture trong "xong khi" (drill 3, θ 60, tipX 0,4, v 3) cho đường võng chỉ 0,41" trên 28" tiếp cận (harness đo từ `Run.pre`), ~4 px trên screenshot, mắt thấy thẳng. Cùng thế bi ở v 2 võng 43" và bi cái trượt qua bi mục tiêu, screenshot thấy cong rõ (`scratchpad/s4-v2.png`). Massé ở engine này có ngưỡng tốc độ rất dốc: 3 m/s gần như thẳng, 2 m/s cong hết bàn. Chưa tick, chờ anh quyết fixture. Metro lại phục vụ bundle cũ (vẫn in `[editor] params` đã xoá), theta vẫn vào vì mapping có từ bước 1.
- Bước 6: hai fixture trong "xong khi" không chạy được y nguyên trên bàn mặc định (drill 3, tipY 0,4): `tipX=0.45` cộng tipY 0,4 ra 0,60 > `tipMax`, panel báo Trượt cơ, không Đánh; và ở t = 0,3 s bi 1,8 m/s đã lăn (trượt hết sau ~0,26 s) nên trục nghiêng 56° so với mặt bàn, không đứng. Kiểm bằng `play@0.05&tipX=0.45&tip=0` (chấm giữa bi) và `play@0.3&tip=-0.5` (vạch vuông góc). Bản đầu vẽ trục sai dấu (lệch ~50° so với vuông góc), do chép quy ước khung bi 3D lật y sang màn hình; sửa thành (wy, −wx).
- Bước 7 làm trước bước 6 vì không phụ thuộc build.
