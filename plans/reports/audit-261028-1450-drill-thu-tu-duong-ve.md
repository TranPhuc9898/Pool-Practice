# Audit drill: thứ tự đánh và đường vẽ — 2026-10-28

Phạm vi: 124 drill, 399 trường hợp drill×round. Mỗi trường hợp được mô phỏng bằng harness Swift dùng chính `ShotPhysics` và `DrillShotPlanner` của app, dispatch giống `PoolEditorView` onChange playRev.
Harness nằm ở scratchpad (`audit/main.swift`, `prep.js`, `summ.js`). Không sửa file nào của dự án.

Luật dùng để chấm:
1. **Thứ tự**: đánh đúng bi, đúng lỗ, theo đúng thứ tự, không ăn bừa.
2. **Đường vẽ**: đường bi mục tiêu hoặc bi cái đã vẽ phải trùng với đường bi chạy thật khi bấm Play.

Ngưỡng lệch: 2.25" (khoảng 1 đường kính bi). Đã trừ vùng bắt của lỗ ở đoạn cuối.

## 1. Drill 66 Cross-Side Bank (ảnh anh gửi)

| | r0 | r1 | r2 |
|---|---|---|---|
| Vào đúng lỗ | ✅ | ✅ | ✅ |
| Lực thẻ / lực thật đánh | 1.8 / **2.34** | 1.8 / **2.34** | 1.8 / **2.34** |
| Hướng ngắm lệch so với đường vẽ | 1.0° | 1.2° | 1.7° |
| Điểm chạm băng lệch so với hình vẽ | 1.5" | 1.9" | 2.7" |
| Đường bank lệch tối đa | 2.1" | 2.6" | 3.6" |
| Preview trước cú (1.8 m/s) | **không vào lỗ** | không vào | không vào |
| Preview so với đường thật | 5.3" | 6.7" | 9.3" |

Kết luận: không vi phạm luật 1. **Vi phạm luật 2**. Ở 1.8 m/s planner không tìm được cú vào lỗ nên tự nâng lên 2.34 m/s và xoay hướng ngắm khoảng 1–2°.
Hậu quả:
- Thẻ vẫn ghi "Medium 1.8 m/s" và "Straight in".
- Preview vẽ đường ở 1.8 m/s nên bi không vào lỗ.
- Bi chạm băng xa dần điểm vẽ khi lên r1, r2.

## 2. Luật 1 — thứ tự, đúng bi, đúng lỗ

### 2a. Data: thứ tự cú không tăng dần
Các drill có thứ tự cú không tăng dần: 13, 16, 18, 19, 20, 40, 42, 43, 117, 118, 119, 129, 130.
- Một phần là cố ý: drill railCut, layout ladder, và layout PPC đánh từ số lớn xuống số nhỏ. Cần đối chiếu với `docs/chuan-drill.md` mục 4 trước khi coi là lỗi.
- 123 là drill speedControl, được miễn luật này.
- Round: 34 lặp lại 1–5 hai lần (có vẻ cố ý). 120 có round trùng và round null. 31 null ở round 7, bị chặn.

### 2b. App chấm "OK" dù đánh sai (đã kiểm bằng mô phỏng)
| Drill | Hiện tượng |
|---|---|
| Break 29, 30, 70, 71, 95 | Bi 1 không vào, bi 7 hoặc bi khác vào, app vẫn chấm đạt |
| Test 74, 75, 76, 78, 79, 80, 81 | `racked()` nhận layout là rack nên đánh phá bàn ở 7.8 m/s thay vì đánh cú test |
| Combo 47 | Planner đánh bi 2 trước, cả hai bi rơi |
| Kick 64, 89, 111 | Bi mục tiêu không vào lỗ, hoặc bi 9 bị chạm |
| Jump 72 | Bi cái đi xuyên qua bi 2 |
| Safety 93 r0 | Bi 8 rơi lỗ |
| Rack 48 Frozen Pair | Thẻ gọi bi 2 vào headLeft nhưng bi 1 vào, app chấm OK |

