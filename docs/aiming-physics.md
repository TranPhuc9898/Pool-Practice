# Vật lý ngắm bida

Tài liệu gốc cho Aim view trong app và trang mô phỏng Aim Lab: https://claude.ai/artifact/94LUmxx7JErbsZiFffhZTL (private, mở bằng tài khoản chủ).

Code tham chiếu: `src/pool-engine/aim.ts` và `modules/pool-table/ios/Aim/PoolAimView.swift` (hai bên mirror nhau). Bộ mô phỏng đầy đủ (throw, squirt, đường bi cái) hiện chỉ có trong Aim Lab, khối `PHYSICS` trong file HTML.

## 1. Quy ước

| Thứ | Giá trị |
|---|---|
| Mặt chơi | 50 × 100 inch (bàn 9 ft) |
| Bi | đường kính D = 2.25", R = 1.125" |
| Toạ độ drill | `x` 0…1 theo chiều 50", `y` 0…1 theo chiều 100", foot ở `y = 0` |
| Lỗ | footLeft (0,0), footRight (50,0), sideLeft (0,50), sideRight (50,50), headLeft (0,100), headRight (50,100), đơn vị inch |
| Điểm đặt đầu cơ | `contactPoint` −1…1 theo bán kính, `y > 0` là phía trên tâm |
| Vẽ bàn dọc (app, Aim Lab) | màn `x·50`, `y·100`, y hướng xuống: foot ở trên, footRight góc trên phải. Aim Lab tính vật lý ở hệ ngang `X = (1 − y)·100`, `Y = x·50` rồi quay 90° khi vẽ |

## 2. Ngắm

```
û       = unit(lỗ − O)          O: tâm bi mục tiêu
ghost   = O − 2R·û              tâm bi cái lúc chạm
contact = O −  R·û              điểm chạm trên bi mục tiêu
φ       = góc giữa (ghost − C) và û       C: tâm bi cái
```

- Ngắm tâm bi cái vào **tâm ghost**, không vào điểm chạm. Ngắm vào điểm chạm luôn cho cú mỏng hơn cần.
- Nhìn dọc đường ngắm, tâm ghost lệch khỏi tâm bi mục tiêu `k = 2·sinφ` bán kính. Điểm chạm lệch `sinφ` bán kính.
- Độ dày (fullness) = `1 − sinφ`.
- Độ nhạy: lệch điểm ngắm δ làm góc cắt đổi khoảng `δ / (2R·cosφ)`. Ở 60° gấp đôi cú thẳng, ở 75° gần gấp 4.

| Độ dày | φ | k (điểm ngắm) |
|---|---|---|
| Full | 0° | tâm |
| ⅞ | 7.2° | 0.25R |
| ¾ | 14.5° | 0.5R |
| ½ | 30° | mép bi |
| ¼ | 48.6° | ngoài mép 0.5R |
| ⅛ | 61° | ngoài mép 0.75R |

### Tâm bi trắng đặt ở đâu

Điểm chạm cho trước thì tâm bi trắng lúc chạm (ghost) là: kẻ từ lỗ qua tâm bi mục tiêu, qua điểm chạm, đi thêm **một bán kính** nữa. Ghost, điểm chạm, tâm bi mục tiêu thẳng hàng, mỗi đoạn dài R.

Nhìn từ sau bi cái, ngang tầm bi: ghost chồng lên bi mục tiêu một dải rộng `2R·(1 − sinφ)`, đúng bằng độ dày. Điểm chạm nằm **giữa dải chồng**, không nằm ở mép. Cú ½ ball: dải rộng R, mép ghost chạm đúng tâm bi mục tiêu.

### Canh ngoài đời

1. Đứng sau bi mục tiêu, nhìn từ lỗ về: điểm chạm là chỗ đường lỗ → tâm bi đâm ra phía sau bi.
2. Lùi thêm nửa bi từ điểm chạm, chọn một vết trên vải (hạt bụi, sợi nỉ) đúng chỗ đó. Đó là tâm ghost.
3. Về sau bi cái, ngắm tâm bi cái vào vết đó, không ngắm vào điểm chạm.
4. Kiểm bằng độ dày: ghost tưởng tượng phải che bi mục tiêu đúng phần `1 − sinφ` (¾, ½, ¼).
5. Tập ba mốc ¾ (14.5°), ½ (30°), ¼ (48.6°) cho thuộc mắt, các góc khác nội suy.

