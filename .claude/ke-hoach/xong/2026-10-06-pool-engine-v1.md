# Pool Training Engine V1 — 2026-10-06

**Xong là:** trên simulator, mở Train → Drill 01, bấm Next tới Drill 10, mỗi drill bàn + bi + target + guide đổi đúng theo data, không crash.
**Cách làm:** local Expo module `modules/pool-table` (SwiftUI qua ExpoSwiftUI.View), drill là data TS gửi xuống dạng toạ độ chuẩn hoá — vì spec đòi render bằng Swift mà không muốn glue ObjC++.
**Đánh đổi:** mất Expo Go (phải dev build, mỗi lần đổi Swift là build lại) và Android chỉ có placeholder, đổi lấy renderer native một nguồn logic.
**Không làm:** Android renderer, lưu tiến độ xuống đĩa, kéo/đổi bán kính target zone trong dev editor, physics.

## Bước

- [x] 1. Lát mỏng: `expo-dev-client`, `expo-clipboard`, module `modules/pool-table/ios/PoolTableView.swift` nhận prop `drill` (cueBall x,y) vẽ mặt bàn + 1 hình tròn, mount ở `src/app/drill/[id].tsx` → xong khi: `npx expo run:ios` build xong, screenshot thấy hình chữ nhật + chấm; sửa `x` trong file TS rồi reload thì chấm dời chỗ
- [x] 2. Hình học WPA + bàn tĩnh trong `ios/Renderer/PoolTableGeometry.swift`, `PoolTableTheme.swift`, debug overlay → xong khi: screenshot đếm được 6 lỗ, 18 diamond; bật Show Geometry, nhãn `ball/width` ra 0.045 ở cả container 200pt và 360pt
- [x] 3. Bi: `ios/Balls/PoolBallStyle.swift`, `TournamentBlackStyle.swift`, `TournamentBlackPalette.swift` + màn rack 16 bi trong `src/app/design-system.tsx` → xong khi: screenshot thấy bi 9 hai cực đen, bi cái 6 chấm; đổi style sang stub `FlatBallStyle` một dòng thì cả 16 bi đổi
- [x] 4. Model + 10 drill trong `src/pool-engine/types.ts`, `src/pool-engine/drills/*.ts`, mirror `ios/Drills/*.swift` → xong khi: `npx tsc --noEmit` exit 0 và `grep -c "satisfies PoolDrill" -r src/pool-engine/drills` ra 10
- [x] 5. Overlay `ios/Rendering/PoolGuideRenderer.swift`, `PoolTargetRenderer.swift` (target, object/cue path, ghost, tangent, rail contact, toggle, path trim 250ms, tôn trọng Reduce Motion) → xong khi: Drill 07 thấy tangent vuông góc + target nằm trên nó; Drill 09 thấy đường qua băng; tắt Guide thì mất hết line
- [x] 6. UI: `src/app/(tabs)/train/index.tsx` list 10 drill, `src/app/drill/[id].tsx` detail (attempts ○×10, Start/Complete/Fail/Reset/Prev/Next/Info), tiến độ trong bộ nhớ ở `src/pool-engine/progress.ts` → xong khi: Drill 01 → Next ×4 ra Drill 05 với bi khác chỗ; Complete 7 lần thì item ở list hiện Passed; xoay simulator ngang thì bi vẫn đúng chỗ so với diamond
- [x] 7. Dev mode: kéo bi trong `ios/Interaction/PoolTableInteraction.swift`, nhãn x/y lúc kéo, event `onBallMove` lúc thả, nút Copy JSON → xong khi: kéo bi cái, bấm Copy, `xcrun simctl pbpaste booted` ra JSON có `x` mới khớp nhãn

## Vỡ ở đâu

- ExpoSwiftUI không decode được prop lồng (mảng bi, union target) → kiểm bằng: bước 1 truyền nguyên object drill có mảng, log `print` phía Swift ra đủ trường
- Pods/build hỏng với RN 0.86 + Xcode 26.6 → kiểm bằng: bước 1, `npx expo run:ios` exit 0 trước khi viết renderer
- Canvas bàn vẽ lại mỗi lần state RN đổi → kiểm bằng: đếm số lần draw bằng `print`, bấm Complete 5 lần, số draw của layer bàn không tăng

