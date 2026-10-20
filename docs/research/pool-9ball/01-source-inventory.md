---
title: Pool 9 bi — inventory nguồn
date: 2026-10-19
type: research-source-inventory
status: xong (batch 1)
---

# Inventory nguồn

Lấy ngày 2026-10-18 và 2026-10-19 từ trình duyệt trong app, không đăng nhập.

Ký hiệu truy cập: **V** đã xem video, **T** đã đọc transcript, **M** chỉ metadata hoặc caption, **X** không truy cập được.

**Không clip nào có trạng thái V.** Transcript TikTok là bản ASR tự sinh, tiếng Việt, có lỗi nhận dạng rõ ràng. Ví dụ "Stanford" là "stun", "cu Lê" là "follow", "HP" là "áp phê", "red bi" là "rack bi". Mọi chỗ trích ý trong bộ này đều đã sửa các lỗi đó theo ngữ cảnh. Chỗ nào ngữ cảnh không đủ để sửa thì ghi là chưa rõ.

## 15 clip mục tiêu (nhóm A)

TikTok: `https://www.tiktok.com/@tuanpham97billiard/video/<id>`. Facebook: `https://web.facebook.com/TuanMonkeyBilliard/videos/<id>/`.

| # | Nhóm | Clip | Nền tảng | ID | Ngày đăng | Dài | Truy cập |
|---|---|---|---|---|---|---|---|
| 1 | G1 Break | Phá 9 bi xếp cao, break box | TikTok | 7508379566549880072 | 2025-05-25 | 163s | T |
| 2 | G1 Break | Phá 9 bi xếp thấp | TikTok | 7507230509085347090 | 2025-05-22 | 157s | T |
| 3 | G2 Điều bi | Điều bi P2: góc ra tự nhiên của bi cái | TikTok | 7401080536745135376 | 2024-08-09 | 105s | T |
| 4 | G2 Điều bi | Điều bi P3: góc ra khi trô | TikTok | 7404133436690058513 | 2024-08-17 | 65s | T |
| 5 | G2 Điều bi | Góc ra bi cái khi chặt bi gần băng | TikTok | 7478544172799069458 | 2025-03-06 | 71s | T |
| 6 | G2 Điều bi | Điều bi 2 băng qua giữa bàn, quy tắc 45° | TikTok | 7513106269247474951 | 2025-06-07 | 75s | T |
| 7 | G2 Điều bi | Hệ thống điều bi đẩy 2 băng dài | TikTok | 7510163993680547080 | 2025-05-30 | 95s | T |
| 8 | G3 Spin/ngắm | Natural pivot length | TikTok | 7408197808437595393 | 2024-08-28 | 149s | T |
| 9 | G3 Spin/ngắm | Ngắm khi dùng áp phê (BHE/FHE) | TikTok | 7391144730437897473 | 2024-07-13 | 203s | T |
| 10 | G4 Băng | Cân 1 băng, xoay gậy 4/5 | TikTok | 7519915607647718663 | 2025-06-25 | 105s | T |
| 11 | G5 Ngắm | Ghost Ball P1 | Facebook | 2825254681201198 | 2026-10-02 | 4:06 | M |
| 12 | G5 Ngắm | Ghost Ball P2 (ưu nhược điểm, cú rất mỏng) | Facebook | 1120706393793750 | chưa lấy | 2:35 | M |
| 13 | G5 Ngắm | Ngắm qua điểm chạm (hai phương pháp) | Facebook | 2152926196009256 | chưa lấy | 2:46 | M |
| 14 | G6 Tập luyện | Bài tập thay trò Ghost | Facebook | 1541591511070624 | chưa lấy | 2:55 | M |
| 15 | G6 Chiến thuật | Có nên miễn bi dễ | Facebook | 1795631865088589 | chưa lấy | 2:46 | M |

Ghi chú truy cập:
- **TikTok:** lưới video trên trang hồ sơ không render. Danh sách lấy qua trang playlist "Điều Bi" (7 post) và trang từng video. Endpoint `api/post/item_list` cần chữ ký nên trả lỗi, em đã bỏ cách này.
- **Facebook:** sau khoảng 8 video thì trang bắt đăng nhập. URL lấy từ trang `/videos`. Cả 5 clip đều có `captions_url: null`, nên không có transcript. Ngày đăng của #12–#15 chưa lấy được.
- **Batch 2 (2026-10-19):** thử mở lại Facebook từ trình duyệt của app, bị từ chối. #11–#15 giữ mức M.
- **Lượt xem** có ghi trong ghi chép thô nhưng **không dùng làm bằng chứng** ở bất kỳ đâu trong bộ.

## Clip phụ, ngoài danh sách 15

| Clip | ID | Ngày | Dùng vào đâu |
|---|---|---|---|
| Tất cả mọi thứ bạn cần biết về điều bi, P1 (stun, 90°) | 7400427270361419026 | 2024-08-07 | #3 tham chiếu clip này là "phần trước". Chưa đọc transcript. |
| Càng mỏng càng phê | 7523126549399342344 | chưa lấy | Liên quan throw và spin, để dành cho batch 2. Chưa đọc. |

## Nguồn quốc tế dùng ở batch 1

Toàn bộ là nguồn đã được mở và ghi lại trong `docs/research/nguon/2026-10-08-nguon-nguyen-ly-dieu-bi.md`. Batch này không mở lại, chỉ tham chiếu.

| Nguồn | URL | Dùng cho |
|---|---|---|
| Ron Shepard, *Amateur Physics for the Amateur Pool Player* | http://www.sfbilliards.com/Misc/Shepard_apapp.pdf | Công thức góc lệch bi cái lăn tự nhiên |
| Bob Jewett, "Pythagoras & Pool Perpendiculars", BD 02/1995 | http://www.sfbilliards.com/articles/1995.pdf | Quy tắc 90° (stun) |
| Bob Jewett, các bài BD 1999, 2000 | http://www.sfbilliards.com/articles/1999.pdf, http://www.sfbilliards.com/articles/2000.pdf | Follow, triple-angle |
| SFBA Progressive Practice Drills | http://www.sfbilliards.com/Misc/progpract.pdf | Drill stun, follow |
| Post của Dr. Dave trên AzBilliards | https://forums.azbilliards.com/threads/how-do-you-know-where-the-cueball-is-going.217973/post-2831125 | 90°, 30°, trisect (bản gốc trên colostate.edu bị 403) |
| Post của Mike Eckert trên AzBilliards | https://forums.azbilliards.com/goto/post?id=3803615 | Quy tắc 45° vào băng ngắn (ý kiến diễn đàn) |

Giới hạn: billiards.colostate.edu trả 403 từ máy này. Các trang tóm tắt của Dr. Dave lấy qua mirror drdavepoolinfo.com (chạy được từ phiên 2026-10-11) hoặc qua post của chính ông trên diễn đàn.

## Nguồn trong repo

Xem mục "Nguồn có sẵn trong repo" ở [00-research-index](00-research-index.md).
