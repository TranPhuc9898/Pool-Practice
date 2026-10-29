# Phase 1: Dữ liệu chủ đề + lint

## Việc

- Tạo `src/pool-engine/topics.ts`: `TOPICS` 12 mục `{ id, title, skills, required }` theo bảng trong `plan.md`, `topicOf(drill)` tra theo `drill.skill`, `drillsByRank(topic)` trả `Record<Stage['stage'], PoolDrill[]>` qua `stageOf`. `required` là danh sách hạng không được trống (ô có drill hoặc ô vá).
- Thêm `rankLabel(stage)` trả `STAGES[i].sabo` (`K–I` … `C`), một chỗ duy nhất cho nhãn hạng.
- `scripts/drill-lint/lint.js` thêm khối `topic`: drill nào `topicOf` trả `undefined` thì báo; chủ đề nào có hạng trong `required` mà trống thì báo `topic <id> <hạng> trống`. In bảng chủ đề × hạng dạng số đếm. `run.sh` cần build cả `topics.js` như đang làm với `stages.js`.

## Xong khi

- `sh scripts/drill-lint/run.sh` in bảng 12 hàng × 6 cột, 0 dòng `topic … không có chủ đề`, đúng 10 dòng `topic … trống` (khớp 10 ô **vá**).
- `npx tsc --noEmit` exit 0.

## Rủi ro

- Skill mới thêm sau này rơi khỏi mọi chủ đề → chính dòng lint ở trên bắt.
