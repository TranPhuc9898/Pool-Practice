import ExpoModulesCore

/// Mirror của `src/pool-engine/types.ts`, chỉ giữ trường renderer cần.
/// Union bên TS (`TargetZone`, `GuideLine`) được làm phẳng: `kind` + trường optional.
struct PointRecord: Record, Equatable {
  @Field var x: Double = 0.5
  @Field var y: Double = 0.5

  static func == (l: Self, r: Self) -> Bool { l.x == r.x && l.y == r.y }
}

struct BallRecord: Record {
  @Field var number: Int = 0
  @Field var x: Double = 0.5
  @Field var y: Double = 0.5
}

/// `circle` dùng `radius`, `ellipse` dùng `radiusX`/`radiusY`. Bán kính tính theo bề rộng mặt chơi.
struct TargetZoneRecord: Record {
  @Field var kind: String = "circle"
  @Field var center: PointRecord = PointRecord()
  @Field var radius: Double = 0
  @Field var radiusX: Double = 0
  @Field var radiusY: Double = 0
  @Field var label: String? = nil
}

/// `objectBallPath` · `cueBallPath` · `ghostBall` · `tangentLine` dùng `ball` + `pocket`;
/// `expectedCuePath` · `objectBallBankPath` dùng `points`; `railContact` dùng `point`.
struct GuideLineRecord: Record {
  @Field var kind: String = ""
  @Field var ball: Int = 0
  @Field var pocket: String = ""
  @Field var points: [PointRecord] = []
  @Field var point: PointRecord = PointRecord()
}

/// Vòng của drill nhiều vùng: vùng `zone` phải tới bằng kiểu `spin` (`draw` · `stun` · `follow` · `center`).
struct RoundRecord: Record {
  @Field var zone: Int = 0
  @Field var spin: String = ""
}

/// Cú của drill chạy bài cố định: tipX 0, `tipY` và `speed` (m/s) chép từ harness, hướng cơ giải từ chỗ bi cái dừng thật.
/// `zone` là chỉ số trong `cueBallTargetZones`, -1 là cú cuối không có zone.
struct ShotRecord: Record {
  @Field var ball: Int = 0
  @Field var pocket: String = ""
  @Field var tipY: Double = 0
  @Field var speed: Double = 0
  @Field var zone: Int = -1
}

struct DrillRecord: Record {
  @Field var id: String = ""
  /// "runout" thì Play shot chạy cả bàn theo planner thay vì một cú.
  @Field var skill: String = ""
  @Field var cueBall: PointRecord = PointRecord()
  @Field var objectBalls: [BallRecord] = []
  @Field var targetPocket: String = ""
  @Field var cueBallTargetZones: [TargetZoneRecord] = []
  @Field var guideLines: [GuideLineRecord] = []
  @Field var rounds: [RoundRecord] = []
  /// Có thì Play shot chơi đúng các cú này thay vì planner.
  @Field var shots: [ShotRecord] = []
}
