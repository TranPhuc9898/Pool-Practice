# Vision và MediaPipe trên khung Stance Check thật

Ngày 26/10/2026. Đây là số đo cho câu hỏi "vì sao app không bắt được cẳng tay và tay sau".

## Kết luận

Lỗi nằm ở model dò khớp. Lớp vẽ không sai. Ở tư thế đứng sát camera trước, tay buông dọc, Vision gần như không ra cổ tay. MediaPipe lite chạy trên đúng các khung đó thì ra cổ tay ở khoảng 3/4 số khung, và đường cẳng tay khớp với cẳng tay trong ảnh. Hạ ngưỡng tin cậy của Vision không cứu được, vì cổ tay thường về đúng 0.00, không phải lơ lửng quanh ngưỡng.

## Cách đo

- **Nguồn:** ba bản quay màn hình Stance Check trong `~/Downloads`, quay ngày 21 và 22/10 (`ScreenRecording_10-21-2026 15-32-32_1.MP4`, `10-22-2026 01-45-24_1.MP4`, `10-22-2026 02-14-53_1.MP4`).
- **Khung:** cắt vùng preview camera, lấy 1 khung mỗi giây, tổng 103 khung.
- **Vision:** `VNDetectHumanBodyPoseRequest` trên macOS, cùng request app đang dùng. Ngưỡng 0.4, như `PoseStroke.minConfidence`.
- **MediaPipe:** `pose_landmarker_lite` 0.10.14 ở chế độ IMAGE, cùng model với demo web đã duyệt. Ngưỡng visibility 0.5.
- Script và ảnh nằm trong scratchpad của phiên, ở các thư mục `arm-study/` và `pose-demo/compare.html`.

## Số đo

Số khung thấy cả khuỷu lẫn cổ tay của tay gần camera:

| Bản quay | Vision, khuỷu và cổ tay ≥ 0.4 | MediaPipe, khuỷu và cổ tay ≥ 0.5 |
|---|---|---|
| 21/10, văn phòng, đứng xa hơn | 11/39 | 33/39 |
| 22/10 01:45, sát camera | 1/21 | 17/21 |
| 22/10 02:14, sát camera, cúi kéo cơ | 1/43 | 31/43 |

- **Vision ở bản 02:14:** khuỷu trái thường đạt 0.4 đến 0.65. Cổ tay trái về 0.00 ở 30/43 khung. Có 10/43 khung không ra người nào.
- **MediaPipe ở cùng bản:** cổ tay trái từ 0.73 đến 0.97 ở phần lớn khung. Em đã vẽ toạ độ của MediaPipe lên 4 khung để kiểm bằng mắt, và đường khuỷu–cổ tay nằm dọc đúng cẳng tay đang buông.

## Tay sau

Ở tư thế này tay sau bị thân che. Hai model đều không thấy nó:

- Vision cho khuỷu và cổ tay phải dưới 0.3 ở gần như mọi khung.
- MediaPipe cho visibility từ 0.1 đến 0.6, và toạ độ đoán ra nằm chồng lên nắm tay của tay trước.

Vẽ tay sau chỉ ra một nét sai đè lên tay cơ, đổi model cũng vậy. Nên bỏ vẽ tay sau, chỉ giữ tay cơ, thân và chân.

## Giới hạn của phép đo

- Khung lấy từ bản quay màn hình đã nén lại, có dính chấm mũi trắng của overlay cũ. Buffer thật của app là 640×480, chất lượng sạch hơn. Em đoán chênh lệch này không lật được kết quả 1/43 so với 31/43, nhưng chưa đo trên buffer thật.
- Vision chạy trên macOS. Em chưa so với Vision trên iPhone, phần này cũng là đoán.
- MediaPipe chạy trên web (WASM). Bản iOS (`MediaPipeTasksVision`) dùng cùng file model, nhưng tốc độ và ms mỗi khung trên iPhone thì chưa đo.

## Hướng sửa

Thay Vision bằng MediaPipe Pose Landmarker iOS cho Stance Check, dùng model lite. Tay sau không vẽ.

Hướng này đi ngược mục "Không thêm MediaPipe vào app" trong `plans/261026-1500-skeleton-stance-check/plan.md`. Anh phải duyệt trước khi làm. Đây là cửa một chiều vừa phải:

- Thêm một pod native và khoảng 5–6 MB model.
- Đo cú (`PoseStroke`, `PoseRear`, harness) đang dựa trên toạ độ và độ tin cậy của Vision, nên phải hiệu chỉnh lại ngưỡng.
