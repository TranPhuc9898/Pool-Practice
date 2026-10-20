import type { PoolDrill } from '../types';

/**
 * Soft Touch, bài 49 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Bob Jewett
 * "Get to the Point" Diag. 1 (https://www.sfbilliards.com/articles/2007.pdf). Luật và mục tiêu 5 rồi 10 lần chạm
 * [nguồn]; toạ độ [suy luận]: bi cái giữa bàn, bi 1 trên foot spot cắt khoảng 45° (ghost ball cho ra 49°) vào lỗ
 * footRight, bi 2 gần tiếp tuyến của bi cái. Vùng đích là bi cái dừng trong một bề rộng bi quanh bi 2 [nguồn], bán kính
 * 4.5" tính từ tâm bi 2 [suy luận]. Ngưỡng 5/10 [đề xuất]. Bàn chỉ dựng cú đầu; các cú sau bi 2 đã dời. Chưa kiểm trên
 * bàn thật.
 */
export const softTouch = {
  id: '49',
  number: 49,
  title: 'Soft Touch',
  subtitle: 'Pot the 1, then let the cue ball barely kiss the 2.',
  category: 'cueBallControl',
  skill: 'speedControl',
  skillLabel: 'Speed Control',
  difficulty: 1,
  objective: 'Pot the 1-ball in the corner and stop the cue ball within one ball width of the 2-ball after a light touch.',
  cueBall: { x: 0.5, y: 0.5 },
  objectBalls: [
    { number: 1, x: 0.5, y: 0.25 },
    { number: 2, x: 0.325, y: 0.175 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.325, y: 0.175 }, radius: 0.09, label: 'Ball 2' }],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footRight' },
    { kind: 'tangentLine', ball: 1, pocket: 'footRight' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 5 },
  tips: [
    'The cue ball leaves the 1 along the tangent line and the 2 sits on it. Speed is the only variable.',
    'After the first shot, take ball in hand and keep nudging the 2 toward the far left corner, one touch at a time.',
    'Aim for 5 touches in a row, then 10, before the 2 gets within half a diamond of the corner.',
  ],
  mistakes: [
    'Cue ball knocks the 2 a foot away: too much speed. A touch only counts if the cue ball stops within one ball width of the 2.',
    'Cue ball dies short of the 2: you stroked it as a stop shot. Let it roll a little more.',
  ],
} satisfies PoolDrill;
