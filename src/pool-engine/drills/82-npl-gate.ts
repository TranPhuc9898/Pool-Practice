import type { PoolDrill } from '../types';

/**
 * NPL Gate, bước đo cơ của chuỗi Ép phê (`docs/quyet-dinh/2026-10-25-muc-tieu-va-chu-de-pool.md`), quy trình #8 trong
 * `docs/research/pool-9ball/07-spin-and-deflection.md` mục 4. Chỉ bi cái: cách footLeft 2 diamond theo đường chéo, cổng
 * hai bi ở giữa đường, mỗi bên hở 0.35" cho tâm bi cái. Hai round phê trái và phải 0.5R, ngắm tâm lỗ rồi BHE. Lực, rate
 * từ `drill82()` của `scripts/position-harness/`: ngắm tâm không bù thì bi cái lệch 0.55" ở cổng và chạm bi cổng 45/45,
 * bù BHE đúng squirt của engine (2.5°, NPL khoảng 13") thì qua cổng vào lỗ 45/45. Rate là của cú có bù. Engine chưa có
 * swerve, cơ nằm ngang. Bài chỉ ghi qua hay không, NPL đo được chưa lưu.
 */
export const nplGate = {
  id: '82',
  number: 82,
  title: 'NPL Gate',
  subtitle: 'Cue ball through a two-ball gate with heavy english. Slide your bridge until back-hand english cancels squirt on both sides. Checked in simulation, not on a real table.',
  category: 'cueBallControl',
  skill: 'english',
  skillLabel: 'English',
  difficulty: 3,
  objective: 'Send the cue ball through the gate into the corner pocket with left and right english, five shots each side, using back-hand english from a set bridge length.',
  cueBall: { x: 0.3536, y: 0.1768 },
  objectBalls: [
    { number: 2, x: 0.14, y: 0.1068 },
    { number: 3, x: 0.2135, y: 0.07 },
  ],
  targetPocket: 'footLeft',
  // Đạt là bi cái vào lỗ: zone phủ miệng footLeft, chỗ bi cái rơi (1.5", 1.5") nằm trong. Vòng cũ ở giữa cổng và lỗ không
  // chứa điểm đó.
  cueBallTargetZones: [{ kind: 'circle', center: { x: 0.07, y: 0.035 }, radius: 0.08, label: 'Pocket' }],
  // Ngắm thẳng tâm lỗ: Play chỉ đánh bi cái, bi 2 và 3 là cổng.
  guideLines: [{ kind: 'expectedCuePath', points: [{ x: 0.3536, y: 0.1768 }, { x: 0, y: 0 }] }],
  recommendedContactPoint: { x: 0.5, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'firm',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 8 },
  tips: [
    'Aim the cue straight at the pocket through the middle of the gate, with your bridge set. Then pivot the back hand to put the tip half a tip-width off center. Do not move the bridge.',
    'Hit firm. Slow shots let swerve bend the path and you measure the wrong thing.',
    'If the cue ball drifts toward the side of your english, the bridge is too short: move it back. If it drifts away from the english side, move the bridge forward.',
    'When both left and right english go through, the bridge-to-tip length is your natural pivot length. Write it down; the simulation uses about 13".',
  ],
  mistakes: [
    'Aiming the tip at the center with english and no pivot: squirt alone pushes the cue ball into the gate ball on the far side, about half an inch off at the gate.',
    'Moving the bridge hand sideways instead of pivoting from the back hand.',
    'Changing the amount of english between shots. Keep the same offset so only the bridge length changes.',
  ],
  rounds: [
    {
      title: 'Left english',
      zone: 0,
      spin: 'center',
      contactPoint: { x: -0.5, y: 0 },
      speed: 2.5,
      rate: 45,
      why: 'Half-tip left english squirts the cue ball 2.5° right. Aimed at the pocket it is 0.55" off at the gate and hits the right gate ball; pivoted the full 2.5° it is within 0.1" and drops.',
    },
    {
      title: 'Right english',
      zone: 0,
      spin: 'center',
      contactPoint: { x: 0.5, y: 0 },
      speed: 2.5,
      rate: 45,
      why: 'Mirror of the left round: squirt 2.5° left, the left gate ball if you do not pivot, through the gate when back-hand english matches squirt.',
    },
  ],
} satisfies PoolDrill;
