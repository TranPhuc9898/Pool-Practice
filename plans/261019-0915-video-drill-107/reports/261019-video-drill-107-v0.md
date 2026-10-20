# Kết quả v0: đọc video drill 107 (Margaret Fefilova)

Chạy ngày 2026-10-19 trên video `GrWQMQSqaHY` (1920×1080, 29.97 fps, 216.9 s). Lệnh:

```sh
PY=<env>/bin/python VIDEO=<thư mục>/GrWQMQSqaHY.mp4 OUT=<thư mục ra> sh scripts/video-harness/run.sh          # shots.csv, shots.png, track.csv
PY=… VIDEO=… OUT=… sh scripts/video-harness/run.sh calib    # kiểm homography, calib.png
PY=… VIDEO=… OUT=… sh scripts/video-harness/run.sh tip      # các đoạn ô điểm chạm, crop từng đoạn
```

Phân tích cả lượt mất khoảng 22 giây trên Mac. Hai thứ không nằm trong repo: env Python 3.9 có `opencv-python-headless` 5.0.0 và `numpy`, và file video tải bằng `yt-dlp`.

## Kết quả

12 cú, 12 vào. Bi cái được đặt bằng tay lúc đầu ở (L 3.91, W 1.55).

| cú | bi | tip_x | tip_y | bi cái dừng (L, W) | vào | bắt đầu (s) | dừng (s) |
|---|---|---|---|---|---|---|---|
| 1 | 1 | −0.33 | −0.55 | 3.00, 2.87 | ✓ | 14.6 | 20.4 |
| 2 | 2 | 0.00 | −0.62 | 4.47, 2.83 | ✓ | 30.8 | 35.2 |
| 3 | 3 | +0.28 | −0.56 | 2.35, 0.46 | ✓ | 44.7 | 50.3 |
| 4 | 4 | −0.29 | +0.46 | 3.68, 1.12 | ✓ | 64.0 | 69.7 |
| 5 | 5 | −0.29 | −0.55 | 2.77, 3.38 | ✓ | 79.8 | 85.2 |
| 6 | 6 | −0.28 | −0.52 | 3.36, 2.93 | ✓ | 96.7 | 102.2 |
| 7 | 7 | +0.08 | −0.60 | 2.28, 0.72 | ✓ | 113.0 | 118.3 |
| 8 | 8 | +0.01 | −0.43 | 3.20, 1.22 | ✓ | 132.2 | 137.6 |
| 9 | 9 | −0.42 | −0.69 | 1.34, 2.80 | ✓ | 153.5 | 159.0 |
| 10 | 10 | −0.35 | −0.57 | 3.16, 3.24 | ✓ | 169.7 | 174.6 |
| 11 | 11 | +0.38 | −0.62 | 1.61, 0.54 | ✓ | 187.2 | 192.2 |
| 12 | 12 | +0.01 | +0.40 | 6.62, 2.50 | ✓ | 206.7 | 213.5 |

Bản CSV ở `shots-GrWQMQSqaHY.csv`, ảnh top-down ở `shots-GrWQMQSqaHY.png`. Ảnh vẽ cùng hướng với camera, L=0 ở dưới: số k là chỗ bi cái dừng sau cú k, vòng rỗng là chỗ đặt tay lúc đầu.

Về điều bi, đây là đọc từ số chứ chưa phải kết luận huấn luyện. 10/12 cú đánh dưới tâm, khoảng −0.4 đến −0.7 R, chỉ cú 4 và cú 12 đánh trên tâm. Bi cái luôn được giữ trong vùng L 1.3–4.5 giữa bàn, chỉ cú cuối thả lên đầu bàn.

## Đối chiếu

| Tiêu chí | Kết quả | Kiểm bằng |
|---|---|---|
| `run.sh` exit 0, CSV đúng header | đạt | chạy `run.sh`, `run.sh calib`, `run.sh tip`, cả ba exit 0 |
| Số dòng bằng số cú thật | đạt, 12 | track bi cái có đúng 13 lần chạy: 1 lần đặt tay (4–6 s) và 12 cú. Ô overlay có 12 đoạn |
| `made` khớp từng cú | đạt, 12/12 | `verify-shots-1-6.jpg`, `verify-shots-7-12.jpg`: trước cú vòng đỏ nằm trên đúng bi, màu bi theo đúng thứ tự số; sau cú chỗ đó trống, vòng xanh nằm trên bi cái |
| Homography trung vị ≤ 0.1, tối đa ≤ 0.2 kim cương | đạt | leave-one-out trên 12 bi: trung vị 0.038, tối đa 0.119. Ảnh `calib-GrWQMQSqaHY.jpg` |
| tip lệch ≤ 0.15 R ở ≥ 5 cú | đạt, đọc mắt 12/12 | crop ô overlay từng đoạn (`run.sh tip`); tâm chấm tính bằng trọng tâm pixel, không phải đọc mắt |

