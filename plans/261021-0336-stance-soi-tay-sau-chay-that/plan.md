---
title: "Stance Check soi tay sau chạy thật như bản mô phỏng"
description: "Vision thật trên clip và trên máy cho ra đúng hành trình của bản mô phỏng: xin quyền → tìm tay cơ → tay vàng/trắng theo cẳng tay ±10° → address → chấm góc lúc chạm → Scoreboard."
status: pending
priority: P1
effort: "~6h"
branch: feat/pool-editor
tags: [feature, ios, experimental]
blockedBy: []
blocks: []
created: 2026-10-21
---

# Stance Check soi tay sau chạy thật như bản mô phỏng

## Overview

Bản mô phỏng (https://claude.ai/artifact/YNaQkse6BQs6pPH7oi3iW7) vẽ hành trình em đọc từ code, chưa chạy Vision thật lần nào. Plan này kiểm từng khúc bằng dữ liệu thật: clip thật của cả hai camera qua `scripts/pose-harness` trước, rồi cho app chạy được cả camera trước lẫn camera sau, rồi quay màn hình cả hành trình trên iPhone.

"Tay sau thẳng" trong code nghĩa là cẳng tay dựng đứng trong 10° so với dây dọi (trọng lực), không phải khuỷu duỗi thẳng. Màu vàng ở `modules/pool-table/ios/Pose/PoseCoach.swift:137` và `PoseCoachView.swift:104` chỉ xét `|liveForearm| ≤ 10`, nên tay buông thõng lúc đứng cũng vàng.

## Xong là

- Với clip 9 cú của từng camera, `sh scripts/pose-harness/run.sh <clip> --frames <thư mục>` in `cú 9`, ≥ 8/9 ảnh PNG lúc chạm có đường khuỷu–cổ tay nằm trên cẳng tay, phán xử khớp kịch bản quay ≥ 8/9.
- Mục Setup có control Front camera / Back camera, mặc định Front. Bản ghi màn hình iPhone cho thấy đủ hành trình theo thứ tự ở phase 3 với camera trước, các mốc chính lặp lại với camera sau, kể cả nhánh Don't Allow.

## Không làm

- Phát tiếng, kể cả câu báo setup.
- Đổi ngưỡng `PoseLimits` (10°, 0.25·L, 0.4 s). Clip phase 1 chỉ ghi số, chỉnh ngưỡng là plan riêng.
- Nhiệt và nhịp Vision: thuộc `.claude/ke-hoach/2026-10-21-stance-nhan-tay-khong-nong.md`.
- Thiết kế lại UI. Trong `src/app/stance.tsx` chỉ thêm một control chọn camera theo khuôn control tay cơ sẵn có và đổi chữ báo thiếu camera.
- Gỡ control phát tiếng đang có trong Setup. Để nguyên, không thuộc plan này.
- Phần vào bộ (report `research-261021-0911-vao-bo-pose.md`), interruption, giọng `vi-VN`.

## Phases

| # | Phase | Status | Effort |
|---|-------|--------|--------|
| 1 | [Clip thật qua harness](./phase-01-clip-that-qua-harness.md) | Pending | 2h |
| 2 | [Hai camera, người chơi chọn](./phase-02-hai-camera.md) | Pending | 3h |
| 3 | [Hành trình trên máy](./phase-03-hanh-trinh-tren-may.md) | Pending | 1h |
| 4 | [Bám đúng người chơi, số độ ngả chạy theo máy](./phase-04-bam-dung-nguoi-va-goc-nga.md) | Pending | 1.5h |

Tuần tự 1 → 2 → 4 → 3. Phase 4 thêm sau clip quay màn 15:32, chen trước phase 3 vì phase 3 quay ở chỗ có người khác lọt khung. Phase 1 làm được trên Mac ngay khi anh có clip.

## Success Criteria

- [ ] Phase 1 đạt trên clip của cả hai camera, số chép vào phase file.
- [ ] Phase 2 đạt trên cả hai camera.
- [ ] Phase 4 đạt: overlay không nhảy sang người phía sau trong 30 s.
- [ ] Phase 3 có bản ghi màn hình và bảng tick từng mốc cho từng camera.
- [ ] `npx tsc --noEmit` và `npx expo lint` exit 0 sau mọi thay đổi TS.

## Liên quan

Plan `.claude/ke-hoach/2026-10-21-stance-nhan-tay-khong-nong.md` đụng cùng chỗ:

- Bước 2 của nó sửa `scripts/pose-harness/main.swift`, phase 1 ở đây cũng sửa file đó. Làm tuần tự, không song song.
- Bước 3 của nó quay clip A/B/C bằng app Camera ở 720p 30 fps. Đã chốt gộp: cùng buổi quay, cùng chân máy, quay luôn clip A/B/C cho plan kia.
- Bước 6 của nó sửa `PoseCoach.swift`, phase 2 ở đây cũng sửa `run()` trong file đó.

## Scope Challenge

HOLD. Harness đã chạy Vision thật cùng `StrokeTracker` của app trên clip, nên không cần dựng công cụ mới, chỉ thiếu ảnh để nhìn khớp lúc chạm. Khoảng 7 file, 3 phase.

## Validation Log

2026-10-21, anh trả lời:

| Câu | Trả lời | Đổi gì trong plan |
|---|---|---|
| Camera trước hay sau | "cả 2 luôn" | Em hiểu là app có cả hai, người chơi chọn ở Setup, mặc định camera trước. Phase 2 thành "Hai camera", phase 1 quay clip cả hai camera là bắt buộc, phase 3 chạy mốc chính trên cả hai. Hiểu sai thì sửa phase 2. |
| Kiểm khớp ở phase 1 | Ảnh PNG lúc chạm | Giữ cờ `--frames`. |
| Clip mẫu và ngưỡng | 9 cú, ≥ 8/9 | Giữ. |
| Buổi quay | Gộp với bước 3 plan nhận tay không nóng máy | Ghi ở mục Liên quan, phase 1 task 3. |

<!-- slug: stance-soi-tay-sau-chay-that -->
