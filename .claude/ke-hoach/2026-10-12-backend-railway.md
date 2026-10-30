# BE Railway nhẹ: Sign in with Apple, sync lịch sử tập — 2026-10-30

**Xong là:** tập vài drill trên iPhone, xoá app, cài lại, login cùng Apple ID thì drill đã pass vẫn hiện passed, dữ liệu kéo từ API Railway.
**Cách làm:** Hono + Drizzle trong `server/`, Postgres của project Railway `pool-training`, deploy bằng `railway up` — vì một người nuôi, dùng chung type TS với app, không nối GitHub khi origin chưa kiểm sạch.
**Đánh đổi:** chưa login thì không sync gì, không có chế độ ẩn danh. Đổi bundle id sang `com.chay.pooltraining` là app mới trên máy, tiến độ đang nằm ở app `com.anonymous.pool-training` không theo sang.
**Không làm:** IAP, bảng packs/drills/entitlements, cột premium, environment staging, upload video clip, sync KV `progress`/`daily`/`onboarding`.

## Bước

- [x] 1. Walking skeleton: `server/src/index.ts` có `/health` chạy `select 1`, tạo service `api` trong project Railway `pool-training`, nối `DATABASE_URL` qua private network → xong khi: `curl` domain public của service `api` ở `/health` trả 200, body có `"db":true`
  ✓ 2026-10-30 09:42 · `curl https://api-production-f9b85.up.railway.app/health` → `{"ok":true,"db":true} 200`
- [x] 2. Schema `server/src/db/schema.ts` 7 bảng: users (`apple_sub` unique), apple_tokens, refresh_tokens (chỉ hash), attempts, shot_results, clip_sessions (không có `clip_uri`), clip_strokes; bảng sync có `user_id` và `seq bigserial`; migrate ở pre-deploy (cần 1) → xong khi: `\dt` qua `railway connect Postgres` ra đúng 7 bảng, `npx drizzle-kit generate` chạy lại báo không có thay đổi
  ✓ 2026-10-30 10:16 · `\dt` → `(7 rows)` apple_tokens…users; `drizzle-kit generate` → `No schema changes, nothing to migrate`
- [ ] 3. `app.json`: `bundleIdentifier` thành `com.chay.pooltraining`, `appleTeamId` `MPPZK7HR4Z`, `usesAppleSignIn: true`; `npx expo install expo-apple-authentication expo-secure-store` → xong khi: `npx expo prebuild --clean -p ios` xong, `grep -c applesignin ios/*/*.entitlements` ra 1, build lên iPhone `00008150-000C04892E99401C` mở được app
- [ ] 4. `POST /auth/apple`, `POST /auth/refresh` trong `server/src/routes/auth.ts`, nút login trong `src/app/settings.tsx`, token cất ở SecureStore (cần 2, 3) → xong khi: login trên iPhone xong thì `select count(*) from users where apple_sub is not null` ra 1; gửi lại refresh token đã xoay nhận 401
- [ ] 5. Đẩy lên: `POST /sync` nhận batch bốn bảng trong `server/src/routes/sync.ts`, client `src/pool-engine/sync.ts` đẩy dòng có `at` mới hơn lần đẩy trước (cần 4) → xong khi: gửi cùng một batch hai lần thì `count(*)` của attempts không đổi
- [ ] 6. Kéo về: `GET /sync?since=<seq>` trả dòng có `seq` lớn hơn cursor, client `INSERT OR IGNORE` vào SQLite local rồi dựng lại `progress` (cần 5) → xong khi: kịch bản ở dòng "Xong là" chạy đúng trên iPhone
- [ ] 7. `DELETE /me` gọi Apple revoke rồi đặt `deleted_at` trong `server/src/routes/me.ts`, nút xoá account trong `src/app/settings.tsx`; anh tự tạo key Sign in with Apple và tải `.p8` vào biến Railway (cần 4) → xong khi: `users.deleted_at` khác null, và Settings › Apple ID › Sign in with Apple trên iPhone không còn Pool Training

## Vỡ ở đâu

- Railway build với root `server/` không thấy `src/pool-engine/types.ts` → kiểm bằng: build log bước 1; lỗi resolve thì để root là repo, trỏ `server/Dockerfile`
- `progress` không dựng lại được từ `attempts` (attempt log chỉ có từ 14/10, `void` huỷ cú) → kiểm bằng: trước bước 6, so `best` trong KV với kết quả tính từ bảng attempts trên chính iPhone
- `identityToken` có `aud` khác bundle id nên server từ chối → kiểm bằng: log `aud` lúc verify ở bước 4, phải là `com.chay.pooltraining`

## Phát sinh

- 2026-10-30: App ID `com.chay.pooltraining` đã đăng ký trên team `MPPZK7HR4Z` (Individual, trả phí tới 30/10/2027), bật Sign In with Apple. Project Railway `pool-training` có Postgres chạy, chưa có bảng.
- 2026-10-30: service `api` tạo bằng `railway add`, `DATABASE_URL=${{Postgres.DATABASE_URL}}` (host `postgres.railway.internal`), domain `api-production-f9b85.up.railway.app`. Railpack build bằng `node@24.22.0`, chạy thẳng `.ts`, không có bước build.
- 2026-10-30: Railway CLI báo `railway.json` (Config as Code) đã deprecated, chỉ chạy tới 2026-12-01; phải chuyển sang `.railway/railway.ts` (`railway config migrate`) trước ngày đó.
- 2026-10-30: thêm `exclude: ["node_modules","server"]` vào `tsconfig.json` gốc để tsc của Expo không quét `server/`. Rủi ro "không thấy `src/pool-engine/types.ts`" chưa kiểm được ở bước 1 vì server chưa import type chung.
- 2026-10-30 09:56: đổi tên service `api` thành `pool-training-api`, domain thành `pool-training-api.up.railway.app` (domain cũ `api-production-f9b85` trả 404). `curl https://pool-training-api.up.railway.app/health` → `{"ok":true,"db":true} 200`. Các bước sau đọc "service `api`" là service này.
- 2026-10-30: `railway connect Postgres` đi qua SSH tunnel vì Postgres không có TCP proxy. Đã tạo `~/.ssh/id_ed25519` (không passphrase) và đăng ký với Railway bằng `railway ssh keys add`. Backup trước migrate bằng `railway ssh -s Postgres -- pg_dump`, lúc đó DB có 0 bảng.
- 2026-10-30: Railway chưa từng đọc `server/railway.json` (`railwayConfigFile: null`), nên healthcheck của bước 1 thật ra chưa được áp. `railway environment edit` báo "No changes to apply", phải đặt `preDeployCommand ["npm run migrate"]`, `healthcheckPath /health`, `healthcheckTimeout 60` bằng mutation `serviceInstanceUpdate` qua `railway api`, rồi xoá `railway.json`. Cấu hình deploy giờ nằm trên Railway, không có trong repo. Việc chuyển sang `.railway/railway.ts` vẫn còn đó nhưng không bị hạn 2026-12-01 nữa.
- 2026-10-30: khoá chính của bốn bảng sync là `(user_id, id)` để người này không chiếm được id của người khác.
- 2026-10-30: `clip_sessions` phía client có UPDATE `baseline` và DELETE, không khớp với kiểu sync chỉ insert của bước 5. Bước 5 cần chốt cách xử lý.
