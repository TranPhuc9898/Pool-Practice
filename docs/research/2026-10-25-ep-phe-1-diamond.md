# Ép phê trái/phải khi hai bi cách 1 diamond: canh dày hay mỏng, điểm chết ở đâu — 2026-10-25

Câu hỏi: bi cái cách bi mục tiêu 1 diamond, tâm tới tâm 12,5" trên bàn 9 ft. Ép phê trái hoặc phải thì bi mục tiêu đi mỏng hay dày hơn điểm chạm hình học? Và có điểm phê nào mà ngắm như đánh trơn vẫn vào không?

**Nhãn:**
- **[tính]**: chạy harness gọi thẳng `ShotPhysics.hit()` của app.
- **[đọc]**: đã đọc trang nguồn.
- **[snippet]**: chỉ thấy trích đoạn.
- **[đoán]**: không có số đo.

Nguồn chat Messenger nằm ở `docs/research/nguon/2026-10-25-nguon-messenger-bida.md`.

**Harness:** nằm ngoài repo, ở scratchpad phiên (`spin/main.swift` cùng bản chép `ShotPhysics.swift`), dựng giống `scripts/calib-harness/run.sh`. Setup:
- Cơ ngang, `tipY = 0`.
- Bi cái đi thẳng tới ghost hình học.
- Đo góc lệch giữa hướng bi mục tiêu thật và hướng muốn.
- Đổi góc lệch ra inch ở 50" (4 diamond), tức quãng bi mục tiêu tới lỗ.

---

## 1. Quy tắc dấu: nói theo phê trong/ngoài, đừng nói trái/phải

Trái hay phải chỉ có nghĩa khi gắn với hướng cắt. Ví dụ cắt sang phải, tức bi mục tiêu đi lệch phải so với hướng bi cái:

| | Cắt sang **phải** | Cắt sang **trái** |
|---|---|---|
| **Phê trong** (inside) | phê **phải** | phê **trái** |
| **Phê ngoài** (outside) | phê **trái** | phê **phải** |

Phê ngoài là phê làm mặt bi cái tại điểm chạm quay ngược chiều trượt. Nó là phê "ăn khớp" với bi mục tiêu, và đó là thứ triệt throw. **[đọc]** (định nghĩa gearing, Dr. Dave)

## 2. Ba hiệu ứng, chiều của từng cái

| Hiệu ứng | Phê trong | Phê ngoài | Phụ thuộc |
|---|---|---|---|
| **Squirt**: bi cái lệch ngược phía phê ngay khi rời cơ | **mỏng** | **dày** | Tỉ lệ với lượng phê. Gần như không đổi theo tốc. Shaft nhẹ đầu thì nhỏ hơn. **[đọc]** |
| **Throw**: ma sát lúc chạm. CIT luôn kéo dày, SIT là phần do phê | Vẫn dày. Ở góc cắt lớn, throw còn **nhỏ hơn** đánh trơn | Giảm dần về 0 ở mức gearing. Quá gearing thì đảo sang **mỏng** | Đánh chậm và đánh stun thì lớn nhất. Follow/draw giảm throw tới 75% ở góc ≤ 30°. **[đọc]** |
| **Swerve**: bi cái cong khi nâng cơ | Cong về phía phê, bù ngược squirt | Như phê trong | Cơ ngang và quãng ngắn thì nhỏ. **Engine chưa có** |

Ở 1 diamond, squirt áp đảo. Lý do: bi cái chỉ cần lệch vài phần mười inch tại điểm chạm, nhưng bi mục tiêu bị đổi góc theo tỉ lệ `độ lệch / 2R`. Mô hình này bỏ qua swerve, nên điều trên chỉ đúng khi cơ ngang. **[tính]**

## 3. Số đo engine: tốc 2 m/s

Ô là độ lệch hướng bi mục tiêu. `+` là mỏng hơn, `−` là dày hơn. Trong ngoặc là độ lệch ở 50". Cột âm là phê ngoài, cột dương là phê trong. **[tính]**

