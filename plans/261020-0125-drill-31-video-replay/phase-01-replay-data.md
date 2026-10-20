# Phase 1 — Dữ liệu replay từ track.csv

## Việc
1. Chép `track.csv`, `shots.csv` của run3 (scratchpad `pb107/run3/`) vào `scripts/video-harness/data/eJldkCO6TeA/`.
2. `scripts/video-harness/replay.py` (chạy `python3 -I`): mỗi cú n
   - cắt `t_start..t_end`, bỏ đoạn đứng yên đầu/cuối (tốc < 2 in/s), giữ bước 0.06 s;
   - đổi toạ độ x = 1 − W/4, y = L/8;
   - làm mượt trung bình trượt 5 mẫu, giữ nguyên điểm đầu, điểm cuối và điểm chạm;
   - kéo lệch tuyến tính để điểm đầu trùng `cueBall` round n, điểm cuối trùng `cueBall` round n+1 (cú 12: chỗ dừng video `cue_L/W`);
   - `contact`: chỉ số mẫu gần ghost ball nhất (ghost tính từ bi mục tiêu và lỗ `objectBallPath` của round);
   - in bảng: số mẫu, độ dài, độ lệch đã kéo ở hai đầu (in), `contact`.
3. `types.ts`, `DrillRound`: `replay?: { dt: number; xy: number[]; contact: number }` (xy phẳng x,y,x,y, chuẩn hoá, 4 số lẻ).
4. Ghi `replay` vào 12 round của `31-twelve-ball-rails.ts`, sửa câu objective cho khớp.

## Xong khi
- 12/12 round có `replay`, độ lệch kéo hai đầu ≤ 1 in mỗi cú (lớn hơn thì dừng, báo anh).
- `npx tsc --noEmit` 0 lỗi.

## Rủi ro
File drill dài thêm khoảng 1100 cặp điểm (~25 KB). Chấp nhận được với một drill. Lớn quá thì tách `31-twelve-ball-rails.replay.ts`.
