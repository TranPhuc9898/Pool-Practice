---
title: "Phân tích clip tay sau quay từ sau lưng"
description: "Đưa master prompt AI Billiards Coach vào app hiện có: import clip quay sau lưng, chạy PoseFrame trên từng khung, vẽ khớp, trục cơ chấm tay và quỹ đạo cổ tay, rồi mới tới tự bắt pha, dò cơ, lịch sử và soi trực tiếp."
status: in-progress
priority: P1
effort: "~9d"
branch: feat/pool-editor
tags: [feature, ios, vision, experimental]
blockedBy: []
blocks: []
created: 2026-10-22
---

# Phân tích clip tay sau quay từ sau lưng

## Overview

Nguồn là master prompt "AI Billiards Coach for iOS" anh dán ngày 2026-10-22. Brainstorm cùng ngày chốt hướng A: không làm app Swift mới mà gắn vào module `modules/pool-table/ios/Pose/`, dùng lại `PoseFrame` và cách đọc clip của `scripts/pose-harness`. Anh chưa trả lời hai câu hỏi mở của brainstorm, plan này coi như A đã chốt.

Hai dữ kiện đã kiểm quyết định cấu trúc plan:

- `StrokeTracker` (`modules/pool-table/ios/Pose/PoseStroke.swift:67`) viết cho góc bên hông. Nó đo cổ tay theo hướng vuông góc với dây dọi, mà từ sau lưng hướng đó gần trùng trục ống kính. Quay từ sau lưng thì tracker này gần như không thấy backswing. Pha cú cho góc sau lưng phải viết mới (phase 5) và chỉ viết sau khi clip thật cho thấy có tín hiệu để bắt (phase 1).
- Harness đã đọc clip bằng `AVAssetReader`, lấy hướng từ `preferredTransform`, chạy Vision từng khung (`scripts/pose-harness/main.swift:92`). Lõi phân tích clip trong app tách từ đoạn này ra, harness và app dùng chung một file.

Phase của prompt khớp với phase plan như sau. Prompt Phase 1 là phase 2–4, Phase 2 là phase 5–7, Phase 3 là phase 8, Phase 4 là phase 9.

## Outcome

1. Trong Stance Check có lối vào "Analyze a clip". Chọn video trong Photos thì thấy độ phân giải, fps, độ dài.
2. Chọn tay cầm cơ, dừng ở một khung, chấm 2 điểm dọc cây cơ làm trục tham chiếu. Chấm lại ở khung khác được.
3. App chạy Vision hết clip, có tiến độ, huỷ được, UI không đứng.
4. Phát lại hoặc lùi tới từng khung: thấy vai, khuỷu, cổ tay của tay cơ, trục tham chiếu, các trục đã chấm, vệt cổ tay. Số đọc từng khung gồm độ lệch ngang của cổ tay và khuỷu so với trục (px và bội số cẳng tay L), góc cẳng tay so với dây dọi, độ lệch góc giữa các trục đã chấm.
5. Sau khi phase 4 qua nghiệm thu trên máy thì mới tới tự bắt pha, dò cơ, độ tin cậy, lịch sử phiên, nhận xét theo baseline của chính người chơi, đánh giá trên clip có nhãn, và soi trực tiếp bằng camera.

## Constraints

- Swift trong module Expo hiện có, không tạo project Xcode mới. Không sửa `ios/` sinh ra bởi CNG.
- Chỉ thêm một màn và một nút vào UI hiện có (memory "không thiết kế lại UI"). Màn mới dùng `@/design-system`.
- Package mới chỉ qua `npx expo install`. Dự kiến duy nhất `expo-image-picker`, đọc docs v57 trước khi dùng.
- Không bịa khớp. Khớp dưới `minConfidence` để trống, không nội suy.
- Đơn vị là px hoặc bội số L. Không ghi mm hay cm. Mọi số trên màn ghi rõ là đo trên ảnh 2D.
- Không ngưỡng kỹ thuật chung cho mọi người. Nhận xét chỉ so với baseline của chính người chơi.
- 9-ball và 8-ball Trung Quốc không khác nhau ở cơ sinh học tay sau. Phiên chỉ ghi nhãn môn, không phân tích riêng.
- Lưu trữ dùng `expo-sqlite` như `src/pool-engine/attempt-log.ts`, không thêm SwiftData. Một app không cần hai kho.
- Test là chế độ `--unit` của harness, chạy trên Mac bằng `swiftc`, theo lối `--synthetic` và `--selftest` đang có.
- Không commit trừ khi anh bảo.

## Không làm

