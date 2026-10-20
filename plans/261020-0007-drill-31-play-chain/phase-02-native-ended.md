# Phase 2: Native báo chỗ dừng và trượt

Status: done

## Việc
- `PoolEditorModel.onReplayEnd` đổi thành `((Bool, CGPoint?) -> Void)?`: ok và chỗ bi cái dừng (`r.cue.pts.last`, nil khi bi cái rơi).
- `PoolShotReplay.swift` khối tự đóng: truyền chỗ dừng.
- `PoolEditorView.swift` nhánh `playRev` thường: gửi `ended` kèm `cueX`, `cueY` chuẩn hoá theo `PoolEditorModel.width/length` (cùng hệ với `EditorStateRecord`). Trượt thì `EditorHaptics.fire(.warning, "Missed …" / "Cue ball scratched")`, vào thì `.selection "Pocketed …"`, cùng chữ với `endRack`.
- `toggleReplay` bị guard chặn (cú `.bad`) thì báo `ended` ok false, để JS hiện lý do thay vì im lặng.
- `PoolTableView.tsx`: thêm `cueX?`, `cueY?` vào kiểu event nếu event có kiểu.

## Xong khi
`npx expo run:ios --device E68CC13C-926C-47B9-BA3D-451EB3E74443 --no-bundler` build xanh, app nối lại Metro 8095.

## Rủi ro
Build lại mất vài phút. Metro 8095 của phiên khác, chỉ dùng, không tắt.

## Kết quả
`onReplayEnd` báo `ok`, `cueX/cueY`, `scratch`, `blocked`. Build dev client xanh.
