---
title: "Drill 31: Play nối cú theo chỗ bi cái dừng"
description: "Bi cái round kế đứng đúng chỗ engine dừng, báo trượt, Previous/Next cho round, ghi lượt không kéo round về"
status: completed
priority: P2
effort: 3h
branch: feat/pool-editor
tags: [drill, native, play]
blockedBy: []
blocks: []
created: 2026-10-20
---

# Drill 31: Play nối cú theo chỗ bi cái dừng

Trạng thái 2026-10-20: phase 1–3 xong, phase 4 chưa kiểm.

Đã có: Play đánh một cú, vào sạch thì sang round kế (`onReplayEnd` → `ended`, `roundAt`, lỗ theo guide round).

## Outcome
1. Vào sạch: round kế dựng bàn với bi cái ở đúng chỗ engine dừng, guide vẽ theo chỗ đó.
2. Trượt hay bi cái rơi: haptic warning và một dòng chữ ở chỗ `targetNote`, bàn đứng ở bi đó, Play là đánh lại từ vị trí video của round.
3. Previous shot / Next shot (nút sẵn của Rail Cut) hiện cho drill pattern, đi giữa 12 round, dựng bàn từ `playCue` (chỗ bi cái trong chuỗi engine), không phải vị trí video.
4. Pass/Miss ghi lượt cho bi đang xem rồi sang bi kế; Undo lùi một bi; Start Drill về bi 1.

## Non-goals
- Không UI mới, không đổi `shots`/Rail Cut, không đổi drill round khác (04, 06, 22, 26…).
- Không mang theo bi khác bị bi cái đụng lệch trong engine, chỉ bi cái.

## Phases
| # | Phase | File | Xong khi |
|---|---|---|---|
| 1 | [Đo chuỗi trên harness](phase-01-chain-harness.md) | scratchpad h107 | in bảng 12 cú chạy nối, biết cú nào vỡ, `playSpeed` mới nếu cần |
| 2 | [Native báo chỗ dừng và trượt](phase-02-native-ended.md) | PoolShotReplay, PoolEditorView | `ended` có `cueX/cueY`, haptic trượt, build dev client xanh |
| 3 | [JS round, nút, ghi lượt](phase-03-js-rounds.md) | `src/app/drill/[id].tsx`, drill 31 | tsc 0, lint 0 |
| 4 | Kiểm trên simulator (dở: máy khoá màn, cliclick không chạm được) | — | Play 12 lần đi hết, ảnh chụp bi cái nối đúng; Previous/Next; Pass ở bi 5 sang bi 6 |

## Rủi ro chính
`playSpeed` hiện fit từ vị trí video từng cú. Chạy nối, sai số dồn lại: hồi dùng `shots` chỉ 4/12. Phase 1 đo trước; vỡ thì fit lại tuần tự từ chỗ dừng engine, không fit được thì báo anh trước khi code.
