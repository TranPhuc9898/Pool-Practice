#!/bin/sh
# Test hiệu chỉnh trên đúng ShotPhysics của app, so với số đo bàn thật trong do.csv. Chép file mới mỗi lần để không lệch
# code app; bản chép đổi 5 hằng cần fit sang `static var` để main.swift quét được, app không đổi.
set -e
here=$(cd "$(dirname "$0")" && pwd)
src="$here/../../modules/pool-table/ios/Editor"
out=$(mktemp -d)
trap 'rm -rf "$out"' EXIT
sed -E -e '/^enum ShotPhysicsFixture/,$d' \
  -e 's/static let (muSlide|muRoll|squirtDeg|spinDecay|railMu):/static var \1:/' \
  "$src/ShotPhysics.swift" > "$out/ShotPhysics.swift"
cp "$here/main.swift" "$out/"
swiftc -O -o "$out/harness" "$out"/*.swift
"$out/harness" "$here/do.csv" "$@"