Aim Lab vẽ cả hai góc: "Nhìn từ trên" (ghost, điểm chạm, hai đoạn R, cung φ, k) và "Nhìn từ sau bi cái" (dải chồng tô gold, chấm điểm chạm giữa dải).

## 3. Bi cái sau va chạm

Va chạm gần đàn hồi: bi cái mất vận tốc dọc đường nối tâm, giữ phần tiếp tuyến `v·sinφ`. Spin dọc giữ nguyên, rồi ma sát vải bẻ cong đường đi (parabol) tới khi lăn đều.

```
W      = f·v·ê                  roll vector: f = 1 lăn đều, 0 stun, < 0 draw
v_cuối = 5/7·v_sau + 2/7·W      sau khi hết trượt
f lúc rời đầu cơ = 2.5·h/R      cơ ngang, h = độ cao điểm đặt so với tâm → h = 0.4R lăn đều ngay

30° rule (bi lăn): tan θc = sinφ·cosφ / (sin²φ + 2/5)
θc lớn nhất 33.7° ở φ = 28.1°, nằm trong 27…34° từ ¾ tới ¼ ball
```

Trên vải, slip `v − W` giảm đều; bi trượt hết sau quãng `12·v² / (49·μs·g)` nếu xuất phát từ stun. Ví dụ 1 m/s: khoảng 12 cm. Nghĩa là đánh tâm bi mà bi mục tiêu cách 30 cm thì tới nơi đã lăn đều, không còn stun. Muốn stun ở xa phải đặt thấp hơn tâm.

## 4. Throw

Mô hình Alciatore (TP A.14). Hằng số kiểm lại qua mã nguồn pooltool.

```
t̂          = vuông góc đường nối tâm
slip_ngang = v·t̂ + R·ωz         (R·ωz = 2.5·tipX·v0, phê phải dương)
slip_dọc   = W·n̂
μ(s)       = 0.00995 + 0.108·exp(−1.088·s)        s: tốc độ trượt, m/s
Jn         = (1+e)/2 · v·n̂,  e = 0.95
F          = min(μ·Jn, |slip|/7)
throw      = atan(F·slip_ngang/|slip| ÷ Jn)
```

Số mô hình ra (Aim Lab, ½ ball, 1 m/s, squirt tắt):

| Điểm đặt | Throw |
|---|---|
| Gần stun, không phê | 4.3° |
| Lăn đều, không phê | 1.3° |
| Inside 0.1R / 0.3R / 0.5R | 3.5° / 2.3° / 1.6° |
| Outside 0.1R | 2.0° |
| Outside ≈ 0.17R (gearing) | 0° |
| Outside 0.3R | 3.8°, đổi chiều (bi dày lên) |

Tốc độ (stun, ½ ball): 2 m/s còn 2.4°, 3 m/s còn 1.5°. Đánh chậm throw nhiều hơn.

Kết luận dùng được:

- Cú cắt stun chậm là cú bị throw nặng nhất. Ngắm dày hơn ghost một chút.
- Follow hoặc draw cắt throw còn khoảng ⅓, vì mặt tiếp xúc trượt theo chiều dọc chia bớt ma sát.
- Outside english trừ throw, đúng gearing thì về 0, quá tay thì đổi chiều.
- Inside english **không** cộng dồn throw như hay nói: phê nhiều thì tốc độ trượt lớn, μ giảm, throw còn tụt. Nó vẫn khó vì squirt và throw cùng đẩy về một phía.
- Cú thẳng có phê: không có throw do cắt, phê trái đẩy bi mục tiêu sang phải và ngược lại.

## 5. Squirt và swerve

- Squirt: bi cái lệch **ngược** phía phê ngay khi rời đầu cơ. Mô hình tuyến tính `squirt = squirtMax · tipX/0.5R`. Mặc định 2.5° cho shaft thường, khoảng 1.2° cho low-deflection.
- Bù: ngắm dịch về phía phê (back-hand english).
- Swerve: cơ dốc thì bi cong dần về phía phê, bù lại một phần squirt khi đi xa và chậm. **Chưa mô phỏng.**

## 6. Bảng tình huống

