---
phase: 4
title: Lọc trên tab Drills
status: pending
---

# Phase 4 — Lọc trên tab Drills

## Files

- Sửa: `src/app/(tabs)/drills/index.tsx`
- Sửa: `src/components/drill-card.tsx`

## Bước

1. Xem control có sẵn trong `src/components/` trước (chip, segmented, pill). Dùng lại, không vẽ control mới.
2. `drills/index.tsx`: hai hàng lọc phía trên danh sách, hạng và nhóm. Mặc định "All". Có lọc thì danh sách phẳng; không lọc thì giữ nhóm theo giai đoạn như hiện tại nhưng caption bỏ `stage.sabo`.
3. Chỉ hiện giá trị lọc có ít nhất 1 drill. Tổ hợp ra rỗng: empty state "No drills at this level yet" kèm nút xoá lọc.
4. `drill-card.tsx`: dòng phụ đổi từ `Stage n ~SABO` sang `hạng · nhóm`. Thêm nhãn kiểm chứng ngắn: `Simulated`, `Path drawn`, `Video`, `Unverified`.

## Xong khi

- `npx tsc --noEmit`, `npx expo lint` exit 0.
- `grep -rn "sabo" src/app src/components` ra rỗng.
- Simulator: lọc `C−` + `Kick` ra đúng danh sách theo bảng phase 1. Một tổ hợp rỗng hiện empty state. Mở drill từ danh sách lọc vẫn chạy Play như cũ.
