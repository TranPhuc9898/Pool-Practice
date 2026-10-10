---
title: Vẽ bi bida xoay thật (lăn, trượt, xoáy lui, phê) trên iOS, nhìn từ trên xuống
date: 2026-10-09
type: research
mode: deep dive
---

# Vẽ bi xoay thật trên iOS cho bàn nhìn từ trên xuống

Nhãn: **[đã đọc]** = đã mở URL và đọc nội dung; **[đã kiểm code]** = đọc trong repo; **[suy luận]** = em tự suy, chưa có nguồn hoặc chưa đo.

## 0. Lệch so với bối cảnh trong đề bài (cần anh xác nhận)

- [đã kiểm code] Trong `modules/pool-table/ios/Editor/ShotPhysics.swift` (working tree hôm nay), `static let dt: CGFloat = 1 / 240`, không phải 1/1000–1/2000 s.
- [đã kiểm code] Spin không lưu dạng ω ba trục rad/s. `roll(from:v:w:others:)` dùng `w: CGPoint` là "vận tốc tương đương, inch/s", lăn đều khi `w == v` (`wx = vx; wy = vy`). Không có ωz (phê). `approach(...)` còn là 1D (`w = 2.5 * tip * v0`). Có thể engine ω ba trục nằm ở nhánh hay file khác mà em không thấy.
- [đã kiểm code] `ShotReplay.Track` chỉ lưu `ts` và `pts` (vị trí), nội suy tuyến tính. Chưa có chỗ chứa hướng bi.
- [đã kiểm code] `app.json` đã có `"CADisableMinimumFrameDurationOnPhone": true`. Podspec module `s.platforms = { :ios => '16.4' }`.
- [đã kiểm code] `PoolBallView` hiện là `Canvas` riêng cho từng bi, `.equatable()`. Phần replay dùng `TimelineView(.animation)`. `TournamentBlackStyle` mỗi lần vẽ chạy `drawLayer`, vài gradient và một `Text`.

Đổi `w` (in/s, quy ước "lăn đều ⇔ w = v") sang ω (rad/s), theo khung X phải, Y xuống (toạ độ màn hình), Z = X×Y **đâm vào mặt bàn**, điểm tiếp xúc ở r_c = +R·Ẑ [suy luận, tự suy từ điều kiện lăn v + ω×r_c = 0]:

```
ω = ( w.y / R, −w.x / R, ωz )      // R = ballRadius = 1.125 in
```

Kiểm tay: v = w = (1,0) → ω = (0,−1/R,0) → đỉnh bi (r = −R·Ẑ, phía người xem) có vận tốc ω×r = (+1,0,0), chạy cùng chiều bi. Đúng là lăn tới. Trong khung này ωz > 0 là quay **theo chiều kim đồng hồ khi nhìn từ trên**, vì Z chĩa xuống bàn. Phải chốt quy ước này một lần rồi viết test, vì ngay trong pooltool cũng từng sai chiều nhân (xem mục 1).

## 1. Tích phân hướng bi từ ω