- Góc bên hông. `StrokeTracker` và Stance Check giữ nguyên, trừ phần tách file đọc clip ở phase 2.
- Android, web.
- Đẩy dữ liệu phân tích lên server Railway.
- Đổi ngưỡng `PoseLimits` của Stance Check.
- Core ML huấn luyện thật. Phase 8 chỉ điều tra, có kết luận thì mở plan riêng.

## Phases

| # | Phase | Ứng với prompt | Effort | Cần | Trạng thái |
|---|-------|----------------|--------|-----|------------|
| 1 | [Clip sau lưng qua harness](./phase-01-clip-sau-lung-qua-harness.md) | Bước 0 | 3h | anh quay clip | in-progress (chờ clip) |
| 2 | [Lõi đọc clip dùng chung](./phase-02-loi-doc-clip-dung-chung.md) | P1 mục 4, 5, 8, 10 | 5h | 1 | in-progress (code xong, chờ máy) |
| 3 | [Màn Analyze a clip](./phase-03-man-analyze-a-clip.md) | P1 mục 1–3, 6–9 | 1.5d | 2 | in-progress (code xong, chờ máy) |
| 4 | [Nghiệm thu MVP trên iPhone](./phase-04-nghiem-thu-mvp-tren-iphone.md) | P1 cổng | 2h | 3, anh cầm máy | pending |
| 5 | [Pha cú góc sau lưng](./phase-05-pha-cu-goc-sau-lung.md) | P2 mục 2, 3, 5 | 1.5d | 4 | in-progress (code xong, chờ máy) |
| 6 | [Dò cây cơ quanh trục chấm tay](./phase-06-do-cay-co.md) | P2 mục 1, 4 | 1.5d | 4 | in-progress (code xong, chờ máy) |
| 7 | [Lịch sử phiên và nhận xét](./phase-07-lich-su-va-nhan-xet.md) | P2 mục 6, 7 | 1.5d | 5, 6 | in-progress (code xong, chờ máy) |
| 8 | [Đo trên clip có nhãn, điều tra Core ML](./phase-08-do-tren-clip-co-nhan.md) | P3 | 1d | 6 | in-progress (code xong, chờ máy) |
| 9 | [Soi trực tiếp từ sau lưng](./phase-09-soi-truc-tiep.md) | P4 | 1d | 7, 8 | pending |

Phase 5 và 6 chạy song song được: phase 5 sở hữu `PoseRear.swift`, `PoseFilter.swift`, phase 6 sở hữu `PoseCue.swift`. Cả hai cùng thêm case vào `--unit` của harness, nên gộp lúc cuối.

## Xong là

- Phase 4 qua đủ năm mục nghiệm thu trên iPhone thật. Đây là cổng của prompt: chưa qua thì không sang phase 5.
- `sh scripts/pose-harness/run.sh --unit` in `unit ok` sau mỗi phase có code Swift.
- `npx expo lint` và `npx tsc --noEmit` sạch sau mỗi phase có code TS.
- Phase 8 có bảng sai số trên clip có nhãn cho từng số app hiển thị. Số nào sai quá ngưỡng ghi trong phase 8 thì màn kết quả gắn nhãn "experimental".

## Vỡ ở đâu

- Từ sau lưng Vision mất khuỷu hoặc cổ tay vì thân người che → kiểm bằng: phase 1, tỉ lệ khung thấy cả khuỷu và cổ tay dưới 70% thì dừng, báo anh trước khi làm UI.
- Cổ tay đi trước sau gần dọc trục ống kính nên không có tín hiệu để bắt pha → kiểm bằng: phase 1 đo biên độ y cổ tay và L lúc backswing so với rung lúc address. Tỉ số dưới 3 thì phase 5 chỉ còn đánh dấu tay, không tự bắt.
- Thị sai do máy lệch khỏi đường cơ làm trục chấm tay sai lệch có hệ thống → kiểm bằng: phase 1 quay thêm một clip máy lệch 15–20° có chủ ý, so độ lệch ngang với clip máy đúng đường cơ.
- `expo-image-picker` chép video vào cache, nén hoặc đổi fps → kiểm bằng: phase 3 so fps và độ phân giải đọc trong app với `ffprobe` của file gốc.

## Câu hỏi còn mở

1. Anh có muốn XCTest target thật cho module (podspec `test_spec`) không? Plan đang dùng `--unit` của harness vì repo chưa có test Swift nào.
2. Màn lịch sử ở phase 7 đặt trong Stance Check hay thành mục riêng ở tab Today? Plan đang đặt trong `src/app/clip.tsx` để khỏi đụng tab.
