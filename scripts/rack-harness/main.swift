import CoreGraphics
import Foundation

// Rail Cut theo luật BU Exam II S2: cú đầu ball in hand, cú sau đánh từ chỗ bi cái dừng, thứ tự bi tuỳ ý. Mỗi cú phải
// hợp lệ theo `RackInHandSolver.legal`: bi vào đúng lỗ, bi cái không rơi, không chạm bi khác. Dò bằng đúng ShotPhysics
// của app rồi in `cueBall` và `shots` để chép sang src/pool-engine/drills/18…20-*.ts.
// Drill nhiều bi khác (10, 13, 14, 16, 17, 40, 42, 43) dùng cùng cách dò, cộng luật riêng ghi trong `Drill`: bi cái đặt
// sẵn, thứ tự bi, bi cuối, lỗ gọi sẵn, cấm chạm băng, zone. Có zone thì in thêm `cueBallTargetZones` và `zone` từng cú.
// `sh run.sh 14 16` chỉ chạy drill 14 và 16, không tham số thì chạy hết.
// Ưu tiên lực thấp: thử trần lực tăng dần, trần đầu tiên dọn sạch bàn thì lấy. Trong một trần, cú để lại nhiều (bi, lỗ)
// còn đánh được được xét trước, hoà thì lực thấp trước. Cú phải còn hợp lệ ở ít nhất `minSafe` trên 45 mẫu lệch tay.
// `minSafe` 12, không phải 30: bi sát băng đánh từ xa trượt gần hết 30 mẫu có tipX ±0.1 (squirt đẩy bi mục tiêu rời
// băng rồi dừng trước lỗ), còn 15 mẫu tipX 0 thì gần như đạt hết. Ngưỡng 12 đòi bền theo lực và tipY, chấp nhận nhạy phê.
// `rate` là số mẫu lệch tay (như drill 23) mà cú vẫn hợp lệ, bi cái dừng trong zone nếu có, và từ chỗ bi cái dừng cú kế
// danh nghĩa vẫn hợp lệ.
// Toạ độ chép từ src/pool-engine/drills/*.ts, đổi sang inch (x·50, y·100).

struct Drill {
  let id: Int
  let balls: [(Int, CGFloat, CGFloat)]
  /// Cú đầu drill đã soạn (toạ độ chuẩn hoá, bi, lỗ): thử trước, không dọn được bàn mới quét lưới `places`.
  var first: (x: CGFloat, y: CGFloat, ball: Int, pocket: String)? = nil
  /// Bi cái đặt sẵn, không ball in hand: chỉ dò từ `first`.
  var fixed = false
  /// Thứ tự bắt buộc: bi kế là bi đầu dãy còn trên bàn.
  var order: [Int]? = nil
  /// Bi chỉ được đánh cuối.
  var last: Int? = nil
  /// Lỗ gọi sẵn theo bi; bi không có ở đây thì lỗ nào cũng được.
  var pockets: [Int: String] = [:]
  /// Bi cái chạm băng là hỏng lượt.
  var noRail = false
  /// Trần số băng bi cái chạm sau khi chạm bi (luật 3, `allowedRails` của drill).
  var maxRails: Int? = nil
  /// Zone có sẵn trong data: bi cái phải dừng trong đó sau khi pot bi n (chuẩn hoá, bán kính theo bề ngang).
  var zones: [Int: (x: CGFloat, y: CGFloat, r: CGFloat)] = [:]
  /// Bán kính zone (chuẩn hoá) cho cú chưa có zone, trừ cú cuối: zone quanh chỗ bi cái dừng danh nghĩa.
  var autoZone: CGFloat? = nil
  /// Mỗi (bi, lỗ) giữ mọi cặp tip × lực hợp lệ, không chỉ hai tip ở lực thấp nhất: bài đánh vị trí cần cả dải lực.
  var wide = false
  /// Bộ tipY riêng cho bài một kiểu đánh (stun, follow): chỉ dò trong bộ này.
  var tipSet: [CGFloat]? = nil
}