**Công thức.**
- [đã đọc] Phương trình động học quaternion là q̇ = ½ Ω(ω) q. Với ω không đổi trong Δt có lời giải đóng (exponential map): q_{t+1} = [cos(|ω|Δt/2) I + sin(|ω|Δt/2)/|ω| · Ω(ω)] q_t. Bản tuyến tính bậc 1 là [I + ½Ω(ω)Δt] q_t. Nên chuẩn hoá q sau mỗi bước "to avoid any round-off errors". Trang này phát biểu ω theo **khung thân (body frame)**. https://ahrs.readthedocs.io/en/latest/filters/angular.html
- [đã đọc] pooltool (Evan Kiefl, Panda3D) làm đúng cách đó trong `pooltool/ani/utils.py::as_quaternion`. Quaternion không thuộc state vật lý mà được tích phân lại từ ω dọc history: `half = 0.5*|ω|*(t[i]-t[i-1])`, `dq = (cos half, ω̂·sin half)`, rồi **q_i = dq ⊗ q_{i-1}** (nhân trái, tức ω khung thế giới) và `quats[i] /= norm` mỗi bước. Comment trong code ghi công thức lấy từ StackOverflow 23503151, "the correct quaternions are produced only after reversing the order of multiplication". https://raw.githubusercontent.com/ekiefl/pooltool/main/pooltool/ani/utils.py
- [đã đọc] Thread Panda3D năm 2020 của ekiefl (cùng username với tác giả pooltool): đổi góc xoay tích luỹ sang HPR rồi sang quaternion thì bi "lăn sai" sau va chạm. Cách vá là rút rotation vector về dạng nhỏ nhất (`Rotation.from_rotvec(v).as_rotvec()`). Bài học: **không tích luỹ góc hay rotation vector**, phải tích luỹ thẳng orientation. https://discourse.panda3d.org/t/solved-converting-angular-displacement-to-hpr-for-a-billiard-ball-gif-inside/26015

**Áp vào app** [suy luận]:
- Dùng quaternion (`simd_quatf` hoặc `simd_quatd`), không dùng ma trận. Ma trận 3×3 trôi khỏi trực giao và phải Gram-Schmidt, còn quaternion chỉ cần normalize 4 số.
- ω engine trả ra là khung thế giới (cố định với bàn), nên dùng `q = simd_quatd(angle: |ω|Δt, axis: ω̂) * q`, nhân trái giống pooltool. Nếu nhân phải thì bi quay quanh trục gắn theo thân bi và sai ngay khi có hai thành phần ω.
- Tích phân **ngay trong vòng lặp vật lý**, ở cùng `dt`. Với dt = 1/240 và 10 bi, mỗi giây mô phỏng chỉ khoảng 2.400 phép nhân quaternion, không đáng kể. Mỗi lần cập nhật đã dùng exponential map đóng nên bước lớn vẫn đúng, miễn ω không đổi trong bước.
- Lưu q cùng `pts` trong `Track` (thêm `qs: [simd_quatf]`). Khi phát lại, **chỉ slerp giữa hai mẫu liền kề có góc lệch < 180°**. Slerp luôn đi đường ngắn, nên hai mẫu lệch > 180° sẽ cho bi quay ngược. `roll(...)` hiện chỉ append `pts` khi chạm băng, tức là mẫu thưa. Vì vậy phải lưu q dày (mỗi bước, hoặc mỗi 1/240 s), không lưu theo sự kiện. pooltool dùng `LerpPosQuatInterval` giữa các mẫu history (đã đọc ở `pooltool/objects/ball/render.py`), nên cũng có rủi ro này nếu history thưa. Em chưa kiểm pooltool xử lý chỗ này thế nào.
- Chiếu khi nhìn từ trên (trực giao, Z chĩa xuống bàn): một điểm b trên thân bi (vector đơn vị khung thân) nằm ở thế giới p = q·b·q⁻¹. Nó hiện ở `center + R·(p.x, p.y)` và **chỉ thấy khi p.z < 0** (hướng về người xem). Làm chiều ngược lại trong shader: pixel (x, y) trong đĩa cho n = (x, y, −√(1−x²−y²)), rồi b = q⁻¹·n·q và tra pattern bằng b.

## 2. Các cách vẽ và giá

Có một sự thật dùng cho mọi phương án: 10 hình cầu là tải GPU rất nhỏ với bất kỳ engine nào. **Giá thật nằm ở độ phức tạp tích hợp và ở API availability, không nằm ở GPU** [suy luận].

