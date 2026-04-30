import { useMemo, useState } from "react";
import {
  Plus,
  Wallet,
  CalendarClock,
  Target,
  TrendingUp,
  History,
  ShieldCheck,
  Activity,
  Clock,
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDemo } from "./store";
import type { NewLoanInput, RiskLevel } from "./types";
import {
  LenderIcon,
  StatusBadge,
  RiskBadge,
  DemoBadge,
  formatVND,
  formatVNDFull,
  formatRate,
  formatCountdown,
  lenderTypeLabel,
} from "./shared";
import { cn } from "@/lib/utils";

export function BorrowerView() {
  const { loans, selectedLoanId, selectLoan, createLoan, acceptOffer, now } = useDemo();
  const [showForm, setShowForm] = useState(false);

  const myLoans = loans.filter((l) => l.fromDemoUser);
  const selected = loans.find((l) => l.id === selectedLoanId) ?? myLoans[0] ?? loans[0];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <aside className="lg:col-span-4 space-y-4">
        <div
          className="rounded-2xl border border-border bg-card p-5"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Hồ sơ vay của bạn
              </div>
              <div className="mt-1 text-base font-semibold text-foreground">
                {myLoans.length > 0 ? `${myLoans.length} hồ sơ đang mở` : "Chưa có hồ sơ nào"}
              </div>
            </div>
            <Button size="sm" className="rounded-full" onClick={() => setShowForm((v) => !v)}>
              <Plus className="h-4 w-4" />
              {showForm ? "Đóng" : "Tạo hồ sơ"}
            </Button>
          </div>

          <div className="mt-4 space-y-2">
            {myLoans.length === 0 && !showForm && (
              <p className="text-sm text-muted-foreground">
                Bấm <span className="font-semibold text-foreground">Tạo hồ sơ</span> để mở phiên đấu
                giá vốn của riêng bạn.
              </p>
            )}
            {myLoans.map((loan) => (
              <LoanRow
                key={loan.id}
                code={loan.code}
                title={loan.purpose}
                amount={loan.amount}
                offers={loan.offers.length}
                active={loan.id === selected?.id}
                status={loan.status}
                onClick={() => selectLoan(loan.id)}
              />
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl border border-border bg-secondary/40 p-5"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Hồ sơ mẫu trên sàn
          </div>
          <div className="mt-3 space-y-2">
            {loans
              .filter((l) => !l.fromDemoUser)
              .map((loan) => (
                <LoanRow
                  key={loan.id}
                  code={loan.code}
                  title={loan.purpose}
                  amount={loan.amount}
                  offers={loan.offers.length}
                  active={loan.id === selected?.id}
                  status={loan.status}
                  onClick={() => selectLoan(loan.id)}
                />
              ))}
          </div>
        </div>
      </aside>

      <section className="lg:col-span-8">
        {showForm ? (
          <NewLoanForm
            onSubmit={(data) => {
              createLoan(data);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        ) : selected ? (
          <LoanDetail
            loan={selected}
            now={now}
            onAccept={(offerId) => acceptOffer(selected.id, offerId)}
          />
        ) : (
          <EmptyState onCreate={() => setShowForm(true)} />
        )}
      </section>
    </div>
  );
}

function LoanRow({
  code,
  title,
  amount,
  offers,
  active,
  status,
  onClick,
}: {
  code: string;
  title: string;
  amount: number;
  offers: number;
  active: boolean;
  status: "open" | "matched" | "closed";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border p-3 text-left transition-all",
        active
          ? "border-primary bg-primary/5 ring-2 ring-primary/15"
          : "border-border bg-card hover:border-primary/30",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {code}
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="mt-1 truncate text-sm font-semibold text-foreground">{title}</div>
      <div className="mt-1 flex items-center justify-between text-xs">
        <span className="font-semibold text-primary">{formatVND(amount)}</span>
        <span className="text-muted-foreground">{offers} đề xuất</span>
      </div>
    </button>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Plus className="h-5 w-5" />
      </div>
      <div className="mt-4 text-base font-semibold text-foreground">Tạo hồ sơ vay đầu tiên</div>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Điền thông tin để mở phiên đấu giá vốn — các bên cho vay sẽ gửi đề xuất cạnh tranh.
      </p>
      <Button className="mt-5 rounded-full" onClick={onCreate}>
        Tạo hồ sơ ngay
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

const PURPOSES = [
  "Mua nhà ở",
  "Mua xe ô tô",
  "Sửa chữa nhà",
  "Bổ sung vốn lưu động",
  "Du học",
  "Đầu tư mở rộng kinh doanh",
];

function NewLoanForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: NewLoanInput) => void;
  onCancel: () => void;
}) {
  const [amount, setAmount] = useState(500_000_000);
  const [term, setTerm] = useState(120);
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [monthlyIncome, setMonthlyIncome] = useState(35_000_000);
  const [history, setHistory] = useState("Tốt · CIC nhóm 1 · không trễ hạn");
  const [collateral, setCollateral] = useState("BĐS Q.7, định giá 1,2 tỷ");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("low");
  const [auctionDurationMin, setAuctionDurationMin] = useState(5);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount,
      term,
      purpose,
      monthlyIncome,
      history,
      collateral,
      riskLevel,
      auctionDurationMin,
    });
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-border bg-card p-6 md:p-8"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center gap-2">
        <DemoBadge />
        <div className="text-xs text-muted-foreground">
          Bạn sẽ tạo một hồ sơ vay giả lập để mở phiên đấu giá vốn.
        </div>
      </div>
      <h3 className="mt-4 text-xl font-bold text-foreground">Tạo hồ sơ vay</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <NumberField
          label="Số tiền cần vay"
          icon={Wallet}
          value={amount}
          onChange={setAmount}
          step={50_000_000}
          min={50_000_000}
          max={10_000_000_000}
          suffix="₫"
          format
        />
        <NumberField
          label="Kỳ hạn (tháng)"
          icon={CalendarClock}
          value={term}
          onChange={setTerm}
          step={6}
          min={6}
          max={300}
        />
      </div>

      <div className="mt-4">
        <Label icon={Target}>Mục đích vay</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {PURPOSES.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setPurpose(p)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                purpose === p
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary/40 text-foreground hover:border-primary/30",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <NumberField
          label="Thu nhập / tháng"
          icon={TrendingUp}
          value={monthlyIncome}
          onChange={setMonthlyIncome}
          step={5_000_000}
          min={5_000_000}
          max={2_000_000_000}
          suffix="₫"
          format
        />
        <NumberField
          label="Thời gian phiên đấu giá (phút)"
          icon={Clock}
          value={auctionDurationMin}
          onChange={setAuctionDurationMin}
          step={1}
          min={2}
          max={60}
        />
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <Label icon={History}>Lịch sử tài chính</Label>
          <Input
            className="mt-2 h-11 rounded-xl"
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            placeholder="Vd: CIC nhóm 1, không trễ hạn..."
          />
        </div>
        <div>
          <Label icon={ShieldCheck}>Tài sản bảo đảm</Label>
          <Textarea
            className="mt-2 rounded-xl"
            value={collateral}
            onChange={(e) => setCollateral(e.target.value)}
            placeholder="Vd: BĐS Q.7, định giá 1,2 tỷ; xe ô tô..."
            rows={2}
          />
        </div>
        <div>
          <Label icon={Activity}>Mức độ rủi ro tự đánh giá</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["low", "medium", "high"] as RiskLevel[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRiskLevel(r)}
                className={cn(
                  "rounded-xl border p-2.5 text-xs font-semibold transition-colors",
                  riskLevel === r
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/30",
                )}
              >
                {r === "low" ? "Thấp" : r === "medium" ? "Trung bình" : "Cao"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="rounded-full" onClick={onCancel}>
          Huỷ
        </Button>
        <Button type="submit" className="rounded-full">
          <Sparkles className="h-4 w-4" />
          Mở phiên đấu giá vốn
        </Button>
      </div>
    </form>
  );
}

function Label({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-primary" />
      {children}
    </div>
  );
}

function NumberField({
  label,
  icon,
  value,
  onChange,
  step,
  min,
  max,
  suffix,
  format,
}: {
  label: string;
  icon: React.ElementType;
  value: number;
  onChange: (v: number) => void;
  step: number;
  min: number;
  max: number;
  suffix?: string;
  format?: boolean;
}) {
  return (
    <div>
      <Label icon={icon}>{label}</Label>
      <div className="mt-2 flex items-center gap-2">
        <Input
          type="number"
          inputMode="numeric"
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value || 0))}
          className="h-11 rounded-xl"
        />
        {suffix && <div className="text-sm font-medium text-muted-foreground">{suffix}</div>}
      </div>
      {format && (
        <div className="mt-1 text-[11px] text-muted-foreground">≈ {formatVNDFull(value)}</div>
      )}
    </div>
  );
}

