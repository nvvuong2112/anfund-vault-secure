import { FilePlus2, Timer, ScanSearch, Send, GitCompareArrows, ScrollText } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const STEPS = [
  {
    icon: FilePlus2,
    title: "Tạo hồ sơ và đăng nhu cầu vay",
    desc: "Người vay tạo hồ sơ tài chính và đăng nhu cầu vay với số tiền, kỳ hạn, mục đích cụ thể.",
  },
  {
    icon: Timer,
    title: "Mở phiên đấu giá vốn",
    desc: "AnFund mở phiên đấu giá trong thời gian nhất định để các bên cho vay xem xét và đề xuất.",
  },
  {
    icon: ScanSearch,
    title: "Người cho vay xem và đánh giá",
    desc: "Người cho vay xem, lọc và đánh giá hồ sơ vay theo khẩu vị rủi ro và mục tiêu sử dụng vốn.",
  },
  {
    icon: Send,
    title: "Gửi đề xuất cạnh tranh",
    desc: "Người cho vay gửi đề xuất về lãi suất, kỳ hạn, số tiền tài trợ, điều kiện và yêu cầu bảo đảm.",
  },
  {
    icon: GitCompareArrows,
    title: "So sánh và chọn phương án",
    desc: "Người vay so sánh các đề xuất và chọn phương án tổng thể phù hợp nhất với mình.",
  },
  {
    icon: ScrollText,
    title: "Xác minh, ký kết, hoàn tất",
    desc: "Hai bên xác minh, ký kết và hoàn tất giao dịch theo quy định pháp luật hiện hành.",
  },
];

export function ProcessSection() {
  return (
    <section className="relative bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Quy trình hoạt động"
          title={
            <>
              Sáu bước để khoản vay tốt{" "}
              <span className="text-primary">gặp nguồn vốn cạnh tranh</span>
            </>
          }
          description="Từ lúc đăng hồ sơ đến khi khớp giao dịch, mọi bước đều được trình bày minh bạch cho cả người vay và người cho vay."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, idx) => (
            <StepCard key={s.title} index={idx + 1} step={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  index,
  step,
}: {
  index: number;
  step: { icon: React.ElementType; title: string; desc: string };
}) {
  const { icon: Icon, title, desc } = step;
  return (
    <div
      className="reveal group relative rounded-2xl border border-border bg-card p-6 md:p-7"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-3xl font-bold tracking-tight text-muted-foreground/40">
          {String(index).padStart(2, "0")}
        </div>
      </div>
      <h3 className="mt-5 text-base font-semibold text-foreground md:text-lg">
        Bước {index}: {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}