| Góc cắt | ngoài 0,5R | ngoài 0,3R | trơn | trong 0,3R | trong 0,5R |
|---|---|---|---|---|---|
| 0° (thẳng) | ±10,7° theo phía phê | ±5,6° (≈4,9") | 0 | ±5,6° | ±10,7° |
| 30° (½ bi) | **−11,1°** | **−5,5°** | −2,1° (CIT) | **+7,5°** | **+14,2°** |
| 45° | | | | | +21,3° |
| 60° | | | | trượt bi ở 4 m/s | trượt bi |

Ghi chú:
- Đánh 1 m/s và 4 m/s cho bảng gần giống. Squirt không phụ thuộc tốc, nên tốc chỉ đổi phần throw.
- Ở cắt thẳng, phê phải đẩy bi mục tiêu sang trái, phê trái đẩy sang phải.
- Thêm follow +0,4 hoặc draw −0,4 ở cắt 30° không phê: chỉ còn −0,6° và −1,1°, ít hơn −2,1° của stun. Khớp với nguồn: follow/draw giảm throw. **[tính]** cùng **[đọc]**

So sánh dung sai: lỗ góc cách 50", lấy nửa độ rộng hiệu dụng khoảng 1" thì dung sai cỡ **±1,1°**. **[tính]**, nửa độ rộng 1" là số **[đoán]**. Như vậy:
- 0,3R phê không bù là trượt mọi góc.
- Đánh trơn ở cắt 30° mà không bù CIT cũng sát mép.

Tách thành phần ở cắt 30°, 2 m/s. **[tính]**

| tipX | squirt bi cái | throw | tổng lệch bi mục tiêu |
|---|---|---|---|
| ngoài 0,5R | 2,5° | 1,1° | −11,1° dày |
| ngoài 0,3R | 1,5° | **−2,0°** (quá gearing, đảo dấu) | −5,5° dày |
| trơn | 0 | 2,1° | −2,1° dày |
| trong 0,3R | 1,5° | 0,9° | +7,5° mỏng |
| trong 0,5R | 2,5° | 0,7° | +14,2° mỏng |

Throw phê trong giảm từ 2,1° xuống 0,7°. Đúng với Dr. Dave: phê trong ở góc lớn cho throw nhỏ hơn đánh trơn, vì trượt nhanh hơn thì μ thấp hơn. **[đọc]**

## 4. "Điểm chết": có hai nghĩa, hai chỗ khác nhau

**(a) Điểm phê để ngắm theo ghost hình học mà vẫn vào**, tức tổng lệch bằng 0. Nằm ở **phê trong rất ít**, khoảng **+0,02 tới +0,10R**. Một chút squirt mỏng bù vừa đủ CIT dày. Ở cắt 60° thì nằm ngoài ±0,55R, coi như không có. **[tính]**

Thực tế điểm này quá hẹp để dùng: 0,05R bằng 0,06", nhỏ hơn sai số đặt đầu cơ. Thông điệp thật là: muốn ăn đúng ghost thì **đánh trơn và canh mỏng hơn chút để bù CIT** (CIT kéo bi dày), hoặc thêm chút follow/draw để giảm throw.

**(b) Gearing**: phê làm throw = 0. Nằm ở **phê ngoài**, tăng theo góc cắt, gần như không đổi theo tốc. **[tính]**

| Góc cắt | 15° | 30° | 45° | 60° |
|---|---|---|---|---|
| tipX gearing | 0,08–0,10R | **0,16R** | 0,21–0,23R | 0,25–0,29R |

Nhưng ở gearing, squirt vẫn kéo dày từ −2° tới −11°. Gearing hết throw, không hết squirt. Nó chỉ thành "điểm chết" thật khi anh đã bù squirt bằng BHE (mục 5).

Engine lệch nguồn ở điểm này. Dr. Dave cho gearing ở cú ½ bi khoảng **50% phê** **[đọc]**, nguồn Colorado State ghi khoảng 40% **[snippet]**. Nếu "100%" tương ứng khoảng 0,5R thì 50% là khoảng 0,25R, trong khi engine ra 0,16R. Cần đo test G (throw) để chốt. Plan `2026-10-18-hieu-chinh-engine.md` đang để test này ngoài phạm vi.

## 5. Canh thế nào: khuyến nghị

Chốt: **ở 1 diamond, bù squirt bằng BHE pivot ở natural pivot length (NPL) của shaft, rồi bù throw bằng mắt.**

1. **Squirt.** Ngắm như đánh trơn, sau đó xoay đuôi cơ quanh tay cầu để lấy phê. Tay cầu đặt ở NPL thì squirt tự triệt. Ở 1 diamond cơ ngang, swerve gần như bằng 0, nên BHE thuần là đủ. SAWS chỉ cần pha FHE khi đánh chậm hoặc đường dài. **[đọc]**
   - NPL đo bằng cú rất nhanh với phê gần tối đa: chỉnh độ dài cầu tới khi bi cái đi thẳng. **[đọc]**
   - Shaft thường có NPL khoảng 12–15", shaft LD dài hơn. **[snippet]**
2. **Throw** sau khi đã bù squirt:
   - Trơn hoặc phê trong: throw kéo bi **dày**, nên canh **mỏng hơn** một chút, khoảng 2° ở ½ bi. Tương đương "1 inch mỗi foot" đường bi mục tiêu ở throw tối đa. **[đọc]**
   - Phê ngoài quanh gearing: canh đúng ghost.
   - Phê ngoài đậm hơn gearing: throw đảo sang kéo **mỏng**, nên canh **dày hơn** chút.
3. **Không dùng BHE mà canh tay** như RioBilliard dạy (#42, "điểm dung sai"):
   - Phê trong: canh **dày** hơn.
   - Phê ngoài: canh **mỏng** hơn.
   - Lượng bù theo bảng mục 3: 0,3R thì khoảng 5–7°, cỡ 1/4 bi.

Bảng mục 3 là bảng của shaft engine (squirt 2,5° ở 0,5R) và **[đoán]**. Shaft thật của anh sẽ khác.

## 6. Cái đã kiểm và cái chưa

- **Đã kiểm:**
  - Số ở mục 3–4 chạy ra từ `ShotPhysics.swift` hiện tại.
  - Chiều squirt, throw, gearing khớp trang Dr. Dave đã đọc.
  - Caption RioBilliard #42 ("canh dày lên" để bù defleksi) khớp chiều của engine.
- **Chưa kiểm, có thể sai:**
  - Độ lớn squirt 2,5° ở 0,5R là số đoán. Test S trong plan hiệu chỉnh đang treo.
  - Gearing của engine thấp hơn nguồn khoảng 1,5 lần.
  - Engine không có swerve, nên mọi kết luận chỉ đúng cho cơ ngang.
  - Dung sai lỗ ±1,1° là ước lượng.
- **Cố tình bỏ:**
  - Massé và jump.
  - Bi bẩn hoặc cling, vì throw tăng mạnh mà không mô hình được.
  - Độ cao băng.
  - Phê trên đường dài hơn 1 diamond: lúc đó swerve vào cuộc và bảng mục 3 không còn đúng.

## 7. Bài tập kiểm trên bàn thật (kiểm số engine bằng 10 phút)

Đặt bi mục tiêu cách lỗ góc 4 diamond, bi cái cách bi mục tiêu 1 diamond, cắt ½ bi.

1. Đánh 5 cú trơn, ghi bi lệch mấy inch ở lỗ.
2. Đánh 5 cú phê trong 1 tip, ngắm đúng ghost, không pivot. Ghi lệch.
3. Đánh 5 cú phê ngoài 1 tip, ngắm đúng ghost, không pivot. Ghi lệch.
4. Lặp bước 2–3 bằng BHE ở độ dài cầu thường dùng.

Nếu bước 2 lệch mỏng khoảng 5–6", bước 3 lệch dày khoảng 4–5", và bước 4 gần 0, thì engine đúng chiều và đúng cỡ. Nếu lệch nhỏ hơn nhiều, nghĩa là shaft của anh squirt ít hơn 2,5°. Ghi số vào `do.csv` theo phiếu đo bàn.

## 8. Riêng cho Mezz Ignite 12.2 (carbon)

**Squirt của Ignite: chưa ai đo có số.** Em không tìm được bài test máy nào cho Ignite, kể cả trang Dr. Dave. Trên AZBilliards chỉ có cảm nhận, và các ý kiến còn ngược nhau:
- Người thì nói lệch hơn Revo, hơn WX900.
- Người lại xếp nó cùng hạng với Cynergy 12.5.

Em lấy số từ một người dùng tự đo **NPL khoảng 14"** bằng cách của Dr. Dave **[snippet]**. Pivot BHE ở NPL triệt đúng squirt, nên squirt ở 0,5R bằng atan(0,5R / NPL) = atan(14,3 mm / 356 mm) ≈ **2,3°**. So với số mặc định của engine (2,5°, NPL khoảng 12,9") thì thấp hơn khoảng 8% **[tính]**. Harness chạy lại với 2,3°. Mọi số dưới đây đứng trên một số NPL chưa kiểm, nên anh tự đo NPL là việc đầu tiên (mục 5.1).

**Bảng canh cho Ignite: 1 diamond, 2 m/s, cơ ngang. [tính]** 

Mỗi ô ghi hai số theo dạng "lệch ở lỗ 50" / dịch ghost để bù":
- **Lệch ở lỗ 50"**: bi đi lệch bao nhiêu nếu ngắm đúng ghost hình học.
- **Dịch ghost để bù**: dời điểm ngắm ngang bao nhiêu mm để bi vào tâm lỗ.

Lệch đầu cơ tính bằng mm, với R = 28,6 mm. Số ở 4 m/s chênh với bảng này không quá 1".

| Lệch đầu cơ | Thẳng | Cắt 15° | Cắt 30° | Cắt 45° |
|---|---|---|---|---|
| trơn | 0 | 1,5" dày / 1,8 mm | 1,8" dày / 1,8 mm | 1,7" dày / 1,3 mm |
| **phê trong** 3 mm (0,1R) | 0,2" / 0,3 mm | 0,2" mỏng / 0,3 mm | 0,7" mỏng / 0,7 mm | 1,5" mỏng |
| phê trong 6 mm (0,2R) | 2,1" / 2,4 mm | 2,6" mỏng / 2,7 mm | 3,4" mỏng / 3,1 mm | 4,7" mỏng |
| phê trong 9 mm (0,3R) | 4,4" / 4,8 mm | 4,9" mỏng / 5,2 mm | 6,0" mỏng / 5,4 mm | 8,2" mỏng |
| phê trong 11 mm (0,4R) | 6,5" / 7,2 mm | 7,2" mỏng / 7,5 mm | 8,6" mỏng / 7,7 mm | 12,1" mỏng |
| **phê ngoài** 3 mm | | 1,5" dày / 2,0 mm | 3,5" dày / 3,9 mm | 4,6" dày / 3,8 mm |
| phê ngoài 6 mm | | 2,0" dày / 2,3 mm | 3,0" dày / 3,6 mm | 5,5" dày / 5,7 mm |
| phê ngoài 9 mm | | 4,1" dày / 4,5 mm | 4,3" dày / 4,4 mm | 5,2" dày / 4,9 mm |
| phê ngoài 11 mm | | 6,4" dày / 7,0 mm | 6,6" dày / 6,8 mm | 7,6" dày / 6,7 mm |

Cột thẳng chỉ có một hàng cho mỗi mức phê vì cú thẳng không có trong hay ngoài. Ở đó phê lệch về phía nào thì bi mục tiêu đi về phía ngược lại. Ô cắt 45° phê trong không có số mm vì góc ngắm bù phải xoay quá 3°, ngoài khoảng em cho tìm.

Phê ngoài không tăng đều theo lượng phê. Ở cắt 30°, phê 3 mm lệch nhiều hơn 6 mm. Ở cắt 45°, phê 6 mm lệch nhiều hơn 9 mm. Đó là chỗ throw đảo dấu quanh gearing (mục 4b) trong mô hình throw của engine. Chưa có số đo bàn thật để biết chỗ gãy này là thật hay do mô hình.

**Quy tắc nhớ cho Ignite:** với phê từ 6 mm trở lên, **lệch đầu cơ bao nhiêu mm thì dịch ghost ngược lại khoảng 60% chừng đó**. Cụ thể:
- Phê trong: dịch ghost về phía làm **dày**.
- Phê ngoài: dịch ghost về phía làm **mỏng**.
- Ví dụ: lệch đầu cơ 9 mm thì dịch ghost khoảng 5 mm, tức gần 1/10 bề ngang bi.

Hệ số 0,6 khớp với hình học: squirt × khoảng cách tới ghost / NPL = 260 mm / 356 mm ≈ 0,73, rồi throw ăn bớt một phần **[tính]**.

**BHE với Ignite** (cắt 30°, 2 m/s). Bảng là phần lệch còn lại ở lỗ 50" sau khi pivot. **[tính]**

| Độ dài cầu | trong 3 mm | trong 9 mm | trong 11 mm | ngoài 3 mm | ngoài 9 mm | ngoài 11 mm |
|---|---|---|---|---|---|---|
| 10" | 2,3" dày | 3,4" dày | 4,1" dày | 0,9" dày | 4,5" mỏng | 5,3" mỏng |
| 12" | 1,8" dày | 1,9" dày | 2,1" dày | 1,4" dày | 3,0" mỏng | 3,2" mỏng |
| **14" (NPL)** | **1,5" dày** | **0,9" dày** | **0,7" dày** | **1,7" dày** | **1,9" mỏng** | **1,7" mỏng** |
| 16" | 1,2" dày | 0,1" dày | 0,4" mỏng | 1,9" dày | 1,1" mỏng | 0,6" mỏng |

Đọc bảng:
- Ở NPL, squirt đã triệt. Phần còn lại là throw, khoảng 1–2".
- **Phê trong: còn dày**, canh mỏng thêm chút. Đánh trơn cũng phải bù cùng chiều, vì CIT kéo dày.
- **Phê ngoài quá gearing (từ 9 mm): còn mỏng**, canh dày thêm chút.
- Cầu ngắn hơn NPL thì bù thiếu, cầu dài hơn thì bù thừa. Cầu ở 16" lại cho số nhỏ ở vài ô. Đó là squirt bù thừa vô tình cộng với throw, không phải cách nên dùng.

**Việc cho Ignite, theo thứ tự:**
1. Đo NPL của chính cây này: đánh nhanh với khoảng 11 mm phê ngoài, chỉnh độ dài cầu tới khi bi cái đi thẳng. Nếu ra khác 14", bảng trên lệch theo tỉ lệ 14 / NPL.
2. Chạy bài mục 7, nhưng thay "1 tip" bằng 9 mm. Nếu bài đó ra lệch 4–6" ở lỗ khi không bù và dưới 2" khi BHE ở NPL, thì số 2,3° là đúng.
3. Khi có NPL thật, đổi `squirtDeg` trong `ShotPhysics.swift` theo atan(14,3 mm / NPL). Engine lúc đó khớp cây của anh. Việc này cửa hai chiều, chỉ đổi một hằng số.

## Nguồn

- Dr. Dave, squirt/swerve/throw effects: https://drdavepoolinfo.com/faq/sidespin/aim/effects/ **[đọc]**
- Dr. Dave, SAWS: https://drdavepoolinfo.com/faq/sidespin/aim/saws/ **[đọc]**
- Dr. Dave, NPL (BD 10/2026): https://drdavepoolinfo.com/bd_articles/2026/oct26.pdf **[snippet]**
- Throw, Colorado State: https://www.engr.colostate.edu/~dga/pool/throw/ **[snippet]**
- BD articles về throw và gearing: https://billiards.colostate.edu/bd_articles/2006/sept06.pdf, https://billiards.colostate.edu/bd_articles/2007/feb07.pdf **[snippet]**
- Mezz Ignite, NPL khoảng 14" do người dùng tự đo: https://forums.azbilliards.com/threads/mezz-ignite-reactions.500731/ **[snippet]**
- Mezz Ignite, so lệch với các shaft carbon khác (cảm nhận, không đo): https://forums.azbilliards.com/goto/post?id=8391323, https://forums.azbilliards.com/goto/post?id=6598006 **[snippet]**
- Video trong chat: RioBilliard #42 (defleksi), #43 (CIT); Dr. Dave #39 (4 cách ngắm có phê, SAWS) **[caption]**
