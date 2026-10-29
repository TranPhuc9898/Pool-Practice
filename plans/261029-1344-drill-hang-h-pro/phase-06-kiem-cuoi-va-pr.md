---
phase: 6
title: Kiểm cuối và PR
status: pending
---

# Phase 6 — Kiểm cuối và PR

## Bước

1. `npx tsc --noEmit`, `npx expo lint`, `node --test scripts/drill-lint/`, `sh scripts/drill-lint/run.sh`.
2. Chạy lại audit hai luật trên `ShotPhysics` và `DrillShotPlanner`, so với 123/124.
3. `plans/261027-2246-drills-theo-chu-de-hang/plan.md`: `status: cancelled`, ghi lý do superseded bởi plan này.
4. `git fetch`, soi diff origin (đặc biệt `eslint.config.js`), rồi push `feat/drill-hang-h-pro` và mở PR vào `main`. Mô tả PR liệt kê drill `unverified` và `drawn`.

## Xong khi

- Mọi lệnh bước 1 exit 0, lint không quá 183 vi phạm.
- Audit không có bài rớt mới.
- PR mở, link gửi anh.