## Phát sinh
- `pod install` cần `LANG=en_US.UTF-8`, không thì CocoaPods 1.17 + Ruby 4 crash vì encoding. Chạy `expo run:ios` cũng phải export biến này.
- Podfile để deployment target 16.4, nên podspec của module phải ≤ 16.4. Để 17.0 thì autolinking im lặng bỏ qua module.
- Swift `print` không vào os_log. Muốn đọc log thì dùng `NSLog` + `log stream`.
- Thêm file `.swift` mới vào module thì phải `pod install` lại (CocoaPods chỉ glob lúc install), không thì báo `cannot find ... in scope`.
- Màn design-system crash `[Worklets] Cannot copy value of type CubicBezierEasing` (có từ trước): worklet trong `slider.tsx` chạm `t.motion.spring.snappy` nên capture cả theme. Đã rút `snappy` ra ngoài worklet (3 dòng) vì nó chặn dấu hiệu kiểm bước 3.
- Thêm `children` vào `DesignSystemPreview` để chèn rack lên đầu.
- Bước 4: `grep -c -r` in số theo từng file (10 file drill × 1, index.ts 0), tổng 10. `[id].tsx` bỏ SKELETON, đọc drill thật theo `id` vì type native đổi.
- Bước 5 phải đụng thêm ngoài 2 file nêu tên: mount layer + prop `showGuide` trong `PoolTableView.swift`/`.tsx`, query `guide=0` ở `[id].tsx` để kiểm toggle. Thêm `cueBallPath` vào data drill 09, 10 để tuyến bi cái liền từ bi cái tới ghost.
- Bước 6: list hiện "Level n" thay vì số sao cho độ khó.
- Vỡ ở đâu #3 đã kiểm: NSLog tạm trong Canvas `PoolTableSurface`, mở drill/5 rồi Start + Complete ×7, `grep -c "POOLDRAW surface"` vẫn 1. Đã gỡ log, rebuild.
- Bước 6 kẹt: `app.json` khoá `"orientation": "portrait"` nên simulator không xoay ngang được, vế "xoay ngang bi vẫn đúng chỗ" chưa kiểm được. Hai vế kia đạt (Next ×4 ra 05 Draw bi khác chỗ; Complete ×7 → list hiện PASSED).
- Anh báo: màn stack phải luôn có back. Mở lạnh `pooltraining://drill/5` thì drill là màn duy nhất trong stack, không có back. Thêm `unstable_settings = { initialRouteName: '(tabs)' }` vào `src/app/_layout.tsx`, mở lạnh lại thấy back, bấm về Today. Metro chạy `CI=1` thì không watch file, phải bật không CI.
- Gỡ kẹt bước 6 (anh duyệt): `npx expo install expo-screen-orientation`, `app.json` `"orientation": "default"` + plugin `initialOrientation: PORTRAIT_UP`, `[id].tsx` `useFocusEffect` unlock/khoá dọc lại khi rời màn. Phải prebuild + pod install + rebuild. Xoay ngang Drill 01: bi 1 nằm ngang foot spot, 3/4 bề rộng, line vào lỗ footRight; bi cái 0.39/0.39, thẳng hàng. Tab vẫn dọc.
- Anh duyệt: tab Drills hết placeholder, list 10 drill nhóm theo category (Shot making 1, Cue ball control 8, Pattern play 1). Rút `src/components/drill-card.tsx` dùng chung với Train.
- Bước 7: bật bằng query `dev=1` (chỉ `__DEV__`), nút Copy JSON chỉ hiện khi bật. Bi đã kéo đè lên drill ở JS nên guide vẽ lại theo chỗ mới; Swift giữ `moved` để bi không giật về chỗ cũ trước khi prop mới tới. Kéo bi cái → nhãn `x 0.709 y 0.749`, pbpaste ra `"x": 0.709, "y": 0.749`.
- Xong là: Train → 01 → Next ×9 tới 10, chụp từng màn, bi/target/guide khớp data cả 10, không crash. Tiến độ trong bộ nhớ mất khi reload JS (đúng phạm vi: không persist).
