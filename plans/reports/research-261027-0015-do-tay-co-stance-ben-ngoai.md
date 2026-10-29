# Dò tay cơ (tay sau) lúc đứng stance: bên ngoài làm thế nào, mình còn thiếu gì

Nghiên cứu ngày 27/10/2026, 00:15 (Asia/Saigon). Đầu vào: nguồn web, log máy 26/10 17:28 (`mp-side2.log`, 44 dòng), video 17:03 đã phân tích hôm qua, code `modules/pool-table/ios/Pose/`.

## Kết luận

Không tìm thấy app hay paper nào công khai việc dò tay cơ bida bằng pose estimation. DrillRoom có quảng cáo "stance check" nhưng không mô tả cách làm. Coach's Eye và CueSight thì chỉ quay chậm và kẻ góc bằng tay. Phần còn thiếu của mình vì vậy không nằm ở model mà ở **hình học đặt máy** và **cách chọn tay**. Có ba việc rẻ nhất:

1. **Đặt máy bên phía tay cơ, nhìn ngang, vuông góc với đường cơ, ngang tầm khuỷu.** Như vậy tay cơ là tay gần máy. Nếu máy nằm phía tay kia, tay cơ bị thân che, và MediaPipe sẽ đoán khuỷu, đúng kiểu nhảy thấy trong video 17:03.
2. **Không tin nhãn trái/phải của model khi quay ngang 90°.** Có nguồn ghi nhận MediaPipe đảo trái/phải giữa chừng ở góc ngang thuần, do bị che. Nên chọn tay cơ theo dữ kiện trong khung, ví dụ tay nào có visibility khuỷu và cổ tay cao hơn, chứ không chỉ theo `side`.
3. **Ẩn chấm khuỷu khi visibility dưới ngưỡng** thay vì vẽ điểm đoán. `BoneGate` chỉ chặn được cú nhảy ngắn, không chặn được một điểm sai nhưng ổn định.

## Nguồn ngoài nói gì

