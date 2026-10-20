---
title: Pool 9 bi — hệ bank lỗ ảo 4/5 và các hệ băng (clip #10)
date: 2026-10-19
type: research-topic
status: xong (batch 3)
sources: transcript ASR clip #10; docs/research/nguon/2026-10-11-nguon-bank-kick-safety-break.md; snippet tìm kiếm của Dr. Dave, Jewett (sfbilliards); code engine; tính toán của em
---

# Hệ bank lỗ ảo 4/5 — kiểm chứng clip #10

## Kết luận

| Claim của #10 | Nhãn | Căn cứ |
|---|---|---|
| Mỗi lỗ có một "lỗ ảo" cố định sau băng bank, cứ nhắm vào đó là bank vào | VERIFIED (hình học, có điều kiện) | Em dựng: nhắm một điểm cố định cách băng d tương đương giả định tan(góc ra)/tan(góc vào) = d/W không đổi (mục 2.1). Jewett đo được đúng dạng "điểm cố định" này cho bank cross-side |
| Lỗ ảo cách băng bank 4/5 bề rộng lòng bàn | CONDITIONAL, NEEDS CALIBRATION | Nằm giữa Jewett 0.71 (cross-side, OB trượt) và dải 0.60–0.90 suy ra từ hệ fast bank của Dr. Dave. Hệ số thật đổi theo góc bank, nên 4/5 chỉ đúng quanh một dải góc |
| Đặt cơ dọc băng, đầu cơ ở 1.5 chấm thì chuôi cơ là lỗ ảo | CONDITIONAL | Chỉ ra khoảng 4/5 W trên bàn 9 ft với cơ khoảng 57–59 in. Bàn 8 ft ra 0.92–0.97 W, bàn 7 ft ra trên 1.0 W (mục 2.2). Cách đặt cơ là em hiểu từ lời nói, chưa xem hình |
| Hiệu quả nhất khi bi mục tiêu gần băng; bi xa thì đánh mạnh để bi trượt vào băng | VERIFIED | Jewett: hệ điểm cố định chỉ đúng khi OB còn trượt lúc chạm băng, không side; khi đó tốc độ gần như không ảnh hưởng |
| Dùng được cho cả lỗ giữa, cơ đặt dọc đường nối tâm hai lỗ giữa | CONDITIONAL | Hình học giống hệt lỗ góc. Số 4/5 cho lỗ giữa chưa có nguồn độc lập; Jewett 0.71 là đúng trường hợp cross-side này |
| (Không nói) Góc cắt làm bank ngắn hoặc dài | Thiếu trong clip | BD 2/2013: cắt ngoài thì bank ngắn, cắt trong thì bank dài. Hệ 4/5 ngầm giả định đánh gần thẳng |

Tóm lại: #10 là một hệ "tỉ lệ hằng" hợp lệ, cùng họ với hệ 70% của Jewett. Con số 4/5 hợp lý cho bàn 9 ft ở góc bank trung bình, nhưng không phải hằng số vật lý. Công thức đo bằng chiều dài cơ chỉ dùng được trên bàn 9 ft. Trên app nên dạy hệ số như một tham số người chơi tự đo, không phải đáp án.

---

## 1. Nguồn và mức truy cập

- **Clip #10: T.** Chỉ đọc transcript ASR, chưa xem hình. Cách đặt cơ ở mục 2.2 là em hiểu từ lời nói. Đoạn chính, nguyên văn ASR:

  > "đặt gậy dọc Theo mép thành băng với đầu gậy đến tại vị trí 1,5 chấm khi đó chuôi gậy chính là lỗ ảo… cân vào lỗ giữa… đặt gậy dọc với đường núi giữa tâm 2 lỗ giữa… để ý xem gậy cắt mép bàn tại đâu… khoảng cách từ lỗ ảo đến mép thành băng đúng bằng 4/5 chiều rộng của lòng bàn"

  Ngoài ra clip có: hệ "hiệu quả nhất khi bi mục tiêu nằm gần thành băng", bi xa thì "tăng lực để bi mục tiêu trượt vào thành băng", và mẹo "ngắm thẳng vào chiếc tripod" (vật đặt tại lỗ ảo).
- **Nguồn ngoài:** máy vẫn không fetch được drdavepoolinfo.com (curl exit 7). colostate.edu trả 301 sang drdavepoolinfo nên cũng hỏng. Căn cứ ngoài là snippet tìm kiếm, cộng với các tóm tắt đã kiểm ở phiên 2026-10-11 trong file nguồn của repo.

| Nguồn | URL | Dùng cho |
|---|---|---|
| Jewett, "Short Banks" (BD 9/2004) | http://www.sfbilliards.com/articles/2004.pdf | Điểm cố định 35.5 in, điều kiện OB trượt |
| Dr. Dave, fast-speed bank "(2x + 1/3) → x" (BD 7/2013) | https://drdavepoolinfo.com/bd_articles/2013/july13.pdf | Tỉ lệ đổi theo góc ở bank mạnh |
| Dr. Dave, cut-induced spin (BD 2/2013) | https://drdavepoolinfo.com/bd_articles/2013/feb13.pdf | Cắt ngoài ngắn, cắt trong dài |
| Dr. Dave, twist/bend (BD 10/2016) | https://drdavepoolinfo.com/bd_articles/2016/oct16.pdf | Bank ngắn hơn khi mạnh hoặc có twist |
| File nguồn trong repo | `docs/research/nguon/2026-10-11-nguon-bank-kick-safety-break.md` dòng 36–91 (bank), 99–117 (kick) | Tóm tắt các hệ và drill B1–B8, K1–K11. File này tham chiếu, không chép lại |
| Engine | `modules/pool-table/ios/Editor/ShotPhysics.swift` dòng 17, 43–44, 261–278; `RackSim.swift` dòng 139 | Mô hình băng hiện tại |

## 2. Kiểm từng claim

### 2.1 Lỗ ảo cố định tương đương tỉ lệ tan hằng

Đặt băng bank là đường y = 0, lỗ đích P ở phía đối diện, cách băng W. Lỗ ảo P' nằm cùng hoành độ với P, phía sau băng, cách băng d. Bi mục tiêu ở O nhắm thẳng vào P' sẽ chạm băng tại B.

- Đoạn O→B nằm trên đường O→P', nên góc vào θ₁ (đo từ pháp tuyến) thoả tan θ₁ = Δx/d, với Δx là khoảng cách dọc băng từ B tới P.
- Đoạn B→P có tan θ₂ = Δx/W.
- Suy ra tan θ₂ / tan θ₁ = d/W, không phụ thuộc vị trí O.

Ngược lại, nếu băng thật cho tỉ lệ k = tan θ₂/tan θ₁ không đổi thì mọi đường bank vào P đều đi qua một điểm cố định cách băng d = k·W. Vậy "một lỗ ảo cố định cho mỗi lỗ" đúng khi và chỉ khi k hằng. Phản xạ gương là trường hợp k = 1 (d = W).

Ví dụ số, bàn 9 ft, tọa độ inch, OB ở (25, 25), đích là lỗ giữa (50, 50), bank off băng y = 0:

| Mô hình | d | Điểm bank x | Góc vào | Góc ra |
|---|---|---|---|---|
| Gương | 50 | 33.3 | 18.4° | 18.4° |
| Jewett | 35.5 | 35.33 | 22.4° | 16.4° |
| Tuấn | 40 | 34.6 | 21.0° | 17.1° |

Chênh lệch điểm bank giữa gương và các hệ thật khoảng 1.3–2 in, đủ để trượt lỗ. Đây là lý do bank "nhắm gương" luôn bị ngắn.

Ghi chú hình học: tâm bi chạy trong hình chữ nhật nhỏ hơn lòng bàn một bán kính mỗi phía (W − 2R ≈ 47.75 in). Tuấn đo "lòng bàn", Jewett đo từ mũi băng, Dr. Dave đo ở rail groove. Ba mốc lệch nhau vài inch, nên so tỉ lệ giữa các hệ chỉ đúng tới cỡ ±0.03.

### 2.2 Công thức "1.5 chấm + chuôi cơ" theo chiều dài cơ và cỡ bàn

Cách em hiểu [suy luận, cần xem hình]: cơ nằm dọc băng ngắn đi qua lỗ góc đích, đầu cơ ở 1.5 diamond tính từ góc phía băng bank, chuôi cơ thò ra ngoài băng bank. Lỗ ảo ở chuôi cơ, cách băng bank d = L − 1.5 diamond (L là chiều dài cơ).

| Bàn | L = 57 in | L = 58 in | L = 59 in |
|---|---|---|---|
| 9 ft (W 50, diamond 12.5) | 38.25 in (0.765 W) | 39.25 in (0.785 W) | 40.25 in (0.805 W) |
| 8 ft (W 44, diamond 11) | 0.92 W | 0.943 W | 0.966 W |
| 7 ft (W 39, diamond 9.75) | 1.087 W | 1.112 W | 1.138 W |

- Trên bàn 9 ft với cơ 58 in, công thức ra 0.785 W, khớp "4/5" Tuấn nói. Hai cách nói là một.
- Trên bàn nhỏ hơn, cùng công thức ra gần gương hoặc vượt gương, tức bank sẽ dài. Công thức đo bằng cơ **không chuyển được** sang bàn 7–8 ft. Muốn dùng thì quy về tỉ lệ 0.8 W rồi đo bằng thước.
- Nếu đếm 1.5 chấm từ góc kia (phía lỗ đích) thì d = 58 − 31.25 = 26.75 in = 0.535 W, lệch xa 4/5. Điều này ủng hộ cách hiểu ở trên, nhưng vẫn chưa thay được việc xem hình.

### 2.3 Hệ số 4/5 so với nguồn

- **Jewett, bank cross-side, OB trượt:** điểm cố định 35.5 in trên bàn 4.5×9 ft, tức k ≈ 0.71. Cùng dạng hệ với Tuấn, hệ số thấp hơn.
- **Dr. Dave, bank cross-corner mạnh, đo ở groove:** đường từ 2x + 1/3 trên băng gần tới x trên băng bank. Từ đó k = x/(x + 1/3), đổi theo góc:

  | x (diamond) | 0.5 | 1 | 1.33 | 1.5 | 2 | 2.5 | 3 |
  |---|---|---|---|---|---|---|---|
  | k | 0.60 | 0.75 | 0.80 | 0.82 | 0.86 | 0.88 | 0.90 |

  Số 0.8 của Tuấn trùng hệ Dr. Dave ở x ≈ 4/3 diamond. Ở bank nông (x lớn) hệ 4/5 sẽ hơi dài, ở bank sâu (x nhỏ) sẽ ngắn hơn hệ Dr. Dave. Ví dụ x = 2, k = 0.8: hệ 4/5 cho điểm xuất phát 4.5 so với 4.33 của Dr. Dave, chênh khoảng 2 in. Đây là **dự đoán của em** từ hai công thức, chưa đo.
- Hai nguồn khác loại bank (cross-side chậm và cross-corner mạnh), nên không gộp thành một số. Kết luận chắc được: k thật nằm trong khoảng 0.6–0.9 và đổi theo góc, tốc độ và trạng thái spin của OB. Một hệ số hằng là xấp xỉ.

### 2.4 Điều kiện "bi trượt vào băng"

Jewett nêu đúng điều kiện này: OB còn trượt, không side spin, thì tốc độ gần như không đổi đường bank. OB đã lăn thì topspin làm bi cong sau băng và hệ sai. Tuấn nói "bi xa thì tăng lực để bi mục tiêu trượt vào thành băng", cùng ý. OB gần băng thì chưa kịp lăn, nên hệ "hiệu quả nhất khi bi gần băng" cũng khớp.

### 2.5 Phần clip không nói

- **Góc cắt:** BD 2/2013 cho thấy cắt ngoài thì bank ngắn, cắt trong thì bank dài, mạnh nhất quanh cú half-ball. Hệ 4/5 không có bù này. Drill nên bắt đầu ở cú gần thẳng.
- **Twist và tốc độ cao:** đánh mạnh làm bank ngắn hơn một chút (BD 10/2016). Tuấn dùng lực để giữ OB trượt, nhưng không nói tới hệ quả bank ngắn lại.
- **Kiss:** bank cross-side và cross-corner gần thẳng dễ kiss bi cái. Clip không nhắc.

### 2.6 Các hệ kick đã có trong repo

Batch này không kiểm lại các hệ kick vì #10 không nói tới kick. File nguồn dòng 99–117 đã có: contact-point mirror, equal-distance, midpoint-parallel-shift, Plus, Corner-5, Jewett short và long kicks, bending kick. Một điểm đáng nối: Jewett "Short Kicks" ghi góc ra của kick mềm, nông chỉ khoảng 70% góc tính toán. Con số gần với k của bank, gợi ý app có thể dùng chung một tham số "tỉ lệ băng" cho cả bank và kick nông [suy luận].

## 3. Liên hệ engine (chỉ đề xuất, chưa làm)

- `ShotPhysics.cushion()` dùng mô hình xung: e = 0.82, railMu = 0.14, sinE = 0.27. Em chép công thức sang Python trong scratchpad (không chạy app hay harness của repo). Với bi trượt không spin, tỉ lệ tan bật **ngay sau băng** là 0.87 ở góc vào 10–40° (chế độ dính, (1 − meff)/e), 0.96 ở 50°, 1.04 ở 60°. Số này chưa tính đường cong do spin sinh ra sau băng, nên chưa so được với 0.71 hay 0.8 ở trường xa. Bi lăn chưa tính.
- `RackSim` dùng mô hình Mathavan 2010 (eRail 0.83, muRail 0.14, noseH 0.635). Chưa tính tỉ lệ.
- Đề xuất cho batch 6: harness bắn OB trượt, không spin, vào băng ở góc 10–50°, đo hướng đi khi bi đã lăn đều, ra k theo góc. So với Jewett 0.71 (cross-side) và bảng Dr. Dave. Nếu engine ra gần 0.87 ở trường xa thì bank trong app sẽ dài hơn bàn thật.
- Phiếu đo bàn `docs/research/2026-10-18-phieu-do-ban.md` mục CD đã đo góc ra khi có phê. Thêm một biến thể không phê (tipX 0, bi trượt tới băng) là đo thẳng được k trên bàn của anh.

## 4. Drill liên quan

### Drill đáng viết spec ở batch 5

- **Bank lỗ ảo:** OB ở 3–4 vị trí cách băng bank 1–2 diamond, đích lỗ góc. Người chơi nhắm lỗ ảo ở 0.8 W, ghi vào, ngắn hay dài. Sau 10 cú mỗi vị trí, app gợi ý chỉnh k. Nếu dùng làm drill chấm điểm thì k phải lấy từ phép đo ở mục 3, không lấy 0.8 làm đáp án.
- **Bank bi xa:** cùng góc, OB lùi xa băng dần. Mục tiêu là tìm lực tối thiểu để bank còn vào, kiểm điều kiện "bi trượt vào băng".

### Drill có sẵn trong file nguồn

- B1, B2 (BU cross-side): dùng ngay để kiểm hệ 4/5 cho lỗ giữa.
- B6 (Jewett short banks, đếm chuỗi): kiểm điểm cố định.
- B8 (fast-speed bank reference tracks): so 4/5 với hệ Dr. Dave.
- B4 (cut-angle ladder): phần clip không nói tới.

## 5. Thông số NEEDS CALIBRATION

| Thông số | Giá trị đang có | Nguồn | Cách đo |
|---|---|---|---|
| k bank cross-side, OB trượt | 0.71 (Jewett), 0.8 (Tuấn) | Mục 2.3 | Biến thể không phê của test CD, hoặc drill B1 |
| k bank cross-corner | 0.60–0.90 theo góc (Dr. Dave), 0.8 (Tuấn) | Mục 2.3 | Drill B8 |
| k của engine ở trường xa | Chưa biết; ngay sau băng 0.87 | Mục 3 | Harness batch 6 |
| Mốc đo lỗ ảo (mũi băng, groove, lòng bàn) | Chưa chốt | Mục 2.1 | Chốt một mốc khi viết spec drill |

## 6. Còn thiếu

- Hình clip #10: cách đặt cơ, mốc "mép thành băng", vị trí tripod.
- Bản gốc Jewett 2004 và BD 7/2013. Chỉ có tóm tắt phiên 2026-10-11 và snippet.
- Nguồn độc lập cho hệ số lỗ giữa ở bank mạnh.
