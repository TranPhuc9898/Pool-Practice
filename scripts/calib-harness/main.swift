import CoreGraphics
import Foundation

// Test hiệu chỉnh của .claude/ke-hoach/2026-10-18-hieu-chinh-engine.md, dựng lại bằng đúng ShotPhysics của app:
// S (squirt), A (cản lăn), E (stop), C/D (băng có phê) theo bảng TEST của docs/research/2026-10-08-vat-ly-bi.md.
// In số mô phỏng cạnh số đo bàn thật trong do.csv (`test,lan,gia_tri,ngay`, thập phân dùng dấu chấm).
// Comment từng test ghi đúng đại lượng `gia_tri`; phiếu đo phải đo đúng đại lượng đó.

typealias SP = ShotPhysics
/// Tâm bi lúc chạm băng đầu (y = 100).
let railY = SP.length - SP.ballRadius
let deg = CGFloat.pi / 180

/// Bi cái đi một mình: bi mục tiêu nằm cạnh lỗ foot trái, xa mọi đường test. Trả đường bi cái qua băng tới khi dừng,
/// và hướng bi cái thật sau squirt.
func alone(_ c: CGPoint, aim: CGFloat, tipX: CGFloat, tipY: CGFloat, speed: CGFloat) -> (pre: SP.Trace, L: CGPoint) {
  let ms = SP.Setup(c: c, o: CGPoint(x: 3, y: 3), pocket: "footLeft", others: [])
  let h = SP.hit(ms, aim: aim, tipX: tipX, tipY: tipY, speed: speed)!
  return (h.pre, h.L)
}

/// Mẫu đầu tiên sau lần chạm băng đầu. `simulate` lấy mẫu đúng lúc dội, nên vận tốc mẫu đó là vận tốc rời băng.
func firstBounce(_ tr: SP.Trace) -> Int {
  guard let i = tr.vs.firstIndex(where: { $0.y < 0 }), i > 0 else { fatalError("bi cái không tới băng đầu") }
  return i
}

// S — squirt. Tâm bi cái cách chỗ tâm chạm băng xa 80" (mép bi tới mũi băng 80"), cơ nằm ngang, tipX 0,5R, tipY 0,
// 2 m/s, ngắm vuông góc băng xa. gia_tri: khoảng ngang từ đường ngắm tới tâm bi lúc chạm băng xa, inch, bỏ dấu
// (bi luôn lệch về phía ngược phê).
func testS() -> CGFloat {
  let c = CGPoint(x: 25, y: railY - 80)
  let tr = alone(c, aim: 90 * deg, tipX: 0.5, tipY: 0, speed: 2).pre
  let i = firstBounce(tr), p = tr.pts[i - 1], v = tr.vs[i - 1]
  return abs(p.x + (railY - p.y) * v.x / v.y - c.x)
}

// A — cản lăn. Bi lăn đều (không trượt) rời chỗ 1 m/s, đi thẳng không chạm băng tới khi dừng; d là quãng, t là thời
// gian. gia_tri: μr = 2d/(g·t²). Mô hình hãm đều nên μr không phụ thuộc tốc đầu.
func testA() -> (mu: CGFloat, d: CGFloat, t: CGFloat) {
  let ap = SP.approach(L: 1e9, tip: SP.rollTip, v0: SP.inchesPerMeter)
  return (2 * ap.s / (SP.gravity * ap.t * ap.t), ap.s, ap.t)
}

// E — stop. Khe giữa mép bi cái và mép bi mục tiêu 20" (tâm cách 22,25", cùng cách hiểu với sim −0,29R của research),
// bi cái rời cơ 2 m/s, thẳng tâm, cơ nằm ngang. gia_tri: tipY theo R (âm là dưới tâm) làm bi cái đứng yên ngay sau chạm.
func testE() -> CGFloat {
  let ms = SP.Setup(c: CGPoint(x: 25, y: 30), o: CGPoint(x: 25, y: 52.25), pocket: "headLeft", others: [])
  guard let b = SP.stunTip(ms, speed: 2) else { fatalError("E: kéo tối đa vẫn tới nơi đã lăn") }
  return b
}