**Đính chính sau khi siết (cùng ngày).**
- Test 74–81 là break-and-run (PDF BU Exam IV), nên `racked()` đúng. Break được miễn luật thứ tự theo `docs/chuan-drill.md` dòng 39.
- 48 là cặp bi sát: đánh bi 2 để đẩy bi 1 vào lỗ, đúng ý drill.
- Đã siết:
  - `potted` chỉ tính khi bi rơi đúng lỗ.
  - Thêm `clean()`: đúng một bi rơi, bi cái không rơi. Áp cho rack, cú cố định và replay.
  - Planner không nhận cú làm rơi bi ngoài bi đích, trừ phá bàn.
- Harness chạy lại cho kết quả: combo 47 và safety 93 r0 giờ tìm được hướng chỉ rơi đúng bi.
- Còn mở:
  - Kick 64, 89, 111: native không có `passCondition`, nên chưa biết bài nào phải pot.
  - Jump 72: engine không mô phỏng pha bay, xuyên bi là chủ ý.

### 2c. Cú hụt ngay ở thông số của drill
| Drill | Hiện tượng |
|---|---|
| 22 r3/r4 | hụt |
| 31 r6 | hụt |
| 33 r1, 37 r2, 38 r0 | bi cái rơi lỗ |
| 39 r3/r8 | hụt |
| **44 r1–r5** (Tom Ross) | hụt toàn bộ |
| 56 r0–r2 | hụt |
| 83 r1–r4 | hụt |
| 93 r1, 99 r1, 111 r1 | hụt |
| 94 r0/r1 | hụt; r1 bi cái còn xuyên qua bi 5 |
| 120 r1/r3 | aimPocket khác với guide |
| 120 r2/r5/r7 | bị chặn |

### Nguyên nhân trong code (đã đọc)
- `PoolShotReplay.swift:206` `potted(pocket)`: **bi mục tiêu rơi lỗ nào cũng tính**. Đường replay chấm `ob.sink && !cue.sink`, không kiểm lỗ, không kiểm bi khác rơi.
- `DrillShotPlanner.swift:28,54` `racked()`: từ 5 bi trở lên mà bi nào cũng có bi sát bên thì coi là rack. Nhánh này đổi bi thành bi gần nhất, lực ×3 tới 8 m/s, tipX = 0, bỏ goal. Đạt chỉ cần bi cái không rơi.
- `ShotPhysics.hit()` chỉ mô phỏng bi cái và bi mục tiêu lúc tiếp cận, không kiểm vật cản. Hệ quả là các cú 72 và 94 r1 đi xuyên bi.

## 3. Luật 2 — đường vẽ khớp đường chạy

### Lệch hơn 2.25"
| Nhóm | Drill (lệch tối đa) |
|---|---|
| Bank | 27 r2/r3 (5.5/7.1), 28 r2/r3 (4.7/7.1), 66 (2.1–3.6), 67 r4 (6.5), 68 r3 (12.3; ngắm lệch 8.7°), **69 r3 (46.6; không theo băng thứ 2)**, **69 r4 (vào nhầm sideLeft thay vì sideRight)**, 69 r5 (9.0), 110 (3.4–8.8, tăng dần theo round) |
| Safety | 58 (5.5), 61 (đường bank bi 75.9), 62 (29.0; băng thứ 2 lệch 7.7), 93 (12.7), 94 r1 (10.3), 112 r0 (40.5), 112 r1 (đường bank 75.6) |
| Kick (đường bi cái) | 64 (2.9–6.5), 65 r7/r8 (2.6–2.9), 89 (4.7–5.3), 111 (4.8–30.1) |
| Đường bi mục tiêu / bi cái khác | 9 (6.4), 39 (3.0), 44 (8.5–15.4), 47 r2 (3.8), 48 (23.1), 56 (34.7), 83 (2.7–4.0), 98 (10.6–14.7), 99 r1 (22.6), 120 r1/r3 (46–55) |
| Pattern 31 | 3.4–65". Các round này phát video replay, harness chưa giả lập video nên **chưa kết luận** |

