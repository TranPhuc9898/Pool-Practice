# Đếm "tay thẳng" trên Stance Check

Ngày 27/10/2026, 03:00 (Asia/Saigon). Đầu vào gồm:
- Video 02:35.
- Log `mp-side4.log`.
- Code `PoseStroke.swift` / `PoseCoach.swift` / `PoseCoachView.swift`.
- Bốn video YouTube đã đọc transcript.

## Nhấp cơ: các nguồn nói gì (đã đọc transcript)

| Nguồn | Ý chính |
|---|---|
| [Jaros Billiards, SPFF](https://www.youtube.com/watch?v=1na_UHBTSy8) | Trình tự: hạ người, nhấp vài cú, rồi **set**. Set là đặt đầu cơ sát bi cái và đứng yên, lúc tập đếm 3, lúc thi đấu đếm 2. Sau đó lùi cơ, dừng, đánh, rồi giữ nguyên (freeze) |
| [Roger Long](https://www.youtube.com/watch?v=43aNw6DD2Xs) | Vừa nhấp cơ (warm-up strokes) vừa đổi mắt giữa bi cái và bi mục tiêu. Cú cuối cùng là cú đánh |
| [Shortstop On Pool](https://www.youtube.com/watch?v=my3D71mmQtw) | "Transition" là lúc nhấp cơ chuyển thành cú ra cơ thật. Đây là phần dễ vỡ nhất của routine |
| [PhucLong Pool, Động tác nhấp cơ](https://www.youtube.com/watch?v=Ejs5kUj2lgQ) | Nhấp cơ để động tác thẳng và đầu cơ vào giữa tâm bi. Bài tập 400–500 lần |

Các nguồn thống nhất ở điểm này: **trước mỗi cú đều có một khoảnh khắc đầu cơ dừng sát bi, cẳng tay buông dọc, đứng yên chừng 1–3 s.** Cả "tay thẳng rồi vung đánh" (ý 2 của anh) lẫn "nhấp rồi tĩnh lại tay thẳng" (ý 3) đều xoay quanh cùng khoảnh khắc đó. Lúc đang nhấp thì tay không dừng hẳn.

## Hợp đồng

- **Outcome:** đồng hồ đếm số lần **set**, tức là lúc cẳng tay dọc và đứng yên. Tay nghiêng hoặc xéo thì nét đỏ. Màn hình gọn hơn, nét tay mượt hơn.
- **Constraints:**
  - Không thiết kế lại UI ngoài lớp vẽ.
  - Không đụng `PoseClip`.
  - Không commit.
  - Ngưỡng là ngưỡng tạm, chưa có số đo nhìn ngang.
- **Non-goals:**
  - Không chấm 5 lỗi stroke.
  - Không đo jab hay follow-through.
  - Không đổi model.
- **Acceptance:** trên máy làm 5 lần "nhấp vài cú → tĩnh tay thẳng 1 s → vung đánh" thì đếm đúng 5. Riêng lúc nhấp thì không đếm. Giữ tay xéo 20° thì nét đỏ và không đếm.

## Luật đếm đề xuất

1. **Đếm 1** khi |cẳng tay lệch dọc| ≤ `forearm` (10°) và cổ tay đứng yên trong 0,08 L suốt 0,5 s. Đếm ngay lúc đó để có phản hồi tức thì, kèm haptic.
2. **Mở khoá** khi cổ tay đi xa hơn 0,25 L, do vung đánh hoặc do nhấp. Chưa mở khoá thì đứng yên tiếp cũng không đếm thêm.
3. Bỏ hai điều kiện `downOnShot` và `awaitingRise` cho bộ đếm này.
   - Video 02:35 cho thấy app kẹt ở "Get down on the shot" nên bộ đếm đứng ở 0 suốt clip.
   - Cái giá: đứng thẳng buông tay cũng sẽ được tính 1. Có thể chặn bằng điều kiện khuỷu ở trên cổ tay, vốn đã đúng khi buông, nên **không chặn được hết**. Chấp nhận.
4. Màu nét giữ nguyên `PoseLineColor`.

**Trade-offs:**
- **A. Đếm "set"** (đề xuất). Phụ thuộc vào việc nhấp không có lúc dừng ≥ 0,5 s. Hỏng khi người nhấp chậm, dừng lâu ở đầu mỗi nhịp, vì sẽ bị đếm thừa.
- **B. Giữ nguyên `StrokeTracker`, đếm khi xong cả cú.** Phụ thuộc vào việc thấy đủ backswing, forward và follow-through. Hỏng ngay hiện tại: ở góc máy anh đang đặt, bộ đếm đứng 0 suốt cả clip.

Better approaches: none. Hướng đề xuất trùng với hướng anh yêu cầu, và nguồn SPFF gọi đúng tên khoảnh khắc "set".

## Bỏ gì trên màn hình

| Thứ | Đề xuất | Lý do |
|---|---|---|
| Nhãn góc khuỷu | Bỏ | Nhảy từ 48° đến 150° trong video 02:35. Không phải tiêu chí chấm |
| Vòng quanh khuỷu (`elbowRing`) | Bỏ | Trùng với chấm khuỷu |
| Dây dọi | Giữ | Là thước để mắt so cẳng tay với phương dọc |
| Nét cẳng tay xanh/đỏ, chấm khuỷu | Giữ | Đây là phản hồi chính |

**Mượt hơn:** hạ `beta` của One Euro, hoặc tăng `minCutoff` thấp hơn cho cổ tay. Đây là suy đoán, phải chỉnh trên máy.

## Câu hỏi còn mở

- Có muốn giữ song song bộ đếm stroke cũ, ẩn đi để làm sau, hay bỏ hẳn?
- 0,5 s là set đủ lâu chưa? SPFF nói 1–3 s, em chọn thấp hơn để khỏi chờ.