### a. SceneKit sphere + texture
- [đã đọc] WWDC25 session 288 "Bring your SceneKit project to RealityKit" (tháng 6/2025) nói: "this year Apple is officially deprecating SceneKit across all platforms", "This is a soft deprecation", "SceneKit is now entering maintenance mode. Apple will only fix critical bugs", "there's no plan to hard deprecate SceneKit", và không khuyên dùng cho "new app or a significant update". https://developer.apple.com/videos/play/wwdc2025/288/
- [đã đọc] Hiệu năng không phải vấn đề ở 10 node. Một thread Apple Forums (02/2025, iPad 10th gen, iPadOS 18.3) chỉ thấy chậm từ 750–1.000 node trở lên. https://developer.apple.com/forums/thread/774697
- Giá [suy luận]: phải chồng một `SCNView` (UIViewRepresentable) lên hoặc dưới bàn `Canvas`, khớp camera trực giao với `PoolTableGeometry`, làm lại bóng, hit-test và pocket fade bên ngoài SwiftUI. Mất khoảng 2–4 ngày. Đi lên một framework đã deprecated. **Loại.**

### b. RealityKit
- [đã đọc] `RealityView` cần iOS 18.0+, nên không dùng được với target 16.4 nếu không gate. https://developer.apple.com/documentation/realitykit/realityview.md
- [đã đọc] `ARView` với `cameraMode = .nonAR` chạy từ iOS 13 ("fully virtual environment"). https://developer.apple.com/documentation/realitykit/arview/cameramode-swift.enum/nonar.md
- Giá [suy luận]: giống SceneKit (thêm một surface Metal riêng, phải khớp camera và bóng), cộng thêm việc dựng entity, material và cập nhật mỗi frame qua `SceneEvents.Update`. Quá nặng cho 10 quả cầu trên một bàn 2D. **Loại.**

### c. Metal shader trong SwiftUI (iOS 17+)
- [đã đọc] `Shader`, `colorEffect`, `layerEffect`, `distortionEffect` đều cần iOS 17.0+. `Shader` conform `ShapeStyle`, chữ ký `[[ stitchable ]] half4 name(float2 position, args...)`. Có `compile(as:) async` để biên dịch trước, tránh khựng ở lần dùng đầu. https://developer.apple.com/documentation/swiftui/shader.md
- [đã đọc] **Dùng được ngay trong `Canvas`** qua `GraphicsContext.Shading.shader(_:bounds:)` (iOS 17.0+): "fills with the results of querying a shader for each pixel". Nghĩa là `context.fill(Path(ellipseIn: rect), with: .shader(...))` mà không cần bỏ kiến trúc Canvas hiện tại. https://developer.apple.com/documentation/swiftui/graphicscontext/shading/shader(_:bounds:).md
- [đã đọc] Tham số: `float4` (đủ cho quaternion), `floatArray`, `color`, `colorArray`, `data`, và `image` → `texture2d<half>` với giới hạn "**only one image parameter is supported per Shader instance**". Như vậy số 1–15 phải gom vào một atlas. https://developer.apple.com/documentation/swiftui/shader/argument.md
- [đã đọc] Đã có tiền lệ production cho kỹ thuật "ray-cast hình cầu trong shader 2D": Skia/Skottie `SphereEffect.cpp` giao tia với cầu đơn vị (`to_sphere`, có `side_select` chọn mặt trước hoặc sau), xoay pháp tuyến bằng ma trận, rồi tra UV bằng `atan` và `asin`. https://skia.googlesource.com/skia/+/chrome/m138/modules/skottie/src/effects/SphereEffect.cpp
- Giá [suy luận]: khoảng 1 file `.metal` (~80–120 dòng) và ~60 dòng Swift. Mỗi pixel: tính n, xoay bằng q⁻¹, rồi phân loại vùng. Sọc là |b·a| < h. Đĩa số là b·d > cos(r_disc), lấy mẫu atlas theo toạ độ tiếp tuyến. Ánh sáng (đốm bóng, mép tối) tính theo n **thế giới** nên đứng yên, pattern tính theo b **thân** nên quay. Bi khoảng 30 pt × 3x ≈ 90×90 px, 10 bi ≈ 81k pixel. Thêm 8 mẫu motion blur thì cỡ 650k lần tra mỗi frame, rất nhẹ với GPU iPhone 17 Pro Max. **Chưa đo.** Rủi ro chưa biết: Canvas fill bằng shader có tạo offscreen pass hay làm hỏng `.equatable()` không. Phải đo bằng Instruments (Animation Hitches).

