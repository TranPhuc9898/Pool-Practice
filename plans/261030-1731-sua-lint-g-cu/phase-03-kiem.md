---
phase: 3
status: done
---
# Kiểm

- [x] `npx tsc --noEmit` exit 0, `npx expo lint` exit 0.
- [x] Metro 8081 (kiểm `lsof -i :8081` trước), `playall.sh` với `37:4 38:7 39:10 41:7 74:1`; dừng Metro sau.
- [x] Cập nhật `plans/reports/levels-261029-bang-hang-124-drill.md` nếu ghi chú lint G có nhắc 5 bài này.

Xong khi: không dòng nào có "Missed"; tsc và lint exit 0.
