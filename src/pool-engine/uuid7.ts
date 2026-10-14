/**
 * UUIDv7 (RFC 9562): 48 bit ms, 12 bit đếm trong cùng ms, phần còn lại ngẫu nhiên.
 * Đếm giữ thứ tự chuỗi trùng thứ tự sinh, kể cả nhiều id trong một ms; tràn 4096 thì mượn ms kế.
 * Ngẫu nhiên lấy từ `Math.random`, không đạt chuẩn crypto: id chỉ để khử trùng khi sync, không làm khoá bí mật.
 */
let lastMs = -1;
let seq = 0;

const hex = (n: number) => {
  let s = '';
  for (let i = 0; i < n; i++) s += ((Math.random() * 16) | 0).toString(16);
  return s;
};

export function uuid7(now: number = Date.now()): string {
  if (now > lastMs) {
    lastMs = now;
    seq = 0;
  } else if (++seq > 0xfff) {
    lastMs += 1;
    seq = 0;
  }
  const ts = lastMs.toString(16).padStart(12, '0');
  const variant = (8 + ((Math.random() * 4) | 0)).toString(16);
  return `${ts.slice(0, 8)}-${ts.slice(8)}-7${seq.toString(16).padStart(3, '0')}-${variant}${hex(3)}-${hex(12)}`;
}
