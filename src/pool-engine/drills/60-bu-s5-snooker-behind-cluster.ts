import type { PoolDrill } from '../types';

/**
 * BU S5 Snooker Behind a Cluster, bài 60 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`,
 * Billiard University Exam II S5 (https://billiarduniversity.org/documents/BU_Exam-II_Skills-Masters.pdf, cùng bộ
 * Bachelors https://billiarduniversity.org/documents/BU_Exam-II_Skills-Bachelors.pdf). Luật và điểm [nguồn]: chạm bi 1
 * hợp lệ rồi để lại snooker sau cụm bi, 2 cú mỗi vị trí bi cái, tối đa 6 / 10 / 14 cho Bachelors / Masters / Doctorate.
 * Toạ độ đo từ hình [suy luận]: bi 1 (L 2, W 1), năm chỗ bi cái a–e của bản Masters. Sơ đồ chỉ vẽ cụm bi tượng trưng
 * quanh (L 6, W 3), ở đây đặt năm bi 2–6 thành hình chữ X sát nhau quanh điểm đó [suy luận]. Đường đi không có trong
 * nguồn, người chơi tự chọn giấu bi cái hay bi 1, nên drill không vẽ đường và không có vòng đích. `targetPocket`
 * footRight chỉ để đủ schema. Ngưỡng 6/10 [đề xuất]. Doctorate thêm 2 vị trí chưa đo được nên không có ở đây.
 * Chưa kiểm trên bàn thật.
 */
export const buS5SnookerBehindCluster = {
  id: '60',
  number: 60,
  title: 'BU S5 Snooker Behind a Cluster',
  subtitle: 'Hit the 1-ball, then leave no straight line to it. Use the cluster.',
  category: 'patternPlay',
  skill: 'safety',
  skillLabel: 'Safety',
  difficulty: 3,
  objective: 'From five cue ball spots, make a legal hit on the 1-ball and leave the cluster between the cue ball and the 1-ball, two shots per spot.',
  cueBall: { x: 0.5, y: 0.75 },
  objectBalls: [
    { number: 1, x: 0.25, y: 0.75 },
    { number: 2, x: 0.704, y: 0.227 },
    { number: 3, x: 0.796, y: 0.227 },
    { number: 4, x: 0.75, y: 0.25 },
    { number: 5, x: 0.704, y: 0.273 },
    { number: 6, x: 0.796, y: 0.273 },
  ],
  targetPocket: 'footRight',
  cueBallTargetZones: [],
  guideLines: [],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'pocketed', required: 6 },
  tips: [
    'Pick the route first: send the cue ball behind the cluster, or send the 1-ball there and keep the cue ball home.',
    'A point is a legal hit that leaves no straight line from the cue ball to any part of the 1-ball.',
    'Two shots per spot. Bachelors shoots spots B, D and E only, six shots.',
  ],
  mistakes: [
    'Hiding the ball but no rail after contact: that is a foul, not a snooker.',
    'Too much speed: the ball you meant to hide runs past the cluster.',
  ],
  rounds: [
    { title: 'Spot A', spin: 'center', cueBall: { x: 0.5, y: 0.75 } },
    { title: 'Spot B', spin: 'center', cueBall: { x: 0.5, y: 0.875 } },
    { title: 'Spot C', spin: 'center', cueBall: { x: 0.25, y: 0.875 } },
    { title: 'Spot D', spin: 'center', cueBall: { x: 0.125, y: 0.875 } },
    { title: 'Spot E', spin: 'center', cueBall: { x: 0.125, y: 0.75 } },
  ],
} satisfies PoolDrill;
