# Lấy gì từ tài liệu 10 drill G→C: chỉ thang góc cắt và mục F — 2026-10-17

## Câu hỏi
Nên dùng tài liệu `pool_practice_drills_01_10.md` (10 drill G→C, toạ độ diamond 4×8) thế nào cho Pool Practice.

## Bối cảnh
Repo có 21 drill nhưng chưa có bài nào luyện góc cắt theo thang. Bốn bài trong tài liệu trùng với repo: bài 01 trùng drill 01, bài 02 là drill 01 có thêm `distances`, bài 06 trùng 18–20 (bản BU), bài 09 trùng 21.

Toạ độ trong tài liệu đổi sang repo bằng x/4 và y/8. Riêng góc cắt thì tài liệu đo theo đường bi cái tới bi mục tiêu, không đo theo ghost ball. Vì vậy góc ghi trên nhãn lệch so với góc thật:

| Bài | Góc ghi | Góc thật |
|---|---|---|
| 03 | 15/30/45° | 16,5/32,8/48,9° |
| 04 (half-ball) | ~30° | ~33° |
| 05 | 48/55/60° | 51/58/64° |

Kết quả tính bằng script. Chưa đo trên bàn thật.

Ràng buộc:
- Không thiết kế lại UI.
- Bảng `attempts(id, drill_id, result, at, session_id)` không có cột round. Màn drill suy ra round từ thứ tự cú trong lượt (`src/app/drill/[id].tsx:186`).
- `DrillRound` chỉ có `{title, zone, spin}`.

Ngoài phạm vi:
- Mục 2 của tài liệu: thêm tab, bảng hỏi sau cú.
- Giáo trình 50 bài.
- Các mức kiểm nghiệm L1–L5.

## Các hướng đã cân
- **A. Nhập cả 10 bài.** Loại vì:
  - 4 bài trùng;
  - bài 04/08 đổi bi và lỗ theo từng trạm, `DrillRound` không chở được;
  - bài 07/10 có vùng T chưa kiểm;
  - bài 10 phải ngắm lệch trong miệng lỗ, trong khi `GuideLine` luôn vẽ tới tâm lỗ.
- **C. Chỉ lấy mục F điền `mistakes`.** Sống nhưng không lấp chỗ thiếu góc cắt, nên được gộp vào hướng chọn.
- **D. Mô phỏng mọi thế bi bằng DrillTargetSolver trước.** Loại vì bài chỉ chấm vào bi thì kiểm hình học là đủ. Một lưới solver chạy mất 25 phút.
- **E. Lấy giáo trình G→C làm xương sống.** Loại vì:
  - mới có 10/50 bài;
  - xếp lại drill thì phải đổi id và di cư attempt log;
  - hạng G→C chưa được kiểm.

## Chọn
**Hướng B rút gọn, cộng phần rẻ của C.**

**1. Thêm drill 22 "Cut Angle Ladder".**
- Bi 1 đặt cố định ở diamond (2; 2,5), tức `{x: 0.5, y: 0.3125}`, đánh lỗ footLeft.
- Có 5 mức góc thật tính theo ghost ball: 0/15/30/45/60°, mỗi mức 3 cú, tổng 15 cú.
- Mỗi mức chỉ dời bi cái. Vị trí bi cái tính theo ghost ball, cách 2 diamond:

  | Góc thật | Bi cái (diamond) |
  |---|---|
  | 0° | (3,36; 4,20) |
  | 15° | (2,92; 4,47) |
  | 30° | (2,41; 4,62) |
  | 45° | (1,89; 4,63) |
  | 60° | (1,38; 4,50) |

  Cả năm vị trí đều trong bàn và cùng một phía.
- `DrillRound` có thêm trường tuỳ chọn `cueBall?`. Thay đổi này chỉ cộng thêm, drill cũ không đổi.

**2. Điền `mistakes`** cho drill 01, 18–20 và 21, lấy từ mục F của bài 01/06/09. Drill 22 lấy mục F của bài 03/05.

**Đánh đổi:** chấp nhận chưa có ma trận nhiều lỗ (bài 04/08) và chưa có lộ trình G→C, để không phải đụng schema hay UI.

**Lưu ý cho drill 22:** round được suy ra từ thứ tự cú. Vì vậy sau khi đã có attempt thì không được đổi số mức hay số cú mỗi mức của drill 22. Làm vậy sẽ đọc sai các lượt cũ. Muốn đổi thì tạo drill id mới.

## Sẽ đổi ý nếu
- Tỉ lệ vào ở mức 30° của drill 22 vượt 80% qua 5 lượt liên tiếp. Thang quá dễ, khi đó làm bài 08 bằng cách thêm `objectBalls?` và `targetPocket?` cho từng `DrillRound`.
- Anh cần lộ trình có hạng. Khi đó bàn lại hướng E, kèm kế hoạch di cư attempt log.

## Bước đi
1. Thêm `cueBall?` vào `DrillRound`. Cho màn drill và `aim.ts` đọc `round?.cueBall ?? drill.cueBall`. Kiểm bằng drill 08: đổi round thì bi cái vẫn đứng nguyên chỗ cũ.
2. Viết `22-cut-angle-ladder.ts` với 5 round. Vị trí bi cái lấy từ script ghost ball, không lấy từ tài liệu.
3. **Điểm kiểm tra:** trên simulator, bấm qua 15 cú. Bi cái phải nhảy đúng chỗ sau cú 3/6/9/12, và guide ghost ball phải vẽ lại theo chỗ mới. Không nhảy thì giả định "round suy ra từ thứ tự cú là đủ" đã sai.
4. Điền `mistakes` cho drill 01, 18–21 và 22.
5. Kiểm Undo có dòng void xen giữa: round hiện ra vẫn phải đúng với số cú còn hiệu lực.
