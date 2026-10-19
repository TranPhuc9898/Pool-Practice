# Drill mới từ research pool-9ball batch 1–3 — 2026-10-19

**Xong là:** 7 drill mới (24–30) mở được từ tab Drills, mỗi drill có comment nguồn (file research + nhãn) và số zone/vị trí lấy từ harness trên `ShotPhysics`; `npx tsc --noEmit` exit 0, `npx expo lint` không lỗi; drill 01–23 chạy như cũ; có file quyết định cho drill đo số.
**Cách làm:** drill là data như 01–23. Mở rộng schema theo kiểu tuỳ chọn, không bump `progress`, không thêm giá trị `result`, không sửa data drill đã có attempt (luật của `docs/quyet-dinh/2026-10-17-position-3-bi.md`). Mọi con số zone, vị trí bi cái, điểm bank chạy bằng harness rồi mới chép vào drill, research chỉ dùng để đối chiếu.
**Đánh đổi:** số trong drill khớp engine chưa hiệu chỉnh (`2026-10-18-hieu-chinh-engine.md` còn treo ở bước 2). Hiệu chỉnh xong thì chạy lại harness và cập nhật zone. Chấp nhận để có drill ngay thay vì chờ đo bàn.
**Không làm:** drill đo số NPL, SAWS 3×3, tự hiệu chỉnh 2 băng dài (bước 8 chỉ chốt cách lưu); drill chấm theo đích của #6, #7 (research 06 mục 3: chờ hiệu chỉnh băng); kick; break box và luật 3 bi dạng tham số theo giải; Play cho cú có phê ngang; thiết kế lại UI; research batch 4–6.

## Drill

| Id | Tên | Nhóm | Nguồn | Chấm |
|---|---|---|---|---|
| 24 | Natural Angle | positionPlay | 06 #3, Shepard, Jewett Shot 2 | inZone theo round góc cắt 10/30/60/75° |
| 25 | Draw Trisect | cueBallControl | 06 #4 | inZone, zone ở miệng lỗ giữa |
| 26 | English Check | fundamentals | 07 mục 4, BHE/FHE | pocketed, round phê thuận / phê nghịch |
| 27 | Bank Ghost Pocket | fundamentals | 08 #10 | pocketed, 3–4 round đổi vị trí bi mục tiêu |
| 28 | Long Bank | fundamentals | 08 mục 4 | pocketed, round lùi bi mục tiêu xa băng |
| 29 | Break: 1 to Side | patterns | 09 #1, BD 1/2021 | pocketed (bi 1 vào lỗ giữa), round dời bi cái trong box |
| 30 | Break: Squat | patterns | 09 #2, BU S10 | inZone, zone giữa bàn |

## Bước

- [x] 1. Schema trong `src/pool-engine/types.ts`: `DrillSkill` thêm `naturalAngle`, `drawAngle`, `english`, `bank`, `break`; `DrillRound` thêm tuỳ chọn `objectBalls`, `guideLines`, `contactPoint`; `GuideLine` thêm `{ kind: 'objectBallBankPath'; points }`. Map nhóm trong `src/components/home/training-areas.ts`. `src/app/drill/[id].tsx` ghép trường của round giống cách đang ghép `cueBall`, round đổi bi mục tiêu thì có `rev` riêng → xong khi: `npx tsc --noEmit` exit 0; drill 22 trên simulator round 15° vẫn dời bi cái như trước.
  ✓ 2026-10-19 · `tsc exit 0`; sim Pool Training, bundle :8095 có `roundMovesTable`, drill 22 shot 4/15 round 15° bi cái ≈ (0.72, 0.557) khớp `{0.7288, 0.5591}`, không ở chỗ gốc `{0.8405, 0.5253}`
- [x] 2. Native: `Drills/DrillRecord.swift` đọc `objectBallBankPath`, `Rendering/PoolGuideRenderer.swift` vẽ nó bằng `PoolGuidePalette.path` nét liền → xong khi: drill nháp có guide này hiện đường bi mục tiêu gãy ở băng trên simulator; guide của drill 07 không đổi.
  ✓ 2026-10-19 · `expo run:ios` 0 error(s); drill 07 nháp thêm tạm `objectBallBankPath` (0.75,0.2)→(0.0225,0.55)→(1,1) hiện đường trắng nét liền gãy ở băng trái, đã revert; vùng bàn drill 07 trước/sau build khác 0 byte