### d. 2D thuần trong Canvas (chiếu trực giao)
- [suy luận] Chạy được trên 16.4. Đĩa số là chỏm cầu tâm d, chiếu thành ellipse tâm R·(d.x, d.y), trục nhỏ theo hướng bán kính co theo |d.z|. Vẽ Text với `CGAffineTransform` (xoay theo góc chiếu, scale theo |d.z|), và ẩn khi d.z > 0 (mặt sau). Dải sọc là đĩa trừ hai chỏm. Mỗi chỏm có biên là ellipse, nhưng khi chỏm vắt qua mép (limb) thì vùng thấy được bị giới hạn bởi cung ellipse cộng cung limb. Phải tách nhiều trường hợp theo dấu a.z và theo h.
- Giá [suy luận]: chừng 150–250 dòng hình học, có nhiều ca biên dễ sai (đĩa số cắt mép, sọc gần như song song với trục nhìn). **Không làm được motion blur rẻ.** CPU: 10 bi × (vài path + 1 Text) mỗi frame, ngang mức `TournamentBlackStyle` hiện tại. Hợp làm fallback rút gọn, ví dụ chỉ chấm/đĩa số, bỏ sọc.

## 3. Game/sim thật làm thế nào

- [đã đọc] **pooltool** (Panda3D, JOSS/pyOpenSci 2024): bi là model 3D có texture. Hướng bi tích phân từ ω ở bước render (mục 1), vị trí và quaternion phát lại bằng `LerpPosQuatInterval` theo `playback_speed` ("Simulation seconds per second of playback"), tức là có slow-mo thật. https://github.com/ekiefl/pooltool , https://raw.githubusercontent.com/ekiefl/pooltool/main/pooltool/objects/ball/render.py
- [đã đọc, nguồn yếu] **8 Ball Pool (Miniclip)**: một câu trả lời trên Unity Discussions (05/2021) khẳng định game "is 2d, 100%", dùng animation tạo cảm giác lăn. Đây là ý kiến diễn đàn, Miniclip không xác nhận. https://discussions.unity.com/t/a-simple-question-about-3d-sphere-and-8-ball-pool/246453
- [không tìm được nguồn kỹ thuật] **Virtual Pool 4 (Celeris)** và **ShootersPool**: chỉ thấy trang cộng đồng và review, không có bài hay talk nào về cách render spin. Kết quả tìm được: https://steamcommunity.com/app/336150/discussions/0/364040166686031256 (chỉ nói về bộ đếm FPS). Em không kết luận gì về hai game này.
- [chưa đọc được, bị 429] Godot Shaders có "Billiard Sphere Shader (2D)" và "2D Spherical Rotations in any Direction From Image" (dùng quaternion, xoay ảnh UV thành cầu trong engine 2D). Đây đúng kỹ thuật (c), nhưng em mới thấy snippet search nên không dùng làm nguồn. https://godotshaders.com/shader/billiard-sphere-shader-2d/

## 4. Nhìn thấy gì để phân biệt trạng thái, và chuyện aliasing

