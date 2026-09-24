import { Activity, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { useDemo } from "./store";
import type { Loan } from "./types";
import { formatRate, formatTimeAgo, formatVND, rankOffers } from "./format";
import { Countdown, LenderIcon, StatusBadge, VerifiedBadge } from "./shared";
import { ScreenHeader } from "./PhoneFrame";

/**
 * Màn hình sàn đấu giá: chỉ xem, không thao tác lên dữ liệu.
 * Theo `selectedLoanId` của store — người vay mở phiên hay người cho vay bấm
 * vào hồ sơ nào thì máy này chuyển sang đúng phiên đó.
 */
export function AuctionScreen() {
  const { loans, selectedLoanId, selectLoan } = useDemo();
  const loan = loans.find((l) => l.id === selectedLoanId) ?? loans[0];

  return (
    <>
      <ScreenHeader role="Sàn đấu giá">
        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-gold">
          <Radio className="h-3.5 w-3.5" /> TRỰC TIẾP
        </div>
        <div
          className="-mx-5 mt-2 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]"
          role="group"
          aria-label="Chọn phiên đấu giá"
        >
          {loans.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={l.id === loan?.id}
              onClick={() => selectLoan(l.id)}
              className={cn(
                "flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-colors",
                l.id === loan?.id
                  ? "bg-white text-primary"
                  : "bg-white/10 text-white/85 hover:bg-white/20",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  l.status === "open"
                    ? "bg-emerald"
                    : l.status === "matched"
                      ? "bg-gold"
                      : "bg-white/40",
                )}
              />
              {l.code}
            </button>
          ))}
        </div>
      </ScreenHeader>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {loan ? (
          <AuctionBoard loan={loan} />
        ) : (
          <p className="p-5 text-sm text-muted-foreground">Chưa có phiên nào.</p>
        )}
      </div>
    </>
  );
}

function AuctionBoard({ loan }: { loan: Loan }) {
  const { now } = useDemo();
  const mounted = useMounted();
  const ranked = rankOffers(loan.offers);
  const remaining = Math.max(0, loan.auctionEndsAt - now);
  const elapsed = Math.min(
    1,
    Math.max(0, (now - loan.createdAt) / (loan.auctionEndsAt - loan.createdAt)),
  );
  const lenders = new Set(loan.offers.map((o) => o.lenderName)).size;
  const recent = [...loan.offers].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  return (
    <div className="space-y-4 px-5 py-4">
      <div
        className="rounded-2xl border border-border bg-card p-4"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-lg font-bold text-foreground">{formatVND(loan.amount)}</div>
            <div className="text-xs text-muted-foreground">
              {loan.code} · {loan.purpose} · {loan.term} tháng
            </div>
          </div>
          <div className="shrink-0">
            <StatusBadge status={loan.status} />
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] text-muted-foreground">
              {loan.status === "open" ? "Còn lại" : "Phiên đã kết thúc"}
            </div>
            <div className="text-2xl font-bold tabular-nums text-primary">
              {loan.status === "open" ? <Countdown ms={remaining} /> : "—"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground">Thấp nhất</div>
            <div className="text-2xl font-bold tabular-nums text-emerald">
              {ranked[0] ? `${String(ranked[0].rate).replace(".", ",")}%` : "—"}
            </div>
          </div>
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-label="Tiến trình phiên đấu giá"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={mounted ? Math.round(elapsed * 100) : undefined}
        >
          {/* Độ rộng suy ra từ giờ hiện tại → chỉ đặt sau khi mount, tránh lệch hydration. */}
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-1000"
            style={{ width: mounted ? `${elapsed * 100}%` : 0 }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>{loan.offers.length} đề xuất</span>
          <span>{lenders} bên cho vay</span>
        </div>
      </div>

      <section>
        <h3 className="text-sm font-semibold text-foreground">Bảng xếp hạng</h3>
        <p className="text-[11px] text-muted-foreground">Lãi suất thấp nhất đứng đầu.</p>
        {ranked.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            Chưa có đề xuất. Bên đầu tiên vào sẽ dẫn đầu.
          </p>
        ) : (
          <ol className="mt-2 space-y-2">
            {ranked.map((o, i) => {
              const won = loan.matchedOfferId === o.id;
              return (
                <li
                  key={o.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3 py-2.5",
                    won
                      ? "border-gold bg-gold/10"
                      : i === 0
                        ? "border-emerald/50 bg-emerald/5"
                        : "border-border bg-card",
                    o.status === "rejected" && "opacity-55",
                  )}
                >
                  <span
                    className={cn(
                      "w-5 shrink-0 text-center text-xs font-bold",
                      i === 0 ? "text-emerald" : "text-muted-foreground",
                    )}
                  >
                    {i + 1}
                  </span>
                  <LenderIcon type={o.lenderType} className="h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                      <span className="text-[13px] font-semibold leading-snug text-foreground">
                        {o.lenderName}
                      </span>
                      {o.fromDemoUser && (
                        <span className="rounded bg-primary px-1 text-[9.5px] font-bold text-primary-foreground">
                          BẠN
                        </span>
                      )}
                      {won && (
                        <span className="rounded bg-gold px-1 text-[9.5px] font-bold text-gold-foreground">
                          ĐƯỢC CHỌN
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10.5px] text-muted-foreground">
                      <VerifiedBadge verifiedAt={o.lenderVerifiedAt} size="sm" />
                      {formatVND(o.amount)} · {o.term} th
                    </div>
                  </div>
                  <span className="shrink-0 text-base font-bold tabular-nums text-foreground">
                    {String(o.rate).replace(".", ",")}%
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {recent.length > 0 && (
        <section>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Activity className="h-4 w-4 text-emerald" /> Hoạt động gần đây
          </h3>
          <ul className="mt-2 space-y-2">
            {recent.map((o) => (
              <li key={o.id} className="text-xs leading-relaxed">
                <span className="font-semibold text-foreground">{o.lenderName}</span>{" "}
                <span className="text-muted-foreground">đặt</span>{" "}
                <span className="font-semibold text-primary">{formatRate(o.rate)}</span>
                <span className="text-muted-foreground" suppressHydrationWarning>
                  {" "}
                  · {formatTimeAgo(o.createdAt, now)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
