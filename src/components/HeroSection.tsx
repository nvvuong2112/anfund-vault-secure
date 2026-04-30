import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Building2,
  User,
  Gavel,
  Check,
} from "lucide-react";
import { Button } from "./ui/button";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute inset-0 -z-10 bg-grid-soft opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="reveal inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent-foreground" />
              Sàn đấu giá vốn hai chiều — Two-sided Smart Lending Marketplace
            </div>

            <h1 className="reveal mt-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              <span className="block">AnFund</span>
              <span className="block text-primary">Nơi người vay tốt</span>
              <span className="block">gặp nguồn vốn cạnh tranh.</span>
            </h1>

            <p className="reveal mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              Sàn đấu giá vốn hai chiều giúp người vay tiếp cận nhiều đề xuất tài chính phù hợp hơn,
              đồng thời giúp người cho vay cạnh tranh để tài trợ cho những hồ sơ vay chất lượng.
            </p>

            <p className="reveal mt-4 max-w-xl text-sm text-muted-foreground/90">
              Với AnFund, người vay không chỉ đi tìm vốn. Nếu hồ sơ tài chính tốt, chính khoản vay
              sẽ trở thành cơ hội hấp dẫn để nhiều bên cho vay cạnh tranh. Ngược lại, người cho vay
              chủ động lựa chọn hồ sơ phù hợp và đưa ra đề xuất tài trợ cạnh tranh.
            </p>

            <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="h-12 rounded-full px-6 text-sm">
                <a href="#signup">
                  Tôi muốn vay
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-primary/20 px-6 text-sm hover:bg-primary/5"
              >
                <a href="#signup">Tôi muốn cho vay</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="h-12 rounded-full px-6 text-sm text-muted-foreground hover:bg-secondary"
              >
                <a href="#how-it-works">Xem cách hoạt động</a>
              </Button>
            </div>

            <div className="reveal mt-10 grid max-w-xl grid-cols-3 gap-3 text-xs text-muted-foreground">
              <TrustItem
                icon={<ShieldCheck className="h-4 w-4 text-primary" />}
                label="Minh bạch hồ sơ"
              />
              <TrustItem
                icon={<TrendingUp className="h-4 w-4 text-emerald" />}
                label="Cạnh tranh hai chiều"
              />
              <TrustItem
                icon={<Sparkles className="h-4 w-4 text-accent-foreground" />}
                label="Có chọn lọc"
              />
            </div>
          </div>

          <div className="reveal relative lg:col-span-6">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card/70 px-3 py-2 backdrop-blur">
      {icon}
      <span className="font-medium text-foreground">{label}</span>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        className="relative rounded-3xl border border-border bg-card p-5 md:p-6"
        style={{ boxShadow: "var(--shadow-phone)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Gavel className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Phiên đấu giá vốn
              </div>
              <div className="text-sm font-semibold text-foreground">HS-002389 · 500.000.000 ₫</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2.5 py-1 text-[11px] font-medium text-emerald">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            Đang mở · 02:14:08
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat label="Đề xuất nhận được" value="14" />
          <Stat label="Lãi suất tốt nhất" value="7,2%/năm" highlight />
          <Stat label="Kỳ hạn" value="120 tháng" />
          <Stat label="Mức độ phù hợp" value="92/100" />
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Đề xuất cạnh tranh hàng đầu</span>
            <a href="#mockups" className="font-medium text-primary hover:underline">
              Xem tất cả
            </a>
          </div>
          <div className="space-y-2.5">
            {[
              { name: "Quỹ đầu tư An Tín", rate: "7,2%", amount: "500M", best: true },
              { name: "Capital Partner V", rate: "7,5%", amount: "500M" },
              { name: "Mr. Nguyễn (Cá nhân)", rate: "7,8%", amount: "300M" },
            ].map((o) => (
              <div
                key={o.name}
                className={`flex items-center gap-3 rounded-xl border p-3 ${
                  o.best ? "border-emerald/40 bg-emerald/5" : "border-border bg-secondary/40"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold text-foreground">{o.name}</span>
                    {o.best && (
                      <span className="rounded-full bg-emerald/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald">
                        Tốt nhất
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Cố định 12 tháng đầu · Bảo đảm bằng BĐS
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary">{o.rate}</div>
                  <div className="text-[11px] text-muted-foreground">{o.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button className="rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground">
            So sánh đề xuất
          </button>
          <button className="rounded-xl border border-border bg-card py-2.5 text-xs font-semibold text-foreground">
            Chọn phương án phù hợp
          </button>
        </div>
      </div>

      <FloatingChip
        className="-left-3 top-10 md:-left-8"
        icon={<User className="h-3.5 w-3.5 text-primary" />}
        title="Người vay đăng hồ sơ"
        subtitle="HS-002389 mở phiên đấu giá"
      />
      <FloatingChip
        className="-right-3 -bottom-2 md:-right-6 md:bottom-6"
        icon={<Check className="h-3.5 w-3.5 text-emerald" />}
        title="14 đề xuất cạnh tranh"
        subtitle="Lãi suất từ 7,2%/năm"
      />
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-lg font-bold ${highlight ? "text-emerald" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}

function FloatingChip({
  className,
  icon,
  title,
  subtitle,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className={`absolute hidden md:flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 ${className ?? ""}`}
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary">{icon}</div>
      <div>
        <div className="text-xs font-semibold text-foreground">{title}</div>
        <div className="text-[10px] text-muted-foreground">{subtitle}</div>
      </div>
    </div>
  );
}
