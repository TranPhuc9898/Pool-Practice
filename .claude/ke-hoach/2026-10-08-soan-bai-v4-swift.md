# Port Soạn bài v4.1 sang Swift — 2026-10-08

**Xong là:** trên simulator, `pooltraining://editor?fixture=d03`, phê phải 0.3R cao 0.4R lực 1.8: màn giống artifact v4.1 (segmented 3 ô, pad 2D, hai hình, sheet Thẻ bài), và `log stream` ra throw/squirt/điểm dừng khớp `node docs/prototypes/soan-bai-v4.check.js` ±0.1° và ±0.1".
**Cách làm:** vật lý trước, UI sau — vì mọi nhãn, hình và đường vẽ đều đọc từ `ShotPhysics`, port UI trước là vẽ số sai.
**Đánh đổi:** bỏ ba số khớp prototype v7 (e = 1, không throw); mốc mới là harness chạy trên chính prototype v4.1. Snapshot đổi `tip` → `tipX`/`tipY`.
**Không làm:** bước 3 và 6 của plan 2026-10-07 (vẫn ở đó), Android, lưu bài, vật lý TS, XCTest (hỏi trước), đổi `PoolTableSurface`, replay chậm 0.5×.

## Bước

- [x] 1. Vật lý: `ios/Editor/ShotPhysics.swift` thêm squirt, throw, e = 0.95, `solve` secant, `hit` tổng quát theo `Setup` (không cố định CUE/OBJ); harness `docs/prototypes/soan-bai-v4.check.js` nhận `cx cy ox oy pocket tipX tipY v` và ghi đè `K.CUE/OBJ/POCKET` → xong khi: `?fixture=d03` log 4 cú (0,0.4,1.8) (0,0,1.8) (0,−0.15,3.2) (0.3,0.4,1.8) khớp harness ±0.1° throw/squirt, ±0.1" stop; `runWith` avg vẫn dưới 1 ms
- [ ] 2. Model: `ios/Editor/PoolEditorModel.swift` + `src/PoolEditorView.tsx` + `src/app/editor.tsx` đổi `tip` → `tipX`/`tipY`, gỡ dòng `JSON.stringify(state.balls)` (cần 1) → xong khi: `npx tsc --noEmit` exit 0; nhấc tay khỏi pad thì `log stream` dòng `[editor] commit` có `tipX` và `tipY`
- [ ] 3. Pad 2D trong `ios/Editor/PoolShotPanel.swift`: `PoolTipPad` kéo hai chiều, kẹp bán kính 0.84R, hít 0 / 0.4 / stun dọc và 0 / gear ngang, nhãn Lăn/Tâm/Stun cách nhau ≥ 15pt, haptic `.selection` một lần mỗi lần hít, `accessibilityAdjustableAction` hai trục (cần 2) → xong khi: screenshot ở (0.3, 0.4) khớp pad trong artifact; log haptic đúng một dòng mỗi lần hít
- [ ] 3b. Bảng cú đánh v4.1 (gộp bước 3) trong `ios/Editor/PoolShotPanel.swift` + `src/app/editor.tsx` (view full-width, `PANEL` = 338): card #1C1C1E bo 36 lề 8, pad 2D 150×128 có leader và nhãn Stun/Lăn/Tâm, cột chữ Điểm đánh / phê / spin / trạng thái, hàng Lực có pill và thumb 28, hai nút 50pt; `ios/Editor/PoolShotFigures.swift` hình theo tỉ lệ 358×306 (cần 2) → xong khi: screenshot Bàn và Từ trên ở (0.3, 0.4, 1.8) đặt cạnh HTML v4.1 khớp bố cục và cùng số; log haptic đúng một dòng mỗi lần hít
- [ ] 4. Thanh tiêu đề và segmented: `src/app/editor.tsx` headerRight "Thẻ bài", `ios/Editor/PoolEditorView.swift` `Picker(.segmented)` 3 ô Bàn / Từ trên / Từ sau bi, đổi ô là dừng replay → xong khi: screenshot thấy segmented 3 ô kiểu hệ thống dưới tiêu đề; bấm Đánh ở ô khác thì tự về ô Bàn
- [x] 5. Hai hình trong `ios/Editor/PoolShotFigures.swift`: port `topFig` và `backFig` (toạ độ diamond, dải cơ, clipPath) (cần 1, 4) → xong khi: hai screenshot ở (0.3, 0.4, 1.8) khớp hai hình trong artifact, caption cùng số
- [ ] 6. Sheet Thẻ bài trong `ios/Editor/PoolShotCard.swift`: `.sheet` + `presentationDetents([.medium, .large])`, 4 dòng Đặt bi / Cú gợi ý / Bù ngắm / Bi trắng (cần 1) → xong khi: bấm Thẻ bài ra sheet 4 dòng cùng số với artifact; vuốt xuống đóng
- [ ] 7. Đo mượt: `?autodrag=1` kéo pad vòng tròn qua đúng đường code của tay, `CADisplayLink` ghi khung (cần 3) → xong khi: Release trên simulator, `log stream` ra p95 dưới 16.7 ms, không khung trên 33 ms trong 10 giây

