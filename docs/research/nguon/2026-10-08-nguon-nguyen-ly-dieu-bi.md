---
title: Nguồn — Nguyên lý cốt lõi của position play (đường bi cái, zone, speed, cách học)
date: 2026-10-08
type: research-source
topic: pool position play principles
mode: exhaustive
status: done
---

# Nguyên lý cốt lõi của position play: tầng "vì sao"

Ngày nghiên cứu: 2026-10-08. Mọi nhận định có URL đã mở bằng WebFetch nằm ngay tại chỗ. Chỗ nào chỉ thấy snippet search mà không mở được trang thì ghi **[chưa xác minh — chỉ snippet]**. Chỗ nào em tự tính từ công thức trong nguồn thì ghi **[tự tính]**.

## 0. Giới hạn nguồn — đọc trước

- **Không mở được trong môi trường này:** billiards.colostate.edu và www.engr.colostate.edu (403 trên mọi URL thử: các bản tóm tắt 30°/90°/trisect, các bài Billiards Digest của Dr. Dave, các TP), drdavepoolinfo.com (DNS nội bộ trả 0.0.0.0, ECONNREFUSED), web.archive.org (tool không fetch được), vdoc.pub và ozlabs.org (403, hai bản mirror bài của Shepard), pooldawg.com (403). curl trực tiếp tới sfbilliards.com cũng bị chặn bởi chính sách Cloudflare/Vingroup. Em **không** vượt rào DNS hay proxy.
- **Hệ quả:** nội dung của Dr. Dave lấy qua (a) các post của chính Dr. Dave trên AzBilliards, (b) nguồn vật lý độc lập dùng để kiểm chéo: **Ron Shepard, "Amateur Physics for the Amateur Pool Player", 3rd ed. 1997** và **các cột Billiards Digest của Bob Jewett** (bản PDF trên sfbilliards.com, mở được qua WebFetch rồi trích bằng pdftotext). Hai nguồn này là nguồn gốc, không phải blog tổng hợp.
- Các con số "27° gần 1/4 và 3/4 ball, khoảng 34° gần 1/2 ball" của Dr. Dave em chỉ thấy ở snippet colostate. Tuy vậy công thức của Shepard cho ra đúng dải đó (xem 1.2), nên kết luận vẫn đứng được.
- Không tìm ra nguồn đo được nào cho câu hỏi "bao nhiêu cm bi cái ứng với bao nhiêu cm stroke". Xem 3.4.

---

## 1. Đường đi của bi cái sau va chạm

### 1.1 Stun → tangent line (90° rule)

**Phát biểu.** Bi cái còn **trượt** lúc chạm (không topspin, không backspin) thì tách khỏi object ball đúng theo tangent line, vuông góc với đường tâm–tâm (impact line), với **mọi** cut angle. Chỉ stun mới đi thẳng tuyệt đối trên tangent line.
- Dr. Dave (post của chính ông trên AzBilliards): "For a stun shot, the CB heads along the tangent line. This is the 90-degree rule." https://forums.azbilliards.com/threads/how-do-you-know-where-the-cueball-is-going.217973/post-2831125
- Chứng minh của Bob Jewett ("Pythagoras & Pool Perpendiculars", BD 02/1995): bảo toàn động lượng làm ba vector vận tốc A, B, C khép thành tam giác. Bảo toàn năng lượng cho A² + B² = C². Theo Pythagoras, góc giữa A và B là 90°. http://www.sfbilliards.com/articles/1995.pdf
- Shepard: khi bi cái không có spin quanh trục ngang thì hướng đi ban đầu sau va chạm "is unchanged by the sliding friction of the cloth", nên đường stun là đường thẳng và ít phụ thuộc ma sát bi–bi hơn đường của object ball. http://www.sfbilliards.com/Misc/Shepard_apapp.pdf (Section 4, Exercise 4.1)

**Sai lệch thực tế so với 90°:**
- Throw do outside english mở góc tách ra thêm đúng bằng góc throw, đồng thời tăng tốc bi cái "about 7% for maximum English and a cut shot of about 45 degrees". Inside english làm ngược lại: khép góc và giảm tốc. Bi cái nặng hơn làm góc < 90°. Bi "chết" (kém đàn hồi) cũng làm góc < 90°. — Jewett 1995, http://www.sfbilliards.com/articles/1995.pdf
- Forum: với hệ số đàn hồi ~0.96, góc giảm khoảng 4° ở cú 3/4 ball, quan sát thực tế thường quanh ~86° — **forum opinion**. https://forums.azbilliards.com/threads/tangent-line-conundrum.23577/latest
- Mẹo tay: dùng chữ "L" của bàn tay để thấy tangent line — **[chưa xác minh — chỉ snippet]** (snippet drdavepoolinfo/AzBilliards).

**Drill:**
- *Stun shot carom* (Shepard Exercise 4.1): đặt bi cái cách object ball vài inch, đánh đúng tâm. Đánh dấu tâm bi cái tại điểm va chạm và hai điểm hai bi chạm băng, đo góc tách. Sau đó thêm sidespin để thấy throw làm lệch góc. http://www.sfbilliards.com/Misc/Shepard_apapp.pdf
- *Stop shot progressive* (Jewett, "Second Level", BD 08/2011, Drill 1): object ball sát lỗ, bi cái gần băng. Bi cái phải đè lên vị trí ghost ball, lệch không quá 1 đường kính bi. Thành công thì lùi bi cái nửa diamond, hỏng thì tiến lại. Đặt đồng xu đánh dấu mức đang đứng. Thử hai kỹ thuật: đánh chắc hơi dưới tâm, hoặc đánh nhẹ hơn và thấp hơn hẳn. http://www.sfbilliards.com/articles/2011.pdf
- *Stun shot 4A/5A* trong Progressive Practice Drills của SFBA: bi cái để tự do, object ball cách băng 2 bi, để bi cái dừng trong vòng 9" (một gang tay) quanh mục tiêu 1→7. http://www.sfbilliards.com/Misc/progpract.pdf

### 1.2 Bi cái lăn (natural roll) → 30° rule / half-ball follow angle

**Phát biểu.** Bi cái đã **lăn tròn** lúc chạm thì sau va chạm bị lệch khỏi hướng ban đầu khoảng 30°, và góc này gần như không đổi trên cả dải từ 3/4 ball (cut 14.5°) đến 1/4 ball (cut 48.6°).
- Dr. Dave, bài trình bày Cue Ball Control tại ICI Summit 2026: 30° rule "works well over the full range between a 3/4-ball hit (14.5°) and a 1/4-ball hit (48.6°)". Ông dạy rule này bằng mẹo "Peace Sign" và có phần riêng về ảnh hưởng của speed. Bài trình bày còn có "Reverse Peace Sign" dùng khi có ball-in-hand. https://forums.azbilliards.com/posts/8479901/
- Peace sign: giơ chữ V thả lỏng nhưng chắc, góc giữa hai ngón xấp xỉ 30°. Một ngón chỉ hướng bi cái đi vào object ball, ngón kia chỉ hướng bi cái sẽ đi sau va chạm — **[chưa xác minh — chỉ snippet]** (snippet drdavepoolinfo ?p=1493). Có tên kỹ thuật này trong post ICI ở trên.