let drills = [
  Drill(id: 18, balls: [
    (1, 0.0225, 0.25), (2, 0.0225, 0.75), (3, 0.9775, 0.25), (4, 0.9775, 0.75),
    (5, 0.5, 0.0113), (6, 0.5, 0.9887), (7, 0.5, 0.5),
  ]),
  Drill(id: 19, balls: [
    (1, 0.0225, 0.25), (2, 0.0225, 0.75), (3, 0.9775, 0.25), (4, 0.9775, 0.75),
    (5, 0.25, 0.0113), (6, 0.5, 0.0113), (7, 0.75, 0.0113),
    (8, 0.25, 0.9887), (9, 0.5, 0.9887), (10, 0.75, 0.9887), (11, 0.5, 0.5),
  ]),
  Drill(id: 20, balls: [
    (2, 0.0225, 0.125), (1, 0.0225, 0.25), (3, 0.0225, 0.75), (4, 0.0225, 0.875),
    (5, 0.9775, 0.25), (6, 0.9775, 0.125), (7, 0.9775, 0.75), (8, 0.9775, 0.875),
    (9, 0.25, 0.0113), (10, 0.5, 0.0113), (11, 0.75, 0.0113),
    (12, 0.25, 0.9887), (13, 0.5, 0.9887), (14, 0.75, 0.9887), (15, 0.5, 0.5),
  ]),
  // Zone vẽ tay (0.404, 0.572) r 0.09 ngoài tầm engine: chỗ dừng hợp lệ gần nhất cách tâm 9", nên zone tự sinh.
  Drill(id: 10, balls: [(1, 0.8, 0.3), (2, 0.24, 0.4)], first: (0.6, 0.75, 1, "footRight"), fixed: true, order: [1, 2],
        pockets: [1: "footRight", 2: "footLeft"], autoZone: 0.09, wide: true),
  Drill(id: 13, balls: [(1, 0.5, 0.1875), (8, 0.5, 0.125), (2, 0.5, 0.0625)], first: (0.24, 0.32, 1, "footRight"),
        fixed: true, order: [1, 8, 2], pockets: [1: "footRight", 8: "footRight"], zones: [1: (0.32, 0.21, 0.07)],
        autoZone: 0.07, wide: true),
  Drill(id: 14, balls: [
    (1, 0.5, 0.5875), (2, 0.5, 0.52), (3, 0.5, 0.4525), (4, 0.5, 0.385), (5, 0.5, 0.3175), (6, 0.5, 0.25),
    (7, 0.635, 0.25), (8, 0.77, 0.25), (9, 0.905, 0.25),
  ], first: (0.72, 0.68, 1, "sideLeft"), order: Array(1...9)),
  Drill(id: 16, balls: [
    (1, 0.5, 0.445), (2, 0.5, 0.38), (3, 0.5, 0.315), (4, 0.5, 0.25), (5, 0.37, 0.25),
    (6, 0.24, 0.25), (7, 0.11, 0.25), (8, 0.63, 0.25), (9, 0.76, 0.25), (10, 0.89, 0.25),
  ], first: (0.24, 0.455, 1, "sideRight"), noRail: true),
  Drill(id: 17, balls: [
    (1, 0.25, 0.7), (2, 0.78, 0.62), (3, 0.72, 0.8), (4, 0.34, 0.96), (5, 0.52, 0.71),
    (6, 0.36, 0.32), (7, 0.74, 0.28), (8, 0.58, 0.13), (9, 0.4, 0.21),
  ], first: (0.45, 0.85, 1, "sideLeft"), order: Array(1...9), zones: [1: (0.2, 0.71, 0.09)], autoZone: 0.09),
  Drill(id: 40, balls: [
    (4, 0.068, 0.25), (1, 0.5, 0.966), (2, 0.5, 0.034), (3, 0.068, 0.75), (5, 0.932, 0.75), (8, 0.932, 0.25),
  ], first: (0.2, 0.45, 4, "footLeft"), last: 8),
  Drill(id: 42, balls: [
    (1, 0.0375, 0.125), (2, 0.0375, 0.1875), (3, 0.0375, 0.375),
    (4, 0.9625, 0.125), (5, 0.9625, 0.1875), (6, 0.9625, 0.375),
    (7, 0.9625, 0.875), (8, 0.9625, 0.8125), (9, 0.9625, 0.625),
    (10, 0.0375, 0.875), (11, 0.0375, 0.8125), (12, 0.0375, 0.625),
  ], pockets: [
    1: "footLeft", 2: "footLeft", 3: "footLeft", 4: "footRight", 5: "footRight", 6: "footRight",
    7: "headRight", 8: "headRight", 9: "headRight", 10: "headLeft", 11: "headLeft", 12: "headLeft",
  ]),
  Drill(id: 43, balls: [
    (1, 0.0225, 0.125), (2, 0.0225, 0.25), (3, 0.0225, 0.375), (4, 0.0225, 0.625), (5, 0.0225, 0.75),
    (6, 0.0225, 0.875), (7, 0.9775, 0.125), (8, 0.9775, 0.25), (9, 0.9775, 0.375), (10, 0.9775, 0.625),
    (11, 0.9775, 0.75), (12, 0.9775, 0.875), (13, 0.25, 0.01125), (14, 0.5, 0.01125), (15, 0.75, 0.01125),
  ], first: (0.15, 0.3, 1, "footLeft")),
  // Giáo trình giai đoạn 5–6 (87–92, 96): bàn tự soạn, rải mở, thứ tự rotation, ball in hand cú đầu.
  Drill(id: 87, balls: [(7, 0.3, 0.4), (8, 0.7, 0.55), (9, 0.45, 0.2)], order: [7, 8, 9], autoZone: 0.08),
  Drill(id: 88, balls: [
    (1, 0.6, 0.75), (2, 0.25, 0.55), (3, 0.75, 0.4), (4, 0.04, 0.3), (5, 0.55, 0.2), (6, 0.3, 0.12),
  ], order: Array(1...6), autoZone: 0.09),
  Drill(id: 90, balls: [(1, 0.5, 0.65), (2, 0.2, 0.45), (3, 0.8, 0.35), (4, 0.35, 0.2), (5, 0.65, 0.1)],
        order: Array(1...5), autoZone: 0.09),
  Drill(id: 91, balls: [
    (1, 0.7, 0.7), (2, 0.3, 0.85), (3, 0.15, 0.5), (4, 0.6, 0.45), (5, 0.85, 0.6),
    (6, 0.4, 0.3), (7, 0.8, 0.15), (8, 0.2, 0.15), (9, 0.55, 0.08),
  ], order: Array(1...9), autoZone: 0.09),
  Drill(id: 92, balls: [
    (1, 0.3, 0.75), (2, 0.7, 0.8), (3, 0.5, 0.6), (4, 0.15, 0.4), (5, 0.85, 0.45),
    (6, 0.35, 0.35), (7, 0.65, 0.25), (8, 0.2, 0.1), (9, 0.8, 0.1), (10, 0.5, 0.15),
  ], order: Array(1...10), autoZone: 0.08),
  // Bài vá giai đoạn 5 (100–103): bi cái đặt sẵn, thứ tự cố định, zone hẹp 3" quanh chỗ dừng.
  Drill(id: 100, balls: [(1, 0.4, 0.3), (2, 0.82, 0.35)], first: (0.52, 0.39, 1, "footLeft"), fixed: true, order: [1, 2],
        pockets: [1: "footLeft", 2: "footRight"], zones: [1: (0.62, 0.465, 0.06)], wide: true),
  Drill(id: 101, balls: [(1, 0.3, 0.75), (2, 0.2, 0.45)], first: (0.54, 0.55, 1, "headLeft"), fixed: true, order: [1, 2],
        pockets: [1: "headLeft"], autoZone: 0.06, wide: true),
  Drill(id: 102, balls: [(1, 0.25, 0.45), (2, 0.6, 0.8)], first: (0.6, 0.3, 1, "sideLeft"), fixed: true, order: [1, 2],
        pockets: [1: "sideLeft", 2: "headRight"], autoZone: 0.06, wide: true),
  Drill(id: 103, balls: [(1, 0.7, 0.25), (2, 0.3, 0.6), (3, 0.75, 0.85)], first: (0.4, 0.45, 1, "footRight"), fixed: true,
        order: [1, 2, 3], pockets: [1: "footRight"], autoZone: 0.06, wide: true),
  // Bài vá giai đoạn 6 (104, 106–108): bi cái đặt sẵn, thứ tự và lỗ cố định.
  Drill(id: 104, balls: [(1, 0.85, 0.2), (2, 0.15, 0.2)], first: (0.4, 0.85, 1, "footRight"), fixed: true, order: [1, 2],
        pockets: [1: "footRight", 2: "footLeft"], autoZone: 0.08, wide: true),
  Drill(id: 106, balls: [(1, 0.3, 0.3), (2, 0.75, 0.6)], first: (0.6, 0.45, 1, "footLeft"), fixed: true, order: [1, 2],
        pockets: [1: "footLeft", 2: "headRight"], autoZone: 0.05, wide: true),
  Drill(id: 107, balls: [(1, 0.7, 0.6), (2, 0.3, 0.25)], first: (0.3, 0.75, 1, "sideRight"), fixed: true, order: [1, 2],
        pockets: [1: "sideRight", 2: "footLeft"], autoZone: 0.05, wide: true),
  Drill(id: 108, balls: [(1, 0.25, 0.7), (2, 0.7, 0.3), (3, 0.3, 0.2)], first: (0.5, 0.55, 1, "headLeft"), fixed: true,
        order: [1, 2, 3], pockets: [1: "headLeft", 2: "footRight", 3: "footLeft"], autoZone: 0.06, wide: true),
  // PPC layout 1–6 (BU Exam V, Dr. Dave): ball in hand, 9-ball đi rotation (115, 116 rotation hay giữ bi 9 cuối
  // đều không dọn được nên để thứ tự tự do), 8-ball sọc tuỳ thứ tự rồi bi 8. Layout 5, 6
  // bỏ các bi trơn làm vật chắn vì chuẩn drill mục 4 bắt pot hết bi trên bàn.
  Drill(id: 114, balls: [(5, 0.25, 0.875), (8, 0.25, 0.625), (9, 0.25, 0.375), (7, 0.75, 0.875), (6, 0.75, 0.625)],
        order: [5, 6, 7, 8, 9], autoZone: 0.09),
  Drill(id: 115, balls: [(5, 0.25, 0.9775), (9, 0.25, 0.01125), (6, 0.75, 0.98875), (7, 0.75, 0.01125), (8, 0.9775, 0.625)],
        autoZone: 0.09),
  Drill(id: 116, balls: [(9, 0.045, 0.875), (6, 0.14, 0.0625), (8, 0.5, 0.25), (7, 0.5, 0.2275), (5, 0.63, 0.264)],
        autoZone: 0.09),
  Drill(id: 117, balls: [(9, 0.25, 0.875), (10, 0.75, 0.875), (11, 0.75, 0.5), (12, 0.75, 0.125), (8, 0.25, 0.125)],
        last: 8, autoZone: 0.09),
  Drill(id: 118, balls: [(9, 0.5, 0.125), (10, 0.75, 0.5), (11, 0.75, 0.125), (12, 0.955, 0.25), (8, 0.75, 0.01125)],
        last: 8, autoZone: 0.09),
  Drill(id: 119, balls: [(9, 0.045, 0.125), (10, 0.25, 0.98875), (11, 0.75, 0.98875), (12, 0.955, 0.125), (8, 0.955, 0.875)],
        last: 8, maxRails: 2, autoZone: 0.09),
  // Compact Play (Fedor): 4 vùng × 4 bi (bàn chỉ có 15 bi nên vùng cuối 3 bi), pot bi vùng nào thì bi cái dừng lại trong vùng đó.
  Drill(id: 122, balls: [
    (1, 0.04, 0.2), (2, 0.2, 0.12), (3, 0.32, 0.3), (4, 0.18, 0.4),
    (5, 0.96, 0.2), (6, 0.8, 0.12), (7, 0.68, 0.3), (8, 0.82, 0.4),
    (9, 0.04, 0.8), (10, 0.2, 0.88), (11, 0.32, 0.7), (12, 0.18, 0.6),
    (13, 0.96, 0.8), (14, 0.8, 0.88), (15, 0.68, 0.7),
  ], zones: [
    1: (0.25, 0.25, 0.24), 2: (0.25, 0.25, 0.24), 3: (0.25, 0.25, 0.24), 4: (0.25, 0.25, 0.24),
    5: (0.75, 0.25, 0.24), 6: (0.75, 0.25, 0.24), 7: (0.75, 0.25, 0.24), 8: (0.75, 0.25, 0.24),
    9: (0.25, 0.75, 0.24), 10: (0.25, 0.75, 0.24), 11: (0.25, 0.75, 0.24), 12: (0.25, 0.75, 0.24),
    13: (0.75, 0.75, 0.24), 14: (0.75, 0.75, 0.24), 15: (0.75, 0.75, 0.24),
  ]),
  // Line-of-Balls (Dr. Dave, VEPP II, BD 9/2012): chín bi trên đường tâm dọc, cách nhau một bi, bi 1 cách băng foot một bi.
  // Ball in hand, rotation. Bi 1–4 khoá vào góc foot phải, chỗ đặt cú đầu đo từ Diagram 1. Không khoá zone: khoá zone theo
  // Diagram 1 chỉ ra 8/9, thả tự do ra 9/9 (bi 5 góc foot phải, 6 và 8 lỗ giữa trái, 7 và 9 góc foot trái).
  Drill(id: 123, balls: (1...9).map { ($0, 0.5, (3.375 + 4.5 * CGFloat($0 - 1)) / 100) },
        first: (0.364, 0.035, 1, "footRight"), order: Array(1...9),
        pockets: [1: "footRight", 2: "footRight", 3: "footRight", 4: "footRight"],
        autoZone: 0.08),
  // Short-side (Eddie Vonderau): hai bi cách băng dài ~5" trên lỗ giữa, bi cái gần băng head.
  Drill(id: 124, balls: [(1, 0.1, 0.57), (2, 0.9, 0.57)], first: (0.55, 0.95, 1, "sideLeft"), fixed: true, order: [1, 2],
        pockets: [1: "sideLeft", 2: "sideRight"], autoZone: 0.06, wide: true),
  // Stun drill (APA / Fedor): bi 1 gần băng dài trái, ba bi sát băng dài phải, bi cái cạnh lỗ giữa trái. Chỉ stun.
  Drill(id: 125, balls: [(1, 0.07, 0.22), (2, 0.95, 0.376), (3, 0.95, 0.25), (4, 0.95, 0.12)], first: (0.19, 0.496, 1, "footLeft"),
        fixed: true, autoZone: 0.08, tipSet: [-0.1, -0.2]),
  // 6 bi follow (RioBilliard): sáu bi sát băng dài trái, bi cái giữa bàn. Chỉ follow.
  Drill(id: 126, balls: [(1, 0.0225, 0.864), (2, 0.0225, 0.751), (3, 0.0225, 0.602), (4, 0.0225, 0.374), (5, 0.0225, 0.241), (6, 0.0225, 0.105)],
        first: (0.53, 0.414, 1, "headLeft"), fixed: true, autoZone: 0.08, tipSet: [0.2, 0.3, 0.4]),
  // Corner drill (Fedor): hàng bi cách băng dài phải nửa bi, pot hết vào góc head right (thứ tự gần lỗ trước không dọn được).
  Drill(id: 128, balls: [(1, 0.955, 0.92), (2, 0.955, 0.84), (3, 0.955, 0.76), (4, 0.955, 0.68), (5, 0.955, 0.6)],
        pockets: [1: "headRight", 2: "headRight", 3: "headRight", 4: "headRight", 5: "headRight"], autoZone: 0.08),
  // Rock Around the Clock (Arielle Harrison / Niels Feijen): 12 bi cách băng một bi (pot theo vòng không dọn được, để thứ tự tự do).
  Drill(id: 129, balls: [
    (1, 0.25, 0.966), (2, 0.75, 0.966), (3, 0.9325, 0.875), (4, 0.9325, 0.625), (5, 0.9325, 0.375), (6, 0.9325, 0.125),
    (7, 0.75, 0.034), (8, 0.25, 0.034), (9, 0.0675, 0.125), (10, 0.0675, 0.375), (11, 0.0675, 0.625), (12, 0.0675, 0.875),
  ], autoZone: 0.09),
  // Land Mine (Dragon Billiards): chín bi rải, bi cái chạm bi nào khác bi đang đánh là hỏng.
  Drill(id: 130, balls: [
    (1, 0.5, 0.97), (2, 0.5, 0.9), (3, 0.2, 0.83), (4, 0.78, 0.83), (5, 0.5, 0.75),
    (6, 0.2, 0.62), (7, 0.88, 0.62), (8, 0.5, 0.45), (9, 0.5, 0.3),
  ], autoZone: 0.09),
  Drill(id: 96, balls: [
    (1, 0.5, 0.8), (2, 0.2, 0.65), (3, 0.8, 0.7), (4, 0.4, 0.5), (5, 0.75, 0.35),
    (6, 0.25, 0.3), (7, 0.6, 0.2), (8, 0.3, 0.08), (9, 0.7, 0.06),
  ], order: Array(1...9), autoZone: 0.07),
]

