import type { PoolDrill } from '../types';

/**
 * Nguồn: Dr. Dave Alciatore, cú ½ bi đưa bi cái đi xa https://www.facebook.com/share/v/1QZ4RdsHut/ (#31). Ý bài [nguồn]: ăn
 * ½ bi (cắt 30°) thì bi cái đi theo một góc gần cố định, đổi lực và tip thì điểm tới dịch theo. Con số "4 diamond" trong tên
 * bài lấy từ tiêu đề bài gốc, caption không nói đo từ đâu, nên em không kiểm được. Thế bi (bi 1 ở 15", 30"; bi cái lùi 22"
 * sau ghost theo góc 30°) [đề xuất]. Round draw lấy tip, lực, rate từ `drill121()` của
 * `scripts/position-harness/`. Round tâm và follow quét lại tip × lực trên ShotPhysics (2026-10-29), zone dời theo chỗ
 * dừng để bi cái chạm đúng một băng (luật 3); hai round này chưa có rate. Engine cho điểm chạm băng trái quanh 2.6–3.1
 * diamond tính từ góc chân, không phải 4. Drill giữ số engine. Chưa kiểm trên bàn thật.
 */
export const halfBallFourDiamonds = {
  id: '121',
  number: 121,
  title: 'Half-Ball Four Diamonds',
  subtitle: 'A half-ball cut into the foot corner. Watch where the cue ball meets the left rail with center, follow and draw. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'naturalAngle',
  skillLabel: 'Natural Angle',
  difficulty: 4,
  objective: 'Pot the 1 with a half-ball hit, three ways. Score when the 1 drops and the cue ball stops in that round\'s circle.',
  cueBall: { x: 0.6873, y: 0.4413 },
  objectBalls: [{ number: 1, x: 0.3, y: 0.3 }],
  targetPocket: 'footLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.1794, y: 0.3252 }, radius: 0.08, label: 'Center ball' },
    { kind: 'circle', center: { x: 0.1834, y: 0.3253 }, radius: 0.08, label: 'Follow' },
    { kind: 'circle', center: { x: 0.0742, y: 0.4078 }, radius: 0.08, label: 'Draw' },
  ],
  guideLines: [
    { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
    { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
  ],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'medium',
  allowedRails: 1,
  attemptCount: 9,
  passCondition: { kind: 'inZone', required: 6 },
  tips: [
    'Half-ball: aim the center of the cue ball at the edge of the 1-ball.',
    'Before each shot, point at the diamond where you expect the cue ball to hit the rail.',
    'Change one thing per round: tip or speed, not both.',
  ],
  mistakes: [
    'Hitting fuller than half-ball: the cue ball follows the 1 toward the pocket.',
    'Adding side spin by accident, which moves the rail contact more than the tip height does.',
  ],
  rounds: [
    {
      title: 'Center ball',
      zone: 0,
      spin: 'center',
      contactPoint: { x: 0, y: 0 },
      speed: 1,
      why: 'Natural roll after a half-ball hit: the cue ball leaves about 30° off the aim line, touches the left rail once and stops in the circle.',
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
        { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
      ],
    },
    {
      title: 'Follow',
      zone: 1,
      spin: 'follow',
      contactPoint: { x: 0, y: 0.2 },
      speed: 0.85,
      why: 'Soft follow lands next to the center-ball spot after one rail: the tip changes the path less than the speed does.',
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
        { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
      ],
    },
    {
      title: 'Draw',
      zone: 2,
      spin: 'draw',
      contactPoint: { x: 0, y: -0.5 },
      speed: 1.8,
      rate: 28,
      why: 'Draw widens the angle: the cue ball bends up the table and hits the left rail 3.1 diamonds up from the foot corner, then stops in the circle.',
      guideLines: [
        { kind: 'objectBallPath', ball: 1, pocket: 'footLeft' },
        { kind: 'ghostBall', ball: 1, pocket: 'footLeft' },
        { kind: 'cueBallPath', ball: 1, pocket: 'footLeft' },
      ],
    },
  ],
} satisfies PoolDrill;
