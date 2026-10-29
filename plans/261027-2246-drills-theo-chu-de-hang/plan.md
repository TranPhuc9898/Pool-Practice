---
title: Tab Drills theo chủ đề, trong chủ đề chia theo hạng bi-a Việt Nam
description: 12 chủ đề gộp từ 31 skill, mỗi chủ đề nhóm drill theo hạng SABO (K–I … C), giữ cách xem theo lộ trình, vá 10 ô trống
status: pending
priority: P2
effort: 1.5d
branch: feat/pool-editor
tags: [drills, curriculum, ui]
blockedBy: []
blocks: []
created: 2026-10-27
---

# Tab Drills theo chủ đề × hạng

## Hợp đồng

- **Outcome:** tab Drills mở ra danh sách 12 chủ đề (như trang drill của Dr. Dave). Chạm một chủ đề thấy drill nhóm theo hạng `K–I`, `H–H+`, `G–G+`, `F`, `E–D`, `C`. Một nút chuyển sang cách xem theo lộ trình 6 giai đoạn đang có.
- **Constraints:** không đổi schema `PoolDrill`; hạng lấy từ `stageOf` sẵn có; không còn chữ "Level" hay "Stage N" làm nhãn chính; tái dùng `Section`, `DrillCard`.
- **Non-goals:** không khoá hạng, không chấm hạng người chơi, không đổi Home và `/area/[id]`, không thêm thang S/SS (không có nguồn, xem report).
- **Acceptance:** drill-lint báo 0 drill không có chủ đề và 0 ô trống nằm trong danh sách ô bắt buộc; trên iPhone, chủ đề Banks hiện 5 section liền từ `H–H+` tới `C`.

Nguồn hạng: [research-261027-2246-hang-bida-viet-nam.md](../reports/research-261027-2246-hang-bida-viet-nam.md), [brainstorm-261027-1424](../reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md).

## Phases

| # | Phase | Status | File |
|---|---|---|---|
| 1 | Dữ liệu chủ đề + lint | pending | [phase-01-du-lieu-chu-de.md](phase-01-du-lieu-chu-de.md) |
| 2 | Màn chủ đề và chi tiết theo hạng | pending | [phase-02-man-chu-de.md](phase-02-man-chu-de.md) |
| 3 | Bài vá 10 ô trống | pending | [phase-03-bai-va.md](phase-03-bai-va.md) |
| 4 | Kiểm trên iPhone | pending | [phase-04-kiem-may-that.md](phase-04-kiem-may-that.md) |

Phase 2 và 3 độc lập, cùng cần phase 1. Phase 4 cần cả ba.

## Chủ đề × hạng hiện tại (số = id drill)

| Chủ đề | skill gộp | K–I | H–H+ | G–G+ | F | E–D | C |
|---|---|---|---|---|---|---|---|
| Stroke & Aim | straightStroke, spotShot, lineUp | 1 32 33 35 36 | 37 | 12 21 | 14 | | |
| Cut Shots | cutAngle, railCut, combo | 34 | 38–41 | 18 22 42 44–47 | 19 43 | 20 | 104 |
| Banks | bank | | **vá** | 27 | 28 66–69 | **vá** | 105 |
| Kicks | kick | | | **vá** | 64 65 | 89 | **vá** |
| Safety | safety | | | 57 58 | 59–63 | **vá** | 93 94 |
| Break | break | | 70 | | 29 30 | | 71 95 |
| Stop, Follow, Draw | stop, follow, followDistance, draw, drawDistance, drawAngle | 2 99 | 3 4 5 51 | 6 53 | 25 54 56 | 100 101 | |
| Speed & Position | speedControl, tangent, naturalAngle, threePositions, wagonWheel, oneRail, noRail, correctSide | 49 97 98 | 7 13 24 50 | 52 | 8 9 11 55 | 16 102 103 | 106 107 |
| English | english | | | 26 | 48 82–86 | **vá** | |
| Jump & Massé | jump, masse | | | | 72 73 | **vá** | **vá** |
| Patterns & Runouts | pattern, runout | | **vá** | 15 23 | **vá** | 10 17 31 87 88 90 91 | 92 96 108 |
| Tests | test | 74 | | 75 76 | 77–79 | 81 | 80 |

Ô để trống mà không vá là cố ý: Break, Jump & Massé, Kicks ở K–I vô nghĩa với người mới cầm cơ; Stroke & Aim từ E–D trở lên đã nằm trong Cut Shots. Chi tiết lý do từng ô vá ở phase 3.

## Rủi ro

- Memory "không thiết kế lại UI": anh đã duyệt thẳng hướng chủ đề, màn mới chỉ ghép `Section` và `DrillCard`, không vẽ component mới.
- Jump, massé, kick, safety engine không mô phỏng được nên bài vá vẽ tay; chỉ thử bàn thật mới biết đường đi đúng.
