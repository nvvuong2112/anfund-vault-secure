import { cn } from "@/lib/utils";

/**
 * Một "điện thoại" trong sân khấu demo.
 *
 * Từ `xl` trở lên cả ba máy luôn hiện cạnh nhau, có viền máy. Dưới `xl` chỉ máy
 * đang chọn hiện ra, không viền, chiếm trọn chiều cao giữa header và thanh tab.
 *
 * Ẩn/hiện bằng class CSS chứ không bằng JS đo màn hình: HTML server và client
 * phải giống hệt nhau, nếu không React dựng lại cả cây (xem Countdown).
 * Cả ba màn hình vì thế luôn được mount, đổi tab không làm mất state cục bộ.
 */
export function PhoneFrame({
  label,
  hint,
  step,
  active,
  flash,
  children,
}: {
  label: string;
  hint: string;
  step: number;
  active: boolean;
  flash: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        active ? "flex" : "hidden",
        "min-h-0 min-w-0 flex-1 flex-col xl:flex xl:w-[360px] xl:flex-none",
      )}
    >
      <div className="mb-3 hidden items-center justify-center gap-2 xl:flex">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
          {step}
        </span>
        <h2 className="text-sm font-semibold text-foreground">{label}</h2>
        <span className="text-xs text-muted-foreground">· {hint}</span>
      </div>
      <div
        className={cn(
          "relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background",
          "xl:h-[min(780px,calc(100dvh-12.5rem))] xl:min-h-[600px] xl:flex-none xl:rounded-[2.4rem] xl:border-[9px] xl:border-[oklch(0.22_0.05_258)] xl:shadow-(--shadow-phone)",
          "transition-[outline-color] duration-500 xl:outline-4 xl:outline-offset-4",
          flash ? "xl:outline-gold" : "xl:outline-transparent",
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Dải navy trên cùng mỗi màn hình: logo chữ ANFUND + nhãn vai trò. */
export function ScreenHeader({
  role,
  children,
  left,
}: {
  role: string;
  children?: React.ReactNode;
  left?: React.ReactNode;
}) {
  return (
    <div
      className="shrink-0 px-5 pb-5 pt-4 text-primary-foreground"
      style={{ background: "var(--gradient-navy)" }}
    >
      <div className="flex min-h-11 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {left}
          <Wordmark />
        </div>
        <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium">
          {role}
        </span>
      </div>
      {children}
    </div>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
        <path
          d="M2 16 C 6 11, 10 20, 14 15 S 20 11, 22 15"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 2.5 l1.5 3.4 3.7 .4 -2.8 2.5 .8 3.6 -3.2 -1.9 -3.2 1.9 .8 -3.6 -2.8 -2.5 3.7 -.4z"
          fill="var(--gold)"
        />
      </svg>
      <span className="text-[11px] font-bold tracking-[0.2em]">ANFUND</span>
    </span>
  );
}

/** Nút chọn dạng viên thuốc, vùng chạm 44px. */
export function Chip({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "min-h-11 shrink-0 rounded-xl border-[1.5px] px-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors active:scale-[0.98]",
        selected
          ? "border-emerald bg-emerald/10 text-emerald"
          : "border-border bg-card text-foreground hover:border-emerald/40",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Nút hành động chính cuối màn hình — mỗi màn hình chỉ một nút như vậy. */
export function PrimaryAction({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Chân màn hình dính dưới đáy, chứa nút hành động chính. */
export function ScreenFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="shrink-0 border-t border-border bg-card/95 px-5 pb-4 pt-3 backdrop-blur">
      {children}
    </div>
  );
}
