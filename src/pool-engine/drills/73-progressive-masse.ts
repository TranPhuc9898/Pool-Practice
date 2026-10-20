import type { PoolDrill } from '../types';

/**
 * Progressive Massé, bài 73 (J8) của `docs/research/pool-practice-drills/drills-66-81-bank-break-jump-kiem-tra.md`, gốc Bob
 * Jewett BD 05/2003 http://www.sfbilliards.com/articles/2003.pdf. [nguồn]: bi 1 ở miệng lỗ footLeft, bi chắn ép băng trái tại
 * chỗ đánh dấu xu, bi cái cách băng nửa bi và cách bi chắn khoảng một bi; massé mềm vòng qua bi chắn vào bi 1, bi cái không
 * chạm băng; vào thì dời xu và bi chắn xa lỗ thêm ½ diamond, trượt thì dời lại gần; set 15 cú, điểm là vị trí xu cuối set
 * tính bằng diamond tới lỗ; khoảng 50% ở 8 diamond thì giấu hẳn bi cái sau bi chắn. [suy luận] của research: toạ độ bi 1
 * (0.03, 0.01875), bi chắn (0.0225, 0.25) (research in 0.022, em lấy 0.0225 cho đúng bi ép băng), bi cái (0.045, 0.295);
 * xu bắt đầu ở 2 diamond. [đề xuất]: hạng B từ 3 diamond. [suy luận] của em: từ 2 diamond, ±½ mỗi cú, cuối set ≥ 3 diamond
 * cần vào ít nhất 9/15, nên qua ở 9. Điểm đặt cơ trái dưới, cơ dựng: em suy từ hướng cong, nguồn không ghi.
 * Chưa kiểm trên bàn thật.
 */
export const progressiveMasse = {
  id: '73',
  number: 73,
  title: 'Progressive Massé',
  subtitle: 'Soft massé around a blocker on the rail. The blocker moves back after every make.',
  category: 'shotMaking',
  skill: 'masse',
  skillLabel: 'Massé',
  difficulty: 4,
  objective: 'Curve the cue ball around the blocker into the 1-ball in the far left corner without touching the rail. Fifteen shots, moving the blocker after each one.',
  cueBall: { x: 0.045, y: 0.295 },
  objectBalls: [
    { number: 1, x: 0.03, y: 0.01875 },
    { number: 2, x: 0.0225, y: 0.25 },
  ],
  targetPocket: 'footLeft',
  cueBallTargetZones: [],
  guideLines: [],
  recommendedContactPoint: { x: -0.5, y: -0.3 },
  recommendedSpin: 'draw',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 15,
  passCondition: { kind: 'pocketed', required: 9 },
  tips: [
    'Mark the blocker spot with a coin. Make it: move coin and blocker half a diamond farther from the pocket. Miss: half a diamond closer.',
    'Your score is where the coin sits after 15 shots, in diamonds from the corner. 3 diamonds is the mark here; from 2 that takes about 9 makes.',
    'Keep it very soft: the cue ball swings out from the rail and curls back in. It must not touch the rail.',
    'At about 50% from 8 diamonds, move the cue ball fully behind the blocker.',
  ],
  mistakes: [
    'Cue ball hits the blocker: not enough curve. Raise the cue more instead of hitting harder.',
    'Cue ball touches the rail on the way: it swung out too little and drifted back early.',
  ],
} satisfies PoolDrill;