**Vật lý (Shepard, Problems 4.13–4.17):** sau khi đạt natural roll, góc lệch θ của bi cái so với hướng ban đầu thoả
`tan θ = sinφ·cosφ / (sin²φ + 2/5)`, với φ là cut angle.
- θ đạt cực đại **33.75°** tại φ = arcsin(1/3) ≈ **28.1°**, tức hơi dày hơn half-ball.
- Lệch cut ±2° quanh điểm cực đại (26° hoặc 30°) thì θ chỉ đổi 0.08–0.11°: "the cue ball deflection angle is much more stable to small deviations than the object ball cut angle."
- Ngay sau va chạm, đường đi là **parabola**. Bi cái đi thẳng chỉ khi đã đạt natural roll.
- Nguồn: http://www.sfbilliards.com/Misc/Shepard_apapp.pdf
- **[tự tính]** từ công thức trên: φ=14.5° → θ≈27.6°; 20° → 31.9°; 30° → 33.7°; 40° → 31.2°; 48.6° → 27.3°; 60° → 20.6°; 70° → 14.1°. Vậy ngoài dải 1/4–3/4 ball, "30°" sai nhanh: cú rất mỏng hoặc rất dày đều cho góc nhỏ hơn nhiều.

**Jewett — lý do half-ball tự sửa sai** ("Half-Ball, Revisited", BD 11/2000): đánh dày hơn half-ball thì góc carom ban đầu đi ngang hơn, nhưng bi cái mất nhiều tốc hơn nên follow kéo về phía trước mạnh hơn. Đánh mỏng hơn thì ngược lại. Hai hiệu ứng triệt nhau, nên quỹ đạo cuối "nearly independent of how full the contact is". Cut angle thực của half-ball "a couple degrees less than 30" do ma sát bi–bi. Bi cái nặng tâm thì follow kém và góc rộng hơn một chút. http://www.sfbilliards.com/articles/2000.pdf

**Chỗ các nguồn lệch nhau về con số (ghi cả hai phía):**
- Jewett 1995: "In theory it will be close to 37 degrees", ổn định khi cut trong khoảng 15–45°. http://www.sfbilliards.com/articles/1995.pdf
- Shepard: cực đại lý thuyết 33.75°. Dr. Dave: 30° là con số thực hành, khoảng 34° gần half-ball (phần 34° chỉ thấy ở snippet).
- Lệch giữa các nguồn khoảng 3–7°. Em đoán do khác giả định (throw, khoảng cách đến khi đạt natural roll, cách đo). Đây là suy đoán, chưa có nguồn giải thích. Về thực hành, ba nguồn cùng chốt một điều: góc này **ổn định** trên dải rộng.
- Forum: Jewett nhắc rằng half-ball với bi lăn "không thật sự ra 30°" — **forum opinion**. https://forums.azbilliards.com/posts/8445802/

**Điều chỉnh khi cần góc khác half-ball** (Jewett 1995): muốn bi cái đi thẳng hơn thì đổi độ dày. Muốn rộng hơn thì thêm chút draw hoặc center (khó kiểm soát). Cách dễ hơn là **đánh mạnh hơn** để bi trượt ra phía tangent một đoạn rồi mới đi song song với đường của cú đánh nhẹ. Sidespin chỉnh thêm được vài độ. http://www.sfbilliards.com/articles/1995.pdf

**Drill:**
- *Half-ball follow carom* (Jewett 1995, Shot 2): đặt bi 1 cách băng dọc 1 bề rộng bi, bi cái cách băng 1.5 bề rộng bi, sao cho bi cái chạy song song băng dọc. Ngắm half-ball (que hướng vào mép bi 1), đánh cao, chỉ đủ lực để tới bi 9 nằm ở vị trí carom. Di chuyển bi 1 tới lui "until the carom seems automatic", ghi lại góc lệch thực tế. Hai lỗi hay gặp nhất: đánh quá mạnh, và dùng draw hoặc center. Biến thể: dời bi 1 thêm 1 diamond, hoặc để bi cái sát băng hơn để luyện cách mở góc bằng speed. http://www.sfbilliards.com/articles/1995.pdf
- *"Reverse pool" half-ball* (Jewett 2000, Diagram 4): bi cái đặt ở foot spot, cầm "object ball in hand" đặt khoảng 4" bên phải head spot. Bắn object ball (có follow) chạm bi cái half-ball bên trái, mục tiêu là "scratch" object ball vào lỗ góc. Trượt sang bên nào thì dời điểm đặt sang bên đó cho tới khi tìm ra "sweet spot". http://www.sfbilliards.com/articles/2000.pdf
- *Edge-aim spot shot* (Jewett 2000, Diagram 3): object ball trên spot, bi cái sau line, đặt sao cho que nằm trên lỗ góc khi ngắm vào mép bi. Drill này luyện half-ball như một điểm ngắm nhìn thấy được. http://www.sfbilliards.com/articles/2000.pdf

### 1.3 Follow góc nhỏ (gần full) — triple-angle follow system

**Phát biểu (Jewett, BD 10/1995):** với cú gần như full, lấy cut angle nhỏ của object ball, nhân 3, ra độ lệch của bi cái. Ví dụ: đường bi cái ban đầu hướng vào điểm cách lỗ nửa diamond trên băng cuối, thì sau va chạm bi cái đi về điểm cách đường ban đầu 1.5 diamond.
- Điều kiện: cut angle nhỏ, bi cái lăn tròn (đánh khoảng 1 tip trên tâm thì lăn ngay), bi cái và object ball cùng khối lượng và sạch.
- Pocket lệch tâm lỗ nửa bi thì bi cái lệch khoảng 1.5 bi ở điểm đến.
- Bi cái nặng (bàn bar) thì dùng hệ số 2.5 hoặc 2 thay vì 3.
- Nguồn: http://www.sfbilliards.com/articles/1995.pdf
- **[tự tính]** từ công thức Shepard: φ = 5° cho θ ≈ 12° (2.4×), φ = 10° cho θ ≈ 21.7° (2.2×). Vật lý thuần cho hệ số khoảng 2.2–2.4, thấp hơn con số 3 của Jewett. Hệ số 3 vẫn dùng được như quy tắc nhẩm, nhưng sẽ hơi đoán dư độ lệch.

### 1.4 Draw — trisect (3-times-the-angle), double-bisect, half-ball draw

- **Trisect / 3× angle (Dr. Dave):** cú draw "good action" (đánh thấp sát miscue limit, đủ tốc để không mất nhiều backspin trên đường tới object ball): hướng cuối của bi cái lệch khỏi đường ngắm ban đầu **3 lần cut angle**. Hệ này "works only for cut angles less than 40°". Nguồn: post ICI https://forums.azbilliards.com/posts/8479901/ và post "How do you know…" https://forums.azbilliards.com/threads/how-do-you-know-where-the-cueball-is-going.217973/post-2831125 (Dr. Dave: "For a good action draw shot, the CB heads in the trisect system direction". Không cần mẹo tay: nhẩm gấp đôi cut angle về phía bên kia impact line.)
- **Double-bisect / "bisector point" (Jewett 1995):** lấy "outside angle" giữa hai đường xuất phát của cú đánh (đường bi cái và đường lỗ), chia đôi, rồi chia đôi lần nữa. Đẩy object ball theo đường gần với hướng thẳng nhất thì bi cái draw về điểm X. Cách ngắm tương đương: ngắm điểm P nằm giữa hai đường chính. Hệ này có từ Daly's Billiard Book, được Hoppe giải thích rõ hơn. Điều kiện: draw rất "lively", bi cái gần object ball, cut không quá rộng. Kéo không đủ thì đánh dày hơn. http://www.sfbilliards.com/articles/1995.pdf
- **Half-ball draw:** với lượng draw điển hình, đường cuối của bi cái **vuông góc với đường que ban đầu**. Jewett gọi đây là hệ khó kiểm soát nhất, nhưng có giá trị làm mốc: cú dày hơn half-ball thì kéo được bi cái về sau đường vuông góc đó. http://www.sfbilliards.com/articles/1995.pdf
- **Vùng xám:** các hệ trên chỉ đúng với full follow hoặc full draw. Góc ở giữa thì "there is no good system for these gray areas. Learn to rely on your feel and use the systems to know where the boundaries are." — Jewett 1995, cùng URL.
- **Draw shot curve:** đường bi cái khi còn trượt là parabola. Hình dạng do vận tốc ban đầu và lực ma sát vải quyết định, không phụ thuộc khối lượng bi. Bi đi thẳng khi đã đạt natural roll. — Shepard Problem 2.3, http://www.sfbilliards.com/Misc/Shepard_apapp.pdf
- Bi cái stop thẳng (V0 = 0 sau va chạm thẳng) mà còn spin ω0 thì spin kéo bi tới vận tốc natural roll `V_NR = (2/7)·R·ω0`. Thời gian `t_NR = 2Rω0/(7μs·g)`, quãng trượt `d_NR = 2(Rω0)²/(49μs·g)`. — Shepard, cùng URL.
- Các hệ "draw distance tối đa ở 70–80% tip offset" và "draw chậm, offset lớn kiểm soát tốt hơn draw nhanh, offset nhỏ" đến từ bài Dr. Dave trên colostate — **[chưa xác minh — chỉ snippet]**. Jewett độc lập nêu cùng ý ở dạng tổng quát hơn, xem 1.5.

