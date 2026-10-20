import type { PoolDrill } from '../types';

/**
 * Cross-Corner Bank Ladder, bài 68 (B3) của `docs/research/pool-practice-drills/drills-66-81-bank-break-jump-kiem-tra.md`,
 * gốc BU Exam II S7 Doctorate https://billiarduniversity.org/documents/BU_Exam-II_Skills-Doctorate.pdf. [nguồn]: bi mục tiêu
 * (0.25, 0.25), bi cái trên trục giữa x = 0.5 tại bảy chỗ y 0.25 → 0.625 cách nhau nửa diamond, bank băng trái vào góc
 * footRight, 1 điểm mỗi chỗ, tối đa 7. Toạ độ giữ đúng bản research (đã lật gương so với hình gốc). [đề xuất]: đạt 4/7.
 * [suy luận]: điểm chạm băng là điểm gương hình học (đường tâm bi ở x = 1.125"), không tính cut-induced spin.
 * Chưa kiểm trên bàn thật.
 */
export const crossCornerBankLadder = {
  id: '68',
  number: 68,
  title: 'Cross-Corner Bank Ladder',
  subtitle: 'Bank into the far corner while the cut gets wider at every spot.',
  category: 'shotMaking',
  skill: 'bank',
  skillLabel: 'Bank',
  difficulty: 4,
  objective: 'Bank the 1-ball off the left rail into the far right corner from seven cue ball spots, one shot each.',
  cueBall: { x: 0.5, y: 0.25 },
  objectBalls: [{ number: 1, x: 0.25, y: 0.25 }],
  targetPocket: 'footRight',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallBankPath', points: [{ x: 0.25, y: 0.25 }, { x: 0.0225, y: 0.2028 }, { x: 1, y: 0 }] },
    { kind: 'railContact', point: { x: 0, y: 0.2028 } },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 7,
  passCondition: { kind: 'pocketed', required: 4 },
  tips: [
    'Spot A is level with the object ball. Each spot after it moves the cue ball half a diamond toward the head rail.',
    'The farther down the ladder, the bigger the cut and the more cut-induced spin bends the bank. Note which way it misses and shift the rail point.',
    'Near-straight banks with a slight inside cut and wide cuts across the bank line are both double-kiss zones.',
  ],
  mistakes: [
    'Cue ball comes back off the end rail and kisses the object ball again: change speed or hold the cue ball with draw.',
    'Same rail point at every spot: the cut-induced spin grows with the cut, so the aim has to move.',
  ],
  rounds: [
    { title: 'Spot A', spin: 'center', cueBall: { x: 0.5, y: 0.25 } },
    { title: 'Spot B', spin: 'center', cueBall: { x: 0.5, y: 0.3125 } },
    { title: 'Spot C', spin: 'center', cueBall: { x: 0.5, y: 0.375 } },
    { title: 'Spot D', spin: 'center', cueBall: { x: 0.5, y: 0.4375 } },
    { title: 'Spot E', spin: 'center', cueBall: { x: 0.5, y: 0.5 } },
    { title: 'Spot F', spin: 'center', cueBall: { x: 0.5, y: 0.5625 } },
    { title: 'Spot G', spin: 'center', cueBall: { x: 0.5, y: 0.625 } },
  ],
} satisfies PoolDrill;
