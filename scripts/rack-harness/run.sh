#!/bin/sh
# Biên dịch ShotPhysics + RackInHandSolver của app cùng main.swift rồi chạy. Chép file mới mỗi lần để không lệch code app.
set -e
here=$(cd "$(dirname "$0")" && pwd)
src="$here/../../modules/pool-table/ios/Editor"
out=$(mktemp -d)
trap 'rm -rf "$out"' EXIT
sed '/^enum ShotPhysicsFixture/,$d' "$src/ShotPhysics.swift" > "$out/ShotPhysics.swift"
cp "$src/RackPlanner.swift" "$src/RackSim.swift" "$src/RackInHandSolver.swift" "$here/main.swift" "$out/"
swiftc -O -o "$out/harness" "$out"/*.swift
"$out/harness" "$@"
