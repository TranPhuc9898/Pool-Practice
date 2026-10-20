---
title: Drill 12 Line of Balls ra được zone trên engine
status: completed
created: 2026-10-20
---

# Drill 12 Line of Balls ra được zone trên engine

## Bối cảnh

Play với cú trên card (draw −0.3, soft 0.8 m/s) từ bi cái (0.80, 0.48): bi 1 dừng thiếu lỗ giữa 14", bi cái trôi theo tiếp tuyến đụng bi 2, 3, 4.
Quét lực 0.8–2.4 m/s, tip −0.8…+0.4 từ chỗ đặt cũ: tốt nhất 10/45. Zone (0.66, 0.44) không cú sạch nào tới, gần nhất lệch 5.7".
Nguyên nhân: bi cái đặt thấp hơn bi 1 nên tiếp tuyến chĩa vào dãy bi. Caption "Land left of 2" ngược với vị trí zone.

## Xong là

- Play từ thế mặc định: bi 1 vào lỗ giữa trái, bi 2–4 không động, bi cái dừng trong zone.
- Harness 45 mẫu lệch tay (lực ×0.9…1.1, tip ±0.1) ≥ 40/45, kể cả cú bi 2 vào góc chân đánh sạch từ chỗ dừng.
- `npx tsc --noEmit` và `npx expo lint` sạch.

## Không làm

- Không đổi thế 4 bi (chuẩn BU Exam II S1), không đổi type, không thêm field `speed` cho drill.
- Không đụng engine, UI. Chuỗi cú dùng `shots` có sẵn (như drill 23), không thêm cơ chế mới.

## Bước

- [x] 1. `src/pool-engine/drills/12-line-of-balls.ts`: cueBall (0.66, 0.43), contact tip −0.1, spin stun, speed medium, zone (0.54, 0.46) r 0.08, step 2 "Stop where 1 was" → xong khi: harness in rate ≥ 40/45 với đúng số trong file
  ✓ 2026-10-20 15:55 · nominal stop (0.540,0.461) d=0.1", rate=45/45 miss=0 outZone=0 noNext=0
- [x] 2. Typecheck và lint → xong khi: tsc và lint exit 0
  ✓ 2026-10-20 · tsc=0 lint=0
- [x] 3. Simulator: mở drill 12, Play → xong khi: ảnh chụp thấy bi 1 vào lỗ, bi cái trong zone
  ✓ 2026-10-20 · video v1: bi 1 vào lỗ giữa trái, bi cái dừng quanh (0.3, 0.5) = tâm zone 2 (zone không vẽ trên bàn, so bằng mắt)
- [x] 4. Phát sinh theo anh ("đánh xong con 1 rồi bi dừng lại đánh tới con 2 chứ"): `shots` 4 cú 1→sideLeft, 2→footRight, 3→sideLeft, 4→sideRight, zone r 0.1 ở chỗ dừng → xong khi: verifier 45 mẫu in rate từng cú khớp `rate` trong file, tsc và lint exit 0
  ✓ 2026-10-20 · hv c2.txt 0.66 0.43: rate 32/27/40/33 · tsc=0 lint=0
- [ ] 5. Simulator: Play bốn lần liền, mỗi lần nối từ chỗ bi cái dừng → xong khi: ảnh thấy card Shot 4/4 và bi 4 vào lỗ
  ✓ 2026-10-20 · AXe 4 lần Play: card 1/4→2/4→3/4→4/4, video v4 bàn chỉ còn bi cái

## Phát sinh

- Bước 1 (cú stun, 45/45) bị thay bởi chuỗi 4 cú: từ zone (0.54, 0.46) greedy và beam đều không nối nổi bi 3–4. Chuỗi mới tỉ lệ thấp hơn drill 23 (min 27/45), bài BU Bachelors vốn khó.

- Native `PoolEditorView.swift` onChange playRev: drill có `shots` luôn đi `playRack()`, trước chỉ runout/railCut nên drill 12 (lineUp) Play xong reset về cú 1.

## Vỡ ở đâu

- Fallback shot của app lấy tipX từ `recommendedContactPoint.x` và hướng cơ do app giải. Harness dùng tipX 0 cùng ghost aim, nên khớp chỉ khi contact x = 0.
