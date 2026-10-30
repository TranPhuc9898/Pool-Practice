@AGENTS.md

## Luật drill (bắt buộc, áp cho mọi drill trong `src/pool-engine/drills/`)

Chuẩn đầy đủ ở `docs/chuan-drill.md`. Hai luật gốc dưới đây đứng trên mọi thứ khác. Drill vi phạm thì sửa drill hoặc engine, không nới luật.

1. **Đánh đúng thứ tự.** Cú i ăn đúng bi, đúng lỗ ghi trong `shots`/`rounds`, theo thứ tự tăng dần. Bi cái không được xuyên qua bi khác, không đụng bi ngoài kế hoạch, không rơi lỗ. App chỉ báo đạt khi đúng bi đúng lỗ, không đạt kiểu ăn bừa.
2. **Đường vẽ phải là đường bi chạy thật.** Đường bi cái và bi mục tiêu vẽ trên bàn phải trùng đường Play đánh ra (lệch không quá 2.25"). Preview và Play phải cùng một cú: cùng hướng, cùng lực, cùng phê. Lực trên thẻ phải là lực Play dùng. Đường bi mục tiêu trên bàn là vệt engine nét đứt trắng. Thấy nét liền trắng tức bàn đang vẽ guide tay thay cho cú thật, là lỗi. Round có `zone` phải mang `cueBall`/`objectBalls`/`guideLines` riêng, thiếu thì app giữ đủ zone và mọi round đều đánh zone đầu (`drill-lint` chặn).
3. **Zone và điều kiện đạt phải khớp.** Bi cái sau cú phải dừng trong zone ghi trong drill. Zone đặt sai chỗ là lỗi của drill. Bài chấm vị trí: sau khi chạm bi, bi cái chạm băng không quá `allowedRails` lần. Tới zone bằng đường vòng nhiều băng là cú sai.

"Tăng dần" là số bi: `shots[i].ball` tăng theo i. Nguồn ghi "any order" không được miễn. Lấy route harness rồi đánh số lại bi theo route, objective ghi "in number order". Audit và `scripts/drill-lint` đều chặn bài sai thứ tự.

Sửa drill xong phải chạy lại audit theo hai luật trên với `ShotPhysics` và `DrillShotPlanner` thật, rồi kiểm trên simulator. Không báo xong khi audit còn bài rớt mà chưa ghi lý do.
