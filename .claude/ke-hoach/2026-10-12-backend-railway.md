# BE Railway: skeleton, auth Apple, sync tiến độ — 2026-10-12

**Xong là:** tick drill trên sim A, mở app trên sim B cùng Apple ID thấy đúng tiến độ đó, dữ liệu đi qua API Railway.
**Cách làm:** Hono + Drizzle + Postgres trong `server/`, deploy bằng `railway up`, theo `docs/quyet-dinh/2026-10-12-backend-railway.md`. Lý do: dùng chung type `PoolDrill` với app, không thêm vendor.
**Đánh đổi:** làm auth và sync trước IAP, nên hết plan này vẫn chưa thu được đồng nào. Đổi lại phần IAP sẽ đứng trên account đã chạy thật, và có thời gian ký Paid Apps Agreement.
**Không làm:** IAP, catalog pack, environment staging, web admin. Để cho plan IAP sau.

## Bước

- [ ] 1. Walking skeleton: `server/src/index.ts` có `/health` chạy `select 1`, tạo project Railway `pool-training` gồm Postgres và service `api` → xong khi: `curl` domain Railway của `api` ở `/health` trả 200, body có `"db":true`
- [ ] 2. Schema `server/src/db/schema.ts` gồm users, apple_tokens, refresh_tokens, drills, packs, pack_drills, entitlements, attempts, migrate ở pre-deploy → xong khi: `\dt` qua `railway connect Postgres` liệt kê đủ 8 bảng, và `npx drizzle-kit generate` chạy lại báo không có thay đổi
- [ ] 3. Đổi bundle id và bật `ios.usesAppleSignIn` trong `app.json` (cần anh chốt id) → xong khi: `npx expo prebuild --clean -p ios` xong, `grep -c applesignin ios/*/*.entitlements` ra 1
- [ ] 4. `POST /auth/apple`, `POST /auth/refresh` trong `server/src/routes/auth.ts`, nút login ở `src/app/settings.tsx` (cần 2, 3) → xong khi: login trên sim xong thì `select count(*) from users` ra 1; dùng lại refresh token đã xoay thì nhận 401
- [ ] 5. `DELETE /me` gọi Apple revoke trong `server/src/routes/me.ts`, nút xoá ở `src/app/settings.tsx` (cần 4) → xong khi: `users.deleted_at` khác null, và trong Settings của sim mục Sign in with Apple không còn app
- [ ] 6. Attempt có id UUIDv7, migrate `src/pool-engine/progress.ts` lên `SCHEMA_VERSION` 2, push/pull qua `server/src/routes/sync.ts` (cần 4) → xong khi: gửi một batch hai lần thì `count(*)` của attempts không đổi, và kịch bản sim A → sim B ở dòng "Xong là" chạy đúng

## Vỡ ở đâu

- Railway build với root `server/` thì không thấy `src/pool-engine/types.ts` → kiểm bằng: build log của bước 1. Lỗi resolve thì để root là repo và chỉ Dockerfile sang `server/Dockerfile`
- Migrate `progress.ts` v1 → v2 sai thì user mất tiến độ cũ → kiểm bằng: chạy bản hiện tại, tập 3 drill, cài bản mới, 3 drill vẫn còn
- Working tree đang dở 10 file editor Swift → kiểm bằng: `git diff --cached --stat` trước mỗi commit BE chỉ chứa `server/`, `app.json`, `src/` của bước đó

## Phát sinh
