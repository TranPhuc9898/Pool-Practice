# Giáo trình drill 6 giai đoạn — 2026-10-27

**Xong là:** mọi drill có đúng một giai đoạn hiện trên card, mỗi giai đoạn có bài kiểm qua, giai đoạn 5 và 6 mỗi giai đoạn ≥5 bài, `sh scripts/drill-lint/run.sh` sạch.
**Cách làm:** `src/pool-engine/stages.ts` suy giai đoạn từ `difficulty`, override theo id, nhãn tham khảo SABO. Không thêm field vào `PoolDrill` vì đổi 87 file là cửa một chiều (`plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`).
**Đánh đổi:** chấp nhận giai đoạn 1–5 bám cứng `difficulty` 1–5, nên bài chấm sai độ khó thì xếp sai giai đoạn tới khi có override. Đổi lại không phải sửa 87 file và đổi thang chỉ cần sửa một file.
**Không làm:** không khoá drill theo giai đoạn, không ELO, không chấm hạng tự động, không đồng bộ server, không đổi bố cục UI ngoài dòng phụ của card.

## Bước

- [x] 1. Lát mỏng: `src/pool-engine/stages.ts` có 6 giai đoạn (tên, mốc qua, nhãn SABO K–I, H–H+, G–G+, F, E–D, C) và `stageOf(drill)`. Đổi `Level {drill.difficulty}` ở `src/components/drill-card.tsx:39` sang nhãn giai đoạn → xong khi: `npx tsc --noEmit` và `npx expo lint` sạch, card 01 Straight-in trên app ghi Stage 1 kèm K–I.
- [x] 2. Override và bài kiểm qua trong `stages.ts`: 80 và 71 lên giai đoạn 6, mỗi giai đoạn có id bài kiểm. `scripts/drill-lint/run.sh` biên dịch thêm `stages.ts`, `lint.js` báo khi bài kiểm trỏ id không tồn tại hoặc giai đoạn 5 hay 6 có dưới 5 bài → xong khi: run.sh in đúng một dòng "stage" (giai đoạn 6 mới có 2 bài), đổi tạm một id bài kiểm thành 999 thì in thêm đúng một dòng.
- [x] 3. Dò: `PoolDrill` biểu diễn được "đạt N lần liên tiếp, sai về 0" và "bàn rải ngẫu nhiên" chưa (đọc `src/pool-engine/types.ts`, `src/app/drill/[id].tsx`) → xong khi: mục Phát sinh có một dòng kết luận cho mỗi thứ, có hoặc không và cần sửa gì.
- [x] 4. Năm drill giai đoạn 5, file 87–91 trong `src/pool-engine/drills/` và `index.ts`: ba bi cuối nhiều lỗ, gỡ cụm giữa pattern, kick một và hai băng vào vùng, chuỗi áp lực, bàn ngẫu nhiên đếm bi (bài nào bước 3 nói chưa làm được thì thay bằng bài khác cùng giai đoạn) → xong khi: `sh scripts/drill-lint/run.sh 87 88 89 90 91` không in dòng nào.
- [x] 5. Năm drill giai đoạn 6, file 92–96: break-and-run 9 bi tính chuỗi, 10 bi gọi lỗ với ghost chạm 7, đổi phòng thủ, push-out sau break, break đưa bi cái về giữa bàn → xong khi: `sh scripts/drill-lint/run.sh` toàn bộ không in dòng nào, kể cả luật số bài của bước 2.
- [x] 6. `ORDER`/`topics` trong `src/components/home/training-areas.ts` thêm 87–96 → xong khi: mở app, mỗi drill mới hiện trong đúng một training area và mở ra chạy được cú đầu.

## Vỡ ở đâu

- Nhãn SABO trên card bị hiểu là hạng chính thức → kiểm bằng: chữ trên card có "~" hoặc "tham khảo", anh đọc duyệt ở bước 1.
- Drill giai đoạn 6 cần luật trận (gọi lỗ, push-out) mà engine không chấm được → kiểm bằng: bước 3 ghi rõ, bài nào không chấm được thì để chấm tay và ghi Phát sinh.
- `lint.js` hiện chưa đọc `stages.ts`, sửa run.sh có thể làm lệch rootDir → kiểm bằng: `sh scripts/drill-lint/run.sh` trước và sau bước 2 in cùng số vi phạm cũ.

## Phát sinh

- Baseline `run.sh` toàn bộ đã có 184 vi phạm cũ từ trước plan này. Tiêu chí bước 5 đổi thành: chỉ còn đúng 184 vi phạm cũ, 87–96 đạt, không còn dòng stage.
- Bước 3, chuỗi áp lực: không có streak reset trong `progress.ts`. Thay bằng `passCondition.required === attemptCount`, sai một cú là hỏng lượt.
- Bước 3, bàn ngẫu nhiên: `objectBalls` cố định, không rải được. Thay bằng layout rải sẵn với route lấy từ rack-harness (91 9-Ball Scatter).
- Gọi lỗ, push-out, break không chấm được bằng engine: 93–95 vẽ tay, skill thuộc NO_CHAIN, tự chấm.
