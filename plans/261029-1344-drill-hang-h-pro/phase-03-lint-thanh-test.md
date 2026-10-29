---
phase: 3
title: Lint thành test
status: pending
---

# Phase 3 — Lint thành test

## Files

- Thêm: `scripts/drill-lint/data.test.js`
- Sửa: `scripts/drill-lint/run.sh` (biên dịch thêm `levels.ts`, `groups.ts`)

## Bước

1. Dùng `node:test` có sẵn, không thêm dependency. Test đọc output tsc giống `run.sh`.
2. Test:
   - Mỗi drill có hạng và nhóm.
   - Kick và bank: `rails.length` bằng số điểm gãy của `expectedCuePath`, mỗi điểm gãy nằm trên đúng băng theo thứ tự. Đây là kiểm hình học trên dữ liệu, không phải vật lý.
   - `verification.kind === 'table'` phải có `evidence` trỏ tới file tồn tại.
   - Mỗi drill có `source` hoặc `verification.kind === 'unverified'`.
   - `drillId` không trùng; danh sách id hiện có không mất id nào (so với snapshot sinh ở bước này).
   - Số bi tăng dần (chuyển từ `lint.js`).

## Xong khi

- `node --test scripts/drill-lint/` xanh.
- Cố ý xoá `rails` ở drill 64 thì test đỏ, trả lại thì xanh.
