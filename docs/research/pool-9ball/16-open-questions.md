---
title: Pool 9 bi — câu hỏi mở và gaps
date: 2026-10-19
type: research-open-questions
status: cập nhật batch 3, cập nhật tiếp mỗi batch
---

# Câu hỏi mở

## A. Cần anh quyết

1. **Tên file 13.** Đề bài gọi là "spritekit-feasibility", nhưng app không dùng SpriteKit. Render là SwiftUI `Canvas` trong `modules/pool-table/ios/`. Em đề xuất giữ tên file cho khớp đề bài, nội dung đánh giá trên nền thật. Nếu anh thật sự muốn cân nhắc chuyển sang SpriteKit thì đó là câu hỏi khác, cửa một chiều, cần brainstorm riêng.
2. **Guide tangent line vẽ lý tưởng hay vẽ theo engine.** Với e = 0.95, cú cắt 10–15° tách ra 82–85°, không phải 90° (file 06 mục 1.1). Vẽ lý tưởng thì dạy đúng quy tắc nhẩm nhưng lệch với mô phỏng. Vẽ theo engine thì khớp mô phỏng nhưng người học không còn thấy mốc 90°.
3. **Xem video FB bằng cách nào.** 5 clip #11–#15 không có transcript. Ba cách: (a) anh đăng nhập Facebook trong trình duyệt của app rồi em xem, (b) anh tải video về, em tách khung và audio bằng `ffmpeg` có sẵn, (c) bỏ qua, chỉ phân tích theo caption. Em đề xuất (b): không phụ thuộc phiên đăng nhập, xem lại được.

## B. Gaps nguồn

