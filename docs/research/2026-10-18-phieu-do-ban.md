# Phiếu đo bàn cho hiệu chỉnh ShotPhysics — 2026-10-18

Bước 2–3 của `.claude/ke-hoach/2026-10-18-hieu-chinh-engine.md`. Mỗi lần đo ghi một dòng vào `scripts/calib-harness/do.csv`, rồi chạy `sh scripts/calib-harness/run.sh` để thấy `đo=` nằm cạnh `sim=`. Thứ tự đo: A → S → E → CD. Phiếu giả định bàn 9 ft (lòng bàn 100" × 50", bi 57,15 mm, R = 28,6 mm).

## Ghi số

```
test,lan,gia_tri,ngay
A,1,0.0103,2026-10-19
CD30+,4,66.5,2026-10-20
```

- `test` lấy một trong các giá trị `S A E CD30+ CD30- CD45+ CD45-`. `lan` đánh 1…10. `ngay` ghi dạng `YYYY-MM-DD`.
- Thập phân dùng dấu chấm. Chỉ cần một dòng sai là `run.sh` báo số dòng rồi dừng, không bỏ qua dòng lẻ.
- Dấu: S bỏ dấu, E âm (dưới tâm), CD dương.
- Chỉ ghi những cú qua cổng nhận của test đó. Cú hỏng thì bỏ hẳn, đừng ghi rồi gạch.

## Dụng cụ chung

- **iPhone quay Slo-mo 240 fps**, kẹp trên giá nhìn thẳng xuống. Đo chiều cao camera so với mặt nỉ, gọi là **H** (m).
- **Đồ đo**: băng keo giấy 2,5 cm, bút chì, thước dây cm, một ê-ke hoặc hộp cứng dựng đứng để chặn mép bi, phấn cơ, khăn lau bi.
- **Dấu trên bi cái**: vẽ bằng bút dạ kim, đo theo bề mặt bi bằng một dải giấy có vạch mm. Chấm tâm là điểm bi quay về phía cơ. Mỗi lần tip lệch tâm k·R thì vết chạm nằm cách chấm tâm một cung R·asin(k):

| k (phần R) | 0,1 | 0,2 | 0,3 | 0,35 | 0,4 | 0,45 | 0,5 | 0,55 | 0,6 |
|---|---|---|---|---|---|---|---|---|---|
| cung từ chấm tâm (mm) | 2,9 | 5,8 | 8,7 | 10,2 | 11,8 | 13,3 | 15,0 | 16,6 | 18,4 |

  Hai bên chấm tâm, theo xích đạo: chấm ở 11,8 mm (0,4R, cho CD) và 15,0 mm (0,5R, cho S). Xuống dưới, theo kinh tuyến: chấm ở 5,8 / 8,7 / 11,8 / 15,0 / 18,4 mm (cho E). Lau phấn cho sạch sau mỗi cú, vì vết phấn chính là chỗ tip chạm thật.
- **Cơ nằm ngang** hết mức có thể ở mọi test. Engine coi cơ nằm ngang, cơ dốc làm bi cong (swerve) và số đo lệch.

## Đọc số từ video

1. Chép file gốc sang Mac. Dùng AirDrop với Options → All Photos Data, hoặc dùng Image Capture. Kiểm tốc khung:
   ```bash
   ffprobe -v error -select_streams v:0 -show_entries stream=avg_frame_rate,r_frame_rate -of default=nw=1 IMG_0001.MOV
   ```
   Phải ra `240/1` ở cả hai dòng. Ra số khác nghĩa là file đã bị xuất lại, đừng dùng.
2. Tách khung quanh đoạn cần đọc, đoạn từ giây A tới giây B:
   ```bash
   mkdir khung && ffmpeg -ss A -to B -i IMG_0001.MOV -vf scale=960:-2 -q:v 3 khung/%04d.jpg
   ```
   Khung đánh số liên tiếp, hai khung kề nhau cách 1/240 s, nên thời gian = hiệu số khung / 240. Hai mốc cần đo hiệu phải nằm trong cùng một lần tách. Lệnh này đã kiểm trên file thử 240 fps: đoạn 0,1 s ra đúng 24 khung. Bản `ffmpeg` Homebrew trên máy không có filter `drawtext`, nên số khung đọc từ tên file chứ không in lên hình.
3. Mở `khung/` trong Finder, chọn file đầu, bấm Space rồi đi từng khung bằng phím mũi tên.
4. **Vị trí tâm bi trên một vạch kẻ**: bi đè lên vạch sẽ che mất một đoạn. Trung điểm đoạn bị che chính là hình chiếu tâm bi lên vạch. Chọn khung có đoạn bị che dài nhất.
5. **Lúc bi qua vạch** (dùng cho test A): lấy khung đầu tiên mà mép trước của bi chạm vạch. Mép đang chạy cắt qua vạch nên mốc này sắc hơn hẳn đoạn che dài nhất.