**Cơ sinh học tay cơ** (dùng để chấm, không phải để dò):
- Stroke kiểu pendulum giữ vai và khuỷu yên, chỉ cẳng tay đung đưa. Khuỷu rơi trước lúc chạm bi làm đầu cơ nhấc lên. Phần lớn người giỏi chỉ rơi khuỷu sau khi chạm ([Dr. Dave, Billiards Digest](https://billiards.colostate.edu:443/bd_articles/2024/march24.pdf), [jan23](https://billiards.colostate.edu:443/bd_articles/2023/jan23.pdf)).
- Checklist PoolDawg: nhìn ngang thì tay cầm 90° lúc đầu cơ chạm bi, khuỷu và vai không động tới sau khi chạm. Nhìn từ sau thì khuỷu và cẳng tay thẳng hàng phía trên cơ ([PoolDawg](https://www.pooldawg.com/article/video-analysis/)).
- Một patent về dụng cụ tập stroke mô tả stroke lý tưởng là cẳng tay bản lề quanh khuỷu, bắp tay đứng yên ([USPTO 12453919](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12453919)).
- Các ý trên khớp với `PoseLimits` hiện tại (cẳng tay dọc 10°, bắp tay đổi ≤ 6°). Không có nguồn nào cho số cứng, nên giữ nguyên ghi chú "ngưỡng tạm" trong `PoseStroke.swift`.

**Đặt máy:**
- Muốn thấy khuỷu rơi thì quay ngang, phía tay cầm cơ, lùi đủ xa để thấy cả backswing lẫn follow-through ([AZB](https://forums.azbilliards.com/goto/post?id=7365413), [AZB](https://forums.azbilliards.com/goto/post?id=7367642)). Muốn thấy cẳng tay có thẳng trên cơ không thì quay từ sau hoặc từ trước dọc đường cơ ([AZB](https://forums.azbilliards.com/goto/post?id=6824356)).
- Không nguồn nào cho chiều cao máy cụ thể. Ngang tầm khuỷu lúc stance là em suy ra từ hình học: đó là chỗ phối cảnh làm lệch phương dọc của cẳng tay ít nhất.

**MediaPipe:**
- `visibility` là xác suất điểm bị che hoặc ra ngoài khung. Tài liệu nói tuỳ model mà giá trị là sigmoid hoặc là đối số của sigmoid, nên ngưỡng phải tự đo ([MPPLandmark](https://developers.google.com/edge/api/mediapipe/objc/vision/Classes/MPPLandmark.html)).
- Trên Pixel 3 CPU, lite chạy 44 FPS, full 18 FPS, heavy 4 FPS. Chính xác tăng dần từ lite lên heavy ([model card](https://developers.google.cn/static/ml-kit/images/vision/pose-detection/pose_model_card.pdf), [TF blog](https://blog.tensorflow.org/2021/05/high-fidelity-pose-tracking-with-mediapipe-blazepose-and-tfjs.html)).
- Đảo trái/phải ở góc ngang 90°: nguồn là một tài liệu skill bên thứ ba, chưa có issue chính thức xác nhận. Họ gợi ý đặt máy chéo khoảng 45° hoặc hậu xử lý để sửa đảo ([skill doc](https://agentskills.so/skills/feniix-kinemotion-mediapipe-pose-detection)). Độ tin cậy thấp, cần tự kiểm.
- MediaPipe một camera đủ dùng cho động học tay trong mặt phẳng 2D ở bệnh nhân sau đột quỵ ([PMC12752325](https://pmc.ncbi.nlm.nih.gov/articles/PMC12752325/)). Giới hạn của nó là mất chiều sâu ([Nature Sci Rep](https://www.nature.com/articles/s41598-025-29062-7)). Cú cơ đi dọc trục nhìn ngang nên chiều sâu ít ảnh hưởng, nhưng nếu nhìn từ trước thì cú cơ đi thẳng vào ống kính.

## Đối chiếu với log 26/10 17:28 (đã kiểm)

- Có 44 dòng, 35 dòng thấy người, 12 dòng `wrist` ≥ 0.5. Trung vị 10.5 ms, `err` 0.
- `lean` (cẳng tay lệch dọc) có các giá trị 176, −121, 159, 122, 119. Cẳng tay buông dọc thì `lean` phải gần 0. Lệch trên 90° nghĩa là cổ tay nằm *trên* khuỷu trong ảnh, tức tay đang giơ, hoặc khuỷu và cổ tay bị đoán sai hay đảo tay. Chưa có clip lúc 17:28 nên chưa phân biệt được hai khả năng này.
- 17:28:42–45 thì khuỷu và cổ tay chỉ còn 0.04–0.07 trong khi vai vẫn 1.00. Đây đúng là dấu hiệu tay cơ bị thân che, tức máy đang nằm phía tay kia.

## Khuyến nghị theo thứ tự

1. **Kiểm giả thuyết "sai phía máy" trước, không cần code.** Anh đặt máy bên phải người (nếu đánh tay phải), ngang tầm khuỷu, cách 1,5–2 m, vuông góc đường cơ, rồi quay lại 30 s. Nếu ≥ 2/3 dòng có `wrist` ≥ 0.5 và `lean` quanh 0 thì bước 2 của plan đạt mà không cần đổi gì. Đây là việc rẻ nhất và quyết định cả hướng.
2. **Nếu vẫn nhảy:** ẩn chấm khuỷu và nét tay cơ khi `visibility` < 0.5 (ngưỡng này phải đo lại theo phân bố ở bước 5). Một hàm, một file `PoseCoachView.swift`.
3. **Nếu thấy đảo tay:** mỗi khung chọn tay cơ là tay có tổng visibility khuỷu và cổ tay cao hơn, có trễ để khỏi lật qua lại. Đụng `PoseLandmarks.swift`. Đây là việc ngoài plan, cần anh duyệt.
4. **Model full** chỉ thử khi 1–3 chưa đủ. Lite đang 10.5 ms. Theo tỉ lệ 44/18 FPS của model card thì full rơi vào khoảng 25 ms, sát trần 30 ms của bước 3. Đó là ước tính, chưa đo. Đổi model cũng đảo non-goal "không dùng model full" trong plan.

Không làm: đặt máy chéo 45°. Góc đó làm phương dọc của cẳng tay bị phối cảnh kéo lệch, phá luôn phép đo `forearm` 10°.

## Câu hỏi còn mở

- Lúc 17:28 máy đặt bên nào của người, ở độ cao nào? Các giá trị `lean` > 90° là do anh giơ tay hay do model đoán sai?
- Anh đánh tay phải, và `side` trong app đang để `right` đúng không?
- DrillRoom làm stance check bằng gì: không có tài liệu, muốn biết thì phải cài thử.
