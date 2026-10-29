---
phase: 5
title: Bài hệ ngắm kick còn thiếu
status: pending
---

# Phase 5 — Bài còn thiếu

Gap đếm bằng grep tên file và nội dung ngày 2026-10-29, chưa đọc tay từng bài. Bước 1 xác nhận lại.

## Files

- Thêm: 7 file drill mới trong `src/pool-engine/drills/`, id nối tiếp số lớn nhất hiện có
- Sửa: `src/pool-engine/drills/index.ts`, `levels.ts` nếu cần override

## Bước

1. Đọc tay drill có chữ "mirror", "ghost", "kick" để chắc không trùng. Bài nào đã có thì bỏ khỏi danh sách dưới.
2. Mỗi bài: đọc trang Dr. Dave tương ứng, soạn theo `docs/chuan-drill.md`, diễn giải ngắn và gắn link, không chép sơ đồ.

| Bài | Nguồn | Hạng | Kiểm chứng |
|---|---|---|---|
| MoFUDAT stroke | drdavepoolinfo.com/faq/drill/mofudat/ | H | `simulated` (cú thẳng) |
| Kick 1 băng, Mirror | /faq/bank-kick/mirror/ | D | `drawn` |
| Kick 1 băng, Midpoint | /FAQ/bank-kick/diamond-systems/ | C+ | `drawn` |
| Kick 2 băng, Plus | /faq/bank-kick/plus/ | B− | `drawn` |
| Kick 2 băng, Midpoint | /FAQ/bank-kick/diamond-systems/ | B− | `drawn` |
| Kick 3–4 băng, Corner-5 (round 3 băng và 4 băng) | /faq/bank-kick/corner-5/ | B+ / A+ | `drawn` |
| 9-ball playing the ghost | /faq/rating/playing-the-ghost/ | A− | `selfReport` |

3. Bài kick: `rails` đúng thứ tự, `passCondition: legalHit`, subtitle `Path drawn, not simulated.` Chạy thử trên `ShotPhysics`, ghi độ lệch vào docblock, không sửa engine.

## Xong khi

- `sh scripts/drill-lint/run.sh <id mới>` ra 0 vi phạm.
- `node --test scripts/drill-lint/` xanh.
- Mỗi bài mới có link nguồn và `verification`.
- Simulator: mở từng bài, đường vẽ chạm băng đúng thứ tự `rails`.
