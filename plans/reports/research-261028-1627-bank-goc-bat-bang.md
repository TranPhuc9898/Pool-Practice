# Bank: bi dội băng ra góc nào, và engine mình sai ở đâu — 2026-10-28

## Kết luận

1. **Ngoài bàn thật**, góc ra gần bằng góc tới (luật gương) chỉ khi bi lăn đều, tốc vừa, góc tới nhỏ. Lệch khỏi gương theo bốn thứ: bi đang trượt hay lăn, lực, góc tới, và spin ngang (phê của cơ hoặc spin sinh ra do cắt). Người chơi ngắm bằng điểm gương rồi chỉnh tay theo bốn thứ đó.
2. **Engine của mình mất tốc quá nhiều và mở góc quá rộng khi bi lăn chạm băng.** Bi lăn 1 m/s đập thẳng băng chỉ dội ra còn 0,30 m/s. Bi tới ở 20° thì ra 39°. Nguyên nhân: `cushion()` bỏ qua mômen của xung pháp tuyến đặt ở điểm chạm cao hơn tâm. Đây là lý do drill 66 ở 1,8 m/s không vào và planner phải nâng lên 2,34.
3. **Engine không truyền spin do cắt sang bi mục tiêu.** Throw có, nhưng bi mục tiêu rời đi với phê bằng 0. Hiệu ứng "cắt ra ngoài thì bank ngắn" của Dr. Dave không có trong mô phỏng.

Khuyến nghị: sửa `cushion()` trước (mục 5), kiểm bằng một phép đo lag trên bàn thật, rồi mới chạy lại audit nhóm bank.

**Cập nhật cùng ngày:** đã sửa `cushion()` ở cả `ShotPhysics.swift` và `docs/research/bi-cai-xoay.html`, chưa đo bàn thật. Kết quả audit sau khi sửa ở mục 7.

## 1. Bàn thật: góc ra phụ thuộc gì

| Yếu tố | Hướng lệch so với gương | Nguồn |
|---|---|---|
| Spin do cắt trên bi mục tiêu | Cắt mỏng dần tới khoảng half-ball (30°) thì spin tăng, bank **ngắn** lại. Lực lớn làm spin này giảm. | Dr. Dave, bank/kick effects FAQ; BD tháng 2/2013 |
| Lực | Lực nhanh thì băng lún. Góc ra ngay khỏi băng lớn hơn dự đoán của hệ gương, sai lệch rõ hơn ở góc tới lớn. Ở tốc nhanh, góc ra ít nhạy với lực hơn. | TP B.11 (Dr. Dave) |
| Trượt hay lăn | Bi trượt ra **ngắn** hơn. Bi lăn ra gần bằng góc tới, sau đó cong rộng dần vì topspin. | Dr. Dave (fast-speed và sliding-ball bank), diễn đàn AZB (giai thoại) |
| Phê của cơ | Phê theo chiều đi (running) mở góc, bank dài. Phê ngược thu góc, bank ngắn. Người chơi dùng phê ngoài để khử spin do cắt. | Dr. Dave FAQ |
| Mô hình băng cứng | Chỉ đúng tới khoảng 2,5 m/s, nhanh hơn thì băng biến dạng đáng kể. | Mathavan et al., Loughborough |

Chưa thấy nguồn uy tín nào nói chung chung "đánh mạnh thì bank ngắn". Lực đổi góc ra qua hai đường: băng lún và bi còn trượt lúc chạm. Chiều lệch tuỳ góc tới.

## 2. Người chơi ngắm bank thế nào

Câu anh hỏi là làm sao biết bank vào điểm đó thì vào lỗ. Câu trả lời là **điểm gương**. Gấp bàn qua băng: lấy ảnh đối xứng của lỗ qua đường tâm bi chạm băng, nằm cách mũi băng một bán kính bi. Nối bi mục tiêu với ảnh đó, chỗ cắt băng chính là điểm chạm.

