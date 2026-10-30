# Brainstorm: Level H theo deep-research-report

Nguồn đầu vào: `~/Downloads/deep-research-report.md` (báo cáo ngoài, chưa kiểm). Mọi nhận định dưới đây đã đối chiếu với code trên `main` @ `0fcfb23`, trừ chỗ ghi "theo báo cáo".

## Báo cáo đúng ở đâu, sai ở đâu

| Nhận định của báo cáo | Kiểm trong repo | Kết luận |
|---|---|---|
| H có 7 bài: 01, 02, 32, 33, 36, 49, 99 | `levels.ts` dòng 34–40 | Đúng |
| `PassCondition` chỉ có `pocketed` và `inZone` | `types.ts:75` | Đúng, nhưng `kind` chỉ là nhãn. Người chơi tự bấm Pass/Fail (`progress.ts:9`, `recordAttempt`), app không chấm bi tự động. Đếm `pass >= required` |
| 32 không bắt "10 liên tiếp" | `attemptCount: 10`, `required: 10` | Sai. Lượt 10 cú cần 10 pass, trượt một là lượt hỏng, tương đương streak |
| 33 đòi 15/15, quá gắt với H | `required: 15`, `attemptCount: 15`, 3 round Stop/Follow/Draw | Đúng. Quota 3/5 mỗi round theo handout Dr. Dave hợp hơn |
| 36 cắt tới 47–58°, toạ độ suy luận | Docblock dòng 8 ghi đúng các góc này, 8 round, chưa kiểm bàn thật | Đúng, quá sức H |
| 49 là bài lực tinh, layout suy luận | Subtitle "Checked in simulation, not on a real table" | Đúng, quá sức H |
| Thiếu cắt 10–15°, follow riêng, speed vùng rộng, two-ball sequence | Hạng G đã có: 38 BU F1 Cut Progression, 41 Jewett Progressive Cut, 03 Follow, 97 Wide Zones S/F/D, 98 Stun to the Second Ball | Sai. Báo cáo chỉ nhìn bài gán H, không thấy G. 9 bài mới 131–139 phần lớn trùng G |
| Stage 1 gate là 32 | `stages.ts:19` | Đúng |

## Hợp đồng

- **Outcome:** H là bậc vào cửa thật sự: cú thẳng, stop, follow cơ bản, chuỗi hai bi ngắn, cổng 10 cú thẳng. Không bài nào trong H đòi cắt quá 15° hay lực tinh.
- **Constraints:** Hai luật drill trong `CLAUDE.md` (đúng thứ tự, đường vẽ là đường bi thật) và `docs/chuan-drill.md`. Drill mới phải qua `drill-lint`, harness `ShotPhysics`, simulator. Không đổi id drill cũ, tiến độ người chơi gắn theo id.
- **Non-goals:** Không thêm safety vào H (báo cáo tự thừa nhận nằm ở biên trên). Không sửa scoring 32, 99. Không đổi `CURRICULUM` giai đoạn 1. Không làm UX "một tap lớn, streak trực tiếp" của báo cáo.
- **Acceptance:** `LEVEL_BY_NUMBER` cho H ra đúng danh sách chốt. 33 qua khi mỗi round đạt 3/5. Drill mới audit OK. `npx tsc --noEmit`, `npx expo lint` exit 0. Tab Drills hạng H hiện đúng bài.

## Phương án

| | A. Làm theo báo cáo | B. Xếp lại + vá đúng chỗ (khuyên) | C. Chỉ chuyển hạng |
|---|---|---|---|
| Việc | 9 drill mới 131–139, 4 kind scoring mới, chuyển 36→F, 49→E | Chuyển 36→F, 49→E, 03 G→H, thêm 1 drill 131, quota cho 33 | Chuyển 36→F, 49→E |
| H sau đổi | 14 bài | 7 bài: 01, 02, 03, 32, 33, 99, 131 | 5 bài |
| Giả định chính | H cần đủ mọi kỹ năng nền | Ranh H/G hiện tại đúng, H chỉ cần bỏ bài quá khó | 5 bài đủ cho một hạng |
| Vỡ trước ở đâu | 9 toạ độ "đề xuất" phải qua harness và luật đường bi thật, safety 139 cần engine chấm chạm hợp lệ. Trùng 38, 41, 97, 98 của G, G mất nội dung | 03 Follow là chuẩn benchmark G ("stop and follow on demand"), kéo xuống có thể làm G mỏng (11 → 10 bài) | Ngưỡng 2/3 của 5 bài là 4, một bài trượt là tụt, ít lựa chọn |
| Chi phí | Lớn nhất, nhiều phiên | Vừa: 1 drill, 1 kind mới | Nhỏ nhất |

**Better approaches:** B tốt hơn hướng báo cáo đề xuất. Bằng chứng: năm khoảng trống báo cáo nêu đã có bài ở G (38, 41, 03, 97, 98). Thêm 9 bài là nhân đôi nội dung và nhân đôi việc audit.

## Hướng chốt: B

1. `levels.ts`: 36 → F, 49 → E, 03 → H.
2. Drill mới `131 Short Straight-In Left/Right`: hai cú thẳng gương trái phải, bi gần, chỉ bi giữa. Lấp đúng một chỗ trống thật là cự ly ngắn hai phía. Toạ độ của báo cáo (`CB 0.25,0.50 → OB 0.25,0.25 → footLeft`) phải chạy harness trước, chưa dùng thẳng.
3. `PassCondition` thêm `{ kind: 'roundQuota'; requiredPerRound: number }`. `drillStatus`, nhãn `drill-card` và màn drill đọc quota theo round (round đã suy từ thứ tự cú). 33 dùng `requiredPerRound: 3`.
4. Cập nhật `plans/reports/levels-261029-bang-hang-124-drill.md` và câu mốc H giữ nguyên.

## Rủi ro còn mở

- 03 kéo xuống H thì G còn 10 bài, chưa kiểm G có còn đủ nhóm kỹ năng cho ngưỡng 2/3.
- Chưa đo 36 có cần đổi cả giai đoạn trong `CURRICULUM` không. Giai đoạn và hạng là hai trục riêng, hiện em giữ nguyên.
- `roundQuota` đụng `progress.ts`, tiến độ cũ của 33 (đếm tổng) sẽ được chấm lại theo quota khi đọc. Lượt đã qua 15/15 vẫn qua.

## Câu hỏi chưa giải

1. Anh có muốn kéo 03 Follow xuống H không, hay giữ G nguyên và H chỉ còn 6 bài?
