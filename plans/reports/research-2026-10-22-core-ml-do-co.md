---
title: Model ML phát hiện cơ bida (cue stick) dùng được trên iOS
date: 2026-10-22
type: research
status: done
---

# Model ML phát hiện cơ bida trên iOS

## Kết luận

- **Không có** model cơ bida nào vừa tải được weights, vừa có license rõ ràng, vừa chạy on-device ngay. Có vài model trên Roboflow Universe phát hiện "cue stick", nhưng chỉ dùng được qua hosted API của Roboflow. Weights chỉ chủ project trên gói trả phí mới tải được, và kiến trúc YOLO (Ultralytics) theo AGPL-3.0, muốn chạy ngoài hệ Roboflow thì phải có gói Enterprise ([Roboflow changelog](https://docs.roboflow.com/reference/changelog/changelog/february-2025/download-trained-model-weights-from-roboflow), [roboflow.com/ultralytics](https://roboflow.com/ultralytics)).
- **Có** dataset gắn nhãn cơ với license rõ (CC0 / CC BY 4.0) trên Roboflow Universe. Hướng thực tế là tải dataset rồi tự train. Đường Core ML ngắn nhất là YOLO kèm `export format=coreml` ([Ultralytics CoreML](https://docs.ultralytics.com/integrations/coreml/)), nhưng dính AGPL. RF-DETR thì Apache 2.0 ([Roboflow blog](https://roboflow.com/blog/rf-detr-is-free-to-use-commercially)), có điều em chưa kiểm được nó có đường sang Core ML hay không.

## Ứng viên (model đã train)

Mọi trang Roboflow dưới đây em đọc qua `r.jina.ai` vì Roboflow chặn fetch trực tiếp (HTTP 403). Không trang nào ghi model size dạng MB.

| Tên | URL | Phát hiện gì | Format / kiến trúc | Size | License (nơi ghi) | Weights tải được? | Sang Core ML? |
|---|---|---|---|---|---|---|---|
| billiard-agrxg (test-q8cb9) | https://universe.roboflow.com/test-q8cb9/billiard-agrxg | **cue stick, cue tip**, red/white/yellow ball. 164 ảnh (v3). mAP@50 99.5%. Ngày 14/03/2025 | YOLOv12n Object Detection (Fast) | không ghi (bản n) | **Public Domain (CC0 1.0)**, ghi ngay trên trang đó. CC0 này áp cho dataset. Weights thì vẫn là kiến trúc Ultralytics nên dính AGPL ([roboflow.com/ultralytics](https://roboflow.com/ultralytics)) | Trang chỉ có hosted API, không ghi gì về tải weights | Về kỹ thuật thì được, nếu có `.pt`: Ultralytics export CoreML cho YOLOv8/11/26 ([docs](https://docs.ultralytics.com/integrations/coreml/)). YOLOv12 không có trong bảng task của trang đó (chưa kiểm) |
| billiards-detection (siennas-workspace) | https://universe.roboflow.com/siennas-workspace/billiards-detection | ball, chalk, **cue stick**. 882 ảnh. mAP@50 88.5%, P 77.8%, R 78.2%. Ngày 10/05/2026 | YOLOv11 Nano | không ghi | **CC BY 4.0**, ghi trên trang đó (áp cho dataset) | Không ghi, chỉ có hosted API | Được về kỹ thuật (YOLO11 có trong bảng CoreML export). Vướng license AGPL |
| billiard-vision (vision-65sss) | https://universe.roboflow.com/vision-65sss/billiard-vision | 8ball, billiard_balls, **cue** (trang không định nghĩa cue là cơ hay bi cái), solids, stripes. 2,815 ảnh (v2). mAP@50 98.8%. Ngày 19/05/2025 | YOLOv11 (checkpoint COCOn) | không ghi | **CC BY 4.0**, ghi trên trang đó | Không ghi | Như trên. Phải xem ảnh mẫu để biết "cue" là gì |
| DrPool (423drpool) | https://universe.roboflow.com/423drpool/drpool | ball, **cue, cue-tip**. 77 ảnh (v6). mAP@50 78.8%. Ngày 07/12/2024 | Roboflow 3.0 Object Detection (Fast) | không ghi | **CC BY 4.0**, ghi trên trang đó | Không ghi | Roboflow 3.0 là kiến trúc riêng của Roboflow, chưa thấy đường export Core ML (chưa kiểm) |
| 8-ball pool shot predictor (ReadyTensor) | https://app.readytensor.ai/publications/8-ball-pool-shot-predictor-CoPGzifug9rp | cue, white ball, colored balls (bài viết ghi detect "cue"). Ngày 30/09/2024 | YOLOv8 | không ghi | **no license stated** | Không có repo, không có weights | Không áp dụng |
| AUT report (Yang Boning, 2023) | https://cerv.aut.ac.nz/wp-content/uploads/2023/12/RP1_YANG-BONING-23Oct2023.pdf | hand, cue, sp (điểm tựa ở tay cầu), hp (điểm tiếp xúc). Dùng bbox. 472 ảnh, augment lên 944, từ 162 phút video quay ở 12 góc | YOLOv8 | không ghi | **no license stated**, không phát hành dataset/weights/code (em grep PDF, không thấy link github hay câu nào về việc phát hành) | Không | Không áp dụng |

Đã tìm mà không thấy model nào: Hugging Face. Em thử tìm "billiards cue stick detection model" và không ra kết quả nào trên HF. Kaggle cũng vậy, mấy lượt search đều không trả về dataset hay model Kaggle nào về cơ bida. Trên GitHub em cũng chưa thấy repo nào phát hành weights detect cơ. Lưu ý chỗ này chỉ dựa trên kết quả search, em chưa search trực tiếp trên github.com hay kaggle.com.

## Dataset

Hầu hết đều là Roboflow Universe, export được sang YOLO hay COCO. Tất cả các trang đều ghi "A description for this project has not been published yet" hoặc không có mô tả, nên nguồn ảnh (bàn thật hay ảnh chụp game) và chất lượng nhãn chưa kiểm.

| Dataset | URL | Nhãn cơ | Task | Số ảnh | License (ghi trên trang) |
|---|---|---|---|---|---|
| billiard-agrxg | https://universe.roboflow.com/test-q8cb9/billiard-agrxg | cue stick, cue tip | Detection | 68 trên trang tổng quan, 164 ở v3 | Public Domain (CC0 1.0) |
| billiards-detection | https://universe.roboflow.com/siennas-workspace/billiards-detection | cue stick | Detection | 882 | CC BY 4.0 |
| cue (cuebit/cue-8ncak) | https://universe.roboflow.com/cuebit/cue-8ncak | "cue" (1 class, chưa rõ là cơ hay bi cái, cần xem ảnh) | **Instance Segmentation** | 1,340 | CC BY 4.0 |
| pool cue instance (ours-workspace) | https://universe.roboflow.com/ours-workspace/pool-cue-instance | pool-cue | **Instance Segmentation** | 325 | CC BY 4.0 |
| cue tip (ours-workspace) | https://universe.roboflow.com/ours-workspace | cue tip | Detection | 325 | trang workspace không ghi license, em chưa mở trang project |
| billiard-vision | https://universe.roboflow.com/vision-65sss/billiard-vision | cue (chưa rõ nghĩa) | Detection | 2,815 (v2) | CC BY 4.0 |
| billiards ball detection (cuebit) | https://universe.roboflow.com/cuebit/billiards-ball-detection-lmzkl | cue (chưa rõ nghĩa), cùng ball và table | Detection, 0 model | 266 | CC BY 4.0 |
| DrPool | https://universe.roboflow.com/423drpool/drpool | cue, cue-tip | Detection | 77 (v6) | CC BY 4.0 |
| pool-detection (HF) | https://huggingface.co/datasets/nhantu2107/pool-detection | **không có cơ**, chỉ 16 bi | Detection (YOLO) | <1K | MIT |
| pix2pockets (arXiv 2504.12045, 16/04/2025) | https://arxiv.org/abs/2504.12045 | trang abstract chỉ nói "all balls and table dots", không nhắc đến cơ | Segmentation | 195 ảnh, 5,748 mask | CC BY 4.0 áp cho **bài báo**. Trang abstract không có link dataset hay license dataset |

Ghi chú: CC BY 4.0 bắt buộc ghi công tác giả. Cả hai bộ segmentation (cue-8ncak, pool-cue-instance) đều có 0 model đã train.

## Ràng buộc license và chuyển đổi (đã kiểm)

- **Weights trên Roboflow:** "Customers on premium plans can now download weights from models trained with Roboflow Train" ([changelog](https://docs.roboflow.com/reference/changelog/changelog/february-2025/download-trained-model-weights-from-roboflow)). Trang này không nói có tải được weights của Universe model do người khác train hay không. Forum Roboflow gợi ý cách thay thế là export dataset rồi tự train ngoài (thông tin này em lấy từ snippet search https://discuss.roboflow.com/t/exporting-model/315/2, chưa mở trang).
- **AGPL với YOLO:** "Custom trained versions of AGPL-3.0 models are still AGPL-3.0". Cùng trang đó ghi "Deploying outside of the Roboflow ecosystem is available on Enterprise" ([roboflow.com/ultralytics](https://roboflow.com/ultralytics)). Nghĩa là nhúng YOLO vào app iOS đóng nguồn thì phải mua license Enterprise, của Ultralytics hoặc qua Roboflow ([ultralytics.com/license](https://ultralytics.com/license), em mới thấy qua snippet search, chưa mở trang).
- **Ultralytics, Core ML:** export CoreML được cho detect, segment, pose, OBB trên YOLOv8, YOLO11, YOLO26. Có tham số `nms`, `quantize` (16, 8, w8a16) ([docs](https://docs.ultralytics.com/integrations/coreml/)).
- **coremltools:** Unified Conversion API chỉ convert từ TensorFlow và PyTorch ([coremltools docs](https://apple.github.io/coremltools/docs-guides/source/unified-conversion-api.html)). Release notes 5.0 ghi "ONNX converters will be deprecated in coremltools 6" ([changelog](https://data.safetycli.com/packages/pypi/coremltools/changelog?page=4)). Vậy có file ONNX hay TFLite thôi thì không phải đường chính sang Core ML, cần bản PyTorch.
- **RF-DETR:** "The core models and all of the code are released under the Apache 2.0 license", phủ detection, instance segmentation và keypoint (bài ngày 10/03/2026, [Roboflow blog](https://roboflow.com/blog/rf-detr-is-free-to-use-commercially)). Bài không nhắc gì đến export Core ML. Đây là PyTorch nên về lý thuyết đi được qua coremltools, nhưng em **chưa kiểm** là có chạy được thật không.

## Khuyến nghị

**Chưa làm Core ML lúc này.** Lý do:

- Không có mô hình nào dùng ngay được (mục trên). Muốn có thì phải tự train, tức tốn công gán nhãn và train.
- `EdgeBandCueTracker` đã chạy trong app nhưng chưa đo trên clip thật, nên chưa biết nó hỏng ở đâu.

Thứ tự đề xuất:

1. Gán nhãn R1, R3 rồi chạy `sh scripts/pose-harness/run.sh R1.mov --eval r1-nhan.csv`. Đạt ngưỡng của phase 6 (trung vị sai góc ≤ 1,5°, ≥ 80% khung có ước lượng) thì dừng ở đây.
2. Không đạt thì xem nó hỏng kiểu nào trước khi tính đến train:
   - mất cơ khi tay che;
   - nền có cạnh song song với cơ;
   - cơ quá mảnh ở 1080p.

   Kiểu thứ nhất sửa được bằng cách nới `maxMisses` hoặc chấm lại trục, chưa cần mô hình.
3. Đến lúc phải train thì xếp hướng theo license:
   - RF-DETR, Apache 2.0, train trên dataset CC0 hoặc CC BY 4.0 ở trên, cần ghi công. Phải kiểm coremltools convert được trước khi gán nhãn thêm.
   - Ultralytics thì dính AGPL-3.0, chỉ dùng được khi chấp nhận AGPL hoặc mua license.
   - Create ML Object Detection chỉ cho bounding box. Hộp bao quanh cây cơ nghiêng không cho biết cơ chéo theo hướng nào, nên không thay được trục. Theo em biết, Create ML cũng không train keypoint tuỳ chỉnh. Điều này em chưa kiểm trên docs.



- Ở cuebit/cue-8ncak và billiard-vision, "cue" là cơ hay bi cái? Phải mở ảnh mẫu mới biết.
- Ảnh trong các dataset là bàn thật hay ảnh chụp màn hình game, và góc quay thế nào (quay sau lưng hay từ trên xuống)? Chưa kiểm.
- RF-DETR có convert sang Core ML qua coremltools được không, và chạy trên ANE ra sao? Chưa kiểm.

## Nguồn

- https://universe.roboflow.com/test-q8cb9/billiard-agrxg (đọc qua https://r.jina.ai/)
- https://universe.roboflow.com/siennas-workspace/billiards-detection
- https://universe.roboflow.com/vision-65sss/billiard-vision
- https://universe.roboflow.com/cuebit/billiards-ball-detection-lmzkl
- https://universe.roboflow.com/cuebit/cue-8ncak
- https://universe.roboflow.com/ours-workspace
- https://universe.roboflow.com/ours-workspace/pool-cue-instance
- https://universe.roboflow.com/423drpool/drpool
- https://app.readytensor.ai/publications/8-ball-pool-shot-predictor-CoPGzifug9rp
- https://cerv.aut.ac.nz/wp-content/uploads/2023/12/RP1_YANG-BONING-23Oct2023.pdf
- https://huggingface.co/datasets/nhantu2107/pool-detection
- https://arxiv.org/abs/2504.12045
- https://docs.roboflow.com/reference/changelog/changelog/february-2025/download-trained-model-weights-from-roboflow
- https://roboflow.com/ultralytics
- https://docs.ultralytics.com/integrations/coreml/
- https://apple.github.io/coremltools/docs-guides/source/unified-conversion-api.html
- https://data.safetycli.com/packages/pypi/coremltools/changelog?page=4
- https://roboflow.com/blog/rf-detr-is-free-to-use-commercially
- Chỉ thấy qua snippet search, chưa mở: https://discuss.roboflow.com/t/exporting-model/315/2, https://ultralytics.com/license