**Định nghĩa và dấu hiệu:**
- [đã đọc] Dr. Dave: sliding/stun là "translation with no topspin or bottom spin". Rolling là "forward motion with the right amount of topspin to prevent sliding". Bi **vẫn lăn được khi có phê**: "Once full roll develops… the ball continues to roll forward with sidespin". Vệt mực trên bi khi đó là một vòng tròn **nghiêng**, càng phê nhiều càng nhỏ và nghiêng. Pure sidespin + stun thì "slides at first but immediately starts to develop forward roll". https://drdavepoolinfo.com/?p=2460
- [đã đọc] Natural roll ứng với tip offset 2/5 R, R = 9/8 in (0,45 in). Overspin ngay từ tip "for all practical purposes" không có, nhưng có thể xuất hiện sau va chạm. https://drdavepoolinfo.com/?p=2220
- [đã đọc] Bi luyện "Measles" (Aramith, 6 chấm đỏ) sinh ra vì bi trắng trơn không cho biết đang lăn, trượt hay có phê. Draw: chấm "spinning backward" trong khi bi đi tới. Follow: chấm "rolling forward immediately". Phê: chấm "spinning like a top" quanh trục đứng. https://pooltableportfolio.com/blogs/magazine/the-red-dot-cue-ball
- [đã đọc] Danh mục high-speed video của Dr. Dave (HSV 3.1 stop shot mất backspin theo quãng đường, 4.1 draw, A.46–A.54 follow, A.98–A.109 sidespin/squirt). Trang không ghi FPS hay loại bi đánh dấu. https://drdavepoolinfo.com/high-speed-video/

**Dịch sang hình nhìn từ trên** [suy luận]:
| Trạng thái | ω so với v | Điều mắt thấy từ trên |
|---|---|---|
| Trượt (stun) | ω ≈ 0 | Bi tịnh tiến, số/sọc **đứng im** |
| Lăn | ω ⟂ v, R\|ω\| = \|v\| | Dấu chạy từ mép sau qua đỉnh tới mép trước, **cùng chiều** bi đi, tốc độ trên đỉnh bằng v |
| Xoáy lui (draw) | ω ngược chiều lăn | Dấu chạy **ngược** chiều bi đi |
| Trượt có topspin chưa đủ | 0 < R\|ω\| < \|v\| | Dấu chạy cùng chiều nhưng chậm hơn bi |
| Phê (ωz) | trục đứng | Dấu quay **trong mặt phẳng** quanh tâm đĩa. Góc nhìn từ trên là góc rõ nhất để thấy phê |
| Lăn + phê | trục nghiêng | Quỹ đạo dấu là vòng tròn nghiêng như vệt mực của Dr. Dave |
| Xoáy đứng tại chỗ | v = 0, ω ≠ 0 | Chỉ có pattern quay |

**Aliasing:**
- [đã đọc] Wagon-wheel là temporal aliasing. Dấu nhảy đúng một chu kỳ đối xứng mỗi frame thì trông đứng im, thiếu một chút thì trông quay ngược. https://en.wikipedia.org/wiki/Wagon-wheel_effect
- [đã đọc] MIT (Durand), "Motion blur is the temporal prefilter — the two are one tradeoff": blur theo thời gian chính là bộ lọc chống aliasing. https://people.csail.mit.edu/fredo/comp-photo-book/12-video-01-motion-blur-and-temporal-sampling.html
- [đã đọc] Ngay trong giới bida, người xem video cũng đọc sai chiều spin vì stroboscopic. Bob Jewett trên AZB, 10/2020: "you're failing to take the stroboscopic effect of video into account". https://forums.azbilliards.com/goto/post?id=6768766
- [đã đọc] Muốn trên 60 Hz trên iPhone thì cần khoá `CADisableMinimumFrameDurationOnPhone` (Apple, qua iMore 25/09/2021). App đã bật khoá này. https://www.imore.com/apple-clears-120hz-iphone-13-pro-confusion-developers

Tính toán [suy luận], R = 1,125 in = 28,6 mm:
- 3 m/s → ω = 105 rad/s ≈ 16,7 vòng/s. Ở 120 Hz là **50°/frame**, ở 60 Hz là 100°/frame.
- Giới hạn Nyquist là 180°/frame **chia cho bậc đối xứng k của pattern** quanh trục quay. Bi sọc lăn quanh trục vuông góc trục sọc thì dải sọc xuất hiện 2 lần mỗi vòng, k = 2, giới hạn còn 90°/frame. Measles 6 chấm có k lớn nên **còn tệ hơn**. Bi thật có số in hai mặt (k = 2), còn style hiện tại chỉ vẽ một đĩa (k = 1, tốt cho chống alias).
- Cú phá ~8 m/s (giả định, chưa có nguồn) → ~44 vòng/s → 134°/frame ở 120 Hz. Như vậy vượt ngưỡng cho sọc. ProMotion có thể tụt nhịp, và `TimelineView(.animation)` không cam kết đủ 120 Hz.

