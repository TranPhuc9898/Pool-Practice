# Phase 3: JS round, nút, ghi lượt

Status: done

File: `src/app/drill/[id].tsx`, `src/pool-engine/drills/31-twelve-ball-rails.ts` (chỉ `playSpeed` nếu phase 1 đổi).

## Việc
- `roundAt` thành `{ drillId, i, cue? }`, bỏ `done`. Drill pattern có `roundAt` thì dùng `i`, không có thì theo số lượt như cũ (mở lại drill vẫn tiếp đúng bi).
- Mapping round: `cueBall: roundAt.cue ?? round.cueBall` khi `roundAt.i === roundIndex`. `rev` đổi theo round nên native nạp lại; guide đọc từ `drill` nên tự theo.
- `ended` ok: `setRoundAt({ i: roundIndex + 1, cue: { x: cueX, y: cueY } })`. ok false: lưu note "Missed Ball n · Play to retry" (hay "Cue ball scratched"), hiện ở dòng `targetNote` sẵn có; đổi round hay Play lại thì xoá.
- Nút Previous shot / Next shot: điều kiện `drill.shots || patternRounds`. Với round: `setRoundAt({ i: roundIndex ± 1 })`, không `cue`, nên về vị trí video. Disabled ở 0 và 11.
- Pass/Miss khi drill pattern: ghi lượt rồi `setRoundAt({ i: min(roundIndex + 1, 11) })`. Undo: lùi một. Start Drill: `setRoundAt(undefined)` để về bi 1.
- Sửa comment `roundAt` cho khớp hành vi mới.

## Xong khi
`npx tsc --noEmit` 0, `npx expo lint` 0.

## Rủi ro
Pass/Miss từ bi 9 khi `done` = 0 thì số lượt và số bi lệch nhau. Chấp nhận: lượt đếm số cú đã ghi, bi theo chỗ người tập đang đứng.

## Kết quả
Đổi so với kế hoạch: Previous/Next dựng bàn từ `round.playCue`, không phải `cueBall` video. Trượt ghi note theo round, Play lại hay đổi round thì xoá. tsc 0, lint 0.