**Drill:**
- *Progressive draw* (Jewett, BD 12/1992): object ball sát băng dọc, ngay ngoài miệng lỗ. Bi cái bắt đầu ở vị trí 1 (cách góc 1 diamond), phải kéo về ít nhất tới vị trí xuất phát. Thành công thì lùi 1 diamond. Hỏng (trượt bi hoặc thiếu draw) thì tiến lên nửa diamond. Chơi đủ 15 bi rồi ghi vị trí cuối. Chấm điểm: dừng ở 1–2 là B ("beginner"), 3–5 là A ("average", đủ cho hầu hết tình huống), 6 tới băng cuối là E ("enough"). Vị trí cuối xấp xỉ **điểm 50%** của mình. http://www.sfbilliards.com/Misc/progpract.pdf
- *Draw touch* (Jewett 2011, Drill 3): object ball luôn sát lỗ, bi cái lùi dần. Mục tiêu là kéo bi cái về sát điểm xuất phát nhất có thể, tolerance tự chọn (1 gang tay hoặc 1 diamond). Jewett: "touch with draw is much harder to master than with stop and follow." http://www.sfbilliards.com/articles/2011.pdf
- Các biến thể 1C–5C của SFBA (kéo ít nhất 1 diamond; kéo về đúng điểm xuất phát nhưng không quá 2 diamond; kéo vào ô vuông): http://www.sfbilliards.com/Misc/progpract.pdf

### 1.5 Speed và spin bẻ cong đường đi — tỉ số spin/speed

- **Speed kéo dài đoạn trên tangent:** đánh càng mạnh, bi cái ở trên tangent line càng lâu trước khi cong theo follow hoặc draw. Đây là lý do speed cũng là một công cụ đổi góc (Jewett 1995: "hit the cue ball harder so it slides some to the left before taking a path parallel to the soft shot"). http://www.sfbilliards.com/articles/1995.pdf. Câu phát biểu tổng quát kiểu Dr. Dave ("the harder a shot is hit, the longer the cue ball stays on the tangent-line path") chỉ thấy ở snippet colostate. Post ICI có liệt kê "speed effects" trong phần 30° rule: https://forums.azbilliards.com/posts/8479901/
- **Spin/speed ratio ("quality" của cú đánh)** — Jewett, "More Spin, Less Speed", BD 02/1999: muốn bi cái bẻ góc mạnh (draw hook, hoặc sidespin mở góc khỏi băng) thì cần **nhiều spin trên mỗi đơn vị speed**, không phải nhiều RPM tuyệt đối. Đánh mạnh mà lệch tâm ít thì nhiều RPM nhưng bi vào băng nhanh, bật ra gần như thẳng. Cần dời tip ra xa tâm nhất có thể mà chưa miscue, và "shoot just hard enough". Đánh cao hơn tâm **11.43 mm** thì bi lăn tròn ngay từ đầu (spin/speed ratio = 1). Thí nghiệm "Jacksonville Project" (Shamos, Buss, de Jager, Harris, Jewett; high-speed video) cho thấy với 19 mm offset sidespin, tỉ số > 1. Jewett trích thí nghiệm của Byrne kết luận follow "can't exceed smooth rolling by much". http://www.sfbilliards.com/articles/1999.pdf
  - **[tự tính]** 11.43 mm = 2/5 bán kính bi 57.15 mm (R = 28.575 mm), khớp với điều kiện natural roll `b = 2R/5` trong Shepard Problem 3.5.
- **Drag shot:** bi cái đi nhanh lúc đầu rồi chạm object ball ở khoảng 3/7 vận tốc đầu. Vận tốc trung bình khoảng 5/7, nên ảnh hưởng của bàn không phẳng giảm khoảng 29%. Hữu ích khi cần va chạm chậm trên bàn bẩn hoặc nghiêng. — Shepard Exercise 2.1, http://www.sfbilliards.com/Misc/Shepard_apapp.pdf
- **Stun run-through / stun back:** đẩy bi cái tiến hoặc lùi những đoạn nhỏ có kiểm soát quanh vị trí stop. Dr. Dave: "a lower tip and slower speed offers so much more accuracy and control". Forum bổ sung: run-through thường dễ hơn khi đánh nhanh hơn (đánh chậm dễ ăn roll), stun back thì speed tuỳ khoảng cách — **forum opinion** trộn với lời Dr. Dave. https://forums.azbilliards.com/goto/post?id=7192813

### 1.6 Bi cái qua 1, 2, 3 băng

- **Ba biến quyết định góc bật băng:** spin (đặc biệt sidespin), speed lúc vào băng, và góc vào. Draw/follow chủ yếu đổi quỹ đạo *sau* khi rời băng. Đánh mạnh thì góc ra ngắn lại (đi thẳng hơn). Jewett: "There is no good theory of ball/cushion interaction… good enough to predict all the different shots." Cần biết speed, spin, hướng ngay trước khi chạm băng, cộng với tính chất băng và vải — **forum opinion** kèm lời Jewett. https://forums.azbilliards.com/goto/post?id=7645582
- **Running english mở góc bật băng, reverse english khép góc.** https://en.wikipedia.org/wiki/Cue_sports_techniques
- **Mỗi lần chạm thẳng băng mất khoảng 2/3 năng lượng** (bi giữ khoảng 1/3). Hệ số đổi chút theo speed. Vì vậy position nhiều băng rất nhạy với speed. — Jewett, "Measured Force", BD 04/2008. http://www.sfbilliards.com/articles/2008.pdf
- **Nguyên tắc second-rail target:** khi position cần từ 2 băng trở lên, mục tiêu thực là điểm chạm trên **băng thứ hai**, vì chính điểm đó xác định một đường duy nhất. Lập kế hoạch ngược từ băng cuối đi vào. Quy tắc nhẩm: "if the cueball comes into the short rail at a 45 degree angle you are going to pass through the center of the table". Ít topspin thì bi cái bám gần tangent line hơn, ra khỏi băng với góc bớt gắt — **forum opinion**. https://forums.azbilliards.com/goto/post?id=3803615
- **Systems (Diamond, Corner-5, Plus-2) chỉ đúng từ các vị trí chuẩn.** Lệch khỏi vị trí chuẩn thì chúng chỉ còn là mốc tham chiếu. Phải bù spin, độ nảy băng của từng bàn, và speed vải — **forum consensus**. https://forums.azbilliards.com/goto/post?id=4021760
- **Đường bật vuông góc băng là đường an toàn** (không bao giờ scratch dù chạy bao xa) — **[chưa xác minh — chỉ snippet]** (snippet AzBilliards trong lượt search về rail rebound).