typealias SP = ShotPhysics
setvbuf(stdout, nil, _IOLBF, 0)
typealias Balls = [Int: CGPoint]

let tips: [CGFloat] = [0, -0.2, 0.2, -0.4, 0.4]
/// Drill đánh vị trí (`wide` hay có zone sẵn) dò tip mịn tới `SP.tipMax`: zone nhỏ cần đúng lượng xoáy.
let fine: [CGFloat] = [0, -0.1, 0.1, -0.2, 0.2, -0.3, 0.3, -0.4, 0.4, -0.5, 0.5, -0.6, 0.6]
let speeds: [CGFloat] = [0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.1, 2.4, 2.8, 3.2, 3.6]
let caps: [CGFloat] = [1.2, 1.4, 1.6, 1.8, 2.1, 2.4, 2.8, 3.6]
/// Chỗ đặt bi cái cú đầu: khoảng cách tới ghost (inch) × độ lệch hướng so với đường ghost→lỗ (độ).
let distances: [CGFloat] = [9, 12, 18, 24]
let angles: [CGFloat] = [0, 10, -10, 20, -20, 30, -30]
let minSafe = 12
let beam = 3
let firsts = 6
let budget: TimeInterval = 8

/// Drill đang dò. Các hàm dưới đọc luật từ đây.
var rule = drills[0]