## A — cản lăn (μr)

- **Máng**: thanh nhôm chữ V dài khoảng 30 cm. Không có thì dùng hai thước thẳng dán song song, cách nhau 3 cm. Đầu dưới chạm nỉ, đầu trên kê lên vật cố định, dán băng keo giữ cả máng. Đánh một vạch thả trên máng; giữ bi bằng tấm bìa rồi rút bìa ra, đừng đẩy.
- **Độ cao kê**: chỉnh một lần sao cho bi dừng cách đầu máng 1,6–2,0 m, sau đó giữ nguyên cả 10 lần.
- **Vạch**: M1 cách đầu máng 30 cm, M2 cách M1 đúng 1,00 m. Cả hai vuông góc với đường lăn, kẻ bút chì trên băng keo. Tới M1 thì bi đã hết trượt (đây là suy đoán theo mô hình: bi rời máng chỉ trượt vài cm).
- **Camera**: đặt thẳng trên trung điểm M1–M2, khung hình thấy cả hai vạch.
- **Lăn**: 5 lần theo chiều head → foot, 5 lần theo chiều ngược lại. Nếu bàn nghiêng thì hai chiều sẽ lệch nhau, lấy trung bình thì triệt bớt phần nghiêng.
- **Đọc**:
  - n1 là khung mép trước chạm M1, n2 là khung mép trước chạm M2.
  - t12 = (n2 − n1)/240.
  - Lúc bi dừng, dựng ê-ke chạm mép trước bi rồi đo bằng thước: D1 từ M1 tới ê-ke, D2 từ M2 tới ê-ke (m).
- **Cổng nhận**: bi đi thẳng, không chạm băng, D2 ≥ 0,30 m.
- **gia_tri** = μr = 2·(√(D1 − δ) − √(D2 + δ))² / (9,81·t12²), trong đó δ = 0,0286 · 0,5 / H bù thị sai: mép bi nằm cao hơn nỉ 28,6 mm. Với H = 1,5 m thì δ = 9,5 mm.
  ```bash
  python3 -c 'from math import sqrt;D1,D2,dk,H=1.452,0.452,565,1.5;d=0.0286*0.5/H;t=dk/240;print(round(2*(sqrt(D1-d)-sqrt(D2+d))**2/(9.81*t*t),4))'
  ```
  Ví dụ trên ra `0.01`, tức 0.0100.
- **Vì sao dùng hai vạch**: lúc bi sắp dừng thì gần như không nhúc nhích, nên khung dừng sai ±0,3 s là chuyện thường. Sai như vậy lệch μr khoảng 10%. Công thức hai vạch không cần biết lúc dừng. Nó suy từ hãm đều, v² = 2a·(quãng còn lại), và khi D2 = 0 thì ra đúng 2d/(g t²) của harness.

## S — squirt

- **Đặt bi**: tâm bi cái nằm trên trục dọc bàn, mép trước bi cách mũi băng foot 80" (203,2 cm).
- **Ngắm**: cơ chạy dọc trục, nhắm kim cương giữa băng foot. Đặt một thước thẳng song song trục, sát tay cầu, làm ray dẫn cơ.
- **Kiểm hướng trước khi đo**: đánh 3 cú thẳng tâm. Trung bình lệch của 3 cú phải ≤ 0,3", chưa đạt thì chỉnh ray.
- **Đánh**: 5 cú phê phải, 5 cú phê trái. Tip nhắm chấm 15,0 mm trên xích đạo (0,5R). Lực vừa, khoảng 2 m/s: 10 cm đầu mất 10–16 khung. Squirt trong engine không phụ thuộc tốc, nên cổng tốc này để rộng.
- **Thước**: dán băng keo trên nỉ dọc băng foot, mép có vạch cm cách mũi băng 2,9 cm, đúng chỗ tâm bi khi áp băng. Số 0 nằm trên trục bàn. Camera đặt ngay trên số 0.
- **Đọc**: lấy khung bi áp băng sâu nhất. Đọc hai mép bi trên thước, lấy trung bình ra x (cm).
- **Cổng nhận**: vết phấn cách chấm tâm 13,3–16,6 mm, nằm trên xích đạo.
- **gia_tri** = |x| · (1 − 0,0286/H) / 2,54, đơn vị inch. Thừa số (1 − 0,0286/H) bù thị sai của mép bi.

## E — stop (tipY cho bi cái đứng ở 2 m/s)

- **Đặt bi**: hai bi trên một đường dọc bàn, khe giữa hai mép bi 20" (50,8 cm), tức tâm cách nhau 56,5 cm. Vẽ vạch V cách tâm bi mục tiêu 5,7 cm về phía bi cái; đó là chỗ tâm bi cái lúc chạm.
- **Đánh**: thẳng tâm ngang, dưới tâm, khoảng 2 m/s. Bắt đầu từ chấm 8,7 mm (0,3R).
  - Bi cái còn chạy theo thì hạ tip xuống khoảng 1,5 mm (0,05R).
  - Bi cái lùi thì nâng tip lên.
