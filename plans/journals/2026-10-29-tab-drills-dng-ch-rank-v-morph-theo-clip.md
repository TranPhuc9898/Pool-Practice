---
title: Tab Drills dòng chữ Rank và morph theo clip
date: 2026-10-29
summary: "Dòng Rank ▏hạng với bàn phím 12 hạng, chọn thì gõ chữ rồi morph con trỏ thành trang hạng; sửa 4 lỗi đo khung và a11y"
---

# Tab Drills dòng chữ Rank và morph theo clip

## What happened
- Tab Drills chỉ còn dòng lớn `Rank ▏<hạng>` và bàn phím 12 hạng (2×6). Chọn phím thì chữ hạng gõ vào sau con trỏ, chờ 360ms, rồi nở: con trỏ → pill 112pt → dãn ngang → full màn. Đóng chạy ngược.
- Lần đầu cú nở rơi về khung dự phòng giữa màn. Log `MORPHDBG` cho thấy `views` rỗng: ref callback inline lần gọi null cuối xoá mất view con trỏ. Chuyển sang `useRef` + đăng ký trong `useEffect`.
- Deep link `rank/E` nở từ khung cũ của lần bấm trước, vì lúc gỡ màn chỉ xoá `originKey` mà không xoá `origin`. Giờ xoá cả hai. Trang hạng thiếu gốc thì tự `retargetRank(RANK_HERO, rank)` rồi mới nở. Khung có height 0 (tab ẩn) thì coi như không đo được.
- Reduce Motion: bỏ thời gian chờ chữ gõ.
- VoiceOver vẫn đọc xuyên tab nằm dưới `transparentModal`. `accessibilityViewIsModal` không có tác dụng vì hai màn không cùng cha native. Dùng `useIsFocused` để ẩn hero.

## Decision
- Hạng đang điền là store `useSyncExternalStore` trong `rank-morph.ts`, dùng chung cho Next rank và deep link.

## Next steps
- Anh tự bấm thử để chốt nhịp chờ 360ms. Commit khi anh duyệt.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
