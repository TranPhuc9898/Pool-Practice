# Ý tưởng onboarding: research 3 nhánh

Ngày 2026-10-21. Gộp từ 3 agent research (pattern onboarding app tập luyện, app luyện kỹ năng thể chất, tham chiếu hình ảnh tối-vàng). Em kiểm lại các nguồn chính và repo. Mục cuối ghi rõ cái nào em đã tự đọc, cái nào chỉ agent đọc.

## Kết luận

Cả 3 nhánh cùng chỉ một hướng: **cho đánh thật trước, giải thích sau**. App gần mình nhất là Cueist (pool, tự chấm theo drill). App này mở đầu bằng bài test đầu vào, và đã cho thấy người chơi pool chịu làm test. Nhưng bài test của Cueist dài khoảng 30 phút, và điểm khởi đầu làm người chơi nản ("humbling").

Đề xuất cho v2 là bản ngắn của ý đó:

1. **Màn value**: bàn trải hết chiều ngang, phát lại cú Stop.
2. **Rẽ nhánh "Anh đang ở bàn chưa?"**
   - Ở bàn rồi: vào màn sắp bàn (2 bi), đánh 1 set baseline 10 cú Stop thật, rồi xem kết quả.
   - Chưa: xem demo Pass/Miss, sau đó vào app.
3. **Sau set đầu mới làm 3 việc**: giới thiệu gauge 120 cú ("anh vừa xong 10/120"), xin quyền notification kèm nút "Để sau", và bỏ ngỏ việc hẹn lịch tập.

Kết quả baseline phải đổi được một thứ thật, ví dụ mức ladder Stop khởi điểm. Đây là bài học Headspace: câu hỏi không đổi gì thì chỉ làm đẹp chỉ số onboarding.

## Luồng màn đề xuất cho v2

| Bước | Màn | Nội dung chính | Nút | Lối ra |
|---|---|---|---|---|
| 1 | Value | Bàn kiểu native (cloth `#223A4C`, rail đen) trải hết chiều ngang, phát cú Stop: bi cái khựng tại điểm chạm, bi 1 rơi lỗ, chỉ một flash vàng lúc rơi | Continue (graphite) | Skip |
| 2 | Đang ở bàn? | Hai card lớn: "Ở bàn rồi" và "Chưa, xem trước" | Card | Back |
| 3a | Sắp bàn | Crop góc bàn: vị trí bi cái, bi 1 và zone theo diamond, 2 bi, đánh dấu zone bằng phấn | Ready (graphite) | Back |
| 4a | Set baseline | Drill card thật và nút Pass/Miss thật, dải 10 chấm (đặc = Pass, rỗng = Miss), Undo | Pass / Miss | Bỏ set |
| 5a | Kết quả | Số chấm Doto "7/10", mức Stop khởi điểm, gauge 120 cú với 10 cú đã xong | Start workout (vàng) | Notification primer có "Để sau" |
| 3b | Demo | Màn 3 của thiết kế v2 cũ: tap Pass/Miss trên bàn crop, dải chấm | Start workout (vàng) | Explore first |

Nhánh "ở bàn" có 5 màn, nhánh "chưa" có 3 màn. Set 10 cú mất khoảng 5 phút. Đây là ước lượng của em, chưa đo.

## Xếp hạng ý tưởng

| # | Ý | Màn | Nguồn | Kiểm | Chi phí |
|---|---|---|---|---|---|
| 1 | Set baseline 10 cú Stop thật thay demo giả, bỏ qua được | 4a | Cueist, HackMotion, Ladder, HIG | Cueist, Ladder, HIG em đã đọc | Prototype S, app M |
| 2 | Rẽ nhánh "đang ở bàn chưa" | 2 | Suy từ ràng buộc vật lý, thread Golf Pad | INFERRED | S |
| 3 | Màn sắp bàn: drill đầu 2 bi, đặt theo diamond | 3a | Cueist (gần mọi drill 2 bi), DrillRoom (setup score) | Cueist em đã đọc | S |
| 4 | Bàn trải hết chiều ngang, phát lại cú theo nhịp sự kiện, vàng chỉ lóe lúc rơi lỗ | 1 | Billiard Shot Studio, Shot Tracer, EMPEROR | Chỉ đọc caption, chưa xem ảnh | S (prototype đã có thiết kế) |
| 5 | Gauge 120 cú chuyển ra sau set đầu | 5a | HIG: dạy nhiều thì ngợp, dễ quên | Em đã đọc | S |
| 6 | Cú khởi động không tính streak; điểm không làm người mới nản | 4a, 5a | 18Birdies, HomeCourt top 3 | HomeCourt em đã đọc | S |
| 7 | Baseline đặt mức ladder Stop khởi điểm | 5a | Headspace (câu trả lời phải đổi thứ thật) | INFERRED | M |
| 8 | Xin notification sau set đầu, có primer và "Để sau" | 5a | HIG, Apple notifications doc, DRVN | HIG em đã đọc | S |
| 9 | Tối đa 3 chỗ vàng mỗi màn (tiêu đề Doto, CTA, một phần tử đang chuyển động) | Chung | Porto Rocha, `color.ts` của app | `color.ts` em đã đọc | S |
| 10 | Có mục "Xem lại hướng dẫn" trong Settings | App | HIG | Em đã đọc | S |
| 11 | Tip theo ngữ cảnh lần đầu vào mỗi block (Stroke, Follow, Draw) | App | HIG, Fitbod | HIG em đã đọc | M |
| 12 | Hẹn lịch tập (precommitment) | Sau 5a | Headspace | Em đã đọc: tăng số lần mở app, không tăng số ngày tập | S, giá trị thấp |
| 13 | Hỏi kích thước bàn 7/8/9ft | 2 | Cueist phải vá sau launch | Engine cố định 9ft (repo) | M–L, hoãn |
| 14 | Streak freeze, hoặc daily goal nhỏ hơn 120 cú | App | Bricole, Duolingo | Agent đọc | Đụng triết lý 120 cú, owner quyết |

