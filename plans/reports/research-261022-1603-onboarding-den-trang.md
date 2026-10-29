# Research: onboarding đen trắng, huyền bí, gắn bida

Ngày: 2026-10-22 16:03 (Asia/Saigon). Phạm vi: Pool Practice, Expo SDK 57, RN 0.86, iOS.

## Kết luận

Làm intro 3 trang theo khung của mẫu (nửa trên visual, nửa dưới headline, dots, CTA), nhưng **nửa trên là một cảnh bida liên tục**: bàn chìm trong bóng tối, một ngọn đèn treo rọi xuống. Qua mỗi trang, cảnh đi tiếp chứ không đổi hình. Chỉ dùng đen và trắng, không vàng. Làm được bằng `experimental_backgroundImage` + Reanimated, repo đã dùng sẵn, **không cần thêm dependency**.

## 1. Pattern onboarding (đã kiểm nguồn)

- Tối đa 3 slide, chỉ nói giá trị ngày đầu ([Appcues](https://www.appcues.com/blog/in-app-onboarding), [Eleken](https://www.eleken.co/blog-posts/mobile-app-onboarding-best-practices)). Con số 3 chỉ là rule of thumb, một nguồn, chưa phải chuẩn.
- Luôn có lối thoát (Skip) ([InAppStory](https://inappstory.com/glossary/user-onboarding)).
- Bằng chứng mạnh nhất là của NN/g: người đọc tutorial thấy việc khó hơn và **không làm nhanh hay đúng hơn** người bỏ qua. NN/g khuyên dùng contextual help ([NN/g](https://www.nngroup.com/articles/mobile-tutorials/)).
- Dots báo trước độ dài. Càng dài càng bị skip ([Treehouse](https://teamtreehouse.com/library/user-onboarding/best-practices)).
- Không tìm được số liệu completion/skip rate đáng tin. Con số "skip trong 5–10 giây" của [Dolfy](https://www.dolfy.ai/blog/onboarding-skip-button-problem-first-run-tutorials-ignored) không dẫn nguồn.

Suy ra cho app: intro chỉ để **tạo không khí và hứa một điều**. Phần dạy vẫn để hai hint Play/Pass trong Workout, đã làm. Intro dài hơn 3 trang là phí.

## 2. Tham chiếu visual tối, đơn sắc

- Dribbble: "B&W Modernistic On-boarding" ([Alverio](https://dribbble.com/Alverio)), CRED 2.0 onboarding và Morse night mode ([collection](https://dribbble.com/sierrabravodesign/collections/2081958-ubi)). Search chỉ ra listing, em chưa xem từng ảnh.
- Nền đen tuyệt đối, để ảnh hoặc ánh sáng tự tạo điểm nhấn: Leonardo.ai, Luma ([webdesignhot](https://www.webdesignhot.com/design.md/leonardo-ai/)).
- WHOOP: nền đen để dữ liệu nổi, progressive disclosure 3 lớp ([925studios](https://www.925studios.co/blog/whoop-design-breakdown)).
- Oura: đen tuyền, chữ mảnh. Accent của họ là champagne-gold, đúng thứ anh muốn bỏ ([webdesignhot](https://www.webdesignhot.com/design.md/oura/)).

Rút ra: "huyền bí" không đến từ màu mà từ **ánh sáng**. Một nguồn sáng duy nhất, rất nhiều vùng đen, chuyển động chậm.

## 3. App bida

DrillRoom (OrangeLoops) là đối thủ gần nhất: iOS, camera AI, đặt máy cao hơn 5 feet, bàn cần đủ sáng ([App Store](https://apps.apple.com/app/id1539827505), [OrangeLoops](https://orangeloops.com/2021/02/drillroom-ai-powered-billiard-training-ios-app/)). Không tìm được teardown onboarding của họ. Muốn biết thì phải cài app xem trực tiếp.

## 4. Kỹ thuật trong repo (đã kiểm)

| Hiệu ứng | Cách làm | Trạng thái |
|---|---|---|
| Đèn rọi, vignette | `radial-gradient` trong `experimental_backgroundImage`, có từ RN 0.80 ([RN docs](https://reactnative.dev/docs/0.85/view-style-props)) | Repo đang dùng ở `src/design-system/tokens/material.ts` |
| Bóng, quầng sáng | `boxShadow` | Đang dùng |
| Đèn chập chờn, bi lăn, vệt đường bi | Reanimated 4.5 (opacity, translate, `withTiming` 1–2 s) | Có sẵn |
| Grain phim | PNG noise 128px lặp, opacity 4–6%, qua `expo-image` | Có sẵn, không thêm lib |
| Shader thật (khói, grain động) | `@shopify/react-native-skia` ([Expo docs](https://docs.expo.dev/versions/v58.0.0/sdk/skia.md)) | **Chưa cài**, là native dep, cần dev build mới. Không đáng cho 3 trang |

`experimental_backgroundImage` vẫn mang nhãn experimental, có thể đổi ở bản RN sau. Repo đã chấp nhận rủi ro này.

## 5. Ba concept

**A. Đèn bàn (khuyến nghị).** Màn đen hoàn toàn. Trang 1: đèn treo bật lên, chập chờn 2 nhịp, quầng sáng trắng hiện mặt bàn và một bi cái. Headline: "Mọi cú đánh bắt đầu từ bóng tối." Trang 2: một vệt trắng mảnh vẽ từ bi cái tới bi mục tiêu, bi mục tiêu đi vào lỗ, tức là Play. Trang 3: bi rơi, ánh đèn giữ trên lỗ, hai chữ PASS / MISS hiện mờ. Dots là 3 bi nhỏ, bi đang xem màu trắng, còn lại viền xám. CTA nền trắng chữ đen.

**B. Một cú.** Một màn duy nhất: đèn rọi bi cái, người dùng kéo để ngắm (đường ngắm trắng), thả tay thì bi chạy. Sau đó chữ hiện "Đó là mô phỏng. Giờ đánh thật." Đây là learn-by-doing đúng nghĩa NN/g, nhưng phải tự viết lại vật lý mini ở RN hoặc nhúng `PoolEditorView` native. Chi phí gấp 3 lần A.

**C. Số 8.** Kiểu editorial. Mỗi trang là một quả bi rất to nổi lên từ bóng tối, có vệt phản sáng (bi 1, bi 2, bi 8), chữ số Doto, grain. Đẹp và lạ, nhưng không dạy gì về Play/Pass, chỉ có không khí.

| | Không khí | Dạy được Play/Pass | Chi phí |
|---|---|---|---|
| A | Cao | Có, bằng hình | Thấp |
| B | Trung bình | Có, bằng tay | Cao |
| C | Rất cao | Không | Thấp |

Khuyến nghị **A, mượn từ C ý dùng bi làm dots**. B để dành nếu sau này đo thấy người mới vẫn không hiểu Play khác Pass ở chỗ nào.

## Bước tiếp

1. Render HTML concept A (đen trắng, đèn, grain) để anh duyệt.
2. Duyệt xong mới viết plan vào app. Plan cũ `2026-10-22-onboarding-vao-app.md` (v3, baseline 10 cú) coi như thay thế hoặc lùi sau.

## Câu hỏi còn mở

- Font headline: giữ Be Vietnam Pro, hay thêm một serif mảnh cho chất điện ảnh? Plan v3 từng định dùng Newsreader.
- Dribbble và Mobbin chặn đọc tự động nên em chưa xem được ảnh từng shot tham chiếu.
