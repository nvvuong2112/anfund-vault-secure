import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileCheck2,
  Gavel,
  Loader2,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemo } from "./store";
import { MIN_AUCTION_HOURS, VERIFICATION_DAYS, type Loan, type Offer } from "./types";
import { bestRate, formatRate, formatVND, lenderTypeLabel, rankOffers } from "./format";
import { Countdown, LenderIcon, StatusBadge, VerifiedBadge } from "./shared";
import { Chip, PrimaryAction, ScreenFooter, ScreenHeader } from "./PhoneFrame";

type Step = "welcome" | "questions" | "verify" | "auction";

/** Luồng 3 câu hỏi không hỏi thời lượng phiên — demo đặt 24 giờ, không bao giờ dưới mức tối thiểu. */
const DEMO_AUCTION_HOURS = Math.max(MIN_AUCTION_HOURS, 24);

const AMOUNTS = [300_000_000, 500_000_000, 1_000_000_000, 2_000_000_000];
const TERMS = [12, 36, 60, 120];
const PURPOSES = ["Mua nhà ở", "Kinh doanh", "Học tập", "Khác"];
const STEP_ORDER: Step[] = ["welcome", "questions", "verify", "auction"];

type Answers = { amount?: number; term?: number; purpose?: string };

/**
 * Màn hình người vay, theo design/Main.dc.html:
 * mở app → ba câu hỏi → xác minh → đấu giá → chọn bên thắng.
 */
export function BorrowerScreen({ onGoLender }: { onGoLender: () => void }) {
  const { loans, createLoan, selectLoan } = useDemo();
  const [step, setStep] = useState<Step>("welcome");
  const [loanId, setLoanId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>({});

  const loan = loans.find((l) => l.id === loanId);
  // "Đặt lại demo" dựng lại toàn bộ hồ sơ với id mới → hồ sơ đang xem biến mất, quay về đầu.
  const current: Step = step === "auction" && !loan ? "welcome" : step;

  const openAuction = (id: string) => {
    setLoanId(id);
    selectLoan(id);
    setStep("auction");
  };

  const back = () => {
    const i = STEP_ORDER.indexOf(current);
    setStep(current === "auction" ? "welcome" : STEP_ORDER[Math.max(0, i - 1)]);
  };

  const submit = () => {
    const { amount, term, purpose } = answers;
    if (!amount || !term || !purpose) return;
    const home = purpose === "Mua nhà ở";
    const id = createLoan({
      amount,
      term,
      purpose,
      monthlyIncome: 30_000_000,
      history: "Khai báo trong bản demo",
      collateral: home ? "Căn nhà dự định mua" : "Không có",
      riskLevel: home ? "low" : "medium",
      auctionDurationHours: DEMO_AUCTION_HOURS,
    });
    setAnswers({});
    openAuction(id);
  };

  const backButton =
    current === "welcome" ? undefined : (
      <button
        type="button"
        onClick={back}
        aria-label="Quay lại"
        className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
    );

  return (
    <>
      {current === "welcome" && (
        <Welcome onStart={() => setStep("questions")} onWatch={openAuction} onLend={onGoLender} />
      )}
      {current === "questions" && (
        <Questions
          back={backButton}
          answers={answers}
          onChange={setAnswers}
          onNext={() => setStep("verify")}
        />
      )}
      {current === "verify" && <Verify back={backButton} onOpen={submit} />}
      {current === "auction" && loan && (
        <BorrowerAuction
          back={backButton}
          loan={loan}
          onRestart={() => {
            setLoanId(null);
            setStep("welcome");
          }}
        />
      )}
    </>
  );
}

function StepDots({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="mt-4 flex items-center gap-1.5" aria-label={`Bước ${step} trên 3`}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i === step ? "w-6 bg-gold" : i < step ? "w-3 bg-white/70" : "w-3 bg-white/25",
          )}
        />
      ))}
    </div>
  );
}

