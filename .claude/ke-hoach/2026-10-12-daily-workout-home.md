# Daily Workout trên hero Home — 2026-10-12

**Xong là:** mở Home thấy hero "Daily · Fundamentals" với vòng 4 cung. Đánh cú nào thì số `x/100` và cung tương ứng tăng theo. Kill app rồi mở lại vẫn giữ nguyên. Sang ngày mới thì về 0, còn streak đếm đúng số ngày liền.
**Cách làm:** thêm key kv-store riêng `daily`, logic ngày và streak viết thành hàm thuần, gauge cho phép cung sáng một phần, thêm một màn `/workout`. Lý do: không được đổi schema `progress`, và hàm thuần thì chạy thử bằng `node` được mà không cần sim.
**Đánh đổi:** mỗi cú phải bấm Pass/Miss, 100 lần chạm mỗi buổi. Workout cứng trong code, người dùng không sửa được.
**Không làm:**
- streak freeze;
- người dùng tự sửa số cú;
- daily thích nghi theo bài yếu;
- chấm bằng camera;
- đổi drill 01–06;
- đổi màu hay visual đã khoá.

## Bước

- [x] 1. Lát mỏng: tạo `src/pool-engine/daily.ts` (key `daily`, `schemaVersion: 1`, gồm `recordShot` và `useDaily`). Hero trong `src/app/(tabs)/(today)/index.tsx` hiện tổng cú hôm nay. Thêm một nút `__DEV__` gọi `recordShot`.
  - Xong khi: trên sim bấm nút 3 lần thì hero ra `03`. Kill app rồi mở lại vẫn là `03`.
  ✓ 2026-10-12 · sim sau terminate + openurl: caption "03 SHOTS TODAY" (scratchpad/d-after2-c.png)
- [x] 2. Workout 4 khối × mốc (10 / 3×10 / 3×10 / 3×10) cùng hàm thuần `dayKey`, `streak` và `progressOf`, đặt trong `src/pool-engine/workout.ts`, không import RN.
  - Xong khi: `node scratchpad/daily-check.ts` in `100`, rồi `streak` cho 3 trường hợp: liền 3 ngày → 3; hôm kia tập, hôm qua bỏ, hôm nay tập → 1; tập 2 ngày tới hôm qua, hôm nay chưa tập → 2.
  ✓ 2026-10-12 · `100` · streak 3 / 1 / 2 · 23:59→2026-10-12, 00:01→2026-10-13 · progressOf(55)=10/30/15/0
- [x] 3. Hàm `layout` trong `src/components/home/program-gauge.tsx` nhận `fill(seg): 0…1` thay cho `passed`. Vạch sáng theo tỉ lệ fill.
  - Xong khi: `npm run typecheck` exit 0, và screenshot sim với dữ liệu giả 10/30/15/0 cho cung 1 đầy, cung 2 đầy, cung 3 sáng nửa, cung 4 tắt.
  ✓ 2026-10-12 · typecheck exit 0 · scratchpad/g3-c.png: cung 1, 2 đầy; cung 3 vàng 6/11 vạch; cung 4 tắt
- [x] 4. Hero dùng dữ liệu daily (eyebrow, `x/100`, CTA mở khối đang dở). Con trỏ drill kế tiếp chuyển sang `src/components/home/program-bento.tsx`. (Cần 2 và 3 xong trước.)
  - Xong khi: screenshot Home hiện "Daily · Fundamentals", số khớp với store, bento vẫn hiện tiến độ program.
  ✓ 2026-10-12 17:11 · scratchpad/h4-s.png: "DAILY · FUNDAMENTALS", 03/100 + "03 PASSED" khớp 3 cú pass trong store; bento: ô "Up next · Straight-In" + Cue Ball Control, Fundamentals 0/1
- [x] 5. Màn `src/app/workout.tsx` hiện khối, mốc và bộ đếm, có Pass/Miss, tự sang mốc kế. Dùng lại `GoldAction` / `GraphiteAction` / `Scoreboard`.
  - Xong khi: trên sim đánh hết khối Stroke 10 cú thì màn tự sang "Stop · 1 diamond", và Home có cung 1 đầy.
  ✓ 2026-10-12 17:13 · sim: sau cú 10 màn ra "BLOCK 2 OF 4 · 10/100 SHOTS / Stop · 1 diamond"; Home 10/100, cung 1 sáng đủ, marker ở cung 2
- [x] 6. Gỡ nút dev ở bước 1, thêm streak vào hero.
  - Xong khi: `grep -n recordShot "src/app/(tabs)/(today)/index.tsx"` ra rỗng, `npm run typecheck` exit 0.
  ✓ 2026-10-12 · grep exit 1 (rỗng) · typecheck exit 0

## Vỡ ở đâu

- Ranh giới ngày theo giờ máy lệch khi người dùng tập qua nửa đêm, vì cú sau 0h rơi sang ngày mới. Kiểm bằng ca thứ tư trong `daily-check.ts`: 23:59 và 00:01 phải ra 2 dayKey khác nhau, và đó là hành vi đã chấp nhận.
- `index.tsx` đang lỗi `useTheme` theo `metro.log`, nên Home có thể crash trước khi làm gì. Kiểm bằng: mở Home trên sim trước bước 1, đọc lại `metro.log`.
- Đổi prop `passed` thành `fill` làm vỡ chỗ khác đang dùng `ProgramGauge`. Kiểm bằng: `grep -rn ProgramGauge src`, rồi `npm run typecheck`.

## Phát sinh

- Bấm 3 lần liền vào `GhostButton` chỉ ghi được 1 cú, giãn 1.5 s thì ăn đủ. Có thể do tap của sim quá nhanh, cũng có thể nút nuốt tap. Kiểm lại ở bước 5 với Pass/Miss, vì 100 lần bấm/buổi sẽ rất nhanh tay. Bước 5: 7 tap cách nhau ~1 s ăn đủ 7, chưa thử tap dồn dưới 0.3 s.
- Hero gọi `router.push("/workout" as Href)`: typed routes chưa có `/workout` nên phải ép kiểu. Bỏ cast khi bước 5 tạo route.
- Hero đổi props: bỏ `drill`, thêm `title`, `subtitle`, `onPress`. Gauge thêm `value` và `of` cho số giữa vòng.
- "Xong là" còn thiếu bằng chứng trên máy cho vế "sang ngày mới về 0": mới kiểm bằng `dayKey` trong `daily-check.ts`, chưa thấy trên sim. Cách rẻ nhất: mở app sáng 13/10, phải ra `00/100` và "1-day streak". Vì vậy plan chưa chuyển sang `xong/`.
- App mở xuyên nửa đêm thì hero vẫn giữ số hôm trước tới lần render sau, vì `useDaily` chỉ đọc `dayKey(new Date())` khi render. Chưa sửa.
