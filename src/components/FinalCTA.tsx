import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "./ui/button";

export function FinalCTA() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div
          className="reveal relative overflow-hidden rounded-3xl border border-border p-8 md:p-14 text-primary-foreground"
          style={{ background: "var(--gradient-navy)" }}
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-emerald/20 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                AnFund · AnVốn
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Sẵn sàng thay đổi cách kết nối vốn?
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
                className="h-12 w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 lg:w-auto lg:px-7"
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
                className="h-12 w-full rounded-full border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white lg:w-auto lg:px-7"
              >
                <a href="#mockups">
                  <PlayCircle className="h-4 w-4" />
                  Xem demo sản phẩm
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
