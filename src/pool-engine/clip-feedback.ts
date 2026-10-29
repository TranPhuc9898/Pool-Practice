/**
 * Nhận xét cú đánh từ clip sau lưng, so với baseline của chính người chơi. Hàm thuần, không I/O.
 * Số đo trên ảnh 2D: pixel hoặc bội số cẳng tay, độ của trục chiếu. Không suy ra mm, không có góc "chuẩn" chung.
 */

/** Số đo của một cú, như `ClipStroke` bên module native. */
export type StrokeMeasures = {
  confidence: number;
  addressWristL?: number;
  backWristL?: number;
  followWristL?: number;
  elbowRangeL?: number;
  backCue?: number;
  followCue?: number;
  cueConfidence?: number;
};

export type MetricKey = 'addressWristL' | 'backWristL' | 'followWristL' | 'elbowRangeL' | 'backCue' | 'followCue';

type Metric = {
  key: MetricKey;
  label: string;
  unit: 'L' | '°';
  /** Có dấu thì có hướng trái phải; tầm khuỷu chỉ có lớn nhỏ. */
  signed: boolean;
  /** MAD sàn, để baseline quá đều không biến mọi lệch nhỏ thành cờ. Đoán, chưa hiệu chỉnh. */
  floor: number;
  cue?: boolean;
};

export const METRICS: Metric[] = [
  { key: 'addressWristL', label: 'Wrist at address', unit: 'L', signed: true, floor: 0.02 },
  { key: 'backWristL', label: 'Wrist at backswing end', unit: 'L', signed: true, floor: 0.02 },
  { key: 'followWristL', label: 'Wrist at follow-through end', unit: 'L', signed: true, floor: 0.02 },
  { key: 'elbowRangeL', label: 'Elbow sideways range', unit: 'L', signed: false, floor: 0.02 },
  { key: 'backCue', label: 'Cue angle at backswing end', unit: '°', signed: true, floor: 0.2, cue: true },
  { key: 'followCue', label: 'Cue angle at follow-through end', unit: '°', signed: true, floor: 0.2, cue: true },
];

/** Cú dưới mức này không vào baseline, không vào 5 cú gần nhất. */
export const MIN_CONFIDENCE = 0.6;
const RECENT = 5;
const OUTSIDE = 3;
const SPREAD = 3;
const MIN_BASELINE = 3;

export function median(xs: number[]): number | undefined {
  if (xs.length === 0) return undefined;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Trung vị độ lệch tuyệt đối khỏi trung vị. */
export function mad(xs: number[]): number | undefined {
  const m = median(xs);
  return m === undefined ? undefined : median(xs.map((x) => Math.abs(x - m)));
}

/** Giá trị của số đo `m` ở cú `k`, chỉ khi cú đủ tin cậy. Số đo cơ cần cả trục cơ đủ tin cậy. */
function value(k: StrokeMeasures, m: Metric): number | undefined {
  if (k.confidence < MIN_CONFIDENCE) return undefined;
  if (m.cue && (k.cueConfidence ?? 0) < MIN_CONFIDENCE) return undefined;
  return k[m.key];
}

export function values(strokes: StrokeMeasures[], key: MetricKey): number[] {
  const m = METRICS.find((x) => x.key === key)!;
  return strokes.map((k) => value(k, m)).filter((v): v is number => v !== undefined);
}

export type Feedback = {
  key: MetricKey;
  label: string;
  status: 'flag' | 'ok' | 'inconclusive';
  text: string;
};

const fmt = (v: number, unit: 'L' | '°') => (unit === 'L' ? `${v.toFixed(2)} L` : `${v.toFixed(1)}°`);

/**
 * So 5 cú tin cậy gần nhất của `recent` với baseline. Gắn cờ khi ≥ 3 trong 5 nằm ngoài trung vị ± 3·MAD của baseline.
 * Thiếu baseline hoặc thiếu cú thì `inconclusive` kèm lý do. `recent` theo thứ tự đánh.
 */
export function evaluate(baseline: StrokeMeasures[] | undefined, recent: StrokeMeasures[]): Feedback[] {
  return METRICS.map((m) => {
    const base = { key: m.key, label: m.label };
    if (!baseline) return { ...base, status: 'inconclusive', text: 'No baseline session set yet.' };
    const ref = values(baseline, m.key);
    const mid = median(ref);
    if (mid === undefined || ref.length < MIN_BASELINE)
      return { ...base, status: 'inconclusive', text: `Baseline has ${ref.length} confident strokes, needs ${MIN_BASELINE}.` };
    const last = values(recent, m.key).slice(-RECENT);
    if (last.length < RECENT)
      return { ...base, status: 'inconclusive', text: `${last.length} confident strokes here, needs ${RECENT}.` };
    const band = SPREAD * Math.max(mad(ref) ?? 0, m.floor);
    const out = last.filter((v) => Math.abs(v - mid) > band);
    if (out.length < OUTSIDE)
      return { ...base, status: 'ok', text: `${RECENT - out.length} of ${RECENT} within your baseline ${fmt(mid, m.unit)} ± ${fmt(band, m.unit)}.` };
    const shift = median(out.map((v) => v - mid))!;
    const side = m.signed
      ? m.unit === 'L'
        ? shift > 0 ? 'right of' : 'left of'
        : shift > 0 ? 'clockwise from' : 'anticlockwise from'
      : shift > 0 ? 'wider than' : 'narrower than';
    return {
      ...base,
      status: 'flag',
      text: `${out.length} of ${RECENT} strokes ${side} your baseline by ${fmt(Math.abs(shift), m.unit)} on the 2D image.`,
    };
  });
}

/** Trung vị mỗi số đo của một phiên, cho bảng so hai phiên và biểu đồ xu hướng. */
export function sessionMedians(strokes: StrokeMeasures[]): Partial<Record<MetricKey, number>> {
  const out: Partial<Record<MetricKey, number>> = {};
  for (const m of METRICS) {
    const v = median(values(strokes, m.key));
    if (v !== undefined) out[m.key] = v;
  }
  return out;
}

export function formatMetric(key: MetricKey, v?: number): string {
  if (v === undefined) return '–';
  const m = METRICS.find((x) => x.key === key)!;
  return (m.signed && v > 0 ? '+' : '') + fmt(v, m.unit);
}
