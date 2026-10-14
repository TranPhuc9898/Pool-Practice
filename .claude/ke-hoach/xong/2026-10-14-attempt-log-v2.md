# Attempt log v2: mỗi cú có timestamp — 2026-10-14

**Xong là:** mỗi lần bấm Pass/Miss trong drill ghi một dòng vào bảng SQLite `attempts` (`id` UUIDv7, `drill_id`, `result`, `at`, `session_id`). Kill app mở lại thì số dòng giữ nguyên, `Best x/10` trên drill card cũng không đổi.
**Cách làm:** bảng SQLite riêng (`openDatabaseSync`), chỉ thêm dòng, ghi kèm trong `recordAttempt`. Store `progress` v1 giữ nguyên, chỉ thêm field optional `sessionId`. Lý do: một key JSON ghi lại toàn bộ mỗi cú sẽ phình tới cỡ MB sau một năm, còn để nguyên v1 thì không phải migrate và vẫn quay đầu được.
**Đánh đổi:**
- Dữ liệu v1 không có timestamp nên không backfill. Trend chỉ tính từ hôm nay.
- UUIDv7 sinh bằng `Math.random`, không thêm `expo-crypto` để khỏi rebuild dev client. Chấp nhận 74 bit ngẫu nhiên không đạt chuẩn crypto.
**Không làm:**
- ghi cú workout của store `daily` vào log;
- hook đọc log và UI trend (thuộc plan bước 4 trong quyết định);
- sync lên server;
- tách pot với vị trí bi cái, ghi foul;
- đổi `schemaVersion` của `progress`.

## Bước

- [x] 1. Lát mỏng: tạo `src/pool-engine/attempt-log.ts` (mở DB, `CREATE TABLE IF NOT EXISTS attempts`, hàm `logAttempt`, id tạm `String(Date.now())`), gọi từ `recordAttempt` trong `src/pool-engine/progress.ts`.
  - Xong khi: trên sim mở drill 02, bấm Start rồi Pass 1 lần. `sqlite3 <db> 'select drill_id, result, at from attempts'` ra `02|pass|<epoch ms trong 5 phút gần nhất>`.
  ✓ 2026-10-14 · `02|pass|1791968321697`, giờ máy 1791968323000. DB ở `Documents/SQLite/attempts.db`. Có thêm dòng `02|fail` do tap lệch, xem Phát sinh
- [x] 2. UUIDv7 viết thành hàm thuần trong `src/pool-engine/uuid7.ts`, không import RN.
  - Xong khi: `node scratchpad/uuid7-check.ts` in `1000 unique · sorted true · v7 true`. Sorted nghĩa là thứ tự chuỗi trùng thứ tự sinh, kể cả 1000 id sinh trong cùng 1 ms.
  ✓ 2026-10-14 · `1000 unique · sorted true · v7 true` (1000 id cùng một `now`)
- [x] 3. Dùng `uuid7` làm `id` trong `attempt-log.ts` (cần 2 xong trước).
  - Xong khi: bấm Pass 1 cú nữa, rồi `select id from attempts order by at desc limit 1` ra chuỗi 36 ký tự có ký tự thứ 15 là `7`.
  ✓ 2026-10-14 · `01a139a3-38a6-7000-ab2c-4ce05d633e93` len=36 char15=7
- [x] 4. `startDrill` sinh `sessionId` và lưu vào `DrillProgress` (optional), `recordAttempt` truyền nó cho `logAttempt`. Sửa trong `src/pool-engine/progress.ts`.
  - Xong khi: start drill 02, Pass 2 cú, Reset, start lại, Pass 1 cú. `select session_id, count(*) from attempts where session_id is not null group by 1` ra đúng 2 nhóm, đếm 2 và 1.
  ✓ 2026-10-14 · `01a139a4-9c4f-…|2` và `01a139a5-25ad-…|1`
- [x] 5. Kiểm sống qua kill app, không có code mới.
  - Xong khi: đếm `select count(*)` trước và sau `xcrun simctl terminate` cộng `openurl` ra cùng số. Tab Drills vẫn hiện `Best` của drill 02 như screenshot chụp trước khi kill.
  ✓ 2026-10-14 · count 6 → 6, drill 02 `Best 2/10` trước và sau kill
- [x] 6. Dọn.
  - Xong khi: `npm run typecheck` exit 0, và `grep -n "Date.now()" src/pool-engine/attempt-log.ts` chỉ còn ở cột `at`.
  ✓ 2026-10-14 · `tsc --noEmit` exit=0; grep ra đúng một dòng `23:  const at = Date.now();`

## Vỡ ở đâu

- DB không nằm ở `Documents/SQLite/` trong container sim. Kiểm bằng: `find "$(xcrun simctl get_app_container E68CC13C-926C-47B9-BA3D-451EB3E74443 com.anonymous.pool-training data)" -name '*.db'`.
- Ghi SQLite đồng bộ mỗi tap làm nút Pass bị trễ. Kiểm bằng: tap 10 cú cách nhau 0.5 s, phải ra đủ 10 dòng và Scoreboard hiện 10.
- Thêm field optional vào v1 làm `load` trả về trống. Kiểm bằng: bước 5, `Best` cũ vẫn còn.

## Phát sinh

- Bước 1: tap ở x=201 pt, nằm giữa Pass và Miss, ghi ra `fail`. Có thể Miss có hitSlop lấn sang khe giữa hai nút, chưa kiểm. Dòng `fail` đó vẫn còn trong DB sim.
- Hai dòng đầu trong DB sim mang id tạm `String(Date.now())` của bước 1, không phải UUIDv7. Chỉ là dữ liệu dev, app thật chưa ship log nên không ảnh hưởng ai. Muốn sạch thì xoá DB sim.
- Screenshot sim hay trễ một nhịp sau tap: chụp lại lần hai trước khi kết luận tap trượt.
