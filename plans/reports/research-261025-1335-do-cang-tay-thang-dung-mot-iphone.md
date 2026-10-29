# Đo cẳng tay thẳng đứng bằng một iPhone

Thời điểm: 2026-10-25 13:35. Phạm vi: một iPhone, không phụ kiện ngoài chân máy, Apple Vision + CoreMotion.

## Kết luận

Cách đang có (Vision 2D lấy khuỷu và cổ tay, CoreMotion gravity chiếu thành dây dọi tại khuỷu, lệch ≤ 10° là đạt) là đúng hướng và không có lựa chọn ngoài nào tốt hơn rõ rệt cho một máy. Điều kiện để nó đúng là đặt máy **bên hông, ngang tầm khuỷu, dựng thẳng** (nghiêng ≤ 12°). Ba clip anh gửi hỏng không phải vì thuật toán mà vì máy đặt thấp, ngửa lên 12–26°, và overlay bám nhầm người phía sau.

Góc chéo sau không đo được độ dọc thật bằng 2D. 3D pose của Apple là đường duy nhất cho góc đó, nhưng chưa có số đo độ chính xác công khai nào, và thử nhanh trên clip của anh cho góc vô lý (24–47° với tay đang buông). Chưa nên dựa vào nó.

## Ba clip quay màn

| Clip | Dài | Banner nghiêng | Khung thấy tay 2D (conf ≥ 0.3) | Khung ra skeleton 3D | Trung vị góc 3D |
|---|---|---|---|---|---|
| 10-21 15:32 | 38.8 s | 12° | 65/155 (42%) | 92/155 | 24° |
| 10-22 01:45 | 21.5 s | 24° | 2/86 (2%) | 7/86 | 43° |
| 10-22 02:14 | 43.3 s | 26° | 19/173 (11%) | 77/173 | 47° |

Đã kiểm (tách 4 khung/s, cắt bỏ phần UI, chạy `VNDetectHumanBodyPoseRequest` và `VNDetectHumanBodyPose3DRequest` trên macOS):

- STRIKES đứng 00 cả ba clip, banner "Phone tilted … Stand it upright." hiện liên tục.
- Clip 1: đường cẳng tay vẽ lên người đứng phía sau, không phải người cầm cơ.
- Clip 2 và 3: chỉ có chấm trắng gần đầu, không có đường cẳng tay dù tay buông rõ trong hình.
- Tỉ lệ thấy tay 2D thấp hơn xa ngưỡng 70% của plan `261022-0508-phan-tich-clip-sau-lung`.

Suy đoán, chưa kiểm: lúc quay, ngưỡng nghiêng trên máy thấp hơn `maxLineTilt = 30` hiện tại, vì 24–26° lẽ ra vẫn vẽ đường.

Vì sao không đưa vào harness: đây là quay màn hình (có overlay, khung preview đã cắt, độ phân giải khác camera) và không có gravity đi kèm. Số trong bảng chỉ dùng làm bằng chứng về hành vi, không dùng để chỉnh ngưỡng. Góc 3D đo so với trục y của skeleton (gốc ở hông), không phải gravity, nên càng không dùng được khi máy nghiêng.

## Bằng chứng bên ngoài

**Apple Vision 3D (WWDC23, tài liệu API).** `VNDetectHumanBodyPose3DRequest` cần iOS 17, trả 17 khớp tính bằng mét, gốc ở giữa hông, y hướng lên, một người duy nhất (người nổi bật nhất). Có `cameraOriginMatrix` để biết máy nằm đâu so với người. Không có depth thì chiều cao mặc định 1.8 m. Apple không công bố sai số góc khớp.

**Sai số đơn camera 2D (PLoS ONE 2023, OpenPose, đối chiếu motion capture).** Khớp phía gần camera: knee LoA −6.5 đến 9.6°. Khớp bị che phía xa: hip LoA −23.2 đến 14.0°, SD cao hơn 40–108%. Khuyến nghị bỏ qua khớp bị che. Áp vào bi-a: tay cầm cơ phải nằm phía gần máy.

