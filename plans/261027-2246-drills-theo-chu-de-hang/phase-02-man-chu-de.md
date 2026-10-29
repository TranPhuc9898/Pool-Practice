# Phase 2: Màn chủ đề và chi tiết theo hạng (cần phase 1)

## Việc

- `src/app/(tabs)/drills/index.tsx`: đầu màn có nút chuyển hai chế độ `Topics` / `Path`. `Topics` (mặc định) liệt kê 12 chủ đề, mỗi dòng ghi tên, số drill và dải hạng có bài (vd `H–H+ → C`). `Path` giữ nguyên render giai đoạn hiện tại nhưng tiêu đề section đổi từ `Stage N · title` sang `K–I · Foundations`.
- `src/app/(tabs)/drills/topic/[id].tsx`: mỗi hạng có bài là một `Section` tiêu đề `rankLabel` + `benchmark`, list `DrillCard`. Hạng trống không hiện section.
- Đăng ký route trong `src/app/(tabs)/drills/_layout.tsx` nếu Stack cần khai báo.
- Chế độ đang chọn nhớ trong state màn, không lưu đĩa.

## Xong khi

- Simulator: tab Drills mở ra danh sách 12 chủ đề; chạm `Safety` thấy section `G–G+`, `F`, `C` theo thứ tự hạng; chuyển `Path` thấy `K–I · Foundations` đầu tiên với 12 card.
- `grep -rn "Stage \${" "src/app/(tabs)/drills"` ra 0 dòng.
- `npx tsc --noEmit` và `npx expo lint` sạch.

## Không làm

- Không vẽ component mới ngoài nút chuyển chế độ; dòng chủ đề dùng lại kiểu dòng của `Section` hoặc `DrillCard` sẵn có.