## Giới hạn đã biết

- **Cú bi cái đứng tại chỗ:** cú mà bi cái dừng trong vòng 0.1 kim cương quanh chỗ ngắm (stop tại chỗ) không tách được. Script in "bỏ qua" và không ghi dòng cho cú đó. Video này không có cú nào như vậy.
- **Chỗ dừng lấy từ lúc ngắm cú sau:** luật drill chỉ cho đặt tay ở cú đầu, nên chỗ bi cái dừng sau cú k được lấy là chỗ nó đứng lúc bắt đầu ngắm cú k+1. Trượt mà người chơi đặt lại bi thì cột `cue_L, cue_W` sai. Video này không trượt cú nào.
- **Đơn vị tip:** suy đoán rằng mép vòng overlay là mép bi cái (±1 R), chưa đối chiếu với nguồn nào của poolbilliards.co.
- **Ngưỡng màu chỉnh tay:** các ngưỡng nỉ, trắng, chỗ đặt bi được chỉnh cho riêng video này, nằm trong `corners-GrWQMQSqaHY.json`. Video khác cần đo lại, nhất là chỗ nỉ tối sát băng.
- **Tâm chiếu trên mặt phẳng tâm bi:** homography fit từ tâm bi, nên L, W là toạ độ tâm bi. Viền bàn vẽ trong `calib.png` cũng nằm ở độ cao tâm bi, không phải mép nỉ.

## Chạy thử video Wojtek Szewczyk (`OmhTaPvX7eg`)

Video 1920×1080, 60 fps, 187 s. Đây không phải video góc cố định: camera gắn trên đầu, ống kính mắt cá, góc nhìn đổi liên tục và nhiều lúc không thấy hết bàn (`pov-OmhTaPvX7eg.jpg`). Homography và tracking bi cái không áp dụng được, nên `run.sh` mặc định và `run.sh calib` không chạy cho video này.

Phần đọc ô điểm chạm thì dùng được, chỉ cần đo lại vị trí ô (tâm (1750, 169), r = 100, nhỏ hơn video Margaret) trong `corners-OmhTaPvX7eg.json`, không sửa code. `run.sh tip` ra 12 đoạn có chấm, đọc bằng mắt 12/12 khớp (`tips-OmhTaPvX7eg.jpg`), kết quả ở `tips-OmhTaPvX7eg.csv`. Đoạn thứ k là bi số k chỉ là suy đoán vì chưa kiểm vào/trượt. Wojtek đánh trên tâm 4 cú (2, 3, 5, 8), Margaret chỉ 2 cú.

Kết luận về công đổi video: video góc cố định cần đo lại 4 góc và ngưỡng màu; video góc nhìn người chơi chỉ lấy được điểm chạm. Theo thumbnail, `C9XtSvquv2g` quay từ camera cố định cao nhìn dọc bàn, `B4unt0m5Xc0` cũng là góc nhìn người chơi. Bước sau nên chạy thử `C9XtSvquv2g` để trả lời đúng câu hỏi đó.

## Video camera cố định thứ hai (`eJldkCO6TeA`)

Video 1920×1080, camera cao nhìn xuống cùng kiểu với Margaret. Chỉ cần thêm `corners-eJldkCO6TeA.json`, trong đó có 4 góc, ô điểm chạm (65, 65) với r = 42, và ngưỡng trắng V ≥ 170: đầu bàn bên trái tối, bi cái ở đó chỉ sáng tới V ≈ 204, nên với ngưỡng 200 hai cú 9 và 10 bị mất. Sửa thêm `analyze.py` ở cú cuối: trước đây cú này không có đoạn overlay sau nên bị bỏ qua, và nếu đọc khung quá cuối video thì lỗi. CSV của Margaret chạy lại vẫn giữ nguyên.