**Drill:**
- *Random two-point position* (Jewett "Second Level" 2011, hướng tiếp theo): sau khi xong mọi cách không chạm băng (xem 2.1), thử mọi đường 1 băng: đưa object ball vào từng lỗ trong 6 lỗ và đưa bi cái qua điểm X trên băng 1 tới target. Sau đó thử qua băng 2, rồi 2 và 3 băng. Mục đích: tìm đường dễ nhất và **dải vị trí bi cái** còn làm được. http://www.sfbilliards.com/articles/2011.pdf
- *Calibrate kick system* (Plus System hoặc parallel lines) để đọc được điểm chạm băng 2. "Clock your cue ball": mỗi tip english dời điểm đến bao nhiêu diamond (Eckert: "add 1 tip of english for a diamond") — **forum opinion**. https://forums.azbilliards.com/goto/post?id=3803615

### 1.7 Throw và squirt — chỉ phần ảnh hưởng tới position

- Outside english: throw mở góc tách và bi cái nhanh hơn khoảng 7% (max english, cut khoảng 45°). Inside thì ngược lại (Jewett 1995). Đây là lý do pro dùng inside english để "giết" bi cái và tạo góc mà center ball không làm được — **forum opinion**. http://www.sfbilliards.com/articles/1995.pdf ; https://forums.azbilliards.com/goto/post?id=7794218 (thread pros vs amateurs, theo snippet và trang đã mở)
- Throw nhạy nhất quanh half-ball. Raiford cho rằng ưu điểm của 30° chỉ là "NR carom angle insensitivity", còn chính cú cắt half-ball lại dễ trượt vì throw — **forum opinion**. https://forums.azbilliards.com/goto/post?id=2739563
- Squirt (deflection) đẩy bi cái lệch khỏi hướng ngắm, về phía ngược với bên đặt english. Squirt tăng theo tốc que và lượng english. https://en.wikipedia.org/wiki/Cue_sports_techniques

---

## 2. Position zone, chọn góc, pattern

### 2.1 Zone thay vì một điểm, nhưng ngắm vào một điểm trong zone

- **Phát biểu:** position là một **vùng** (zone) mà từ đó cú tiếp theo vẫn ăn được và vẫn đi tiếp được. Chọn zone rộng nhất, rồi ngắm vào **tâm zone**. Phil Capelle (*Play Your Best Straight Pool*, mục lục Chương 1) có các mục "Enter the Wide Part of a Position Zone", "Know the Boundaries of a Position Zone", "The Correct Angle and Distance Equals Position". https://www.billiardspress.com/toc_pybsp.html
- CJ Wiley: "you want to see an area that has the largest margin of error. Then, I usually cue the ball so it will land in the center of the zone which gives me **7-12 inches short or long** of my desired position" — **forum** (tuyển thủ). https://forums.azbilliards.com/goto/post?id=6818378
- Hai trường phái hoà giải được: Patrick Johnson nói "pick a precise position in that zone and try to hit it… aim small, miss small". Bob Jewett: "Always visualize the correct exact position point", ở mọi trình độ. Phía ngược lại cho rằng exact position là "pipe dream" với người chơi trung bình, vì độ ẩm và vải làm bàn thay đổi — **forum consensus**: zone để chọn, điểm để ngắm. https://forums.azbilliards.com/goto/post?id=6287588 ; https://forums.azbilliards.com/goto/post?id=6287519 ; https://forums.azbilliards.com/goto/post?id=7776267

**Drill:**
- *Random two-point position* (Jewett 2011): chọn ngẫu nhiên một điểm cho object ball và một điểm làm target (vòng giấy có đường kính "challenging, but not impossible"). Tìm cách đưa object ball vào **cả 6 lỗ** mà vẫn tới target, ban đầu không chạm băng. Ví dụ trong bài: lỗ A và F cần draw với góc nhỏ, B–E cần follow. Mỗi cặp điểm có thể tập cả tiếng. Cặp nào bí thì ghi lại để hỏi người giỏi hơn. Jewett: "one of the best position drills available". http://www.sfbilliards.com/articles/2011.pdf
- *Target zone bằng thẻ 3x5 hoặc vòng giấy:* đặt target bất kỳ, chọn cú, cố dừng bi cái gần tâm nhất — **forum**. Có thêm "Target Pool" (Don Wilke, Kim Davenport phổ biến) — **[chưa xác minh — chỉ snippet]**.

### 2.2 Đi vào zone theo chiều dọc ("come into the line, don't cross it")

- **Phát biểu:** zone tốt cho cú tiếp theo thường dài và hẹp, chạy dọc theo đường bắn của bi kế tiếp. Bi cái đi **song song** đường đó thì sai speed chỉ thành dài hoặc ngắn. Đi **cắt ngang** thì sai speed thành lệch góc hoặc bị hook.
- Clusterbuster: "If the cue is rolling more or less parallel to that line, you may have a margin of error of **half the length of the table or more**. If you're moving across the zone, you may only have a margin of error of **a few inches**" — **forum opinion**, nhưng được nhiều người đồng ý trong thread. https://forums.azbilliards.com/goto/post?id=6259393
- Cùng ý từ nhiều poster: "Come into your pocket line, rather than cross it", "Use the rails to come into your position line" (heismii) https://forums.azbilliards.com/goto/post?id=6287588 ; "coming into the shape zone on an angle instead of directly across" (thread "Next Level") https://forums.azbilliards.com/goto/post?id=3193113
- Lưu ý ngược: càng cố đến sát bi kế tiếp thì dải dừng càng hẹp — **forum**, [snippet thread "blew this one too"].

### 2.3 Đúng bên của bi kế tiếp, giữ góc, vì sao góc nhỏ hơn straight-in

- **Phát biểu:** dừng bi cái ở **đúng bên** của đường bắn bi kế tiếp, tức bên cho góc tự nhiên đưa bi cái về phía bi sau nữa. Giữ **một góc**, tránh straight-in. Lý do cơ học suy ra từ mục 1: với straight-in, bi cái chỉ đi được trên một đường (stop, follow thẳng, draw thẳng), không có thành phần ngang. Có góc thì 90° rule và 30° rule cho bi cái thành phần ngang mà không cần nhiều speed.
  - Điều "straight-in chỉ cho một trục" khớp với ThePoolCoach: stun chỉ "đi thẳng trên góc thẳng", có góc thì bi trôi ngược phía góc cắt. https://thepoolcoach.co.uk/2019/10/18/cue-ball-control/amp/ . Phần suy luận nối vào 30°/90° là của em.
- Danh sách của Clusterbuster: "Be cognizant of stopping the cue ball on the right side of the line"; "Keep an angle, generally avoid leaving yourself with straight in shots"; "When you have a choice between… target zones, default to the larger"; "Leaving yourself with a thin cut probably means you'll be letting go of the cue ball" — **forum opinion**. https://forums.azbilliards.com/goto/post?id=6259409
- Capelle: "Play to the Long Side Whenever Possible". https://www.billiardspress.com/toc_pybsp.html
- Huấn luyện viên trong thread "Next Level" phàn nàn học trò "get 'straight' way too often", làm runout bị "handcuffed". Mẹo: trước khi đánh, nhìn lần cuối vào **điểm muốn bi cái tới**, không nhìn bi kế tiếp — **forum opinion**. https://forums.azbilliards.com/goto/post?id=3193113
- **Góc nào là tốt nhất?** Ở 9-ball, half-ball (khoảng 30°) là "common wisdom": side spin nào cũng hoạt động tốt, góc carom lại ổn định (Jewett trong thread). Snooker thường thích cú dày hơn (3/4 ball). Câu trả lời còn tuỳ game và cỡ bàn — **forum**. https://forums.azbilliards.com/goto/post?id=2739563
- Pro chấp nhận cú khó hơn để có đường tự nhiên tốt hơn, còn amateur cố để straight-in rồi ép bi cái — **forum opinion**, [snippet thread 7794218].

