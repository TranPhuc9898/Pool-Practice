---
title: "Cẳng tay xanh/đỏ theo dây dọi"
description: "Đường khuỷu → cổ tay xanh khi cẳng tay lệch dây dọi ≤ 10°, đỏ khi quá. Chỉ cần khuỷu và cổ tay, vẫn tô màu khi máy ngả tới 30°."
status: pending
priority: P1
effort: "1h"
branch: feat/pool-editor
tags: [feature, ios]
blockedBy: []
blocks: []
created: 2026-10-22
---

# Cẳng tay xanh/đỏ theo dây dọi

## Overview

Video quay màn hình 01:45 ngày 2026-10-22: app vẽ đường trắng nằm đúng trên cẳng tay đang thả thẳng nhưng không đổi màu. Màu chỉ được tính khi máy ngả ≤ 12° (`PoseCoach.swift:202`) và thấy vai ≥ 0.4 (`PoseStroke.swift:110`). Trong video máy ngả 23°, vai cao nhất 0.37. Anh duyệt cách A trong brainstorm: màu chỉ cần khuỷu và cổ tay, vẫn tô khi máy ngả tới 30°, dây dọi giữ theo trọng lực như hiện giờ.

Cũng trong video đó, Vision thấy người 8/23 giây, khuỷu và cổ tay cùng ≥ 0.4 chỉ 1/23 giây, vì máy đặt sát và ngửa lên trần. Code không chữa được phần này. Task 3 kiểm bằng cách đặt máy xa 1,5–2 m.

## Xong là

Trên iPhone, camera trước, máy đặt trước mặt anh trên đường cơ, cách ≥ 1,5 m, ngả ≤ 30°, anh vào thế. Video quay màn hình cho thấy đường cẳng tay xanh khi thả thẳng, đỏ khi nghiêng hẳn sang trái hoặc phải. Log `[pose] arm` có khuỷu và cổ tay ≥ 0.4 ở ≥ 25/30 giây.

## Không làm

- Đổi ngưỡng ngả 12° của phần bắt cú, address và Scoreboard. Chỉ phần tô màu có ngưỡng riêng 30°.
- Đổi dung sai ±10°.
- Chế độ đặt máy sát người.
- Bắt cú từ góc trước mặt.
- Giữ đường khi Vision chớp mất, làm mượt đường.
- ~~Đổi chữ status hay thêm câu hướng dẫn đặt máy. Lúc máy ngả 13–30°, status vẫn báo "Phone tilted" trong khi đường đã có màu. Chấp nhận.~~ Anh gỡ lúc 02:2x, xem Validation Log. Phase 2 chỉ đổi lúc nào hiện "Phone tilted", không đổi chữ.
- ~~Chỉnh dây dọi theo từng điểm trên ảnh (cách B). Chỉ làm khi task 3 cho thấy màu sai lúc tay lệch khỏi giữa khung.~~ Anh gỡ lúc 02:2x, làm ở phase 2.

## Phases

| # | Phase | Status | Effort |
|---|-------|--------|--------|
| 1 | [Xanh/đỏ trên máy](./phase-01-xanh-do-tren-may.md) | Pending | 1h |
| 2 | [Tự bù độ ngả](./phase-02-tu-bu-do-nga.md) | Pending | 1h |

## Liên quan

- Plan `plans/261021-0336-stance-soi-tay-sau-chay-that/`: mục Không làm của phase 4 có "Đổi ngưỡng ngả 12°". Plan này không đổi số 12°, chỉ thêm ngưỡng riêng cho màu. Overview và phase 3 của plan đó ghi "tay vàng/trắng", sau plan này đọc là xanh/đỏ, còn trắng khi không chấm.
- Report `plans/reports/research-261022-0137-quay-tu-sau-duong-co.md`: đặt máy trên đường cơ thì đo được cẳng tay nghiêng ngang chỉ bằng khuỷu và cổ tay.

## Validation Log

2026-10-22 02:00, anh trả lời "lên plan đi" sau câu "Anh duyệt A thì em lên plan và cook luôn".

2026-10-22 02:2x, anh gửi video 02:14 (máy ngả 26°, status báo "Phone tilted 26°. Stand it upright." suốt clip) kèm câu "ý là ko cần dựng máy phải dọc quá đâu hiểu ko nó phải tự biết chứ ta ???". Em đọc là gỡ hai mục Không làm: cách B và status lúc ngả 13–30°. Ngưỡng 12° của phần bắt cú vẫn giữ.

<!-- slug: cang-tay-xanh-do -->
