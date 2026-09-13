import { useId, useMemo, useState } from "react";
import {
  Filter,
  Search,
  Send,
  Sparkles,
  ChevronRight,
  Wallet,
  CalendarClock,
  Target,
  History,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDemo } from "./store";
import type { LenderType, NewOfferInput, RiskLevel } from "./types";
import { Countdown, RiskBadge, StatusBadge, DemoBadge, VerifiedBadge, LenderIcon } from "./shared";
import { formatVND, formatRate, formatDaysAgo, lenderTypeLabel } from "./format";
import { cn } from "@/lib/utils";

export function LenderView() {
  const { loans, now, submitOffer, selectedLoanId, selectLoan } = useDemo();
  const [riskFilter, setRiskFilter] = useState<"all" | RiskLevel>("all");
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    return loans
      .filter((l) => l.status === "open")
      .filter((l) => (riskFilter === "all" ? true : l.riskLevel === riskFilter))
      .filter((l) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          l.code.toLowerCase().includes(q) ||
          l.purpose.toLowerCase().includes(q) ||
          l.borrowerName.toLowerCase().includes(q)
        );
      });
  }, [loans, riskFilter, search]);

  const selected = visible.find((l) => l.id === selectedLoanId) ?? visible[0];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <aside className="lg:col-span-5 space-y-4">
        <div
          className="rounded-lg border border-border bg-card p-5"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Filter className="h-3.5 w-3.5 text-primary" />
            Bộ lọc hồ sơ vay
          </div>

          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã, mục đích vay..."
              aria-label="Tìm kiếm hồ sơ vay"
              className="h-11 rounded-md pl-10"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["all", "Tất cả"],
                ["low", "Rủi ro thấp"],
                ["medium", "Rủi ro TB"],
                ["high", "Rủi ro cao"],
              ] as const
            ).map(([v, label]) => (
              <button
                type="button"
                key={v}
                aria-pressed={riskFilter === v}
                onClick={() => setRiskFilter(v as never)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  riskFilter === v
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary/40 text-foreground hover:border-primary/30",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {visible.length} hồ sơ vay đang mở phiên đấu giá
          </div>
          {visible.length === 0 && (
            <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-6 text-sm text-muted-foreground">
              Không có hồ sơ vay nào khớp với bộ lọc.
            </div>
          )}
          {visible.map((loan) => {
            const remaining = loan.auctionEndsAt - now;
            const bestRate =
              loan.offers.length > 0 ? Math.min(...loan.offers.map((o) => o.rate)) : null;
            return (
              <button
                key={loan.id}
                type="button"
                onClick={() => selectLoan(loan.id)}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-all",
                  selected?.id === loan.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                    : "border-border bg-card hover:border-primary/30",
                )}
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {loan.code}
                  </span>
                  <RiskBadge level={loan.riskLevel} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {loan.purpose}
                  </span>
                  <VerifiedBadge verifiedAt={loan.verifiedAt} size="sm" />
                  {loan.fromDemoUser && <DemoBadge />}
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <Stat label="Số tiền" value={formatVND(loan.amount)} />
                  <Stat label="Kỳ hạn" value={`${loan.term}T`} />
                  <Stat
                    label="Còn lại"
                    value={<Countdown ms={remaining} />}
                    tone={remaining < 60_000 ? "destructive" : "emerald"}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{loan.offers.length} đề xuất</span>
                  {bestRate != null ? (
                    <span className="font-semibold text-emerald">
                      Tốt nhất {formatRate(bestRate)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Chưa có đề xuất</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="lg:col-span-7">
        {selected ? (
          <LoanInspector
            key={selected.id}
            loan={selected}
            now={now}
            onSubmit={(data) => submitOffer(selected.id, data)}
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            Không có hồ sơ vay đang mở.
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "primary" | "emerald" | "destructive";
}) {
  const cls =
    tone === "emerald"
      ? "text-emerald"
      : tone === "destructive"
        ? "text-destructive"
        : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-secondary/40 px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("text-[11px] font-bold", cls)}>{value}</div>
    </div>
  );
}

function LoanInspector({
  loan,
  now,
  onSubmit,
}: {
  loan: ReturnType<typeof useDemo>["loans"][number];
  now: number;
  onSubmit: (data: NewOfferInput) => void;
}) {
  const remaining = loan.auctionEndsAt - now;
  const bestRate = loan.offers.length > 0 ? Math.min(...loan.offers.map((o) => o.rate)) : null;
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-5">
      <div
        className="rounded-lg border border-border bg-card p-6 md:p-7"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {loan.code}
              {loan.fromDemoUser && <DemoBadge />}
            </div>
            <h3 className="mt-1 text-xl font-bold text-foreground md:text-2xl">{loan.purpose}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{loan.borrowerName}</span>
              <VerifiedBadge verifiedAt={loan.verifiedAt} size="sm" />
              <span className="text-xs">· Xác minh {formatDaysAgo(loan.verifiedAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RiskBadge level={loan.riskLevel} />
            <StatusBadge status={loan.status} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Box icon={Wallet} label="Số tiền" value={formatVND(loan.amount)} />
          <Box icon={CalendarClock} label="Kỳ hạn" value={`${loan.term} tháng`} />
          <Box icon={Target} label="Mục đích" value={loan.purpose} />
          <Box
            icon={Sparkles}
            label="Còn lại"
            value={<Countdown ms={remaining} />}
            tone={remaining < 60_000 ? "destructive" : "emerald"}
          />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <DetailLine icon={History} label="Lịch sử tài chính" value={loan.history} />
          <DetailLine icon={ShieldCheck} label="Tài sản bảo đảm" value={loan.collateral} />
        </div>

        <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Tình hình cạnh tranh hiện tại</span>
            {bestRate != null ? (
              <span className="font-semibold text-emerald">Tốt nhất {formatRate(bestRate)}</span>
            ) : (
              <span className="text-muted-foreground">Chưa có đề xuất</span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {loan.offers.length === 0 && (
              <span className="text-xs text-muted-foreground">
                Hãy là người đầu tiên gửi đề xuất.
              </span>
            )}
            {loan.offers
              .slice()
              .sort((a, b) => a.rate - b.rate)
              .slice(0, 4)
              .map((o, i) => (
                <span
                  key={o.id}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                    i === 0
                      ? "border-emerald/40 bg-emerald/10 text-emerald"
                      : "border-border bg-card text-foreground",
                  )}
                >
                  <LenderIcon type={o.lenderType} className="h-3 w-3" />
                  {o.lenderName} · {formatRate(o.rate)}
                </span>
              ))}
          </div>
        </div>
      </div>

      {submitted ? (
        <SubmittedCard onAgain={() => setSubmitted(false)} />
      ) : (
        <NewOfferForm
          baseAmount={loan.amount}
          baseTerm={loan.term}
          targetRate={bestRate ?? 8.5}
          onSubmit={(data) => {
            onSubmit(data);
            setSubmitted(true);
          }}
        />
      )}
    </div>
  );
}

function NewOfferForm({
  baseAmount,
  baseTerm,
  targetRate,
  onSubmit,
}: {
  baseAmount: number;
  baseTerm: number;
  targetRate: number;
  onSubmit: (data: NewOfferInput) => void;
}) {
  const suggested = Math.max(6.5, Math.round((targetRate - 0.2) * 10) / 10);
  const [lenderName, setLenderName] = useState("Quỹ đầu tư của bạn");
  const [lenderType, setLenderType] = useState<LenderType>("fund");
  const [rate, setRate] = useState(suggested);
  const [amount, setAmount] = useState(baseAmount);
  const [term, setTerm] = useState(baseTerm);
  const [conditions, setConditions] = useState("Cố định 12 tháng đầu, giải ngân 24h");
  const [collateralRequirement, setCollateralRequirement] = useState("BĐS thế chấp");
  const uid = useId();
  const ids = {
    name: `${uid}-name`,
    rate: `${uid}-rate`,
    amount: `${uid}-amount`,
    term: `${uid}-term`,
    conditions: `${uid}-conditions`,
    collateral: `${uid}-collateral`,
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ lenderName, lenderType, rate, amount, term, conditions, collateralRequirement });
  };

  const isBetter = rate < targetRate;

  return (
    <form
      onSubmit={submit}
      className="rounded-lg border border-border bg-card p-6 md:p-7"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center gap-2">
        <DemoBadge />
        <div className="text-xs text-muted-foreground">
          Gửi đề xuất tài trợ với điều kiện cạnh tranh nhất.
        </div>
      </div>
      <h4 className="mt-4 text-lg font-bold text-foreground md:text-xl">Đề xuất tài trợ của bạn</h4>

      <div className="mt-3 flex items-start gap-3 rounded-lg border border-emerald/30 bg-emerald/5 p-3.5 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
        <div>
          <span className="font-semibold text-foreground">Quy định AnFund:</span> Đơn vị/cá nhân cho
          vay phải gửi hồ sơ năng lực trước{" "}
          <span className="font-semibold text-foreground">5 ngày</span> để AnFund xét duyệt; thời
          gian phê duyệt tối thiểu{" "}
          <span className="font-semibold text-foreground">5 ngày làm việc</span>. Chỉ bên cho vay đã
          xác minh mới được gửi đề xuất. Trong demo này bên cho vay được xác minh ngay.
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <FieldLabel htmlFor={ids.name}>Tên đơn vị / cá nhân cho vay</FieldLabel>
          <Input
            id={ids.name}
            className="mt-2 h-11 rounded-md"
            value={lenderName}
            onChange={(e) => setLenderName(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Loại</FieldLabel>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["fund", "company", "individual"] as LenderType[]).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={lenderType === t}
                onClick={() => setLenderType(t)}
                className={cn(
                  "rounded-md border p-2 text-xs font-semibold transition-colors",
                  lenderType === t
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/30",
                )}
              >
                {lenderTypeLabel(t)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <FieldLabel htmlFor={ids.rate}>Lãi suất / năm (%)</FieldLabel>
          <Input
            id={ids.rate}
            className="mt-2 h-11 rounded-md"
            type="number"
            step={0.1}
            min={3}
            max={30}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value || 0))}
          />
          <div
            className={cn(
              "mt-1 text-[11px] font-medium",
              isBetter ? "text-emerald" : "text-muted-foreground",
            )}
          >
            {targetRate
              ? isBetter
                ? `Tốt hơn mức ${formatRate(targetRate)} hiện tại`
                : `Cao hơn mức tốt nhất ${formatRate(targetRate)}`
              : "Chưa có đề xuất nào — bạn là người đầu tiên!"}
          </div>
        </div>
        <div>
          <FieldLabel htmlFor={ids.amount}>Số tiền tài trợ (₫)</FieldLabel>
          <Input
            id={ids.amount}
            className="mt-2 h-11 rounded-md"
            type="number"
            step={50_000_000}
            min={50_000_000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value || 0))}
          />
          <div className="mt-1 text-[11px] text-muted-foreground">≈ {formatVND(amount)}</div>
        </div>
        <div>
          <FieldLabel htmlFor={ids.term}>Kỳ hạn (tháng)</FieldLabel>
          <Input
            id={ids.term}
            className="mt-2 h-11 rounded-md"
            type="number"
            step={6}
            min={6}
            max={300}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value || 0))}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <FieldLabel htmlFor={ids.conditions}>Điều kiện giải ngân</FieldLabel>
          <Textarea
            id={ids.conditions}
            className="mt-2 rounded-md"
            rows={2}
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel htmlFor={ids.collateral}>Yêu cầu bảo đảm</FieldLabel>
          <Textarea
            id={ids.collateral}
            className="mt-2 rounded-md"
            rows={2}
            value={collateralRequirement}
            onChange={(e) => setCollateralRequirement(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" className="rounded-full">
          <Send className="h-4 w-4" />
          Gửi đề xuất tài trợ
        </Button>
      </div>
    </form>
  );
}

function SubmittedCard({ onAgain }: { onAgain: () => void }) {
  return (
    <div
      className="rounded-lg border border-emerald/30 bg-emerald/5 p-6 md:p-7 text-center"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-emerald text-emerald-foreground">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <h4 className="mt-4 text-lg font-bold text-foreground">Đề xuất đã được gửi</h4>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
        Đề xuất của bạn xuất hiện ngay trong phiên đấu giá. Chuyển qua tab{" "}
        <span className="font-semibold text-foreground">Đấu giá vốn</span> để theo dõi cạnh tranh
        trực tiếp.
      </p>
      <Button variant="outline" className="mt-5 rounded-full" onClick={onAgain}>
        Gửi đề xuất khác
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  const cls = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";
  if (htmlFor)
    return (
      <label htmlFor={htmlFor} className={cls}>
        {children}
      </label>
    );
  return <div className={cls}>{children}</div>;
}

function Box({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  tone?: "primary" | "emerald" | "destructive";
}) {
  const cls =
    tone === "emerald"
      ? "text-emerald"
      : tone === "destructive"
        ? "text-destructive"
        : "text-foreground";
  return (
    <div className="rounded-md border border-border bg-secondary/40 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3 text-primary" />
        {label}
      </div>
      <div className={cn("mt-0.5 truncate text-sm font-bold md:text-base", cls)}>{value}</div>
    </div>
  );
}

function DetailLine({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border/60 bg-secondary/30 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}
