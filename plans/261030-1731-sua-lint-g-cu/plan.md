---
status: done
created: 2026-10-30
mode: fast
---
# Sửa lint 5 bài G cũ (37, 38, 39, 41, 74)

**Xong là:** `sh scripts/drill-lint/run.sh 37 38 39 41 74` báo "đạt" cho 37, 38, 39, 41; 74 hết §3. Simulator Play mỗi round không báo "Missed".
**Cách làm:** mỗi round lấy lực và rate từ `placed(...)` của `scripts/position-harness/main.swift` (như bài 131), chép `speed`/`rate`/`why` vào round, subtitle thêm câu mô phỏng. 74 là break-and-run nên round là cú phá vẽ tay như bài 95.
**Đánh đổi:** giữ ngưỡng `pocketed` cũ của nguồn, không đổi sang chấm zone; rate harness chỉ để chứng minh cú vào được, không chỉnh ngưỡng theo rate.
**Không làm:** RDS 75, 76, 78, 81 và các bài break 29, 30, 70, 71 cùng lỗi (không thuộc G). Không đổi skill 74 (nó là bài Tests duy nhất ở stage 1).

Lint hiện tại (2026-10-30 17:31): 16 vi phạm, 0 đạt. 37/38/39/41 thiếu lực m/s, nguồn đường bi cái, câu why ở mọi round. 74 thêm §4 "chuỗi không pot bi 2, 3, 4, 6, 5".

## Phase

| # | Phase | Trạng thái |
|---|---|---|
| 1 | [Harness 4 bài pot](phase-01-harness-37-38-39-41.md) | done |
| 2 | [74 cú phá + quyết §4](phase-02-74-rds.md) | done |
| 3 | [Kiểm lint, tsc, simulator](phase-03-kiem.md) | done |

## Vỡ ở đâu

- Round cắt mỏng 58–69° (38 chỗ 6–7, 41 chỗ 4–7) có thể không cú nào vào sạch → kiểm bằng: harness in "không cú danh nghĩa nào đạt"; khi đó dời bi cái ít nhất có thể và ghi lý do trong header.
- 74 §4: luật 1 cấm miễn "any order", nhưng sau cú phá không có route cố định → anh quyết: (a) lint coi bàn rack như skill break (khớp `DrillShotPlanner.racked`), hoặc (b) để §4 rớt kèm lý do ghi trong header.
- Simulator chưa máy đọc zone; 4 bài này không có zone nên chỉ cần đọc "Missed".

## Kết quả 2026-10-30

- `sh scripts/drill-lint/run.sh` cho 19 bài G: 0 vi phạm, 19 đạt. Toàn bộ: 149 vi phạm, 85 đạt.
- 74 §4 theo (a): `scripts/drill-lint/lint.js` thêm `racked` cùng ngưỡng engine (≥5 bi, mỗi bi có bi khác cách tâm < 2.55"). Bàn rack được miễn chuỗi như skill break, vì engine cũng đánh cú phá ở đó.
- Simulator: không round nào báo "Missed". 38/39/41/74 sang round theo Play. Round của 37 không dời bàn nên sang round theo 5 lượt Pass/Miss, Play giữ "Shot 1/4" là đúng thiết kế. Round 2–4 của 37 mới kiểm bằng harness, chưa bấm qua trên simulator.
- `tsc --noEmit` và `expo lint` exit 0. Metro 8081 đã tắt.

## Phát sinh 2026-10-31: 8 bài break và RDS

Cùng lỗi §3 của 74, làm theo mẫu 74 và 95: round mang cú phá vẽ tay `expectedCuePath`, `speed: 8`, `why`, subtitle thêm `Path drawn, not simulated.`

- 75, 76, 78, 81, 71: đường thẳng (0.5, 0.875) → chạm bi 1 → (0.5, 0.5). 71 giữ tip giữa bi theo nguồn.
- 30, 70: trước không có round, thêm một round. 29: điểm chạm tính theo từng chỗ bi cái, lùi 22.75" như 95.
- 8 m/s là lực Play dùng thật: `DrillShotPlanner` ép cú phá về `min(max(speed, 2.6) × 3, 8)`, card hiện 8.0.
- Lint: 8 bài đạt, toàn bộ 125 vi phạm, 93 đạt. tsc, expo lint exit 0. Simulator không round nào báo "Missed".
- Chưa kiểm: đường vẽ tay chưa so với đường Play engine (break chưa hiệu chỉnh khối lượng rack). Simulator lần đầu chạy bundle cũ vì app trỏ Metro ở IP mạng cũ, phải mở lại qua `pooltraining://expo-development-client/?url=http://localhost:8081`.
