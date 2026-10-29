#!/bin/sh
# Biên dịch PoseFrame + PoseStroke + PoseClip + PoseFilter + PoseRear + PoseCue của app cùng main.swift rồi chạy. Chép file mới mỗi lần để không lệch code app.
set -e
here=$(cd "$(dirname "$0")" && pwd)
src="$here/../../modules/pool-table/ios/Pose"
out=$(mktemp -d)
trap 'rm -rf "$out"' EXIT
cp "$src/PoseFrame.swift" "$src/PoseStroke.swift" "$src/PoseClip.swift" \
  "$src/PoseFilter.swift" "$src/PoseRear.swift" "$src/PoseCue.swift" "$here/main.swift" "$out/"
swiftc -O -suppress-warnings -o "$out/harness" "$out"/*.swift
"$out/harness" "$@"
