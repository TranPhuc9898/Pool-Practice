import CoreGraphics

/// Kích thước bàn 9ft theo WPA, đơn vị inch. Mặt chơi đo từ mũi băng tới mũi băng.
enum PoolTableSpec {
  static let playWidth: CGFloat = 50
  static let playLength: CGFloat = 100
  static let ballDiameter: CGFloat = 2.25
  /// Bề rộng băng cao su, từ mũi băng ra mép gỗ.
  static let cushionWidth: CGFloat = 2
  /// Tổng bề rộng thành bàn tính cả băng (WPA cho 4–7.5").
  static let railWidth: CGFloat = 5.5
  static let cornerMouth: CGFloat = 4.5
  static let sideMouth: CGFloat = 5
  /// Khoảng cách giữa hai diamond liền nhau.
  static let diamondSpacing: CGFloat = 12.5
  /// Tâm diamond cách mũi băng.
  static let diamondInset: CGFloat = 3 + 11.0 / 16
  /// Head spot và foot spot nằm ở 1/4 chiều dài tính từ băng ngắn tương ứng.
  static let spotInset: CGFloat = 25
}

/// Hình học đã quy ra point cho một container cụ thể.
///
/// Toạ độ chuẩn hoá: `x` 0…1 dọc theo chiều rộng 50", `y` 0…1 dọc theo chiều dài 100",
/// foot rail ở `y = 0`, head rail ở `y = 1`. Dọc: head rail ở dưới. Ngang: head rail ở trái.
struct PoolTableGeometry: Equatable {
  struct Pocket: Equatable {
    var center: CGPoint
    var radius: CGFloat
  }

  let container: CGSize
  let isLandscape: Bool
  /// Point trên một inch.
  let scale: CGFloat
  /// Khung mặt chơi trên màn, đã xoay nếu ngang.
  let playRect: CGRect
  let tableRect: CGRect

  init(container: CGSize) {
    self.container = container
    isLandscape = container.width > container.height

    let totalShort = PoolTableSpec.playWidth + 2 * PoolTableSpec.railWidth
    let totalLong = PoolTableSpec.playLength + 2 * PoolTableSpec.railWidth
    let screenW = isLandscape ? totalLong : totalShort
    let screenH = isLandscape ? totalShort : totalLong
    scale = max(0, min(container.width / screenW, container.height / screenH))

    let tableSize = CGSize(width: screenW * scale, height: screenH * scale)
    tableRect = CGRect(
      x: (container.width - tableSize.width) / 2,
      y: (container.height - tableSize.height) / 2,
      width: tableSize.width,
      height: tableSize.height
    )
    playRect = tableRect.insetBy(dx: PoolTableSpec.railWidth * scale, dy: PoolTableSpec.railWidth * scale)
  }

  var ballDiameter: CGFloat { PoolTableSpec.ballDiameter * scale }

  /// Bề rộng mặt chơi trên màn (cạnh ngắn), dùng cho tỉ lệ bi.
  var playWidthPoints: CGFloat { isLandscape ? playRect.height : playRect.width }

  /// Toạ độ chuẩn hoá → point.
  func point(x: CGFloat, y: CGFloat) -> CGPoint {
    if isLandscape {
      return CGPoint(x: playRect.minX + (1 - y) * playRect.width, y: playRect.minY + x * playRect.height)
    }
    return CGPoint(x: playRect.minX + x * playRect.width, y: playRect.minY + y * playRect.height)
  }

  /// Toạ độ inch trên mặt chơi (0…50, 0…100) → point.
  func point(inchesX: CGFloat, inchesY: CGFloat) -> CGPoint {
    point(x: inchesX / PoolTableSpec.playWidth, y: inchesY / PoolTableSpec.playLength)
  }

  /// Point → toạ độ chuẩn hoá, kẹp trong mặt chơi.
  func normalized(_ p: CGPoint) -> (x: CGFloat, y: CGFloat) {
    let u = (p.x - playRect.minX) / max(playRect.width, 1)
    let v = (p.y - playRect.minY) / max(playRect.height, 1)
    let (x, y) = isLandscape ? (v, 1 - u) : (u, v)
    return (min(max(x, 0), 1), min(max(y, 0), 1))
  }

  /// Sáu lỗ. Lỗ góc lùi ra ngoài theo đường chéo, lỗ giữa lùi ra ngoài băng dài.
  var pockets: [Pocket] {
    let w = PoolTableSpec.playWidth
    let l = PoolTableSpec.playLength
    let cornerR = PoolTableSpec.cornerMouth / 2 * scale
    let sideR = PoolTableSpec.sideMouth / 2 * scale
    let c: CGFloat = 0.9
    let s: CGFloat = 1.6
    return [
      Pocket(center: point(inchesX: -c, inchesY: -c), radius: cornerR),
      Pocket(center: point(inchesX: w + c, inchesY: -c), radius: cornerR),
      Pocket(center: point(inchesX: -s, inchesY: l / 2), radius: sideR),
      Pocket(center: point(inchesX: w + s, inchesY: l / 2), radius: sideR),
      Pocket(center: point(inchesX: -c, inchesY: l + c), radius: cornerR),
      Pocket(center: point(inchesX: w + c, inchesY: l + c), radius: cornerR),
    ]
  }

  /// 18 diamond: 3 trên mỗi băng ngắn, 6 trên mỗi băng dài (bỏ vị trí lỗ giữa).
  var diamonds: [CGPoint] {
    let w = PoolTableSpec.playWidth
    let l = PoolTableSpec.playLength
    let d = PoolTableSpec.diamondInset
    let step = PoolTableSpec.diamondSpacing
    var result: [CGPoint] = []
    for i in 1...3 {
      let x = CGFloat(i) * step
      result.append(point(inchesX: x, inchesY: -d))
      result.append(point(inchesX: x, inchesY: l + d))
    }
    for i in 1...7 where i != 4 {
      let y = CGFloat(i) * step
      result.append(point(inchesX: -d, inchesY: y))
      result.append(point(inchesX: w + d, inchesY: y))
    }
    return result
  }

  var footSpot: CGPoint { point(inchesX: PoolTableSpec.playWidth / 2, inchesY: PoolTableSpec.spotInset) }
  var centerSpot: CGPoint { point(x: 0.5, y: 0.5) }
  var headSpot: CGPoint {
    point(inchesX: PoolTableSpec.playWidth / 2, inchesY: PoolTableSpec.playLength - PoolTableSpec.spotInset)
  }
}