**Phóng đại hay giữ đúng tỉ lệ?** [suy luận] **Giữ đúng tỉ lệ ω/v.** Thông tin dạy học nằm ở chính quan hệ R|ω| so với |v|. Phóng đại ω sẽ làm bi đang lăn trông như có overspin, tức là xoá đúng thứ mình muốn cho người xem thấy. Chống alias bằng ba cách, theo thứ tự:
1. **Slow-mo khi phát lại**: 0,25× chia tốc độ quay mỗi frame cho 4 mà vẫn đúng vật lý. pooltool cũng có `playback_speed`. Replay hiện chạy thời gian thật (`tl.date.timeIntervalSince(replay.start)`), chỉ cần nhân hệ số.
2. **Motion blur theo góc quay mỗi frame**: shader lấy N mẫu orientation giữa q(t−Δt_frame) và q(t), rồi lấy trung bình. Khi góc/frame vượt khoảng 60–90°, pattern tự nhoè thành vệt, giống mắt thật nhìn bi chạy nhanh. Δt_frame lấy từ chênh `tl.date` giữa hai frame, không giả định 1/120.
3. Pattern bất đối xứng (k = 1): giữ một đĩa số và một chấm đánh dấu trên bi cái, không dùng 6 chấm.

## 5. Khuyến nghị: phương án (c), shader fill trong Canvas

**Chọn:** mỗi bi là `context.fill(Path(ellipseIn:), with: .shader(ballShader(q, qPrev, number, palette)))` trong Canvas hiện tại. Quaternion tích phân trong vòng vật lý (nhân trái, normalize mỗi bước) và lưu dày trong `Track`. Shader ray-cast cầu đơn vị: ánh sáng theo pháp tuyến thế giới, pattern theo toạ độ thân, có motion blur nhiều mẫu. Replay có nút 1×/0,25×. Trên iOS < 17 thì `if #available(iOS 17, *)` rơi về `TournamentBlackStyle` tĩnh như hiện giờ.

**Lý do:**
- Đây là cách duy nhất vừa giữ kiến trúc Canvas và `PoolBallStyle` (thêm một style mới), vừa xử lý per-pixel tự nhiên được sọc, mép limb, mặt sau và motion blur.
- Các phương án khác: SceneKit đã deprecated (WWDC25). `RealityView` cần iOS 18. Cả hai đều buộc dựng thêm một surface 3D phải khớp với bàn 2D. Phương án 2D thuần đầy ca biên và không có blur.
- Có tiền lệ production (Skia SphereEffect) và cùng toán với pooltool.

**Giá ước tính** [suy luận, chưa đo]:
- Code: ~1 file `.metal` 100 dòng, ~150 dòng Swift (tích phân q, mở rộng `Track`, style mới, atlas số 1–15, nút tốc độ). Khoảng 1,5–2 ngày, trong đó nửa ngày là chỉnh cho giống `TournamentBlackStyle`.
- Runtime: GPU khoảng 80k px × 8 mẫu mỗi frame, không đáng kể. CPU: dựng 10 `Shader` mỗi frame. Phải đo bằng Instruments trước khi tin.

