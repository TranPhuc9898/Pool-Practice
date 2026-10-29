---
title: Onboarding v7 vào app
status: in-progress
mode: fast
created: 2026-10-23
supersedes: .claude/ke-hoach/2026-10-22-onboarding-vao-app.md
---

# Onboarding v7 vào app

**Outcome:** người mở app lần đầu thấy 4 màn intro như `docs/prototypes/onboarding-v7.html`, bấm Start hoặc Skip thì vào Home và không thấy lại. Settings có hàng mở lại intro.

**Không làm:** hỏi user, baseline, seed ladder, analytics, đổi UI có sẵn, cài `react-native-svg`.

**Ràng buộc:** Expo SDK 57 (Stack.Protected, chưa có `redirectTo`). Theme đang chạy là `darkTheme`; mọi màu đi qua token để light vẫn đúng. Reduce Motion thì tắt mưa chữ và scramble, các demo bàn vẫn chạy (đây là nội dung, không phải trang trí).

## Quyết định kỹ thuật

- Bàn vẽ bằng View: một khung 520×280 theo toạ độ của prototype, `transform: [{scale}, {translateX: -112}]` với `transformOrigin: 'top left'` để cắt đúng viewBox `112 0 296 280`. Toạ độ và hình học copy nguyên từ prototype.
- Timeline giữ dạng async như prototype: `tween(ms, f)` bằng `requestAnimationFrame`, `f` ghi vào shared value của Reanimated (bi, cơ) nên không re-render mỗi khung. Đường ngắm, vùng, nhãn đổi thưa nên dùng state.
- Hủy demo bằng token `gen` như prototype: đổi slide hoặc unmount thì `alive()` trả false.
- Nét đứt ghép từ các đoạn View nhỏ, không dùng `borderStyle: 'dashed'` trên một cạnh (iOS vẽ sai).
- Mưa chữ: các cột `Text` font Doto, mỗi 70ms đẩy một ký tự mới vào đầu cột. Mép mờ bằng lớp `experimental_backgroundImage` radial phủ lên, cùng cách `tokens/material.ts` đang dùng.
- Màu bàn: thêm token `tableRail`, `tableFelt`, `tablePocket`, `ballCue`, `ballObject` vào cả hai theme.

## Các bước

| # | Bước | Xong khi |
|---|---|---|
| 1 | Store `src/pool-engine/onboarding.ts` theo mẫu `first-use.ts`: key `onboarding`, `{schemaVersion, done}`. Người cũ có `daily` hoặc `progress` thì `done = true`. Có `useOnboardingDone`, `finishOnboarding`, `replayOnboarding` | tsc sạch |
| 2 | `src/app/_layout.tsx`: `Stack.Protected guard={!done}` bọc `onboarding`, `guard={done}` bọc `(tabs)` và mọi màn khác (kể cả `settings`) | Người mới vào thẳng intro; người cũ vào Home |
| 3 | `src/app/onboarding.tsx` và `src/components/onboarding/`: pager 4 slide, Skip, pips, Next/Start, cả 4 demo | So từng slide với prototype: copy, thứ tự cảnh, nhãn |
| 4 | Settings › Help thêm hàng "Show intro" gọi `replayOnboarding()` | Bấm thì về intro |
| 5 | `npx expo lint`, `npx tsc --noEmit` | Không lỗi mới |

## Rủi ro

- `transformOrigin` và `experimental_backgroundImage` cần New Arch, app đang chạy New Arch (material.ts đã dùng). Nếu scale lệch thì bỏ transform, nhân toạ độ tay.
- Stack.Protected đổi guard lúc đang ở màn intro: router tự đẩy sang nhóm còn lại. `replayOnboarding` từ Settings sẽ thay cả stack bằng intro, đúng ý.
- Chưa kiểm trên máy thật trong plan này. Chạy app cần anh bảo.
