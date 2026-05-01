import { ArrowRight, BadgeCheck, Compass, Gavel, ShieldCheck, Waves } from "lucide-react";
import { Button } from "./ui/button";
import { Logo } from "./Logo";

const PROOF_POINTS = [
  {
    icon: ShieldCheck,
    label: "Niềm tin có kiểm soát",
    value: "Xác minh trước khi mở phiên",
  },
  {
    icon: Waves,
    label: "Dòng vốn liền mạch",
    value: "Người vay và nguồn vốn gặp nhau",
  },
  {
    icon: Gavel,
    label: "Cạnh tranh minh bạch",
    value: "Đấu giá vốn hai chiều",
  },
];

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden pt-28 pb-12 md:pt-32 md:pb-20"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute inset-0 -z-20 bg-grid-soft opacity-50" />
      <img
        src="/brand/anfund-logo-icon.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-[-8rem] top-14 -z-10 hidden w-[45rem] max-w-none opacity-[0.11] lg:block"
      />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-background" />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="reveal mx-auto w-fit">
            <Logo variant="vertical" className="h-40 sm:h-48 md:h-56" />
          </div>

          <div className="reveal mt-2 inline-flex max-w-[calc(100vw-2rem)] items-center justify-center gap-2 rounded-md border border-primary/15 bg-white/75 px-3 py-1.5 text-center text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-primary backdrop-blur sm:tracking-[0.16em]">
            <Compass className="h-3.5 w-3.5 text-accent-foreground" />
            Rồng Việt dẫn vốn vươn khơi
          </div>

          <h1 className="reveal mt-6 text-5xl font-bold tracking-tight text-primary md:text-7xl lg:text-8xl">
            AnFund
          </h1>

          <p className="reveal mx-auto mt-4 max-w-[17rem] text-lg font-semibold leading-8 tracking-[0.03em] text-foreground md:max-w-none md:text-2xl md:tracking-[0.08em]">
            Kết nối dòng vốn, nâng tầm khát vọng.
          </p>

          <p className="reveal mx-auto mt-6 max-w-[17rem] text-base leading-8 text-muted-foreground md:max-w-2xl md:text-lg">
            Nền tảng đấu giá vốn hai chiều, nơi người vay, người cho vay, dữ liệu và niềm tin cùng
            vận hành trong một hệ sinh thái minh bạch, có kiểm soát và hướng đến phát triển bền
            vững.
          </p>

          <div className="reveal mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-md px-6 text-sm">
              <a href="/demo">
                Trải nghiệm demo
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-md border-primary/20 bg-white/70 px-6 text-sm hover:bg-primary/5"
            >
              <a href="#how-it-works">
                Xem cách dòng vốn vận hành
                <Waves className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="reveal mt-14 grid border-y border-primary/10 bg-white/55 backdrop-blur md:grid-cols-3">
          {PROOF_POINTS.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex min-h-28 items-center gap-4 border-primary/10 px-4 py-5 md:border-l md:first:border-l-0 md:px-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {label}
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground md:text-base">
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mx-auto mt-8 flex max-w-3xl items-center justify-center gap-2 text-center text-sm font-medium text-primary">
          <BadgeCheck className="h-4 w-4 text-emerald" />
          Một nét liền mạch - một dòng vốn thông suốt - một khát vọng vươn xa.
        </div>
      </div>
    </section>
  );
}