### 2.4 Tối thiểu hoá quãng đi của bi cái — position ngắn

- Jewett: "Minimize cue ball movement" — **forum** (Jewett là staff). https://forums.azbilliards.com/goto/post?id=6259409
- Jewett ("Get to the Point", BD 01/2007) phân biệt hai lối position. Lối *dài* chỉ cần có cú, không bị hook (ông lấy Earl Strickland làm ví dụ). Lối *ngắn* giữ bi cái **dưới khoảng 18 inch** tới bi kế tiếp, nên mỗi cú vừa dễ ăn vừa dễ đi tiếp. Ví dụ là Paul Silva, người "made 9-ball look like straight pool". http://www.sfbilliards.com/articles/2007.pdf
- Capelle: "Keep the Cue Ball Away from the Rails and Other Balls", "Holding Up the Cue Ball". https://www.billiardspress.com/toc_pybsp.html

**Drill — "Get to the Point"** (Jewett 2007, Diagram 1): bi cái và object ball luôn trả về hai điểm đánh dấu (dán "donut" giấy hoặc phấn). Object ball thứ hai đặt gần. Mỗi cú phải ăn bi thứ nhất và **chạm nhẹ** bi thứ hai, bi cái dừng trong **1 đường kính bi** quanh bi thứ hai. Để bi thứ hai ở chỗ vừa bị chạm. Khi nó trôi qua vạch thì làm lại. Mục tiêu: ít nhất 5 cú tốt trước khi chạm vạch. Diagram 2 là biến thể dùng băng: object ball cách băng dọc 1 diamond. http://www.sfbilliards.com/articles/2007.pdf

### 2.5 Pattern play — luật tổng quát

- Danh sách Clusterbuster: (1) plan ít nhất 3 bi trước; (2) phá cluster và dời bi khó **sớm**; (3) dọn bàn theo vùng (thirds hoặc halves); (4) dọn **giữa bàn trước** để mở zone lớn cho các bi còn lại (KMRUNOUT giải thích); (5)–(9) như ở 2.2–2.3. Patrick Johnson: tối thiểu quãng đi thường có nghĩa là lấy bi giữa bàn theo thứ tự bi cái di chuyển hiệu quả nhất. Cornerman: đừng dùng lỗ giữa làm key-ball pocket trong 8-ball — **forum opinion**. https://forums.azbilliards.com/goto/post?id=6259409
- 8-ball: chơi "ball to ball position" thay vì zone rộng, tránh đâm vào cụm khi chưa cần, dùng key ball để chuyển nhóm, plan ngược từ bi 8, giữ các cú gọn. Tài liệu pattern được khuyên: Tor Lowry *The Big Book of Pattern Puzzles*, George Fels (*Mastering Pool*, *How Would You Play This*, *A Smarter Way to Play Pool*), Jim Rempe *How to Run a Rack in Straight Pool* — **forum**. https://forums.azbilliards.com/goto/post?id=7301313
- Câu Dr. Dave "think at least three balls ahead and identify key balls…" trong FAQ 8-ball — **[chưa xác minh — chỉ snippet]** drdavepoolinfo ?p=2528.

### 2.6 Plan ngược từ bi cuối vs "3-ball thinking"

- **Plan ngược:** trong 9-ball, đứng ở bi 3 thì nhìn bi 5 xem cần đứng đâu để ăn nó, từ đó chọn góc trên bi 4 cho dễ tới đó, rồi chọn cách đánh bi 3 để có góc ấy trên bi 4 — **forum**, [snippet]. Thread "3 ahead or Backwards from the 9?": poster gán cho Buddy Hall cách plan 3 bi trước và cho Johnny Archer cách map ngược cả bàn (đây là lời gán của forum, chưa kiểm). Kết luận chung của thread: "They are the same thing one is longer than the other". Nên nhìn cả bàn để tìm vùng có vấn đề, plan 3–5 bi, rồi mở rộng dần — **forum consensus**. https://forums.azbilliards.com/goto/post?id=3474432
- Phản biện: thread "'Think three balls ahead' is horrible advice" (CJ Wiley cùng ShootingArts, Mikjary) bàn về cách tiếp cận theo zone và cơ hội thay vì kịch bản cứng. Em chỉ mở được trang 5/6 nên **không chốt được lập luận đầy đủ**. https://forums.azbilliards.com/goto/post?id=4784890

### 2.7 Straight pool: break ball, key ball, insurance, setup, cluster buster

- **Break ball:** "the last object ball left on a table before the remaining fourteen balls must be racked so the player… may continue". https://en.wikipedia.org/wiki/Glossary_of_cue_sports_terms
- **Key ball:** bi dùng để có position tốt lên break ball. Key ball lý tưởng cho phép làm việc đơn giản như stop shot để có shape. **Setup ball:** bi trung gian để có góc lên key ball. **Cluster buster:** bi trong cụm vừa có lỗ vừa phá được cụm. **Insurance ball:** bi an toàn để dành, bắn sau khi phá cụm, để không bị kẹt khi đâm vào pack. Nguyên tắc: các cú phá phụ phải đẩy bi **ra xa** break ball; "You achieve more by moving the balls less" — **forum** (Blackjack, "a class on clusters"). https://forums.azbilliards.com/threads/a-class-on-clusters.91623
- Capelle có các mục "Key Ball in the Rack", "Characteristics of the Ideal Key Ball", "Play the Table – Don't Force the Issue", "Let the Shot Determine the Pattern". https://www.billiardspress.com/toc_pybsp.html

---

## 3. Speed control

### 3.1 Vật lý: quãng đi tỉ lệ với v², băng ăn 2/3 năng lượng

