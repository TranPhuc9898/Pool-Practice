# Phase 3 — ShotReplay từ đường ghi

## Việc
1. `PoolShotReplay.swift`: `init(recorded:)` hoặc `static func recorded(...)` dựng `ShotReplay` không qua `ShotPhysics`:
   - `cue`: mỗi mẫu `add(i·dt, p, v:, w: v, wz: 0)`, v sai phân trung tâm (inch/s), mẫu cuối v = 0, rồi `orient(from: restPose(0))`. Không `spinOut`.
   - `contact = contact·dt`.
   - `ob`: đứng ở chỗ bi mục tiêu tới `contact`, rồi đi thẳng tới `ShotPhysics.target(pocket)`. Tốc đầu = tốc bi cái trước chạm × cos(góc cắt), giảm đều, tốc tối thiểu khi tới lỗ 10 in/s để chắc rơi. `sink = true`, `orient(from: restPose(ball))`.
   - `others = [:]`, `jump` như cũ (reduce motion hiện vị trí cuối).
2. `PoolEditorView.swift`, nhánh `playRev` không phải rack: có `props.drill.replay` và bàn còn ở thế video (bi cái, bi mục tiêu lệch ≤ 0.5 in so với `props.drill`) thì `model.play(ShotReplay(recorded:...))`, không thì `toggleReplay` như hiện tại. `onReplayEnd` giữ nguyên: ok = ob.sink && !cue.sink, cue = điểm cuối.
3. Build dev client (`npx expo run:ios` trên simulator E68CC13C…).

## Xong khi
Build xanh. Play bi 1: bi cái đi đúng hình `expectedCuePath`, bi 1 rơi lỗ guide, haptic chạm đúng lúc, sang bi 2 với bi cái đúng `cueBall` bi 2.