| Tình huống | Bi mục tiêu | Bi cái | Ngắm |
|---|---|---|---|
| Thẳng, stun | Thẳng | Dừng | Tâm vào tâm, đừng đặt phê |
| Thẳng, follow | Thẳng | Chạy theo; vào lỗ góc thẳng hàng là scratch | Tâm vào tâm |
| Thẳng, draw | Thẳng | Kéo về | Tâm vào tâm; bi xa cần thấp và mạnh hơn |
| ½ ball, stun, chậm | Mỏng đi ~4° | Tangent 90° | Dày hơn ghost |
| ½ ball, lăn | Mỏng đi ~1.3° | ~34° so với hướng ban đầu | Gần ghost |
| ½ ball, draw | Throw ít | Bẻ ra sau tangent | Gần ghost |
| Cắt, outside | Giảm, 0 ở gearing | Như không phê tới khi chạm băng | Bù squirt |
| Cắt, inside | Vẫn cao | Như không phê tới khi chạm băng | Dày hơn và bù squirt |
| Mỏng > 60° | Throw nhỏ, sai số hẹp | Gần như giữ hướng | Ngắm ngoài mép |

## 7. Hằng số

| Hằng số | Giá trị | Trạng thái |
|---|---|---|
| μ trượt vải | 0.2 | giá trị thường dùng trong mô phỏng |
| μ lăn vải | 0.01 | như trên |
| e bi–bi | 0.95 | như trên |
| e bi–băng | 0.8 | ước lượng thô |
| μ bi–bi | công thức mục 4 | đã kiểm qua mã pooltool |
| Squirt tối đa | 2.5° / 1.2° | **ước lượng**, trang nguồn trả 403 lúc kiểm |
| Sai số lỗ | ±1.2" góc, ±1.4" giữa | **ước lượng** |

## 8. Đã kiểm và chưa kiểm

Đã kiểm:

- Công thức và đỉnh 30° rule: khớp nguồn Dr. Dave. Aim Lab ra 33.9° ở ½ ball, 33.1° ở 28.1° (sai lệch do bi chưa lăn hoàn toàn đều sau vài inch).
- Hằng số μ bi–bi: khớp mã pooltool.
- Throw ½ ball stun 1 m/s ra 4.3°. Em nhớ TP A.14 cho khoảng 4 đến 5°, nhưng chưa mở được PDF để đối chiếu đồ thị.

Chưa kiểm:

- Độ lớn squirt.
- Đường cong throw theo inside english trong mục 4 là số của mô hình; chưa so với đồ thị gốc.

## 9. Chưa mô phỏng

- Swerve, cơ dốc, nhảy bi.
- Phê tác động lên góc bật băng (running, reverse english). Sau băng bi coi như lăn đều ngay, phê ngang còn một nửa.
- Phê giảm dần trên vải.
- Chế độ Phân tích: bi cái chạm lại bi mục tiêu sau cú đầu. Chế độ Chơi có xử lý (mục 9b).
- Miscue: Aim Lab chặn điểm đặt ở 0.55R.

## 9b. Chế độ Chơi (Aim Lab)

Bấm trúng bi trắng hoặc bi mục tiêu thì kéo bi đó đặt đâu cũng được (ball in hand). Bấm lỗ để đổi lỗ đích. Kéo ở chỗ trống: cơ xoay theo ngón tay quanh bi cái, kéo xa thêm để tăng lực, thả là bắn. Phím ← → chỉnh 0.1°, Shift 1°, Space bắn. Bi rơi lỗ thì về chỗ nó đứng trước cú bắn.

"Xếp ngẫu nhiên": cắt dưới 70°, hai bi cách nhau ít nhất 10", chọn lực nhỏ nhất trong 1.8 / 2.5 / 3.2 / 4 m/s mà cú chuẩn vào thật khi chạy bằng game, bi cái không rơi.

