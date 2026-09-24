import { useEffect, useId, useState } from "react";
import { CheckCircle2, Clock, Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useDemo } from "./store";
import type { Loan } from "./types";
import { bestRate, formatRate, formatVND, rankOffers, suggestRate } from "./format";
import { Countdown, RiskBadge, VerifiedBadge } from "./shared";
import { Chip, PrimaryAction, ScreenHeader } from "./PhoneFrame";

type Filter = "all" | "collateral" | "low" | "soon";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "collateral", label: "Có tài sản bảo đảm" },
  { id: "low", label: "Rủi ro thấp" },
  { id: "soon", label: "Sắp hết giờ" },
];

const SOON_MS = 12 * 60 * 60 * 1000;
/** Mức khởi điểm khi hồ sơ chưa có ai đặt, theo mức rủi ro (khớp store.tsx). */
const BASE_RATE = { low: 7.5, medium: 8.8, high: 10.5 } as const;

const hasCollateral = (l: Loan) => !/^không/i.test(l.collateral.trim());

/**
 * Màn hình bên cho vay, theo design/NguoiChoVay.dc.html: thứ to nhất trên mỗi
 * thẻ là "phải hạ xuống dưới bao nhiêu mới thắng". Bấm thẻ mở bảng đặt giá.
 */
export function LenderScreen() {
  const { loans, now, selectLoan } = useDemo();
  const [filter, setFilter] = useState<Filter>("all");
  const [sheetId, setSheetId] = useState<string | null>(null);

  const open = loans.filter((l) => l.status === "open");
  const shown = open.filter((l) =>
    filter === "collateral"
      ? hasCollateral(l)
      : filter === "low"
        ? l.riskLevel === "low"
        : filter === "soon"
          ? l.auctionEndsAt - now < SOON_MS
          : true,
  );
  const sheetLoan = loans.find((l) => l.id === sheetId);

  return (
    <>
      <ScreenHeader role="Bên cho vay">
        <h3 className="mt-4 text-[21px] font-bold leading-snug">
          {open.length} hồ sơ đã xác minh đang mở phiên
        </h3>
        <p className="mt-1 text-[12.5px] leading-relaxed text-white/75">
          Muốn thắng thì hạ lãi suất xuống dưới mức đang dẫn đầu. Người vay chọn, không phải hệ
          thống.
        </p>
      </ScreenHeader>

      <div
        className="flex shrink-0 gap-2 overflow-x-auto border-b border-border bg-card px-5 py-3 [scrollbar-width:none]"
        role="group"
        aria-label="Lọc hồ sơ"
      >
        {FILTERS.map((f) => (
          <Chip
            key={f.id}
            selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className="rounded-full"
          >
            {f.label}
          </Chip>
        ))}
      </div>

      <aside aria-label="Hồ sơ đang mở phiên" className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {shown.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
            Không có hồ sơ nào khớp bộ lọc này.
          </p>
        ) : (
          <ul className="space-y-3">
            {shown.map((l) => (
              <li key={l.id}>
                <DealCard
                  loan={l}
                  onOpen={() => {
                    selectLoan(l.id);
                    setSheetId(l.id);
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </aside>

      {sheetLoan && (
        // `key` bắt buộc: đổi hồ sơ thì form phải dựng lại từ đầu. Thiếu nó, React tái
        // dùng state cũ và bên cho vay vô tình chào 500 triệu cho hồ sơ cần 1,5 tỷ.
        <OfferSheet key={sheetLoan.id} loan={sheetLoan} onClose={() => setSheetId(null)} />
      )}
    </>
  );
}

function DealCard({ loan, onOpen }: { loan: Loan; onOpen: () => void }) {
  const { now } = useDemo();
  const ranked = rankOffers(loan.offers);
  const leader = ranked[0];
  const mine = ranked.find((o) => o.fromDemoUser);
  const urgent = loan.auctionEndsAt - now < SOON_MS;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="block w-full overflow-hidden rounded-2xl border-[1.5px] border-border bg-card text-left transition-colors hover:border-emerald/50 active:scale-[0.995]"
    >
      <div className="px-4 pb-3 pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[15px] font-bold tabular-nums text-foreground">
              {formatVND(loan.amount)}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {loan.code} · {loan.purpose} · {loan.term} tháng
            </div>
          </div>
          <div
            className={cn(
              "flex shrink-0 items-center gap-1 text-xs font-semibold tabular-nums",
              urgent ? "text-destructive" : "text-muted-foreground",
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            <Countdown ms={loan.auctionEndsAt - now} />
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <RiskBadge level={loan.riskLevel} />
          <VerifiedBadge verifiedAt={loan.verifiedAt} size="sm" />
          {hasCollateral(loan) && (
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
              Có TSBĐ
            </span>
          )}
        </div>
      </div>
      <div className="flex items-end justify-between gap-3 border-t border-border bg-secondary/40 px-4 py-2.5">
        {leader ? (
          <>
            <div className="shrink-0">
              <div className="text-[11px] whitespace-nowrap text-muted-foreground">
                Phải hạ xuống dưới
              </div>
              <div className="text-[26px] font-bold leading-none tabular-nums text-emerald">
                {String(leader.rate).replace(".", ",")}%
              </div>
            </div>
            <div className="min-w-0 text-right text-[11px] leading-snug text-muted-foreground">
              {mine?.id === leader.id ? (
                <div className="font-semibold text-emerald">Bạn đang dẫn đầu</div>
              ) : (
                <div className="font-semibold text-foreground">{leader.lenderName}</div>
              )}
              <div>
                {mine && mine.id !== leader.id
                  ? `Bạn đang đặt ${formatRate(mine.rate)}`
                  : `dẫn đầu · ${loan.offers.length} đề xuất`}
              </div>
            </div>
          </>
        ) : (
          <div className="py-1 text-sm font-semibold text-emerald">
            Chưa ai đặt. Bạn vào là dẫn đầu.
          </div>
        )}
      </div>
    </button>
  );
}

function OfferSheet({ loan, onClose }: { loan: Loan; onClose: () => void }) {
  const { submitOffer } = useDemo();
  const ranked = rankOffers(loan.offers);
  const leading = bestRate(loan.offers);
  const leader = ranked[0];
  const [rate, setRate] = useState(() => suggestRate(leading ?? BASE_RATE[loan.riskLevel] + 0.2));
  const [amount, setAmount] = useState(loan.amount);
  const [term, setTerm] = useState(loan.term);
  const [lenderName, setLenderName] = useState("Quỹ đầu tư của bạn");
  const [sentRate, setSentRate] = useState<number | null>(null);
  const uid = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const step = (d: number) =>
    setRate((r) => Math.min(20, Math.max(5, Math.round((r + d) * 10) / 10)));
  const wins = leading == null || rate < leading;
  const canSend = loan.status === "open" && rate > 0 && amount > 0 && term > 0;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    submitOffer(loan.id, {
      lenderName: lenderName.trim() || "Quỹ đầu tư của bạn",
      lenderType: "fund",
      rate,
      amount,
      term,
      conditions: "Cố định 12 tháng đầu, giải ngân 24h",
      collateralRequirement: hasCollateral(loan) ? "BĐS thế chấp" : "Tín chấp",
    });
    setSentRate(rate);
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Đóng bảng đặt giá"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-[oklch(0.2_0.05_258/0.45)]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        className="relative max-h-[90%] overflow-y-auto rounded-t-3xl bg-card px-5 pb-5 pt-2 shadow-2xl motion-safe:animate-in motion-safe:slide-in-from-bottom-4"
      >
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-border" />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 id={`${uid}-title`} className="text-lg font-bold text-foreground">
              Đặt giá cho {loan.code}
            </h4>
            <div className="text-xs text-muted-foreground">
              {formatVND(loan.amount)} · {loan.purpose} · {loan.term} tháng
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {sentRate != null ? (
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald" />
            <div className="mt-2 text-base font-bold text-foreground">
              Đã gửi đề xuất {formatRate(sentRate)}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Nó hiện ngay trên sàn và trên máy người vay. Gửi rồi vẫn hạ tiếp được: mỗi lần gửi là
              một đề xuất mới.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRate(suggestRate(Math.min(sentRate, leading ?? sentRate)));
                  setSentRate(null);
                }}
                className="min-h-11 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Hạ tiếp
              </button>
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Xong
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={send} className="mt-3 space-y-4">
            <div className="rounded-xl bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
              {leader ? (
                <>
                  Đang dẫn đầu: <b className="text-foreground">{formatRate(leader.rate)}</b> ·{" "}
                  {leader.lenderName}
                </>
              ) : (
                "Chưa có đề xuất nào cho hồ sơ này."
              )}
            </div>

            <div>
              <label htmlFor={`${uid}-rate`} className="text-xs font-semibold text-foreground">
                Lãi suất / năm (%)
              </label>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => step(-0.1)}
                  aria-label="Giảm 0,1 điểm"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border hover:bg-secondary"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <Input
                  id={`${uid}-rate`}
                  type="number"
                  inputMode="decimal"
                  step={0.1}
                  min={5}
                  max={20}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value || 0))}
                  className="h-12 rounded-xl text-center text-2xl font-bold tabular-nums md:text-2xl"
                />
                <button
                  type="button"
                  onClick={() => step(0.1)}
                  aria-label="Tăng 0,1 điểm"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border hover:bg-secondary"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div
                className={cn(
                  "mt-1.5 text-xs font-semibold",
                  wins ? "text-emerald" : "text-accent-foreground",
                )}
              >
                {leading == null
                  ? "Bạn sẽ là người dẫn đầu."
                  : wins
                    ? `Bạn sẽ dẫn đầu, thấp hơn ${String(Math.round((leading - rate) * 10) / 10).replace(".", ",")} điểm.`
                    : `Chưa dẫn đầu. Cần thấp hơn ${formatRate(leading)}.`}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${uid}-amount`} className="text-xs font-semibold text-foreground">
                  Số tiền tài trợ (₫)
                </label>
                <Input
                  id={`${uid}-amount`}
                  type="number"
                  inputMode="numeric"
                  step={1_000_000}
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value || 0))}
                  className="mt-1.5 h-11 rounded-xl tabular-nums"
                />
                <div className="mt-1 text-[10.5px] text-muted-foreground">{formatVND(amount)}</div>
              </div>
              <div>
                <label htmlFor={`${uid}-term`} className="text-xs font-semibold text-foreground">
                  Kỳ hạn (tháng)
                </label>
                <Input
                  id={`${uid}-term`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value || 0))}
                  className="mt-1.5 h-11 rounded-xl tabular-nums"
                />
              </div>
            </div>

            <div>
              <label htmlFor={`${uid}-name`} className="text-xs font-semibold text-foreground">
                Tên hiển thị trên sàn
              </label>
              <Input
                id={`${uid}-name`}
                value={lenderName}
                onChange={(e) => setLenderName(e.target.value)}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>

            <PrimaryAction type="submit" disabled={!canSend}>
              {loan.status !== "open" ? "Phiên đã kết thúc" : "Gửi đề xuất"}
            </PrimaryAction>
            <p className="text-center text-[10.5px] leading-snug text-muted-foreground">
              Chỉ bên cho vay đã được AnFund xác minh mới đặt được giá. Demo coi như bạn đã xác
              minh.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
