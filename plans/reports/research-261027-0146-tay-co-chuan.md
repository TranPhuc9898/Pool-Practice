# Tay cơ (tay sau) lúc đánh bida: thế nào là chuẩn

Nghiên cứu ngày 27/10/2026, 01:46 (Asia/Saigon). Bổ sung cho `research-261027-0015-do-tay-co-stance-ben-ngoai.md`. Đầu vào là nguồn web và video máy quay lúc 01:39.

## Chuẩn mà các nguồn đồng thuận

| Điểm | Chuẩn | Nhìn từ đâu thì thấy |
|---|---|---|
| Cẳng tay lúc ngắm và lúc chạm bi | Dọc, vuông góc với cơ | Ngang |
| Khuỷu | Nằm ngay trên đường cơ, không "chicken wing" bẻ ra hay bẻ vào | Sau hoặc trước, dọc theo cơ |
| Bắp tay (vai → khuỷu) | Đứng yên khi stroke kiểu pendulum, chỉ cẳng tay đưa | Ngang |
| Khuỷu rơi | Không rơi **trước** lúc chạm bi. Rơi sau khi chạm thì chấp nhận, nhất là cú mạnh | Ngang |
| Cú mạnh | Cầm cơ nhích lên, cẳng tay hơi vượt quá phương dọc lúc chạm | Ngang |

Nguồn: [Dr. Dave: khuỷu trên cơ, cẳng tay dọc](https://drdavepoolinfo.com/?p=2543), [Dr. Dave: pendulum, piston và J-stroke](https://drdavepoolinfo.com/?p=2552), [Billiards Digest 01/2023](https://billiards.colostate.edu:443/bd_articles/2023/jan23.pdf), [PoolDawg pendulum](https://www.pooldawg.com/article/the-perfect-pendulum-stroke/).

Có hai chỗ các nguồn không thống nhất:
- Khuỷu có được rơi sau khi chạm bi không. Dr. Dave cho rằng thứ cần giữ là thời điểm rơi phải nhất quán, không phải lượng rơi.
- Số đo cứng. Không nguồn nào cho dung sai bằng độ. Chỉ có một bình luận ước lượng khuỷu rơi ở cú mạnh khoảng "vài inch".

## Đối chiếu với app

- `PoseLimits` đang chấm cẳng tay lệch dọc ≤ 10° và bắp tay đổi ≤ 6°. Hai điều kiện này khớp với hai điểm cốt lõi là cẳng tay dọc và bắp tay đứng yên. Các con số là ngưỡng tạm, không có nguồn.
- Nhãn góc khuỷu đang vẽ là góc vai–khuỷu–cổ tay trên ảnh 2D. Nó chỉ có nghĩa khi máy nhìn ngang. Nhìn từ trước thì cẳng tay chĩa vào ống kính và bị co ngắn lại, nên góc này nhảy loạn.
- "Khuỷu nằm trên cơ" chỉ kiểm được khi máy nhìn dọc theo cơ, ở phía sau hoặc phía trước. App chưa đo điều này.

## Video 01:39 (đã xem, 1 khung/giây, 28,7 s)

- Máy vẫn nằm thấp phía trước người, chĩa lên. Anh quay mặt và thân về phía máy, chưa phải góc nhìn ngang.
- Nhãn góc nhảy giữa các khung: 8°, 57°, 93°, 156°, 170°, 83°, 55°, 166°, 3°, 38°, 130°, 104°. Bộ đếm stroke vẫn ở "Waiting for a stroke".
- Cả clip trạng thái đều là "Arm found. Get down on the shot.", tức app thấy tay nhưng chưa nhận ra là đang ở tư thế stance.

## Khuyến nghị

1. Giữ tiêu chí chính là **cẳng tay dọc** và **bắp tay yên**. Không thêm tiêu chí mới cho tới khi có dữ liệu từ góc nhìn ngang.
2. Quay một clip nhìn ngang đúng cách: máy bên phía tay cơ, ngang tầm khuỷu, cách 1,5–2 m, thấy cả người. Clip này quyết định nhãn góc và bộ đếm có chạy được hay không.
3. "Khuỷu trên cơ" để sang plan sau, vì cần góc nhìn từ sau, tức một chế độ thứ hai.

## Câu hỏi còn mở

- Nhãn góc khuỷu có nên giữ không. Nó không phải tiêu chí chấm, và từ góc nhìn sai thì nó gây nhiễu.
