---
title: Pool 9 bi — break, luật xếp và break box (clip #1, #2)
date: 2026-10-19
type: research-topic
status: xong (batch 3)
sources: transcript ASR clip #1, #2; docs/research/nguon/2026-10-11-nguon-bank-kick-safety-break.md; snippet tìm kiếm của Dr. Dave, Jewett, AzBilliards, Wikipedia; code engine; tính toán của em
---

# Break 9 bi — kiểm chứng clip #1, #2

## Kết luận

| Clip | Claim | Nhãn | Căn cứ |
|---|---|---|---|
| #1 | Khi xếp bi 9 trên spot và break trong box, mục tiêu chính là đưa bi 1 vào lỗ giữa | VERIFIED / CONDITIONAL | BD 1/2021: bi 9 trên spot sinh ra để chặn cut break đưa bi 1 vào quá dễ; vẫn vào được bi 1 ở lỗ giữa nếu đủ độ cắt, nhưng khó đạt luật 3 bi. Chỉ đúng với luật giải đó |
| #1 | Điểm ngắm "mỏng hơn nửa bi một sợi tóc"; dày quá bi 1 lạc xuống dưới lỗ giữa, mỏng quá lệch lên trên | NEEDS CALIBRATION | Chiều thay đổi hợp lý. Độ dày cụ thể phụ thuộc bàn, lực, vị trí trong box |
| #1 | Đặt bi cái: mép ngoài sát vạch box hoặc mép trong sát điểm giữa bàn; gần giữa thì bi cánh về góc, gần mép thì bi cánh đi cao nhưng biên sai số rộng hơn | NEEDS CALIBRATION | Không có nguồn đo. Là kinh nghiệm trên bàn của Tuấn |
| #1 | Gần mép box đánh dày, ít trô; gần giữa đánh mỏng, nhiều trô | APPROXIMATION | Nhất quán với hình học: vị trí càng xa tâm thì góc cắt vào bi 1 càng nhỏ |
| #1 | Xu hướng từng bi khi xếp cố định: bi 7 gần đứng yên, bi 4 một băng lên trên, bi 5 mạnh và khó đoán, bi 3 xuống một băng rồi nảy lên | UNVERIFIED | Quan sát cá nhân trên một bàn, một cách xếp |
| #1 | Ưu tiên là đánh trúng, ổn định; chỉnh theo bi 2 là nâng cao | VERIFIED | BU Part X: hit square là quan trọng nhất |
| #2 | Xếp khít, bi 1 trên spot thì bi cánh gần như chắc vào lỗ góc | CONDITIONAL | Diễn đàn: "wing ball wired" khi rack khít. Không có nguồn đo |
| #2 | Đánh gần thẳng, nửa đầu cơ trô: bi cái bật lại một băng ngắn, chỉ cần xoáy nhẹ; cu lê thì bật lại chậm, giữ giữa bàn | VERIFIED | BU Part X và Dr. Dave FAQ: muốn bi cái đứng giữa bàn thì còn chút topspin lúc tới bi 1; bi cái dội lại rồi đứng nhờ topspin |
| #2 | Lý do: khối lượng hiệu dụng của rack lớn hơn bi cái rất nhiều | DISPUTED | Hướng đúng (rack hiệu dụng nặng hơn bi cái nên bi cái bật lại), độ lớn chưa thống nhất: TP B.20 cho ⅔ khối lượng bi, diễn đàn đo khoảng 2× |
| #2 | Ép một băng: ngắm 2/3 bi 1, đầu cơ 6 giờ cách tâm một đầu cơ, lực trên trung bình | NEEDS CALIBRATION | Số cá nhân |
| #2 | Nỉ mới, băng tưng thì phá thẳng phải mạnh hơn; bi 2 và bi 4 vào cao hơn | UNVERIFIED | Không có nguồn |

Tóm lại: hai clip dạy break theo hai luật xếp khác nhau. #1 khớp mạnh với BD 1/2021 về break khi bi 9 trên spot. #2 đúng về cơ chế bi cái bật lại, nhưng con số "khối lượng hiệu dụng lớn hơn rất nhiều" không có căn cứ chắc. Mọi điểm ngắm, độ lệch đầu cơ và xu hướng bi là của bàn Tuấn, phải tự đo lại. "Xếp cao" và "xếp thấp" không có định nghĩa công khai; em suy ra nghĩa ở mục 2.2 nhưng chưa xác nhận.

---

## 1. Nguồn và mức truy cập

- **Clip #1 (7508379566549880072) và #2 (7507230509085347090): T.** Chỉ đọc transcript ASR, chưa xem hình. Lỗi ASR đáng chú ý ở #1: "12 đầu cơ trô" nhiều khả năng là "1/2 đầu cơ trô" (bản tóm tắt batch 1 hiểu nhầm là 12 giờ), "wreck random" là "rack random".
- **Nguồn ngoài:** như file 08, không fetch được trang nào. Căn cứ là snippet tìm kiếm và các tóm tắt đã kiểm ở phiên 2026-10-11 trong file nguồn của repo. Các bài AzBilliards là **ý kiến diễn đàn**, chỉ dùng để biết luật từng giải, không dùng làm số vật lý.

| Nguồn | URL | Dùng cho |
|---|---|---|
| Dr. Dave, BD 1/2021 | https://billiards.colostate.edu/bd_articles/2021/jan21.pdf | Vì sao đặt bi 9 trên spot; cut break; bi 1 vào lỗ giữa |
| Dr. Dave, TP B.20 | https://billiards.colostate.edu/technical_proofs/new/TP_B-20.pdf | Khối lượng hiệu dụng rack ⅔ (chỉ snippet, chưa mở PDF) |
| BU Part X (BD 5/2014) | https://drdavepoolinfo.com/bd_articles/2014/may14.pdf | Hit square; topspin để bi cái đứng; side break; số liệu US Open 2013 |
| Dr. Dave FAQ, break advice | https://drdavepoolinfo.com/faq/break/advice/ | Bi cái dội về giữa bàn; tốc độ 18–24 mph |
| Jewett, "Killing Me Softly?" (BD 2/2008) | http://www.sfbilliards.com/articles/2008.pdf | Break box Mosconi 2007, luật 3 bi qua head string |
| Rules summary (CSU) | https://billiards.colostate.edu/resource_files/rules_summary.pdf | Cách xếp 9 bi |
| Wikipedia, Nine-ball | https://en.wikipedia.org/wiki/Nine-ball | Giải nào đặt bi 9 trên spot |
| AzBilliards, "Racking and Breaking Variations in 9-Ball" | https://forums.azbilliards.com/goto/post?id=5654444 | Các biến thể xếp và break |
| AzBilliards, "n00b questions about 9-ball breaks" | https://forums.azbilliards.com/goto/post?id=3950540 | Bi cánh "wired" khi rack khít |
| AzBilliards, "Rules--US International 9-Ball Open" | https://forums.azbilliards.com/goto/post?id=6138150 | Box 9 in hai bên head spot, luật 3 bi |
| AzBilliards, "Derby City 9 Ball Rules" | https://forums.azbilliards.com/goto/post?id=6557477 | Box 18 in, bi 1 trên spot |
| AzBilliards, "2023 World Pool Championship" | https://forums.azbilliards.com/threads/2023-world-pool-championship-kielce-poland.550776/post-7473214 | Box khoảng 15.89 in, forum tự tính |
| AzBilliards, "Break Speed" | https://forums.azbilliards.com/goto/post?id=5729563 | Rack khoảng 2× bi cái theo đo |
| AzBilliards, "Break tip and cue weight questions answered by Dr. Dave" | https://forums.azbilliards.com/goto/post?id=4926067 | Khối lượng hiệu dụng đổi theo độ vuông của cú chạm |
| File nguồn trong repo | `docs/research/nguon/2026-10-11-nguon-bank-kick-safety-break.md` dòng 272–320 | Nguyên lý break và drill R1–R6 |

Tìm kiếm có trả về một PDF "9 Ball Rules Official 2026" trên upatour.com. Em chưa mở được, nên không dùng.

## 2. Kiểm từng claim

### 2.1 Luật xếp và break box

- **WPA:** xếp thoi chặt nhất có thể, bi 1 ở đỉnh trên foot spot, bi 9 ở giữa, các bi còn lại ngẫu nhiên, không cố ý. Rules summary CSU khớp. Em không tìm được bản luật WPA 2025 chính thức; một nguồn phụ ghi break hợp lệ cần ít nhất 4 bi chạm băng. Chưa kiểm được con số này với bản gốc.
- **Bi 9 trên spot:** Eurotour, Mosconi Cup, World Cup, US Open, China Open dùng (snippet Wikipedia và AzBilliards). Derby City và Joss vẫn để bi 1 trên spot. Lý do theo BD 1/2021 và diễn đàn: chặn break quá mạnh, và vì khi bi 1 trên spot, break cạnh hoặc cut break làm bi 1 hoặc bi cánh vào quá dễ.
- **Break box:** mỗi giải một kích thước. US International 9-Ball Open 9 in hai bên head spot, Derby City 18 in, EPBF nhỏ hơn vùng break thường, World Pool Championship 2023 khoảng 15.89 in theo forum tự tính (không chính thức). Mosconi 2007 dùng box ở nửa giữa kitchen.
- **Luật 3 bi:** US International Open đòi ít nhất 3 bi vào lỗ hoặc chạm head string; Derby đòi 3 bi qua head string, không tính bi đã vào; Mosconi 2007 đòi 3 bi qua head string.

Kết luận cho C4: Tuấn dùng break box và rack ngẫu nhiên, khớp kiểu luật của các giải lớn. Không có "một luật WPA" duy nhất về box; app nên để box và luật 3 bi là tham số.

### 2.2 "Xếp cao" và "xếp thấp"

Tìm kiếm không ra định nghĩa nào bằng tiếng Việt hay tiếng Anh. Suy luận của em, dựa trên nội dung hai clip:

- **Xếp cao** = bi 9 trên spot, cả rack lùi về phía head rail hai hàng. #1 nói bi cánh khó vào vì va chạm, mục tiêu đổi sang bi 1 vào lỗ giữa. Khớp BD 1/2021.
- **Xếp thấp** = bi 1 trên spot. #2 nói xếp khít thì bi cánh gần chắc vào. Khớp "wing ball wired" trên diễn đàn.

Nhãn: UNVERIFIED về thuật ngữ. Cách gỡ rẻ nhất là anh xác nhận, hoặc xem hình một khung rack của mỗi clip.

Tọa độ nếu đúng như trên (bàn 9 ft, foot spot ở 75 in tính từ head rail): khoảng cách hàng là 2.25 · cos 30° = 1.949 in. Bi 9 trên spot thì bi 1 lùi hai hàng, ở khoảng x = 75 − 3.9 = 71.1 in.

### 2.3 Bi 1 vào lỗ giữa ở #1

BD 1/2021 (snippet) nói break từ box là biến thể khó nhất; cut break đưa bi cánh xuống thấp nhưng hay bị bi khác chặn; đủ độ cắt thì vẫn vào bi 1 ở lỗ giữa, nhưng khó đạt luật 3 bi, cắt quá thì dễ scratch. #1 nói gần như đúng chuỗi này, kể cả cảnh báo dày quá hay mỏng quá.

Ghi chú [suy luận]: bi 1 vào lỗ giữa là do bi 1 dội ngược từ rack sau va chạm nhiều vật, không phải đi thẳng theo đường cắt. Vì vậy không dùng được hình học ghost ball để dựng điểm ngắm. Muốn dựng drill có đáp án thì phải mô phỏng rack, xem mục 3.

### 2.4 Bi cái bật lại ở #2 và chuyện khối lượng hiệu dụng

- **Cơ chế bật lại:** BU Part X nói muốn "squat" bi cái ở giữa bàn thì bi cái phải còn chút topspin lúc tới bi 1. Dr. Dave FAQ nói kết quả lý tưởng là bi cái dội về giữa hai lỗ giữa rồi đứng nhờ topspin. Cả hai ngầm nói rằng bi cái đánh stun sẽ bật lại. #2 nói đúng điều này, và đúng cả chuyện cu lê làm bi cái bật lại chậm hơn.
- **Độ lớn:** TP B.20 (snippet) cho khối lượng hiệu dụng của rack là ⅔ khối lượng bi. Một bài trên diễn đàn nói Bob Jewett, Dr. Dave và người viết đo ra rack khoảng 2× bi cái. Dr. Dave trả lời trên diễn đàn rằng khối lượng hiệu dụng đổi theo độ vuông của cú chạm. Hai số mâu thuẫn và em chưa đọc được TP B.20 để biết ⅔ được định nghĩa trong điều kiện nào.
- **Tính của em:** va chạm thẳng, bi cái m, rack hiệu dụng M, hệ số phục hồi e. Bi cái stun bật lại khi M > m/e. Với M = 2m, e ≈ 0.93: vận tốc bi cái sau va chạm (m − eM)/(m + M) · v = (1 − 1.86)/3 · v ≈ −0.29v, tức bật lại khoảng 29% tốc độ. Với M = ⅔m thì bi cái đi tới, không bật lại. Vì #2 quan sát thấy bi cái bật lại khi đánh stun, quan sát này nghiêng về số lớn hơn m, nhưng chưa đủ để nói "lớn hơn rất nhiều".
- Nhãn: cơ chế VERIFIED, lời giải thích "lớn hơn rất nhiều" DISPUTED.

### 2.5 Phần chưa kiểm

- Xu hướng từng bi (#1) và chuyện nỉ mới (#2): cần đo trên bàn, ghi hàng chục cú break. Không có nguồn.
- "Ngắm 2/3", "một đầu cơ", "một sợi tóc": cần xem hình để biết Tuấn đo từ mốc nào.

## 3. Liên hệ engine (chỉ đề xuất, chưa làm)

- `RackSim.swift` mô phỏng va chạm nhiều bi (eBall 0.95, eRail 0.83, Mathavan 2010), hiện chỉ dùng cho Gợi ý. Đây là công cụ đúng để dựng đáp án cho break, vì kết quả break không suy được bằng hình học.
- Đề xuất cho batch 6:
  - Chạy RackSim với rack khít, bi cái stun đánh thẳng, đo vận tốc bật lại của bi cái. Từ đó suy ra khối lượng hiệu dụng mà engine đang ngầm dùng, so với ⅔ và 2×.
  - Quét vị trí bi cái trong box và độ dày vào bi 1, ghi tỉ lệ bi 1 vào lỗ giữa. Nếu engine tái hiện được chiều "dày quá xuống dưới, mỏng quá lên trên" của #1 thì mới đáng làm drill có đáp án.
  - Rack thật không bao giờ khít tuyệt đối. Kết quả break nhạy với khe hở giữa các bi, nên mô phỏng cần thêm nhiễu khe hở trước khi so với bàn thật [suy luận].

## 4. Drill liên quan

### Drill đáng viết spec ở batch 5

- **Bi 1 lỗ giữa từ box:** bi 9 trên spot, box là tham số. Người chơi chọn vị trí trong box và độ dày, ghi bi 1 vào, lạc trên hay lạc dưới. Không chấm theo đáp án hình học; chỉ thống kê để người chơi tự tìm vị trí ổn định.
- **Squat bi cái:** bi 1 trên spot, đánh gần thẳng, ghi bi cái dừng ở đâu so với vùng giữa bàn. Dùng thang tiêu chí (b), (c) của R1.

### Drill có sẵn trong file nguồn

- R1 (BU S10, 5 tiêu chí, zone x 2→6): thang chấm chuẩn cho mọi kiểu break.
- R2 (side break): gần với #2 cách 1.
- R5 (soft break trong box, bi 9 trên spot, luật 3 bi): gần với #1.

## 5. Thông số NEEDS CALIBRATION

| Thông số | Giá trị đang có | Nguồn | Cách đo |
|---|---|---|---|
| Khối lượng hiệu dụng rack | ⅔ m (TP B.20) hoặc 2 m (diễn đàn) | Mục 2.4 | RackSim, hoặc đo tốc độ bật lại bi cái trên bàn bằng video 240 fps |
| Kích thước break box | 9 in mỗi bên, 15.89 in, 18 in tuỳ giải | Mục 2.1 | Không đo, là tham số luật |
| Tốc độ break | 18–24 mph | Dr. Dave FAQ | Video 240 fps theo phiếu đo bàn |
| Độ dày ngắm bi 1 trong box | "Mỏng hơn nửa bi một sợi tóc" | #1 | Drill bi 1 lỗ giữa ở mục 4 |
| Độ lệch đầu cơ khi ép một băng | Một đầu cơ dưới tâm | #2 | Như trên |

## 6. Còn thiếu

- TP B.20 bản đầy đủ: cần để gỡ mâu thuẫn ⅔ và 2×.
- Bản luật WPA hiện hành và kích thước box chính thức.
- Định nghĩa "xếp cao" và "xếp thấp".
- Hình clip #1 và #2: vị trí bi cái trong box, mốc ngắm.
