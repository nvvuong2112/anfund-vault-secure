import { useState } from "react";
import { ArrowLeft, RefreshCw, User, Banknote, Gavel, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { DemoProvider, useDemo } from "./store";
import { BorrowerView } from "./BorrowerView";
import { LenderView } from "./LenderView";
import { AuctionView } from "./AuctionView";
import { cn } from "@/lib/utils";

type Tab = "borrower" | "lender" | "auction";

const TABS: { id: Tab; label: string; sub: string; icon: React.ElementType }[] = [
  { id: "borrower", label: "Người vay", sub: "Tạo hồ sơ · so sánh đề xuất", icon: User },
  { id: "lender", label: "Người cho vay", sub: "Lọc hồ sơ · gửi đề xuất", icon: Banknote },
  { id: "auction", label: "Đấu giá vốn", sub: "Theo dõi cạnh tranh trực tiếp", icon: Gavel },
];

export function DemoApp() {
  return (
    <DemoProvider>
      <DemoShell />
    </DemoProvider>
  );
}

function DemoShell() {
  const [tab, setTab] = useState<Tab>("borrower");
  const { resetDemo, loans } = useDemo();
  const totalOffers = loans.reduce((s, l) => s + l.offers.length, 0);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-secondary/30">
      <img
        src="/brand/anfund-logo-icon.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-[-9rem] top-16 w-[34rem] max-w-none opacity-[0.06]"
      />
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Quay về trang chủ"
            >
              <ArrowLeft className="h-4 w-4" />
            </a>
            <Logo className="h-9 sm:h-10" />
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Demo tương tác
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-xs text-muted-foreground sm:block">
              {loans.length} hồ sơ · {totalOffers} đề xuất
            </div>
            <Button variant="outline" size="sm" className="rounded-md" onClick={resetDemo}>
              <RefreshCw className="h-4 w-4" />
              Đặt lại demo
            </Button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6 flex items-start gap-3 border border-primary/10 bg-white/80 p-4 text-sm backdrop-blur md:p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Info className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-foreground">
              Trải nghiệm sàn đấu giá vốn hai chiều
            </h1>
            <p className="mt-0.5 text-muted-foreground">
              Chuyển qua lại 3 tab để vào vai mỗi bên: tạo hồ sơ vay, gửi đề xuất tài trợ, hoặc xem
              phiên đấu giá đang diễn ra. Dữ liệu là{" "}
              <span className="font-medium text-foreground">giả lập</span> — không xử lý giao dịch
              tiền thật.
            </p>
          </div>
        </div>

        <div
          className="grid gap-2 rounded-lg border border-border bg-card p-2 sm:grid-cols-3"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={active}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-4 py-3 text-left transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-transparent text-foreground hover:bg-secondary",
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    active ? "bg-white/15 text-primary-foreground" : "bg-primary/10 text-primary",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{t.label}</div>
                  <div
                    className={cn(
                      "truncate text-[11px]",
                      active ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    {t.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {tab === "borrower" && <BorrowerView />}
          {tab === "lender" && <LenderView />}
          {tab === "auction" && <AuctionView />}
        </div>

        <div className="mt-12 rounded-lg border border-border bg-secondary/50 p-5 text-xs leading-relaxed text-muted-foreground md:p-6">
          <span className="font-semibold text-foreground">Ghi chú:</span> Đây là demo tương tác để
          minh hoạ trải nghiệm AnFund. Mọi hồ sơ, đề xuất và giao dịch đều là giả lập — không có
          giao dịch tiền thật. Trong sản phẩm thật, các bước xác minh danh tính, ký kết và giải ngân
          được thực hiện theo quy định pháp luật hiện hành.
        </div>
      </main>
    </div>
  );
}
