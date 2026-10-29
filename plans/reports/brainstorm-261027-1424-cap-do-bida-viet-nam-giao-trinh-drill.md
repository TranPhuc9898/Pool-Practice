# Giáo trình drill theo cấp người chơi Việt Nam

Ngày: 2026-10-27. Loại: brainstorm, chưa implement.

## Kết luận

Việt Nam không có thang hạng bida lỗ chính thức. Mỗi CLB và mỗi nền tảng tự đặt, phần lớn truyền miệng. App nên dùng thang giai đoạn riêng, gắn với chỉ số đo được (số bi đi một cơ, tỉ lệ dọn bàn, điểm bài kiểm), và ghi kèm "tương đương hạng phong trào" chỉ để tham khảo.

Kho drill hiện có lệch về giữa. Ở `difficulty` 3 có 38/87 bài, trong khi ở 5 chỉ có 6 bài. Hai giai đoạn trên cùng (A và S) gần như trống.

Khuyến nghị:

- Thêm một file ánh xạ giai đoạn → drill và bài kiểm qua giai đoạn.
- Chưa đổi schema `PoolDrill`.
- Viết khoảng 10 drill mới cho hai giai đoạn trên cùng.

## Hệ hạng thực tế (đã kiểm nguồn)

| Hệ | Thang | Ghi chú |
|---|---|---|
| SABO Arena (ELO) | K 1000 → I → H → H+ → G → G+ → F → E → D → C 1900+ | Mỗi bậc 100 ELO. Tên gọi: K là người mới, I là thợ 3, H là thợ 1, H+ là thợ chính, G là thợ giỏi, G+ là thợ cả, F là chuyên gia, E là cao thủ, D là huyền thoại, C là vô địch. Không có hạng S. |
| Truyền thống ở CLB | BE → C → B → B+ → A → A+ → CN | C đi 4–5 bi một cơ. B đi 6–7 bi. A trong trận chạm 7 có 3–4 lần dọn bàn một cơ. A+ ngang đội tuyển tỉnh. CN là chuyên nghiệp. |
| Biến thể ở một số CLB | thêm D, E, F, G, H dưới C | Về số bi đi được của K/I/H, các nguồn ghi khác nhau: có nơi ghi K đi 1–2 bi, nơi khác ghi I đi 1–2 bi và H đi 3–4 bi. |

Chưa nguồn nào xác nhận các hạng **A-, S-, S+, SS+, SSS** anh nêu. Có hai khả năng: thang của một CLB hoặc giải cụ thể, hoặc ghép từ game. Cách kiểm rẻ nhất là anh cho em tên CLB hoặc giải đang dùng thang đó.

Lưu ý trùng tên: ở SABO, "C" là đỉnh. Ở hệ truyền thống, "C" là mức thấp. Vì vậy app không nên in chữ hạng trần.

Nguồn:

