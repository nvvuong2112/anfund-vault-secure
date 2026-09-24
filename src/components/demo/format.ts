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

/**
 * Luật xếp hạng duy nhất của sàn: lãi suất thấp nhất đứng đầu. `fitScore` chỉ để
 * hiển thị, KHÔNG tham gia xếp hạng. Mọi màn hình phải đi qua hàm này.
 */
export function rankOffers<T extends { rate: number }>(offers: readonly T[]): T[] {
  return [...offers].sort((a, b) => a.rate - b.rate);
}

/** Lãi suất đang dẫn đầu, hoặc `undefined` khi chưa có đề xuất nào. */
export function bestRate(offers: readonly { rate: number }[]): number | undefined {
  return offers.length ? Math.min(...offers.map((o) => o.rate)) : undefined;
}

/** Lãi suất gợi ý cho bên cho vay: hạ 0,2 điểm dưới mức dẫn đầu, sàn 6,5%. */
export function suggestRate(leading: number) {
  return Math.max(6.5, Math.round((leading - 0.2) * 10) / 10);
}

/** "vừa xong", "5 phút trước"… — phụ thuộc giờ hiện tại, nhớ `suppressHydrationWarning`. */
export function formatTimeAgo(ms: number, now = Date.now()) {
  const diff = now - ms;
  if (diff < 60_000) return "vừa xong";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} phút trước`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} giờ trước`;
  return `${Math.floor(diff / 86_400_000)} ngày trước`;
}
