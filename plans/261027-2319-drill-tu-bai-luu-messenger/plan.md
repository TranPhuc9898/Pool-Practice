---
title: Drill từ bài pool anh lưu trên Messenger (19–27/10)
description: Lấy 6 ô vá của plan Drills × hạng từ bài thật anh đã lưu, thêm 4 drill soạn được từ caption, xem video 8 drill còn lại để lấy layout
status: pending
priority: P2
effort: 1.5d
branch: feat/pool-editor
tags: [drills, research, curriculum]
blockedBy: [261027-2246-drills-theo-chu-de-hang]
blocks: []
created: 2026-10-27
---

# Drill từ bài anh lưu

## Hợp đồng

- **Outcome:** các drill anh đã lưu xuất hiện trong app, đúng chủ đề và hạng. Mỗi drill ghi nguồn (tác giả + link) trong `why` hoặc `source`.
- **Constraints:**
  - Giữ chuẩn `docs/chuan-drill.md`: drill engine qua rack-harness, drill vẽ tay có `expectedCuePath`.
  - Không đổi schema `PoolDrill`.
  - Id nối tiếp sau 10 bài vá của plan chủ đề.
- **Non-goals:**
  - Không soạn bài phê/squirt mới ngoài ô English · E–D, vì app đã có 82–86 và 48.
  - Không làm bài luật break (#50).
  - Không soạn drill không rõ layout (#16, #42, #46, #48, #38, #70, #9, #19).
- **Acceptance:**
  - `sh scripts/drill-lint/run.sh <id mới>` ra 0 vi phạm.
  - Lint chủ đề ra 0 dòng `trống` ở 6 ô có nguồn.
  - Mỗi drill mới có link bài gốc.

Nguồn: [research-261027-2319-bai-pool-messenger-19-27-10.md](../reports/research-261027-2319-bai-pool-messenger-19-27-10.md).

## Phases

| # | Phase | Status | File |
|---|---|---|---|
| 1 | Thay ý tưởng 6 ô vá bằng bài thật | done | [phase-01-o-va-tu-bai-luu.md](phase-01-o-va-tu-bai-luu.md) |
| 2 | 4 drill soạn từ caption | done | [phase-02-drill-tu-caption.md](phase-02-drill-tu-caption.md) |
| 3 | Xem video, soạn 8 drill còn lại | pending | [phase-03-drill-can-video.md](phase-03-drill-can-video.md) |

- Phase 1 sửa trực tiếp nội dung phase 3 của plan chủ đề, nên chạy cùng lượt cook plan đó.
- Phase 2 và 3 cần phase 1 của plan chủ đề, vì `topics.ts` phải có trước.

## Rủi ro

- Layout trong video ghi bằng mắt nên sai số khoảng nửa bi. Bài vị trí kiểu Fedor chấm theo vùng, chịu được sai số đó.
- Hệ #31 (½ bi ra 4 diamond) và #55 (twice-plus-tenths) đo trên bàn thật. Engine có thể lệch, nên rack-harness ra số khác thì ghi lại trong Phát sinh, không ép số.