Quy ra con số cho người chơi: điểm chạm chia đoạn chênh cao giữa bi và lỗ theo tỉ lệ khoảng cách của hai thứ tới băng.

```
drill 66 r0: bi (25, 62.5), lỗ giữa phải (50, 50), đường tâm bi chạm băng x = 1.125
khoảng cách tới đường đó: bi 23.9", lỗ 48.9"
điểm chạm = 50 + 12.5 × 48.9 / (23.9 + 48.9) = 58.4"
→ cách lỗ giữa 8.4" (≈ 2/3 kim cương) về phía bi
→ tức 1/3 quãng đường từ độ cao của bi xuống độ cao của lỗ
```

Các hệ ngắm khác (diamond halving, hệ của Freddy Bentivegna cho bank băng bên, equal-distance, two-to-one, crossing-lines) đều là cách tính điểm gương nhanh bằng mắt. Sau đó người chơi chỉnh theo bảng ở mục 1. Bàn nào bank ngắn hay dài thì phải đánh thử vài cú để biết.

## 3. Engine mình làm gì (đã đọc code)

`ShotPhysics.cushion()` chép nguyên `cushion()` của `docs/research/bi-cai-xoay.html`.

- Xung pháp tuyến `Jn = -(1+e)·vn` với e = 0,82 cố định, không phụ thuộc lực.
- Ma sát dọc băng `Jt` có μ = 0,14 tại điểm chạm cao sinE·R, với sinE = 0,27. Chỉ `Jt` đổi spin.
- **`Jn` không tạo mômen**, dù đặt tại điểm cao hơn tâm. Topspin đi qua băng gần như nguyên vẹn.
- Va chạm bi–bi (`hit`): có throw (`Fh`), nhưng bi mục tiêu được tạo bằng `Body(n:, p: o, v: h.obV)` nên `w` và `wz` bằng 0. **Không có spin do cắt.**
- Băng không lún, e không đổi theo tốc: đúng giả định băng cứng.

## 4. Đo bằng harness (dùng chính ShotPhysics của app)

Harness ở `/private/tmp/claude-502/-Users-vsf-phucth13-m-Documents-pool-training/5b9e4287-e885-4f0c-b57a-4d44402e7b61/scratchpad/bank/main.swift`.

Bi chạy 1 m/s tới băng. Góc tính từ pháp tuyến. "Sau trượt" là hướng và tốc độ khi bi đã lăn đều lại. Cột "+mômen" là biến thể cho `Jn` tạo mômen, dùng khối lượng hiệu dụng tại điểm chạm. Năng lượng sau va chạm vẫn dưới mức ban đầu (E 0,68–0,78), tức là hợp vật lý.

| Góc tới | Engine, bi lăn: ra / sau trượt / m/s | +mômen, bi lăn | Engine, bi stun | +mômen, bi stun |
|---|---|---|---|---|
| 0° | 0 / 0 / **0,30** | 0 / 0 / 0,77 | 0 / 0 / 0,59 | 0 / 0 / 0,68 |
| 10° | 7,8 / **21,5** / 0,32 | 6,7 / 8,7 / 0,77 | 8,7 / 7,8 / 0,58 | 13,1 / 6,7 / 0,68 |
| 20° | 15,8 / **39,1** / 0,36 | 13,6 / 17,5 / 0,76 | 17,6 / 15,8 / 0,57 | 25,7 / 13,6 / 0,66 |
| 30° | 24,2 / **52,2** / 0,42 | 21,1 / 26,6 / 0,75 | 26,7 / 24,2 / 0,56 | 37,4 / 21,1 / 0,63 |
| 45° | 42,3 / 68,7 / 0,58 | 37,3 / 44,2 / 0,76 | 42,3 / 39,5 / 0,54 | 55,5 / 37,3 / 0,61 |

Biến thể có mômen khớp xu hướng của mục 1: bi lăn ra gần gương, hơi ngắn; bi trượt ra ngắn hơn bi lăn. Engine hiện tại cho bi lăn ra quá rộng và gần như chết tốc.

