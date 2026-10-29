---
phase: 4
title: Bộ chọn hạng trên tab Drills
status: in-progress
---

# Phase 4 — Bộ chọn hạng trên tab Drills

Hướng UX chốt ngày 2026-10-29: hạng là bộ lọc duy nhất, nhóm kỹ năng là section bên trong. Không có hàng lọc nhóm, không còn Stage và SABO trên tab Drills (`STAGES` vẫn giữ cho Home và workout).

## Files

- Sửa: `src/app/(tabs)/drills/index.tsx`
- Sửa: `src/components/drill-card.tsx`
- Sửa: `src/design-system/components/rank.tsx` (‹ ›, nội dung hero, pill gợi ý, 450ms)
- Thêm: hàm `suggestedLevel(progress)` trong `src/pool-engine/levels.ts`

## Bước

1. `levels.ts`: `suggestedLevel` trả hạng đầu tiên chưa "qua". Hạng qua khi pass ≥ ngưỡng số drill của hạng (mặc định 2/3, chốt lại theo số bài mỗi hạng ở bảng phase 1). Không có tiến độ thì trả `H`. Chỉ đọc `progress`, không bịa số.
2. `levels.ts`: `LEVEL_BENCHMARK: Record<TrainingLevel, string>`, mỗi hạng một câu mốc đo được trên bàn, cùng kiểu `STAGES.benchmark`. Anh duyệt cùng bảng phase 1.
3. `rank.tsx`:
   - `duration` về 450 (`spring.gentle` gốc). Reduce Motion: chỉ crossfade.
   - Hero nhận nội dung: chữ hạng, câu mốc, `x/y passed` kèm `RankProgress`, nút `Start with #n` (drill chưa qua đầu tiên trong hạng).
   - ‹ › trên hero bước sang hạng kề, crossfade nội dung, không nở lại. Hết hạng ở đầu/cuối thì ẩn nút.
   - Prop `suggested`: pill đó có vòng viền màu `ink` và nhãn "Next". Hàng pill tự cuộn tới pill gợi ý khi mount. Không dùng gradient.
   - Chỉ hiện pill của hạng có ít nhất 1 drill.
4. `drills/index.tsx`:
   - Chưa chọn: section theo hạng, header có `RankBadge` nhỏ và `Rank E · 11 drills`.
   - Đã chọn: hero, dưới là section theo nhóm kỹ năng, chỉ nhóm có bài.
5. `drill-card.tsx`: dòng phụ đổi `Stage n ~SABO` thành `nhóm · Best/Pass`. Thêm nhãn kiểm chứng ngắn: `Simulated`, `Path drawn`, `Video`, `Unverified`. Card không mang màu hạng.

## Xong khi

- `npx tsc --noEmit`, `npx expo lint` exit 0.
- `grep -rn "sabo" src/app src/components` ra rỗng.
- Simulator:
  - Máy chưa có tiến độ: pill H mang nhãn "Next".
  - Chọn `D` thấy section Kick (64, 65). C− không có bài kick.
  - ‹ › đổi hạng không nở lại hero. ✕ về danh sách theo hạng.
  - Mỗi lúc trên màn có tối đa một gradient.
  - Bật Reduce Motion: không còn co giãn.
  - Mở drill từ danh sách vẫn chạy Play như cũ.

## Trạng thái 2026-10-29

- Code bước 1–5 xong, trừ nhãn kiểm chứng trên card: chờ trường `verification` của phase 2.
- tsc, lint sạch; `grep sabo` rỗng. Chưa kiểm simulator.

## Đổi hướng 2026-10-29 (anh duyệt)

Bộ chọn pill nở hero "chưa wow". Thay bằng hai màn:

