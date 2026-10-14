---
title: Nguồn — app drill pool, định dạng drill, văn hoá tập VN/châu Á
date: 2026-10-11
type: research-source
topic: pool drill apps and formats
mode: exhaustive
status: done
---

Ký hiệu: **[nguồn]** = đã mở trang, nội dung lấy từ trang chính thức/listing/bài viết; **[forum]** = đã mở, là ý kiến diễn đàn; **[snippet]** = chỉ thấy qua đoạn trích search, chưa mở được trang gốc; **[suy luận]** = em tự rút ra, không có nguồn trực tiếp.

## 0. Giới hạn nguồn

- Không mở được: `drdavepoolinfo.com` (đã biết bị chặn, không thử), `billiards.colostate.edu` (403; ảnh hưởng: handout progressive practice gốc, BU Exam PDF, BCA Instructor Manual, các bài Billiards Digest), `appbrain.com` (403), `azbilliards.com` bài news (403), `pooldawg.com` (403), `ciando.com` trích sách PAT (ECONNREFUSED), `lib.hpu.edu.vn` (ECONNREFUSED), `dr-dave-billiards.com/videos/vepp/` (404). `cuetable.com` trả trang rỗng. Không lách qua proxy/translate.
- Checkbilliard trên App Store US (`id819233768`) trả 404 lúc kiểm (11/10/2026) — có thể đã gỡ khỏi store US. V9 app (`id6741811112`) cũng 404.
- Google Play: WebFetch bị truncate; em dùng `curl` tải HTML trang Play công khai rồi grep rating/downloads/ngày cập nhật/review. Dải giá IAP trên trang Play lẫn với mục "similar apps" nên **không dùng giá Play**, chỉ dùng giá App Store.
- App Store hiển thị ngày cập nhật không kèm năm cho bản gần đây (vd "Jul 24", "Oct 2"); em ghi nguyên văn.
- Không tìm thấy tài liệu công khai nào cho: WPA/BEF Junior skill test, BCA/PBIA instructor playing test (chỉ có manual cũ, 403). Không tìm thấy app tên đúng "Digital Pool", "PoolPro Trainer", "Pool Practice Tracker", app training của Kamui/Predator, app drill gắn Fargo, "PoolCam".
- Mảng Việt Nam: search engine trả về gần như toàn bài SEO/luật chơi/game; **không tìm được trang text nào của HLV/CLB Việt Nam mô tả bài tập đặt bi**. Nội dung dạy bài tập ở VN gần như chắc chắn nằm trên YouTube/Facebook/TikTok — không mở được/không index được qua công cụ này [suy luận].

## 1. Bảng app

