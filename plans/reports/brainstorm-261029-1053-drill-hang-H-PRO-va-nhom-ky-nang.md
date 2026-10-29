# Drill theo thang H → PRO và 7 nhóm kỹ năng — brainstorm 2026-10-29 10:53

Đề xuất: không viết lại hệ drill. Thêm 5 trường vào `PoolDrill` (đều optional), 2 bảng tra trung tâm, mở rộng `drill-lint` thành bộ test dữ liệu. Giữ nguyên 124 drill, id, `ShotPhysics`, `DrillShotPlanner`, màn drill.

## Hiện trạng (đã kiểm)

| Mục | Số đo | Lấy từ |
|---|---|---|
| Stack | Expo 57 + RN 0.86, native module Swift. 27 file `import SwiftUI`, **0 file SpriteKit** | `grep` trong `modules/` |
| Số drill | 124 file trong `src/pool-engine/drills/` | `ls` |
| Phân hạng đang có | 6 giai đoạn, nhãn SABO `K–I … C`, `stageOf` suy từ `difficulty` 1–5 cộng bảng `OVERRIDE` | `src/pool-engine/stages.ts` |
| Chủ đề | 12 topic gộp 30 skill, chưa lên UI. Tab Drills vẫn liệt kê theo 6 giai đoạn | `topics.ts`, `src/app/(tabs)/drills/index.tsx` |
| drill-lint | exit 1: **183 vi phạm, 58 drill đạt** | `sh scripts/drill-lint/run.sh` hôm nay |
| Audit hai luật (sim) | 123/124 đạt; 31 dùng replay video | `audit-261029-0053-full-drill-hai-luat.md` |
| Drill có câu "Checked in simulation" hoặc "Path drawn" | 65 | `grep` subtitle |
| Drill đo trên bàn thật | **0** có bằng chứng | không file nào ghi |
| Test runner JS | không có (không jest, không vitest). Kiểm dữ liệu chỉ có `drill-lint` (node) và các harness Swift | `package.json`, `scripts/` |
| Lưu kết quả tập | SQLite `attempts.drill_id TEXT` | `attempt-log.ts:16` |

Phân bổ vi phạm lint: thiếu nguồn đường bi cái 54, thiếu câu why 57, thiếu lực m/s 45, cú vẽ tay thiếu subtitle 9, nhiều bi mà một cú 4, chuỗi không pot đủ bi 5. Gần như toàn bộ nằm ở drill dạng `rounds` cũ.

Nguồn drill theo docblock (đếm bằng regex, **ước lượng**, cần đọc tay để chốt): 21 nhắc Dr. Dave, 37 nhắc nguồn có tên khác (BU, Jewett, PPC, forum…), 23 ghi rõ tự soạn, 44 không nhận ra nguồn. Nguồn chỉ nằm trong comment, không có trường dữ liệu nào để lọc hay kiểm.

## Vấn đề

1. **Không có trường nguồn và trạng thái kiểm chứng.** "Checked in simulation" là chuỗi trong subtitle. Không có cách máy đọc để biết bài nào đo bàn thật, bài nào tự soạn, bài nào đường vẽ tay.
2. **Kick sai ngữ nghĩa và thiếu dữ liệu băng.** 4 drill kick (64, 65, 89, 111). 89 chấm bằng `passCondition: pocketed` trong khi đạt là chạm hợp lệ. Thứ tự băng chỉ ngầm trong mảng `points` của `expectedCuePath`, không có danh sách băng để lint so. Không có bài Mirror, Diamond, Plus hay Corner-5 riêng; 111 là hệ trừ hai băng.
3. **Engine băng chưa hiệu chỉnh.** `railRestitution 0.82`, `railSinE 0.27`, `railMu 0.14` lấy từ `docs/research/bi-cai-xoay.html`, plan hiệu chỉnh `2026-10-18-hieu-chinh-engine.md` mới 1/6 bước. Kick 2–4 băng chạy trên engine này **không** đủ để nói "đúng vật lý bàn thật".
4. **Thang hạng mới khác thang đang dùng.** Code hiện dùng nhãn SABO (C là đỉnh, 1900+). Thang anh đưa có 12 nấc, C− / C+ nằm giữa, trên C còn B, A, PRO. Report `research-261027-2246` từng chốt "chỉ hiện một thang". Thang mới vẫn một chiều (H thấp nhất), nên giữ được luật đó nếu bỏ nhãn SABO khỏi UI.
5. **Thiếu điều kiện tăng độ khó.** `DifficultyModifiers` có khung (`zoneScale`, `cueDistanceDiamonds`) nhưng chưa drill nào điền tiêu chí lên bài.
6. **Nhóm kỹ năng anh yêu cầu không khớp 12 topic.** Anh muốn 7 nhóm: Fundamentals, Cue Ball Control, Position Play, Kick, Bank, Spin, Advanced. Topic hiện có tách Break, Safety, Jump & Massé, Tests riêng.

Phần "kế thừa trạng thái cú trước" đã có: `shots` chạy chuỗi, cú 2 đánh từ chỗ bi cái dừng thật (`docs/chuan-drill.md` §2). Không cần làm lại.

