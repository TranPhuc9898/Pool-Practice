#!/bin/sh
# Biên dịch ShotPhysics của app cùng main.swift rồi chạy. Chép file mới mỗi lần để không lệch code app.
set -e
here=$(cd "$(dirname "$0")" && pwd)
src="$here/../../modules/pool-table/ios/Editor"
out=$(mktemp -d)
trap 'rm -rf "$out"' EXIT
sed '/^enum ShotPhysicsFixture/,$d' "$src/ShotPhysics.swift" > "$out/ShotPhysics.swift"
cp "$here/main.swift" "$out/"
swiftc -O -o "$out/harness" "$out"/*.swift
"$out/harness"