// C/D — băng có phê. Bi cái đi thẳng 30" (tâm lúc đặt tới tâm lúc chạm băng), góc tới 30° hay 45° so với pháp tuyến
// băng, cơ nằm ngang, tipY 0, tipX 0,4R, lực sao cho tới băng còn 1 m/s; tới đó bi đã lăn đều. gia_tri: góc ra lúc bi
// lăn đều trở lại sau băng (cách băng 7–11 cm) so với pháp tuyến, độ, dương là cùng chiều đi dọc băng lúc vào. Góc ngay
// sau băng không dùng: bi rời băng còn trượt nên đường cong ngay, camera không đọc được. `+` phê thuận (phê về phía bi đi dọc băng),
// `−` phê nghịch. Ở đây bi đi về +x vào băng y = 100; tipX > 0 là phê phải (squirt sang trái, xem `rot`), nhìn theo
// hướng bi đi thì +x nằm bên trái, nên phê thuận là tipX < 0.
struct Bank { let out: CGFloat; let vIn: CGFloat; let v0: CGFloat }
func bank(_ a: CGFloat, tipX: CGFloat, speed: CGFloat) -> Bank {
  let run: CGFloat = 30, th = a * deg
  let c = CGPoint(x: 25 - run * sin(th), y: railY - run * cos(th))
  let want = atan2(cos(th), sin(th))
  // Squirt là phép quay cố định theo tipX, ngắm bù một lần là bi đi đúng góc tới.
  let L = alone(c, aim: want, tipX: tipX, tipY: 0, speed: speed).L
  let tr = alone(c, aim: 2 * want - atan2(L.y, L.x), tipX: tipX, tipY: 0, speed: speed).pre
  let i = firstBounce(tr), vi = tr.vs[i - 1], wi = tr.ws[i - 1]
  guard abs(atan2(vi.x, vi.y) / deg - a) < 0.05 else { fatalError("C/D: góc tới lệch \(atan2(vi.x, vi.y) / deg)") }
  guard hypot(vi.x - wi.x, vi.y - wi.y) < 1e-6 else { fatalError("C/D: bi còn trượt lúc tới băng") }
  guard let k = (i..<tr.vs.count).first(where: { hypot(tr.vs[$0].x - tr.ws[$0].x, tr.vs[$0].y - tr.ws[$0].y) < 1e-6 }),
        tr.vs[i...k].allSatisfy({ $0.y < 0 }) else { fatalError("C/D: bi không lăn lại trước băng sau") }
  let vo = tr.vs[k]
  return Bank(out: atan2(vo.x, -vo.y) / deg, vIn: hypot(vi.x, vi.y) / SP.inchesPerMeter, v0: speed)
}
func testCD(_ a: CGFloat, running: Bool) -> Bank {
  let tipX: CGFloat = running ? -0.4 : 0.4
  var lo: CGFloat = 0.5, hi: CGFloat = 4
  for _ in 0..<40 {
    let m = (lo + hi) / 2
    if bank(a, tipX: tipX, speed: m).vIn < 1 { lo = m } else { hi = m }
  }
  return bank(a, tipX: tipX, speed: (lo + hi) / 2)
}

// MARK: số đo

let keys = ["S", "A", "E", "CD30+", "CD30-", "CD45+", "CD45-"]
struct Measured { var vals: [Double] = []; var days: [String] = [] }

func fail(_ s: String) -> Never {
  FileHandle.standardError.write((s + "\n").data(using: .utf8)!)
  exit(1)
}

func readDo(_ path: String) -> [String: Measured] {
  guard let text = try? String(contentsOfFile: path, encoding: .utf8) else { fail("không đọc được \(path)") }
  var m: [String: Measured] = [:]
  for (n, raw) in text.components(separatedBy: "\n").enumerated().dropFirst() {
    let line = raw.trimmingCharacters(in: .whitespacesAndNewlines)
    if line.isEmpty { continue }
    let f = line.split(separator: ",", omittingEmptySubsequences: false).map { $0.trimmingCharacters(in: .whitespaces) }
    let key = f[0].replacingOccurrences(of: "−", with: "-")
    guard f.count == 4, keys.contains(key), let v = Double(f[2]) else {
      fail("do.csv dòng \(n + 1) sai: \(line) (cần 4 cột, test là \(keys.joined(separator: " ")), thập phân dùng dấu chấm)")
    }
    m[key, default: Measured()].vals.append(v)
    m[key]!.days.append(f[3])
  }
  return m
}

let measured = readDo(CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "do.csv")

func show(_ m: Measured?, _ p: Int) -> String {
  guard let m, !m.vals.isEmpty else { return "đo=chưa có" }
  let n = Double(m.vals.count), mean = m.vals.reduce(0, +) / n, fmt = "%.\(p)f"
  let days = Set(m.days).sorted(), d = days.count == 1 ? days[0] : "\(days.first!)…\(days.last!)"
  if m.vals.count == 1 { return "đo=\(String(format: fmt, mean)) n=1 (\(d))" }
  let sd = (m.vals.map { ($0 - mean) * ($0 - mean) }.reduce(0, +) / (n - 1)).squareRoot()
  return "đo=\(String(format: fmt, mean))±\(String(format: fmt, sd)) n=\(m.vals.count) (\(d))"
}

/// Đệm phải cho thẳng cột, không cắt chuỗi dài hơn.
func pad(_ s: String, _ n: Int) -> String { s.count >= n ? s : s + String(repeating: " ", count: n - s.count) }

func row(_ key: String, _ sim: String, _ p: Int, _ note: String) {
  print("\(pad(key.replacingOccurrences(of: "-", with: "−"), 6)) \(pad("sim=" + sim, 12)) \(pad(show(measured[key], p), 22)) · \(note)")
}

row("S", String(format: "%.2f\"", testS()), 2, "lệch ngang ở băng xa sau 80\", tipX 0,5R, 2 m/s")
let a = testA()
row("A", String(format: "%.4f", a.mu), 4, String(format: "μr = 2d/(g t²), lăn 1 m/s: d %.0f\" t %.2f s", a.d, a.t))
row("E", String(format: "%.2fR", testE()), 2, "tipY cho bi cái đứng, khe hai bi 20\", 2 m/s")
for a in [30, 45] as [CGFloat] {
  for running in [true, false] {
    let b = testCD(a, running: running)
    row("CD\(Int(a))\(running ? "+" : "-")", String(format: "%.1f°", b.out), 1,
        String(format: "góc lăn lại, tới %.0f° lăn 1 m/s, phê %@ 0,4R (đánh %.2f m/s cách 30\")", a, running ? "thuận" : "nghịch", b.v0))
  }
}
