# Phase 1: Đo chuỗi trên harness

Status: done

## Việc
- Harness `scratchpad/h107/` (bản sao ShotPhysics, mode `fit` đã có). Thêm mode `chain`: bắt đầu từ bàn round 1, mỗi cú k dựng `Setup` với bi cái ở chỗ engine dừng sau cú k−1, bi mục tiêu và các bi còn lại lấy từ kết quả engine, lỗ theo guide round k, tip theo `contactPoint`, lực `playSpeed`, ngắm tự động (`runWith` aim nil) như `toggleReplay`.
- In mỗi cú: vào/trượt, bi cái rơi không, chỗ dừng, lệch so với chỗ video của round k+1 (kim cương), và `shotOf` có ra `.bad` không (guard trong `toggleReplay` chặn lặng lẽ).
- Có cú vỡ: fit tuần tự, mỗi cú quét lực 1.0–6.0 bước 0.05 từ chỗ dừng thật, chọn lực vào sạch và gần chỗ video kế nhất. Ghi `playSpeed` mới.

## Xong khi
Bảng 12 dòng ra màn hình, 12/12 vào sạch khi chạy nối. Không đạt 12/12 thì dừng, báo anh cú nào vỡ và vì sao.

## Rủi ro
Harness là bản sao, lệch với bản native nếu ShotPhysics đổi sau lần sync. Sync lại trước khi đo.

## Kết quả
beam2 có ràng buộc bền: 12/12 vào khi lệch ±0.1 m/s và làm tròn 4 số, sai trung bình 0.44 kc, lớn nhất 2.05 ở bi 3. Ghi `playSpeed` mới và `playCue` cho round 2–12. Từ vị trí video chỉ vào 9/12 (trượt 2, 3, 10), nên Previous/Next dựng bàn từ `playCue`.
