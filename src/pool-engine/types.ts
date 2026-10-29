/**
 * Drill là data. Renderer native chỉ đọc và vẽ, không biết drill nào là drill nào.
 *
 * Toạ độ chuẩn hoá: `x` 0…1 theo chiều rộng 50", `y` 0…1 theo chiều dài 100".
 * Foot rail ở `y = 0`, head rail (phía người chơi) ở `y = 1`.
 * Bán kính zone tính theo bề rộng mặt chơi: `0.08` = 4", để hình tròn vẫn tròn.
 */
export type NormalizedPoint = { x: number; y: number };

export type ObjectBallNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type PoolBallPlacement = NormalizedPoint & { number: ObjectBallNumber };

export type PocketId = 'footLeft' | 'footRight' | 'sideLeft' | 'sideRight' | 'headLeft' | 'headRight';

export type TargetZone =
  | { kind: 'circle'; center: NormalizedPoint; radius: number; label?: string }
  | { kind: 'ellipse'; center: NormalizedPoint; radiusX: number; radiusY: number; label?: string };

/** Guide nào tính được từ bi + lỗ thì chỉ khai báo, renderer tự tính hình. */
export type GuideLine =
  | { kind: 'objectBallPath'; ball: ObjectBallNumber; pocket: PocketId }
  | { kind: 'cueBallPath'; ball: ObjectBallNumber; pocket: PocketId }
  | { kind: 'ghostBall'; ball: ObjectBallNumber; pocket: PocketId }
  | { kind: 'tangentLine'; ball: ObjectBallNumber; pocket: PocketId }
  /** Đường bi cái sau va chạm, qua các điểm chạm băng nếu có. */
  | { kind: 'expectedCuePath'; points: NormalizedPoint[] }
  /** Đường bi mục tiêu gãy ở băng: bi mục tiêu, điểm chạm băng, lỗ. */
  | { kind: 'objectBallBankPath'; points: NormalizedPoint[] }
  | { kind: 'railContact'; point: NormalizedPoint };

export type DrillCategory = 'shotMaking' | 'cueBallControl' | 'patternPlay';
export type DrillSkill =
  | 'straightStroke'
  | 'stop'
  | 'follow'
  | 'followDistance'
  | 'draw'
  | 'drawDistance'
  | 'tangent'
  | 'threePositions'
  | 'oneRail'
  | 'pattern'
  | 'wagonWheel'
  | 'lineUp'
  | 'correctSide'
  | 'noRail'
  | 'runout'
  | 'railCut'
  | 'spotShot'
  | 'cutAngle'
  | 'naturalAngle'
  | 'drawAngle'
  | 'english'
  | 'bank'
  | 'break'
  | 'combo'
  | 'speedControl'
  | 'safety'
  | 'kick'
  | 'jump'
  | 'masse'
  | 'test';
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type Spin = 'center' | 'stun' | 'follow' | 'draw';
export type Speed = 'soft' | 'medium' | 'firm';

/** Điểm chạm đầu cơ trên mặt bi cái, -1…1, `y` dương là phía trên. */
export type ContactPoint = { x: number; y: number };

export type PassCondition =
  | { kind: 'pocketed'; required: number }
  | { kind: 'inZone'; required: number };

/**
 * Một lượt trong drill nhiều zone (ladder, A/B/C) hoặc nhiều chỗ bi cái (thang góc cắt).
 * Round suy ra từ thứ tự cú, nên drill đã có attempt thì không đổi số round.
 * Trường tuỳ chọn có mặt thì đè trường cùng nghĩa của drill trong lượt đó.
 */
export type DrillRound = {
  title: string;
  zone?: number;
  spin: Spin;
  cueBall?: NormalizedPoint;
  objectBalls?: PoolBallPlacement[];
  guideLines?: GuideLine[];
  contactPoint?: ContactPoint;
  /** m/s, đè `recommendedSpeed` cho Play. Chép từ `scripts/position-harness/`. */
  speed?: number;
  /** m/s chỉ cho Play, khi lực thật (`speed`, hiện trên card) chạy trên engine không ra đúng chỗ dừng. */
  playSpeed?: number;
  /** Có thì Play diễn lại đường bi cái này thay cho engine, khi bàn còn đúng thế của round. */
  replay?: CueReplay;
  /** Vì sao chọn cú này, một câu, như `DrillShot.why`. */
  why?: string;
  /**
   * Như `DrillShot.rate`, cho bài đặt lại bi cái mỗi cú: số mẫu trên 45 mẫu lệch tay của `scripts/position-harness/` còn
   * vào lỗ sạch. Có cùng `speed` thì round lấy nguồn engine.
   */
  rate?: number;
};

/**
 * Đường bi cái ghi từ video, một mẫu mỗi `dt` giây. `xy` phẳng x, y, x, y… chuẩn hoá như `NormalizedPoint`, mẫu đầu là
 * `cueBall` của round. `contact` là chỉ số mẫu bi cái chạm bi mục tiêu, đặt đúng ghost ball.
 */
export type CueReplay = { dt: number; contact: number; xy: number[] };

export type DrillStep = { label: string; caption: string };

/**
 * Một cú của drill chạy bài cố định. Tip, lực, zone và `rate` chép từ `scripts/position-harness/`, app không tính lại.
 * Chỉ cú 1 đặt bi cái; cú sau đánh từ chỗ bi cái dừng thật sau cú trước, hướng cơ giải lại từ đó.
 */
export type DrillShot = {
  ball: ObjectBallNumber;
  pocket: PocketId;
  /** Phê ngang, cùng thang với `ContactPoint.x`, âm là bên trái. Không có là 0. */
  tipX?: number;
  tipY: number;
  /** m/s. */
  speed: number;
  /** Chỉ số trong `cueBallTargetZones` bi cái phải dừng sau cú này. Cú cuối không có. */
  zone?: number;
  /** Vì sao chọn cú và zone này, một câu. */
  why: string;
  /** Số mẫu trên 45 mẫu lệch tay của harness còn vào lỗ, dừng trong zone và đánh được bi kế. */
  rate: number;
};

/**
 * Một mức khoảng cách bi cái → bi mục tiêu, tính theo diamond (12,5"). Bi cái lùi trên đường
 * cũ, vùng đích giữ nguyên, nên cú gợi ý phải tính lại bằng engine cho từng mức.
 */
export type DrillDistance = {
  diamonds: number;
  cueBall: NormalizedPoint;
  recommendedContactPoint: ContactPoint;
  recommendedSpeed: Speed;
};

/** Chỗ để tăng độ khó về sau, chưa có thuật toán thích nghi. */
export type DifficultyModifiers = {
  zoneScale?: number[];
  cueDistanceDiamonds?: number[];
};

export type PoolDrill = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: DrillCategory;
  skill: DrillSkill;
  skillLabel: string;
  difficulty: Difficulty;
  objective: string;
  cueBall: NormalizedPoint;
  objectBalls: PoolBallPlacement[];
  targetPocket: PocketId;
  cueBallTargetZones: TargetZone[];
  guideLines: GuideLine[];
  recommendedContactPoint: ContactPoint;
  recommendedSpin: Spin;
  recommendedSpeed: Speed;
  allowedRails: number;
  attemptCount: number;
  passCondition: PassCondition;
  tips: string[];
  /** Lỗi hay gặp, mỗi dòng: triệu chứng trên bàn rồi nguyên nhân. Hiện trong khối info. */
  mistakes?: string[];
  rounds?: DrillRound[];
  steps?: DrillStep[];
  shots?: DrillShot[];
  difficultyModifiers?: DifficultyModifiers;
  distances?: DrillDistance[];
};
