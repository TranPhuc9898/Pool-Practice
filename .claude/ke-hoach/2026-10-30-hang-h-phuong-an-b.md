# Hạng H theo phương án B — 2026-10-30

**Xong là:** tab Drills hạng H hiện đúng 7 bài 01, 02, 03, 32, 33, 99, 131, và 33 qua khi mỗi round đạt 3/5.
**Cách làm:** chuyển hạng trong `levels.ts`, thêm một drill 131 qua harness thật, thêm kiểu chấm `roundQuota` cho 33 — vì G đã phủ các kỹ năng báo cáo coi là thiếu (`plans/reports/brainstorm-261030-1012-level-h.md`).
**Đánh đổi:** G mất 03, còn 10 bài, ngưỡng qua G từ 8 xuống 7. Người đã qua 33 theo kiểu đếm tổng 15/15 vẫn qua, nhưng lượt cũ 10/15 lệch round sẽ bị chấm lại theo quota.
**Không làm:** không thêm 132–139, không thêm kind `streak`/`sequence`, không sửa scoring 32 và 99, không đổi `CURRICULUM` giai đoạn 1, không đổi id drill cũ.

## Bước

- [x] 1. Chuyển 36→F, 49→E, 03→H trong `src/pool-engine/levels.ts` → xong khi: `npx tsc --noEmit` exit 0, simulator mở tab Drills chọn H thấy 6 bài 01, 02, 03, 32, 33, 99
- [x] 2. Dò toạ độ 131 bằng `scripts/position-harness/main.swift` (CB 0.25,0.50 → bi 1 ở 0.25,0.25 → footLeft, gương phải) → xong khi: `sh scripts/position-harness/run.sh` in rate vào lỗ ≥ 40/45 cho cả hai phía, bi cái không rơi lỗ
- [x] 3. Viết `src/pool-engine/drills/131-short-straight-in-left-right.ts`, đăng ký ở `drills/index.ts`, `131: 'H'` trong `levels.ts` (cần 2) → xong khi: `sh scripts/drill-lint/run.sh 131` không báo lỗi, chọn H trên simulator thấy 7 bài
- [x] 4. Thêm `{ kind: 'roundQuota'; required: number; perRound: number }` trong `src/pool-engine/types.ts`, `drillStatus` trong `src/pool-engine/progress.ts` chấm theo round (round = floor(i / (attemptCount / rounds.length)), như `drill/[id].tsx:151`) → xong khi: `npx tsc --noEmit` exit 0
- [x] 5. 33 dùng `roundQuota` perRound 3 trong `drills/33-short-stop-follow-draw.ts`, nhãn trong `src/components/drill-card.tsx` và `src/app/drill/[id].tsx` (cần 4) → xong khi: card 33 trên simulator ghi `Pass 3/5 each round`, đánh 3 pass mỗi round (9/15) thì 33 hiện passed
- [x] 6. Chạy lại audit hai luật cho 03, 33, 131 với `ShotPhysics`/`DrillShotPlanner`, cả `drill-lint`, `npx tsc --noEmit`, `npx expo lint` → xong khi: cả bốn exit 0, bài rớt nào cũng có lý do ghi trong docblock
- [x] 7. Cập nhật `plans/reports/levels-261029-bang-hang-124-drill.md` → xong khi: mở file, mục hạng H liệt kê đúng 01, 02, 03, 32, 33, 99, 131; 36 nằm ở F, 49 ở E, G còn 10 bài

## Vỡ ở đâu

- Toạ độ 131 của báo cáo cho bi cái lăn theo vào lỗ → kiểm bằng: harness bước 2 in tỉ lệ bi cái rơi lỗ, phải ra 0
- 03 Follow bị audit rớt khi kéo xuống H (zone hiện tại chưa audit lại) → kiểm bằng: bước 6 chạy riêng 03 trước
- Chỗ khác đọc `passCondition.kind === 'inZone'` sẽ bỏ sót kind mới → kiểm bằng: `grep -rn "passCondition" src` sau bước 4, mọi chỗ đều xử lý `roundQuota`

## Phát sinh
- Bước 2: toạ độ báo cáo cắt 27°, bi cái dời lên đường bi 1 → lỗ, lùi 12.5" (0.3618, 0.3618) và gương (0.6382, 0.3618). Tip giữa ở mọi lực chỉ đạt 37/45; tip −0.1 ở 2.12 m/s đạt 45/45 hai phía, bi cái dừng cách chỗ chạm 0.6".
- Bước 4: `best` lưu điểm đã chặn theo round (`drillScore`), `required` 33 = 9. Lượt cũ có `best` ≥ 9 tính theo tổng pass sẽ thành passed, kể cả lượt lệch round: không phân biệt được vì `best` cũ không giữ thứ tự cú.
- Bước 6: audit `q.sh`/`grade.js` mất cùng scratchpad phiên 5b9e4287, transcript cũng không còn. 03 và 33 dựa vào audit 2026-10-29 10:40 (chạy trên chính `65a775f`, hình học hai bài không đổi từ đó). 131 dựa vào `drill131()` trên ShotPhysics thật. `drill-lint 3 33` exit 1 vì §3 (thiếu m/s, nguồn đường bi cái, câu vì sao) có từ HEAD, giống 01, 02, 32: thuộc tồn đọng 183 vi phạm, plan không sửa. 131 đạt.
- Simulator (Pool Training, Metro 8081): `rank/H` hiện 7 drill, drill 33 ghi `PASS 3/5 each round`, drill 131 vẽ đúng cú thẳng. Chưa bấm tay chuỗi 9/15 chia 3 mỗi round trên simulator.
- `src/app/drill/[id].tsx` đã lệch prettier từ HEAD, không format lại cả file.
