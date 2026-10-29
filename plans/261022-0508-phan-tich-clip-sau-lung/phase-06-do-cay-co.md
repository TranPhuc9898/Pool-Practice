---
phase: 6
title: "Dò cây cơ quanh trục chấm tay"
status: in-progress
priority: P2
effort: "1.5d"
dependencies: [4]
---

# Phase 6: Dò cây cơ quanh trục chấm tay

## Goal

Từ trục anh chấm ở một khung, app tự bám cây cơ qua các khung sau, có độ tin cậy, và trả nil khi mất chứ không đoán. Module thay được bằng Core ML sau này.

## Files

- Tạo `modules/pool-table/ios/Pose/PoseCue.swift`:
  - `protocol CueTracker { mutating func track(_ pb: CVPixelBuffer, t: Double, wrist: CGPoint?) -> CueEstimate? }`, `CueEstimate { axis: CueAxis; confidence: Double }`;
  - `EdgeBandCueTracker`: dải quanh trục khung trước, rộng ±0,5 L và ±5°. Gradient bằng `CIFilter` Sobel hoặc `vImageConvolve` trên kênh Y, giữ điểm biên có hướng gradient gần pháp tuyến trục, fit đường bằng RANSAC rồi bình phương tối thiểu trên inlier. Đuôi cơ gắn với cổ tay khi có cổ tay. Độ tin cậy là tỉ lệ inlier nhân độ phủ chiều dài dải;
  - dưới ngưỡng tin cậy thì trả nil cho khung đó, ba khung liền nil thì dừng bám và xin chấm lại.
- Sửa `PoseClip.swift`: lượt phân tích chạy thêm tracker khi đã có trục tham chiếu. Trục chấm tay ở khung nào thì đặt lại tracker tại khung đó.
- Sửa `PoseClipView.swift`: vẽ trục đo được khác màu với trục tham chiếu, mờ theo độ tin cậy; khung nil không vẽ.
- Sửa `src/app/clip.tsx`: khối số đo thêm góc lệch trục đo so với tham chiếu, lệch ngang, và độ tin cậy. Báo "Cue lost, mark it again" khi tracker dừng.
- Sửa `scripts/pose-harness/main.swift`: `--cue x1,y1,x2,y2@t` cho harness bám cơ từ trục cho sẵn, ghi CSV góc, lệch và độ tin cậy.

## Tasks

- [ ] 1. Anh chấm trục trên 20 khung rải đều của R1 và R3 bằng màn clip (chấm nhiều trục là tính năng sẵn có của phase 3), xuất ra CSV. Đây là nhãn tay cho bước 3.
- [x] 2. Viết `EdgeBandCueTracker` và case unit trên ảnh dựng: một vạch sáng nghiêng 3° trên nền nhiễu ra góc sai < 0,3°; xoá vạch thì trả nil.
- [ ] 3. So tracker với nhãn tay của bước 1.
- [x] 4. Tìm xem có mô hình Core ML dò cây cơ nào dùng được không: tên, nguồn, giấy phép, định dạng. Không tìm thấy mô hình kèm giấy phép rõ thì ghi "không có", không nói là có.

## Verification

- `sh scripts/pose-harness/run.sh --unit` in `unit ok`.
- Bước 3, R1: trung vị sai góc ≤ 1,5°, ≥ 80% khung có ước lượng. Ngưỡng là đoán, ghi số thật. Không đạt thì số góc cơ trên màn gắn nhãn "experimental".
- R3 (máy lệch đường cơ) ghi riêng một dòng, không chặn phase.
- Kết quả bước 4 nằm trong mục Kết quả, có URL nguồn.

## Kết quả

Bước 2 (2026-10-22): `PoseCue.swift`.

Đã có:

- `protocol CueTracker` để sau này thay bằng mô hình.
- `EdgeBandCueTracker` lấy gradient 1D dọc pháp tuyến trên 48 mặt cắt, quanh trục khung trước. Mỗi mặt cắt lấy cặp cạnh trái dấu, rồi RANSAC với điều kiện quay ±5° và refit bằng TLS.
- confidence = tỉ lệ inlier × độ phủ dọc cơ.
- Có cổng cổ tay. Mất 3 khung liền thì báo `lost`.

Đã nối vào màn clip:

- Đường cam mờ theo confidence.
- Các dòng "Cue vs reference · experimental", "Cue sideways" và "Cue lost".
- Mỗi cú có thêm `addressCue`, `backCue`, `followCue`, `cueConfidence`.

Kiểm:

- Đã kiểm `--unit`, đều ok:
  - vạch 3° ra 3,003°, confidence 1,00;
  - quay sang 4,5° ra 4,496°;
  - nền trắng ra nil ba lần và `lost`;
  - cổ tay xa ra nil.
- Harness có `--cue x1,y1,x2,y2@t --csv`.
- xcodebuild không có lỗi Swift. tsc và lint sạch.

Lệch khỏi plan:

- Gradient 1D theo pháp tuyến thay cho Sobel toàn khung, rẻ hơn mà chỉ cần dải quanh cơ.
- Thêm `noiseEdge = 4`: cạnh phải gấp 4 lần trung vị |g| của mặt cắt. Không có ngưỡng này thì nền nhiễu ±16 cho ước lượng giả, confidence 0,36–0,39.
- Chỉ bám được xuôi từ trục chấm đầu tiên. Khung trước trục đó để trống, vì AVAssetReader chỉ đọc tiến.

Bước 4: không có mô hình dùng ngay được. Chi tiết và URL nguồn ở `plans/reports/research-2026-10-22-core-ml-do-co.md`.

Còn treo:

- Bước 1 và 3 cần nhãn tay của anh. Màn clip chưa xuất CSV, nhãn theo format `--eval` của phase 8.
- Chưa chạy trên clip thật. Các file trong ~/Downloads là quay màn hình, không phải clip sau lưng.
