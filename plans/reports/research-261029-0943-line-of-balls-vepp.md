# Line-of-Balls Drill (Dr. Dave): research để thay drill 123

Ngày 2026-10-29. Nguồn: https://drdavepoolinfo.com/faq/drill/line-of-balls/, bài "VEPP – Part VI: Line-of-Balls Drill" trên Billiards Digest số tháng 9/2012 (PDF), video NV C.8 và VEPP Disc II.

## Nguồn nói gì (đã đọc PDF và sơ đồ)

**Xếp bàn.** Chín bi 1–9 xếp một hàng trên đường tâm dọc bàn, các bi cách nhau khoảng một bi. Bi 1 cách băng cuối một bi, bi 9 nằm về phía giữa bàn. Toạ độ trong app: x = 0.5, bi k ở y = (3.375 + 4.5(k−1))/100, tức từ 0.034 đến 0.394.

**Luật.** Ball in hand cho cú đầu. Đánh theo thứ tự số (rotation), lỗ nào cũng được. Không được đụng các bi còn lại. Điểm là số bi ăn liên tiếp, ghi lại để theo dõi tiến bộ (score sheet nằm trong "How to Use VEPP").

**Hướng dẫn điều bi.**
- Bi 1: draw cơ bản, để lại góc nhẹ trên bi 2. Góc đó dẫn tới vị trí tương tự cho bi 3.
- Thiếu góc (bi gần như thẳng lỗ): draw thẳng về, bật băng dài rồi ra (đường đỏ, cú bi 3).
- Bi cái nằm phía trên đường bi–lỗ (như bi 4): lăn tự nhiên, chạm băng cuối rồi sang phía bên kia hàng bi.
- Vị trí cho bi 5, các phương án A–D trên sơ đồ: A, C, D dùng được, tránh B vì phải bank để né bi 6.
- Về sau bài dễ hơn vì hai lỗ giữa mở ra.
- Diagram 2 (từ bi 2 sang bi 3) liệt kê 6 cách: draw; draw thẳng về băng dài khi bi thẳng lỗ; follow có running english qua hai băng; follow góc tự nhiên sang phía bên kia; draw hai băng có chút english ngoài; chạy lên xuống bàn (khó, nên tránh). Lời khuyên chung: tránh bank, với lỗ góc thì để bi cái ở phía trên đường bi–lỗ.

**Đo từ Diagram 1** (render 300 dpi, 13.3 px/in):
- Bi 1–5 đều đi về cùng một lỗ góc cuối bàn, trong app là footRight.
- Bi cái khởi đầu cạnh bi 1, cùng khoảng cách tới băng cuối: (0.364, 0.035).
- Sau cú 1 (đường vàng): (0.346, 0.091). Sau cú 2 (đường xanh): (0.326, 0.173). Sau cú 3 (đường đỏ, draw về băng): (0.256, 0.293).
- Vị trí A–D cho bi 5 nằm phía bên kia hàng bi: A (0.629, 0.173), B (0.666, 0.250), C (0.710, 0.344), D (0.765, 0.454).

## Nguồn KHÔNG có

Không có lực, tip, góc cắt bằng số. Không có lỗ cho bi 6–9. Không có số lượt hay ngưỡng đạt. App cần các trường này nên phải lấy từ mô phỏng (`ShotPhysics`) hoặc đề xuất, và phải ghi rõ là không đến từ Dr. Dave.

## So với drill 123 hiện tại

Drill 123 "Center Line" đang có 7 bi xếp ngang ở đầu bàn, nguồn là reel Eddie Vonderau. Không khớp gì với bài của Dr. Dave: sai số bi, sai hướng hàng, sai chỗ đặt. Drill 12 "Line of Balls" trong app là bản BU 4 bi, một bài khác.

## Kiểm khả thi bằng mô phỏng (ShotPhysics, không phải bàn thật)

Ép route theo các điểm đo từ sơ đồ:
- Cú 1 và 2 tái hiện được đúng như nguồn: draw, góc cắt 10° rồi 16°, bi cái về đúng chỗ đường vàng và đường xanh.
- Cú 3 là cú gần thẳng (3°), draw thẳng về. Khớp với "draw straight back" của nguồn.
- Bám sơ đồ thì engine chỉ dọn được 6/9. Thả tự do thì dọn được 9/9, nhưng cú 2 thành cắt 62°, trái với "góc nhẹ" của nguồn.

Kết luận: chín bi trên bàn thật là khả thi, Dr. Dave dạy bài này như vậy. Engine hiện chưa tìm ra route 9/9 vừa bám nguồn vừa qua luật drill. Đây là giới hạn của bộ search (`scripts/rack-harness`), chưa phải bằng chứng là bài bất khả thi.

## Đề xuất

Thay drill 123 bằng bài này: vị trí 9 bi, luật và lời dặn lấy nguyên từ nguồn. Cú 1–3 dùng route bám sơ đồ. Cú 4–9 lấy route của engine, ghi rõ trong file là "mô phỏng, nguồn không quy định". Số lượt và ngưỡng đạt ghi là đề xuất.

## Câu hỏi còn mở

- Anh chấp nhận cú 4–9 lấy từ mô phỏng không, hay chỉ giữ 6 bi đầu (6/9 bám nguồn)?
- Ngưỡng đạt: Dr. Dave chỉ cho ghi điểm. App cần ngưỡng pass/fail, anh muốn bao nhiêu bi liên tiếp?
