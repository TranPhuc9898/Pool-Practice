# Đem control của bi-cai-xoay.html vào Soạn bài — 2026-10-09

Hướng: giữ UI Soạn bài hiện có (bàn + hai ô hình + panel 318), nhét từng control của web vào đúng chỗ trống,
không dựng màn mới. Vật lý đã khớp web (`docs/prototypes/bi-cai-xoay.check.js`), chỉ còn phần điều khiển và số đo.
Web: `docs/research/bi-cai-xoay.html`. Panel: `modules/pool-table/ios/Editor/PoolShotPanel.swift`.

## Bước

- [x] 1. Phóng bi trên bàn ×2,5 (web: checkbox `big`). Hằng `PoolEditorModel.ballZoom`, áp cho bi, bi chạy thử,
  vòng ghost, vòng chỗ dừng, chấm điểm chạm. Vật lý giữ 2,25".
  Xong khi: build lên simulator, bi trên bàn Soạn bài to gấp 2,5 bản cũ, ghost trùng cỡ bi.
- [x] 2. Tốc độ phát 1× / 0,5× / 0,25× / 0,1× (web: `speedSeg`) đặt trong hàng tua thay chữ m/s. Đổi tốc giữa chừng
  thời gian mô phỏng không nhảy. Mặc định 1×.
  Xong khi: đang chạy bấm 0,25× bi chậm lại tại chỗ, số giây trên thanh tua không giật.
- [x] 3. Số đo sống lúc chạy (web: `rV rRho rZ rW rAx`): cột cạnh pad đổi thành Trạng thái, Tốc bi, ρ, Phê, Spin
  tổng, Trục quay. Xong khi: cú kéo 3 m/s ngay sau chạm đọc ρ âm, Phê 0,0, trục nghiêng 0° như web.
- [x] 4. Cú mẫu (web: `PRESETS` trừ Tự xếp bàn, Massé): hàng chip trên pad, bấm là đặt tipX/tipY/lực lên bàn
  đang xếp. Panel cao thêm 44: `PoolShotPanel.height` và `PANEL` trong `src/app/editor.tsx` cùng đổi.
  Xong khi: bấm Kéo → pad về (0, −0,5), Lực 3,0; bấm Stop → (0, −0,26), 1,5.
- [ ] 5. Nâng cơ 0–75° (web: `strike()` 3D, `theta`): port công thức r×d với trục cơ nghiêng vào `ShotPhysics.hit`,
  slider dưới Lực, preset Massé 60° vào hàng chip, `theta` thêm vào `EditorStateRecord` và TS.
  Xong khi: check script thêm cú massé a 0,4 θ 60° v 3 khớp web dưới 10" và 1°.
- [ ] 6. Trục quay ω vẽ trên bi cái lúc chạy (web: `showAxis`), bật tắt chung với nút Đường đi.
  Xong khi: cú phê phải thấy trục đứng, cú kéo thấy trục nằm ngang vuông góc hướng đi.

## Cố tình bỏ
Kính lúp 3D + chọn góc nhìn (đã có ô Ngắm / Dày mỏng), đồ thị tốc độ, chế độ không bi mục tiêu / Hướng đánh /
Cách bi (editor luôn có bi thật trên bàn), Mẫu bi cái, Nhoè chuyển động (replay đã nhoè sẵn).

## Dễ vỡ
Bước 5 đổi `EditorStateRecord` là đổi contract Swift↔TS, phải sửa cả `src/PoolEditorView.tsx` và `editor.tsx`.
Bước 4 đổi chiều cao panel hai nơi, lệch một là bàn bị che.

## Phát sinh
- Bước 4: `src/app/editor.tsx` không có hằng `PANEL`, native view để flex, nên chỉ đổi `PoolShotPanel.height`/`cardHeight` (338→382, 318→362). Comment cũ trong Swift nhắc `PANEL` đã sửa lại.
- Bước 4: web ghi lực preset là V0 (tốc cơ), Lực trong app là tốc bi cái. Giữ nguyên số web cho đúng "xong khi"; nếu muốn khớp vật lý thì Kéo ≈ 3,1, Stop ≈ 2,0 (v = 2·V0 / (1 + m/M + 2,5·(a² + b²))). Anh quyết.
- Bước 4: hook kiểm `?fixture=preset:<tên>` thêm vào `PoolEditorView.swift`, chạy cả khi đổi URL lúc màn đang mở.
- Bước 5 dừng: giả định "port r×d vào `ShotPhysics.hit`" sai. `hit()` dựa trên `approach()` 1D (W ∥ L, đường thẳng tới ghost),
  `solve()` secant hướng cơ trên đường thẳng, `PoolShotReplay.swift:157` và `PoolEditorGuides.swift:152` vẽ đoạn trước chạm
  bằng đường thẳng. Massé cong đường trước chạm nên cần mô phỏng số cả đoạn tiếp cận, đụng cả 4 chỗ trên. Chờ anh quyết.
- 10/10: bước 5 (nâng cơ θ) và bước 6 (trục ω) chuyển sang `.claude/ke-hoach/2026-10-10-masse-nang-co.md`, vì nâng cơ kéo theo đổi cả `approach()` sang mô phỏng số nên cần plan riêng. Plan này đóng tại đây.