## Hợp đồng

- **Outcome:** Tab Drills lọc được theo 12 hạng H → PRO và 7 nhóm kỹ năng. Mỗi drill hiện hạng, nhóm, nguồn, trạng thái kiểm chứng (sim / vẽ tay / video / bàn thật / chưa xác minh), điều kiện đạt, tiêu chí lên bài khó hơn. Kick khai báo thứ tự băng và được lint so với đường vẽ. Có bài cho 4 hệ kick lấy từ trang bank-kick của Dr. Dave.
- **Constraints:**
  - Không đổi id drill, không xoá drill. `attempts.drill_id` là khoá, đổi id là mất lịch sử tập.
  - Trường mới đều optional. Drill cũ vẫn chạy khi chưa điền.
  - Giữ SwiftUI renderer, `ShotPhysics`, `DrillShotPlanner`. Không có SpriteKit để giữ.
  - Không thiết kế lại UI (memory). Bộ lọc ghép từ `Section`, `DrillCard` và control có sẵn.
  - Không tự sinh góc, đường bi hay rate. Bài không có số engine hoặc nguồn thì `verification: 'unverified'`.
  - Không gán `verification: 'table'` khi chưa có file bằng chứng (video hoặc phiếu đo).
  - Luật drill trong `CLAUDE.md` đứng trên mọi thứ: thứ tự tăng dần, đường vẽ lệch ≤ 2.25", zone khớp.
- **Non-goals:**
  - Hiệu chỉnh engine băng (plan 2026-10-18 riêng).
  - Sửa hết 183 vi phạm lint cũ. Việc này cần số engine cho ~60 drill `rounds`, là plan riêng; đợt này chỉ không thêm vi phạm mới.
  - Khoá bài theo hạng, chấm hạng người chơi, đồng bộ server.
  - Đổi thang thành chứng nhận chính thức.
- **Acceptance:**
  - `node --test scripts/drill-lint/` chạy được, gồm test: mỗi drill có `level` và `group`; kick có `rails` khớp số điểm gãy của `expectedCuePath`; `verification: 'table'` phải có `evidence`; mọi drill có nguồn hoặc `source.kind: 'selfAuthored'`; số bi tăng dần (đã có).
  - `drill-lint` không tăng quá 183 vi phạm, số drill đạt không giảm dưới 58.
  - `npx tsc --noEmit`, `npx expo lint` exit 0.
  - Audit hai luật chạy lại với `ShotPhysics` và `DrillShotPlanner` thật, không bài nào rớt mới so với 123/124.
  - Simulator: lọc hạng `C−` và nhóm `Kick` ra đúng danh sách; mở một bài kick mới thấy nhãn "Path drawn, not simulated."
  - PR trên branch mới, mô tả ghi rõ bài nào chưa xác minh.

## Ba hướng

| Hướng | Làm gì | Giả định chịu lực | Vỡ đầu tiên khi |
|---|---|---|---|
| **A. Thêm trường + bảng tra** (khuyến nghị) | `levels.ts` map id → hạng, `groups.ts` map skill → nhóm. Trường per-drill chỉ cho sự thật của riêng bài: `source`, `verification`, `rails`, `kickSystem`, `progression` | Hạng là quyết định giáo trình, đổi theo cả bộ, nên nằm một chỗ dễ duyệt | Một bài cần hạng khác nhau theo round. Khi đó thêm `level` vào `DrillRound`, vẫn additive |
| B. Điền tay 124 file | Mọi trường, kể cả `level`, `group`, nằm trong file drill | Người soạn bài mới nhớ điền | Đổi lại giáo trình phải sửa hàng chục file; diff khó review |
| C. Schema v2 + migration | `PoolDrillV2`, chuyển cả 124 bài, bỏ `stages.ts` | Có thời gian kiểm lại từng bài trên engine | Một bài chuyển sai là vỡ luật drill; cửa một chiều với dữ liệu tập |

So trường hợp xấu nhất: A sai thì sửa một bảng. B sai thì rải rác 124 file. C sai thì phải revert cả bộ dữ liệu.

**Better approaches:** none. Hướng anh nêu ("cấu trúc mở rộng được", "không xoá dữ liệu cũ khi chưa có migration") chính là A; khác duy nhất là em đề nghị không đụng file drill cho hạng và nhóm.

## Kiến trúc đề xuất (hướng A)

