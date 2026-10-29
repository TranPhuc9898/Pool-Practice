# Giáo trình 6 giai đoạn × 12 bài trên tab Drills — 2026-10-27

**Xong là:** tab Drills trên máy thật hiện 6 section `Stage 1 · Foundations` … `Stage 6 · Pro`, mỗi section đúng 12 card đánh số 01–12, bài cuối là bài kiểm, và `sh scripts/drill-lint/run.sh` không còn dòng `curriculum`.
**Cách làm:** thêm `CURRICULUM: Record<stage, id[12]>` cạnh `STAGES` trong `src/pool-engine/stages.ts`, tab Drills đọc nó bằng `Section` + `DrillCard` sẵn có. Lý do: không vẽ màn mới, và thứ tự giáo trình là dữ liệu tự soạn, không suy ra được từ `difficulty`.
**Đánh đổi:** số trên card ở tab Drills đổi từ số trong nhóm sang số trong giai đoạn, trong khi Home và `/area/[id]` vẫn đánh số theo nhóm. Cùng một bài sẽ có hai số khác nhau cho tới khi Home đổi theo, việc đó để plan riêng.
**Không làm:** không khoá giai đoạn, không xếp hạng người chơi, không đổi Home, `/area/[id]` và `TRAINING_AREAS`, không đổi schema `PoolDrill`.

## Bước

- [x] 1. Lát mỏng: `CURRICULUM` trong `src/pool-engine/stages.ts` lấy bài sẵn có (chưa đủ 12 thì để thiếu), bài kiểm đứng cuối. Thêm `stageNumberIn`, `src/app/(tabs)/drills/index.tsx` render 6 section theo giai đoạn cộng section cuối `More drills` cho bài nằm ngoài giáo trình. `src/components/drill-card.tsx` nhận số từ props → xong khi: `npx tsc --noEmit` và `npx expo lint` sạch, simulator tab Drills thấy section đầu `Stage 1 · Foundations` với card 01 và bài 32 đứng cuối
  ✓ 2026-10-27 17:25 · tsc=0 lint=0; simulator: `Stage 1 · Foundations` 01 Straight-In … 09 10 Straight-In in a Row, rồi `Stage 2 · Club`; `numberIn` ngoài drill-card vẫn 2 chỗ ở program-bento
- [x] 2. Kiểm giáo trình trong `scripts/drill-lint/lint.js` , kèm bảng số bài theo giai đoạn × nhóm → xong khi: drill-lint in bảng đó (hôm nay ra 9/11/37/21/11/7) và mỗi giai đoạn một dòng `curriculum`, gồm số bài khác 12, nhóm nào dưới 2 bài, bài cuối khác `gate`, id lạ hoặc trùng. Danh sách in ra là backlog của bước 3–6
  ✓ 2026-10-27 17:31 · bảng tổng 9/11/37/21/11/7; 11 dòng curriculum: G1 9 bài Pos 0 · G2 11 bài Pos 0 Pat 1 · G5 8 bài CB 0 Pos 0 · G6 7 bài Fund 0 CB 0; Tổng 195 vi phạm
- [x] 3. Cân lại giai đoạn 3: đọc lại 37 bài, dời bài hợp hơn sang giai đoạn 2 hoặc 4 bằng `OVERRIDE` trong `src/pool-engine/stages.ts`, mỗi lần dời ghi lý do một dòng → xong khi: bảng giai đoạn × nhóm của drill-lint ra giai đoạn 3 ≤ 20 bài, giai đoạn 2 có ≥ 2 bài Position
  ✓ 2026-10-27 17:38 · bảng ra 9/14/20/35/11/7, G2 Pos 2, không dòng `stage` nào; Tổng 192 vi phạm (184 cũ + 8 curriculum)
- [x] 4. Soạn bài vá giai đoạn 1–2 (Position: stop, follow, draw về vùng rộng) trong `src/pool-engine/drills/97-…` trở đi, cập nhật `CURRICULUM` (cần 2, 3) → xong khi: `sh scripts/drill-lint/run.sh <số mới>` 0 vi phạm, dòng `curriculum` của giai đoạn 1–2 biến mất
  ✓ 2026-10-27 · `run.sh 97 98 99` ra `0 vi phạm, 3 drill đạt`; bảng G1 5/3/2/2 = 12, chỉ còn dòng curriculum của G5, G6; tsc=0
- [x] 5. Soạn bài vá giai đoạn 5 (Cue Ball, Position vùng hẹp), file tiếp số, chạy qua `scripts/rack-harness/main.swift` nếu engine mô phỏng được → xong khi: dòng `curriculum` của giai đoạn 5 biến mất, các bài mới 0 vi phạm
  ✓ 2026-10-27 · `run.sh 100 101 102 103` ra `0 vi phạm, 4 drill đạt`; bảng G5 2/2/2/9 = 15 nhóm, hết dòng curriculum G5; cú từ `rack-harness/run.sh 100…103`
- [x] 6. Soạn bài vá giai đoạn 6 (Fundamentals cắt mỏng xa, bank gọi lỗ, Cue Ball, Position) → xong khi: drill-lint không còn dòng `curriculum` nào, `tsc` và `expo lint` sạch
  ✓ 2026-10-27 · `run.sh 104…108` 0 vi phạm 5 đạt; full lint không dòng curriculum, bảng G6 2/2/2/6 = 12, Tổng 184 vi phạm (= nền cũ); tsc=0, expo lint 0 warning
- [ ] 7. Build lên iPhone `00008150-000C04892E99401C` qua Metro 8082 → xong khi: anh lướt tab Drills thấy đủ 6 section × 12 card, mở bài 01 của giai đoạn 1 và bài kiểm giai đoạn 6 chạy được cú đầu

## Vỡ ở đâu

- `numberIn` đang được `program-bento.tsx` và `drill-card.tsx` dùng chung, đổi nhầm thì Home lệch số → kiểm bằng: `grep -rn "numberIn" src` trước và sau bước 1 phải ra cùng số chỗ gọi ngoài `drill-card.tsx`
- Dời bài bằng `OVERRIDE` làm `gate` của giai đoạn cũ rơi sang giai đoạn khác → kiểm bằng: khối stage có sẵn trong drill-lint báo lỗi gate
- Bài Position và Safety engine không mô phỏng được nên phải vẽ tay, đường đi có thể sai → kiểm bằng: subtitle ghi "Path drawn, not simulated", anh thử trên bàn thật ở bước 7

## Phát sinh

- Bước 3 phải sửa `CURRICULUM` của G2, G3 theo bài vừa dời (07, 24, 13 lên G2; 15, 58 vào G3; 39, 40 ra More drills), không thì lint báo id lệch giai đoạn và card mất số. G2 nhờ vậy đã đủ 12, bước 4 chỉ còn vá G1.
- Bước 5 thêm 4 mục `Drill(id: 100…103)` vào `scripts/rack-harness/main.swift` để engine dò cú, zone 100 đặt tay, 101–103 tự sinh.
- Bước 6 thêm `Drill(id: 104, 106, 107, 108)` vào `scripts/rack-harness/main.swift`; 104–108 vào `OVERRIDE` giai đoạn 6 vì `difficulty` chỉ tới 5. 106, 107 engine chọn center ball nên gắn skill speedControl thay cho drawAngle/followDistance như dự tính.
