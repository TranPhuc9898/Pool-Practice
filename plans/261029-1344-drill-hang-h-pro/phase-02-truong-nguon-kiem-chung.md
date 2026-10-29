---
phase: 2
title: Trường nguồn và kiểm chứng
status: pending
---

# Phase 2 — Trường nguồn và kiểm chứng

## Files

- Sửa: `src/pool-engine/types.ts`
- Sửa: các file trong `src/pool-engine/drills/` có nguồn đọc được trong docblock
- Sửa: `src/pool-engine/drills/89-kick-one-and-two-rails.ts` (pass condition)

## Bước

1. `PoolDrill` thêm optional, đúng kiểu ở brainstorm-261029-1053:
   - `source?: DrillSource` (`drdave` / `named` / `selfAuthored`)
   - `verification?: Verification` (`unverified` / `simulated` / `drawn` / `video` / `table`, `table` bắt buộc `evidence` + `date`)
   - `assessmentMethod?: 'selfReport' | 'logged' | 'simulator'` (lấy từ plan Downloads §5)
   - `rails?: RailId[]`, `kickSystem?: 'mirror' | 'midpoint' | 'plus' | 'corner5'`
   - `progression?: { pass: string; harder: string }`
2. `PassCondition` thêm `{ kind: 'legalHit'; required: number }`. Drill 89 đổi từ `pocketed` sang `legalHit`.
3. Điền `source` cho drill có tên nguồn trong docblock (Dr. Dave, BU, Jewett, PPC, forum). Drill không đọc ra nguồn: `verification: { kind: 'unverified', reason: 'chưa truy nguồn' }`.
4. Điền `verification`: drill có "Checked in simulation" → `simulated` kèm tên harness. "Path drawn" → `drawn`. Replay video → `video` kèm file. Không drill nào được `table`.
5. Điền `rails` cho 4 drill kick (64, 65, 89, 111) và các drill bank.

## Xong khi

- `npx tsc --noEmit` xanh.
- `sh scripts/drill-lint/run.sh` không quá 183 vi phạm, drill đạt không dưới 58.
- `grep -L "verification" src/pool-engine/drills/[0-9]*.ts` ra rỗng.
