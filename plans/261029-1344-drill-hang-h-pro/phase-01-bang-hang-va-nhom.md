---
phase: 1
title: Bảng hạng và nhóm
status: pending
---

# Phase 1 — Bảng hạng và nhóm

## Files

- Thêm: `src/pool-engine/levels.ts`, `src/pool-engine/groups.ts`
- Sửa: `src/pool-engine/types.ts` (thêm `TrainingLevel`, `SkillGroup`, không đổi gì cũ)
- Sinh: `plans/reports/levels-261029-bang-hang-124-drill.md`

## Bước

1. `types.ts` thêm `TrainingLevel = 'H' | 'G' | 'F' | 'E' | 'D' | 'C-' | 'C+' | 'B-' | 'B+' | 'A-' | 'A+' | 'PRO'` và `SkillGroup` 7 giá trị.
2. `groups.ts`: map `DrillSkill` → `SkillGroup`, đúng bảng trong brainstorm-261029-1053 (Fundamentals, Cue Ball Control, Position Play, Kick, Bank, Spin, Advanced). TypeScript phải bắt lỗi khi thêm `DrillSkill` mới mà quên map (`Record<DrillSkill, SkillGroup>`).
3. `levels.ts`: hạng mặc định theo kỹ năng và `difficulty`, theo bảng §3 của plan Downloads:
   - H: `straightStroke`, `spotShot`, `stop` difficulty 1.
   - G: `cutAngle` dễ, `stop`, `follow`.
   - F: `cutAngle` khó, `draw`, `tangent`.
   - E: `speedControl`, `followDistance`, `drawDistance`, break chính xác.
   - D: `wagonWheel`, `railCut`, kick 1 băng.
   - C−: `lineUp`, `pattern` ngắn, `bank` dễ. C+: `pattern`, `safety`, kick biến thể.
   - B− trở lên: theo bài cụ thể (Plus, Corner-5, RDS, ghost).
   Cộng bảng `OVERRIDE: Record<number, TrainingLevel>` cho bài lệch, mỗi dòng một comment lý do như `stages.ts`.
4. Script in bảng 124 dòng: id, tên, skill, difficulty, stage hiện tại, hạng mới, nhóm. Ghi vào report.
5. **Gate:** dừng, gửi anh bảng. Anh sửa dòng nào thì vào `OVERRIDE`.

## Xong khi

- `npx tsc --noEmit` xanh.
- Mỗi drill có hạng và nhóm (script đếm 124/124).
- Mỗi hạng H → PRO có ít nhất 1 drill, hoặc ghi rõ hạng nào rỗng.
- Anh duyệt bảng.