**Góc lệch trục.** Các nghiên cứu đơn camera khác ghi sai số trên 20° khi góc nhìn lệch nhiều khỏi mặt phẳng chuyển động, và LoA khoảng ±12° trong một nghiên cứu dùng iPad. Đây là co ngắn phối cảnh kinh điển: chuyển động ra khỏi mặt phẳng ảnh bị thu nhỏ hoặc mất.

**Sản phẩm đã làm.** Cue Measure gắn máy lên cơ, đo cơ chứ không đo người. Một đồ án AUT 2023 dùng pose + Transformer phân loại cú đánh bi-a, không đo góc cẳng tay. Sportsbox AI (golf) quảng cáo 3D từ một điện thoại nhưng không có kiểm chứng độc lập. Không tìm thấy app bi-a nào đo độ dọc cẳng tay bằng camera.

**Chuyên môn.** Trên AzBilliards, cẳng tay vuông góc lúc address được khuyên phổ biến, nhưng nhiều pro hơi lệch trước. Đa số đồng ý khuỷu đứng yên quan trọng hơn. Một HLV snooker cho rằng chỉ cần vuông góc lúc chạm bi. Ngưỡng ±10° hiện tại hợp lý, nên đo tại address và tại chạm.

## Cách đặt máy

```
        nhìn từ trên xuống
   bàn  ───────────────────
              cơ  ═══●  bi
                  🧍 người
                  │
                  │  1.5–2.5 m
                  ▼
                 📱  ngang tầm khuỷu, dựng thẳng, camera sau
```

- Bên hông phía tay cầm cơ, vuông góc với đường cơ. Thấy được nghiêng trước/sau, là lỗi chính.
- Chân máy cao ngang khuỷu (khoảng 0.9–1.1 m), không đặt dưới sàn ngửa lên.
- Camera sau, không phải camera trước.
- Lỗi chicken wing (khuỷu bung ra ngoài) chỉ thấy từ sau lưng, là phiên riêng.

## Việc nên làm, theo thứ tự

1. **Hướng dẫn đặt máy trong màn Stance**: dòng chữ khi `tilted` nói rõ "đặt ngang tầm khuỷu" thay vì chỉ "dựng thẳng". Không đổi layout.
2. **Chọn người**: hiện lấy bounding box lớn nhất, clip 1 cho thấy vẫn nhảy sang người sau. Khoá người theo vị trí khung trước, chỉ đổi khi mất hẳn vài giây.
3. **Quay clip thô bằng app Camera** với máy đặt như trên, 60 fps, 30 s, cả bên hông lẫn chéo sau. Đưa vào harness hiện có để lấy tỉ lệ thấy tay và biên độ/rung.
4. **Cờ `--3d` trong harness** chỉ sau bước 3, để so góc 3D với góc 2D + gravity trên cùng clip bên hông. Lệch quá 10° thì bỏ hướng 3D.

## Câu hỏi còn mở

- Ngưỡng nghiêng trên bản đã cài lúc quay ba clip là bao nhiêu? Kiểm bằng bản build đang chạy trên máy.
- Apple 3D có chịu được tư thế cúi gập trên bàn (thân gần nằm ngang) không? Chỉ trả lời được bằng clip thô.

## Nguồn

- https://developer.apple.com/videos/play/wwdc2023/111241/
- https://developer.apple.com/documentation/vision/vndetecthumanbodypose3drequest
- https://developer.apple.com/forums/thread/732023
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10635560/
- https://arxiv.org/pdf/1808.09316
- https://apps.apple.com/us/app/id862471845
- https://cerv.aut.ac.nz/wp-content/uploads/2023/12/AUT-Project-Report-Zhikang-Chen-24-Sep-2023.pdf
- https://forums.azbilliards.com/threads/back-arm-perpendicular-why.118190/page-2
- https://www.geekwire.com/2022/ex-golf-pro-links-with-seattle-area-ai-experts-on-app-that-uses-3d-motion-analysis-to-improve-game/
- https://litslink.com/case-studies/ai-golf-swing-analyzer
