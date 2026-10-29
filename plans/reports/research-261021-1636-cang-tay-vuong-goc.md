# Cẳng tay vuông góc: chuẩn là gì, đo lúc nào, camera đo có đúng không

Thời điểm: 2026-10-21 16:58. Nguồn gồm ba agent research (chuẩn coaching, độ tin cậy đo pose 2D, sản phẩm và cách hiển thị), mô phỏng pinhole tự chạy, đọc code `modules/pool-table/ios/Pose/` và header SDK iOS 26.5.

Nhãn dùng trong report: **chắc** là đã đọc trong nguồn, chạy lệnh hoặc mô phỏng ra số. **suy đoán** là tự suy ra, chưa đo.

## Kết luận

- Chuẩn đúng là cẳng tay vuông góc với cây cơ lúc address, khi đầu cơ đã sát bi cái. Cơ snooker chỉ ngóc 2–5°, nên trên thực tế đó là cẳng tay dọc theo dây dọi. App đang đo đúng thứ này (chắc).
- Khuỷu 90° không phải chuẩn. Hai instructor có tên bác nó, và mocap 8 tay snooker pro cho góc khuỷu khoảng 119° gập (chắc). Không làm phép kiểm khuỷu 90°.
- Không nguồn nào cho dung sai bằng số độ. ±10° là ngưỡng mình tự đặt (chắc là không có nguồn).
- Code đang bắt lỗi cẳng tay ở khung gần lúc chạm nhất. Lúc đó cẳng tay quay khoảng 450°/s, ở 30 fps khung gần nhất lệch tới khoảng ±7°, ngang chính ngưỡng (suy đoán từ số đo tốc độ cơ). Nên chấm ở address.
- Đặt máy ngửa ra sau làm dây dọi sai dần khi tay lệch khỏi giữa khung: 3,6° ở ngưỡng ngả 12°. Sửa được hoàn toàn bằng dây dọi tính theo từng điểm từ trọng lực 3D và intrinsics của camera (chắc, mô phỏng).
- Rủi ro lớn nhất không nằm ở hình học. Apple nói thẳng Vision kém khi người cúi gập, đúng tư thế address, và tới giờ trên máy thật chưa có khung nào thấy tay (chắc). Phải đo tỉ lệ thấy tay trước mọi thứ khác.

## 1. Chuẩn kỹ thuật: vuông góc với cái gì

