# Soi tư thế đứng bộ và tay sau bằng camera iPhone

Research ngày 2026-10-20, 10:00–11:30 (Asia/Saigon). Nhánh `feat/pool-editor`.

## Kết luận

Làm được, với điều kiện thu hẹp: **một iPhone đặt ngang bên hông phía tay cơ, Apple Vision 2D, đo ba thứ**: cẳng tay có dọc lúc address không, khuỷu có giữ yên tới lúc chạm bi không, đầu có nhấc trong cú không. Báo bằng tiếng, sau cú nói một lỗi nặng nhất.

Good-GYM không bê code sang được (Python, PyQt5, RTMPose qua onnxruntime, chạy desktop). Thứ đáng lấy là cách nó mô tả bài tập bằng dữ liệu: mỗi bài là một bộ ba khớp cộng ngưỡng góc trong `data/exercises.json`. Nó cũng chưa có sửa tư thế, "Motion correction prompts" vẫn nằm trong roadmap.

Trước khi viết app, cần một spike offline để kiểm giả định gánh cả hướng này: Vision 2D có giữ được vai, khuỷu, cổ tay khi người cúi sát bàn hay không. Chưa ai đo cái này cho tư thế snooker, em cũng chưa.

## 1. Chuẩn kỹ thuật, theo nguồn

"Snooker" và "Chinese pool" dùng chung một chuẩn. Tài liệu dạy heyball tiếng Trung em tìm được (nguồn yếu, Toutiao) nói đúng các ý của snooker: 后手小臂垂直地面, 侧身约45°, 后腿伸直, 前脚微屈.

| Mốc | Chuẩn | Nguồn | Độ chắc |
|---|---|---|---|
| Cẳng tay sau lúc address | Thả dọc từ khuỷu. Nolan: "start the shot with your cue arm in the vertical address position", vì cơ phải nhanh nhất đúng lúc chạm | PJ Nolan (EBSA) tr. 26, 30; WPBSA manual (snippet) | Chắc |
| Cẳng tay so với cơ | Vuông góc với cơ lúc address thì đầu cơ đi thẳng theo trục cơ lúc chạm (stroke không rơi khuỷu) | Dr. Dave FAQ | Chắc |
| Khuỷu | Pendulum: vai và khuỷu yên, chỉ cẳng tay đưa. Rơi khuỷu được phép nếu xảy ra **sau** khi chạm | Dr. Dave BD 03/2021; Nolan tr. 26; 147academy | Chắc |
| Khuỷu lệch ngang | Không có chuẩn cứng. Reardon khuỷu chìa ra ngoài, Fred Davis khép vào, Callan kết luận "it was all about sighting". Joe Davis tự nhận cẳng tay dọc nhưng ảnh cho thấy "inside the vertical" | fcsnooker (Frank Callan) | Chắc |
| Nhịp | Dừng trước (front pause) để ngắm, dừng sau (back pause) để lấy nhịp | Nolan tr. 30; 147academy | Chắc |
| Bốn điểm chạm | Ngực, cằm, bridge, grip cùng giữ cơ trên line ngắm | Nolan tr. 28 | Chắc |
| Chân | Rộng tối thiểu bằng vai, một phần chân trước nằm trên line ngắm. Boxer stance hông và ngực khoảng 45° so với line, square stance chân song song line | Nolan tr. 28 | Chắc |
| Chân sau | Thẳng và khoá, khó chịu thì mở rộng chân chứ đừng gập gối | AZB forum; Toutiao | Yếu |

**Không nguồn nào cho ngưỡng số** kiểu "lệch quá X° là sai". Câu "khuỷu 90°" cũng không có nguồn, một bài còn nói nhiều người không đạt được 90° do chiều cao bàn và cơ thể. Ngưỡng phải tự hiệu chuẩn từ video thật.

Cỡ độ chính xác của dân pro: Kong và cộng sự (2021), một tay snooker đỉnh, đo bằng Vicon. Cue action chủ yếu do gập duỗi khuỷu, cổ tay đóng góp ít hơn nhiều. Repo đang ghi khuỷu khoảng 130° ROM, bài PeerJ 2023 trích lại là khoảng 145°; em chưa đọc bản gốc nên chưa biết số nào đúng. Ghi chú cũ trong repo nói biến thiên giữa các lượt dưới 1°. Camera điện thoại không phân giải được mức đó, nên app chỉ nhắm lỗi thô của người mới và trung cấp.

## 2. Đo được gì bằng một camera bên hông

Camera đặt ngang, nhìn vuông góc với line ngắm, phía tay cầm cơ.

