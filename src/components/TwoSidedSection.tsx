import { ArrowRight, User, Banknote, Sparkles, Target } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

export function TwoSidedSection() {
  return (
    <section
      id="auction"
      className="relative overflow-hidden py-20 text-primary-foreground md:py-28"
      style={{ background: "var(--gradient-navy)" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-emerald/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="reveal inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Cơ chế hai chiều
          </div>
          <h2 className="reveal mt-5 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Đấu giá không chỉ dành cho người vay
          </h2>
          <p className="reveal mt-5 text-base text-white/80 md:text-lg">
            Trong mô hình truyền thống, người vay thường phải chủ động tìm nguồn vốn. Với AnFund,
            nếu người vay có hồ sơ tài chính tốt, chính hồ sơ đó sẽ trở thành một cơ hội hấp dẫn để
            nhiều bên cho vay cạnh tranh. Một thị trường hai chiều, nơi cả hai bên đều có động lực
            đưa ra lựa chọn tốt hơn.
          </p>
        </div>

        <div className="reveal mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
          <FlowCard
            icon={User}
            tone="gold"
            label="Hướng 1"
            title="Người vay tốt"
            arrowText="Thu hút nhiều đề xuất"
            outcome="Điều kiện vay cạnh tranh hơn"
            description="Hồ sơ minh bạch và chất lượng càng tốt, càng nhiều bên cho vay cạnh tranh để được chọn."
          />
          <FlowCard
            icon={Banknote}
            tone="emerald"
            label="Hướng 2"
            title="Người cho vay tốt"
            arrowText="Chọn hồ sơ phù hợp"
            outcome="Tối ưu cơ hội sử dụng vốn"
            description="Đề xuất cạnh tranh càng phù hợp, càng dễ được người vay chọn — vốn được phân bổ hiệu quả hơn."
          />
        </div>

        <div className="reveal mx-auto mt-10 flex max-w-3xl items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-sm text-white/85 backdrop-blur md:text-base">
          <Sparkles className="h-4 w-4 text-accent" />
          <span>
            Khoản vay tốt sẽ thu hút nhiều đề xuất tốt — nguồn vốn tốt sẽ tìm được người vay phù
            hợp.
          </span>
        </div>
      </div>
    </section>
  );
}

function FlowCard({
  icon: Icon,
  tone,
  label,
  title,
  arrowText,
  outcome,
  description,
}: {
  icon: React.ElementType;
  tone: "gold" | "emerald";
  label: string;
  title: string;
  arrowText: string;
  outcome: string;
  description: string;
}) {
  const accentText = tone === "gold" ? "text-accent" : "text-emerald";
  const accentBg = tone === "gold" ? "bg-accent/15" : "bg-emerald/15";

  return (
    <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur md:p-8">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
        {label}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accentBg}`}>
          <Icon className={`h-5 w-5 ${accentText}`} />
        </div>
        <div className="text-lg font-semibold md:text-xl">{title}</div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-white/80">
        <ArrowRight className={`h-4 w-4 ${accentText}`} />
        <span>{arrowText}</span>
      </div>

      <div className={`mt-2 flex items-center gap-2 rounded-xl ${accentBg} p-3`}>
        <Target className={`h-4 w-4 ${accentText}`} />
        <span className="text-sm font-semibold text-white">{outcome}</span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-white/70">{description}</p>
    </div>
  );
}