- Quãng bi đi trên vải **tỉ lệ với năng lượng**, tức với **bình phương vận tốc** (E = ½mv²). Mỗi lần chạm thẳng băng mất khoảng 2/3 năng lượng. Hệ quả: vận tốc tăng gấp đôi thì quãng đi tăng khoảng 4 lần. Ví dụ của Jewett: bắn dọc bàn gần break speed, bi chạm băng xa 3 lần và đi tổng cộng 5 chiều dài bàn, tương đương 1,000 diamond năng lượng nếu bàn dài vô hạn (1 diamond = 12.5" trên bàn 9 ft). — Jewett "Measured Force", BD 04/2008, http://www.sfbilliards.com/articles/2008.pdf
- **Thang speed 10 cấp của Jewett** (mỗi cấp gấp 3 năng lượng, đúng bằng tỉ lệ mất ở một lần chạm băng):

| Cấp | Quãng lý thuyết (không băng) | Quãng thực tế trên bàn | Speed, MPH |
|---|---|---|---|
| 1 | 1/3 inch | như lý thuyết | 0.1 |
| 2 | 1 inch | như lý thuyết | 0.17 |
| 3 | 3 inch | như lý thuyết | 0.32 |
| 4 | 1 diamond | như lý thuyết | 0.55 |
| 5 | 3 diamond | như lý thuyết | 1 |
| 6 | 9 diamond | hơn 1 chiều dài | 1.7 |
| 7 | 31 diamond | 2 chiều dài | 3.2 |
| 8 | 100 diamond | 3 chiều dài | 5.5 |
| 9 | 310 diamond | 4 chiều dài | 10 |
| 10 | 1000 diamond | 5 chiều dài | 17 |

  (Cột MPH ghép từ bảng bị vỡ layout khi trích PDF. Thứ tự tăng dần và tỉ lệ khoảng √3 giữa hai cấp liền nhau khớp vật lý **[tự tính]**. Break shot khoảng 20 MPH với người chơi giỏi.)
- Jewett: "Most players seem to struggle with any shot outside of just **6, 7 and 8**." Người mới hay luyện break mà ít luyện cú mềm, nên bí với mọi cú dưới 1 MPH. http://www.sfbilliards.com/articles/2008.pdf
- Thang của Capelle ("Spectrum of Speeds" 1–9) và thang Speed 1–7 mà đề nhắc tới đều không mở được hoặc không tìm thấy. Xem ghi chú ở note anh em 2026-10-08-nguon-coaches-books.md.
- PAT (Player Ability Test, châu Âu) xếp lag vào "Speed 2" — **[chưa xác minh — chỉ snippet]** (lời Jewett trên AzBilliards).

### 3.2 Drill speed

- *High-end drill* (Jewett 2008): bắn bi cái thẳng dọc bàn **5 chiều dài**, dừng trong vòng 1 diamond tính từ băng xa và 1 diamond quanh tâm bàn. Băng bàn ăn nhiều hơn 2/3 năng lượng thì lùi về 4 chiều dài, **không** dùng cú nảy bay. http://www.sfbilliards.com/articles/2008.pdf
- *Speed 1–4 theo chiều dài bàn* ("Playing Pool – The Missing Manual", Free Drills v1.0, 19.12.2014): speed 1 chạy 1 chiều dài và dừng sát foot rail, speed 2 chạy 2 chiều dài về head rail, speed 3 và 4 chạy 3 và 4 lần. Tập cả cấp lẻ như 2.5. Drill "Straightness" kết hợp: bi cái phải lọt qua khe 2 bề rộng bi ở speed 2, rồi 3–4 lần qua khe ở speed 3–4. https://www.playing-pool.com/wp-content/uploads/2014/12/141912_free_drills.pdf
- *Ladder cue-stick drill* (Jewett, thuật lại trong forum): xếp khoảng 10 object ball dọc head string. Đánh trực tiếp từng bi bằng que về phía foot rail, bi đầu thật nhẹ, mỗi bi sau đi **vừa quá** bi trước. Đếm được bao nhiêu bi trước khi có bi chạm băng xa. Kết quả là một đường chéo các bi. — **forum** thuật lời Jewett. https://forums.azbilliards.com/goto/post?id=6371549
- *Soft-touch* (Jewett, cùng thread): bi rải ngoài kitchen. Bi cái chỉ được "just touch" một bi và dừng trong một nắm tay, một gang, hoặc một bi. Drill này cũng kiểm tra luôn độ phẳng của bàn. https://forums.azbilliards.com/goto/post?id=6371549
- *16-ball line* (Meucciplayer): 16 bi trên vạch diamond thứ nhất. Mỗi bi phải dừng trong 2 diamond cuối đầu bên kia, không chạm bi khác, sau khi bật băng không vượt diamond thứ hai. Biến thể đảo (heater451): bi đầu đi dài, các bi sau ngắn dần — **forum**. https://forums.azbilliards.com/goto/post?id=6371549
- *Stop/follow/draw progressive* (SFBA 1A–5D, Jewett 2011 Drill 1–3): đã mô tả ở 1.1 và 1.4. Đây cũng là drill speed vì tolerance tính bằng inch.
- Forum (pooltchr, instructor): trường dạy đưa học viên một thang đo speed, nhưng 60 giờ (6 tháng × 2–3 giờ mỗi tuần) chưa đủ để có cảm giác speed. Greyghost: tập "pocket speed" (vừa đủ để bi rơi). Cameron Smith: tập lag để lấy mốc rồi bắn phần lớn các cú ở speed đó — **forum opinion**. https://forums.azbilliards.com/threads/speed-control.170070/

### 3.3 Tốc độ vải và bàn

- **Table speed (Shepard):** `table speed = 1/μ_rolling ≈ 2·t²`, với t là số giây bi lăn hết **một chiều dài** bàn 9 ft (từ foot cushion tới vừa chạm head cushion). Ví dụ t = 7.00 s cho table speed ≈ 96.7. Mốc: rất chậm 50–70, bình thường 80–100, nhanh > 120. **Simonis 860 mới lắp cho 100–130.** Cách đo: dựng dốc bằng hai cây cơ, chỉnh để bi bật foot cushion rồi dừng ngay trước head cushion, bấm giờ lấy trung bình nhiều lần. http://www.sfbilliards.com/Misc/Shepard_apapp.pdf (Problem 1.5, Exercise 1.1)
- Ma sát trượt và ma sát lăn là **hai đại lượng độc lập**. Bàn có thể lăn nhanh mà vẫn "ăn" spin khác nhau, nên một bàn có thể cần mức stun khác bàn khác. Shepard: "Sticky tables… slick tables" cần lực khác nhau để đạt stun. Cùng URL, Section 1 và Exercise 2.2.
- **[tự tính]** Theo công thức trên, quãng lăn với cùng vận tốc đầu tỉ lệ với table speed. Đổi từ bàn 80 sang bàn 120 thì cùng cú đánh đi xa hơn khoảng 50%.
- Forum: 760 nhanh hơn 860 vì sợi mảnh hơn ("Takes so little effort to move the cue ball"; 760 mòn "like playing on glass"). Vải mòn và căng ảnh hưởng tới speed nhiều hơn cả loại vải. Độ ẩm làm chậm bàn (760 ở vùng ẩm Texas "plays like 860 dry") — **forum opinion**. https://forums.azbilliards.com/threads/cloth-speed-difference.339056/post-4424481

### 3.4 "Bao nhiêu quãng bi cái cho mỗi độ dài stroke"

**Không tìm thấy nguồn định lượng** nào gắn độ dài backswing hoặc follow-through với quãng đi của bi cái. Những gì có nguồn: quãng tỉ lệ với v² (3.1), và Jewett có cột "Stroke Fiddling" (BD 04/2011) bàn về chiều dài bridge. Em chưa đọc kỹ cột này để rút được con số, nên coi như mục này còn mở.

---

## 4. Người chơi thực sự học position như thế nào

### 4.1 Mô hình 4 tầng của Jewett

"Second Level" (BD 08/2011) chia việc học thành 4 tầng: (1) cơ bản đánh bi cái và ngắm; (2) **kỹ thuật đưa bi cái vào position**; (3) lập chuỗi cú (pattern); (4) kỹ thuật nâng cao. Nhiều người lên tầng 3–4 mà tầng 1 còn yếu: "Their knowledge has outrun their basic ability to execute." Tầng 2 bắt đầu bằng **touch**, tức nối cảm giác lực trên tay với quãng đi của bi cái (Drill 1–3 stop, follow, draw), rồi chuyển sang drill random two-point. http://www.sfbilliards.com/articles/2011.pdf

### 4.2 Progressive practice — cấu trúc deliberate practice có đo

- Jewett, BD 12/1992: thành công thì cú sau khó hơn, hỏng thì dễ hơn. Phương pháp này tự chỉnh độ khó theo trình độ, đo được tỉ lệ ăn mà không cần ghi chép, và so được giữa các buổi hoặc các bàn. Bước lớn lúc đầu (1 diamond) để nhanh tới mức khó vừa sức, sau đó bước nhỏ (1/4 diamond) để đo chính xác hơn. Điểm dừng là **điểm 50%**. Muốn tìm **điểm 67%** thì hỏng lùi 2 nấc, thành công tiến 1 nấc. Tập cả bên yếu: chênh lệch lớn giữa hai bên với spot shot là dấu hiệu lỗi cơ bản. Drill spot shot progressive ép người tập "aim anew each time" thay vì groove một cú duy nhất. Với 5 bộ drill mở rộng, ghi điểm bằng cách nhân với level. Thường xuyên dừng ở vị trí 4 trở lên thì lên level. http://www.sfbilliards.com/Misc/progpract.pdf
- Trang SFBA có link log sheet (ProblemLog.pdf, log_14_1.pdf). Em chỉ thấy link, chưa mở file. http://www.sfbilliards.com/miscellaneous.htm

### 4.3 Blocked vs random practice

- Meta-analysis Czyż, Wójcik, Solarská (2024, 34 nghiên cứu): random practice cho **transfer** tốt hơn blocked (SMD = 0.55). Nhưng hiệu ứng mạnh ở phòng lab (0.75) và **nhỏ, không có ý nghĩa thống kê ở môi trường thực tế** (0.34). Người trẻ gần như không hưởng lợi (0.12). Không nghiên cứu nào được đánh giá "strong", heterogeneity I² > 70%. https://pmc.ncbi.nlm.nih.gov/articles/PMC11349744
- Vận dụng vào pool (suy luận của em, chưa có nghiên cứu riêng cho pool): progressive practice của Jewett vốn là dạng lai, vì vị trí bi cái đổi liên tục nên không phải blocked thuần. Drill random two-point là random. Forum lại thiên về lặp một cú: "Repetition of identical shots develops neural pathways faster", và "nếu hỏng một leave thì set lại, đánh tới khi được 3 lần liên tiếp" — **forum opinion**. https://forums.azbilliards.com/goto/post?id=2892520

### 4.4 Feedback, ghi chép, quan sát

- Progressive dùng đồng xu đánh dấu vị trí, nên có số đo qua từng buổi (Jewett 2011, 1992).
- Dùng "stopper ball" làm target để có feedback đo được (Patrick Johnson) — **forum**. https://forums.azbilliards.com/goto/post?id=6287588
- Jewett "Active Spectating" (BD 2007): đi xem giải thì quan sát *cách* người giỏi làm, ghi vào sổ, mỗi người một trang. Nội dung trích được chủ yếu nói về stance, bridge, pre-shot routine. Phần position không đọc được vì text vỡ layout. http://www.sfbilliards.com/articles/2007.pdf
- Bob Jewett: xem người giỏi chơi để học pattern — **forum**. https://forums.azbilliards.com/goto/post?id=6259409

### 4.5 Thị giác và hình dung

- Williams, Singer, Frehlich (J. Motor Behavior 2002, 34(2):197–207): 12 người chơi billiards giỏi và 12 người chơi kém. Người giỏi có **quiet eye** (lần fixation cuối trước khi đánh) dài hơn. Quiet eye tăng theo độ khó của cú và dài hơn ở cú ăn so với cú trượt. Rút ngắn quiet eye bằng áp lực thời gian làm kết quả kém đi ở mọi trình độ. Đáng chú ý cho position: bài test xếp hạng là chạy một layout 9-ball. Nhóm giỏi hết bàn trong trung bình **10.67 cú**, nhóm kém cần **26.67 cú**. https://www.andrews.edu/~rbailey/Chapter%206/Motor%20Skills/6837246.pdf
- Singer (UF) đề xuất chiến lược 5 bước: readying, imaging, focusing, executing, evaluating. Người giỏi có "more economical and efficient visual search strategies". https://archive.news.ufl.edu/articles/1999/06/quiet-eye-is-the-key-to-making-the-shot-says-uf-sports-researcher.html
- Mẹo forum: nhìn lần cuối vào **điểm đích của bi cái** trước khi xuống cơ — **forum**. https://forums.azbilliards.com/goto/post?id=3193113

### 4.6 Thư viện pattern và chunking

- Thư viện pattern để học (sách pattern 8-ball và 14.1): xem 2.5.
- Giả thuyết chunking (chuyên gia nhận ra cấu hình quen chứ không nhớ từng bi) rất mạnh trong cờ vua. Có một bài Billiards Digest nói về trí nhớ bàn bi ("1006 TR Memory", colostate) nhưng bị 403. Snippet search cho rằng người chơi giỏi nhận diện tốt hơn hẳn các layout lấy từ ván thật, nhưng không hơn bao nhiêu với layout ngẫu nhiên — **[chưa xác minh — chỉ snippet]**. Chưa có nguồn billiards nào em mở được xác nhận điều này.

### 4.7 Khoảng cách lớn nhất giữa amateur và pro (theo forum và nguồn)

- **Speed control** là "the biggest difference" (Andrew Manning). Pro giỏi "the angle for the angle", nhờ speed chứ không nhờ biết lý thuyết. Gulyassy cho rằng pro đưa bi cái vào trong khoảng 18 inch của vị trí tối ưu liên tục. ShootingArts ước pro chọn đúng cú "over 95%" so với khoảng 85% ở amateur — các con số là **ước lượng forum, không có đo đạc**. https://forums.azbilliards.com/goto/post?id=2196700
- Độ đồng nhất cơ học: "Watch a pro shoot 50 shots, and 49 of them look identical" (pooltchr) — **forum**. Cùng URL.
- Jewett (có nguồn): phần lớn người chơi chỉ thoải mái ở speed 6–8 (3.1). Kiến thức đi trước khả năng thực hiện (4.1).
- Dữ liệu đo duy nhất em có: 10.67 so với 26.67 cú để hết cùng một layout 9-ball (4.5). Đó là số tổng hợp cả shotmaking lẫn position, không tách riêng được.

---

## 5. Lỗi position hay gặp ở amateur và drill sửa

| # | Lỗi | Cơ chế (mục) | Drill sửa | Nguồn |
|---|---|---|---|---|
| 1 | Đánh quá mạnh, bi cái chạy quá position | Quãng tỉ lệ v² (3.1). Speed cao còn giữ bi trên tangent lâu hơn, làm đổi cả hướng (1.5) | Speed ladder 5 chiều dài, Speed 1–4, ladder 10 bi, stop shot progressive | sfbilliards 2008.pdf; playing-pool PDF; azb 6371549; sfbilliards 2011.pdf |
| 2 | Tưởng mọi cú "thả lăn" đều ra 30°, kể cả cú rất mỏng hoặc rất dày | 30° chỉ đúng ở 1/4–3/4 ball (1.2) | Half-ball follow carom (Jewett 1995 Shot 2), reverse-pool half-ball | sfbilliards 1995.pdf, 2000.pdf |
| 3 | Dùng draw hoặc center khi cần đường 30° | Bi chưa lăn thì đi gần tangent hơn (1.1, 1.2) | Half-ball carom đánh cao, đánh nhẹ (Jewett: hai lỗi hay gặp nhất là quá mạnh và dùng draw/center) | sfbilliards 1995.pdf |
| 4 | Cắt ngang zone thay vì đi dọc | Sai số speed biến thành sai số góc (2.2) | Random two-point: ép tìm đường đi vào dọc line; target zone dài | azb 6259393; sfbilliards 2011.pdf |
| 5 | Để straight-in quá thường xuyên | Mất thành phần ngang của bi cái (2.3) | Plan có chủ đích "đúng bên" + nhìn điểm đích cuối cùng trước khi đánh; 3-ball pattern drill | azb 3193113; azb 6259409 |
| 6 | Draw thiếu hoặc mất kiểm soát khi bi xa | Spin/speed ratio thấp, spin mòn trên đường đi (1.4, 1.5) | Progressive draw (B/A/E), draw touch (Jewett 2011 Drill 3), luyện offset thấp với speed vừa đủ | progpract.pdf; sfbilliards 2011.pdf, 1999.pdf |
| 7 | Không kiểm soát được cú mềm dưới 1 MPH (speed ≤ 5) | Chỉ quen speed 6–8 (3.1) | Soft-touch drill, stop shot trong 1 đường kính bi, "Get to the Point" chạm nhẹ bi thứ hai | azb 6371549; sfbilliards 2007.pdf |
| 8 | Position nhiều băng "ước chừng" | Không chọn điểm băng 2; speed và spin đổi góc bật (1.6) | Second-rail target + calibrate kick system; biến thể 1–3 băng của random two-point | azb 3803615; sfbilliards 2011.pdf |
| 9 | Kiến thức vượt khả năng thực hiện (biết pattern mà không có touch) | Tầng 1–2 yếu (4.1) | Quay lại Drill 1–3 của "Second Level" | sfbilliards 2011.pdf |
| 10 | Không biết điểm 50% của chính mình nên chọn cú vượt sức | Không có số đo (4.2) | Progressive practice + log, tìm điểm 50% hoặc 67% | progpract.pdf |
| 11 | Đổi bàn, đổi vải là mất speed | Table speed khác nhau 50 → 130 (3.3) | Đo table speed ngay đầu buổi (2·t²), rồi warm-up bằng lag và Speed 1–4 | Shepard_apapp.pdf |
| 12 | Phá cluster muộn, đâm vào pack không có insurance | Pattern (2.5, 2.7) | 14.1 chạy bàn với yêu cầu phải có insurance và key ball; phá cụm sớm | azb a-class-on-clusters; azb 6259409 |

---

## 6. 20% cốt lõi và những gì cố tình bỏ

**20% cốt lõi (theo nguồn):** (a) 90° rule cho stun, 30° rule cho bi lăn (đúng ở 1/4–3/4 ball), trisect cho draw dưới 40°; (b) speed tỉ lệ v², băng ăn 2/3 năng lượng, phần lớn người chơi chỉ chủ động được 3 cấp speed; (c) zone để chọn, điểm để ngắm, đi vào zone dọc line, đúng bên, giữ góc; (d) progressive practice có số đo.

**Cố tình không đi sâu:** masse và jump; hệ kick và bank (chỉ nhắc ở mức position); công thức va chạm đầy đủ với throw (Shepard Section 4 có, nhưng không đổi kết luận thực hành); squirt, endmass và LD shaft; chiến thuật safety; one-pocket. Các con số chi tiết của Dr. Dave (TP, draw 70–80% offset, drag shot tối ưu) có tồn tại nhưng **không mở được** trong môi trường này. Muốn chốt thì cần mở từ một máy không bị chặn colostate hoặc drdavepoolinfo.

---

## Sources

Nguồn gốc (primary):
- http://www.sfbilliards.com/Misc/Shepard_apapp.pdf — Ron Shepard, Amateur Physics for the Amateur Pool Player, 3rd ed. 1997
- http://www.sfbilliards.com/Misc/progpract.pdf — SFBA Progressive Practice Drills (©2009, 2016), gồm bài Jewett BD 12/1992
- http://www.sfbilliards.com/articles/1995.pdf — Jewett, "Pythagoras & Pool Perpendiculars" (BD 02/1995) và cột về follow/draw systems (BD 10/1995)
- http://www.sfbilliards.com/articles/1999.pdf — Jewett, "More Spin, Less Speed" (BD 02/1999)
- http://www.sfbilliards.com/articles/2000.pdf — Jewett, "Half-Ball, Revisited" (BD 11/2000) và cột về follow carom nearly independent of fullness
- http://www.sfbilliards.com/articles/2007.pdf — Jewett, "Get to the Point" (BD 01/2007), "Active Spectating"
- http://www.sfbilliards.com/articles/2008.pdf — Jewett, "Measured Force" (BD 04/2008)
- http://www.sfbilliards.com/articles/2011.pdf — Jewett, "Second Level" (BD 08/2011)
- http://www.sfbilliards.com/articles/BD_articles.html — index các cột BD của Jewett
- http://www.sfbilliards.com/miscellaneous.htm — index tài liệu SFBA
- https://forums.azbilliards.com/posts/8479901/ — Dr. Dave, Cue Ball Control presentation, ICI Summit 2026 (post của chính tác giả)
- https://forums.azbilliards.com/threads/how-do-you-know-where-the-cueball-is-going.217973/post-2831125 — Dr. Dave về 90° và trisect
- https://forums.azbilliards.com/goto/post?id=7192813 — Dr. Dave, stun back / stun run through
- https://www.billiardspress.com/toc_pybsp.html — Phil Capelle, Play Your Best Straight Pool (mục lục)
- https://www.andrews.edu/~rbailey/Chapter%206/Motor%20Skills/6837246.pdf — Williams, Singer, Frehlich 2002, J. Motor Behavior
- https://archive.news.ufl.edu/articles/1999/06/quiet-eye-is-the-key-to-making-the-shot-says-uf-sports-researcher.html — UF News 1999
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11349744 — Czyż et al. 2024, meta-analysis contextual interference
- https://www.playing-pool.com/wp-content/uploads/2014/12/141912_free_drills.pdf — Playing Pool – The Missing Manual, Free Drills v1.0 (2014)
- https://en.wikipedia.org/wiki/Cue_sports_techniques
- https://en.wikipedia.org/wiki/Glossary_of_cue_sports_terms
- https://thepoolcoach.co.uk/2019/10/18/cue-ball-control/amp/

Forum (AzBilliards, ý kiến):
- https://forums.azbilliards.com/goto/post?id=2739563 — 30° có phải góc tốt nhất cho position
- https://forums.azbilliards.com/goto/post?id=6287519 và https://forums.azbilliards.com/goto/post?id=6287588 — exact vs zone position
- https://forums.azbilliards.com/goto/post?id=7776267 — A new way to think about position
- https://forums.azbilliards.com/goto/post?id=6259409 và https://forums.azbilliards.com/goto/post?id=6259393 — Generalizations on Pattern Play
- https://forums.azbilliards.com/goto/post?id=6818378 — CJ Wiley, zone 7–12 inch
- https://forums.azbilliards.com/goto/post?id=4784890 — "Think three balls ahead is horrible advice" (trang 5)
- https://forums.azbilliards.com/goto/post?id=3474432 — 3 ahead or backwards from the 9
- https://forums.azbilliards.com/goto/post?id=3193113 — Next Level
- https://forums.azbilliards.com/goto/post?id=2196700 — Differences between amateurs and pros
- https://forums.azbilliards.com/goto/post?id=6371549 — Speed control drills
- https://forums.azbilliards.com/threads/speed-control.170070/ — Speed control
- https://forums.azbilliards.com/threads/cloth-speed-difference.339056/post-4424481 — Cloth speed difference
- https://forums.azbilliards.com/goto/post?id=7645582 — cushion rebound
- https://forums.azbilliards.com/goto/post?id=3803615 — 3 rail position help
- https://forums.azbilliards.com/goto/post?id=4021760 — Calculating multi rail position shots
- https://forums.azbilliards.com/threads/tangent-line-conundrum.23577/latest — Tangent line conundrum
- https://forums.azbilliards.com/threads/a-class-on-clusters.91623 — A class on clusters (14.1)
- https://forums.azbilliards.com/goto/post?id=7301313 — Books with 8-ball patterns
- https://forums.azbilliards.com/goto/post?id=2892520 — How do/did you guys practice
- https://forums.azbilliards.com/posts/8445802/ — Beginner tips