Drill 66 r0, quét hướng ngắm, stun tipY −0,1:

| Lực | Kết quả |
|---|---|
| 1,4 và 1,8 m/s | Không hướng nào vào. Bi 1 dội băng rồi dừng ở x ≈ 26", vừa qua giữa bàn. |
| 2,34 m/s | 15 hướng vào. Điểm chạm băng y = 59,8", lệch gương +1,4". |
| 3,0 m/s | 31 hướng vào. Lệch gương +0,4". |
| 4,0 m/s | 36 hướng vào. Lệch gương −0,2". |

Bi 1 đi 24" tới băng. Ở 1,8 m/s nó hết trượt sau khoảng 16" (12v²/49μg), nên tới băng đã lăn đều và rơi đúng vào trường hợp engine làm mất 70% tốc độ. Góc tới ở drill 66 chỉ khoảng 10°, nên điểm chạm vẫn gần gương: **bài này hỏng vì tốc độ, không phải vì góc**.

Kiểm tra bằng lag (suy luận, chưa đo): lag thật đi một chiều dài rồi về gần đủ một chiều dài. Nếu bi lăn chỉ giữ 30% tốc qua băng, quãng về chỉ bằng khoảng 9% quãng còn lại, nghĩa là không ai lag được. Biến thể có mômen giữ 77% tốc, quãng về khoảng 60%. Số này gần thực tế hơn nhiều.

## 5. Khuyến nghị

**Chốt một việc:** thêm mômen của `Jn` vào `cushion()`, cả ở `ShotPhysics.swift` lẫn `docs/research/bi-cai-xoay.html` để harness và web còn khớp nhau.

- Sửa khoảng 3 dòng: `un` tính tại điểm chạm, chia cho khối lượng hiệu dụng `1 + |r×N|²/I`, và `om2` cộng thêm `r × (Jn·N)/I`. Biến thể trong harness ở trên chính là bản sửa này.
- Đây là **cửa nửa một chiều**. Code đổi lại được, nhưng tip, lực, zone và `rate` của mọi drill đang chép từ harness (`docs/chuan-drill.md` mục 6). Đổi băng là mọi cú có chạm băng sẽ lệch số cũ. Vì vậy trước khi sửa phải đo bàn thật một lần.
- Phép đo rẻ nhất có tính quyết định: lăn một bi thẳng vào băng dài, quay 240 fps, đọc tốc độ ngay trước và sau băng (bước 2 của `.claude/ke-hoach/2026-10-18-hieu-chinh-engine.md`). Engine hiện tại dự đoán tỉ lệ 0,30, bản sửa dự đoán 0,77. Kết quả cách xa nhau tới mức một lần đo là phân định được.

Sau khi sửa băng:

1. Chạy lại audit nhóm bank (27, 28, 66–69, 105, 109, 110). Kỳ vọng planner tìm được cú ở lực của thẻ.
2. Ô Aim/Thickness của cú bank lấy đích là điểm chạm băng, không phải lỗ. Thêm dòng "Rail: x diamonds from the side pocket". Đây là câu trả lời trên màn hình cho câu "làm sao biết".

Cố tình chưa làm:

- **Spin do cắt trên bi mục tiêu.** Hiệu ứng thật (Dr. Dave), nhưng cỡ vài độ, nhỏ hơn hẳn lỗi băng. Làm sau khi băng đúng.
- **Băng lún theo lực, e đổi theo tốc.** Chỉ quan trọng trên 2,5 m/s, mà phần lớn cú bank trong drill ở 1,5–2,5 m/s.
- Hiệu chỉnh μ và sinE theo bàn thật: thuộc kế hoạch hiệu chỉnh engine.

## 6. Đã kiểm và suy đoán

**Đã kiểm** (code và harness): công thức `cushion()` và `hit()`; mọi số ở mục 4; drill 66 ở 1,8 m/s dừng giữa bàn.

**Suy đoán:**