- [SABO Arena rankings](https://saboarena.com/rankings)
- [Bida Trọng Hiếu](https://bidatronghieu.com/cac-hang-trong-bida/)
- [Bida Hoàng Anh Nam](https://bidahoanganhnam.vn/cac-hang-co-thu-bida/)
- [Hoàng Anh Nam Group](https://billiardshoanganhnamgroup.com/phan-hang-trong-bida/)
- [Zcues hạng I/K](https://zcues.com/hang-i-trong-bida/)
- [Zcues hạng H](https://zcues.com/hang-h-di-duoc-bao-nhieu-bi/)
- [ai-hay H chấp K](https://ai-hay.vn/trong-bida-lo-hang-h-chap-hang-k-bao-nhieu-set-la-hop-ly-pN1UmInaxQW)

## Phân bố drill hiện tại (đếm `difficulty` trong `src/pool-engine/drills`)

| difficulty | Số bài | Ví dụ |
|---|---|---|
| 1 | 10 | 01 straight-in, 02 stop, 32 ten-straight-in, 74 RDS 1–3 |
| 2 | 11 | 03 follow, 05 draw, 38 BU F1, 50 lag ladder |
| 3 | 38 | 07 tangent, 24 natural angle, 18 rail cut bachelors, 64 kick, 75–76 RDS 4–9 |
| 4 | 22 | 11 wagon wheel, 14 L-drill, 77 nine-ball progress, 79 equal offense, 78 RDS 10–12 |
| 5 | 6 | 10 two-ball pattern, 16 no-rail T, 17 nine-ball runout, 20 rail cut doctorate, 31 twelve-ball rails, 81 RDS 13–16 |

Tổng cộng 87 bài có `difficulty`. Thư mục có 89 file vì tính cả `index.ts` và file phụ.

## Đề xuất 6 giai đoạn

| Giai đoạn | Tương đương (tham khảo) | Mốc qua (đo được) | Drill hiện có | Thiếu |
|---|---|---|---|---|
| 1. Nhập môn | K, I / BE | 10 bi thẳng liên tiếp; Stance Check đếm set tay thẳng | diff 1 (10 bài) + Stance | Đủ |
| 2. Phong trào | H, H+ | Kéo/đẩy tới vùng cho trước 7/10; đi 3–4 bi | diff 2 (11 bài) | Ít bài về đánh tâm điểm phụ |
| 3. Thợ | G, G+ / C | Đi 4–5 bi; RDS 4–9; cắt góc và đi băng ngắn | diff 3 (38 bài) | Đủ, thừa: cần chọn ra lõi khoảng 12 bài |
| 4. Thợ cả | F / B, B+ | Đi 6–7 bi; L-drill và wagon wheel đạt; có phòng thủ cơ bản | diff 4 (22 bài) | Ít bài phòng thủ có chấm điểm |
| 5. Cao thủ | E, D / A, A+ | Dọn bàn 9 bi ≥30% số lượt; break-and-run | diff 5 (6 bài) | **Thiếu nặng** |
| 6. Chuyên nghiệp | C (SABO) / CN, "S" | Dọn bàn 10 bi gọi lỗ; trận với ghost; break ổn định | 80 ten-ball ghost, 71 break evaluation | **Gần như trống** |

Drill mới đề xuất cho giai đoạn 5–6. Đây là ý của em, chưa đối chiếu với nguồn drill có tên tuổi:

1. Break-and-run 9 bi tính chuỗi: đếm số lần dọn bàn trong 10 lượt.
2. 10 bi gọi lỗ với ghost, chạm 7.
3. Ba bi cuối có nhiều lỗ: chọn lỗ để có đường cho bi kế.
4. Gỡ cụm khi đang chạy bàn: phá cụm ở bi giữa pattern.
5. Đổi phòng thủ: đánh an toàn, sau đó giải an toàn do chính mình đặt.
6. Kick một băng và hai băng trúng vùng.
7. Push-out sau break, quyết định trong 9 bi.
8. Break kiểm soát bi cái về giữa bàn, đo vị trí.
9. Áp lực: bài cũ phải đạt N lần liên tiếp, sai thì về 0.
10. Bàn ngẫu nhiên: app rải 9 bi, đếm số bi đi được.

Hai bài 9 và 10 dùng lại engine sẵn có nhiều nhất.

## Brainstorm contract

- **Outcome:** Người chơi thấy mình ở giai đoạn nào, có danh sách drill theo thứ tự, và có bài kiểm để lên giai đoạn sau.
- **Constraints:**
  - Không thiết kế lại UI: giai đoạn hiện trong card và màn sẵn có.
  - Theo `docs/chuan-drill.md` và qua `drill-lint`.
  - Đổi schema `PoolDrill` là cửa một chiều: để sau.
- **Non-goals:**
  - Không tạo hệ ELO.
  - Không phân hạng chính thức.
  - Không đồng bộ server.
  - Không chấm hạng bằng camera.
- **Acceptance:**
  - Mọi drill đều thuộc đúng một giai đoạn.
  - Mỗi giai đoạn có ít nhất 1 bài kiểm qua.
  - Giai đoạn 5 và 6 mỗi giai đoạn có ít nhất 5 bài.
  - Lint và typecheck sạch.

## Trade-offs

| Cách | Dựa vào | Vỡ khi |
|---|---|---|
| A. File ánh xạ `stages.ts`: giai đoạn suy từ `difficulty`, có override theo id, kèm bài kiểm (**chọn**) | `difficulty` hiện tại xếp đúng thứ tự | Vài bài bị chấm sai `difficulty`. Sửa bằng override, rẻ. |
| B. Thêm field `stage` vào `PoolDrill` | Thang giai đoạn đã chốt | Đổi số hoặc tên giai đoạn thì phải sửa 87 file |
| C. Dùng thẳng chữ hạng VN (K…A+, S) làm giai đoạn | Người dùng hiểu chung một thang | Mỗi CLB hiểu một khác, và "C" mang hai nghĩa ngược nhau |

Better approaches: không có. Hướng A chính là ý anh (chia drill theo giai đoạn), chỉ khác ở chỗ tách nhãn hạng VN ra làm nhãn tham khảo, vì đã thấy các nguồn không thống nhất.

## Bước kế (nếu anh duyệt)

1. Viết `src/pool-engine/stages.ts` gồm 6 giai đoạn, mỗi giai đoạn có: tên, mốc qua, hạng tham khảo, override, id bài kiểm.
2. Rà lại `difficulty` của 87 bài và ghi các override.
3. Viết 10 drill mới cho giai đoạn 5–6 theo `docs/chuan-drill.md`.
4. Gắn nhãn giai đoạn vào card drill sẵn có.

## Câu hỏi còn mở

- Thang A-/S-/S+/SS+/SSS lấy từ CLB hay giải nào?
- Nhãn tham khảo theo SABO (K…C) hay theo hệ truyền thống (BE…CN)? Em nghiêng về SABO vì có ELO công khai và đúng thang K/I/H anh nói.
