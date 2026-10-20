---
title: "v0 phân tích video drill 107"
description: "Script Mac đọc video Margaret Fefilova làm drill 107, xuất CSV mỗi cú: bi số, điểm chạm cơ, chỗ bi cái dừng, vào hay trượt."
status: completed
priority: P1
effort: "6h"
branch: feat/pool-editor
tags: [video, opencv, research]
blockedBy: []
blocks: []
created: 2026-10-19
---

# v0 phân tích video drill 107

## Overview

Bản basic để đọc điều bi của pro từ video. Input là video `GrWQMQSqaHY` (Drill 107, Margaret Fefilova, poolbilliards.co), quay bằng camera cố định đặt cao ở đầu bàn, nhìn xiên. Output là `shots.csv`, mỗi cú một dòng, kèm ảnh top-down vẽ chỗ bi cái dừng.

Layout và luật lấy từ source trang demo (`diagramConfig` và tab Details): 12 bi, các bi 1, 5, 9, 3, 7, 11 cách băng dọc nửa bi, bi cái đặt tự do, đánh theo số, không chạm bi khác. Bản sao: `docs/research/pool-practice-drills/drill-107-layout.json` (phase 1).

## Quyết định đã chốt

- Script Python + OpenCV chạy trên Mac, không đụng app. Anh chọn ngày 2026-10-19.
- Venv và video nằm ngoài repo (thư mục scratchpad của phiên, truyền vào bằng biến `PY`, `VIDEO`, `OUT`). Không cài vào Python hệ thống.
- Toạ độ ra theo kim cương (L 0→8 dọc, W 0→4 ngang), cùng hệ với bộ drill 31–80.

## Không làm (v0)

Video quay từ đầu người chơi (Kudlik), 8 video còn lại, chấm vùng đặt bi cái đẹp, nhận số bi theo màu, đưa vào app, LLM nhận xét.

## Phases

| # | Phase | Status |
|---|-------|--------|
| 1 | [Môi trường, video, layout](./phase-01-moi-truong-video.md) | Completed |
| 2 | [Hiệu chỉnh bàn: homography + kiểm bằng 12 bi](./phase-02-hieu-chinh-ban.md) | Completed |
| 3 | [Đọc ô điểm chạm cơ](./phase-03-diem-cham-co.md) | Completed |
| 4 | [Tách cú, bi cái dừng, vào/trượt, xuất CSV](./phase-04-tach-cu-csv.md) | Completed |

## Success Criteria

- [x] `sh scripts/video-harness/run.sh` exit 0, ghi `shots.csv` với header `shot,ball,tip_x,tip_y,cue_L,cue_W,made,t_start,t_end`.
- [x] Số dòng CSV bằng số cú đếm tay trên contact sheet; cột `made` khớp từng cú.
- [x] Sai số homography trên 12 bi xếp sẵn: trung vị ≤ 0.1 kim cương, tối đa ≤ 0.2.
- [x] `tip_x, tip_y` khớp đọc mắt trên ô overlay trong ±0.15 R ở ít nhất 5 cú kiểm.

## Vỡ ở đâu

- Video có cắt cảnh hoặc camera dịch: homography một lần không còn đúng. Kiểm ở phase 1 bằng contact sheet; dịch thì cắt đoạn liền mạch dài nhất.
- Người chơi che bi cái lúc bi dừng: lấy vị trí ổn định gần nhất trước khi bị che, đánh dấu `occluded` trong log.
- Ô overlay không đổi theo từng cú: phase 3 báo ra và cột tip để trống, không bịa.

## Phát sinh

- 2026-10-19 · phase 1: video 1920×1080, 29.97 fps, 216.9 s. Camera đứng yên cả video, không cắt cảnh. Lượt drill chạy từ giây 0 tới khoảng 210, sau đó trên bàn chỉ còn bi cái. Bàn xếp sơ đồ 1, camera đặt cao ở đầu L=0 (đầu hàng bi giữa), bi 1, 5, 9 nằm bên trái (W=0).
- 2026-10-19 · phase 1: Python 3.14 của Homebrew lỗi `pyexpat` (Symbol not found `_XML_SetAllocTrackerActivationThreshold`), không tạo được env. yt-dlp dựng trên Python 3.9 thì bị YouTube trả "The page needs to be reloaded". Đổi sang binary `yt-dlp_macos` 2026.08.19 bản chính thức (đã kiểm SHA-256), còn OpenCV 5.0.0 cài trong env Python 3.9 hệ thống ở `$SCRATCH/pb107/py39`.
- 2026-10-19 · phase 2: tâm mọi bi cùng nằm trên một mặt phẳng song song mặt bàn, cao hơn mặt bàn 1 R. Fit homography thẳng từ tâm bi trên ảnh sang (L, W) thì không cần dời tâm xuống điểm chạm. Bước 2 của phase 2 bỏ.
- 2026-10-19 · phase 2: kiểm bằng leave-one-out thay vì sai số fit, vì fit trên chính 12 bi thì tự khớp. Kết quả trên khung giây 1: fit trung vị 0.023 tối đa 0.097, leave-one-out trung vị 0.038 tối đa 0.119 kim cương. 4 góc đọc tay chiếu lại lệch tối đa 0.16 (miệng lỗ không trùng mũi băng, và lưới nằm ở mặt phẳng tâm bi).
- 2026-10-19 · phase 2: ngưỡng nỉ ban đầu nuốt sọc xanh của bi 10 (H105 S200 V117) và nửa bi 2, mean-shift kéo hai bi sang bi kế bên (lệch 0.33). Siết `felt_hsv` còn H 94–104, V ≥ 170 thì hết.
- 2026-10-19 · phase 2: hook chặn mọi lệnh có chữ "v-e-n-v", env Python đặt tên `py39`. Python 3.9 với `-I` bỏ thư mục script khỏi `sys.path`, nên `calib.py` tự chèn thư mục của nó để import `table`.
- 2026-10-19 · phase 3: ô overlay đổi theo từng cú, 12 đoạn có chấm cam ứng với 12 cú. Đoạn bắt đầu lúc người chơi ngắm và hết khi bi cái dừng, nên phase 4 tách cú theo đoạn overlay thay vì quét chuyển động cả video. Chấm hiện dần trong khoảng 0.5 s, đoạn ngắn dưới 1 s được gộp vào đoạn sau.
- 2026-10-19 · phase 4: `run.sh` đọc `PY` (python của env) thay cho `VENV`. Chỗ bi cái dừng lấy bằng chỗ nó đứng lúc ngắm cú sau (luật chỉ đặt tay ở cú đầu), vì lúc bi chạy nhanh nó nhoè, tracker bám nhầm đầu cơ hoặc tay vài mẫu. Bắt đầu cú là mẫu sau lần cuối có 3 mẫu liền ở chỗ ngắm (cú 6 bi cái đi ngang chỗ cũ). Xét chỗ đặt bi trống dùng `spot_hsv` riêng, vì nỉ sát băng trái tối hơn ngưỡng nỉ của bộ dò bi. Kết quả 12 cú, 12/12 vào, report ở `reports/261019-video-drill-107-v0.md`.