## Vỡ ở đâu

- Drill 03 với vật lý mới không còn cú 1.8 m/s vào footRight → kiểm bằng: bước 1, dòng log (0,0.4,1.8) phải `scratch footRight` hoặc `gap 0`
- `solve` gọi tới 15 lần `hit` mỗi khung lúc kéo pad → kiểm bằng: bước 1 NSLog 100 lần `runWith`, trần 1 ms; vỡ thì cache theo (tipX, tipY, speed) làm tròn 0.01
- Harness JS chạy dt 1/240 còn Swift dt 1/200, lệch tích luỹ → kiểm bằng: bước 1 so cả bốn cú, lệch quá 0.1" thì đổi Swift sang 1/240

## Phát sinh

- File Swift mới trong module local không vào Pods project: phải `npx pod-install` trước `expo run:ios`, không thì "cannot find X in scope".
- Outfit không có glyph Vietnamese (cmap thiếu Ề Ỗ Ắ Ể Ạ Ả); hệ fallback sang SF, riêng Ề/Ỗ dấu chồng hai tầng nên nhãn sát mép canvas bị cắt mất dấu. Đã kẹp nhãn cách mép 12pt trong bước 5.
- Hình dùng nỉ `PoolTableTheme.tournament.clothLit` thay vì #1E5A87 của prototype để khớp bàn thật trong app. Cố ý.
- Thẻ bài: tiêu đề dùng tên lỗ và số bi thật; quãng bi cái tính từ polyline `Run.pts` vì `Run` không có trường travel.
- Replay OB vận tốc đang lấy vC·cos(cut) chứ chưa lấy vO sau throw; Picking còn kẹp trượt cơ 1D (hypot sau bước 3).
- `log show` không thấy NSLog; phải `/usr/bin/log stream` trước khi mở app.
- Bước 3b: JS thôi tính `h` theo insets (đoán sai header, thừa ~110pt dưới card); native view `flex: 1` rộng hết màn, SwiftUI tự chia, `PoolEditorView` ép khung bàn dọc rồi căn giữa. `headerLargeTitleEnabled: false` cho giống header 44 của HTML. Hằng `PANEL`/`SEGMENT` bên JS bỏ.
- `ShotPanelState` lặp lại logic trạng thái của `ShotCardText` (8 dòng); gộp lại là việc riêng.
- Phần haptic và kéo pad của 3b (và bước 2) vẫn chờ anh chạm thật trên simulator.
- v5 thay bước 4: không còn segmented. Đã port Soạn bài v5.2 sang Swift: bàn bên trái, hai ô Ngắm / Dày mỏng bên phải, chạm ô thì hình nở phủ vùng bàn; chữ Gen-Z (culê/kéo/phê), không đơn vị. `ShotCardText` đọc lại `ShotPanelState` nên hết lặp logic. Ô bước 4 để trống, "xong khi" cũ không còn đúng hướng, anh quyết.