func inch(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: x * 50, y: y * 100) }

/// Như `FixedShot.setup` của app: bi khác xếp theo số.
func setup(_ b: Balls, _ n: Int, _ p: String) -> SP.Setup {
  let others = b.filter { $0.key != 0 && $0.key != n }.map { SP.Obstacle(n: $0.key, p: $0.value) }.sorted { $0.n < $1.n }
  return SP.Setup(c: b[0]!, o: b[n]!, pocket: p, others: others, ball: n)
}

/// Bi được đánh ở thế `b` theo luật drill, tăng dần theo số.
func allowed(_ b: Balls) -> [Int] {
  let left = b.keys.filter { $0 != 0 }.sorted()
  if let o = rule.order, let n = o.first(where: { b[$0] != nil }) { return [n] }
  if let l = rule.last, left.count > 1 { return left.filter { $0 != l } }
  return left
}

func pocketsFor(_ n: Int) -> [String] { rule.pockets[n].map { [$0] } ?? RackInHandSolver.pocketOrder }

/// `simulate` kẹp tâm bi về đúng R hay cạnh bàn trừ R mỗi lần dội băng và lấy mẫu ngay lúc đó.
func railed(_ r: SP.Run) -> Bool {
  let R = SP.ballRadius + 1e-3
  return (r.pre.pts + r.pts).contains { $0.x <= R || $0.x >= SP.width - R || $0.y <= R || $0.y >= SP.length - R }
}

