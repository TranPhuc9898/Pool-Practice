---
phase: 1
title: "Môi trường, video, layout"
status: completed
priority: P1
effort: "1h"
dependencies: []
---

# Phase 1: Môi trường, video, layout

## Goal
Có venv chạy được OpenCV, video Fefilova trên máy, và biết đoạn nào trong video là một lượt drill 107 liền mạch với camera đứng yên.

## Files to Create / Modify
- Create: `docs/research/pool-practice-drills/drill-107-layout.json` (2 sơ đồ đổi sang kim cương, luật, nguồn)
- Ngoài repo: `$SCRATCH/pb107/venv/`, `$SCRATCH/pb107/video/GrWQMQSqaHY.mp4`, `$SCRATCH/pb107/frames/`

## Tasks & Steps
1. `python3 -m venv $SCRATCH/pb107/venv`, cài `yt-dlp opencv-python-headless numpy`.
2. Tải video ≤ 1080p mp4 vào thư mục riêng `video/`. `ffprobe` ghi fps, độ phân giải, độ dài.
3. `ffmpeg` tách 1 khung/giây, ghép contact sheet. Xem để biết: có intro hay cắt cảnh không, camera có dịch không, đoạn lượt drill từ giây nào đến giây nào, bàn đang xếp sơ đồ 1 hay 2, đầu bàn nào gần camera.
4. Đổi `diagramConfig` sang kim cương (đối chiếu ảnh chụp: bi đường giữa W=2, bi băng W=0.18/3.82 theo mô tả "half a ball off"), ghi JSON.

## Verification
- `$VENV/bin/python -c "import cv2; print(cv2.__version__)"` in ra version.
- Ghi vào `## Phát sinh` của plan.md: fps, độ phân giải, đoạn thời gian dùng, sơ đồ số mấy, hướng camera.
