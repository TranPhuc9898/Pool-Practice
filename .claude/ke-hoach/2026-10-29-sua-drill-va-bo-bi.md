# Sửa drill theo luật, thay 123 bằng Line-of-Balls, thống nhất bộ bi — 2026-10-29

**Xong là:** `node grade.js` của audit ra SAI 0 (bài còn rớt có dòng lý do trong báo cáo), drill 123 trên simulator là 9 bi dọc đường tâm của Dr. Dave, và mọi chỗ vẽ bi trong app cùng một bộ màu Tournament BLACK.
**Cách làm:** sửa data drill bằng route của `scripts/rack-harness` chạy trên `ShotPhysics` thật, bộ màu RN chép theo `TournamentBlackPalette.swift`. Lý do: engine và bàn native là thứ Play dùng, nên chúng là chuẩn, data và RN chạy theo.
**Đánh đổi:** cú 5–9 của drill 123 lấy từ engine vì Dr. Dave không vẽ. Draw/stop matrix (51, 54, 56) có thể phải dời zone lệch khỏi bài gốc BU để bi cái không chạm băng.
**Không làm:** không hiệu chỉnh engine (plan `2026-10-18-hieu-chinh-engine.md`), không đổi layout UI, không đụng bài 31 (replay video) và ba bài chỉ có bi cái (50, 82, 85), không xem video NV C.8.

## Bước

- [x] 1. Lát mỏng drill 123: data `src/pool-engine/drills/123-line-of-balls-vepp.ts` (xoá `123-center-line.ts`, sửa `drills/index.ts`), route lấy từ `scripts/rack-harness/main.swift` với zone cú 1–2 đo từ Diagram 1 → xong khi: `sh scripts/rack-harness/run.sh 123` in `9/9`, `REBUILD=1 sh $S/audit/q.sh 123` chấm OK, và `pooltraining://drill/123` trên simulator hiện 9 bi ở x 0.5, bi 1 cách băng foot một bi
- [x] 2. Bộ bi RN theo Tournament BLACK trong `src/pool-domain/pool-colors.ts` và `src/pool-domain/pool-ball.tsx` (bi sọc có cực đen) → xong khi: trên simulator, màn `/design-system` có khối Pool Domain và `PoolBallRackView` cùng màu ở từng số 1–9, và `grep -rn "F2C230\|1F4FB8" src` ra 0 dòng
- [x] 3. Sửa tip, lực, zone cho 8, 10, 24 r3, 120, 121 trong `src/pool-engine/drills/` → xong khi: `ONLY=8,10,24,120,121 node grade.js` ra OK cả năm bài
- [x] 4. Sửa 9, 53, 119 (bi cái quá `allowedRails`) → xong khi: `ONLY=9,53,119 node grade.js` OK, hoặc bài còn rớt có lý do trong docblock
- [x] 5. Sửa 51, 54, 56 (allowedRails 0, engine ra 2–4 băng) bằng cách dời zone hoặc bi gần hơn, không nâng `allowedRails` → xong khi: `ONLY=51,54,56 node grade.js` OK, hoặc bài còn rớt có lý do trong docblock
- [x] 6. Soát 46, 60, 95 đụng bi ngoài kế hoạch → xong khi: trường `moved` của audit cho ba bài này chỉ còn bi có trong `shots`
- [ ] 7. Chạy lại toàn bộ (cần 1–6) → xong khi: `REBUILD=1 sh $S/audit/q.sh` + `node grade.js` ra SAI 0, `sh scripts/drill-lint/run.sh`, `npx tsc --noEmit` và `npx expo lint` exit 0, báo cáo ghi ở `plans/reports/audit-261029-*-sua-drill-va-bo-bi.md`

## Vỡ ở đâu

- Audit nằm ở scratchpad `/private/tmp/claude-502/.../scratchpad/audit`, reboot là mất → kiểm bằng: `ls $S/audit/main.swift` trước bước 1. Mất thì dựng lại từ transcript phiên 5b9e4287 trước khi làm tiếp.
- Khoá zone cú 1–2 thì harness chỉ ra 6/9 (lần chạy 2026-10-29) → kiểm bằng: run.sh 123. Vẫn 6/9 thì chỉ khoá zone cú 1, ghi lại cú nào lệch nguồn.
- `rows.json` có thể cũ so với data hiện tại → kiểm bằng: chạy lại bước 7 một lần trước bước 3 để lấy danh sách rớt thật.

## Phát sinh
- Bước 1: khoá zone theo Diagram 1 thì rack-harness chỉ ra 8/9, nên drill 123 dùng route thả tự do 9/9. Cú 1 khớp nguồn, từ cú 2 lệch sơ đồ (cú 2 cắt 40°). Ghi trong docblock.
- Bước 3: 24 r3 dời bi và bi cái 8" về lỗ giữa trái (chỗ cũ mọi cú sạch ≥ 3 băng). 120 dời zone 1 theo chỗ dừng cú bi 1. Các round đổi tip/lực bỏ `rate` cũ.
- Scanner `moved` cũ báo sai khi bàn còn bi khác; đã sửa, kết quả scan 120 trước đó bỏ.
- Bước 4: drill 9 đổi sang cú cố định 1.0 m/s, zone dời về chỗ dừng một băng (OK). `q.sh` nhận danh sách phẩy; lần chạy cách khoảng chỉ chấm bài đầu, nên 51/53/54/56/119 vẫn rớt.
- Bước 6: 46 round 30° và 39° đổi tip/lực về giữa dải ăn sạch (OK). 60 r1/r3 và 95 mọi round vẫn đụng bi.
- Bước 4: 53 chín ô có `cueBall` riêng (dời theo x, y giữ 0.75). 119: rack-harness thêm trần `maxRails` (đếm băng như audit), chạy lại với `maxRails: 2` ra route mới; cú 2 và 4 rate 1/45, mong manh. 9, 53, 119 audit OK.
- Bước 5: gốc chung của 51, 54 là engine nhắm tâm lỗ góc, bi "dọc băng" thành cú cắt và draw ném bi cái vào băng. 51 dời bi 1 ra y 0.16, 54 dời bi 1 về x 0.05; bi cái và zone đặt trên đường tâm lỗ → bi (cú thẳng lỗ). 56 cú cắt 27° không giết được bi cái ở ghost với 0 băng (còn 8–9" dọc tiếp tuyến), nên vùng đích dời ra điểm chết trên tiếp tuyến. Cả ba audit OK, lệch toạ độ BU ghi trong docblock.
- Bước 6: 60 Spot B lực 1.4, Spot D lực 0.8 thì cú mẫu không đụng cụm. 95 là break, đụng cả rack là chủ ý, không sửa.