function LoanDetail({
  loan,
  now,
  onAccept,
}: {
  loan: ReturnType<typeof useDemo>["loans"][number];
  now: number;
  onAccept: (offerId: string) => void;
}) {
  const sortedOffers = useMemo(
    () => [...loan.offers].sort((a, b) => a.rate - b.rate),
    [loan.offers],
  );
  const best = sortedOffers[0];
  const remaining = loan.auctionEndsAt - now;

  return (
    <div className="space-y-5">
      <div
        className="rounded-3xl border border-border bg-card p-6 md:p-7"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {loan.code}
              {loan.fromDemoUser && <DemoBadge />}
            </div>
            <h3 className="mt-1 text-xl font-bold text-foreground md:text-2xl">{loan.purpose}</h3>
            <div className="mt-1 text-sm text-muted-foreground">{loan.borrowerName}</div>
          </div>
          <div className="flex items-center gap-2">
            <RiskBadge level={loan.riskLevel} />
            <StatusBadge status={loan.status} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Mini label="Số tiền vay" value={formatVND(loan.amount)} highlight />
          <Mini label="Kỳ hạn" value={`${loan.term} tháng`} />
          <Mini label="Thu nhập / tháng" value={formatVND(loan.monthlyIncome)} />
          <Mini
            label={loan.status === "open" ? "Còn lại" : "Phiên đấu giá"}
            value={
              loan.status === "open"
                ? formatCountdown(remaining)
                : loan.status === "matched"
                  ? "Đã khớp"
                  : "Đã đóng"
            }
            tone={loan.status === "open" ? "emerald" : "primary"}
          />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <DetailLine icon={History} label="Lịch sử tài chính" value={loan.history} />
          <DetailLine icon={ShieldCheck} label="Tài sản bảo đảm" value={loan.collateral} />
        </div>
      </div>

      {loan.status === "matched" ? (
        <MatchedCard loan={loan} />
      ) : (
        <div
          className="rounded-3xl border border-border bg-card p-6 md:p-7"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-semibold text-foreground md:text-lg">
                Đề xuất từ người cho vay
              </h4>
              <p className="text-sm text-muted-foreground">
                Sắp xếp theo lãi suất tăng dần · {sortedOffers.length} đề xuất
              </p>
            </div>
            {best && loan.status === "open" && (
              <div className="rounded-xl bg-emerald/10 px-3 py-1.5 text-xs font-semibold text-emerald">
                Tốt nhất hiện tại: {formatRate(best.rate)}
              </div>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {sortedOffers.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-6 text-center">
                <div className="text-sm font-semibold text-foreground">Đang chờ đề xuất...</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Người cho vay sẽ gửi đề xuất trong vài giây tới (giả lập).
                </p>
              </div>
            )}
            {sortedOffers.map((offer, i) => (
              <OfferRow
                key={offer.id}
                offer={offer}
                isBest={i === 0}
                canAccept={loan.status === "open"}
                onAccept={() => onAccept(offer.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MatchedCard({ loan }: { loan: ReturnType<typeof useDemo>["loans"][number] }) {
  const offer = loan.offers.find((o) => o.id === loan.matchedOfferId);
  if (!offer) return null;
  return (
    <div
      className="rounded-3xl border border-emerald/30 bg-emerald/5 p-6 md:p-7"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald text-emerald-foreground">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <div className="text-base font-bold text-foreground md:text-lg">
            Khớp giao dịch thành công
          </div>
          <div className="text-sm text-muted-foreground">
            Bạn đã chọn đề xuất từ{" "}
            <span className="font-semibold text-foreground">{offer.lenderName}</span>
          </div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Mini label="Lãi suất" value={formatRate(offer.rate)} tone="emerald" highlight />
        <Mini label="Số tiền" value={formatVND(offer.amount)} />
        <Mini label="Kỳ hạn" value={`${offer.term} tháng`} />
        <Mini label="Bảo đảm" value={offer.collateralRequirement} />
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Trong sản phẩm thật, hai bên sẽ tiếp tục bước xác minh, ký hợp đồng điện tử và giải ngân
        theo quy định pháp luật.
      </p>
    </div>
  );
}

function OfferRow({
  offer,
  isBest,
  canAccept,
  onAccept,
}: {
  offer: ReturnType<typeof useDemo>["loans"][number]["offers"][number];
  isBest: boolean;
  canAccept: boolean;
  onAccept: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition-all md:p-5",
        isBest ? "border-emerald/40 bg-emerald/5" : "border-border bg-secondary/30",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LenderIcon type={offer.lenderType} className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground md:text-base">
                {offer.lenderName}
              </span>
              {isBest && (
                <span className="rounded-full bg-emerald/15 px-2 py-0.5 text-[10px] font-semibold text-emerald">
                  Lãi suất tốt nhất
                </span>
              )}
              {offer.fromDemoUser && <DemoBadge />}
            </div>
            <div className="text-xs text-muted-foreground">
              {lenderTypeLabel(offer.lenderType)} · {offer.conditions}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary md:text-xl">{formatRate(offer.rate)}</div>
          <div className="text-xs text-muted-foreground">
            {formatVND(offer.amount)} · {offer.term} tháng
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 min-w-[200px] items-center gap-2 text-xs">
          <Star className="h-3.5 w-3.5 text-accent-foreground" />
          <span className="font-medium text-muted-foreground">Mức phù hợp</span>
          <div className="relative h-1.5 max-w-[140px] flex-1 overflow-hidden rounded-full bg-card">
            <div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full",
                isBest ? "bg-emerald" : "bg-primary",
              )}
              style={{ width: `${offer.fitScore}%` }}
            />
          </div>
          <span className="font-semibold text-foreground">{offer.fitScore}/100</span>
        </div>
        {canAccept && (
          <Button size="sm" className="rounded-full" onClick={onAccept}>
            <Check className="h-4 w-4" />
            Chọn phương án này
          </Button>
        )}
      </div>
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
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3">
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

function Mini({
  label,
  value,
  highlight,
  tone = "primary",
}: {
  label: string;
  value: string;
  highlight?: boolean;
  tone?: "primary" | "emerald";
}) {
  const text = tone === "emerald" ? "text-emerald" : "text-primary";
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 text-sm font-bold md:text-base", highlight && text)}>{value}</div>
    </div>
  );
}