- **Camera**: thấy cả đoạn từ bi cái tới bi mục tiêu.
- **Cổng nhận**: hai điều kiện.
  - Bi cái nằm lại cách V ≤ 2 cm.
  - Từ khung đầu cơ chạm bi cái (n0) tới khung hai bi chạm nhau (n1) mất 56–84 khung, tương ứng 1,8–2,4 m/s.
- **Đọc**:
  - k = cung từ vết phấn tới chấm tâm, quy ra phần R theo bảng, nội suy tới 0,01.
  - t = (n1 − n0)/240.
- **gia_tri** = −k₂, với k₂ = 1 − √(1 − D²·k / (2·t²·(1 − k/2))) và D = 0,508 m.
  ```bash
  python3 -c 'from math import sqrt;k,dk=0.33,74;t=dk/240;D=0.508;print(-round(1-sqrt(1-D*D*k/(2*t*t*(1-k/2))),3))'
  ```
  Ví dụ trên ra −0.319.
- **Vì sao quy đổi**: tipY cần để bi đứng đổi rất mạnh theo tốc. Sim cho −0,38R ở 1,8 m/s và −0,23R ở 2,2 m/s, nên tay lệch ±10% tốc là đủ đẩy sd quá ngưỡng 15%.
  - Công thức trên quy mỗi cú đứng (k, t) về tipY tương đương ở 2 m/s. Nó lấy từ đúng mô hình trượt của `ShotPhysics`: tip lệch k cho phê 5k·v/2R, μs hãm đều.
  - Đã kiểm với `stunTip` ở 1,8 / 2,0 / 2,2 m/s: lệch ≤ 0,003R.
  - Vết phấn đọc sai ±1 mm thành sai ±0,03R, đây là nguồn sai lớn nhất của E. Con số này là ước tính, chưa đo.

## CD — băng có phê (góc khi lăn lại)

`run.sh` in góc lúc bi lăn đều trở lại sau băng: 68,1° / 49,1° / 74,9° / 68,7° (CD30+ / CD30− / CD45+ / CD45−). Góc ngay sau băng không đo được, vì bi rời băng còn trượt nên đường cong ngay (CD30+: dây cung 3–13 cm ra 59,1°, góc tức thời 43,0°). Sim cho bi lăn lại cách băng 7–11 cm, từ đó đường thẳng, nên hai dải 20 cm và 35 cm đọc đúng góc này.

- **Đặt bi** trên băng dài. Điểm chạm P là chỗ tâm bi áp băng, ở kim cương thứ 2 tính từ góc (63,5 cm). Bi vào từ phía góc, ra về phía lỗ giữa. Tâm bi cái đặt lùi 30" (76,2 cm) theo đường vào:
  - 30°: lùi 38,1 cm dọc băng, cách băng 66,0 cm.
  - 45°: lùi 53,9 cm dọc băng, cách băng 53,9 cm.
- **Vạch**: hai dải băng keo song song băng dài, cách tâm bi áp băng 20 cm và 35 cm, chạy từ 40 cm trước P tới 150 cm sau P. Vạch cm dọc dải, số 0 ngang P.
- **Camera**: đặt trên cao, thấy hết hai dải.
- **Đánh**: tipY 0, tip nhắm chấm 11,8 mm trên xích đạo (0,4R), lực sao cho tới băng còn khoảng 1 m/s.
  - Phê thuận (`+`) là phê cùng phía bi trôi dọc băng: bi trôi sang trái thì phê trái.
  - Phê nghịch (`−`) là phía ngược lại.
  - Squirt làm bi lệch khoảng 1" sau 30", nên ngắm bù bằng vài cú thử.
- **Đọc** (theo mục 4 ở trên):
  - Lượt vào: tâm bi cắt dải 35 cm ở a35, cắt dải 20 cm ở a20. Góc vào = atan(|a20 − a35| / 15).
  - Lượt ra: tâm bi cắt dải 20 cm ở b20, cắt dải 35 cm ở b35. Góc ra = atan(|b35 − b20| / 15).
  - Hai dải cùng cao độ nên thị sai triệt nhau, góc không cần bù.
- **Cổng nhận**: ba điều kiện.
  - Góc vào lệch không quá ±1,5° so với 30° hoặc 45°.
  - Lượt vào, tâm bi đi từ dải 35 cm tới dải 20 cm mất 37–46 khung ở 30°, 46–56 khung ở 45° (1 m/s ±10%).
  - Vết phấn cách chấm tâm 10,2–13,3 mm, nằm trên xích đạo.
- **gia_tri** = góc ra, đơn vị độ.
