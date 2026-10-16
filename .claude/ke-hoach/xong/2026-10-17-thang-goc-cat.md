# Drill 22 Cut Angle Ladder và mistakes từ mục F — 2026-10-17

Quyết định: `docs/quyet-dinh/2026-10-17-thang-goc-cat.md`

**Xong là:** mở drill 22 trên simulator, ghi đủ 15 cú thì bi cái đổi chỗ sau cú 3/6/9/12, và `aimOf` tính 5 vị trí ra `0 15 30 45 60`.
**Cách làm:** thêm `cueBall?` vào `DrillRound`, màn drill ghép bi cái của round đang chạy vào `tableDrill` — vì round đã suy ra từ thứ tự cú, khỏi đụng bảng `attempts` hay UI.
**Đánh đổi:** chấm chung 10/15 cho cả thang, bỏ điều kiện "vào ít nhất 1/3 ở 45°" của tài liệu, để khỏi mở rộng `PassCondition`.
**Không làm:** điểm riêng từng góc trên Scoreboard, đưa drill 22 vào Daily Workout, mức `distances` cho drill 22, ma trận bài 08.

## Bước

- [x] 1. Lát mỏng: `cueBall?` trong `DrillRound` (`src/pool-engine/types.ts`); skill `cutAngle` → `fundamentals` (`src/components/home/training-areas.ts`); `src/pool-engine/drills/22-cut-angle-ladder.ts` export `cutAngleLadder`, đăng ký trong `drills/index.ts`; `src/app/drill/[id].tsx` lấy `round?.cueBall` khi chưa kéo bi. Bi 1 `{0.5, 0.3125}` lỗ footLeft, 15 cú, `pocketed` cần 10. Round title `0°`…`60°`, bi cái lần lượt `{0.8405,0.5253}` `{0.7288,0.5591}` `{0.6034,0.5772}` `{0.4729,0.5785}` `{0.3462,0.5629}` → xong khi: `npx tsc --noEmit` exit 0, và trên simulator ghi 3 cú ở drill 22 thì bi cái nhảy chỗ, caption ra `15° · Shot 4 of 15`
  ✓ 2026-10-17 01:20 · tsc exit 0; simulator ghi P/P/M → caption `15° · SHOT 4 OF 15`, bi cái dời sang trái-xuống, Thickness Straight in → ¾ ball
- [x] 2. Kiểm góc bằng chính `src/pool-engine/aim.ts` (cần 1) → xong khi: `node --input-type=module -e "const {aimOf}=await import('./src/pool-engine/aim.ts');const {cutAngleLadder:d}=await import('./src/pool-engine/drills/22-cut-angle-ladder.ts');console.log(d.rounds.map(r=>aimOf({...d,cueBall:r.cueBall}).cutDeg).join(' '))"` in ra `0 15 30 45 60`
  ✓ 2026-10-17 01:22 · `0 15 30 45 60`, exit 0
- [x] 3. Undo qua ranh giới round trong `src/app/drill/[id].tsx` (cần 1) → xong khi: simulator ghi 3 cú, bấm Undo một lần, bi cái về chỗ 0° và caption ra `0° · Shot 3 of 15`
  ✓ 2026-10-17 01:25 · Undo từ P/P/M → caption `0° · SHOT 3 OF 15`, bi cái về chỗ 0°, Thickness Straight in. Không cần sửa thêm code: round suy từ số cú còn hiệu lực, `rev` đổi theo `roundIndex` từ bước 1
- [x] 4. `mistakes` tiếng Anh theo kiểu `02-stop.ts` (triệu chứng rồi nguyên nhân). Mục F bài 01 → `01-straight-in.ts`, bài 06 → `18/19/20-rail-cut-*.ts`, bài 09 → `21-spot-shot.ts`, bài 03 và 05 → `22-cut-angle-ladder.ts` → xong khi: `grep -l "mistakes:" src/pool-engine/drills/{01,18,19,20,21,22}-*.ts | wc -l` ra `6`, và màn drill 22 trên simulator hiện khối Common mistakes
  ✓ 2026-10-17 01:32 · grep ra `6`; drill 22 bấm (i) → khối `COMMON MISTAKES` hiện đủ 5 dòng dưới 3 tips
- [x] 5. Lint, typecheck → xong khi: `git diff bdd8467 -- eslint.config.js` rỗng, rồi `npx expo lint` và `npx tsc --noEmit` cùng exit 0
  ✓ 2026-10-17 01:37 · `eslint diff bytes: 0`, `lint exit 0`, `tsc exit 0`

## Vỡ ở đâu

- `types.ts`, `[id].tsx`, `drills/index.ts`, `training-areas.ts` đang có diff chưa commit của drill 18–21 và Stroke → kiểm bằng: lưu `git diff --stat` trước bước 1, lúc commit dùng `git add -p`, không gộp icon hay asset
- Drill có `rounds` mà không có `cueBall` (04, 06, 08) đổi hành vi → kiểm bằng: simulator mở drill 08, ghi 4 cú, bi cái đứng nguyên chỗ
- Bi cái đã kéo tay (`moves`) đè lên `round.cueBall`, sang round mới bi không nhảy → kiểm bằng: kéo bi cái ở drill 22, ghi 3 cú, xem bi theo bên nào, ghi vào Phát sinh rồi hỏi anh

## Phát sinh

- Xong là: đạt 2026-10-17 · drill 22 ghi đủ 15 cú, caption ra 15°/30°/45°/60° sau cú 3/6/9/12, Thickness ½ → ¼ → Thin cut, `Last 12/15 · 80% · Passed`; `aimOf` ra `0 15 30 45 60`
- Vỡ #2, đạt 01:30 · drill 08 ghi 4 cú → `B · STUN · SHOT 5 OF 9`, bi cái đứng nguyên chỗ. Riêng thẻ cú vẫn `Shot → A`, vì target lấy từ `pick` (chạm vùng trên bàn) chứ không theo round. Ở bdd8467 cũng vậy, không phải do plan này
- Vỡ #3, 01:35 · chỉ bàn legacy (`dev=1`, `debug=1`, `guide=0`) mới kéo được bi; bàn mặc định `stageOnly` chặn chạm. Trên bàn legacy kéo bi cái rồi ghi 3 cú → `15° · SHOT 4 OF 15`, bi cái vẫn ở chỗ đã kéo. Lý do: `moves` khoá theo `drill.id` nên đè `round.cueBall`. Hỏi anh: giữ, hay bỏ `moves` khi sang round mới
