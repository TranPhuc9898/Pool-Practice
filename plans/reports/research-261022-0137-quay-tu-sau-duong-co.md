# Đặt máy sau lưng, trên đường cơ: đo được gì, Vision có bắt được khuỷu không

Làm lúc 2026-10-22 01:45. Gốc từ khung TikTok anh gửi (@99billiardscs6, video 7648411658997615890).

## Kết luận

- Đặt máy sau lưng trên đường cơ thì đo được cẳng tay có nằm trong mặt phẳng đứng của cú đánh không, tức khuỷu có nằm ngay trên cơ hay chĩa ra ngoài. Phép đo này chỉ cần khuỷu và cổ tay, không cần vai.
- Góc này không thay được góc bên hông. Từ sau lưng, cẳng tay lắc trước sau theo hướng ống kính nên không thấy "vuông góc lúc chạm". Hai góc đo hai thứ khác nhau.
- Trên khung TikTok, Vision thấy người đang cúi cơ với khuỷu 0.74, cổ tay 0.86, vai 0.44. Cách chọn người của app chọn đúng người chơi. Đây mới là một khung ảnh chụp màn hình 311x644, chưa phải máy anh.

## Bằng chứng

### Vision trên khung anh gửi (đã chạy)

| Người | Mũi | Vai phải | Khuỷu phải | Cổ tay phải |
|---|---|---|---|---|
| Người chơi đang cúi cơ | 0.70 | 0.44 | 0.74 | 0.86 |
| Người đứng phía sau | 0.85 | 0.73 | 0.63 | 0.15 |

- `scripts/pose-harness/run.sh` (code chọn người của app) chọn người chơi: `2 người vai ok khuỷu ok cổ tay ok mũi ok | cẳng tay -12° so với dọc | mũi (0.53, 0.43)`.
- Phóng ảnh lên 3 lần thì số gần như không đổi. Độ phân giải không phải chỗ nghẽn ở khung này.
- Con số -12° không có nghĩa là lỗi tay. Máy quay của câu lạc bộ đặt cao, chúc xuống và lệch sang phải đường cơ, nên đường thẳng đứng trên ảnh bị nghiêng. Cũng không biết khung này rơi vào lúc nào trong cú.
- Ảnh đối chiếu: `/private/tmp/claude-502/-Users-vsf-phucth13-m-Documents-pool-training/74507300-c344-4e47-bf9d-72996f777f33/scratchpad/front-probe/crop-shooter.png`.

### Nguồn

- Dr. Dave, thread [Is this Stroke Crooked … or is it Camera Parallax?](https://forums.azbilliards.com/goto/post?id=6538426), post #20: "The forearm does need to be in the plane of the shot for a straight stroke", và "the upper arm and shoulder do not need to be in the plane". Cùng thread, post #3: "it is extremely difficult to get the camera aligned perfectly straight". Máy đặt gần bàn thì hiệu ứng lệch càng rõ.
- Bob Jewett, thread [Video Tape From Behind The Shooter](https://forums.azbilliards.com/goto/post?id=6824356): "the view from behind is valuable. It is the best for some parts of the mechanics", và "If it is not in the line of the shot, a straight stroke may look crooked". Cùng thread, Scott Lee cho rằng góc bên hông "shows everything", còn góc sau lưng thì "helpful, but it's definitely not mandatory".
- Cột Billiards Digest tháng 3/2024 của Dr. Dave ([PDF](https://billiards.colostate.edu/bd_articles/2024/march24.pdf)) quay cú draw thẳng từ bên hông, cú follow thẳng từ sau lưng, bằng điện thoại trên chân máy. Em chỉ đọc được qua tóm tắt của kết quả tìm kiếm vì PDF trả 403. Chưa kiểm trực tiếp.

## Máy lệch khỏi đường cơ thì sai bao nhiêu (suy ra bằng hình học, chưa đo)

- Khi máy dựng đứng, mọi đường thẳng đứng ngoài đời vẫn hiện thẳng đứng trên ảnh, dù máy lệch ngang bao nhiêu. Vì vậy độ nghiêng ngang của cẳng tay so với dây dọi trọng lực vẫn đọc đúng. Hiện tượng "cơ nhìn như cong" mà Dr. Dave nói là chuyện của cây cơ (gần nằm ngang, chĩa về phía máy), không phải của cẳng tay.
- Khi máy lệch khỏi đường cơ một góc α, cẳng tay lắc trước sau một góc p sẽ hiện thêm độ nghiêng ngang giả xấp xỉ atan(tan p · sin α):

| p (lắc trước sau) | α = 10° | α = 20° |
|---|---|---|
| 5° (gần address, gần lúc chạm) | 0.9° | 1.7° |
| 25° (cuối backswing) | 4.6° | 9.1° |

- Chỉ nên chấm lúc address, khi tay đứng yên và p gần 0. Chấm suốt cả cú thì sai số lúc backswing lên tới 9°, gần bằng dung sai ±10°.

## App hiện tại xử lý góc sau lưng thế nào (đọc code, chưa chạy trên máy)

- `PoseFrame.hasArm` cần cả vai, khuỷu và cổ tay ≥ 0.4 (`modules/pool-table/ios/Pose/PoseFrame.swift:27`), `StrokeTracker.push` cũng vậy (`modules/pool-table/ios/Pose/PoseStroke.swift:110`). Vai là khớp yếu nhất ở cả log 00:47 (cao nhất 0.41) lẫn khung TikTok (0.44).
- Góc cẳng tay live là góc khuỷu→cổ tay so với trọng lực trên ảnh. Đặt máy sau lưng thì số này chính là độ nghiêng ngang, nên tay vàng/trắng ±10° chạy được mà không cần sửa code, miễn vai qua 0.4.
- Phát hiện cú và lúc chạm dựa vào việc cổ tay chạy trước sau trên ảnh. Từ sau lưng, cổ tay chạy theo hướng ống kính nên không bắt được cú, và Scoreboard sẽ trống.

## Cách kiểm rẻ nhất, không cần build

1. Dựng máy đứng (tilt dưới 12°) sau lưng anh, trên đường cơ kéo dài, cách 1,5–2,5 m, cao ngang khuỷu.
2. Vào thế cơ, đứng yên 30 giây. Log `[pose] arm` cho biết số giây khuỷu và cổ tay ≥ 0.4, và tách riêng số giây vai qua 0.4.
3. Nhìn tay trên overlay có lên màu vàng/trắng không.

## Nếu kiểm đạt (chờ anh chốt, chưa làm)

- Số cẳng tay live chỉ cần khuỷu và cổ tay. Vai vẫn giữ cho phát hiện cú ở góc bên hông.
- Thêm cách đặt máy "Behind", cạnh hai lựa chọn Front/Back và Right/Left đang có. Ở chế độ này chỉ chấm lúc address.

## Câu hỏi còn mở

- "Vuông góc" anh cần là cẳng tay đứng dọc lúc chạm (góc bên hông), khuỷu nằm trên đường cơ (góc sau lưng), hay cả hai?
- Ngưỡng nghiêng ngang chưa có nguồn nào cho số cụ thể. Mức ±10° hiện tại mượn từ phương trước sau.
- Khung TikTok quay bằng camera câu lạc bộ dưới đèn sáng. Camera trước iPhone dưới đèn ban đêm có thể ra số thấp hơn, phải kiểm bằng bước trên.
