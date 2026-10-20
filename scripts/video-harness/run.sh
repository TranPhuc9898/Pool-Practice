#!/bin/sh
# Đọc video drill 107 (poolbilliards.co) ra shots.csv và shots.png. Env Python có OpenCV và video nằm ngoài repo:
#   PY=<env>/bin/python VIDEO=<thư mục>/GrWQMQSqaHY.mp4 OUT=<thư mục ra> sh scripts/video-harness/run.sh [calib|tip]
# calib: kiểm homography bằng 12 bi xếp sẵn, lưu calib.png. tip: in các đoạn ô điểm chạm cơ, lưu crop. Mặc định: phân tích cả lượt.
set -e
here=$(cd "$(dirname "$0")" && pwd)
: "${PY:?đặt PY là python của env có opencv}" "${VIDEO:?đặt VIDEO là file mp4}" "${OUT:?đặt OUT là thư mục ra}"
case "$1" in
  calib) shift; exec "$PY" -I "$here/calib.py" "$VIDEO" "$OUT" --check "$@" ;;
  tip) shift; exec "$PY" -I "$here/tip.py" "$VIDEO" "$OUT" --dump "$@" ;;
  *) exec "$PY" -I "$here/analyze.py" "$VIDEO" "$OUT" "$@" ;;
esac