| App | Nền tảng | Số drill | Cách ghi kết quả | Giá | Rating | Khen | Chê | URL |
|---|---|---|---|---|---|---|---|---|
| **DrillRoom: AI Pool Trainer** (OrangeLoops) | iOS (iPhone/iPad) | "over 50 drills, challenges" (gói trả phí) + drill editor + chụp layout bàn thật bằng live detection; có sẵn BU Exam, Monthly Challenges | **Camera tự đếm**: iPhone/iPad trên tripod ~5 ft, AI track bi; ~7% shot bị phân loại sai (điều kiện tốt, số của dev 07/2022); có nút "RT" retag sửa tay | Free + IAP $14.99/tháng, $89.99/năm (2021 là $4.99/$39.99) | 4.6 (258) | Tự giữ điểm để tập trung đánh; AI analysis + video clip | "doesn't see balls touch other balls", tự kết thúc drill tưởng là miss; wagon wheel (carom) không bao giờ ghi nhận thành công (review 2024); "finicky" | [nguồn] https://apps.apple.com/us/app/drillroom-ai-pool-trainer/id1539827505 ; https://orangeloops.com/2022/07/drillroom-app-v1-2/ ; https://thepoolscene.com/posts/orangeloops-launches-drillroom-to-enable-ai-based-training-in-billiard |
| **Bullseye Billiards** (Razor Pool, tự nhận "BCA Seal of Approval") | iOS + Android | 400 shot: Core 200 (9 skill: Fundamentals, Follow, Stun, Draw, Sidespin, Rails, Hangers, Scratches, Advanced) + Precision 200 (17 skill: bank, combo, carom, finesse…) + Shot Builder | **User tự chấm vị trí dừng bi cái** lên diagram tương tác; điểm theo **khoảng cách tới target**; có đếm scratch. Session 10/20/30 attempt hoặc tuỳ chỉnh | Free + IAP Core $29.99, Precision $39.99, Custom $49.99, $9.99/tháng, $69.99/năm, Lifetime $199.99 | iOS 4.7 (222); Play 4.7 (~90 review, 10K+ tải, cập nhật 03/10/2026) | Hệ thống tuần tự, có session 10 shot nhanh; Coach gợi ý shot random; "practice diary + training partner + instructor" | Intro quá cơ bản; bản cũ UI/chấm điểm yếu (review 2023) | [nguồn] https://apps.apple.com/us/app/-/id1219867352 ; Play `com.razorpool.BullseyeBilliards` |
| **WPB: Pool Training & Drills** | iOS (thiết kế cho iPad) + Android | 200+ (aiming, fundamentals, CB control, position, safety) + Table Layout Creator kéo-thả | **Tự nhập điểm**, timer, custom score, graph (premium), leaderboard tuần; Player Development System (soft launch v4.3.0) có assessment + drill gợi ý tăng dần | Free 7 ngày trial; $10.99/tháng, $79.99/năm, $249.99 lifetime | iOS 4.4 (251); Play 4.6 (~368 review, 50K+, cập nhật 04/10/2026) | "one of the best drill apps"; all-in-one | Paywall ("free app" nhưng phải trả mới dùng); không mở được trên iPad; ads | [nguồn] https://apps.apple.com/us/app/id1591274006 ; Play `worldofpoolandbilliards.com.wpb_app` |
| **Cueist: Pool Training** | Android (02/2025), sau đó iOS | "1000s" drill làm tay, phần lớn 2 bi; format **Ghost 3** (race to 3 với ghost); drill position có target zone hình hộp/tròn; luật đường đi: bi cái phải tới target theo đúng thứ tự băng trong diagram | Tự báo thắng/thua từng shot [suy luận — trang không mô tả UI nhập]; ~30 phút assessment đầu; 3 rating (Cueist/Aiming/Position), drill chọn sao cho ~50% thắng ghost; spaced repetition (premium) | iOS Free + $12.99/tháng, $29.95/quý, $95.90/năm | iOS 4.7 (83); Play 4.5 (176, 10K+, cập nhật 13/08/2026) | Adaptive "exactly hard enough"; giới hạn số lần thử rồi chuyển drill, quay lại sau | "wish it would account for pocket sizes"; set-up nhiều giữa các shot; drill ban đầu dựng cho 9ft, 7ft không ổn → dev **vẽ lại vị trí cho 7ft/8ft, 1 drill thành 3 drill, rating riêng theo cỡ bàn** (31/03/2025); stats khoá tới khi xong assessment; không có multi-ball/safety (2025) | [nguồn] https://apps.apple.com/app/cueist-pool-training/id6742179203 ; https://cueist.app/ ; https://playingpool.substack.com/p/cueist-a-review ; [forum] https://forums.azbilliards.com/goto/post?id=8069613 ; https://forums.azbilliards.com/posts/8431330/ ; https://forums.azbilliards.com/goto/post?id=8131361 |
| **Pool & Billiards Self-Trainer** | Android | 30 drill, mỗi drill có setup diagram + trình tự shot + giải thích; lọc theo skill, độ khó, **"how much table you have"** | Tap made/missed hoặc nhập tổng set; hiện "target to beat" = trung bình gần đây của chính mình; ghi chú gắn vào set; **mỗi drill có mức khó thứ 2** (CB xa hơn, cắt mỏng hơn); đạt pass mark → đề nghị lên mức, hụt nhiều lần → đề nghị xuống | Free; Pro là subscription (giá không xác minh) | Play: chưa hiện rating, 1K+ tải, cập nhật 30/08/2026 | — (không trích được review) | — | [nguồn] Play `com.municornio.app.poolandbilliardsselftrainer` (https://play.google.com/store/apps/details?id=com.municornio.app.poolandbilliardsselftrainer) |
| **Pool Drill Tracker** (Nathan Szeto) | iPhone | 12 drill có sẵn (Beginner/Intermediate/Advanced) + drill tự tạo | Tap "Potted"/"Missed"; báo pass/fail (ngưỡng không ghi) | Free | Chưa đủ rating (app 2026) | — | — | [nguồn] https://apps.apple.com/us/app/id6772395519 |
| **BilliardsTracker** | iPhone + **bắt buộc Apple Watch** | Drill tự thêm | Cử chỉ trên Apple Watch | Free | 1.0 (1) ; v1.2 ngày 22/11/2023 | — | — | [nguồn] https://apps.apple.com/us/app/billiardstracker/id1580929676 |
| **BilliardManager** (apps4pool) | Android (+iOS theo review) | "Built-in drills & solo training formats" | Scoreboard trận + drill | Free + Pro, có ads | Play 4.2 (61), 1K+, cập nhật 22/09/2026 | Theo dõi tập tốt | Ads to; "match results tracker… need to be able to diagram a shot and track progress (cuts, banks, breaks, spin/speeds)" | [nguồn] Play `com.apps4pool.PoolPractice` |
| **Checkbilliard** (kế thừa PAT, Ralph Eckert) | iOS + Android (review 2015) | "hundreds of exercises"; test QUICK 20, SHORT 50, STRAIGHT 100 | Tự đếm theo hướng dẫn; kết quả test → giao drill cá nhân hoá | Free 2 tầng + ~$10/tháng | App Store US 404 lúc kiểm | Nội dung, video Eckert/Souquet | Hướng dẫn "how the score should be counted" khó hiểu; bug | [nguồn] https://www.playing-pool.com/en/?p=895 |
| **Cue Lab \| Shots & Layouts** (Bright Mediums × Thorsten Hohmann) | iOS | Diagrammer, không phải trainer | — (vẽ shot, layout, sequence; **target zone dạng bullseye pinch-to-scale**; nhiều bi cái để so phương án; note text; ký hiệu điểm chạm spin) | $4.99 | 4.6 (170); v1.3.8 "Feb 17", bản trước 07/12/2025 | — | Forum từng nói app bị gỡ — **mâu thuẫn**: listing vẫn sống, có update 12/2025 | [nguồn] https://apps.apple.com/app/id1480774300 |
| **CueTable** | Web (Shockwave, cũ) | Diagram tool chuẩn de-facto của AZB forum | — | Free | — | Layout chia sẻ bằng data string "URL-ready", nhiều page trong 1 string, post-it caption; tỷ lệ bàn 9ft + bi chuẩn | Shockwave không ổn định trên trình duyệt hiện đại (2013) | [forum] https://forums.azbilliards.com/goto/post?id=2447126 ; https://forums.azbilliards.com/goto/post?id=4224178 |
| **CueAction** (Thâm Quyến, TQ) | iPhone + phần cứng Efoseisen (Bluetooth) | Không có drill layout; train tư thế, 杆法, 分离角, 解球线路, 模拟控球 | Cảm biến phần cứng | Free (phần cứng mua riêng) | 4.2 (6) | — | Không biết dùng; mất dữ liệu sau update (cần nâng firmware) | [nguồn] https://apps.apple.com/cn/app/cueaction-%E5%8F%B0%E7%90%83%E8%AE%AD%E7%BB%83%E5%99%A8-%E6%9D%86%E6%B3%95%E6%8E%A7%E7%90%83%E5%A7%BF%E5%8A%BF%E8%82%8C%E8%82%89%E8%AE%B0%E5%BF%86%E8%AE%AD%E7%BB%83%E5%99%A8/id1530907307 |
| **出杆** (Tây An, TQ) | Apple Watch đeo tay cầm cơ | Không có drill | Đo lệch cơ, lực, tốc độ phá | $3.99/tháng, $24.99/năm, $9.99 lifetime | Chưa đủ rating | — | — | [nguồn] https://apps.apple.com/mm/app/%E5%87%BA%E6%9D%86-%E5%8F%B0%E7%90%83%E6%A1%8C%E7%90%83%E8%BF%90%E5%8A%A8%E8%BF%BD%E8%B8%AA-%E5%88%86%E6%9E%90-%E8%AE%B0%E5%BD%95/id6670414216 |
| **AimCue / 台瞄** (TQ) | iOS/iPad/Mac/Vision | Không có drill; overlay đường bi từ ảnh, hỗ trợ "TAQU", "XING" scheme | — | $4.99/tuần, $14.99/tháng, $69.99/năm | Chưa đủ rating | — | — | [nguồn] https://apps.apple.com/us/app/%E5%8F%B0%E7%9E%84-%E5%8F%B0%E7%90%83%E8%A7%92%E5%BA%A6%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7/id6759794534 |
| **Billiard School (Chinese ed.)** (VibSoft/Billiard4u) | iOS | Video 1.5h, 17 mục | — | $5.99 | Chưa đủ rating; v3.2 26/08/2024 | — | — | [nguồn] https://apps.apple.com/app/id385145352 |

Tổng: **15 app/tool đã mở listing**. Chỉ thấy qua snippet, chưa xác minh: Aim Pool (Android, game aim), Dr. Dave Billiards app (video library), Pool & Billiards Stats Log (iOS, mwm.ai), Bida Doctor (iOS, $29.99, EN/KR, có vị trí bi + video) [snippet].

Nhận xét thị trường [suy luận từ bảng trên]:
- Ba cách ghi kết quả đang tồn tại: (a) tap made/missed (đa số), (b) **chấm vị trí dừng bi cái trên diagram** (Bullseye — chấm điểm liên tục theo khoảng cách), (c) camera tự đếm (DrillRoom — chính xác ~93%, hay hỏng với carom/bi chạm bi).
- Xu hướng 2025–2026 là **adaptive**: Cueist (target ~50% thắng ghost, spaced repetition), Self-Trainer (level up/down có luật công khai), WPB (assessment → drill gợi ý), Bullseye (Coach random + tier theo loại người chơi).
- Thị trường Trung Quốc trên App Store nghiêng về **cảm biến cơ/đồng hồ** và **overlay ngắm**, không thấy app drill-layout. Không tìm thấy app drill tiếng Việt nào.

## 2. Định dạng drill trong sách/website và bảng trường dữ liệu

### 2.1 Từng hệ thống

**Billiard University (BU) Exams — Dr. Dave + Bob Jewett và cộng sự**
- Exam I (Fundamentals): aiming, stroke, stop/follow/draw, CB position; gồm progressive drills **F1–F5**, mỗi drill thang 10; bản "pro" giữ bonus → tối đa 14/drill, max 120. Điểm Exam I xếp level Exam II: 0–49 Bachelors, 50–69 Masters, 70–100 Doctorate. [nguồn] https://billiarduniversity.org/testing/exams/
- Exam II (Skills): aiming, position, rail cut, safety, kick/bank, jump/masse, break; 3 level độ khó. BU Score = I + II; dải diploma 55–84 B, 85–99 B Honors, 100–124 M, 125–139 M Honors, 140–179 D, 180–200 D Honors. Có **rectangle target template** cho vùng đích. [nguồn] cùng URL.
- Khuyến nghị bàn 9'; muốn Doctorate thì cả hai exam phải trên bàn 9' trở lên; BU cân nhắc chỉnh điểm theo độ khó thiết bị nhưng bỏ vì không thực tế — quan trọng là giữ thiết bị nhất quán giữa các lần. [forum] https://forums.azbilliards.com/goto/post?id=4183363
- Forum: wagon wheel + target drill cộng lại 40 điểm; ghost drill nên chạy ≥3 lần lấy **median** của điểm 10 rack [snippet từ thread BU trên AZB]. Một drill target-position "4 tries at each, max 20" [snippet, bài Billiards Digest, colostate 403].

**Progressive practice — Bob Jewett (Billiards Digest 12/1992; VEPP)**
- Draw drill: OB sát băng dài ngay ngoài miệng lỗ, CB ở vị trí 1 (cách góc 1 diamond); kéo về tới ít nhất vị trí 1 → thành công thì lùi CB thêm 1 diamond; trượt (shot hoặc độ kéo) thì CB tiến 1 diamond lại gần. Vị trí cuối ≈ điểm 50% thành công, là điểm số. [snippet — handout SFBA trên colostate, 403]
- Biến thể VEPP (Billiards Digest 05/2012): thành công +1 diamond; trượt lùi nửa diamond, sau đó bước nửa diamond; 10–15 shot, vị trí CB cuối là điểm. Level 4 là drill khác: CB cố định 2 diamond trên lỗ giữa, **OB** dịch ra xa mỗi lần thành công. [snippet]
- Bài test rút gọn để xếp trình độ: Level 2, diagram 2A–2D, 10 shot mỗi cái (40 shot); ứng viên phải đạt trung bình vị trí 4, không thì xuống Level 1; ~20 phút/người. [forum] https://forums.azbilliards.com/goto/post?id=5429547
- VEPP: 175+ drill & challenge, 30 category, công bố 20/11/2011. [forum] https://forums.azbilliards.com/goto/post?id=3316066

**PAT — Playing Ability Test (Ralph Eckert, WPA-recognized; kế thừa bởi Checkbilliard)**
- PAT 1 có 10 drill 1.01–1.10 (một số có phần a/b). Hầu hết **3 innings**; mỗi inning là một bộ shot (vd 1.01: 7 bi ở 7 tốc độ → 21 bi; 1.04: bộ 5 bi → 15 bi). Điểm = trung bình/inning × **factor** in trên re-test sheet = % của mục tiêu (vd 4.66 × 21.43 ≈ 100%). Max mỗi phần 150 (1.03: 120, 1.08: 200, 1.10: 160), tổng max 1530; >800 thì lên PAT 2. [forum] https://forums.azbilliards.com/goto/post?id=3923316
- Mục lục PAT 1 (dịch từ tiếng Đức): tốc độ, độ thẳng, bi góc, follow, draw, vùng position nhỏ; test trên bàn 9ft chuẩn WPA. [snippet]
- Checkbilliard: test QUICK 20 / SHORT 50 / STRAIGHT 100, test lặp lại để đo tiến bộ. [nguồn] https://www.playing-pool.com/en/?p=895

**Cuestars (snooker, John Hunter) — Practice Challenge Bronze/Silver/Gold + Line Ups**
- Mỗi routine gồm: số thứ tự, tên, **câu setup** (vị trí tương đối với spot/băng, vd "line up fifteen reds between the black and the brown spots"), diagram, **luật bi cái** ("placed for the first shot only" / "placed between the middle pockets each time" / "played from where it finishes"), mục tiêu + ràng buộc, **luật chấm điểm**, **Maximum score**. [nguồn] https://www.cuestars.co.uk/wp-content/uploads/documents/PracticeChallenge-Bronze.pdf (cập nhật 04/02/2021)
- Ví dụ chấm điểm không nhị phân: "Shot to nothing" — "Award two points when a red is potted. If the red is missed award one point provided the cue-ball comes back to rest behind the baulk line", max 20, rồi **lặp lại phía bên kia bàn**. "Cross Double Safety": chỉ tính khi toàn bộ bi cái về sau baulk line **và** bi đỏ đứng an toàn. "Smelly Shots Twenty": CB "within two balls' widths of the side cushion", rồi lặp lại với CB "tight under the cushion". [nguồn] cùng PDF
- Tier: Bronze = chưa có break 50 ở Standard Line Up, Silver = đã có 50, Gold = đã có century. [snippet từ PDF Silver/Gold]. Line Ups challenge: tổng 1000 điểm từ 7 routine, quay video để vào Hall of Fame [snippet]. Trang Line Ups: setup + diagram + luật CB + ràng buộc ("NO cannons", "without the cue-ball contacting a cushion") + video mẫu; không có kích thước bàn, vị trí mô tả tương đối với spot. [nguồn] https://www.cuestarsacademy.co.uk/?p=16044

**Ghost (9-ball) — chuẩn cộng đồng AZB**
- 2015 AZB Ghost Challenge: 9-ball, race to 7, phá rồi ball-in-hand chạy hết; thắng khi runout hoặc 9 sớm bằng combo/carom; trượt/foul là ghost thắng. **Form nộp điểm bắt buộc có: điểm you-ghost, ngày, table size và pocket size, video (tuỳ chọn).** [forum] https://forums.azbilliards.com/threads/2015-azb-ghost-challenge-official-thread.385486/
- Forum ước Fargo ~625–650 để hoà ghost 9-ball; không có quy đổi chính thức. [snippet]

**Diagram notation: CueTable / Cue Lab**
- CueTable: layout xuất thành data string "URL-ready", nhiều page trong một string, post-it caption, vẽ line bằng double-click; player dựng theo tỷ lệ bàn 9ft + bi chuẩn. Định dạng mã hoá bên trong **không được công bố**. [forum] https://forums.azbilliards.com/goto/post?id=2447126
- Cue Lab: target zone bullseye co giãn, nhiều cue ball để so phương án, note, ký hiệu spin/draw/follow trên hình bi cái, bookmark layout cho nhiều lời giải. [nguồn] https://apps.apple.com/app/id1480774300

**BCA Instructor / PBIA / WPA–BEF Junior**: không tìm thấy bộ drill test công khai. Snippet cho biết BCA Instructor Manual có drill (Appendix B straight stroke, Appendix D "Zen Draw"), PBIA không có playing test bắt buộc — đều là [snippet], manual nằm trên colostate (403). BEF chỉ thấy chạy giải Junior, không thấy skill test [snippet].

### 2.2 Bảng trường dữ liệu

Cột "App em" dựa trên schema anh mô tả trong prompt (CB + OB toạ độ 0..1, lỗ đích, vùng đích CB, điểm chạm đầu cơ, spin, speed, attempts, pass pocketed N / inZone N, rounds) — em không đọc code.

| Trường | Ai dùng | App em |
|---|---|---|
| Toạ độ CB, OB | tất cả | **Có** |
| Lỗ đích | tất cả | **Có** (cần kiểm: một lỗ chung hay mỗi OB một lỗ) |
| Thứ tự đánh nhiều bi (sequence) + lỗ theo từng bi | Cuestars ("Colours in order", clear table), PAT game situation, Cueist dự định multi-shot | **Thiếu / chưa rõ** |
| Chế độ đặt bi cái: đặt lại mỗi lần / chỉ shot đầu / đánh tiếp từ chỗ dừng | Cuestars (ghi rõ trong mọi routine), Ghost (ball-in-hand sau phá) | **Thiếu** |
| Ràng buộc đặt CB (sau baulk/head string, cách băng ≤ 2 bi, sát băng) | Cuestars | **Thiếu** |
| Vùng đích CB: hình dạng + kích thước | BU (template chữ nhật), Cueist (hộp/tròn), Cue Lab (bullseye co giãn), forum (từ hình thang to → điểm nhỏ) | **Có** (cần kiểm hỗ trợ cả tròn lẫn chữ nhật, kích thước theo level) |
| Chấm điểm liên tục theo khoảng cách CB tới đích | Bullseye | **Thiếu** (hiện chỉ inZone nhị phân) |
| Ràng buộc đường đi CB (thứ tự băng, phải chạm N băng, không chạm băng, không chạm bi khác) | Cueist (thứ tự băng), Cuestars ("NO cannons", "without contacting a cushion") | **Thiếu** |
| Ràng buộc kết quả bi mục tiêu (OB phải đứng an toàn) | Cuestars safety routines | **Thiếu** |
| Điểm chạm đầu cơ / spin | Bullseye, Cue Lab | **Có** |
| Speed | Bullseye, PAT 1.01 (7 tốc độ) | **Có** |
| Ghi chú stroke / caption text | Cue Lab, CueTable post-it, Self-Trainer (note theo set) | Chưa rõ |
| Số lần thử / innings / rounds | PAT (3 innings), Bullseye (10/20/30), BU (10 shot) | **Có** |
| Luật điểm tổng quát: điểm theo kết quả (2 cho pot, 1 cho miss an toàn), max score | Cuestars, BU, PAT | **Thiếu** (hiện chỉ đếm N) |
| Ngưỡng pass | Pool Drill Tracker, Self-Trainer | **Có** |
| Chuẩn hoá ra % (factor) | PAT | Thiếu (ưu tiên thấp) |
| **Luật progressive**: tham số biến thiên (khoảng cách CB/OB), bước khi đạt/trượt (1 hoặc ½ diamond), điểm = vị trí cuối | Jewett, VEPP, BU F1–F5 | **Thiếu** (trường lớn nhất) |
| Biến thể level (mức khó 2) + luật lên/xuống level | Self-Trainer, PAT 1/2/3, BU Bachelors/Masters/Doctorate | **Thiếu** |
| Độ khó / rating của drill | Bullseye (Easy→Extreme), Cueist (rating riêng theo cỡ bàn) | Chưa rõ |
| Tag kỹ năng/category | Bullseye (9/17 skill), WPB, Cueist (Aiming/Position) | Chưa rõ |
| Lật/đối xứng (làm lại phía bên kia), xoay 180° | Cuestars ("repeat on other side"), Bullseye (rotate 180) | **Thiếu** |
| Cỡ bàn + cỡ lỗ: biến thể drill theo cỡ bàn, và ghi vào mỗi kết quả | Cueist (1 drill → 3 drill), AZB Ghost (form bắt buộc), BU (9' cho Doctorate) | **Thiếu** |
| Luật gộp nhiều lần chạy (median N lần, trung bình/inning) | BU ghost (median), PAT (avg/inning) | **Thiếu** |
| Đếm scratch/foul | Bullseye, Ghost | **Thiếu** |
| Format race/ghost (race to N) | Cueist (Ghost 3), AZB (race to 7) | **Thiếu** |
| Đường đi vẽ trên diagram (CB path, OB path) | Bullseye, Cue Lab, CueTable | Chưa rõ |
| Video/demo | Bullseye, Checkbilliard, Cuestars | Không cần cho v1 |
| Timer | WPB | Không cần cho v1 |

## 3. Đổi cỡ bàn 7 / 8 / 9 ft

- Bàn chuẩn tỷ lệ 2:1; diamond = 1/8 chiều dài, 1/4 chiều rộng mặt chơi. Mặt chơi (nose-to-nose): 7' = 40"×80" (home 38"×76"), 8' = 44"×88" (home) hoặc 46"×92" (pro), 9' = 50"×100", 10' = 56"×112". **Bi cùng cỡ, lỗ thường to hơn tương đối** trên bàn nhỏ → scratch dễ hơn. [forum, 2007] https://forums.azbilliards.com/threads/are-7-8-or-9-feet-pool-tables-proportionate.71062
- Cùng thread: kick/diamond system "should work the same on all table sizes"; **position (shape) là thứ phải chỉnh** giữa các cỡ bàn; có người giảm lực 20–25% khi chuyển từ 9' sang bar box. [forum] cùng URL
- Thread diamond ruler: scale in ~78% để dùng cho 7' [snippet].
- Cueist (31/03/2025): drill gốc dựng cho 9ft, 7ft "do not work so well" → **vẽ lại vị trí cho 7ft và 8ft**, mỗi drill thành 3 drill, rating tính riêng theo cỡ bàn; **không công bố** là scale theo diamond hay giữ khoảng cách tuyệt đối. Review Play: muốn app tính cả **cỡ lỗ**. [forum] https://forums.azbilliards.com/posts/8431330/ ; https://forums.azbilliards.com/goto/post?id=8131361
- BU: khuyến nghị 9', bắt buộc 9'+ cho Doctorate; không chỉnh điểm theo thiết bị. AZB Ghost: bắt khai table size + pocket size khi nộp điểm. [forum] https://forums.azbilliards.com/goto/post?id=4183363 ; https://forums.azbilliards.com/threads/2015-azb-ghost-challenge-official-thread.385486/
- Cuestars mô tả vị trí tương đối (spot, băng, "two balls' widths") chứ không dùng kích thước tuyệt đối [nguồn PDF Bronze].
- Việt Nam: Sapo (23/04/2026) ghi bàn lỗ 7' / 8' / 9' = 213×107 / 244×122 / 274×137 cm (không nói là phủ bì hay lọt lòng), **9' "thường được sử dụng phổ biến trong các quán bida, các giải đấu"**, 8' cho CLB/quán nhỏ bình dân. [nguồn] https://www.sapo.vn/blog/kich-thuoc-ban-bida-tieu-chuan . Một snippet nói bàn lỗ chuẩn VN "lòng bàn 142 x 284 cm" — **không xác minh được** trên trang gốc, và lệch với 9' quốc tế (127×254 cm) → coi là sai/nhầm phủ bì [snippet + suy luận].
- **Không tìm thấy nguồn hướng dẫn chính thức nào** về quy tắc scale drill giữa các cỡ bàn.

Khuyến nghị [suy luận]: lưu toạ độ chuẩn hoá theo mặt chơi (≈ theo diamond) là đúng cho vị trí liên quan tới lỗ/băng, nhưng các đại lượng phụ thuộc vật lý bi (khoảng cách CB–OB trong drill draw/stop, khe giữa bi, vùng đích tính bằng bề rộng bi) nên lưu theo **đơn vị đường kính bi** hoặc gắn cờ `anchor: "table" | "ball"` cho từng phần tử. Kèm `tableSize` (+ `pocketSize` nếu có) vào mỗi kết quả để thống kê không trộn bàn 7' với 9' — giống Cueist và AZB Ghost.

## 4. Việt Nam / châu Á

**Việt Nam**
- Không tìm được website/trang text của HLV, CLB hay group VN mô tả bài tập đặt bi với sơ đồ + chấm điểm. Trang tag "bida lỗ" của Tuổi Trẻ toàn video giải trí (vd "Những pha sút tê cân băng đẳng cấp của Dương Quốc Hoàng", 17/05/2026; "Siêu phẩm bida lỗ 3 băng", 23/04/2026), không có bài kỹ thuật. [nguồn] https://tuoitre.vn/bida-lo.html
- Thuật ngữ: không tìm được bảng thuật ngữ VN có nguồn. Các từ anh nêu ("kéo bi", "chặn bi", "đi bi") và từ dân gian thấy trong tiêu đề ("sút tê cân băng") chưa có trang định nghĩa mở được. Search trả về giải thích "phê" ~ xoáy/effet trong bida carom và "đẩy cơ" là lỗi luật (push) — [snippet], độ tin cậy thấp. Cần hỏi trực tiếp người chơi VN hoặc xem video để chốt nhãn tiếng Việt [suy luận].
- Sách: thư viện ĐH Hải Phòng có "Học Chơi Bi-A Lỗ" (2007, có phần phương pháp tập luyện, luật 8/9 bi) và "Kỹ Thuật Chơi Billiards" (Trần Đình Hòa) — [snippet], trang ECONNREFUSED.
- Bối cảnh: Dương Quốc Hoàng vô địch Premier League Pool 02/2026 (Matchroom major đầu tiên của người VN/châu Á), trước đó Scottish Open 2024. Bài báo không nói gì về cách tập. [nguồn] https://vietnamnews.vn/sports/1766219/pool-star-hoang-puts-his-way-into-the-history-books.html
- CLB: Sapo (26/08/2026) liệt kê quán Hà Nội, có nhắc "bàn bida lỗ Mit", giải giao lưu; không có lớp dạy/giáo án. Sforum (13/08/2024) danh sách quán bida lỗ TP.HCM, không có lớp. [nguồn] https://www.sapo.vn/blog/quan-bida ; https://cellphones.com.vn/sforum/quan-bida-gan-day

**Trung Quốc**
- Bài Toutiao (23/03/2025, ghi rõ là nội dung AI sinh): 直线球 (bi thẳng từ spot), 练习准度和稳定性 (定杆/低杆/高杆 nhiều lực), 练习走位, 多球练习, 角度球; không có chấm điểm, chỉ ghi tỷ lệ thành công; mô tả theo bàn snooker. [nguồn] https://www.toutiao.com/zixun/7535281524150077478 — chất lượng thấp.
- Snippet: một video course TQ có mục 停止球, 直线滚动, "领口" 练习, "方格" 走位练习 [snippet]. Tên "米字练习", "一条龙", "九宫格走位" **không tìm được nguồn**.
- App TQ trên App Store: thiên về phần cứng/cảm biến (CueAction, 出杆) và overlay ngắm (台瞄/AimCue), không có thư viện drill layout (xem bảng mục 1).

**Đài Loan**: chỉ thấy snippet về luận văn NYCU "以視覺為基礎之撞球自我訓練系統" (hệ thống tự tập dựa trên thị giác) — trang repository mở ra rỗng — và nền tảng Pro360 liệt kê HLV [snippet].

**Philippines**: Liên đoàn mới NLBSPh (thay BSCP bị ACBS đình chỉ), Efren Reyes, Francisco Bustamante, Francisco de la Cruz dẫn dắt ban huấn luyện (10/06/2026); bài không nêu chương trình/phương pháp tập. [nguồn] https://www.philstar.com/business/2026/06/10/2534237/bata-django-de-la-cruz-lead-coaching-staff-new-billiards-nsa . Lời khuyên "tập 30 phút mỗi khối" gán cho Reyes chỉ là forum gián tiếp [snippet].

**Snooker châu Âu (đối chiếu)**: Cuestars là mẫu định dạng drill rõ ràng nhất tìm được (mục 2.1).

## 5. Gap — app em thiếu gì (theo Pareto)

20% đáng làm trước [suy luận từ mục 2–3]:
1. **`cueBallPlacement`**: `eachAttempt | firstShotOnly | playFromRest`, kèm ràng buộc vùng đặt (head string, cách băng N bi). Thiếu cái này thì không biểu diễn được drill chạy nhiều bi kiểu Cuestars/ghost.
2. **`sequence`**: thứ tự bi + lỗ cho từng bi. Đi cùng mục 1.
3. **`progression`**: tham số biến thiên (vd `cueBall.distance`), bước khi đạt/trượt, `score = finalPosition`. Đây là lõi của Jewett/VEPP/BU F1–F5, và cũng là cách rẻ nhất để có adaptive giống Cueist/Self-Trainer mà không cần server.
4. **`scoring` tổng quát**: danh sách outcome → điểm (pot, inZone, safeMiss, scratch), `maxScore`, aggregator (sum/avg/median); vẫn giữ `pocketed N / inZone N` như trường hợp đặc biệt.
5. **`tableSize` / `pocketSize`** ở cấp drill-variant và cấp kết quả; `anchor` cho phần tử theo bàn hay theo bi (mục 3).
6. **`constraints`**: rail order / số băng / cấm chạm băng / cấm chạm bi khác / OB phải an toàn.
7. **`mirror`**: làm lại đối xứng bên kia bàn.

80% cố tình bỏ ở vòng này: factor chuẩn hoá % kiểu PAT, leaderboard, video demo, timer, rating drill kiểu Elo (cần dữ liệu nhiều người như Cueist), camera tracking (DrillRoom cho thấy sai ~7% và hỏng ở carom — đắt và vẫn cần retag tay). Chấm điểm theo khoảng cách (Bullseye) đáng cân nhắc sau, vì cần UI chạm vị trí dừng bi.

Chưa xác minh được, cần làm nếu muốn chắc: nội dung PDF BU Exam I/II và handout progressive practice gốc (colostate 403), sheet PAT chính thức, bảng thuật ngữ bida lỗ tiếng Việt (cần nguồn video/người chơi).

## Sources

Đã mở (WebFetch hoặc curl HTML công khai):
1. https://apps.apple.com/us/app/drillroom-ai-pool-trainer/id1539827505
2. https://orangeloops.com/2022/07/drillroom-app-v1-2/
3. https://thepoolscene.com/posts/orangeloops-launches-drillroom-to-enable-ai-based-training-in-billiard
4. https://apps.apple.com/us/app/-/id1219867352
5. https://play.google.com/store/apps/details?id=com.razorpool.BullseyeBilliards
6. https://apps.apple.com/us/app/id1591274006
7. https://play.google.com/store/apps/details?id=worldofpoolandbilliards.com.wpb_app
8. https://apps.apple.com/app/cueist-pool-training/id6742179203
9. https://play.google.com/store/apps/details?id=com.cueist
10. https://cueist.app/
11. https://playingpool.substack.com/p/cueist-a-review
12. https://forums.azbilliards.com/goto/post?id=8069613
13. https://forums.azbilliards.com/posts/8431330/
14. https://forums.azbilliards.com/goto/post?id=8131361
15. https://play.google.com/store/apps/details?id=com.municornio.app.poolandbilliardsselftrainer
16. https://apps.apple.com/us/app/id6772395519
17. https://apps.apple.com/us/app/billiardstracker/id1580929676
18. https://play.google.com/store/apps/details?id=com.apps4pool.PoolPractice
19. https://www.playing-pool.com/en/?p=895
20. https://apps.apple.com/app/id1480774300
21. https://forums.azbilliards.com/goto/post?id=2447126
22. https://forums.azbilliards.com/goto/post?id=4224178
23. https://apps.apple.com/cn/app/cueaction-%E5%8F%B0%E7%90%83%E8%AE%AD%E7%BB%83%E5%99%A8-%E6%9D%86%E6%B3%95%E6%8E%A7%E7%90%83%E5%A7%BF%E5%8A%BF%E8%82%8C%E8%82%89%E8%AE%B0%E5%BF%86%E8%AE%AD%E7%BB%83%E5%99%A8/id1530907307
24. https://apps.apple.com/mm/app/%E5%87%BA%E6%9D%86-%E5%8F%B0%E7%90%83%E6%A1%8C%E7%90%83%E8%BF%90%E5%8A%A8%E8%BF%BD%E8%B8%AA-%E5%88%86%E6%9E%90-%E8%AE%B0%E5%BD%95/id6670414216
25. https://apps.apple.com/us/app/%E5%8F%B0%E7%9E%84-%E5%8F%B0%E7%90%83%E8%A7%92%E5%BA%A6%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7/id6759794534
26. https://apps.apple.com/app/id385145352
27. https://billiarduniversity.org/
28. https://billiarduniversity.org/testing/exams/
29. https://forums.azbilliards.com/goto/post?id=4183363
30. https://forums.azbilliards.com/goto/post?id=5429547
31. https://forums.azbilliards.com/goto/post?id=3316066
32. https://forums.azbilliards.com/goto/post?id=3923316
33. https://www.cuestars.co.uk/wp-content/uploads/documents/PracticeChallenge-Bronze.pdf
34. https://www.cuestarsacademy.co.uk/?p=16044
35. https://forums.azbilliards.com/threads/2015-azb-ghost-challenge-official-thread.385486/
36. https://forums.azbilliards.com/threads/are-7-8-or-9-feet-pool-tables-proportionate.71062
37. https://www.sapo.vn/blog/kich-thuoc-ban-bida-tieu-chuan
38. https://www.sapo.vn/blog/quan-bida
39. https://cellphones.com.vn/sforum/quan-bida-gan-day
40. https://tuoitre.vn/bida-lo.html
41. https://vietnamnews.vn/sports/1766219/pool-star-hoang-puts-his-way-into-the-history-books.html
42. https://www.toutiao.com/zixun/7535281524150077478
43. https://www.philstar.com/business/2026/06/10/2534237/bata-django-de-la-cruz-lead-coaching-staff-new-billiards-nsa
44. https://www.scribd.com/document/469296442/progpract-pdf (chỉ có tóm tắt, không có nội dung PDF)

Chỉ thấy qua snippet / không mở được (không dùng làm nguồn chính):
- https://billiards.colostate.edu/resource_files/progpract.pdf (403)
- https://billiards.colostate.edu/bd_articles/2012/may12.pdf (403)
- https://billiards.colostate.edu/resource_files/BCA_Instructor_Manual_hi-res.pdf (403)
- https://www.cuestars.co.uk/wp-content/uploads/documents/PracticeChallenge-Silver.pdf ; https://www.cuestars.co.uk/wp-content/uploads/documents/PracticeChallenge-Gold.pdf (snippet tier)
- https://ebooks-fachzeitungen-de.ciando.com/img/books/extract/3941484281_lp.pdf (ECONNREFUSED)
- https://lib.hpu.edu.vn/handle/123456789/7284?show=full (ECONNREFUSED)
- https://ir.lib.nycu.edu.tw/handle/11536/139344 (trang rỗng)
- https://dr-dave-billiards.com/videos/vepp/ (404)
- https://www.appbrain.com/app/bullseye-billiards/com.razorpool.BullseyeBilliards (403)
- https://www.pooldawg.com/article/playing-the-ghost/ (403)
- https://www.cuetable.com/ (trang rỗng)
