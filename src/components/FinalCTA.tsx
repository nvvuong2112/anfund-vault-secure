import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "./ui/button";

export function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden py-16 text-primary-foreground md:py-24"
      style={{ background: "var(--gradient-navy)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-10 invert" />
      <img
        src="/brand/anfund-logo-dark.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-0 w-[26rem] max-w-[72vw] opacity-[0.12]"
      />
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="reveal relative">
          <div className="grid items-center gap-8 border-y border-white/15 py-10 md:py-14 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                AnFund · AnVốn
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Sẵn sàng đưa dòng vốn an tâm vươn khơi?
              </h2>
              <p className="mt-4 max-w-2xl text-base text-white/80 md:text-lg">
                AnFund giúp người cần vốn có thêm lựa chọn và giúp người có vốn tìm được cơ hội phù
                hợp hơn thông qua cơ chế đấu giá vốn hai chiều, minh bạch và có chọn lọc.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-2 lg:items-end">
              <Button
                asChild
                size="lg"
                className="h-12 w-full rounded-md bg-accent text-accent-foreground hover:bg-accent/90 lg:w-auto lg:px-7"
              >
                <a href="#signup">
                  Tham gia danh sách chờ
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-md border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white lg:w-auto lg:px-7"
              >
                <a href="/demo">
                  <PlayCircle className="h-4 w-4" />
                  Trải nghiệm demo
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
