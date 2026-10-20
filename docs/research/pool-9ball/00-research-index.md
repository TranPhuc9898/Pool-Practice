---
title: Pool 9 bi — mục lục research và trạng thái batch
date: 2026-10-19
type: research-index
status: batch 1–3 xong, batch 4–6 chưa chạy
---

# Pool 9 bi — mục lục research

Bộ tài liệu này dựng nền kiến thức và bài tập cho Shot Academy. Nguồn gốc là 15 clip nhóm A của Tuấn Monkey Billiard, đối chiếu với nguồn quốc tế (Dr. Dave, Bob Jewett, Ron Shepard, WPA, Billiard University) và với code engine hiện có trong repo.

**Chưa implement gì.** Mọi đề xuất kỹ thuật trong bộ này chỉ là đề xuất. Không sửa code, không cài package cho tới khi anh review và duyệt.

## Kết luận batch 1, đọc trước

1. **Chưa xem video nào.** 10 clip TikTok đã đọc transcript ASR tiếng Việt (tự sinh, có lỗi nhận dạng). 5 clip Facebook chỉ có tiêu đề và caption vì `captions_url` trả `null`. Mọi claim ở đây là claim **lời nói** của Tuấn. Phần hình (vị trí bi, điểm đặt cơ) chưa kiểm.
2. **Nhóm điều bi (#3–#7) phần lớn đứng vững.** Các quy tắc 30°, 2×, 2/3, trisect và "quy luật 60°" khớp công thức Shepard trong dải góc Tuấn nêu. Quy luật 60° rút ra được từ quy tắc 30° cộng hình học (em đã tính). Hai hệ thống 45° và "đẩy 2 băng dài" là thực nghiệm, phải đo trên bàn.
3. **Lệch so với đề bài: app không dùng SpriteKit.** Render là SwiftUI `Canvas` + `Path` trong Expo native module `modules/pool-table/ios/`. Engine vật lý tự viết (`Editor/ShotPhysics.swift`, `RackSim.swift`). File 13 sẽ đánh giá khả thi trên nền này, không giả định SpriteKit.
4. **Sửa sai từ lần review trước:** clip #10 "Cân 1 băng, xoay gậy 4/5" là hệ ngắm **bank bi mục tiêu một băng vào lỗ**, không phải kick bi cái.

## Kết luận batch 2

1. **#8 và #9 đứng vững.** #8 là bản tiếng Việt khá sát quy trình NPL của Dr. Dave, công thức asin đúng hình học. #9 trùng phương pháp SAWS của Dr. Dave (3 khoảng cách × 3 tốc độ, trộn BHE/FHE, cầu tay cố định), Tuấn không nhắc tên. Mọi con số (NPL, tỉ lệ trộn) là của cơ và bàn của Tuấn, phải tự đo.
2. **#11–#13 vẫn ở mức M.** Facebook bị từ chối khi thử lại. File 05 chỉ dựng nền lý thuyết ghost ball và điểm chạm, không có claim nào của Tuấn.
3. **Mức bằng chứng thấp hơn batch 1.** Máy không fetch được trang nào (B9 ở file 16). Mọi nguồn ngoài của batch 2 là snippet tìm kiếm.
4. **Phát hiện ở engine (đọc code, chưa chạy):** hai mô hình squirt lệch nhau 0.17° ở 0.5R; số 1.2° cho cơ LD trong tài liệu có vẻ thấp. Cả hai engine đều có ma sát bi-bi.
5. **Sửa sai batch 1:** file 06 từng ghi engine không có ma sát tiếp tuyến bi-bi. Sai, đã sửa. Lý do "đánh nhẹ thì góc rộng ra" (#3) giờ có cơ chế ứng viên kèm số, vẫn UNVERIFIED.

## Kết luận batch 3

1. **#10 là hệ "tỉ lệ hằng" hợp lệ.** Nhắm một lỗ ảo cố định tương đương giả định tan(góc ra)/tan(góc vào) không đổi. Jewett đo được đúng dạng hệ này (0.71, bank cross-side, OB trượt). Số 4/5 của Tuấn nằm trong dải 0.60–0.90 suy từ hệ fast bank Dr. Dave, nhưng hệ số thật đổi theo góc. Công thức "1.5 chấm + chuôi cơ" chỉ ra 4/5 trên bàn 9 ft với cơ 57–59 in.
2. **#1 khớp mạnh BD 1/2021.** Bi 9 trên spot cộng break box thì mục tiêu bi 1 vào lỗ giữa là đúng hướng. Điểm ngắm, vị trí trong box, xu hướng từng bi là số của bàn Tuấn.
3. **#2 đúng cơ chế, sai độ lớn.** Bi cái stun bật lại vì rack hiệu dụng nặng hơn bi cái là có căn cứ. "Lớn hơn rất nhiều" là DISPUTED: TP B.20 cho ⅔ m, diễn đàn đo khoảng 2 m.
4. **"Xếp cao" và "xếp thấp" chưa có định nghĩa.** Em suy ra xếp cao là bi 9 trên spot, xếp thấp là bi 1 trên spot. Cần anh xác nhận (B15 ở file 16).
5. **Mạng vẫn hỏng như batch 2.** Mọi nguồn ngoài là snippet. Luật break box khác nhau theo giải, không có chuẩn WPA duy nhất để làm mặc định.
6. **Engine (chép công thức sang Python, chưa chạy app):** `ShotPhysics.cushion()` cho tỉ lệ tan ngay sau băng khoảng 0.87 với bi trượt không spin. Chưa biết tỉ lệ ở trường xa. Nếu vẫn gần 0.87 thì bank trong app dài hơn bàn thật.

## Nhãn dùng trong bộ

| Nhãn | Nghĩa |
|---|---|
| VERIFIED | Khớp lý thuyết vật lý hoặc nguồn chính thống độc lập, có công thức hoặc số đo. |
| CONDITIONAL | Đúng, nhưng chỉ trong điều kiện ghi rõ (dải góc, tốc độ, loại spin). |
| APPROXIMATION | Quy tắc tay, dùng được, sai số đã biết và đã ghi. |
| DISPUTED | Các nguồn nói ngược nhau. |
| UNVERIFIED | Chưa có nguồn độc lập. Không được đưa thành luật trong app. |
| NEEDS CALIBRATION | Thông số phụ thuộc bàn, nỉ, băng hoặc cơ. Phải đo trước khi dùng làm đích chấm điểm. |

Trạng thái truy cập nguồn: **V** đã xem video, **T** đã đọc transcript, **M** chỉ metadata hoặc caption, **X** không truy cập được.

## Trạng thái 17 file

| File | Nội dung | Batch | Trạng thái |
|---|---|---|---|
| [01-source-inventory](01-source-inventory.md) | 15 clip, URL, ngày, trạng thái truy cập; nguồn có sẵn trong repo | 1 | Xong |
| [02-video-analysis](02-video-analysis.md) | Claim từng clip, nhãn sơ bộ | 1, 2, 3 | Nhãn chốt cho #1–#10. #11–#15 chỉ M |
| 03-external-evidence | Ma trận claim × nguồn ngoài | xuyên suốt | Chưa. Batch 1 ghi bằng chứng ngay trong file 06 |
| 04-physics-principles | KB vật lý dùng chung | xuyên suốt | Chưa |
| [05-aiming-systems](05-aiming-systems.md) | Ghost ball, contact point, #11–#13 | 2 | Nền lý thuyết xong. #11–#13 chỉ M |
| [06-cue-ball-control](06-cue-ball-control.md) | Nhóm 2 (#3–#7) kiểm chứng | 1 | Xong, sửa ở batch 2 |
| [07-spin-and-deflection](07-spin-and-deflection.md) | Squirt, NPL, BHE/FHE, #8–#9 | 2 | Xong |
| [08-rail-and-kick-systems](08-rail-and-kick-systems.md) | Bank 4/5 #10, hệ băng | 3 | Xong |
| [09-break-techniques](09-break-techniques.md) | Break 9 bi #1–#2, luật WPA | 3 | Xong |
| 10-position-and-pattern-play | Pattern, #14, #15 | 4 | Chưa |
| 11-shot-academy-curriculum | Lộ trình học | 5 | Chưa |
| 12-drill-catalog | Drill spec đủ trường | 5 | Chưa |
| 13-spritekit-feasibility | Khả thi trên SwiftUI Canvas + engine hiện có | 6 | Chưa |
| 14-validation-and-test-cases | Test case vật lý, harness | 6 | Chưa |
| 15-mvp-recommendations | MVP, thứ tự làm | 6 | Chưa |
| [16-open-questions](16-open-questions.md) | Gaps và câu hỏi mở | 1, cập nhật mỗi batch | Cập nhật batch 3 |

## Kế hoạch batch

| Batch | Phạm vi | Clip | File |
|---|---|---|---|
| 1 | Inventory + điều bi | #3–#7 | 00, 01, 02, 06, 16 |
| 2 | Ngắm và spin | #8, #9, #11–#13 | 05, 07 |
| 3 | Băng và break | #10, #1, #2 | 08, 09 |
| 4 | Position, cách tập, chiến thuật | #14, #15 | 10 |
| 5 | Curriculum và drill catalog | tổng hợp | 11, 12 |
| 6 | Khả thi, kiểm thử, MVP | tổng hợp + code | 13, 14, 15 |

File 03 và 04 viết dần qua các batch, chốt ở batch 5.

## Nguồn có sẵn trong repo, không làm lại

- `docs/aiming-physics.md`: ngắm, throw, squirt, hằng số engine, 20 drill Aim Lab.
- `docs/research/2026-10-08-vat-ly-bi.md`: mô hình vật lý, băng, lỗ.
- `docs/research/2026-10-08-drill-dieu-bi-tong-hop.md` và `2026-10-11-drill-dat-bi-tong-hop.md`: drill điều bi, tầng A–D.
- `docs/research/nguon/2026-10-08-nguon-nguyen-ly-dieu-bi.md`: 90°, 30°, triple-angle, trisect, spin/speed. Đây là nguồn đối chiếu chính của batch 1.
- `docs/research/nguon/2026-10-11-nguon-bank-kick-safety-break.md`: bank, kick, safety, break, break box.
- `docs/research/nguon/2026-10-08-nguon-dr-dave-jewett-skill-tests.md`: BU Exam, Jewett progressive.
- `docs/quyet-dinh/`: các quyết định sản phẩm đã chốt (stop shot gold standard, position 3 bi, thang góc cắt, hướng sản phẩm).

## Batch kế

```
/ak:research Batch 4 pool-9ball: position, cách tập, chiến thuật. Clip #14, #15 (chỉ có metadata, xem 02-video-analysis G6). Thử lấy nội dung clip trước (A3 ở file 16); không có thì chỉ dựng nền lý thuyết, không suy nội dung từ tiêu đề. Đối chiếu docs/research/2026-10-11-drill-dat-bi-tong-hop.md và docs/quyet-dinh/. Ghi 10-position-and-pattern-play.md, cập nhật 02 và 16. Kiểm mạng trước (B9, B13 ở file 16). Không sửa code.
```
