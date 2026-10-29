# Hạng bi-a lỗ ở Việt Nam, bổ sung — 2026-10-27 22:46

Kết luận: tab Drills dùng thang SABO Arena (K, I, H, G, F, E, D, C) làm nhãn hạng. Không tìm được nguồn nào cho hạng A-, S-, S+, SS+ hay SSS. Thang CLB truyền thống lên tới A+ rồi CN (chuyên nghiệp, đội tuyển quốc gia).

Bản này nối tiếp `plans/reports/brainstorm-261027-1424-cap-do-bida-viet-nam-giao-trinh-drill.md`, không lặp lại phần đã có ở đó.

## Đã kiểm

- **SABO Arena** có bảng ELO K 1000 → I → H → H+ → G → G+ → F → E → D → C 1900+, không có hạng S. Đây là thang duy nhất có con số đo được (saboarena.com/rankings, ghi trong report 1424).
- **Thang CLB truyền thống** đi BE → C → B → B+ → A → A+ → CN. Bài của bidathinhkent.com mô tả A+ là cơ thủ đội tuyển tỉnh, thành, CN là đội tuyển quốc gia có lương nhà nước. Bài cũng nói A, B, C được dùng "tùy từng câu lạc bộ hoặc giải đấu" và việc xếp hạng nhiều khi chủ quan.
- Bài của billiardshoanganhnamgroup.com ghi rõ thang này phần lớn là truyền miệng, liên đoàn chưa có văn bản chính thức cho cấp phong trào. Khung trình độ trong bài đi từ BE tới CN, không có ký hiệu S.
- Ba lượt tìm "hạng S bida", "phân hạng S A B C bida lỗ", "hạng A+ S chuyên nghiệp" không trả về nguồn Việt nào định nghĩa hạng S. Kết quả gần nhất là thang ABCD của Mỹ trên drdavepoolinfo.com, không quy đổi được sang thang Việt.

## Suy ra, chưa kiểm

- Thang S/SS/SSS có thể là cách gọi riêng của một CLB, một nhóm Facebook hoặc một app. Em chưa tìm ra nguồn đó.
- Chữ "C" ngược nghĩa giữa hai thang: C là đỉnh của SABO nhưng gần đáy của thang CLB. Vì vậy app chỉ nên hiện một thang.

## Vì sao chọn SABO

SABO đã có trong `STAGES.sabo` của `src/pool-engine/stages.ts`, có ngưỡng ELO công khai, và chia đủ mịn ở nhóm phong trào (K tới G+), đúng nhóm người dùng app. Thang CLB gom hết nhóm mới chơi vào BE và C, nên không chia được 6 nấc drill.

## Câu hỏi còn mở

- Anh lấy thang A-, A+, S-, S+, SS+, SSS từ đâu? Có nguồn thì em thêm cột quy đổi vào bảng hạng, không đổi nhãn chính.

## Nguồn

- https://saboarena.com/rankings
- https://bidathinhkent.com/blog/cach-xep-hang-co-thu-bida-va-hanh-trinh-tro-thanh-co-thu-chuyen-nghiep
- https://billiardshoanganhnamgroup.com/phan-hang-trong-bida/
- https://drdavepoolinfo.com/faq/rating/abcd/
