# Băng của guide và replay theo demo bi-cai-xoay — 2026-10-09

**Xong là:** cùng trạng thái đầu, `ShotPhysics.roll` và `simulate` của `docs/research/bi-cai-xoay.html` cho cùng số băng, điểm dừng lệch ≤ 0,5".
**Cách làm:** port nguyên `cushion()` + điều kiện va của demo vào `roll()` và `sim()` của prototype v4. Anh lấy demo làm chuẩn, và đã đo dt 1/240 của app chỉ lệch demo ≤ 0,2".
**Đánh đổi:** Gợi ý (RackSim, băng Mathavan) và guide (băng demo) dùng hai mô hình khác nhau, nên sau băng hai bên có thể lệch nhau. Số d03 cũ cũng hết dùng làm mốc.
**Không làm:** không thay ShotPhysics bằng RackSim (hướng của quyết định 10-08, cần plan riêng). Không cho bi mục tiêu chạy băng. Không port vùng má lỗ của demo.

## Bước

- [x] 1. Oracle `scratchpad/rail/oracle.js` (demo) + harness Swift gọi `roll()`, 6 ca: lăn, stun, kéo, phê thuận, phê nghịch, thẳng vào băng. Port cushion vào `modules/pool-table/ios/Editor/ShotPhysics.swift`: giữ ω qua băng, Jt đủ ba trục, e 0,82, chỉ va khi v·n < 0, kẹp vị trí → xong khi: 5 ca không rơi lỗ lệch ≤ 0,5" và cùng số băng
- [x] 2. Cùng cushion trong `sim()` của `docs/prototypes/soan-bai-v4.dc.html` → xong khi: `node docs/prototypes/soan-bai-v4.check.js d03` và harness Swift d03 lệch ≤ 0,02"
- [x] 3. Guide vẽ nét theo pha từng đoạn (trượt liền, lăn đứt), mốc lăn ở mỗi lần trượt→lăn trong `PoolEditorGuides.swift` → xong khi: ảnh sim cú culê có băng thấy đoạn nét liền ngay sau băng
- [x] 4. Replay: bỏ giả định lăn ngay sau băng trong `PoolShotReplay.swift` (nếu còn) → xong khi: ảnh `?fixture=play@t` ngay sau băng ra pill "Trượt", ρ khác 1
- [x] 5. Sửa `docs/aiming-physics.md` dòng 134, 155, 174 → xong khi: `grep -c "lăn đều ngay" docs/aiming-physics.md` ra 0
- [x] 6. Kiểm cuối → xong khi: `npx tsc --noEmit` và `npx expo lint` exit 0, xcodebuild ra BUILD SUCCEEDED

## Vỡ ở đâu

- Lật trục y sai dấu ω khi đổi khung → kiểm bằng: ca phê thuận và phê nghịch ở bước 1 phải khớp cả hai, không chỉ một
- Bi trượt lại sau băng làm `rollAt` cũ và rollMark vẽ sai chỗ → kiểm bằng: grep `rollAt` sau bước 3, chỉ còn chỗ có nghĩa
- Gần lỗ, app có băng còn demo không → kiểm bằng: ca phê thuận (demo vào lỗ) ghi lệch vào Phát sinh, không ép khớp

## Phát sinh
- Bước 1, lần 1 lệch 0,4–1,9" dù cùng số băng: do bước chuyển trượt→lăn bỏ mất u (demo trừ u/3,5) và vị trí dùng vận tốc mới (demo dùng trung bình). Đã sửa cả hai trong `roll()`. Sau sửa: lăn, stun, kéo, thẳng băng lệch ≤ 0,1".
- Bước 1, ca phê nghịch: app bắt vào lỗ giữa trái ở (1,5; 51,8), cách tâm 2,4". Bán kính bắt lỗ của app là 2,4" cho cả 6 lỗ, demo là 2,44" lỗ góc và 2,2" lỗ giữa. Harness đặt 2,2" thì ra (41,9; 82,8), demo (41,8; 82,8). Chờ anh quyết.
- `approach()` (đoạn tới bi mục tiêu) còn cùng lỗi chuyển trượt→lăn, ngoài phạm vi plan.
- Bước 1, theo anh giao: bán kính rơi lỗ theo demo, góc 2,44" và giữa 2,2" (`ShotPhysics.catchRadius`). `pocketCatch` 2,4" giữ cho PoolEditorRack. Ca phê thuận rơi đúng chỗ demo, đếm băng 3 so với 4.
- Bước 3: gỡ hẳn `Run.rollAt` khỏi `ShotPhysics.swift` vì guide không còn dùng, và dòng gán rollAt lúc chạm băng giờ sai (bi đang trượt). `grep rollAt` ra 0.
- Bước 5: dòng 155 và 174 tả Aim Lab (code riêng, vẫn e 0,8, sau băng hết trượt), không phải ShotPhysics. Đã ghi rõ hai bên thay vì xoá. `grep -c` ra 1 vì dòng 64 ("h = 0.4R lăn đều ngay", chuyện điểm đặt cơ, không dính băng). Tiêu chí bắt nhầm dòng này, chờ anh quyết.
