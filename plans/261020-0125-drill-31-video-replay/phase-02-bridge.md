# Phase 2 — Cầu JS → native

## Việc
1. `DrillRecord.swift`: `ReplayRecord { dt, xy: [Double], contact: Int }`, `DrillRecord.replay: ReplayRecord?`.
2. `PoolTableView.tsx`: `NativeDrill.replay?` cùng shape.
3. `src/app/drill/[id].tsx`: object `drill` gộp round đem theo `replay: round.replay`. `rev` round đã đổi theo `roundIndex` nên native nạp lại mỗi round.

## Xong khi
tsc 0. Phase 3 đọc `props.drill.replay` ra đủ mẫu (NSLog số mẫu lúc Play, gỡ sau phase 4).