/// Băng bi cái chạm sau khi chạm bi: vận tốc đổi dấu theo pháp tuyến khi bi sát băng, cùng cách đếm của audit.
func railsPost(_ r: SP.Run) -> Int {
  let e = SP.ballRadius + 0.1
  var n = 0
  if r.vs.count > 1 { for i in 1..<min(r.vs.count, r.pts.count) {
    let p = r.pts[i], a = r.vs[i - 1], b = r.vs[i]
    if (p.x < e && a.x < 0 && b.x > 0) || (p.x > SP.width - e && a.x > 0 && b.x < 0) { n += 1 }
    if (p.y < e && a.y < 0 && b.y > 0) || (p.y > SP.length - e && a.y > 0 && b.y < 0) { n += 1 }
  } }
  return n
}

func ok(_ r: SP.Run, _ n: Int, _ p: String) -> Bool {
  RackInHandSolver.legal(r, ball: n, pocket: p) && !(rule.noRail && railed(r)) && rule.maxRails.map { railsPost(r) <= $0 } != false
}

func inside(_ s: CGPoint, _ z: (c: CGPoint, r: CGFloat)) -> Bool { hypot(s.x - z.c.x, s.y - z.c.y) <= z.r }

/// Số cặp (bi, lỗ) đánh được từ chỗ bi cái đang đứng.
func value(_ b: Balls) -> Int {
  var v = 0
  for n in allowed(b) {
    for p in pocketsFor(n) where (SP.shotOf(ball: n, pocket: p, balls: b)?.level ?? .bad) != .bad { v += 1 }
  }
  return v
}

