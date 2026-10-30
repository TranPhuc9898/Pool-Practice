---
phase: 1
status: done
---
# Harness 4 bài pot

Files: `scripts/position-harness/main.swift` (thêm `drill37/38/39/41`, `ONLY=G0`), `src/pool-engine/drills/{37,38,39,41}-*.ts`.

- [x] Viết `drill37()`: 4 round, tip theo round (−0.1, −0.1, +0.4, −0.4), lưới lực bậc firm; follow round giữ dưới 1.75 nếu nguồn ép.
- [x] Viết `drill38()`, `drill41()`: 7 chỗ bi cái, tip 0, lưới lực bậc medium.
- [x] Viết `drill39()`: 10 round theo `objectBalls`/`pocket` từng round, tip 0.
- [x] Chép dòng `{ speed, rate, why }` vào từng round, subtitle thêm `Checked in simulation, not on a real table.`, header ghi nguồn harness.

Xong khi: `ONLY=G0 sh scripts/position-harness/run.sh` in đủ 28 dòng round không có "không cú danh nghĩa nào đạt"; `sh scripts/drill-lint/run.sh 37 38 39 41` ra 4 dòng "đạt".