/* ───────────────────────── 0 · Mở app ───────────────────────── */

function Welcome({
  onStart,
  onWatch,
  onLend,
}: {
  onStart: () => void;
  onWatch: (id: string) => void;
  onLend: () => void;
}) {
  const { loans, now } = useDemo();
  // Phiên mẫu để khoe ngay màn hình đầu: HS-002389 nếu còn mở, không thì phiên mở bất kỳ.
  const live =
    loans.find((l) => l.code === "HS-002389" && l.status === "open") ??
    loans.find((l) => l.status === "open");
  const ranked = live ? rankOffers(live.offers) : [];

  return (
    <>
      <ScreenHeader role="Người vay">
        <p className="mt-6 text-[26px] font-bold leading-tight tracking-tight">
          Bạn không đi tìm vốn.
          <br />
          <em className="font-serif font-semibold text-gold">Vốn đi tìm bạn.</em>
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/75">
          Nộp hồ sơ một lần. Nhiều bên cho vay đã xác minh hạ lãi suất để giành bạn.
        </p>
      </ScreenHeader>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {live ? (
          <button
            type="button"
            onClick={() => onWatch(live.id)}
            className="block w-full rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-emerald/40"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 text-emerald">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
                </span>
                Đang diễn ra
              </span>
              <span className="tabular-nums">
                còn <Countdown ms={live.auctionEndsAt - now} />
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {live.code} · {formatVND(live.amount)} · {live.purpose}
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-[11px] text-muted-foreground">Lãi suất thấp nhất lúc này</div>
                <div className="text-[40px] font-bold leading-none tracking-tight text-emerald tabular-nums">
                  {ranked[0] ? `${String(ranked[0].rate).replace(".", ",")}%` : "—"}
                </div>
              </div>
              <div className="text-right text-[11px] text-muted-foreground">
                {ranked.length} bên đang đặt
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
              {ranked.slice(0, 4).map((o, i) => (
                <li key={o.id} className="flex items-center justify-between gap-2 text-xs">
                  <span className="min-w-0 text-foreground">
                    <span className="mr-1.5 text-muted-foreground">{i + 1}.</span>
                    {o.lenderName}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">{formatRate(o.rate)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-xs font-semibold text-emerald">Xem phiên này →</div>
          </button>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            Chưa có phiên nào đang mở. Tạo hồ sơ của bạn để mở phiên mới.
          </div>
        )}
      </div>

      <ScreenFooter>
        <PrimaryAction onClick={onStart}>Tôi cần vay vốn</PrimaryAction>
        <button
          type="button"
          onClick={onLend}
          className="mt-2 flex min-h-11 w-full items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-secondary"
        >
          Tôi muốn cho vay
        </button>
        <p className="mt-2 text-center text-[10.5px] leading-snug text-muted-foreground">
          Bản demo. Mọi số liệu là giả lập, không có giao dịch tiền thật.
        </p>
      </ScreenFooter>
    </>
  );
}

/* ───────────────────────── 1 · Ba câu hỏi ───────────────────────── */

function Questions({
  back,
  answers,
  onChange,
  onNext,
}: {
  back: React.ReactNode;
  answers: Answers;
  onChange: (a: Answers) => void;
  onNext: () => void;
}) {
  const done = answers.amount != null && answers.term != null && answers.purpose != null;
  return (
    <>
      <ScreenHeader role="Người vay" left={back}>
        <StepDots step={1} />
        <h3 className="mt-3 text-[21px] font-bold leading-snug">Ba câu hỏi, thế là đủ</h3>
        <p className="mt-1 text-[12.5px] leading-relaxed text-white/75">
          Phần còn lại AnFund tự xác minh. Bạn không phải điền hai mươi ô.
        </p>
      </ScreenHeader>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <Question title="Bạn cần bao nhiêu?">
          {AMOUNTS.map((a) => (
            <Chip
              key={a}
              selected={answers.amount === a}
              onClick={() => onChange({ ...answers, amount: a })}
            >
              {formatVND(a).replace(" ₫", "")}
            </Chip>
          ))}
        </Question>
        <Question title="Trả trong bao lâu?">
          {TERMS.map((t) => (
            <Chip
              key={t}
              selected={answers.term === t}
              onClick={() => onChange({ ...answers, term: t })}
            >
              {t} tháng
            </Chip>
          ))}
        </Question>
        <Question title="Để làm gì?">
          {PURPOSES.map((p) => (
            <Chip
              key={p}
              selected={answers.purpose === p}
              onClick={() => onChange({ ...answers, purpose: p })}
            >
              {p}
            </Chip>
          ))}
        </Question>
      </div>
      <ScreenFooter>
        <div className="mb-2 min-h-4 text-center text-xs text-muted-foreground">
          {done
            ? `${formatVND(answers.amount!)} · ${answers.term} tháng · ${answers.purpose}`
            : "Chọn đủ ba mục ở trên"}
        </div>
        <PrimaryAction disabled={!done} onClick={onNext}>
          Gửi hồ sơ xác minh
        </PrimaryAction>
      </ScreenFooter>
    </>
  );
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-foreground">{title}</legend>
      <div className="mt-2.5 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

/* ───────────────────────── 2 · Xác minh ───────────────────────── */

function Verify({ back, onOpen }: { back: React.ReactNode; onOpen: () => void }) {
  const timeline = [
    { icon: FileCheck2, title: "Nộp hồ sơ", sub: "Hôm nay" },
    {
      icon: ShieldCheck,
      title: "AnFund xác minh",
      sub: `Tối thiểu ${VERIFICATION_DAYS} ngày làm việc`,
    },
    {
      icon: Gavel,
      title: "Mở phiên đấu giá",
      sub: `Tối thiểu ${MIN_AUCTION_HOURS} giờ · demo đặt ${DEMO_AUCTION_HOURS} giờ`,
    },
    { icon: Trophy, title: "Bạn chọn bên thắng", sub: "Không ai chọn thay bạn" },
  ];
  return (
    <>
      <ScreenHeader role="Người vay" left={back}>
        <StepDots step={2} />
        <h3 className="mt-3 text-[21px] font-bold leading-snug">
          AnFund cần {VERIFICATION_DAYS} ngày làm việc để xác minh
        </h3>
        <p className="mt-1 text-[12.5px] leading-relaxed text-white/75">
          Nói trước để bạn không bất ngờ. Đổi lại, bên cho vay tin số liệu của bạn ngay khi phiên
          mở.
        </p>
      </ScreenHeader>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="text-sm font-semibold text-foreground">Vì sao phải chờ</div>
          <ul className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
            <li>• Chỉ hồ sơ đã kiểm tra mới được đưa lên sàn.</li>
            <li>• Bên cho vay dám hạ lãi vì không phải tự thẩm định lại.</li>
            <li>• Bạn nộp một lần, không phải nộp lại cho từng nơi.</li>
          </ul>
        </div>
        <ol className="relative space-y-4 pl-1">
          {timeline.map((t, i) => (
            <li key={t.title} className="relative flex gap-3">
              {i < timeline.length - 1 && (
                <span className="absolute left-[17px] top-9 h-[calc(100%-18px)] w-px bg-border" />
              )}
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  i === 0 ? "bg-emerald text-white" : "bg-secondary text-primary",
                )}
              >
                <t.icon className="h-4 w-4" />
              </span>
              <div className="pt-1">
                <div className="text-sm font-semibold text-foreground">{t.title}</div>
                <div className="text-xs text-muted-foreground">{t.sub}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <ScreenFooter>
        <PrimaryAction onClick={onOpen}>Mở phiên đấu giá vốn</PrimaryAction>
        <p className="mt-2 text-center text-[10.5px] text-muted-foreground">
          Bỏ qua {VERIFICATION_DAYS} ngày chờ, chỉ trong bản demo này.
        </p>
      </ScreenFooter>
    </>
  );
}

/* ───────────────────────── 3 · Đấu giá + 4 · Xong ───────────────────────── */

function BorrowerAuction({
  back,
  loan,
  onRestart,
}: {
  back: React.ReactNode;
  loan: Loan;
  onRestart: () => void;
}) {
  const { now, acceptOffer } = useDemo();
  const ranked = rankOffers(loan.offers);
  const [picked, setPicked] = useState<string | null>(null);
  // Mặc định chọn sẵn đề xuất rẻ nhất — người vay chỉ cần bấm xác nhận.
  const chosen = ranked.find((o) => o.id === picked) ?? ranked[0];

  if (loan.status === "matched") {
    return <Receipt back={back} loan={loan} onRestart={onRestart} />;
  }

  const lowest = bestRate(loan.offers);

  return (
    <>
      <ScreenHeader role="Người vay" left={back}>
        <StepDots step={3} />
        <div className="mt-3 flex items-center justify-between gap-2">
          <h3 className="text-[19px] font-bold">
            {loan.code} · {formatVND(loan.amount)}
          </h3>
          <span className="shrink-0 rounded-md bg-white">
            <StatusBadge status={loan.status} />
          </span>
        </div>
        <p className="mt-0.5 text-xs text-white/70">
          {loan.purpose} · {loan.term} tháng · {loan.borrowerName}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Tile label="Còn lại">
            <Countdown ms={loan.auctionEndsAt - now} />
          </Tile>
          <Tile label="Đề xuất">{loan.offers.length}</Tile>
          <Tile label="Thấp nhất" gold>
            {lowest != null ? `${String(lowest).replace(".", ",")}%` : "—"}
          </Tile>
        </div>
      </ScreenHeader>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <p className="text-[11.5px] leading-relaxed text-muted-foreground">
          Xếp theo lãi suất, thấp nhất đứng đầu. Điểm phù hợp chỉ để tham khảo, không đổi thứ hạng.
        </p>

        {ranked.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-border px-4 py-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-emerald motion-reduce:animate-none" />
            <div className="mt-3 text-sm font-semibold text-foreground">Đang chờ đề xuất…</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Bên cho vay thường vào trong vài giây đầu. Bạn cũng có thể tự đặt thử ở màn hình Người
              cho vay.
            </div>
          </div>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {ranked.map((o, i) => (
              <li key={o.id}>
                <OfferCard
                  offer={o}
                  rank={i + 1}
                  loanAmount={loan.amount}
                  selected={chosen?.id === o.id}
                  disabled={loan.status !== "open"}
                  onPick={() => setPicked(o.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {loan.status === "open" && chosen && (
        <ScreenFooter>
          <div className="mb-2 text-center text-xs text-muted-foreground">
            {chosen.lenderName} · <b className="text-foreground">{formatRate(chosen.rate)}</b>
          </div>
          <PrimaryAction onClick={() => acceptOffer(loan.id, chosen.id)}>
            Chọn phương án này
          </PrimaryAction>
        </ScreenFooter>
      )}
      {loan.status === "closed" && (
        <ScreenFooter>
          <p className="py-1 text-center text-xs leading-relaxed text-muted-foreground">
            Phiên đã hết giờ mà chưa chọn bên thắng. AnFund không tự trao cho ai.
          </p>
        </ScreenFooter>
      )}
    </>
  );
}

function Tile({
  label,
  gold,
  children,
}: {
  label: string;
  gold?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl px-2.5 py-2", gold ? "bg-gold/20" : "bg-white/10")}>
      <div className="text-[10px] text-white/65">{label}</div>
      <div
        className={cn(
          "mt-0.5 text-[15px] font-bold tabular-nums leading-tight",
          gold && "text-gold",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function OfferCard({
  offer,
  rank,
  loanAmount,
  selected,
  disabled,
  onPick,
}: {
  offer: Offer;
  rank: number;
  loanAmount: number;
  selected: boolean;
  disabled: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onPick}
      className={cn(
        "block w-full rounded-2xl border-[1.5px] bg-card p-3.5 text-left transition-colors disabled:cursor-default",
        selected ? "border-emerald" : "border-border hover:border-emerald/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <LenderIcon type={offer.lenderType} className="h-4 w-4 text-primary" />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-snug text-foreground">
              {offer.lenderName}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <VerifiedBadge verifiedAt={offer.lenderVerifiedAt} size="sm" />
              <span className="text-[10.5px] text-muted-foreground">
                {lenderTypeLabel(offer.lenderType)}
              </span>
            </div>
          </div>
        </div>
        <div className="shrink-0 text-right">
          {rank === 1 && (
            <div className="mb-0.5 inline-block rounded-md bg-gold/25 px-1.5 py-0.5 text-[9.5px] font-bold text-gold-foreground">
              THẤP NHẤT
            </div>
          )}
          <div className="text-xl font-bold tabular-nums text-foreground">
            {String(offer.rate).replace(".", ",")}%
          </div>
        </div>
      </div>
      <div className="mt-2.5 text-xs text-muted-foreground">
        {formatVND(offer.amount)} · {offer.term} tháng · {offer.conditions}
      </div>
      {offer.amount < loanAmount && (
        <div className="mt-1.5 text-[11px] font-semibold text-accent-foreground">
          Chỉ tài trợ một phần
        </div>
      )}
      <div className="mt-2.5 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-emerald/70"
            style={{ width: `${offer.fitScore}%` }}
          />
        </div>
        <span className="text-[10.5px] text-muted-foreground">Phù hợp {offer.fitScore}/100</span>
      </div>
    </button>
  );
}

function Receipt({
  back,
  loan,
  onRestart,
}: {
  back: React.ReactNode;
  loan: Loan;
  onRestart: () => void;
}) {
  const win = loan.offers.find((o) => o.id === loan.matchedOfferId);
  const highest = loan.offers.length ? Math.max(...loan.offers.map((o) => o.rate)) : undefined;
  const saved = win && highest != null ? Math.round((highest - win.rate) * 10) / 10 : 0;

  return (
    <>
      <ScreenHeader role="Người vay" left={back}>
        <div className="mt-5 flex items-center gap-3">
          <CheckCircle2 className="h-9 w-9 shrink-0 text-gold" />
          <div>
            <h3 className="text-[20px] font-bold leading-snug">Xong. Bạn đã chọn bên thắng.</h3>
            <div className="mt-1">
              <StatusBadge status="matched" />
            </div>
          </div>
        </div>
      </ScreenHeader>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {win && (
          <dl className="divide-y divide-border rounded-2xl border border-border bg-card text-sm">
            {[
              ["Hồ sơ", loan.code],
              ["Số tiền", formatVND(win.amount)],
              ["Lãi suất", formatRate(win.rate)],
              ["Kỳ hạn", `${win.term} tháng`],
              ["Bên cho vay", win.lenderName],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-semibold text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {saved > 0 && (
          <div className="rounded-2xl bg-emerald/10 px-4 py-3 text-sm text-emerald">
            Thấp hơn mức cao nhất trong phiên{" "}
            <b className="tabular-nums">{String(saved).replace(".", ",")} điểm %</b>.
          </div>
        )}
        <div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" /> Tiếp theo là gì
          </div>
          <ol className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
            <li>1. Trong sản phẩm thật, hai bên ký hợp đồng theo quy định pháp luật.</li>
            <li>2. Bên cho vay giải ngân theo điều kiện đã chào.</li>
            <li>3. Các đề xuất còn lại tự động bị từ chối.</li>
          </ol>
        </div>
      </div>
      <ScreenFooter>
        <PrimaryAction onClick={onRestart}>Xem lại từ đầu</PrimaryAction>
      </ScreenFooter>
    </>
  );
}
