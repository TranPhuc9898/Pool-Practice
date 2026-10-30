# Brainstorm hạng G — 2026-10-30

Nguồn: `~/Downloads/deep-research-report (2).md`. Báo cáo tự nhận chưa đọc được repo. Đối chiếu với
`src/pool-engine/levels.ts` và `scripts/drill-lint` ngày 2026-10-30.

## Quyết định của anh

- G lấy đủ 20 bài của báo cáo: 99 (chuyển từ H, giữ ID) và 141–159 mới. ID 141–159 còn trống trong repo.
- 10 bài G cũ (34, 35, 37, 38, 39, 40, 41, 74, 97, 98) giữ nguyên ở G. G thành 30 bài, H còn 14.
- 155–159 là bài G mới dễ hơn bài cùng kỹ năng đã có (65, 64, 27, 58, 60 giữ hạng D, C−, C+): góc nông, target rộng.
- Phần H của báo cáo (ID 131–140, đưa 36 và 49 về H) không làm: 131–139 đã là bài H khác, plan B đã chốt 36→F, 49→E.

## Hai giai đoạn

**Giai đoạn 1, engine hiện có (15 bài):** 99 và 141–154. Pocket + zone + số băng + chuỗi bi đều chấm được bằng
`pocketed`, `inZone`, `shots`, `allowedRails`. Tip/lực/rate lấy từ harness, như 131–139.

**Giai đoạn 2, cần thêm PassCondition (5 bài):** 155–159.
- 155, 156 kick: chạm bi mục tiêu đầu tiên sau đúng 1 băng.
- 157 bank: bi mục tiêu chạm 1 băng rồi vào lỗ. Harness chưa ngắm cú bank.
- 158 distance safety: chạm hợp lệ, bi cái và bi mục tiêu cùng vào zone của mình.
- 159 hide: chạm hợp lệ, không có đường thẳng bi cái → bi mục tiêu.
- Đổi union `PassCondition` trong `types.ts` là đổi schema, cần brainstorm riêng trước khi code.

## Bảng 20 bài G

| ID | Bài | Chấm |
|---|---|---|
| 99 | Stop and Go | đã có, chỉ đổi hạng |
| 141 | Tangent-Line Gate to Shape | pocket + zone trên tiếp tuyến + bi 2 |
| 142 | Stun-Follow to Zone | pocket + zone trước tiếp tuyến |
| 143 | Stun-Draw to Zone | pocket + zone sau tiếp tuyến |
| 144 | Natural Roll Angle | pocket + zone theo đường lăn tự nhiên, không phê ngang |
| 145 | One-Rail Position – Short | pocket + 1 băng + zone gần |
| 146 | One-Rail Position – Long | pocket + 1 băng + zone nửa bàn đối diện |
| 147 | Rail Cut with Position | bi sát băng dài, pocket + zone |
| 148 | Thin Cut with Containment | cắt mỏng, bi cái không vượt vạch (zone) |
| 149 | Back-Cut with Position | pocket + zone |
| 150 | Side-Pocket Route | bi 1 vào lỗ giữa, zone, không scratch |
| 151 | Two-Ball Route – Stop/Stun | chuỗi 1→2, zone cho bi 2 |
| 152 | Two-Ball Route – Follow | chuỗi 1→2, follow vào zone |
| 153 | Two-Ball Route – Draw | chuỗi 1→2, draw vào zone |
| 154 | Three-Ball Mini Runout | chuỗi 1→2→3, mỗi cú có zone |
| 155 | One-Rail Mirror Kick | giai đoạn 2 |
| 156 | Shallow One-Rail Kick | giai đoạn 2 |
| 157 | Basic One-Rail Bank | giai đoạn 2 |
| 158 | Distance Safety | giai đoạn 2 |
| 159 | Hide Behind Blocker | giai đoạn 2 |

Mỗi bài theo `CLAUDE.md` và `docs/chuan-drill.md`: số bi tăng theo cú, đường vẽ là đường engine, zone round riêng.

## Xong là

- `drill-lint` báo "đạt" cho 99 và 141–154; simulator Play qua mọi cú không báo trượt.
- `levelOf` ra G cho 99 và 141–159, 10 bài G cũ không đổi.
- Giai đoạn 2 xong khi 155–159 cũng lint "đạt" với PassCondition mới.

## Vỡ ở đâu

- 145, 146 cần bi cái chạm đúng 1 băng tới zone, rate có thể thấp → quét vị trí trong harness trước khi viết file.
- 154 ba bi theo chuỗi, rate nhân dồn → zone rộng, kiểm bằng `chain`.
- 141–143 dễ trùng 98 → mỗi bài có bi 2 và zone khác vị trí, ghi lý do trong header.

## Cập nhật 2026-10-30 16:42: bỏ bài trùng

Anh bảo bài nào trùng bài đã có thì xoá. Bỏ 141, 144, 151, 152, 154, 155–159 (bảng lý do trong
[plan](../261030-1642-drill-hang-g/plan.md)). Giai đoạn 2 không còn, không đổi `PassCondition`.
G còn 10 bài mới: 99, 142, 143, 145–150, 153. G thành 20, H còn 14. Plan thay cho các mục trên.

Cập nhật 16:55: bỏ thêm 143 vì trùng 138 (cắt nhẹ, draw về zone). G còn 9 bài mới: 99, 142, 145–150, 153. G thành 19, H còn 14.
