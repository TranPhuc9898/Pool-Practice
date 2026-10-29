# Stance Check đếm "set" tay thẳng — 2026-10-27

**Xong là:** trên 01.thanggg12, anh làm 5 lần chuỗi "nhấp vài cú, tĩnh tay thẳng 1 s, vung đánh" thì số trên Scoreboard lên đúng 5. Giữ tay xéo khoảng 20° thì nét đỏ và số không lên.
**Cách làm:** thêm `SetCounter` cạnh `StrokeTracker` trong `PoseStroke.swift`:
- Đếm khi |cẳng tay lệch dọc| ≤ `forearm` và cổ tay yên trong 0,08 L suốt 0,5 s.
- Sau mỗi lần đếm, chỉ mở khoá lại khi cổ tay đi xa hơn 0,25 L.
- Không cần `downOnShot`/`awaitingRise`. Lý do: video 02:35 kẹt ở "Get down on the shot", nên bộ đếm stroke đứng 0. Còn "set" là khoảnh khắc mà mọi nguồn trong `plans/reports/brainstorm-261027-0300-dem-tay-thang.md` đều có.
**Đánh đổi:**
- Đứng thẳng buông tay 0,5 s cũng được tính 1.
- Scoreboard bỏ 4 ô số Forearm/Elbow/Head/Pause của cú. `StrokeTracker` vẫn chạy, giọng nói vẫn chấm cú, nhưng màn hình không hiện kết quả cú nữa.
**Không làm:** không chấm jab/follow-through, không đổi model, không đụng `PoseClip`, không xoá `StrokeTracker`, không tick hộ plan `2026-10-26-stance-mediapipe.md`.

## Bước

- [ ] 1. Lát xuyên:
  - `SetCounter` trong `modules/pool-table/ios/Pose/PoseStroke.swift`.
  - `PoseCoach.swift` gọi nó mỗi khung, `NSLog("[pose] set %d")` và bắn `onSet`.
  - Prop `onSet` trong `modules/pool-table/src/PoseCoachView.tsx` và `PoseCoachView.swift`.
  - `src/app/stance.tsx`: Scoreboard `label="Straight arm"`, `value` = số set.
  - → xong khi: build Release lên máy, `devicectl --console` có dòng `[pose] set 1` lúc anh tĩnh tay dọc 1 s, và màn hình hiện 1.
- [ ] 2. Ca dựng trong `scripts/pose-harness/main.swift` (cần 1). Ba ca:
  - Chỉ nhấp liên tục: ra 0.
  - 5 lần set rồi vung: ra 5.
  - Tay xéo 20° đứng yên: ra 0.
  - → xong khi: `sh scripts/pose-harness/run.sh --synthetic` in đủ 3 ca mới `ok` và `synthetic ok`.
- [ ] 3. Bỏ nhãn góc và `elbowRing` trong `modules/pool-table/ios/Pose/PoseCoachView.swift` → xong khi: `grep -cE "elbowRing|CATextLayer" PoseCoachView.swift` ra 0, và trên máy không còn ô số độ cạnh khuỷu.
- [ ] 4. Mượt cổ tay trong `JointSmoother` của `PoseCoachView.swift`: đặt `minCutoff`/`beta` riêng cho khuỷu và cổ tay → xong khi: anh quay màn hình 10 s tĩnh tay. Tách khung 5 fps bằng `ffmpeg`, chấm cổ tay không nhảy quá bề rộng chấm giữa hai khung liền nhau, và anh xác nhận mượt hơn.
- [ ] 5. Chốt (cần 1–4) → xong khi: `npx tsc --noEmit` và `npx expo lint` exit 0, build Release 0 error, trên máy đạt đúng câu "Xong là" và anh xác nhận.

## Vỡ ở đâu

- Nhấp chậm, có nhịp dừng ≥ 0,5 s ở đầu cú, nên bị đếm thừa → kiểm bằng: ở bước 5, so số dòng `[pose] set` với số cú anh đếm tay.
- Máy vẫn không nhìn ngang, `wrist` < 0.5 nên không bao giờ đếm → kiểm bằng: ở bước 1, tỉ lệ dòng `[pose] arm` có `wrist` ≥ 0.5 trong lúc tĩnh tay.
- `forearm` 10° quá chặt khi máy ngả, nên tay thẳng mà vẫn đỏ → kiểm bằng: log `lean` lúc anh tự thấy tay thẳng.

## Phát sinh

- Bước 1: `stance.tsx` bỏ luôn `onStroke` và bảng `VERDICT`, vì màn hình không còn hiện kết quả cú. Mục "What it checks" vẫn tả 4 tiêu chí của cú, chưa sửa vì nằm ngoài plan.
- Bước 1–3: build và cài chung một bản (Release, `App installed`) để anh kiểm bước 1 và phần trên máy của bước 3 trong cùng một lần. Bước 2 đợi bước 1 tick.