```ts
// types.ts, thêm, không đổi gì cũ
export type TrainingLevel = 'H' | 'G' | 'F' | 'E' | 'D' | 'C-' | 'C+' | 'B-' | 'B+' | 'A-' | 'A+' | 'PRO';
export type SkillGroup = 'fundamentals' | 'cueBallControl' | 'positionPlay' | 'kick' | 'bank' | 'spin' | 'advanced';
export type RailId = 'left' | 'right' | 'foot' | 'head';
export type DrillSource =
  | { kind: 'drdave'; url: string; ref?: string }
  | { kind: 'named'; name: string; url?: string }
  | { kind: 'selfAuthored'; note: string };
export type Verification =
  | { kind: 'unverified'; reason: string }
  | { kind: 'simulated'; harness: string }        // harness + ShotPhysics
  | { kind: 'drawn'; basis: string }              // hệ diamond, gương...
  | { kind: 'video'; file: string }
  | { kind: 'table'; evidence: string; date: string };

// PoolDrill thêm optional:
source?: DrillSource;
verification?: Verification;
rails?: RailId[];                 // kick/bank: thứ tự băng bi cái (kick) hoặc bi mục tiêu (bank)
kickSystem?: 'mirror' | 'diamond' | 'plus' | 'corner5';
progression?: { pass: string; harder: string };  // điều kiện qua, tăng khó thế nào
// PassCondition thêm: { kind: 'legalHit'; required: number }
```

- **Hạng:** `levels.ts` chia mỗi giai đoạn hiện tại thành hai hạng liền nhau, theo vị trí trong `CURRICULUM` rồi `difficulty`: giai đoạn 1 → H, G; 2 → F, E; 3 → D, C−; 4 → C+, B−; 5 → B+, A−; 6 → A+, PRO. Drill ngoài curriculum lấy theo `stageOf`. Đây là đề xuất giáo trình, chưa có nguồn quy đổi, ghi như vậy trong comment. `stages.ts` giữ nguyên để Home và tiến độ không vỡ.
- **Nhóm:** map từ `DrillSkill`. Fundamentals: `straightStroke, spotShot, lineUp, stop, follow, draw, cutAngle, railCut`. Cue Ball Control: `followDistance, drawDistance, drawAngle, tangent, naturalAngle, speedControl, threePositions`. Position Play: `oneRail, noRail, wagonWheel, correctSide, pattern, runout`. Kick: `kick`. Bank: `bank`. Spin: `english`, `combo` đi vào Fundamentals. Advanced: `break, safety, jump, masse, test`. Stun không có skill riêng, nằm trong `stop`/`tangent`.
- **Kick:** lint so `rails.length` với số điểm gãy trong `expectedCuePath` và kiểm mỗi điểm gãy nằm trên đúng băng theo thứ tự. Đây là kiểm hình học trên dữ liệu, không phải kiểm vật lý. Bài 4 hệ mới lấy công thức từ trang bank-kick của Dr. Dave, đường vẽ theo công thức hệ, subtitle `Path drawn, not simulated.`, `verification.kind: 'drawn'`. Chạy thử trên `ShotPhysics` và ghi lệch bao nhiêu, không ép engine khớp.
- **Test:** dùng `node:test` có sẵn trong Node, không thêm dependency. File test nằm cạnh `lint.js`, đọc output tsc mà `run.sh` đã biên dịch.
- **Lọc:** tab Drills thêm hai hàng chọn hạng và nhóm phía trên danh sách, lọc trên `DRILLS`. Cụ thể control nào phải xem component có sẵn trong `src/components/` trước, chưa xem.

## 80% cố tình bỏ

- 183 vi phạm lint cũ, ~60 drill `rounds` thiếu why và m/s: để plan riêng có harness.
- Chuyển 44 drill "không nhận ra nguồn" sang `source` có thật: đợt này chỉ điền drill đọc ra nguồn trong docblock; phần còn lại gán `unverified` kèm lý do "chưa truy nguồn".
- Kick 3 và 4 băng trên engine: chưa có hiệu chỉnh băng, kết quả sim không đáng tin, nên chỉ vẽ theo hệ.
- Escape: gộp vào kick một băng và safety có sẵn, không làm bài riêng.

## Rủi ro và việc phải quyết trước khi code

- **Working tree đang bẩn:** 87 file sửa chưa commit trên `feat/pool-editor`, thuộc plan `2026-10-29-sua-drill-va-bo-bi` (6/7) và vài plan khác. Tạo branch mới lúc này sẽ kéo cả đống đó vào PR.
- **Origin có hai nhánh lạ chưa fetch:** `dependabot/npm_and_yarn/multi-e89d889331` và `feat/minimal-first-shot-onboarding` (thấy qua `git fetch --dry-run`). Origin từng bị force-push mã độc ngày 2026-10-16. Phải kiểm hai nhánh này trước khi push.
- **Trùng plan cũ:** `plans/261027-2246-drills-theo-chu-de-hang` (12 topic × hạng SABO, pending) bị hướng này thay thế. Nên đánh dấu superseded thay vì chạy song song.
- **Hạng là phán đoán giáo trình,** không phải số đo. Chia giai đoạn thành hai hạng có thể lệch cảm nhận người chơi thật; cách rẻ nhất để gỡ là để anh duyệt bảng `levels.ts` trước khi lên UI.

## Câu hỏi còn mở

1. 87 file chưa commit: commit chúng trên `feat/pool-editor` trước rồi mới tách branch, hay để em stash?
2. PR nhắm `main` (đang sau `feat/pool-editor` 34 commit) hay nhắm `feat/pool-editor`?
3. Bỏ hẳn nhãn SABO khỏi UI, chỉ hiện H → PRO? Em đề nghị bỏ, theo luật "một thang" đã chốt 2026-10-27.
