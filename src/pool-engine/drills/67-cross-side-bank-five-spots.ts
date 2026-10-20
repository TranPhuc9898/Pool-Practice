import type { PoolDrill } from '../types';

/**
 * Cross-Side Bank: Five Spots, bài 67 (B2) của `docs/research/pool-practice-drills/drills-66-81-bank-break-jump-kiem-tra.md`,
 * gốc BU Exam II S7 Masters https://billiarduniversity.org/documents/BU_Exam-II_Skills-Masters.pdf; lý thuyết bù spin
 * https://drdavepoolinfo.com/bd_articles/2013/feb13.pdf. [nguồn]: bi mục tiêu cố định (0.25, 0.625), bi cái trên trục giữa
 * x = 0.5 tại năm chỗ cách nhau một bi (y 0.67 → 0.58), bank băng trái vào lỗ giữa phải, 1 điểm mỗi chỗ, tối đa 5. Toạ độ giữ
 * đúng bản research (đã lật gương so với hình gốc). [đề xuất]: đạt 3/5. [suy luận]: điểm chạm băng là điểm gương hình học
 * (đường tâm bi ở x = 1.125"), không tính cut-induced spin, nên chỗ C cũng đã có góc cắt khoảng 14°. Chưa kiểm trên bàn thật.
 */
export const crossSideBankFiveSpots = {
  id: '67',
  number: 67,
  title: 'Cross-Side Bank: Five Spots',
  subtitle: 'Same object ball, five cue ball spots. Adjust the bank for the cut.',
  category: 'shotMaking',
  skill: 'bank',
  skillLabel: 'Bank',
  difficulty: 3,
  objective: 'Bank the 1-ball off the left rail into the right side pocket from each of five cue ball spots, one shot each.',
  cueBall: { x: 0.5, y: 0.67 },
  objectBalls: [{ number: 1, x: 0.25, y: 0.625 }],
  targetPocket: 'sideRight',
  cueBallTargetZones: [],
  guideLines: [
    { kind: 'objectBallBankPath', points: [{ x: 0.25, y: 0.625 }, { x: 0.0225, y: 0.6014 }, { x: 1, y: 0.5 }] },
    { kind: 'railContact', point: { x: 0, y: 0.6014 } },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 5,
  passCondition: { kind: 'pocketed', required: 3 },
  tips: [
    'The object ball never moves. Only the cue ball steps one ball along the center line.',
    'Every spot is a small cut, and the cut puts spin on the object ball. Cut to the outside banks short, to the inside banks long.',
    'Shift your aim on the rail to make up for the cut, not your speed.',
  ],
  mistakes: [
    'Same rail point from every spot: the cut-induced spin pushes the bank off by a diamond or more at the ends.',
    'Adding english to fix the cut. Learn the aim shift first with a center hit.',
  ],
  rounds: [
    { title: 'Spot A', spin: 'center', cueBall: { x: 0.5, y: 0.67 } },
    { title: 'Spot B', spin: 'center', cueBall: { x: 0.5, y: 0.6475 } },
    { title: 'Spot C', spin: 'center', cueBall: { x: 0.5, y: 0.625 } },
    { title: 'Spot D', spin: 'center', cueBall: { x: 0.5, y: 0.6025 } },
    { title: 'Spot E', spin: 'center', cueBall: { x: 0.5, y: 0.58 } },
  ],
} satisfies PoolDrill;
