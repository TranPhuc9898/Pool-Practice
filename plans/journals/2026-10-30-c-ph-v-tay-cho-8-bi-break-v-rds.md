---
title: Cú phá vẽ tay cho 8 bài break và RDS
date: 2026-10-30
summary: "29/30/70/71/75/76/78/81 đạt drill-lint, lực card 8 m/s khớp Play"
---

# Cú phá vẽ tay cho 8 bài break và RDS

## What happened
Tám bài thiếu lực m/s, nguồn đường bi cái và câu why. Em sửa theo mẫu 74 và 95: mỗi round mang cú phá vẽ tay ở 8 m/s. 30 và 70 trước không có round nên em thêm một round. Ở 29, điểm chạm tính theo từng chỗ đặt bi cái.

## Gotcha
Lần chạy simulator đầu hiện lực 7.8 m/s và tip giữa bi, đó là bundle cũ. App đang trỏ Metro ở IP mạng cũ 10.124.241.19. Mở lại qua `pooltraining://expo-development-client/?url=http://localhost:8081` thì card lên 8.0.

## Decision
Lực trên card là 8 vì planner ép cú phá về `min(max(speed, 2.6) × 3, 8)`. Card đặt số nào nhỏ hơn thì Play vẫn đánh mạnh hơn số đó, sai luật lực card bằng lực Play.

## Next steps
Đường vẽ tay chưa so với đường Play engine, vì khối lượng rack chưa hiệu chỉnh.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