- `src/app/(tabs)/drills/index.tsx`: thẻ Up next (gradient đầy đủ duy nhất trên màn) cho hạng gợi ý, dưới là lưới 2 cột 12 ô hạng. Ô nền tối, chỉ hắt màu hạng ở góc.
- `src/app/rank/[id].tsx` (mới, đăng ký trong `_layout.tsx`): hero gradient tràn dưới header trong suốt, chữ hạng lớn, mốc, `x/y passed`, nút `Start/Continue · nn tên bài`, section theo nhóm kỹ năng, cuối trang có lối sang hạng kế (`router.replace`). Kéo quá đầu hero giãn, cuộn thì watermark trôi chậm và mờ dần.
- `src/components/rank/rank-data.ts`, `rank-cards.tsx`: dữ liệu theo hạng và thẻ dùng chung. `DrillCard` có `compact` cho trang hạng.
- Chuyển màn theo clip anh gửi (x.com/ngocdevv/status/2115508368072941848), thay zoom iOS 18 vì anh thấy không giống. `rank/[id]` là `transparentModal`, `animation: 'none'`. Khung là mặt nạ cửa sổ lên nền hạng cố định toàn màn. Pha 1 (380ms) ô dãn ngang thành pill sát mép 12pt, ô cùng hàng bị đẩy văng ngang. Nghỉ 60ms. Pha 2 (440ms) nở dọc ra full màn, các hàng khác bị đẩy lên hoặc xuống. Xong mới hiện nội dung (260ms). Đóng: nội dung mờ 160ms, rồi chạy ngược (340 + 300ms) về đúng ô. Trạng thái chung ở `src/components/rank/rank-morph.ts`, đo khung mọi ô lúc bấm vì lưới cuộn được. Reduce Motion chỉ crossfade. Bỏ đoạn 0–1s của clip (con trỏ mọc thành pill) vì cú bấm bắt đầu từ ô có sẵn.
- Màn đẩy sau `transparentModal` bị iOS trình bày dạng modal nên mất back gốc. `drill/[id]` tự vẽ nút back khi dưới nó có trang hạng.
- Trang hạng bị gỡ không qua `beforeRemove` (Fast Refresh, reset điều hướng) thì trả `progress` về 0, nếu không lưới kẹt ngoài màn.
- `RankSelector` giữ trong `design-system.tsx`, không còn trên tab Drills. Tiêu chí "‹ › không nở lại hero, ✕ về danh sách" không còn áp.

Đã kiểm trên simulator, quay video tách khung: mở F, mở E (pill hiện lát chữ E), đóng về ô, E → drill → back → back, Next rank E → D rồi đóng về ô D. tsc, lint sạch. Chưa kiểm: Reduce Motion, deep link không có ô gốc (rơi về pill giữa màn), thẻ Up next làm ô gốc.

## Đổi hướng lần 2, 2026-10-29 (anh duyệt): tab Drills là dòng chữ như clip

- Tab Drills chỉ còn một dòng lớn `Rank ▏<hạng>` (con trỏ nhấp nháy), dưới là câu mốc, `x/y passed` và bàn phím 12 hạng (2 hàng × 6, chấm Next ở hạng gợi ý, tick ở hạng đã qua). Bỏ thẻ Up next và lưới ô.
- Mặc định điền hạng gợi ý, eyebrow "Up next". Bấm phím hạng thì chữ hạng gõ vào sau con trỏ (260ms), chờ 360ms rồi nở. Bấm thẳng dòng lớn thì mở hạng đang điền.
- Cú nở thêm pha 0 của clip: -1 → 0 con trỏ mọc thành pill rộng 112pt đẩy "Rank" và chữ hạng ra hai bên (400ms), rồi dãn ngang, rồi nở dọc. Lúc nở dọc bàn phím bị đẩy xuống khỏi màn. Đóng chạy ngược về con trỏ.
- Hạng đang điền là store chung trong `rank-morph.ts`. Next rank trên trang hạng đổi chữ trên dòng lớn và đo lại, nên đóng thu về đúng chữ mới.
- Con trỏ đăng ký view trong effect. Ref callback inline bị gọi null sau cùng nên mất view, cú nở rơi về khung dự phòng giữa màn.

Đã kiểm trên simulator, quay video tách khung: chọn D (chữ gõ vào, pill, dãn, nở, đóng về con trỏ), Next rank D → C− rồi đóng về dòng lớn chữ C−. tsc, lint sạch. Kiểm thêm: drill → back → back về dòng lớn. Deep link `rank/E`: trang tự điền E lên dòng lớn rồi nở từ con trỏ (trước đó dùng nhầm khung cũ vì lúc gỡ màn chỉ xoá `originKey`, giờ xoá cả `origin`). Tab chưa mount hoặc đo ra khung rỗng thì nở từ giữa màn. Reduce Motion: không nở, không chờ chữ gõ, trang hiện ngay, đóng về ngay. VoiceOver: lúc trang hạng mở, dòng lớn và bàn phím ẩn khỏi cây accessibility (`useIsFocused`), đóng thì hiện lại. `accessibilityViewIsModal` không có tác dụng vì hai màn không cùng cha native.