/// 45 mẫu lệch tay quanh cú danh nghĩa, hướng cơ giữ như cú danh nghĩa. `judge` nhận lần chạy, trả đạt hay không.
func samples(_ ms: SP.Setup, tipY: CGFloat, speed: CGFloat, aim: CGFloat, _ judge: (SP.Run) -> Bool) -> Int {
  var k = 0
  for m in [0.9, 0.95, 1, 1.05, 1.1] as [CGFloat] { for dx in [-0.1, 0, 0.1] as [CGFloat] { for dy in [-0.1, 0, 0.1] as [CGFloat] {
    if judge(SP.runWith(ms, tipX: dx, tipY: tipY + dy, speed: speed * m, aim: aim)) { k += 1 }
  } } }
  return k
}

/// `zone` là chỗ bi cái phải dừng sau cú, inch. Cú cuối không có.
struct Cand {
  let ball: Int; let pocket: String; let tipY: CGFloat; let speed: CGFloat; let before: Balls; let after: Balls; let value: Int
  let zone: (c: CGPoint, r: CGFloat)?
}

/// Mọi cú hợp lệ từ thế `b` có lực ≤ `cap`, mỗi (bi, lỗ) giữ tối đa hai tip ở lực thấp nhất còn dư 10% lực, tip giữa trước.
/// Bàn sau cú: bi cái về chỗ dừng, bi mục tiêu rời bàn, bi bị chạm về chỗ dừng hoặc rời bàn nếu rơi lỗ.
func after(_ b: Balls, _ n: Int, _ r: SP.Run) -> Balls {
  var a = b; a[n] = nil; a[0] = r.stop
  for (k, t) in r.moved { a[k] = t.pocket == nil ? t.stop : nil }
  return a
}

/// Cú có zone sẵn trong data thì mỗi tip lấy lực có chỗ dừng danh nghĩa trong zone và gần tâm nhất, giữ hai tip gần nhất.
/// Drill `wide` giữ mọi cú hợp lệ (có zone thì mọi cú dừng trong zone) và xếp theo độ bền thay cho lực thấp.
func cands(_ b: Balls, cap: CGFloat) -> [Cand] {
  var out: [Cand] = []
  func add(_ n: Int, _ p: String, _ t: CGFloat, _ v: CGFloat, _ r: SP.Run, _ z: (c: CGPoint, r: CGFloat)?) {
    let a = after(b, n, r)
    out.append(Cand(ball: n, pocket: p, tipY: t, speed: v, before: b, after: a, value: value(a), zone: z))
  }
  for n in allowed(b) {
    for p in pocketsFor(n) {
      guard (SP.shotOf(ball: n, pocket: p, balls: b)?.level ?? .bad) != .bad else { continue }
      let ms = setup(b, n, p)
      let last = b.count <= 2
      if !last, let z = rule.zones[n].map({ (c: inch($0.x, $0.y), r: $0.r * 50) }) {
        var near: [CGFloat: (v: CGFloat, r: SP.Run, d: CGFloat)] = [:]
        for v in speeds where v <= cap {
          for t in rule.tipSet ?? fine {
            let r = SP.runWith(ms, tipX: 0, tipY: t, speed: v)
            let d = hypot(r.stop.x - z.c.x, r.stop.y - z.c.y)
            guard d <= z.r, rule.wide || d < near[t]?.d ?? .infinity, ok(r, n, p),
                  ok(SP.runWith(ms, tipX: 0, tipY: t, speed: v * 0.9), n, p) else { continue }
            if rule.wide { add(n, p, t, v, r, z) } else { near[t] = (v, r, d) }
          }
        }
        for (t, e) in near.sorted(by: { $0.value.d < $1.value.d }).prefix(2) { add(n, p, t, e.v, e.r, z) }
        continue
      }
      var seen = Set<CGFloat>()
      search: for v in speeds where v <= cap {
        for t in rule.tipSet ?? (rule.wide ? fine : tips) {
          guard !seen.contains(t) else { continue }
          let r = SP.runWith(ms, tipX: 0, tipY: t, speed: v)
          // Lực thấp nhất còn hợp lệ nằm sát mép: hụt 10% là bi không tới lỗ. Cú phải còn hợp lệ ở 0.9 lần lực.
          guard ok(r, n, p), ok(SP.runWith(ms, tipX: 0, tipY: t, speed: v * 0.9), n, p) else { continue }
          add(n, p, t, v, r, last ? nil : rule.autoZone.map { (r.stop, $0 * 50) })
          if rule.wide { continue }
          seen.insert(t)
          if seen.count >= 2 { break search }
        }
      }
    }
  }
  if rule.wide {
    return out.map { ($0, rate($0, next: nil)) }.sorted { ($0.0.value, $0.1) > ($1.0.value, $1.1) }.map(\.0)
  }
  return out.sorted { ($0.value, -$0.speed) > ($1.value, -$1.speed) }
}

