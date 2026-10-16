# Stop Shot gold standard + lô drill nguồn — 2026-10-15

**Xong là:** trên màn Stop Shot, ghi 10 cú, Undo một cú, kill app mở lại: Scoreboard và History khớp, cú bị undo không tính; thư viện có thêm drill BU S2 Rail Cut (3 cấp) và Spot Shot Challenge.
**Cách làm:** undo bằng dòng `void` trong attempt log, History đọc lại log theo session, `mistakes` là trường tuỳ chọn — vì progress v1 và sync append-only không được đổi nghĩa.
**Đánh đổi:** chấp nhận ngưỡng đạt của drill mới là đề xuất (nguồn chỉ đếm điểm, không có ngưỡng) để chạy được trong khung n/m hiện có; bỏ 15-Ball Lineup, S5 hide, lag ladder, touch-and-stay.
**Không làm:** schema v2 (`shots[]`, `progression`), drill bank/kick, test runner, thiết kế lại màn drill, chạy app trên máy.

## Bước

- [x] 1. Undo đầu-cuối: `src/pool-engine/attempt-log.ts` ghi `void`, `src/pool-engine/progress.ts` có `undoAttempt` (trả lại `best` cũ), nút Undo trong `src/app/drill/[id].tsx` → xong khi: `npm run typecheck` exit 0 và `grep -n "undoAttempt" src/app/drill/\[id\].tsx` ra 1 dòng
  ✓ 2026-10-15 · tsc exit=0 · grep ra 2 dòng: 37 import, 382 `onPress={() => undoAttempt(drill)}` (xem Phát sinh)
- [x] 2. Đọc log thành session trong `src/pool-engine/attempt-log.ts` (`useSessionHistory`), áp `void` theo kiểu stack → xong khi: chạy chuỗi pass,fail,void,pass qua hàm gộp thuần ra 1 pass 1 pass (script `node` trong scratchpad)
  ✓ 2026-10-15 · node: [["B","fail",0],["A","pass,pass",2]] — A gộp pass,fail,void,pass ra pass,pass
- [x] 3. History + so lượt trước dưới Scoreboard trong `src/app/drill/[id].tsx` (tỉ lệ, đạt/chưa, chênh điểm %) → xong khi: typecheck exit 0, đọc JSX thấy chỉ lượt đủ `attemptCount` được tính
  ✓ 2026-10-15 · tsc exit=0 · [id].tsx:211 `useSessionHistory(drill.id).filter((h) => h.attempts.length >= total)`, last/prev đọc từ mảng đó
- [x] 4. `mistakes?: string[]` trong `src/pool-engine/types.ts`, điền `02-stop.ts`, hiện trong khối info → xong khi: `grep -c mistakes src/pool-engine/drills/02-stop.ts` ra 1, typecheck exit 0
  ✓ 2026-10-15 · grep -c ra 1 · tsc exit=0
- [x] 5. Nhập drill 18–21 (`src/pool-engine/drills/18-…ts`…) từ D27/D25 trong `docs/research/nguon/2026-10-11-nguon-shot-making.md`, skill mới trong `training-areas.ts` → xong khi: script đếm `DRILLS.length` ra 21, mọi toạ độ trong 0…1, số bi không trùng
  ✓ 2026-10-15 · node: DRILLS.length 21 numbers 1..n true bad [] · tsc exit=0
- [x] 6. `npm run lint` và `npm run typecheck` → xong khi: cả hai exit 0
  ✓ 2026-10-15 · lint exit=0 · tsc exit=0

## Vỡ ở đâu

- Undo sau cú cuối làm `best` giữ điểm của cú đã huỷ → kiểm bằng: đọc `undoAttempt`, `best` tính từ `bestBefore` của session
- Thứ tự `void` lệch khi hai dòng cùng millisecond → kiểm bằng: query `ORDER BY rowid`, không theo `at`
- Bi frozen sát băng vẽ phóng 2.5× đè lên băng → kiểm bằng: mở drill 18 trên simulator (anh tự xem, phiên này không chạy app)

## Phát sinh

- Bước 1: tiêu chí grep viết "1 dòng" nhưng quên dòng import, thực tế 2 dòng (1 import, 1 chỗ gọi). Không sửa tiêu chí, anh quyết.
- Bước 1: `recordAttempt` giờ spread `...p` để giữ `bestBefore`; trước đây nó ghi đè object, rơi mọi trường lạ.
- Bước 2: hàm gộp nằm ở `src/pool-engine/sessions.ts` (file thuần, node chạy được), `useSessionHistory` vẫn ở `attempt-log.ts`.
- Bước 5: mẹo "aim a credit card width in front of the ball" lấy từ BD drill id=4 (D28, rail shot), không phải PDF BU. Cùng loại cú nên em dùng cho 18–20.
- Bước 5: bỏ 15-Ball Lineup (15 bi cách nhau ~3", phóng 2.5× chồng hình), S5 hide (cụm 9 bi không có toạ độ), lag ladder và touch-and-stay (không có lỗ đích, schema bắt buộc `targetPocket`).
- Xong là: chưa kiểm trên máy (ghi 10 cú, Undo, kill app, mở lại). Plan để file ở đây tới khi anh xác nhận trên simulator.
- Xong là, nửa Stop Shot: ✓ 2026-10-16 trên simulator · lượt 01a143ea ghi 10 cú (7/10), Undo mở lại Shot 10 of 10, ghi Miss ra Last 6/10; kill app mở lại vẫn 6/10, History `16 Oct 6/10 · 15 Oct 5/10 · 14 Oct 7/10`. DB: rowid 42 pass, 43 void, 44 fail, không dòng nào bị xoá.
- Xong là, nửa drill 18–21: code có trong working tree nhưng commit gold standard không gộp vào. Plan giữ ở đây tới khi lô drill được commit.
