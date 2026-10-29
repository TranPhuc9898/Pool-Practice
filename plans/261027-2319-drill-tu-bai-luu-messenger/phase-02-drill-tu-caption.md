# Phase 2: 4 drill soạn từ caption (cần phase 1 của plan chủ đề)

| Bài gốc | Drill | Chủ đề · hạng | Cách soạn |
|---|---|---|---|
| #29 Fedor / Tyler Styer | **Rail Row Return**: 5 bi dọc băng dài, 1 bi cách băng ngắn ~1 bi. Đánh bi trong hàng → vị trí sang bi băng ngắn → bi băng ngắn vào lỗ thì đặt lại → về bi kế trong hàng | Speed & Position · E–D | engine, mỗi cặp cú là một round |
| #31 Dr. Dave | **Half-Ball 4 Diamonds**: bi mục tiêu gần băng, ăn ½ bi thẳng, bi cái chạy qua bàn 4 diamond. Round sau đổi lực và phê, đích dịch theo | Speed & Position · F | engine. Nếu số diamond lệch hệ thì dùng số engine, ghi vào Phát sinh |
| #17 Fedor | **Compact Play**: 16 bi, 4 vùng × 4 bi, bi cái phải dừng lại đúng vùng vừa đánh | Patterns & Runouts · C | vẽ tay, vùng = zone chấm. Vị trí 4 vùng lấy từ video #17 |
| #55 Dr. Dave | đã dùng cho ô Banks · E–D ở phase 1 | — | — |

Phase này còn 3 drill mới.

## Việc

- Mỗi drill một file `src/pool-engine/drills/<id>-<slug>.ts`, nối vào `drills/index.ts`. Hạng đặt qua `difficulty` hoặc `OVERRIDE`.
- Drill engine: thêm `Drill(id:)` vào `scripts/rack-harness/main.swift`, lấy `shots` từ `sh scripts/rack-harness/run.sh <id>`.
- `why` ghi tên tác giả kèm link bài gốc.

## Xong khi

- `sh scripts/drill-lint/run.sh <3 id>` ra `0 vi phạm, 3 drill đạt`.
- `npx tsc --noEmit` exit 0.
- Lint chủ đề: Speed & Position có bài ở E–D và F, Patterns có bài ở C.

## Kết quả

- [x] `sh scripts/drill-lint/run.sh 120 121 122` → `Tổng: 0 vi phạm, 3 drill đạt.` (2026-10-28)
- [x] `npx tsc --noEmit` → exit 0 (2026-10-28)
- [x] Lint chủ đề: Speed & Position cột F 5 bài, E–D 4 bài; Patterns & Runouts cột C 4 bài (2026-10-28)