func safe(_ c: Cand) -> Bool {
  let ms = setup(c.before, c.ball, c.pocket)
  let nom = SP.runWith(ms, tipX: 0, tipY: c.tipY, speed: c.speed)
  return samples(ms, tipY: c.tipY, speed: c.speed, aim: atan2(nom.a.y, nom.a.x)) { ok($0, c.ball, c.pocket) } >= minSafe
}

func dfs(_ b: Balls, _ path: [Cand], cap: CGFloat, _ best: inout [Cand], _ deadline: Date) {
  if path.count > best.count { best = path }
  if b.count == 1 || Date() > deadline { return }
  var picked: [Cand] = []
  for c in cands(b, cap: cap) where picked.count < beam && safe(c) { picked.append(c) }
  for c in picked {
    dfs(c.after, path + [c], cap: cap, &best, deadline)
    if best.count == path.count + b.count - 1 { return }
  }
}

/// Chỗ đặt bi cái cú đầu cho (bi n, lỗ p): quét lưới quanh đường ghost→lỗ, giữ chỗ không đè bi, cú còn ok/warn.
func places(_ n: Int, _ p: String, _ b: Balls) -> [CGPoint] {
  guard let o = b[n], let P = SP.target(p) else { return [] }
  let R = SP.ballRadius
  let (G, d) = SP.ghost(o, P)
  var out: [CGPoint] = []
  for dist in distances {
    for deg in angles {
      let a = deg * .pi / 180
      let u = CGPoint(x: d.x * cos(a) - d.y * sin(a), y: d.x * sin(a) + d.y * cos(a))
      // Làm tròn như `num` in ra file, để route kiểm đúng toạ độ app đọc: cú sượt bi khác lật kết quả chỉ vì 0.01".
      let c = CGPoint(x: ((G.x - u.x * dist) / SP.width * 1e4).rounded() / 1e4 * SP.width,
                      y: ((G.y - u.y * dist) / SP.length * 1e4).rounded() / 1e4 * SP.length)
      guard c.x >= R, c.x <= SP.width - R, c.y >= R, c.y <= SP.length - R,
            !b.contains(where: { $0.key != 0 && hypot($0.value.x - c.x, $0.value.y - c.y) < SP.ballDiameter }) else { continue }
      var placed = b
      placed[0] = c
      if (SP.shotOf(ball: n, pocket: p, balls: placed)?.level ?? .bad) != .bad { out.append(c) }
    }
  }
  return out
}

func cutDeg(_ c: CGPoint, _ o: CGPoint, _ P: CGPoint) -> CGFloat {
  let g = SP.ghost(o, P).g, a = CGPoint(x: g.x - c.x, y: g.y - c.y), b = CGPoint(x: P.x - o.x, y: P.y - o.y)
  return abs(atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y)) * 180 / .pi
}

let pocketWords = ["footLeft": "foot left corner", "footRight": "foot right corner", "sideLeft": "left side pocket",
                   "sideRight": "right side pocket", "headLeft": "head left corner", "headRight": "head right corner"]

