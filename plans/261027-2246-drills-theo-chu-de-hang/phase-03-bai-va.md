# Phase 3: Bài vá 10 ô trống (cần phase 1)

Mỗi bài một file trong `src/pool-engine/drills/109-…` trở đi, nối vào `drills/index.ts`, hạng qua `difficulty` hoặc `OVERRIDE` trong `stages.ts`. Không thêm vào `CURRICULUM` (lộ trình đã đủ 12 bài mỗi giai đoạn).

| Ô | Bài | Engine hay vẽ tay | Nguồn |
|---|---|---|---|
| Banks · H–H+ | bank ngắn lỗ giữa, đổi độ dày để bi cái né đường bi mục tiêu (không double kiss) | vẽ tay nếu rack-harness không ra bank | Ron.thepoolstudent, https://www.facebook.com/share/r/14snmuLdn3H/ |
| Banks · E–D | 5 cú bank trượt, mỗi cú gắn số diamond theo hệ twice-plus-tenths | vẽ tay | Dr. Dave, https://www.facebook.com/share/v/1TRYDTdW86/ |
| Kicks · G–G+ | kick một băng chạm bi lộ rõ, chỉ cần chạm | vẽ tay | chưa có bài lưu, giữ ý tưởng |
| Kicks · C | kick 2 băng theo công thức trừ (7 − 2): 4 cặp số bi cái/đích, chỉ cần chạm | vẽ tay | Giỏi Bi-a, https://www.facebook.com/share/v/1BGmEfWtxP/ |
| Safety · E–D | cùng một thế, 3 lời giải: cắt mỏng giấu, đẩy bi xa, cú vào lỗ kèm vị trí | vẽ tay | RioBilliard, https://www.facebook.com/share/v/152EhjcN7nk/ · https://www.facebook.com/share/v/1EkW5onSgE/ · https://www.facebook.com/share/v/1CGx8zZwGW/ |
| English · E–D | cùng một cú cắt có phê ở 3 mức lực, bù squirt khác nhau | engine | RioBilliard, https://www.facebook.com/share/v/1DAgDzNxCo/ · Tuấn Monkey, https://www.facebook.com/share/v/19f4CbDR7U/ · RioBilliard, https://www.facebook.com/share/v/1C9HU8tcWy/ |
| Jump & Massé · E–D | jump qua bi chặn nửa bàn rồi vào lỗ | vẽ tay | chưa có bài lưu, giữ ý tưởng |
| Jump & Massé · C | massé nửa vòng quanh bi chặn, chạm đúng bi | vẽ tay | chưa có bài lưu, giữ ý tưởng |
| Patterns · H–H+ | PPC layout 1–3, đi theo pattern Dr. Dave | engine | Dr. Dave, https://www.facebook.com/share/v/1E3xVY3Tyg/ |
| Patterns · F | PPC layout 4–6 | engine | Dr. Dave, https://www.facebook.com/share/v/1E3xVY3Tyg/ |

## Việc

- Bài engine: thêm `Drill(id: …)` vào `scripts/rack-harness/main.swift`, lấy `shots` từ `sh scripts/rack-harness/run.sh <ids>`, subtitle "Checked in simulation, not on a real table."
- Bài vẽ tay: `rounds` có speed, `why`, `expectedCuePath` > 2 điểm, subtitle "Path drawn, not simulated."
- Engine không ra cú hợp lý thì đổi sang vẽ tay và ghi vào Phát sinh, không ép.

## Xong khi

- `sh scripts/drill-lint/run.sh <10 id mới>` ra `0 vi phạm, 10 drill đạt`.
- Full lint: 0 dòng `topic … trống`, không dòng `curriculum` mới.
- `npx tsc --noEmit` exit 0.
