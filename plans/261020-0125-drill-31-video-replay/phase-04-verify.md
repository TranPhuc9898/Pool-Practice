# Phase 4 — Dọn JS và kiểm simulator

## Việc
1. Bỏ `playCue` khỏi drill 31, `types.ts` và `[id].tsx` (chỉ drill 31 dùng). Previous/Next dựng từ `cueBall`.
2. Giữ `playSpeed` cho nhánh engine. Kiểm card hiện `speed` video, không phải `playSpeed`.
3. Simulator, `pooltraining://drill/31`, Metro 8095:
   - Play 12 lần liên tiếp, đi hết bi 12. Chụp bi 4 và bi 8 so khung video (bi 4 lệch 25.6 in trên engine, phải hết).
   - Previous/Next qua lại, bàn khớp `cueBall` video.
   - Pass ở bi 5 sang bi 6, Undo về bi 5, Start Drill về bi 1.
   - Nhánh engine: màn drill không kéo được bi, chỉ đọc code xác nhận điều kiện 0.5 in, không kiểm trên UI.
   - Cú 7: nhìn đường bi mục tiêu so video.
4. `npx tsc --noEmit`, `npx expo lint`. Gỡ NSLog tạm.
5. Đánh dấu plan cũ `261020-0007` xong phase 4.

## Xong khi
Tất cả mục 3 đạt, tsc 0, lint 0. Mục nào không đạt thì ghi lý do ở đây, không tick.

## Kết quả
- Đạt: Play bi 1→12 nối liền trên simulator, bi cái theo đường video, bi mục tiêu thẳng vào lỗ guide, round kế dựng đúng chỗ dừng. Previous lùi bi 8 về bi 7 đúng thế. Card bi 7 hiện `3.4 m/s` (`speed`), không phải `playSpeed` 4.5.
- Đạt: cú 7 so khung video 82.6–84.4 s, bi 7 dọc băng vào góc headLeft, khớp guide.
- Đạt: bi 4 và bi 8 hết lệch theo cấu trúc, điểm cuối replay kéo trùng `cueBall` round kế (lệch gốc ≤ 0.73 in trước khi kéo).
- Đạt bằng đọc code: nhánh engine, guard 0.5 in trong `PoolEditorModel.videoReplay`.
- Không kiểm: Pass/Undo/Start Drill. Phase này không đụng logic lượt trong `[id].tsx`, chỉ thêm `replay` vào round.
- Không có NSLog tạm để gỡ.
- Ghi chú kiểm: `simctl io screenshot` trả khung cũ giữa chừng, chụp bằng `screencapture` vùng cửa sổ Simulator. Bấm Play khi cú trước chưa xong thì cú đó diễn lại từ đầu.