| Nguồn | Nói gì | Độ chắc |
|---|---|---|
| Dr. Dave, BD 05/2008 checklist | "At set position, with tip close to cue ball, forearm should be perpendicular … to cue" | chắc, [PDF](https://billiards.colostate.edu/bd_articles/BD_StrokeChecklist.pdf) |
| Dr. Dave, BD 03/2021 | "forearm should be perpendicular to the cue with the cue as level as possible" | chắc, [PDF](https://billiards.colostate.edu/bd_articles/2021/mar21.pdf) |
| Dr. Dave, AZB 2011 | "Only when the cue is nearly level will the forearm be nearly perpendicular to the table bed" | chắc, [post](https://forums.azbilliards.com/goto/post?id=3236527) |
| Scott Lee, AZB 2011 | 90° là giữa cơ và cẳng tay, "at ball address" | chắc, cùng thread |
| PJ Nolan (EBSA) tr. 26, 30 | grip "hanging down vertically from the elbow", bắt đầu cú từ "vertical address position" | chắc |
| WPBSA/WDBS 2021 | "forearm, wrist and hand to hang vertically", cơ "as level as possible" | chắc, [PDF](https://wpbsa.com/wp-content/uploads/enrichment-manual-2021-002.pdf) |
| Jiao, ISBS 2020 (Maguire, Qualisys 200 Hz) | góc cẳng tay so với trục dọc nhỏ nhất gần lúc chạm | chắc, [bài](https://commons.nmu.edu/isbs/vol38/iss1/35) |

Khuỷu 90° chỉ xuất hiện như ký ức "sách cũ" trên forum. Randy G viết "Most elbows are NOT at 90degrees". Scott Lee viết khuỷu chỉ 90° ở một chiều cao đứng nhất định. Song, ISBS 2018 đo 8 tay pro, góc gập khuỷu khoảng 119°, tức góc trong khoảng 61° ([PDF](https://sprinz.aut.ac.nz/__data/assets/pdf_file/0020/202943/067_1391_Song.pdf)). Phép kiểm khuỷu 90° sẽ bắt lỗi chính các tay pro này (chắc).

"Vuông góc so với điện thoại" anh nói, em hiểu là cẳng tay song song cạnh dọc của máy đang đứng (suy đoán về ý anh). App lấy dây dọi từ trọng lực chứ không từ cạnh máy, nên máy xoay nghiêng trong mặt phẳng (roll) vẫn đo đúng (chắc, `PoseOrientation.down` dùng `gx, gy` của CoreMotion).

Dr. Dave còn có phép kiểm "forearm vertical" nhìn từ sau lưng, tức tay không chìa ra ngoài. Đó là phép kiểm khác, camera bên hông không thấy được (chắc).

## 2. Lúc nào đo

Nolan, WPBSA, Scott Lee, Dr. Dave và Randy G đều đặt phép kiểm ở address (chắc). Dr. Dave và Randy G thêm "lúc chạm". Khi khuỷu đứng yên thì cổ tay quay về đúng vị trí address lúc chạm, và `contactTime` (`PoseStroke.swift:228`) cũng định nghĩa lúc chạm như vậy. Lúc chạm không cho thêm thông tin gì ngoài độ trôi khuỷu, mà độ trôi đã có phép kiểm riêng.

Hiện code bắt lỗi ở `PoseStroke.swift:239` lấy khung gần `contactTime` nhất, rồi so với ngưỡng ở dòng 263. Ước tính của agent coaching từ số đo của Song: tốc độ cơ lúc chạm khoảng 2,5 m/s, cẳng tay quay khoảng 450°/s. Ở 30 fps khung gần nhất lệch tối đa 16,7 ms, tức tới khoảng ±7° (suy đoán). Address đứng yên, median trên cửa sổ đứng yên đã có sẵn trong `stillAddress()`.

Khuỷu rơi sau khi chạm được chấp nhận rộng rãi (Nolan, Dr. Dave, Jiao). Cẳng tay chúi ra trước có tiền lệ ở người chơi giỏi nhưng nguồn yếu, nên giữ ngưỡng đối xứng.

## 3. Hình học: camera đo sai ở đâu

Mô phỏng pinhole, cẳng tay 0,26 m, cách máy 2,25 m. Toạ độ x/f là vị trí khuỷu tính từ tâm ảnh theo tiêu cự (chắc, mô phỏng).

**Máy ngả trước sau (pitch).** Dây dọi hiện tại lấy một hướng trọng lực chung cho cả ảnh. Đường thẳng đứng thật hội tụ khi máy ngả, nên tay càng xa tâm ảnh càng sai:

| Pitch | Cẳng tay dọc thật, x/f 0,15 | x/f 0,3 | Dây dọi theo từng điểm |
|---|---|---|---|
| 5° | 0,75° | 1,50° | 0,00° |
| 12° (ngưỡng hiện tại) | 1,79° | 3,57° | 0,00° |
| 20° | 2,94° | 5,86° | 0,00° |

Ở pitch 12°, x/f 0,3, cẳng tay lệch thật 10° đọc thành 13,22° với dây dọi hiện tại và 9,65° với dây dọi theo từng điểm.

Dây dọi theo từng điểm: với trọng lực `g` trong hệ toạ độ camera và điểm khuỷu đã chuẩn hoá `(u, v) = (p − c) / f`, hướng dọc tại khuỷu là `(gx − u·gz, gy − v·gz)`. Cần `f` và `c`. SDK có sẵn: `AVCaptureConnection.isCameraIntrinsicMatrixDeliveryEnabled` trên connection của data output, ma trận đi kèm từng buffer qua `kCMSampleBufferAttachmentKey_CameraIntrinsicMatrix`. Header ghi không hỗ trợ khi bật video stabilization. Dự phòng là `AVCaptureDevice.activeFormat.videoFieldOfView` (chắc, đọc header iOS 26.5). Camera trước iPhone 17 có hỗ trợ intrinsics không thì chưa biết.

**Máy xoay lệch khỏi phương vuông góc với đường cơ (yaw).** Cẳng tay dọc vẫn đọc 0° ở mọi yaw. Độ lệch thật bị đọc nhỏ đi, tức thiên về báo đạt nhầm:

| Yaw | Lệch thật 10°, khuỷu ở x/f −0,15 / 0 / +0,15 |
|---|---|
| 20° | 9,91° / 9,41° / 8,90° |
| 30° | 9,42° / 8,68° / 7,94° |
| 45° | 8,16° / 7,11° / 6,05° |

Giữa ảnh khớp công thức trực giao `atan(tan α · cos ψ)`. Lệch khỏi tâm thì phối cảnh kéo thêm 0,5–1° tuỳ phía. Yaw không đo được bằng tín hiệu hiện có, vì Vision không thấy cây cơ. Chỉ chặn được bằng hướng dẫn đặt máy.

**Lệch keypoint.** Khuỷu hoặc cổ tay lệch 2 cm theo chiều ngang trên cẳng tay 25 cm đã ra khoảng 4,6° (suy đoán, hình học).

## 4. Vision có thấy và đo đủ chính xác không

- Không có nghiên cứu nào so góc khớp của Apple Vision 2D với mocap (chắc là không tìm thấy). Pose 2D quay ngang các model khác: chân 4–7° ([Stenum 2021](https://doi.org/10.1371/journal.pcbi.1008935)), chi trên khoảng 5° với YOLOv7 và khoảng 17° với MediaPipe (Klein 2024, mới đọc qua snippet). BlazePose ở khuỷu sai số chủ yếu là bias, r vẫn 0,98 ([Montero 2026](https://revistas.udc.gal/index.php/JA_CEA/article/download/13777/9845/57840)) (chắc).
- Apple, WWDC20: "If the people on the scene are bent over or upside down, the body pose algorithm will not perform as well" ([video](https://developer.apple.com/videos/play/wwdc2020/10653/)). Người nên cao ít nhất 1/3 chiều cao ảnh, kém dần gần mép khung ([docs](https://developer.apple.com/tutorials/data/documentation/vision/detecting-human-body-poses-in-images.md)) (chắc).
- Thực tế trên máy anh lúc 16:20: ba dòng log liên tiếp `people 0 shoulder 0.00 elbow 0.00 wrist 0.00` (chắc, `console4.log`). Chưa có khung nào thấy tay.
- Nhiễu từng khung xấp xỉ `√2 · σpx / L`. Cẳng tay khoảng 90 px, rung 2 px cho khoảng 1,8°. Nếu các khung độc lập, median 12 khung còn khoảng 0,7°. Khung liền nhau tương quan nên thực tế cao hơn. Median không giảm được bias (suy đoán).
- Ngân sách sai số cho ±10° (suy đoán): nhiễu sau median 1–2°, yaw ≤ 20° khoảng 0,6°, pitch sau khi sửa dây dọi gần 0, bias khớp ở tư thế cúi 3–6° chưa ai đo. Tổng dưới 10° nhưng không dư nhiều. Bias quyết định, và chỉ đo được trên máy thật.
- 3D pose (`VNDetectHumanBodyPose3DRequest`) chưa đáng làm. Cần iOS 17 trong khi target là 16.4, Apple không công bố độ chính xác, độ sâu một camera trong các nghiên cứu gần nhất kém (chắc về các dữ kiện, suy đoán về kết luận).

## 5. Camera trước hay sau

Agent đo lường khuyên camera chính mặt sau. Anh đã chọn camera trước làm mặc định ở phase 2, nên đây là quyết định của anh, em chỉ đưa số.

| | Sau, Main 24 mm | Trước |
|---|---|---|
| Cẳng tay ở 2 m / 2,5 m | khoảng 113 / 91 px | khoảng 94 / 75 px |
| Biết FOV chắc | có | chưa, cần log |
| Center Stage | không | có, người dùng bật trong Control Center |
| Thấy màn khi dựng máy | không | có |

Cột cẳng tay là suy đoán từ FOV, buffer 720×1280, người 1,75 m. Chênh khoảng 10–20% pixel, nhỏ hơn nhiều so với bias khớp. Khi đã cúi đánh, người chơi không quay đầu nhìn máy ở bên hông được, nên lợi thế thật của camera trước nằm ở lúc dựng máy và đứng vào khung.

Em khuyên giữ camera trước làm mặc định, kèm hai việc: tắt Center Stage bằng `AVCaptureDevice.centerStageControlMode = .app` rồi `isCenterStageEnabled = false` (chắc, header iOS 14.5+), và log một lần `deviceType`, `activeFormat.videoFieldOfView`, `isCameraIntrinsicMatrixDeliverySupported`. WWDC26 có nói camera trước iPhone 17 khai báo là `.builtInUltraWideCamera` (chắc là session nói vậy). Code gọi `.builtInWideAngleCamera` vẫn nhận được thiết bị theo log 16:20, nhưng chưa biết là ống nào.

## 6. Hiển thị cho ra dáng chuyên nghiệp

Chưa thấy app pool hay snooker nào đo góc cẳng tay live trên camera (chắc là không tìm thấy). Các app camera (CuePal, AQ Snooker) phân tích video sau khi quay hoặc không nói rõ. Thứ gần nhất là CueAction, cảm biến cắm đuôi cơ, có hình quạt "Backward 30° / Forward 30°" tính từ phương thẳng đứng ([App Store](https://apps.apple.com/app/id1530907307)).

Năm cách làm lấy từ Kinovea, Sportsbox, HackMotion, QuickPose, đều là thêm vào overlay đang có:

1. Hình quạt giữa dây dọi và cẳng tay, số độ trong hộp nhãn ngay cạnh khuỷu. Kinovea vẽ đúng kiểu này với trục tham chiếu nét đứt ([docs](https://kinovea.readthedocs.io/en/stable/measurement/angle.html)). Overlay đã có dây dọi nét đứt.
2. Chốt số tại address, giữ 1–2 s, số live chỉ là phụ. Sportsbox và HackMotion chụp số ở vị trí then chốt thay vì làm mượt nặng.
3. Scoreboard ghi độ lệch có dấu và khoảng mục tiêu, ví dụ "+7° (±10°)", ba màu. Mốc vàng 10–15° là số tự đặt.
4. Cổng setup: chưa thấy đủ vai, khuỷu, cổ tay thì tay xám kèm một câu nhắc, thấy đủ liên tục khoảng 2 s mới đo (QuickPose).
5. Âm báo ngắn. Bỏ phần rung các sản phẩm cảm biến dùng: máy đặt trên chân máy cách 2 m, rung không tới người.

## 7. Khuyến nghị

Giữ phép đo hiện tại (cẳng tay so với dây dọi trọng lực, ±10°). Làm theo thứ tự:

1. Xong phase 4 trên máy: log tỉ lệ thấy vai, khuỷu, cổ tay lúc anh cúi address ở 2–2,5 m. Đây là cửa sống còn. Dưới khoảng 25/30 giây thì mọi phần sau vô nghĩa, phải xem lại khoảng cách, crop ROI hoặc camera.
2. Hiệu chỉnh một lần: đặt một điện thoại thứ hai mở ứng dụng Measure, chế độ Level, lên cẳng tay. So 3–5 góc từ −20° tới +20° với số app đọc ra để có bias và độ tản.
3. Phase mới: chấm lỗi theo median lúc address, dây dọi theo từng điểm từ intrinsics, quạt góc kèm số ở khuỷu, chốt số tại address.

Bước 3 đổi hành vi `StrokeTracker`, cần anh duyệt.

## Giới hạn nguồn

- Agent chuẩn coaching đã đọc khoảng 8 trang của drdavepoolinfo.com qua proxy r.jina.ai trước khi nhận ra domain bị mạng công ty chặn theo chính sách. Nó dừng ngay khi phát hiện. Các trích dẫn từ drdavepoolinfo.com (FAQ cẳng tay, FAQ pendulum-piston, bài cẳng tay chúi trước) đến qua đường đó. Kết luận chính của report dựa vào các PDF trên billiards.colostate.edu, AZB, Nolan, WPBSA, Jiao, Song, không dựa vào các trang này. Hai agent còn lại tự báo không dùng proxy.
- Agent đo lường lấy một bài từ Europe PMC sau khi MDPI trả 403. Bài đó không được trích.
- Nhiều bài MDPI, DOAJ, HKU, IOS Press chỉ đọc qua đoạn trích tìm kiếm vì 403. Mô tả giao diện sản phẩm lấy từ screenshot App Store, chưa cài thử.
- Mô phỏng hình học nằm ở scratchpad phiên này (`geo/proj.py`, `geo/proj2.py`), không giữ lại. Công thức đủ trong mục 3 để chạy lại.

## Câu hỏi mở

1. "Vuông góc so với điện thoại" có đúng là cẳng tay dọc không?
2. Chuyển lỗi cẳng tay từ lúc chạm sang address?
3. Ngưỡng bắp tay 6° có bắt lỗi tay snooker kiểu piston không? Maguire đổi góc vai 8,2° từ cuối backswing tới lúc chạm (Jiao 2020), nhưng góc đó tính so với thân, chưa quy đổi được.
4. Camera trước iPhone 17 Pro Max là ống nào, FOV bao nhiêu, có intrinsics không?
5. Bias khớp khuỷu và cổ tay của Vision khi cúi gập là bao nhiêu? Chỉ phép đo ở khuyến nghị 2 trả lời được.
