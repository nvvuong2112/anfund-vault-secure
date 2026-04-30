import { useMemo } from "react";
import { Gavel, Sparkles, Trophy, Users, Activity, Clock } from "lucide-react";
import { useDemo } from "./store";
import {
  formatVND,
  formatRate,
  formatCountdown,
  RiskBadge,
  StatusBadge,
  DemoBadge,
  VerifiedBadge,
  lenderTypeLabel,
  LenderIcon,
} from "./shared";
import { cn } from "@/lib/utils";

export function AuctionView() {
  const { loans, selectedLoanId, selectLoan, now } = useDemo();
  const open = loans.filter((l) => l.status === "open" || l.status === "matched");
  const selected = open.find((l) => l.id === selectedLoanId) ?? open[0] ?? loans[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {open.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            Chưa có phiên đấu giá nào đang mở.
          </div>
        )}
        {open.map((loan) => {
          const remaining = Math.max(0, loan.auctionEndsAt - now);
          return (
            <button
              key={loan.id}
              type="button"
              onClick={() => selectLoan(loan.id)}
              className={cn(
                "rounded-2xl border px-4 py-3 text-left transition-all",
                selected?.id === loan.id
                  ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                  : "border-border bg-card hover:border-primary/30",
              )}
            >
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {loan.code}
                {loan.fromDemoUser && <DemoBadge />}
              </div>
              <div className="mt-1 max-w-[220px] truncate text-sm font-semibold text-foreground">
                {loan.purpose}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px]">
                <span className="font-semibold text-primary">{formatVND(loan.amount)}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {loan.status === "open" ? formatCountdown(remaining) : "Đã khớp"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selected && <AuctionDetail loan={selected} now={now} />}
    </div>
  );
}

function AuctionDetail({
  loan,
  now,
}: {
  loan: ReturnType<typeof useDemo>["loans"][number];
  now: number;
}) {
  const remaining = Math.max(0, loan.auctionEndsAt - now);
  const totalDuration = loan.auctionEndsAt - loan.createdAt;
  const elapsed = Math.min(1, Math.max(0, (now - loan.createdAt) / totalDuration));

  const sortedOffers = useMemo(
    () => [...loan.offers].sort((a, b) => a.rate - b.rate),
    [loan.offers],
  );
  const best = sortedOffers[0];
  const rateMin = sortedOffers.length > 0 ? sortedOffers[0].rate : 0;
  const rateMax = sortedOffers.length > 0 ? sortedOffers[sortedOffers.length - 1].rate : 0;
  const distinctLenders = new Set(loan.offers.map((o) => o.lenderName)).size;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-5">
        <div
          className="relative overflow-hidden rounded-3xl border border-border p-6 text-primary-foreground md:p-7"
          style={{ background: "var(--gradient-navy)" }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-emerald/30 blur-3xl" />

          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                <Gavel className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  Phiên đấu giá vốn · {loan.code}
                  {loan.fromDemoUser && <DemoBadge />}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-base font-semibold md:text-lg">
                  {loan.purpose}
                  <VerifiedBadge verifiedAt={loan.verifiedAt} size="sm" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RiskBadge level={loan.riskLevel} />
              <StatusBadge status={loan.status} />
            </div>
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Tile
              icon={<Clock className="h-4 w-4" />}
              label={loan.status === "open" ? "Còn lại" : "Trạng thái"}
              value={
                loan.status === "open"
                  ? formatCountdown(remaining)
                  : loan.status === "matched"
                    ? "Đã khớp"
                    : "Đã đóng"
              }
              highlight={remaining > 0}
            />
            <Tile
              icon={<Users className="h-4 w-4" />}
              label="Số đề xuất"
              value={`${loan.offers.length}`}
              sub={`${distinctLenders} bên cho vay`}
            />
            <Tile
              icon={<Trophy className="h-4 w-4" />}
              label="Tốt nhất"
              value={best ? formatRate(best.rate) : "—"}
              sub={best ? best.lenderName : "Chưa có đề xuất"}
              highlight
            />
            <Tile
              icon={<Activity className="h-4 w-4" />}
              label="Khoảng lãi suất"
              value={
                sortedOffers.length > 0
                  ? `${rateMin.toString().replace(".", ",")} – ${rateMax.toString().replace(".", ",")}%`
                  : "—"
              }
            />
          </div>

          <div className="relative mt-5">
            <div className="flex items-center justify-between text-[11px] text-white/70">
              <span>Tiến trình phiên</span>
              <span>{Math.round(elapsed * 100)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full bg-emerald transition-[width] duration-500"
                style={{ width: `${Math.round(elapsed * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div
          className="rounded-3xl border border-border bg-card p-6 md:p-7"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold text-foreground md:text-lg">
              Đề xuất theo thời gian thực
            </h4>
            <span className="text-xs text-muted-foreground">Sắp xếp: lãi suất tăng dần</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {sortedOffers.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-6 text-center">
                <div className="text-sm font-semibold text-foreground">Chưa có đề xuất nào</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Đề xuất sẽ xuất hiện ở đây ngay khi người cho vay gửi (hoặc bạn gửi từ tab{" "}
                  <span className="font-semibold text-foreground">Người cho vay</span>).
                </p>
              </div>
            )}
            {sortedOffers.map((offer, i) => (
              <div
                key={offer.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-3 transition-all",
                  i === 0 ? "border-emerald/40 bg-emerald/5" : "border-border bg-secondary/30",
                  offer.fromDemoUser && "ring-2 ring-accent/30",
                )}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <LenderIcon type={offer.lenderType} className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {offer.lenderName}
                    </span>
                    <VerifiedBadge verifiedAt={offer.lenderVerifiedAt} size="sm" />
                    {i === 0 && (
                      <span className="rounded-full bg-emerald/15 px-1.5 py-0.5 text-[9px] font-semibold text-emerald">
                        #1
                      </span>
                    )}
                    {offer.fromDemoUser && <DemoBadge />}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {lenderTypeLabel(offer.lenderType)} · {offer.conditions}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      "text-sm font-bold md:text-base",
                      i === 0 ? "text-emerald" : "text-primary",
                    )}
                  >
                    {formatRate(offer.rate)}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {formatVND(offer.amount)} · {offer.term}T · phù hợp {offer.fitScore}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="lg:col-span-5 space-y-5">
        <RateDistribution offers={sortedOffers} />
        <RecentActivity loan={loan} />
        <Insight loan={loan} bestRate={best?.rate} />
      </aside>
    </div>
  );
}

function Tile({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-3 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/70">
        {icon}
        {label}
      </div>
      <div className={cn("mt-0.5 text-base font-bold", highlight ? "text-emerald" : "text-white")}>
        {value}
      </div>
      {sub && <div className="text-[10px] text-white/60 truncate">{sub}</div>}
    </div>
  );
}

function RateDistribution({
  offers,
}: {
  offers: ReturnType<typeof useDemo>["loans"][number]["offers"];
}) {
  const buckets = useMemo(() => {
    if (offers.length === 0) return [] as { range: string; count: number; isBest: boolean }[];
    const min = Math.floor(offers[0].rate * 2) / 2;
    const max = Math.ceil(offers[offers.length - 1].rate * 2) / 2;
    const step = 0.5;
    const result: { range: string; count: number; from: number; to: number }[] = [];
    for (let r = min; r <= max; r += step) {
      result.push({
        range: `${r.toString().replace(".", ",")}-${(r + step).toString().replace(".", ",")}%`,
        from: r,
        to: r + step,
        count: offers.filter((o) => o.rate >= r && o.rate < r + step + 0.0001).length,
      });
    }
    const sortedResult = result.map((b, i) => ({ ...b, isBest: i === 0 }));
    return sortedResult;
  }, [offers]);

  const maxCount = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <div
      className="rounded-3xl border border-border bg-card p-5"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-emerald" />
        <h4 className="text-sm font-semibold text-foreground">Phân bố lãi suất các đề xuất</h4>
      </div>
      {buckets.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">Chưa đủ dữ liệu để hiển thị biểu đồ.</p>
      ) : (
        <>
          <div className="mt-4 flex h-24 items-end gap-1.5">
            {buckets.map((b, i) => (
              <div
                key={b.range}
                className="group relative flex flex-1 flex-col items-center gap-1"
                title={`${b.range}: ${b.count} đề xuất`}
              >
                <div
                  className={cn(
                    "w-full rounded-t-md transition-all",
                    b.isBest ? "bg-emerald" : "bg-primary/60",
                  )}
                  style={{
                    height: `${(b.count / maxCount) * 100}%`,
                    minHeight: b.count > 0 ? 6 : 0,
                  }}
                />
                {b.count > 0 && (
                  <div className="text-[9px] font-semibold text-foreground">{b.count}</div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>{buckets[0].range.split("-")[0]}</span>
            <span>{buckets[buckets.length - 1].range.split("-")[1]}</span>
          </div>
        </>
      )}
    </div>
  );
}

function RecentActivity({ loan }: { loan: ReturnType<typeof useDemo>["loans"][number] }) {
  const recent = useMemo(
    () => [...loan.offers].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
    [loan.offers],
  );

  return (
    <div
      className="rounded-3xl border border-border bg-card p-5"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">Hoạt động gần đây</h4>
      </div>
      <ul className="mt-3 space-y-2.5">
        {recent.length === 0 && (
          <li className="text-xs text-muted-foreground">Chưa có hoạt động.</li>
        )}
        {recent.map((o) => (
          <li key={o.id} className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <LenderIcon type={o.lenderType} className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-foreground">
                {o.lenderName}{" "}
                <span className="font-normal text-muted-foreground">gửi đề xuất</span>{" "}
                <span className="font-semibold text-primary">{formatRate(o.rate)}</span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                {timeAgo(o.createdAt)} · {formatVND(o.amount)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Insight({
  loan,
  bestRate,
}: {
  loan: ReturnType<typeof useDemo>["loans"][number];
  bestRate?: number;
}) {
  const messages: string[] = [];
  if (loan.status === "matched") {
    messages.push("Hồ sơ đã khớp giao dịch — phiên đấu giá kết thúc thắng lợi.");
  } else if (loan.status === "closed") {
    messages.push("Phiên đấu giá đã đóng. Bạn có thể tạo hồ sơ mới ở tab Người vay.");
  } else if (loan.offers.length === 0) {
    messages.push("Chưa có đề xuất — hãy chuyển qua tab Người cho vay để là người đầu tiên.");
  } else if (bestRate != null && bestRate <= 7.5) {
    messages.push(`Đề xuất tốt nhất ${formatRate(bestRate)} đang rất cạnh tranh.`);
  } else {
    messages.push("Cạnh tranh đang diễn ra — đề xuất tốt hơn vẫn có thể xuất hiện.");
  }
  if (loan.riskLevel === "low") {
    messages.push("Hồ sơ rủi ro thấp thường thu hút nhiều đề xuất chất lượng hơn.");
  }

  return (
    <div
      className="rounded-3xl border border-emerald/30 bg-emerald/5 p-5"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-emerald" />
        <h4 className="text-sm font-semibold text-foreground">Nhận định nhanh</h4>
      </div>
      <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
        {messages.map((m) => (
          <li key={m} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
            <span>{m}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  if (diff < 60_000) return "vừa xong";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} phút trước`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} giờ trước`;
  return `${Math.floor(diff / 86_400_000)} ngày trước`;
}
