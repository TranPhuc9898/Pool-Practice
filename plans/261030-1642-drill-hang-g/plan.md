---
title: Hạng G, 9 bài từ báo cáo sau khi bỏ bài trùng
description: Chuyển 99 sang G và thêm 8 bài mới 142, 145–150, 153 qua harness, không đổi schema
status: completed
priority: P2
effort: 1.5d
branch: feat/backend-railway
tags: [drills, rank-g]
blockedBy: []
blocks: []
created: 2026-10-30
---

# Hạng G

Nguồn: [brainstorm-261030-1624](../reports/brainstorm-261030-1624-level-g.md) và `~/Downloads/deep-research-report (2).md`.

## Bỏ vì trùng (11 bài)

Trùng nghĩa là cùng kỹ năng và cùng cách chấm với một bài đã có, bất kể hạng.

| Báo cáo | Trùng với | Lý do |
|---|---|---|
| 141 Tangent-Line Gate | 98 Stun to the Second Ball (G) | stun theo tiếp tuyến vào zone rồi bi 2 |
| 143 Stun-Draw to Zone | 138 Short Position Wide Zone (H) | cắt nhẹ, draw về zone sau tiếp tuyến |
| 144 Natural Roll Angle | 24 Natural Angle (F) | bi lăn tự nhiên, chấm zone |
| 151 Two-Ball Stop/Stun | 99 Stop and Go | 1→2, stop ở ghost bi 2 |
| 152 Two-Ball Follow | 137 Two-Ball Rolling Sequence (H) | 1→2, lăn vào zone |
| 154 Three-Ball Mini Runout | 23 Three-Ball Position (C−) | 1→2→3, zone sau cú 1 và 2 |
| 155 One-Rail Mirror Kick | 64 BU S6 One-Rail Kick (D) | kick 1 băng |
| 156 Shallow One-Rail Kick | 65 Shallow One-Rail Kick (D) | trùng cả tên |
| 157 Basic One-Rail Bank | 27 Bank Ghost Pocket (C−) | bank 1 băng |
| 158 Distance Safety | 58 Equal Separation (C−) | safety khoảng cách |
| 159 Hide Behind Blocker | 60 BU S5 Snooker Behind a Cluster (C+) | giấu sau bi chặn |

Bỏ 155–159 thì giai đoạn 2 (PassCondition mới, đổi schema) không còn. Quyết định "bài G mới dễ hơn cho kick/bank/safety" hôm nay bị thay bằng luật bỏ trùng.

## Giữ (9 bài), G thành 19, H còn 14

| ID | Bài | Khác bài gần nhất ở |
|---|---|---|
| 99 | Stop and Go | chỉ đổi hạng H → G |
| 142 | Stun-Follow to Zone | cú cắt, zone trước tiếp tuyến; 97 là cú thẳng |
| 145 | One-Rail Position – Short | bi cái đúng 1 băng tới zone gần, chưa bài nào |
| 146 | One-Rail Position – Long | 1 băng sang nửa bàn đối diện |
| 147 | Rail Cut with Position | 1 bi sát băng + zone; 18 chỉ chấm vào lỗ |
| 148 | Thin Cut with Containment | cắt mỏng, bi cái giữ trong zone |
| 149 | Back-Cut with Position | back-cut + zone, chưa bài nào |
| 150 | Side-Pocket Route | lỗ giữa + zone + chuỗi; 139 không có zone |
| 153 | Two-Ball Route – Draw | 1→2, draw vào zone; 137 là lăn |

## Hợp đồng

- **Outcome:** `levelOf` ra G cho 99, 142, 145–150, 153 và 10 bài G cũ; Play qua từng cú của 9 bài không báo trượt.
- **Constraints:** chỉ dùng `pocketed`, `inZone`, `roundQuota`, `shots`, `allowedRails` có sẵn. Tip, lực, rate lấy từ `scripts/position-harness` trên ShotPhysics `65a775f`. Luật drill trong `CLAUDE.md` và `docs/chuan-drill.md`. Không đổi `drillId` cũ.
- **Non-goals:** 141, 144, 151, 152, 154–159; sửa vi phạm lint của bài G cũ (37, 38, 39, 41, 74); phần H của báo cáo; đổi UI.
- **Acceptance:** `sh scripts/drill-lint/run.sh` báo "đạt" cho 9 bài; `npx tsc --noEmit` và `npx expo lint` sạch; simulator Play mọi cú không ra "Missed".

## Phase

| # | File | Bài | Trạng thái |
|---|---|---|---|
| 1 | [phase-01-lat-mong.md](phase-01-lat-mong.md) | 99 → G, 142 | completed |
| 2 | [phase-02-cat-va-zone.md](phase-02-cat-va-zone.md) | 147, 148, 149 | completed |
| 3 | [phase-03-mot-bang.md](phase-03-mot-bang.md) | 145, 146 | completed |
| 4 | [phase-04-chuoi-va-lo-giua.md](phase-04-chuoi-va-lo-giua.md) | 150, 153 | completed |
| 5 | [phase-05-kiem-cuoi.md](phase-05-kiem-cuoi.md) | cả 9 | completed |

Phase 2–4 cần 1 xong trước, độc lập với nhau. Phase 5 cần 1–4.

## Vỡ ở đâu

- 145, 146 bi cái 1 băng tới zone, rate có thể dưới 30/45 → quét vị trí trong harness trước khi viết file; rớt thì nới zone, không nới `allowedRails`.
- 148 cắt mỏng dễ trượt → rate bi mục tiêu vào lỗ đo riêng, dưới 35/45 thì giảm góc.
- 150, 153 rate nhân dồn qua 2 cú → kiểm bằng `chain()`, ghi rate từng cú vào `shots`.

## Kết quả 2026-10-30

| Bài | Rate harness /45 | Ngưỡng | Play simulator |
|---|---|---|---|
| 142 | 27 | 6/10 | vào sạch |
| 145 | 37 | 6/10 | vào sạch |
| 146 | 22 | 5/10 | vào sạch |
| 147 | 25 | 6/10 | vào sạch sau khi đổi skill |
| 148 | 26 | 6/10 | vào sạch |
| 149 | 22 | 5/10 | vào sạch |
| 150 | 43 → 45 | 7/10 | hai cú vào sạch |
| 153 | 27 → 45 | 6/10 | hai cú vào sạch |

- 147 lúc đầu mang skill `railCut`, Play báo "Missed Ball 1" mà bi không chạy: `replan()` trong `PoolEditorView.swift` bỏ qua `railCut` vì skill đó dành cho bài rack. Đổi skill sang `cutAngle`, nhãn giữ "Rail Cut".
- Lint full repo còn vi phạm ở bài cũ, ngoài phạm vi plan. Chín bài của plan đều "đạt".
- Simulator chỉ kiểm cú vào lỗ và không báo trượt, chưa đọc kết quả zone trên app.
