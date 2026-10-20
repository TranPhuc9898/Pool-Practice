---
title: Pool 9 bi — áp phê, squirt, NPL, BHE/FHE (clip #8, #9)
date: 2026-10-19
type: research-topic
status: xong (batch 2)
sources: transcript ASR clip #8, #9; docs/aiming-physics.md; snippet tìm kiếm của trang Dr. Dave và AzBilliards; code engine; tính toán của em
---

# Áp phê và độ lệch bi cái — kiểm chứng clip #8, #9

## Kết luận

| Clip | Claim | Nhãn | Căn cứ |
|---|---|---|---|
| #8 | NPL là độ dài cầu tay mà ở đó BHE triệt tiêu đúng squirt | VERIFIED | Định nghĩa của Dr. Dave, gần như nguyên ý |
| #8 | Quy trình đo: hai bi làm cổng, đánh thẳng vào lỗ, lực dứt khoát, gần max áp phê | VERIFIED | Khớp quy trình Dr. Dave: "very fast speed", "close to maximum sidespin", hai bi "sentinel" |
| #8 | Chỉ đúng khi cơ song song mặt bàn, hoặc gần và mạnh cho swerve không đáng kể | VERIFIED | Dr. Dave: "level cue", "very fast speed so the CB will not have time to swerve" |
| #8 | Ở đúng NPL thì BHE triệt tiêu squirt với bất kỳ lượng áp phê nào | CONDITIONAL | Squirt gần tuyến tính theo độ lệch đầu cơ, nhưng điểm xoay trôi nhẹ về phía đuôi khi lệch nhiều |
| #8 | Squirt = asin(độ lệch đầu cơ / NPL) | VERIFIED (hình học, xấp xỉ góc nhỏ) | TP B.1 của Dr. Dave dựng cùng hình học, có thêm hiệu chỉnh bán kính đầu cơ |
| #8 | Ngọn giảm bạt tốt hơn thì NPL dài hơn | VERIFIED | Dr. Dave: "An LD shaft has a longer natural pivot length" |
| #8 | Số đo: ngọn 13 mm 21 cm, ngọn ghép VN 27 cm, Revo 11.8 40 cm | APPROXIMATION, NEEDS CALIBRATION | Hai số đầu nằm trong dải 8–14 inch (20–36 cm) Platinum Billiards công bố. Revo 40 cm ở mép dưới dải diễn đàn đo (15–23 inch, 38–58 cm) |
| #8 | Không cần chọn cơ có NPL khớp cầu tay, quen cơ nào chơi cơ đó | VERIFIED | Dr. Dave, BD tháng 10/2026: khớp NPL với cầu tay "not good advice, except maybe for a break cue" |
| #9 | BHE xoay quanh cầu tay, FHE xoay quanh tay sau, cả hai đều tự bù một phần squirt | VERIFIED | Dr. Dave FAQ "How does backhand and front-hand english work?" |
| #9 | Tâm xoay càng gần đầu cơ thì bù càng nhiều | VERIFIED (hình học) | Cùng độ lệch đầu cơ b, góc xoay là asin(b/L), L càng ngắn góc càng lớn |
| #9 | FHE một mình thường bù thiếu: phê thuận ra dày, phê nghịch ra mỏng, nhất là gần và mạnh | VERIFIED | FHE cho "much longer effective pivot length with correspondingly less aim compensation". Chiều dày/mỏng em dựng lại bằng hình học, khớp |
| #9 | Về lý thuyết chỉ cần BHE, cầu tay ngắn cho cú mạnh, dài cho cú nhẹ hoặc xa | VERIFIED | Dr. Dave nêu đúng cách này như phương án thay SAWS: "only BHE with a variable bridge length" |
| #9 | Đổi độ dài cầu tay làm cú đánh kém chính xác, nên giữ cố định | UNVERIFIED | Ý kiến kỹ thuật hợp lý, chưa có nguồn đo |
| #9 | Phần lớn cơ thủ chuyên nghiệp dùng FHE | UNVERIFIED | Không tìm được nguồn |
| #9 | Trộn BHE/FHE theo bảng 3 lực × 3 khoảng cách, cầu tay cố định | VERIFIED (phương pháp) | Đây đúng là SAWS của Dr. Dave: 3 khoảng cách × 3 tốc độ, % BHE/FHE, cầu tay cố định, gần max áp phê. Tuấn không nhắc tên SAWS trong transcript |
| #9 | Bảng số: gần mạnh 90/10 BHE/FHE, xa nhẹ 20/80, trung bình 30/70 | NEEDS CALIBRATION | Số cá nhân. Chiều thay đổi khớp SAWS (ít swerve thì cần nhiều BHE hơn). Bảng ví dụ của Dr. Dave chưa đọc được |

Tóm lại: hai clip này đứng vững. #8 là bản tiếng Việt khá sát của quy trình NPL Dr. Dave. #9 là SAWS của Dr. Dave kèm bảng số tự đo. Mọi con số (NPL, % trộn) là của cơ và bàn của Tuấn, phải tự đo lại.

---

## 1. Nguồn và mức truy cập

- **Clip:** chỉ đọc transcript ASR (T). Chưa xem hình. Transcript có lỗi nhận dạng: "axin" là asin, "Ngọc Mỹ" nhiều khả năng là tên hãng ngọn đọc sai, em giữ là "ngọn 13 mm". "affey/áp phê/HP" đều là áp phê (sidespin).
- **Nguồn ngoài:** máy này không mở được trang nào trực tiếp ở batch 2. WebFetch và curl đều lỗi kết nối (`ECONNREFUSED`, curl exit 7), kể cả drdavepoolinfo.com vốn chạy được ở phiên 2026-10-11. Toàn bộ căn cứ ngoài trong file này lấy từ **snippet** của công cụ tìm kiếm, tức đoạn trích trang gốc mà công cụ trả về. Mức tin thấp hơn đọc trọn trang. Chỗ nào chỉ có snippet diễn đàn thì ghi rõ.

| Nguồn | URL | Lấy được gì |
|---|---|---|
| Dr. Dave FAQ, NPL | https://drdavepoolinfo.com/?p=1997 | Định nghĩa, quy trình đo, LD có NPL dài hơn, cảnh báo "effective pivot length" |
| Dr. Dave FAQ, BHE/FHE | https://drdavepoolinfo.com/?p=2442 | Cơ chế BHE, FHE; FHE cần cơ gần ngang |
| Dr. Dave FAQ, SAWS | https://drdavepoolinfo.com/?p=2437 | 3 × 3 calibration, quy tắc chỉnh |
| SAWS calibration handout | https://billiards.colostate.edu/resource_files/SAWS_calibration.pdf | Qua snippet: +10% BHE khi đánh dưới tâm, +10% FHE khi đánh trên tâm. Bảng ví dụ không có trong snippet |
| Dr. Dave, BD 10/2026 | https://drdavepoolinfo.com/bd_articles/2026/oct26.pdf | Khớp NPL với cầu tay không phải lời khuyên tốt |
| Dr. Dave, TP B.1 | https://billiards.colostate.edu/technical_proofs/new/TP_B-1.pdf | Hình học góc xoay theo độ lệch đầu cơ, độ dài xoay, bán kính đầu cơ |
| Dr. Dave FAQ, published squirt data | https://drdavepoolinfo.com/faq/squirt/published-data/ | Platinum Billiards: NPL 8 inch (squirt cao) tới 14 inch (squirt thấp) |
| AzBilliards, Revo | https://forums.azbilliards.com/goto/post?id=6250590 và các post cùng thread | Revo khoảng 18–19 inch, có cây đo 15–16, có cây 23. **Ý kiến diễn đàn** |
| AzBilliards, Revo deflection test | https://forums.azbilliards.com/goto/post?id=5589049 | Revo 11.8 lệch khoảng 1.7 inch ở cú mạnh max phê, khoảng cách không rõ trong snippet. **Diễn đàn** |

## 2. Kiểm từng claim

### 2.1 Công thức asin của #8

Hình học BHE: ngắm tâm, giữ cầu tay, dời đầu cơ ngang một đoạn b. Cơ quay quanh cầu tay một góc ψ với sinψ = b/L, L là khoảng cách đầu cơ tới cầu tay. Cơ giờ chĩa lệch về phía phê một góc ψ. Squirt đẩy bi cái lệch ngược phía phê một góc ε. Hai cái triệt nhau khi ψ = ε. Vậy L đúng bằng NPL thì **ε = asin(b / NPL)**.

TP B.1 của Dr. Dave dựng cùng giả định "the cue pivot angle exactly cancels the cue squirt angle", có thêm hạng hiệu chỉnh vì điểm chạm nằm trên mặt cong của đầu cơ chứ không trên trục cơ. Với góc 2–4°, asin và atan khác nhau dưới 0.02°. Nhãn **VERIFIED**, kèm hai điều kiện: bỏ qua swerve, và b đo là độ lệch điểm chạm so với tâm bi.

Độ lệch 14 mm Tuấn dùng ứng với khoảng 0.49R (R = 28.6 mm), sát mức max áp phê thường dùng là 0.5R. Khớp.

### 2.2 Số NPL của #8

Quy đổi bằng công thức ở 2.1, b = 14 mm:

| Cơ | NPL | Squirt |
|---|---|---|
| Tuấn, ngọn 13 mm | 21 cm | 3.8° |
| Tuấn, ngọn ghép VN | 27 cm | 3.0° |
| Tuấn, Revo 11.8 | 40 cm | 2.0° |
| Platinum, squirt cao | 8 in (20.3 cm) | 3.9° |
| Platinum, squirt thấp | 14 in (35.6 cm) | 2.3° |
| Diễn đàn, Revo | 15–19 in (38–48 cm) | 2.1–1.7° |
| Diễn đàn, một cây Revo | 23 in (58 cm) | 1.4° |

Ngọn 13 mm và ngọn ghép của Tuấn nằm trong dải Platinum. Revo của Tuấn ở mép dưới dải diễn đàn. Không có số do Predator công bố trong kết quả tìm được.

Một cảnh báo từ Dr. Dave áp vào cách đo: quy trình BD 2007 của ông có bi mục tiêu nên đo ra "effective pivot length", gồm cả throw, dài hơn NPL thật. Quy trình Tuấn dùng chỉ có bi cái đi qua cổng vào lỗ, không có bi mục tiêu, nên không dính throw. Đúng với bản quy trình mới.

### 2.3 Chiều dày/mỏng khi bù thiếu ở #9

Em dựng lại: cắt sang trái, bi cái chạm phía phải bi mục tiêu. Phê thuận lúc này là phê phải. Squirt đẩy bi cái sang trái, tức về phía tâm bi mục tiêu, nên chạm dày hơn. Phê nghịch (phê trái) đẩy bi cái sang phải, chạm mỏng hơn. Khớp lời Tuấn. Bù thiếu (FHE) thì còn dư squirt, ra đúng chiều Tuấn nói.

"Nhất là với lực lớn và khoảng cách gần" cũng đúng hướng: cú gần và mạnh ít swerve, nên squirt không được swerve trả bớt. Dr. Dave nói BHE hợp nhất với cú nhanh hoặc ngắn vì lý do này.

### 2.4 SAWS và bảng của #9

Snippet của trang SAWS mô tả: hiệu chỉnh trên 3 khoảng cách × 3 tốc độ, ghi % BHE/FHE cho từng ô, đầu cơ trên đường ngang qua tâm, cầu tay cố định, gần max áp phê. Quy tắc chỉnh: phê phải mà bi cái đi sang trái thì tăng BHE, đi sang phải thì tăng FHE. Bổ sung: đánh dưới tâm thì +10% BHE vì swerve đến trễ, đánh trên tâm thì +10% FHE vì swerve đến sớm. Nỉ và độ nâng cơ cũng làm đổi số.

Quy trình Tuấn mô tả trùng gần hết, trừ hai bổ sung cao/thấp tâm và nỉ. Số của Tuấn (gần mạnh 90% BHE, xa nhẹ 20% BHE) đúng chiều SAWS: cú càng ít swerve thì càng cần nhiều BHE. Bảng số ví dụ của Dr. Dave em chưa đọc được nên chưa so được độ lớn.

### 2.5 Phần chưa kiểm

- Swerve không được mô hình hoá ở đây. Nó là lý do SAWS cần bảng 3 × 3, và là lý do NPL chỉ đo được ở cú mạnh.
- Throw do áp phê (inside/outside) đã có trong `docs/aiming-physics.md` (bảng TP A.14). Không làm lại.
- Clip phụ "Càng mỏng càng phê" chưa có transcript trong dữ liệu phiên trước, và lần này không mở được TikTok. Vẫn chưa đọc.

## 3. Liên hệ engine (chỉ đề xuất, chưa làm)

Em đọc code, không chạy.

1. **Engine có hai mô hình squirt khác nhau.**
   - `ShotPhysics.swift:21` và `:482`: tuyến tính, 2.5° ở 0.5R, kẹp ở 1.1 lần.
   - `RackSim.swift:104`: công thức dạng TP A.31 của Dr. Dave, atan(2.5a·√(1−a²) / (1 + m + 2.5a²)) với tỉ lệ khối lượng m = `squirtRatio` = 25. Ra 0.55° ở 0.1R, 1.56° ở 0.3R, 2.33° ở 0.5R.
   - Hai mô hình lệch nhau 0.17° ở 0.5R. Nhỏ, nhưng một drill dùng `ShotPhysics` để vẽ hướng ngắm và `RackSim` để chạy bàn sẽ cho hai đáp án khác nhau. Đáng thống nhất về một mô hình. Đưa vào file 14.
2. **2.5° ứng với NPL khoảng 33 cm** (13 inch), tức cơ squirt trung bình thấp theo dải Platinum. Hợp lý làm mặc định.
3. **Số 1.2° cho cơ low-deflection trong `docs/aiming-physics.md` có vẻ quá thấp.** Ở 0.5R, 1.2° ứng với NPL khoảng 68 cm (27 inch), dài hơn mọi số đo Revo tìm được (38–58 cm, tức 1.4–2.1°). Tỉ lệ khối lượng tương ứng trong `RackSim` là 50, so với 25 hiện tại. Đề xuất đổi mặc định LD về khoảng 1.7° (NPL 48 cm, m ≈ 35). Đây là suy luận từ số diễn đàn, nhãn **NEEDS CALIBRATION**. Repo chưa thấy dùng giá trị 1.2° trong code, chỉ có trong tài liệu.
4. **Cho người chơi nhập NPL thay vì chọn loại ngọn.** NPL đo được bằng đúng bài của #8, trong 10 phút, bằng hai viên bi. Từ NPL suy ra squirt bằng công thức 2.1. Đây là cách duy nhất đưa squirt của cơ thật vào app mà không đoán.
5. **Swerve:** comment ở `ShotPhysics.swift:476–477` nói nâng cơ (`theta`) thì đường bi cái cong. Em chưa kiểm độ lớn. Với `theta = 0` thì không có swerve, đúng với lý thuyết cơ ngang.

## 4. Drill liên quan

### Drill đáng viết spec ở batch 5

- **Đo NPL (từ #8):** bi cái cách lỗ 2 diamond, hai bi làm cổng vừa lọt bi cái. Ngắm tâm, BHE gần max phê, đánh mạnh. Bi cái chạm bi cổng phía ngược phê thì cầu tay đang ngắn quá, dời dài ra. Chạm phía cùng phê thì dời ngắn lại. Lặp tới khi qua cổng cả phê trái lẫn phải. App ghi NPL, quy ra squirt.
- **SAWS 3 × 3 (từ #9):** 3 khoảng cách × 3 lực, mỗi ô vài cú, tìm % BHE/FHE cho bi cái đi thẳng vào lỗ. App lưu bảng của người chơi. Không có đáp án đúng chung.
- **Kiểm chiều bù thiếu:** cắt nửa bi vào lỗ góc với FHE thuần, phê thuận rồi phê nghịch, ghi dày/mỏng. Người chơi tự thấy hiệu ứng ở 2.3.

### Drill có sẵn trong repo

Batch này chưa đọc lại danh sách drill trong code. `docs/aiming-physics.md` liệt kê 20 drill Aim Lab, phần squirt/throw nằm ở đó. Đối chiếu chi tiết để batch 5.

## 5. Thông số NEEDS CALIBRATION

| Thông số | Vì sao cần đo | Đo bằng gì |
|---|---|---|
| NPL của cơ người chơi | Quyết định squirt | Drill đo NPL ở mục 4 |
| % BHE/FHE theo lực và khoảng cách | Phụ thuộc cơ, nỉ, độ nâng cơ | Drill SAWS 3 × 3 |
| Squirt mặc định cho cơ LD | Số 1.2° hiện tại có vẻ thấp | Đo vài cây Revo hoặc tương đương bằng bài NPL |
