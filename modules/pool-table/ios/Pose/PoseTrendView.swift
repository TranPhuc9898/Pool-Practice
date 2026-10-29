import Charts
import ExpoModulesCore
import SwiftUI

/// Một phiên trên biểu đồ: thời điểm, trung vị của số đo, có phải baseline.
struct TrendPoint: Record, Equatable {
  @Field var at: Double = 0
  @Field var value: Double = 0
  @Field var baseline: Bool = false

  static func == (l: Self, r: Self) -> Bool { l.at == r.at && l.value == r.value && l.baseline == r.baseline }
}

final class PoseTrendViewProps: ExpoSwiftUI.ViewProps {
  /// Sắp theo `at`, mili giây epoch.
  @Field var points: [TrendPoint] = []
  /// "L" hoặc "°", in ở trục dọc.
  @Field var unit: String = ""
}

/// Trung vị mỗi phiên của một số đo, nối theo thời gian. Baseline vẽ thêm vạch ngang xanh. Chỉ vẽ, không tính.
struct PoseTrendView: ExpoSwiftUI.View {
  @ObservedObject var props: PoseTrendViewProps

  var body: some View {
    let points = props.points.sorted { $0.at < $1.at }
    Chart {
      if let base = points.first(where: \.baseline) {
        RuleMark(y: .value("Baseline", base.value))
          .foregroundStyle(Color.green.opacity(0.6))
          .lineStyle(StrokeStyle(lineWidth: 1, dash: [4, 3]))
      }
      ForEach(Array(points.enumerated()), id: \.offset) { _, p in
        LineMark(x: .value("Session", Date(timeIntervalSince1970: p.at / 1000)), y: .value(props.unit, p.value))
          .foregroundStyle(Color.white.opacity(0.7))
        PointMark(x: .value("Session", Date(timeIntervalSince1970: p.at / 1000)), y: .value(props.unit, p.value))
          .foregroundStyle(p.baseline ? Color.green : Color.white)
      }
    }
    .chartYAxisLabel(props.unit)
  }
}
