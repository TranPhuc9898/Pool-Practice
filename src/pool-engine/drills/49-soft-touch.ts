import type { PoolDrill } from '../types';

/**
 * Soft Touch, bài 49 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Bob Jewett
 * "Get to the Point" Diag. 1 (https://www.sfbilliards.com/articles/2007.pdf). Luật và mục tiêu 5 rồi 10 lần chạm
 * [nguồn]. Toạ độ đọc từ hình (bi cái giữa bàn, cắt 49° vào footRight) không ra cú nào trên engine, lý do ghi ở
 * `drill49()`. Bản này giữ bi 1 trên foot spot, dời bi cái và bi 2 cho cú cắt 13° [suy luận], nên khác toạ độ trong
 * file research. Bi 2 không nằm trên tiếp tuyến: follow kéo bi cái vào nó, mỗi lần chạm đẩy bi 2 chừng 1.7" về băng
 * phải. Vùng đích là bi cái dừng trong một bề rộng bi quanh bi 2 [nguồn], bán kính 4.5" tính từ tâm bi 2 [suy luận].
 * Zone trong data đứng ở chỗ đặt bi 2, harness đo từ chỗ bi 2 dừng sau khi chạm. Ngưỡng 5/10 và vạch nửa diamond trước
 * băng phải [đề xuất]. Tip, lực và `rate` chép từ `sh scripts/position-harness/run.sh` trên ShotPhysics ddf3049. Hash
 * khác thì chạy lại harness, chép lại số. Bàn chỉ dựng cú đầu; các cú sau bi 2 đã dời. Chưa kiểm trên bàn thật.
 */
export const softTouch = {
  id: '49',
  number: 49,
  title: 'Soft Touch',
  subtitle: 'Pot the 1, then let the cue ball barely kiss the 2. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'speedControl',
  skillLabel: 'Speed Control',
  difficulty: 1,
  objective: 'Pot the 1-ball in the corner and stop the cue ball within one ball width of the 2-ball after a light touch.',
  cueBall: { x: 0.26, y: 0.33 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.25 },
    { number: 2, x: 0.7, y: 0.26 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.7, y: 0.26 }, radius: 0.09, label: 'Ball 2' }],
  guideLines: [{ kind: 'objectBallPath', ball: 1, pocket: 'footRight' }],
  recommendedContactPoint: { x: 0, y: 0.3 },
  recommendedSpin: 'follow',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 5 },
  tips: [
    'Follow bends the cue ball off the tangent line and into the 2. Speed is the only variable.',
    'After the first shot, take ball in hand and keep nudging the 2 toward the right rail, one touch at a time.',
    'Aim for 5 touches in a row, then 10, before the 2 gets within half a diamond of the right rail.',
  ],
  mistakes: [
    'Cue ball knocks the 2 a foot away: too much speed. A touch only counts if the cue ball stops within one ball width of the 2.',
    'Cue ball dies short of the 2: you stroked it as a stop shot. Let it roll a little more.',
  ],
  shots: [
    { ball: 1, pocket: 'footRight', tipY: 0.3, speed: 0.8, zone: 0, rate: 29, why: '13° cut. Follow at 0.8 m/s bends the cue ball off the tangent line into the 2, nudging it 2" and stopping 1" from it.' },
  ],
} satisfies PoolDrill;
