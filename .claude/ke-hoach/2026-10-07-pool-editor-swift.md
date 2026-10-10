# Drill Editor native: PoolEditorView — 2026-10-07

**Xong là:** trên simulator, mở `pooltraining://editor`, bày Drill 03, đầu cơ 0.4R lực 1.8 m/s thì đường bi cái đỏ vào lỗ footRight; Lưu → Copy JSON có `shot` và `expectedCuePath`.
**Cách làm:** port prototype v7 (`docs/prototypes/drill-editor-v7.html`) thành `PoolEditorView` trong `modules/pool-table/ios/Editor/`. Swift giữ bàn, khay bi, guide, bảng cú đánh và vật lý. JS giữ route, undo/redo, form, export. Chỉ bắn event lúc nhấc tay, vì bridge mỗi khung hình là chỗ giật.
**Đánh đổi:** vật lý chỉ có bản Swift. TS không tự tính được `expectedCuePath`, không soi được 10 drill có sẵn; phải lấy đường từ event `onCommit`. Đổi lại không phải giữ hai bản vật lý khớp nhau.
**Không làm:** Android, ghi chú chữ, lưới, lưu vào "Bài của tôi", bản vật lý TS, XCTest (hỏi trước), gỡ `cueBallTargetZones` (đổi schema, plan riêng).

## Bước

- [x] 1. Lát mỏng: `ios/Editor/PoolEditorView.swift` (bàn + bi từ prop `state`, kéo 1:1, thả bắn `onCommit` cả state), đăng ký trong `PoolTableModule.swift`, `src/PoolEditorView.tsx`, route `src/app/editor.tsx` in JSON state cuối → xong khi: `LANG=en_US.UTF-8 npx expo run:ios` exit 0; kéo bi cái, thả, chữ trên màn đổi `x` đúng chỗ thả và bi không giật về chỗ cũ
- [x] 2. Vật lý `ios/Editor/ShotPhysics.swift` (shotOf, approach, cueRun, runWith, stunTip, fraction), đọc từ prototype → xong khi: mở editor với `?fixture=d03`, `log stream` ra đủ ba dòng khớp prototype ±0.1": tip 0.4 v 1.8 scratch footRight; tip 0 v 1.8 f 1.00 dừng cách bi 1 25.2"; tip −0.15 v 3.2 f 0.00 dừng cách 2.2"
- [ ] 3. Chọn bi → chọn lỗ trong `ios/Editor/PoolEditorPicking.swift`: bi khác mờ 40%, viền gold, sáu lỗ sáng, vùng chạm lỗ 44pt, haptic UIKit `.selection` hoặc `.warning` → xong khi: chạm bi 1 thì screenshot thấy 6 lỗ gold và mọi đường tắt; chạm lỗ góc bằng mép ngón vẫn nhận
- [x] 4. Guide trong `ios/Editor/PoolEditorGuides.swift` (đường bi mục tiêu, ghost, điểm chạm có quầng, tangent 12", đường bi cái theo màu spin, nhánh 9", đỏ khi scratch hoặc thiếu lực, hình quạt khi kéo) (cần 2) → xong khi: Drill 03 với ba cặp tip/lực ở bước 2 cho ba screenshot khớp artifact v7 cùng cặp
- [ ] 5. Bảng cú đánh `ios/Editor/PoolShotPanel.swift`: mặt bi cái, vạch lăn và stun, thanh lực kéo tương đối, `accessibilityAdjustableAction` → xong khi: ở 3.2 m/s kéo đầu cơ xuống thì nhãn ra "thấp 0.15R → stun", log haptic ra đúng một dòng mỗi lần hít vạch; Accessibility Inspector tăng 0.05R
- [ ] 6. Khay bi kéo vào bàn, kéo ra mép là bỏ (Swift); undo/redo, Lưu, Copy JSON trong `src/app/editor.tsx` → xong khi: kéo bi 9 vào bàn, Undo thì bi 9 biến mất; `xcrun simctl pbpaste booted` ra JSON có `shot.tipY`, `shot.speedMps`, `expectedCuePath`
- [ ] 7. Đo mượt: `?autodrag=1` cho bi cái tự chạy vòng quanh bi 1 qua đúng đường code của kéo tay, `CADisplayLink` ghi thời gian khung → xong khi: build Release trên simulator, `log stream` ra p95 dưới 16.7 ms, không khung nào trên 33 ms trong 10 giây

## Vỡ ở đâu

- JS đẩy prop `state` mới về sau commit làm bi nháy chỗ cũ → kiểm bằng: bước 1, thả liên tiếp 10 lần nhanh, quay màn hình xem từng khung
- Ba lần mô phỏng mỗi khung lúc kéo (cú chính + hai nhánh) vượt ngân sách → kiểm bằng: bước 2 NSLog thời gian 100 lần `runWith` trên máy, cần dưới 1 ms một lần
- Simulator chạy GPU của Mac, nhanh hơn iPhone, và không rung → kiểm bằng: số ở bước 7 phải dư ít nhất 2 lần ngân sách; haptic chỉ kiểm qua log

## Phát sinh
- Bước 2: số "dừng cách 2.2"" trong plan là làm tròn sai; prototype chạy node ra 2.2513", f −0.0085. Swift ra 2.251", f −0.0085, ba dòng khớp tới 3 chữ số. `runWith` trung bình 0.338 ms (Debug, simulator), dưới trần 1 ms.
- Bước 1: lần mở đầu `onCommit` bắn khi chưa ai kéo bi, chưa rõ nguồn. Đã sửa lỗi đọc `nativeEvent` muộn trong `src/app/editor.tsx`.
- Ngoài plan, anh yêu cầu: vẽ lại PoolShotPanel (chữ vạch ra ngoài bi, dòng trạng thái/lỗi riêng) + nút Đánh chạy thử cú (`PoolShotReplay.swift`), PANEL 132→184.
- Ngoài plan, anh yêu cầu: đầu cơ kéo tới 0.85R (quá 0.6R là trượt cơ, không mô phỏng), thang lực theo Dr. Dave, nút "Đường đi" tắt đường bi cái và bi mục tiêu.
- Ngoài plan, anh yêu cầu: trượt cơ chỉ khi chấm vượt viền bi (mép pad = 0.6R), thiết kế lại cả màn Soạn bài theo chuẩn Apple; bản HTML chờ anh duyệt trước khi port Swift.
- 2026-10-08: anh duyệt bản HTML v4.1. Bước 5 và 7 ở đây **không tick**, thay bằng plan `2026-10-08-soan-bai-v4-swift.md` (pad 2D, vật lý e = 0.95 + throw + squirt, hai hình, sheet). Quyết định: `docs/quyet-dinh/2026-10-08-port-soan-bai-v4.md`. Bước 3 và 6 vẫn chạy ở đây. Đã commit 54b4ee1 trên nhánh `feat/pool-editor`.