| Thứ | Giá trị | Trạng thái |
|---|---|---|
| Lực theo độ kéo | `0.4 + kéo/18" · 4.6` m/s, trần 5 m/s | tự chọn cho dễ tay |
| Bước mô phỏng | 0.5 ms, thời gian chạy 1.5× | tự chọn |
| Va chạm bi–bi | cùng `collide` (throw, mục 4), lùi về đúng thời điểm chạm rồi mới tính | **đã kiểm**: hướng bi mục tiêu khớp `shoot()` trong 0.001°, vào/không vào khớp ở lệch 0°, ±0.6°, 1.5° |
| Bắt lỗ | vào miệng lỗ (4.4" góc, 3.4" giữa), đường đi cách tâm lỗ dưới sai số mục 7 và đang hướng vào lỗ → rơi; không thì bật băng | **ước lượng**, cùng luật với `shoot()` |
| Lăn sát băng vào lỗ góc | chạm băng mà đường đi đang trỏ vào lỗ góc trong sai số → không dội, lăn vào | ước lượng |
| Lỗ giữa, bi xiên | góc tới so với băng dưới 19.3° (sin = R/3.4) → đập má, không vào; áp cho cả `shoot()` | ước lượng |
| Bật băng | `v · 0.8` | ước lượng thô |
| Bi dừng | `|v| < 0.3"/s` và gần như hết trượt | tự chọn |

Ba mức gợi ý: đủ (đường đi, throw, squirt, so với cú chuẩn), chỉ ghost, tắt. Sau mỗi cú báo: vào, scratch, vào nhầm lỗ, đúng hướng thiếu lực, cắt nhầm phía, hoặc mỏng/dày bao nhiêu độ, kèm độ lệch đường cơ so với cú chuẩn tính bằng độ và mm tại bi mục tiêu.

Game xử lý được double hit (bi cái dội băng rồi đụng lại bi mục tiêu), `shoot()` thì không. Gặp thế bi mục tiêu sát băng, hai bên có thể cho kết quả khác nhau; tin game.

Kiểm bằng node: 200 thế ngẫu nhiên, bắn cú chuẩn trong game vào 200/200. Trước khi sửa hai luật trên chỉ vào 121/200 vì bi lăn sát băng bị dội ra.

Bỏ cố ý: chỉ một bi mục tiêu, không phê lên băng, không swerve.

`shoot()` từng dừng vẽ đường bi cái khi vận tốc dưới 0.4 m/s. Cú draw thẳng làm bi cái gần như đứng yên ngay sau va chạm nhưng vẫn còn backspin, nên đường bị cắt cụt và chỗ dừng lệch game tới 36". Giờ điều kiện dừng giống `stepWorld`: cả vận tốc lẫn slip phải dưới 0.3.

## 9c. Bộ 20 drill (Aim Lab, bài 11–30)

Bốn nhóm: ngắm (11–19), điều bi trắng (20–26), vị trí 9-ball (27–30). Mỗi bài có toạ độ diamond để xếp ngoài đời, một cú gợi ý (tip, m/s), một zone bi trắng nếu có, và một ngưỡng đạt trên 10 cú.

- Dạng bài lấy từ nguồn ở mục 10. Toạ độ cụ thể là Aim Lab tự đặt, vì trang hình của Dr. Dave bị chặn DNS ở máy này.
- Tip và lực được dò bằng chính mô hình, chọn cú vào lỗ và để bi trắng dừng gần đích nhất. Zone đặt ở chỗ bi trắng thật sự dừng trong game. Bài vị trí còn phải để lại cú bi kế cắt 5–35°, cách 12–40".
- Kiểm bằng node: cả 20 bài đều vào lỗ, bi trắng nằm trong zone ở cả `shoot()` lẫn game.
- Bi kế (bài 27–30) chỉ là mốc, không có va chạm.

## 10. Nguồn

- Dr. Dave, 30° rule: https://drdavepoolinfo.com/FAQ/30-90-rules/30-degree-rule/
- Tóm tắt 30° rule: https://billiards.colostate.edu/resource_files/30-degree-rule_summary.pdf
- TP A.14, throw: https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf
- pooltool, friction bi–bi: https://pooltool.readthedocs.io/en/latest/_modules/pooltool/physics/resolve/ball_ball/friction.html
- pooltool, 30 degree rule: https://pooltool.readthedocs.io/en/latest/examples/30_degree_rule.html
- Squirt: https://www.engr.colostate.edu/~dga/pool/squirt
- Billiards Digest, Bob Appleton (no-rail, rotation pattern): http://www.billiardsdigest.com/showinstruction.php?id=124
- Billiards Professor, 9-ball practice patterns: https://billiardsprofessor.com/intermediate/practice-patterns-9-ball/
- Billiard University Exam I (F2 stop, F4 draw, F5 stun): bài 20–23. Spot shot, frozen-rail cut, wagon wheel, endless position, nine-on-the-spot là bài phổ biến, lấy theo mô tả từ kết quả tìm kiếm.
