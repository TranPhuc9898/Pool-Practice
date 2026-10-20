import type { PoolDrill } from '../types';

/**
 * Jump the Gap, bài 72 (J1) của `docs/research/pool-practice-drills/drills-66-81-bank-break-jump-kiem-tra.md`, gốc BU Exam II
 * S9 Bachelors https://billiarduniversity.org/documents/BU_Exam-II_Skills-Bachelors.pdf. [nguồn]: bi cái (0.75, 0.875), bi
 * mục tiêu treo miệng lỗ footLeft (0.0375, 0.025), hai bi chắn cách nhau một bi chặn đường; nhảy qua, hoặc bỏ một bi chắn rồi
 * curve hay massé quanh bi còn lại; 3 lượt, 1 điểm mỗi lần vào mà không chạm bi chắn, scratch vẫn tính. Bản Masters dùng 1 bi
 * chắn, 5 lượt. [suy luận] của research: toạ độ hai bi chắn (0.6075, 0.7588) và (0.6925, 0.7413), tính đúng từ (L, W) in sẵn
 * thay cho bản làm tròn. [đề xuất]: đạt 2/3. Chưa kiểm trên bàn thật.
 */
export const jumpTheGap = {
  id: '72',
  number: 72,
  title: 'Jump the Gap',
  subtitle: 'Two blockers one ball apart. Jump over them, or curve around one.',
  category: 'shotMaking',
  skill: 'jump',
  skillLabel: 'Jump',
  difficulty: 4,
  objective: 'Pocket the 1-ball hanging in the far left corner without touching either blocker. Three tries.',
  cueBall: { x: 0.75, y: 0.875 },
  objectBalls: [
    { number: 1, x: 0.0375, y: 0.025 },
    { number: 2, x: 0.6075, y: 0.7588 },
    { number: 3, x: 0.6925, y: 0.7413 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [{ kind: 'objectBallPath', ball: 1, pocket: 'footLeft' }],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'firm',
  allowedRails: 0,
  attemptCount: 3,
  passCondition: { kind: 'pocketed', required: 2 },
  tips: [
    'Jump: raise the butt and hit down through the center of the cue ball. Never scoop under it, that is a foul.',
    'Or take one blocker off the table and curve or massé the cue ball around the other one.',
    'A point is the 1-ball down with no blocker touched. A scratch still counts.',
    'Harder version: one blocker, five tries.',
  ],
  mistakes: [
    'Cue ball clips the top of a blocker: not enough elevation or too close to it. Raise the cue or move back.',
    'Cue ball hops over the 1-ball: it is still in the air when it gets there. Jump softer so it lands first.',
  ],
} satisfies PoolDrill;
