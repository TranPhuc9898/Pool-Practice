# Chuẩn drill

Mẫu gốc: drill 31 Twelve-Ball Rail Pattern (`src/pool-engine/drills/31-twelve-ball-rails.ts`). Drill nào lệch chuẩn này là lỗi, sửa drill chứ không sửa chuẩn. Chuẩn chỉ nói người tập thấy gì và dữ liệu phải có gì. UI giữ nguyên màn drill hiện tại, không thêm màn hay component mới.

## 1. Màn drill

Từ trên xuống, đúng thứ tự của drill 31:

1. Bàn nhỏ bên trái, hai ô **Aim** và **Thickness** bên phải. Cả hai ô luôn hiện cho cú đang đánh, không bao giờ để "No pocket chosen" khi drill đã có cú.
2. Dòng khu và số thứ tự (`9-BALL PATTERNS · 11/22`), tên drill, `objective`, `subtitle`.
3. Card cú: mặt bi cái có chấm điểm chạm, tiêu đề `SHOT i/N · SPIN`, dòng tip (`¾ tip low · ½ tip left`), thanh lực 5 bậc kèm m/s, ô PASS.
4. Nút **Play shot**.
5. **Previous shot** và **Next shot** khi drill có từ hai cú trở lên.

## 2. Bi và bàn

- Toạ độ theo `NormalizedPoint` trong `src/pool-engine/types.ts`, lỗ theo `PocketId`. Không drill nào tự đặt hệ toạ độ riêng.
- Bi cái chỉ đặt ở cú 1. Từ cú 2 trở đi bi cái đứng đúng chỗ nó dừng sau cú trước. Ngoại lệ duy nhất là bài ghi rõ ball in hand trong `objective`.
- Bi đã vào lỗ biến khỏi bàn. Bi chưa tới lượt đứng yên, không mờ, không đổi chỗ.

## 3. Một cú phải có đủ

| Thứ | Lấy từ | Hiện ở đâu |
|---|---|---|
| Bi mục tiêu, lỗ | dữ liệu drill | ghost ball và đường bi mục tiêu trên bàn, ô Aim |
| Điểm chạm cơ x, y (x khác 0 là phê ngang) | harness hoặc video | mặt bi trên card, dòng tip |
| Lực m/s | harness hoặc video | thanh lực, số m/s |
| Đường bi cái sau va chạm | engine, video hoặc vẽ tay (mục 5) | đường đứt trên bàn |
| Zone bi cái phải dừng (trừ cú cuối), khi bài chấm vị trí | harness | vòng zone trên bàn |
| Một câu vì sao chọn cú này | người soạn | dòng dưới card |

Bài chấm vị trí là bài có `cueBallTargetZones`. Bài chỉ đếm bi vào, như Rail Cut BU (18–20), để `cueBallTargetZones` rỗng và cú không có zone.

## 4. Play

- Mọi drill có Play. Không còn danh sách drill bị giấu Play.
- Một lần bấm là một cú. Vào sạch thì card sang cú kế, bàn đứng nguyên chỗ bi vừa dừng, không chớp, không reset.
- Trượt, bi cái rơi lỗ hay chạm bi khác thì báo đúng lý do một dòng và ở lại cú đó.
- Drill có từ hai bi mục tiêu trở lên chạy chuỗi: 1 xong đánh 2, 2 xong đánh 3, tới bi cuối.
- Drill một bi nhiều round (thang khoảng cách, thang góc cắt) coi mỗi round là một cú, cùng luật trên.
- Previous/Next dựng lại bàn đúng thế trước cú đó, như lúc chạy thật.

## 5. Đường đi lấy từ đâu

Theo thứ tự ưu tiên, dùng nguồn đầu tiên đạt:

1. **Engine** (`ShotPhysics`): khi harness 45 mẫu lệch tay cho cú vào lỗ và bi cái dừng trong zone. Dữ liệu là `shots`.
2. **Video**: đường bi cái ghi từ video bằng `scripts/video-harness/`, như drill 31. Dữ liệu là `rounds[].replay`.
3. **Vẽ tay**: cho thứ engine không mô phỏng được. Gồm nhảy, massé, break, và bank khi băng chưa hiệu chỉnh. Subtitle ghi `Path drawn, not simulated.`

Drill dùng engine hay vẽ tay mà chưa đo bàn thật thì subtitle ghi `Checked in simulation, not on a real table.`

## 6. Số liệu và nguồn

- Tip, lực, zone, `rate` chép từ harness hoặc video, app không tính lại. Comment đầu file ghi harness nào, commit ShotPhysics nào.
- Đề xuất chưa có số thật thì comment ghi `Đề xuất, chưa có số thật`, như `passCondition` của drill 31.

## 7. Kiểm

Có ba lớp kiểm, chạy theo thứ tự:

1. `scripts/drill-lint` duyệt `DRILLS` và báo drill thiếu mục nào ở trên.
2. Harness: mỗi cú engine phải có rate.
3. Simulator: Play tới cú cuối, card về `N/N`, bàn chỉ còn bi cái hoặc đúng thế bài yêu cầu.
