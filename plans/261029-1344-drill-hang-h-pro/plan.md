---
title: Drill theo hạng H → PRO và 7 nhóm kỹ năng
description: Gán hạng theo kỹ năng, thêm trường nguồn và kiểm chứng, lọc trên tab Drills, bổ sung bài hệ ngắm kick còn thiếu
status: pending
priority: P2
effort: 3d
branch: feat/drill-hang-h-pro
tags: [drills, curriculum, schema, ui]
blockedBy: []
blocks: []
created: 2026-10-29
---

# Drill theo hạng H → PRO

Gộp hai nguồn: hướng A của [brainstorm-261029-1053](../reports/brainstorm-261029-1053-drill-hang-H-PRO-va-nhom-ky-nang.md) (cơ chế) và bảng hạng theo kỹ năng §3 của `~/Downloads/pool-practice-drills-research-level-uiux-master-plan.md` (tiêu chí). Thay plan [261027-2246-drills-theo-chu-de-hang](../261027-2246-drills-theo-chu-de-hang/plan.md), đánh dấu superseded ở phase 6.

## Hợp đồng

- **Outcome:** tab Drills lọc được theo 12 hạng H → PRO và 7 nhóm kỹ năng. Mỗi drill hiện hạng, nhóm, nguồn, trạng thái kiểm chứng. Có bài cho MoFUDAT, Mirror, Midpoint 1 và 2 băng, Plus, Corner-5, 9-ball ghost.
- **Constraints:**
  - Không đổi, không xoá `drillId`. `attempts.drill_id` là khoá lịch sử tập.
  - Mọi trường mới optional. Drill chưa điền vẫn chạy.
  - Không thêm màn mới (memory: không thiết kế lại UI). Lọc ghép từ `Section`, `DrillCard`, control có sẵn.
  - Không ghi góc, lực, đường bi giả. Bài không có số engine hay nguồn thì `verification: unverified`. `table` bắt buộc có file bằng chứng.
  - Luật drill trong `CLAUDE.md` và `docs/chuan-drill.md` đứng trên mọi thứ.
- **Non-goals:** Level Picker sheet, khu Learn/Reference, hiệu chỉnh engine băng, sửa 183 vi phạm lint cũ, chấm hạng người chơi, khoá bài theo hạng.
- **Acceptance:**
  - `node --test scripts/drill-lint/` xanh.
  - `drill-lint` không quá 183 vi phạm, drill đạt không dưới 58. Drill mới 0 vi phạm.
  - `npx tsc --noEmit`, `npx expo lint` exit 0.
  - Audit hai luật không rớt mới so với 123/124.
  - Simulator: lọc `C−` + `Kick` ra đúng danh sách. Không còn chữ SABO (`K–I`, `H–H+`…) trên UI. Hạng rỗng hiện empty state.

## Quyết định em tự chốt (anh chưa trả lời, đổi được ở gate phase 1)

1. Bỏ nhãn SABO khỏi UI. `STAGES` giữ trong code cho Home và tiến độ.
2. Hạng gán theo kỹ năng, em sinh bảng 124 dòng, anh duyệt trước khi đi tiếp.
3. Không có `pool-practice-level-uiux-plan.md` trong repo nên không theo thiết kế màn hình nào ngoài tab Drills hiện có.

## Phases

| # | Phase | Status | Xong khi | File |
|---|---|---|---|---|
| 1 | Bảng hạng và nhóm | pending | Anh duyệt bảng 124 dòng | [phase-01](phase-01-bang-hang-va-nhom.md) |
| 2 | Trường nguồn và kiểm chứng | pending | tsc xanh, lint không xấu hơn | [phase-02](phase-02-truong-nguon-kiem-chung.md) |
| 3 | Lint thành test | pending | `node --test` xanh | [phase-03](phase-03-lint-thanh-test.md) |
| 4 | Lọc trên tab Drills | pending | Simulator lọc đúng, hết SABO | [phase-04](phase-04-loc-tab-drills.md) |
| 5 | Bài hệ ngắm kick còn thiếu | pending | 7 drill mới 0 vi phạm | [phase-05](phase-05-bai-kick-con-thieu.md) |
| 6 | Kiểm cuối và PR | pending | PR mở, audit không rớt mới | [phase-06](phase-06-kiem-cuoi-va-pr.md) |

Phụ thuộc: 1 → 2 → 3. Phase 4 cần 1 và 2. Phase 5 cần 2 và 3. Phase 6 cuối.

## Rủi ro

- Hạng là phán đoán giáo trình, chưa có nguồn quy đổi. Gỡ bằng gate duyệt phase 1.
- Bài nhiều cấp như RDS (74–81) trải C− đến PRO. Gán theo file trước; tách theo round chỉ khi anh thấy lệch.
- Kick 3–4 băng chạy trên engine băng chưa hiệu chỉnh (`2026-10-18-hieu-chinh-engine.md` 1/6). Chỉ vẽ theo hệ, ghi lệch so với `ShotPhysics`, không ép khớp.
- Origin từng bị force-push mã độc 2026-10-16. Fetch và soi diff trước khi push branch.