- [x] 3. Harness: thêm case cho 24, 25, 30 vào `scripts/position-harness/main.swift` (vị trí bi cái, tipY, speed → điểm dừng bi cái, `rate=K/45`) → xong khi: `sh scripts/position-harness/run.sh` in một dòng mỗi round của 24, 25, 30; dòng của 24 in kèm góc lệch so với bảng Shepard.
  ✓ 2026-10-19 · `run.sh` exit 0, drill 23 trùng baseline; 24: 10° rate=45/45 lệch +4.3°, 30° 42/45 +0.1°, 60° 39/45 −2.1°, 75° 20/45 −0.9°; 25 rate=2/45; 30 rate=4/45
- [x] 4. Drill 24, 25 trong `src/pool-engine/drills/` + `index.ts`, zone chép từ bước 3, tips/mistakes chỉ lấy claim VERIFIED, CONDITIONAL, APPROXIMATION (cần 1, 3) → xong khi: mở `/drill/24`, `/drill/25` trên simulator, Play mỗi round bi cái dừng trong zone.
  ✓ 2026-10-19 · sim Pool Training: `/drill/25` Play bi cái dừng trong zone Side; `/drill/24` Play 10° (0.4 m/s), 30° (0.9), 60° (0.9), 75° (2.5) bi cái nằm trong vòng của round (chụp liên tiếp `simctl io screenshot`); `tsc exit 0`, `expo lint exit 0`; log test drill 24 đã Undo về 00/8
- [ ] 5. Drill 26 với `contactPoint` theo round; Play ẩn ở round có phê ngang vì engine không có swerve (cần 1) → xong khi: `/drill/26` đổi điểm đặt cơ theo round, nút Play không hiện ở round phê.
- [ ] 6. Drill 27, 28: điểm bank đặt ở 0.8 W theo #10, ghi trong tip là điểm khởi đầu để tự chỉnh, không phải đáp án. Harness đo điểm bank engine thực ra (C11 ở research 16). Ghi một dòng vào `docs/quyet-dinh/2026-10-14-huong-san-pham.md`: bank dạng drill tự báo vào phạm vi, Rail Calculator vẫn hoãn (cần 2, 3) → xong khi: `/drill/27` mỗi round hiện bi mục tiêu và đường bank đúng vị trí; dòng harness in điểm bank engine cạnh 0.8 W.
- [ ] 7. Drill 29, 30: rack 9 bi, bi 9 trên spot (29) và bi 1 trên spot (30); tên tiếng Anh theo vị trí bi, không dùng "xếp cao/thấp" (B15 chưa chốt). Kiểm Play: planner của `PoolEditorRack.swift` có ra cú break không; không thì ẩn Play như bước 5 (cần 1) → xong khi: `/drill/29`, `/drill/30` hiện đủ 9 bi đúng vị trí rack; Play chạy ra break hoặc không hiện.
- [ ] 8. `ORDER` và `topics` trong `training-areas.ts` thêm 24–30 (Bank vào Fundamentals, Break vào 9-Ball Patterns). Chạy `chay-brainstorm` cho drill đo số (NPL, SAWS, 2 băng dài): lưu ở đâu, đồng bộ server không, ra `docs/quyet-dinh/2026-10-19-drill-do-so.md`, không code (cần 4–7) → xong khi: tab Drills hiện thêm 24–30 đúng nhóm, các drill cũ giữ số 01…N như trước; file quyết định có đủ sáu mục và anh đã gật.
- [ ] 9. Kiểm cuối: `npx tsc --noEmit`, `npx expo lint`, `sh scripts/rack-harness/run.sh` so dòng `18|19|20: potted/total` với trước bước 1 (cần 8) → xong khi: cả ba exit 0 và dòng 18–20 không đổi.

## Vỡ ở đâu

