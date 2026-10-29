# Đưa onboarding v3 vào app — 2026-10-22

**Xong là:** Settings › Show intro, nhánh bàn bấm Pass đủ 10 cú: màn kết quả ghi "starts at 3 diamonds", Home ghi `00 passed · Stop L3`; nhánh chưa ở bàn xem demo 3 cú rồi về Home.
**Cách làm:** route `src/app/onboarding.tsx` dựng theo `docs/prototypes/onboarding-v3.html`, gác bằng `Stack.Protected` theo cờ kv `onboarding`; 10 kết quả baseline nối trước lịch sử Stop trong `ladderOf` — vì ladder 2-down-1-up vốn suy level từ mảng kết quả, cho baseline đi cùng luật thì khỏi lưu level riêng.
**Đánh đổi:** chấp nhận mất crop góc bàn và zoom khi bi dừng của v3, dùng stage cả bàn như màn Workout, để không phải đụng native `PoolEditorView`.
**Không làm:** notification primer ở màn kết quả (chưa có `expo-notifications`), Undo trong set baseline, bản tiếng Việt, đồng bộ server.

## Bước

- [ ] 1. Lát mỏng: store `{ done, baseline }` trong `src/pool-engine/onboarding.ts`, `src/app/onboarding.tsx` chỉ có màn value + Skip, `Stack.Protected` trong `src/app/_layout.tsx` với `settings` nằm trong nhóm `guard={done}`, hàng Show intro trong `src/app/settings.tsx` → xong khi: Settings › Show intro hiện màn value, Skip về Home, kill app mở lại vào thẳng Home
- [ ] 2. Màn ask và setup đủ nội dung v3, rẽ nhánh Yes/No trong `src/app/onboarding.tsx`, tiêu đề Newsreader 500 thêm vào `src/design-system/fonts.ts` + `src/design-system/tokens/typography.ts` → xong khi: Yes ra màn setup, No ra màn demo trống, back từ setup về ask
- [ ] 3. Set baseline trong `src/components/onboarding/baseline-set.tsx`: `PoolEditorView stageOnly` + `GoldAction`/`GraphiteAction` + `Scoreboard` như `src/app/workout.tsx`, khoảng cách đổi theo `ladderRung` sau từng cú, cú 10 ghi `baseline` → xong khi: Pass ×10 ra "starts at 3 diamonds", Miss ×10 ra "starts at 1 diamond"
- [ ] 4. `ladderOf(days, id, seed)` với `seed` bắt buộc trong `src/pool-engine/workout.ts`, hai chỗ gọi `src/app/(tabs)/(today)/index.tsx` và `src/app/workout.tsx` truyền `baseline` (cần 3) → xong khi: `npx tsc --noEmit` exit 0, sau baseline Pass ×10 Home ghi `Stop L3`
- [ ] 5. Màn kết quả: `ProgramGauge` từ `src/components/home/program-gauge.tsx` ở 0/120, Start workout đặt `done` rồi mở `/workout` (cần 3) → xong khi: bấm Start ra Workout "Block 1 of 4 · 0/120 shots", back về Home chứ không về onboarding
- [ ] 6. Demo 3 cú tự chạy bằng `playRev` theo nhịp trong `src/components/onboarding/demo.tsx`, Got it đặt `done` → xong khi: nhánh No, bàn tự đánh đủ 3 cú, đếm `03 / 03`, Got it về Home
- [ ] 7. Soát a11y toàn flow trong `src/app/onboarding.tsx` → xong khi: `npx expo lint` và `npx tsc --noEmit` exit 0; iPhone SE ở AX5 cuộn tới bấm được mọi CTA; bật Reduce Motion thì nhãn mức đổi không nháy vàng

## Vỡ ở đâu

- `(tabs)` là anchor mà bị gác, SDK 57 chưa có `redirectTo` (từ SDK 58) nên dựa vào "first available screen" → kiểm bằng: Show intro, kill app mở lại, khung đầu tiên là màn value, không lóe Home
- `settings` lọt ngoài nhóm `guard={done}` thì bấm Show intro đứng yên ở Settings → kiểm bằng: bấm Show intro, màn value hiện ngay, vuốt back không về Settings
- Cú baseline lỡ ghi vào store `daily` thì tính vào 120 cú và lệch mốc Workout → kiểm bằng: sau set baseline, Home vẫn `00 passed`, Workout vẫn "0/120 shots"

## Phát sinh
