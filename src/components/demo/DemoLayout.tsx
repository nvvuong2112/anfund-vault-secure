import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Banknote, Gavel, RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { DemoProvider, useDemo } from "./store";
import { PhoneFrame } from "./PhoneFrame";
import { BorrowerScreen } from "./BorrowerScreen";
import { AuctionScreen } from "./AuctionScreen";
import { LenderScreen } from "./LenderScreen";

type Role = "borrower" | "auction" | "lender";

const ROLES: { id: Role; label: string; hint: string; icon: React.ElementType }[] = [
  { id: "borrower", label: "Người vay", hint: "mở phiên, chọn bên thắng", icon: User },
  { id: "auction", label: "Đấu giá vốn", hint: "sàn trực tiếp", icon: Gavel },
  { id: "lender", label: "Người cho vay", hint: "hạ lãi để thắng", icon: Banknote },
];

export function DemoApp() {
  return (
    <DemoProvider>
      <DemoShell />
    </DemoProvider>
  );
}

/**
 * Sân khấu demo. Từ `xl` (≥1280px): ba điện thoại cạnh nhau, chung một phiên.
 * Dưới `xl`: một màn hình toàn khung, đổi vai bằng thanh tab dưới đáy.
 */
function DemoShell() {
  const [role, setRole] = useState<Role>("borrower");
  const [flash, setFlash] = useState<Role | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { resetDemo, loans } = useDemo();
  const totalOffers = loans.reduce((s, l) => s + l.offers.length, 0);

  useEffect(() => () => clearTimeout(flashTimer.current), []);

  // Chuyển vai từ bên trong một màn hình: trên điện thoại là đổi tab, trên máy tính
  // (cả ba máy đều đang hiện) thì viền máy đích sáng lên một nhịp để mắt tìm tới.
  const goTo = (r: Role) => {
    setRole(r);
    setFlash(r);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 1400);
  };

  const screens: Record<Role, React.ReactNode> = {
    borrower: <BorrowerScreen onGoLender={() => goTo("lender")} />,
    auction: <AuctionScreen />,
    lender: <LenderScreen />,
  };

  return (
    <div className="flex h-dvh flex-col bg-secondary/40 xl:h-auto xl:min-h-dvh">
      <header className="z-40 shrink-0 border-b border-border bg-background/90 backdrop-blur xl:sticky xl:top-0">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <a
              href="/"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Quay về trang chủ"
            >
              <ArrowLeft className="h-4 w-4" />
            </a>
            <Logo className="h-8 sm:h-9" />
            <span className="hidden items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-foreground md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Demo tương tác
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="text-[11px] text-muted-foreground tabular-nums sm:text-xs">
              {loans.length} hồ sơ · {totalOffers} đề xuất
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-md max-sm:w-11 max-sm:px-0"
              onClick={resetDemo}
              aria-label="Đặt lại demo"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="max-sm:sr-only">Đặt lại demo</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col xl:px-6 xl:py-5">
        <div className="mb-4 hidden text-center xl:block">
          <h1 className="text-xl font-bold text-foreground">Một phiên đấu giá, ba góc nhìn</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Thao tác ở máy nào, hai máy kia cập nhật ngay. Dữ liệu giả lập, không có giao dịch tiền
            thật.
          </p>
        </div>
        <h1 className="sr-only xl:hidden">Demo sàn đấu giá vốn AnFund</h1>

        <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col xl:max-w-none xl:flex-none xl:flex-row xl:items-start xl:justify-center xl:gap-8">
          {ROLES.map((r, i) => (
            <PhoneFrame
              key={r.id}
              label={r.label}
              hint={r.hint}
              step={i + 1}
              active={role === r.id}
              flash={flash === r.id}
            >
              {screens[r.id]}
            </PhoneFrame>
          ))}
        </div>
      </main>

      <nav
        aria-label="Chọn vai"
        className="grid shrink-0 grid-cols-3 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] xl:hidden"
      >
        {ROLES.map((r) => {
          const Icon = r.icon;
          const active = role === r.id;
          return (
            <button
              key={r.id}
              type="button"
              aria-pressed={active}
              onClick={() => setRole(r.id)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-emerald")} />
              {r.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