| Lỗi | Cách đo từ keypoint | Đo được không |
|---|---|---|
| Cẳng tay không dọc lúc address | Góc đoạn khuỷu→cổ tay so với phương trọng lực, lấy ở khung đứng yên trước backswing cuối | Tốt nhất trong cả bộ (xem ghi chú hình học) |
| Khuỷu trôi trước khi chạm | Dịch chuyển của khuỷu từ address tới lúc cổ tay quay về đúng vị trí address. Address là lúc đầu cơ sát bi cái nên vị trí đó cũng là lúc chạm, không cần nghe tiếng | Được, nhưng nhiễu keypoint có thể lấn biên độ vài mm. Chưa đo |
| Đầu nhấc trong cú | Độ cao mũi và tai từ address tới khoảng 0,5 s sau chạm | Được. Chuẩn "đầu yên" em chỉ có nguồn mức forum |
| Không dừng sau | Thời gian cổ tay đứng yên ở cuối backswing | Được, chỉ báo số, không có ngưỡng |
| Chân sau gập | Góc hông–gối–cổ chân | Được nếu chân không bị bàn che |

**Không đo được bằng một camera bên**: cẳng tay nghiêng vào hay ra thân (cần camera đặt sau lưng), đầu cơ đi lệch trái phải (cần cảm biến kiểu DigiCue hoặc track chính cây cơ), bridge, độ chặt grip, chân có nằm trên line ngắm không (cần biết line ngắm trên sàn).

**Ghi chú hình học** (em suy ra từ mô hình pinhole, chưa kiểm trên ảnh thật): khi camera không nghiêng và trục quang nằm ngang, mọi đoạn thẳng đứng trong không gian đều hiện thành đoạn thẳng đứng trên ảnh, bất kể camera xoay ngang bao nhiêu. Nghĩa là phép kiểm "cẳng tay dọc" không cần đặt máy vuông góc chuẩn, chỉ cần máy cân. Điện thoại trên chân máy hay bị nghiêng vài độ, nên lấy vector trọng lực từ CoreMotion để xoay hệ trục ảnh. Bỏ bước này thì máy nghiêng 5° là số đo lệch 5°. Máy chúc lên hoặc xuống thì các đường dọc hội tụ, sai số tăng khi tay nằm xa tâm khung.

## 3. Bộ máy nhận dáng

| | Apple Vision 2D | Apple Vision 3D | MediaPipe Pose Landmarker |
|---|---|---|---|
| iOS tối thiểu | 14 | 17 | Không phụ thuộc |
| Số điểm | 19 (mũi, mắt, tai, cổ, vai, khuỷu, cổ tay, hông, gối, cổ chân) | 17, đơn vị mét quanh khớp gốc, chỉ người nổi nhất khung | 33, thêm gót và mũi chân |
| Phụ thuộc mới | Không | Không | Pod MediaPipeTasksVision cộng file model |
| Số liệu độ chính xác công bố | Không có | Không có | Không có cho iOS |
| Hợp repo | Hợp, module `modules/pool-table` đã là Swift native và chỉ có thư mục `ios/` | Phải nâng min iOS từ 16.4 lên 17 | Chỉ đáng nếu cần Android |

Một nghiên cứu dùng body tracking có sẵn trên iPhone để đo yếu tay ở bệnh nhân đột quỵ báo lỗi theo trục sâu khi tư thế mơ hồ, kể cả có LiDAR. Đó là hệ tracking khác Vision nên chỉ là tín hiệu gián tiếp, nhưng nó đủ để không đặt cược vào 3D cho phép đo cần độ sâu.

Sản phẩm tương tự (một vòng tìm, chưa đủ để kết luận là thị trường trống): Tiroa (upload video để AI phân tích stance, ra 01/2026), CueMeasure (chấm cổ tay và độ song song của cơ, listing không nói rõ có dùng camera), MOTiON (cảm biến Apple Watch), CueAction (phần cứng Bluetooth, đã có trong ghi chú cũ của repo), DigiCue Blue (IMU gắn cơ, ngưỡng do người dùng đặt). Em chưa thấy app nào soi camera trực tiếp rồi báo bằng tiếng.

## 4. Hướng làm

**A. Một camera bên, Vision 2D, báo trực tiếp (khuyến nghị).** Dựa vào giả định Vision 2D giữ được vai, khuỷu, cổ tay khi cúi sát bàn. Vỡ đầu tiên khi tay cầm cơ áp sát thân, hoặc áo tối trên nền tối, làm confidence của cổ tay tụt.

**B. Quay rồi xem lại.** Quay 60–240 fps, phân tích sau, vẽ góc lên khung lúc chạm. Chính xác hơn vì không bị ràng buộc thời gian thực, nhưng không báo được lúc đang đánh, tức mất yêu cầu chính. Hợp làm bước hai trên cùng pipeline của A.

**C. Hai góc máy cộng 3D pose.** Đo thêm được alignment. Vỡ đầu tiên ở chính phép đo alignment vì nó cần trục sâu, cộng phải nâng min iOS lên 17.

Phản hồi: lúc address, kêu một tiếng ngắn khi cẳng tay vào dung sai. Sau cú, đọc một lỗi nặng nhất, không lỗi thì im. Không báo nhiều lỗi một lúc. Giọng tiếng Việt qua `AVSpeechSynthesizer` em chưa kiểm trên máy.