20% nên làm ngay trong prototype v2: ý 1, 2, 3, 4, 5. Phần cố tình bỏ: ý 7 và 11 cần sửa engine hoặc app, ý 12–14 giá trị thấp hoặc là quyết định sản phẩm.

## Bốn anti-pattern

1. **Test dài hoặc dạy nhiều trước khi cho đánh.** Cueist test khoảng 30 phút. Headspace bản cũ mất 38% người giữa đầu và cuối onboarding.
2. **Xin quyền lúc vừa mở app, hoặc gom nhiều quyền liền nhau.** HIG khuyên xin lúc người dùng chạm vào tính năng cần quyền. App hiện chưa có code notification.
3. **Câu hỏi không đổi gì.** Irrational Labs làm cho Headspace: quiz tạo cảm giác "hợp với tôi" đưa course starts từ khoảng 31% lên khoảng 63%, dù khoá gợi ý vẫn y như mặc định. Số ngày thiền thật không khác biệt có ý nghĩa.
4. **Gauge giống Activity rings.** HIG cấm dựng lại ba vòng đồng tâm cho dữ liệu khác. Gauge cung chia đoạn hiện tại của app không vi phạm.

## Repo: đã kiểm

- `PoolTableView` có prop `replay` (`modules/pool-table/src/PoolTableView.tsx:24`): "có thì Play diễn lại nó thay cho engine". Bản app thật có thể dùng renderer native cho màn 1. Chưa kiểm: có tự Play được không (props không có cờ play, có vẻ Play là thao tác trong view).
- Engine cố định bàn 9ft (`PoolTableGeometry.swift:3`). Toạ độ drill lưu theo tỉ lệ 0–1, nên vị trí theo diamond giữ được trên bàn nhỏ hơn (INFERRED). Zone r 4" trên 9ft sẽ còn khoảng 3,1" trên bàn 7ft.
- Ladder Stop dùng luật 2-down-1-up, tỉ lệ vào hội tụ quanh 71% (`src/pool-engine/workout.ts:63`), mức từ 1 đến 3 diamond.

## Nguồn: ai đã đọc

**Em tự đọc lại (fetch hoặc curl):**
- Apple HIG Onboarding (bản JSON). Có "fast, fun, and optional", có quy tắc skip rồi tìm lại trong help/settings, có quy tắc xin quyền đúng lúc. **Lệch:** agent viết HIG nói dạy nhiều làm giảm retention, nhưng HIG chỉ nói người dùng ngợp và dễ quên.
- https://irrationallabs.com/case-studies/headspace-doubled-course-starts/ : 31%→63%, app opens +7,5%, ngày mở app +4%, ngày thiền không khác biệt. Khớp cả.
- https://raw.studio/blog/how-headspace-designs-for-mindfulness/ (05/2021): mất 38%, tăng tương đối 10% engagement tuần 2.
- https://uxdesign.cc/how-ladder-onboards-and-keeps-users-engaged-5716dd1c9f3e : một quyết định chọn goal, paywall sau Welcome Workout. **Lệch:** agent ghi buổi đó dài 30 phút và ngắn hơn buổi thường, nhưng bài không nói vậy.
- https://playingpool.substack.com/p/cueist-a-review : test khoảng 30 phút, "humbling", gần mọi drill 2 bi.
- https://www.homecourt.ai/faq/skills : thang 0–99, tính từ top 3 lượt. **Chưa thấy** câu "điểm không tụt" mà agent dẫn.

**Chỉ agent đọc, em chưa kiểm:** App Store listing của DrillRoom, WPB, Pool Drill Tracker, Bricole, Billiard Shot Studio, Bullseye, Railbird; help center HackMotion; help center 18Birdies; ScreensDesign (DRVN, Fitbod, Strava); RevenueCat SOSA 2025; số Duolingo +20% DAU (Taplytics, chỉ là snippet).

**Không xem ảnh nào.** Tham chiếu hình ảnh (Dribbble, Behance, App Store screenshot) chỉ dựa trên caption và chữ mô tả. Behance trả 403, Lazyweb đòi đăng ký. Không tìm được shot nào kết hợp bàn nhìn từ trên xuống, nền tối và accent vàng.

**Thiếu dữ liệu:** không có nguồn đáng tin nào cho tỉ lệ hoàn thành theo số màn onboarding. Thứ tự màn thật của Cueist, DrillRoom, HomeCourt không được công bố công khai. Cách rẻ nhất là cài Cueist (miễn phí, gần mình nhất) rồi quay màn hình 10 phút đầu.

## Câu hỏi còn mở

1. Đi hướng rẽ nhánh với set baseline thật (5 màn / 3 màn), hay giữ 3 màn cố định như thiết kế v2 cũ và chỉ sửa visual?
2. 10 cú baseline có tính vào streak và ladder Stop không? Ý 6 và 7 phụ thuộc câu này.
3. Buổi đầu có được phép ngắn hơn 120 cú không?
4. Lúc chê v1, "số màn" là quá nhiều hay quá ít?
