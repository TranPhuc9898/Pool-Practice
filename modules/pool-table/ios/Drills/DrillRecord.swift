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
/// `expectedCuePath` dùng `points`; `railContact` dùng `point`.
struct GuideLineRecord: Record {
  @Field var kind: String = ""
  @Field var ball: Int = 0
  @Field var pocket: String = ""
  @Field var points: [PointRecord] = []
  @Field var point: PointRecord = PointRecord()
}

struct DrillRecord: Record {
  @Field var id: String = ""
  @Field var cueBall: PointRecord = PointRecord()
  @Field var objectBalls: [BallRecord] = []
  @Field var targetPocket: String = ""
  @Field var cueBallTargetZones: [TargetZoneRecord] = []
  @Field var guideLines: [GuideLineRecord] = []
}