| # | Gap | Ảnh hưởng | Cách gỡ rẻ nhất |
|---|---|---|---|
| B1 | Chưa xem hình clip nào | Vị trí bi, điểm đặt cơ chỉ biết qua lời nói | Tách khung từ video (cần video file) |
| B2 | Không có nguồn độc lập cho hệ 2 băng dài (#7) | Không dùng làm đáp án chấm điểm được | Đo trên bàn bằng phiếu đo 2026-10-18 |
| B3 | Quy tắc 45° (#6) chỉ có nguồn diễn đàn; phản xạ gương nói không luôn qua tâm | Chưa dựng drill chấm điểm được | Đo 3 vị trí bi mục tiêu dọc đường x + y = 50 |
| B4 | Lý do "đánh nhẹ thì góc rộng ra" (#3): batch 2 có cơ chế ứng viên (ma sát bi-bi ăn topspin, μ(v) tăng khi chậm), em tính ra lệch 1–2°. Chưa có nguồn công bố | Không ảnh hưởng quy tắc chính | Chạy engine ở batch 6 (engine có mô hình ma sát này), hoặc đo trên bàn |
| B5 | Con số đỉnh góc lăn tự nhiên lệch giữa nguồn (30°, 33.75°, 37°) | Chọn số nào làm mốc trong app | Đo; tạm dùng Shepard vì có công thức |
| B6 | billiards.colostate.edu trả 403 | Thiếu bản gốc các trang tóm tắt của Dr. Dave | Dùng mirror drdavepoolinfo.com |
| B7 | Clip phụ Điều bi P1 (stun, 90°) và "Càng mỏng càng phê" chưa đọc. Batch 2 tra lại: transcript không có trong dữ liệu đã lấy ở batch 1 | Thiếu phần nền mà #3 dựa vào; thiếu nội dung throw theo độ mỏng | Lấy lại transcript từ trang TikTok khi trình duyệt mở được |
| B8 | Ngày đăng #12–#15 chưa lấy | Chỉ ảnh hưởng inventory | Lấy khi xem lại trang FB |
| B9 | Batch 2 không fetch được trang nào: WebFetch `ECONNREFUSED`, curl exit 7, Facebook bị từ chối trong trình duyệt app. Mọi nguồn ngoài của file 05 và 07 là snippet tìm kiếm | Mức tin thấp hơn đọc trọn trang | Kiểm lại mạng hoặc proxy, rồi đọc trọn các trang Dr. Dave đã dẫn |
| B10 | Bảng số ví dụ của SAWS (PDF trên colostate.edu) chưa đọc được | Chưa so được độ lớn tỉ lệ trộn của #9 | Như B6 và B9 |
| B11 | Không tìm thấy nguồn chính về nhược điểm ghost ball ở cú mỏng (chủ đề #12) | File 05 mục 2.4 chỉ có suy đoán của em | Xem #12, rồi tìm theo đúng nội dung clip |
| B12 | Số NPL cho Revo chỉ có từ diễn đàn (15–23 inch), không có số Predator công bố | Chưa chốt được squirt mặc định cho ngọn LD | Đo bằng drill NPL của file 07 |
| B13 | Batch 3 vẫn không fetch được trang nào: drdavepoolinfo.com curl exit 7, colostate.edu trả 301 sang drdavepoolinfo. TP B.20 (khối lượng hiệu dụng rack) chỉ có snippet | Chưa gỡ được mâu thuẫn ⅔ và 2× ở file 09 | Như B9 |
| B14 | Không tìm được bản luật WPA hiện hành chính thức và kích thước break box chính thức. Số box (9 in, 15.89 in, 18 in) là từ diễn đàn. Có một PDF "9 Ball Rules Official 2026" trên upatour.com chưa mở được | App chưa chọn được luật mặc định | Để box và luật 3 bi là tham số; khi mạng mở được thì đọc bản WPA |
| B15 | "Xếp cao" và "xếp thấp" không có định nghĩa công khai. File 09 suy ra: xếp cao là bi 9 trên spot, xếp thấp là bi 1 trên spot | Tên bài trong app có thể sai | Anh xác nhận, hoặc xem một khung rack của #1 và #2 |
| B16 | Cách đặt cơ ở #10 (đếm 1.5 chấm từ góc nào, mốc "mép thành băng") em hiểu từ lời nói | Bảng chiều dài cơ ở file 08 mục 2.2 dựa trên cách hiểu này | Xem hình #10 |

## C. Câu hỏi kỹ thuật cho các batch sau

1. Có cách đo rẻ lượng backspin còn lại lúc chạm không? Nếu không, app không chấm được draw theo trisect, chỉ gợi ý được. (Batch 6)
2. ~~"Khối lượng hiệu dụng của rack" (#2) mô tả đúng vật lý không?~~ **Đã trả lời ở batch 3** (file 09 mục 2.4): khái niệm có thật và hướng đúng (rack hiệu dụng nặng hơn bi cái nên bi cái stun bật lại), nhưng độ lớn DISPUTED: TP B.20 cho ⅔ m, diễn đàn đo khoảng 2 m, Dr. Dave nói nó đổi theo độ vuông của cú chạm. Gỡ bằng B13 hoặc chạy RackSim ở batch 6.
3. ~~Tỉ lệ 4/5 của hệ bank (#10) có phụ thuộc chiều dài cơ và kích thước bàn không?~~ **Đã trả lời ở batch 3** (file 08 mục 2.2): có. Công thức "1.5 chấm + chuôi cơ" ra 0.765–0.805 W trên bàn 9 ft với cơ 57–59 in, nhưng 0.92–0.97 W trên bàn 8 ft và trên 1.0 W trên bàn 7 ft. Bản thân hệ số k cũng đổi theo góc bank (0.60–0.90 theo hệ Dr. Dave). Phần engine sinh câu hỏi 11.
4. ~~Break box và luật xếp 9 bi mà Tuấn dùng có khớp WPA hiện hành không?~~ **Đã trả lời một phần ở batch 3** (file 09 mục 2.1): cách xếp khớp WPA. Break box và luật 3 bi khác nhau theo giải, không có một chuẩn duy nhất. "Xếp cao" và "xếp thấp" chưa có định nghĩa, xem B15.
5. ~~NPL Tuấn đo khớp số công bố không?~~ **Đã trả lời ở batch 2** (file 07): 21 và 27 cm nằm trong dải Platinum Billiards, Revo 40 cm ở mép dưới dải diễn đàn. Phần engine sinh ra câu hỏi mới, xem 8 và 9.
8. Engine có **hai mô hình squirt**: `ShotPhysics` tuyến tính 2.5° ở 0.5R, `RackSim` dạng TP A.31 với tỉ lệ khối lượng 25 (2.33° ở 0.5R). Thống nhất về một mô hình không? Em nghiêng về dạng TP A.31 vì có cơ sở vật lý và tham số hoá được theo NPL. (Batch 6)
9. Số 1.2° cho cơ LD trong `docs/aiming-physics.md` tương ứng NPL khoảng 68 cm, dài hơn mọi số đo Revo tìm được. Đổi mặc định LD về khoảng 1.7° không? Chỉ ảnh hưởng tài liệu, chưa thấy code dùng số này. (Batch 6)
10. Ghost ball trong app có tách "ghost ball hình học" và "ghost ball đã bù throw" không, và có gộp nhầm squirt vào vị trí ghost ball không? (Batch 6, file 05 mục 3)
6. #14 "trò Ghost" có phải Ghost 9-ball không, #15 có phải push-out không? Hiện là suy đoán. (Batch 4)
7. Engine (`ShotPhysics`) có tái hiện bảng Shepard không? Chưa chạy harness. (Batch 6, test case đầu tiên của file 14)
11. `ShotPhysics.cushion()` cho tỉ lệ tan bật ngay sau băng khoảng 0.87 với bi trượt không spin, góc vào 10–40°. Tỉ lệ ở trường xa, sau khi spin làm đường cong lại, là bao nhiêu? Nếu vẫn gần 0.87 thì bank trong app dài hơn bàn thật (Jewett 0.71). (Batch 6, file 08 mục 3)
12. RackSim có tái hiện bi cái stun bật lại sau break không, và khối lượng hiệu dụng engine ngầm dùng là bao nhiêu? (Batch 6, file 09 mục 3)