- Biến thể có mômen gần bàn thật hơn. Dựa trên xu hướng khớp mục 1 và phép tính lag, chưa có số đo bàn thật.
- Lỗi băng là nguyên nhân chính khiến cả nhóm bank lệch lực. Mới đo riêng drill 66.

**Không đọc được nguồn gốc:** lần này WebFetch tới drdavepoolinfo.com và billiards.colostate.edu bị từ chối (ECONNREFUSED/403). Bảng mục 1 lấy từ kết quả tìm kiếm của phiên trước, chưa đọc toàn văn.

## 7. Sau khi sửa băng

Băng mới, bi 1 m/s:

| Góc tới | Bi lăn: góc ra sau trượt, tốc giữ lại | Bi stun: góc ra, tốc giữ lại |
|---|---|---|
| 0° | 0°, 0,77 | 0°, 0,68 |
| 20° | 17,5°, 0,76 | 13,6°, 0,66 |
| 45° | 44,2° | 37,3° |
| 60° | 62,5°, 0,84 | 56,8° |

Bi lăn giờ ra sát gương, bi stun ra ngắn, đúng chiều mục 1. Năng lượng sau băng còn 0,68–0,78, không tăng.

Drill 66: 1,4 m/s chưa vào. Ở 1,8 m/s có 37 hướng ngắm vào lỗ, điểm chạm băng giữa dải là y = 57,9 (gương tính tay 58,4).

Audit lại 399 cú (cùng harness, so với kết quả ngay trước khi sửa):

- **Bank tốt lên:** lực planner về khớp lực trên card ở 66, 67, 68, 69 (2,34 → 1,8; 68 r4–r6 từ 4–5 → 2,34). Độ lệch đường bi: 27 r2/r3 5,5/7,1 → 0,6/0,3; 68 r3 12,3 → 2,5; 69 r3 46,6 → 4,9; 110 xuống dưới 1. 69 r4 giờ vào.
- **Kick, safety tốt lên:** 64, 65, 89, 111 lệch ≤ 2,2; 112 r1 75,6 → 6,9; 62 29 → 10,3.
- **26 drill rack/runout thụt thật:** 10, 12, 13, 14, 17–20, 23, 31, 40, 42–44, 87, 90–92, 96, 104, 108, 114, 117, 123, 129, 130. Bản cũ vào hết, bản mới gãy chuỗi ở một cú sau khi bi cái chạm băng (ví dụ 17 gãy ở cú 3). Lý do: tip, lực, zone các drill này chép từ rack-harness trên engine cũ, bi cái dội băng giờ ra chỗ khác. Chạy lại `sh scripts/rack-harness/run.sh 17` trên engine mới vẫn ra route 9/9 trong 25 s, chỉ khác số. Đây là việc chép lại số theo chuẩn drill mục 6, không phải lỗi engine.

## Nguồn

- Dr. Dave, bank/kick effects: https://drdavepoolinfo.com/faq/bank-kick/effects/
- Dr. Dave, fast-speed và sliding-ball bank: https://drdavepoolinfo.com/?p=1809
- BD tháng 2/2013, cut-induced spin trong bank: https://billiards.colostate.edu/bd_articles/2013/feb13.pdf
- BD tháng 5/2010: https://billiards.colostate.edu/bd_articles/2010/may10.pdf
- TP B.11, hệ gương so với số đo tốc cao: https://billiards.colostate.edu/technical_proofs/new/TP_B-11.pdf
- Mathavan et al., mô hình băng: https://dspace.lboro.ac.uk/2134/15087
- Mô hình 3D va chạm bi–băng: https://journals.sagepub.com/doi/10.1243/09544062JMES1964
- Trang bank/kick của Dr. Dave: https://www.engr.colostate.edu/~dga/pool/bank-kick/
- Diamond system: https://www.libertygames.co.uk/pool-diamond-system/
- AZB forum (giai thoại): https://forums.azbilliards.com/goto/post?id=1753814

## Câu hỏi còn mở

- Bàn anh tập là bàn 9 ft với băng loại gì? Câu này quyết định sinE và μ khi hiệu chỉnh.
