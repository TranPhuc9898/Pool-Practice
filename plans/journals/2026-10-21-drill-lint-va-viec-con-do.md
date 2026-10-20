---
title: "Việc ngày 2026-10-21, drill-lint và việc còn dở"
date: 2026-10-21
summary: "Viết scripts/drill-lint theo chuẩn drill, mốc 245 vi phạm, bước 1 plan chuẩn drill dừng vì 5/7 drill 'đã chuẩn' còn vi phạm"
---

# Việc ngày 2026-10-21, drill-lint và việc còn dở

## What happened
- Chạy `chay-cook` plan `plans/261020-1745-chuan-drill-play-chuoi/`, bước 1.
- Viết `scripts/drill-lint/run.sh` và `lint.js`: biên dịch `DRILLS` sang JS bằng tsc vào thư mục tạm, kiểm mục 2–5 của `docs/chuan-drill.md`, in vi phạm theo drill. Chạy `sh scripts/drill-lint/run.sh [số drill...]`, exit 1 khi còn vi phạm.
- Đối chiếu plan với repo: bảng Bối cảnh đã cũ. Từ commit 37341c2 cả 81 drill có Play qua `DrillShotPlanner`, nhóm không Play thật là 32 drill (thêm 45). `NO_PLAN` chỉ còn dùng chọn đích. Đã ghi vào `## Phát sinh` của plan.

## Kiểm
- Lint lần đầu: 245 vi phạm, 3 drill đạt (12, 23, 25).
- Theo loại: thiếu câu vì sao 74, thiếu lực m/s 72, thiếu nguồn đường bi cái 63, drill nhiều bi chỉ một cú 12, thiếu subtitle vẽ tay 10, chuỗi bỏ sót bi 5, thiếu subtitle mô phỏng 4, cú engine thiếu zone 3, bi cái đặt lại giữa chuỗi 2.
- `npx expo lint` exit 0.

## Decision
- Lint bám đúng chuẩn, không nới luật cho vừa 7 drill "đã chuẩn". Zone chỉ bắt với cú engine (chuẩn ghi zone lấy từ harness). Đường bi cái tính là có khi có `shots`, `replay` hoặc `expectedCuePath`.
- Bước 1 chưa tick: "xong khi" đòi 7 drill "đã chuẩn" ra 0 nhưng 5 drill vi phạm.
  - 15: subtitle thiếu "Checked in simulation, not on a real table."
  - 18, 19, 20: cú engine thiếu zone, subtitle thiếu câu trên.
  - 31: 12/12 round không có câu vì sao, `DrillRound` không có field `why`.

## Còn dở
- Plan `261020-1745-chuan-drill-play-chuoi`: 0/8 bước tick. Chờ anh quyết bước 1. Em đề xuất sửa drill 15, 18–20 (thêm subtitle) và 31 (thêm `why` vào `DrillRound`, viết 12 câu), còn luật zone thì sửa chuẩn thành "chỉ bắt zone khi bài chấm vị trí" vì rail cut BU chỉ đếm bi vào.
- Bước 4 và 7 của plan dựa trên giả định cũ (31 drill không Play, vẽ tay), cần anh duyệt lại trước khi chạy tới.
- Bước 5 phải hỏi anh chuyện giữ lịch sử attempt trước khi đổi `rounds`/`shots`.
- Từ journal 2026-10-20 còn mở: drill 69 round 5 engine không ra cú đạt; bank đánh mạnh hơn lực drill (67 r3, 68 r4–6, 69 r3, r5); nhảy và massé chỉ gần đúng; drill theo round bấm Play xong không sang round kế.
- 4 file ảnh nháp ở gốc repo (`image.png`, `image copy.png`, `image copy 2.png`, `zoom-so-sanh.png`) chưa commit, chờ anh cho xoá.

## Next steps
- Anh chốt cách xử 5 drill trên, em sửa, chạy lại lint, tick bước 1 rồi sang bước 2.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
