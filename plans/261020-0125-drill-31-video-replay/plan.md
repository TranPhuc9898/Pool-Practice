---
title: "Drill 31: Play diễn lại đường bi cái ghi từ video"
description: "Play chạy đúng đường bi cái của video eJldkCO6TeA, bi mục tiêu đi thẳng vào lỗ guide, engine chỉ khi bàn bị dời khỏi thế video"
status: completed
priority: P2
effort: 4h
branch: feat/pool-editor
tags: [drill, native, play, video]
blockedBy: []
blocks: []
created: 2026-10-20
---

# Drill 31: Play diễn lại đường bi cái ghi từ video

Nối tiếp `plans/261020-0007-drill-31-play-chain/` (phase 1–3 xong). Phase 4 của plan đó gộp vào phase 4 ở đây.

## Outcome
1. Bấm Play ở bi n: bi cái chạy đúng đường ghi từ video (track.csv, cú n, t_start..t_end), nhịp thật 1×, dừng đúng chỗ video.
2. Bi mục tiêu đứng yên tới lúc bi cái chạm, rồi đi thẳng từ chỗ nó vào lỗ guide của round và rơi.
3. Hết cú: sang round kế, bi cái đứng đúng `cueBall` video của round kế (không lệch 0.5–0.8 in), cú sau nối từ đó.
4. Previous/Next dựng bàn từ `cueBall` video, không còn `playCue` của engine.
5. Bàn lệch khỏi thế video (bi cái hoặc bi mục tiêu lệch quá 0.5 in) thì Play quay về engine như hiện tại, kèm note trượt cũ. Màn drill đang tắt kéo bi (`allowsHitTesting(!stageOnly)`), nên nhánh này chỉ là chốt chặn, không có đường UI nào vào.
6. Card vẫn hiện lực video (`speed`), Pass/Miss/Undo/Start Drill giữ nguyên.

## Constraints
- Không UI mới. Không đổi drill khác, không đổi Rail Cut (`shots`).
- Dữ liệu track hiện chỉ nằm trong scratchpad: phase 1 chép vào repo trước khi làm gì khác.
- Không commit trừ khi anh bảo.

## Non-goals
- Không ghi đường bi mục tiêu từ video (video không track bi mục tiêu), không dội băng cho bi mục tiêu.
- Không track lại video, không sửa engine hay `playSpeed`.
- Không replay video cho drill nào ngoài 31.

## Phases
| # | Phase | File | Xong khi |
|---|---|---|---|
| 1 | [Dữ liệu replay từ track.csv](phase-01-replay-data.md) | `scripts/video-harness/`, drill 31, `types.ts` | 12 round có `replay`, điểm đầu = `cueBall` round, điểm cuối = `cueBall` round kế, tsc 0 |
| 2 | [Cầu JS → native](phase-02-bridge.md) | `DrillRecord.swift`, `PoolTableView.tsx`, `[id].tsx` | native đọc được `replay` của round đang đứng |
| 3 | [ShotReplay từ đường ghi](phase-03-native-replay.md) | `PoolShotReplay.swift`, `PoolEditorView.swift` | build dev client xanh, Play bi 1 chạy theo video |
| 4 | [Dọn JS và kiểm simulator](phase-04-verify.md) | `[id].tsx`, `types.ts`, drill 31 | tsc 0, lint 0, 12 Play đi hết, ảnh so với video 3 cú |

## Rủi ro chính
- Bi 7: lỗ suy từ góc cắt nhỏ nhất, đoán yếu nhất. Bi mục tiêu đi thẳng vào lỗ sai thì nhìn là thấy, phase 4 so khung video cú 7.
- Track video rung: phase 1 làm mượt, giữ chỗ dừng và điểm chạm. Rung còn thấy thì tăng cửa sổ, không đổi kiến trúc.
- Thời điểm chạm suy từ điểm track gần ghost ball nhất, lệch một mẫu (0.06 s) là chấp nhận được.

## Kết quả (2026-10-20)
- Xong cả 4 phase. tsc 0, lint 0, build dev client xanh.
- Khác plan: phase 1 bỏ làm mượt (làm mượt cắt góc chạm, góc băng, kéo điểm chạm xa bi mục tiêu 3.5–4.5 in). Mẫu chạm là mẫu gần bi mục tiêu nhất, đặt đúng vào ghost ball.
- Track hỏng hai đoạn, vá tay trong `replay.py`: cú 10 mất bi lúc dội băng (123.00–123.42 s), cú 11 tracker kẹt (134.40–135.36 s).
