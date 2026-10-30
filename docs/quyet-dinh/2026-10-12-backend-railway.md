# BE pool-training: TS monolith trên Railway, tự verify IAP — 2026-10-12

## Câu hỏi
BE trên Railway nên dựng thế nào để có login Apple, sync tiến độ và bán drill qua IAP?

## Bối cảnh
Tiến độ hiện nằm trong một key JSON ở `expo-sqlite/kv-store` (`src/pool-engine/progress.ts`), 17 drill bundle trong `src/pool-engine/drills/`. `PoolDrill` là data JSON thuần nên đẩy lên `jsonb` được, không đổi model.
Anh muốn bán bài tập, nên đã bỏ hướng CloudKit: có giao dịch thì server phải giữ ai mua gì. Nội dung số bắt buộc thu qua IAP (guideline 3.1.1). Có account thì phải có xoá account trong app và revoke token Apple (5.1.1(v)).
Ràng buộc: Railway + Postgres, chỉ iOS, một người nuôi, app viết TS. Giả định: v1 anh tự bán pack mua một lần, marketplace HLV để sau.
Ngoài phạm vi: payout HLV, Android, web admin, subscription.

## Các hướng đã cân
- (a) TS monolith Hono + Drizzle + Postgres, verify Apple bằng `jose`, IAP bằng `@apple/app-store-server-library`: chọn.
- (b) Như (a) nhưng IAP qua RevenueCat: hoãn, thừa với pack mua một lần, thêm vendor và độ trễ webhook.
- (c) PocketBase (Go + SQLite): loại, một volume một instance, không giúp gì phần IAP.
- (d) Swift/Vapor: loại, phải nhân đôi schema drill vốn nằm ở TS.

## Chọn
(a). Code ở `pool-training/server/`, import thẳng `src/pool-engine/types.ts`.
- Auth: `POST /auth/apple` (identityToken, authorizationCode, nonce) trả access JWT 15 phút + refresh token xoay vòng, DB chỉ lưu hash. `DELETE /me` revoke Apple rồi soft delete.
- Catalog: `GET /catalog` có ETag. Drill free vẫn bundle trong app để chạy offline. `GET /packs/:id/drills` trả 403 nếu chưa có quyền.
- IAP: `POST /iap/transactions` verify JWS rồi ghi entitlement. `POST /iap/notifications` nhận App Store Server Notifications V2 (bắt REFUND).
- Sync: `POST /sync/attempts` batch, id UUIDv7 do client sinh, `ON CONFLICT DO NOTHING`. `GET /sync/attempts?since=<cursor>`.
- Railway: service api + Postgres qua private network, pre-deploy `drizzle-kit migrate`, healthcheck `/health`, environment `staging` (App Store sandbox) và `production`.
- Entitlement key theo `originalTransactionId` của Apple, nên chuyển sang RevenueCat sau này vẫn là cửa hai chiều. Bảng `drills` có sẵn `author_id` để mở marketplace không phải migrate.
Đánh đổi: tự viết phần verify IAP, đổi lại không phụ thuộc vendor và không mất phần trăm doanh thu.

## Sẽ đổi ý nếu
- Anh chốt subscription có trial hoặc intro offer: thay module IAP bằng RevenueCat, giữ nguyên auth, catalog, sync.
- Có kế hoạch Android trong 6 tháng: cũng chuyển IAP sang RevenueCat.
- Mở marketplace HLV: thêm bảng payout và luồng kiểm duyệt, quyết định lại riêng.

## Bước đi
1. Đổi bundle id khỏi `com.anonymous.pool-training`, vì IAP product và Sign in with Apple đều gắn vào App ID.
2. Dựng `server/` (Hono + Drizzle), `/health`, deploy lên Railway với Postgres. Điểm kiểm tra: `curl /health` trên domain Railway trả 200 và ping được DB.
3. Schema + migration: users, apple_tokens, refresh_tokens, packs, pack_drills, drills, entitlements, attempts.
4. Auth Apple + `DELETE /me` có revoke. Điểm kiểm tra: login thật từ dev build, xoá account xong thì Apple ID không còn liệt kê app trong "Sign in with Apple".
5. Sync attempts, app đẩy và kéo, local vẫn là nguồn chính khi offline.
6. IAP: product sandbox, verify JWS, notification REFUND thu hồi quyền.

## Cập nhật 2026-10-30
- Thu nhỏ v1 còn 7 bảng: users, apple_tokens, refresh_tokens, attempts, shot_results, clip_sessions, clip_strokes. Bỏ packs, pack_drills, drills, entitlements cho tới plan IAP.
- Cursor sync là `seq bigserial` do server cấp, không dùng `at` của client, vì batch offline tới muộn sẽ lọt qua cursor của máy khác.
- Không sync KV `progress`, `daily`, `onboarding`, `firstUse`; máy dựng lại `progress` từ log. Không đẩy video, `clip_uri` ở lại máy.
- Premium sau này là bảng `entitlements` riêng, trạng thái tính từ giao dịch Apple. Không thêm cột `is_premium` vào `users`.
- Login: Sign in with Apple ngay từ đầu, không qua chế độ ẩn danh. Bundle id `com.chay.pooltraining`, team `MPPZK7HR4Z`.
- Deploy bằng `railway up` từ máy, chưa nối GitHub auto-deploy.