func why(_ c: Cand, next: Cand?) -> String {
  let cut = Int(cutDeg(c.before[0]!, c.before[c.ball]!, SP.target(c.pocket)!).rounded())
  let stroke = c.tipY < -0.1 ? "Draw" : c.tipY > 0.1 ? "Follow" : "Center ball"
  guard let nx = next else { return "\(cut)° cut, last ball. \(stroke), soft enough to keep the cue ball out of the pockets." }
  let o = nx.before[nx.ball]!, s = nx.before[0]!
  let gap = Int((hypot(o.x - s.x, o.y - s.y) / 12.5).rounded())
  let nc = Int(cutDeg(s, o, SP.target(nx.pocket)!).rounded())
  let an = nc == 8 || nc == 11 || nc == 18 || (80...89).contains(nc)
  return "\(cut)° cut. \(stroke) leaves the cue ball about \(max(gap, 1)) diamond\(gap > 1 ? "s" : "") from ball \(nx.ball) with \(an ? "an" : "a") \(nc)° cut into the \(pocketWords[nx.pocket]!)."
}

func rate(_ c: Cand, next: Cand?) -> Int {
  let ms = setup(c.before, c.ball, c.pocket)
  let nom = SP.runWith(ms, tipX: 0, tipY: c.tipY, speed: c.speed)
  return samples(ms, tipY: c.tipY, speed: c.speed, aim: atan2(nom.a.y, nom.a.x)) { r in
    guard ok(r, c.ball, c.pocket) else { return false }
    if let z = c.zone, !inside(r.stop, z) { return false }
    guard let nx = next else { return true }
    let a = after(c.before, c.ball, r)
    return ok(SP.runWith(setup(a, nx.ball, nx.pocket), tipX: 0, tipY: nx.tipY, speed: nx.speed), nx.ball, nx.pocket)
  }
}

func num(_ v: CGFloat) -> String {
  var s = String(format: "%.4f", v)
  while s.hasSuffix("0") { s.removeLast() }
  if s.hasSuffix(".") { s.removeLast() }
  return s
}

let only = Set(CommandLine.arguments.dropFirst().compactMap { Int($0) })
for d in drills where only.isEmpty || only.contains(d.id) {
  rule = d
  var start: Balls = [:]
  for (n, x, y) in d.balls { start[n] = inch(x, y) }
  let total = d.balls.count
  let t0 = Date()
  var best: [Cand] = []
  var usedCap: CGFloat = 0
  let open = RackInHandSolver.openPockets(start)
  // Mỗi trần lực: cú đầu drill đã soạn đứng trước, rồi mọi cú đầu ball in hand (chỗ đặt × bi × lỗ) xếp theo thế để lại.
  // Lấy `firsts` cú đầu, DFS mỗi cú tối đa `budget` giây.
  capLoop: for cap in caps {
    var opens: [Cand] = []
    if let f = d.first {
      var b = start
      b[0] = inch(f.x, f.y)
      opens = cands(b, cap: cap).filter { $0.ball == f.ball && $0.pocket == f.pocket }
    }
    if !d.fixed {
      var grid: [Cand] = []
      for n in allowed(start) {
        for p in open[n] ?? [] where pocketsFor(n).contains(p) {
          for c in places(n, p, start) {
            var b = start
            b[0] = c
            if let f = cands(b, cap: cap).first(where: { $0.ball == n && $0.pocket == p }) { grid.append(f) }
          }
        }
      }
      opens += grid.sorted { ($0.value, -$0.speed) > ($1.value, -$1.speed) }
    }
    var tried = 0
    for first in opens where tried < firsts && safe(first) {
      tried += 1
      var rest: [Cand] = []
      dfs(first.after, [], cap: cap, &rest, Date().addingTimeInterval(budget))
      if rest.count + 1 > best.count { best = [first] + rest; usedCap = cap }
      if best.count == total { break capLoop }
    }
    print("// \(d.id) trần \(cap): \(opens.count) cú đầu, tốt nhất \(best.count)/\(total)")
  }
  let ms = Date().timeIntervalSince(t0) * 1000
  print("// \(d.id): \(best.count)/\(total), trần lực \(usedCap) m/s, \(Int(ms)) ms")
  guard let c0 = best.first?.before[0] else { continue }
  print("cueBall: { x: \(num(c0.x / 50)), y: \(num(c0.y / 100)) },")
  // Zone theo thứ tự cú, nhãn là bi kế. Cú cuối của route không có zone.
  let zoned = best.indices.filter { $0 + 1 < best.count && best[$0].zone != nil }
  if !zoned.isEmpty {
    print("cueBallTargetZones: [")
    for i in zoned {
      let z = best[i].zone!
      print("  { kind: 'circle', center: { x: \(num(z.c.x / 50)), y: \(num(z.c.y / 100)) }, radius: \(num(z.r / 50)), label: '\(best[i + 1].ball)' },")
    }
    print("],")
  }
  print("shots: [")
  for (i, c) in best.enumerated() {
    let next = i + 1 < best.count ? best[i + 1] : nil
    let w = why(c, next: next).replacingOccurrences(of: "'", with: "\\'")
    let z = zoned.firstIndex(of: i).map { "zone: \($0), " } ?? ""
    print("  { ball: \(c.ball), pocket: '\(c.pocket)', tipY: \(num(c.tipY)), speed: \(num(c.speed)), \(z)rate: \(rate(c, next: next)), why: '\(w)' },")
  }
  print("],")
}
