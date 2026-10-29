#!/bin/sh
# Biên dịch DRILLS của app sang JS rồi duyệt bằng lint.js. Biên dịch lại mỗi lần để không lệch data app.
# Thêm số drill sau lệnh để chỉ in các drill đó: sh scripts/drill-lint/run.sh 12 31
set -e
here=$(cd "$(dirname "$0")" && pwd)
root="$here/../.."
out=$(mktemp -d)
trap 'rm -rf "$out"' EXIT
(cd "$root" && npx tsc --ignoreConfig src/pool-engine/drills/index.ts src/pool-engine/stages.ts src/pool-engine/topics.ts --outDir "$out" --module commonjs \
  --target es2022 --skipLibCheck --rootDir src/pool-engine)
node "$here/lint.js" "$out/drills/index.js" "$@"
