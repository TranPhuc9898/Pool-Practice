# Vật lý bi thật cho màn Điểm chết: kiểm toán sim.js theo nguồn — 2026-10-08

## Câu hỏi
Research và thiết kế mô hình vật lý để bi trên màn Điểm chết / Soạn bài chạy như bi thật (brief "DEEP RESEARCH — REALISTIC POOL PHYSICS ENGINE"), làm theo đường nào?

## Bối cảnh
`ShotPhysics.swift` trong app vi phạm brief ở ba chỗ đã đọc: băng phản xạ gương với ω hai trục (mất phê qua băng), bi 1 không mô phỏng mà tính quãng bằng công thức đóng (không có bò băng), lỗ là `pocketCatch: 2.4` (check khoảng cách). `sim.js` trong scratchpad đã có ω ba trục, băng Han, ma sát bi–bi, lỗ WPA có má, tất định; nhưng `muRail 0.3` chỉnh tay, `spinDecay 10` chưa rõ đơn vị, không hằng số nào có nguồn.
Ràng buộc: không redesign màn, engine độc lập UI, không bịa hệ số, drdavepoolinfo bị chặn DNS và PDF colostate trả 403.
Ngoài phạm vi: Swift và màn app (chờ anh duyệt tài liệu), massé, jump, cơ học cơ đầy đủ, profile bàn ngoài một baseline.

## Các hướng đã cân
- (a) Research sạch rồi viết engine mới: loại, viết lại thứ đã chạy và tài liệu tách khỏi code.
- (b) Kiểm toán sim.js theo nguồn: chọn.
- (c) pooltool làm thước đo: giữ làm phần kiểm chứng, nó là mô hình chứ không phải số đo thật.
- (d) Đo bàn thật trước: loại cho V1, em không có bàn; thành quy trình calibration.

## Chọn
(b) với (c) ở phần kiểm chứng. Tài liệu đi theo từng phương trình đang chạy trong sim.js; chỗ nguồn nói khác thì sửa engine, chỗ không có nguồn thì gắn nhãn calibration. Đánh đổi: khung mô hình theo sim.js (băng Han, má lỗ là điểm va chạm) thay vì xét lại từ số không, đổi lấy việc xong trong một phiên.

## Sẽ đổi ý nếu
Nguồn peer-reviewed cho số đo góc bật thật lệch quá 5° so với sim.js ở các cú benchmark 06–08 (một băng không phê / phê thuận / phê nghịch): khi đó dựng lại phần băng theo mô hình của nguồn đó.

## Bước đi
1. Ba luồng research song song: vải + đánh cơ + tích phân; băng + bi–bi; lỗ + dữ liệu kiểm chứng. Mỗi số có URL đã đọc.
2. Đối chiếu từng hằng số và phương trình của sim.js với nguồn, sửa chỗ lệch, gắn nhãn chỗ chưa có nguồn.
3. Chạy 16 cú benchmark của brief trên sim.js bằng node, ghi số đo. Điểm kiểm tra: cú 07 phải mở góc, cú 08 phải khép góc so với cú 06, cú 12 phải lắc ra ở tốc độ mà cú 11 vào.
4. Viết `docs/research/2026-10-08-vat-ly-bi.md` đủ mục A–J và câu trả lời 20/80.
5. Anh duyệt tài liệu rồi mới lên plan port Swift.
