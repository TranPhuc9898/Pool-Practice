# Onboarding: giới thiệu app hay hỏi user?

Ngày research: 2026-10-23. Bối cảnh: app luyện pool, Daily Workout 4 khối × 30 = 120 cú, ladder tự xếp level từ cú thật (`ladderOf`).

## Kết luận

Bằng chứng không ủng hộ hướng "onboarding = giới thiệu app". Màn giới thiệu (carousel, feature tour) là dạng có số tệ nhất trong các nguồn tìm được. Kết quả đo được mạnh nhất lại đến từ việc **hỏi user**: Headspace thêm vài câu hỏi về người dùng và tỉ lệ bắt đầu course tăng từ 31,25% lên 62,97%.

Hỏi cũng có giới hạn. Câu hỏi đẩy được hành động đầu tiên, nhưng không giữ được thói quen. Headspace không tăng số ngày thiền.

Khuyến nghị cho app: không làm carousel giới thiệu. Dùng 1 câu hỏi mà câu trả lời đổi thứ user thấy ngay, rồi vào cú đầu tiên như v6.

## Bằng chứng

### 1. Hỏi user: Headspace × Irrational Labs (nguồn mạnh nhất)

Đã đọc trực tiếp case study. Có 5 biến thể, trong đó 4 được nêu tên:

| Biến thể | Làm gì | Kết quả |
|---|---|---|
| Control | Flow cũ | Course start 31,25% |
| Default to basics | Không hỏi, ai cũng vào Basics | Thấp hơn perceived fit 7,6 điểm % (có ý nghĩa thống kê) |
| Perceived fit | Hỏi kinh nghiệm, mục đích, cần giúp gì. **Ai cũng vẫn nhận Basics** | Course start 62,97% |
| Personalized fit | Câu trả lời chọn course thật | Tăng, trang không ghi số |
| Precommitment | Hỏi định thiền lúc nào, ở đâu, thế nào | App opens +7,5%, ngày mở app +4%, không ghi có ý nghĩa thống kê |

Số ngày thiền không khác control ở biến thể nào. Hiệu ứng precommitment tắt sau 2–3 ngày. Tác giả kết luận rằng muốn có thói quen thì phải thiết kế hành vi cho cả sản phẩm, không chỉ phần onboarding. Trang không ghi cỡ mẫu.

Hai điểm rút ra:
- Một câu hỏi về user, kể cả khi câu trả lời không đổi nội dung, đã nhân đôi hành động đầu tiên. Cơ chế là cảm giác "cái này làm cho mình".
- So với "không hỏi, vào thẳng" thì hỏi vẫn thắng 7,6 điểm %. Điểm này chạm thẳng v6 (vào thẳng cú đầu).

### 2. Giới thiệu app: carousel và tour (nguồn yếu, nhưng các nguồn cùng chiều)

- Tour từ 5 bước trở lên bị bỏ ngang 63%. Tính năng được tour giới thiệu chỉ 18% user mới dùng trong 30 ngày, tính năng user tự tìm ra đạt 22%. Số liệu của Pendo, em đọc qua nguồn thứ cấp chứ chưa đọc báo cáo gốc.
- Carousel hướng dẫn có tỉ lệ xem hết dưới 30%. Nguồn blog ghi là của NN/g, em chưa tìm thấy ở NN/g.
- Không tìm được A/B test nào mà màn giới thiệu thắng.

### 3. Làm trước, đăng ký sau: Duolingo

Đẩy màn đăng ký lùi lại để user học thử trước giúp DAU tăng khoảng 20%. Câu "Why are you learning?" nằm trong flow đó, nhưng không nguồn nào tách riêng hiệu ứng của câu hỏi này.

### 4. Quiz dài: Noom

Quiz dài của Noom tối ưu cho chuyển đổi sang trả phí (sunk cost, màn hé lộ plan trước paywall), không phải cho retention. Con số "+10–20% nhờ thanh loading" chưa kiểm được. App này chưa có paywall nên mẫu này không áp dụng.

### 5. App luyện tập thể thao

- DrillZone (golf): có Baseline Tests, cho handicap riêng từng mảng.
- Scratch Club: chấm handicap theo từng bài tập.
- CORE Golf: đánh giá theo từng kỹ năng rồi gợi ý tập gì trước.

Các app này đều đo bằng bài test thật, không hỏi user tự đánh giá. Với app mình, việc xếp level đã có ladder lo, nên không cần câu hỏi để xếp level. Chưa tìm được flow đầu tiên của DrillRoom hay CueTrainer.

## Áp vào app pool

| Hướng | Bằng chứng | Đánh giá |
|---|---|---|
| Carousel giới thiệu app | Tour bị bỏ, không có A/B thắng | Bỏ |
| Quiz xếp level | Thừa, ladder đã tự xếp | Bỏ |
| v6: vào thẳng cú đầu, không hỏi | Duolingo ủng hộ làm trước. Headspace cho thấy "không hỏi" thua "hỏi" 7,6 điểm % | Nền tốt |
| v6 + 1 câu hỏi về user | Headspace perceived fit 31 → 63% | Nên làm |

Câu hỏi đề xuất: *"Cú nào làm anh mất bi nhiều nhất?"* với 4 lựa chọn Stop / Follow / Draw / Chưa biết. Câu trả lời phải đổi một thứ nhìn thấy được, ví dụ gắn nhãn "Your focus" lên khối đó trên Home, hoặc dòng tiêu đề của workout nhắc lại. Thứ tự 120 cú vẫn giữ nguyên.

Lý do không làm kiểu "perceived fit" thuần (hỏi xong không dùng gì): với app nhỏ, user sẽ thấy câu trả lời không có tác dụng gì ngay ở cú thứ hai. Headspace có nhiều course nên khó lộ hơn.

## Bước tiếp theo

1. Thêm 1 màn hỏi vào prototype v6, đặt trước cú đầu tiên, rồi render so sánh.
2. Khi có user thật, đo `% mở workout lần đầu` và `% xong block 1` giữa có câu hỏi và không có câu hỏi. App chưa có analytics nên phải thêm cái này trước.

## Câu hỏi chưa giải

- Headspace không công bố cỡ mẫu. Hiệu ứng 2 lần có thể thấp hơn ở app ngách.
- Chưa có số nào cho app luyện thể thao cụ thể (golf, bida).
- Số của Pendo và NN/g chưa đọc được nguồn gốc.

## Nguồn

- [Irrational Labs: How We Doubled Headspace Course Starts](https://irrationallabs.com/case-studies/headspace-doubled-course-starts/)
- [Taplytics: Duolingo delayed sign-up](https://taplytics.com/blog/duolingo-ab-test-onboarding)
- [First Round: Duolingo A/B testing tenets](https://review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker)
- [SaaS Factor: Why most product tours fail (số Pendo)](https://www.saasfactor.co/blogs/why-most-product-tours-fail-and-how-to-implement-contextual-onboarding)
- [Userpilot: Mobile carousels](https://userpilot.com/blog/mobile-carousels/)
- [PageDuel: A/B testing onboarding](https://pageduel.com/blog/ab-testing-saas-onboarding-flow)
- [RevenueCat: Web-to-app funnel](https://www.revenuecat.com/blog/growth/web-to-app-onboarding-funnel)
- [DrillZone, App Store](https://apps.apple.com/ml/app/drillzone/id6744123253)
- [Scratch Club, App Store](https://apps.apple.com/us/app/-/id1634167850)
- [GolfMagic: CORE Golf](https://www.golfmagic.com/equipment-news/core-golf-first-app-showing-golfers-how-practice-range)
