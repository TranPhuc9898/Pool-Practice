import CoreGraphics
import Foundation

/// Lọc một chuỗi số theo kiểu `smooth_angle` của Good-GYM: cửa sổ `window` khung gần nhất, bỏ điểm lệch trung vị quá
/// `2σ` của cửa sổ, lấy trung bình phần còn lại. Khung nil xoá cửa sổ và trả nil: không lấp chỗ Vision không thấy.
struct PoseFilter {
  var window = 5
  private var values: [Double] = []

  mutating func push(_ v: Double?) -> Double? {
    guard let v else { values = []; return nil }
    values.append(v)
    if values.count > window { values.removeFirst() }
    let n = Double(values.count)
    let m = median(values)
    let mean = values.reduce(0, +) / n
    let sd = (values.reduce(0) { $0 + ($1 - mean) * ($1 - mean) } / n).squareRoot()
    let kept = values.filter { abs($0 - m) <= 2 * sd }
    return kept.isEmpty ? m : kept.reduce(0, +) / Double(kept.count)
  }
}

/// `PoseFilter` cho từng toạ độ của một điểm.
struct PointFilter {
  private var x = PoseFilter()
  private var y = PoseFilter()

  mutating func push(_ p: CGPoint?) -> CGPoint? {
    guard let fx = x.push(p.map { Double($0.x) }), let fy = y.push(p.map { Double($0.y) }) else { return nil }
    return CGPoint(x: fx, y: fy)
  }
}

func median(_ v: [Double]) -> Double {
  guard !v.isEmpty else { return 0 }
  let s = v.sorted()
  return s.count % 2 == 1 ? s[s.count / 2] : (s[s.count / 2 - 1] + s[s.count / 2]) / 2
}
