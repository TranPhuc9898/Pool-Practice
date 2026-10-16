# Stop Shot gold standard trên schema hiện tại, rồi lô drill đầu — 2026-10-15

## Câu hỏi
Prompt "Ultimate Master" (Drill System trước, 120 drill, Stop Shot gold standard) nên chạy thế nào trên repo hiện tại?

## Bối cảnh
- Repo có 17 drill (`src/pool-engine/drills/index.ts`). Stop Shot (`02-stop.ts`) đúng hình học: bi thẳng lỗ footLeft, tâm zone cách bi mục tiêu đúng một đường kính bi.
- Vòng Practice đứt ở REVIEW: `progress.ts` không có undo, `resetDrill` xoá cả lượt. `attempt-log.ts` chỉ ghi, không đọc, nên không có History hay so lần trước. Kết quả chỉ có pass/fail. Không có test runner.
- Research 11/10 (`docs/research/2026-10-11-drill-dat-bi-tong-hop.md`) kết luận nút thắt là schema (`shots[]`, `cueBallPlacement`, `progression`), không phải số drill. Mục 2.1 có 5 drill nhập được ngay với schema hiện tại.
- Quyết định 14/10 (`2026-10-14-huong-san-pham.md`) chọn Shot Lab trước. Bước 3 của nó chạy drill cá nhân bằng màn `drill/[id]`, bước 4 cần đọc attempt log ra trend. Cả hai phụ thuộc vào việc này.
- Ràng buộc: một người làm, không thiết kế lại UI, không tự cài test runner khi anh chưa gật.
- Ngoài phạm vi: schema v2, Academy, tầng visualization mới, IA 4 tab, drill bank/kick cần `shots[]`.

## Các hướng đã cân
- (a) Chạy prompt nguyên văn trong một phiên: loại, đủ 120 drill thì phải bịa toạ độ, đúng thứ prompt cấm.
- (c) Schema v2 trước: loại lúc này, cửa một chiều với `progress` v1 và renderer native, chưa có drill nào chạy hết vòng để biết v2 cần gì.
- (d) Giữ Shot Lab, prompt để backlog: loại, anh đã đổi ưu tiên sang Drill.
- (b) Stop Shot gold standard trên schema hiện tại: chọn.

## Chọn
(b), cộng lô drill nhập được ngay ở mục 2.1 của research 11/10 (chỉ những drill có toạ độ từ nguồn, không bịa).
- Undo cú vừa ghi: attempt log ghi thêm dòng `void` thay vì xoá, giữ được sync append-only.
- History các lượt đọc từ attempt log, màn kết quả có tỉ lệ, đạt/chưa, chênh điểm phần trăm so với lượt trước.
- Drill Detail thêm "Common mistakes" bằng trường tuỳ chọn, không đổi nghĩa trường cũ.

Đánh đổi: catalog chỉ tăng vài drill, bank/kick vẫn trống, editor lưu shot (Shot Lab bước 2) lùi lại.

## Sẽ đổi ý nếu
- Gold standard buộc phải đổi nghĩa một trường hiện có của `PoolDrill` hoặc `DrillProgress`: dừng, làm schema v2 bản nhỏ nhất trước.
- Một drill ở mục 2.1 không ra được toạ độ từ file nguồn: bỏ drill đó khỏi lô, không suy ra toạ độ.

## Bước đi
1. Undo + đọc attempt log (rủi ro dữ liệu lớn nhất, làm trước). Điểm kiểm tra: kill app mở lại, `best` cũ còn, cú bị undo không tính vào History.
2. History và so lượt trước trên màn drill.
3. Trường `mistakes` tuỳ chọn, điền cho Stop Shot.
4. Nhập lô drill mục 2.1 có toạ độ nguồn.
5. Lint + typecheck.
