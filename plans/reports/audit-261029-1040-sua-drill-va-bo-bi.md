# Audit sau khi sửa drill và bộ bi — 2026-10-29

Plan: `.claude/ke-hoach/2026-10-29-sua-drill-va-bo-bi.md`. Audit chạy `ShotPhysics` và `DrillShotPlanner` của working tree (`REBUILD=1 q.sh`, 124 drill).

## Kết quả

| Kiểm | Kết quả |
|---|---|
| Audit hai luật, 124 drill | Còn 4 bài gắn cờ, cả 4 nằm trong mục "Không làm" của plan (bảng dưới) |
| `npx tsc --noEmit` | exit 0 |
| `npx expo lint` | exit 0 |
| `sh scripts/drill-lint/run.sh` | exit 1: 183 vi phạm, 58 drill đạt. HEAD trước plan là 237 vi phạm, 8 drill đạt |

## Bài đã sửa

- **8, 10, 24 r3, 120, 121:** đổi tip, lực, zone theo engine. 24 r3 dời bi và bi cái 8" về phía lỗ giữa trái. 120 dời zone 1.
- **9:** chuyển sang cú cố định 1.0 m/s, zone dời về chỗ dừng sau một băng. Subtitle thêm câu "Checked in simulation, not on a real table."
- **53:** chín ô, mỗi ô có `cueBall` riêng.
- **119:** route mới từ rack-harness với `maxRails: 2`.
- **51, 54:** dời bi 1 để bi cái và zone nằm trên đường tâm lỗ, bi 1 thành cú thẳng lỗ thật.
- **56:** vùng đích dời ra chỗ bi cái chết thật trên tiếp tuyến.
- **46:** tip và lực ở round 30° và 39° dời về giữa dải ăn sạch.
- **60:** Spot B lực 1.4, Spot D lực 0.8, cú mẫu không còn đụng cụm.
- **123:** thay bằng Line-of-Balls (VEPP) của Dr. Dave.
- **Bộ bi RN:** chuyển sang Tournament BLACK.

## Bài còn gắn cờ và lý do

| Drill | Lý do |
|---|---|
| 31 | Replay video. Đường bi lấy từ video, không lấy từ engine. Plan không đụng |
| 50, 82, 85 | Chỉ có bi cái, không có cú ăn bi để chấm luật 1. Plan không đụng |
| 95 | Break: đụng cả rack là chủ ý, nên `moved` có bi ngoài `shots`. Không sửa |

## Lệch nguồn và chỗ mong manh

- **51, 54, 56 lệch toạ độ BU.** Engine nhắm tâm lỗ góc, nên bi đặt dọc băng thành cú cắt, và draw ném bi cái vào băng, quá `allowedRails` 0. Em dời bi hoặc zone chứ không nâng `allowedRails`. Ý bài giữ nguyên, docblock từng file có ghi.
- **56:** ở cú cắt 27°, bi cái không dừng được ngay tại ghost nếu không chạm băng. Chỗ dừng gần nhất cách ghost 8–9" dọc tiếp tuyến.
- **123:** cú 1 khớp nguồn. Từ cú 2 trở đi lệch Diagram 1, vì khoá zone theo sơ đồ thì engine chỉ dọn được 8/9.
- **Rate thấp (45 mẫu lệch tay, đo trên ShotPhysics):**

  | Drill | Cú | Rate |
  |---|---|---|
  | 10 | 1 | 1/45 (32 mẫu trượt lỗ: cú dài 46", tipX ±0.1 làm lệch) |
  | 119 | 2, 4 | 1/45 |
  | 123 | 1–9 | 4–15/45 |
  | 9 | 1 | 7/45 |

  Luật drill không đặt ngưỡng rate. Số ghi đúng như đo, không làm tròn lên.

## drill-lint còn rớt (ngoài phạm vi plan)

Chỗ rớt gần như toàn bộ là §3 của `docs/chuan-drill.md`:
- thiếu câu vì sao chọn cú;
- thiếu nguồn đường bi cái;
- chỉ có bậc lực, không có số m/s.

Các lỗi này nằm ở drill dạng `rounds` cũ, có từ trước plan. Đợt này làm số drill đạt tăng từ 8 lên 58, và không thêm vi phạm mới. Muốn lint exit 0 thì phải viết `why` và lực m/s từ engine cho từng round của khoảng 60 drill. Việc đó cần một plan riêng, vì viết tay không có số engine là bịa.

## Chưa kiểm

Tất cả đều chưa kiểm trên bàn thật. Simulator chỉ kiểm drill 123 và màn bộ bi (bước 1, 2) cùng các drill liệt kê trong phần kiểm cuối của phiên.