- Engine bank dài hơn bàn thật (k ≈ 0.87 so với 0.71–0.8) nên Play của 27 không qua điểm 0.8 W → kiểm bằng: dòng harness bước 6. Lệch quá một bi thì Play của 27, 28 ẩn, tip nói rõ engine chưa hiệu chỉnh băng.
- Zone 24 theo engine lệch xa bảng Shepard đã cộng phần ma sát (research 06 mục 3) → kiểm bằng: cột lệch ở bước 3. Lệch quá 5° thì dừng, đó là lỗi engine, ghi vào plan hiệu chỉnh chứ không chỉnh zone cho khớp.
- Round đổi bi mục tiêu làm native không nạp lại bàn → kiểm bằng: bước 1 và 6 trên simulator, đổi round thì bi mục tiêu phải nhảy chỗ.
- Remote GitHub từng bị nhiễm (memory 2026-10-16) → không pull hay push trong plan này; commit local theo từng bước khi anh bảo.

## Phát sinh

- Bước 1 phải sửa thêm `modules/pool-table/src/PoolTableView.tsx`: `NativeGuideLine` thêm kind `objectBallBankPath` (cùng nhánh `points` với `expectedCuePath`), không có thì tsc báo 4 lỗi ở chỗ truyền `PoolDrill` vào view native.
- `PoolGuideBuilder` tự thêm `ghostBall` và `cueBallPath` theo hướng bi → `targetPocket` khi drill thiếu. Drill bank (27, 28) mà để vậy thì ghost chỉ thẳng vào lỗ, sai với đường bank. Bước 6 phải khai báo ghost riêng hoặc chặn phần tự thêm khi có `objectBallBankPath`.
- Build: tool build headless của simulator hỏng ở ReactCodegen (`Cannot find module '@react-native/codegen/package.json'`), dùng `npx expo run:ios --no-bundler` thì qua. Metro :8081 là của project GymWorkout; Metro của pool-training ở :8095, sau `run:ios` phải mở lại dev client trỏ :8095.
- Drill 24 dùng lỗ giữa trái cho cả bốn round. Lỗ góc trái không có layout 60°, 75° mà bi cái không chạm băng trước khi lăn đều. Round 30°, 60°, 75° có chạm băng sau đoạn đo góc. Round 10° lệch +4.3°, sát ngưỡng 5°: đánh nhẹ (0.4 m/s) thì engine cho góc rộng hơn Shepard, đáng đưa vào plan hiệu chỉnh.
- Drill 25: rate 2/45. Draw rất nhạy với ±0.1 tipY, 10/45 mẫu bi cái rơi lỗ giữa trái, 23/45 trượt lỗ hoặc rơi lỗ khác. Bước 4 có thể chỉ có một round và zone rộng hơn 3.5.
- Drill 30: speed 5.7 m/s vượt `vMax` 4.5 của thanh lực editor, harness đánh với aim cố định thẳng vào bi 1, không qua `solve`. Trong giới hạn 4.5 tốt nhất chỉ 2/45 (tipY −0.425, 3.2 m/s). Rate 4/45, 4 mẫu bi cái rơi lỗ.
- Bước 4 dừng: Play của drill có `rounds` lấy tipY từ `round.contactPoint` nhưng lực từ `speedMs[recommendedSpeed]` (0.8 / 1.8 / 2.6 m/s, `src/components/drill/stage.ts`), round không đặt được lực hay zone riêng. Drill 24 cần 0.4 / 0.9 / 0.9 / 2.5 m/s, mỗi round một zone. Bốn zone cấp drill thì `multi` bật, Play chỉ chạy sau khi chạm zone và planner native tự chọn tip, lực.
  → Anh gật: `DrillRound.speed?`, round dời bàn có `zone` thì chỉ hiện zone đó, Play dùng `round.speed`; drill 25 dùng `shots` một phần tử. Native Play đọc lực từ `stage.speed` (`PoolEditorModel.adopt`), nên `[id].tsx` đè `speed` ngay trong `stage` của round, không chỉ ở card.
- Kiểm Play bằng `simctl io recordVideo` không tin được: simulator ghi khung thưa, round 60° trông như bi cái dừng ngoài zone. Chụp `simctl io screenshot` liên tiếp (~0.19 s/khung) mới thấy bi chạm băng trên rồi lùi vào vòng.
- Reset của màn drill chỉ xoá `attempts`, giữ `best`; log test đạt ngưỡng thì drill vẫn hiện Passed. Muốn xoá sạch phải Undo từng lần.
