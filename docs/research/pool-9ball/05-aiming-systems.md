---
title: Pool 9 bi — hệ ngắm ghost ball và điểm chạm (clip #11, #12, #13)
date: 2026-10-19
type: research-topic
status: nền lý thuyết xong (batch 2); claim của clip chưa có vì cả ba clip chỉ ở mức M
sources: caption clip #11–#13; docs/aiming-physics.md; snippet tìm kiếm của trang Dr. Dave và AzBilliards
---

# Hệ ngắm — ghost ball và điểm chạm

## Kết luận

Ba clip nhóm này đều trên Facebook, không có transcript, và batch 2 không mở được Facebook (xem mục 1). **Em không có claim nào của Tuấn để kiểm.** File này chỉ dựng nền lý thuyết đã kiểm, để khi có video thì đối chiếu nhanh.

| Clip | Thứ biết được | Nhãn | Căn cứ |
|---|---|---|---|
| #11 | Chỉ có tiêu đề "Ghost Ball P1" | — | Không có nội dung |
| #12 | Caption: ưu nhược điểm ghost ball, cách khắc phục ở cú rất mỏng | — | Chưa biết cách khắc phục là gì |
| #13 | Caption: hai phương pháp ngắm dùng điểm chạm | — | Chưa biết hai phương pháp nào. Hai cách Dr. Dave mô tả ở mục 2.3 là ứng viên, **chưa xác nhận** |

Nền lý thuyết:

| Mệnh đề | Nhãn | Căn cứ |
|---|---|---|
| Ghost ball nằm cách tâm bi mục tiêu 2R, ngược hướng lỗ; ngắm tâm bi cái vào tâm ghost ball | VERIFIED | Hình học; đã có công thức và bảng trong `docs/aiming-physics.md` |
| Vị trí ghost ball chỉ bị throw dịch đi. Squirt và swerve chỉ làm đổi đường bi cái đi tới ghost ball | VERIFIED | Dr. Dave FAQ về ghost ball (snippet) |
| Ngắm ghost ball theo tâm lỗ mà không bù throw thì cú cắt sẽ dày | VERIFIED | Dr. Dave; bảng throw TP A.14 trong `docs/aiming-physics.md` |
| Cú càng mỏng thì sai số chấp nhận được tính bằng milimét ở điểm ngắm | VERIFIED (hình học) | Độ nhạy góc cắt theo độ lệch điểm ngắm tăng theo 1/cosφ, đã có bảng trong `docs/aiming-physics.md` |
| Ngắm mép bi cái vào điểm chạm khác ngắm điểm chạm–điểm chạm không nhiều | APPROXIMATION | Ý kiến diễn đàn, chưa có nguồn chính |
| Ghost ball có nhược điểm riêng ở cú mỏng | UNVERIFIED | Không tìm được bài Dr. Dave nói riêng về điều này. Đây đúng là chủ đề #12 |

---

## 1. Nguồn và mức truy cập

- **Clip #11–#13: M.** Batch 1 lấy được tiêu đề và caption từ trang `/videos` khi chưa đăng nhập. Batch 2 thử mở lại ngày 2026-10-19: lệnh `navigate` tới web.facebook.com bị từ chối hoặc lỗi. Không có transcript (`captions_url: null` từ batch 1). Em **không xem video nào** và không suy nội dung từ tiêu đề.
- **Nguồn ngoài:** như file 07, máy không fetch được trang nào, chỉ có snippet tìm kiếm.

| Nguồn | URL | Lấy được gì |
|---|---|---|
| Dr. Dave FAQ, ghost ball | https://drdavepoolinfo.com/faq/aiming/ghost-ball/ | Throw dịch ghost ball; squirt và swerve đổi đường tới nó |
| Dr. Dave FAQ, contact point | https://drdavepoolinfo.com/faq/aiming/contact-point/ | Hai cách ngắm dùng điểm chạm |
| AzBilliards, contact point vs ghost ball | Snippet thread diễn đàn | Cú mỏng: chênh lệch giữa các cách cỡ milimét. **Ý kiến diễn đàn** |
| `docs/aiming-physics.md` | Trong repo | Công thức ghost ball, bảng độ dày theo góc cắt, bảng độ nhạy, bảng throw TP A.14 |

## 2. Nền lý thuyết

### 2.1 Ghost ball

Gọi O là tâm bi mục tiêu, û là vector đơn vị từ O hướng về lỗ. Ghost ball G = O − 2R·û. Bi cái đi thẳng tới G thì tại lúc chạm, đường nối hai tâm trùng hướng û, bi mục tiêu đi theo û (bỏ qua throw). Điểm chạm trên bi mục tiêu là O − R·û, nằm giữa đường nối G và O.

Lỗi người mới hay mắc: ngắm tâm bi cái vào điểm chạm thay vì vào ghost ball. Như vậy là ngắm sai nửa đường kính, cú sẽ dày.

`docs/aiming-physics.md` đã có bảng góc cắt, độ dày và độ nhạy. Không chép lại ở đây.

### 2.2 Throw, squirt, swerve tác động vào đâu

Dr. Dave tách rõ hai việc:

- **Throw** làm bi mục tiêu đi lệch khỏi đường nối tâm lúc chạm. Muốn bi vào lỗ thì phải dời ghost ball đi, tức là nhắm "lỗ ảo" lệch khỏi tâm lỗ. Lệch bao nhiêu thì xem bảng TP A.14.
- **Squirt và swerve** không đổi vị trí ghost ball. Chúng làm bi cái không đi tới đúng chỗ người chơi đã nhắm. Bù bằng BHE, FHE hoặc SAWS, xem file 07.

Tách hai chuyện này ra giúp drill chấm điểm rõ hơn: lỗi throw là lỗi chọn điểm ngắm, lỗi squirt là lỗi đường cơ.

### 2.3 Hai cách ngắm theo điểm chạm (Dr. Dave)

1. **Đặt đầu cơ làm mốc:** đặt đầu cơ lên đường từ lỗ qua bi mục tiêu, lùi ra sau điểm chạm nửa đường kính bi. Chỗ đó chính là tâm ghost ball. Sau đó đưa cơ thẳng hàng qua tâm bi cái tới mốc.
2. **Điểm chạm tới điểm chạm:** điểm chạm trên bi cái là điểm sẽ chạm bi mục tiêu. Kẻ đường nối điểm chạm trên bi cái với điểm chạm trên bi mục tiêu, rồi tịnh tiến đường đó sang tâm bi cái để lấy hướng đánh. Về hình học thì đường này song song với đường từ tâm bi cái tới ghost ball, nên hai cách ra cùng một hướng.

Cả hai cách cho ra cùng đường ngắm với ghost ball. Khác ở chỗ mắt nhìn vào đâu. Đây là ứng viên cho "hai phương pháp" của #13, nhưng **chưa xác nhận** Tuấn nói về hai cách này.

### 2.4 Cú rất mỏng

- Ở cú cắt 75–85°, độ lệch điểm ngắm chấp nhận được tính bằng milimét. `docs/aiming-physics.md` có bảng độ nhạy, sai số tăng theo 1/cosφ.
- Ở cú mỏng, ghost ball nằm gần như cạnh bi mục tiêu. Người chơi phải hình dung một quả bi lơ lửng bên cạnh quả bi thật, nên khó hình dung đúng chỗ. Đây là **suy đoán của em** về nhược điểm mà #12 có thể nói tới. Chưa có nguồn.
- Diễn đàn cho rằng ở cú mỏng, chênh lệch giữa "ngắm mép bi cái vào điểm chạm" và "điểm chạm tới điểm chạm" rất nhỏ. Đây là ý kiến diễn đàn.

## 3. Liên hệ với app (chỉ đề xuất, chưa làm)

- `docs/aiming-physics.md` đã đặc tả 20 drill Aim Lab, gồm ghost ball, độ dày và throw. Batch này không thêm drill mới cho ngắm, vì chưa có nội dung clip để làm căn cứ.
- **Một điều đáng kiểm ở batch 6:** hướng dẫn vẽ ghost ball trong app có tách "ghost ball hình học" và "ghost ball đã bù throw" không. Theo 2.2, chỉ throw dời ghost ball, còn squirt thì không. Nếu app vẽ ghost ball đã bù cả squirt thì đó là gộp sai hai chuyện.
- Drill "chỉ ra điểm ngắm" có thể cho người chơi chọn một trong ba cách (ghost ball, đặt đầu cơ, điểm chạm–điểm chạm) và chấm cùng một đáp án, vì cả ba cùng ra một hướng.

## 4. Thông số NEEDS CALIBRATION

Không có thông số mới. Throw đã có bảng TP A.14 trong `docs/aiming-physics.md`. Squirt thuộc file 07.

## 5. Còn thiếu

- Nội dung thật của #11–#13. Cách gỡ rẻ nhất vẫn là phương án (b) ở file 16 mục A3: anh tải video về, em tách khung và audio bằng `ffmpeg`.
- Bài gốc của Dr. Dave về nhược điểm ghost ball ở cú mỏng. Chưa tìm thấy.