### Lực thẻ khác lực đánh thật
Có 66 trường hợp lực thẻ khác lực đánh thật.
- Bank 66, 67, 68, 69, 28: thẻ ghi 1.8, đánh thật 2.34 m/s. 67 r3, 68 r4/r6 lên 5.0; 68 r5, 69 r3/r5 lên 4.0.
- Break và test: thẻ ghi 1.8–2.6, đánh thật 7.8.
- Kick 89 và 111: thẻ ghi 1.4–1.5, đánh thật 2.6.
- 93 r0 và 94 r0: round có `speed` riêng nhưng merge ở JS bỏ qua (`src/app/drill/[id].tsx`, chỉ dùng speed của round khi round dời bàn hoặc có contactPoint).

### Preview trước cú khác đường đánh thật
Ở bank, preview hầu như không bao giờ vào lỗ: previewPocket là "-" ở 27, 28, 66, 67, 68, 69 (trừ r2), 105, 109, 110.
Lý do là preview chạy `ShotReplay` với hướng ngắm và lực của thẻ, còn Play chạy kết quả search của planner.

### Nguyên nhân
- Planner tìm cú trong ±20° bước 0.25°, với các mức lực [s, 1.3s, 1.6s, 2.6, 3.2, 4, 5]. Nó dừng ở **cú đầu tiên vào lỗ**, không ưu tiên cú gần đường vẽ nhất.
- Đường bank vẽ tay theo gương phẳng (góc tới bằng góc phản xạ). Engine có throw, spin và băng nén nên góc ra khác góc gương. Sai lệch dồn theo khoảng cách nên round sau lệch hơn round trước (66, 110).
- Planner không trả lực và hướng ngắm đã chọn về thẻ và preview.

## 4. Khuyến nghị (Pareto)

**Chốt một việc làm trước: dùng một nguồn sự thật cho cú đánh.**
Planner chạy một lần khi dựng round. Kết quả (hướng ngắm, lực, đường đi) được dùng cho cả preview, đường vẽ, thẻ và Play. Đường vẽ tay chỉ là gợi ý cho planner, không được vẽ ra nếu lệch hơn ngưỡng.
- Gỡ luật 2 cho toàn bộ nhóm bank, kick và safety: hết cảnh "vẽ một đằng, chạy một nẻo", thẻ ghi đúng lực.
- Chi phí: chủ yếu ở `PoolEditorGuides`, `PoolEditorView`, `DrillShotPlanner`. Không đổi schema drill. Đây là cửa hai chiều.

**Việc thứ hai, rẻ và đi kèm: siết điều kiện "đạt"** để vá luật 1.
- Bi mục tiêu phải rơi đúng `aimPocket`.
- Không bi nào khác rơi, trừ drill có luật cho phép.
- Bi cái phải chạm bi mục tiêu đầu tiên.
- Bỏ heuristic `racked()` cho skill `test`.
Khoảng 20–40 dòng trong `PoolShotReplay.potted`, nhánh replay `made` và `DrillShotPlanner`.

Sau đó mới tới data: sửa từng drill hụt hoặc lệch ở 2c và mục 3. Nhiều drill sẽ tự hết lệch sau việc thứ nhất, nên sửa data trước là phí công.

Cố tình chưa làm trong khuyến nghị này:
- Hiệu chỉnh engine theo bàn thật (đã có kế hoạch `2026-10-18-hieu-chinh-engine`).
- Sửa đường vẽ tay theo engine từng drill một.
- Xem lại các drill cố ý đánh ngược thứ tự (mục 2a), cần anh chốt theo chuẩn.

## 5. Đã kiểm và suy đoán

**Đã kiểm bằng mô phỏng hoặc đọc code**: mọi con số ở mục 1–3, `potted()`, `racked()`, merge speed ở JS, dispatch Play.

**Suy đoán, chưa kiểm**:
- Nguyên nhân lệch bank là chênh giữa gương phẳng và mô hình băng của engine. Kết luận này dựa trên xu hướng lệch, chưa tách riêng từng yếu tố.
- Các drill đánh ngược ở 2a là cố ý.

**Chưa phủ**:
- Mức khoảng cách (`distances`/atDistance).
- Video replay của drill 31.
- Lượt chạy tự do của RackShotSolver.
- Drill solo chỉ có bi cái.
- Lựa chọn của zone/DrillTargetSolver.
- Độ đúng của engine so với bàn thật.
- Chưa chạy trên app thật. Harness tái tạo dispatch, nên nếu app có nhánh harness bỏ sót thì kết quả có thể khác.
