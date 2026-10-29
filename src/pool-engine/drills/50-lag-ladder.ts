import type { PoolDrill } from '../types';

/**
 * Lag Ladder, bài 50 của `docs/research/pool-practice-drills/drills-49-65-dieu-bi-safety-kick.md`, Bob Jewett qua
 * Dr. Dave FAQ (https://drdavepoolinfo.com/?p=2482). Luật [nguồn]: khoảng 10 bi xếp trên head string, không dùng bi
 * cái, đánh từng bi thẳng về foot, mỗi bi dừng vừa quá bi trước, đếm số bi tới khi có bi chạm foot rail. Mốc F 6 bi
 * [đề xuất]. Sơ đồ gốc tượng trưng: 10 chỗ trên head string chia đều W 0.4 → 3.6 và bậc đích cách nhau ½ diamond từ
 * L = 3 tới L = 7.5 là [đề xuất], để vẽ ra "đường chéo đều" mà nguồn nói. Mỗi round là một bi, bàn chỉ vẽ bi đang
 * đánh ở chỗ bi cái, không vẽ các bi đã dừng. Lực từng round dò bằng `ShotPhysics` cho bi dừng giữa vòng mà không chạm
 * foot rail; lực soft chung 0.8 đưa mọi bi tới sát foot rail (6.3"). Chưa kiểm trên bàn thật.
 */
export const lagLadder = {
  id: '50',
  number: 50,
  title: 'Lag Ladder',
  subtitle: 'Ten balls up the table, each one just past the last.',
  category: 'cueBallControl',
  skill: 'speedControl',
  skillLabel: 'Speed Control',
  difficulty: 2,
  objective: 'Lag ten balls from the head string, each stopping just past the one before, without touching the foot rail.',
  cueBall: { x: 0.1, y: 0.75 },
  objectBalls: [],
  targetPocket: 'footLeft',
  cueBallTargetZones: [
    { kind: 'circle', center: { x: 0.1, y: 0.625 }, radius: 0.08, label: '1' },
    { kind: 'circle', center: { x: 0.1889, y: 0.5625 }, radius: 0.08, label: '2' },
    { kind: 'circle', center: { x: 0.2778, y: 0.5 }, radius: 0.08, label: '3' },
    { kind: 'circle', center: { x: 0.3667, y: 0.4375 }, radius: 0.08, label: '4' },
    { kind: 'circle', center: { x: 0.4556, y: 0.375 }, radius: 0.08, label: '5' },
    { kind: 'circle', center: { x: 0.5444, y: 0.3125 }, radius: 0.08, label: '6' },
    { kind: 'circle', center: { x: 0.6333, y: 0.25 }, radius: 0.08, label: '7' },
    { kind: 'circle', center: { x: 0.7222, y: 0.1875 }, radius: 0.08, label: '8' },
    { kind: 'circle', center: { x: 0.8111, y: 0.125 }, radius: 0.08, label: '9' },
    { kind: 'circle', center: { x: 0.9, y: 0.0625 }, radius: 0.08, label: '10' },
  ],
  guideLines: [],
  recommendedContactPoint: { x: 0, y: 0 },
  recommendedSpin: 'center',
  recommendedSpeed: 'soft',
  allowedRails: 0,
  attemptCount: 10,
  passCondition: { kind: 'inZone', required: 6 },
  tips: [
    'Line up about ten balls on the head string. No cue ball: shoot each ball straight up the table as if it were the cue ball.',
    'The first ball goes very soft. Each next ball only needs a little more speed than the last.',
    'Count how many balls you get before one touches the foot rail. A good run leaves an even diagonal across the table.',
    'The zones are an even ladder half a diamond apart. Stopping just past the previous ball is what counts.',
  ],
  mistakes: [
    'Big gaps early, then you run out of table: you added too much speed per ball. Make each step the smallest you can.',
    'A ball stops short of the previous one: you backed off on the stroke. Keep the same tempo and lengthen it a little.',
  ],
  rounds: [
    { title: 'Ball 1', zone: 0, spin: 'center', speed: 0.34, cueBall: { x: 0.1, y: 0.75 } },
    { title: 'Ball 2', zone: 1, spin: 'center', speed: 0.42, cueBall: { x: 0.1889, y: 0.75 } },
    { title: 'Ball 3', zone: 2, spin: 'center', speed: 0.485, cueBall: { x: 0.2778, y: 0.75 } },
    { title: 'Ball 4', zone: 3, spin: 'center', speed: 0.54, cueBall: { x: 0.3667, y: 0.75 } },
    { title: 'Ball 5', zone: 4, spin: 'center', speed: 0.59, cueBall: { x: 0.4556, y: 0.75 } },
    { title: 'Ball 6', zone: 5, spin: 'center', speed: 0.64, cueBall: { x: 0.5444, y: 0.75 } },
    { title: 'Ball 7', zone: 6, spin: 'center', speed: 0.68, cueBall: { x: 0.6333, y: 0.75 } },
    { title: 'Ball 8', zone: 7, spin: 'center', speed: 0.725, cueBall: { x: 0.7222, y: 0.75 } },
    { title: 'Ball 9', zone: 8, spin: 'center', speed: 0.765, cueBall: { x: 0.8111, y: 0.75 } },
    { title: 'Ball 10', zone: 9, spin: 'center', speed: 0.8, cueBall: { x: 0.9, y: 0.75 } },
  ],
} satisfies PoolDrill;