**Chỗ vỡ:**
1. **iOS 16.4–16.x không có spin.** Hoặc chấp nhận fallback tĩnh, hoặc nâng target lên 17. Nâng target là cửa một chiều với người dùng còn ở iOS 16, nên cần số liệu tỉ lệ iOS 16 trước khi quyết.
2. **Engine hiện chưa có ω ba trục** (mục 0): `w` là 2D theo đơn vị in/s và không có ωz. Bi chỉ xoáy đứng tại chỗ hay phê được khi engine có ωz.
3. **Sai dấu trục** (Y màn hình hướng xuống) làm bi lăn ngược. Cần một test: trạng thái lăn đều phải có slip v + ω×r_c ≈ 0, và điểm trên đỉnh phải đi cùng chiều v.
4. **Chỉ một `image` mỗi Shader**, nên số phải nằm trong atlas. Glyph raster phải khớp font `.heavy` hiện tại và đủ độ phân giải ở 3x.
5. **Khựng frame đầu** khi biên dịch shader: gọi `Shader.compile(as:)` lúc mở editor.
6. **Slerp giữa mẫu thưa** cho chiều quay sai nếu góc lệch > 180°: lưu q mỗi bước sim, không lưu theo sự kiện.
7. **Canvas + shader fill + `.equatable()`**: chưa biết SwiftUI có phát sinh offscreen pass hay vẽ lại cả bàn hay không. Phải đo trên máy thật iOS 26.5 trước khi rải ra 10 bi.

**80% cố tình bỏ:** không làm vật lý ωz (thuộc engine), không làm bóng đổ theo hướng bi, không làm phản chiếu môi trường, không làm overlay mũi tên slip (đáng cân nhắc làm sau như lớp dữ liệu riêng), không đo hiệu năng thật, không kiểm nội dung kỹ thuật của Virtual Pool hay ShootersPool (không có nguồn).

## Sources:
- https://ahrs.readthedocs.io/en/latest/filters/angular.html
- https://raw.githubusercontent.com/ekiefl/pooltool/main/pooltool/ani/utils.py
- https://raw.githubusercontent.com/ekiefl/pooltool/main/pooltool/objects/ball/render.py
- https://github.com/ekiefl/pooltool
- https://pooltool.readthedocs.io/en/v0.4.2/_modules/pooltool/objects/ball/datatypes.html
- https://discourse.panda3d.org/t/solved-converting-angular-displacement-to-hpr-for-a-billiard-ball-gif-inside/26015
- https://developer.apple.com/videos/play/wwdc2025/288/
- https://dev.to/arshtechpro/wwdc-2025-scenekit-deprecation-and-realitykit-migration-a-comprehensive-guide-for-ios-developers-o26
- https://developer.apple.com/forums/thread/774697
- https://developer.apple.com/documentation/realitykit/realityview.md
- https://developer.apple.com/documentation/realitykit/arview/cameramode-swift.enum/nonar.md
- https://developer.apple.com/documentation/swiftui/shader.md
- https://developer.apple.com/documentation/swiftui/graphicscontext/shading/shader(_:bounds:).md
- https://developer.apple.com/documentation/swiftui/shader/argument.md
- https://skia.googlesource.com/skia/+/chrome/m138/modules/skottie/src/effects/SphereEffect.cpp
- https://discussions.unity.com/t/a-simple-question-about-3d-sphere-and-8-ball-pool/246453
- https://steamcommunity.com/app/336150/discussions/0/364040166686031256 (chỉ snippet, không có nội dung kỹ thuật)
- https://godotshaders.com/shader/billiard-sphere-shader-2d/ (chưa đọc được, 429)
- https://drdavepoolinfo.com/?p=2460
- https://drdavepoolinfo.com/?p=2220
- https://drdavepoolinfo.com/high-speed-video/
- https://pooltableportfolio.com/blogs/magazine/the-red-dot-cue-ball
- https://en.wikipedia.org/wiki/Wagon-wheel_effect
- https://people.csail.mit.edu/fredo/comp-photo-book/12-video-01-motion-blur-and-temporal-sampling.html
- https://forums.azbilliards.com/goto/post?id=6768766
- https://www.imore.com/apple-clears-120hz-iphone-13-pro-confusion-developers