Hướng tốt hơn cái anh gợi ý: dùng Vision native thay vì port Good-GYM. Lý do: Good-GYM là Python desktop, repo là Expo cộng module Swift chỉ chạy iOS, Vision 2D không thêm phụ thuộc. Chưa có gì được xây nên đổi hướng không tốn gì.

## 5. Bước kế

1. Anh quay 3–5 clip: iPhone trên chân máy, cân, ngang tầm khuỷu, bên hông phía tay cơ. Một clip đúng chuẩn, vài clip cố ý sai (cẳng tay đẩy ra trước khoảng 15°, nhấc đầu, khuỷu trôi).
2. Spike `scripts/pose-harness/main.swift` theo mẫu `scripts/rack-harness`: đọc mp4 bằng AVAssetReader, chạy `VNDetectHumanBodyPoseRequest` trên macOS (cùng model với iOS), xuất CSV mỗi khung gồm confidence của vai, khuỷu, cổ tay, góc cẳng tay, toạ độ khuỷu, độ cao mũi.
3. Tiêu chí em đề xuất (chưa có nguồn, chỉ là mức đủ dùng): confidence của ba khớp tay trên 0,5 ở ít nhất 90% khung từ address tới chạm; góc cẳng tay lúc đứng yên dao động dưới 2°; clip sai cố ý tách được khỏi clip đúng.
4. Qua spike thì mới lên plan cho màn camera. Trượt thì thử MediaPipe Heavy trên cùng clip trước khi bỏ hướng A.

## Nguồn

- Good-GYM: https://github.com/yo-WASSUP/Good-GYM , thư mục app: https://github.com/yo-WASSUP/Good-GYM/tree/master/app
- PJ Nolan, EBSA Erasmus project (grip tr. 26, stance tr. 28, cue action tr. 30): https://ec.europa.eu/programmes/erasmus-plus/project-result-content/3bc195e6-c654-49bc-b7fa-59a742076146/Erasmus%20Bulgaria%20EBSA%20Project%20Final%20Draft%206-4-2018.pdf
- WPBSA enrichment manual (chỉ đọc snippet): https://wpbsa.com/wp-content/uploads/enrichment-manual-2021-002.pdf
- Frank Callan, fcsnooker, Bridge Arm and Cue Arm: https://www.fcsnooker.co.uk/coaching/basics/bridge_arm_and_cue_arm/bridge_arm_and_cue_arm.htm
- 147academy, The Cue Action: https://147academy.com/the-cue-action/
- Dr. Dave, cẳng tay vuông góc cơ: https://drdavepoolinfo.com/FAQ/stroke/forearm/ ; pendulum stroke BD 03/2021: https://billiards.colostate.edu/bd_articles/2021/mar21.pdf ; bài rơi khuỷu (snippet): https://billiards.colostate.edu/bd_articles/2023/jan23.pdf
- AZB forum về stance: https://forums.azbilliards.com/goto/post?id=4916074
- Toutiao (heyball, nguồn yếu): https://www.toutiao.com/zixun/7519721958104287242/ , https://www.toutiao.com/zixun/7530836776241432616
- Kong et al. 2021: https://reference-global.com/article/10.5334/paah.111 ; PeerJ 2023 trích lại: https://peerj.com/articles/16180
- Apple Vision 2D: https://developer.apple.com/tutorials/data/documentation/vision/detecting-human-body-poses-in-images.md ; 3D: https://developer.apple.com/documentation/vision/vndetecthumanbodypose3drequest , https://developer.apple.com/videos/play/wwdc2023/111241/
- Body tracking iPhone, lỗi trục sâu: https://arxiv.org/pdf/2311.09716
- MediaPipe Pose Landmarker: https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker
- Zhikang Chen, AUT, pose cho billiards: https://cerv.aut.ac.nz/wp-content/uploads/2023/12/AUT-Project-Report-Zhikang-Chen-24-Sep-2023.pdf
- Tiroa: https://mwm.ai/apps/tiroa-play-connect/6758282465 ; CueMeasure: https://apps.apple.com/app/id862471845 ; MOTiON: https://mwm.ai/apps/motion-ai-shot-analysis/6745625913
- DigiCue Blue (forum): https://forums.azbilliards.com/threads/stroke-straightness-and-digicue-blue.467573/post-6063200

## Câu hỏi còn mở

1. Màn "Soi tư thế" gắn vào đâu trong UI hiện có: tab Hôm nay, Settings, hay thành một drill trong danh sách? Màn camera là màn mới, theo quy ước không thiết kế lại UI thì cần anh chốt chỗ gắn.
2. Báo bằng giọng tiếng Việt hay chỉ tiếng beep?
3. ROM khuỷu trong Kong 2021 là 130° hay 145°: cần đọc bản gốc nếu số này vào app.