Kết quả là 12/12 cú vào, bi cái đặt tay ở (3.97, 1.99). Dữ liệu nằm ở `shots-eJldkCO6TeA.csv`. Ba file `verify-eJldkCO6TeA-1..3.jpg` cho thấy chỗ bi mục tiêu trống sau cú và vòng xanh nằm đúng trên bi cái. `tips-eJldkCO6TeA.jpg` để đối chiếu 12 điểm chạm, đọc bằng mắt khớp 12/12. Đường đi của bi cái từng cú vẽ từ `track.csv` ra `paths-eJldkCO6TeA.png`, bằng script tạm ngoài repo.

| cú | bi | lỗ (suy) | góc cắt | tip x, y | bi cái dừng | cách bi kế |
|---|---|---|---|---|---|---|
| 1 | 1 | (8,0) | 29° | −0.21, −0.37 | 2.28, 2.88 | 0.92 |
| 2 | 2 | (0,0) | 27° | +0.07, +0.47 | 3.91, 1.80 | 3.28 |
| 3 | 3 | (8,4) | 31° | +0.25, −0.35 | 2.47, 1.55 | 0.94 |
| 4 | 4 | (0,4) | 22° | +0.20, +0.39 | 4.08, 1.22 | 1.76 |
| 5 | 5 | (8,0) | 32° | −0.20, −0.39 | 2.07, 3.38 | 1.58 |
| 6 | 6 | (0,0) | 4° | 0.00, −0.39 | 4.49, 1.34 | 2.68 |
| 7 | 7 | (8,4) | 64° | +0.23, −0.23 | 1.54, 2.58 | 0.83 |
| 8 | 8 | (0,0) | 20° | −0.18, −0.32 | 2.87, 1.56 | 2.14 |
| 9 | 9 | (8,0) | 37° | −0.21, −0.40 | 0.46, 2.51 | 0.53 |
| 10 | 10 | (0,0) | 32° | +0.11, +0.47 | 3.27, 3.33 | 1.32 |
| 11 | 11 | (8,4) | 19° | +0.24, −0.25 | 0.85, 1.13 | 1.06 |
| 12 | 12 | (0,4) | 27° | +0.10, +0.32 | 5.21, 2.43 | — |

Cột lỗ và góc cắt là suy đoán, vì script chưa track bi mục tiêu: chọn lỗ có góc cắt nhỏ nhất tính từ chỗ bi cái đứng. Cú 7 cắt tới 64° nên lỗ của cú này đáng ngờ nhất. Đường đi cú 11 có đoạn nhảy quanh bi sọc 11 nên chỉ tin được điểm đầu và điểm cuối.

### Mẫu đánh đọc được

- **Bi sát băng (1, 3, 5, 7, 9, 11):** cả 6 cú đều đánh dưới tâm, từ −0.23 tới −0.40 R, cộng phê ngang khoảng 0.2 R. Phê đối xứng gương theo dãy: dãy W0 (bi 1, 5, 9) phê trái, dãy W4 (bi 3, 7, 11) phê phải. Margaret đánh đúng mẫu này, chỉ kéo sâu hơn, từ −0.55 tới −0.69 R. Theo `paths-eJldkCO6TeA.png`, bi cái kéo chéo qua bàn, chạm băng dài đối diện ở khoảng L 1.5–3.6 rồi về dãy bi giữa, dừng cách bi kế 0.5–1.6 kim cương và vẫn còn góc cắt vào lỗ góc gần.
- **Bi dãy giữa (2, 4, 6, 8, 10, 12):** bi cái phải ra lại vùng giữa bàn, L 3–4.5, để có góc cho bi sát băng tiếp theo. Bốn cú có góc cắt 22–32° (2, 4, 10, 12) đánh trên tâm từ +0.32 tới +0.47 R để bi cái theo đường tiếp tuyến ra một hai băng. Cú 6 gần như thẳng (4°), đường tiếp tuyến không đưa bi đi đâu được, nên kéo về băng W4 rồi bật lên. Cú 8 cắt 20° vẫn kéo, đi qua băng đầu L0 rồi băng W4. Lý do cú 8 kéo là suy đoán: nếu đánh trên tâm, bi cái sẽ chạy vào đám bi 10 và 12 sát băng đầu.
- **Độ chính xác chỗ dừng:** sau bi sát băng, bi cái dừng gần bi kế, khoảng 0.5–1.6. Sau bi dãy giữa thì xa hơn, 1.3–3.3, vì bi sát băng chỉ cần có góc chứ không cần đứng gần.
