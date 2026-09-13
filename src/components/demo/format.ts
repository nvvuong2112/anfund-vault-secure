import type { LenderType } from "./types";

export function formatVND(n: number) {
  if (n >= 1_000_000_000) {
    const v = n / 1_000_000_000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1).replace(".", ",")} tỷ ₫`;
  }
  if (n >= 1_000_000) {
    return `${Math.round(n / 1_000_000)}M ₫`;
  }
  return `${n.toLocaleString("vi-VN")} ₫`;
}

export function formatVNDFull(n: number) {
  return `${n.toLocaleString("vi-VN")} ₫`;
}

export function formatRate(n: number) {
  return `${n.toString().replace(".", ",")}%/năm`;
}

export function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (d > 0)
    return `${d}n ${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function formatCountdownText(ms: number) {
  if (ms <= 0) return "Phiên đã kết thúc";
  const total = Math.floor(ms / 60000);
  const d = Math.floor(total / 1440);
  const h = Math.floor((total % 1440) / 60);
  const m = total % 60;
  const parts: string[] = [];
  if (d > 0) parts.push(`${d} ngày`);
  if (h > 0) parts.push(`${h} giờ`);
  if (d === 0 && m > 0) parts.push(`${m} phút`);
  if (parts.length === 0) parts.push("dưới 1 phút");
  return `Còn khoảng ${parts.join(" ")}`;
}

export function formatDaysAgo(ms: number) {
  const diff = Date.now() - ms;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days <= 0) return "hôm nay";
  if (days === 1) return "hôm qua";
  if (days < 30) return `${days} ngày trước`;
  const months = Math.floor(days / 30);
  return `${months} tháng trước`;
}

export function lenderTypeLabel(t: LenderType) {
  return t === "fund" ? "Quỹ đầu tư" : t === "company" ? "Doanh nghiệp" : "Cá nhân";
}
