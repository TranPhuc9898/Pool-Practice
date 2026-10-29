# Tay cơ lúc phát lực: setup thẳng rồi, mỗi cú đi thế nào

Nghiên cứu ngày 27/10/2026 (Asia/Saigon). Nối tiếp `research-261027-0146-tay-co-chuan.md` (setup tĩnh). Báo cáo này nói về chuyển động: từ address tới hết follow-through, và cú nhẹ khác cú mạnh ở đâu.

## Kết luận

Phát lực không đến từ việc giật hay siết. Nó đến từ **cẳng tay tăng tốc đều quanh khuỷu đang đứng yên**, đạt tốc độ cao nhất ngay lúc chạm bi, rồi đi tiếp qua bi. Muốn mạnh hơn thì backswing dài hơn và tăng tốc lâu hơn, chứ không siết tay hay đẩy vai. Khuỷu được rơi, nhưng chỉ **sau** khi chạm. Thời điểm rơi phải giống nhau giữa các cú, lượng rơi thì không quan trọng.

## Từng pha

| Pha | Chuẩn | Lỗi hay gặp | Nguồn |
|---|---|---|---|
| Address | Cẳng tay dọc, khuỷu trên đường cơ, tay cầm lỏng | — | báo cáo trước |
| Backswing | Chậm, thẳng. Bắp tay yên, chỉ cẳng tay lùi. Cú mạnh thì lùi dài hơn | Lùi nhanh, giật | [Dr. Dave](https://drdavepoolinfo.com/?p=2541) |
| Chuyển chiều | Có hai trường phái. Dừng hẳn từ 0,5 s trở lên, hoặc chuyển mượt mà không dừng thật. Người giỏi được đo thường bắt đầu tăng tốc tới trước **trước khi** cơ lùi tới điểm xa nhất | Vội về trước | [Dr. Dave](https://www.engr.colostate.edu/~dga/pool/acceleration/), [AZB](https://forums.azbilliards.com/goto/post?id=2162045) |
| Tăng tốc | Đều và tăng dần. Lực đến từ cẳng tay quay quanh khuỷu | Siết tay hoặc đẩy vai tới để "thêm lực", làm cơ chậm lại và lệch line | [CSU draw](https://billiards.colostate.edu/resource_files/trcd/CueTimes%20PDFs/698%20Mastering%20Draw.pdf) |
| Chạm bi | Tốc độ đạt đỉnh, gia tốc về gần 0. Không giảm tốc vào bi, cũng không còn đang tăng tốc | Giảm tốc vào bi, tức "jab" | [Dr. Dave](https://drdavepoolinfo.com/?p=2541) |
| Follow-through | Đi hết, thẳng theo line. Cú draw ngắn hơn nhưng không bỏ | Dừng cụt ngay sau bi | [CSU advanced draw](https://billiards.colostate.edu/resource_files/trcd/CueTimes%20PDFs/601%20Advanced%20Draw.pdf) |
| Sau chạm | Khuỷu rơi được, thường là ở cú mạnh, vì cẳng tay hết tầm. Rơi trước khi chạm thì đầu cơ nhấc | Rơi trước khi chạm | [Dr. Dave BD 01/2023](https://billiards.colostate.edu:443/bd_articles/2023/jan23.pdf), [AZB](https://forums.azbilliards.com/goto/post?id=2273806) |

Ghi chú về các nguồn:
- Trang đo gia tốc của Dr. Dave trả 403. Phần trích dẫn em lấy từ snippet tìm kiếm, chưa đọc trực tiếp.
- Cú phá (power break) là ngoại lệ: không theo profile "đỉnh tốc lúc chạm" như trên.

## Cú nhẹ và cú mạnh khác nhau ở đâu

- **Giống nhau:** cẳng tay vẫn dọc lúc chạm, khuỷu vẫn yên tới lúc chạm, tay vẫn lỏng.
- **Cú mạnh khác ở:**
  - Backswing dài hơn.
  - Thời gian tăng tốc dài hơn.
  - Cầm cơ nhích lên một chút, nên lúc chạm cẳng tay có thể hơi vượt quá phương dọc về phía trước.
  - Khuỷu rơi rõ hơn trong follow-through. Một người chơi lâu năm trên AZB ước lượng mức rơi cỡ bề dày bắp tay, đây là kinh nghiệm cá nhân ([AZB](https://forums.azbilliards.com/goto/post?id=5147824)).
- **Cổ tay:** nguồn không thống nhất. Một bên khuyên cổ tay lỏng. Một bên nói cổ tay ổn định, không cứng không lỏng, thì chính xác hơn, và pro ít dùng cổ tay ([AZB](https://forums.azbilliards.com/threads/wrist-stroke-power.17374)). Không có đo đạc nào.

## Cơ sinh học (nghiên cứu thật, mẫu nhỏ)

- **Kong et al. 2021, một VĐV snooker elite:** cú cơ chủ yếu do gập và duỗi khuỷu, cổ tay góp ít ([PAAH](https://paahjournal.com/articles/10.5334/paah.111)).
- **Haar et al. 2020, 30 người mới, 300 cú mỗi người, 17 IMU:**
  - Người mới dùng vai nhiều.
  - Khi học, độ dao động động tác giảm, và vận tốc góc đỉnh giảm.
  - Học thay đổi cả người chứ không riêng tay ([Sci Rep / PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7674448/)).
- Không có nghiên cứu nào cho dung sai bằng độ, hay số chuẩn cho vận tốc cổ tay.

## Đối chiếu với `PoseStroke.swift` (đã đọc code)

App đã có máy trạng thái `address → backswing → forward → follow` và chấm 5 lỗi. Từng lỗi so với nguồn:

| Lỗi trong app | Khớp nguồn? | Ghi chú |
|---|---|---|
| `forearmForward` / `forearmBack`, ±10° lúc chạm | Khớp | Cú mạnh có thể bị bắt oan `forearmForward` vì cẳng tay hơi vượt quá dọc. Suy đoán, chưa đo |
| `elbow`, bắp tay đổi ≤ 6° **tới lúc chạm** | Khớp | Đúng ý "không rơi trước khi chạm". App không phạt rơi sau chạm, cũng đúng |
| `head`, đầu nhấc ≤ 3 cm | Khớp | Ngoài phạm vi tay, giữ nguyên |
| `pause`, dừng sau < 0,2 s thì báo lỗi | **Lệch** | Dr. Dave đo được người giỏi không có dừng thật. Đây là phong cách, không phải lỗi. Nên hạ xuống mức nhắc, hoặc bỏ |

App chưa đo, nhưng nhìn ngang có thể đo được:

1. **Giảm tốc vào bi (jab).** Đây là lỗi động quan trọng nhất mà app còn thiếu. Lấy vận tốc cổ tay dọc trục cơ từ chuỗi `pos` có sẵn. Nếu đỉnh tốc rơi trước lúc chạm quá ~1 khung thì là jab. Ở 30 fps, một cú nhẹ đi qua vùng chạm chỉ trong vài khung, nên cần đo trên log thật trước khi đặt ngưỡng.
2. **Follow-through cụt.** Tính quãng cổ tay vượt qua vị trí address, theo đơn vị `L` (chiều dài cẳng tay). App đang dùng `followThrough 0.3 L` để *nhận* cú. Đo thêm quãng tối đa là có số này.
3. **Vai đẩy tới.** Đo dịch chuyển của vai dọc trục cơ từ address tới lúc chạm. Nguồn CSU nêu đây là lỗi khi cố tạo lực.

Không đo được bằng pose: lực siết tay cầm, và cổ tay gập hay lỏng, vì plan đã chốt không vẽ bàn tay.

## Khuyến nghị

1. **Chưa đổi code.** Mọi điều chỉnh bên trên đều cần log nhìn ngang thật. Hiện chưa có clip nào đặt máy đúng góc. Đây vẫn là việc chặn đường, giống kết luận hai báo cáo trước.
2. **Khi có log:**
   - Đổi `pause` từ lỗi thành nhắc.
   - Thêm chỉ số **jab** (vị trí đỉnh tốc so với lúc chạm) và **độ dài follow-through**.
   - Cả ba việc này đều nằm trong `PoseStroke.swift`. Đây là việc ngoài plan stance-mediapipe, nên làm thành plan riêng.
3. **Không phân loại cú mạnh/nhẹ** cho tới khi thấy `forearmForward` bắt oan thật trên log.

## Câu hỏi còn mở

- Ở 30 fps, MediaPipe lite có đủ khung quanh lúc chạm để thấy đỉnh tốc không? Phải đo.
- Có nên giữ `pause` như một bài tập kỷ luật hay không? Một số HLV dạy dừng có chủ đích. Đây là quyết định sản phẩm, không phải chuyện đúng sai kỹ thuật.
